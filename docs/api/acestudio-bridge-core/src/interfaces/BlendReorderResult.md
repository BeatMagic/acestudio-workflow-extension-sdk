# Interface: BlendReorderResult

Success payload of `blend reorder`.

## Properties

### avatar?

```ts
optional avatar?: number;
```

Avatar id, or -1 when the blend falls back to its first seed's avatar.

***

### group?

```ts
optional group?: string;
```

Group discriminator of the library this voice belongs to. Absent with `id`.

***

### id?

```ts
optional id?: number;
```

The blend's library id. Absent when the recipe is a track's live mix that names no library voice — a freshly adjusted stock singer has a recipe and no entry to point at yet.

***

### language?

```ts
optional language?: string;
```

Full English name of the blend's native language.

***

### modelId

```ts
modelId: number;
```

Id of the vocal synth model the blend sings through. Fixed when the blend was created.

***

### modelName

```ts
modelName: string;
```

Name of that model.

***

### name

```ts
name: string;
```

Display name. On a track this is the name the app itself shows, which for an unsaved mix is the underlying voice's rather than empty.

***

### ref?

```ts
optional ref?: string;
```

Ref for this blend, accepted by `--blend` here and by `sound-source load --source`. Absent with `id`. On a track this names the voice the mix was loaded from, which is a saved blend only once one has been saved — `saveState` is what says whether it still matches.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks carry a voice mix. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way (ADR 0129 §2). Absent with `trackIndex`.

***

### saveState?

```ts
optional saveState?: "unmixed" | "unsaved" | "saved" | "changed";
```

How far a track's voice mix has travelled from the stock voice it was mounted as. This is what Studio captions a Sing track with — the singer's own name, the literal "Unsaved VoiceMix", or a saved blend's name — and what tells a caller whether there is a recipe worth saving. Declared here rather than in one group because `sound-source get`, `choir get` and `track get` all describe the same track's mix. Three groups spelling one roster themselves is three rosters that can drift. There is no value for "the project could not say". A mix whose state is unreadable reports the field absent, the way a track with no position omits its index rather than sending a sentinel a caller would read as a position (ADR 0129 §6).

***

### seedCount

```ts
seedCount: number;
```

How many seeds the recipe holds. On a track this is never zero: every voice is a recipe of seeds, and an ordinary one is a recipe of exactly one — so a stock voice already names its seed, and `saveState` rather than this count is what says whether the recipe has been adjusted.

***

### seeds

```ts
seeds: {
  code: number;
  index: number;
  link: boolean;
  name?: string;
  style?: number;
  timbre: number;
}[];
```

The recipe, in order.

#### code

```ts
code: number;
```

The voice seed's code.

#### index

```ts
index: number;
```

0-based position in the recipe, which is what `blend set --member` and `blend remove --member` address.

#### link

```ts
link: boolean;
```

Whether Style follows Timbre for this seed. The UI shows this as the link between the two sliders.

#### name?

```ts
optional name?: string;
```

The seed's display name. Absent when the seed is no longer in the local registry, which can happen to a blend saved against a voice you no longer have.

#### style?

```ts
optional style?: number;
```

This seed's Style weight, 0 to 1. Absent on a timbre-only model, which has no Style axis at all.

#### timbre

```ts
timbre: number;
```

This seed's Timbre weight, 0 to 1. The UI calls this Timbre.

***

### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Every language this blend can sing, which is what its model and seeds allow between them.

***

### tags?

```ts
optional tags?: string[];
```

Tag names attached to the blend.

***

### timbreOnly?

```ts
optional timbreOnly?: boolean;
```

True when the model carries no Style axis. Seeds on such a blend report no `style`, and passing `--style` is an error rather than a value that quietly does nothing.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the track whose recipe this is. Present only for a track subject.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

UUID of that track, in braces format. Present only for a track subject.
