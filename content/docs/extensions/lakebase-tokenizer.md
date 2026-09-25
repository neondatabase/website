---
title: The lakebase_tokenizer extension
subtitle: Configurable tokenization for Postgres full-text search
summary: >-
  The lakebase_tokenizer extension adds configurable whole-word tokenization to
  Postgres full-text search, including lowercase conversion, Unicode normalization,
  accent removal, English possessive removal, custom stop words, one-to-one
  synonyms, and English stemming.
enableTableOfContents: true
---

The `lakebase_tokenizer` extension adds configurable whole-word tokenization to Postgres full-text search. Text-search configurations built with the extension work with `to_tsvector`, the `@@` operator, ranking functions, and GIN indexes. You can also use generated `tsvector` values with [`lakebase_text`](/docs/extensions/lakebase-text) for BM25 ranking.

The extension provides the `tokenizer_wholeword` template through Postgres's standard text-search dictionary interface. The template supports lowercase conversion, Unicode normalization, accent removal, English possessive removal, custom stop words, one-to-one synonyms, and English stemming.

## Install the extension

Install the extension in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor). The examples on this page use a dedicated schema so the extension objects are easy to identify:

```sql
CREATE SCHEMA IF NOT EXISTS tokenizer_ext;
CREATE EXTENSION IF NOT EXISTS lakebase_tokenizer WITH SCHEMA tokenizer_ext;
```

`lakebase_tokenizer` requires Postgres 16 or later. The extension is relocatable. You can replace `tokenizer_ext` with another schema when you install it.

### Upgrade the extension

A new Lakebase Search release can add features, fixes, and performance improvements. Although Lakebase Search is released as part of Neon updates, it does not upgrade everything automatically.

Upgrading is not urgent. The extension is compatible with SQL objects from older versions, but staying current keeps you on the supported, best-performing path and avoids a larger migration later, so upgrade when convenient rather than deferring indefinitely.

`ALTER EXTENSION` does not regenerate stored `tsvector` values or rebuild dependent GIN or `lakebase_bm25` indexes. If an update changes tokenization output, regenerate stored `tsvector` values and follow the release notes for any required index maintenance.

## Quick start with `tokenizer_wholeword`

The following example creates a dictionary from the `tokenizer_wholeword` template, then maps common Postgres token types to it in a text-search configuration:

```sql
CREATE TEXT SEARCH DICTIONARY documents_dict (
  TEMPLATE          = tokenizer_ext.tokenizer_wholeword,
  Lowercase         = 'true',
  EnglishPossessive = 'true',
  StripAccents      = 'true',
  Stemmer           = 'english'
);

CREATE TEXT SEARCH CONFIGURATION documents_cfg (COPY = pg_catalog.simple);

ALTER TEXT SEARCH CONFIGURATION documents_cfg
  ALTER MAPPING FOR asciiword, word, numword, hword_numpart, hword_part, hword_asciipart
  WITH documents_dict;
```

Use the configuration to produce a `tsvector`, create a GIN index, and run full-text queries:

```sql
CREATE TABLE documents (
  id            BIGSERIAL PRIMARY KEY,
  body          TEXT NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('documents_cfg', body)
  ) STORED
);

INSERT INTO documents (body) VALUES
  ('Cats are running near the café.'),
  ('A dog is sleeping in the house.');

CREATE INDEX documents_search_idx ON documents USING gin (search_vector);

SELECT id, body
FROM documents
WHERE search_vector @@ plainto_tsquery('documents_cfg', 'running café');
```

Use the same text-search configuration for documents and queries so both sides apply the same tokenization strategy and options.

## Template: `tokenizer_wholeword`

### How it works

For each token passed to the dictionary by Postgres's text-search parser, `tokenizer_wholeword` applies these operations:

1. `Lowercase`: Convert the token to lowercase.
2. `Normalize`: Apply Unicode normalization.
3. `StripAccents`: Remove accents.
4. `EnglishPossessive`: Remove an English possessive suffix when at least one character remains.
5. `Stopwords`: Emit no lexeme and stop processing if the token matches a configured stop word. The token is omitted from the generated `tsvector`.
6. `Synonyms`: Emit the configured replacement and stop processing if the token matches a synonym.
7. `Stemmer`: If no synonym matched and stemming is enabled, apply the English stemmer.

### Add stop words and synonyms

The `tokenizer_wholeword` template can load custom stop words and synonyms from the extension-managed `lakebase_tokenizer_stopwords` and `lakebase_tokenizer_synonyms` SQL tables. The `name` column groups rows into a set that you select with the `Stopwords` or `Synonyms` dictionary option.

```sql
INSERT INTO tokenizer_ext.lakebase_tokenizer_stopwords (name, word) VALUES
  ('app_stopwords', 'the'),
  ('app_stopwords', 'and'),
  ('app_stopwords', 'or');

INSERT INTO tokenizer_ext.lakebase_tokenizer_synonyms (name, word, synonym) VALUES
  ('app_synonyms', 'usa', 'united_states'),
  ('app_synonyms', 'uk', 'united_kingdom');
```

Reference the sets when you create or alter a `tokenizer_wholeword` dictionary:

```sql
ALTER TEXT SEARCH DICTIONARY documents_dict (
  Stopwords = 'app_stopwords',
  Synonyms  = 'app_synonyms'
);
```

