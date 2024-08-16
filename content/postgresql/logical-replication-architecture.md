[#id](#LOGICAL-REPLICATION-ARCHITECTURE)

## 31.7. Architecture [#](#LOGICAL-REPLICATION-ARCHITECTURE)

- [31.7.1. Initial Snapshot](logical-replication-architecture#LOGICAL-REPLICATION-SNAPSHOT)

Logical replication starts by copying a snapshot of the data on the publisher database. Once that is done, changes on the publisher are sent to the subscriber as they occur in real time. The subscriber applies data in the order in which commits were made on the publisher so that transactional consistency is guaranteed for the publications within any single subscription.

Logical replication is built with an architecture similar to physical streaming replication (see [Section 27.2.5](warm-standby#STREAMING-REPLICATION)). It is implemented by `walsender` and `apply` processes. The walsender process starts logical decoding (described in [Chapter 49](logicaldecoding)) of the WAL and loads the standard logical decoding plugin (pgoutput). The plugin transforms the changes read from WAL to the logical replication protocol (see [Section 55.5](protocol-logical-replication)) and filters the data according to the publication specification. The data is then continuously transferred using the streaming replication protocol to the apply worker, which maps the data to local tables and applies the individual changes as they are received, in correct transactional order.

The apply process on the subscriber database always runs with [`session_replication_role`](runtime-config-client#GUC-SESSION-REPLICATION-ROLE) set to `replica`. This means that, by default, triggers and rules will not fire on a subscriber. Users can optionally choose to enable triggers and rules on a table using the [`ALTER TABLE`](sql-altertable) command and the `ENABLE TRIGGER` and `ENABLE RULE` clauses.

The logical replication apply process currently only fires row triggers, not statement triggers. The initial table synchronization, however, is implemented like a `COPY` command and thus fires both row and statement triggers for `INSERT`.

[#id](#LOGICAL-REPLICATION-SNAPSHOT)

### 31.7.1. Initial Snapshot [#](#LOGICAL-REPLICATION-SNAPSHOT)

The initial data in existing subscribed tables are snapshotted and copied in a parallel instance of a special kind of apply process. This process will create its own replication slot and copy the existing data. As soon as the copy is finished the table contents will become visible to other backends. Once existing data is copied, the worker enters synchronization mode, which ensures that the table is brought up to a synchronized state with the main apply process by streaming any changes that happened during the initial data copy using standard logical replication. During this synchronization phase, the changes are applied and committed in the same order as they happened on the publisher. Once synchronization is done, control of the replication of the table is given back to the main apply process where replication continues as normal.

### Note

The publication [`publish`](sql-createpublication#SQL-CREATEPUBLICATION-WITH-PUBLISH) parameter only affects what DML operations will be replicated. The initial data synchronization does not take this parameter into account when copying the existing table data.
