---
title: 'PostgreSQL REGEXP_REPLACE() Function'
redirectFrom:
            - /docs/postgresql/postgresql-regexp_replace 
            - /docs/postgresql/postgresql-string-functions/regexp_replace
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REGEXP_REPLACE()` function to replace strings that match a regular expression.

The PostgreSQL `REGEXP_REPLACE()` function replaces substrings that match a [POSIX regular expression](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX-Extended_Regular_Expressions) with a new substring.

Note that if you want to perform simple string replacement, you can use the `REPLACE()` function.

## Syntax

The syntax of the PostgreSQL `REGEXP_REPLACE()` function is as follows:

```
REGEXP_REPLACE(source, pattern, replacement_string,[, flags])
```

## Arguments

The `REGEXP_REPLACE()` function accepts four arguments:

**1) `source`**

The source is a string that replacement should take place.

**2) `pattern`**

The pattern is a POSIX regular expression for matching substrings that should be replaced.

**3) `replacement_string`**

The `replacement_string` is a string that replaces the substrings that match the regular expression pattern.

**4) `flags`**

The `flags` argument is one or more characters that control the matching behavior of the function e.g., `i` allows case-insensitive matching, `n` enables matching any character and also the newline character.

## Return value

The PostgreSQL `REGEXP_REPLACE()` function returns a new string with the substrings, which match a regular expression pattern, replaced by a new substring.

## Examples

Let's take some examples to understand how the `REGEXP_REPLACE()` function works.

### 1) Name rearrangement

Suppose, you have the name of a person in the following format:

```
first_name last_name
```

For example, `John Doe`

You want to rearrange this name as follows for reporting purposes.

```
last_name, first_name
```

To do this, you can use the `REGEXP_REPLACE()` function as shown below:

```
SELECT REGEXP_REPLACE('John Doe','(.*) (.*)','\2, \1');
```

The output of the statement is:

```
'Doe, John'
```

### 2) String removal

Imagine you have string data with mixed alphabets and digits as follows:

```
ABC12345xyz
```

The following statement removes all alphabets e.g., A, B, C, etc from the source string:

```
SELECT REGEXP_REPLACE('ABC12345xyz','[[:alpha:]]','','g');
```

The output is:

```
'12345'
```

In this example,

- `[[:alpha:]]`matches any alphabets
-
- `''` is the replacement string
-
- `'g'` instructs the function to remove all alphabets, not just the first one.

Similarly, you can remove all digits in the source string by using the following statement:

```
SELECT REGEXP_REPLACE('ABC12345xyz','[[:digit:]]','','g');
```

The output is:

```
'ABCxyz'
```

### 3) Redundant space removal

The following example uses the `REGEXP_REPLACE()` function to remove redundant spaces:

```
SELECT REGEXP_REPLACE('Your string with   redundant    spaces', '\s{2,}', ' ', 'g') AS cleaned_string;
```

Output:

```
          cleaned_string
-----------------------------------
 Your string with redundant spaces
(1 row)
```

In this example, we use the `REGEXP_REPLACE()` function to match two or more consecutive spaces and replace them with a single space.

## Summary

- Use the PostgreSQL `REGEXP_REPLACE()` function to replace substrings that match a regular expression with a new substring.
