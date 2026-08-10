# Interface: TrackSetParams

Arguments for `track set`.

## Properties

### color?

```ts
optional color?: string | null;
```

Palette color hex string, e.g. `#EC4F44`. Must be one of the values returned by `color-palette`. Also affects the default color for new clips on this track.

***

### gain?

```ts
optional gain?: number | null;
```

Volume gain level: 0.0 and above; 1.0 = unity; above 1.0 = boost.

***

### monitor?

```ts
optional monitor?: boolean | null;
```

Whether the track monitors its live input.

This was `track set-monitor`, a verb of its own for one boolean. It behaves differently from its neighbours under undo — it lands no entry — but that is ours to handle, not a reason to make the caller learn a second verb for a switch that sits beside mute and solo in the mixer.

***

### mute?

```ts
optional mute?: boolean | null;
```

Mute the track (true) or unmute (false). When muted the track is silenced but still renders.

***

### pan?

```ts
optional pan?: number | null;
```

Stereo pan position: -1.0 (full left) to 1.0 (full right); 0.0 = center.

***

### solo?

```ts
optional solo?: boolean | null;
```

Solo the track (true) or unsolo (false). When any track is soloed, all non-soloed tracks are effectively muted.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based track index. Addresses the arrangement only — the master bus has no index, so `--track-uuid master` is how you reach it.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format, e.g. `\{12345678-abcd-...\}`, or the well-known id `master` for the project's master bus.

The master is a track like any other here — it has no domain of its own (ledger §2.11). It carries only a gain, so `--gain` is the one property it accepts; the rest are refused rather than silently dropped.
