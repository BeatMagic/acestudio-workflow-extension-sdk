# Interface: VocalparamLayersResult

Success payload of `vocalparam layers`.

## Properties

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

***

### paramCount

```ts
paramCount: number;
```

Number of entries in `params` (convenience field).

***

### params

```ts
params: {
  available: boolean;
  displayName: string;
  layers: {
     access: "read-only" | "read-write";
     layer: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
     role: string;
     shape: "dense" | "points" | "scalar";
     sparse: boolean;
  }[];
  param: string;
  scale?: string;
  unavailableReason?: string;
  valueRange?: {
     max?: number;
     min?: number;
  };
}[];
```

One row per parameter, in panel order: the vocal-control pill's lanes first, then the Advanced fold's parameters. A parameter this generation does not support is present with an empty `layers` list, so the matrix stays a full grid rather than a set a consumer has to diff.

#### available

```ts
available: boolean;
```

False when the parameter cannot be read or written on this clip — either the engine generation has no such parameter, or this surface does not carry it yet. `layers` is then empty and `unavailableReason` says why. True does not imply a writable layer, or any layer: `pitch` is available and reports an empty `layers`, because its effective curve is readable while its storage has no layer a write could name. Test `layers` for what can be written, never `available`.

#### displayName

```ts
displayName: string;
```

The parameter's display name, as the vocal-control panel shows it.

#### layers

```ts
layers: {
  access: "read-only" | "read-write";
  layer: "direct" | "baseline" | "user" | "envelope" | "global" | "effective";
  role: string;
  shape: "dense" | "points" | "scalar";
  sparse: boolean;
}[];
```

The layers this (generation x parameter) has, merge order first. Empty is a legal answer for an available parameter — see `available`. `effective` is not listed here: `vocalparam read` returns it beside the layers, on parameters where a merge exists (ADR 0155).

#### param

```ts
param: string;
```

The parameter's id in the flat roster: one this tree owns (`energy`, `tension`, `air`, `falsetto`, `formant`, `pitch`), `dynamic` for the merged Dynamic envelope, or a control name the backend publishes for this clip's singer.

#### scale?

```ts
optional scale?: string;
```

Which value space the numbers live in: `model` is SingingMamba's [0,1] model scale, `envelope` is Verse24's multiplier space, `semitones` is absolute pitch on MIDI numbering, and `control` is a vocal control's own range (see `valueRange`: [0, 1.25] for a lane, [-1, +1] for `dynamic`). Never conflate them (ADR 0073 §3).

#### unavailableReason?

```ts
optional unavailableReason?: string;
```

Present only when `available` is false: why the parameter cannot be used here, in one sentence.

#### valueRange?

```ts
optional valueRange?: {
  max?: number;
  min?: number;
};
```

Inclusive bounds of a legal value in a parameter's scale.

##### valueRange.max?

```ts
optional max?: number;
```

##### valueRange.min?

```ts
optional min?: number;
```

***

### vocalControlRoute

```ts
vocalControlRoute: "dynamic" | "legacy-four-params";
```

Which vocal-control UI the project uses, resolved once at load and immutable for the session. Reported so a consumer can read the roster against it; no Operation changes it — the UI cannot, so this surface must not (ADR 0087's parity premise), and a conversion is lossy in one direction.
