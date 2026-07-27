# Interface: TrackSingerRecipeResult

Success payload of `track singer-recipe`.

## Properties

### isVoiceBlend

```ts
isVoiceBlend: boolean;
```

True when the singer is a voice blend rather than a vanilla singer.

***

### router

```ts
router: {
  id: number;
  isSingingMamba: boolean;
  isTimbreOnly: boolean;
  name: string;
  supportedLanguages: string[];
  version: number;
};
```

Synthesis model (router) the singer runs on.

#### id

```ts
id: number;
```

Router id.

#### isSingingMamba

```ts
isSingingMamba: boolean;
```

Whether this is a SingingMamba (version 2) model.

#### isTimbreOnly

```ts
isTimbreOnly: boolean;
```

Whether seeds blend on timbre only (same as isSingingMamba).

#### name

```ts
name: string;
```

Router name.

#### supportedLanguages

```ts
supportedLanguages: string[];
```

Languages the router supports.

#### version

```ts
version: number;
```

Router version; 2 = SingingMamba.

***

### saveState

```ts
saveState: string;
```

One of: unmixed (vanilla), saved, unsaved, changed, invalid.

***

### seedCount

```ts
seedCount: number;
```

Number of entries in seeds (convenience field).

***

### seeds

```ts
seeds: {
  code: number;
  labels: string[];
  lock: boolean;
  name: string;
  style?: number;
  timbre: number;
}[];
```

Seed composition of the blend.

#### code

```ts
code: number;
```

Seed code.

#### labels

```ts
labels: string[];
```

Seed labels; empty when metadata is unavailable.

#### lock

```ts
lock: boolean;
```

Whether the seed proportion is locked.

#### name

```ts
name: string;
```

Seed name; 'Unknown Seed' when metadata is unavailable.

#### style?

```ts
optional style?: number;
```

Style blend proportion. Non-SingingMamba (version 1) models only.

#### timbre

```ts
timbre: number;
```

Timbre blend proportion.

***

### singerName

```ts
singerName: string;
```

Display name of the singer.

***

### vocalControls?

```ts
optional vocalControls?: {
  defaultValue: number | null;
  name: string;
}[];
```

Available vocal controls. SingingMamba models only.

#### defaultValue

```ts
defaultValue: number | null;
```

Default value, or null when the control has none.

#### name

```ts
name: string;
```

Vocal control name.
