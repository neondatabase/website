---
title: The lakebase_tokenizer extension
subtitle: Configurable tokenization for Postgres full-text search
summary: >-
  The lakebase_tokenizer extension adds configurable whole-word tokenization and
  Chinese, Japanese, and Korean morphological analysis to Postgres full-text
  search, with normalization, custom stop words, synonyms, and English stemming.
enableTableOfContents: true
---

The `lakebase_tokenizer` extension adds configurable tokenization to Postgres full-text search, including whole-word processing and morphological analysis for Chinese, Japanese, and Korean (CJK) text. Text-search configurations built with the extension work with `to_tsvector`, the `@@` operator, ranking functions, and GIN indexes. You can also use generated `tsvector` values with [`lakebase_text`](/docs/extensions/lakebase-text) for BM25 ranking.

The extension provides the `tokenizer_wholeword` and `tokenizer_morph` templates through Postgres's standard text-search dictionary interface. Use `tokenizer_wholeword` for whole-word processing, including lowercase conversion, Unicode normalization, accent removal, English possessive removal, custom stop words, one-to-one synonyms, and English stemming. Use `tokenizer_morph` for CJK morphological analysis.

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

<Admonition type="note">
The latest available extension version is reported by `SELECT default_version FROM pg_available_extensions WHERE name = 'lakebase_tokenizer'`.
</Admonition>

`ALTER EXTENSION` does not regenerate stored `tsvector` values or rebuild dependent GIN or `lakebase_bm25` indexes. If an update changes tokenization output, regenerate stored `tsvector` values and follow the release notes for any required index maintenance.

## Quick start

Choose a path based on the language of your text:

- For English and other whitespace-delimited languages, create a dictionary from the `tokenizer_wholeword` template.
- For Chinese, Japanese, or Korean text, use a built-in configuration. You don't need to create a dictionary.

### Whole-word text

The following example creates a dictionary from the `tokenizer_wholeword` template, then maps common Postgres token types to it in a text-search configuration:

```sql
CREATE TEXT SEARCH DICTIONARY documents_dict (
  TEMPLATE          = tokenizer_ext.tokenizer_wholeword,
  Lowercase         = 'true',
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

### CJK text

Installing the extension creates the `tokenizer_chinese`, `tokenizer_japanese`, and `tokenizer_korean` text-search configurations. Use one of them directly to produce a `tsvector`, create a GIN index, and run full-text queries:

<CodeTabs labels={["Chinese", "Japanese", "Korean"]}>

```sql
CREATE TABLE chinese_documents (
  id            BIGSERIAL PRIMARY KEY,
  body          TEXT NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('tokenizer_ext.tokenizer_chinese', body)
  ) STORED
);

INSERT INTO chinese_documents (body) VALUES
  ('现代分布式文件系统架构');

CREATE INDEX chinese_idx ON chinese_documents USING gin (search_vector);

-- Use plainto_tsquery for the built-in Chinese configuration's mixed mode.
SELECT id, body
FROM chinese_documents
WHERE search_vector @@ plainto_tsquery('tokenizer_ext.tokenizer_chinese', '现代分布式');
```

```sql
CREATE TABLE japanese_documents (
  id            BIGSERIAL PRIMARY KEY,
  body          TEXT NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('tokenizer_ext.tokenizer_japanese', body)
  ) STORED
);

INSERT INTO japanese_documents (body) VALUES
  ('関西国際空港へのアクセス');

CREATE INDEX japanese_idx ON japanese_documents USING gin (search_vector);

SELECT id, body
FROM japanese_documents
WHERE search_vector @@ to_tsquery('tokenizer_ext.tokenizer_japanese', '関西国際空港');
```

```sql
CREATE TABLE korean_documents (
  id            BIGSERIAL PRIMARY KEY,
  body          TEXT NOT NULL,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('tokenizer_ext.tokenizer_korean', body)
  ) STORED
);

INSERT INTO korean_documents (body) VALUES
  ('선생님께서 도서관에 갑니다');

CREATE INDEX korean_idx ON korean_documents USING gin (search_vector);

