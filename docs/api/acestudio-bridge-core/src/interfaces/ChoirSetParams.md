# Interface: ChoirSetParams

Arguments for `choir set`.

## Properties

### gain?

```ts
optional gain?: number;
```

Member gain in dB: -50 to +20 (`ChoirSingerInfo::kGainRange`). Requires `member`.

***

### member?

```ts
optional member?: number;
```

Which member to configure. `0` is the leader. Omit to configure the choir as a whole instead.

***

### mute?

```ts
optional mute?: boolean;
```

Whether to mute this member. Requires `member`.

***

### offset?

```ts
optional offset?: number;
```

Timing offset between members: a proportion of the engine's maximum doubling offset, 0 to 0.3 (`EnsembleConfigInfo::kOffsetRange`, the bound the handler enforces), where 0.3 applies the maximum. The UI shows this as 0% to 30%. It is not a time — the value scales the maximum offset rather than naming a duration. Choir-level; out-of-range values are refused, not clamped.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement` can hold a track this group operates on, so that is the default and the sole accepted value; naming another is refused rather than resolved against the arrangement, which would act on an unrelated track (ADR 0129 §2).

***

### spread?

```ts
optional spread?: number;
```

Stereo spread across the members on the UI's Spread scale: 0 to 10 (`EnsembleConfigInfo::kSpreadRange`, default 3). Not a normalized 0 to 1 width. Choir-level; out-of-range values are refused, not clamped.

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