The extension compares stop words and synonym source words with each token after applying `Lowercase`, `Normalize`, `StripAccents`, and `EnglishPossessive`, but before applying `Stemmer`. Catalog entries are not transformed automatically, so store them in the exact form produced by those enabled options:

- With `Lowercase = 'true'`, use lowercase entries. With `Lowercase = 'false'`, capitalization must match the token.
- With `Normalize` enabled, store entries in the selected Unicode normalization form.
- With `StripAccents = 'true'`, store the accent-stripped form. For example, store `cafe` to match `café`.
- Store the form before stemming. For example, with `Stemmer = 'english'`, a `run` entry does not match `running`. Add `running` to filter or replace that token.

Set names can contain up to 256 bytes. Words and synonyms can contain up to 1024 bytes. Each named stop-word or synonym set can contain up to 100,000 rows.

A synonym replacement is emitted exactly as stored and is not processed by the stemmer. Synonyms support one replacement for each source word. To represent a multiword replacement as one lexeme, use a separator such as an underscore, as in `united_states`.

After changing a set, the owner of each dictionary that references the set must run a no-op `ALTER TEXT SEARCH DICTIONARY` to force a reload:

```sql
ALTER TEXT SEARCH DICTIONARY documents_dict (dummy);
```

The `dummy` option does not exist on `tokenizer_wholeword`. Omitting a value asks Postgres to remove this nonexistent option, which invalidates the cache without changing any of the dictionary's configured options.

After reloading the dictionary, regenerate the stored `tsvector` values by rewriting the source rows:

```sql
UPDATE documents SET body = body;
```

### Roles and access

Use two roles to separate application access from tokenizer administration. The examples assume these roles already exist:

- `app_role` uses existing dictionaries. It needs `USAGE` on the relevant schemas and `SELECT` on the extension catalog tables, but it does not need to own the dictionaries.
- `tokenizer_admin` manages stop-word and synonym sets, creates and owns dictionaries and text-search configurations, and runs the reload command after changing a set.

Grant access to the extension schema and catalog tables:

```sql
GRANT USAGE ON SCHEMA tokenizer_ext TO app_role, tokenizer_admin;

GRANT SELECT ON
  tokenizer_ext.lakebase_tokenizer_stopwords,
  tokenizer_ext.lakebase_tokenizer_synonyms
TO app_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  tokenizer_ext.lakebase_tokenizer_stopwords,
  tokenizer_ext.lakebase_tokenizer_synonyms
TO tokenizer_admin;
```

`tokenizer_admin` also needs `CREATE` on the schema where dictionaries and text-search configurations are stored. Create these objects as `tokenizer_admin`, or transfer their ownership to it. Write access to the catalog tables does not grant ownership of existing dictionaries.

### Options

Specify `tokenizer_wholeword` options in `CREATE TEXT SEARCH DICTIONARY` or `ALTER TEXT SEARCH DICTIONARY`. Option names are case-insensitive.

| Option              | Type                                    | Default | Description                                                                                                                                                                                                              |
| :------------------ | :-------------------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Lowercase`         | boolean                                 | `true`  | Converts tokens to lowercase before applying other operations. `Stemmer = 'english'` requires `Lowercase = 'true'`.                                                                                                      |
| `Normalize`         | `NFC`, `NFD`, `NFKC`, `NFKD`, or `none` | `none`  | Applies the selected Unicode normalization form. This canonicalizes the representation but does not remove characters. For example, `NFC` makes precomposed `é` and `e` followed by a combining acute accent equivalent. |
| `EnglishPossessive` | boolean                                 | `true`  | Removes a trailing `'s`, `’s`, or `＇s` when at least one character precedes the suffix. A standalone suffix remains unchanged.                                                                                          |
| `StripAccents`      | boolean                                 | `false` | Applies NFKD normalization and removes combining marks. For example, `café` becomes `cafe`. When this option is enabled, omit `Normalize` because the NFKD step makes any separate Unicode normalization redundant.      |
| `Stopwords`         | set name                                | None    | Uses the named set from `tokenizer_ext.lakebase_tokenizer_stopwords`.                                                                                                                                                    |
| `Synonyms`          | set name                                | None    | Uses the named set of one-to-one replacements from `tokenizer_ext.lakebase_tokenizer_synonyms`.                                                                                                                          |
| `Stemmer`           | `english`                               | None    | Uses the bundled Snowball 3.1.0 English stemmer. Omit this option to disable stemming. The stemmer does not include a stop-word list.                                                                                    |

### Catalog tables

| Table                          | Columns                                  | Description                                                                                                              |
| :----------------------------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `lakebase_tokenizer_stopwords` | `name text`, `word text`                 | Stores named stop-word sets for tokenizer templates that support `Stopwords`. The primary key is `(name, word)`.         |
| `lakebase_tokenizer_synonyms`  | `name text`, `word text`, `synonym text` | Stores named one-to-one replacements for tokenizer templates that support `Synonyms`. The primary key is `(name, word)`. |

## Use BM25 ranking with lakebase_text

Text-search configurations built with `lakebase_tokenizer` produce standard Postgres `tsvector` values that are compatible with `lakebase_text`. To use BM25 relevance ranking and top-K retrieval, create a `lakebase_bm25` index on the same `tsvector` column. For installation, index creation, and query syntax, see [The lakebase_text extension](/docs/extensions/lakebase-text).

<NeedHelp />
