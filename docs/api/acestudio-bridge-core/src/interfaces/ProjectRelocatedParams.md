# Interface: ProjectRelocatedParams

Payload of `session.projectRelocated`.

## Properties

### previousProjectFolder?

```ts
optional previousProjectFolder?: string;
```

Where it was. Present only on a committed move — an abandoned one moved
nothing, so there is no previous path distinct from the current one, and
reporting the same value twice would read as a move that did happen.

Carried so the announcement is self-contained: a peer repointing its cached
paths can rewrite them from the pair it was handed, instead of diffing
against whatever it believes it was holding. A peer that missed the
announcement entirely reads `project session-folder`, which reports the same
fact about the MV session folder.

***

### projectFolder

```ts
projectFolder: string;
```

Where the peer's project folder is now. On a committed move this is the
destination; on an abandoned one it is the path the peer already had, which
is what makes an unchanged value a bare "carry on".
