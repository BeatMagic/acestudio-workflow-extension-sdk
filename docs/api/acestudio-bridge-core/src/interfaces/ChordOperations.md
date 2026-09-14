# Interface: ChordOperations

The `chord` operations, mirroring the canonical operation tree 1:1.

## Methods

### delete()

```ts
delete(params, options?): Promise<ChordDeleteResult>;
```

Delete chords by id, pulling the rest earlier.

Requires the `chord.write` capability.

#### Parameters

##### params

[`ChordDeleteParams`](ChordDeleteParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`ChordDeleteResult`](ChordDeleteResult.md)\>

***

### insert()

```ts
insert(params, options?): Promise<ChordInsertResult>;
```

Insert a chord into a chord clip at an index, pushing the rest later.

Requires the `chord.write` capability.

#### Parameters

##### params

[`ChordInsertParams`](ChordInsertParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`ChordInsertResult`](ChordInsertResult.md)\>

***

### list()

```ts
list(params, options?): Promise<ChordListResult>;
```

List a chord clip's chords in playing order, with the ids a write addresses them by and the loop facts that follow from the clip's length.

Requires the `chord.read` capability.

#### Parameters

##### params

[`ChordListParams`](ChordListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`ChordListResult`](ChordListResult.md)\>

***

### set()

```ts
set(params, options?): Promise<ChordSetResult>;
```

Set root, type, added tones, bass, or duration on chords by id.

Requires the `chord.write` capability.

#### Parameters

##### params

[`ChordSetParams`](ChordSetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`ChordSetResult`](ChordSetResult.md)\>
