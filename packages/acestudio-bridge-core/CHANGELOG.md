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

## [0.8.1] — 2026-09-15

### Removed

- **The `SURFACE_VERSION_MISMATCH` code is gone.** It was declared in `SdkErrorCode`,
  given an `expected`/`actual` entry in `BridgeErrorDetails`, and listed among the
  handshake failures `connect()` passes through — but nothing ever raised it, and there
  was no `surfaceMismatch()` beside `protocolMismatch()` to construct one. It was the
  discarded first half of a whole-surface gate: one scalar cannot say whether a caller's
  methods have the shape it expects, so refusing a session over it would manufacture
  breakage in setups that function (ADR 0154 §1).

  **Migration:** no runtime path produced it, so what a `catch` sees is unchanged — but
  `SdkErrorCode` is exported, so source naming the literal (an exhaustive switch, or
  `isCode(error, "SURFACE_VERSION_MISMATCH")`) stops compiling and must drop the branch.

  **Why a patch and not the usual minor.** Dropping an exported union member is
  source-breaking for code that names it, which the policy above puts in the minor slot.
  It ships as a patch anyway because no consumer of this package names the code; the
  source break is accepted rather than paid for with a minor bump.

## [0.8.0] — 2026-09-14

Regenerated against the host's contract surface **17.2**; the last release was
generated from **9.0**. The public surface goes from 178 operations to 241 — 86
added, 23 removed or renamed — and six operation groups are new. Nothing in this
package is hand-written: the numbers below are what the host now serves.

### Breaking

- **Plugin instances are addressed as `audioPlugin.*`, not `fx.*`.** `fx` now means
  the chain — the slots on a track, and the saved chains you can apply to one — and
  the verbs that address a plugin *in* a slot moved out of it. Eleven methods were
  removed from `fx`:

  | was | now |
  | --- | --- |
  | `fx.set` | `audioPlugin.set` |
  | `fx.list` | `audioPlugin.slots` |
  | `fx.scan` | `audioPlugin.scan` |
  | `fx.listAvailable` | `audioPlugin.listAvailable` |
  | `fx.getParams` | `audioPlugin.getParams` |
  | `fx.listParams` | `audioPlugin.listParams` |
  | `fx.setParam` | `audioPlugin.setParam` |
  | `fx.applyPreset` | `audioPlugin.applyPreset` |
  | `fx.savePreset` | `audioPlugin.savePreset` |
  | `fx.openEditor` | `audioPlugin.editor.open` |

  `fx.add`, `fx.remove`, `fx.reorder` and `fx.setRoom` keep their names.

- **The `fx.read` and `fx.write` capability tokens are gone**, replaced by
  `audioplugin.read`, `audioplugin.write` and `audioplugin.control`. The tokens are
  the contract, so a grant asking for `fx.write` now asks for a token that does not
  exist. The surviving `fx.*` methods are gated by `audioplugin.write` as well — the
  chain verbs and the plugin verbs share one write token.

  Bindings refuse an ungranted call locally, before the wire, so a stale grant shows
  up as a refusal from this package rather than an error from the host.

- **The generative operations were renamed to the features they are.**

  | was | now |
  | --- | --- |
  | `generative.addLayer` | `generative.addALayer` |
  | `generative.song` | `generative.inspireMe` |
  | `generative.enhance` | `generative.musicEnhancer` |
  | `generative.stemSplit` | `generative.stemSplitter` |
  | `generative.vocal2midi` | `generative.vocalToMidi` |
  | `generative.voiceChange` | `generative.voiceChanger.convert` |

  Their capability tokens were renamed to match — `generative.song` →
  `generative.inspire-me`, and so on for each.

- **`note.setLyric` is now `note.setGrapheme`.** What it takes is a grapheme, which
  is what the host has always read it as.

- **`export.fcpxml` is now `export.timeline`**, and writes AAF as well as FCPXML —
  the output path's extension picks the format.

- **A result child no longer carries `payload`.** `job get`, `job list`,
  `job results` and `job wait` all reported an open `payload` map on each result
  child. The field is now `@unpresented` — withdrawn from the published surface,
  not deleted — because it was never the delivery contract: a data class's answer
  is read through the retrieval its launch declares. Each child gained
  `errorCode?` and `errorMessage?` in its place, so a failed result says why.

  **Migration:** read the product through the class's own retrieval. For a beat
  analysis that is the new `tempo.getAnalysis`, which takes the `analysisId`
  that `tempo.analyzeContextAudio` answered and works whenever the caller asks —
  not only while someone was watching the job settle. It needs `tempo.read`, so
  a caller holding only `audio.context` must ask for that token too.

