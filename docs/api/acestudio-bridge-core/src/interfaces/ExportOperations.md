# Interface: ExportOperations

The `export` operations, mirroring the canonical operation tree 1:1.

## Methods

### audio()

```ts
audio(params, options?): Promise<ExportAudioResult>;
```

Render audio to a file. Launches a job.

Requires the `export.invoke` capability.

#### Parameters

##### params

[`ExportAudioParams`](ExportAudioParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportAudioResult`](ExportAudioResult.md)\>

***

### fcpxml()

```ts
fcpxml(params, options?): Promise<ExportFcpxmlResult>;
```

Write the timeline out as FCPXML or AAF for an NLE.

Requires the `export.invoke` capability.

#### Parameters

##### params

[`ExportFcpxmlParams`](ExportFcpxmlParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportFcpxmlResult`](ExportFcpxmlResult.md)\>

***

### lrc()

```ts
lrc(params, options?): Promise<ExportLrcResult>;
```

Write a Sing track's lyrics out as a timed LRC file.

Requires the `export.invoke` capability.

#### Parameters

##### params

[`ExportLrcParams`](ExportLrcParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportLrcResult`](ExportLrcResult.md)\>

***

### midi()

```ts
midi(params, options?): Promise<ExportMidiResult>;
```

Write the project's notes out as MIDI or UfData.

Requires the `export.invoke` capability.

#### Parameters

##### params

[`ExportMidiParams`](ExportMidiParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportMidiResult`](ExportMidiResult.md)\>

***

### songTemplate()

```ts
songTemplate(params, options?): Promise<ExportSongTemplateResult>;
```

Export the project as a reusable song template (.acet).

Requires the `export.invoke` capability.

Pay-gated on `membership`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`ExportSongTemplateParams`](ExportSongTemplateParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportSongTemplateResult`](ExportSongTemplateResult.md)\>

***

### video()

```ts
video(params, options?): Promise<ExportVideoResult>;
```

Render the composition to a video file. Launches a job.

Requires the `export.invoke` capability.

#### Parameters

##### params

[`ExportVideoParams`](ExportVideoParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportVideoResult`](ExportVideoResult.md)\>

***

### vocalSample()

```ts
vocalSample(params, options?): Promise<ExportVocalSampleResult>;
```

Write named clips out as a Creative Library vocal sample.

Requires the `export.invoke` capability.

Pay-gated on `membership`: an account that does not satisfy it is refused, without a purchase prompt.

#### Parameters

##### params

[`ExportVocalSampleParams`](ExportVocalSampleParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<[`ExportVocalSampleResult`](ExportVocalSampleResult.md)\>
