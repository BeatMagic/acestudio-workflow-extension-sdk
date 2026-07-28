# Interface: NoteMoveResult

Success payload of `note move`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip the moved notes belong to, with braces.

***

### movedCount

```ts
movedCount: number;
```

Number of notes moved.

***

### notes

```ts
notes: {
  dur: number;
  endPos: number;
  noteUuid: string;
  pitch: number;
  pos: number;
}[];
```

Notes after the move, in pattern order.

#### dur

```ts
dur: number;
```

Note duration in ticks.

#### endPos

```ts
endPos: number;
```

Note end in clip-local ticks (pos + dur).

#### noteUuid

```ts
noteUuid: string;
```

Stable note UUID, with braces.

#### pitch

```ts
pitch: number;
```

MIDI pitch number.

#### pos

```ts
pos: number;
```

Note start in clip-local ticks.
