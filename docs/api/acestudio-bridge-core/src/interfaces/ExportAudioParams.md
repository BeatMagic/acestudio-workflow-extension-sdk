# Interface: ExportAudioParams

Arguments for `export audio`.

## Properties

### bitDepth?

```ts
optional bitDepth?: number;
```

Bit depth: 16 (default), 24 or 32. **WAV only** — an MP3's resolution is its bit rate, so passing this with `format: "mp3"` is an error.

***

### bitRate?

```ts
optional bitRate?: number;
```

Bit rate in kbps: 128, 192 (default), 256 or 320. **MP3 only**.

***

### channels?

```ts
optional channels?: number;
```

Channel count: 1 (mono) or 2 (stereo, default).

***

### format?

```ts
optional format?: "wav" | "mp3";
```

The container an `export audio` call writes. Omitted, it is taken from `path`'s extension.

***

### from?

```ts
optional from?: number;
```

Where the rendered range starts, in project ticks. Omit for the top of the project.

***

### path

```ts
path: string;
```

Where to write. For the per-track scopes this is the template the per-track names are built from: each track's name is appended to the base name, in the same directory, keeping the extension.

***

### sampleRate?

```ts
optional sampleRate?: number;
```

Sample rate in Hz: 32000, 44100 (default) or 48000.

***

### scope?

```ts
optional scope?: "master" | "selected-tracks" | "all-tracks" | "tracks";
```

What an `export audio` call renders. Omitted on the way in it falls back to `master`, the Export dialog's own default; the launch result reports the value it resolved to, so a caller can always see which one ran.

***

### to?

```ts
optional to?: number;
```

Where the rendered range ends (exclusive), in project ticks. Omit for the end of the project's content.

***

### trackUuids?

```ts
optional trackUuids?: string[];
```

Which tracks to render. **`scope: "tracks"` only**: the other scopes either have no per-track choice to make ("master", "all-tracks") or take it from the arrangement selection ("selected-tracks"). Passing it elsewhere is an error rather than a no-op.

***

### withoutEffects?

```ts
optional withoutEffects?: boolean;
```

Bypass every external FX plugin for the render — the dialog's "Export without effects". Off by default; the render carries the mix as heard.
