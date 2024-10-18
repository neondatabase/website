---
title: 'PostgreSQL REGEXP_REPLACE() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/regexp_replace/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REGEXP_REPLACE()` function to replace strings that match a regular expression.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The PostgreSQL `REGEXP_REPLACE()` function replaces substrings that match a [POSIX regular expression](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX-Extended_Regular_Expressions) with a new substring.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that if you want to perform simple string replacement, you can use the `REPLACE()` function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The syntax of the PostgreSQL `REGEXP_REPLACE()` function is as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
REGEXP_REPLACE(source, pattern, replacement_string,[, flags])
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `REGEXP_REPLACE()` function accepts four arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `source`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The source is a string that replacement should take place.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**2) `pattern`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The pattern is a POSIX regular expression for matching substrings that should be replaced.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**3) `replacement_string`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `replacement_string` is a string that replaces the substrings that match the regular expression pattern.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**4) `flags`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `flags` argument is one or more characters that control the matching behavior of the function e.g., `i` allows case-insensitive matching, `n` enables matching any character and also the newline character.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Return value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `REGEXP_REPLACE()` function returns a new string with the substrings, which match a regular expression pattern, replaced by a new substring.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples to understand how the `REGEXP_REPLACE()` function works.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Name rearrangement

<!-- /wp:heading -->

<!-- wp:paragraph -->

Suppose, you have the name of a person in the following format:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
first_name last_name
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, `John Doe`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

You want to rearrange this name as follows for reporting purposes.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
last_name, first_name
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To do this, you can use the `REGEXP_REPLACE()` function as shown below:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT REGEXP_REPLACE('John Doe','(.*) (.*)','\2, \1');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output of the statement is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
'Doe, John'
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) String removal

<!-- /wp:heading -->

<!-- wp:paragraph -->

Imagine you have string data with mixed alphabets and digits as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ABC12345xyz
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement removes all alphabets e.g., A, B, C, etc from the source string:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT REGEXP_REPLACE('ABC12345xyz','[[:alpha:]]','','g');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
'12345'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example,

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `[[:alpha:]]`matches any alphabets
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `''` is the replacement string
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `'g'` instructs the function to remove all alphabets, not just the first one.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Similarly, you can remove all digits in the source string by using the following statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT REGEXP_REPLACE('ABC12345xyz','[[:digit:]]','','g');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
'ABCxyz'
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Redundant space removal

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `REGEXP_REPLACE()` function to remove redundant spaces:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT REGEXP_REPLACE('Your string with   redundant    spaces', '\s{2,}', ' ', 'g') AS cleaned_string;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
          cleaned_string
-----------------------------------
 Your string with redundant spaces
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `REGEXP_REPLACE()` function to match two or more consecutive spaces and replace them with a single space.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `REGEXP_REPLACE()` function to replace substrings that match a regular expression with a new substring.
- <!-- /wp:list-item -->

<!-- /wp:list -->
