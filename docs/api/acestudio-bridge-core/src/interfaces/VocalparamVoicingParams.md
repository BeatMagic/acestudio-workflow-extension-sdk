# Interface: VocalparamVoicingParams

Arguments for `vocalparam voicing`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form).

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

First clip-local tick to report. Defaults to the clip's visible start.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

Clip-local tick to report up to, exclusive. Defaults to the clip's visible end.
