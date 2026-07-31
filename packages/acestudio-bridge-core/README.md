# @timedomain/acestudio-bridge-core

Control a running ACE Studio from your own code: open a connection, call what the
app can do, subscribe to what changes, and start work that outlives the call.

This is the layer underneath
[`@timedomain/acestudio-workflow-extension-sdk`](../acestudio-workflow-extension-sdk),
published on its own for code that wants the connection without an extension around
it. Inside: the canonical handshake over a pluggable message-port transport, the
generated capability bindings, grants, jobs, and one typed error.

> **Status:** published, on the `0.x` line. `connect()`, the transport seam, the generated
> domain bindings and notification subscriptions, grants, the pre-wire capability
> guard, per-op guardrail options, typed-array bulk data, typed job handles, and
> `BridgeError` are all in place. Until 1.0, any minor release may still change the API.
