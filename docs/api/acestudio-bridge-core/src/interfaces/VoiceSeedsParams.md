# Interface: VoiceSeedsParams

Arguments for `voice seeds`.

## Properties

### community?

```ts
optional community?: boolean;
```

Include seeds from community voices you have collected. The app's "+" popup leaves these out, but that is a listing choice rather than a capability rule: starting from a community voice and blending onto it reaches the same state, so the surface allows them and says so.

***

### keyword?

```ts
optional keyword?: string;
```

Filter by name substring, case-insensitive.

***

### model?

```ts
optional model?: string;
```

Only list seeds a blend on this model can use, by model name or generation. Omit to list every seed you own.
