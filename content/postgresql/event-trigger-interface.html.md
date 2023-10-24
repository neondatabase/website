<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               40.3. Writing Event Trigger Functions in C               |                                                        |                            |                                                       |                                                                              |
| :--------------------------------------------------------------------: | :----------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ---------------------------------------------------------------------------: |
| [Prev](event-trigger-matrix.html "40.2. Event Trigger Firing Matrix")  | [Up](event-triggers.html "Chapter 40. Event Triggers") | Chapter 40. Event Triggers | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](event-trigger-example.html "40.4. A Complete Event Trigger Example") |

***

## 40.3. Writing Event Trigger Functions in C [#](#EVENT-TRIGGER-INTERFACE)

This section describes the low-level details of the interface to an event trigger function. This information is only needed when writing event trigger functions in C. If you are using a higher-level language then these details are handled for you. In most cases you should consider using a procedural language before writing your event triggers in C. The documentation of each procedural language explains how to write an event trigger in that language.

Event trigger functions must use the “version 1” function manager interface.

When a function is called by the event trigger manager, it is not passed any normal arguments, but it is passed a “context” pointer pointing to a `EventTriggerData` structure. C functions can check whether they were called from the event trigger manager or not by executing the macro:

    CALLED_AS_EVENT_TRIGGER(fcinfo)

which expands to:

    ((fcinfo)->context != NULL && IsA((fcinfo)->context, EventTriggerData))

If this returns true, then it is safe to cast `fcinfo->context` to type `EventTriggerData *` and make use of the pointed-to `EventTriggerData` structure. The function must *not* alter the `EventTriggerData` structure or any of the data it points to.

`struct EventTriggerData` is defined in `commands/event_trigger.h`:

    typedef struct EventTriggerData
    {
        NodeTag     type;
        const char *event;      /* event name */
        Node       *parsetree;  /* parse tree */
        CommandTag  tag;        /* command tag */
    } EventTriggerData;

where the members are defined as follows:

* `type`

    Always `T_EventTriggerData`.

* `event`

    Describes the event for which the function is called, one of `"ddl_command_start"`, `"ddl_command_end"`, `"sql_drop"`, `"table_rewrite"`. See [Section 40.1](event-trigger-definition.html "40.1. Overview of Event Trigger Behavior") for the meaning of these events.

* `parsetree`

    A pointer to the parse tree of the command. Check the PostgreSQL source code for details. The parse tree structure is subject to change without notice.

* `tag`

    The command tag associated with the event for which the event trigger is run, for example `"CREATE FUNCTION"`.

An event trigger function must return a `NULL` pointer (*not* an SQL null value, that is, do not set *`isNull`* true).

***

|                                                                        |                                                        |                                                                              |
| :--------------------------------------------------------------------- | :----------------------------------------------------: | ---------------------------------------------------------------------------: |
| [Prev](event-trigger-matrix.html "40.2. Event Trigger Firing Matrix")  | [Up](event-triggers.html "Chapter 40. Event Triggers") |  [Next](event-trigger-example.html "40.4. A Complete Event Trigger Example") |
| 40.2. Event Trigger Firing Matrix                                      |  [Home](index.html "PostgreSQL 17devel Documentation") |                                       40.4. A Complete Event Trigger Example |
