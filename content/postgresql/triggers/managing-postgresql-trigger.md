---
title: Disable Triggers
page_title: How to Disable PostgreSQL Triggers
page_description: >-
  This tutorial shows you how to disable one or all PostgreSQL triggers
  associated with a table in the database.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-triggers/managing-postgresql-trigger/
ogImage: ''
updatedOn: '2024-03-26T01:55:24+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL BEFORE TRUNCATE Trigger
  slug: postgresql-triggers/postgresql-before-truncate-trigger
nextLink:
  title: Enable Triggers
  slug: postgresql-triggers/enable-triggers
---
<Admonition type="info" id="CTA">
Disabling triggers with `ALTER TABLE ... DISABLE TRIGGER` works the same on any PostgreSQL database, so everything here carries over to your Postgres of choice. If you're running Postgres at enterprise scale and want it fully integrated with your Lakehouse, [Lakebase](https://www.databricks.com/product/lakebase) is the best managed cloud Postgres for the AI era, combining strong performance with enterprise-grade security. If you're a developer or startup that needs to ship features and scale quickly, [Neon](https://neon.com) gives you the fastest path to production Postgres.
</Admonition>

**Summary**: in this tutorial, you will learn how to disable triggers by using the `ALTER TABLE ... DISABLE TRIGGER` statement.

## Introduction to ALTER TABLE…DISABLE TRIGGER statement

To disable a trigger, you use the `ALTER TABLE...DISABLE TRIGGER` statement.

When you disable a trigger, it remains in the database but won’t activate when an event associated with the trigger occurs.

Here’s the basic syntax of the `ALTER TABLE...DISABLE TRIGGER` statement:

```sql
ALTER TABLE table_name
DISABLE TRIGGER trigger_name | ALL
```

In this syntax,

- First, specify the name of the table to which the trigger belongs after the `ALTER TABLE` keywords.
- Second, specify the name of the trigger you want to disable after the `DISABLE TRIGGER` keywords, or use the `ALL` keyword to disable all triggers associated with the table.

Suppose you want to disable the trigger associated with the `employees` table, you can use the following statement:

```sql
ALTER TABLE employees
DISABLE TRIGGER log_last_name_changes;
```

To disable all triggers associated with the `employees` table, you use the following statement:

```sql
ALTER TABLE employees
DISABLE TRIGGER ALL;
```

## Summary

- Use the `ALTER TABLE ... DISABLE TRIGGER` statement to disable a trigger or all triggers associated with a table.
