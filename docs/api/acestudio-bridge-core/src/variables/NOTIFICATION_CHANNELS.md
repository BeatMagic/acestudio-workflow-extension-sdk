# Variable: NOTIFICATION\_CHANNELS

```ts
const NOTIFICATION_CHANNELS: readonly [{
  capability: "canvas.read";
  channel: "canvas";
  domain: "canvas";
  method: "onChanged";
}, {
  capability: "clip.read";
  channel: "clips";
  domain: "clip";
  method: "onChanged";
}, {
  capability: "job.read";
  channel: "jobs";
  domain: "job";
  method: "onChanged";
}, {
  capability: "project.read";
  channel: "project";
  domain: "project";
  method: "onChanged";
}, {
  capability: "selection.read";
  channel: "selection";
  domain: "selection";
  method: "onChanged";
}, {
  capability: "tempo.read";
  channel: "tempo";
  domain: "tempo";
  method: "onChanged";
}, {
  capability: "track.read";
  channel: "tracks";
  domain: "track";
  method: "onChanged";
}, {
  capability: "transport.state";
  channel: "transport";
  domain: "transport";
  method: "onChanged";
}, {
  capability: "ui.state";
  channel: "ui";
  domain: "ui";
  method: "onChanged";
}];
```

Every observable channel in this artifact, sorted by channel. The runtime builds one subscription per row and guards it with the row's capability; a channel absent from this table is not observable from this artifact at all.
