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
