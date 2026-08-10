# Interface: EnsembleSetParams

Arguments for `ensemble set`.

## Properties

### gain?

```ts
optional gain?: number | null;
```

Member gain in dB. Requires `--member`.

***

### member?

```ts
optional member?: number | null;
```

Which member to configure. `0` is the leader. Omit to configure the ensemble as a whole instead.

***

### mute?

```ts
optional mute?: boolean | null;
```

Whether to mute this member. Requires `--member`.

***

### offset?

```ts
optional offset?: number | null;
```

Timing offset between members, in milliseconds. Ensemble-level.

***

### spread?

```ts
optional spread?: number | null;
```

Stereo spread across the members, 0 to 1. Ensemble-level.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format.
