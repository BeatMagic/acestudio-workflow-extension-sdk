# Interface: InstrumentDisableResult

Success payload of `instrument disable`.

## Properties

### enabled

```ts
enabled: boolean;
```

Whether the instrument is processing. A disabled instrument stays mounted with its state intact.

***

### format?

```ts
optional format?: string;
```

Which format is mounted: `vst3`, `vst2`, or `au`. Absent when the scan reported none.

***

### midiChannel

```ts
midiChannel: string;
```

Which MIDI channel it listens on: `1` through `16`. Never `all` — a mounted instrument addresses exactly one channel.

***

### name

```ts
name: string;
```

Display name of the mounted plugin.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.

***

### vendor?

```ts
optional vendor?: string;
```

Plugin vendor. Absent when the scan reported none.
