[#id](#LOGICALDECODING-SYNCHRONOUS)

## 49.8. Synchronous Replication Support for Logical Decoding [#](#LOGICALDECODING-SYNCHRONOUS)

- [49.8.1. Overview](logicaldecoding-synchronous#LOGICALDECODING-SYNCHRONOUS-OVERVIEW)
- [49.8.2. Caveats](logicaldecoding-synchronous#LOGICALDECODING-SYNCHRONOUS-CAVEATS)

[#id](#LOGICALDECODING-SYNCHRONOUS-OVERVIEW)

### 49.8.1. Overview [#](#LOGICALDECODING-SYNCHRONOUS-OVERVIEW)

Logical decoding can be used to build [synchronous replication](warm-standby#SYNCHRONOUS-REPLICATION) solutions with the same user interface as synchronous replication for [streaming replication](warm-standby#STREAMING-REPLICATION). To do this, the streaming replication interface (see [Section 49.3](logicaldecoding-walsender)) must be used to stream out data. Clients have to send `Standby status update (F)` (see [Section 55.4](protocol-replication)) messages, just like streaming replication clients do.

### Note

A synchronous replica receiving changes via logical decoding will work in the scope of a single database. Since, in contrast to that, _`synchronous_standby_names`_ currently is server wide, this means this technique will not work properly if more than one database is actively used.

[#id](#LOGICALDECODING-SYNCHRONOUS-CAVEATS)

### 49.8.2. Caveats [#](#LOGICALDECODING-SYNCHRONOUS-CAVEATS)

In synchronous replication setup, a deadlock can happen, if the transaction has locked \[user] catalog tables exclusively. See [Section 49.6.2](logicaldecoding-output-plugin#LOGICALDECODING-CAPABILITIES) for information on user catalog tables. This is because logical decoding of transactions can lock catalog tables to access them. To avoid this users must refrain from taking an exclusive lock on \[user] catalog tables. This can happen in the following ways:

- Issuing an explicit `LOCK` on `pg_class` in a transaction.

- Perform `CLUSTER` on `pg_class` in a transaction.

- `PREPARE TRANSACTION` after `LOCK` command on `pg_class` and allow logical decoding of two-phase transactions.

- `PREPARE TRANSACTION` after `CLUSTER` command on `pg_trigger` and allow logical decoding of two-phase transactions. This will lead to deadlock only when published table have a trigger.

- Executing `TRUNCATE` on \[user] catalog table in a transaction.

Note that these commands that can cause deadlock apply to not only explicitly indicated system catalog tables above but also to any other \[user] catalog table.
