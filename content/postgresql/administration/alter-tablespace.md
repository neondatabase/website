---
title: PostgreSQL ALTER TABLESPACE
page_title: PostgreSQL ALTER TABLESPACE
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL ALTER TABLESPACE
  statement to rename, change the owner, or set parameters for a tablespace.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-tablespace/
ogImage: ''
updatedOn: '2023-12-30T10:24:23+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL CREATE TABLESPACE
  slug: postgresql-administration/postgresql-create-tablespace
nextLink:
  title: PostgreSQL DROP TABLESPACE Statement
  slug: postgresql-administration/postgresql-drop-tablespace
---
<Admonition type="info" id="CTA">
The ALTER TABLESPACE syntax covered here is standard PostgreSQL and works the same way on any Postgres deployment that exposes tablespace management. If you're an enterprise looking for managed Postgres built for the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers high performance, strong security, and native integration with the Lakehouse. If you're a developer or startup who needs to ship and scale fast, [Neon](https://neon.com) gives you the best Postgres platform to do it on.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL ALTER TABLESPACE** statement to rename, change the owner, or set parameters for a tablespace.

## Introduction to ALTER TABLESPACE statement

After [creating a tablespace](postgresql-create-tablespace 'PostgreSQL creating tablespace'), you can change its definition by using the `ALTER TABLESPACE` statement as follows:

```sql
ALTER TABLESPACE tablespace_name
action;
```

The action can be:

- Rename the tablespace
- Change the owner
- Set the parameters for the tablespace.

To rename the tablespace, you use the `ALTER TABLESPACE RENAME TO` statement:

```sql
ALTER TABLESPACE tablespace_name
RENAME TO new_name;
```

To change the owner of the tablespace, you use the `ALTER TABLESPACE OWNER TO` statement:

```sql
ALTER TABLESPACE tablespace_name
OWNER TO new_owner;
```

The following statement changes the parameters for a tablespace:

```sql
ALTER TABLESPACE tablespace_name
SET parameter_name = value;
```

Only superusers or tablespace owners can execute the `ALTER TABLESPACE` statement.

## PostgreSQL ALTER TABLESPACE examples

The following statement changes `dvdrental` tablespace to `dvdrental_raid`:

```sql
ALTER TABLESPACE dvdrental
RENAME TO dvdrental_raid;
```

The following statement changes the owner of the  `dvdrental_raid` from `postgres`to `hr`:

```sql
ALTER TABLESPACE dvdrental_raid
OWNER to hr;
```

## Summary

- Use `ALTER TABLESPACE RENAME TO` statement to rename a tablespace.
- Use `ALTER TABLESPACE OWNER TO` to change the owner of a tablespace.
- Use `ALTER TABLESPACE SET` to set the parameters for a tablespace.
