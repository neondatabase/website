---
title: 'PostgreSQL DROP TRIGGER Statement'
page_title: 'PostgreSQL DROP TRIGGER Statement'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL DROP TRIGGER statement to drop a trigger from a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-triggers/postgresql-drop-trigger/'
ogImage: '/postgresqltutorial/PostgreSQL-DROP-Trigger-Example.png'
updatedOn: '2024-03-30T03:14:07+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL CREATE TRIGGER Statement'
  slug: 'postgresql-triggers/creating-first-trigger-postgresql'
nextLink:
  title: 'PostgreSQL ALTER TRIGGER Statement'
  slug: 'postgresql-triggers/postgresql-alter-trigger'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP TRIGGER` statement to drop a trigger from a table.

## Introduction to PostgreSQL DROP TRIGGER statement

To delete a trigger from a table, you use the `DROP TRIGGER` statement with the following syntax:

```sql
DROP TRIGGER [IF EXISTS] trigger_name
ON table_name
[ CASCADE | RESTRICT ];
```

In this syntax:

- First, specify the name of the trigger you want to delete after the `DROP TRIGGER` keywords.
- Next, use `IF EXISTS` to conditionally delete the trigger only if it exists. Deleting a non\-existing trigger without specifying the `IF EXISTS` statement results in an error. If you use `IF EXISTS` to delete a non\-existing trigger, PostgreSQL issues a notice instead. The `IF EXISTS` is optional.
- Then, specify the name of the table to which the trigger belongs. If the table belongs to a specific schema, you can use the schema\-qualified name of the table such as `schema_name.table_name`.
- After that, use the `CASCADE` option to drop objects that depend on the trigger automatically. Note that `CASCADE` option will also delete objects that depend on objects that depend on the trigger.
- Finally, use the `RESTRICT` option to refuse to drop the trigger if any objects depend on it. By default, the `DROP TRIGGER` statement uses `RESTRICT`.

In SQL standard, trigger names are not local to tables so the `DROP TRIGGER` statement does not have the table to which the trigger belongs:

```sql
DROP TRIGGER trigger_name;
```

## PostgreSQL DROP TRIGGER statement example

First, [create a function](../postgresql-plpgsql/postgresql-create-function) that validates the username of a staff. The username is not null and its length must be at least 8\.

```sql
CREATE FUNCTION check_staff_user()
    RETURNS TRIGGER
AS $$
BEGIN
    IF length(NEW.username) < 8 OR NEW.username IS NULL THEN
        RAISE EXCEPTION 'The username cannot be less than 8 characters';
    END IF;
    IF NEW.NAME IS NULL THEN
        RAISE EXCEPTION 'Username cannot be NULL';
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
```

Second, [create a new trigger](creating-first-trigger-postgresql) on the `staff` table of the [sample database](../postgresql-getting-started/postgresql-sample-database) to check the username of a staff. This trigger will fire whenever you insert or update a row in the `staff` table:

```sql
CREATE TRIGGER username_check
    BEFORE INSERT OR UPDATE
ON staff
FOR EACH ROW
    EXECUTE PROCEDURE check_staff_user();

```

![PostgreSQL DROP Trigger Example](/postgresqltutorial/PostgreSQL-DROP-Trigger-Example.png)Third, use the `DROP TRIGGER` statement to delete the `username_check` trigger:

```sql
DROP TRIGGER username_check
ON staff;
```

## Summary

- Use the PostgreSQL `DROP TRIGGER` statement to delete a trigger from a table.
