# Interface: AudioPluginRemovePresetResult

Success payload of `audio-plugin remove-preset`.

## Properties

### path

```ts
path: string;
```

Absolute path of the file now in the trash, or of the directory that was removed.

***

### removed

```ts
removed: "preset" | "folder";
```

What a library remove took away: a preset file, or an empty folder.

***

### target

```ts
target: string;
```

Its path in the library, as the library spelled it.
