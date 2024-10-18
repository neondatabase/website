---
title: 'Disable Triggers'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/managing-postgresql-trigger/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to disable triggers by using the `ALTER TABLE ... DISABLE TRIGGER` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to ALTER TABLE...DISABLE TRIGGER statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To disable a [trigger](https://www.postgresqltutorial.com/postgresql-triggers/), you use the `ALTER TABLE...DISABLE TRIGGER` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you disable a trigger, it remains in the database but won't activate when an event associated with the trigger occurs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `ALTER TABLE...DISABLE TRIGGER` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
DISABLE TRIGGER trigger_name | ALL
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax,

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the table to which the trigger belongs after the `ALTER TABLE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the name of the trigger you want to disable after the `DISABLE TRIGGER` keywords, or use the `ALL` keyword to disable all triggers associated with the table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Suppose you want to disable the trigger associated with the `employees` table, you can use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE employees
DISABLE TRIGGER log_last_name_changes;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To disable all triggers associated with the `employees` table, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE employees
DISABLE TRIGGER ALL;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER TABLE ... DISABLE TRIGGER` statement to disable a trigger or all triggers associated with a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
