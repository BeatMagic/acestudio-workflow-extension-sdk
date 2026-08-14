# Interface: ProjectRelocatedParams

Payload of `session.projectRelocated`.

## Properties

### projectFolder

```ts
projectFolder: string;
```

Where the peer's project folder is now. On a committed move this is the
destination; on an abandoned one it is the path the peer already had, which
is what makes an unchanged value a bare "carry on".
