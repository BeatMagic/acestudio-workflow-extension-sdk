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

***

### quiesce?

```ts
readonly optional quiesce?: ExtensionHandler<M>;
```

Stop writing under the project folder, so ACE Studio can relocate it — a
Save-As, or the first save of a project that until now lived in a temporary
one. Flush what is in flight and release every handle you hold there, then
resolve. The save blocks until you do.

This is not a request the extension may decline. ACE Studio does not wait past
its deadline, and an extension that cannot stop writing is in a state to fix
rather than one to report — so there is no way to answer "no", and throwing
says the extension is broken, not that it refused.

Do not finish long work here. Checkpoint it and pick it up in
[ExtensionDefinition.resume](#resume), and stay stopped until then: reopening as
soon as this resolves would race the copy the ack just authorized.

Required when the manifest requests `session.move`, and refused otherwise —
the token is the duty, and an extension holding it with no hook would have ACE
Studio told the folder was quiesced by a peer that never stopped writing. An
extension that holds nothing open declares an empty one, which says so.

***

### resume?

```ts
readonly optional resume?: ExtensionResumeHandler<M>;
```

The move is over and the extension may write again, told where the project
folder is now — the destination on a committed move, the path it already had
on an abandoned one, which is what makes an unchanged value a bare "carry on".

Runs on both endings, because a quiesced extension that is never told parks
for good. Optional: an extension that reopens nothing needs no resume, and one
that holds only paths it recomputes needs none either.

Declaring it requires `session.move` in the manifest, which gates the
announcement as well as the quiesce — without the token nothing is sent, and
this would never run.

***

### ui?

```ts
readonly optional ui?: ExtensionUiOptions;
```

The UI paved road: point it at the built page and the SDK serves it on loopback
and announces the URL to ACE Studio before `activate` runs.

Optional because it is a convenience, not the way in. An extension that runs its
own server — a framework's production server, a dev server — leaves this out and
calls `ctx.ui.announceSurface(url)` with its own URL.
