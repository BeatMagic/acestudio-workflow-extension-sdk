# Interface: SoundSourceTagsParams

Arguments for `sound-source tags`.

## Properties

### kind?

```ts
optional kind?: 
  | ("voice" | "choir" | "instrument" | "ensemble" | "external-instrument")[]
  | null;
```

Only return the filter vocabulary that applies to this kind. Repeatable. Omit for everything.
