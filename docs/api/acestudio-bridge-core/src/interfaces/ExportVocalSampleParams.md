# Interface: ExportVocalSampleParams

Arguments for `export vocal-sample`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

Which clips to write. At least one is required. Clips from several tracks are kept grouped by track in the file.

***

### path

```ts
path: string;
```

Where to write the `.clips` file.
