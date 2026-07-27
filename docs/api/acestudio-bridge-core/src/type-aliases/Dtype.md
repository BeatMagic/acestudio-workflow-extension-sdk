# Type Alias: Dtype

```ts
type Dtype = "u8" | "i16le" | "i32le" | "i64le" | "f32le" | "f64le";
```

Element type and byte order of a bulk-data blob. Byte order is pinned in the contract — little-endian everywhere — so no consumer guesses it.
