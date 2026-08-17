# Interface: BlendListParams

Arguments for `blend list`.

## Properties

### keyword?

```ts
optional keyword?: string;
```

Filter by name substring, case-insensitive.

***

### showRefs?

```ts
optional showRefs?: boolean;
```

Show each blend's `ref` in the human listing. Refs are always present in the JSON payload; this is for reading them without first provoking an ambiguity error. Blend names collide as readily as any other sound source's, so the same escape hatch belongs here.
