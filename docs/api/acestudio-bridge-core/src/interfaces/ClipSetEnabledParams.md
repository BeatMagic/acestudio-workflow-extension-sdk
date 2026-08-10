# Interface: ClipSetEnabledParams

Arguments for `clip set-enabled`.

## Properties

### clipUuids

```ts
clipUuids: string[];
```

UUIDs of the target clips. Repeat the flag to name several.

***

### enabled

```ts
enabled: boolean;
```

`true` to enable, `false` to disable. A disabled clip stays in place but does not play.
