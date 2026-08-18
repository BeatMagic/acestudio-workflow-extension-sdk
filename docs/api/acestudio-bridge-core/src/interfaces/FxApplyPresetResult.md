# Interface: FxApplyPresetResult

Success payload of `fx apply-preset`.

## Properties

### insertId

```ts
insertId: string;
```

Instance id of the insert the preset was applied to.

***

### presetId?

```ts
optional presetId?: number;
```

Session-scoped id of the applied preset. Not stable across launches — address a preset by name.

***

### presetName

```ts
presetName: string;
```

Name of the applied preset.
