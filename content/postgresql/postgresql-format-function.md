---
title: 'PostgreSQL FORMAT() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-format/
ogImage: ./img/wp-content-uploads-2013-05-customer-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `FORMAT()` function to format a string based on a template.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

If you have experience with the C programming language, you'll notice that the `FORMAT()` function is similar to the `sprintf()` function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL FORMAT() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `FORMAT()` function allows you to format strings based on a template.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `FORMAT()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
FORMAT(format_string, value1, value2, ...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `format_string`: This is the input string that you want to format.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `value1`, `value2`, ...: These are values to be inserted into placeholders in the `format_string`.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `FORMAT()` function returns a formatted string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `FORMAT()` function can be useful for creating dynamic strings with placeholders for variables.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Format specifier

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following shows the syntax of the format specifier:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
%[position][flags][width]type
```

<!-- /wp:code -->

<!-- wp:paragraph -->

A format specifier starts with `%` character and include three optional components `position`, `flags`, `with` and a required component `type`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**position**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `position` specifies which argument to be inserted in the result string. The `position` is in the form `n$` where `n` is the argument index. The first argument starts from 1.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you omit the `position` component, the default is the next argument in the list.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**flags**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `flags` can accept a minus sign (-) that instructs the format specifier's output to be left-justified.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `flags` component only takes effect when the `width` field is specified.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**width**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The optional `width` field specifies the minimum number of characters to use for displaying the format specifier's output.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The result string can be padded left or right with the spaces needed to fill the `width`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `width` is too small, the output will be displayed as-is without any truncation.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `width` can be one of the following values:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A positive integer.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- An asterisk (\*) to use the next function argument as the width.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- A string of the form `*n$` to use the `nth` function argument as the width.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

**t\*\***y\***\*pe**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

`type` is the type of format conversion to use to produce the format specifier's output.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The permitted values for type argument are as follows:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `s` formats the argument value as a string. NULL is treated as an empty string.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `I` treats the argument value as an SQL identifier.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `L` quotes the argument value as an SQL literal.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

We often use `I` and `L` for constructing dynamic SQL statements.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you want to include `%` in the result string, use double percentages `%%`

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL FORMAT() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `FORMAT()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL FORMAT() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `FORMAT()` function to format a string:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT FORMAT('Hello, %s','PostgreSQL');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
'Hello, PostgreSQL'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the function replaces the `%s` with the `'PostgreSQL'` string argument.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using FORMAT() function with table data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the following `customer` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).

<!-- /wp:paragraph -->

<!-- wp:image {"id":456} -->

![customer table](./img/wp-content-uploads-2013-05-customer-table.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement uses the `FORMAT()` function to construct customers' full names from first names and last names:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    FORMAT('%s, %s',last_name, first_name) full_name
FROM
    customer
ORDER BY
    full_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       full_name
------------------------
 Abney, Rafael
 Adam, Nathaniel
 Adams, Kathleen
 Alexander, Diana
 Allard, Gordon
 Allen, Shirley
 Alvarez, Charlene
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we used two format specifiers `%s %s` which are then replaced by values in the `first_name` and `last_name` columns.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using FORMAT() function with the flags component

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the FORMAT() function with the `flags` and `with` components in the format specifier:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT FORMAT('|%10s|', 'one');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output string is left-padded with spaces and right-aligned.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
    format
--------------
 |       one|
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To make it left-aligned, you use - as the flag:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT FORMAT('|%-10s|', 'one');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
    format
--------------
 |one       |
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Using FORMAT() function with the position component

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the FORMAT() function with the `position` component of the format specifier:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    FORMAT('%1$s apple, %2$s orange, %1$s banana', 'small', 'big');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following illustrates the output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                format
---------------------------------------
 small apple, big orange, small banana
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we have two arguments which are `'small'` and `'big'` strings.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `1$` and `2$` positions instruct the `FORMAT()` function to inject the first (`'small'`) and second arguments (`'big'`) into the corresponding placeholders.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `1$` appears twice in the format string, therefore, the first argument is also inserted twice.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `FORMAT()` function to format a string based on a template.
- <!-- /wp:list-item -->

<!-- /wp:list -->
