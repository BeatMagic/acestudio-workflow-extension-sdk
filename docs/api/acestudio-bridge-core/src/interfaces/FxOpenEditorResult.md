# Interface: FxOpenEditorResult

Success payload of `fx open-editor`.

## Properties

### alreadyOpen

```ts
alreadyOpen: boolean;
```

True when a window for this insert was already open and was raised rather than created.

***

### insertId

```ts
insertId: string;
```

Instance id of the insert whose editor was opened.

***

### name?

```ts
optional name?: string;
```

The name shown for that insert.
