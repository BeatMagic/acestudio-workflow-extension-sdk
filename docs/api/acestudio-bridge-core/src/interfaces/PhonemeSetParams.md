# Interface: PhonemeSetParams

Arguments for `phoneme set`.

## Properties

### noteUuids

```ts
noteUuids: string[];
```

UUID of the note to re-spell, with braces. Exactly one. A tenuto note is refused: it continues the previous syllable and holds none of its own.

***

### phonemes

```ts
phonemes: string[];
```

The symbols to sing, in emission order — head consonants, one contiguous vowel span, then tail consonants. Every symbol is checked against the NOTE'S OWN language, which is the only set it may draw from. An empty list is refused rather than read as "clear". On the wire an empty list is a sentinel, not a pronunciation, and a caller whose variable came back empty would wipe a user's phoneme edit believing it wrote one; `phoneme reset-override` is the verb that clears one.
