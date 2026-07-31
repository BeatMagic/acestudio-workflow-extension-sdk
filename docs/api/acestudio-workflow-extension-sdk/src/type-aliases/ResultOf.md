# Type Alias: ResultOf\<C, K\>

```ts
type ResultOf<C, K> = C[K] extends (params) => infer R ? Awaited<R> : never;
```

What the call `K` answers, with a promise unwrapped: a signature declared `async`
already says `Promise<T>`, and this is what lets one declared `T` be answered by an
async handler anyway.

## Type Parameters

### C

`C`

### K

`K` *extends* keyof `C`
