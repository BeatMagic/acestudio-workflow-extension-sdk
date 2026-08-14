/**
 * The SDK for building ACE Studio workflow extensions — the extension layer
 * above {@link https://www.npmjs.com/package/@timedomain/acestudio-bridge-core | the bridge core}.
 *
 * @remarks
 * Two things live here. {@link defineExtension} owns an extension process's whole
 * choreography — spawn environment, connect, handshake, `activate`, wind-down and
 * exit — so an author writes handlers and nothing else. And the
 * manifest is a TypeScript module ({@link ExtensionManifest}), emitted to the JSON
 * the host and the signer read ({@link serializeManifest}), which is what lets a
 * handler's client be typed down to exactly the capabilities the manifest asked
 * for.
 *
 * The optional UI paved road lives here too: declare `ui: { assets }` and the SDK
 * serves the page on loopback, announces it to ACE Studio, and carries the typed
 * page↔process channel ({@link UiProtocol}). The browser-only other end of that
 * channel ships from the `./page` subpath.
 *
 * @packageDocumentation
 */

export type { ManifestClient } from "./client.js";
export type { ExtensionContext } from "./context.js";
export { defineExtension } from "./define-extension.js";
export type {
  Extension,
  ExtensionDefinition,
  ExtensionHandler,
  ExtensionResumeHandler,
  ExtensionRuntimeOptions,
  ProjectRelocation,
} from "./define-extension.js";
export { ExtensionError } from "./errors.js";
export { MANIFEST_VERSION, SDK_API_VERSION } from "./manifest.js";
export type {
  AbsoluteFilesystemPath,
  DriveLetter,
  EnumeratedFilesystemScope,
  ExtensionLifecycle,
  ExtensionManifest,
  FilesystemAccess,
  FilesystemScope,
  HostAccess,
  ManifestJson,
  RequestedCapability,
  UppercaseDriveLetter,
} from "./manifest.js";
export { MANIFEST_FILENAME, serializeManifest, writeManifestJson } from "./manifest-json.js";
export { BRIDGE_SOCKET_ENV, BRIDGE_TOKEN_ENV, DEBUG_ENV, DEV_LOADED_ENV } from "./spawn-env.js";
export type { Environment } from "./spawn-env.js";
export type { CallHandler, EmitArgs, UiChannel } from "./ui/channel.js";
export type { AssetSource, ServeAssetOptions, ServedAsset } from "./ui/assets.js";
// `ParamsOf` and `ResultOf` are the vocabulary the channel's signatures are written
// in. They are public because those signatures name them: api-extractor refuses to
// describe a public type in terms of hidden ones, and it is right to — a consumer
// reading the report cannot see what a handler is handed otherwise.
export type { CallsOf, EventsOf, ParamsOf, ResultOf, UiCalls, UiEvents, UiProtocol } from "./ui/protocol.js";
export type { ExtensionUiOptions } from "./ui/server.js";
export type { ExtensionUi } from "./ui/surface.js";
