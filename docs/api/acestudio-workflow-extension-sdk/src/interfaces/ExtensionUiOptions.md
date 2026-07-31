# Interface: ExtensionUiOptions

The paved road, declared on `defineExtension`: point it at the built page and the
SDK serves it on loopback and announces the URL.

An extension that runs its own server declares nothing here and calls
[ExtensionUi.announceSurface](ExtensionUi.md#announcesurface) with its own URL instead.

## Properties

### assets

```ts
readonly assets: string;
```

The directory holding the built page — the folder with `index.html` in it.
Resolved against the process's working directory, which the manifest's `cwd`
decides and which defaults to the entry script's own directory.

***

### devServerUrl?

```ts
readonly optional devServerUrl?: string;
```

A dev server to announce instead of the built page — a Vite server, or whatever
else rebuilds the page while its author edits it.

**Honored only when ACE Studio spawned this extension dev-loaded** (ADR 0094 §11;
the option itself is ADR 0091 §4).
A packaged extension carrying this field is served from
[ExtensionUiOptions.assets](#assets) as if the field were not there, so one shipped
by accident cannot point a user's window at a server that is not running.

While it is honored, `assets` is not served at all: the dev server owns the page,
and a stale build answering alongside it is a confusing place for a request to
land. The channel and the served assets stay on the loopback server, and the
announced URL carries their origin — so `connectChannel()` in the page finds the
process with nothing to configure.
