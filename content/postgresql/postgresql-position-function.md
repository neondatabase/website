---
title: 'PostgreSQL POSITION() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-position/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

The PostgreSQL `POSITION()` function returns the location of the first instance of a substring within a string.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `POSITION()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
POSITION(substring in string)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `POSITION()` function requires two arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `substring`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The substring argument is the string that you want to locate.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**2) `string`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `string` argument is the string for which the substring is searched.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Return Value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `POSITION()` function returns an [integer](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/) representing the location of the first instance of the substring within the input string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `POSITION()` function returns zero (0) if the substring is not found in the string. It returns NULL if either `substring` or `string` argument is null.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example returns the position of the `'Tutorial'` in the string `'PostgreSQL Tutorial'`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT POSITION('Tutorial' IN 'PostgreSQL Tutorial');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
position
----------
       12
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the `POSITION()` function searches for the substring case-insensitively.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

See the following example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT POSITION('tutorial' IN 'PostgreSQL Tutorial');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns zero (0), indicating that the string `tutorial` does not exist in the string `'PostgreSQL Tutorial'`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the `POSITION()` function to locate the first string `'fateful'` in the `description` column of the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  POSITION('Fateful' in description ),
  description
FROM
  film
WHERE
  POSITION('Fateful' in description ) > 0;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 position |                                                   description
----------+-----------------------------------------------------------------------------------------------------------------
        3 | A Fateful Reflection of a Moose And a Husband who must Overcome a Monkey in Nigeria
        3 | A Fateful Yarn of a Lumberjack And a Feminist who must Conquer a Student in A Jet Boat
        3 | A Fateful Yarn of a Womanizer And a Feminist who must Succumb a Database Administrator in Ancient India
        3 | A Fateful Display of a Womanizer And a Mad Scientist who must Outgun a A Shark in Soviet Georgia
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Remarks

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `POSITION()` function returns the location of the first instance of the substring in the string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT POSITION('is' IN 'This is a cat');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 position
----------
        3
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Even though the substring `'is'` appears twice in the string `'This is a cat'`, the `POSITION()` function returns the first match.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `POSITION()` function to locate the first instance of a substring within a string.
- <!-- /wp:list-item -->

<!-- /wp:list -->
