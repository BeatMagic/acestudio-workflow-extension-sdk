# Interface: PublicBindings

Every published operation, grouped by domain. A connection's client implements this; the runtime builds it from `OPERATIONS`.

## Properties

### caret

```ts
readonly caret: CaretOperations;
```

***

### clip

```ts
readonly clip: ClipOperations;
```

***

### convert

```ts
readonly convert: ConvertOperations;
```

***

### device

```ts
readonly device: DeviceOperations;
```

***

### editor

```ts
readonly editor: EditorOperations;
```

***

### job

```ts
readonly job: JobOperations;
```

***

### mixer

```ts
readonly mixer: MixerOperations;
```

***

### project

```ts
readonly project: ProjectOperations;
```

***

### selection

```ts
readonly selection: SelectionOperations;
```

***

### specialTracks

```ts
readonly specialTracks: SpecialTracksOperations;
```

***

### tempo

```ts
readonly tempo: TempoOperations;
```

***

### timesig

```ts
readonly timesig: TimesigOperations;
```

***

### track

```ts
readonly track: TrackOperations;
```

***

### transport

```ts
readonly transport: TransportOperations;
```

***

### voice

```ts
readonly voice: VoiceOperations;
```
