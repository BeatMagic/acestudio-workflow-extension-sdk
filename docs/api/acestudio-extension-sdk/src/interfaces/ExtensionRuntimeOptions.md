# Interface: ExtensionRuntimeOptions

The seams the choreography reads its world through. The defaults *are* the spawn
contract, so a shipped extension passes none of this; an extension's own test
suite passes all of it, and drives the whole lifecycle over an in-memory
transport with no ACE Studio in sight.

## Properties

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
