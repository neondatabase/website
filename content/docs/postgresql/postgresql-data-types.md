---
title: 'PostgreSQL Data Types'
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-05-PostgreSQL-Data-Types-300x254.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about **PostgreSQL data types** including Boolean, character, numeric, temporal, array, json, UUID, and special types.

## ![PostgreSQL Data Types](/postgresqltutorial_data/wp-content-uploads-2013-05-PostgreSQL-Data-Types-300x254.png "PostgreSQL Data Types")Overview of PostgreSQL data types

PostgreSQL supports the following data types:

- [Boolean](/docs/postgresql/postgresql-boolean)
-
- [Character](/docs/postgresql/postgresql-char-varchar-text/) types such as [`char`, `varchar`, and `text`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text).
-
- Numeric types such as integer and floating-point number.
-
- Temporal types such as [date](/docs/postgresql/postgresql-date/), [time](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/), [timestamp](/docs/postgresql/postgresql-tutorial/postgresql-timestamp), and [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval)
-
- [UUID](/docs/postgresql/postgresql-uuid) for storing Universally Unique Identifiers
-
- [Array](/docs/postgresql/postgresql-array) for storing array strings, numbers, etc.
-
- [JSON](/docs/postgresql/postgresql-json) stores JSON data
-
- [hstore](/docs/postgresql/postgresql-hstore) stores key-value pair
-
- Special types such as network address and geometric data.

## Boolean

A [Boolean](/docs/postgresql/postgresql-boolean) data type can hold one of three possible values: true, false, or null. You use `boolean` or `bool` keyword to declare a column with the Boolean data type.

When you [insert data](/docs/postgresql/postgresql-insert) into a Boolean column, PostgreSQL converts it to a Boolean value

- `1`, `yes`, `y`, `t`, `true` values are converted to `true`
-
- `0`, `no`, `false`, `f` values are converted to `false`.

When you [select data](/docs/postgresql/postgresql-select) from a Boolean column, PostgreSQL converts the values back e.g., `t` to true, `f` to `false` and `space` to `null`.

## Character

PostgreSQL provides three [character data types](/docs/postgresql/postgresql-char-varchar-text): `CHAR(n)`, `VARCHAR(n)`, and `TEXT`

- `CHAR(n)` is the fixed-length character with space padded. If you insert a string that is shorter than the length of the column, PostgreSQL pads spaces. If you insert a string that is longer than the length of the column, PostgreSQL will issue an error.
-
- `VARCHAR(n)` is the variable-length character string. The `VARCHAR(n)` allows you to store up to `n` characters. PostgreSQL does not pad spaces when the stored string is shorter than the length of the column.
-
- `TEXT` is the variable-length character string. Theoretically, text data is a character string with unlimited length.

## Numeric

PostgreSQL provides two distinct types of numbers:

- [integers](/docs/postgresql/postgresql-integer)
-
- floating-point numbers

### Integer

There are three kinds of integers in PostgreSQL:

- Small integer ( `SMALLINT`) is a 2-byte signed integer that has a range from -32,768 to 32,767.
-
- Integer ( `INT`) is a 4-byte integer that has a range from -2,147,483,648 to 2,147,483,647.
-
- [Serial](/docs/postgresql/postgresql-serial) is the same as integer except that PostgreSQL will automatically generate and populate values into the `SERIAL` column. This is similar to `AUTO_INCREMENT` column in MySQL or `AUTOINCREMENT` column in SQLite.

### Floating-point number

There are three main types of floating-point numbers:

- `float(n)` is a floating-point number whose precision, is at least, n, up to a maximum of 8 bytes.
-
- `real`or `float8`is a 4-byte floating-point number.
-
- `numeric`or `numeric(p,s)` is a real number with p digits with s number after the decimal point. This `numeric(p,s)` is the exact number.

## Temporal data types

The temporal data types allow you to store date and /or time data. PostgreSQL has five main temporal data types:

- `DATE` stores the dates only.
-
- `TIME` stores the time of day values.
-
- `TIMESTAMP` stores both date and time values.
-
- `TIMESTAMPTZ` is a timezone-aware timestamp data type. It is the abbreviation for [timestamp](/docs/postgresql/postgresql-timestamp) with the time zone.
-
- `INTERVAL` stores periods.

The `TIMESTAMPTZ` is PostgreSQL's extension to the SQL standard's temporal data types.

## Arrays

In PostgreSQL, you can store an [array](/docs/postgresql/postgresql-array) of strings, an array of integers, etc., in array columns. The array comes in handy in some situations e.g., storing days of the week, and months of the year.

## JSON

PostgreSQL provides two JSON data types: `JSON` and `JSONB` for storing JSON data.

The `JSON` data type stores plain JSON data that requires reparsing for each processing, while `JSONB` data type stores `JSON` data in a binary format which is faster to process but slower to insert. In addition, `JSONB` supports indexing, which can be an advantage.

## UUID

The `UUID` data type allows you to store Universal Unique Identifiers defined by [RFC 4122](https://tools.ietf.org/html/rfc4122 "UUID") . The `UUID` values guarantee a better uniqueness than `SERIAL` and can be used to hide sensitive data exposed to the public such as values of `id` in URL.

## Special data types

Besides the primitive data types, PostgreSQL also provides several special data types related to geometry and network.

- `box` - a rectangular box.
-
- `line`- a set of points.
-
- `point` - a geometric pair of numbers.
-
- `lseg` - a line segment.
-
- `polygon` - a closed geometric.
-
- `inet` - an IP4 address.
-
- `macaddr`- a MAC address.

In this tutorial, we have introduced you to the PostgreSQL data types so that you can use them to create tables in the next tutorial.
