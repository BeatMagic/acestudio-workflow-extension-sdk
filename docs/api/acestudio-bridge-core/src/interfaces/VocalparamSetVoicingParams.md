# Interface: VocalparamSetVoicingParams

Arguments for `vocalparam set-voicing`.

## Properties

### begin

```ts
begin: number;
```

First clip-local tick to write, inclusive. Fractional ticks are kept.

***

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form).

***

### end

```ts
end: number;
```

Clip-local tick to write up to, exclusive. Must exceed `begin`: a span of zero width pins nothing, and accepting it silently would report a write that did not happen.

***

### mode

```ts
mode: "auto" | "voiced" | "unvoiced";
```

The three states a voicing override can be in (ADR 0153 §6). `auto` is the **absence** of an override rather than a third stored value: the singer's derived voicing stands there, and writing `auto` erases whatever was pinned instead of pinning something else. So `vocalparam voicing` never reports an `auto` span — a tick no span covers is `auto` — and the two spellings of "nothing here" cannot disagree.
