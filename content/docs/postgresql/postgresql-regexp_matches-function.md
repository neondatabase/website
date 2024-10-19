---
title: 'PostgreSQL REGEXP_MATCHES() Function'
redirectFrom:
            - /docs/postgresql/postgresql-regexp_matches 
            - /docs/postgresql/postgresql-string-functions/postgresql-regexp_matches
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-film.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REGEXP_MATCHES()` function to extract substrings from a string based on a regular expression.

## Introduction to the PostgreSQL REGEXP_MATCHES() function

The `REGEXP_MATCHES()` function allows you to extract substrings from a string based on a regular expression pattern.

Here's the basic syntax for the PostgreSQL `REGEXP_MATCHES()` function:

```sql
REGEXP_MATCHES(source_string, pattern [, flags])
```

The `REGEXP_MATCHES()` function accepts three arguments:

1. `source`

The `source` is a string that you want to extract substrings that match a regular expression.

2. `pattern`

The `pattern` is a POSIX regular expression for matching.

3. `flags`

The `flags` argument is one or more characters that control the behavior of the function. For example, `i` allows you to match case-insensitively.

The `REGEXP_MATCHES()` function returns a set of text, even if the result array only contains a single element.

## PostgreSQL REGEXP_MATCHES() function examples

Let's explore some examples of using the `REGEXP_MATCHES()` function.

### 1) Basic REGEXP_MATCHES() function examples

The following example uses the `REGEXP_MATCHES()` function to extract hashtags such as `PostgreSQL` and `REGEXP_MATCHES` from a string:

```sql
SELECT
    REGEXP_MATCHES('Learning #PostgreSQL #REGEXP_MATCHES',
         '#([A-Za-z0-9_]+)',
        'g');
```

Output:

```
  regexp_matches
------------------
 {PostgreSQL}
 {REGEXP_MATCHES}
(2 rows)
```

In this example, the following regular expression matches any word that starts with the hash character (`#`) and is followed by any alphanumeric characters or underscore (`_`).

```
#([A-Za-z0-9_]+)
```

The `g` flag argument is for the global search.

The result set has two rows, each is an [array](/docs/postgresql/postgresql-array) (`text[]`), which indicates that there are two matches.

If you want to transform the elements of the array into separate rows, you can use the `UNNEST()` function:

```sql
SELECT
    UNNEST(REGEXP_MATCHES('Learning #PostgreSQL #REGEXP_MATCHES',
         '#([A-Za-z0-9_]+)',
        'g')) result;
```

Output:

```
     result
----------------
 PostgreSQL
 REGEXP_MATCHES
(2 rows)
```

### 2) Using the PostgreSQL REGEXP_MATCHES() function with table data example

We'll use the following `film` table from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial_data/wp-content-uploads-2019-05-film.png)

The following statement uses the `REGEXP_MATCHES()` function to retrieve films with descriptions containing the word `Cat` or `Dog`:

```sql
SELECT
  REGEXP_MATCHES(description, 'Cat | Dog ') cat_or_dog,
  description
FROM
  film;
```

Output:

```
 cat_or_dog |                                                    description
------------+--------------------------------------------------------------------------------------------------------------------
 {"Cat "}   | A Epic Drama of a Cat And a Explorer who must Redeem a Moose in Australia
 {"Cat "}   | A Boring Epistle of a Butler And a Cat who must Fight a Pastry Chef in A MySQL Convention
 {"Cat "}   | A Brilliant Drama of a Cat And a Mad Scientist who must Battle a Feminist in A MySQL Convention
 {" Dog "}  | A Fast-Paced Character Study of a Composer And a Dog who must Outgun a Boat in An Abandoned Fun House
 {" Dog "}  | A Touching Panorama of a Waitress And a Woman who must Outrace a Dog in An Abandoned Amusement Park
 {" Dog "}  | A Astounding Story of a Dog And a Squirrel who must Defeat a Woman in An Abandoned Amusement Park
...
```

## Summary

- Use the PostgreSQL `REGEXP_MATCHES()` function to extract text from a string based on a regular expression.
