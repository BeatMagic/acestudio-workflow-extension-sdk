# Interface: TrackListParams

Arguments for `track list`.

## Properties

### includeEmpty?

```ts
optional includeEmpty?: boolean;
```

Report empty tracks. Defaults to false. Two things are empty in this sense, and one flag covers both because a caller asking for the complete picture wants the whole of it: - **Empty arrangement slots** — the padding the arrangement maintains around its content tracks. One occupies an index, so a caller that reads a listing and then addresses index 4 can learn that index 4 is padding rather than guess. Reported with `trackType: "Empty"` and no `trackUuid`, because an empty slot has none to hand out. Every slot the arrangement holds is reported, which is the same range `track get` addresses once it accepts an empty target — so every index this answers with is one that verb answers for. Expect a nearly empty project to report most of a hundred of them. - **The contentless chord track** — every project carries one, it stays hidden in the UI until someone opens it and writes a chord into it, and a caller enumerating tracks is asking what the project HAS rather than what it structurally always has. No `type` spelling names an empty slot — it is a position in the arrangement rather than a kind of track — but this flag still answers to `type`, through the region each half lives in: the padding is added when `type` covers the arrangement at all (omitted, or naming at least one of `sing`/`instrument`/`genericMidi`/`audio`), and the chord track when `type` names `chord`. So a caller asking only about the pinned bands is not handed arrangement positions it did not ask about. Ordinary tracks are reported whether or not they hold clips — a Sing track someone just created is a track, and its name and sound source are most of what a caller wants from the listing.

***

### type?

```ts
optional type?: string[];
```

Track kinds to list. Repeatable. Omit for the arrangement's content tracks, which is what this answers when nothing names a pinned region. The spellings are `track create`'s, plus `chord`, which names the chord track — one project fixture that `track create` therefore refuses.
