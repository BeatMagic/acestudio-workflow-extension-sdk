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

## [0.5.0] — 2026-08-20

Regenerated against surface **9.0**, from 7.2. Four surface bumps arrive together:
7.3 and 8.1 additive, 8.0 and 9.0 breaking. Read Breaking before upgrading — one of
the two removals fails silently.

### Breaking

- **`trackId` is gone from `import file` and `job place`.** Port
  `trackId: "<uuid>"` to `trackUuid: "<uuid>"`. It is the same value, and on
  `import file` it now names a track of any kind rather than a video layer alone.
  `job place` reports `trackUuid`, `trackIndex` and `region` in place of the
  single `trackId` it used to echo back.

  **Grep your callers rather than waiting for an error.** An undeclared request
  field is dropped by the decoder, so neither removal answers for itself. A call
  still passing `trackId` is read as naming no target at all, and the two verbs
  part ways there: `job place` requires a target, so it fails with `INVALID_ARG`
  for naming no track — a refusal that never mentions the field you passed.
  `import file`'s target is optional, so it **fails silently**: the clip
  auto-routes to the head layer and the call reports success. That is the one to
  search for.

### Added

- **Both time units on every geometry the surface reports.** A clip's geometry is
  stored in one unit — seconds for audio and video, ticks for everything else —
  and reporting only the other one handed back a value rounded to a whole tick,
  with no way for a consumer to recover what the clip actually held.

  Every geometry now carries both. The write echoes (`clip move`, `resize`,
  `split`, `create`, `duplicate`, `import file`, `job place`) add `posSec`,
  `durSec`, `endSec`, `clipInSec`, `sourcePosSec` and `sourceDurSec` beside their
  tick fields; `clip get` and `clip list` carry a `*Tick` and a `*Sec` for each
  quantity; `clip consolidate` adds `rangeBeginSec` / `rangeEndSec`.

  Each payload declares which unit is authoritative in a **`nativeUnit`** field
  (`'second' | 'tick'`). The derived unit is for reading and display: address a
  write in the native one, and a write that accepts both honours the native one.

- **`naturalDurSec` on `import file`** — the source media's own length in seconds,
  as the file carries it. The existing `naturalDur` is that value put through the
  tempo curve and rounded to a tick.

- **Index spaces: `region` beside `trackIndex`.** A track index counts inside one
  region — `arrangement`, `video`, `marker` or `chord` — and an index read against
  the wrong one names an unrelated track. The `track` and `clip` groups now take
  `region` beside `trackIndex`, and results report the region they landed in.
  Omitted, it still means `arrangement`, so existing calls keep their meaning;
  `clip create` defaults it to the region its `type` lives in.

  Four results gained the track identity they were missing: `clip create` and
  `clip duplicate` reported only `trackName` and now carry `trackUuid`,
  `trackIndex` and `region`; `clip consolidate`'s rows and `clip detach-audio`
  had the uuid and gain the index and region. All four report the **landing**
  track, which `onOccupied: 'relocate'` can make differ from the one asked for.

- **`track resolve`** (gated on `track.read`) — turn any addressing form into the
  others, so a caller holding an index can find the uuid without listing.

- **The `fx` group's results say which index space their `trackIndex` counts in**,
  and a chain is reachable positionally wherever it is reachable by uuid.

- Several parameter objects became optional where every field in them was already
  optional, so a no-argument call no longer has to pass `{}`.

## [0.4.1] — 2026-08-18

Regenerated against surface **7.2**. This artifact was pinned at 7.0, so it had
missed one whole additive surface minor as well as the newest one.

### Added

- **A video clip's media identity, on the clip reads.** `clip list` rows and
  `clip get` now carry an optional `videoMedia`: the resolved `sourcePath`, the
  `libraryAsset` handle for a Library-backed clip, `muted`, `hasAudio`, and the
  trim as `clipInSec` / `sourceDurationSec`. Present only for a clip that has
  media — absent for note-based, Chord and Marker clips, the way `noteCount` is
  absent for clips that hold no notes.

  `LibraryAssetRef` therefore appears in this artifact for the first time. That
  follows from the split being per-Operation on the token's audience with no
  per-field partition: `clip.read` is public, so everything that read answers is.

- **The `fx` domain** — `list`, `list-available`, `scan`, `add`, `remove`,
  `reorder`, `set`, `get-params`, `list-params`, `set-param`, `apply-preset`,
  `save-preset`, `set-room`, `open-editor` — gated on the new `fx.read` and
  `fx.write` tokens. That is surface 7.1, which never reached a published build of
  this package; it arrives here alongside 7.2 rather than on its own.

- **The `ui.control` token**, and the chord-track additions to `track list` —
  reachable already, with descriptions that now say so.

### Why this is a patch

Every change is an addition. The removed lines in the generated table are the
`SURFACE_VERSION` constant and four reworded doc comments: no row lost a field and
no signature changed, so nothing a caller depends on moved.

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
