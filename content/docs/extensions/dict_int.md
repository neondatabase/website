---
title: The dict_int extension
subtitle: Control how integers are indexed in Postgres Full-Text Search to improve
  performance and relevance.
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.750Z'
tag: new
---

[Postgres Full-Text Search (FTS)](/postgresql/postgresql-indexes/postgresql-full-text-search) is a powerful tool for searching through textual data. However, when this data includes a significant number of integers like product IDs, serial numbers, or document codes, default FTS behavior can sometimes lead to inefficient indexes and slower search performance.

The `dict_int` extension is designed to address this issue by providing a specialized dictionary template that optimizes how integers are tokenized and indexed. This can lead to more compact indexes and faster, more relevant searches.

Imagine searching a vast product catalog for "ID 1234567890". Without `dict_int`, FTS might break this number down in various ways, or index the entire long string, potentially creating many unique terms that aren't always useful for searching and can bloat the index. `dict_int` allows you to define rules for how these numbers are processed, ensuring they are handled efficiently.

<CTA />

## Enable the `dict_int` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS dict_int;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Understanding `dict_int`

The `dict_int` dictionary template offers precise control over how integer strings are tokenized for full-text search. This is achieved through three key parameters that you can tailor when creating a dictionary to optimize index size and ensure that searches for numbers are both efficient and relevant to your needs. These settings dictate how numbers are processed before they even make it into the search index.

### `maxlen`

This parameter sets the maximum number of digits an integer token is allowed to have. Its default value when creating a dictionary is `6`.

- When an integer token processed by the dictionary has more digits than `maxlen`, it will either be shortened or discarded entirely, depending on the `rejectlong` setting.
- The primary purpose of `maxlen` is to help prevent extremely long, and often less significant, numerical sequences from consuming valuable index space and potentially slowing down searches.

For example, if `maxlen` is `5` in your custom dictionary and it encounters the number `1234567` (and `rejectlong` is `false`), it will be processed as `12345`.

### `rejectlong`

This parameter determines what happens to an integer token that exceeds the number of digits specified by `maxlen`. The default for `rejectlong` is `false`.

- If `rejectlong` is `false`, integers longer than `maxlen` are truncated. This means only their initial `maxlen` digits are kept and indexed.
- If `rejectlong` is set to `true`, these overlength integers are instead treated as "stop words." This effectively means they are entirely discarded by the dictionary, will not be indexed, and therefore cannot be found via full-text search.

Choosing `rejectlong = true` can be beneficial if very long numbers in your dataset are generally considered noise or are irrelevant to your typical search use cases, as it helps keep the index leaner. Conversely, if the leading portion of a long number is still important for searching, keeping `rejectlong = false` is the appropriate choice.

### `absval`

The `absval` parameter controls the handling of leading positive (`+`) or negative (`-`) signs in integer tokens. By default, `absval` is `false`.

- When `absval` is `false`, any leading signs are typically preserved as part of the token.
- If `absval` is set to `true`, any leading `+` or `-` signs are stripped from the integer _before_ the `maxlen` logic is applied. For example, if `absval` is `true` in your custom dictionary, both `-12345` and `+12345` would be normalized to `12345`.

This feature is very useful when the sign of a number isn't relevant for your search criteria, allowing, for instance, a search for `ID 789` to successfully match entries like `ID: -789` or `REF: +789` without needing to account for the sign explicitly in the search query.

## Using `dict_int`

The `dict_int` extension provides a template for creating custom integer dictionaries. This allows you to define how integers are processed during full-text search indexing and querying. A default dictionary named `intdict` is provided, which has default parameters set to `maxlen = 6`, `rejectlong = false`, and `absval = false`.

<Admonition type="important" title="Modifying the default intdict dictionary on Neon">
The default `intdict` dictionary is owned by superuser. On Neon, you do not have permissions to directly `ALTER` this default dictionary, which can result in an "ERROR: must be owner of text search dictionary intdict".

The recommended approach is to **create your own custom dictionary** from the `intdict_template`. This gives you full control over its parameters
</Admonition>

### Creating and configuring a custom integer dictionary

You can create new dictionaries from the `intdict_template` and specify your desired parameters.

#### Example:

Create dictionary named `my_custom_intdict` with `maxlen` set to `4`, `rejectlong` to `true`, and `absval` to `true`:

