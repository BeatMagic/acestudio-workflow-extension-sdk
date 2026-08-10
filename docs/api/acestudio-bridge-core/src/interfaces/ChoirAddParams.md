# Interface: ChoirAddParams

Arguments for `choir add`.

## Properties

### at?

```ts
optional at?: number | null;
```

Where to insert the new member. Defaults to the end. `0` makes the new voice the leader and pushes the rest down.

***

### model?

```ts
optional model?: string | null;
```

Which vocal synth model the new member sings through, by model name or generation. Omit for the voice's default.

***

### source

```ts
source: string;
```

**Required.** Which voice to add, by display name or ref — the same thing `sound-source load --source` accepts, including a blended voice.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format.
