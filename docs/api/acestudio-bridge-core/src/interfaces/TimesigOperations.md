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

### list()

```ts
list(options?): Promise<TimesigListResult>;
```

List the time signatures with the tick each takes effect at, plus the fingerprint the entry writes take as --if-match.

Requires the `timesig.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TimesigListResult`](TimesigListResult.md)\>

***

### removeAt()

```ts
removeAt(params, options?): Promise<TimesigRemoveAtResult>;
```

Remove the time-signature entry at a bar. Bars after it fall back to the previous signature.

Requires the `timesig.write` capability.

#### Parameters

##### params

[`TimesigRemoveAtParams`](TimesigRemoveAtParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`TimesigRemoveAtResult`](TimesigRemoveAtResult.md)\>

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

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setAt()

```ts
setAt(params, options?): Promise<TimesigSetAtResult>;
```

Add or replace the time signature taking effect at a bar (upsert). Leaves every other entry untouched.

Requires the `timesig.write` capability.

#### Parameters

##### params

[`TimesigSetAtParams`](TimesigSetAtParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`TimesigSetAtResult`](TimesigSetAtResult.md)\>
