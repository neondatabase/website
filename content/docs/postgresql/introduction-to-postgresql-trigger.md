---
title: 'Introduction to PostgreSQL Trigger'
redirectFrom: 
            - /docs/postgresql/postgresql-triggers/introduction-postgresql-trigger/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about PostgreSQL triggers, why you should use the triggers, and when to use them.

## What are PostgreSQL triggers

A PostgreSQL trigger is a [function](/docs/postgresql/postgresql-plpgsql/postgresql-create-function) invoked automatically whenever an event associated with a table occurs. An event could be any of the following: [INSERT](/docs/postgresql/postgresql-insert/ "PostgreSQL INSERT"), [UPDATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/ "PostgreSQL UPDATE"), [DELETE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/ "PostgreSQL DELETE")or [TRUNCATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-truncate-table "PostgreSQL TRUNCATE TABLE").

A trigger is a special [user-defined function](/docs/postgresql/postgresql-stored-procedures) associated with a table. To create a new trigger, you define a trigger function first, and then bind this trigger function to a table.

The difference between a trigger and a user-defined function is that a trigger is automatically invoked when a triggering event occurs.

## PostgreSQL trigger types

PostgreSQL provides two main types of triggers:

- Row-level triggers
-
- Statement-level triggers.

The differences between the two kinds are how many times the trigger is invoked and at what time.

For example, if you issue an `UPDATE` statement that modifies 20 rows, the row-level trigger will be invoked 20 times, while the statement-level trigger will be invoked 1 time.

You can specify whether the trigger is invoked before or after an event. If the trigger is invoked before an event, it can skip the operation for the current row or even change the row being updated or inserted. In case the trigger is invoked after the event, all changes are available to the trigger.

## When to use triggers

Triggers are useful in case the database is accessed by various applications, and you want to keep the cross-functionality within the database that runs automatically whenever the data of the table is modified. For example, if you want to keep the history of data without requiring the application to have logic to check for every event such as `INSERT` or `UDPATE`.

Also, you can use triggers to maintain complex data integrity rules which cannot implement elsewhere except at the database level. For example, when a new row is added into the `customer` table, other rows must be also created in tables of banks and credits.

The main drawback of using a trigger is that you must know the trigger exists and understand its logic to figure out the effects when data changes.

## PostgreSQL triggers vs SQL standard triggers

Even though PostgreSQL implements SQL standard, triggers in PostgreSQL has some specific features:

- PostgreSQL fires trigger for the `TRUNCATE` event.
-
- PostgreSQL allows you to define the statement-level trigger on [views](/docs/postgresql/postgresql-views).
-
- PostgreSQL requires you to define a user-defined function as the action of the trigger, while the SQL standard allows you to use any SQL commands.

## Summary

- A trigger is a function invoked automatically when an `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` occurs on a table.
-
- PostgreSQL supports row-level and statement-level triggers.
