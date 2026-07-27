# Interface: MixerOperations

The `mixer` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(options?): Promise<MixerGetResult>;
```

Read the mixer panel visibility state (visible + animating flags).

Requires the `ui.view` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`MixerGetResult`](MixerGetResult.md)\>

***

### hide()

```ts
hide(options?): Promise<void>;
```

Hide the mixer panel.

Requires the `ui.view` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### show()

```ts
show(options?): Promise<void>;
```

Show the mixer panel.

Requires the `ui.view` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
