# Interface: VocalparamLayersResult

Success payload of `vocalparam layers`.

## Properties

### categories

```ts
categories: {
  available: boolean;
  category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
  layers: {
     access: "read-only" | "read-write";
     layer: "direct" | "baseline" | "user" | "envelope" | "effective";
     role: string;
     sparse: boolean;
  }[];
  scale?: string;
  unavailableReason?: string;
  valueRange?: {
     max?: number;
     min?: number;
  };
}[];
```

One row per parameter category, in canonical order. A category this generation does not support is present with an empty `layers` list, so the matrix stays a full grid rather than a set a consumer has to diff.

#### available

```ts
available: boolean;
```

False when the category cannot be read or written on this clip; `layers` is then empty and `unavailableReason` says why. Either the engine generation has no such parameter, or this surface does not carry it yet.

#### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Parameter category.

#### layers

```ts
layers: {
  access: "read-only" | "read-write";
  layer: "direct" | "baseline" | "user" | "envelope" | "effective";
  role: string;
  sparse: boolean;
}[];
```

The layers this (generation x category) has, merge order first. `effective` is not listed here: it exists for every available category and is what `vocalparam read` returns beside the layers.

#### scale?

```ts
optional scale?: string;
```

Which value space the numbers live in. `model` is SingingMamba's [0,1] model scale; `envelope` is Verse24's multiplier space; `semitones` is pitch delta. Never conflate them (ADR 0073 §3).

#### unavailableReason?

```ts
optional unavailableReason?: string;
```

Present only when `available` is false: why the category cannot be used here, in one sentence. Read this rather than inferring a cause from the generation.

#### valueRange?

```ts
optional valueRange?: {
  max?: number;
  min?: number;
};
```

Inclusive bounds of a legal value in this category's scale.

##### valueRange.max?

```ts
optional max?: number;
```

##### valueRange.min?

```ts
optional min?: number;
```

***

### categoryCount

```ts
categoryCount: number;
```

Number of entries in `categories` (convenience field).

***

### clipUuid

```ts
clipUuid: string;
```

The clip the matrix describes.

***

### engineGeneration

```ts
engineGeneration: string;
```

The clip's singer engine generation, which is half of what decides layer availability.
