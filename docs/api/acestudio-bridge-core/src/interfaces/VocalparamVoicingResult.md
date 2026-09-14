# Interface: VocalparamVoicingResult

Success payload of `vocalparam voicing`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip read from.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content token for this clip's voicing mask (ADR 0088 §5). Carry it into `vocalparam set-voicing`'s reserved `fingerprint` argument to fail STALE_WRITE rather than overwrite an edit that landed in between.

***

### rangeBegin

```ts
rangeBegin: number;
```

First clip-local tick reported.

***

### rangeEnd

```ts
rangeEnd: number;
```

Clip-local tick reported up to, exclusive.

***

### spans

```ts
spans: {
  begin: number;
  end: number;
  mode: "voiced" | "unvoiced";
}[];
```

What is **stored**: the explicit overrides, clipped to the window, ascending and non-overlapping. Empty means nothing is pinned here, not that the singer is silent here.

#### begin

```ts
begin: number;
```

Inclusive.

#### end

```ts
end: number;
```

Exclusive.

#### mode

```ts
mode: "voiced" | "unvoiced";
```

What a *stored* span's mode can be: `VoicingMode` minus `auto`. A narrower roster than the one a write accepts, for the same reason `WritableLayerName` is narrower than `ParamLayerName`: a type that admits a value the host never produces lies about the operation, and here it would push an impossible branch onto every consumer. `auto` is the absence of an override, so an override can never carry it — and saying so in the declaration makes it a fact a generated binding can rely on rather than a sentence in a doc comment.

***

### support

```ts
support: {
  begin: number;
  end: number;
}[];
```

What a write would be **allowed** to pin: the clip-local ticks the pitch curve has support over, as half-open spans. `vocalparam set-voicing` refuses a span this does not reach, so this is where to look after a refusal rather than guessing.

#### begin

```ts
begin: number;
```

Inclusive.

#### end

```ts
end: number;
```

Exclusive.

***

### unvoiced

```ts
unvoiced: {
  begin: number;
  end: number;
}[];
```

What **results**: the clip-local tick ranges the singer produces no voiced sound in, derived voicing and stored overrides merged. The same field, computed the same way, as `vocalparam read`'s `unvoiced` — one spelling, so a consumer never has to reconcile two.

#### begin

```ts
begin: number;
```

#### end

```ts
end: number;
```
