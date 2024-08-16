[#id](#TEXTSEARCH-LIMITATIONS)

## 12.11. Limitations [#](#TEXTSEARCH-LIMITATIONS)

The current limitations of PostgreSQL's text search features are:

- The length of each lexeme must be less than 2 kilobytes

- The length of a `tsvector` (lexemes + positions) must be less than 1 megabyte

- The number of lexemes must be less than 264

- Position values in `tsvector` must be greater than 0 and no more than 16,383

- The match distance in a `<N>` (FOLLOWED BY) `tsquery` operator cannot be more than 16,384

- No more than 256 positions per lexeme

- The number of nodes (lexemes + operators) in a `tsquery` must be less than 32,768

For comparison, the PostgreSQL 8.1 documentation contained 10,441 unique words, a total of 335,420 words, and the most frequent word “postgresql” was mentioned 6,127 times in 655 documents.

Another example — the PostgreSQL mailing list archives contained 910,989 unique words with 57,491,343 lexemes in 461,020 messages.
