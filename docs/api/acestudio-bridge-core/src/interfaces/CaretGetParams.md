# Interface: CaretGetParams

Arguments for `caret get`.

## Properties

### scope?

```ts
optional scope?: string | null;
```

Scope to query: `"global"`, `"arrangement"` (alias for global), or `"editor"` (pattern editor, if open). Defaults to `"global"` when omitted.
