# Interface: FxImportChainParams

Arguments for `fx import-chain`.

## Properties

### at?

```ts
optional at?: number;
```

0-based slot to insert the chain's entries at, in order. Omit to append at the end of the chain. Refused beside `replace`.

***

### blob

```ts
blob: Uint8Array<ArrayBufferLike>;
```

Opaque bytes in the bulk envelope every bulk field on this surface travels in (`help curve-encoding`): `count` elements of `dtype`, base64 in `data`. A decoded byte length that disagrees with `count` is a hard reject, so a payload truncated in transit fails loudly instead of quietly applying a shorter state. Carried by the preset and FX-chain blob verbs — `audio-plugin export-preset` / `import-preset`, `get-state` / `set-state`, `fx export-chain` / `import-chain` — for the whole file, or the whole state, as one blob. What the bytes are is the operation's business and is said on each.

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

### replace?

```ts
optional replace?: boolean;
```

Replace the whole chain with the file's entries instead of adding them. Refused beside `at`.

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
