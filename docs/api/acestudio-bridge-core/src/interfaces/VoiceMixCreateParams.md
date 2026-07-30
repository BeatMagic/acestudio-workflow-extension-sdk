# Interface: VoiceMixCreateParams

Arguments for `voice mix-create`.

## Properties

### head?

```ts
optional head?: number | null;
```

Avatar id. Omit to take the library's first avatar.

***

### language?

```ts
optional language?: string | null;
```

Language the voice sings, as a full English name (e.g. `Chinese`). Omit to take the first one the seeds and router allow.

***

### name

```ts
name: string;
```

Display name for the new blended voice.

***

### routerId?

```ts
optional routerId?: number | null;
```

Synthesis router id. Omit to let Studio pick one that carries every seed — which is what you want unless you have a specific reason.

***

### seeds

```ts
seeds: {
  code: number;
  lock?: boolean | null;
  style?: number | null;
  timbre?: number | null;
}[];
```

JSON array of seed entries, e.g. `[\{"code":1001,"timbre":0.6,"style":0.4\}]`. Each entry needs a `code`; `timbre`, `style`, and `lock` default to 1, 1, and true. Every seed must be owned and blendable.

#### code

```ts
code: number;
```

The seed voice's code. Must name a seed this account owns and that is allowed in a blend.

#### lock?

```ts
optional lock?: boolean | null;
```

Whether the seed's weights are locked against redistribution when other weights change. Defaults to true.

#### style?

```ts
optional style?: number | null;
```

Style weight, defaulting to 1.

#### timbre?

```ts
optional timbre?: number | null;
```

Timbre weight, defaulting to 1.

***

### tags?

```ts
optional tags?: string[] | null;
```

Tag names to attach, for filtering in `voice list`.
