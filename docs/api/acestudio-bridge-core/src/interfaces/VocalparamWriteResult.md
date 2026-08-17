# Interface: VocalparamWriteResult

Success payload of `vocalparam write`.

## Properties

### category

```ts
category: "pitch" | "energy" | "tension" | "air" | "falsetto" | "formant";
```

Which vocal characteristic a curve controls. Spellings follow the vocal-control UI's own face names: `pitch` is the melodic line as a delta in semitones, `energy` the loudness/effort curve, `tension` the vocal strain, `air` the breathiness, `falsetto` the head-voice mix, and `formant` the gender channel. Two of the UI's faces are deliberately absent, because neither is a curve: its "Breath" face places breath *marks* (the `breath` group) and its "Pronounce" face edits phoneme timing (the `lyric` group). Every category is addressable, but not every category exists on every clip: which ones do depends on the singer's engine generation, and `vocalparam layers` reports that as an availability matrix rather than by omitting a row.

***

### clearedCount?

```ts
optional clearedCount?: number;
```

How many of those values were gaps (`null` / NaN) and so returned the tick to undrawn rather than setting a value.

***

### clipUuid

```ts
clipUuid: string;
```

The clip written to.

***

### count

```ts
count: number;
```

Values written: the span covers ticks `posBegin` through `posBegin + count - 1`.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

The category's content token *after* the write — what to carry into the next guarded write without re-reading.

***

### layer

```ts
layer: "direct" | "baseline" | "user" | "envelope";
```

A layer `vocalparam write` may target: `ParamLayerName` minus `effective`. `effective` is the merged curve and is never writable (ADR 0085) — the merge rule is engine-owned, and a consumer that could write the merged result would be reimplementing it. Sharing one layer roster with the read side would make a write's schema advertise a value the host always refuses, which is a type that lies about what the operation accepts; so the write side declares its own roster and the value is refused at decode rather than by a handler branch. The roster is still not the availability: `vocalparam layers` marks which of these this clip's generation actually lets you write.

***

### posBegin

```ts
posBegin: number;
```

Clip-local tick the written span starts at.
