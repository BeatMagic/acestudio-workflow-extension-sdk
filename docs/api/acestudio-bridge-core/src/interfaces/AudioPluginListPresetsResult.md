# Interface: AudioPluginListPresetsResult

Success payload of `audio-plugin list-presets`.

## Properties

### folder

```ts
folder: string;
```

The folder that was listed, as the library spells it. Empty for the plugin's preset directory itself.

***

### folders

```ts
folders: {
  factory: boolean;
  folder: string;
  path?: string;
}[];
```

The folders directly in `folder` — or, with `recursive`, everywhere under it — empty ones included, sorted case-insensitively.

#### factory

```ts
factory: boolean;
```

Whether presets bundled with the app are filed in this folder. Such a folder is removed only once the user has a directory of their own at that path — the app's copy is not theirs to delete.

#### folder

```ts
folder: string;
```

The folder's `/`-separated path under the plugin's preset directory.

#### path?

```ts
optional path?: string;
```

Absolute path of the directory. Absent while only bundled presets are filed there and the user has no directory of that name: bundled presets ship inside the app.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin that was read. The instrument slot carries one like any insert — session-scoped, so store the `slot` keyword, not this.

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

The presets directly in `folder` — or, with `recursive`, everywhere under it — in the order the library lists them.

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

### typeId?

```ts
optional typeId?: string;
```

Which plugin it is. The library is keyed by this, not by the instance.
