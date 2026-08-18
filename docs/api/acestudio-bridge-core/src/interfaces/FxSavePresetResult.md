# Interface: FxSavePresetResult

Success payload of `fx save-preset`.

## Properties

### path

```ts
path: string;
```

Absolute path of the written `.acefxpreset` file.

***

### presetId?

```ts
optional presetId?: number;
```

Session-scoped id of the stored preset.

***

### presetName

```ts
presetName: string;
```

Name the preset was stored under.

***

### replaced

```ts
replaced: boolean;
```

Whether an existing preset of that name was overwritten.
