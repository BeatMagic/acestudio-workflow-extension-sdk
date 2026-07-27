# Interface: VoiceLoadResult

Success payload of `voice load`.

## Properties

### id

```ts
id: number;
```

ID of the loaded sound source.

***

### name

```ts
name: string;
```

Display name of the loaded sound source.

***

### soundSourceType

```ts
soundSourceType: string;
```

The loaded type, echoed back: 'singer', 'choir', 'instrument', or 'ensemble'.

***

### trackIndex

```ts
trackIndex: number;
```

0-based index of the track the source was loaded onto.
