# Interface: ExportMidiParams

Arguments for `export midi`.

## Properties

### format?

```ts
optional format?: "midi" | "ufdata";
```

Which format to write. Omit to take it from `--path`'s extension.

***

### from?

```ts
optional from?: number | null;
```

Where the exported range starts. Omit for the top of the project.

***

### path

```ts
path: string;
```

Where to write. With `--split-tracks` this is the template: each track's name is appended to the base name.

***

### splitTracks?

```ts
optional splitTracks?: boolean | null;
```

Write one file per track instead of one file holding every track. Off by default.

***

### to?

```ts
optional to?: number | null;
```

Where the exported range ends (exclusive). Omit for the end of the project's content.

***

### trackUuids?

```ts
optional trackUuids?: string[] | null;
```

Which tracks to export. Repeatable. Omit for every track that carries notes the chosen format can represent.

`Option` so the schema says optional, matching "omit for every track" -- a bare `Vec` generates a required field.

***

### withLyrics?

```ts
optional withLyrics?: boolean | null;
```

Carry each note's lyric into the file. **UfData only.**

***

### withSyllables?

```ts
optional withSyllables?: boolean | null;
```

Carry each note's syllable breakdown into the file. **UfData only.**
