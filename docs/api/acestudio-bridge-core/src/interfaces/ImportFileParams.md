# Interface: ImportFileParams

Arguments for `import file`.

## Properties

### clipIn?

```ts
optional clipIn?: number | null;
```

Offset into the **source media** where the visible region starts — the head trim. Omit to start at the beginning of the file.

***

### dur?

```ts
optional dur?: number | null;
```

How much of the source to show. Omit for the file's own length (its remaining length, when `--clip-in` trims the head).

***

### muted?

```ts
optional muted?: boolean | null;
```

Place a video clip with its embedded audio silenced (the detached flag, ADR 0069). **Video only** — for every other clip type the corresponding dimension is enabled/disabled, so passing this on an audio import is an error rather than a no-op.

***

### onOccupied?

```ts
optional onOccupied?: string | null;
```

What to do when the target span is already occupied: `fail` (default), `cover` to trim the clips in the way (not video), or `relocate` to stack the clip on a new video track above (video only).

***

### path

```ts
path: string;
```

Path to the file to import. The extension decides what kind of clip it becomes; an unsupported extension is rejected with the list of supported ones.

***

### pos?

```ts
optional pos?: number | null;
```

Where the clip starts on the global timeline. Ticks (`3840t`), clock time (`1.5s`), or a musical position (`4.1.0`). Omit for tick 0.

***

### splitPolyphonic?

```ts
optional splitPolyphonic?: boolean | null;
```

Split polyphonic content into separate monophonic voices, one track each. **MIDI and MusicXML only** — the desktop app asks this in a dialog; here it is an argument, defaulting to off (one track per source track).

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

Target track index (0-based). Omit to auto-route: audio goes onto a new track after the existing content, video onto the project's video track (created if there is none). An `Empty` slot is converted in place.

***

### withTempo?

```ts
optional withTempo?: boolean | null;
```

Adopt the source file's tempo map, replacing the project's over the imported range. **Project kinds only**, and off by default: rewriting someone's tempo is not a side effect of "import these notes".

***

### withTimeSignatures?

```ts
optional withTimeSignatures?: boolean | null;
```

Adopt the source file's time signatures. **Project kinds only**, off by default, same reasoning as `--with-tempo`.
