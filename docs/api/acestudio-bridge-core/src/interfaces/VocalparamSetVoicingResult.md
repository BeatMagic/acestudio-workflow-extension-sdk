# Interface: VocalparamSetVoicingResult

Success payload of `vocalparam set-voicing`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip written to.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

The clip's voicing token *after* the write — what to carry into the next guarded write without re-reading.

***

### mode

```ts
mode: "auto" | "voiced" | "unvoiced";
```

The three states a voicing override can be in (ADR 0153 §6). `auto` is the **absence** of an override rather than a third stored value: the singer's derived voicing stands there, and writing `auto` erases whatever was pinned instead of pinning something else. So `vocalparam voicing` never reports an `auto` span — a tick no span covers is `auto` — and the two spellings of "nothing here" cannot disagree.

***

### requested

```ts
requested: {
  begin: number;
  end: number;
};
```

A half-open clip-local tick span `[begin, end)` in **fractional** ticks. `f64` where the sibling `TickRange` is `i32`, because the voicing mask stores its bounds verbatim rather than using them to address a per-tick cell, and the gestures that write it land wherever the pointer was. Rounding a stored bound to an integer on the way out would report an edge the clip does not have, and feeding that back in would move it.

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

### spans

```ts
spans: {
  begin: number;
  end: number;
  mode: "voiced" | "unvoiced";
}[];
```

What stands over `requested` **after** the write — the whole answer to "what landed". A write is clipped to the pitch curve under it, so a span straddling the edge of a drawn region lands only over the drawn part, and this reports which part that was. Empty after an `auto` write, which pins nothing by definition.

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
