# Interface: AudioPluginSlotsResult

Success payload of `audio-plugin slots`.

## Properties

### insertCount

```ts
insertCount: number;
```

Number of entries in `inserts`.

***

### inserts

```ts
inserts: {
  bypassed: boolean;
  editorState?: {
     open: boolean;
     parked: boolean;
  };
  enabled: boolean;
  format?: "native" | "vst3" | "vst2" | "au";
  hasEditor?: boolean;
  instanceId: string;
  missing: boolean;
  name: string;
  presetName?: string;
  slot: number;
  typeId: string;
  vendor?: string;
}[];
```

The chain in signal order, slot 0 first. Empty when `role` filtered the chain out (`instrument`), not only when the chain is empty.

#### bypassed

```ts
bypassed: boolean;
```

Whether the insert is bypassed. Bypass and enable are separate switches on this surface because they are separate in the mixer.

#### editorState?

```ts
optional editorState?: {
  open: boolean;
  parked: boolean;
};
```

Where a mount left one plugin's editor, as the mount verbs — `fx add`, `fx insert-chain`, `fx apply-chain` — report it per plugin they mounted (ADR 0152 §5). The pair is `audio-plugin editor info`'s `open` / `parked` with the same meanings, read at the moment the mount completes.

##### editorState.open

```ts
open: boolean;
```

True when the mount left the editor on screen: an external plugin's window coming up on the caret's chain, or a built-in's body expanded on the FX panel showing its chain. False for a missing or ghost plugin, which has nothing behind it to show.

##### editorState.parked

```ts
parked: boolean;
```

True when the mount left the editor PARKED: an external plugin whose track now remembers it open while the caret is on another track, so nothing is on screen for it and `audio-plugin editor open` is what shows it (ADR 0152 §2). Never true for a built-in's inline body — only a window parks.

#### enabled

```ts
enabled: boolean;
```

Whether the insert is processing.

#### format?

```ts
optional format?: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in effect set; which of the others exist depends on the platform (no AU on Windows). An external instrument is always one of the third-party formats.

#### hasEditor?

```ts
optional hasEditor?: boolean;
```

True for a loaded third-party plugin — not a built-in, not missing, not a ghost. The `fx` editor pair is not gated on this: a missing plugin reads false here and its window still opens, on the install page.

#### instanceId

```ts
instanceId: string;
```

Instance id addressing this entry. Session-scoped: the backend re-mints it on every re-insert, including project load.

#### missing

```ts
missing: boolean;
```

True when the project names a plugin this machine cannot load. The slot is kept so it survives until the plugin is installed; its parameters cannot be read or written.

#### name

```ts
name: string;
```

The name shown for this insert: the user's rename when it has one, otherwise the plugin's own display name.

#### presetName?

```ts
optional presetName?: string;
```

Name of the last-applied library preset, absent for none.

#### slot

```ts
slot: number;
```

0-based position in the chain. An integer, and deliberately so: the instrument slot is never numbered among these, so a caller walking positions can only ever name a chain insert (ADR 0144 §2).

#### typeId

```ts
typeId: string;
```

Which effect this is, in the `audio-plugin list-available` namespace.

#### vendor?

```ts
optional vendor?: string;
```

Plugin vendor.

***

### instrument?

```ts
optional instrument?: {
  enabled?: boolean;
  format?: "native" | "vst3" | "vst2" | "au";
  hasEditor?: boolean;
  midiChannel?: string;
  missing?: boolean;
  mounted: boolean;
  name?: string;
  slot: string;
  typeId?: string;
  vendor?: string;
};
```

The instrument slot's row in a `slots` listing: the one slot that is named rather than numbered. Deliberately not an `InsertEntry`, and deliberately without an `instanceId`: the slot is not in the chain, and its backend id is session-scoped, re-minted on every re-insert including project load — the reserved `slot` keyword is the address instead.

#### enabled?

```ts
optional enabled?: boolean;
```

Whether the instrument is processing. A disabled instrument stays mounted with its state intact. Absent when nothing is mounted.

#### format?

```ts
optional format?: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in effect set; which of the others exist depends on the platform (no AU on Windows). An external instrument is always one of the third-party formats.

#### hasEditor?

```ts
optional hasEditor?: boolean;
```

True while the mounted plugin is loaded, so false only while it is missing. The `instrument` editor pair is not gated on this — a missing plugin's window opens on the install page. Absent when nothing is mounted.

#### midiChannel?

```ts
optional midiChannel?: string;
```

Which MIDI channel the mounted instrument listens on: `1` through `16`, never `all`. Absent when nothing is mounted.

#### missing?

```ts
optional missing?: boolean;
```

True when the project names a plugin this machine cannot load. The slot keeps the reference so it survives until the plugin is installed. Absent when nothing is mounted.

#### mounted

```ts
mounted: boolean;
```

Whether anything is mounted. False is a real answer this listing exists to give: a MIDI track whose instrument slot is empty, which no chain listing has a row for and no sound-source read states as a slot fact.

#### name?

```ts
optional name?: string;
```

The name shown for the mounted instrument: the user's rename when it has one, otherwise the plugin's own display name. Absent when nothing is mounted.

#### slot

```ts
slot: string;
```

Always the reserved word `instrument` — the spelling the `slot` addressing argument accepts for this row, where an insert's row carries a number.

#### typeId?

```ts
optional typeId?: string;
```

Which plugin is mounted, in the `audio-plugin list-available` namespace. Absent when nothing is mounted.

#### vendor?

```ts
optional vendor?: string;
```

Plugin vendor. Absent when nothing is mounted or the scan reported none.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see `Fx.acerpc`.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video` or `marker`. Absent for the master alongside `trackIndex`, and present with it everywhere else. A chain hangs off every track type, video included, and a pinned band counts its own index space — so this is what stops a caller reading a video track's region-local index as an arrangement position and acting on an unrelated track.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the addressed track in `region`; absent for the master, which has a position in none.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the addressed track, or `master`.
