# Interface: CaretGetParams

Arguments for `caret get`.

## Properties

### scope?

```ts
optional scope?: string;
```

Scope to query: `"global"`, `"arrangement"` (an alias for global), or `"editor"` (the pattern editor, if one is open). Omitted reads global.
