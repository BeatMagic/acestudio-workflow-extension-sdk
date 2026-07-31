# Interface: ServeAssetOptions

What [ExtensionUi.serveAsset](ExtensionUi.md#serveasset) needs when the defaults are not right.

## Properties

### contentType?

```ts
readonly optional contentType?: string;
```

The `content-type` to serve the bytes as. Inferred from a file path's extension
when it is one this SDK knows, and `application/octet-stream` otherwise — so
bytes and streams usually want this set.
