# Interface: CanvasOperations

The `canvas` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

## Methods

### effectiveSize()

```ts
effectiveSize(options?): Promise<CanvasEffectiveSizeResult>;
```

Read the effective canvas raster the compositor is using right now.

Requires the `canvas.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`CanvasEffectiveSizeResult`](CanvasEffectiveSizeResult.md)\>

***

### info()

```ts
info(options?): Promise<CanvasInfoResult>;
```

Read the canvas setting: adaptive mode, frame rate, and the authored size.

Requires the `canvas.read` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`CanvasInfoResult`](CanvasInfoResult.md)\>

***

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

The canvas changed — the authored setting, or the effective raster the
compositor adopted after an adaptive re-derivation (ADR 0066). Which of the
two moved is not reported, because the host signal does not say: a peer
re-fetches with `canvas info`, `canvas effective-size`, or both.

Listen for `canvas.changed`. The event is a hint to re-read, not the new state.

Requires the `canvas.read` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
