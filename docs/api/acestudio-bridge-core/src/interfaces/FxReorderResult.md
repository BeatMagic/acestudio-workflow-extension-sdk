# Interface: FxReorderResult

Success payload of `fx reorder`.

## Properties

### insertCount

```ts
insertCount: number;
```

How many inserts the chain holds afterwards.

***

### insertId

```ts
insertId: string;
```

Instance id of the insert that was removed or moved.

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

Which index space `trackIndex` counts in: `arrangement`, `video` or `marker`. Absent for the master alongside `trackIndex`, and present with it everywhere else (ADR 0129 §2). A chain hangs off every track type, video included, and a pinned band counts its own index space (ADR 0104) — so this is what stops a caller reading a video track's region-local index as an arrangement position and acting on an unrelated track.

***

### slot

```ts
slot: number;
```

Its slot afterwards. For a removal, the slot it left.

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
