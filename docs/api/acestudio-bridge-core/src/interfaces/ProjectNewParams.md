# Interface: ProjectNewParams

Arguments for `project new`.

## Properties

### discardChanges?

```ts
optional discardChanges?: boolean;
```

Proceed even if the current project has unsaved changes, discarding them. Without this, a dirty project fails `UNSAVED_CHANGES`.

***

### template?

```ts
optional template?: string | null;
```

Start from a song template archive (.acet) instead of an empty project.
