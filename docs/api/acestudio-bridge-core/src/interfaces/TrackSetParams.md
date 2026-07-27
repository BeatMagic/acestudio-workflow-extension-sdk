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

### trackIndex

```ts
trackIndex: number;
```

0-based track index.
