# {{extensionName}}

{{description}}

An ACE Studio workflow extension: a Node process holding a capability-scoped session
to the running app, plus a page ACE Studio shows in a window. Both halves are built
into `dist/`, which is the extension.

## Getting started

```sh
npm install
npm run check    # typecheck + build — works with no ACE Studio running
```

Then, with ACE Studio open and **Developer Mode** on (Settings → Developer Mode):

```sh
npm run load     # dev-load dist/
npm run logs     # follow this extension's logs
```

Those scripts drive `acestudio-cli`, which ships with ACE Studio — so unlike
`npm run check`, they need it installed and on your `PATH`. Run
`acestudio-cli workflow dev --help` if one of them is not recognised.

Edit, `npm run check`, `npm run reload`. There is no file watcher — you build, then
you reload, so a reload never catches half an edit.

## What is where

- `src/manifest.ts` — identity, lifecycle, and the capabilities this extension asks
  for. `ctx.client` is typed down to exactly that list.
- `src/protocol.ts` — the one type the page and the process both import. Everything
  they say to each other is declared here once.
- `src/index.ts` — the process.
- `ui/` — the page.
- `dist/` — generated, and deleted on every build. Do not edit it.

## Shipping

```sh
npm run package   # build, then pack + sign dist/, and verify the result
```

The developer slug in `src/manifest.ts` (`{{extensionId}}`) is yours to choose, and it
is what the signature binds to — settle on it before you publish.

## Working with a code agent

`AGENTS.md` is the full loop — build, load, observe, debug — written for a code agent
to follow without being primed. Point yours at it.

## License

This scaffold was emitted under [MIT-0](./LICENSE): it is yours, with no attribution
required. Replace `LICENSE` and `package.json`'s `license` field with whatever you ship
your own extension under.
