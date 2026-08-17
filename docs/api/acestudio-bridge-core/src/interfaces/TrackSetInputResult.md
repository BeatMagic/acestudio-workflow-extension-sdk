# Interface: TrackSetInputResult

Success payload of `track set-input`.

## Properties

### inputChannelName?

```ts
optional inputChannelName?: string;
```

Which audio input the track now records from, named as the device names it. Audio tracks only; absent when the track records from nothing.

***

### midiInput?

```ts
optional midiInput?: {
  channel?: string;
  deviceName?: string;
  sourceType?: "keyboard" | "custom" | "none" | "all";
};
```

Which MIDI input the track now records from, as `track set-input` reports it.

#### channel?

```ts
optional channel?: string;
```

Which channel it listens on: '1' through '16', or 'all'.

#### deviceName?

```ts
optional deviceName?: string;
```

The device name, when `sourceType` is custom.

#### sourceType?

```ts
optional sourceType?: "keyboard" | "custom" | "none" | "all";
```

Where a note track's MIDI takes its input from. `custom` is the only value that carries a device: it means one named device, reported in the sibling `deviceName`. `all` listens to every connected device at once and `none` listens to nothing, so neither names one. `keyboard` is the computer keyboard playing notes, not a MIDI device at all. The values are the same vocabulary `track set-input`'s `midiDevice` takes, so a value read here can be handed straight back to a write.

***

### recordMode?

```ts
optional recordMode?: "monophonic" | "polyphonic";
```

How a chord played onto a Sing track is captured. Exactly one applies at a time: `monophonic` trims the overlaps into one vocal part, `polyphonic` splits the chord into separate parts.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track.
