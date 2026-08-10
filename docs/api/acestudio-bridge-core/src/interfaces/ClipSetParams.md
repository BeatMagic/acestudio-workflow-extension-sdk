# Interface: ClipSetParams

Arguments for `clip set`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

UUID of the target clip, with or without curly braces.

***

### color?

```ts
optional color?: string | null;
```

New color as `#RRGGBB` or a named color. Setting a color stops the clip following its track.

***

### colorLinkToTrack?

```ts
optional colorLinkToTrack?: boolean | null;
```

Make the clip follow its track's color (`true`) or carry its own (`false`). Passing `true` together with `--color` is contradictory and is refused.

***

### name?

```ts
optional name?: string | null;
```

New name. Pass an empty string to clear it and fall back to the auto-generated name.
