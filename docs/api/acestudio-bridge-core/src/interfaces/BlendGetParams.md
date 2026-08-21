# Interface: BlendGetParams

Arguments for `blend get`.

## Properties

### blend?

```ts
optional blend?: string;
```

Which blend, by display name or ref. A name matching more than one blend is an error listing the candidates. Give this or a track target, never both and never neither.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track carrying a voice mix, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would edit an unrelated track (ADR 0129 §2).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement, naming a track subject the terminal-ergonomic way.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. Names the live mix on that track as the subject instead of a library entry.
