# Variable: DEBUG\_ENV

```ts
const DEBUG_ENV: "ACE_EXTENSION_SDK_DEBUG" = "ACE_EXTENSION_SDK_DEBUG";
```

Set by the dev tooling to turn on the SDK's own logging — the debug mode ADR 0091 §6
asks for. The `debug` option on `defineExtension` decides either way when it is
passed.

Named for the SDK because that is whose operations it reports: it does not put the
extension into a debug mode of any kind, and what the extension itself logs is its
own business either way.
