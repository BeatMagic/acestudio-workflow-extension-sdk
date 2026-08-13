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

Which MIDI input the track now records from. Note tracks only.

#### channel?

```ts
optional channel?: string;
```

Which channel it listens on: '1' through '16', or 'all'.

#### deviceName?

```ts
optional deviceName?: string;
```

The device name, when `sourceType` is 'custom'.

#### sourceType?

```ts
optional sourceType?: "keyboard" | "custom" | "none" | "all";
```

Where MIDI comes from.

***

### recordMode?

```ts
optional recordMode?: "monophonic" | "polyphonic";
```

How chords played onto a Sing track are captured. Sing tracks only.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track.
