# Interface: FxListAvailableParams

Arguments for `fx list-available`.

## Properties

### category?

```ts
optional category?: string;
```

Only effects in this category, as `category` reports it. A substring, which is also what makes it work on the pipe-joined categories a VST3 may declare (`Fx|Dynamics`).

***

### format?

```ts
optional format?: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in set; which of the others exist depends on the platform (no AU on Windows).

***

### search?

```ts
optional search?: string;
```

Case-insensitive substring match against the name and the vendor.

***

### vendor?

```ts
optional vendor?: string;
```

Only effects from this vendor, as `vendor` reports it. An entry with no vendor at all matches nothing here.
