# Interface: SoundSourceSetResult

Success payload of `sound-source set`.

## Properties

### modelId

```ts
modelId: number;
```

Id of the model the source now sings through.

***

### modelName

```ts
modelName: string;
```

Name of that model.

***

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

***

### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Languages the source can sing on the new model. A model change can narrow this, which is why it is reported back.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.
