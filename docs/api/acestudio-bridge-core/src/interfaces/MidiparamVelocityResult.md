# Interface: MidiparamVelocityResult

Success payload of `midiparam velocity`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip read from.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole clip's note velocities (ADR 0088 §5). Carry it back as the reserved `fingerprint` argument on `midiparam set-velocity` to fail STALE_WRITE instead of overwriting edits made since this read.

***

### noteCount

```ts
noteCount: number;
```

Number of entries in `notes` (convenience field).

***

### notes

```ts
notes: {
  noteUuid: string;
  pos: number;
  velocity: number;
}[];
```

One row per note, in ascending pos order.

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces — as `note get` and `clip note-content` report it, and what `set-velocity` addresses.

#### pos

```ts
pos: number;
```

The note's start, in clip-local ticks. Reported so a caller can pick notes musically without a second read.

#### velocity

```ts
velocity: number;
```

The note's velocity, 1-127.
