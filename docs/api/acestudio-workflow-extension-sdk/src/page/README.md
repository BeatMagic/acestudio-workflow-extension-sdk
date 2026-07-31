# acestudio-workflow-extension-sdk/src/page

The browser-only page side of an extension's UI channel, imported from
`@timedomain/acestudio-workflow-extension-sdk/page`.

## Remarks

An extension's page and its process share one protocol type: the page names it
once, at [connectChannel](functions/connectChannel.md), and gets back a client whose `call` and `on` are
typed to exactly what the process declared. Nothing here knows about ACE Studio's
bridge — the page talks to its own extension's process and to nothing else, which
is why no capability, token, or session appears in this file.

This entry is a browser build and shares no runtime code with the process-side
entry: it uses `fetch` and nothing else, so it runs in a webview, in a framework
dev server's page, and in a test.

## Interfaces

- [CallOptions](interfaces/CallOptions.md)
- [ConnectChannelOptions](interfaces/ConnectChannelOptions.md)
- [PageChannel](interfaces/PageChannel.md)

## Type Aliases

- [CallArgs](type-aliases/CallArgs.md)

## Functions

- [connectChannel](functions/connectChannel.md)

## References

### CallsOf

Re-exports [CallsOf](../type-aliases/CallsOf.md)

***

### EventsOf

Re-exports [EventsOf](../type-aliases/EventsOf.md)

***

### ParamsOf

Re-exports [ParamsOf](../type-aliases/ParamsOf.md)

***

### ResultOf

Re-exports [ResultOf](../type-aliases/ResultOf.md)

***

### UiCalls

Re-exports [UiCalls](../type-aliases/UiCalls.md)

***

### UiEvents

Re-exports [UiEvents](../type-aliases/UiEvents.md)

***

### UiProtocol

Re-exports [UiProtocol](../interfaces/UiProtocol.md)
