# Type Alias: TypedArrayFor\<D\>

```ts
type TypedArrayFor<D> = D extends "u8" ? Uint8Array : D extends "i16le" ? Int16Array : D extends "i32le" ? Int32Array : D extends "i64le" ? BigInt64Array : D extends "f32le" ? Float32Array : D extends "f64le" ? Float64Array : never;
```

The typed-array view a `dtype` maps to, in both directions.

## Type Parameters

### D

`D` *extends* [`Dtype`](Dtype.md)
