# Changelog

All notable changes to `@timedomain/acestudio-bridge-core` are recorded here. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**Versioning policy.** This package is pre-1.0, so the **minor** slot carries
breaking changes and the patch slot carries everything else. A caret on a 0.x version
stops at the next minor — `^0.4.0` resolves `>=0.4.0 <0.5.0` — so it will not pull a
break. A range spanning minors, such as `^0` or `0.x`, will. Every breaking change
appears under a `Breaking` heading with what to change.

Entries from 0.3.2 down were reconstructed from git history rather than written at
the time, so read them as a summary of each release's headline change and the PR as
the record.

## [0.4.0] — 2026-08-18

A capability facade covers a domain's **subscriptions** as much as its calls.

### Breaking

- **`ScopedBindings<T>` gained members.** A domain now arrives with the change
  channels `T` reaches beside the operations it reaches, so
  `scoped('surface.canvas.read').canvas` carries `onChanged`. Additive for a caller,
  but an exact-equality assertion against the old shape will fail — widen it.
- **`Reachable<T>`, `InDomain<T>` and `AtRoot<T>` now admit channel rows.** They
  describe both of this artifact's tables rather than only its operations, so a row
  they yield no longer necessarily carries `path`, `ungated`, `mutating`,
  `fingerprintPrecondition` or `takesParams`. Read `Descriptor` directly where you
  need the operation table alone; `ChannelRow` is the channel table, and
  `ArtifactRow` is the union these three are now written over.

### Added

- **`SurfaceRow`** — what scoping needs from a generated row: `domain`, `method`,
  `capability`. It is the bound on `ScopedBindingsOf`'s `Rows` parameter, replacing
  `OperationDescriptor`, which is a loosening: both `OperationDescriptor` and
  `ChannelDescriptor` satisfy it. Callers pass more kinds of row than before and none
  fewer.
- **`ChannelRow`** and **`ArtifactRow`** — this artifact's channel table as a type,
  and the union of both tables.

### Why

`canvas.changed` is gated by `canvas.read` — the same token `canvas info` needs. A
facade built only from the operation table reported that channel as ungranted, so a
caller that had asserted a profile still had to leave the facade to subscribe, and
the facade was an incomplete account of the profile it named. The filter is per row,
not per domain, which is what lets a token reach a domain by its channel alone
without also handing over a write it was never granted.

## [0.3.2] — 2026-08-18

Scoping generalized to any surface: `ScopedBindingsOf` takes the descriptor table and
the bindings as parameters, so a profile whose tokens span this artifact and a
first-party one no longer reports half its reach as ungranted (#45, #46).

## [0.3.1] — 2026-08-17

A bindings claim needs the surface that builds it (#43).

## [0.3.0] — 2026-08-17

`connect()` takes the driver's surface rather than the public tables, which is what
lets a privileged artifact ride the same binding runtime (#42).

## [0.2.0] — 2026-08-17

The pre-relocation quiesce and its release: the host's `session.prepareMove` request
is answered, and `onProjectRelocated` reports the move's outcome (#37, #41).

## [0.1.2] — 2026-07-31

Docs only — every README opens with what its package is for (#30).

## [0.1.1] — 2026-07-31

Renamed for workflow extensions (#28).

## [0.1.0] — 2026-07-31

First published version: repaired type declarations and the release path (#27).

[0.4.0]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/47
[0.3.2]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/46
[0.3.1]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/43
[0.3.0]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/42
[0.2.0]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/41
[0.1.2]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/30
[0.1.1]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/28
[0.1.0]: https://github.com/BeatMagic/acestudio-workflow-extension-sdk/pull/27
