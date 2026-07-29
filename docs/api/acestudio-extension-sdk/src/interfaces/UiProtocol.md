# Interface: UiProtocol

What an extension's page and process say to each other.

Declare one interface, `export` it from a module both sides import, and name it
at each end — [ExtensionUi.channel](ExtensionUi.md#channel) in the process, `connectChannel` in
the page. Both halves are optional: a UI that only reports progress declares
`events` alone, and one that only asks questions declares `calls` alone.

## Example

```ts
// protocol.ts — imported by both sides
import type { UiProtocol } from "@timedomain/acestudio-extension-sdk";

export interface StemsUi extends UiProtocol {
  calls: {
    listStems(params: { trackIndex: number }): Promise<string[]>;
    render(params: { stem: string }): void;
  };
  events: {
    progress: { done: number; total: number };
  };
}
```

## Properties

### calls?

```ts
readonly optional calls?: Readonly<Record<string, (params) => unknown>>;
```

What the page asks the process, and what it gets back.

***

### events?

```ts
readonly optional events?: Readonly<Record<string, unknown>>;
```

What the process pushes to the page.
