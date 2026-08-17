# Type Alias: ChangeCapability

```ts
type ChangeCapability = 
  | "audio.context"
  | "auth.token"
  | "canvas.read"
  | "clip.read"
  | "job.read"
  | "monitor.stream"
  | "mvupdate.status"
  | "project.read"
  | "selection.read"
  | "tempo.read"
  | "track.read"
  | "transport.state"
  | "ui.state";
```

A capability token declared in the IDL. Each method/notification is gated by exactly one (ADR 0015).
