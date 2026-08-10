# Interface: BlendListResult

Success payload of `blend list`.

## Properties

### blends

```ts
blends: {
  id: number;
  language?: string;
  modelName?: string;
  name: string;
  ref: string;
  seedCount: number;
  tags?: string[];
}[];
```

Every blended voice in the library.

#### id

```ts
id: number;
```

Library id.

#### language?

```ts
optional language?: string;
```

Native language, full English name.

#### modelName?

```ts
optional modelName?: string;
```

The model it sings through.

#### name

```ts
name: string;
```

Display name.

#### ref

```ts
ref: string;
```

Ref for this blend.

#### seedCount

```ts
seedCount: number;
```

How many seeds the recipe holds.

#### tags?

```ts
optional tags?: string[];
```

Tag names attached to the blend.

***

### count

```ts
count: number;
```

How many blends the library holds.

***

### maximum

```ts
maximum: number;
```

The library's ceiling, so a caller can tell whether another `blend create` will fit.
