# Interface: ExportVocalSampleParams

Arguments for `export vocal-sample`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

Which clips to write. Repeatable; at least one is required. Clips from several tracks are kept grouped by track in the file.

***

### path

```ts
path: string;
```

Where to write the `.clips` file.
