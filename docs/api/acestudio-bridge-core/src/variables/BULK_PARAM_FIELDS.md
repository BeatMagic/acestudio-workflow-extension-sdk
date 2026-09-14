# Variable: BULK\_PARAM\_FIELDS

```ts
const BULK_PARAM_FIELDS: {
  audio-plugin import-preset: readonly [{
     dtype: "u8";
     field: "blob";
  }];
  audio-plugin set-state: readonly [{
     dtype: "u8";
     field: "blob";
  }];
  fx import-chain: readonly [{
     dtype: "u8";
     field: "blob";
  }];
};
```

Where the bulk fields sit in each operation's arguments object, for the encode/decode pass that swaps typed arrays for the base64 envelope.

## Type Declaration

### audio-plugin import-preset

```ts
readonly audio-plugin import-preset: readonly [{
  dtype: "u8";
  field: "blob";
}];
```

### audio-plugin set-state

```ts
readonly audio-plugin set-state: readonly [{
  dtype: "u8";
  field: "blob";
}];
```

### fx import-chain

```ts
readonly fx import-chain: readonly [{
  dtype: "u8";
  field: "blob";
}];
```
