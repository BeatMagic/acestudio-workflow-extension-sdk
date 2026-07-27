# Interface: JobPlaceParams

Arguments for `job place`.

## Properties

### at?

```ts
optional at?: number | null;
```

Position to place at. Ticks (`3840t`), clock time (`1.5s`, `1:23.5`), or musical position (`4.1.0`). Defaults to the project start when omitted. See `help time-values`.

***

### resultId

```ts
resultId: string;
```

The staged result id to place (from `job results`).

***

### trackId

```ts
trackId: string;
```

Target track id to place the result onto.
