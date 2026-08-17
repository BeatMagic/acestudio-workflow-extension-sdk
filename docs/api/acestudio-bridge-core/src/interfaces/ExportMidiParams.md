# Interface: ExportMidiParams

Arguments for `export midi`.

## Properties

### format?

```ts
optional format?: "midi" | "ufdata";
```

The note-data format `export midi` writes. Omitted, it is taken from `path`'s extension (`.mid`/`.midi` → midi, `.ufdata` → ufdata). The two are not interchangeable: UfData carries a Sing track's lyrics and syllables and exports Sing tracks only, while MIDI carries neither and exports the instrument, generic-MIDI and chord tracks UfData skips.

***

### from?

```ts
optional from?: number;
```

Where the exported range starts, in project ticks. Omit for the top of the project.

***

### path

```ts
path: string;
```

Where to write. With `splitTracks` this is the template: each track's name is appended to the base name.

***

### splitTracks?

```ts
optional splitTracks?: boolean;
```

Write one file per track instead of one file holding every track. Off by default.

***

### to?

```ts
optional to?: number;
```

Where the exported range ends (exclusive), in project ticks. Omit for the end of the project's content.

***

### trackUuids?

```ts
optional trackUuids?: string[];
```

Which tracks to export. Omit for every track that carries notes the chosen format can represent.

***

### withLyrics?

```ts
optional withLyrics?: boolean;
```

Carry each note's lyric into the file. **UfData only.**

***

### withSyllables?

```ts
optional withSyllables?: boolean;
```

Carry each note's syllable breakdown into the file. **UfData only.**
