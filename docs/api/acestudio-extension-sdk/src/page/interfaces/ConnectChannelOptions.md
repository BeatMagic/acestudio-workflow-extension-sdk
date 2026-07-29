# Interface: ConnectChannelOptions

What [connectChannel](../functions/connectChannel.md) needs, when the defaults are not right.

## Properties

### url?

```ts
readonly optional url?: string;
```

Where the extension's process is serving the channel. Defaults to the page's own
origin, which is what a page served by its extension wants — pass this only when
the page comes from somewhere else, such as a framework dev server on a different
port.
