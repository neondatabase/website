## CHECKPOINT

CHECKPOINT — force a write-ahead log checkpoint

## Synopsis

```

CHECKPOINT
```

## Description

A checkpoint is a point in the write-ahead log sequence at which all data files have been updated to reflect the information in the log. All data files will be flushed to disk. Refer to [Section 30.5](wal-configuration.html "30.5. WAL Configuration") for more details about what happens during a checkpoint.

The `CHECKPOINT` command forces an immediate checkpoint when the command is issued, without waiting for a regular checkpoint scheduled by the system (controlled by the settings in [Section 20.5.2](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS "20.5.2. Checkpoints")). `CHECKPOINT` is not intended for use during normal operation.

If executed during recovery, the `CHECKPOINT` command will force a restartpoint (see [Section 30.5](wal-configuration.html "30.5. WAL Configuration")) rather than writing a new checkpoint.

Only superusers or users with the privileges of the [`pg_checkpoint`](predefined-roles.html#PREDEFINED-ROLES-TABLE "Table 22.1. Predefined Roles") role can call `CHECKPOINT`.

## Compatibility

The `CHECKPOINT` command is a PostgreSQL language extension.