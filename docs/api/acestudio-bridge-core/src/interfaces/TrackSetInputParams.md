# Interface: TrackSetInputParams

Arguments for `track set-input`.

## Properties

### inputChannel?

```ts
optional inputChannel?: string | null;
```

Which audio input to record from, by device channel name, or `none` to record from nothing. Audio tracks only; `device list` reports the available channels.

***

### midiChannel?

```ts
optional midiChannel?: string | null;
```

Which MIDI channel to listen on: `1` through `16`, or `all`.

Numbered the way every MIDI device is numbered. The wire used to carry `-1 = all, 0-15` here and `1-16` for an instrument's output: one concept, two numberings, one of them contradicting the hardware. The translation now lives in the handler.

***

### midiDevice?

```ts
optional midiDevice?: string | null;
```

Which MIDI input to record from: a device name, or one of `all` (every device), `none`, or `keyboard` (the computer keyboard).

Naming a device is enough — there is no separate source-type flag to set, because naming a device is what choosing a custom source means.

***

### recordMode?

```ts
optional recordMode?: string | null;
```

How to capture a chord played onto a Sing track: `monophonic` trims the overlaps into one vocal part, `polyphonic` splits it into separate parts. Sing tracks only.

This lives on the input verb because the app puts both entries in the same mixer-strip MIDI input menu.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index.
