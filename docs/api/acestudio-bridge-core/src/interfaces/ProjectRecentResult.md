# Interface: ProjectRecentResult

Success payload of `project recent`.

## Properties

### count

```ts
count: number;
```

Number of entries in `projects`.

***

### projects

```ts
projects: {
  exists: boolean;
  lastRead: string;
  path: string;
  projectName: string;
}[];
```

Recently opened projects, most recently read first.

#### exists

```ts
exists: boolean;
```

Whether the file is still on disk. A recent entry outlives the file it names.

#### lastRead

```ts
lastRead: string;
```

When the project was last opened, ISO 8601. Empty if the record never got a timestamp written.

#### path

```ts
path: string;
```

Absolute path of the project file.

#### projectName

```ts
projectName: string;
```

Project filename without extension.
