# Interface: ClipConsolidateResult

Success payload of `clip consolidate`.

## Properties

### clips

```ts
clips: {
  clipName: string;
  clipType: string;
  clipUuid: string;
  consolidatedClipCount: number;
  geometry: Record<string, unknown>;
  trackName: string;
  trackUuid: string;
}[];
```

One consolidated clip per track that had material in the range. A named track with nothing in the range is skipped rather than producing an empty clip.

#### clipName

```ts
clipName: string;
```

Generated name, `Consolidate_\<n\>_\<track\>` unless --name was given.

#### clipType

```ts
clipType: string;
```

Clip type, matching its track.

#### clipUuid

```ts
clipUuid: string;
```

Id of the consolidated clip.

#### consolidatedClipCount

```ts
consolidatedClipCount: number;
```

How many source clips contributed to this one.

#### geometry

```ts
geometry: Record<string, unknown>;
```

The consolidated clip's geometry: exactly the requested range.

#### trackName

```ts
trackName: string;
```

Name of that track.

#### trackUuid

```ts
trackUuid: string;
```

Id of the track it was placed on.

***

### rangeBegin

```ts
rangeBegin: number;
```

Range start actually used, in ticks.

***

### rangeEnd

```ts
rangeEnd: number;
```

Range end actually used (exclusive), in ticks.

***

### trackCount

```ts
trackCount: number;
```

How many tracks produced a consolidated clip -- at most the number of trackUuids given.
