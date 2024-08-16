[#id](#SQL-CHECKPOINT)

## CHECKPOINT

CHECKPOINT — force a write-ahead log checkpoint

## Synopsis

```
CHECKPOINT
```

[#id](#id-1.9.3.49.5)

## Description

A checkpoint is a point in the write-ahead log sequence at which all data files have been updated to reflect the information in the log. All data files will be flushed to disk. Refer to [Section 30.5](wal-configuration) for more details about what happens during a checkpoint.

The `CHECKPOINT` command forces an immediate checkpoint when the command is issued, without waiting for a regular checkpoint scheduled by the system (controlled by the settings in [Section 20.5.2](runtime-config-wal#RUNTIME-CONFIG-WAL-CHECKPOINTS)). `CHECKPOINT` is not intended for use during normal operation.

If executed during recovery, the `CHECKPOINT` command will force a restartpoint (see [Section 30.5](wal-configuration)) rather than writing a new checkpoint.

Only superusers or users with the privileges of the [`pg_checkpoint`](predefined-roles#PREDEFINED-ROLES-TABLE) role can call `CHECKPOINT`.

[#id](#id-1.9.3.49.6)

## Compatibility

The `CHECKPOINT` command is a PostgreSQL language extension.
