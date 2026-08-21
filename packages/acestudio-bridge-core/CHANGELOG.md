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

## [0.6.0] — 2026-08-22

### Breaking

- **`PROTOCOL_VERSION` is 2.** Studio moved the core seam to protocol 2 (ACE Studio
  #2585) and this side never followed, so every peer built on 0.5.x sends 1 and is
  refused at the handshake with `incompatible protocol version: runtime 1, studio 2`
  — before capability negotiation, so the failure carries no capability detail and
  reads as a bare disconnect.

  **Migration: take this version.** Nothing in your code changes. The constant is a
  major with no minor for a host to tolerate, so it has to equal Studio's
  `kCoreSessionProtocolVersion` exactly, and `WorkflowExtensionHandshake::kProtocolVersion`
  is an alias of that same constant — one integer for the whole core seam.

  Marked breaking because a peer on this version can no longer complete a handshake
  with a host on protocol 1. No released Studio is such a host: the seam is
  post-convergence, and a fielded 2.1.x Studio is reached over the separate legacy MV
  handshake, which carries no protocol integer.

## [0.5.1] — 2026-08-22

### Changed

- **`PROFILES['timeline.tempo.v1']` now expands to all four tempo tokens** —
  `tempo.analyze`, `tempo.applyV2`, `tempo.read` and `tempo.write`, where it carried
  `tempo.applyV2` alone. The profile named the tempo surface and covered one verb of
  it, so a caller asking for the feature by name got an apply it could not feed and
  could not read the result of.

  Not breaking, and not a change of authority. This table reports what the host's
  capability registry grants; the widening happened there, so a consumer on 0.5.0
  talking to a current Studio already receives the wider grant. Reading `PROFILES`
  is how you find out.

## [0.5.0] — 2026-08-21

Regenerated against surface **9.0**, two majors on from the 7.2 this artifact was
pinned at.

### Breaking

- **`OperationDescriptor` gains a required `wire`** — the JSON-RPC method the host
  actually serves an operation as. It was previously re-derived from `domain` and
  `method`, which coincides with the served name only while every path is two
  segments and none is a wildcard route; emitting it ends the guess. **Send `wire`,
  not `path`.**

  This only breaks code that *constructs* a descriptor — a hand-built table, or a
  test fixture standing in for a second artifact's rows. Reading the generated
  `OPERATIONS` is unaffected.

- **Fields that a result cannot always answer are now optional.** A result had been
  declaring as required several fields the host omits in real states, so a caller
  who trusted the type read `undefined` where it expected a value. The types now say
  what the host actually sends:

  - `CaretGetResult.trackIndex` — absent together with `region` when the project
    cannot place the caret's track.
  - `TrackGetResult` — `trackName`, `rawName`, `color`, `mixer`, `recordInput`, and
    `mixer`'s own `mute` / `pan` / `solo`: the master bus and an empty slot have no
    name to rename, no colour, and no per-track mix.
  - `TrackListResult` rows — `clipCount`, `trackName`, `trackUuid`, for the same
    reason.
  - Every blend result's `group`, `id` and `ref` — absent when the recipe is a
    track's live mix that names no library voice. `saveState` is what says whether
    there is a recipe worth saving.
  - `RecordingStartResult` — `trackIndex`, `begin`, `end`.
  - `JobPlaceResult.trackId`.

  **Migration: narrow before use.** Under `strictNullChecks` the compiler points at
  every site; each one was already a latent runtime bug.

- **Parameters that name a track or a blend are now optional**, because a second
  spelling can supply the same subject — `trackUuid` beside `trackIndex`,
  `region` beside either. Widening, so no call needs changing.

### Added

- **`blend promote`** — save a track's voice mix into the blended-voice library
  (`BlendPromoteParams` / `BlendPromoteResult`).
- **`track resolve`** (`TrackResolveParams` / `TrackResolveResult`).
- **`region` on the track-addressing params and results**, naming which index space
  a `trackIndex` counts in — `arrangement`, `video`, `marker` or `chord`. Position 1
  names a different track in each band, so the index is unreadable without it.
- **`saveState`** on the results that describe a track's voice mix, saying how far
  the mix has travelled from the stock voice it was mounted as.

### Changed

- `SURFACE_VERSION` is `'9.0'`.

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
