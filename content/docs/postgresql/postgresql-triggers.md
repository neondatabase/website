---
title: 'PostgreSQL Triggers'
ogImage: /postgresqltutorial_data/wp-content-uploads-2014-05-PostgreSQL-Trigger.png
tableOfContents: true
---


![](/postgresqltutorial_data/wp-content-uploads-2014-05-PostgreSQL-Trigger.png)





A PostgreSQL trigger is a database object that automatically executes a [function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) in response to an event such as [insert](/docs/postgresql/postgresql-insert/), [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/), [delete](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/), or [truncate](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-truncate-table). In this section, you will learn about triggers and how to use them effectively.







## Section 1. Basic PostgreSQL Triggers





- [Introduction to PostgreSQL trigger](https://www.postgresqltutorial.com/postgresql-triggers/introduction-postgresql-trigger/ "Introduction to PostgreSQL Trigger") - Give you a brief overview of PostgreSQL triggers, why you should use triggers, and when to use them.
-
- [Create trigger](https://www.postgresqltutorial.com/postgresql-triggers/creating-first-trigger-postgresql/ "Creating the First Trigger in PostgreSQL") - Show you how to create your first trigger in PostgreSQL.
-
- [Drop trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-drop-trigger/)- Describe steps for using the `DROP TRIGGER` statement to delete a trigger from a table.
-
- [Alter trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-alter-trigger/) - Guide you on how to use the `ALTER TRIGGER` statement to rename a trigger.









## Section 2. INSERT triggers





- [BEFORE INSERT triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-insert-trigger/) - Show you how to create a trigger that is activated automatically before an INSERT event occurs on the associated table.
-
- [AFTER INSERT triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-insert-trigger/) - Guide you on defining a trigger activated automatically after an INSERT event occurs on the associated table.









## Section 3. UPDATE triggers





- [BEFORE UPDATE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-update-trigger/) - Define a BEFORE UPDATE trigger that is activated before an update event occurs.
-
- [AFTER UPDATE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-update-trigger/) - Create an AFTER UPDATE trigger fired after an update event occurs.









## Section 4. DELETE triggers





- [BEFORE DELETE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-delete-trigger/) - Define a BEFORE DELETE trigger that fires before a delete event occurs.
-
- [AFTER DELETE triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-update-trigger/) - Create an AFTER DELETE trigger fired after a delete event occurs.









## Section 5. INSTEAD OF triggers





- [INSTEAD OF triggers](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-instead-of-triggers/) - Show you how to use the INSTEAD OF trigger to customize the behavior of the INSERT, UPDATE, and DELETE operations on a view.









## Section 6. TRUNCATE triggers





- [BEFORE TRUNDCATE Trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-truncate-trigger/) - Create a trigger to response before a TRUNCATE event occurs.









## Section 7. Enabling & Disabling triggers





- [Disable trigger](https://www.postgresqltutorial.com/postgresql-triggers/managing-postgresql-trigger/ "Managing PostgreSQL Trigger") - Show how to disable a trigger or all triggers that belong to a table.
-
- [Enable triggers](https://www.postgresqltutorial.com/postgresql-triggers/enable-triggers/) - Learn how to enable a trigger or all triggers associated with a table.









## Section 8. Listing triggers





- [Listing triggers](https://www.postgresqltutorial.com/postgresql-triggers/how-to-list-all-triggers-in-postgresql/) - List all triggers associated with a table or all triggers in the current database.









## Section 9. Advanced triggers





- [Event trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-event-trigger/) - Introduce the event trigger that fires when an event related to a DDL statement occurs.
-
- [Conditional trigger](https://www.postgresqltutorial.com/postgresql-triggers/postgresql-trigger-when-condition/) - Define a conditional trigger that fires only when a condition is satisfied.




