# Interface: FxSetResult

Success payload of `fx set`.

## Properties

### insert

```ts
insert: {
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
};
```

One insert as every chain-shaped read and write reports it.

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

### insertCount

```ts
insertCount: number;
```

How many inserts the chain holds afterwards.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see the header.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index of the addressed track; absent for the master. Carried beside `trackUuid` because the index is the only track identity the UI shows a person — the uuid is the stable handle, this is the name a caller can put in front of a user.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the addressed track, or `master`.
