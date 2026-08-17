# Interface: TrackSetParams

Arguments for `track set`.

## Properties

### color?

```ts
optional color?: string;
```

Palette color hex string, e.g. `#EC4F44`. Must be one of the values `color-palette` returns. Also affects the default color for new clips on this track. The master bus has no color.

***

### gain?

```ts
optional gain?: number;
```

Volume gain level: 0.0 and above; 1.0 = unity; above 1.0 = boost. The only property the master bus accepts.

***

### monitor?

```ts
optional monitor?: boolean;
```

Whether the track monitors its live input. The master bus has no monitor switch, and this field lands no undo entry.

***

### mute?

```ts
optional mute?: boolean;
```

Mute the track (true) or unmute (false). When muted the track is silenced but still renders. The master bus has no mute.

***

### pan?

```ts
optional pan?: number;
```

Stereo pan position: -1.0 (full left) to 1.0 (full right); 0.0 = center. The master bus has no pan.

***

### solo?

```ts
optional solo?: boolean;
```

Solo the track (true) or unsolo (false). When any track is soloed, all non-soloed tracks are effectively muted. The master bus has no solo.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based track index. Addresses the arrangement only — the master bus has no index, so `trackUuid: "master"` is how you reach it.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, e.g. `\{12345678-abcd-...\}`, or the well-known id `master` for the project's master bus.
