# Interface: DriverSurface

One artifact's tables, bundled so a driver passes what it carries as a single value. The binding runtime reads a surface rather than importing one artifact's tables directly, which is what lets the privileged remainder ride the same runtime as the published set (ADR 0094 §2) instead of needing a second copy of it. Tokens are typed `string` here and against each artifact's own union at the table that declares them, so bundling widens nothing a consumer relies on.

## Properties

### bulk

```ts
readonly bulk: {
  params: Readonly<Record<string, readonly BulkFieldDescriptor[]>>;
  result: Readonly<Record<string, readonly BulkFieldDescriptor[]>>;
};
```

#### params

```ts
readonly params: Readonly<Record<string, readonly BulkFieldDescriptor[]>>;
```

#### result

```ts
readonly result: Readonly<Record<string, readonly BulkFieldDescriptor[]>>;
```

***

### channels

```ts
readonly channels: readonly ChannelDescriptor[];
```

***

### fieldCapabilities

```ts
readonly fieldCapabilities: Readonly<Record<string, Readonly<Record<string, string>>>>;
```

***

### operations

```ts
readonly operations: readonly OperationDescriptor[];
```

***

### requiredTokens

```ts
readonly requiredTokens: Readonly<Record<string, string>>;
```

***

### tokens

```ts
readonly tokens: readonly string[];
```
