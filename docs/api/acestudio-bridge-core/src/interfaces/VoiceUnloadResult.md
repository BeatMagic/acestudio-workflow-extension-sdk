# Interface: VoiceUnloadResult

Success payload of `voice unload`.

## Properties

### newType

```ts
newType: string;
```

New track type; always 'GenericMidi'.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the converted track.

***

### trackName

```ts
trackName: string;
```

Track name before the conversion.
