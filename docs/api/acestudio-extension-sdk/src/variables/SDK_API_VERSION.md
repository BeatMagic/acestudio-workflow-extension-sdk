# Variable: SDK\_API\_VERSION

```ts
const SDK_API_VERSION: 1 = 1;
```

The extension-SDK major version an extension built against this package
declares. The host keeps a supported-majors range and refuses a bundle outside
it, so an extension never half-runs on an incompatible Studio.

It is stamped by [serializeManifest](../functions/serializeManifest.md) rather than authored: it describes
which SDK built the bundle, which is something the SDK knows and an author can
only restate — or get wrong.
