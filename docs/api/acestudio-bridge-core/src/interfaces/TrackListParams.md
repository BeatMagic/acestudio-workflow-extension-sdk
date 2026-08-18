# Interface: TrackListParams

Arguments for `track list`.

## Properties

### includeEmpty?

```ts
optional includeEmpty?: boolean;
```

Report a track that holds no clips even when its kind is one that is listed only while it has content. Defaults to false. Only the chord track is filtered this way, and the default mirrors what the user sees: every project carries a chord track, it stays hidden in the UI until someone opens it and writes a chord into it, and a caller enumerating tracks is asking what the project HAS rather than what it structurally always has. Ordinary tracks are reported whether or not they hold clips — a Sing track someone just created is a track, and its name and sound source are most of what a caller wants from the listing.

***

### type?

```ts
optional type?: string[];
```

Track kinds to list. Repeatable. Omit for the arrangement's content tracks, which is what this answers when nothing names a pinned region. The spellings are `track create`'s, plus `chord`, which names the chord track — one project fixture that `track create` therefore refuses.
