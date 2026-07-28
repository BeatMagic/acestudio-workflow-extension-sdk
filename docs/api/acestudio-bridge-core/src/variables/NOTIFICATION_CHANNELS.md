# Variable: NOTIFICATION\_CHANNELS

```ts
const NOTIFICATION_CHANNELS: readonly [{
  capability: "job.read";
  channel: "jobs";
  domain: "job";
  method: "onChanged";
}];
```

Every observable channel in this artifact, sorted by channel. The runtime builds one subscription per row and guards it with the row's capability; a channel absent from this table is not observable from this artifact at all.
