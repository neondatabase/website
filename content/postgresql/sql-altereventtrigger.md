[#id](#SQL-ALTEREVENTTRIGGER)

## ALTER EVENT TRIGGER

ALTER EVENT TRIGGER — change the definition of an event trigger

## Synopsis

```
ALTER EVENT TRIGGER name DISABLE
ALTER EVENT TRIGGER name ENABLE [ REPLICA | ALWAYS ]
ALTER EVENT TRIGGER name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER EVENT TRIGGER name RENAME TO new_name
```

[#id](#id-1.9.3.10.5)

## Description

`ALTER EVENT TRIGGER` changes properties of an existing event trigger.

You must be superuser to alter an event trigger.

[#id](#id-1.9.3.10.6)

## Parameters

- _`name`_

  The name of an existing trigger to alter.

- _`new_owner`_

  The user name of the new owner of the event trigger.

- _`new_name`_

  The new name of the event trigger.

- `DISABLE`/`ENABLE [ REPLICA | ALWAYS ] TRIGGER`

  These forms configure the firing of event triggers. A disabled trigger is still known to the system, but is not executed when its triggering event occurs. See also [session_replication_role](runtime-config-client#GUC-SESSION-REPLICATION-ROLE).

[#id](#SQL-ALTERVENTTRIGGER-COMPATIBILITY)

## Compatibility

There is no `ALTER EVENT TRIGGER` statement in the SQL standard.

[#id](#id-1.9.3.10.8)

## See Also

[CREATE EVENT TRIGGER](sql-createeventtrigger), [DROP EVENT TRIGGER](sql-dropeventtrigger)
