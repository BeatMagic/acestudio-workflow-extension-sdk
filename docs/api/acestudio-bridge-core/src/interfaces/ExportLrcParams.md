# Interface: ExportLrcParams

Arguments for `export lrc`.

## Properties

### path

```ts
path: string;
```

Where to write the `.lrc` file.

***

### trackUuid

```ts
trackUuid: string;
```

Which Sing track's lyrics to write. Required; a non-Sing track is rejected, since only a Sing track carries lyrics.
