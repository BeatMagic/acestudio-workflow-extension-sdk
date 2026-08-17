# Interface: GenerativeStemSplitParams

Arguments for `generative stem-split`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The audio clip to split, by id. Its stem tracks are inserted below its source track.

***

### mode?

```ts
optional mode?: "basic" | "professional" | "advanced" | "customized";
```

Which stem set a split produces — the Stem Splitter panel's four choices. `basic` and `professional` are free; `advanced` and `customized` bill their own SKUs. That is why the mode is a parameter and never inferred: a caller choosing between them is choosing what to spend.

***

### prompt?

```ts
optional prompt?: string;
```

Which sound to isolate, in words ("just the horns"). **`mode` "customized" only**, and required there.

***

### removeReverb?

```ts
optional removeReverb?: boolean;
```

Strip reverb from the separated vocal. Off by default. **"basic" and "professional" only** — the two fine-grained modes do not support it.
