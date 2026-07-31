# @timedomain/acestudio-bridge-core

The connection core for programming against a running ACE Studio — the canonical
handshake over a pluggable message-port transport, the generated capability
bindings, grants, jobs, and one typed error.

This is the layer beneath [`@timedomain/acestudio-workflow-extension-sdk`](../acestudio-workflow-extension-sdk):
consumers that need the connection without the extension runtime depend on it
directly.

> **Status:** published, on the `0.x` line. `connect()`, the transport seam, the generated
> domain bindings and notification subscriptions, grants, the pre-wire capability
> guard, per-op guardrail options, typed-array bulk data, typed job handles, and
> `BridgeError` are all in place. Until 1.0, any minor release may still change the API.
