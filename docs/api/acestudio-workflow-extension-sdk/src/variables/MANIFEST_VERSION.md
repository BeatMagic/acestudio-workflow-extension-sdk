# Variable: MANIFEST\_VERSION

```ts
const MANIFEST_VERSION: 1 = 1;
```

The bundle-format version this SDK emits. A hard forward-compatibility gate on
the host: a Studio that does not know a version refuses the bundle rather than
guessing at it.
