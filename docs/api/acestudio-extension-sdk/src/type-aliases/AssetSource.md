# Type Alias: AssetSource

```ts
type AssetSource = string | Uint8Array | Readable;
```

What [ExtensionUi.serveAsset](../interfaces/ExtensionUi.md#serveasset) will serve.

A path or a `Uint8Array` can be seeked inside, so both answer range requests in
full — which is what `<video>` and `<audio>` need. A `Readable` cannot: it is
served once, whole, and a range request for it gets the whole body. Point a media
element at a file when the user is going to scrub through it.
