# Interface: InstrumentSetParams

Arguments for `instrument set`.

## Properties

### midiChannel

```ts
midiChannel: string;
```

**Required.** Which MIDI channel the instrument listens on: `1` through `16`.

Channels are numbered the way every MIDI device numbers them. The wire used to carry two different numberings for the same concept, one of them 0-based; the translation now lives in the handler where it belongs.

`all` is deliberately not accepted. A mounted instrument listens on one channel, and the slot has no every-channel state — so asking for it is an error rather than a value quietly stored as 1. The track's *input* (`track set-input --midi-channel`) does accept `all`.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format.
