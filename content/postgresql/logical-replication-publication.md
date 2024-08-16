[#id](#LOGICAL-REPLICATION-PUBLICATION)

## 31.1. Publication [#](#LOGICAL-REPLICATION-PUBLICATION)

A _publication_ can be defined on any physical replication primary. The node where a publication is defined is referred to as _publisher_. A publication is a set of changes generated from a table or a group of tables, and might also be described as a change set or replication set. Each publication exists in only one database.

Publications are different from schemas and do not affect how the table is accessed. Each table can be added to multiple publications if needed. Publications may currently only contain tables and all tables in schema. Objects must be added explicitly, except when a publication is created for `ALL TABLES`.

Publications can choose to limit the changes they produce to any combination of `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE`, similar to how triggers are fired by particular event types. By default, all operation types are replicated. These publication specifications apply only for DML operations; they do not affect the initial data synchronization copy. (Row filters have no effect for `TRUNCATE`. See [Section 31.3](logical-replication-row-filter)).

A published table must have a _replica identity_ configured in order to be able to replicate `UPDATE` and `DELETE` operations, so that appropriate rows to update or delete can be identified on the subscriber side. By default, this is the primary key, if there is one. Another unique index (with certain additional requirements) can also be set to be the replica identity. If the table does not have any suitable key, then it can be set to replica identity `FULL`, which means the entire row becomes the key. When replica identity `FULL` is specified, indexes can be used on the subscriber side for searching the rows. Candidate indexes must be btree, non-partial, and the leftmost index field must be a column (not an expression) that references the published table column. These restrictions on the non-unique index properties adhere to some of the restrictions that are enforced for primary keys. If there are no such suitable indexes, the search on the subscriber side can be very inefficient, therefore replica identity `FULL` should only be used as a fallback if no other solution is possible. If a replica identity other than `FULL` is set on the publisher side, a replica identity comprising the same or fewer columns must also be set on the subscriber side. See [`REPLICA IDENTITY`](sql-altertable#SQL-ALTERTABLE-REPLICA-IDENTITY) for details on how to set the replica identity. If a table without a replica identity is added to a publication that replicates `UPDATE` or `DELETE` operations then subsequent `UPDATE` or `DELETE` operations will cause an error on the publisher. `INSERT` operations can proceed regardless of any replica identity.

Every publication can have multiple subscribers.

A publication is created using the [`CREATE PUBLICATION`](sql-createpublication) command and may later be altered or dropped using corresponding commands.

The individual tables can be added and removed dynamically using [`ALTER PUBLICATION`](sql-alterpublication). Both the `ADD TABLE` and `DROP TABLE` operations are transactional; so the table will start or stop replicating at the correct snapshot once the transaction has committed.
