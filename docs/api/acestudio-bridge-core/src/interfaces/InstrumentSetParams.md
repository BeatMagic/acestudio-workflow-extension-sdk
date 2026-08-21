# Interface: InstrumentSetParams

Arguments for `instrument set`.

## Properties

### midiChannel

```ts
midiChannel: string;
```

Which MIDI channel the instrument should listen on: `1` through `16`. Channels are numbered the way every MIDI device numbers them. `all` is deliberately not accepted: a mounted instrument listens on one channel and the slot has no every-channel state, so asking for it is an error rather than a value quietly stored as 1. The track's *input* (`track set-input --midi-channel`) does accept `all`.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track this group operates on, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would act on an unrelated track (ADR 0129 §2).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.
