# Interface: BlendPromoteParams

Arguments for `blend promote`.

## Properties

### avatar?

```ts
optional avatar?: number;
```

Avatar id for a new entry. Defaults to the mix's own, falling back to the first avatar the library offers when the mix never picked one.

***

### language?

```ts
optional language?: string;
```

Native language for the saved entry, as a full English name. Must be one the model and seeds allow. Defaults to the track's own singing language, which is what the app's dialog offers first.

***

### name?

```ts
optional name?: string;
```

Display name for a new library entry. Omit to update the entry the mix came from instead.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track carrying a voice mix, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would read an unrelated track (ADR 0129 §2).

***

### tags?

```ts
optional tags?: string[];
```

Tag names to attach to a new entry, for filtering in `sound-source list`. Ignored without `name`: updating an entry keeps the tags it has, which `blend set --tags` is how you change.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format.