- **An FX slot is an *instance*, not an *insert*.** `fx.remove` and `fx.reorder`
  take `instance` where they took `insert`, and answer `instanceId` where they
  answered `insertId`; `fx.add`'s `insert.insertId` is now `insert.instanceId`.
  `fx.add` also reports `insert.editorState` (`open`, `parked`).

- **`vocalparam` addresses a *param*, not a *category*.** `vocalparam.read`,
  `vocalparam.write` and `vocalparam.layers` take `param` where they took
  `category`, and report it back under that name. `vocalparam.layers` renames
  the collection to match — `categories` → `params`, `categoryCount` →
  `paramCount` — and each entry gains `displayName` and `shape`, with
  `vocalControlRoute` on the result.

- **Removed with no replacement on this surface:** `generative.seedAudio`,
  `generative.soundEffects`, `generative.text2sample`, `instrument.enable` and
  `instrument.disable`. A call to any of these was already answered `-32601` by a
  current host.

### Added

- **Six new operation groups**: `audioPlugin` (29 methods, including a full
  `audioPlugin.editor.*` input surface), `phoneme` (9), `midiparam` (8), `chord` (4),
  `breath` (3) and `lyric` (1).
- **Saved FX chains**: `fx.applyChain`, `fx.saveChain`, `fx.listChains`,
  `fx.findChains`, `fx.insertChain`, `fx.moveChain`, `fx.removeChain`,
  `fx.importChain`, `fx.exportChain`.
- **Generative run history**: `generative.inspireMe.history.list` / `.get` and
  `generative.musicEnhancer.history.list` / `.get`, plus
  `generative.voiceChanger.models`, behind the new `generative-history.read` token.
- **Note language**: `note.setLanguage`, beside `note.setGrapheme`.
- **Track audition**: `track.audition.note`, `.noteOn`, `.noteOff` and `.noteClear`,
  behind the new `track.audition` token.
- **Also new**: `clip.beatContent`, `job.download`, `tempo.getAnalysis`,
  `vocalparam.setVoicing`, and the `midiparam.read` / `midiparam.write` tokens.
- **Dual-unit geometry** reaches the reads that were still tick-only:
  `selection.get` now reports `nativeUnit`, and `clip.list` rows carry `audioMedia`
  and `videoMedia`, so a caller mirroring a timeline no longer needs one `clip.get`
  per clip.

### Changed

- **`SURFACE_VERSION` is `'17.2'`.** It advises and counts; it gates nothing. The
  protocol version is the only number the handshake refuses over, so a consumer on
  an older surface still connects and simply cannot reach what it has no bindings
  for.
- **37 writes declare a fingerprint precondition**, up from 18 — every write in the
  new `phoneme`, `midiparam`, `chord`, `breath` and `lyric` groups, plus
  `audio-plugin apply-preset`, `audio-plugin set-param` and `vocalparam
  set-voicing`.

## [0.7.0] — 2026-08-22

### Breaking

- **Every operation is called as its own JSON-RPC method.** The client sent all 151
  of them through a single `operation.invoke`, carrying the canonical path in the
  payload. The host retired that verb — it now serves each operation under its own
  name, `track list` as `track.list` — so every call this package made was answered
  `-32601 Method 'operation.invoke' not found`. The runtime now sends
  `OperationDescriptor.wire`, the name the generated table has carried since 0.5.0
  and nothing consumed.

  **Migration: take this version.** Nothing in the typed client changes — the same
  `client.track.list()` reaches the same operation. What changes is the method name
  on the wire, so 0.6.x cannot call a current Studio at all and this can.

- **The invocation envelope is gone from the public API.** `Operation.acerpc.ts` was
  generated from an IDL file the host deleted, so `OperationClient`, `InvokeParams`,
  `InvokeResult` and `InvokeWarning` are no longer exported. Only code that built a
  raw invocation by hand named them; a caller of the typed client did not.

  The reserved keys `fingerprint` and `waitTimeoutMs` now ride inside the params
  object, which is where the host reads them from (ADR 0088 §4, §5) — there is no
  envelope left to put them beside the payload.

### Changed

- **Advisory warnings arrive from the result rather than the envelope.** An
  operation that raises them declares `warnings` on its own result type, so it can
  be read typed. {@link BridgeConnection.onWarning} is unchanged and still sees
  every warning from every call — a caller that does not care about advisories
  still never has to branch to stay correct.

### Fixed

- **The tests can no longer agree with the client about a name the host does not
  serve.** The scripted host peer named the invocation verb as a literal, so it
  shared the client's mistake and stayed green through all of it. It now derives
  the methods it serves from the surface table's `wire` column and refuses anything
  else with `-32601`, the way the real dispatcher does. A new conformance suite
  drives all 151 operations and asserts each one goes out under its declared name.

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
