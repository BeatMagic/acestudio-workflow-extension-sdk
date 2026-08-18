# Type Alias: Camel\<S\>

```ts
type Camel<S> = S extends `${infer Head}-${infer Tail}` ? `${Head}${Capitalize<Camel<Tail>>}` : S;
```

Turns `special-tracks` into `specialTracks`: the canonical tree hyphenates a
multi-word domain and the binding surface camelCases it. The runtime
counterpart is `domainKey()` in `bindings.ts`; the two have to agree, and the
`keyof` constraints below are what notices if they stop.

Exported because [ScopedBindingsOf](ScopedBindingsOf.md) is written in terms of it, and a
recursive conditional type cannot be inlined into the mapped type that uses it.

## Type Parameters

### S

`S` *extends* `string`
