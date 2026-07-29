# Interface: ConnectChannelOptions

What [connectChannel](../functions/connectChannel.md) needs, when the defaults are not right.

## Properties

### url?

```ts
readonly optional url?: string;
```

Where the extension's process is serving the channel.

Rarely needed. A page served by its own extension finds the channel on its own
origin; a page served by a dev server finds it from the origin the SDK attached to
the URL it announced. This is for a page that arrived by neither route.
