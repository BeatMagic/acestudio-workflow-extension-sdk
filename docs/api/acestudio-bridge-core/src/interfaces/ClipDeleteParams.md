# Interface: ClipDeleteParams

Arguments for `clip delete`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

UUIDs of the clips to delete, with or without curly braces. Repeat the flag to name several. All-or-nothing: a UUID naming no clip fails before anything is deleted.
