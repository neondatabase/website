## Appendix M. Glossary

This is a list of terms and their meaning in the context of PostgreSQL and relational database systems in general.

* ACID

    [**](glossary#GLOSSARY-ATOMICITY)*[Atomicity](glossary#GLOSSARY-ATOMICITY "Atomicity")*, [**](glossary#GLOSSARY-CONSISTENCY)*[Consistency](glossary#GLOSSARY-CONSISTENCY "Consistency")*, [**](glossary#GLOSSARY-ISOLATION)*[Isolation](glossary#GLOSSARY-ISOLATION "Isolation")*, and [**](glossary#GLOSSARY-DURABILITY)*[Durability](glossary#GLOSSARY-DURABILITY "Durability")*. This set of properties of database transactions is intended to guarantee validity in concurrent operation and even in event of errors, power failures, etc.

* Aggregate function (routine)

    A [**](glossary#GLOSSARY-FUNCTION)*[function](glossary#GLOSSARY-FUNCTION "Function (routine)")* that combines (*aggregates*) multiple input values, for example by counting, averaging or adding, yielding a single output value.

    For more information, see [Section 9.21](functions-aggregate "9.21. Aggregate Functions").

    See Also [Window function (routine)](glossary#GLOSSARY-WINDOW-FUNCTION).

* Analytic function

    See [Window function (routine)](glossary#GLOSSARY-WINDOW-FUNCTION).

* Analyze (operation)

    The act of collecting statistics from data in [**](glossary#GLOSSARY-TABLE)*[tables](glossary#GLOSSARY-TABLE "Table")* and other [**](glossary#GLOSSARY-RELATION)*[relations](glossary#GLOSSARY-RELATION "Relation")* to help the [**](glossary#GLOSSARY-PLANNER)*[query planner](glossary#GLOSSARY-PLANNER "Query planner")* to make decisions about how to execute [**](glossary#GLOSSARY-QUERY)*[queries](glossary#GLOSSARY-QUERY "Query")*.

    (Don't confuse this term with the `ANALYZE` option to the [EXPLAIN](sql-explain "EXPLAIN") command.)

    For more information, see [ANALYZE](sql-analyze "ANALYZE").

* Atomic

  * In reference to a [**](glossary#GLOSSARY-DATUM)*[datum](glossary#GLOSSARY-DATUM "Datum")*: the fact that its value cannot be broken down into smaller components.
  * In reference to a [**](glossary#GLOSSARY-TRANSACTION)*[database transaction](glossary#GLOSSARY-TRANSACTION "Transaction")*: see [**](glossary#GLOSSARY-ATOMICITY)*[atomicity](glossary#GLOSSARY-ATOMICITY "Atomicity")*.

* Atomicity

    The property of a [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")* that either all its operations complete as a single unit or none do. In addition, if a system failure occurs during the execution of a transaction, no partial results are visible after recovery. This is one of the ACID properties.

* Attribute

    An element with a certain name and data type found within a [**](glossary#GLOSSARY-TUPLE)*[tuple](glossary#GLOSSARY-TUPLE "Tuple")*.

* Autovacuum (process)

    A set of background processes that routinely perform [**](glossary#GLOSSARY-VACUUM)*[vacuum](glossary#GLOSSARY-VACUUM "Vacuum")* and [**](glossary#GLOSSARY-ANALYZE)*[analyze](glossary#GLOSSARY-ANALYZE "Analyze (operation)")* operations. The [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* that coordinates the work and is always present (unless autovacuum is disabled) is known as the *autovacuum launcher*, and the processes that carry out the tasks are known as the *autovacuum workers*.

    For more information, see [Section 25.1.6](routine-vacuuming#AUTOVACUUM "25.1.6. The Autovacuum Daemon").

* Auxiliary process

    A process within an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")* that is in charge of some specific background task for the instance. The auxiliary processes consist of the [**](glossary#GLOSSARY-AUTOVACUUM)*[autovacuum launcher](glossary#GLOSSARY-AUTOVACUUM "Autovacuum (process)")* (but not the autovacuum workers), the [**](glossary#GLOSSARY-BACKGROUND-WRITER)*[background writer](glossary#GLOSSARY-BACKGROUND-WRITER "Background writer (process)")*, the [**](glossary#GLOSSARY-CHECKPOINTER)*[checkpointer](glossary#GLOSSARY-CHECKPOINTER "Checkpointer (process)")*, the [**](glossary#GLOSSARY-LOGGER)*[logger](glossary#GLOSSARY-LOGGER "Logger (process)")*, the [**](glossary#GLOSSARY-STARTUP-PROCESS)*[startup process](glossary#GLOSSARY-STARTUP-PROCESS "Startup process")*, the [**](glossary#GLOSSARY-WAL-ARCHIVER)*[WAL archiver](glossary#GLOSSARY-WAL-ARCHIVER "WAL archiver (process)")*, the [**](glossary#GLOSSARY-WAL-RECEIVER)*[WAL receiver](glossary#GLOSSARY-WAL-RECEIVER "WAL receiver (process)")* (but not the [**](glossary#GLOSSARY-WAL-SENDER)*[WAL senders](glossary#GLOSSARY-WAL-SENDER "WAL sender (process)")*), and the [**](glossary#GLOSSARY-WAL-WRITER)*[WAL writer](glossary#GLOSSARY-WAL-WRITER "WAL writer (process)")*.

* Backend (process)

    Process of an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")* which acts on behalf of a [**](glossary#GLOSSARY-SESSION)*[client session](glossary#GLOSSARY-SESSION "Session")* and handles its requests.

    (Don't confuse this term with the similar terms [**](glossary#GLOSSARY-BACKGROUND-WORKER)*[Background Worker](glossary#GLOSSARY-BACKGROUND-WORKER "Background worker (process)")* or [**](glossary#GLOSSARY-BACKGROUND-WRITER)*[Background Writer](glossary#GLOSSARY-BACKGROUND-WRITER "Background writer (process)")*).

* Background worker (process)

    Process within an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")*, which runs system- or user-supplied code. Serves as infrastructure for several features in PostgreSQL, such as [**](glossary#GLOSSARY-REPLICATION)*[logical replication](glossary#GLOSSARY-REPLICATION "Replication")* and [**](glossary#GLOSSARY-PARALLEL-QUERY)*[parallel queries](glossary#GLOSSARY-PARALLEL-QUERY "Parallel query")*. In addition, [**](glossary#GLOSSARY-EXTENSION)*[Extensions](glossary#GLOSSARY-EXTENSION "Extension")* can add custom background worker processes.

    For more information, see [Chapter 48](bgworker "Chapter 48. Background Worker Processes").

* Background writer (process)

    An [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* that writes dirty [**](glossary#GLOSSARY-DATA-PAGE)*[data pages](glossary#GLOSSARY-DATA-PAGE "Data page")* from [**](glossary#GLOSSARY-SHARED-MEMORY)*[shared memory](glossary#GLOSSARY-SHARED-MEMORY "Shared memory")* to the file system. It wakes up periodically, but works only for a short period in order to distribute its expensive I/O activity over time to avoid generating larger I/O peaks which could block other processes.

    For more information, see [Section 20.4.5](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER "20.4.5. Background Writer").

* Base Backup

    A binary copy of all [**](glossary#GLOSSARY-DB-CLUSTER)*[database cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")* files. It is generated by the tool [pg\_basebackup](app-pgbasebackup "pg_basebackup"). In combination with WAL files it can be used as the starting point for recovery, log shipping, or streaming replication.

* Bloat

    Space in data pages which does not contain current row versions, such as unused (free) space or outdated row versions.

* Bootstrap superuser

    The first [**](glossary#GLOSSARY-USER)*[user](glossary#GLOSSARY-USER "User")* initialized in a [**](glossary#GLOSSARY-DB-CLUSTER)*[database cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")*.

    This user owns all system catalog tables in each database. It is also the role from which all granted permissions originate. Because of these things, this role may not be dropped.

    This role also behaves as a normal [**](glossary#GLOSSARY-DATABASE-SUPERUSER)*[database superuser](glossary#GLOSSARY-DATABASE-SUPERUSER "Database superuser")*.

* Buffer Access Strategy

    Some operations will access a large number of [**](glossary#GLOSSARY-DATA-PAGE)*[pages](glossary#GLOSSARY-DATA-PAGE "Data page")*. A *Buffer Access Strategy* helps to prevent these operations from evicting too many pages from [**](glossary#GLOSSARY-SHARED-MEMORY)*[shared buffers](glossary#GLOSSARY-SHARED-MEMORY "Shared memory")*.

    A Buffer Access Strategy sets up references to a limited number of [**](glossary#GLOSSARY-SHARED-MEMORY)*[shared buffers](glossary#GLOSSARY-SHARED-MEMORY "Shared memory")* and reuses them circularly. When the operation requires a new page, a victim buffer is chosen from the buffers in the strategy ring, which may require flushing the page's dirty data and possibly also unflushed [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")* to permanent storage.

    Buffer Access Strategies are used for various operations such as sequential scans of large tables, `VACUUM`, `COPY`, `CREATE TABLE AS SELECT`, `ALTER TABLE`, `CREATE DATABASE`, `CREATE INDEX`, and `CLUSTER`.

* Cast

    A conversion of a [**](glossary#GLOSSARY-DATUM)*[datum](glossary#GLOSSARY-DATUM "Datum")* from its current data type to another data type.

    For more information, see [CREATE CAST](sql-createcast "CREATE CAST").

* Catalog

    The SQL standard uses this term to indicate what is called a [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* in PostgreSQL's terminology.

    (Don't confuse this term with [**](glossary#GLOSSARY-SYSTEM-CATALOG)*[system catalog](glossary#GLOSSARY-SYSTEM-CATALOG "System catalog")*).

    For more information, see [Section 23.1](manage-ag-overview "23.1. Overview").

* Check constraint

    A type of [**](glossary#GLOSSARY-CONSTRAINT)*[constraint](glossary#GLOSSARY-CONSTRAINT "Constraint")* defined on a [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* which restricts the values allowed in one or more [**](glossary#GLOSSARY-ATTRIBUTE)*[attributes](glossary#GLOSSARY-ATTRIBUTE "Attribute")*. The check constraint can make reference to any attribute of the same row in the relation, but cannot reference other rows of the same relation or other relations.

    For more information, see [Section 5.4](ddl-constraints "5.4. Constraints").

* Checkpoint

    A point in the [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")* sequence at which it is guaranteed that the heap and index data files have been updated with all information from [**](glossary#GLOSSARY-SHARED-MEMORY)*[shared memory](glossary#GLOSSARY-SHARED-MEMORY "Shared memory")* modified before that checkpoint; a *checkpoint record* is written and flushed to WAL to mark that point.

    A checkpoint is also the act of carrying out all the actions that are necessary to reach a checkpoint as defined above. This process is initiated when predefined conditions are met, such as a specified amount of time has passed, or a certain volume of records has been written; or it can be invoked by the user with the command `CHECKPOINT`.

    For more information, see [Section 30.5](wal-configuration "30.5. WAL Configuration").

* Checkpointer (process)

    An [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* that is responsible for executing [**](glossary#GLOSSARY-CHECKPOINT)*[checkpoints](glossary#GLOSSARY-CHECKPOINT "Checkpoint")*.

* Class (archaic)

    See [Relation](glossary#GLOSSARY-RELATION).

* Client (process)

    Any process, possibly remote, that establishes a [**](glossary#GLOSSARY-SESSION)*[session](glossary#GLOSSARY-SESSION "Session")* by [**](glossary#GLOSSARY-CONNECTION)*[connecting](glossary#GLOSSARY-CONNECTION "Connection")* to an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")* to interact with a [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")*.

* Cluster owner

    The operating system user that owns the [**](glossary#GLOSSARY-DATA-DIRECTORY)*[data directory](glossary#GLOSSARY-DATA-DIRECTORY "Data directory")* and under which the `postgres` process is run. It is required that this user exist prior to creating a new [**](glossary#GLOSSARY-DB-CLUSTER)*[database cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")*.

    On operating systems with a `root` user, said user is not allowed to be the cluster owner.

* Column

    An [**](glossary#GLOSSARY-ATTRIBUTE)*[attribute](glossary#GLOSSARY-ATTRIBUTE "Attribute")* found in a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* or [**](glossary#GLOSSARY-VIEW)*[view](glossary#GLOSSARY-VIEW "View")*.

* Commit

    The act of finalizing a [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")* within the [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")*, which makes it visible to other transactions and assures its [**](glossary#GLOSSARY-DURABILITY)*[durability](glossary#GLOSSARY-DURABILITY "Durability")*.

    For more information, see [COMMIT](sql-commit "COMMIT").

* Concurrency

    The concept that multiple independent operations happen within the [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* at the same time. In PostgreSQL, concurrency is controlled by the [**](glossary#GLOSSARY-MVCC)*[multiversion concurrency control](glossary#GLOSSARY-MVCC "Multi-version concurrency control (MVCC)")* mechanism.

* Connection

    An established line of communication between a client process and a [**](glossary#GLOSSARY-BACKEND)*[backend](glossary#GLOSSARY-BACKEND "Backend (process)")* process, usually over a network, supporting a [**](glossary#GLOSSARY-SESSION)*[session](glossary#GLOSSARY-SESSION "Session")*. This term is sometimes used as a synonym for session.

    For more information, see [Section 20.3](runtime-config-connection "20.3. Connections and Authentication").

* Consistency

    The property that the data in the [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* is always in compliance with [**](glossary#GLOSSARY-CONSTRAINT)*[integrity constraints](glossary#GLOSSARY-CONSTRAINT "Constraint")*. Transactions may be allowed to violate some of the constraints transiently before it commits, but if such violations are not resolved by the time it commits, such a transaction is automatically [**](glossary#GLOSSARY-ROLLBACK)*[rolled back](glossary#GLOSSARY-ROLLBACK "Rollback")*. This is one of the ACID properties.

* Constraint

    A restriction on the values of data allowed within a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")*, or in attributes of a [**](glossary#GLOSSARY-DOMAIN)*[domain](glossary#GLOSSARY-DOMAIN "Domain")*.

    For more information, see [Section 5.4](ddl-constraints "5.4. Constraints").

* Cumulative Statistics System

    A system which, if enabled, accumulates statistical information about the [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")*'s activities.

    For more information, see [Section 28.2](monitoring-stats "28.2. The Cumulative Statistics System").

* Data area

    See [Data directory](glossary#GLOSSARY-DATA-DIRECTORY).

* Database

    A named collection of [**](glossary#GLOSSARY-SQL-OBJECT)*[local SQL objects](glossary#GLOSSARY-SQL-OBJECT "SQL object")*.

    For more information, see [Section 23.1](manage-ag-overview "23.1. Overview").

* Database cluster

    A collection of databases and global SQL objects, and their common static and dynamic metadata. Sometimes referred to as a *cluster*. A database cluster is created using the [initdb](app-initdb "initdb") program.

    In PostgreSQL, the term *cluster* is also sometimes used to refer to an instance. (Don't confuse this term with the SQL command `CLUSTER`.)

    See also [**](glossary#GLOSSARY-CLUSTER-OWNER)*[cluster owner](glossary#GLOSSARY-CLUSTER-OWNER "Cluster owner")*, the operating-system owner of a cluster, and [**](glossary#GLOSSARY-BOOTSTRAP-SUPERUSER)*[bootstrap superuser](glossary#GLOSSARY-BOOTSTRAP-SUPERUSER "Bootstrap superuser")*, the PostgreSQL owner of a cluster.

* Database server

    See [Instance](glossary#GLOSSARY-INSTANCE).

* Database superuser

    A role having *superuser status* (see [Section 22.2](role-attributes "22.2. Role Attributes")).

    Frequently referred to as *superuser*.

* Data directory

    The base directory on the file system of a [**](glossary#GLOSSARY-SERVER)*[server](glossary#GLOSSARY-SERVER "Server")* that contains all data files and subdirectories associated with a [**](glossary#GLOSSARY-DB-CLUSTER)*[database cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")* (with the exception of [**](glossary#GLOSSARY-TABLESPACE)*[tablespaces](glossary#GLOSSARY-TABLESPACE "Tablespace")*, and optionally [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")*). The environment variable `PGDATA` is commonly used to refer to the data directory.

    A [**](glossary#GLOSSARY-DB-CLUSTER)*[cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")*'s storage space comprises the data directory plus any additional tablespaces.

    For more information, see [Section 73.1](storage-file-layout "73.1. Database File Layout").

* Data page

    The basic structure used to store relation data. All pages are of the same size. Data pages are typically stored on disk, each in a specific file, and can be read to [**](glossary#GLOSSARY-SHARED-MEMORY)*[shared buffers](glossary#GLOSSARY-SHARED-MEMORY "Shared memory")* where they can be modified, becoming *dirty*. They become clean when written to disk. New pages, which initially exist in memory only, are also dirty until written.

* Datum

    The internal representation of one value of an SQL data type.

* Delete

    An SQL command which removes [**](glossary#GLOSSARY-TUPLE)*[rows](glossary#GLOSSARY-TUPLE "Tuple")* from a given [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* or [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")*.

    For more information, see [DELETE](sql-delete "DELETE").

* Domain

    A user-defined data type that is based on another underlying data type. It acts the same as the underlying type except for possibly restricting the set of allowed values.

    For more information, see [Section 8.18](domains "8.18. Domain Types").

* Durability

    The assurance that once a [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")* has been [**](glossary#GLOSSARY-COMMIT)*[committed](glossary#GLOSSARY-COMMIT "Commit")*, the changes remain even after a system failure or crash. This is one of the ACID properties.

* Epoch

    See [Transaction ID](glossary#GLOSSARY-XID).

* Extension

    A software add-on package that can be installed on an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")* to get extra features.

    For more information, see [Section 38.17](extend-extensions "38.17. Packaging Related Objects into an Extension").

* File segment

    A physical file which stores data for a given [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")*. File segments are limited in size by a configuration value (typically 1 gigabyte), so if a relation exceeds that size, it is split into multiple segments.

    For more information, see [Section 73.1](storage-file-layout "73.1. Database File Layout").

    (Don't confuse this term with the similar term [**](glossary#GLOSSARY-WAL-FILE)*[WAL segment](glossary#GLOSSARY-WAL-FILE "WAL file")*).

* Foreign data wrapper

    A means of representing data that is not contained in the local [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* so that it appears as if were in local [**](glossary#GLOSSARY-TABLE)*[table(s)](glossary#GLOSSARY-TABLE "Table")*. With a foreign data wrapper it is possible to define a [**](glossary#GLOSSARY-FOREIGN-SERVER)*[foreign server](glossary#GLOSSARY-FOREIGN-SERVER "Foreign server")* and [**](glossary#GLOSSARY-FOREIGN-TABLE)*[foreign tables](glossary#GLOSSARY-FOREIGN-TABLE "Foreign table (relation)")*.

    For more information, see [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper "CREATE FOREIGN DATA WRAPPER").

* Foreign key

    A type of [**](glossary#GLOSSARY-CONSTRAINT)*[constraint](glossary#GLOSSARY-CONSTRAINT "Constraint")* defined on one or more [**](glossary#GLOSSARY-COLUMN)*[columns](glossary#GLOSSARY-COLUMN "Column")* in a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* which requires the value(s) in those [**](glossary#GLOSSARY-COLUMN)*[columns](glossary#GLOSSARY-COLUMN "Column")* to identify zero or one [**](glossary#GLOSSARY-TUPLE)*[row](glossary#GLOSSARY-TUPLE "Tuple")* in another (or, infrequently, the same) [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")*.

* Foreign server

    A named collection of [**](glossary#GLOSSARY-FOREIGN-TABLE)*[foreign tables](glossary#GLOSSARY-FOREIGN-TABLE "Foreign table (relation)")* which all use the same [**](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)*[foreign data wrapper](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER "Foreign data wrapper")* and have other configuration values in common.

    For more information, see [CREATE SERVER](sql-createserver "CREATE SERVER").

* Foreign table (relation)

    A [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* which appears to have [**](glossary#GLOSSARY-TUPLE)*[rows](glossary#GLOSSARY-TUPLE "Tuple")* and [**](glossary#GLOSSARY-COLUMN)*[columns](glossary#GLOSSARY-COLUMN "Column")* similar to a regular [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")*, but will forward requests for data through its [**](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)*[foreign data wrapper](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER "Foreign data wrapper")*, which will return [**](glossary#GLOSSARY-RESULT-SET)*[result sets](glossary#GLOSSARY-RESULT-SET "Result set")* structured according to the definition of the [**](glossary#GLOSSARY-FOREIGN-TABLE)*[foreign table](glossary#GLOSSARY-FOREIGN-TABLE "Foreign table (relation)")*.

    For more information, see [CREATE FOREIGN TABLE](sql-createforeigntable "CREATE FOREIGN TABLE").

* Fork

    Each of the separate segmented file sets in which a relation is stored. The *main fork* is where the actual data resides. There also exist two secondary forks for metadata: the [**](glossary#GLOSSARY-FSM)*[free space map](glossary#GLOSSARY-FSM "Free space map (fork)")* and the [**](glossary#GLOSSARY-VM)*[visibility map](glossary#GLOSSARY-VM "Visibility map (fork)")*. [**](glossary#GLOSSARY-UNLOGGED)*[Unlogged relations](glossary#GLOSSARY-UNLOGGED "Unlogged")* also have an *init fork*.

* Free space map (fork)

    A storage structure that keeps metadata about each data page of a table's main fork. The free space map entry for each page stores the amount of free space that's available for future tuples, and is structured to be efficiently searched for available space for a new tuple of a given size.

    For more information, see [Section 73.3](storage-fsm "73.3. Free Space Map").

* Function (routine)

    A type of routine that receives zero or more arguments, returns zero or more output values, and is constrained to run within one transaction. Functions are invoked as part of a query, for example via `SELECT`. Certain functions can return [**](glossary#GLOSSARY-RESULT-SET)*[sets](glossary#GLOSSARY-RESULT-SET "Result set")*; those are called *set-returning functions*.

    Functions can also be used for [**](glossary#GLOSSARY-TRIGGER)*[triggers](glossary#GLOSSARY-TRIGGER "Trigger")* to invoke.

    For more information, see [CREATE FUNCTION](sql-createfunction "CREATE FUNCTION").

* Grant

    An SQL command that is used to allow a [**](glossary#GLOSSARY-USER)*[user](glossary#GLOSSARY-USER "User")* or [**](glossary#GLOSSARY-ROLE)*[role](glossary#GLOSSARY-ROLE "Role")* to access specific objects within the [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")*.

    For more information, see [GRANT](sql-grant "GRANT").

* Heap

    Contains the values of [**](glossary#GLOSSARY-TUPLE)*[row](glossary#GLOSSARY-TUPLE "Tuple")* attributes (i.e., the data) for a [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")*. The heap is realized within one or more [**](glossary#GLOSSARY-FILE-SEGMENT)*[file segments](glossary#GLOSSARY-FILE-SEGMENT "File segment")* in the relation's [**](glossary#GLOSSARY-FORK)*[main fork](glossary#GLOSSARY-FORK "Fork")*.

* Host

    A computer that communicates with other computers over a network. This is sometimes used as a synonym for [**](glossary#GLOSSARY-SERVER)*[server](glossary#GLOSSARY-SERVER "Server")*. It is also used to refer to a computer where [**](glossary#GLOSSARY-CLIENT)*[client processes](glossary#GLOSSARY-CLIENT "Client (process)")* run.

* Index (relation)

    A [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* that contains data derived from a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* or [**](glossary#GLOSSARY-MATERIALIZED-VIEW)*[materialized view](glossary#GLOSSARY-MATERIALIZED-VIEW "Materialized view (relation)")*. Its internal structure supports fast retrieval of and access to the original data.

    For more information, see [CREATE INDEX](sql-createindex "CREATE INDEX").

* Insert

    An SQL command used to add new data into a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")*.

    For more information, see [INSERT](sql-insert "INSERT").

* Instance

    A group of [**](glossary#GLOSSARY-BACKEND)*[backend](glossary#GLOSSARY-BACKEND "Backend (process)")* and [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary processes](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* that communicate using a common shared memory area. One [**](glossary#GLOSSARY-POSTMASTER)*[postmaster process](glossary#GLOSSARY-POSTMASTER "Postmaster (process)")* manages the instance; one instance manages exactly one [**](glossary#GLOSSARY-DB-CLUSTER)*[database cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")* with all its databases. Many instances can run on the same [**](glossary#GLOSSARY-SERVER)*[server](glossary#GLOSSARY-SERVER "Server")* as long as their TCP ports do not conflict.

    The instance handles all key features of a DBMS: read and write access to files and shared memory, assurance of the ACID properties, [**](glossary#GLOSSARY-CONNECTION)*[connections](glossary#GLOSSARY-CONNECTION "Connection")* to [**](glossary#GLOSSARY-CLIENT)*[client processes](glossary#GLOSSARY-CLIENT "Client (process)")*, privilege verification, crash recovery, replication, etc.

* Isolation

    The property that the effects of a transaction are not visible to [**](glossary#GLOSSARY-CONCURRENCY)*[concurrent transactions](glossary#GLOSSARY-CONCURRENCY "Concurrency")* before it commits. This is one of the ACID properties.

    For more information, see [Section 13.2](transaction-iso "13.2. Transaction Isolation").

* Join

    An operation and SQL keyword used in [**](glossary#GLOSSARY-QUERY)*[queries](glossary#GLOSSARY-QUERY "Query")* for combining data from multiple [**](glossary#GLOSSARY-RELATION)*[relations](glossary#GLOSSARY-RELATION "Relation")*.

* Key

    A means of identifying a [**](glossary#GLOSSARY-TUPLE)*[row](glossary#GLOSSARY-TUPLE "Tuple")* within a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* or other [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* by values contained within one or more [**](glossary#GLOSSARY-ATTRIBUTE)*[attributes](glossary#GLOSSARY-ATTRIBUTE "Attribute")* in that relation.

* Lock

    A mechanism that allows a process to limit or prevent simultaneous access to a resource.

* Log file

    Log files contain human-readable text lines about events. Examples include login failures, long-running queries, etc.

    For more information, see [Section 25.3](logfile-maintenance "25.3. Log File Maintenance").

* Logged

    A [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* is considered [**](glossary#GLOSSARY-LOGGED)*[logged](glossary#GLOSSARY-LOGGED "Logged")* if changes to it are sent to the [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")*. By default, all regular tables are logged. A table can be specified as [**](glossary#GLOSSARY-UNLOGGED)*[unlogged](glossary#GLOSSARY-UNLOGGED "Unlogged")* either at creation time or via the `ALTER TABLE` command.

* Logger (process)

    An [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* which, if enabled, writes information about database events into the current [**](glossary#GLOSSARY-LOG-FILE)*[log file](glossary#GLOSSARY-LOG-FILE "Log file")*. When reaching certain time- or volume-dependent criteria, a new log file is created. Also called *syslogger*.

    For more information, see [Section 20.8](runtime-config-logging "20.8. Error Reporting and Logging").

* Log record

    Archaic term for a [**](glossary#GLOSSARY-WAL-RECORD)*[WAL record](glossary#GLOSSARY-WAL-RECORD "WAL record")*.

* Log sequence number (LSN)

    Byte offset into the [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")*, increasing monotonically with each new [**](glossary#GLOSSARY-WAL-RECORD)*[WAL record](glossary#GLOSSARY-WAL-RECORD "WAL record")*.

    For more information, see [`pg_lsn`](datatype-pg-lsn "8.20. pg_lsn Type") and [Section 30.6](wal-internals "30.6. WAL Internals").

* LSN

    See [Log sequence number](glossary#GLOSSARY-LOG-SEQUENCE-NUMBER).

* Master (server)

    See [Primary (server)](glossary#GLOSSARY-PRIMARY-SERVER).

* Materialized

    The property that some information has been pre-computed and stored for later use, rather than computing it on-the-fly.

    This term is used in [**](glossary#GLOSSARY-MATERIALIZED-VIEW)*[materialized view](glossary#GLOSSARY-MATERIALIZED-VIEW "Materialized view (relation)")*, to mean that the data derived from the view's query is stored on disk separately from the sources of that data.

    This term is also used to refer to some multi-step queries to mean that the data resulting from executing a given step is stored in memory (with the possibility of spilling to disk), so that it can be read multiple times by another step.

* Materialized view (relation)

    A [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* that is defined by a `SELECT` statement (just like a [**](glossary#GLOSSARY-VIEW)*[view](glossary#GLOSSARY-VIEW "View")*), but stores data in the same way that a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* does. It cannot be modified via `INSERT`, `UPDATE`, or `DELETE` operations.

    For more information, see [CREATE MATERIALIZED VIEW](sql-creatematerializedview "CREATE MATERIALIZED VIEW").

* Multi-version concurrency control (MVCC)

    A mechanism designed to allow several [**](glossary#GLOSSARY-TRANSACTION)*[transactions](glossary#GLOSSARY-TRANSACTION "Transaction")* to be reading and writing the same rows without one process causing other processes to stall. In PostgreSQL, MVCC is implemented by creating copies (*versions*) of [**](glossary#GLOSSARY-TUPLE)*[tuples](glossary#GLOSSARY-TUPLE "Tuple")* as they are modified; after transactions that can see the old versions terminate, those old versions need to be removed.

* Null

    A concept of non-existence that is a central tenet of relational database theory. It represents the absence of a definite value.

* Optimizer

    See [Query planner](glossary#GLOSSARY-PLANNER).

* Parallel query

    The ability to handle parts of executing a [**](glossary#GLOSSARY-QUERY)*[query](glossary#GLOSSARY-QUERY "Query")* to take advantage of parallel processes on servers with multiple CPUs.

* Partition

  * One of several disjoint (not overlapping) subsets of a larger set.
  * In reference to a [**](glossary#GLOSSARY-PARTITIONED-TABLE)*[partitioned table](glossary#GLOSSARY-PARTITIONED-TABLE "Partitioned table (relation)")*: One of the tables that each contain part of the data of the partitioned table, which is said to be the *parent*. The partition is itself a table, so it can also be queried directly; at the same time, a partition can sometimes be a partitioned table, allowing hierarchies to be created.
  * In reference to a [**](glossary#GLOSSARY-WINDOW-FUNCTION)*[window function](glossary#GLOSSARY-WINDOW-FUNCTION "Window function (routine)")* in a [**](glossary#GLOSSARY-QUERY)*[query](glossary#GLOSSARY-QUERY "Query")*, a partition is a user-defined criterion that identifies which neighboring [**](glossary#GLOSSARY-TUPLE)*[rows](glossary#GLOSSARY-TUPLE "Tuple")* of the [**](glossary#GLOSSARY-RESULT-SET)*[query's result set](glossary#GLOSSARY-RESULT-SET "Result set")* can be considered by the function.

* Partitioned table (relation)

    A [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* that is in semantic terms the same as a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")*, but whose storage is distributed across several [**](glossary#GLOSSARY-PARTITION)*[partitions](glossary#GLOSSARY-PARTITION "Partition")*.

* Postmaster (process)

    The very first process of an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")*. It starts and manages the [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary processes](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* and creates [**](glossary#GLOSSARY-BACKEND)*[backend processes](glossary#GLOSSARY-BACKEND "Backend (process)")* on demand.

    For more information, see [Section 19.3](server-start "19.3. Starting the Database Server").

* Primary key

    A special case of a [**](glossary#GLOSSARY-UNIQUE-CONSTRAINT)*[unique constraint](glossary#GLOSSARY-UNIQUE-CONSTRAINT "Unique constraint")* defined on a [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* or other [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* that also guarantees that all of the [**](glossary#GLOSSARY-ATTRIBUTE)*[attributes](glossary#GLOSSARY-ATTRIBUTE "Attribute")* within the [**](glossary#GLOSSARY-PRIMARY-KEY)*[primary key](glossary#GLOSSARY-PRIMARY-KEY "Primary key")* do not have [**](glossary#GLOSSARY-NULL)*[null](glossary#GLOSSARY-NULL "Null")* values. As the name implies, there can be only one primary key per table, though it is possible to have multiple unique constraints that also have no null-capable attributes.

* Primary (server)

    When two or more [**](glossary#GLOSSARY-DATABASE)*[databases](glossary#GLOSSARY-DATABASE "Database")* are linked via [**](glossary#GLOSSARY-REPLICATION)*[replication](glossary#GLOSSARY-REPLICATION "Replication")*, the [**](glossary#GLOSSARY-SERVER)*[server](glossary#GLOSSARY-SERVER "Server")* that is considered the authoritative source of information is called the *primary*, also known as a *master*.

* Procedure (routine)

    A type of routine. Their distinctive qualities are that they do not return values, and that they are allowed to make transactional statements such as `COMMIT` and `ROLLBACK`. They are invoked via the `CALL` command.

    For more information, see [CREATE PROCEDURE](sql-createprocedure "CREATE PROCEDURE").

* Query

    A request sent by a client to a [**](glossary#GLOSSARY-BACKEND)*[backend](glossary#GLOSSARY-BACKEND "Backend (process)")*, usually to return results or to modify data on the database.

* Query planner

    The part of PostgreSQL that is devoted to determining (*planning*) the most efficient way to execute [**](glossary#GLOSSARY-QUERY)*[queries](glossary#GLOSSARY-QUERY "Query")*. Also known as *query optimizer*, *optimizer*, or simply *planner*.

* Record

    See [Tuple](glossary#GLOSSARY-TUPLE).

* Recycling

    See [WAL file](glossary#GLOSSARY-WAL-FILE).

* Referential integrity

    A means of restricting data in one [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* by a [**](glossary#GLOSSARY-FOREIGN-KEY)*[foreign key](glossary#GLOSSARY-FOREIGN-KEY "Foreign key")* so that it must have matching data in another [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")*.

* Relation

    The generic term for all objects in a [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* that have a name and a list of [**](glossary#GLOSSARY-ATTRIBUTE)*[attributes](glossary#GLOSSARY-ATTRIBUTE "Attribute")* defined in a specific order. [**](glossary#GLOSSARY-TABLE)*[Tables](glossary#GLOSSARY-TABLE "Table")*, [**](glossary#GLOSSARY-SEQUENCE)*[sequences](glossary#GLOSSARY-SEQUENCE "Sequence (relation)")*, [**](glossary#GLOSSARY-VIEW)*[views](glossary#GLOSSARY-VIEW "View")*, [**](glossary#GLOSSARY-FOREIGN-TABLE)*[foreign tables](glossary#GLOSSARY-FOREIGN-TABLE "Foreign table (relation)")*, [**](glossary#GLOSSARY-MATERIALIZED-VIEW)*[materialized views](glossary#GLOSSARY-MATERIALIZED-VIEW "Materialized view (relation)")*, composite types, and [**](glossary#GLOSSARY-INDEX)*[indexes](glossary#GLOSSARY-INDEX "Index (relation)")* are all relations.

    More generically, a relation is a set of tuples; for example, the result of a query is also a relation.

    In PostgreSQL, *Class* is an archaic synonym for *relation*.

* Replica (server)

    A [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* that is paired with a [**](glossary#GLOSSARY-PRIMARY-SERVER)*[primary](glossary#GLOSSARY-PRIMARY-SERVER "Primary (server)")* database and is maintaining a copy of some or all of the primary database's data. The foremost reasons for doing this are to allow for greater access to that data, and to maintain availability of the data in the event that the [**](glossary#GLOSSARY-PRIMARY-SERVER)*[primary](glossary#GLOSSARY-PRIMARY-SERVER "Primary (server)")* becomes unavailable.

* Replication

    The act of reproducing data on one [**](glossary#GLOSSARY-SERVER)*[server](glossary#GLOSSARY-SERVER "Server")* onto another server called a [**](glossary#GLOSSARY-REPLICA)*[replica](glossary#GLOSSARY-REPLICA "Replica (server)")*. This can take the form of *physical replication*, where all file changes from one server are copied verbatim, or *logical replication* where a defined subset of data changes are conveyed using a higher-level representation.

* Restartpoint

    A variant of a [**](glossary#GLOSSARY-CHECKPOINT)*[checkpoint](glossary#GLOSSARY-CHECKPOINT "Checkpoint")* performed on a [**](glossary#GLOSSARY-REPLICA)*[replica](glossary#GLOSSARY-REPLICA "Replica (server)")*.

    For more information, see [Section 30.5](wal-configuration "30.5. WAL Configuration").

* Result set

  * A [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* transmitted from a [**](glossary#GLOSSARY-BACKEND)*[backend process](glossary#GLOSSARY-BACKEND "Backend (process)")* to a [**](glossary#GLOSSARY-CLIENT)*[client](glossary#GLOSSARY-CLIENT "Client (process)")* upon the completion of an SQL command, usually a `SELECT` but it can be an `INSERT`, `UPDATE`, or `DELETE` command if the `RETURNING` clause is specified.

        The fact that a result set is a relation means that a query can be used in the definition of another query, becoming a *subquery*.

  *

* Revoke

    A command to prevent access to a named set of [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* objects for a named list of [**](glossary#GLOSSARY-ROLE)*[roles](glossary#GLOSSARY-ROLE "Role")*.

    For more information, see [REVOKE](sql-revoke "REVOKE").

* Role

    A collection of access privileges to the [**](glossary#GLOSSARY-DATABASE)*[instance](glossary#GLOSSARY-DATABASE "Database")*. Roles are themselves a privilege that can be granted to other roles. This is often done for convenience or to ensure completeness when multiple [**](glossary#GLOSSARY-USER)*[users](glossary#GLOSSARY-USER "User")* need the same privileges.

    For more information, see [CREATE ROLE](sql-createrole "CREATE ROLE").

* Rollback

    A command to undo all of the operations performed since the beginning of a [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")*.

    For more information, see [ROLLBACK](sql-rollback "ROLLBACK").

* Routine

    A defined set of instructions stored in the database system that can be invoked for execution. A routine can be written in a variety of programming languages. Routines can be [**](glossary#GLOSSARY-FUNCTION)*[functions](glossary#GLOSSARY-FUNCTION "Function (routine)")* (including set-returning functions and [**](glossary#GLOSSARY-TRIGGER)*[trigger functions](glossary#GLOSSARY-TRIGGER "Trigger")*), [**](glossary#GLOSSARY-AGGREGATE)*[aggregate functions](glossary#GLOSSARY-AGGREGATE "Aggregate function (routine)")*, and [**](glossary#GLOSSARY-PROCEDURE)*[procedures](glossary#GLOSSARY-PROCEDURE "Procedure (routine)")*.

    Many routines are already defined within PostgreSQL itself, but user-defined ones can also be added.

* Row

    See [Tuple](glossary#GLOSSARY-TUPLE).

* Savepoint

    A special mark in the sequence of steps in a [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")*. Data modifications after this point in time may be reverted to the time of the savepoint.

    For more information, see [SAVEPOINT](sql-savepoint "SAVEPOINT").

* Schema

  * A schema is a namespace for [**](glossary#GLOSSARY-SQL-OBJECT)*[SQL objects](glossary#GLOSSARY-SQL-OBJECT "SQL object")*, which all reside in the same [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")*. Each SQL object must reside in exactly one schema.

        All system-defined SQL objects reside in schema `pg_catalog`.

  * More generically, the term *schema* is used to mean all data descriptions ([**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* definitions, [**](glossary#GLOSSARY-CONSTRAINT)*[constraints](glossary#GLOSSARY-CONSTRAINT "Constraint")*, comments, etc.) for a given [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* or subset thereof.

        For more information, see [Section 5.9](ddl-schemas "5.9. Schemas").

* Segment

    See [File segment](glossary#GLOSSARY-FILE-SEGMENT).

* Select

    The SQL command used to request data from a [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")*. Normally, `SELECT` commands are not expected to modify the [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* in any way, but it is possible that [**](glossary#GLOSSARY-FUNCTION)*[functions](glossary#GLOSSARY-FUNCTION "Function (routine)")* invoked within the query could have side effects that do modify data.

    For more information, see [SELECT](sql-select "SELECT").

* Sequence (relation)

    A type of relation that is used to generate values. Typically the generated values are sequential non-repeating numbers. They are commonly used to generate surrogate [**](glossary#GLOSSARY-PRIMARY-KEY)*[primary key](glossary#GLOSSARY-PRIMARY-KEY "Primary key")* values.

* Server

    A computer on which PostgreSQL [**](glossary#GLOSSARY-INSTANCE)*[instances](glossary#GLOSSARY-INSTANCE "Instance")* run. The term *server* denotes real hardware, a container, or a *virtual machine*.

    This term is sometimes used to refer to an instance or to a host.

* Session

    A state that allows a client and a backend to interact, communicating over a [**](glossary#GLOSSARY-CONNECTION)*[connection](glossary#GLOSSARY-CONNECTION "Connection")*.

* Shared memory

    RAM which is used by the processes common to an [**](glossary#GLOSSARY-INSTANCE)*[instance](glossary#GLOSSARY-INSTANCE "Instance")*. It mirrors parts of [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* files, provides a transient area for [**](glossary#GLOSSARY-WAL-RECORD)*[WAL records](glossary#GLOSSARY-WAL-RECORD "WAL record")*, and stores additional common information. Note that shared memory belongs to the complete instance, not to a single database.

    The largest part of shared memory is known as *shared buffers* and is used to mirror part of data files, organized into pages. When a page is modified, it is called a dirty page until it is written back to the file system.

    For more information, see [Section 20.4.1](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-MEMORY "20.4.1. Memory").

* SQL object

    Any object that can be created with a `CREATE` command. Most objects are specific to one database, and are commonly known as *local objects*.

    Most local objects reside in a specific [**](glossary#GLOSSARY-SCHEMA)*[schema](glossary#GLOSSARY-SCHEMA "Schema")* in their containing database, such as [**](glossary#GLOSSARY-RELATION)*[relations](glossary#GLOSSARY-RELATION "Relation")* (all types), [**](glossary#GLOSSARY-FUNCTION)*[routines](glossary#GLOSSARY-FUNCTION "Function (routine)")* (all types), data types, etc. The names of such objects of the same type in the same schema are enforced to be unique.

    There also exist local objects that do not reside in schemas; some examples are [**](glossary#GLOSSARY-EXTENSION)*[extensions](glossary#GLOSSARY-EXTENSION "Extension")*, [**](glossary#GLOSSARY-CAST)*[data type casts](glossary#GLOSSARY-CAST "Cast")*, and [**](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)*[foreign data wrappers](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER "Foreign data wrapper")*. The names of such objects of the same type are enforced to be unique within the database.

    Other object types, such as [**](glossary#GLOSSARY-ROLE)*[roles](glossary#GLOSSARY-ROLE "Role")*, [**](glossary#GLOSSARY-TABLESPACE)*[tablespaces](glossary#GLOSSARY-TABLESPACE "Tablespace")*, replication origins, subscriptions for logical replication, and databases themselves are not local SQL objects since they exist entirely outside of any specific database; they are called *global objects*. The names of such objects are enforced to be unique within the whole database cluster.

    For more information, see [Section 23.1](manage-ag-overview "23.1. Overview").

* SQL standard

    A series of documents that define the SQL language.

* Standby (server)

    See [Replica (server)](glossary#GLOSSARY-REPLICA).

* Startup process

    An [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* that replays WAL during crash recovery and in a [**](glossary#GLOSSARY-REPLICATION)*[physical replica](glossary#GLOSSARY-REPLICATION "Replication")*.

    (The name is historical: the startup process was named before replication was implemented; the name refers to its task as it relates to the server startup following a crash.)

* Superuser

    As used in this documentation, it is a synonym for [**](glossary#GLOSSARY-DATABASE-SUPERUSER)*[database superuser](glossary#GLOSSARY-DATABASE-SUPERUSER "Database superuser")*.

* System catalog

    A collection of [**](glossary#GLOSSARY-TABLE)*[tables](glossary#GLOSSARY-TABLE "Table")* which describe the structure of all [**](glossary#GLOSSARY-SQL-OBJECT)*[SQL objects](glossary#GLOSSARY-SQL-OBJECT "SQL object")* of the instance. The system catalog resides in the schema `pg_catalog`. These tables contain data in internal representation and are not typically considered useful for user examination; a number of user-friendlier [**](glossary#GLOSSARY-VIEW)*[views](glossary#GLOSSARY-VIEW "View")*, also in schema `pg_catalog`, offer more convenient access to some of that information, while additional tables and views exist in schema `information_schema` (see [Chapter 37](information-schema "Chapter 37. The Information Schema")) that expose some of the same and additional information as mandated by the [**](glossary#GLOSSARY-SQL-STANDARD)*[SQL standard](glossary#GLOSSARY-SQL-STANDARD "SQL standard")*.

    For more information, see [Section 5.9](ddl-schemas "5.9. Schemas").

* Table

    A collection of [**](glossary#GLOSSARY-TUPLE)*[tuples](glossary#GLOSSARY-TUPLE "Tuple")* having a common data structure (the same number of [**](glossary#GLOSSARY-ATTRIBUTE)*[attributes](glossary#GLOSSARY-ATTRIBUTE "Attribute")*, in the same order, having the same name and type per position). A table is the most common form of [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* in PostgreSQL.

    For more information, see [CREATE TABLE](sql-createtable "CREATE TABLE").

* Tablespace

    A named location on the server file system. All [**](glossary#GLOSSARY-SQL-OBJECT)*[SQL objects](glossary#GLOSSARY-SQL-OBJECT "SQL object")* which require storage beyond their definition in the [**](glossary#GLOSSARY-SYSTEM-CATALOG)*[system catalog](glossary#GLOSSARY-SYSTEM-CATALOG "System catalog")* must belong to a single tablespace. Initially, a database cluster contains a single usable tablespace which is used as the default for all SQL objects, called `pg_default`.

    For more information, see [Section 23.6](manage-ag-tablespaces "23.6. Tablespaces").

* Temporary table

    [**](glossary#GLOSSARY-TABLE)*[Tables](glossary#GLOSSARY-TABLE "Table")* that exist either for the lifetime of a [**](glossary#GLOSSARY-SESSION)*[session](glossary#GLOSSARY-SESSION "Session")* or a [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")*, as specified at the time of creation. The data in them is not visible to other sessions, and is not [**](glossary#GLOSSARY-LOGGED)*[logged](glossary#GLOSSARY-LOGGED "Logged")*. Temporary tables are often used to store intermediate data for a multi-step operation.

    For more information, see [CREATE TABLE](sql-createtable "CREATE TABLE").

* TOAST

    A mechanism by which large attributes of table rows are split and stored in a secondary table, called the *TOAST table*. Each relation with large attributes has its own TOAST table.

    For more information, see [Section 73.2](storage-toast "73.2. TOAST").

* Transaction

    A combination of commands that must act as a single [**](glossary#GLOSSARY-ATOMIC)*[atomic](glossary#GLOSSARY-ATOMIC "Atomic")* command: they all succeed or all fail as a single unit, and their effects are not visible to other [**](glossary#GLOSSARY-SESSION)*[sessions](glossary#GLOSSARY-SESSION "Session")* until the transaction is complete, and possibly even later, depending on the isolation level.

    For more information, see [Section 13.2](transaction-iso "13.2. Transaction Isolation").

* Transaction ID

    The numerical, unique, sequentially-assigned identifier that each transaction receives when it first causes a database modification. Frequently abbreviated as *xid*. When stored on disk, xids are only 32-bits wide, so only approximately four billion write transaction IDs can be generated; to permit the system to run for longer than that, *epochs* are used, also 32 bits wide. When the counter reaches the maximum xid value, it starts over at `3` (values under that are reserved) and the epoch value is incremented by one. In some contexts, the epoch and xid values are considered together as a single 64-bit value; see [Section 74.1](transaction-id "74.1. Transactions and Identifiers") for more details.

    For more information, see [Section 8.19](datatype-oid "8.19. Object Identifier Types").

* Transactions per second (TPS)

    Average number of transactions that are executed per second, totaled across all sessions active for a measured run. This is used as a measure of the performance characteristics of an instance.

* Trigger

    A [**](glossary#GLOSSARY-FUNCTION)*[function](glossary#GLOSSARY-FUNCTION "Function (routine)")* which can be defined to execute whenever a certain operation (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`) is applied to a [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")*. A trigger executes within the same [**](glossary#GLOSSARY-TRANSACTION)*[transaction](glossary#GLOSSARY-TRANSACTION "Transaction")* as the statement which invoked it, and if the function fails, then the invoking statement also fails.

    For more information, see [CREATE TRIGGER](sql-createtrigger "CREATE TRIGGER").

* Tuple

    A collection of [**](glossary#GLOSSARY-ATTRIBUTE)*[attributes](glossary#GLOSSARY-ATTRIBUTE "Attribute")* in a fixed order. That order may be defined by the [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")* (or other [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")*) where the tuple is contained, in which case the tuple is often called a *row*. It may also be defined by the structure of a result set, in which case it is sometimes called a *record*.

* Unique constraint

    A type of [**](glossary#GLOSSARY-CONSTRAINT)*[constraint](glossary#GLOSSARY-CONSTRAINT "Constraint")* defined on a [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* which restricts the values allowed in one or a combination of columns so that each value or combination of values can only appear once in the relation — that is, no other row in the relation contains values that are equal to those.

    Because [**](glossary#GLOSSARY-NULL)*[null values](glossary#GLOSSARY-NULL "Null")* are not considered equal to each other, multiple rows with null values are allowed to exist without violating the unique constraint.

* Unlogged

    The property of certain [**](glossary#GLOSSARY-RELATION)*[relations](glossary#GLOSSARY-RELATION "Relation")* that the changes to them are not reflected in the [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")*. This disables replication and crash recovery for these relations.

    The primary use of unlogged tables is for storing transient work data that must be shared across processes.

    [**](glossary#GLOSSARY-TEMPORARY-TABLE)*[Temporary tables](glossary#GLOSSARY-TEMPORARY-TABLE "Temporary table")* are always unlogged.

* Update

    An SQL command used to modify [**](glossary#GLOSSARY-TUPLE)*[rows](glossary#GLOSSARY-TUPLE "Tuple")* that may already exist in a specified [**](glossary#GLOSSARY-TABLE)*[table](glossary#GLOSSARY-TABLE "Table")*. It cannot create or remove rows.

    For more information, see [UPDATE](sql-update "UPDATE").

* User

    A [**](glossary#GLOSSARY-ROLE)*[role](glossary#GLOSSARY-ROLE "Role")* that has the *login privilege* (see [Section 22.2](role-attributes "22.2. Role Attributes")).

* User mapping

    The translation of login credentials in the local [**](glossary#GLOSSARY-DATABASE)*[database](glossary#GLOSSARY-DATABASE "Database")* to credentials in a remote data system defined by a [**](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)*[foreign data wrapper](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER "Foreign data wrapper")*.

    For more information, see [CREATE USER MAPPING](sql-createusermapping "CREATE USER MAPPING").

* Vacuum

    The process of removing outdated [**](glossary#GLOSSARY-TUPLE)*[tuple versions](glossary#GLOSSARY-TUPLE "Tuple")* from tables or materialized views, and other closely related processing required by PostgreSQL's implementation of [**](glossary#GLOSSARY-MVCC)*[MVCC](glossary#GLOSSARY-MVCC "Multi-version concurrency control (MVCC)")*. This can be initiated through the use of the `VACUUM` command, but can also be handled automatically via [**](glossary#GLOSSARY-AUTOVACUUM)*[autovacuum](glossary#GLOSSARY-AUTOVACUUM "Autovacuum (process)")* processes.

    For more information, see [Section 25.1](routine-vacuuming "25.1. Routine Vacuuming") .

* View

    A [**](glossary#GLOSSARY-RELATION)*[relation](glossary#GLOSSARY-RELATION "Relation")* that is defined by a `SELECT` statement, but has no storage of its own. Any time a query references a view, the definition of the view is substituted into the query as if the user had typed it as a subquery instead of the name of the view.

    For more information, see [CREATE VIEW](sql-createview "CREATE VIEW").

* Visibility map (fork)

    A storage structure that keeps metadata about each data page of a table's main fork. The visibility map entry for each page stores two bits: the first one (`all-visible`) indicates that all tuples in the page are visible to all transactions. The second one (`all-frozen`) indicates that all tuples in the page are marked frozen.

* WAL

    See [Write-ahead log](glossary#GLOSSARY-WAL).

* WAL archiver (process)

    An [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* which, if enabled, saves copies of [**](glossary#GLOSSARY-WAL-FILE)*[WAL files](glossary#GLOSSARY-WAL-FILE "WAL file")* for the purpose of creating backups or keeping [**](glossary#GLOSSARY-REPLICA)*[replicas](glossary#GLOSSARY-REPLICA "Replica (server)")* current.

    For more information, see [Section 26.3](continuous-archiving "26.3. Continuous Archiving and Point-in-Time Recovery (PITR)").

* WAL file

    Also known as *WAL segment* or *WAL segment file*. Each of the sequentially-numbered files that provide storage space for [**](glossary#GLOSSARY-WAL)*[WAL](glossary#GLOSSARY-WAL "Write-ahead log")*. The files are all of the same predefined size and are written in sequential order, interspersing changes as they occur in multiple simultaneous sessions. If the system crashes, the files are read in order, and each of the changes is replayed to restore the system to the state it was in before the crash.

    Each WAL file can be released after a [**](glossary#GLOSSARY-CHECKPOINT)*[checkpoint](glossary#GLOSSARY-CHECKPOINT "Checkpoint")* writes all the changes in it to the corresponding data files. Releasing the file can be done either by deleting it, or by changing its name so that it will be used in the future, which is called *recycling*.

    For more information, see [Section 30.6](wal-internals "30.6. WAL Internals").

* WAL record

    A low-level description of an individual data change. It contains sufficient information for the data change to be re-executed (*replayed*) in case a system failure causes the change to be lost. WAL records use a non-printable binary format.

    For more information, see [Section 30.6](wal-internals "30.6. WAL Internals").

* WAL receiver (process)

    An [**](glossary#GLOSSARY-AUXILIARY-PROC)*[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC "Auxiliary process")* that runs on a [**](glossary#GLOSSARY-REPLICA)*[replica](glossary#GLOSSARY-REPLICA "Replica (server)")* to receive WAL from the [**](glossary#GLOSSARY-PRIMARY-SERVER)*[primary server](glossary#GLOSSARY-PRIMARY-SERVER "Primary (server)")* for replay by the [**](glossary#GLOSSARY-STARTUP-PROCESS)*[startup process](glossary#GLOSSARY-STARTUP-PROCESS "Startup process")*.

    For more information, see [Section 27.2](warm-standby "27.2. Log-Shipping Standby Servers").

* WAL segment

    See [WAL file](glossary#GLOSSARY-WAL-FILE).

* WAL sender (process)

    A special [**](glossary#GLOSSARY-BACKEND)*[backend process](glossary#GLOSSARY-BACKEND "Backend (process)")* that streams WAL over a network. The receiving end can be a [**](glossary#GLOSSARY-WAL-RECEIVER)*[WAL receiver](glossary#GLOSSARY-WAL-RECEIVER "WAL receiver (process)")* in a [**](glossary#GLOSSARY-REPLICA)*[replica](glossary#GLOSSARY-REPLICA "Replica (server)")*, [pg\_receivewal](app-pgreceivewal "pg_receivewal"), or any other client program that speaks the replication protocol.

* WAL writer (process)

    A process that writes [**](glossary#GLOSSARY-WAL-RECORD)*[WAL records](glossary#GLOSSARY-WAL-RECORD "WAL record")* from [**](glossary#GLOSSARY-SHARED-MEMORY)*[shared memory](glossary#GLOSSARY-SHARED-MEMORY "Shared memory")* to [**](glossary#GLOSSARY-WAL-FILE)*[WAL files](glossary#GLOSSARY-WAL-FILE "WAL file")*.

    For more information, see [Section 20.5](runtime-config-wal "20.5. Write Ahead Log").

* Window function (routine)

    A type of [**](glossary#GLOSSARY-FUNCTION)*[function](glossary#GLOSSARY-FUNCTION "Function (routine)")* used in a [**](glossary#GLOSSARY-QUERY)*[query](glossary#GLOSSARY-QUERY "Query")* that applies to a [**](glossary#GLOSSARY-PARTITION)*[partition](glossary#GLOSSARY-PARTITION "Partition")* of the query's [**](glossary#GLOSSARY-RESULT-SET)*[result set](glossary#GLOSSARY-RESULT-SET "Result set")*; the function's result is based on values found in [**](glossary#GLOSSARY-TUPLE)*[rows](glossary#GLOSSARY-TUPLE "Tuple")* of the same partition or frame.

    All [**](glossary#GLOSSARY-AGGREGATE)*[aggregate functions](glossary#GLOSSARY-AGGREGATE "Aggregate function (routine)")* can be used as window functions, but window functions can also be used to, for example, give ranks to each of the rows in the partition. Also known as *analytic functions*.

    For more information, see [Section 3.5](tutorial-window "3.5. Window Functions").

* Write-ahead log

    The journal that keeps track of the changes in the [**](glossary#GLOSSARY-DB-CLUSTER)*[database cluster](glossary#GLOSSARY-DB-CLUSTER "Database cluster")* as user- and system-invoked operations take place. It comprises many individual [**](glossary#GLOSSARY-WAL-RECORD)*[WAL records](glossary#GLOSSARY-WAL-RECORD "WAL record")* written sequentially to [**](glossary#GLOSSARY-WAL-FILE)*[WAL files](glossary#GLOSSARY-WAL-FILE "WAL file")*.