# acestudio-extension-sdk/src

The SDK for building ACE Studio workflow extensions — the extension layer
above [the bridge core](https://www.npmjs.com/package/@timedomain/acestudio-bridge-core).

## Remarks

Two things live here. [defineExtension](functions/defineExtension.md) owns an extension process's whole
choreography — spawn environment, connect, handshake, `activate`, wind-down and
exit — so an author writes handlers and nothing else. And the
manifest is a TypeScript module ([ExtensionManifest](interfaces/ExtensionManifest.md)), emitted to the JSON
the host and the signer read ([serializeManifest](functions/serializeManifest.md)), which is what lets a
handler's client be typed down to exactly the capabilities the manifest asked
for.

The browser-only page-side channel ships from the `./page` subpath.

## Classes

- [ExtensionError](classes/ExtensionError.md)

## Interfaces

- [Extension](interfaces/Extension.md)
- [ExtensionContext](interfaces/ExtensionContext.md)
- [ExtensionDefinition](interfaces/ExtensionDefinition.md)
- [ExtensionManifest](interfaces/ExtensionManifest.md)
- [ExtensionRuntimeOptions](interfaces/ExtensionRuntimeOptions.md)
- [FilesystemAccess](interfaces/FilesystemAccess.md)
- [HostAccess](interfaces/HostAccess.md)
- [ManifestJson](interfaces/ManifestJson.md)

## Type Aliases

- [AbsoluteFilesystemPath](type-aliases/AbsoluteFilesystemPath.md)
- [CapabilityTokensOf](type-aliases/CapabilityTokensOf.md)
- [DriveLetter](type-aliases/DriveLetter.md)
- [EnumeratedFilesystemScope](type-aliases/EnumeratedFilesystemScope.md)
- [Environment](type-aliases/Environment.md)
- [ExtensionHandler](type-aliases/ExtensionHandler.md)
- [ExtensionLifecycle](type-aliases/ExtensionLifecycle.md)
- [FilesystemScope](type-aliases/FilesystemScope.md)
- [ManifestClient](type-aliases/ManifestClient.md)
- [RequestedCapability](type-aliases/RequestedCapability.md)
- [UppercaseDriveLetter](type-aliases/UppercaseDriveLetter.md)

## Variables

- [BRIDGE\_SOCKET\_ENV](variables/BRIDGE_SOCKET_ENV.md)
- [BRIDGE\_TOKEN\_ENV](variables/BRIDGE_TOKEN_ENV.md)
- [MANIFEST\_FILENAME](variables/MANIFEST_FILENAME.md)
- [MANIFEST\_VERSION](variables/MANIFEST_VERSION.md)
- [SDK\_API\_VERSION](variables/SDK_API_VERSION.md)

## Functions

- [defineExtension](functions/defineExtension.md)
- [serializeManifest](functions/serializeManifest.md)
- [writeManifestJson](functions/writeManifestJson.md)