SELECT id, body
FROM korean_documents
WHERE search_vector @@ to_tsquery('tokenizer_ext.tokenizer_korean', '선생님께서');
```

</CodeTabs>

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

| Table                          | Columns                                  | Description                                                                                        |
| :----------------------------- | :--------------------------------------- | :------------------------------------------------------------------------------------------------- |
| `lakebase_tokenizer_stopwords` | `name text`, `word text`                 | Stores named stop-word sets for `tokenizer_wholeword`. The primary key is `(name, word)`.          |
| `lakebase_tokenizer_synonyms`  | `name text`, `word text`, `synonym text` | Stores named one-to-one replacements for `tokenizer_wholeword`. The primary key is `(name, word)`. |

## Template: `tokenizer_morph`

The `tokenizer_morph` template analyzes Chinese, Japanese, and Korean text for Postgres full-text search. Use a built-in text-search configuration or define a custom one to control term generation.

### How it works

`tokenizer_morph` uses the Lindera analyzer with bundled dictionaries: Jieba for Chinese, IPADIC for Japanese, and MeCab KoDic for Korean.

For Korean parser tokens, `tokenizer_morph` first replaces `ㆍ` (U+318D) with a token boundary.

For each token passed to the dictionary by Postgres's text-search parser, `tokenizer_morph` applies these operations in order:

1. `Normalize`: Apply Unicode normalization to the parser token.
2. `Language`: Segment the parser token with the selected language analyzer.
3. Symbol filter: Discard segments that contain no letters or digits.
4. Language-specific analysis: Turn each remaining segment into zero or more terms, as described below.
5. `Lowercase`: Convert each term to lowercase.
6. `Stemmer`: If enabled, stem terms made entirely of ASCII letters with the bundled English stemmer. This step does not stem CJK terms.

The language-specific analysis step applies these rules:

**Chinese**

- Subword expansion: In `mixed` mode, add the two-character and three-character terms that the bundled dictionary contains.

**Japanese**

- Part-of-speech filtering: Discard recognized particles, auxiliary verbs, conjunctions, fillers, non-verbal sounds, non-alphabetic symbols, and segments tagged `その他,間投`.
- Base-form conversion: Use the dictionary base form of each remaining recognized segment when available. Otherwise, keep its surface form.
- Stop-word filtering: Discard terms that match the built-in list of common Japanese function words.
- Katakana stemming: Remove a trailing `ー` from a term of at least four characters whose characters all fall in the katakana block (U+30A0 to U+30FF).

**Korean**

- Decomposition: In `discard` and `mixed` modes, split a recognized compound, inflected, or preanalyzed segment when the dictionary provides its components. `discard` emits the components in place of the full term, and `mixed` emits both.
- Part-of-speech filtering: Apply filtering to the full term and to each component independently. Omit terms tagged as particles, endings, affixes, adverbs, determiners, interjections, punctuation, symbols, or unanalyzable forms.
- Hangul reading conversion: Use the dictionary's Hangul reading for a retained full term when available. Components keep their dictionary form.

Postgres's text-search parser splits text at whitespace and punctuation before calling `tokenizer_morph`. Each parser token can contain up to 2046 bytes. Longer tokens are skipped with a `NOTICE`. Most Chinese, Japanese, and Korean characters use 3 bytes in UTF-8, so a run of more than 682 of these characters without whitespace or punctuation is omitted from `to_tsvector` results.


### Supported languages and modes

The available modes depend on the language. Each example shows source text → emitted terms.

| Language | Mode      | Behavior                                                                                       | Example |
| :------- | :-------- | :--------------------------------------------------------------------------------------------- | :------ |
| Chinese  | `none`    | Emits words from standard segmentation without adding shorter search terms.                    | `现代分布式文件系统架构` → `现代`, `分布式文件系统`, `架构` |
| Chinese  | `mixed`   | Keeps words from standard segmentation and adds shorter search terms from some longer words.   | `现代分布式文件系统架构` → `现代`, `分布式文件系统`, `分布`, `分布式`, `布式`, `文件`, `系统`, `架构` |
| Japanese | `none`    | Favors longer dictionary compounds.                                                            | `関西国際空港へのアクセス` → `関西国際空港`, `アクセス` |
| Japanese | `discard` | Produces finer-grained terms for some long compounds without retaining their full form.        | `関西国際空港へのアクセス` → `関西`, `国際`, `空港`, `アクセス` |
| Korean   | `none`    | Keeps compound and inflected dictionary entries as whole terms.                                | `한국어 형태소 분석` → `한국어`, `형태소`, `분석` |
| Korean   | `discard` | Emits the parts of a compound or inflected form instead of the full term when it can be split. | `한국어 형태소 분석` → `한국`, `어`, `형태`, `소`, `분석` |
| Korean   | `mixed`   | Emits both the full term and its parts when a compound or inflected form can be split.         | `한국어 형태소 분석` → `한국어`, `한국`, `어`, `형태소`, `형태`, `소`, `분석` |

In `mixed` mode, query with `plainto_tsquery`. When one query word produces multiple lexemes, `to_tsquery`, `websearch_to_tsquery`, and `phraseto_tsquery` join them with the `<->` operator, which requires adjacent positions. `mixed` mode inserts extra positions for the additional terms, so these phrase conditions can miss expected matches. For position-based queries, define a custom configuration with `none` or `discard` mode.

### Use the built-in configurations

The extension provides these text-search configurations in its installation schema:

| Configuration        | Dictionary                | Language | Mode      |
| :------------------- | :------------------------ | :------- | :-------- |
| `tokenizer_chinese`  | `tokenizer_chinese_dict`  | Chinese  | `mixed`   |
| `tokenizer_japanese` | `tokenizer_japanese_dict` | Japanese | `discard` |
| `tokenizer_korean`   | `tokenizer_korean_dict`   | Korean   | `discard` |

All three dictionaries set `Stemmer = 'english'` and use the defaults `Normalize = 'NFKC'` and `Lowercase = 'true'`.

For end-to-end examples that use these configurations, see [CJK text](#cjk-text).

### Define a custom configuration

To choose another mode or change the default options, create a dictionary from the `tokenizer_morph` template and a text-search configuration that maps Postgres token types to it. This example uses Chinese `none` mode for phrase queries:

```sql
CREATE TEXT SEARCH DICTIONARY chinese_none_dict (
  TEMPLATE = tokenizer_ext.tokenizer_morph,
  Language = 'chinese',
  Mode = 'none',
  Stemmer = 'english'
);

