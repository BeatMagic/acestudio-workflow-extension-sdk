# Interface: ExportLrcResult

Success payload of `export lrc`.

## Properties

### lineCount?

```ts
optional lineCount?: number;
```

How many timed lyric lines were written. Zero means the track had no lyrics in range — the file is still written, and still valid LRC.

***

### paths

```ts
paths: string[];
```

The written file, as a one-element list so the shape matches the other synchronous export verbs.

***

### trackName?

```ts
optional trackName?: string;
```

Display name of the Sing track the lyrics came from.