```sql
CREATE TEXT SEARCH DICTIONARY my_custom_intdict (
    TEMPLATE = intdict_template,
    MAXLEN = 4,
    REJECTLONG = true,
    ABSVAL = true
);
```

If you need to change its parameters later, you can `ALTER` the dictionary:

```sql
ALTER TEXT SEARCH DICTIONARY my_custom_intdict (
    MAXLEN = 3,
    REJECTLONG = false,
    ABSVAL = false
);
```

### Utilizing with `ts_lexize`

The `ts_lexize` function is used for testing how a dictionary processes input tokens. It shows what lexemes (if any) are produced.

To test the behavior of custom dictionary, use `ts_lexize` with the dictionary name and an integer string.

```sql
CREATE TEXT SEARCH DICTIONARY intdict_for_testing (
    TEMPLATE = intdict_template,
    MAXLEN = 3,
    REJECTLONG = false,
    ABSVAL = true
);
```

Now, test this dictionary with various integer inputs:

```sql
SELECT ts_lexize('intdict_for_testing', '123');         -- Result: {123}
SELECT ts_lexize('intdict_for_testing', '12345');       -- Result: {123} (truncated)
SELECT ts_lexize('intdict_for_testing', '-98765');      -- Result: {987} (absval applied)
SELECT ts_lexize('intdict_for_testing', '+12');         -- Result: {12}  (absval applied)
```

Test with `rejectlong` set to `true`:

```sql
ALTER TEXT SEARCH DICTIONARY intdict_for_testing (
    REJECTLONG = true
);

SELECT ts_lexize('intdict_for_testing', '1234567');     -- Result: {} (empty, rejected)
SELECT ts_lexize('intdict_for_testing', '987');       -- Result: {987} (within limit)
```

## Integrating `dict_int` into a text search configuration

For a custom integer dictionary to be used during indexing and searching, it must be associated with specific token types in a text search configuration.

<Admonition type="important" title="Modifying default text search configurations on Neon">
Altering default text search configurations (like `english`) requires superuser privileges on Neon. If you encounter an "ERROR: must be owner of text search configuration english", you will need to first **create a copy of an existing configuration** (e.g., `english`) and then modify your own copy.
</Admonition>

Here's the recommended approach:

1.  Create your custom integer dictionary (if you haven't already):

    ```sql
    CREATE TEXT SEARCH DICTIONARY my_custom_intdict (
        TEMPLATE = intdict_template,
        MAXLEN = 8, -- Example: Max 8 digits
        REJECTLONG = false, -- Example: Truncate long numbers
        ABSVAL = true -- Example: Ignore signs
    );
    ```

2.  Create a copy of an existing text search configuration (e.g., `english`):

    ```sql
    CREATE TEXT SEARCH CONFIGURATION public.my_app_search_config (COPY = pg_catalog.english);
    ```

    The above sql creates a new configuration named `my_app_search_config` that inherits the settings of the `english` configuration.

3.  Alter the copied configuration to use custom dictionary for integer token types (`int` and `uint`):
    ```sql
    ALTER TEXT SEARCH CONFIGURATION public.my_app_search_config
        ALTER MAPPING FOR int, uint WITH my_custom_intdict;
    ```

Now, `public.my_app_search_config` is set up to use `my_custom_intdict` for processing integers. `public.my_app_search_config` can now be used in `to_tsvector` and `to_tsquery` functions to process integer tokens according to the rules defined in `my_custom_intdict`.

## Example

Let's consider a scenario where we have a `documents` table with a `version_code` field stored as text. These codes can be like "v1", "V2.0", "Rev 003", or purely numeric like "1001", "005". We want to full-text search these, focusing on the numeric parts using a custom integer dictionary and a custom text search configuration.

### Sample table and data

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    version_code TEXT
);

