# Interface: SoundSourceUnloadResult

Success payload of `sound-source unload`.

## Properties

### newType

```ts
newType: string;
```

What the track is now. A Sing or Instrument track becomes `GenericMidi`; a MIDI track that merely had its external instrument unmounted stays `GenericMidi`.

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

### trackName

```ts
trackName: string;
```

Track name before the unload.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of that track.
