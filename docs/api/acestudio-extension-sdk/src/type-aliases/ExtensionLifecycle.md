# Type Alias: ExtensionLifecycle

```ts
type ExtensionLifecycle = "one-shot" | "persistent";
```

How a workflow's process is run (the lifecycle resolution's two policies on one
runtime model):

- `one-shot` — spawned to run a command, and reaped when it finishes.
- `persistent` — a long-lived peer, spawned when the user opens its surface or
  first invokes it, alive until stopped.
