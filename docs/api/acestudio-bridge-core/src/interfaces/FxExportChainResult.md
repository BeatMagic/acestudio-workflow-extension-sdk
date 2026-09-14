# Interface: FxExportChainResult

Success payload of `fx export-chain`.

## Properties

### blob

```ts
blob: Uint8Array<ArrayBufferLike>;
```

Opaque bytes in the bulk envelope every bulk field on this surface travels in (`help curve-encoding`): `count` elements of `dtype`, base64 in `data`. A decoded byte length that disagrees with `count` is a hard reject, so a payload truncated in transit fails loudly instead of quietly applying a shorter state. Carried by the preset and FX-chain blob verbs — `audio-plugin export-preset` / `import-preset`, `get-state` / `set-state`, `fx export-chain` / `import-chain` — for the whole file, or the whole state, as one blob. What the bytes are is the operation's business and is said on each.

***

### entryCount

```ts
entryCount: number;
```

How many inserts the file carries. A ghost — an insert whose plugin is not installed here — is left out, the way the FX panel's "Save as FX Chain" leaves it out: a chain file should not bake in a reference nothing can resolve.

***

### extension

```ts
extension: string;
```

The file extension the container is saved under, without the dot: `acefxchainpreset`.

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

Which index space `trackIndex` counts in: `arrangement`, `video` or `marker`. Absent for the master alongside `trackIndex`, and present with it everywhere else (ADR 0129 §2).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the addressed track in `region`; absent for the master. Carried beside `trackUuid` because the index is the only track identity the UI shows a person — the uuid is the stable handle, this is the name a caller can put in front of a user.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the addressed track, or `master`.
