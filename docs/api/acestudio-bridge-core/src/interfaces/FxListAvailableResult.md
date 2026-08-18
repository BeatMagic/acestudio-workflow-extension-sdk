# Interface: FxListAvailableResult

Success payload of `fx list-available`.

## Properties

### effectCount

```ts
effectCount: number;
```

Number of entries in `effects`.

***

### effects

```ts
effects: {
  category?: string;
  format: "native" | "vst3" | "vst2" | "au";
  name: string;
  typeId: string;
  vendor?: string;
  version?: string;
}[];
```

Every insertable effect, native entries first, then scanned third-party plugins.

#### category?

```ts
optional category?: string;
```

The plugin's own category string, when it declares one.

#### format

```ts
format: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in set; which of the others exist depends on the platform (no AU on Windows).

#### name

```ts
name: string;
```

Display name of the effect.

#### typeId

```ts
typeId: string;
```

Stable identifier to pass to `fx add`. Native effects use the `ace.native.\<name\>` namespace; a third-party plugin's is its format's own identifier string.

#### vendor?

```ts
optional vendor?: string;
```

Plugin vendor. `ACE Studio` for the built-in set.

#### version?

```ts
optional version?: string;
```

The plugin's own version string, when it declares one.

***

### scanning

```ts
scanning: boolean;
```

Whether a plugin scan is running right now. When true the list is what the registry holds so far, not a final answer.

***

### totalEffectCount

```ts
totalEffectCount: number;
```

How many insertable effects there are before any filter. Equal to `effectCount` when nothing was filtered; larger when it was, so a short list cannot be mistaken for a small catalog.
