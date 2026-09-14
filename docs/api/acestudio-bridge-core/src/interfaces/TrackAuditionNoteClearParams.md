# Interface: TrackAuditionNoteClearParams

Arguments for `track audition note-clear`.

## Properties

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in; see AuditionNoteParams.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format. Mutually exclusive with `trackIndex`.
