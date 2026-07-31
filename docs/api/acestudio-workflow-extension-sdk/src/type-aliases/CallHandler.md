# Type Alias: CallHandler\<C, K\>

```ts
type CallHandler<C, K> = (...args) => 
  | ResultOf<C, K>
| Promise<ResultOf<C, K>>;
```

What answers the call `K`: the declaration's own parameters, and its result or a
promise of it.

## Type Parameters

### C

`C`

### K

`K` *extends* keyof `C`

## Parameters

### args

...[`ParamsOf`](ParamsOf.md)\<`C`, `K`\>

## Returns

  \| [`ResultOf`](ResultOf.md)\<`C`, `K`\>
  \| `Promise`\<[`ResultOf`](ResultOf.md)\<`C`, `K`\>\>
