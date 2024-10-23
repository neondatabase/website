---
title: 'PostgreSQL CHR() Function'
page_title: 'PostgreSQL CHR: Get Character Based on ASCII or Unicode Code Point'
page_description: 'This tutorial shows you how to use the PostgreSQL CHR() function to get the character based on its ASCII value or Unicode code point.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-chr/'
ogImage: '/postgresqltutorial/PostgreSQL-CHR-ASCII-example.png'
updatedOn: '2024-01-29T01:38:05+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL ASCII() Function'
  slug: 'postgresql-string-functions/postgresql-ascii'
nextLink:
  title: 'PostgreSQL INITCAP() Function'
  slug: 'postgresql-string-functions/postgresql-letter-case-functions'
---

The PostgreSQL `CHR()` function converts an integer ASCII code to a character or a Unicode code point to a UTF8 character.

## Syntax

The following shows the syntax of the `CHR()` function:

```
CHR(num)
```

## Arguments

The `CHR()` function requires one argument:

**1\) `num`**

The num argument is an integer that is converted to the corresponding ASCII code.

It could be a Unicode code point which is converted to a UTF8 character.

## Return Value

The `CHR()` function returns a character that corresponds the the ASCII code value or Unicode code point.

## Examples

The following example shows how to use the `CHR()` function to get the characters whose ASCII code value is 65 and 97:

```
SELECT
    CHR(65),
    CHR(97);
```

The query returns character A for 65 and a for 97:

![PostgreSQL CHR - ASCII example](/postgresqltutorial/PostgreSQL-CHR-ASCII-example.png)
Here is an example of getting the UTF8 character based on the Unicode code point 937:

```
SELECT
    CHR(937);
```

The output for the Unicode code point 937 is Ω, which is what we expected.

![PostgreSQL CHR - Unicode example](/postgresqltutorial/PostgreSQL-CHR-Unicode-example.png)

## Remarks

To get the ASCII code or UTF\-8 character of an integer, you use the [`ASCII()`](postgresql-ascii) function.

In this tutorial, you have learned how to use the PostgreSQL `CHR()` function to get the character based on its ASCII value or Unicode code point.
