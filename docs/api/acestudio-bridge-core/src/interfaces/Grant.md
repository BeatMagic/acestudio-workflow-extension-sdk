# Interface: Grant

What a session may reach.

## Properties

### provenance

```ts
readonly provenance: GrantProvenance;
```

How this grant came about.

***

### tokens

```ts
readonly tokens: readonly CapabilityToken[];
```

The granted tokens this artifact can name, sorted. Typed as the generated
union, so a token name autocompletes and a typo is a compile error.

## Methods

### has()

```ts
has(token): boolean;
```

Whether one token is granted.

#### Parameters

##### token

[`CapabilityToken`](../type-aliases/CapabilityToken.md)

#### Returns

`boolean`

***

### missing()

```ts
missing(profileOrTokens): readonly CapabilityToken[];
```

The tokens of `profileOrTokens` this grant does *not* hold, sorted — empty
when the whole set is granted. For consumers that work with a partial
grant: ask what is missing, then decide what to offer, rather than probing
token by token.

#### Parameters

##### profileOrTokens

  \| readonly [`CapabilityToken`](../type-aliases/CapabilityToken.md)[]
  \| `"surface.cli-mcp"`
  \| `"surface.extension-sdk"`

#### Returns

readonly [`CapabilityToken`](../type-aliases/CapabilityToken.md)[]

#### Throws

BridgeError with code `UNKNOWN_CAPABILITY` if a profile name is not
one this artifact publishes. A name that fails at runtime got past the type
from untyped JavaScript.
