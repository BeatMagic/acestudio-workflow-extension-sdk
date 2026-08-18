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

0-based index of the addressed track; absent for the master. Carried beside `trackUuid` because the index is the only track identity the UI shows a person — the uuid is the stable handle, this is the name a caller can put in front of a user.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the addressed track, or `master`.
