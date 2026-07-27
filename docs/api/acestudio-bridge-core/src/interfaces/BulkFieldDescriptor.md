# Interface: BulkFieldDescriptor

Where a bulk field sits inside an arguments or result object: a dotted path from the root, with `[]` marking an array element. `dtype` is null when the schema leaves the element type to the payload.

## Properties

### dtype

```ts
readonly dtype: Dtype | null;
```

***

### field

```ts
readonly field: string;
```
