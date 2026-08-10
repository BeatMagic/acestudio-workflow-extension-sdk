# Interface: VoiceSynthModelsResult

Success payload of `voice synth-models`.

## Properties

### count

```ts
count: number;
```

How many models were returned.

***

### models

```ts
models: {
  id: number;
  name: string;
  supportedLanguages: string[];
  timbreOnly?: boolean;
  voiceCount: number;
}[];
```

Every vocal synth model the account can reach. Model names are published by the backend and supersede one another, so this roster is read at runtime and never compiled in.

#### id

```ts
id: number;
```

Model id.

#### name

```ts
name: string;
```

Model name, as the track panel's Vocal Synth Model control shows it.

#### supportedLanguages

```ts
supportedLanguages: string[];
```

Full English names of the languages this model can sing.

#### timbreOnly?

```ts
optional timbreOnly?: boolean;
```

True when the model carries no Style axis, so a blend on it has Timbre only.

#### voiceCount

```ts
voiceCount: number;
```

How many of your voices offer this model.
