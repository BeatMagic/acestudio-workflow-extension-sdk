# Interface: ExportFcpxmlParams

Arguments for `export fcpxml`.

## Properties

### path

```ts
path: string;
```

Where to write. The extension picks the format: `.fcpxml` or `.aaf`. Any other extension is rejected -- there is no default to fall back to that would not silently write the wrong thing.
