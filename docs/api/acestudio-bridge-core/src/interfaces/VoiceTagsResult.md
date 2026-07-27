# Interface: VoiceTagsResult

Success payload of `voice tags`.

## Properties

### categories?

```ts
optional categories?: {
  id: number;
  name: string;
}[];
```

Instrument categories. Present for type 'instrument'.

#### id

```ts
id: number;
```

Numeric category ID.

#### name

```ts
name: string;
```

Category name, e.g. 'Piano'.

***

### languages?

```ts
optional languages?: {
  code: string;
  name: string;
}[];
```

Supported synthesis languages. Present for type 'voice'.

#### code

```ts
code: string;
```

Short language code, e.g. 'zh'.

#### name

```ts
name: string;
```

Full English language name, e.g. 'Chinese'.

***

### note?

```ts
optional note?: string;
```

Explanation of why tagGroups is empty. Present for type 'voice'.

***

### tagGroups?

```ts
optional tagGroups?: unknown[];
```

Always empty: tag groups require a network fetch and are not cached. Present for type 'voice'.
