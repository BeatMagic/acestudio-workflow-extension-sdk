# Interface: VocalparamReadParams

Arguments for `vocalparam read`.

## Properties

### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Parameter category to read: `pitch`, `energy`, `tension`, `air`, `falsetto`, or `formant`. See `vocalparam layers` for what this clip's singer generation supports.

***

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form, e.g. `\{6f1c...\}`).

***

### layer?

```ts
optional layer?: "direct" | "baseline" | "user" | "envelope" | "effective";
```

Return only this layer instead of every layer. `effective` is accepted here (unlike on a write) and returns the merged curve alone.

***

### rangeBegin?

```ts
optional rangeBegin?: number | null;
```

First clip-local tick to read. Defaults to the clip's visible start.

***

### rangeEnd?

```ts
optional rangeEnd?: number | null;
```

Clip-local tick to read up to, exclusive. Defaults to the clip's visible end.
