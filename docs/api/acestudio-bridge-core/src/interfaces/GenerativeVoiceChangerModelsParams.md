# Interface: GenerativeVoiceChangerModelsParams

Arguments for `generative voice-changer models`.

## Properties

### kind?

```ts
optional kind?: ("instrument" | "voice" | "cloned")[];
```

Only list models of these kinds. Omit for every kind. Repeatable, and a listing never hides rows: with no filter the answer is the whole roster `convert` accepts, all three pages together (ADR 0115 §7).
