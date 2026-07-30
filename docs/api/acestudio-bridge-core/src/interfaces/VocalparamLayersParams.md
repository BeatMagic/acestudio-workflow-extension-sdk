# Interface: VocalparamLayersParams

Arguments for `vocalparam layers`.

## Properties

### category?

```ts
optional category?: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Report only this category instead of the whole matrix. One of `pitch`, `energy`, `tension`, `air`, `falsetto`, `formant`.

***

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form, e.g. `\{6f1c...\}`).
