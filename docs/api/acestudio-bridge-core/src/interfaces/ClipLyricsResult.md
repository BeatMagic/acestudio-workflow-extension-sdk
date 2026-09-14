# Interface: ClipLyricsResult

Success payload of `clip lyrics`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip read, with braces — the `clipUuid` a sentence-indexed `lyric fill` takes.

***

### filteredRange?

```ts
optional filteredRange?: {
  begin: number;
  end: number;
  scope: string;
};
```

The actual tick range used for filtering `clip note-content` / `clip lyrics`. Present only when `rangeBegin` and/or `rangeEnd` was supplied.

#### begin

```ts
begin: number;
```

Filter range start, in ticks, in the coordinate system named by `scope`.

#### end

```ts
end: number;
```

Filter range end (exclusive), in ticks, in the coordinate system named by `scope`.

#### scope

```ts
scope: string;
```

Coordinate system of `begin`/`end`: `project` or `clip-local`.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the whole clip's note content (ADR 0088 §5) — lyrics are note content, read at sentence granularity. Carry it back as the `fingerprint` argument on a `note` write, `lyric fill`, or `clip replace-content` to fail STALE_WRITE instead of overwriting edits made since this read — including a fill addressed by `index`, whose sentence boundaries move only when note content does. Always covers the full clip, even when the read was range-filtered.

***

### sentenceCount

```ts
sentenceCount: number;
```

Number of sentences returned.

***

### sentences

```ts
sentences: {
  index: number;
  lyric: string;
  noteUuids: string[];
  sentenceBegin: number;
  sentenceEnd: number;
}[];
```

Lyric sentences overlapping the filter range.

#### index

```ts
index: number;
```

The sentence's index in the clip's shipped split. NOT this row's position in `sentences`: a range filter skips sentences without renumbering the ones it keeps.

#### lyric

```ts
lyric: string;
```

Merged lyric text for the sentence.

#### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the notes the sentence is made of, in clip order, with braces. Address them with the `note` writes, or hand them to `lyric fill` as its `noteUuids`.

#### sentenceBegin

```ts
sentenceBegin: number;
```

Sentence start in clip-local ticks, regardless of `rangeScope`.

#### sentenceEnd

```ts
sentenceEnd: number;
```

Sentence end in clip-local ticks, regardless of `rangeScope`.
