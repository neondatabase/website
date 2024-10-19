---
title: 'Disable Triggers'
redirectFrom: 
            - /postgresql/postgresql-triggers/managing-postgresql-trigger
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to disable triggers by using the `ALTER TABLE ... DISABLE TRIGGER` statement.

## Introduction to ALTER TABLE...DISABLE TRIGGER statement

To disable a [trigger](/postgresql/postgresql-triggers), you use the `ALTER TABLE...DISABLE TRIGGER` statement.

When you disable a trigger, it remains in the database but won't activate when an event associated with the trigger occurs.

Here's the basic syntax of the `ALTER TABLE...DISABLE TRIGGER` statement:

```sql
ALTER TABLE table_name
DISABLE TRIGGER trigger_name | ALL
```

In this syntax,

- First, specify the name of the table to which the trigger belongs after the `ALTER TABLE` keywords.
-
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
