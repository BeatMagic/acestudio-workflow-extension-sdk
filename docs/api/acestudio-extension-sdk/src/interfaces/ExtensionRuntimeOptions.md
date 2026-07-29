# Interface: ExtensionRuntimeOptions

The seams the choreography reads its world through. The defaults *are* the spawn
contract, so a shipped extension passes none of this; an extension's own test
suite passes all of it, and drives the whole lifecycle over an in-memory
transport with no ACE Studio in sight.

## Properties

### debug?

```ts
readonly optional debug?: boolean;
```

Log what the SDK does — the lifecycle, every call and how it ended, the channel
and the assets served — to stderr, where ACE Studio's stdio capture lands it in
the extension's log folder (ADR 0091 §5).

Defaults to what `ACE_EXTENSION_SDK_DEBUG` says, which is how dev tooling turns it
on without the extension being rebuilt for it.

There is no wire trace here, on purpose (ADR 0091 §6): a line names the operation
and how it ended, plus the URLs this SDK serves and announces, which are what a
developer is usually chasing. What a call carried — its arguments, its result, and
the session token — is never written.

***

### env?

```ts
readonly optional env?: Readonly<Record<string, string | undefined>>;
```

Where to read the spawn contract from. Defaults to `process.env`.

***

### exit?

```ts
readonly optional exit?: (code) => void;
```

What ending the run means. Defaults to exiting the process.

#### Parameters

##### code

`number`

#### Returns

`void`

***

### transport?

```ts
readonly optional transport?: Transport;
```

A transport to speak over, instead of dialing the socket path from the environment.
