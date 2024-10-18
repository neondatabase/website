---
title: 'PostgreSQL AT TIME ZONE Operator'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-at-time-zone/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `AT TIME ZONE` operator to convert a timestamp or a timestamp with time zone to a different time zone.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL AT TIME ZONE operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, the `AT TIME ZONE` is an operator that allows you to convert a [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/) or a timestamp with time zone to a different time zone.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `AT TIME ZONE` operator can be useful when you want to perform timezone conversions within your SQL queries.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `AT TIME ZONE` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
timestamp_expression AT TIME ZONE target_timezone
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- timestamp_expression is a timestamp or timestamp with time zone value that you want to convert.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- target_timezone is the target time zone to which you want to convert. This can be either a time zone name or an expression that evaluates to a time zone name.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `AT TIME ZONE` operator always returns a value of type `TIMESTAMP WITH TIME ZONE`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL AT TIME ZONE operator examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `AT TIME ZONE` operator. It is assumed that the server's time zone is `'America/Los_Angeles'`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you want to have consistent results like the following examples, you can set the PostgreSQL server's timezone to `'America/Los_Angeles'` by executing the following statement in any PostgreSQL client (such as pgAdmin or psql):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
set timezone to 'America/Los_Angeles'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Once you execute the command, you can verify it by showing the current timezone:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
show timezone;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      TimeZone
---------------------
 America/Los_Angeles
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 1) Basic AT TIME ZONE operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `AT TIME ZONE` operator to convert a timestamp to Coordinated Universal time (UTC):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE 'UTC';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
        timezone
------------------------
 2024-03-21 03:00:00-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Converting timestamp with time zone

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `AT TIME ZONE` operator to convert a timestamp with time zone to UTC:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TIMESTAMP WITH TIME ZONE '2024-03-21 10:00:00-04' AT TIME ZONE 'UTC';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      timezone
---------------------
 2024-03-21 14:00:00
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the AT TIME ZONE operator with time zone abbreviation

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `AT TIME ZONE` operator to convert a timestamp to Pacific Standard Time (PST) from the default time zone:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE 'PST';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
        timezone
------------------------
 2024-03-21 11:00:00-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Converting a timestamp using a time zone offset

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `AT TIME ZONE` operator to convert a timestamp using a time zone offset:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE '-08:00';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
        timezone
------------------------
 2024-03-20 19:00:00-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Converting a timestamp using named time zones

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `AT TIME ZONE` operator to convert a timestamp using a named time zone:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT TIMESTAMP '2024-03-21 10:00:00' AT TIME ZONE 'America/New_York';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
        timezone
------------------------
 2024-03-21 07:00:00-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Please note that PostgreSQL uses the [IANA time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for time zone information.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `AT TIME ZONE` operator to convert a timestamp to a different time zone.
- <!-- /wp:list-item -->

<!-- /wp:list -->
