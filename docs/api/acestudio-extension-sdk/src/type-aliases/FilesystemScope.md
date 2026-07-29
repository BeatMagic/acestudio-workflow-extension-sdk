# Type Alias: FilesystemScope

```ts
type FilesystemScope = 
  | EnumeratedFilesystemScope
  | `project:${string}`
  | AbsoluteFilesystemPath;
```

One declared filesystem scope: a scope name, a `project:`-prefixed subpath of
the open project's bundle folder, or an absolute path.
