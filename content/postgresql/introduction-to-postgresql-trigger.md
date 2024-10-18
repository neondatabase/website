---
title: 'Introduction to PostgreSQL Trigger'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/introduction-postgresql-trigger/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PostgreSQL triggers, why you should use the triggers, and when to use them.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## What are PostgreSQL triggers

<!-- /wp:heading -->

<!-- wp:paragraph -->

A PostgreSQL trigger is a [function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) invoked automatically whenever an event associated with a table occurs. An event could be any of the following: [INSERT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/ "PostgreSQL INSERT"), [UPDATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/ "PostgreSQL UPDATE"), [DELETE ](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/ "PostgreSQL DELETE")or [TRUNCATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-truncate-table/ "PostgreSQL TRUNCATE TABLE").

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A trigger is a special [user-defined function](https://www.postgresqltutorial.com/postgresql-stored-procedures/) associated with a table. To create a new trigger, you define a trigger function first, and then bind this trigger function to a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The difference between a trigger and a user-defined function is that a trigger is automatically invoked when a triggering event occurs.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL trigger types

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL provides two main types of triggers:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Row-level triggers
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Statement-level triggers.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The differences between the two kinds are how many times the trigger is invoked and at what time.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, if you issue an `UPDATE` statement that modifies 20 rows, the row-level trigger will be invoked 20 times, while the statement-level trigger will be invoked 1 time.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

You can specify whether the trigger is invoked before or after an event. If the trigger is invoked before an event, it can skip the operation for the current row or even change the row being updated or inserted. In case the trigger is invoked after the event, all changes are available to the trigger.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## When to use triggers

<!-- /wp:heading -->

<!-- wp:paragraph -->

Triggers are useful in case the database is accessed by various applications, and you want to keep the cross-functionality within the database that runs automatically whenever the data of the table is modified. For example, if you want to keep the history of data without requiring the application to have logic to check for every event such as `INSERT` or `UDPATE`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Also, you can use triggers to maintain complex data integrity rules which cannot implement elsewhere except at the database level. For example, when a new row is added into the `customer` table, other rows must be also created in tables of banks and credits.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The main drawback of using a trigger is that you must know the trigger exists and understand its logic to figure out the effects when data changes.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL triggers vs SQL standard triggers

<!-- /wp:heading -->

<!-- wp:paragraph -->

Even though PostgreSQL implements SQL standard, triggers in PostgreSQL has some specific features:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- PostgreSQL fires trigger for the `TRUNCATE` event.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PostgreSQL allows you to define the statement-level trigger on [views](https://www.postgresqltutorial.com/postgresql-views/).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PostgreSQL requires you to define a user-defined function as the action of the trigger, while the SQL standard allows you to use any SQL commands.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A trigger is a function invoked automatically when an `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` occurs on a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PostgreSQL supports row-level and statement-level triggers.
- <!-- /wp:list-item -->

<!-- /wp:list -->
