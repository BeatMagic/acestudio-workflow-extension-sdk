# Interface: VoiceSynthModelsParams

Arguments for `voice synth-models`.

## Properties

### language?

```ts
optional language?: string;
```

Only list models that can sing this language, as a full English name. This one *is* supported-language: a model's language roster is a fact about the model. Contrast `voice list --language` and `voice community --language`, which match a voice's native language.
