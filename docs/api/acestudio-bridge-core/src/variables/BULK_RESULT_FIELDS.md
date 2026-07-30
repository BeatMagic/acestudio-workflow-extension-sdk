# Variable: BULK\_RESULT\_FIELDS

```ts
const BULK_RESULT_FIELDS: {
  vocalparam read: readonly [{
     dtype: "f64le";
     field: "effective.points";
   }, {
     dtype: "f64le";
     field: "layers[].points";
  }];
};
```

Where the bulk fields sit in each operation's result object, for the encode/decode pass that swaps typed arrays for the base64 envelope.

## Type Declaration

### vocalparam read

```ts
readonly vocalparam read: readonly [{
  dtype: "f64le";
  field: "effective.points";
}, {
  dtype: "f64le";
  field: "layers[].points";
}];
```
