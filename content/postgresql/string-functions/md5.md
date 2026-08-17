---
title: PostgreSQL MD5() Function
page_title: PostgreSQL MD5() Function
page_description: "The PostgreSQL MD5() function calculates the MD5\_hash of a string and returns the result in hexadecimal."
prev_url: 'https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-md5/'
ogImage: ''
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL FORMAT() Function
  slug: postgresql-string-functions/postgresql-format
nextLink:
  title: PostgreSQL LEFT() Function
  slug: postgresql-string-functions/postgresql-left
---

<Admonition type="info" id="CTA">
The MD5() function works the same across any PostgreSQL deployment. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

The PostgreSQL `MD5()` function calculates the [MD5](https://en.wikipedia.org/wiki/MD5) hash of a string and returns the result in hexadecimal.

## Syntax

The following illustrates the syntax of the `MD5()` function:

```sql
MD5(string)
```

## Arguments

The `MD5()` function accepts one argument.

**1\) `string`**

The `string` argument is the string of which the MD5 hash is calculated.

## Return value

The `MD5()` function returns a string in [`TEXT`](../postgresql-tutorial/postgresql-char-varchar-text) data type.

## Examples

The following example shows how to use the `MD5()` function to return the MD5 hash of the message `'PostgreSQL MD5'`:

```sql
SELECT MD5('PostgreSQL MD5');
```

The result is:

```
        md5
----------------------------------
 f78fdb18bf39b23d42313edfaf7e0a44
(1 row)
```

In this tutorial, you have learned how to use the PostgreSQL `MD5()` function to calculate the MD5 hash of a string.
