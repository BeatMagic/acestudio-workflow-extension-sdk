# Interface: VocalparamOperations

The `vocalparam` operations, mirroring the canonical operation tree 1:1.

## Methods

### layers()

```ts
layers(params, options?): Promise<VocalparamLayersResult>;
```

Report which parameter layers exist for a clip, per parameter.

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

Read a parameter's layers and its effective curve.

Requires the `vocalparam.read` capability.

#### Parameters

##### params

[`VocalparamReadParams`](VocalparamReadParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VocalparamReadResult`](VocalparamReadResult.md)\>

***

### setVoicing()

```ts
setVoicing(params, options?): Promise<VocalparamSetVoicingResult>;
```

Pin a voicing mode over a clip-local tick span, or erase what is pinned.

Requires the `vocalparam.write` capability.

#### Parameters

##### params

[`VocalparamSetVoicingParams`](VocalparamSetVoicingParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`VocalparamSetVoicingResult`](VocalparamSetVoicingResult.md)\>

***

### voicing()

```ts
voicing(params, options?): Promise<VocalparamVoicingResult>;
```

Report a clip's stored voicing overrides, where they may be written, and the unvoiced ranges that result.

Requires the `vocalparam.read` capability.

#### Parameters

##### params

[`VocalparamVoicingParams`](VocalparamVoicingParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`VocalparamVoicingResult`](VocalparamVoicingResult.md)\>

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
