# Interface: BulkBlob\<D\>

The wire envelope a bulk field travels in. Bindings expose typed arrays; this is what the encode/decode pass converts to and from, and the only reason it is exported is that the pass lives outside the generated code.

## Type Parameters

### D

`D` *extends* [`Dtype`](../type-aliases/Dtype.md) = [`Dtype`](../type-aliases/Dtype.md)

## Properties

### count

```ts
count: number;
```

Element count — the length the decoded array must have.

***

### data

```ts
data: string;
```

Base64 of the little-endian element bytes.

***

### dtype

```ts
dtype: D;
```
