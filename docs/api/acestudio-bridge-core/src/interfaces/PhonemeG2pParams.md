# Interface: PhonemeG2pParams

Arguments for `phoneme g2p`.

## Properties

### graphemes

```ts
graphemes: string[];
```

The grapheme sequence, in order. A Korean liaison and a French elision resolve against their neighbours, so passing the neighbours is what makes the answer the one the note will sing. A single-element list is legal and is the degenerate case.

***

### index?

```ts
optional index?: number;
```

0-based index into `graphemes` of the one to answer for. Omit to answer for every grapheme in the sequence, which costs one derivation either way on a context language.

***

### language

```ts
language: string;
```

Language to derive in, as a full English name (`Chinese`, `Japanese`, `English`, `Spanish`, `Korean`, `French`, `Italian`, `Portuguese`). **Required** — there is no project state here to inherit one from.
