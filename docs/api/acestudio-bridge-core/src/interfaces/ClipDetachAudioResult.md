# Interface: ClipDetachAudioResult

Success payload of `clip detach-audio`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

The extracted audio clips placed on the new track.

***

### detachedClipUuids

```ts
detachedClipUuids: string[];
```

The video clips whose audio was detached.

***

### detachedCount

```ts
detachedCount: number;
```

How many video clips were detached.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Always `arrangement`: the extraction creates an audio track, and audio tracks live only there.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of the created track in `region`. The track is minted by this call, so its position is not something the caller could know (ADR 0129 §3). Absent together with `region` when the project cannot place the track, which is an inconsistency rather than anything a caller did.

***

### trackName

```ts
trackName: string;
```

Name of the created audio track.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the audio track the extraction created.
