# Interface: AudioPluginListAvailableResult

Success payload of `audio-plugin list-available`.

## Properties

### pluginCount

```ts
pluginCount: number;
```

Number of entries in `plugins`.

***

### plugins

```ts
plugins: {
  category?: string;
  format: "native" | "vst3" | "vst2" | "au";
  name: string;
  role: "effect" | "instrument";
  tags?: string[];
  typeId: string;
  vendor?: string;
  version?: string;
}[];
```

Every registry entry the filters kept, native effects first, then scanned third-party plugins.

#### category?

```ts
optional category?: string;
```

The plugin's first declared category, normalized onto the VST3 level-1 vocabulary: `Dynamics`, `Reverb`, `Synth` — one category, never the pipe-joined string a VST3 reports. A category outside the vocabulary is kept as the vendor declared it (`Tape Machine`), so the value may span several words. Absent when the plugin declares no category: a bare `Fx`, or any AudioUnit, whose words are roles.

#### format

```ts
format: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in effect set; which of the others exist depends on the platform (no AU on Windows). An external instrument is always one of the third-party formats.

#### name

```ts
name: string;
```

Display name of the plugin.

#### role

```ts
role: "effect" | "instrument";
```

What a plugin is hosted to do: process audio in a chain, or produce it in a MIDI track's instrument slot. The registry holds both; the `role` filters narrow a listing to one.

#### tags?

```ts
optional tags?: string[];
```

Every tag the plugin carries, flat: its categories as declared (`Dynamics - Multiband`), its vendor, role markers (`Fx`, `Instrument`, an AudioUnit's `Effect`), channel layouts (`Mono`, `Stereo`) and processing modes (`OnlyRT`). Absent when there are none.

#### typeId

```ts
typeId: string;
```

Stable identifier. For an effect, what `fx add` takes; for an instrument, what `sound-source load` mounts. Native effects use the `ace.native.\<name\>` namespace; a third-party plugin's is its format's own identifier string.

#### vendor?

```ts
optional vendor?: string;
```

Plugin vendor. `ACE Studio` for the built-in set.

#### version?

```ts
optional version?: string;
```

The plugin's own version string, when it declares one.

***

### scanning

```ts
scanning: boolean;
```

Whether a plugin scan is running right now. When true the list is what the registry holds so far, not a final answer.

***

### totalPluginCount

```ts
totalPluginCount: number;
```

How many plugins the registry holds for the requested role(s), before the other filters. Equal to `pluginCount` when nothing else was filtered; larger when it was, so a short list cannot be mistaken for a small registry.
