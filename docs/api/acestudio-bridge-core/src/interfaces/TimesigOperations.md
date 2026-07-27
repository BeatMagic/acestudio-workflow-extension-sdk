# Interface: TimesigOperations

The `timesig` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(options?): Promise<TimesigGetResult>;
```

Read the full time-signature list (all signature entries by bar position).

Requires the `timesig.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TimesigGetResult`](TimesigGetResult.md)\>

***

### set()

```ts
set(params, options?): Promise<void>;
```

Replace the entire time-signature list with a new set of entries.

Requires the `timesig.write` capability.

#### Parameters

##### params

[`TimesigSetParams`](TimesigSetParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
