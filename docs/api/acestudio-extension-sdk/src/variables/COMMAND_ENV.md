# Variable: COMMAND\_ENV

```ts
const COMMAND_ENV: "ACE_EXTENSION_COMMAND" = "ACE_EXTENSION_COMMAND";
```

The command being invoked, for a run that started from one. A one-shot workflow
is spawned per invocation, so the command a user picked is known at spawn time
and travels here rather than over the bridge.
