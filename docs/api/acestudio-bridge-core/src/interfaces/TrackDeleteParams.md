# Interface: TrackDeleteParams

Arguments for `track delete`.

## Properties

### removeContents?

```ts
optional removeContents?: boolean;
```

Delete a track that still holds clips. Absent or false refuses a non-empty track with `TRACK_NOT_EMPTY`, so a caller can ask for the safe form; true deletes the track and its content as one undo step. Ignored when deleting the selection, which has always taken the content with it.

***

### trackUuids?

```ts
optional trackUuids?: string[];
```

Track UUIDs to delete, in braces format. Repeatable. Names tracks in the pinned video and marker bands (ADR 0104). An arrangement track is refused here and deleted through the selection instead: removing one has to re-seat the user's selected index, which is the selection path's job and not a peer's to reproduce. Omitted deletes the current selection.
