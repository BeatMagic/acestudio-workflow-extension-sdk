# Interface: ExportMidiResult

Success payload of `export midi`.

## Properties

### format?

```ts
optional format?: string;
```

The format actually written, after resolving --format or the path's extension.

***

### paths

```ts
paths: string[];
```

Every file written, in the order written. Usually one; `export midi --split-tracks` writes one per exported track, each with the track's name appended to the base name.

***

### trackCount?

```ts
optional trackCount?: number;
```

How many tracks contributed to the export. The tracks that reached the file, not every track that was considered -- `export midi` counts the ones carrying notes the format can represent, `export fcpxml` the ones carrying timeline content.
