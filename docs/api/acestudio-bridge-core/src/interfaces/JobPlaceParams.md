# Interface: JobPlaceParams

Arguments for `job place`.

## Properties

### at?

```ts
optional at?: number;
```

Position to place at, in ticks. Omitted places at the project start.

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
