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
npm create @timedomain/acestudio-extension@latest [directory] -- [options]

  --id <developer.extension>  the extension id, two lowercase slugs joined by a dot
  --name <text>               the name ACE Studio shows the user
  --publisher <text>          who publishes it, shown beside the name
  --description <text>        one line for the install dialog
  -y, --yes                   take the defaults; never prompt
```

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

## Why this and not an `aceworkflow` verb

`aceworkflow` is the signing CLI; you reach for it at the end, to seal a bundle you
already have. Scaffolding is the other end of the same story, and `npm create` runs it
with nothing installed at all — which is the promise (ADR 0091 §9): the first build
succeeds before the developer has installed anything else. Putting a second front door
on the signing CLI would mean installing a signing tool to create a project, and two
surfaces to keep behaving identically for a command each developer runs once. The dev
*loop* verbs are a third thing again: they are Capability Core operations gated by
`workflow.dev`, so they live in ACE Studio's own CLI (ADR 0091 §3), not here.

## The template's license

The emitted scaffold is [MIT-0](./templates/default/LICENSE) — it belongs to whoever
runs the scaffolder, with no attribution required. This package itself is MIT, like the
rest of the repository.
