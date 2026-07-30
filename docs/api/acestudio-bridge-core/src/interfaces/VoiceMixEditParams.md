# Interface: VoiceMixEditParams

Arguments for `voice mix-edit`.

## Properties

### head?

```ts
optional head?: number | null;
```

New avatar id.

***

### id

```ts
id: number;
```

Library id of the blended voice to edit, from `voice mix-create` or `voice list`.

***

### language?

```ts
optional language?: string | null;
```

New language, as a full English name.

***

### name?

```ts
optional name?: string | null;
```

New display name.

***

### routerId?

```ts
optional routerId?: number | null;
```

New synthesis router id. Omit and Studio re-picks one only when a new recipe leaves the current router unable to carry every seed.

***

### seeds?

```ts
optional seeds?: 
  | {
  code: number;
  lock?: boolean | null;
  style?: number | null;
  timbre?: number | null;
}[]
  | null;
```

Replacement recipe, same shape as `voice mix-create --seeds`. Replaces the whole recipe rather than merging into it.

***

### tags?

```ts
optional tags?: string[] | null;
```

Replacement tag list. Replaces the existing tags rather than adding to them; pass no values to clear them.
