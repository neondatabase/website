---
title: 'PostgreSQL CHR() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-chr/
ogImage: ./img/wp-content-uploads-2017-08-PostgreSQL-CHR-ASCII-example.png
tableOfContents: true
---
<!-- wp:paragraph -->

The PostgreSQL `CHR()` function converts an integer ASCII code to a character or a Unicode code point to a UTF8 character.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following shows the syntax of the `CHR()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CHR(num)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CHR()` function requires one argument:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `num`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The num argument is an integer that is converted to the corresponding ASCII code.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It could be a Unicode code point which is converted to a UTF8 character.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Return Value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CHR()` function returns a character that corresponds the the ASCII code value or Unicode code point.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example shows how to use the `CHR()` function to get the characters whose ASCII code value is 65 and 97:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    CHR(65),
    CHR(97);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query returns character A for 65 and a for 97:

<!-- /wp:paragraph -->

<!-- wp:image {"id":2913} -->

![PostgreSQL CHR - ASCII example](./img/wp-content-uploads-2017-08-PostgreSQL-CHR-ASCII-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Here is an example of getting the UTF8 character based on the Unicode code point 937:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    CHR(937);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output for the Unicode code point 937 is Ω, which is what we expected.

<!-- /wp:paragraph -->

<!-- wp:image {"id":2912} -->

![PostgreSQL CHR - Unicode example](./img/wp-content-uploads-2017-08-PostgreSQL-CHR-Unicode-example.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Remarks

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the ASCII code or UTF-8 character of an integer, you use the `ASCII()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `CHR()` function to get the character based on its ASCII value or Unicode code point.

<!-- /wp:paragraph -->
