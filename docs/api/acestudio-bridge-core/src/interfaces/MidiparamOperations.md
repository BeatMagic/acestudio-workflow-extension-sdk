# Interface: MidiparamOperations

The `midiparam` operations, mirroring the canonical operation tree 1:1.

## Methods

### clear()

```ts
clear(params, options?): Promise<MidiparamClearResult>;
```

Clear a lane back to no anchors, so its controller is not touched at all.

Requires the `midiparam.write` capability.

#### Parameters

##### params

[`MidiparamClearParams`](MidiparamClearParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`MidiparamClearResult`](MidiparamClearResult.md)\>

***

### listLanes()

```ts
listLanes(params, options?): Promise<MidiparamListLanesResult>;
```

List the lanes a MIDI clip has data in, with standard MIDI controller names, plus the per-note `velocity` row.

Requires the `midiparam.read` capability.

#### Parameters

##### params

[`MidiparamListLanesParams`](MidiparamListLanesParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`MidiparamListLanesResult`](MidiparamListLanesResult.md)\>

***

### read()

```ts
read(params, options?): Promise<MidiparamReadResult>;
```

Read a controller or pitch-bend lane's anchors in clip-local ticks and the lane's raw MIDI domain, with the fingerprint the lane's writes take as --if-match. An empty lane reports its controller's MIDI/GM default.

Requires the `midiparam.read` capability.

#### Parameters

##### params

[`MidiparamReadParams`](MidiparamReadParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`MidiparamReadResult`](MidiparamReadResult.md)\>

***

### removePoint()

```ts
removePoint(params, options?): Promise<MidiparamRemovePointResult>;
```

Remove the anchor at a position.

Requires the `midiparam.write` capability.

#### Parameters

##### params

[`MidiparamRemovePointParams`](MidiparamRemovePointParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`MidiparamRemovePointResult`](MidiparamRemovePointResult.md)\>

***

### setPoint()

```ts
setPoint(params, options?): Promise<MidiparamSetPointResult>;
```

Add or replace one anchor at a position (upsert). Leaves every other anchor untouched.

Requires the `midiparam.write` capability.

#### Parameters

##### params

[`MidiparamSetPointParams`](MidiparamSetPointParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`MidiparamSetPointResult`](MidiparamSetPointResult.md)\>

***

### setVelocity()

```ts
setVelocity(params, options?): Promise<MidiparamSetVelocityResult>;
```

Set named MIDI notes' velocity, addressed by note id.

Requires the `midiparam.write` capability.

#### Parameters

##### params

[`MidiparamSetVelocityParams`](MidiparamSetVelocityParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`MidiparamSetVelocityResult`](MidiparamSetVelocityResult.md)\>

***

### velocity()

```ts
velocity(params, options?): Promise<MidiparamVelocityResult>;
```

Read MIDI note velocities, by note id or for the whole clip, with the fingerprint `set-velocity` takes as --if-match.

Requires the `midiparam.read` capability.

#### Parameters

##### params

[`MidiparamVelocityParams`](MidiparamVelocityParams.md)

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`MidiparamVelocityResult`](MidiparamVelocityResult.md)\>

***

### write()

```ts
write(params, options?): Promise<MidiparamWriteResult>;
```

Write anchors into a lane. The anchors define the span they replace and the envelope outside it is untouched; two anchors are a ramp. With --replace lane, the whole lane is replaced instead.

Requires the `midiparam.write` capability.

#### Parameters

##### params

[`MidiparamWriteParams`](MidiparamWriteParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`MidiparamWriteResult`](MidiparamWriteResult.md)\>
