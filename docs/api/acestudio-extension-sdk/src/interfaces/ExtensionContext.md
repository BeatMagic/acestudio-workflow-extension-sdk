# Interface: ExtensionContext\<M\>

The context every handler receives — one open session, already handshaken, with
a client typed to what the manifest asked for.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](ExtensionManifest.md) = [`ExtensionManifest`](ExtensionManifest.md)

## Properties

### client

```ts
readonly client: ManifestClient<M>;
```

The operation surface: `ctx.client.clip.list()`, `ctx.client.transport.play()`
— the canonical operation tree, narrowed to the manifest's capability request.
A call the manifest does not ask for is a compile error here.

***

### grant

```ts
readonly grant: Grant;
```

What the session actually reaches. Normally the expansion of the manifest's
request, which is what the user consented to at install — read it when an
extension can do useful work with only part of what it asked for.

***

### manifest

```ts
readonly manifest: M;
```

The manifest this extension was defined with, as written.

## Methods

### exit()

```ts
exit(code?): void;
```

End the run: `deactivate`, then exit with `code` (`0` by default). The natural
ending for a workflow that is done, or one the user cancelled from the
extension's own UI.

ACE Studio's stop control does not depend on this — it works even when an
extension is wedged — so this is a convenience for a clean ending, never the
only way out.

#### Parameters

##### code?

`number`

#### Returns

`void`
