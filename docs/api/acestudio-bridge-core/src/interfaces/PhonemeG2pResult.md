# Interface: PhonemeG2pResult

Success payload of `phoneme g2p`.

## Properties

### contextSupported

```ts
contextSupported: boolean;
```

Whether this language has a context path at all (`LanguageUtils::isContextLookupSupported`). False does not mean the neighbours were ignored by mistake — it means this language's pronunciation does not vary with them.

***

### language

```ts
language: string;
```

Full English name of the language derived in.

***

### syllables

```ts
syllables: {
  fromContext: boolean;
  grapheme: string;
  headConsonants: string[];
  index: number;
  phonemes: string[];
  resolved: boolean;
  tailConsonants: string[];
  vowels: string[];
}[];
```

One row per grapheme answered for: the whole sequence, or just the one `index` named.

#### fromContext

```ts
fromContext: boolean;
```

Whether the surrounding graphemes changed this answer — the context path produced something the grapheme alone does not. This is what a Korean liaison and a French elision look like from outside, and it is why the verb takes a sequence rather than a word.

#### grapheme

```ts
grapheme: string;
```

The grapheme as given.

#### headConsonants

```ts
headConsonants: string[];
```

The leading consonants alone.

#### index

```ts
index: number;
```

0-based position in the `graphemes` argument this row answers for.

#### phonemes

```ts
phonemes: string[];
```

Every phoneme of the derived syllable, in emission order — head consonants, then the vowel span, then tail consonants. Empty when `resolved` is false.

#### resolved

```ts
resolved: boolean;
```

Whether anything derived a pronunciation at all. False leaves the four symbol lists empty: no dictionary entry, no model inference and no context resolution produced one, and `phoneme set` is how a note gets a pronunciation the derivation cannot supply.

#### tailConsonants

```ts
tailConsonants: string[];
```

The trailing consonants alone.

#### vowels

```ts
vowels: string[];
```

The vowel span alone. One contiguous run, always: `Syllable` parses nothing else.
