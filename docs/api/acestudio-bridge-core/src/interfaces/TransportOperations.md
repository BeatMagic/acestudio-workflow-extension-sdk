# Interface: TransportOperations

The `transport` operations, mirroring the canonical operation tree 1:1.

## Methods

### loop()

```ts
loop(options?): Promise<TransportLoopResult>;
```

Read the project loop region (active flag + start/end ticks).

Requires the `transport.state` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TransportLoopResult`](TransportLoopResult.md)\>

***

### metronome()

```ts
metronome(params, options?): Promise<void>;
```

Enable or disable the metronome.

Requires the `transport.control` capability.

#### Parameters

##### params

[`TransportMetronomeParams`](TransportMetronomeParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### play()

```ts
play(options?): Promise<void>;
```

Begin playback. Sets the user's play intention.

Requires the `transport.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### seek()

```ts
seek(params, options?): Promise<void>;
```

Seek the playhead to a time position in seconds.

Requires the `transport.control` capability.

#### Parameters

##### params

[`TransportSeekParams`](TransportSeekParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### setLoop()

```ts
setLoop(params, options?): Promise<void>;
```

Update the project loop region.

Requires the `transport.control` capability.

#### Parameters

##### params

[`TransportSetLoopParams`](TransportSetLoopParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### state()

```ts
state(options?): Promise<TransportStateResult>;
```

Read the current transport state and playback head position.

Requires the `transport.state` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`TransportStateResult`](TransportStateResult.md)\>

***

### stop()

```ts
stop(options?): Promise<void>;
```

Stop (pause) playback. Clears the user's play intention.

Requires the `transport.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### toggle()

```ts
toggle(options?): Promise<void>;
```

Flip play/stop based on the current transport state.

Requires the `transport.control` capability.

#### Parameters

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
