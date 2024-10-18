---
title: 'PostgreSQL Data Types'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/
ogImage: ./img/wp-content-uploads-2013-05-PostgreSQL-Data-Types-300x254.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about **PostgreSQL data types** including Boolean, character, numeric, temporal, array, json, UUID, and special types.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## ![PostgreSQL Data Types](./img/wp-content-uploads-2013-05-PostgreSQL-Data-Types-300x254.png "PostgreSQL Data Types")Overview of PostgreSQL data types

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL supports the following data types:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Boolean](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-boolean/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Character](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/) types such as [`char`, `varchar`, and `text`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Numeric types such as integer and floating-point number.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Temporal types such as [date](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date/), [time](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/), [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/), and [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [UUID](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-uuid/) for storing Universally Unique Identifiers
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/) for storing array strings, numbers, etc.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [JSON](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-json/) stores JSON data
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [hstore](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-hstore/) stores key-value pair
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Special types such as network address and geometric data.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Boolean

<!-- /wp:heading -->

<!-- wp:paragraph -->

A [Boolean](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-boolean/) data type can hold one of three possible values: true, false, or null. You use `boolean` or `bool` keyword to declare a column with the Boolean data type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you [insert data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into a Boolean column, PostgreSQL converts it to a Boolean value

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `1`, `yes`, `y`, `t`, `true` values are converted to `true`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `0`, `no`, `false`, `f` values are converted to `false`.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

When you [select data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) from a Boolean column, PostgreSQL converts the values back e.g., `t` to true, `f` to `false` and `space` to `null`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Character

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides three [character data types](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/): `CHAR(n)`, `VARCHAR(n)`, and `TEXT`

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `CHAR(n)` is the fixed-length character with space padded. If you insert a string that is shorter than the length of the column, PostgreSQL pads spaces. If you insert a string that is longer than the length of the column, PostgreSQL will issue an error.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `VARCHAR(n)` is the variable-length character string. The `VARCHAR(n)` allows you to store up to `n` characters. PostgreSQL does not pad spaces when the stored string is shorter than the length of the column.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `TEXT` is the variable-length character string. Theoretically, text data is a character string with unlimited length.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Numeric

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides two distinct types of numbers:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [integers](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-integer/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- floating-point numbers
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### Integer

<!-- /wp:heading -->

<!-- wp:paragraph -->

There are three kinds of integers in PostgreSQL:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Small integer ( `SMALLINT`) is a 2-byte signed integer that has a range from -32,768 to 32,767.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Integer ( `INT`) is a 4-byte integer that has a range from -2,147,483,648 to 2,147,483,647.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Serial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-serial/) is the same as integer except that PostgreSQL will automatically generate and populate values into the `SERIAL` column. This is similar to `AUTO_INCREMENT` column in MySQL or `AUTOINCREMENT` column in SQLite.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### Floating-point number

<!-- /wp:heading -->

<!-- wp:paragraph -->

There are three main types of floating-point numbers:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `float(n)` is a floating-point number whose precision, is at least, n, up to a maximum of 8 bytes.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `real`or `float8`is a 4-byte floating-point number.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `numeric`or `numeric(p,s)` is a real number with p digits with s number after the decimal point. This `numeric(p,s)` is the exact number.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Temporal data types

<!-- /wp:heading -->

<!-- wp:paragraph -->

The temporal data types allow you to store date and /or time data. PostgreSQL has five main temporal data types:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `DATE` stores the dates only.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `TIME` stores the time of day values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `TIMESTAMP` stores both date and time values.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `TIMESTAMPTZ` is a timezone-aware timestamp data type. It is the abbreviation for [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/) with the time zone.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `INTERVAL` stores periods.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `TIMESTAMPTZ` is PostgreSQL's extension to the SQL standard's temporal data types.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Arrays

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, you can store an [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/) of strings, an array of integers, etc., in array columns. The array comes in handy in some situations e.g., storing days of the week, and months of the year.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## JSON

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides two JSON data types: `JSON` and `JSONB` for storing JSON data.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `JSON` data type stores plain JSON data that requires reparsing for each processing, while `JSONB` data type stores `JSON` data in a binary format which is faster to process but slower to insert. In addition, `JSONB` supports indexing, which can be an advantage.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## UUID

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `UUID` data type allows you to store Universal Unique Identifiers defined by [RFC 4122](https://tools.ietf.org/html/rfc4122 "UUID") . The `UUID` values guarantee a better uniqueness than `SERIAL` and can be used to hide sensitive data exposed to the public such as values of `id` in URL.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Special data types

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the primitive data types, PostgreSQL also provides several special data types related to geometry and network.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `box` - a rectangular box.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `line`- a set of points.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `point` - a geometric pair of numbers.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `lseg` - a line segment.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `polygon` - a closed geometric.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `inet` - an IP4 address.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `macaddr`- a MAC address.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

In this tutorial, we have introduced you to the PostgreSQL data types so that you can use them to create tables in the next tutorial.

<!-- /wp:paragraph -->
