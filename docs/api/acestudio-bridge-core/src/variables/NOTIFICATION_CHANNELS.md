# Variable: NOTIFICATION\_CHANNELS

```ts
const NOTIFICATION_CHANNELS: readonly [{
  capability: "canvas.read";
  domain: "canvas";
  method: "onChanged";
  notification: "canvas.changed";
}, {
  capability: "clip.read";
  domain: "clip";
  method: "onChanged";
  notification: "clips.changed";
}, {
  capability: "job.read";
  domain: "job";
  method: "onChanged";
  notification: "jobs.changed";
}, {
  capability: "project.read";
  domain: "project";
  method: "onChanged";
  notification: "project.changed";
}, {
  capability: "selection.read";
  domain: "selection";
  method: "onChanged";
  notification: "selection.changed";
}, {
  capability: "tempo.read";
  domain: "tempo";
  method: "onChanged";
  notification: "tempo.changed";
}, {
  capability: "track.read";
  domain: "track";
  method: "onChanged";
  notification: "tracks.changed";
}, {
  capability: "transport.state";
  domain: "transport";
  method: "onChanged";
  notification: "transport.changed";
}, {
  capability: "ui.state";
  domain: "ui";
  method: "onChanged";
  notification: "ui.changed";
}];
```

Every observable channel in this artifact, sorted by notification. The runtime binds one handler per row and guards the subscribe with the row's capability; a channel absent from this table is not observable from this artifact at all.
