# @timedomain/acestudio-extension-sdk

The SDK for building ACE Studio workflow extensions — the extension layer above
[`@timedomain/acestudio-bridge-core`](../acestudio-bridge-core). It owns the
extension lifecycle choreography (connect, handshake, command dispatch, UI
serving, shutdown) so an author writes only handlers.

- `.` — the process-side entry (Node).
- `./page` — the browser-only page side of the UI channel.

> **Status:** package skeleton. The public API is introduced in subsequent
> releases.
