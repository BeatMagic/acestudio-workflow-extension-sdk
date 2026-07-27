# Variable: BULK\_PARAM\_FIELDS

```ts
const BULK_PARAM_FIELDS: Readonly<Record<string, readonly BulkFieldDescriptor[]>> = {};
```

Where the bulk fields sit in each operation's arguments object, for the encode/decode pass that swaps typed arrays for the base64 envelope.
