# Type Alias: ExtensionResumeHandler\<M\>

```ts
type ExtensionResumeHandler<M> = (context, relocation) => void | Promise<void>;
```

The resume half of the move exchange, handed where the project folder ended up.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](../interfaces/ExtensionManifest.md)

## Parameters

### context

[`ExtensionContext`](../interfaces/ExtensionContext.md)\<`M`\>

### relocation

[`ProjectRelocation`](ProjectRelocation.md)

## Returns

`void` \| `Promise`\<`void`\>
