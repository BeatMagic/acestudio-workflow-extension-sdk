# Interface: GenerativeSongParams

Arguments for `generative song`.

## Properties

### instrumental?

```ts
optional instrumental?: boolean | null;
```

Generate without vocals. **Idea mode only** -- in lyrics mode there are lyrics to sing, so an instrumental would contradict the request, and passing it there is an error rather than a silent no-op.

***

### lyrics?

```ts
optional lyrics?: string | null;
```

Lyrics to sing. Passing this selects the panel's "From Lyrics" mode. Either this or `--prompt` is required -- with neither there is nothing to generate from.

***

### prompt?

```ts
optional prompt?: string | null;
```

What to generate. Without `--lyrics` this is the whole brief ("a slow piano ballad about leaving home"); with it, this is the style the lyrics should be sung in ("dream pop, female vocal").

***

### title?

```ts
optional title?: string | null;
```

Title for the generated song. **Lyrics mode only.** Omit to take the panel's derived title (the opening of the lyrics, or the style prefixed with "(Instrumental)").
