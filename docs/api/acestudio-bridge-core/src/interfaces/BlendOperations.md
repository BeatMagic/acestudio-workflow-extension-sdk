# Interface: BlendOperations

The `blend` operations, mirroring the canonical operation tree 1:1.

## Methods

### add()

```ts
add(params, options?): Promise<BlendAddResult>;
```

Add a voice seed to a blend, or to a track's live mix.

Requires the `voice.write` capability.

#### Parameters

##### params

[`BlendAddParams`](BlendAddParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendAddResult`](BlendAddResult.md)\>

***

### create()

```ts
create(params, options?): Promise<BlendCreateResult>;
```

Create a blended voice on a chosen vocal synth model, ready for seeds.

Requires the `voice.write` capability.

#### Parameters

##### params

[`BlendCreateParams`](BlendCreateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendCreateResult`](BlendCreateResult.md)\>

***

### delete()

```ts
delete(params, options?): Promise<BlendDeleteResult>;
```

Delete a blended voice from your library.

Requires the `voice.write` capability.

#### Parameters

##### params

[`BlendDeleteParams`](BlendDeleteParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendDeleteResult`](BlendDeleteResult.md)\>

***

### get()

```ts
get(params?, options?): Promise<BlendGetResult>;
```

Read a recipe: its model, its seeds, and each seed's weights. Reads a track's live mix when given a track target instead of a blend.

Requires the `voice.read` capability.

#### Parameters

##### params?

[`BlendGetParams`](BlendGetParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`BlendGetResult`](BlendGetResult.md)\>

***

### list()

```ts
list(params?, options?): Promise<BlendListResult>;
```

List the blended voices in your library, with how full the library is.

Requires the `voice.read` capability.

#### Parameters

##### params?

[`BlendListParams`](BlendListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`BlendListResult`](BlendListResult.md)\>

***

### promote()

```ts
promote(params?, options?): Promise<BlendPromoteResult>;
```

Save the mix playing on a track into your blended-voice library.

Requires the `voice.write` capability.

#### Parameters

##### params?

[`BlendPromoteParams`](BlendPromoteParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendPromoteResult`](BlendPromoteResult.md)\>

***

### remove()

```ts
remove(params, options?): Promise<BlendRemoveResult>;
```

Remove one voice seed from a blend, or from a track's live mix.

Requires the `voice.write` capability.

#### Parameters

##### params

[`BlendRemoveParams`](BlendRemoveParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendRemoveResult`](BlendRemoveResult.md)\>

***

### reorder()

```ts
reorder(params, options?): Promise<BlendReorderResult>;
```

Move a voice seed to another position in a recipe.

Requires the `voice.write` capability.

#### Parameters

##### params

[`BlendReorderParams`](BlendReorderParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendReorderResult`](BlendReorderResult.md)\>

***

### set()

```ts
set(params?, options?): Promise<BlendSetResult>;
```

Change a voice's name, tags, avatar or language, or one seed's weights.

Requires the `voice.write` capability.

#### Parameters

##### params?

[`BlendSetParams`](BlendSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`BlendSetResult`](BlendSetResult.md)\>
