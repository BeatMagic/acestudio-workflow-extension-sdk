# Interface: ProjectSaveAsParams

Arguments for `project save-as`.

## Properties

### path

```ts
path: string;
```

Destination .acep path. The save wraps it in a project folder, so read `savedPath` from the result for the file that was actually written.
