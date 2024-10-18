---
title: 'Enable Triggers'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/enable-triggers/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to enable a trigger or all triggers associated with a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to ALTER TABLE...ENABLE TRIGGER statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a [trigger](https://www.postgresqltutorial.com/postgresql-triggers/introduction-postgresql-trigger/) is a database object that automatically invokes a specified [function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) when an event occurs on a table or view. These events include `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If a [trigger is disabled](https://www.postgresqltutorial.com/postgresql-triggers/managing-postgresql-trigger/), it doesn't activate when the triggering event occurs. To activate the trigger, you'll need to enable it.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To enable a [trigger](https://www.postgresqltutorial.com/postgresql-triggers/) or all triggers associated with a table, you use the `ALTER TABLE ... ENABLE TRIGGER` statement:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE table_name
ENABLE TRIGGER trigger_name |  ALL;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table to which the trigger belongs you want to enable in the `ALTER TABLE` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the name of the trigger you want to enable in the `ENABLE TRIGGER` clause, or use the `ALL` option if you want to enable all triggers associated with the table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Enabling trigger example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement enables the `salary_before_update` trigger on the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE employees
ENABLE TRIGGER salary_before_update;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example enables all triggers that belong to the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER TABLE employees
ENABLE TRIGGER ALL;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER TABLE ENABLE TRIGGER` statement to enable a trigger or all triggers that belong to a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
