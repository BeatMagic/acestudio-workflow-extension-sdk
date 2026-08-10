# Interface: SoundSourceGetResult

Success payload of `sound-source get`.

## Properties

### choirEnabled?

```ts
optional choirEnabled?: boolean;
```

Whether choir mode is on. Sing tracks only; see `choir get` for the members.

***

### ensembleEnabled?

```ts
optional ensembleEnabled?: boolean;
```

Whether ensemble mode is on. Instrument tracks only; see `ensemble get` for the members.

***

### hasSource

```ts
hasSource: boolean;
```

Whether the track carries a sound source at all. A MIDI track with an external instrument mounted reports true.

***

### midiChannel?

```ts
optional midiChannel?: string;
```

Which MIDI channel the external instrument listens on: '1' through '16', or 'all'. External instruments only.

***

### model?

```ts
optional model?: {
  id?: number;
  name?: string;
  supportedLanguages?: string[];
  timbreOnly?: boolean;
};
```

The vocal synth model this source sings through. Voices and choirs only.

#### id?

```ts
optional id?: number;
```

Model id.

#### name?

```ts
optional name?: string;
```

Model name.

#### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Full English names of the languages this model can sing.

#### timbreOnly?

```ts
optional timbreOnly?: boolean;
```

True when the model carries no Style axis, so a blend on it has Timbre only.

***

### soundSource?

```ts
optional soundSource?: {
  category?: string;
  categoryId?: number;
  formats?: ("vst3" | "vst2" | "au")[];
  generations?: ("v1" | "v2")[];
  group?: string;
  id?: number;
  isCollected?: boolean;
  kind?: "voice" | "choir" | "instrument" | "ensemble" | "external-instrument";
  memberCount?: number;
  modelId?: number;
  modelName?: string;
  name?: string;
  nativeLanguage?: string;
  origin?: "premade" | "cloned" | "community" | "blended";
  ref?: string;
  seedCount?: number;
  supportedLanguages?: string[];
  tags?: string[];
  vendor?: string;
  version?: string;
};
```

The mounted source. Absent when `hasSource` is false.

#### category?

```ts
optional category?: string;
```

Category name, e.g. 'Piano'. AI instruments only.

#### categoryId?

```ts
optional categoryId?: number;
```

Numeric category id. AI instruments only.

#### formats?

```ts
optional formats?: ("vst3" | "vst2" | "au")[];
```

Every format this plugin was scanned in. One plugin in three formats is one row, not three. External instruments only.

#### generations?

```ts
optional generations?: ("v1" | "v2")[];
```

Which model generations recommend a model for this voice: 'v1', 'v2', or both. Generation is a per-voice curation published by the backend, not a property of a model, so it is reported per row and only on pre-made voices.

#### group?

```ts
optional group?: string;
```

The raw group discriminator behind `origin`: empty for pre-made, '#' for cloned, '@' for community, the blended-voice library id for a blend. Reported for continuity with the project file; prefer `ref`.

#### id?

```ts
optional id?: number;
```

Numeric library id. Ids repeat across origins, so this alone does not identify a source; `ref` does.

#### isCollected?

```ts
optional isCollected?: boolean;
```

Whether a community voice is already in your library. Community voices only; an uncollected voice must be collected before it will load.

#### kind?

```ts
optional kind?: "voice" | "choir" | "instrument" | "ensemble" | "external-instrument";
```

What this source is.

#### memberCount?

```ts
optional memberCount?: number;
```

How many members the source has. Choirs and ensembles only.

#### modelId?

```ts
optional modelId?: number;
```

Id of the vocal synth model this source defaults to. Voices only.

#### modelName?

```ts
optional modelName?: string;
```

Name of that model, as the track panel's Vocal Synth Model control shows it. Voices only.

#### name?

```ts
optional name?: string;
```

Display name, as the Voice Library shows it.

#### nativeLanguage?

```ts
optional nativeLanguage?: string;
```

Full English name of the language this source sings natively. Voices and choirs only.

#### origin?

```ts
optional origin?: "premade" | "cloned" | "community" | "blended";
```

Which library it comes from. Absent for external instruments, which come from the plugin scan rather than the account's library.

#### ref?

```ts
optional ref?: string;
```

Precise handle for this source, accepted by `--source` anywhere a name is. One of `singer:\<id\>` (pre-made), `singer:#\<id\>` (cloned), `singer:\@\<id\>` (community), `singer:\<library\>/\<id\>` (blend), `choir:\<group\>/\<id\>`, `instrument:\<id\>`, `ensemble:\<group\>/\<id\>`, or `plugin:\<format\>:\<typeId\>` (external instrument).

#### seedCount?

```ts
optional seedCount?: number;
```

How many voice seeds the recipe holds. Blended voices only.

#### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Full English names of every language this source can sing on its current model. Voices and choirs only.

#### tags?

```ts
optional tags?: string[];
```

Tag names attached to the source.

#### vendor?

```ts
optional vendor?: string;
```

Plugin vendor. External instruments only; this is what disambiguates two vendors shipping a plugin of the same name.

#### version?

```ts
optional version?: string;
```

Plugin version string as the plugin reports it. External instruments only.

***

### state?

```ts
optional state?: "ready" | "mounted" | "disabled" | "missing";
```

Runtime state of the mounted source. 'ready' for a library source; for an external instrument, 'mounted' when it is loaded and enabled, 'disabled' when mounted but bypassed, and 'missing' when the project names a plugin this machine cannot find. 'missing' is distinct from an empty slot: the project still carries the reference and it will come back if the plugin is installed.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track read.

***

### trackType

```ts
trackType: string;
```

Track type: 'Sing', 'Instrument', 'GenericMidi', 'Audio', or 'Empty'.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track, in braces format.
