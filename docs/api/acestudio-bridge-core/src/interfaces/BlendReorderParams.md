# Interface: BlendReorderParams

Arguments for `blend reorder`.

## Properties

### blend?

```ts
optional blend?: string;
```

Which blend, by display name or ref. A name matching more than one blend is an error listing the candidates. Give this or a track target, never both and never neither.

***

### member

```ts
member: number;
```

**Required.** Which seed to move, by 0-based position.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track carrying a voice mix, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would edit an unrelated track (ADR 0129 §2).

***

### to

```ts
to: number;
```

**Required.** Where to move it.

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
