---
title: 'PostgreSQL Event Trigger'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/postgresql-event-trigger/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PostgreSQL event triggers and how to use the `CREATE EVENT TRIGGER` statement to define a new event trigger.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL event trigger

<!-- /wp:heading -->

<!-- wp:paragraph -->

A regular trigger fires whenever an `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` event occurs on an associated table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To automatically respond to events related to data definition language (`DDL`) statements, you can use an event trigger.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

An event trigger is a [trigger](https://www.postgresqltutorial.com/postgresql-triggers/) that fires whenever an associated event occurs in the database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL supports the following events:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `ddl_command_start`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `ddl_command_end`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `table_rewrite`
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `sql_drop`
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `ddl_command_start` events before PostgreSQL executes the `CREATE`, `ALTER`, `DROP`, `GRANT`, `REVOKE`, `SECURITY` `LABEL`, and `COMMENT` statements. For complete commands that the event trigger supports, read more on the [event trigger firing matrix](https://www.postgresql.org/docs/current/event-trigger-matrix.html).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Please note that the `ddl_command_start` does not occur for shared objects like databases, tablespaces, and roles.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ddl_command_end` occurs after the execution of the above DDL statements.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `sql_drop` event occurs whenever you drop a database object, just before the `ddl_command_end` event.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `table_rewrite` event occurs before you rewrite a table using the `ALTER TABLE` or `ALTER TYPE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create an event trigger, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [define a function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) that will execute when the event trigger fires:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION event_trigger_function_name()
RETURNS EVENT_TRIGGER
AS
$$
BEGIN
   -- trigger logic
   -- ...
   -- no RETURN statement
END;
$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The event trigger function returns `EVENT_TRIGGER` instead of `TRIGGER`. Additionally, it does not have any `RETURN` statement like a regular trigger function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create an event trigger using the `CREATE EVENT TRIGGER` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE EVENT TRIGGER trigger_name
ON event
EXECUTE FUNCTION event_trigger_function_name()
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL event trigger example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `audits` to store audit logs for commands:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE audits (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    event VARCHAR(50) NOT NULL,
    command TEXT NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `audits` table will record the username, event, command, and timestamp when the command is executed.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, define an event trigger function that executes whenever a relevant event occurs:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION audit_command()
RETURNS EVENT_TRIGGER
AS $$
BEGIN
    INSERT INTO audits (username, event , command)
    VALUES (session_user, TG_EVENT, TG_TAG );
END;
$$ LANGUAGE plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `audit_command()` function inserts audit records into the `audits` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, create an event trigger that associates the function with DDL commands:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE EVENT TRIGGER audit_ddl_commands
ON ddl_command_end
EXECUTE FUNCTION audit_command();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, execute a `CREATE TABLE` command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE regions(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, retrieve data from the `audits` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM audits;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | username |      event      |   command    |        executed_at
----+----------+-----------------+--------------+----------------------------
  1 | postgres | ddl_command_end | CREATE TABLE | 2024-03-29 12:12:38.773734
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Regular trigger vs. Event trigger

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following table compares regular triggers and event triggers:

<!-- /wp:paragraph -->

<!-- wp:table -->

| Feature        | Regular Trigger                                                                                                           | Event Trigger                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Trigger Level  | Table-level trigger, associated with a specific table and fired on `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` statement. | Database-level triggers fired in response to DDL statements such as `CREATE`, `ALTER`, `DROP`, etc. |
| Execution Time | Can be fired `BEFORE`, `AFTER`, or `INSTEAD` `OF` `DML` operations                                                        | Fired at some events including `ddl_command_start`, `ddl_command_end`, `table_rewrite`, `sql_drop`  |
| Scope          | Can be defined at the row or statement level                                                                              | Executes at the database level                                                                      |
| Access to Data | Has access to the data being modified                                                                                     | Has access to metadata                                                                              |
| Use Cases      | Logging changes to a specific table, updating related tables, and enforcing business rules.                               | Auditing DDL commands, and monitoring user activities.                                              |

<!-- /wp:table -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- An event trigger is a trigger that fires when an event related to the DDL statement occurs.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `CREATE EVENT TRIGGER` statement to define a new event trigger.
- <!-- /wp:list-item -->

<!-- /wp:list -->
