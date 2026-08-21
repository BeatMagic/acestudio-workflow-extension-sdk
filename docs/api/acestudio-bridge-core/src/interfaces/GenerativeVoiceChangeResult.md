# Interface: GenerativeVoiceChangeResult

Success payload of `generative voice-change`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

***

### delivery

```ts
delivery: string;
```

Always "direct".

***

### jobClass

```ts
jobClass: string;
```

Always "voice-changer".

***

### jobId

```ts
jobId: string;
```

***

### modelIds

```ts
modelIds: number[];
```

The Voice Changer models being generated, in the order given. One job result per model, each settling on its own.

***

### trackUuids

```ts
trackUuids: string[];
```

The tracks created to receive each converted take, index-aligned with `modelIds`, as braced UUIDs.
