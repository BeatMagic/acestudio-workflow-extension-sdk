# Type Alias: ExtensionHandler\<M\>

```ts
type ExtensionHandler<M> = (context) => void | Promise<void>;
```

A handler. Whatever it returns is ignored; what matters is when its promise
settles, since that is what ends a one-shot run.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](../interfaces/ExtensionManifest.md)

## Parameters

### context

[`ExtensionContext`](../interfaces/ExtensionContext.md)\<`M`\>

## Returns

`void` \| `Promise`\<`void`\>
