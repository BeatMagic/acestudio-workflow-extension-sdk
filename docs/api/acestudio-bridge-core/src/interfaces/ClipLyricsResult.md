# Interface: ClipLyricsResult

Success payload of `clip lyrics`.

## Properties

### filteredRange?

```ts
optional filteredRange?: {
  begin: number;
  end: number;
  scope: string;
};
```

Actual tick range used for filtering. Present only when rangeBegin and/or rangeEnd was supplied.

#### begin

```ts
begin: number;
```

Filter range start, in ticks, in the coordinate system named by scope.

#### end

```ts
end: number;
```

Filter range end (exclusive), in ticks, in the coordinate system named by scope.

#### scope

```ts
scope: string;
```

Coordinate system of begin/end: `project` or `clip-local`.

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
  lyric: string;
  sentenceBegin: number;
  sentenceEnd: number;
}[];
```

Lyric sentences overlapping the filter range.

#### lyric

```ts
lyric: string;
```

Merged lyric text for the sentence.

#### sentenceBegin

```ts
sentenceBegin: number;
```

Sentence start in clip-local ticks, regardless of rangeScope.

#### sentenceEnd

```ts
sentenceEnd: number;
```

Sentence end in clip-local ticks, regardless of rangeScope.
