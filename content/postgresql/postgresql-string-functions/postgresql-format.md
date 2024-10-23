---
title: "PostgreSQL FORMAT() Function"
page_title: "PostgreSQL FORMAT: Formats Arguments based on a Format String"
page_description: "In this tutorial, you will learn how to use the PostgreSQL FORMAT() function to format arguments according to a format string."
prev_url: "https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-format/"
ogImage: "/postgresqltutorial/customer-table.png"
updatedOn: "2024-01-27T14:36:05+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL RTRIM() Function"
  slug: "postgresql-string-functions/postgresql-rtrim"
nextLink: 
  title: "PostgreSQL MD5() Function"
  slug: "postgresql-string-functions/postgresql-md5"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `FORMAT()` function to format a string based on a template.

If you have experience with the C programming language, you’ll notice that the `FORMAT()` function is similar to the `sprintf()` function.


## Introduction to PostgreSQL FORMAT() function

The `FORMAT()` function allows you to format strings based on a template.

Here’s the basic syntax of the `FORMAT()` function:


```csssqlsql
FORMAT(format_string, value1, value2, ...)
```
In this syntax:

* `format_string`: This is the input string that you want to format.
* `value1`, `value2`, …: These are values to be inserted into placeholders in the `format_string`.

The `FORMAT()` function returns a formatted string.

The `FORMAT()` function can be useful for creating dynamic strings with placeholders for variables.


### Format specifier

The following shows the syntax of the format specifier:


```
%[position][flags][width]type
```
A format specifier starts with `%` character and include three optional components `position`, `flags`, `with` and a required component `type`.

**position**

The `position` specifies which argument to be inserted in the result string. The `position` is in the form `n$` where `n` is the argument index. The first argument starts from 1\.

If you omit the `position` component, the default is the next argument in the list.

**flags**

The `flags` can accept a minus sign (\-) that instructs the format specifier’s output to be left\-justified.

The `flags` component only takes effect when the `width` field is specified.

**width**

The optional `width` field specifies the minimum number of characters to use for displaying the format specifier’s output.

The result string can be padded left or right with the spaces needed to fill the `width`.

If the `width` is too small, the output will be displayed as\-is without any truncation.

The `width` can be one of the following values:

* A positive integer.
* An asterisk (\*) to use the next function argument as the width.
* A string of the form `*n$` to use the `nth` function argument as the width.

**t****y****pe**

`type` is the type of format conversion to use to produce the format specifier’s output.

The permitted values for type argument are as follows:

* `s` formats the argument value as a string. NULL is treated as an empty string.
* `I` treats the argument value as an SQL identifier.
* `L` quotes the argument value as an SQL literal.

We often use `I` and `L` for constructing dynamic SQL statements.

If you want to include `%` in the result string, use double percentages `%%`


## PostgreSQL FORMAT() function examples

Let’s explore some examples of using the `FORMAT()` function.


### 1\) Basic PostgreSQL FORMAT() function example

The following statement uses the `FORMAT()` function to format a string:


```
SELECT FORMAT('Hello, %s','PostgreSQL');
```
Output:


```sql
'Hello, PostgreSQL'
```
In this example, the function replaces the `%s` with the `'PostgreSQL'` string argument.


### 2\) Using FORMAT() function with table data example

We’ll use the following `customer` table in the [sample database](../postgresql-getting-started/postgresql-sample-database).


![customer table](/postgresqltutorial/customer-table.png)
The following statement uses the `FORMAT()` function to construct customers’ full names from first names and last names:


```sql
SELECT 
    FORMAT('%s, %s',last_name, first_name) full_name 
FROM 
    customer
ORDER BY 
    full_name;
```
Output:


```sql
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
In this example, we used two format specifiers `%s %s` which are then replaced by values in the `first_name` and `last_name` columns.


### 3\) Using FORMAT() function with the flags component

The following statement uses the FORMAT() function with the `flags` and `with` components in the format specifier:


```
SELECT FORMAT('|%10s|', 'one');
```
The output string is left\-padded with spaces and right\-aligned.


```sql
    format
--------------
 |       one|
(1 row)
```
To make it left\-aligned, you use – as the flag:


```
SELECT FORMAT('|%-10s|', 'one');
```
The output is:


```sql
    format
--------------
 |one       |
(1 row)
```

### 4\) Using FORMAT() function with the position component

This example uses the FORMAT() function with the `position` component of the format specifier:


```
SELECT 
    FORMAT('%1$s apple, %2$s orange, %1$s banana', 'small', 'big');
```
The following illustrates the output:


```
                format
---------------------------------------
 small apple, big orange, small banana
(1 row)
```
In this example, we have two arguments which are `'small'` and `'big'` strings.

The `1$` and `2$` positions instruct the `FORMAT()` function to inject the first (`'small'`) and second arguments (`'big'`) into the corresponding placeholders.

The `1$` appears twice in the format string, therefore, the first argument is also inserted twice.


## Summary

* Use the PostgreSQL `FORMAT()` function to format a string based on a template.

