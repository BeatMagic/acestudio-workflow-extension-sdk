# Interface: AudioPluginFindPresetsResult

Success payload of `audio-plugin find-presets`.

## Properties

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin that was read. Session-scoped.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.

***

### presets

```ts
presets: {
  factory: boolean;
  folder: string;
  name: string;
  path: string;
  pluginDefault: boolean;
  preset: string;
  updatedAtMs: number;
}[];
```

Every preset whose name contains it, with the path that addresses each.

#### factory

```ts
factory: boolean;
```

Whether this preset ships with the app. A bundled preset sits at the path the plugin bundles it at, the library root included, and this flag is what says it is read-only: `remove-preset` and `move-preset` refuse it, and no save lands on it. It also wins its path against a user file that reaches the same one.

#### folder

```ts
folder: string;
```

The folder it sits in — `preset` without its last segment. Empty at the root.

#### name

```ts
name: string;
```

The file's basename — the last segment of `preset`.

#### path

```ts
path: string;
```

Absolute path of the preset file, for a caller that has a disk of its own.

#### pluginDefault

```ts
pluginDefault: boolean;
```

Whether this is the plugin's default preset. Spelled `pluginDefault` rather than `default`, which is a keyword in the languages this surface generates into.

#### preset

```ts
preset: string;
```

The preset's path in the library, and the handle every preset verb takes: its folder path and its file's basename joined with `/` (`Vocals/Warm Verb`), or the bare basename at the root — where the presets bundled with the app sit.

#### updatedAtMs

```ts
updatedAtMs: number;
```

When the preset file was last modified, in milliseconds since the Unix epoch.

***

### query

```ts
query: string;
```

The text that was looked for.

***

### typeId?

```ts
optional typeId?: string;
```

Which plugin it is. The library is keyed by this, not by the instance.
