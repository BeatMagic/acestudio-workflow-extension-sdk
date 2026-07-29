# Type Alias: UiCalls

```ts
type UiCalls = Readonly<Record<string, (params) => unknown>>;
```

A page→process call, written as an ordinary method signature: what the page
passes and what it gets back. An `async` signature is fine — the page always
awaits, so `Promise<T>` and `T` mean the same thing to a caller.

The constraint is `(params: never) => unknown` rather than a looser `unknown`
parameter because that is the shape *every* function is assignable to: a
parameter type is contravariant, so `never` accepts any of them, and a
declaration is checked at the point that matters — where the handler is written.
