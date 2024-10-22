---
title: "Enable Triggers"
page_title: "How to Enable Triggers in PostgreSQL"
page_description: "In this tutorial, you will learn how to enable a trigger or all triggers associated with a table."
prev_url: "https://www.postgresqltutorial.com/postgresql-triggers/enable-triggers/"
ogImage: ""
updatedOn: "2024-03-26T02:02:29+00:00"
enableTableOfContents: true
prev_page: 
  title: "Disable Triggers"
  slug: "postgresql-triggers/managing-postgresql-trigger"
next_page: 
  title: "How to List All Triggers in PostgreSQL"
  slug: "postgresql-triggers/how-to-list-all-triggers-in-postgresql"
---




**Summary**: in this tutorial, you will learn how to enable a trigger or all triggers associated with a table.


## Introduction to ALTER TABLE…ENABLE TRIGGER statement

In PostgreSQL, a [trigger](introduction-postgresql-trigger) is a database object that automatically invokes a specified [function](../postgresql-plpgsql/postgresql-create-function) when an event occurs on a table or view. These events include `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE`.

If a [trigger is disabled](managing-postgresql-trigger), it doesn’t activate when the triggering event occurs. To activate the trigger, you’ll need to enable it.

To enable a trigger or all triggers associated with a table, you use the `ALTER TABLE ... ENABLE TRIGGER` statement:


```
ALTER TABLE table_name
ENABLE TRIGGER trigger_name |  ALL;
```
In this syntax:

* First, specify the name of the table to which the trigger belongs you want to enable in the `ALTER TABLE` clause.
* Second, specify the name of the trigger you want to enable in the `ENABLE TRIGGER` clause, or use the `ALL` option if you want to enable all triggers associated with the table.


## Enabling trigger example

The following statement enables the `salary_before_update` trigger on the `employees` table:


```
ALTER TABLE employees
ENABLE TRIGGER salary_before_update;
```
The following example enables all triggers that belong to the `employees` table:


```
ALTER TABLE employees
ENABLE TRIGGER ALL;
```

## Summary

* Use the `ALTER TABLE ENABLE TRIGGER` statement to enable a trigger or all triggers that belong to a table.

