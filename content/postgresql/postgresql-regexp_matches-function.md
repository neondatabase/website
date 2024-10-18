---
title: 'PostgreSQL REGEXP_MATCHES() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-regexp_matches/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REGEXP_MATCHES()` function to extract substrings from a string based on a regular expression.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL REGEXP_MATCHES() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `REGEXP_MATCHES()` function allows you to extract substrings from a string based on a regular expression pattern.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax for the PostgreSQL `REGEXP_MATCHES()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
REGEXP_MATCHES(source_string, pattern [, flags])
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `REGEXP_MATCHES()` function accepts three arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

1. `source`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `source` is a string that you want to extract substrings that match a regular expression.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

2. `pattern`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `pattern` is a POSIX regular expression for matching.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

3. `flags`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `flags` argument is one or more characters that control the behavior of the function. For example, `i` allows you to match case-insensitively.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `REGEXP_MATCHES()` function returns a set of text, even if the result array only contains a single element.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL REGEXP_MATCHES() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `REGEXP_MATCHES()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic REGEXP_MATCHES() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `REGEXP_MATCHES()` function to extract hashtags such as `PostgreSQL` and `REGEXP_MATCHES` from a string:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    REGEXP_MATCHES('Learning #PostgreSQL #REGEXP_MATCHES',
         '#([A-Za-z0-9_]+)',
        'g');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
  regexp_matches
------------------
 {PostgreSQL}
 {REGEXP_MATCHES}
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the following regular expression matches any word that starts with the hash character (`#`) and is followed by any alphanumeric characters or underscore (`_`).

<!-- /wp:paragraph -->

<!-- wp:code -->

```
#([A-Za-z0-9_]+)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `g` flag argument is for the global search.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The result set has two rows, each is an [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/) (`text[]`), which indicates that there are two matches.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you want to transform the elements of the array into separate rows, you can use the `UNNEST()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    UNNEST(REGEXP_MATCHES('Learning #PostgreSQL #REGEXP_MATCHES',
         '#([A-Za-z0-9_]+)',
        'g')) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
     result
----------------
 PostgreSQL
 REGEXP_MATCHES
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL REGEXP_MATCHES() function with table data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the following `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4017,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2019-05-film.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `REGEXP_MATCHES()` function to retrieve films with descriptions containing the word `Cat` or `Dog`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  REGEXP_MATCHES(description, 'Cat | Dog ') cat_or_dog,
  description
FROM
  film;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `REGEXP_MATCHES()` function to extract text from a string based on a regular expression.
- <!-- /wp:list-item -->

<!-- /wp:list -->
