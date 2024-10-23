---
title: 'PostgreSQL TO_NUMBER() Function'
page_title: 'PostgreSQL TO_NUMBER() Function By Examples'
page_description: 'This tutorial shows you how to use the PostgreSQL TO_NUMBER() function to convert a string to a numeric value based on the specified format.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-to_number/'
ogImage: ''
updatedOn: '2024-01-29T02:05:33+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL TO_CHAR() Function'
  slug: 'postgresql-string-functions/postgresql-to_char'
nextLink:
  title: 'PostgreSQL Math Functions'
  slug: 'postgresql-string-functions/../postgresql-math-functions'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TO_NUMBER()` function to convert a [character string](../postgresql-tutorial/postgresql-char-varchar-text) to a [numeric](../postgresql-tutorial/postgresql-numeric) value according to a specified format.

## Introduction to the PostgreSQL TO_NUMBER() function

The PostgreSQL `TO_NUMBER()` function allows you to convert a string to a number based on a specified format.

Here’s the basic syntax of the `TO_NUMBER()` function:

```csssql
TO_NUMBER(string, format)
```

The `TO_NUMBER()` function requires two arguments:

- string: This is a string that you want to convert to a number.
- format: This is the format that specifies how the string should be interpreted as a number.

The `TO_NUMBER()` function returns a value whose data type is numeric.

The following table illustrates the list of valid formats:

| Format     | Description                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| 9          | Numeric value with the specified number of digits                                                   |
| 0          | Numeric value with leading zeros                                                                    |
| . (period) | decimal point                                                                                       |
| D          | Sign anchored to a number that uses the locale                                                      |
| , (comma)  | group (thousand) separator                                                                          |
| FM         | Fill mode, which suppresses padding blanks and leading zeroes.                                      |
| PR         | Negative value in angle brackets.                                                                   |
| S          | Sign anchored to a number that uses locale                                                          |
| L          | Currency symbol that uses locale                                                                    |
| G          | Group separator that uses locale                                                                    |
| MI         | Minus sign in the specified position for numbers that are less than 0\.                             |
| PL         | Plus sign in the specified position for numbers that are greater than 0\.                           |
| SG         | Plus / minus sign in the specified position                                                         |
| RN         | Roman numeral ranges from 1 to 3999 – currently, it **does not work** for the Roman numeric string. |
| TH or th   | Upper case or lower case ordinal number suffix                                                      |

Noted that these format strings are also applicable to [`TO_CHAR()`](postgresql-to_char) function.

## PostgreSQL TO_NUMBER() function examples

Let’s take a look at some examples of using the `TO_NUMBER()` function to understand how it works.

### 1\) Converting a string to a number

The following example uses the `TO_NUMBER()` function to convert the string `'12,345.6-'` to a number.

```
SELECT
    TO_NUMBER(
        '12,345.6-',
        '99G999D9S'
    );
```

The output is:

```sql
 to_number
-----------
  -12345.6
(1 row)
```

In this example:

- `'12,345.6-'` is the input that we want to convert to a number. The input string consists of a group separator (`,`), a decimal point (`.`), and a minus sign (`-`) indicating a negative number.
- `'99G999D9S'` is the format pattern used to interpret the input string. Each character in the format pattern has a specific meaning:
  - `9`: A digit placeholder.
  - `G`: The group separator (`,`).
  - `D`: The decimal point (`.`).
  - `S`: The sign (either `+` or `-`).

The TO_NUMBER() parses the input string `'12,345.6-'` according to the format `'99G999D9S'` and returns a numeric value `-12345.6`

### 2\) Converting a money amount to a number

The following example uses the `TO_NUMBER()` function to convert a money amount to a number:

```css
SELECT
    TO_NUMBER(
        '$1,234,567.89',
        'L9G999g999.99'
    );
```

Here is the result:

```sql
to_number
-----------
 1234567.89
(1 row)
```

In this example:

- `'$1,234,567.89'` is the input string representing a money amount. It includes a dollar sign (`$`), a group separator (`,`), a decimal point (`.`), and numeric digits.
- `'L9G999g999.99'` is the format string that the `TO_NUMBER()` function interprets the money amount. Each character in the format string has a specific meaning:
  - `L`: A local currency symbol (in this case, the dollar sign `$`).
  - `9`: A digit placeholder.
  - `G`: The group separator (`,` in this case).
  - `g`: An optional occurrence of the group separator (`,`), which allows for flexible formatting.
  - `.`: The decimal point.
  - `99`: Two\-digit placeholders for the fractional part (cents).

Since the provided format matches the input string, the function parses the string accordingly and returns the number `1234567.89`.

### 3\) Format control

If you don’t specify .99 in the format string, the `TO_NUMBER()` function will not parse the part after the decimal place. For example:

```http
SELECT
    TO_NUMBER(
        '1,234,567.89',
        '9G999g999'
    );
```

It returned `1234567` instead of `1234567.89` as follows:

```sql
 to_number
-----------
   1234567
(1 row)
```

### 4\) Format string does not match the input string

The following statement uses the `TO_NUMBER()` function to convert a string to a number but the format string does not match:

```
SELECT TO_NUMBER('1,234,567.89', '999G999.99');
```

Output:

```
ERROR:  numeric field overflow
DETAIL:  A field with precision 6, scale 0 must round to an absolute value less than 10^6.
```

The `TO_NUMBER()` function issues an error in this case.

## Summary

- Use the PostgreSQL `TO_NUMBER()` function to convert a string to a numeric value.
