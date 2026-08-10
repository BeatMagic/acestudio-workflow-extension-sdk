# Interface: ClipSetFadesParams

Arguments for `clip set-fades`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

UUID of the target clip (single-clip form). Repeat the flag exactly twice for the crossfade form.

***

### crossfade?

```ts
optional crossfade?: number | null;
```

Crossfade length, for the two-clip form. Clock time (`1.5s`, `500ms`) or ticks (`240t`); `0s` removes it.

***

### fadeIn?

```ts
optional fadeIn?: number | null;
```

Fade-in length. Clock time (`1.5s`, `500ms`) or ticks (`240t`); `0s` removes the fade. Single-clip form only.

***

### fadeInShape?

```ts
optional fadeInShape?: number[] | null;
```

Fade-in curve shape as `x,y`, each in [-0.5, 0.5]. `0,0` is linear.

***

### fadeOut?

```ts
optional fadeOut?: number | null;
```

Fade-out length. Clock time (`1.5s`, `500ms`) or ticks (`240t`); `0s` removes the fade. Single-clip form only.

***

### fadeOutShape?

```ts
optional fadeOutShape?: number[] | null;
```

Fade-out curve shape as `x,y`, each in [-0.5, 0.5]. `0,0` is linear.
