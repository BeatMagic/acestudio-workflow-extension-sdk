# @timedomain/acestudio-bridge-core

The connection core for programming against a running ACE Studio — the canonical
handshake over a pluggable message-port transport, the generated capability
bindings, grants, jobs, and one typed error.

This is the layer beneath [`@timedomain/acestudio-extension-sdk`](../acestudio-extension-sdk):
consumers that need the connection without the extension runtime depend on it
directly.

> **Status:** pre-release (`0.0.0`). `connect()`, the transport seam, the generated
> domain bindings and notification subscriptions, grants, the pre-wire capability
> guard, per-op guardrail options, typed-array bulk data, typed job handles, and
> `BridgeError` are all in place. The API may still change before the first release.
