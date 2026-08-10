# Interface: SoundSourceUnloadResult

Success payload of `sound-source unload`.

## Properties

### newType

```ts
newType: string;
```

What the track is now. A Sing or Instrument track becomes 'GenericMidi'; a MIDI track that merely had its external instrument unmounted stays 'GenericMidi'.

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
