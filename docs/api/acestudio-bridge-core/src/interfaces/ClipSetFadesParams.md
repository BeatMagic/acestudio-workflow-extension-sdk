# Interface: ClipSetFadesParams

Arguments for `clip set-fades`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

UUID of the target clip (single-clip form). Repeat exactly twice for the crossfade form.

***

### crossfade?

```ts
optional crossfade?: number;
```

Crossfade length in seconds, for the two-clip form; `0` removes it.

***

### fadeIn?

```ts
optional fadeIn?: number;
```

Fade-in length in seconds; `0` removes the fade. Single-clip form only.

***

### fadeInShape?

```ts
optional fadeInShape?: number[];
```

Fade-in curve shape as `[x, y]`, each in [-0.5, 0.5]. `[0, 0]` is linear.

***

### fadeOut?

```ts
optional fadeOut?: number;
```

Fade-out length in seconds; `0` removes the fade. Single-clip form only.

***

### fadeOutShape?

```ts
optional fadeOutShape?: number[];
```

Fade-out curve shape as `[x, y]`, each in [-0.5, 0.5]. `[0, 0]` is linear.
