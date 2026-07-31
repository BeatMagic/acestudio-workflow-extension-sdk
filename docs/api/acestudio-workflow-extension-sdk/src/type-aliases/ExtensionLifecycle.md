# Type Alias: ExtensionLifecycle

```ts
type ExtensionLifecycle = "one-shot" | "persistent";
```

How a workflow's process is run (the lifecycle resolution's two policies on one
runtime model):

- `one-shot` — spawned to run its work through, and reaped when it finishes.
- `persistent` — a long-lived peer, spawned when the user opens its surface,
  alive until stopped.
