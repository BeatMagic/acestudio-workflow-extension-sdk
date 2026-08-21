# Interface: EnsembleSetParams

Arguments for `ensemble set`.

## Properties

### gain?

```ts
optional gain?: number;
```

Member gain in dB. Requires `member`.

***

### member?

```ts
optional member?: number;
```

Which member to configure. `0` is the leader. Omit to configure the ensemble as a whole instead.

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

Timing offset between members, in milliseconds. Ensemble-level.

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

Stereo spread across the members, 0 to 1. Ensemble-level.

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