CREATE TEXT SEARCH CONFIGURATION chinese_none_cfg (COPY = pg_catalog.simple);

ALTER TEXT SEARCH CONFIGURATION chinese_none_cfg
  ALTER MAPPING FOR asciiword, word, numword, hword_asciipart, hword_part, hword_numpart
  WITH chinese_none_dict;

SELECT to_tsvector('chinese_none_cfg', '现代分布式文件系统架构')
  @@ phraseto_tsquery('chinese_none_cfg', '分布式文件系统 架构');
```

### Options

Specify `tokenizer_morph` options in `CREATE TEXT SEARCH DICTIONARY` or `ALTER TEXT SEARCH DICTIONARY`. Option names are case-insensitive.

| Option      | Type                               | Default  | Description                                                                                                                                                                                            |
| :---------- | :--------------------------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Language`  | `chinese`, `japanese`, or `korean` | Required | Selects the language-specific analyzer.                                                                                                                                                                |
| `Mode`      | `none`, `discard`, or `mixed`      | Required | Controls compound and subword output. Supported modes depend on `Language`: `none` or `mixed` for Chinese, `none` or `discard` for Japanese, and `none`, `discard`, or `mixed` for Korean.             |
| `Normalize` | `NFC`, `NFKC`, or `none`           | `NFKC`   | Normalizes text before segmentation. `NFC` preserves compatibility distinctions. For example, full-width `ＡＢＣ` is lowercased to `ａｂｃ` instead of being converted to `abc`, so it is not stemmed. |
| `Lowercase` | boolean                            | `true`   | Converts emitted lexemes to lowercase. `Stemmer = 'english'` requires `Lowercase = 'true'`.                                                                                                            |
| `Stemmer`   | `english`                          | None     | Stems only lexemes made entirely of ASCII letters. Omit this option to disable English stemming.                                                                                                       |

## Use BM25 ranking with lakebase_text

Text-search configurations built with `lakebase_tokenizer` produce standard Postgres `tsvector` values that are compatible with `lakebase_text`. To use BM25 relevance ranking and top-K retrieval, create a `lakebase_bm25` index on the same `tsvector` column. For installation, index creation, and query syntax, see [The lakebase_text extension](/docs/extensions/lakebase-text).

<NeedHelp />
