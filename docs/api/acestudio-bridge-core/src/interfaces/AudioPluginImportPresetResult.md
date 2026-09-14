# Interface: AudioPluginImportPresetResult

Success payload of `audio-plugin import-preset`.

## Properties

### format

```ts
format: "ace" | "plugin-format";
```

The container a preset crosses the wire in. Both are files a person could also save from the app's preset menu; each is told from the other by its first bytes, which is what lets `import-preset` take either without being told. The bare state bytes inside either are not a container and are not on this list — `get-state` / `set-state` carry them.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin the preset was applied to.

***

### presetName?

```ts
optional presetName?: string;
```

The preset label the plugin shows now. Absent when the container carried none and `name` was not given.
