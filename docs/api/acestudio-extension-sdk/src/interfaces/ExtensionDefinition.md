# Interface: ExtensionDefinition\<M\>

What an extension is: its manifest, its command handlers, and its lifecycle
hooks.

The `operations` key is reserved for a later ACE Studio and deliberately absent
from this type, so declaring one is a compile error rather than something that
quietly does nothing.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](ExtensionManifest.md)

## Properties

### activate?

```ts
readonly optional activate?: ExtensionHandler<M>;
```

Startup for a persistent peer — the place to subscribe, serve, and warm up.

***

### commands?

```ts
readonly optional commands?: Readonly<Record<string, ExtensionHandler<M>>>;
```

One handler per command the extension offers, keyed by command name. A
one-shot run is one of these: it is invoked, it runs, the process exits.

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
