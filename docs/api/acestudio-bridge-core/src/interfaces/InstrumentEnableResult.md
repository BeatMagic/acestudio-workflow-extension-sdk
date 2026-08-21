# Interface: InstrumentEnableResult

Success payload of `instrument enable`.

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

### region

```ts
region: string;
```

Which index space `trackIndex` counts in: `arrangement`, the only region whose tracks this group reaches. Written out rather than implied, so a caller reading a track index anywhere on this surface reads it the same way and needs no table of which groups omit it (ADR 0129 §2).

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
