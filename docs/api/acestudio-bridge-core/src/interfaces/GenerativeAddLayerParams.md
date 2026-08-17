# Interface: GenerativeAddLayerParams

Arguments for `generative add-layer`.

## Properties

### from

```ts
from: number;
```

Where the generated clip starts, in ticks.

***

### instrument?

```ts
optional instrument?: string;
```

Which instrument to add ("nylon guitar", "upright bass"). **`soundType` "custom" only**.

***

### lyrics?

```ts
optional lyrics?: string;
```

Lyrics for a sung layer. **"song-track", "vocals" and "backing-vocals" only**.

***

### prompt?

```ts
optional prompt?: string;
```

Style notes for the layer, on top of what the arrangement already implies. Accepted by every `soundType`.

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

What an Add-a-Layer call generates — the panel's own fifteen choices. Which of the three content parameters each accepts is fixed per type and mirrors `AddALayerTypeHelper::toConfig`, which is what greys the panel's fields in and out: - `prompt` (styles): every type. - `lyrics`: `song-track`, `vocals`, `backing-vocals` — the three that sing. - `instrument`: `custom` alone, which is what makes it custom. Passing one to a type that does not take it is an error rather than a silent drop, because the layer that came back would not be the layer that was asked for.

***

### to

```ts
to: number;
```

Where the generated clip ends (exclusive), in ticks.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id.
