# Interface: ExtensionDefinition\<M\>

What an extension is: its manifest, its entry point, and its wind-down.

The `operations` key is reserved for a later ACE Studio and deliberately absent
from this type, so declaring one is a compile error rather than something that
quietly does nothing.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](ExtensionManifest.md)

## Properties

### activate

```ts
readonly activate: ExtensionHandler<M>;
```

The extension's one entry point, and the whole of what the SDK will call. A
one-shot's run is over when it resolves; a persistent peer serves its UI from
here and stays up. Nothing about *what* the extension does belongs to the
platform: the user decides that in the interface the extension draws.

***

### deactivate?

```ts
readonly optional deactivate?: ExtensionHandler<M>;
```

Wind-down, run once before the process exits: on ACE Studio's stop (inside the
grace window), when a one-shot finishes, and on [ExtensionContext.exit](ExtensionContext.md#exit).
It does not run if `activate` threw — there is nothing wound up to wind down —
nor when the bridge drops, since by then every call inside it would fail.

***

### manifest

```ts
readonly manifest: M;
```

The manifest module, written `as const satisfies ExtensionManifest`.
