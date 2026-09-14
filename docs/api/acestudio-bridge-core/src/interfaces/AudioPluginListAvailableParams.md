# Interface: AudioPluginListAvailableParams

Arguments for `audio-plugin list-available`.

## Properties

### category?

```ts
optional category?: string;
```

Only plugins in this category. A case-insensitive substring, tested against every category the plugin declares, as declared and normalized — so `Dynamics` keeps a plugin declaring `Fx|Distortion|Dynamics` and one declaring `Dynamics - Multiband`, as the libraries' Type filter does.

***

### format?

```ts
optional format?: "native" | "vst3" | "vst2" | "au";
```

The plugin formats an entry can be in. `native` is ACE's own built-in effect set; which of the others exist depends on the platform (no AU on Windows). An external instrument is always one of the third-party formats.

***

### role?

```ts
optional role?: "effect" | "instrument";
```

What a plugin is hosted to do: process audio in a chain, or produce it in a MIDI track's instrument slot. The registry holds both; the `role` filters narrow a listing to one.

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

Only plugins from this vendor, as `vendor` reports it. An entry with no vendor at all matches nothing here.
