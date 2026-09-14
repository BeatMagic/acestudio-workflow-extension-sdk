# Interface: FxListChainsResult

Success payload of `fx list-chains`.

## Properties

### chains

```ts
chains: {
  factory: boolean;
  folder: string;
  inserts: {
     format?: "native" | "vst3" | "vst2" | "au";
     name: string;
     typeId: string;
  }[];
  name: string;
  path?: string;
  preset: string;
  updatedAtMs: number;
}[];
```

The chains directly in `folder` — or, with `recursive`, everywhere under it — in the order the library lists them.

#### factory

```ts
factory: boolean;
```

Whether this chain ships with Studio. A factory chain sits at the library root, and this flag is what says it is read-only: `move-chain` and `remove-chain` refuse it, and no save lands on it. It also wins its path against a user file that reaches the same one.

#### folder

```ts
folder: string;
```

The folder it sits in — `preset` without its last segment. Empty at the root.

#### inserts

```ts
inserts: {
  format?: "native" | "vst3" | "vst2" | "au";
  name: string;
  typeId: string;
}[];
```

The inserts the chain holds, in signal order.

#### name

```ts
name: string;
```

The chain's name — its file's basename, the last segment of `preset`.

#### path?

```ts
optional path?: string;
```

Absolute path of the chain file. Absent for a factory chain, which ships inside the app rather than as a file.

#### preset

```ts
preset: string;
```

The chain's path in the library, and the handle every chain verb takes: its folder path and its file's basename joined with `/` (`Vocal/Warm Stack`), or the bare basename at the root — where the chains that ship with Studio sit.

#### updatedAtMs

```ts
updatedAtMs: number;
```

When the chain file was last modified, in milliseconds since the Unix epoch. `0` for a factory chain.

***

### folder

```ts
folder: string;
```

The folder that was listed, as the library spells it. Empty for the FX Chains directory itself.

***

### folders

```ts
folders: {
  factory: boolean;
  folder: string;
  path?: string;
}[];
```

The folders directly in `folder` — or, with `recursive`, everywhere under it — empty ones included, sorted case-insensitively.

#### factory

```ts
factory: boolean;
```

Whether what ships with Studio is filed in this folder. Always false here, and kept for the shape the preset library reports.

#### folder

```ts
folder: string;
```

The folder's `/`-separated path under the FX Chains directory.

#### path?

```ts
optional path?: string;
```

Absolute path of the directory. Always present: every folder of this library is a directory of the user's, because the chains that ship with Studio sit at the root and bring no folder with them.
