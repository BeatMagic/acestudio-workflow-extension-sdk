# Interface: TransportOperations

The `transport` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

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

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

Transport moved: play, stop, a user seek, or the loop region. `changes`
carries `playing`, `position`, `loop`. Transitions only — the continuous
playback position is deliberately not a channel, because a re-fetch per frame
is what the coalescing cannot save; a throttled position feed is its own
mechanism. A peer re-fetches with `transport state`.

Listen for changes on the `transport` channel. The event is a hint to re-read, not the new state.

Requires the `transport.state` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

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

[`PreconditionCallOptions`](PreconditionCallOptions.md)

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
