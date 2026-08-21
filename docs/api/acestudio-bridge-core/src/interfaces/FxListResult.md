# Interface: FxListResult

Success payload of `fx list`.

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
  enabled: boolean;
  format?: "native" | "vst3" | "vst2" | "au";
  hasEditor?: boolean;
  insertId: string;
  missing: boolean;
  name: string;
  presetName?: string;
  slot: number;
  typeId: string;
  vendor?: string;
}[];
```

The chain in signal order, slot 0 first.

#### bypassed

```ts
bypassed: boolean;
```

Whether the insert is bypassed. Bypass and enable are separate switches on this surface because they are separate in the mixer.

#### enabled

```ts
enabled: boolean;
```

Whether the insert is processing.

#### format?

```ts
optional format?: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in set; which of the others exist depends on the platform (no AU on Windows).

#### hasEditor?

```ts
optional hasEditor?: boolean;
```

Whether this insert answers `fx open-editor` — true only for a loaded third-party plugin.

#### insertId

```ts
insertId: string;
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

0-based position in the chain.

#### typeId

```ts
typeId: string;
```

Which effect this is, in the `fx list-available` namespace.

#### vendor?

```ts
optional vendor?: string;
```

Plugin vendor.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see the header.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement`, `video` or `marker`. Absent for the master alongside `trackIndex`, and present with it everywhere else (ADR 0129 §2). A chain hangs off every track type, video included, and a pinned band counts its own index space (ADR 0104) — so this is what stops a caller reading a video track's region-local index as an arrangement position and acting on an unrelated track.

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
