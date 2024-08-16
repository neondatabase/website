[#id](#LOGICAL-REPLICATION)

## Chapter 31. Logical Replication

**Table of Contents**

- [31.1. Publication](logical-replication-publication)
- [31.2. Subscription](logical-replication-subscription)

  - [31.2.1. Replication Slot Management](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-SLOT)
  - [31.2.2. Examples: Set Up Logical Replication](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES)
  - [31.2.3. Examples: Deferred Replication Slot Creation](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES-DEFERRED-SLOT)

- [31.3. Row Filters](logical-replication-row-filter)

  - [31.3.1. Row Filter Rules](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-RULES)
  - [31.3.2. Expression Restrictions](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-RESTRICTIONS)
  - [31.3.3. UPDATE Transformations](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-TRANSFORMATIONS)
  - [31.3.4. Partitioned Tables](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-PARTITIONED-TABLE)
  - [31.3.5. Initial Data Synchronization](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-INITIAL-DATA-SYNC)
  - [31.3.6. Combining Multiple Row Filters](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-COMBINING)
  - [31.3.7. Examples](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-EXAMPLES)

- [31.4. Column Lists](logical-replication-col-lists)

  - [31.4.1. Examples](logical-replication-col-lists#LOGICAL-REPLICATION-COL-LIST-EXAMPLES)

  - [31.5. Conflicts](logical-replication-conflicts)
  - [31.6. Restrictions](logical-replication-restrictions)
  - [31.7. Architecture](logical-replication-architecture)

  * [31.7.1. Initial Snapshot](logical-replication-architecture#LOGICAL-REPLICATION-SNAPSHOT)

  - [31.8. Monitoring](logical-replication-monitoring)
  - [31.9. Security](logical-replication-security)
  - [31.10. Configuration Settings](logical-replication-config)

    - [31.10.1. Publishers](logical-replication-config#LOGICAL-REPLICATION-CONFIG-PUBLISHER)
    - [31.10.2. Subscribers](logical-replication-config#LOGICAL-REPLICATION-CONFIG-SUBSCRIBER)

- [31.11. Quick Setup](logical-replication-quick-setup)

Logical replication is a method of replicating data objects and their changes, based upon their replication identity (usually a primary key). We use the term logical in contrast to physical replication, which uses exact block addresses and byte-by-byte replication. PostgreSQL supports both mechanisms concurrently, see [Chapter 27](high-availability). Logical replication allows fine-grained control over both data replication and security.

Logical replication uses a _publish_ and _subscribe_ model with one or more _subscribers_ subscribing to one or more _publications_ on a _publisher_ node. Subscribers pull data from the publications they subscribe to and may subsequently re-publish data to allow cascading replication or more complex configurations.

Logical replication of a table typically starts with taking a snapshot of the data on the publisher database and copying that to the subscriber. Once that is done, the changes on the publisher are sent to the subscriber as they occur in real-time. The subscriber applies the data in the same order as the publisher so that transactional consistency is guaranteed for publications within a single subscription. This method of data replication is sometimes referred to as transactional replication.

The typical use-cases for logical replication are:

- Sending incremental changes in a single database or a subset of a database to subscribers as they occur.

- Firing triggers for individual changes as they arrive on the subscriber.

- Consolidating multiple databases into a single one (for example for analytical purposes).

- Replicating between different major versions of PostgreSQL.

- Replicating between PostgreSQL instances on different platforms (for example Linux to Windows)

- Giving access to replicated data to different groups of users.

- Sharing a subset of the database between multiple databases.

The subscriber database behaves in the same way as any other PostgreSQL instance and can be used as a publisher for other databases by defining its own publications. When the subscriber is treated as read-only by application, there will be no conflicts from a single subscription. On the other hand, if there are other writes done either by an application or by other subscribers to the same set of tables, conflicts can arise.
