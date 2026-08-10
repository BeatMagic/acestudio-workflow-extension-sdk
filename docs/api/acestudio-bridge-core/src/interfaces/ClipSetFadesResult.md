# Interface: ClipSetFadesResult

Success payload of `clip set-fades`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip that carries the fades. In the crossfade form this is the earlier of the two.

***

### crossfade

```ts
crossfade: boolean;
```

True when the fade-out is a crossfade into the next clip.

***

### fadeIn?

```ts
optional fadeIn?: number;
```

Fade-in length in seconds.

***

### fadeOut

```ts
fadeOut: number;
```

Fade-out length in seconds. Doubles as the crossfade length.

***

### nextClipUuid?

```ts
optional nextClipUuid?: string;
```

Crossfade form only: the later clip of the pair.
