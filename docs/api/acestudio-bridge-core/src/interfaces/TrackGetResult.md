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

Mixer settings.

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
     sourceType: string;
  };
  record: boolean;
  recordMode?: string;
};
```

Record-input configuration.

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
  sourceType: string;
};
```

MIDI input source. Note tracks only.

##### midiInput.channel?

```ts
optional channel?: number;
```

Custom MIDI channel: -1 = all, 0-15 = specific. Present only when sourceType is custom.

##### midiInput.deviceName?

```ts
optional deviceName?: string;
```

Custom MIDI device name. Present only when sourceType is custom.

##### midiInput.sourceType

```ts
sourceType: string;
```

One of: none, all, computerKeyboard, custom.

#### record

```ts
record: boolean;
```

Whether the track is record-armed.

#### recordMode?

```ts
optional recordMode?: string;
```

MIDI record mode: monophonic or polyphonic. Sing tracks only.

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

Sound-source detail. Note tracks only (omitted for Audio); shape varies with track type and choir/ensemble mode.

#### category?

```ts
optional category?: string;
```

Instrument category name. Instrument (non-ensemble) mode only.

#### hasSource?

```ts
optional hasSource?: boolean;
```

False for GenericMidi tracks, which have no sound source. Other keys are absent when present.

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

Group-level settings. Choir/ensemble modes only.

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
