# Interface: ExportAudioParams

Arguments for `export audio`.

## Properties

### bitDepth?

```ts
optional bitDepth?: number | null;
```

Bit depth: 16 (default), 24 or 32. **WAV only** -- an MP3's resolution is its bit rate, so passing this with `--format mp3` is an error.

***

### bitRate?

```ts
optional bitRate?: number | null;
```

Bit rate in kbps: 128, 192 (default), 256 or 320. **MP3 only**.

***

### channels?

```ts
optional channels?: number | null;
```

Channel count: 1 (mono) or 2 (stereo, default).

***

### format?

```ts
optional format?: "wav" | "mp3";
```

Container to write. Omit to take it from `--path`'s extension.

***

### from?

```ts
optional from?: number | null;
```

Where the rendered range starts. Ticks (`3840t`), clock time (`1.5s`), or a musical position (`4.1.0`). Omit to start at the top of the project.

***

### path

```ts
path: string;
```

Where to write. For the per-track scopes this is the template the per-track names are built from: each track's name is appended to the base name, in the same directory, keeping the extension.

***

### sampleRate?

```ts
optional sampleRate?: number | null;
```

Sample rate in Hz: 32000, 44100 (default) or 48000.

***

### scope?

```ts
optional scope?: "master" | "selected-tracks" | "all-tracks" | "tracks";
```

What to render: `master` (default) bounces the master bus to one file; `selected-tracks` and `all-tracks` mirror the Export dialog's other two choices, one file per track; `tracks` renders exactly the tracks named by `--track-uuid`.

***

### to?

```ts
optional to?: number | null;
```

Where the rendered range ends (exclusive). Omit to render to the end of the project's content -- which is what the dialog's "Total" range means.

***

### trackUuids?

```ts
optional trackUuids?: string[] | null;
```

Which tracks to render. Repeatable, and **`--scope tracks` only**: the other scopes either have no per-track choice to make (`master`, `all-tracks`) or take it from the arrangement selection (`selected-tracks`). Passing it elsewhere is an error rather than a no-op, since silently ignoring a track list would let a caller believe they had narrowed the render.

This is the scriptable counterpart to `selected-tracks`: naming ids gives the same files on every run, where a selection gives whatever the user last clicked (ADR 0087).

`Option` so the schema, and the SDK bindings generated from it, say optional -- a bare `Vec` is a required field, which would oblige every `master` caller to send an empty array for an argument that scope refuses. Contrast `export vocal-sample`'s `clipUuids`, a bare `Vec` because that command has no meaning without ids.

***

### withoutEffects?

```ts
optional withoutEffects?: boolean | null;
```

Bypass every external FX plugin for the render -- the dialog's "Export without effects". Off by default; the render carries the mix as you hear it.
