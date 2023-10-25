

|                       40.4. A Complete Event Trigger Example                       |                                                        |                            |                                                       |                                                                                                 |
| :--------------------------------------------------------------------------------: | :----------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------------------------------: |
| [Prev](event-trigger-interface.html "40.3. Writing Event Trigger Functions in C")  | [Up](event-triggers.html "Chapter 40. Event Triggers") | Chapter 40. Event Triggers | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](event-trigger-table-rewrite-example.html "40.5. A Table Rewrite Event Trigger Example") |

***

## 40.4. A Complete Event Trigger Example [#](#EVENT-TRIGGER-EXAMPLE)

Here is a very simple example of an event trigger function written in C. (Examples of triggers written in procedural languages can be found in the documentation of the procedural languages.)

The function `noddl` raises an exception each time it is called. The event trigger definition associated the function with the `ddl_command_start` event. The effect is that all DDL commands (with the exceptions mentioned in [Section 40.1](event-trigger-definition.html "40.1. Overview of Event Trigger Behavior")) are prevented from running.

This is the source code of the trigger function:

```

#include "postgres.h"
#include "commands/event_trigger.h"


PG_MODULE_MAGIC;

PG_FUNCTION_INFO_V1(noddl);

Datum
noddl(PG_FUNCTION_ARGS)
{
    EventTriggerData *trigdata;

    if (!CALLED_AS_EVENT_TRIGGER(fcinfo))  /* internal error */
        elog(ERROR, "not fired by event trigger manager");

    trigdata = (EventTriggerData *) fcinfo->context;

    ereport(ERROR,
            (errcode(ERRCODE_INSUFFICIENT_PRIVILEGE),
             errmsg("command \"%s\" denied",
                    GetCommandTagName(trigdata->tag))));

    PG_RETURN_NULL();
}
```

After you have compiled the source code (see [Section 38.10.5](xfunc-c.html#DFUNC "38.10.5. Compiling and Linking Dynamically-Loaded Functions")), declare the function and the triggers:

```

CREATE FUNCTION noddl() RETURNS event_trigger
    AS 'noddl' LANGUAGE C;

CREATE EVENT TRIGGER noddl ON ddl_command_start
    EXECUTE FUNCTION noddl();
```

Now you can test the operation of the trigger:

```

=# \dy
                     List of event triggers
 Name  |       Event       | Owner | Enabled | Function | Tags
-------+-------------------+-------+---------+----------+------
 noddl | ddl_command_start | dim   | enabled | noddl    |
(1 row)

=# CREATE TABLE foo(id serial);
ERROR:  command "CREATE TABLE" denied
```

In this situation, in order to be able to run some DDL commands when you need to do so, you have to either drop the event trigger or disable it. It can be convenient to disable the trigger for only the duration of a transaction:

```

BEGIN;
ALTER EVENT TRIGGER noddl DISABLE;
CREATE TABLE foo (id serial);
ALTER EVENT TRIGGER noddl ENABLE;
COMMIT;
```

(Recall that DDL commands on event triggers themselves are not affected by event triggers.)

***

|                                                                                    |                                                        |                                                                                                 |
| :--------------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------------------------------------------------: |
| [Prev](event-trigger-interface.html "40.3. Writing Event Trigger Functions in C")  | [Up](event-triggers.html "Chapter 40. Event Triggers") |  [Next](event-trigger-table-rewrite-example.html "40.5. A Table Rewrite Event Trigger Example") |
| 40.3. Writing Event Trigger Functions in C                                         |  [Home](index.html "PostgreSQL 17devel Documentation") |                                                     40.5. A Table Rewrite Event Trigger Example |
