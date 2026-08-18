# Interface: FxScanResult

Success payload of `fx scan`.

## Properties

### full

```ts
full: boolean;
```

Whether this is a full rescan rather than a scan of what changed.

***

### jobClass

```ts
jobClass: string;
```

Always `plugin-scan`.

***

### jobId

```ts
jobId: string;
```

Id of the launched scan job. Settle it with `job wait`, watch it with `job get`, stop it with `job cancel`.
