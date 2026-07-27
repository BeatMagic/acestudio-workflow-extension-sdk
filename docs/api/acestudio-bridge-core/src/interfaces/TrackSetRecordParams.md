# Interface: TrackSetRecordParams

Arguments for `track set-record`.

## Properties

### inputChannelIndex?

```ts
optional inputChannelIndex?: number | null;
```

Audio input channel index: -1 = off, 0+ = specific channel. Audio tracks only.

***

### listen?

```ts
optional listen?: boolean | null;
```

Enable (true) or disable (false) input monitoring - hear the live input during recording.

***

### midiInputChannel?

```ts
optional midiInputChannel?: number | null;
```

Custom MIDI channel: -1 = all channels, 0-15 = specific channel. Required when `midi-input-source-type` is `custom`. Note tracks only.

***

### midiInputDeviceName?

```ts
optional midiInputDeviceName?: string | null;
```

Custom MIDI device name. Required when `midi-input-source-type` is `custom`. Note tracks only.

***

### midiInputSourceType?

```ts
optional midiInputSourceType?: string | null;
```

MIDI input source type. One of: `none`, `all`, `computerKeyboard`, `custom`. Note tracks (Sing/Instrument/GenericMidi) only.

***

### recordMode?

```ts
optional recordMode?: string | null;
```

MIDI record mode: `monophonic` or `polyphonic`. Sing tracks only.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index.
