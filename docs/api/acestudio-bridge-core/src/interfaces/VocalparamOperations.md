# Interface: VocalparamOperations

The `vocalparam` operations, mirroring the canonical operation tree 1:1.

## Methods

### layers()

```ts
layers(params, options?): Promise<VocalparamLayersResult>;
```

Report which parameter layers exist for a clip, per category.

Requires the `vocalparam.read` capability.

#### Parameters

##### params

[`VocalparamLayersParams`](VocalparamLayersParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VocalparamLayersResult`](VocalparamLayersResult.md)\>

***

### read()

```ts
read(params, options?): Promise<VocalparamReadResult>;
```

Read a parameter category's layers and its effective curve.

Requires the `vocalparam.read` capability.

#### Parameters

##### params

[`VocalparamReadParams`](VocalparamReadParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VocalparamReadResult`](VocalparamReadResult.md)\>

***

### write()

```ts
write(params, options?): Promise<VocalparamWriteResult>;
```

Replace a named writable layer's points over a tick range.

Requires the `vocalparam.write` capability.

#### Parameters

##### params

[`VocalparamWriteParams`](VocalparamWriteParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`VocalparamWriteResult`](VocalparamWriteResult.md)\>
