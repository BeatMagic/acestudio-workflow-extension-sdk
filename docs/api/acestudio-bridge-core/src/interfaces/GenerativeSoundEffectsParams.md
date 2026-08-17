# Interface: GenerativeSoundEffectsParams

Arguments for `generative sound-effects`.

## Properties

### from

```ts
from: number;
```

Where the generated clip starts, in ticks.

***

### influence?

```ts
optional influence?: "low" | "mid" | "high";
```

How much the prompt overrides what the source material suggests. The Sound Effects panel offers exactly these three steps rather than a continuous slider, and the contract keeps the panel's vocabulary instead of inventing a number the UI cannot express.

***

### loop?

```ts
optional loop?: boolean;
```

Generate a seamlessly loopable effect. Off by default.

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

Where the generated clip ends (exclusive), in ticks.

***

### trackUuid

```ts
trackUuid: string;
```

The Audio track the generated clip lands on, by id.
