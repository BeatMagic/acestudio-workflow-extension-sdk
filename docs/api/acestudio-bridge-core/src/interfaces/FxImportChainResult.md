# Interface: FxImportChainResult

Success payload of `fx import-chain`.

## Properties

### firstSlot

```ts
firstSlot: number;
```

Slot of the first imported entry.

***

### importedCount

```ts
importedCount: number;
```

How many entries the file carried and were inserted, ghosts included.

***

### insertCount

```ts
insertCount: number;
```

How many inserts the chain holds afterwards.

***

### missingCount

```ts
missingCount: number;
```

How many of them came in as ghosts — their plugin is not installed on this machine, so the slot holds the reference and its state and processes nothing. `fx list` reports them `missing`.

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
