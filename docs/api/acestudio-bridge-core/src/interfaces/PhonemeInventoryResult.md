# Interface: PhonemeInventoryResult

Success payload of `phoneme inventory`.

## Properties

### consonants

```ts
consonants: string[];
```

Every legal consonant symbol, sorted.

***

### contextSupported

```ts
contextSupported: boolean;
```

Whether this language has a context G2P path. Same fact `g2p` reports, carried here so a caller planning a substitution learns it from the cheaper call.

***

### defaultGrapheme

```ts
defaultGrapheme: string;
```

The grapheme this language falls back to — what the piano roll writes into a note given no lyric of its own.

***

### defaultPhonemes

```ts
defaultPhonemes: string[];
```

The phonemes that grapheme sings. A note whose grapheme derives nothing falls back to these.

***

### language

```ts
language: string;
```

Full English name of the language reported.

***

### phoneticsHints

```ts
phoneticsHints: Record<string, string>;
```

What each symbol above sounds like, keyed by the symbol — mostly IPA, sometimes a description (`flap t (eg.butter)`). Prose for a reader, not an encoding: do not match on it. A symbol with no hint is still legal; `consonants` and `vowels` remain the answer to what may be written.

***

### vowels

```ts
vowels: string[];
```

Every legal vowel symbol, sorted.
