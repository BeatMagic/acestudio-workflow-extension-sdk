# Variable: COMMAND\_ENV

```ts
const COMMAND_ENV: "ACE_EXTENSION_COMMAND" = "ACE_EXTENSION_COMMAND";
```

The command being invoked, for a run that started from one. A one-shot workflow
is spawned per invocation, so the command a user picked is known at spawn time,
and the environment is where the rest of the spawn contract already travels.

Unlike the two above, this is one half of a contract whose other half is not
written yet: ACE Studio's process host sets the endpoint and the token today, and
gains command invocation — manifest-declared entry points, and a variable naming
the invoked one — with the slice that surfaces workflows to the user. Until then
every real run arrives without a command, which is what `activate` covers.
