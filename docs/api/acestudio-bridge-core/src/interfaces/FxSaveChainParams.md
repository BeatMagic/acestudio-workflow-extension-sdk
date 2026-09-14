# Interface: FxSaveChainParams

Arguments for `fx save-chain`.

## Properties

### overwrite?

```ts
optional overwrite?: boolean;
```

Replace the chain already at that path. Without it, the collision is refused rather than silently replacing someone's work.

***

### preset

```ts
preset: string;
```

Where the save lands: a path in the FX chain library — folder segments, then the file's basename — `Vocal/Warm Stack`, or a bare name for the directory's own root. Folders that do not exist yet are created. Each segment is sanitized for the filesystem, and the result reports the path that was actually written. A `.` or `..` segment is refused: a path is named here, never navigated to.

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
