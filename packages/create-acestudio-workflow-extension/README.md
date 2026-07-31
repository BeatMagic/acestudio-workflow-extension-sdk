# @timedomain/create-acestudio-workflow-extension

The `npm create`-native scaffolder for ACE Studio workflow extensions. It emits a
working extension — TypeScript manifest, typed-channel hello-world UI, build scripts —
plus an `AGENTS.md` telling a code agent how to build, load, observe, and debug against
a running Studio. No running Studio required.

```sh
npm create @timedomain/acestudio-workflow-extension@latest my-extension
cd my-extension
npm install
npm run check     # typecheck + build
```

Everything not given on the command line is asked for, or derived from the directory
name when there is no terminal to ask in:

```
npm create @timedomain/acestudio-workflow-extension@latest -- [directory] [options]
npx create-acestudio-workflow-extension [directory] [options]

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
├── CLAUDE.md          one line importing AGENTS.md, the name Claude Code reads
├── README.md          the same, for a human
├── build.mjs          bundles both halves into dist/ and emits dist/manifest.json
├── src/
│   ├── manifest.ts    identity, lifecycle, and the capability request
│   ├── protocol.ts    the one type the page and the process both import
│   └── index.ts       the process: defineExtension, handlers, bridge calls
└── ui/                the page: index.html and main.ts
```

`dist/` is the extension — the folder ACE Studio dev-loads and `aceworkflow` seals.

## Why a separate package

Mostly because npm gives no choice. `npm create x` is an alias for `npm init x`, which
resolves **by package name**: `npm create @timedomain/acestudio-workflow-extension` executes
`@timedomain/create-acestudio-workflow-extension` and can execute nothing else. That entry point
cannot be served from a package named `@timedomain/aceworkflow`, so this package existing
is what makes the command exist at all.

Which side holds the code is a real choice, and it lives here so scaffolding stays
dependency-free — the CLI carries a native keychain binding with no business on the path of
writing a text tree. Platforms of a similar shape split it the same way: Raycast
(`npm init raycast-extension` to start, `ray build` / `ray publish` to ship) and VS Code
(`yo code` versus `@vscode/vsce`).

`aceworkflow init` is the same act under the name you already have installed — a direct call
into this package's `scaffold()`, not a shell-out. Use whichever you reach for first: this
one needs nothing installed, that one needs no second name to remember.

So you meet three commands, each at its own moment: `npm create …` (or `aceworkflow init`)
once, to start; `acestudio-cli workflow dev …` while you iterate against a running Studio;
`aceworkflow` to check and ship what you built.

## The template's license

The emitted scaffold is [MIT No Attribution](./TEMPLATE-LICENSE) — it belongs to whoever
runs the scaffolder, with no attribution required and no license file of ours left in
their tree to delete. Picking a license is theirs to do, once they know what they are
shipping. This package itself is MIT, like the rest of the repository.
