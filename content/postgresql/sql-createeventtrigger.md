[#id](#SQL-CREATEEVENTTRIGGER)

## CREATE EVENT TRIGGER

CREATE EVENT TRIGGER — define a new event trigger

## Synopsis

```
CREATE EVENT TRIGGER name
    ON event
    [ WHEN filter_variable IN (filter_value [, ... ]) [ AND ... ] ]
    EXECUTE { FUNCTION | PROCEDURE } function_name()
```

[#id](#id-1.9.3.63.5)

## Description

`CREATE EVENT TRIGGER` creates a new event trigger. Whenever the designated event occurs and the `WHEN` condition associated with the trigger, if any, is satisfied, the trigger function will be executed. For a general introduction to event triggers, see [Chapter 40](event-triggers). The user who creates an event trigger becomes its owner.

[#id](#id-1.9.3.63.6)

## Parameters

- _`name`_

  The name to give the new trigger. This name must be unique within the database.

- _`event`_

  The name of the event that triggers a call to the given function. See [Section 40.1](event-trigger-definition) for more information on event names.

- _`filter_variable`_

  The name of a variable used to filter events. This makes it possible to restrict the firing of the trigger to a subset of the cases in which it is supported. Currently the only supported _`filter_variable`_ is `TAG`.

- _`filter_value`_

  A list of values for the associated _`filter_variable`_ for which the trigger should fire. For `TAG`, this means a list of command tags (e.g., `'DROP FUNCTION'`).

- _`function_name`_

  A user-supplied function that is declared as taking no argument and returning type `event_trigger`.

  In the syntax of `CREATE EVENT TRIGGER`, the keywords `FUNCTION` and `PROCEDURE` are equivalent, but the referenced function must in any case be a function, not a procedure. The use of the keyword `PROCEDURE` here is historical and deprecated.

[#id](#SQL-CREATEEVENTTRIGGER-NOTES)

## Notes

Only superusers can create event triggers.

Event triggers are disabled in single-user mode (see [postgres](app-postgres)). If an erroneous event trigger disables the database so much that you can't even drop the trigger, restart in single-user mode and you'll be able to do that.

[#id](#SQL-CREATEEVENTTRIGGER-EXAMPLES)

## Examples

Forbid the execution of any [DDL](ddl) command:

```
CREATE OR REPLACE FUNCTION abort_any_command()
  RETURNS event_trigger
 LANGUAGE plpgsql
  AS $$
BEGIN
  RAISE EXCEPTION 'command % is disabled', tg_tag;
END;
$$;

CREATE EVENT TRIGGER abort_ddl ON ddl_command_start
   EXECUTE FUNCTION abort_any_command();
```

[#id](#SQL-CREATEEVENTTRIGGER-COMPATIBILITY)

## Compatibility

There is no `CREATE EVENT TRIGGER` statement in the SQL standard.

[#id](#id-1.9.3.63.10)

## See Also

[ALTER EVENT TRIGGER](sql-altereventtrigger), [DROP EVENT TRIGGER](sql-dropeventtrigger), [CREATE FUNCTION](sql-createfunction)
