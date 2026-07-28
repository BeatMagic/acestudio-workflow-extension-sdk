# @timedomain/acestudio-bridge-core

The connection core for programming against a running ACE Studio — the canonical
handshake over a pluggable message-port transport, the generated capability
bindings, grants, jobs, and one typed error.

This is the layer beneath [`@timedomain/acestudio-extension-sdk`](../acestudio-extension-sdk):
consumers that need the connection without the extension runtime depend on it
directly.

> **Status:** pre-release (`0.0.0`). `connect()`, the transport seam, the generated
> domain bindings, grants, the pre-wire capability guard, and `BridgeError` are in
> place; typed job handles, typed-array bulk data, and notification subscriptions
> arrive in later slices. The API may still change before the first release.
