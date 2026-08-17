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

Which MIDI channel the external instrument listens on: `1` through `16`, or `all`. External instruments only.

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

The vocal synth model a mounted voice or choir sings through, as `sound-source get` reports it.

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
  formats?: string[];
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

The sound source mounted on a track, as `sound-source get` reports it. Same shape as `SoundSourceRow`, but every field is independently absent — unlike a listing row, a mounted source's `ref` can be unresolvable (a plain voice with no library id) and its `tags` are not read back at all.

#### category?

```ts
optional category?: string;
```

Category name. AI instruments only.

#### categoryId?

```ts
optional categoryId?: number;
```

Numeric category id. AI instruments only.

#### formats?

```ts
optional formats?: string[];
```

Every format this plugin was scanned in. External instruments only.

#### generations?

```ts
optional generations?: ("v1" | "v2")[];
```

Which model generations recommend a model for this voice.

#### group?

```ts
optional group?: string;
```

The raw group discriminator behind `origin`.

#### id?

```ts
optional id?: number;
```

Numeric library id.

#### isCollected?

```ts
optional isCollected?: boolean;
```

Whether a community voice is already in your library.

#### kind?

```ts
optional kind?: "voice" | "choir" | "instrument" | "ensemble" | "external-instrument";
```

What a sound source is — the roster every `kind` takes, whether it filters a listing or reports what a row turned out to be. A track carries exactly one kind at a time, and loading a source of another kind converts the track to suit it.

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

Name of that model. Voices only.

#### name?

```ts
optional name?: string;
```

Display name.

#### nativeLanguage?

```ts
optional nativeLanguage?: string;
```

Full English name of the language this source sings natively. Voices and choirs only.

#### origin?

```ts
optional origin?: "premade" | "cloned" | "community" | "blended";
```

Where a sound source comes from: the Voice Library's tabs, which is how a user thinks about it, and the project file's `group` discriminator spelled in words. An external instrument has none — it comes from the plugin scan, not from the account's library.

#### ref?

```ts
optional ref?: string;
```

Precise handle for this source. Absent when the mounted source has no library id to resolve one from.

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

Plugin vendor. External instruments only.

#### version?

```ts
optional version?: string;
```

Plugin version string. External instruments only.

***

### state?

```ts
optional state?: "ready" | "mounted" | "disabled" | "missing";
```

Runtime state of the sound source mounted on a track. Exactly one applies. `ready` is the only state a library source (voice, choir, AI instrument, ensemble) reports; the other three are external-instrument states. `missing` — the project names a plugin this machine cannot find — is distinct from an empty slot: the project still carries the reference and it will come back if the plugin is installed.

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

Track type: `Sing`, `Instrument`, `GenericMidi`, `Audio`, or `Empty`.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track, in braces format.
