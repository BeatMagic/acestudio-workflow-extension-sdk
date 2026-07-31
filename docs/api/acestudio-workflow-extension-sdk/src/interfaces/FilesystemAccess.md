# Interface: FilesystemAccess

What an extension's *process* may reach, per direction. `"all"` in place of a
list asks for the whole filesystem in that direction.

Declared scopes are rare on purpose: a file the user picks in the extension's
page arrives as content over the page↔process channel, exactly as it would in a
browser, and needs no declaration. This block is for *programmatic* path access
— watching a folder, re-exporting to the same directory every run.

## Properties

### read?

```ts
readonly optional read?: 
  | "all"
  | readonly FilesystemScope[];
```

Paths and scopes the process may read.

***

### write?

```ts
readonly optional write?: 
  | "all"
  | readonly FilesystemScope[];
```

Paths and scopes the process may write. `projectMedia` is not one of them.
