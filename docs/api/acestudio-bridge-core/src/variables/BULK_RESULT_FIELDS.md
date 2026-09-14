# Variable: BULK\_RESULT\_FIELDS

```ts
const BULK_RESULT_FIELDS: {
  audio-plugin editor capture: readonly [{
     dtype: "u8";
     field: "png";
  }];
  audio-plugin export-preset: readonly [{
     dtype: "u8";
     field: "blob";
  }];
  audio-plugin get-state: readonly [{
     dtype: "u8";
     field: "blob";
  }];
  fx export-chain: readonly [{
     dtype: "u8";
     field: "blob";
  }];
};
```

Where the bulk fields sit in each operation's result object, for the encode/decode pass that swaps typed arrays for the base64 envelope.

## Type Declaration

### audio-plugin editor capture

```ts
readonly audio-plugin editor capture: readonly [{
  dtype: "u8";
  field: "png";
}];
```

### audio-plugin export-preset

```ts
readonly audio-plugin export-preset: readonly [{
  dtype: "u8";
  field: "blob";
}];
```

### audio-plugin get-state

```ts
readonly audio-plugin get-state: readonly [{
  dtype: "u8";
  field: "blob";
}];
```

### fx export-chain

```ts
readonly fx export-chain: readonly [{
  dtype: "u8";
  field: "blob";
}];
```
