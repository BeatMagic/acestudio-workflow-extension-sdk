# Interface: SpecialTracksOperations

The `special-tracks` operations, mirroring the canonical operation tree 1:1.

## Methods

### get()

```ts
get(options?): Promise<SpecialTracksGetResult>;
```

Read visibility state for all special tracks (chord, tempo_and_timesig).

Requires the `ui.view` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`SpecialTracksGetResult`](SpecialTracksGetResult.md)\>

***

### hide()

```ts
hide(params, options?): Promise<void>;
```

Hide a named special track (chord or tempo_and_timesig).

Requires the `ui.view` capability.

#### Parameters

##### params

[`SpecialTracksHideParams`](SpecialTracksHideParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### show()

```ts
show(params, options?): Promise<void>;
```

Show a named special track (chord or tempo_and_timesig).

Requires the `ui.view` capability.

#### Parameters

##### params

[`SpecialTracksShowParams`](SpecialTracksShowParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
