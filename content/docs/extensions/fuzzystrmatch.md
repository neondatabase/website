---
title: The fuzzystrmatch extension
subtitle: Perform fuzzy string matching for names, typos, and similar-sounding words in
  Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.752Z'
tag: new
---

The `fuzzystrmatch` extension for Postgres provides a suite of functions to determine similarities and distances between strings. This is useful for applications that need to handle misspellings, phonetic variations, or simply find "close enough" matches in text data. Whether you're building a search engine, cleaning customer data, or trying to identify duplicate records, `fuzzystrmatch` offers powerful tools to compare strings beyond exact equality.

Imagine a user searching for "John Doe" but typing "Jon Dow", or needing to match "Smith" with "Smythe". `fuzzystrmatch` provides algorithms like [Soundex](https://en.wikipedia.org/wiki/Soundex), [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance), [Metaphone](https://en.wikipedia.org/wiki/Metaphone), and [Daitch-Mokotoff Soundex](https://en.wikipedia.org/wiki/Daitch%E2%80%93Mokotoff_Soundex) to tackle these challenges.

<CTA />

## Enable the `fuzzystrmatch` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Core functions and usage

`fuzzystrmatch` offers several algorithms, each with its strengths for different types of string comparisons.

### 1. Soundex

The Soundex system is a phonetic algorithm for indexing names by sound, as pronounced in English. It converts a string into a four-character code, where the first character is the first letter of the string, and the remaining three digits encode the consonants.

**Functions:**

- `soundex(text)` returns `text`: Computes the Soundex code of a string.
- `difference(text, text)` returns `int`: Computes the difference between the Soundex codes of two strings. The result ranges from 0 (no match) to 4 (exact match on Soundex codes).

**Examples:**

The `soundex` function generates the phonetic code, and `difference` measures how similar these codes are.
For instance, names that sound similar often share Soundex codes or have very similar ones:

- Pairs like ("Smith"/"Smythe") and ("John"/"Jon") yield the same Soundex codes (S530 and J500 respectively), indicating they sound very similar. The `difference` function confirms this with a score of 4 (an exact match on the Soundex code).
- Similarly, ("Robert"/"Rupert") both produce the Soundex code R163 and thus also have a `difference` score of 4.
- In contrast, a pair like ("Anne"/"Andrew") yields different Soundex codes (A500 vs A536) and a `difference` score of 2, reflecting a lesser degree of phonetic similarity according to Soundex.

Let's see these in action with SQL:

```sql
SELECT soundex('Smith'), soundex('Smythe');
-- s530, s530

SELECT difference('Smith', 'Smythe');
-- 4

SELECT soundex('John'), soundex('Jon');
-- J500, J500

SELECT difference('John', 'Jon');
-- 4

SELECT soundex('Robert'), soundex('Rupert');
-- R163, R163

SELECT difference('Anne', 'Andrew');
-- 2 (A500 vs A536)
```

**Use case:** Useful for matching English names that sound similar but are spelled differently. Note that Soundex is not very effective for non-English names.

### 2. Levenshtein distance

The Levenshtein distance measures the similarity between two strings by counting the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other. A lower distance indicates greater similarity.

**Functions:**

- `levenshtein(source text, target text)` returns `int`: Calculates Levenshtein distance with a cost of 1 for each insertion, deletion, or substitution.
- `levenshtein(source text, target text, ins_cost int, del_cost int, sub_cost int)` returns `int`: Calculates Levenshtein distance with specified costs for operations.
- `levenshtein_less_equal(source text, target text, max_d int)` returns `int`: An accelerated version. If the actual distance is less than or equal to `max_d`, it returns the correct distance; otherwise, it returns a value greater than `max_d`. This is faster if you only care about small distances.
- `levenshtein_less_equal(source text, target text, ins_cost int, del_cost int, sub_cost int, max_d int)` returns `int`: Accelerated version with custom costs.

Both `source` and `target` strings can be any non-null strings and be up to 255 characters long.

**Examples:**

The Levenshtein distance quantifies the "edit effort" between strings. Consider these transformations:

1. To change "kitten" to "sitting":

   - Substitute 'k' with 's' (kitten -> sitten)
   - Substitute 'e' with 'i' (sitten -> sittin)
   - Insert 'g' at the end (sittin -> sitting)

   This requires 3 edits, so the Levenshtein distance is 3.

2. To change "apple" to "apply":

   - Substitute 'e' with 'y' (apple -> apply)

   This is 1 edit, giving a distance of 1.

3. If comparing "book" and "back":
   - Substitute 'o' with 'a' (book -> baok)
   - Substitute 'o' with 'c' (baok -> back)
     This requires 2 edits, resulting in a distance of 2.

The function can also take custom costs for insertion, deletion, and substitution, which can be useful for domain-specific needs.

Let's see these in action with SQL:

```sql
-- kitten to sitting (default costs: 1 for ins, del, sub)
SELECT levenshtein('kitten', 'sitting');
-- 3

-- apple to apply
SELECT levenshtein('apple', 'apply');
-- 1

-- book to back
SELECT levenshtein('book', 'back');
-- 2

-- Levenshtein distance is case-sensitive
SELECT levenshtein('book', 'Book');
-- 1

-- Example with custom costs: 1 for ins, 2 for del, 3 for sub
SELECT levenshtein('book', 'back', 1, 2, 3);
-- 6
-- Few possible paths of minimum cost:
-- 2 substitutions(o -> a, o -> c): cost = 2 x 3 (for substitution) = 6)
-- delete 2 o's and insert a c: cost = 2 x 2 (for deletion) + 2 x 1 (for insertion) = 6

-- Using levenshtein_less_equal for efficiency when only small distances matter
SELECT levenshtein_less_equal('banana', 'bandana', 1);
-- Returns 1 (correct, as only one insertion 'd' is needed)

SELECT levenshtein_less_equal('longstringexample', 'short', 2);
-- Returns a value > 2 (actual distance is much higher, so it stops early)
```

**Use case:** Excellent for general typo correction, finding strings with minor differences, and when character-level edit distance is important. Works well with various languages, including those with multibyte encodings. Remember that Levenshtein is case-sensitive.

### 3. Metaphone and double metaphone

Metaphone algorithms, like Soundex, generate phonetic codes for strings. They are generally more accurate than Soundex for English words. Double metaphone provides primary and alternate encodings, offering better support for non-English words.

**Functions:**

- `metaphone(text, max_output_length int)` returns `text`: Computes the metaphone code for a string, up to a specified maximum length.
- `dmetaphone(text)` returns `text`: Computes the primary Double metaphone code.
- `dmetaphone_alt(text)` returns `text`: Computes the alternate Double metaphone code (returns `NULL` if no alternate exists).

**Examples:**

```sql
SELECT metaphone('Michael', 8);
-- MXL

SELECT metaphone('algorithm', 10);
-- ALKR0M

SELECT dmetaphone('Smith'), dmetaphone_alt('Smith');
-- SM0, XMT

SELECT dmetaphone('Schmidt');
-- XMT

SELECT dmetaphone_alt('Schmidt');
-- SMT

-- Primary and alternate for a name with multiple pronunciations
SELECT dmetaphone('Joan'), dmetaphone_alt('Joan'); -- Spanish 'Joan Miró'
-- JN, AN
```

**Use case:** Good for matching English words phonetically. Double Metaphone is an improvement, especially with its alternate codes for handling variations in pronunciation and non-English names.

### 4. Daitch-Mokotoff Soundex

Daitch-Mokotoff (DM) Soundex is another phonetic algorithm, significantly more useful for non-English names than the original Soundex.

**Key improvements over original Soundex:**

- Codes are based on the first six meaningful letters (not four).
- Maps letters/combinations to ten possible codes (not seven).
- Multiple codes can be emitted if a letter/combination has different sounds.

**Function:**

`daitch_mokotoff(source text) returns text[]`: Generates an array of Daitch-Mokotoff Soundex codes for the input string. The result is an array because a name can have multiple plausible pronunciations.

DM codes are 6 digits long. `source` should preferably be a single word or name.

**Examples:**

```sql
SELECT daitch_mokotoff('George');
-- {595000}

SELECT daitch_mokotoff('John');
-- {160000,460000}  (Reflects 'J' vs 'Y' sound possibilities)

SELECT daitch_mokotoff('Bierschbach');
-- {794575,794574,794750,794740,745750,745740,747500,747400}
```

**Matching Daitch-Mokotoff codes:**
Since `daitch_mokotoff` returns an array, you can use the array overlap operator `&&` for matching:

```sql
CREATE TABLE surnames (name TEXT);
INSERT INTO surnames VALUES ('Peterson'), ('Petersen'), ('Pietersen');

SELECT name FROM surnames
WHERE daitch_mokotoff(name) && daitch_mokotoff('Petterson');
```

```
  name
-----------
 Peterson
 Petersen
 Pietersen
(3 rows)
```

**Use case:** Best for phonetic matching of European names, particularly when Soundex is insufficient. Works with multibyte encodings.

## Practical usage scenarios

Let's see how these functions can be applied in common scenarios.

### Finding misspelled names in a customer database

Suppose you have a `customers` table and want to find customers whose names are similar to "Jon Smithe".

```sql
CREATE TABLE customers (id INT, name TEXT);
INSERT INTO customers VALUES
  (1, 'John Smith'),
  (2, 'Jon Smythe'),
  (3, 'Jane Doe'),
  (4, 'Jonathan Smithson');

-- Using Levenshtein distance
SELECT * FROM customers
WHERE levenshtein(lower(name), lower('Jon Smithe')) <= 3;
```

```
 id |      name
----+-----------------
  1 | John Smith
  2 | Jon Smythe
(2 rows)
```

```sql
-- Using Soundex difference
SELECT * FROM customers
WHERE difference(name, 'Jon Smithe') >= 3;
```

```
 id |    name
----+------------
  1 | John Smith
  2 | Jon Smythe
  4 | Jonathan Smithson
(3 rows)
```

### Typo correction in search input

It can be useful to suggest corrections for user input. For example, if a user types "Portgeasql", you can suggest "PostgreSQL":

```sql
WITH potential_matches AS (
  SELECT 'PostgreSQL' AS term
  UNION ALL SELECT 'MySQL'
  UNION ALL SELECT 'SQLite'
)
SELECT term, levenshtein(lower(term), 'portgeasql') AS distance
FROM potential_matches
ORDER BY distance
LIMIT 1;
```

```
   term       | distance
-----------+----------
PostgreSQL |    3
(1 row)
```

Let's say the user types "sequelite" instead of "SQLite":

```sql
WITH potential_matches AS (
  SELECT 'PostgreSQL' AS term
  UNION ALL SELECT 'MySQL'
  UNION ALL SELECT 'SQLite'
)
SELECT term, levenshtein(lower(term), 'sequelite') AS distance
FROM potential_matches
ORDER BY distance
LIMIT 1;
```

```
   term       | distance
-----------+----------
 SQLite    |        3
(1 row)
```

The values can then be used to suggest corrections or alternatives to the user.

## Limitations and considerations

- **Multibyte encodings:** `soundex`, `metaphone`, `dmetaphone`, and `dmetaphone_alt` are not reliable for UTF-8 or other multibyte encodings. Use `daitch_mokotoff` or `levenshtein` for such cases.
- **Phonetic nuances:** Phonetic algorithms simplify pronunciation. They might not always align perfectly with intended pronunciations or capture all linguistic subtleties, potentially leading to false positives or negatives.
- **Computational cost:** Levenshtein distance can be resource-intensive on large datasets without `levenshtein_less_equal` or proper indexing strategies.

## Conclusion

The `fuzzystrmatch` extension is useful for tackling the common problem of inexact string matching. By understanding the strengths and weaknesses of functions like `soundex`, `levenshtein`, `metaphone`, `dmetaphone`, and `daitch_mokotoff`, you can enhance your application's ability to handle typos, phonetic variations, and find similar text data effectively. Always consider the nature of your data (especially language and encoding) and your specific matching requirements when choosing the right function.

## Resources

- [PostgreSQL `fuzzystrmatch` documentation](https://www.postgresql.org/docs/current/fuzzystrmatch.html)
- Algorithms:
  - [Soundex](https://en.wikipedia.org/wiki/Soundex)
  - [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
  - [Metaphone](https://en.wikipedia.org/wiki/Metaphone)
  - [Daitch-Mokotoff Soundex](https://en.wikipedia.org/wiki/Daitch%E2%80%93Mokotoff_Soundex)

<NeedHelp />
