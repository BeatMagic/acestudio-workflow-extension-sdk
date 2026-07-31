# Type Alias: EnumeratedFilesystemScope

```ts
type EnumeratedFilesystemScope = 
  | "projectMedia"
  | "home"
  | "documents"
  | "music"
  | "desktop"
  | "downloads"
  | "all";
```

A filesystem scope Studio can name in a consent line on its own, without
printing a path: the project's media set, a well-known user folder, or the
whole filesystem.

`projectMedia` is read-only by definition — project media changes through
operations on the bridge, never by writing files behind Studio's back — so it
is not accepted under `write`.
