# Interface: ExportMidiResult

Success payload of `export midi`.

## Properties

### format?

```ts
optional format?: string;
```

The format actually written, after resolving `format` (midi only) or the path's extension.

***

### paths

```ts
paths: string[];
```

Every file written, in the order written. Usually one.

***

### trackCount?

```ts
optional trackCount?: number;
```

How many tracks contributed to the export — the tracks that reached the file, not every track that was considered.
