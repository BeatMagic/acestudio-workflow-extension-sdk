# Interface: FxListChainsParams

Arguments for `fx list-chains`.

## Properties

### folder?

```ts
optional folder?: string;
```

The folder to list: a `/`-separated path under the FX Chains directory. Omit it, or pass the empty string, for the directory itself. A folder that does not exist is refused with NOT_FOUND.

***

### recursive?

```ts
optional recursive?: boolean;
```

List the whole tree under `folder` rather than its one level: every chain filed there or deeper, and every folder beneath it.
