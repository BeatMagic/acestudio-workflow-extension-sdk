# Interface: GenerativeAddLayerParams

Arguments for `generative add-layer`.

## Properties

### from

```ts
from: number;
```

Where the generated clip starts. Ticks (`3840t`), clock time (`1.5s`), or a musical position (`4.1.0`).

***

### instrument?

```ts
optional instrument?: string | null;
```

Which instrument to add ("nylon guitar", "upright bass"). **`--sound-type custom` only** -- naming an instrument is what that type is for, and every other type already names one.

***

### lyrics?

```ts
optional lyrics?: string | null;
```

Lyrics for a sung layer. **`song-track`, `vocals` and `backing-vocals` only** -- the three types that sing. Passing it elsewhere is an error rather than a silent no-op.

***

### prompt?

```ts
optional prompt?: string | null;
```

Style notes for the layer, on top of what the arrangement already implies. Accepted by every `--sound-type`.

***

### soundType?

```ts
optional soundType?: 
  | "instrumental"
  | "song-track"
  | "drums"
  | "bass"
  | "guitar"
  | "keyboard"
  | "percussion"
  | "strings"
  | "synth"
  | "fx"
  | "brass"
  | "woodwinds"
  | "vocals"
  | "backing-vocals"
  | "custom";
```

What kind of layer to add. Default `instrumental`. See [`LayerType`] for the full list and which content arguments each accepts.

***

### to

```ts
to: number;
```

Where the generated clip ends (exclusive). This is what fixes the generation's length.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id. Required: the panel takes it from the arrangement selection, which is not something a script can rely on (ADR 0087). Its content in the range is moved aside the same way the panel's own launch moves it, as one undo entry.
