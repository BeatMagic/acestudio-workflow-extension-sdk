# acestudio-workflow-extension-sdk/src

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

The optional UI paved road lives here too: declare `ui: { assets }` and the SDK
serves the page on loopback, announces it to ACE Studio, and carries the typed
page↔process channel ([UiProtocol](interfaces/UiProtocol.md)). The browser-only other end of that
channel ships from the `./page` subpath.

## Classes

- [ExtensionError](classes/ExtensionError.md)

## Interfaces

- [Extension](interfaces/Extension.md)
- [ExtensionContext](interfaces/ExtensionContext.md)
- [ExtensionDefinition](interfaces/ExtensionDefinition.md)
- [ExtensionManifest](interfaces/ExtensionManifest.md)
- [ExtensionRuntimeOptions](interfaces/ExtensionRuntimeOptions.md)
- [ExtensionUi](interfaces/ExtensionUi.md)
- [ExtensionUiOptions](interfaces/ExtensionUiOptions.md)
- [FilesystemAccess](interfaces/FilesystemAccess.md)
- [HostAccess](interfaces/HostAccess.md)
- [ManifestJson](interfaces/ManifestJson.md)
- [ServeAssetOptions](interfaces/ServeAssetOptions.md)
- [ServedAsset](interfaces/ServedAsset.md)
- [UiChannel](interfaces/UiChannel.md)
- [UiProtocol](interfaces/UiProtocol.md)

## Type Aliases

- [AbsoluteFilesystemPath](type-aliases/AbsoluteFilesystemPath.md)
- [AssetSource](type-aliases/AssetSource.md)
- [CallHandler](type-aliases/CallHandler.md)
- [CallsOf](type-aliases/CallsOf.md)
- [DriveLetter](type-aliases/DriveLetter.md)
- [EmitArgs](type-aliases/EmitArgs.md)
- [EnumeratedFilesystemScope](type-aliases/EnumeratedFilesystemScope.md)
- [Environment](type-aliases/Environment.md)
- [EventsOf](type-aliases/EventsOf.md)
- [ExtensionHandler](type-aliases/ExtensionHandler.md)
- [ExtensionLifecycle](type-aliases/ExtensionLifecycle.md)
- [FilesystemScope](type-aliases/FilesystemScope.md)
- [ManifestClient](type-aliases/ManifestClient.md)
- [ParamsOf](type-aliases/ParamsOf.md)
- [RequestedCapability](type-aliases/RequestedCapability.md)
- [ResultOf](type-aliases/ResultOf.md)
- [UiCalls](type-aliases/UiCalls.md)
- [UiEvents](type-aliases/UiEvents.md)
- [UppercaseDriveLetter](type-aliases/UppercaseDriveLetter.md)

## Variables

- [BRIDGE\_SOCKET\_ENV](variables/BRIDGE_SOCKET_ENV.md)
- [BRIDGE\_TOKEN\_ENV](variables/BRIDGE_TOKEN_ENV.md)
- [DEBUG\_ENV](variables/DEBUG_ENV.md)
- [DEV\_LOADED\_ENV](variables/DEV_LOADED_ENV.md)
- [MANIFEST\_FILENAME](variables/MANIFEST_FILENAME.md)
- [MANIFEST\_VERSION](variables/MANIFEST_VERSION.md)
- [SDK\_API\_VERSION](variables/SDK_API_VERSION.md)

## Functions

- [defineExtension](functions/defineExtension.md)
- [serializeManifest](functions/serializeManifest.md)
- [writeManifestJson](functions/writeManifestJson.md)
