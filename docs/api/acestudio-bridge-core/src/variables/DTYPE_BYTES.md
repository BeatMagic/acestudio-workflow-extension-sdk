# Variable: DTYPE\_BYTES

```ts
const DTYPE_BYTES: Readonly<Record<Dtype, number>>;
```

Bytes per element of each `dtype`. The binding rejects a blob whose decoded byte length is not `count × DTYPE_BYTES[dtype]`, so truncation fails loudly instead of yielding a short array.
