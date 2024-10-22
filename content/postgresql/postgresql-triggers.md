---
title: "PostgreSQL Triggers"
page_title: "PostgreSQL Triggers"
page_description: "Show how to work with PostgreSQL triggers, which are the functions invoked automatically when an event occurs in the associated tables."
prev_url: "https://www.postgresqltutorial.com/postgresql-triggers/"
ogImage: ""
updatedOn: "2024-04-10T15:08:37+00:00"
enableTableOfContents: true
prev_page: 
  title: "PL/pgSQL Cursor"
  slug: "postgresql-plpgsql/plpgsql-cursor"
next_page: 
  title: "Introduction to PostgreSQL Trigger"
  slug: "postgresql-triggers/introduction-postgresql-trigger"
---





![](/postgresqltutorial/PostgreSQL-Trigger.png?alignright)
A PostgreSQL trigger is a database object that automatically executes a [function](postgresql-plpgsql/postgresql-create-function) in response to an event such as [insert](postgresql-tutorial/postgresql-insert), [update](postgresql-tutorial/postgresql-update), [delete](postgresql-tutorial/postgresql-delete), or [truncate](postgresql-tutorial/postgresql-truncate-table). In this section, you will learn about triggers and how to use them effectively.


## Section 1\. Basic PostgreSQL Triggers

* [Introduction to PostgreSQL trigger](postgresql-triggers/introduction-postgresql-trigger "Introduction to PostgreSQL Trigger") – Give you a brief overview of PostgreSQL triggers, why you should use triggers, and when to use them.
* [Create trigger](postgresql-triggers/creating-first-trigger-postgresql "Creating the First Trigger in PostgreSQL") – Show you how to create your first trigger in PostgreSQL.
* [Drop trigger](postgresql-triggers/postgresql-drop-trigger)– Describe steps for using the `DROP TRIGGER` statement to delete a trigger from a table.
* [Alter trigger](postgresql-triggers/postgresql-alter-trigger) – Guide you on how to use the `ALTER TRIGGER` statement to rename a trigger.

## Section 2\. INSERT triggers

* [BEFORE INSERT triggers](postgresql-triggers/postgresql-before-insert-trigger) – Show you how to create a trigger that is activated automatically before an INSERT event occurs on the associated table.
* [AFTER INSERT triggers](postgresql-triggers/postgresql-after-insert-trigger) – Guide you on defining a trigger activated automatically after an INSERT event occurs on the associated table.

## Section 3\. UPDATE triggers

* [BEFORE UPDATE triggers](postgresql-triggers/postgresql-before-update-trigger) – Define a BEFORE UPDATE trigger that is activated before an update event occurs.
* [AFTER UPDATE triggers](postgresql-triggers/postgresql-after-update-trigger) – Create an AFTER UPDATE trigger fired after an update event occurs.

## Section 4\. DELETE triggers

* [BEFORE DELETE triggers](postgresql-triggers/postgresql-before-delete-trigger) – Define a BEFORE DELETE trigger that fires before a delete event occurs.
* [AFTER DELETE triggers](postgresql-triggers/postgresql-after-update-trigger) – Create an AFTER DELETE trigger fired after a delete event occurs.

## Section 5\. INSTEAD OF triggers

* [INSTEAD OF triggers](postgresql-triggers/postgresql-instead-of-triggers) – Show you how to use the INSTEAD OF trigger to customize the behavior of the INSERT, UPDATE, and DELETE operations on a view.

## Section 6\. TRUNCATE triggers

* [BEFORE TRUNDCATE Trigger](postgresql-triggers/postgresql-before-truncate-trigger) –  Create a trigger to response before a TRUNCATE event occurs.

## Section 7\. Enabling \& Disabling triggers

* [Disable trigger](postgresql-triggers/managing-postgresql-trigger "Managing PostgreSQL Trigger") –  Show how to disable a trigger or all triggers that belong to a table.
* [Enable triggers](postgresql-triggers/enable-triggers) – Learn how to enable a trigger or all triggers associated with a table.

## Section 8\. Listing triggers

* [Listing triggers](postgresql-triggers/how-to-list-all-triggers-in-postgresql) –  List all triggers associated with a table or all triggers in the current database.

## Section 9\. Advanced triggers

* [Event trigger](postgresql-triggers/postgresql-event-trigger) –  Introduce the event trigger that fires when an event related to a DDL statement occurs.
* [Conditional trigger](postgresql-triggers/postgresql-trigger-when-condition) – Define a conditional trigger that fires only when a condition is satisfied.
