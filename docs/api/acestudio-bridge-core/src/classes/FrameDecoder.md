# Class: FrameDecoder

Incremental reader for the length-prefixed framing: feed it socket chunks,
take back whichever complete messages that made available.

## Constructors

### Constructor

```ts
new FrameDecoder(): FrameDecoder;
```

#### Returns

`FrameDecoder`

## Methods

### push()

```ts
push(chunk): string[];
```

Append a chunk and return the messages now complete, buffering any
partial tail.

#### Parameters

##### chunk

`Buffer`

#### Returns

`string`[]

#### Throws

Error when a declared frame exceeds the size cap.
