[#id](#DIFFERENT-REPLICATION-SOLUTIONS)

## 27.1. Comparison of Different Solutions [#](#DIFFERENT-REPLICATION-SOLUTIONS)

- Shared Disk Failover

  Shared disk failover avoids synchronization overhead by having only one copy of the database. It uses a single disk array that is shared by multiple servers. If the main database server fails, the standby server is able to mount and start the database as though it were recovering from a database crash. This allows rapid failover with no data loss.

  Shared hardware functionality is common in network storage devices. Using a network file system is also possible, though care must be taken that the file system has full POSIX behavior (see [Section 19.2.2.1](creating-cluster#CREATING-CLUSTER-NFS)). One significant limitation of this method is that if the shared disk array fails or becomes corrupt, the primary and standby servers are both nonfunctional. Another issue is that the standby server should never access the shared storage while the primary server is running.

- File System (Block Device) Replication

  A modified version of shared hardware functionality is file system replication, where all changes to a file system are mirrored to a file system residing on another computer. The only restriction is that the mirroring must be done in a way that ensures the standby server has a consistent copy of the file system — specifically, writes to the standby must be done in the same order as those on the primary. DRBD is a popular file system replication solution for Linux.

- Write-Ahead Log Shipping

  Warm and hot standby servers can be kept current by reading a stream of write-ahead log (WAL) records. If the main server fails, the standby contains almost all of the data of the main server, and can be quickly made the new primary database server. This can be synchronous or asynchronous and can only be done for the entire database server.

  A standby server can be implemented using file-based log shipping ([Section 27.2](warm-standby)) or streaming replication (see [Section 27.2.5](warm-standby#STREAMING-REPLICATION)), or a combination of both. For information on hot standby, see [Section 27.4](hot-standby).

- Logical Replication

  Logical replication allows a database server to send a stream of data modifications to another server. PostgreSQL logical replication constructs a stream of logical data modifications from the WAL. Logical replication allows replication of data changes on a per-table basis. In addition, a server that is publishing its own changes can also subscribe to changes from another server, allowing data to flow in multiple directions. For more information on logical replication, see [Chapter 31](logical-replication). Through the logical decoding interface ([Chapter 49](logicaldecoding)), third-party extensions can also provide similar functionality.

- Trigger-Based Primary-Standby Replication

  A trigger-based replication setup typically funnels data modification queries to a designated primary server. Operating on a per-table basis, the primary server sends data changes (typically) asynchronously to the standby servers. Standby servers can answer queries while the primary is running, and may allow some local data changes or write activity. This form of replication is often used for offloading large analytical or data warehouse queries.

  Slony-I is an example of this type of replication, with per-table granularity, and support for multiple standby servers. Because it updates the standby server asynchronously (in batches), there is possible data loss during fail over.

- SQL-Based Replication Middleware

  With SQL-based replication middleware, a program intercepts every SQL query and sends it to one or all servers. Each server operates independently. Read-write queries must be sent to all servers, so that every server receives any changes. But read-only queries can be sent to just one server, allowing the read workload to be distributed among them.

  If queries are simply broadcast unmodified, functions like `random()`, `CURRENT_TIMESTAMP`, and sequences can have different values on different servers. This is because each server operates independently, and because SQL queries are broadcast rather than actual data changes. If this is unacceptable, either the middleware or the application must determine such values from a single source and then use those values in write queries. Care must also be taken that all transactions either commit or abort on all servers, perhaps using two-phase commit ([PREPARE TRANSACTION](sql-prepare-transaction) and [COMMIT PREPARED](sql-commit-prepared)). Pgpool-II and Continuent Tungsten are examples of this type of replication.

- Asynchronous Multimaster Replication

  For servers that are not regularly connected or have slow communication links, like laptops or remote servers, keeping data consistent among servers is a challenge. Using asynchronous multimaster replication, each server works independently, and periodically communicates with the other servers to identify conflicting transactions. The conflicts can be resolved by users or conflict resolution rules. Bucardo is an example of this type of replication.

- Synchronous Multimaster Replication

  In synchronous multimaster replication, each server can accept write requests, and modified data is transmitted from the original server to every other server before each transaction commits. Heavy write activity can cause excessive locking and commit delays, leading to poor performance. Read requests can be sent to any server. Some implementations use shared disk to reduce the communication overhead. Synchronous multimaster replication is best for mostly read workloads, though its big advantage is that any server can accept write requests — there is no need to partition workloads between primary and standby servers, and because the data changes are sent from one server to another, there is no problem with non-deterministic functions like `random()`.

  PostgreSQL does not offer this type of replication, though PostgreSQL two-phase commit ([PREPARE TRANSACTION](sql-prepare-transaction) and [COMMIT PREPARED](sql-commit-prepared)) can be used to implement this in application code or middleware.

[Table 27.1](different-replication-solutions#HIGH-AVAILABILITY-MATRIX) summarizes the capabilities of the various solutions listed above.

[#id](#HIGH-AVAILABILITY-MATRIX)

**Table 27.1. High Availability, Load Balancing, and Replication Feature Matrix**

| Feature                              | Shared Disk | File System Repl. | Write-Ahead Log Shipping | Logical Repl.                     | Trigger-​Based Repl. | SQL Repl. Middle-ware | Async. MM Repl. | Sync. MM Repl.           |
| ------------------------------------ | ----------- | ----------------- | ------------------------ | --------------------------------- | -------------------- | --------------------- | --------------- | ------------------------ |
| Popular examples                     | NAS         | DRBD              | built-in streaming repl. | built-in logical repl., pglogical | Londiste, Slony      | pgpool-II             | Bucardo         |                          |
| Comm. method                         | shared disk | disk blocks       | WAL                      | logical decoding                  | table rows           | SQL                   | table rows      | table rows and row locks |
| No special hardware required         |             | •                 | •                        | •                                 | •                    | •                     | •               | •                        |
| Allows multiple primary servers      |             |                   |                          | •                                 |                      | •                     | •               | •                        |
| No overhead on primary               | •           |                   | •                        | •                                 |                      | •                     |                 |                          |
| No waiting for multiple servers      | •           |                   | with sync off            | with sync off                     | •                    |                       | •               |                          |
| Primary failure will never lose data | •           | •                 | with sync on             | with sync on                      |                      | •                     |                 | •                        |
| Replicas accept read-only queries    |             |                   | with hot standby         | •                                 | •                    | •                     | •               | •                        |
| Per-table granularity                |             |                   |                          | •                                 | •                    |                       | •               | •                        |
| No conflict resolution necessary     | •           | •                 | •                        |                                   | •                    | •                     |                 | •                        |

There are a few solutions that do not fit into the above categories:

- Data Partitioning

  Data partitioning splits tables into data sets. Each set can be modified by only one server. For example, data can be partitioned by offices, e.g., London and Paris, with a server in each office. If queries combining London and Paris data are necessary, an application can query both servers, or primary/standby replication can be used to keep a read-only copy of the other office's data on each server.

- Multiple-Server Parallel Query Execution

  Many of the above solutions allow multiple servers to handle multiple queries, but none allow a single query to use multiple servers to complete faster. This solution allows multiple servers to work concurrently on a single query. It is usually accomplished by splitting the data among servers and having each server execute its part of the query and return results to a central server where they are combined and returned to the user. This can be implemented using the PL/Proxy tool set.

It should also be noted that because PostgreSQL is open source and easily extended, a number of companies have taken PostgreSQL and created commercial closed-source solutions with unique failover, replication, and load balancing capabilities. These are not discussed here.
