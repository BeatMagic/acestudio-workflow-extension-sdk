# Type Alias: AbsoluteFilesystemPath

```ts
type AbsoluteFilesystemPath = 
  | `/${string}`
  | `${string}`
  | `${string}:${"/" | "\"}${string}`;
```

An absolute path, POSIX or Windows — the scope form a static manifest cannot
enumerate, rendered verbatim in the consent line. The host is the authority on
what counts as absolute; [serializeManifest](../functions/serializeManifest.md) rejects the forms it can
tell are neither absolute nor a known scope name.
