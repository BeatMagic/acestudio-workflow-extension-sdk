# Type Alias: AbsoluteFilesystemPath

```ts
type AbsoluteFilesystemPath = 
  | `/${string}`
  | `${string}`
  | `${DriveLetter}:${"/" | "\"}${string}`;
```

An absolute path, POSIX or Windows — the scope form a static manifest cannot
enumerate, rendered verbatim in the consent line. The host is the authority on
what counts as absolute; [serializeManifest](../functions/serializeManifest.md) rejects the forms it can
tell are neither absolute nor a known scope name.

Three forms, matching what the host accepts: a POSIX root, a UNC share (two
leading backslashes), and a drive letter with its separator. A single leading
backslash is deliberately not one of them — on Windows that path is relative to
the current drive, so it names a different folder depending on where the process
happens to be, which is not something a consent line can vouch for. A bare drive
prefix (`D:Stems`) is out for the same reason.
