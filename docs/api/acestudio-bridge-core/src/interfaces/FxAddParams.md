# Interface: FxAddParams

Arguments for `fx add`.

## Properties

### at?

```ts
optional at?: number;
```

0-based slot to insert at. Omit to append at the end of the chain.

***

### preset?

```ts
optional preset?: string;
```

Apply this library preset to the new insert instead of leaving it at the plugin's defaults. Matched by name against that plugin's presets.

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

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. The regions are isolated index spaces (ADR 0104), so an index read against the wrong one names an unrelated track (ADR 0129 §1). Ignored beside `trackUuid`, which needs no region.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master` for the master bus. The definitive handle: it works in every region, where an index needs `region` to be read.

***

### type

```ts
type: string;
```

Which effect to insert, as a `typeId` from `fx list-available`.
