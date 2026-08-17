# Interface: TrackGetResult

Success payload of `track get`.

## Properties

### color

```ts
color: string;
```

Track color as a hex string, e.g. #ec4f44.

***

### defaultArticulation?

```ts
optional defaultArticulation?: string;
```

Default articulation for new notes. Instrument tracks only.

***

### defaultLanguage?

```ts
optional defaultLanguage?: string;
```

Default lyric language. Sing tracks only.

***

### mixer

```ts
mixer: {
  gain: number;
  mute: boolean;
  pan: number;
  solo: boolean;
};
```

Mixer settings, as `track get` reports them.

#### gain

```ts
gain: number;
```

Volume gain: 0.0 and above; 1.0 = unity.

#### mute

```ts
mute: boolean;
```

Whether the track is muted.

#### pan

```ts
pan: number;
```

Stereo pan: -1.0 (left) to 1.0 (right).

#### solo

```ts
solo: boolean;
```

Whether the track is soloed.

***

### rawName

```ts
rawName: string;
```

Name the user explicitly set; empty string when using the default fallback.

***

### recordInput

```ts
recordInput: {
  inputChannelIndex?: number;
  listen: boolean;
  midiInput?: {
     channel?: number;
     deviceName?: string;
     sourceType: "keyboard" | "custom" | "none" | "all";
  };
  record: boolean;
  recordMode?: "monophonic" | "polyphonic";
};
```

Record-input configuration, as `track get` reports it.

#### inputChannelIndex?

```ts
optional inputChannelIndex?: number;
```

Audio input channel: -1 = off, 0+ = specific channel. Audio tracks only.

#### listen

```ts
listen: boolean;
```

Whether input monitoring is enabled.

#### midiInput?

```ts
optional midiInput?: {
  channel?: number;
  deviceName?: string;
  sourceType: "keyboard" | "custom" | "none" | "all";
};
```

MIDI input source, as `track get` reports it. Note tracks only.

##### midiInput.channel?

```ts
optional channel?: number;
```

Custom MIDI channel: -1 = all, 0-15 = specific. Present only when `sourceType` is custom.

##### midiInput.deviceName?

```ts
optional deviceName?: string;
```

Custom MIDI device name. Present only when `sourceType` is custom.

##### midiInput.sourceType

```ts
sourceType: "keyboard" | "custom" | "none" | "all";
```

Where a note track's MIDI takes its input from. `custom` is the only value that carries a device: it means one named device, reported in the sibling `deviceName`. `all` listens to every connected device at once and `none` listens to nothing, so neither names one. `keyboard` is the computer keyboard playing notes, not a MIDI device at all. The values are the same vocabulary `track set-input`'s `midiDevice` takes, so a value read here can be handed straight back to a write.

#### record

```ts
record: boolean;
```

Whether the track is record-armed.

#### recordMode?

```ts
optional recordMode?: "monophonic" | "polyphonic";
```

How a chord played onto a Sing track is captured. Exactly one applies at a time: `monophonic` trims the overlaps into one vocal part, `polyphonic` splits the chord into separate parts.

***

### soundSourceInfo?

```ts
optional soundSourceInfo?: {
  category?: string;
  hasSource?: boolean;
  isVoiceBlend?: boolean;
  members?: {
     category?: string;
     gain: number;
     isVoiceBlend?: boolean;
     mute: boolean;
     name: string;
     nativeLanguage?: string;
     supportedLanguages?: string[];
  }[];
  metadata?: {
     memberCount?: number;
     offset?: number;
     spread?: number;
  };
  name?: string;
  nativeLanguage?: string;
  supportedLanguages?: string[];
  type?: string;
};
```

Sound-source detail for a track, as `track get` reports it. Note tracks only (omitted for Audio); shape varies with track type and choir/ensemble mode.

#### category?

```ts
optional category?: string;
```

Instrument category name. Instrument (non-ensemble) mode only.

#### hasSource?

```ts
optional hasSource?: boolean;
```

Whether the track carries a sound source. A GenericMidi track with an external instrument mounted reports true: the slot is a sound source in every sense that matters, and reporting it empty made a mounted plugin indistinguishable from no plugin at all. Other fields are absent when this is false. `sound-source get` reports the same thing in more detail.

#### isVoiceBlend?

```ts
optional isVoiceBlend?: boolean;
```

True when the singer is a voice blend rather than a vanilla singer. Singer mode only.

#### members?

```ts
optional members?: {
  category?: string;
  gain: number;
  isVoiceBlend?: boolean;
  mute: boolean;
  name: string;
  nativeLanguage?: string;
  supportedLanguages?: string[];
}[];
```

Per-member detail. Choir/ensemble modes only.

#### metadata?

```ts
optional metadata?: {
  memberCount?: number;
  offset?: number;
  spread?: number;
};
```

Group-level settings for a choir/ensemble track, as `track get` reports it.

##### metadata.memberCount?

```ts
optional memberCount?: number;
```

Number of members in the group.

##### metadata.offset?

```ts
optional offset?: number;
```

Timing offset setting for the group.

##### metadata.spread?

```ts
optional spread?: number;
```

Stereo spread setting for the group.

#### name?

```ts
optional name?: string;
```

Sound-source name. Non-choir/non-ensemble modes only.

#### nativeLanguage?

```ts
optional nativeLanguage?: string;
```

Singer's native language, when determinable. Singer mode only.

#### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Languages the singer supports. Singer mode only.

#### type?

```ts
optional type?: string;
```

One of: singer, choir, instrument, ensemble.

***

### trackName

```ts
trackName: string;
```

Current display name.

***

### trackType

```ts
trackType: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Unknown.
