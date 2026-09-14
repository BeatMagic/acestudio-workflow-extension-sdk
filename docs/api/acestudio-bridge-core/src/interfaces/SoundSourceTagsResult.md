# Interface: SoundSourceTagsResult

Success payload of `sound-source tags`.

## Properties

### categories?

```ts
optional categories?: {
  id: number;
  name: string;
}[];
```

AI instrument categories.

#### id

```ts
id: number;
```

Numeric category id.

#### name

```ts
name: string;
```

Category name, e.g. `Piano`.

***

### languages?

```ts
optional languages?: {
  code: string;
  name: string;
}[];
```

Every language name the `language` filter accepts. The whole roster the app knows, not the native languages actually present in the library -- so a name from this list can still match nothing.

#### code

```ts
code: string;
```

Short code, e.g. `zh`.

#### name

```ts
name: string;
```

Full English name, e.g. `Chinese`.

***

### tags?

```ts
optional tags?: string[];
```

Tag names in use across the installed sources.

***

### vendors?

```ts
optional vendors?: string[];
```

Vendors of the scanned instrument plugins.
