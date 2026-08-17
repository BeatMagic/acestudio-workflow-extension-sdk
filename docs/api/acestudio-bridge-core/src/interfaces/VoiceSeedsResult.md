# Interface: VoiceSeedsResult

Success payload of `voice seeds`.

## Properties

### count

```ts
count: number;
```

How many seeds were returned.

***

### seeds

```ts
seeds: {
  code: number;
  labels?: string[];
  name: string;
  origin?: string;
  ref: string;
}[];
```

The voice seeds available for blending.

#### code

```ts
code: number;
```

The seed's code, which is what a recipe stores.

#### labels?

```ts
optional labels?: string[];
```

Descriptive labels the library attaches to the seed.

#### name

```ts
name: string;
```

Display name.

#### origin?

```ts
optional origin?: string;
```

Which library the seed comes from: `premade`, `cloned`, or `community`.

#### ref

```ts
ref: string;
```

Ref for this seed, accepted by `blend add --seed`.
