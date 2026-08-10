# Interface: ManifestJson

The manifest as it lands in the bundle: what the author wrote, plus the two
versions the SDK stamps. This is the JSON ACE Studio and the signing service
parse — the shape is theirs, so the order of keys here is the order
[serializeManifest](../functions/serializeManifest.md) emits.

## Extends

- [`ExtensionManifest`](ExtensionManifest.md)

## Properties

### capabilities

```ts
readonly capabilities: readonly CapabilityToken[];
```

Capability tokens and/or Capability Profiles to request. The install dialog
renders the expansion of this list, and the handlers' client is typed down to
exactly it — so a capability that is not here is a compile error at the call
rather than a refusal at run time.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`capabilities`](ExtensionManifest.md#capabilities)

***

### cwd?

```ts
readonly optional cwd?: string;
```

The process's working directory, bundle-relative. Defaults to the entry
script's own directory, which is not necessarily the bundle root.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`cwd`](ExtensionManifest.md#cwd)

***

### description?

```ts
readonly optional description?: string;
```

One line about what the extension does, for the install dialog.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`description`](ExtensionManifest.md#description)

***

### entry

```ts
readonly entry: string;
```

The bundle-relative path of the script Studio runs — the module that calls
[defineExtension](../functions/defineExtension.md). Relative to the bundle root, never absolute and
never climbing out of it.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`entry`](ExtensionManifest.md#entry)

***

### hostAccess?

```ts
readonly optional hostAccess?: HostAccess;
```

What the extension's process may reach beyond the default box.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`hostAccess`](ExtensionManifest.md#hostaccess)

***

### icon?

```ts
readonly optional icon?: string;
```

A bundle-relative path to the icon Studio shows beside the name.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`icon`](ExtensionManifest.md#icon)

***

### id

```ts
readonly id: string;
```

The stable extension id, `developer-slug.extension-slug`: two lowercase
`[a-z0-9-]` slugs joined by one dot, each starting with a letter or digit.
It is an identity, not a domain — a reverse-domain id is refused, since
nobody checks domain ownership.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`id`](ExtensionManifest.md#id)

***

### lifecycle

```ts
readonly lifecycle: ExtensionLifecycle;
```

Which lifecycle policy this workflow runs under.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`lifecycle`](ExtensionManifest.md#lifecycle)

***

### manifestVersion

```ts
readonly manifestVersion: number;
```

The bundle-format version — [MANIFEST\_VERSION](../variables/MANIFEST_VERSION.md).

***

### name

```ts
readonly name: string;
```

The name Studio shows the user, in the workflow window's chrome and the install dialog.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`name`](ExtensionManifest.md#name)

***

### publisher

```ts
readonly publisher: string;
```

Who publishes it, shown beside the name.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`publisher`](ExtensionManifest.md#publisher)

***

### sdkApiVersion

```ts
readonly sdkApiVersion: number;
```

The SDK major the bundle was built against — [SDK\_API\_VERSION](../variables/SDK_API_VERSION.md).

***

### version

```ts
readonly version: string;
```

The extension's own version, as semver. An update that widens the capability request re-prompts for consent.

#### Inherited from

[`ExtensionManifest`](ExtensionManifest.md).[`version`](ExtensionManifest.md#version)
