# Interface: PhonemeMoveBoundaryParams

Arguments for `phoneme move-boundary`.

## Properties

### dryRun?

```ts
optional dryRun?: boolean;
```

Solve and report without writing. Answers the question the clamps do not: what a move COSTS the rest of the span. Leaves the undo stack untouched.

***

### index

```ts
index: number;
```

0-based position in that note's phonemes, in emission order. Its LEFT edge is the boundary that moves. The first vowel's left edge is refused: it is pinned at Note Start and never moves, which `phoneme list --with-timings` reports in advance as `boundaryDraggable`.

***

### noteUuids

```ts
noteUuids: string[];
```

UUID of the note the phoneme belongs to, with braces. Exactly one — a boundary is one line. A tenuto note resolves to its group's head note, which is where phoneme data lives. A LIST FOR ONE NOTE, matching `phoneme set` and every other guarded write on this surface. `noteUuids` is the key the stale-write guard resolves a write's target from, so a single-target verb spelling it `noteUuid` would be silently unguarded (ADR 0088 §5).

***

### targetStartSec

```ts
targetStartSec: number;
```

Where to put the boundary, in the response's time base. `phoneme list` reports the legal range as `boundaryMinSec` / `boundaryMaxSec`, in closed form, so a caller plans a move in one call rather than probing for the clamps. A target past either is clamped rather than refused, and the response says where it landed.
