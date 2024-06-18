[#id](#SQL-DROPSUBSCRIPTION)

## DROP SUBSCRIPTION

DROP SUBSCRIPTION — remove a subscription

## Synopsis

```
DROP SUBSCRIPTION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.133.5)

## Description

`DROP SUBSCRIPTION` removes a subscription from the database cluster.

To execute this command the user must be the owner of the subscription.

`DROP SUBSCRIPTION` cannot be executed inside a transaction block if the subscription is associated with a replication slot. (You can use `ALTER SUBSCRIPTION` to unset the slot.)

[#id](#id-1.9.3.133.6)

## Parameters

- _`name`_

  The name of a subscription to be dropped.

- `CASCADE``RESTRICT`

  These key words do not have any effect, since there are no dependencies on subscriptions.

[#id](#id-1.9.3.133.7)

## Notes

When dropping a subscription that is associated with a replication slot on the remote host (the normal state), `DROP SUBSCRIPTION` will connect to the remote host and try to drop the replication slot (and any remaining table synchronization slots) as part of its operation. This is necessary so that the resources allocated for the subscription on the remote host are released. If this fails, either because the remote host is not reachable or because the remote replication slot cannot be dropped or does not exist or never existed, the `DROP SUBSCRIPTION` command will fail. To proceed in this situation, first disable the subscription by executing `ALTER SUBSCRIPTION ... DISABLE`, and then disassociate it from the replication slot by executing `ALTER SUBSCRIPTION ... SET (slot_name = NONE)`. After that, `DROP SUBSCRIPTION` will no longer attempt any actions on a remote host. Note that if the remote replication slot still exists, it (and any related table synchronization slots) should then be dropped manually; otherwise it/they will continue to reserve WAL and might eventually cause the disk to fill up. See also [Section 31.2.1](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT).

If a subscription is associated with a replication slot, then `DROP SUBSCRIPTION` cannot be executed inside a transaction block.

[#id](#id-1.9.3.133.8)

## Examples

Drop a subscription:

```
DROP SUBSCRIPTION mysub;
```

[#id](#id-1.9.3.133.9)

## Compatibility

`DROP SUBSCRIPTION` is a PostgreSQL extension.

[#id](#id-1.9.3.133.10)

## See Also

[CREATE SUBSCRIPTION](sql-createsubscription), [ALTER SUBSCRIPTION](sql-altersubscription)
