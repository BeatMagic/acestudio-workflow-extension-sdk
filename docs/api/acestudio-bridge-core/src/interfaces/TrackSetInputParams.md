# Interface: TrackSetInputParams

Arguments for `track set-input`.

## Properties

### inputChannel?

```ts
optional inputChannel?: string;
```

Which audio input to record from, by device channel name, or `none` to record from nothing. Audio tracks only.

***

### midiChannel?

```ts
optional midiChannel?: string;
```

Which MIDI channel to listen on: `1` through `16`, or `all`. Note tracks only.

***

### midiDevice?

```ts
optional midiDevice?: string;
```

Which MIDI input to record from: a device name, or one of `all` (every device), `none`, or `keyboard` (the computer keyboard). Naming a device is enough — there is no separate source-type field.

***

### recordMode?

```ts
optional recordMode?: string;
```

How to capture a chord played onto a Sing track: `monophonic` trims the overlaps into one vocal part, `polyphonic` splits it into separate parts. Sing tracks only.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index.
