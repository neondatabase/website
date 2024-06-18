[#id](#SQL-DROPEVENTTRIGGER)

## DROP EVENT TRIGGER

DROP EVENT TRIGGER — remove an event trigger

## Synopsis

```
DROP EVENT TRIGGER [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.110.5)

## Description

`DROP EVENT TRIGGER` removes an existing event trigger. To execute this command, the current user must be the owner of the event trigger.

[#id](#id-1.9.3.110.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the event trigger does not exist. A notice is issued in this case.

- _`name`_

  The name of the event trigger to remove.

- `CASCADE`

  Automatically drop objects that depend on the trigger, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the trigger if any objects depend on it. This is the default.

[#id](#SQL-DROPEVENTTRIGGER-EXAMPLES)

## Examples

Destroy the trigger `snitch`:

```
DROP EVENT TRIGGER snitch;
```

[#id](#SQL-DROPEVENTTRIGGER-COMPATIBILITY)

## Compatibility

There is no `DROP EVENT TRIGGER` statement in the SQL standard.

[#id](#id-1.9.3.110.9)

## See Also

[CREATE EVENT TRIGGER](sql-createeventtrigger), [ALTER EVENT TRIGGER](sql-altereventtrigger)
