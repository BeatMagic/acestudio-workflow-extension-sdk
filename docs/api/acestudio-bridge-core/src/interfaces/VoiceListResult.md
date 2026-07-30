# Interface: VoiceListResult

Success payload of `voice list`.

## Properties

### count

```ts
count: number;
```

Number of sound sources returned.

***

### soundSources

```ts
soundSources: {
  category?: string;
  categoryId?: number;
  group?: string;
  id: number;
  isCollected?: boolean;
  memberCount?: number;
  name: string;
  nativeLanguage?: string;
  routerId?: number;
  routerName?: string;
  supportedLanguages?: string[];
  tags: string[];
  type?: string;
}[];
```

Matching sound sources. Item shape depends on the queried type; only id, name, and tags are common to all types.

#### category?

```ts
optional category?: string;
```

Category name. Instrument only.

#### categoryId?

```ts
optional categoryId?: number;
```

Category ID. Instrument only.

#### group?

```ts
optional group?: string;
```

Which source the voice, choir or ensemble comes from. Empty for official, '#' for custom, '@' for community, the account's blended-voice library id for a blend. Ids repeat across sources, so (group, id) identifies one and id alone does not.

#### id

```ts
id: number;
```

Numeric sound source ID.

#### isCollected?

```ts
optional isCollected?: boolean;
```

Whether the voice is in your collection. Community voices only.

#### memberCount?

```ts
optional memberCount?: number;
```

Number of members. Choir and ensemble only.

#### name

```ts
name: string;
```

Display name.

#### nativeLanguage?

```ts
optional nativeLanguage?: string;
```

Full English name of the native language. Voice and choir only.

#### routerId?

```ts
optional routerId?: number;
```

ID of the default router. Voice only.

#### routerName?

```ts
optional routerName?: string;
```

Name of the default router. Voice only.

#### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Full English names of supported languages. Voice and choir only.

#### tags

```ts
tags: string[];
```

Tag names attached to the source.

#### type?

```ts
optional type?: string;
```

Instrument engine type. Instrument only.

***

### type

```ts
type: string;
```

The queried type, echoed back: 'voice', 'choir', 'instrument', or 'ensemble'.
