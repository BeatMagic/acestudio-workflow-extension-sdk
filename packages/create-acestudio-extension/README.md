# @timedomain/create-acestudio-extension

The `npm create`-native scaffolder for ACE Studio workflow extensions. It emits a
working extension — TypeScript manifest, typed-channel hello-world UI, build scripts —
plus an `AGENTS.md` telling a code agent how to build, load, observe, and debug against
a running Studio. No running Studio required.

```sh
npm create @timedomain/acestudio-extension@latest my-extension
cd my-extension
npm install
npm run check     # typecheck + build
```

Everything not given on the command line is asked for, or derived from the directory
name when there is no terminal to ask in:

```
npm create @timedomain/acestudio-extension@latest -- [directory] [options]
npx create-acestudio-extension [directory] [options]

  --id <developer.extension>  the extension id, two lowercase slugs joined by a dot
  --name <text>               the name ACE Studio shows the user
  --publisher <text>          who publishes it, shown beside the name
  --description <text>        one line for the install dialog
  -y, --yes                   take the defaults; never prompt
```

(npm eats that first `--` and forwards the rest; it is only needed when you are
passing options.)

The scaffold refuses to write into a directory that already holds anything — a
scaffold is a whole tree, not a merge.

## What it emits

```
my-extension/
├── AGENTS.md          the build/load/observe/debug loop, written for a code agent
├── README.md          the same, for a human
├── build.mjs          bundles both halves into dist/ and emits dist/manifest.json
├── src/
│   ├── manifest.ts    identity, lifecycle, and the capability request
│   ├── protocol.ts    the one type the page and the process both import
│   └── index.ts       the process: defineExtension, handlers, bridge calls
└── ui/                the page: index.html and main.ts
```

`dist/` is the extension — the folder ACE Studio dev-loads and `aceworkflow` seals.

## Why a separate package and not an `aceworkflow` verb

Because that is how the ecosystem draws the line, and because npm gives no choice.

Scaffolding a new project from a template is the initializer's job; building and shipping
it is the CLI's. Raycast splits it exactly so (`npm init raycast-extension` to start, `ray
build` / `ray publish` to ship), as does VS Code (`yo code` versus `@vscode/vsce`), and
both Cloudflare and Expo *removed* the CLI verb they once had in favour of an initializer.
The CLI `init` verbs that persist elsewhere — `firebase init`, `supabase init` — almost
always mean "configure the directory I am already in," which is a different act.

The mechanical half: `npm create x` is an alias for `npm init x`, which resolves **by
package name**. `npm create @timedomain/acestudio-extension` executes
`@timedomain/create-acestudio-extension` and can execute nothing else — that entry point
cannot be served from a package named `@timedomain/aceworkflow`. Keeping this package is
what makes the command exist at all.

So you meet three commands, each at its own moment: `npm create …` once, to start;
`acestudio-cli workflow dev …` while you iterate against a running Studio; `aceworkflow`
to check and ship what you built.

## The template's license

The emitted scaffold is [MIT-0](./templates/default/LICENSE) — it belongs to whoever
runs the scaffolder, with no attribution required. This package itself is MIT, like the
rest of the repository.
