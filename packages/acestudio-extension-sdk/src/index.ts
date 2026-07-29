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
 * The browser-only page-side channel ships from the `./page` subpath.
 *
 * @packageDocumentation
 */

export type { CapabilityTokensOf, ManifestClient } from "./client.js";
export type { ExtensionContext } from "./context.js";
export { defineExtension } from "./define-extension.js";
export type {
  Extension,
  ExtensionDefinition,
  ExtensionHandler,
  ExtensionRuntimeOptions,
} from "./define-extension.js";
export { ExtensionError } from "./errors.js";
export { MANIFEST_VERSION, SDK_API_VERSION } from "./manifest.js";
export type {
  AbsoluteFilesystemPath,
  EnumeratedFilesystemScope,
  ExtensionLifecycle,
  ExtensionManifest,
  FilesystemAccess,
  FilesystemScope,
  HostAccess,
  ManifestJson,
  RequestedCapability,
} from "./manifest.js";
export { MANIFEST_FILENAME, serializeManifest, writeManifestJson } from "./manifest-json.js";
export { BRIDGE_SOCKET_ENV, BRIDGE_TOKEN_ENV } from "./spawn-env.js";
export type { Environment } from "./spawn-env.js";
