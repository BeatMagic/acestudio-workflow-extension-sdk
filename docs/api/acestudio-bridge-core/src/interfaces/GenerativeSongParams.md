# Interface: GenerativeSongParams

Arguments for `generative song`.

## Properties

### instrumental?

```ts
optional instrumental?: boolean;
```

Generate without vocals. **Idea mode only** — lyrics mode has lyrics to sing, so an instrumental would contradict the request.

***

### lyrics?

```ts
optional lyrics?: string;
```

Lyrics to sing. Passing this selects lyrics mode.

***

### prompt?

```ts
optional prompt?: string;
```

What to generate. Idea mode without `lyrics`; the style with it.

***

### title?

```ts
optional title?: string;
```

Title for the generated song. **Lyrics mode only** — idea mode derives its own title. Omit for the derived title (the opening of the lyrics, or the style prefixed with "(Instrumental)").
