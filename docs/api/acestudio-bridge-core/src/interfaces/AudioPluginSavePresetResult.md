# Interface: AudioPluginSavePresetResult

Success payload of `audio-plugin save-preset`.

## Properties

### path

```ts
path: string;
```

Absolute path of the written `.acefxpreset` file.

***

### preset

```ts
preset: string;
```

The stored preset's path in the library, as the library spells it.

***

### replaced

```ts
replaced: boolean;
```

Whether a preset already at that path was overwritten.
