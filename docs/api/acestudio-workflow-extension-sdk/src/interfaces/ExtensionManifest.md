# Interface: ExtensionManifest

The manifest an extension author writes.

Two fields of the emitted JSON are deliberately absent here — `manifestVersion`
and `sdkApiVersion`, which describe the bundle format and the SDK that built
the bundle. [serializeManifest](../functions/serializeManifest.md) stamps both.

## Extended by

- [`ManifestJson`](ManifestJson.md)

## Properties

### capabilities

```ts
readonly capabilities: readonly CapabilityToken[];
```

The capability tokens to request. The install dialog renders this list, and the
handlers' client is typed down to exactly it — so a capability that is not here
is a compile error at the call rather than a refusal at run time.

Tokens, with no expansion step: a `surface.*` ceiling is not a capability to
request, and the host refuses a manifest that names one. See
[RequestedCapability](../type-aliases/RequestedCapability.md).

***

### cwd?

```ts
readonly optional cwd?: string;
```

The process's working directory, bundle-relative. Defaults to the entry
script's own directory, which is not necessarily the bundle root.

***

### description?

```ts
readonly optional description?: string;
```

One line about what the extension does, for the install dialog.

***

### entry

```ts
readonly entry: string;
```

The bundle-relative path of the script Studio runs — the module that calls
[defineExtension](../functions/defineExtension.md). Relative to the bundle root, never absolute and
never climbing out of it.

***

### hostAccess?

```ts
readonly optional hostAccess?: HostAccess;
```

What the extension's process may reach beyond the default box.

***

### icon?

```ts
readonly optional icon?: string;
```

A bundle-relative path to the icon Studio shows beside the name.

***

### id

```ts
readonly id: string;
```

The stable extension id, `developer-slug.extension-slug`: two lowercase
`[a-z0-9-]` slugs joined by one dot, each starting with a letter or digit.
It is an identity, not a domain — a reverse-domain id is refused, since
nobody checks domain ownership.

***

### lifecycle

```ts
readonly lifecycle: ExtensionLifecycle;
```

Which lifecycle policy this workflow runs under.

***

### name

```ts
readonly name: string;
```

The name Studio shows the user, in the workflow window's chrome and the install dialog.

***

### publisher

```ts
readonly publisher: string;
```

Who publishes it, shown beside the name.

***

### version

```ts
readonly version: string;
```

The extension's own version, as semver. An update that widens the capability request re-prompts for consent.