INSERT INTO documents (title, content, version_code) VALUES
('Intro Guide', 'Content of version 1...', '1'),
('Advanced Manual', 'More content...', '0042'),
('Internal Spec', 'Spec details...', '7654321'),
('Internal Spec v2', 'Updated spec...', '+7654321'),
('Draft Notes', 'Preliminary ideas...', 'ver003');
```

### Create custom dictionary and text search configuration

1.  Create a custom integer dictionary, `doc_version_intdict`, with `maxlen` set to 4, `rejectlong` to `true`, and `absval` to `true`.

    ```sql
    CREATE TEXT SEARCH DICTIONARY doc_version_intdict (
        TEMPLATE = intdict_template,
        MAXLEN = 4,
        REJECTLONG = true,
        ABSVAL = true
    );
    ```

2.  Create a copy of the `english` text search configuration, naming it `doc_search_config`.

    ```sql
    CREATE TEXT SEARCH CONFIGURATION public.doc_search_config (COPY = pg_catalog.english);
    ```

3.  Alter `doc_search_config` to use `doc_version_intdict` for integers.
    ```sql
    ALTER TEXT SEARCH CONFIGURATION public.doc_search_config
        ALTER MAPPING FOR int, uint WITH doc_version_intdict;
    ```

### Add `tsvector` column and index data

Index the `version_code` column using the custom configuration. First, add a `tsvector` column to the `documents` table:

```sql
ALTER TABLE documents ADD COLUMN version_tsv TSVECTOR;

UPDATE documents
SET version_tsv = to_tsvector('public.doc_search_config', version_code); -- Use custom config
```

### Examine the indexed tokens

To see how the `version_code` values are indexed, you can query the `documents` table:

```sql
SELECT id, title, version_code, version_tsv FROM documents;
```

```text
id  |      title       | version_code | version_tsv
----+------------------+--------------+-------------
  1 | Intro Guide      | 1            | '1':1
  2 | Advanced Manual  | 0042         | '0042':1
  3 | Internal Spec    | 7654321      |
  4 | Internal Spec v2 | +7654321     |
  5 | Draft Notes      | ver003       | 'ver003':1
(5 rows)
```

In this example:

- The `version_code` "1" is indexed as `'1':1`.
- The `version_code` "0042" is indexed as `'0042':1`.
- The long version code "7654321" and "+7654321" are not indexed at all due to `maxlen` and `rejectlong`.
- The version code "ver003" is indexed as `'ver003':1` because it doesn't exceed the `maxlen` and is not purely numeric.

### Searching

Using the custom configuration, you can now search for specific version codes:

```sql
-- Find documents with version code '0042'
SELECT title, version_code FROM documents
WHERE version_tsv @@ to_tsquery('public.doc_search_config', '0042');
-- (Advanced Manual, '0042')

-- Try to find the long version code
SELECT title, version_code FROM documents
WHERE version_tsv @@ to_tsquery('public.doc_search_config', '7654321');
-- null (Expected: No results, as it was rejected)
```

## Limitations

- **Integer-specific:** `dict_int` is designed for whole numbers (integers). It does not process floating-point numbers (e.g., `3.14159`). Standard FTS tokenizers will handle floating-point numbers, but `dict_int`'s logic won't apply to them.
- **Text representation:** It operates on the textual representation of numbers as tokenized by the FTS parser. If your column is of type `INTEGER` and you cast it to `TEXT` for `to_tsvector`, `dict_int` will then process that text.

## Conclusion

The `dict_int` dictionary template is a valuable tool in Postgres for fine-tuning how integer values are handled in Full-Text Search. By customizing the way integers are indexed, you can achieve several benefits:

- **Reduced index size:** Custom integer dictionaries help prevent the proliferation of unique numeric lexemes by truncating or rejecting overly long numbers and normalizing signed ones. This keeps your FTS indexes smaller and more manageable.
- **Improved search performance:** As a general rule, smaller, more optimized indexes lead to faster search query execution.
- **More relevant search results:** By tailoring how numbers are processed, you can ensure that searches for numeric data are more aligned with user expectations and less susceptible to noise from irrelevant number formats.

## Resources

- [PostgreSQL `dict_int` documentation](https://www.postgresql.org/docs/current/dict-int.html)
- [Dictionary Testing with `ts_lexize`](https://www.postgresql.org/docs/current/textsearch-debugging.html#TEXTSEARCH-DICTIONARY-TESTING)
- [PostgreSQL Full Text Search](/postgresql/postgresql-indexes/postgresql-full-text-search)
- [Full Text Search using tsvector with Neon Postgres](/guides/full-text-search)
- [Postgres tsvector data type](/docs/data-types/tsvector)

<NeedHelp/>
