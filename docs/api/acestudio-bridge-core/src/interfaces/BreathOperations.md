# Interface: BreathOperations

The `breath` operations, mirroring the canonical operation tree 1:1.

## Methods

### list()

```ts
list(params, options?): Promise<BreathListResult>;
```

Report a Sing clip's breaths, with what the singer actually gets.

Requires the `vocalparam.read` capability.

#### Parameters

##### params

[`BreathListParams`](BreathListParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`BreathListResult`](BreathListResult.md)\>

***

### remove()

```ts
remove(params, options?): Promise<BreathRemoveResult>;
```

Take the breath off Sing notes, addressed by note id.

Requires the `vocalparam.write` capability.

#### Parameters

##### params

[`BreathRemoveParams`](BreathRemoveParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`BreathRemoveResult`](BreathRemoveResult.md)\>

***

### set()

```ts
set(params, options?): Promise<BreathSetResult>;
```

Place or resize a breath on Sing notes, addressed by note id.

Requires the `vocalparam.write` capability.

#### Parameters

##### params

[`BreathSetParams`](BreathSetParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`BreathSetResult`](BreathSetResult.md)\>
