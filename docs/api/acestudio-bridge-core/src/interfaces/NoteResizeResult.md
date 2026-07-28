# Interface: NoteResizeResult

Success payload of `note resize`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip the resized notes belong to, with braces.

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

Notes after the resize, in pattern order.

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

***

### resizedCount

```ts
resizedCount: number;
```

Number of notes resized.
