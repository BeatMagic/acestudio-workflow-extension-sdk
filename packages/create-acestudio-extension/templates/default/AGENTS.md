# AGENTS.md — {{extensionName}}

An ACE Studio **workflow extension**: a Node process ACE Studio spawns, holding a
capability-scoped session to the running app, plus a page Studio shows in a window.
Both halves live in this repository and are built together into `dist/`.

This file is for you, the code agent. It is the whole loop — build, load, observe,
debug — and it is accurate for this scaffold as generated. Keep it accurate as you
change things.

## Layout

| Path              | What it is                                                           |
| ----------------- | -------------------------------------------------------------------- |
| `src/manifest.ts` | Identity, lifecycle, and the capability request. Emitted as JSON.     |
| `src/protocol.ts` | The one type the page and the process both import. Change it here.    |
| `src/index.ts`    | The process: `defineExtension`, the channel handlers, the bridge calls.|
| `ui/`             | The page — plain TypeScript and one HTML file.                        |
| `build.mjs`       | Builds all of it into `dist/`.                                        |
| `dist/`           | **Generated.** Never edit it; it is deleted on every build.           |
| `CLAUDE.md`       | One line importing this file, for Claude Code. Not a second document. |

`dist/` *is* the extension: `manifest.json` at its root, `index.js` beside it, the
page under `ui/`. That folder is what you dev-load, and what gets sealed and signed.

## The loop

```sh
npm run check    # typecheck + build. Needs no running ACE Studio.
npm run load     # dev-load dist/ into a running Studio (first time)
npm run reload   # after every rebuild (Studio does not watch files)
npm run logs     # follow this extension's log folder
```

**Always `npm run check` before `npm run reload`.** There is no file watcher on
purpose: a watcher racing a multi-file edit reloads half your change. You finish
editing, you build, you reload — deterministically, in that order.

## Build

`npm run build` does three things and fails loudly on any of them:

1. bundles `src/index.ts` → `dist/index.js` (Node — Studio runs it with nothing
   installed beside it, so everything must be in the file);
2. bundles `ui/` → `dist/ui/` for a browser (a Node import that leaks into the page's
   graph is a build error here, not a blank window later);
3. emits `dist/manifest.json` from `src/manifest.ts`, running ACE Studio's own
   manifest checks — an id, version, or path the host would refuse fails the build.

`npm run typecheck` alone is the fast gate while you are mid-edit.

## Load into a running ACE Studio

Dev-loading needs **Developer Mode** on: ACE Studio → Settings → Developer Mode. It is
off by default in every build and warns once when enabled. Without it the load verb is
refused, and that is the first thing to check when `npm run load` fails.

```sh
acestudio-cli workflow dev load ./dist              # = npm run load
acestudio-cli workflow dev reload {{extensionId}}   # = npm run reload
acestudio-cli workflow dev stop   {{extensionId}}
```

`acestudio-cli workflow dev --help` is the authority on exact spellings and flags —
these verbs ship with ACE Studio, not with this project. What is below is the loop.

- A dev load **auto-grants everything `src/manifest.ts` asks for** — no consent
  dialog to stall you. The granted set is printed on *every* load: read it. If it is
  wider than the extension needs, that is a manifest to trim, and you may well have
  written that manifest yourself.
- `reload` is a real process restart: shutdown, respawn from the folder, fresh
  `surfaceReady`. In-process state does not survive it.
- Nothing here touches signature verification. Unsigned is fine for the whole loop;
  signing is the last step before shipping.

If `acestudio-cli workflow dev --help` reports no such command, that Studio predates
the extension developer surface — build and sign instead (see *Ship*), and install the
result.

## Observe

Everything this extension emits lands in one plaintext folder, one per extension:

```
<ACE Studio log root>/extensions/{{extensionId}}/
```

`npm run logs` follows it without you having to find it. It holds:

- **Studio's capture of this process's stdout and stderr.** `console.log` in
  `src/index.ts` goes here — including output from a process that dies before any
  logger of yours initializes.
- **The webview's console**, for a dev-loaded extension: Studio injects a capture shim
  at document creation, so `console.*`, `window.onerror`, and unhandled rejections
  from `ui/` land here too, from the page's first instruction.
- **Load failures.** A blank window — dev server down, URL refused by the guard —
  writes the URL and the error code here. Check this before assuming your page is
  broken; often no page ever ran.

## Debug

**SDK-level logging.** Launch ACE Studio with `ACE_EXTENSION_SDK_DEBUG=1` in its
environment and the SDK logs its own operations — the lifecycle, each call and how it
ended, the channel, the URLs it serves and announces — to stderr, which the capture
above lands in the log folder. It logs nothing about *what* a call carried, and there
is no wire trace: the SDK is the abstraction you wrote against, so it reports at that
level. It is a separate switch from dev-loading, and works on an installed bundle too.

**The page, from outside.** Studio drives the webview directly, so these work even
when the extension's own process is wedged:

```sh
acestudio-cli workflow dev ui eval {{extensionId}} '<js>'   # read the DOM, poke at state
acestudio-cli workflow dev ui screenshot {{extensionId}}    # what the user would see
acestudio-cli workflow dev ui reload {{extensionId}}        # back to the announced URL
```

`eval` and `screenshot` are your eyes and hands on the page — use them instead of
guessing at what rendered. (DevTools and the macOS Web Inspector unlock for a
dev-loaded extension too, but those are for a human at the keyboard.)

**A Node debugger.** The load verb takes an inspect flag; Studio then spawns Node with
`--inspect` on loopback and reports the port. Liveness enforcement relaxes while an
extension is inspected, so a breakpoint does not get the process reaped.

## Changing things

**The page and the process talk to each other.** Change `src/protocol.ts` first, then
both sides. Adding a call means a `channel.handle(…)` in `src/index.ts` and a
`channel.call(…)` in `ui/`; the compiler tells you which half you forgot.

**Reaching further into ACE Studio.** `ctx.client` is narrowed to the capability list
in `src/manifest.ts` — a call the manifest does not ask for does not compile. So: add
the token to `capabilities`, rebuild, reload. Ask for what you use and nothing more;
the list is what a user will consent to at install, and it is printed at every dev load.

**Long work.** Operations that take real time return a job handle rather than blocking.
Report progress to the page with `channel.emit`; do not hold a channel call open for a
render and expect the page to sit there.

**Files.** A file the user picks in the page arrives over the channel as content and
needs no declaration. Only *programmatic* path access — watching a folder, writing
exports somewhere fixed — goes in the manifest's `hostAccess`.

## Ship

```sh
npm run package   # build, then pack + sign dist/ and self-verify the result
```

That produces a signed `.aceworkflow`. `--ad-hoc` in the script means it signs under an
anonymous developer identity, minted on first use and cached — enough to install and
test. The developer slug in `src/manifest.ts` is yours to choose and is what the
signature is bound to, so settle on it before you publish anything.

Sealing is the final check that the real install path works — not part of the loop.
Iterate dev-loaded.
