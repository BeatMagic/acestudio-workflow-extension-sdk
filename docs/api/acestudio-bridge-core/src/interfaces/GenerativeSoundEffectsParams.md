# Interface: GenerativeSoundEffectsParams

Arguments for `generative sound-effects`.

## Properties

### from

```ts
from: number;
```

Where the generated clip starts. Ticks (`3840t`), clock time (`1.5s`), or a musical position (`4.1.0`).

***

### influence?

```ts
optional influence?: "low" | "mid" | "high";
```

How strictly to follow the prompt: `low`, `mid` (default) or `high`.

***

### loop?

```ts
optional loop?: boolean | null;
```

Generate a seamlessly loopable effect. Off by default.

The clap id is `loopable` because `loop` is a Rust keyword, with the user-facing long name pinned back to `--loop` so the flag reads the way the panel's checkbox does; the wire key is `loop` to match.

***

### prompt

```ts
prompt: string;
```

The effect to generate ("distant thunder", "door creak"). Required.

***

### to

```ts
to: number;
```

Where the generated clip ends (exclusive). This is what fixes the generation's length.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id. Required: the panel takes it from the arrangement selection, which is not something a script can rely on (ADR 0087). Its content in the range is moved aside the same way the panel's own launch moves it, as one undo entry.
