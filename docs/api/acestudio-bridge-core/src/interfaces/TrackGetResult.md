# Interface: TrackGetResult

Success payload of `track get`.

## Properties

### clipCount?

```ts
optional clipCount?: number;
```

Number of clips (patterns) on the track. Omitted for the master bus and an empty slot, which hold no clips at all.

***

### color?

```ts
optional color?: string;
```

Track color as a hex string, e.g. #ec4f44. Omitted for an empty slot and for the master, neither of which has one.

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

### isProtected?

```ts
optional isProtected?: boolean;
```

Whether this marker track is system-owned and so protected from user delete and rename. **Marker tracks only** — omitted for every other type, which cannot be protected at all, rather than reported false.

***

### mixer?

```ts
optional mixer?: {
  gain: number;
  mute?: boolean;
  pan?: number;
  solo?: boolean;
};
```

Mixer settings, as `track get` reports them. Only `gain` is universal. The master bus carries a level and nothing else — `track set` refuses the other four on it — so the three it does not have are optional here rather than reported as neutral values it does not hold.

#### gain

```ts
gain: number;
```

Volume gain: 0.0 and above; 1.0 = unity. The one setting the master bus has.

#### mute?

```ts
optional mute?: boolean;
```

Whether the track is muted. Omitted for the master.

#### pan?

```ts
optional pan?: number;
```

Stereo pan: -1.0 (left) to 1.0 (right). Omitted for the master.

#### solo?

```ts
optional solo?: boolean;
```

Whether the track is soloed. Omitted for the master.

***

### protectedRole?

```ts
optional protectedRole?: string;
```

Which system role a protected marker track fills: `sections` or `lyrics`. Stable and locale-independent, unlike `trackName`. **Protected marker tracks only.**

***

### rawName?

```ts
optional rawName?: string;
```

Name the user explicitly set; empty string when using the default fallback. Omitted for an empty slot and for the master, neither of which can be renamed.

***

### recordInput?

```ts
optional recordInput?: {
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

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video`, `marker`, or `chord`. Travels with `trackIndex`, and omitted with it for the master.

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
     saveState?: "unmixed" | "unsaved" | "saved" | "changed";
     seedCount?: number;
     supportedLanguages?: string[];
  }[];
  metadata?: {
     memberCount?: number;
     offset?: number;
     spread?: number;
  };
  name?: string;
  nativeLanguage?: string;
  saveState?: "unmixed" | "unsaved" | "saved" | "changed";
  seedCount?: number;
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

True when the singer's voice has been adjusted away from the stock voice it started as. Singer mode only. Equivalent to `saveState` being anything but `unmixed`.

#### members?

```ts
optional members?: {
  category?: string;
  gain: number;
  isVoiceBlend?: boolean;
  mute: boolean;
  name: string;
  nativeLanguage?: string;
  saveState?: "unmixed" | "unsaved" | "saved" | "changed";
  seedCount?: number;
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

#### saveState?

```ts
optional saveState?: "unmixed" | "unsaved" | "saved" | "changed";
```

How far a track's voice mix has travelled from the stock voice it was mounted as. This is what Studio captions a Sing track with — the singer's own name, the literal "Unsaved VoiceMix", or a saved blend's name — and what tells a caller whether there is a recipe worth saving. Declared here rather than in one group because `sound-source get`, `choir get` and `track get` all describe the same track's mix. Three groups spelling one roster themselves is three rosters that can drift. There is no value for "the project could not say". A mix whose state is unreadable reports the field absent, the way a track with no position omits its index rather than sending a sentinel a caller would read as a position (ADR 0129 §6).

#### seedCount?

```ts
optional seedCount?: number;
```

How many seed voices the mix's recipe names. Singer mode only. An ordinary voice is a recipe of exactly one seed, so a stock singer reports `1`; `isVoiceBlend` is what says whether the recipe has been adjusted.

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

### soundSourceName?

```ts
optional soundSourceName?: string;
```

Sound-source name, as `track list` reports it: the source name for Sing and Instrument tracks, 'N-member choir'/'N-member ensemble' in choir/ensemble mode, empty for GenericMidi, which carries an external instrument instead. Omitted for the types that can have none. `soundSourceInfo` is the same thing in full; this is the one-line form, carried so this struct is a superset of the listing entry's.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position, in the index space of `region`. Omitted for the master bus, which has no position in any region.

***

### trackName?

```ts
optional trackName?: string;
```

Current display name. Omitted for the master bus, which carries no name of its own.

***

### trackType

```ts
trackType: string;
```

One of: Sing, Instrument, GenericMidi, Audio, Video, Marker, Chord, Empty (an arrangement slot holding no track), or Master.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master` for the master bus. The definitive handle: it works in every region, where an index needs `region` to be read. Omitted for an empty arrangement slot, which has none to hand out.
