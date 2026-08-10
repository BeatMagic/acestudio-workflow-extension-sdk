# Interface: ExportVocalSampleResult

Success payload of `export vocal-sample`.

## Properties

### clipCount?

```ts
optional clipCount?: number;
```

How many clips were written into the file.

***

### paths

```ts
paths: string[];
```

The written `.clips` file, as a one-element list so the shape matches the other synchronous export verbs.

***

### trackCount?

```ts
optional trackCount?: number;
```

How many distinct tracks those clips came from. A vocal sample keeps the clips' track grouping, so this is how many tracks the file will restore into.
