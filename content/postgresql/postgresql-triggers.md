---
title: 'PostgreSQL Triggers'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/
ogImage: ./img/wp-content-uploads-2014-05-PostgreSQL-Trigger.png
tableOfContents: true
---
<!-- wp:image {"id":2324,"align":"right"} -->

![](./img/wp-content-uploads-2014-05-PostgreSQL-Trigger.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

A PostgreSQL trigger is a database object that automatically executes a [function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) in response to an event such as [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/), [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/), [delete](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/), or [truncate](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-truncate-table/). In this section, you will learn about triggers and how to use them effectively.

<!-- /wp:paragraph -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 1. Basic PostgreSQL Triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Introduction to PostgreSQL trigger](https://www.postgresqltutorial.com/postgresql-triggers/introduction-postgresql-trigger/ "Introduction to PostgreSQL Trigger") - Give you a brief overview of PostgreSQL triggers, why you should use triggers, and when to use them.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Create trigger](https://www.postgresqltutorial.com/postgresql-triggers/creating-first-trigger-postgresql/ "Creating the First Trigger in PostgreSQL") - Show you how to create your first trigger in PostgreSQL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Drop trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-drop-trigger/)- Describe steps for using the `DROP TRIGGER` statement to delete a trigger from a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Alter trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-alter-trigger/) - Guide you on how to use the `ALTER TRIGGER` statement to rename a trigger.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 2. INSERT triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [BEFORE INSERT triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-insert-trigger/) - Show you how to create a trigger that is activated automatically before an INSERT event occurs on the associated table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [AFTER INSERT triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-insert-trigger/) - Guide you on defining a trigger activated automatically after an INSERT event occurs on the associated table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 3. UPDATE triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [BEFORE UPDATE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-update-trigger/) - Define a BEFORE UPDATE trigger that is activated before an update event occurs.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [AFTER UPDATE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-update-trigger/) - Create an AFTER UPDATE trigger fired after an update event occurs.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 4. DELETE triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [BEFORE DELETE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-delete-trigger/) - Define a BEFORE DELETE trigger that fires before a delete event occurs.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [AFTER DELETE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-update-trigger/) - Create an AFTER DELETE trigger fired after a delete event occurs.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 5. INSTEAD OF triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [INSTEAD OF triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-instead-of-triggers/) - Show you how to use the INSTEAD OF trigger to customize the behavior of the INSERT, UPDATE, and DELETE operations on a view.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 6. TRUNCATE triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [BEFORE TRUNDCATE Trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-truncate-trigger/) - Create a trigger to response before a TRUNCATE event occurs.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 7. Enabling & Disabling triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Disable trigger](https://www.postgresqltutorial.com/postgresql-triggers/managing-postgresql-trigger/ "Managing PostgreSQL Trigger") - Show how to disable a trigger or all triggers that belong to a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Enable triggers](https://www.postgresqltutorial.com/postgresql-triggers/enable-triggers/) - Learn how to enable a trigger or all triggers associated with a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 8. Listing triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Listing triggers](https://www.postgresqltutorial.com/postgresql-triggers/how-to-list-all-triggers-in-postgresql/) - List all triggers associated with a table or all triggers in the current database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 9. Advanced triggers

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Event trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-event-trigger/) - Introduce the event trigger that fires when an event related to a DDL statement occurs.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Conditional trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-trigger-when-condition/) - Define a conditional trigger that fires only when a condition is satisfied.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->
