# Type Alias: AtRoot\<T\>

```ts
type AtRoot<T> = Extract<Reachable<T>, {
  domain: "";
}>;
```

## Type Parameters

### T

`T` *extends* [`CapabilityToken`](CapabilityToken.md)

## See

[InDomain](InDomain.md)
