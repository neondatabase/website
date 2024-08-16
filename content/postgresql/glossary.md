[#id](#GLOSSARY)

## Appendix M. Glossary

This is a list of terms and their meaning in the context of PostgreSQL and relational database systems in general.

- [#id](#GLOSSARY-ACID)ACID

  [\*\*](glossary#GLOSSARY-ATOMICITY)_[Atomicity](glossary#GLOSSARY-ATOMICITY)_, [\*\*](glossary#GLOSSARY-CONSISTENCY)_[Consistency](glossary#GLOSSARY-CONSISTENCY)_, [\*\*](glossary#GLOSSARY-ISOLATION)_[Isolation](glossary#GLOSSARY-ISOLATION)_, and [\*\*](glossary#GLOSSARY-DURABILITY)_[Durability](glossary#GLOSSARY-DURABILITY)_. This set of properties of database transactions is intended to guarantee validity in concurrent operation and even in event of errors, power failures, etc.

- [#id](#GLOSSARY-AGGREGATE)Aggregate function (routine)

  A [\*\*](glossary#GLOSSARY-FUNCTION)_[function](glossary#GLOSSARY-FUNCTION)_ that combines (_aggregates_) multiple input values, for example by counting, averaging or adding, yielding a single output value.

  For more information, see [Section 9.21](functions-aggregate).

  See Also [Window function (routine)](glossary#GLOSSARY-WINDOW-FUNCTION).

- Analytic function

  See [Window function (routine)](glossary#GLOSSARY-WINDOW-FUNCTION).

- [#id](#GLOSSARY-ANALYZE)Analyze (operation)

  The act of collecting statistics from data in [\*\*](glossary#GLOSSARY-TABLE)_[tables](glossary#GLOSSARY-TABLE)_ and other [\*\*](glossary#GLOSSARY-RELATION)_[relations](glossary#GLOSSARY-RELATION)_ to help the [\*\*](glossary#GLOSSARY-PLANNER)_[query planner](glossary#GLOSSARY-PLANNER)_ to make decisions about how to execute [\*\*](glossary#GLOSSARY-QUERY)_[queries](glossary#GLOSSARY-QUERY)_.

  (Don't confuse this term with the `ANALYZE` option to the [EXPLAIN](sql-explain) command.)

  For more information, see [ANALYZE](sql-analyze).

- [#id](#GLOSSARY-ATOMIC)Atomic

  - In reference to a [\*\*](glossary#GLOSSARY-DATUM)_[datum](glossary#GLOSSARY-DATUM)_: the fact that its value cannot be broken down into smaller components.

  - In reference to a [\*\*](glossary#GLOSSARY-TRANSACTION)_[database transaction](glossary#GLOSSARY-TRANSACTION)_: see [\*\*](glossary#GLOSSARY-ATOMICITY)_[atomicity](glossary#GLOSSARY-ATOMICITY)_.

- [#id](#GLOSSARY-ATOMICITY)Atomicity

  The property of a [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_ that either all its operations complete as a single unit or none do. In addition, if a system failure occurs during the execution of a transaction, no partial results are visible after recovery. This is one of the ACID properties.

- [#id](#GLOSSARY-ATTRIBUTE)Attribute

  An element with a certain name and data type found within a [\*\*](glossary#GLOSSARY-TUPLE)_[tuple](glossary#GLOSSARY-TUPLE)_.

- [#id](#GLOSSARY-AUTOVACUUM)Autovacuum (process)

  A set of background processes that routinely perform [\*\*](glossary#GLOSSARY-VACUUM)_[vacuum](glossary#GLOSSARY-VACUUM)_ and [\*\*](glossary#GLOSSARY-ANALYZE)_[analyze](glossary#GLOSSARY-ANALYZE)_ operations. The [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ that coordinates the work and is always present (unless autovacuum is disabled) is known as the _autovacuum launcher_, and the processes that carry out the tasks are known as the _autovacuum workers_.

  For more information, see [Section 25.1.6](routine-vacuuming#AUTOVACUUM).

- [#id](#GLOSSARY-AUXILIARY-PROC)Auxiliary process

  A process within an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_ that is in charge of some specific background task for the instance. The auxiliary processes consist of the [\*\*](glossary#GLOSSARY-AUTOVACUUM)_[autovacuum launcher](glossary#GLOSSARY-AUTOVACUUM)_ (but not the autovacuum workers), the [\*\*](glossary#GLOSSARY-BACKGROUND-WRITER)_[background writer](glossary#GLOSSARY-BACKGROUND-WRITER)_, the [\*\*](glossary#GLOSSARY-CHECKPOINTER)_[checkpointer](glossary#GLOSSARY-CHECKPOINTER)_, the [\*\*](glossary#GLOSSARY-LOGGER)_[logger](glossary#GLOSSARY-LOGGER)_, the [\*\*](glossary#GLOSSARY-STARTUP-PROCESS)_[startup process](glossary#GLOSSARY-STARTUP-PROCESS)_, the [\*\*](glossary#GLOSSARY-WAL-ARCHIVER)_[WAL archiver](glossary#GLOSSARY-WAL-ARCHIVER)_, the [\*\*](glossary#GLOSSARY-WAL-RECEIVER)_[WAL receiver](glossary#GLOSSARY-WAL-RECEIVER)_ (but not the [\*\*](glossary#GLOSSARY-WAL-SENDER)_[WAL senders](glossary#GLOSSARY-WAL-SENDER)_), and the [\*\*](glossary#GLOSSARY-WAL-WRITER)_[WAL writer](glossary#GLOSSARY-WAL-WRITER)_.

- [#id](#GLOSSARY-BACKEND)Backend (process)

  Process of an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_ which acts on behalf of a [\*\*](glossary#GLOSSARY-SESSION)_[client session](glossary#GLOSSARY-SESSION)_ and handles its requests.

  (Don't confuse this term with the similar terms [\*\*](glossary#GLOSSARY-BACKGROUND-WORKER)_[Background Worker](glossary#GLOSSARY-BACKGROUND-WORKER)_ or [\*\*](glossary#GLOSSARY-BACKGROUND-WRITER)_[Background Writer](glossary#GLOSSARY-BACKGROUND-WRITER)_).

- [#id](#GLOSSARY-BACKGROUND-WORKER)Background worker (process)

  Process within an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_, which runs system- or user-supplied code. Serves as infrastructure for several features in PostgreSQL, such as [\*\*](glossary#GLOSSARY-REPLICATION)_[logical replication](glossary#GLOSSARY-REPLICATION)_ and [\*\*](glossary#GLOSSARY-PARALLEL-QUERY)_[parallel queries](glossary#GLOSSARY-PARALLEL-QUERY)_. In addition, [\*\*](glossary#GLOSSARY-EXTENSION)_[Extensions](glossary#GLOSSARY-EXTENSION)_ can add custom background worker processes.

  For more information, see [Chapter 48](bgworker).

- [#id](#GLOSSARY-BACKGROUND-WRITER)Background writer (process)

  An [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ that writes dirty [\*\*](glossary#GLOSSARY-DATA-PAGE)_[data pages](glossary#GLOSSARY-DATA-PAGE)_ from [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared memory](glossary#GLOSSARY-SHARED-MEMORY)_ to the file system. It wakes up periodically, but works only for a short period in order to distribute its expensive I/O activity over time to avoid generating larger I/O peaks which could block other processes.

  For more information, see [Section 20.4.5](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER).

- [#id](#GLOSSARY-BASEBACKUP)Base Backup

  A binary copy of all [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_ files. It is generated by the tool [pg_basebackup](app-pgbasebackup). In combination with WAL files it can be used as the starting point for recovery, log shipping, or streaming replication.

- [#id](#GLOSSARY-BLOAT)Bloat

  Space in data pages which does not contain current row versions, such as unused (free) space or outdated row versions.

- [#id](#GLOSSARY-BOOTSTRAP-SUPERUSER)Bootstrap superuser

  The first [\*\*](glossary#GLOSSARY-USER)_[user](glossary#GLOSSARY-USER)_ initialized in a [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_.

  This user owns all system catalog tables in each database. It is also the role from which all granted permissions originate. Because of these things, this role may not be dropped.

  This role also behaves as a normal [\*\*](glossary#GLOSSARY-DATABASE-SUPERUSER)_[database superuser](glossary#GLOSSARY-DATABASE-SUPERUSER)_.

- [#id](#GLOSSARY-BUFFER-ACCESS-STRATEGY)Buffer Access Strategy

  Some operations will access a large number of [\*\*](glossary#GLOSSARY-DATA-PAGE)_[pages](glossary#GLOSSARY-DATA-PAGE)_. A _Buffer Access Strategy_ helps to prevent these operations from evicting too many pages from [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared buffers](glossary#GLOSSARY-SHARED-MEMORY)_.

  A Buffer Access Strategy sets up references to a limited number of [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared buffers](glossary#GLOSSARY-SHARED-MEMORY)_ and reuses them circularly. When the operation requires a new page, a victim buffer is chosen from the buffers in the strategy ring, which may require flushing the page's dirty data and possibly also unflushed [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_ to permanent storage.

  Buffer Access Strategies are used for various operations such as sequential scans of large tables, `VACUUM`, `COPY`, `CREATE TABLE AS SELECT`, `ALTER TABLE`, `CREATE DATABASE`, `CREATE INDEX`, and `CLUSTER`.

- [#id](#GLOSSARY-CAST)Cast

  A conversion of a [\*\*](glossary#GLOSSARY-DATUM)_[datum](glossary#GLOSSARY-DATUM)_ from its current data type to another data type.

  For more information, see [CREATE CAST](sql-createcast).

- [#id](#GLOSSARY-CATALOG)Catalog

  The SQL standard uses this term to indicate what is called a [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ in PostgreSQL's terminology.

  (Don't confuse this term with [\*\*](glossary#GLOSSARY-SYSTEM-CATALOG)_[system catalog](glossary#GLOSSARY-SYSTEM-CATALOG)_).

  For more information, see [Section 23.1](manage-ag-overview).

- [#id](#GLOSSARY-CHECK-CONSTRAINT)Check constraint

  A type of [\*\*](glossary#GLOSSARY-CONSTRAINT)_[constraint](glossary#GLOSSARY-CONSTRAINT)_ defined on a [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ which restricts the values allowed in one or more [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attributes](glossary#GLOSSARY-ATTRIBUTE)_. The check constraint can make reference to any attribute of the same row in the relation, but cannot reference other rows of the same relation or other relations.

  For more information, see [Section 5.4](ddl-constraints).

- [#id](#GLOSSARY-CHECKPOINT)Checkpoint

  A point in the [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_ sequence at which it is guaranteed that the heap and index data files have been updated with all information from [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared memory](glossary#GLOSSARY-SHARED-MEMORY)_ modified before that checkpoint; a _checkpoint record_ is written and flushed to WAL to mark that point.

  A checkpoint is also the act of carrying out all the actions that are necessary to reach a checkpoint as defined above. This process is initiated when predefined conditions are met, such as a specified amount of time has passed, or a certain volume of records has been written; or it can be invoked by the user with the command `CHECKPOINT`.

  For more information, see [Section 30.5](wal-configuration).

- [#id](#GLOSSARY-CHECKPOINTER)Checkpointer (process)

  An [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ that is responsible for executing [\*\*](glossary#GLOSSARY-CHECKPOINT)_[checkpoints](glossary#GLOSSARY-CHECKPOINT)_.

- Class (archaic)

  See [Relation](glossary#GLOSSARY-RELATION).

- [#id](#GLOSSARY-CLIENT)Client (process)

  Any process, possibly remote, that establishes a [\*\*](glossary#GLOSSARY-SESSION)_[session](glossary#GLOSSARY-SESSION)_ by [\*\*](glossary#GLOSSARY-CONNECTION)_[connecting](glossary#GLOSSARY-CONNECTION)_ to an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_ to interact with a [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_.

- [#id](#GLOSSARY-CLUSTER-OWNER)Cluster owner

  The operating system user that owns the [\*\*](glossary#GLOSSARY-DATA-DIRECTORY)_[data directory](glossary#GLOSSARY-DATA-DIRECTORY)_ and under which the `postgres` process is run. It is required that this user exist prior to creating a new [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_.

  On operating systems with a `root` user, said user is not allowed to be the cluster owner.

- [#id](#GLOSSARY-COLUMN)Column

  An [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attribute](glossary#GLOSSARY-ATTRIBUTE)_ found in a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ or [\*\*](glossary#GLOSSARY-VIEW)_[view](glossary#GLOSSARY-VIEW)_.

- [#id](#GLOSSARY-COMMIT)Commit

  The act of finalizing a [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_ within the [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_, which makes it visible to other transactions and assures its [\*\*](glossary#GLOSSARY-DURABILITY)_[durability](glossary#GLOSSARY-DURABILITY)_.

  For more information, see [COMMIT](sql-commit).

- [#id](#GLOSSARY-CONCURRENCY)Concurrency

  The concept that multiple independent operations happen within the [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ at the same time. In PostgreSQL, concurrency is controlled by the [\*\*](glossary#GLOSSARY-MVCC)_[multiversion concurrency control](glossary#GLOSSARY-MVCC)_ mechanism.

- [#id](#GLOSSARY-CONNECTION)Connection

  An established line of communication between a client process and a [\*\*](glossary#GLOSSARY-BACKEND)_[backend](glossary#GLOSSARY-BACKEND)_ process, usually over a network, supporting a [\*\*](glossary#GLOSSARY-SESSION)_[session](glossary#GLOSSARY-SESSION)_. This term is sometimes used as a synonym for session.

  For more information, see [Section 20.3](runtime-config-connection).

- [#id](#GLOSSARY-CONSISTENCY)Consistency

  The property that the data in the [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ is always in compliance with [\*\*](glossary#GLOSSARY-CONSTRAINT)_[integrity constraints](glossary#GLOSSARY-CONSTRAINT)_. Transactions may be allowed to violate some of the constraints transiently before it commits, but if such violations are not resolved by the time it commits, such a transaction is automatically [\*\*](glossary#GLOSSARY-ROLLBACK)_[rolled back](glossary#GLOSSARY-ROLLBACK)_. This is one of the ACID properties.

- [#id](#GLOSSARY-CONSTRAINT)Constraint

  A restriction on the values of data allowed within a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_, or in attributes of a [\*\*](glossary#GLOSSARY-DOMAIN)_[domain](glossary#GLOSSARY-DOMAIN)_.

  For more information, see [Section 5.4](ddl-constraints).

- [#id](#GLOSSARY-CUMULATIVE-STATISTICS)Cumulative Statistics System

  A system which, if enabled, accumulates statistical information about the [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_'s activities.

  For more information, see [Section 28.2](monitoring-stats).

- Data area

  See [Data directory](glossary#GLOSSARY-DATA-DIRECTORY).

- [#id](#GLOSSARY-DATABASE)Database

  A named collection of [\*\*](glossary#GLOSSARY-SQL-OBJECT)_[local SQL objects](glossary#GLOSSARY-SQL-OBJECT)_.

  For more information, see [Section 23.1](manage-ag-overview).

- [#id](#GLOSSARY-DB-CLUSTER)Database cluster

  A collection of databases and global SQL objects, and their common static and dynamic metadata. Sometimes referred to as a _cluster_. A database cluster is created using the [initdb](app-initdb) program.

  In PostgreSQL, the term _cluster_ is also sometimes used to refer to an instance. (Don't confuse this term with the SQL command `CLUSTER`.)

  See also [\*\*](glossary#GLOSSARY-CLUSTER-OWNER)_[cluster owner](glossary#GLOSSARY-CLUSTER-OWNER)_, the operating-system owner of a cluster, and [\*\*](glossary#GLOSSARY-BOOTSTRAP-SUPERUSER)_[bootstrap superuser](glossary#GLOSSARY-BOOTSTRAP-SUPERUSER)_, the PostgreSQL owner of a cluster.

- Database server

  See [Instance](glossary#GLOSSARY-INSTANCE).

- [#id](#GLOSSARY-DATABASE-SUPERUSER)Database superuser

  A role having _superuser status_ (see [Section 22.2](role-attributes)).

  Frequently referred to as _superuser_.

- [#id](#GLOSSARY-DATA-DIRECTORY)Data directory

  The base directory on the file system of a [\*\*](glossary#GLOSSARY-SERVER)_[server](glossary#GLOSSARY-SERVER)_ that contains all data files and subdirectories associated with a [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_ (with the exception of [\*\*](glossary#GLOSSARY-TABLESPACE)_[tablespaces](glossary#GLOSSARY-TABLESPACE)_, and optionally [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_). The environment variable `PGDATA` is commonly used to refer to the data directory.

  A [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[cluster](glossary#GLOSSARY-DB-CLUSTER)_'s storage space comprises the data directory plus any additional tablespaces.

  For more information, see [Section 73.1](storage-file-layout).

- [#id](#GLOSSARY-DATA-PAGE)Data page

  The basic structure used to store relation data. All pages are of the same size. Data pages are typically stored on disk, each in a specific file, and can be read to [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared buffers](glossary#GLOSSARY-SHARED-MEMORY)_ where they can be modified, becoming _dirty_. They become clean when written to disk. New pages, which initially exist in memory only, are also dirty until written.

- [#id](#GLOSSARY-DATUM)Datum

  The internal representation of one value of an SQL data type.

- [#id](#GLOSSARY-DELETE)Delete

  An SQL command which removes [\*\*](glossary#GLOSSARY-TUPLE)_[rows](glossary#GLOSSARY-TUPLE)_ from a given [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ or [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_.

  For more information, see [DELETE](sql-delete).

- [#id](#GLOSSARY-DOMAIN)Domain

  A user-defined data type that is based on another underlying data type. It acts the same as the underlying type except for possibly restricting the set of allowed values.

  For more information, see [Section 8.18](domains).

- [#id](#GLOSSARY-DURABILITY)Durability

  The assurance that once a [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_ has been [\*\*](glossary#GLOSSARY-COMMIT)_[committed](glossary#GLOSSARY-COMMIT)_, the changes remain even after a system failure or crash. This is one of the ACID properties.

- Epoch

  See [Transaction ID](glossary#GLOSSARY-XID).

- [#id](#GLOSSARY-EXTENSION)Extension

  A software add-on package that can be installed on an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_ to get extra features.

  For more information, see [Section 38.17](extend-extensions).

- [#id](#GLOSSARY-FILE-SEGMENT)File segment

  A physical file which stores data for a given [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_. File segments are limited in size by a configuration value (typically 1 gigabyte), so if a relation exceeds that size, it is split into multiple segments.

  For more information, see [Section 73.1](storage-file-layout).

  (Don't confuse this term with the similar term [\*\*](glossary#GLOSSARY-WAL-FILE)_[WAL segment](glossary#GLOSSARY-WAL-FILE)_).

- [#id](#GLOSSARY-FOREIGN-DATA-WRAPPER)Foreign data wrapper

  A means of representing data that is not contained in the local [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ so that it appears as if were in local [\*\*](glossary#GLOSSARY-TABLE)_[table(s)](glossary#GLOSSARY-TABLE)_. With a foreign data wrapper it is possible to define a [\*\*](glossary#GLOSSARY-FOREIGN-SERVER)_[foreign server](glossary#GLOSSARY-FOREIGN-SERVER)_ and [\*\*](glossary#GLOSSARY-FOREIGN-TABLE)_[foreign tables](glossary#GLOSSARY-FOREIGN-TABLE)_.

  For more information, see [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper).

- [#id](#GLOSSARY-FOREIGN-KEY)Foreign key

  A type of [\*\*](glossary#GLOSSARY-CONSTRAINT)_[constraint](glossary#GLOSSARY-CONSTRAINT)_ defined on one or more [\*\*](glossary#GLOSSARY-COLUMN)_[columns](glossary#GLOSSARY-COLUMN)_ in a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ which requires the value(s) in those [\*\*](glossary#GLOSSARY-COLUMN)_[columns](glossary#GLOSSARY-COLUMN)_ to identify zero or one [\*\*](glossary#GLOSSARY-TUPLE)_[row](glossary#GLOSSARY-TUPLE)_ in another (or, infrequently, the same) [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_.

- [#id](#GLOSSARY-FOREIGN-SERVER)Foreign server

  A named collection of [\*\*](glossary#GLOSSARY-FOREIGN-TABLE)_[foreign tables](glossary#GLOSSARY-FOREIGN-TABLE)_ which all use the same [\*\*](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_[foreign data wrapper](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_ and have other configuration values in common.

  For more information, see [CREATE SERVER](sql-createserver).

- [#id](#GLOSSARY-FOREIGN-TABLE)Foreign table (relation)

  A [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ which appears to have [\*\*](glossary#GLOSSARY-TUPLE)_[rows](glossary#GLOSSARY-TUPLE)_ and [\*\*](glossary#GLOSSARY-COLUMN)_[columns](glossary#GLOSSARY-COLUMN)_ similar to a regular [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_, but will forward requests for data through its [\*\*](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_[foreign data wrapper](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_, which will return [\*\*](glossary#GLOSSARY-RESULT-SET)_[result sets](glossary#GLOSSARY-RESULT-SET)_ structured according to the definition of the [\*\*](glossary#GLOSSARY-FOREIGN-TABLE)_[foreign table](glossary#GLOSSARY-FOREIGN-TABLE)_.

  For more information, see [CREATE FOREIGN TABLE](sql-createforeigntable).

- [#id](#GLOSSARY-FORK)Fork

  Each of the separate segmented file sets in which a relation is stored. The _main fork_ is where the actual data resides. There also exist two secondary forks for metadata: the [\*\*](glossary#GLOSSARY-FSM)_[free space map](glossary#GLOSSARY-FSM)_ and the [\*\*](glossary#GLOSSARY-VM)_[visibility map](glossary#GLOSSARY-VM)_. [\*\*](glossary#GLOSSARY-UNLOGGED)_[Unlogged relations](glossary#GLOSSARY-UNLOGGED)_ also have an _init fork_.

- [#id](#GLOSSARY-FSM)Free space map (fork)

  A storage structure that keeps metadata about each data page of a table's main fork. The free space map entry for each page stores the amount of free space that's available for future tuples, and is structured to be efficiently searched for available space for a new tuple of a given size.

  For more information, see [Section 73.3](storage-fsm).

- [#id](#GLOSSARY-FUNCTION)Function (routine)

  A type of routine that receives zero or more arguments, returns zero or more output values, and is constrained to run within one transaction. Functions are invoked as part of a query, for example via `SELECT`. Certain functions can return [\*\*](glossary#GLOSSARY-RESULT-SET)_[sets](glossary#GLOSSARY-RESULT-SET)_; those are called _set-returning functions_.

  Functions can also be used for [\*\*](glossary#GLOSSARY-TRIGGER)_[triggers](glossary#GLOSSARY-TRIGGER)_ to invoke.

  For more information, see [CREATE FUNCTION](sql-createfunction).

- [#id](#GLOSSARY-GRANT)Grant

  An SQL command that is used to allow a [\*\*](glossary#GLOSSARY-USER)_[user](glossary#GLOSSARY-USER)_ or [\*\*](glossary#GLOSSARY-ROLE)_[role](glossary#GLOSSARY-ROLE)_ to access specific objects within the [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_.

  For more information, see [GRANT](sql-grant).

- [#id](#GLOSSARY-HEAP)Heap

  Contains the values of [\*\*](glossary#GLOSSARY-TUPLE)_[row](glossary#GLOSSARY-TUPLE)_ attributes (i.e., the data) for a [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_. The heap is realized within one or more [\*\*](glossary#GLOSSARY-FILE-SEGMENT)_[file segments](glossary#GLOSSARY-FILE-SEGMENT)_ in the relation's [\*\*](glossary#GLOSSARY-FORK)_[main fork](glossary#GLOSSARY-FORK)_.

- [#id](#GLOSSARY-HOST)Host

  A computer that communicates with other computers over a network. This is sometimes used as a synonym for [\*\*](glossary#GLOSSARY-SERVER)_[server](glossary#GLOSSARY-SERVER)_. It is also used to refer to a computer where [\*\*](glossary#GLOSSARY-CLIENT)_[client processes](glossary#GLOSSARY-CLIENT)_ run.

- [#id](#GLOSSARY-INDEX)Index (relation)

  A [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ that contains data derived from a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ or [\*\*](glossary#GLOSSARY-MATERIALIZED-VIEW)_[materialized view](glossary#GLOSSARY-MATERIALIZED-VIEW)_. Its internal structure supports fast retrieval of and access to the original data.

  For more information, see [CREATE INDEX](sql-createindex).

- [#id](#GLOSSARY-INSERT)Insert

  An SQL command used to add new data into a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_.

  For more information, see [INSERT](sql-insert).

- [#id](#GLOSSARY-INSTANCE)Instance

  A group of [\*\*](glossary#GLOSSARY-BACKEND)_[backend](glossary#GLOSSARY-BACKEND)_ and [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary processes](glossary#GLOSSARY-AUXILIARY-PROC)_ that communicate using a common shared memory area. One [\*\*](glossary#GLOSSARY-POSTMASTER)_[postmaster process](glossary#GLOSSARY-POSTMASTER)_ manages the instance; one instance manages exactly one [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_ with all its databases. Many instances can run on the same [\*\*](glossary#GLOSSARY-SERVER)_[server](glossary#GLOSSARY-SERVER)_ as long as their TCP ports do not conflict.

  The instance handles all key features of a DBMS: read and write access to files and shared memory, assurance of the ACID properties, [\*\*](glossary#GLOSSARY-CONNECTION)_[connections](glossary#GLOSSARY-CONNECTION)_ to [\*\*](glossary#GLOSSARY-CLIENT)_[client processes](glossary#GLOSSARY-CLIENT)_, privilege verification, crash recovery, replication, etc.

- [#id](#GLOSSARY-ISOLATION)Isolation

  The property that the effects of a transaction are not visible to [\*\*](glossary#GLOSSARY-CONCURRENCY)_[concurrent transactions](glossary#GLOSSARY-CONCURRENCY)_ before it commits. This is one of the ACID properties.

  For more information, see [Section 13.2](transaction-iso).

- [#id](#GLOSSARY-JOIN)Join

  An operation and SQL keyword used in [\*\*](glossary#GLOSSARY-QUERY)_[queries](glossary#GLOSSARY-QUERY)_ for combining data from multiple [\*\*](glossary#GLOSSARY-RELATION)_[relations](glossary#GLOSSARY-RELATION)_.

- [#id](#GLOSSARY-KEY)Key

  A means of identifying a [\*\*](glossary#GLOSSARY-TUPLE)_[row](glossary#GLOSSARY-TUPLE)_ within a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ or other [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ by values contained within one or more [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attributes](glossary#GLOSSARY-ATTRIBUTE)_ in that relation.

- [#id](#GLOSSARY-LOCK)Lock

  A mechanism that allows a process to limit or prevent simultaneous access to a resource.

- [#id](#GLOSSARY-LOG-FILE)Log file

  Log files contain human-readable text lines about events. Examples include login failures, long-running queries, etc.

  For more information, see [Section 25.3](logfile-maintenance).

- [#id](#GLOSSARY-LOGGED)Logged

  A [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ is considered [\*\*](glossary#GLOSSARY-LOGGED)_[logged](glossary#GLOSSARY-LOGGED)_ if changes to it are sent to the [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_. By default, all regular tables are logged. A table can be specified as [\*\*](glossary#GLOSSARY-UNLOGGED)_[unlogged](glossary#GLOSSARY-UNLOGGED)_ either at creation time or via the `ALTER TABLE` command.

- [#id](#GLOSSARY-LOGGER)Logger (process)

  An [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ which, if enabled, writes information about database events into the current [\*\*](glossary#GLOSSARY-LOG-FILE)_[log file](glossary#GLOSSARY-LOG-FILE)_. When reaching certain time- or volume-dependent criteria, a new log file is created. Also called _syslogger_.

  For more information, see [Section 20.8](runtime-config-logging).

- [#id](#GLOSSARY-LOG-RECORD)Log record

  Archaic term for a [\*\*](glossary#GLOSSARY-WAL-RECORD)_[WAL record](glossary#GLOSSARY-WAL-RECORD)_.

- [#id](#GLOSSARY-LOG-SEQUENCE-NUMBER)Log sequence number (LSN)

  Byte offset into the [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_, increasing monotonically with each new [\*\*](glossary#GLOSSARY-WAL-RECORD)_[WAL record](glossary#GLOSSARY-WAL-RECORD)_.

  For more information, see [`pg_lsn`](datatype-pg-lsn) and [Section 30.6](wal-internals).

- LSN

  See [Log sequence number](glossary#GLOSSARY-LOG-SEQUENCE-NUMBER).

- Master (server)

  See [Primary (server)](glossary#GLOSSARY-PRIMARY-SERVER).

- [#id](#GLOSSARY-MATERIALIZED)Materialized

  The property that some information has been pre-computed and stored for later use, rather than computing it on-the-fly.

  This term is used in [\*\*](glossary#GLOSSARY-MATERIALIZED-VIEW)_[materialized view](glossary#GLOSSARY-MATERIALIZED-VIEW)_, to mean that the data derived from the view's query is stored on disk separately from the sources of that data.

  This term is also used to refer to some multi-step queries to mean that the data resulting from executing a given step is stored in memory (with the possibility of spilling to disk), so that it can be read multiple times by another step.

- [#id](#GLOSSARY-MATERIALIZED-VIEW)Materialized view (relation)

  A [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ that is defined by a `SELECT` statement (just like a [\*\*](glossary#GLOSSARY-VIEW)_[view](glossary#GLOSSARY-VIEW)_), but stores data in the same way that a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ does. It cannot be modified via `INSERT`, `UPDATE`, or `DELETE` operations.

  For more information, see [CREATE MATERIALIZED VIEW](sql-creatematerializedview).

- [#id](#GLOSSARY-MVCC)Multi-version concurrency control (MVCC)

  A mechanism designed to allow several [\*\*](glossary#GLOSSARY-TRANSACTION)_[transactions](glossary#GLOSSARY-TRANSACTION)_ to be reading and writing the same rows without one process causing other processes to stall. In PostgreSQL, MVCC is implemented by creating copies (_versions_) of [\*\*](glossary#GLOSSARY-TUPLE)_[tuples](glossary#GLOSSARY-TUPLE)_ as they are modified; after transactions that can see the old versions terminate, those old versions need to be removed.

- [#id](#GLOSSARY-NULL)Null

  A concept of non-existence that is a central tenet of relational database theory. It represents the absence of a definite value.

- Optimizer

  See [Query planner](glossary#GLOSSARY-PLANNER).

- [#id](#GLOSSARY-PARALLEL-QUERY)Parallel query

  The ability to handle parts of executing a [\*\*](glossary#GLOSSARY-QUERY)_[query](glossary#GLOSSARY-QUERY)_ to take advantage of parallel processes on servers with multiple CPUs.

- [#id](#GLOSSARY-PARTITION)Partition

  - One of several disjoint (not overlapping) subsets of a larger set.

  - In reference to a [\*\*](glossary#GLOSSARY-PARTITIONED-TABLE)_[partitioned table](glossary#GLOSSARY-PARTITIONED-TABLE)_: One of the tables that each contain part of the data of the partitioned table, which is said to be the _parent_. The partition is itself a table, so it can also be queried directly; at the same time, a partition can sometimes be a partitioned table, allowing hierarchies to be created.

  - In reference to a [\*\*](glossary#GLOSSARY-WINDOW-FUNCTION)_[window function](glossary#GLOSSARY-WINDOW-FUNCTION)_ in a [\*\*](glossary#GLOSSARY-QUERY)_[query](glossary#GLOSSARY-QUERY)_, a partition is a user-defined criterion that identifies which neighboring [\*\*](glossary#GLOSSARY-TUPLE)_[rows](glossary#GLOSSARY-TUPLE)_ of the [\*\*](glossary#GLOSSARY-RESULT-SET)_[query's result set](glossary#GLOSSARY-RESULT-SET)_ can be considered by the function.

- [#id](#GLOSSARY-PARTITIONED-TABLE)Partitioned table (relation)

  A [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ that is in semantic terms the same as a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_, but whose storage is distributed across several [\*\*](glossary#GLOSSARY-PARTITION)_[partitions](glossary#GLOSSARY-PARTITION)_.

- [#id](#GLOSSARY-POSTMASTER)Postmaster (process)

  The very first process of an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_. It starts and manages the [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary processes](glossary#GLOSSARY-AUXILIARY-PROC)_ and creates [\*\*](glossary#GLOSSARY-BACKEND)_[backend processes](glossary#GLOSSARY-BACKEND)_ on demand.

  For more information, see [Section 19.3](server-start).

- [#id](#GLOSSARY-PRIMARY-KEY)Primary key

  A special case of a [\*\*](glossary#GLOSSARY-UNIQUE-CONSTRAINT)_[unique constraint](glossary#GLOSSARY-UNIQUE-CONSTRAINT)_ defined on a [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ or other [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ that also guarantees that all of the [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attributes](glossary#GLOSSARY-ATTRIBUTE)_ within the [\*\*](glossary#GLOSSARY-PRIMARY-KEY)_[primary key](glossary#GLOSSARY-PRIMARY-KEY)_ do not have [\*\*](glossary#GLOSSARY-NULL)_[null](glossary#GLOSSARY-NULL)_ values. As the name implies, there can be only one primary key per table, though it is possible to have multiple unique constraints that also have no null-capable attributes.

- [#id](#GLOSSARY-PRIMARY-SERVER)Primary (server)

  When two or more [\*\*](glossary#GLOSSARY-DATABASE)_[databases](glossary#GLOSSARY-DATABASE)_ are linked via [\*\*](glossary#GLOSSARY-REPLICATION)_[replication](glossary#GLOSSARY-REPLICATION)_, the [\*\*](glossary#GLOSSARY-SERVER)_[server](glossary#GLOSSARY-SERVER)_ that is considered the authoritative source of information is called the _primary_, also known as a _master_.

- [#id](#GLOSSARY-PROCEDURE)Procedure (routine)

  A type of routine. Their distinctive qualities are that they do not return values, and that they are allowed to make transactional statements such as `COMMIT` and `ROLLBACK`. They are invoked via the `CALL` command.

  For more information, see [CREATE PROCEDURE](sql-createprocedure).

- [#id](#GLOSSARY-QUERY)Query

  A request sent by a client to a [\*\*](glossary#GLOSSARY-BACKEND)_[backend](glossary#GLOSSARY-BACKEND)_, usually to return results or to modify data on the database.

- [#id](#GLOSSARY-PLANNER)Query planner

  The part of PostgreSQL that is devoted to determining (_planning_) the most efficient way to execute [\*\*](glossary#GLOSSARY-QUERY)_[queries](glossary#GLOSSARY-QUERY)_. Also known as _query optimizer_, _optimizer_, or simply _planner_.

- Record

  See [Tuple](glossary#GLOSSARY-TUPLE).

- Recycling

  See [WAL file](glossary#GLOSSARY-WAL-FILE).

- [#id](#GLOSSARY-REFERENTIAL-INTEGRITY)Referential integrity

  A means of restricting data in one [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ by a [\*\*](glossary#GLOSSARY-FOREIGN-KEY)_[foreign key](glossary#GLOSSARY-FOREIGN-KEY)_ so that it must have matching data in another [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_.

- [#id](#GLOSSARY-RELATION)Relation

  The generic term for all objects in a [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ that have a name and a list of [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attributes](glossary#GLOSSARY-ATTRIBUTE)_ defined in a specific order. [\*\*](glossary#GLOSSARY-TABLE)_[Tables](glossary#GLOSSARY-TABLE)_, [\*\*](glossary#GLOSSARY-SEQUENCE)_[sequences](glossary#GLOSSARY-SEQUENCE)_, [\*\*](glossary#GLOSSARY-VIEW)_[views](glossary#GLOSSARY-VIEW)_, [\*\*](glossary#GLOSSARY-FOREIGN-TABLE)_[foreign tables](glossary#GLOSSARY-FOREIGN-TABLE)_, [\*\*](glossary#GLOSSARY-MATERIALIZED-VIEW)_[materialized views](glossary#GLOSSARY-MATERIALIZED-VIEW)_, composite types, and [\*\*](glossary#GLOSSARY-INDEX)_[indexes](glossary#GLOSSARY-INDEX)_ are all relations.

  More generically, a relation is a set of tuples; for example, the result of a query is also a relation.

  In PostgreSQL, _Class_ is an archaic synonym for _relation_.

- [#id](#GLOSSARY-REPLICA)Replica (server)

  A [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ that is paired with a [\*\*](glossary#GLOSSARY-PRIMARY-SERVER)_[primary](glossary#GLOSSARY-PRIMARY-SERVER)_ database and is maintaining a copy of some or all of the primary database's data. The foremost reasons for doing this are to allow for greater access to that data, and to maintain availability of the data in the event that the [\*\*](glossary#GLOSSARY-PRIMARY-SERVER)_[primary](glossary#GLOSSARY-PRIMARY-SERVER)_ becomes unavailable.

- [#id](#GLOSSARY-REPLICATION)Replication

  The act of reproducing data on one [\*\*](glossary#GLOSSARY-SERVER)_[server](glossary#GLOSSARY-SERVER)_ onto another server called a [\*\*](glossary#GLOSSARY-REPLICA)_[replica](glossary#GLOSSARY-REPLICA)_. This can take the form of _physical replication_, where all file changes from one server are copied verbatim, or _logical replication_ where a defined subset of data changes are conveyed using a higher-level representation.

- [#id](#GLOSSARY-RESTARTPOINT)Restartpoint

  A variant of a [\*\*](glossary#GLOSSARY-CHECKPOINT)_[checkpoint](glossary#GLOSSARY-CHECKPOINT)_ performed on a [\*\*](glossary#GLOSSARY-REPLICA)_[replica](glossary#GLOSSARY-REPLICA)_.

  For more information, see [Section 30.5](wal-configuration).

- [#id](#GLOSSARY-RESULT-SET)Result set

  - A [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ transmitted from a [\*\*](glossary#GLOSSARY-BACKEND)_[backend process](glossary#GLOSSARY-BACKEND)_ to a [\*\*](glossary#GLOSSARY-CLIENT)_[client](glossary#GLOSSARY-CLIENT)_ upon the completion of an SQL command, usually a `SELECT` but it can be an `INSERT`, `UPDATE`, or `DELETE` command if the `RETURNING` clause is specified.

    The fact that a result set is a relation means that a query can be used in the definition of another query, becoming a _subquery_.

  -

- [#id](#GLOSSARY-REVOKE)Revoke

  A command to prevent access to a named set of [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ objects for a named list of [\*\*](glossary#GLOSSARY-ROLE)_[roles](glossary#GLOSSARY-ROLE)_.

  For more information, see [REVOKE](sql-revoke).

- [#id](#GLOSSARY-ROLE)Role

  A collection of access privileges to the [\*\*](glossary#GLOSSARY-DATABASE)_[instance](glossary#GLOSSARY-DATABASE)_. Roles are themselves a privilege that can be granted to other roles. This is often done for convenience or to ensure completeness when multiple [\*\*](glossary#GLOSSARY-USER)_[users](glossary#GLOSSARY-USER)_ need the same privileges.

  For more information, see [CREATE ROLE](sql-createrole).

- [#id](#GLOSSARY-ROLLBACK)Rollback

  A command to undo all of the operations performed since the beginning of a [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_.

  For more information, see [ROLLBACK](sql-rollback).

- [#id](#GLOSSARY-ROUTINE)Routine

  A defined set of instructions stored in the database system that can be invoked for execution. A routine can be written in a variety of programming languages. Routines can be [\*\*](glossary#GLOSSARY-FUNCTION)_[functions](glossary#GLOSSARY-FUNCTION)_ (including set-returning functions and [\*\*](glossary#GLOSSARY-TRIGGER)_[trigger functions](glossary#GLOSSARY-TRIGGER)_), [\*\*](glossary#GLOSSARY-AGGREGATE)_[aggregate functions](glossary#GLOSSARY-AGGREGATE)_, and [\*\*](glossary#GLOSSARY-PROCEDURE)_[procedures](glossary#GLOSSARY-PROCEDURE)_.

  Many routines are already defined within PostgreSQL itself, but user-defined ones can also be added.

- Row

  See [Tuple](glossary#GLOSSARY-TUPLE).

- [#id](#GLOSSARY-SAVEPOINT)Savepoint

  A special mark in the sequence of steps in a [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_. Data modifications after this point in time may be reverted to the time of the savepoint.

  For more information, see [SAVEPOINT](sql-savepoint).

- [#id](#GLOSSARY-SCHEMA)Schema

  - A schema is a namespace for [\*\*](glossary#GLOSSARY-SQL-OBJECT)_[SQL objects](glossary#GLOSSARY-SQL-OBJECT)_, which all reside in the same [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_. Each SQL object must reside in exactly one schema.

    All system-defined SQL objects reside in schema `pg_catalog`.

  - More generically, the term _schema_ is used to mean all data descriptions ([\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ definitions, [\*\*](glossary#GLOSSARY-CONSTRAINT)_[constraints](glossary#GLOSSARY-CONSTRAINT)_, comments, etc.) for a given [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ or subset thereof.

    For more information, see [Section 5.9](ddl-schemas).

- Segment

  See [File segment](glossary#GLOSSARY-FILE-SEGMENT).

- [#id](#GLOSSARY-SELECT)Select

  The SQL command used to request data from a [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_. Normally, `SELECT` commands are not expected to modify the [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ in any way, but it is possible that [\*\*](glossary#GLOSSARY-FUNCTION)_[functions](glossary#GLOSSARY-FUNCTION)_ invoked within the query could have side effects that do modify data.

  For more information, see [SELECT](sql-select).

- [#id](#GLOSSARY-SEQUENCE)Sequence (relation)

  A type of relation that is used to generate values. Typically the generated values are sequential non-repeating numbers. They are commonly used to generate surrogate [\*\*](glossary#GLOSSARY-PRIMARY-KEY)_[primary key](glossary#GLOSSARY-PRIMARY-KEY)_ values.

- [#id](#GLOSSARY-SERVER)Server

  A computer on which PostgreSQL [\*\*](glossary#GLOSSARY-INSTANCE)_[instances](glossary#GLOSSARY-INSTANCE)_ run. The term _server_ denotes real hardware, a container, or a _virtual machine_.

  This term is sometimes used to refer to an instance or to a host.

- [#id](#GLOSSARY-SESSION)Session

  A state that allows a client and a backend to interact, communicating over a [\*\*](glossary#GLOSSARY-CONNECTION)_[connection](glossary#GLOSSARY-CONNECTION)_.

- [#id](#GLOSSARY-SHARED-MEMORY)Shared memory

  RAM which is used by the processes common to an [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_. It mirrors parts of [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ files, provides a transient area for [\*\*](glossary#GLOSSARY-WAL-RECORD)_[WAL records](glossary#GLOSSARY-WAL-RECORD)_, and stores additional common information. Note that shared memory belongs to the complete instance, not to a single database.

  The largest part of shared memory is known as _shared buffers_ and is used to mirror part of data files, organized into pages. When a page is modified, it is called a dirty page until it is written back to the file system.

  For more information, see [Section 20.4.1](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-MEMORY).

- [#id](#GLOSSARY-SQL-OBJECT)SQL object

  Any object that can be created with a `CREATE` command. Most objects are specific to one database, and are commonly known as _local objects_.

  Most local objects reside in a specific [\*\*](glossary#GLOSSARY-SCHEMA)_[schema](glossary#GLOSSARY-SCHEMA)_ in their containing database, such as [\*\*](glossary#GLOSSARY-RELATION)_[relations](glossary#GLOSSARY-RELATION)_ (all types), [\*\*](glossary#GLOSSARY-FUNCTION)_[routines](glossary#GLOSSARY-FUNCTION)_ (all types), data types, etc. The names of such objects of the same type in the same schema are enforced to be unique.

  There also exist local objects that do not reside in schemas; some examples are [\*\*](glossary#GLOSSARY-EXTENSION)_[extensions](glossary#GLOSSARY-EXTENSION)_, [\*\*](glossary#GLOSSARY-CAST)_[data type casts](glossary#GLOSSARY-CAST)_, and [\*\*](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_[foreign data wrappers](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_. The names of such objects of the same type are enforced to be unique within the database.

  Other object types, such as [\*\*](glossary#GLOSSARY-ROLE)_[roles](glossary#GLOSSARY-ROLE)_, [\*\*](glossary#GLOSSARY-TABLESPACE)_[tablespaces](glossary#GLOSSARY-TABLESPACE)_, replication origins, subscriptions for logical replication, and databases themselves are not local SQL objects since they exist entirely outside of any specific database; they are called _global objects_. The names of such objects are enforced to be unique within the whole database cluster.

  For more information, see [Section 23.1](manage-ag-overview).

- [#id](#GLOSSARY-SQL-STANDARD)SQL standard

  A series of documents that define the SQL language.

- Standby (server)

  See [Replica (server)](glossary#GLOSSARY-REPLICA).

- [#id](#GLOSSARY-STARTUP-PROCESS)Startup process

  An [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ that replays WAL during crash recovery and in a [\*\*](glossary#GLOSSARY-REPLICATION)_[physical replica](glossary#GLOSSARY-REPLICATION)_.

  (The name is historical: the startup process was named before replication was implemented; the name refers to its task as it relates to the server startup following a crash.)

- [#id](#GLOSSARY-SUPERUSER)Superuser

  As used in this documentation, it is a synonym for [\*\*](glossary#GLOSSARY-DATABASE-SUPERUSER)_[database superuser](glossary#GLOSSARY-DATABASE-SUPERUSER)_.

- [#id](#GLOSSARY-SYSTEM-CATALOG)System catalog

  A collection of [\*\*](glossary#GLOSSARY-TABLE)_[tables](glossary#GLOSSARY-TABLE)_ which describe the structure of all [\*\*](glossary#GLOSSARY-SQL-OBJECT)_[SQL objects](glossary#GLOSSARY-SQL-OBJECT)_ of the instance. The system catalog resides in the schema `pg_catalog`. These tables contain data in internal representation and are not typically considered useful for user examination; a number of user-friendlier [\*\*](glossary#GLOSSARY-VIEW)_[views](glossary#GLOSSARY-VIEW)_, also in schema `pg_catalog`, offer more convenient access to some of that information, while additional tables and views exist in schema `information_schema` (see [Chapter 37](information-schema)) that expose some of the same and additional information as mandated by the [\*\*](glossary#GLOSSARY-SQL-STANDARD)_[SQL standard](glossary#GLOSSARY-SQL-STANDARD)_.

  For more information, see [Section 5.9](ddl-schemas).

- [#id](#GLOSSARY-TABLE)Table

  A collection of [\*\*](glossary#GLOSSARY-TUPLE)_[tuples](glossary#GLOSSARY-TUPLE)_ having a common data structure (the same number of [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attributes](glossary#GLOSSARY-ATTRIBUTE)_, in the same order, having the same name and type per position). A table is the most common form of [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ in PostgreSQL.

  For more information, see [CREATE TABLE](sql-createtable).

- [#id](#GLOSSARY-TABLESPACE)Tablespace

  A named location on the server file system. All [\*\*](glossary#GLOSSARY-SQL-OBJECT)_[SQL objects](glossary#GLOSSARY-SQL-OBJECT)_ which require storage beyond their definition in the [\*\*](glossary#GLOSSARY-SYSTEM-CATALOG)_[system catalog](glossary#GLOSSARY-SYSTEM-CATALOG)_ must belong to a single tablespace. Initially, a database cluster contains a single usable tablespace which is used as the default for all SQL objects, called `pg_default`.

  For more information, see [Section 23.6](manage-ag-tablespaces).

- [#id](#GLOSSARY-TEMPORARY-TABLE)Temporary table

  [\*\*](glossary#GLOSSARY-TABLE)_[Tables](glossary#GLOSSARY-TABLE)_ that exist either for the lifetime of a [\*\*](glossary#GLOSSARY-SESSION)_[session](glossary#GLOSSARY-SESSION)_ or a [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_, as specified at the time of creation. The data in them is not visible to other sessions, and is not [\*\*](glossary#GLOSSARY-LOGGED)_[logged](glossary#GLOSSARY-LOGGED)_. Temporary tables are often used to store intermediate data for a multi-step operation.

  For more information, see [CREATE TABLE](sql-createtable).

- [#id](#GLOSSARY-TOAST)TOAST

  A mechanism by which large attributes of table rows are split and stored in a secondary table, called the _TOAST table_. Each relation with large attributes has its own TOAST table.

  For more information, see [Section 73.2](storage-toast).

- [#id](#GLOSSARY-TRANSACTION)Transaction

  A combination of commands that must act as a single [\*\*](glossary#GLOSSARY-ATOMIC)_[atomic](glossary#GLOSSARY-ATOMIC)_ command: they all succeed or all fail as a single unit, and their effects are not visible to other [\*\*](glossary#GLOSSARY-SESSION)_[sessions](glossary#GLOSSARY-SESSION)_ until the transaction is complete, and possibly even later, depending on the isolation level.

  For more information, see [Section 13.2](transaction-iso).

- [#id](#GLOSSARY-XID)Transaction ID

  The numerical, unique, sequentially-assigned identifier that each transaction receives when it first causes a database modification. Frequently abbreviated as _xid_. When stored on disk, xids are only 32-bits wide, so only approximately four billion write transaction IDs can be generated; to permit the system to run for longer than that, _epochs_ are used, also 32 bits wide. When the counter reaches the maximum xid value, it starts over at `3` (values under that are reserved) and the epoch value is incremented by one. In some contexts, the epoch and xid values are considered together as a single 64-bit value; see [Section 74.1](transaction-id) for more details.

  For more information, see [Section 8.19](datatype-oid).

- [#id](#GLOSSARY-TPS)Transactions per second (TPS)

  Average number of transactions that are executed per second, totaled across all sessions active for a measured run. This is used as a measure of the performance characteristics of an instance.

- [#id](#GLOSSARY-TRIGGER)Trigger

  A [\*\*](glossary#GLOSSARY-FUNCTION)_[function](glossary#GLOSSARY-FUNCTION)_ which can be defined to execute whenever a certain operation (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`) is applied to a [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_. A trigger executes within the same [\*\*](glossary#GLOSSARY-TRANSACTION)_[transaction](glossary#GLOSSARY-TRANSACTION)_ as the statement which invoked it, and if the function fails, then the invoking statement also fails.

  For more information, see [CREATE TRIGGER](sql-createtrigger).

- [#id](#GLOSSARY-TUPLE)Tuple

  A collection of [\*\*](glossary#GLOSSARY-ATTRIBUTE)_[attributes](glossary#GLOSSARY-ATTRIBUTE)_ in a fixed order. That order may be defined by the [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_ (or other [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_) where the tuple is contained, in which case the tuple is often called a _row_. It may also be defined by the structure of a result set, in which case it is sometimes called a _record_.

- [#id](#GLOSSARY-UNIQUE-CONSTRAINT)Unique constraint

  A type of [\*\*](glossary#GLOSSARY-CONSTRAINT)_[constraint](glossary#GLOSSARY-CONSTRAINT)_ defined on a [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ which restricts the values allowed in one or a combination of columns so that each value or combination of values can only appear once in the relation — that is, no other row in the relation contains values that are equal to those.

  Because [\*\*](glossary#GLOSSARY-NULL)_[null values](glossary#GLOSSARY-NULL)_ are not considered equal to each other, multiple rows with null values are allowed to exist without violating the unique constraint.

- [#id](#GLOSSARY-UNLOGGED)Unlogged

  The property of certain [\*\*](glossary#GLOSSARY-RELATION)_[relations](glossary#GLOSSARY-RELATION)_ that the changes to them are not reflected in the [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_. This disables replication and crash recovery for these relations.

  The primary use of unlogged tables is for storing transient work data that must be shared across processes.

  [\*\*](glossary#GLOSSARY-TEMPORARY-TABLE)_[Temporary tables](glossary#GLOSSARY-TEMPORARY-TABLE)_ are always unlogged.

- [#id](#GLOSSARY-UPDATE)Update

  An SQL command used to modify [\*\*](glossary#GLOSSARY-TUPLE)_[rows](glossary#GLOSSARY-TUPLE)_ that may already exist in a specified [\*\*](glossary#GLOSSARY-TABLE)_[table](glossary#GLOSSARY-TABLE)_. It cannot create or remove rows.

  For more information, see [UPDATE](sql-update).

- [#id](#GLOSSARY-USER)User

  A [\*\*](glossary#GLOSSARY-ROLE)_[role](glossary#GLOSSARY-ROLE)_ that has the _login privilege_ (see [Section 22.2](role-attributes)).

- [#id](#GLOSSARY-USER-MAPPING)User mapping

  The translation of login credentials in the local [\*\*](glossary#GLOSSARY-DATABASE)_[database](glossary#GLOSSARY-DATABASE)_ to credentials in a remote data system defined by a [\*\*](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_[foreign data wrapper](glossary#GLOSSARY-FOREIGN-DATA-WRAPPER)_.

  For more information, see [CREATE USER MAPPING](sql-createusermapping).

- [#id](#GLOSSARY-VACUUM)Vacuum

  The process of removing outdated [\*\*](glossary#GLOSSARY-TUPLE)_[tuple versions](glossary#GLOSSARY-TUPLE)_ from tables or materialized views, and other closely related processing required by PostgreSQL's implementation of [\*\*](glossary#GLOSSARY-MVCC)_[MVCC](glossary#GLOSSARY-MVCC)_. This can be initiated through the use of the `VACUUM` command, but can also be handled automatically via [\*\*](glossary#GLOSSARY-AUTOVACUUM)_[autovacuum](glossary#GLOSSARY-AUTOVACUUM)_ processes.

  For more information, see [Section 25.1](routine-vacuuming) .

- [#id](#GLOSSARY-VIEW)View

  A [\*\*](glossary#GLOSSARY-RELATION)_[relation](glossary#GLOSSARY-RELATION)_ that is defined by a `SELECT` statement, but has no storage of its own. Any time a query references a view, the definition of the view is substituted into the query as if the user had typed it as a subquery instead of the name of the view.

  For more information, see [CREATE VIEW](sql-createview).

- [#id](#GLOSSARY-VM)Visibility map (fork)

  A storage structure that keeps metadata about each data page of a table's main fork. The visibility map entry for each page stores two bits: the first one (`all-visible`) indicates that all tuples in the page are visible to all transactions. The second one (`all-frozen`) indicates that all tuples in the page are marked frozen.

- WAL

  See [Write-ahead log](glossary#GLOSSARY-WAL).

- [#id](#GLOSSARY-WAL-ARCHIVER)WAL archiver (process)

  An [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ which, if enabled, saves copies of [\*\*](glossary#GLOSSARY-WAL-FILE)_[WAL files](glossary#GLOSSARY-WAL-FILE)_ for the purpose of creating backups or keeping [\*\*](glossary#GLOSSARY-REPLICA)_[replicas](glossary#GLOSSARY-REPLICA)_ current.

  For more information, see [Section 26.3](continuous-archiving).

- [#id](#GLOSSARY-WAL-FILE)WAL file

  Also known as _WAL segment_ or _WAL segment file_. Each of the sequentially-numbered files that provide storage space for [\*\*](glossary#GLOSSARY-WAL)_[WAL](glossary#GLOSSARY-WAL)_. The files are all of the same predefined size and are written in sequential order, interspersing changes as they occur in multiple simultaneous sessions. If the system crashes, the files are read in order, and each of the changes is replayed to restore the system to the state it was in before the crash.

  Each WAL file can be released after a [\*\*](glossary#GLOSSARY-CHECKPOINT)_[checkpoint](glossary#GLOSSARY-CHECKPOINT)_ writes all the changes in it to the corresponding data files. Releasing the file can be done either by deleting it, or by changing its name so that it will be used in the future, which is called _recycling_.

  For more information, see [Section 30.6](wal-internals).

- [#id](#GLOSSARY-WAL-RECORD)WAL record

  A low-level description of an individual data change. It contains sufficient information for the data change to be re-executed (_replayed_) in case a system failure causes the change to be lost. WAL records use a non-printable binary format.

  For more information, see [Section 30.6](wal-internals).

- [#id](#GLOSSARY-WAL-RECEIVER)WAL receiver (process)

  An [\*\*](glossary#GLOSSARY-AUXILIARY-PROC)_[auxiliary process](glossary#GLOSSARY-AUXILIARY-PROC)_ that runs on a [\*\*](glossary#GLOSSARY-REPLICA)_[replica](glossary#GLOSSARY-REPLICA)_ to receive WAL from the [\*\*](glossary#GLOSSARY-PRIMARY-SERVER)_[primary server](glossary#GLOSSARY-PRIMARY-SERVER)_ for replay by the [\*\*](glossary#GLOSSARY-STARTUP-PROCESS)_[startup process](glossary#GLOSSARY-STARTUP-PROCESS)_.

  For more information, see [Section 27.2](warm-standby).

- WAL segment

  See [WAL file](glossary#GLOSSARY-WAL-FILE).

- [#id](#GLOSSARY-WAL-SENDER)WAL sender (process)

  A special [\*\*](glossary#GLOSSARY-BACKEND)_[backend process](glossary#GLOSSARY-BACKEND)_ that streams WAL over a network. The receiving end can be a [\*\*](glossary#GLOSSARY-WAL-RECEIVER)_[WAL receiver](glossary#GLOSSARY-WAL-RECEIVER)_ in a [\*\*](glossary#GLOSSARY-REPLICA)_[replica](glossary#GLOSSARY-REPLICA)_, [pg_receivewal](app-pgreceivewal), or any other client program that speaks the replication protocol.

- [#id](#GLOSSARY-WAL-WRITER)WAL writer (process)

  A process that writes [\*\*](glossary#GLOSSARY-WAL-RECORD)_[WAL records](glossary#GLOSSARY-WAL-RECORD)_ from [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared memory](glossary#GLOSSARY-SHARED-MEMORY)_ to [\*\*](glossary#GLOSSARY-WAL-FILE)_[WAL files](glossary#GLOSSARY-WAL-FILE)_.

  For more information, see [Section 20.5](runtime-config-wal).

- [#id](#GLOSSARY-WINDOW-FUNCTION)Window function (routine)

  A type of [\*\*](glossary#GLOSSARY-FUNCTION)_[function](glossary#GLOSSARY-FUNCTION)_ used in a [\*\*](glossary#GLOSSARY-QUERY)_[query](glossary#GLOSSARY-QUERY)_ that applies to a [\*\*](glossary#GLOSSARY-PARTITION)_[partition](glossary#GLOSSARY-PARTITION)_ of the query's [\*\*](glossary#GLOSSARY-RESULT-SET)_[result set](glossary#GLOSSARY-RESULT-SET)_; the function's result is based on values found in [\*\*](glossary#GLOSSARY-TUPLE)_[rows](glossary#GLOSSARY-TUPLE)_ of the same partition or frame.

  All [\*\*](glossary#GLOSSARY-AGGREGATE)_[aggregate functions](glossary#GLOSSARY-AGGREGATE)_ can be used as window functions, but window functions can also be used to, for example, give ranks to each of the rows in the partition. Also known as _analytic functions_.

  For more information, see [Section 3.5](tutorial-window).

- [#id](#GLOSSARY-WAL)Write-ahead log

  The journal that keeps track of the changes in the [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_ as user- and system-invoked operations take place. It comprises many individual [\*\*](glossary#GLOSSARY-WAL-RECORD)_[WAL records](glossary#GLOSSARY-WAL-RECORD)_ written sequentially to [\*\*](glossary#GLOSSARY-WAL-FILE)_[WAL files](glossary#GLOSSARY-WAL-FILE)_.
