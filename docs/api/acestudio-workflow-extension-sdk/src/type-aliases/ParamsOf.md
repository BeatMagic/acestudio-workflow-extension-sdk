# Type Alias: ParamsOf\<C, K\>

```ts
type ParamsOf<C, K> = C[K] extends (params) => unknown ? Parameters<C[K]> : never;
```

The parameters of the call `K`, as a tuple — empty for a call that takes none.

Written as a conditional rather than `Parameters<C[K]>` because `C` arrives here
as a lookup into a protocol type, which the compiler cannot see through far enough
to know it holds functions. The conditional is what tells it, and both ends derive
their signatures through it.

## Type Parameters

### C

`C`

### K

`K` *extends* keyof `C`
