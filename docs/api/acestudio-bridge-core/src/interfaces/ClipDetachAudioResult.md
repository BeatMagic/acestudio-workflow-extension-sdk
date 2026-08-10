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
