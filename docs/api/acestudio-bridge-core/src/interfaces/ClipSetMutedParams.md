# Interface: ClipSetMutedParams

Arguments for `clip set-muted`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

UUIDs of the target clips. Video clips only. Repeat the flag to name several.

***

### muted

```ts
muted: boolean;
```

`true` to mute the embedded audio, `false` to unmute it.
