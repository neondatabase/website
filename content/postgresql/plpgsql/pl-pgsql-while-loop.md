---
title: PL/pgSQL While Loop
page_title: PostgreSQL PL/pgSQL While Loop
page_description: >-
  In this tutorial, you will learn how to use the PL/pgSQL while loop statement
  to execute a block of code as long as a condition is true.
prev_url: 'https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-while-loop/'
ogImage: /postgresqltutorial/plpgsql-WHILE-loop.png
updatedOn: '2026-06-04T15:04:42.682Z'
enableTableOfContents: true
previousLink:
  title: PL/pgSQL Loop Statements
  slug: postgresql-plpgsql/plpgsql-loop-statements
nextLink:
  title: PL/pgSQL For Loop
  slug: postgresql-plpgsql/plpgsql-for-loop
---

<Admonition type="info" id="CTA">
The PL/pgSQL while loop works the same in any PostgreSQL environment. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

**Summary**: in this tutorial, you will learn how to use PL/pgSQL `while` loop statement to execute statements as long as a condition is true.

## Introduction to PL/pgSQL while loop statement

The `while` loop statement executes one or more statements as long as a specified condition is true.

Here’s the basic syntax of a `while` loop statement:

```sql
[ <<label>> ]
while condition loop
   statements;
end loop;
```

In this syntax, PostgreSQL evaluates the `condition` before executing the `statements`.

If the condition is true, it executes the `statements`. After each iteration, the `while` loop evaluates the `condition` again.

Inside the body of the `while` loop, you need to change some [variables](plpgsql-variables) to make the `condition` `false` or `null` at some points. Otherwise, you will have an indefinite loop.

Because the `while` loop tests the `condition` before executing the `statements`, it is often referred to as a **pretest loop**.

The following flowchart illustrates the `while` loop statement:

![PL/pgSQL WHILE loop](/postgresqltutorial/plpgsql-WHILE-loop.png)

## PL/pgSQL while loop example

The following example uses the `while` loop statement to display the value of a `counter`:

```plsql
do $$

declare
	counter integer := 0;
begin
	while counter < 5 loop
		raise notice 'Counter %', counter;
		counter := counter + 1;
	end loop;
end;

$$;
```

Output:

```
NOTICE:  Counter 0
NOTICE:  Counter 1
NOTICE:  Counter 2
NOTICE:  Counter 3
NOTICE:  Counter 4
```

How it works.

- First, declare the `counter` variable and initialize its value to 0\.
- Second, use the `while` loop statement to show the current value of the `counter` as long as it is less than 5\. In each iteration, increase the value of `counter` by one. After 5 iterations, the `counter` is 5 therefore the `while` loop is terminated.

## Summary

- Use the PL/pgSQL `while` loop statement to execute one or more statements as long as a specified condition is true.
