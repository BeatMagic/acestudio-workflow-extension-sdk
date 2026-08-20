# Interface: JobPlaceParams

Arguments for `job place`.

## Properties

### at?

```ts
optional at?: number;
```

Position to place at, in ticks. Omitted places at the project start.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Only `arrangement`, the default, can hold a placement: a staged result becomes an audio clip, and the pinned bands hold video layers and marker lanes. Naming another region is refused with that reason rather than reported as a missing track.

***

### resultId

```ts
resultId: string;
```

The staged result id to place (from `job results`).

***

### trackIndex?

```ts
optional trackIndex?: number;
```

Target track position (0-based) in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Target track UUID in braces format. The definitive handle: it names a track in every region, where an index needs `region` to be read.
