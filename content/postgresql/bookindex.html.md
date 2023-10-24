<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                Index                |                                                     |                                  |                                                       |    |
| :---------------------------------: | :-------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | -: |
| [Prev](biblio.html "Bibliography")  | [Up](index.html "PostgreSQL 17devel Documentation") | PostgreSQL 17devel Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |    |

***

# Index

[Symbols](#indexdiv-Symbols) | [A](#indexdiv-A) | [B](#indexdiv-B) | [C](#indexdiv-C) | [D](#indexdiv-D) | [E](#indexdiv-E) | [F](#indexdiv-F) | [G](#indexdiv-G) | [H](#indexdiv-H) | [I](#indexdiv-I) | [J](#indexdiv-J) | [K](#indexdiv-K) | [L](#indexdiv-L) | [M](#indexdiv-M) | [N](#indexdiv-N) | [O](#indexdiv-O) | [P](#indexdiv-P) | [Q](#indexdiv-Q) | [R](#indexdiv-R) | [S](#indexdiv-S) | [T](#indexdiv-T) | [U](#indexdiv-U) | [V](#indexdiv-V) | [W](#indexdiv-W) | [X](#indexdiv-X) | [Y](#indexdiv-Y) | [Z](#indexdiv-Z)

### Symbols

  * *   $, [Positional Parameters](sql-expressions.html#SQL-EXPRESSIONS-PARAMETERS-POSITIONAL)
* $libdir, [Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
* $libdir/plugins, [Shared Library Preloading](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-PRELOAD), [Description](sql-load.html#SQL-LOAD-DESCRIPTION)
* \*, [Select-List Items](queries-select-lists.html#QUERIES-SELECT-LIST-ITEMS)
* .pgpass, [The Password File](libpq-pgpass.html)
* .pg\_service.conf, [The Connection Service File](libpq-pgservice.html)
* ::, [Type Casts](sql-expressions.html#SQL-SYNTAX-TYPE-CASTS)
* \_PG\_archive\_module\_init, [Initialization Functions](archive-module-init.html)
* \_PG\_init, [Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
* \_PG\_output\_plugin\_init, [Initialization Function](logicaldecoding-output-plugin.html#LOGICALDECODING-OUTPUT-INIT)

### A

  * *   abbrev, [Network Address Functions and Operators](functions-net.html)
* ABORT, [ABORT](sql-abort.html)
* abs, [Mathematical Functions and Operators](functions-math.html)
* ACL, [Privileges](ddl-priv.html)
* aclcontains, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* acldefault, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* aclexplode, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* aclitem, [Privileges](ddl-priv.html)
* aclitemeq, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* acos, [Mathematical Functions and Operators](functions-math.html)
* acosd, [Mathematical Functions and Operators](functions-math.html)
* acosh, [Mathematical Functions and Operators](functions-math.html)
* administration tools

    <!---->

* externally maintained, [Administration Tools](external-admin-tools.html)

  * *   adminpack, [adminpack — pgAdmin support toolpack](adminpack.html)
* advisory lock, [Advisory Locks](explicit-locking.html#ADVISORY-LOCKS)
* age, [Date/Time Functions and Operators](functions-datetime.html)
* aggregate function, [Aggregate Functions](tutorial-agg.html), [Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES), [Aggregate Functions](functions-aggregate.html), [User-Defined Aggregates](xaggr.html)

    <!---->

  * *   built-in, [Aggregate Functions](functions-aggregate.html)
  * invocation, [Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES)
  * moving aggregate, [Moving-Aggregate Mode](xaggr.html#XAGGR-MOVING-AGGREGATES)
  * ordered set, [Ordered-Set Aggregates](xaggr.html#XAGGR-ORDERED-SET-AGGREGATES)
  * partial aggregation, [Partial Aggregation](xaggr.html#XAGGR-PARTIAL-AGGREGATES)
  * polymorphic, [Polymorphic and Variadic Aggregates](xaggr.html#XAGGR-POLYMORPHIC-AGGREGATES)
  * support functions for, [Support Functions for Aggregates](xaggr.html#XAGGR-SUPPORT-FUNCTIONS)
  * user-defined, [User-Defined Aggregates](xaggr.html)
  * variadic, [Polymorphic and Variadic Aggregates](xaggr.html#XAGGR-POLYMORPHIC-AGGREGATES)

* AIX, [AIX](installation-platform-notes.html#INSTALLATION-NOTES-AIX)

  * *   installation on, [AIX](installation-platform-notes.html#INSTALLATION-NOTES-AIX)
  * IPC configuration, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)

      * *   akeys, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * alias, [Table and Column Aliases](queries-table-expressions.html#QUERIES-TABLE-ALIASES), [Column Labels](queries-select-lists.html#QUERIES-COLUMN-LABELS)

    <!---->

      * *   for table name in query, [Joins Between Tables](tutorial-join.html)
    * in the FROM clause, [Table and Column Aliases](queries-table-expressions.html#QUERIES-TABLE-ALIASES)
    * in the select list, [Column Labels](queries-select-lists.html#QUERIES-COLUMN-LABELS)

* ALL, [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS), [DISTINCT](queries-select-lists.html#QUERIES-DISTINCT), [Subquery Expressions](functions-subquery.html), [Row and Array Comparisons](functions-comparisons.html)

  * *   GROUP BY ALL, [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS)
  * SELECT ALL, [DISTINCT](queries-select-lists.html#QUERIES-DISTINCT)

      * *   allow\_in\_place\_tablespaces configuration parameter, [Developer Options](runtime-config-developer.html)
  * allow\_system\_table\_mods configuration parameter, [Developer Options](runtime-config-developer.html)
  * ALTER AGGREGATE, [ALTER AGGREGATE](sql-alteraggregate.html)
  * ALTER COLLATION, [ALTER COLLATION](sql-altercollation.html)
  * ALTER CONVERSION, [ALTER CONVERSION](sql-alterconversion.html)
  * ALTER DATABASE, [ALTER DATABASE](sql-alterdatabase.html)
  * ALTER DEFAULT PRIVILEGES, [ALTER DEFAULT PRIVILEGES](sql-alterdefaultprivileges.html)
  * ALTER DOMAIN, [ALTER DOMAIN](sql-alterdomain.html)
  * ALTER EVENT TRIGGER, [ALTER EVENT TRIGGER](sql-altereventtrigger.html)
  * ALTER EXTENSION, [ALTER EXTENSION](sql-alterextension.html)
  * ALTER FOREIGN DATA WRAPPER, [ALTER FOREIGN DATA WRAPPER](sql-alterforeigndatawrapper.html)
  * ALTER FOREIGN TABLE, [ALTER FOREIGN TABLE](sql-alterforeigntable.html)
  * ALTER FUNCTION, [ALTER FUNCTION](sql-alterfunction.html)
  * ALTER GROUP, [ALTER GROUP](sql-altergroup.html)
  * ALTER INDEX, [ALTER INDEX](sql-alterindex.html)
  * ALTER LANGUAGE, [ALTER LANGUAGE](sql-alterlanguage.html)
  * ALTER LARGE OBJECT, [ALTER LARGE OBJECT](sql-alterlargeobject.html)
  * ALTER MATERIALIZED VIEW, [ALTER MATERIALIZED VIEW](sql-altermaterializedview.html)
  * ALTER OPERATOR, [ALTER OPERATOR](sql-alteroperator.html)
  * ALTER OPERATOR CLASS, [ALTER OPERATOR CLASS](sql-alteropclass.html)
  * ALTER OPERATOR FAMILY, [ALTER OPERATOR FAMILY](sql-alteropfamily.html)
  * ALTER POLICY, [ALTER POLICY](sql-alterpolicy.html)
  * ALTER PROCEDURE, [ALTER PROCEDURE](sql-alterprocedure.html)
  * ALTER PUBLICATION, [ALTER PUBLICATION](sql-alterpublication.html)
  * ALTER ROLE, [Role Attributes](role-attributes.html), [ALTER ROLE](sql-alterrole.html)
  * ALTER ROUTINE, [ALTER ROUTINE](sql-alterroutine.html)
  * ALTER RULE, [ALTER RULE](sql-alterrule.html)
  * ALTER SCHEMA, [ALTER SCHEMA](sql-alterschema.html)
  * ALTER SEQUENCE, [ALTER SEQUENCE](sql-altersequence.html)
  * ALTER SERVER, [ALTER SERVER](sql-alterserver.html)
  * ALTER STATISTICS, [ALTER STATISTICS](sql-alterstatistics.html)
  * ALTER SUBSCRIPTION, [ALTER SUBSCRIPTION](sql-altersubscription.html)
  * ALTER SYSTEM, [ALTER SYSTEM](sql-altersystem.html)
  * ALTER TABLE, [ALTER TABLE](sql-altertable.html)
  * ALTER TABLESPACE, [ALTER TABLESPACE](sql-altertablespace.html)
  * ALTER TEXT SEARCH CONFIGURATION, [ALTER TEXT SEARCH CONFIGURATION](sql-altertsconfig.html)
  * ALTER TEXT SEARCH DICTIONARY, [ALTER TEXT SEARCH DICTIONARY](sql-altertsdictionary.html)
  * ALTER TEXT SEARCH PARSER, [ALTER TEXT SEARCH PARSER](sql-altertsparser.html)
  * ALTER TEXT SEARCH TEMPLATE, [ALTER TEXT SEARCH TEMPLATE](sql-altertstemplate.html)
  * ALTER TRIGGER, [ALTER TRIGGER](sql-altertrigger.html)
  * ALTER TYPE, [ALTER TYPE](sql-altertype.html)
  * ALTER USER, [ALTER USER](sql-alteruser.html)
  * ALTER USER MAPPING, [ALTER USER MAPPING](sql-alterusermapping.html)
  * ALTER VIEW, [ALTER VIEW](sql-alterview.html)
  * amcheck, [amcheck — tools to verify table and index consistency](amcheck.html)
  * ANALYZE, [Updating Planner Statistics](routine-vacuuming.html#VACUUM-FOR-STATISTICS), [ANALYZE](sql-analyze.html)
  * AND (operator), [Logical Operators](functions-logical.html)
  * anonymous code blocks, [DO](sql-do.html)
  * any, [Pseudo-Types](datatype-pseudo.html)
  * ANY, [Aggregate Functions](functions-aggregate.html), [Subquery Expressions](functions-subquery.html), [Row and Array Comparisons](functions-comparisons.html)
  * anyarray, [Pseudo-Types](datatype-pseudo.html)
  * anycompatible, [Pseudo-Types](datatype-pseudo.html)
  * anycompatiblearray, [Pseudo-Types](datatype-pseudo.html)
  * anycompatiblemultirange, [Pseudo-Types](datatype-pseudo.html)
  * anycompatiblenonarray, [Pseudo-Types](datatype-pseudo.html)
  * anycompatiblerange, [Pseudo-Types](datatype-pseudo.html)
  * anyelement, [Pseudo-Types](datatype-pseudo.html)
  * anyenum, [Pseudo-Types](datatype-pseudo.html)
  * anymultirange, [Pseudo-Types](datatype-pseudo.html)
  * anynonarray, [Pseudo-Types](datatype-pseudo.html)
  * anyrange, [Pseudo-Types](datatype-pseudo.html)
  * any\_value, [Aggregate Functions](functions-aggregate.html)
  * applicable role, [applicable\_roles](infoschema-applicable-roles.html)
  * application\_name configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * arbitrary precision numbers, [Arbitrary Precision Numbers](datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL)
  * Archive Modules, [Archive Modules](archive-modules.html)
  * archive\_cleanup\_command configuration parameter, [Archive Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY)
  * archive\_command configuration parameter, [Archiving](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVING)
  * archive\_library configuration parameter, [Archiving](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVING)
  * archive\_mode configuration parameter, [Archiving](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVING)
  * archive\_timeout configuration parameter, [Archiving](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVING)
  * area, [Geometric Functions and Operators](functions-geometry.html)
  * armor, [armor(), dearmor()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-ARMOR)
  * array, [Arrays](arrays.html)

    <!---->

      * *   accessing, [Accessing Arrays](arrays.html#ARRAYS-ACCESSING)
    * constant, [Array Value Input](arrays.html#ARRAYS-INPUT)
    * constructor, [Array Constructors](sql-expressions.html#SQL-SYNTAX-ARRAY-CONSTRUCTORS)
    * declaration, [Declaration of Array Types](arrays.html#ARRAYS-DECLARATION)
    * I/O, [Array Input and Output Syntax](arrays.html#ARRAYS-IO)
    * modifying, [Modifying Arrays](arrays.html#ARRAYS-MODIFYING)
    * of user-defined type, [User-Defined Types](xtypes.html)
    * searching, [Searching in Arrays](arrays.html#ARRAYS-SEARCHING)

* ARRAY, [Array Constructors](sql-expressions.html#SQL-SYNTAX-ARRAY-CONSTRUCTORS), [UNION, CASE, and Related Constructs](typeconv-union-case.html)

  * determination of result type, [UNION, CASE, and Related Constructs](typeconv-union-case.html)

      * *   array\_agg, [Aggregate Functions](functions-aggregate.html), [Functions](intagg.html#INTAGG-FUNCTIONS)
  * array\_append, [Array Functions and Operators](functions-array.html)
  * array\_cat, [Array Functions and Operators](functions-array.html)
  * array\_dims, [Array Functions and Operators](functions-array.html)
  * array\_fill, [Array Functions and Operators](functions-array.html)
  * array\_length, [Array Functions and Operators](functions-array.html)
  * array\_lower, [Array Functions and Operators](functions-array.html)
  * array\_ndims, [Array Functions and Operators](functions-array.html)
  * array\_nulls configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
  * array\_position, [Array Functions and Operators](functions-array.html)
  * array\_positions, [Array Functions and Operators](functions-array.html)
  * array\_prepend, [Array Functions and Operators](functions-array.html)
  * array\_remove, [Array Functions and Operators](functions-array.html)
  * array\_replace, [Array Functions and Operators](functions-array.html)
  * array\_sample, [Array Functions and Operators](functions-array.html)
  * array\_shuffle, [Array Functions and Operators](functions-array.html)
  * array\_to\_json, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
  * array\_to\_string, [Array Functions and Operators](functions-array.html)
  * array\_to\_tsvector, [Text Search Functions and Operators](functions-textsearch.html)
  * array\_upper, [Array Functions and Operators](functions-array.html)
  * ascii, [String Functions and Operators](functions-string.html)
  * asin, [Mathematical Functions and Operators](functions-math.html)
  * asind, [Mathematical Functions and Operators](functions-math.html)
  * asinh, [Mathematical Functions and Operators](functions-math.html)
  * ASSERT

    <!---->

  * in PL/pgSQL, [Checking Assertions](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-ASSERT)

* assertions

  * in PL/pgSQL, [Checking Assertions](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-ASSERT)

      * *   asynchronous commit, [Asynchronous Commit](wal-async-commit.html)
  * AT LOCAL, [AT TIME ZONE and AT LOCAL](functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT)
  * AT TIME ZONE, [AT TIME ZONE and AT LOCAL](functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT)
  * atan, [Mathematical Functions and Operators](functions-math.html)
  * atan2, [Mathematical Functions and Operators](functions-math.html)
  * atan2d, [Mathematical Functions and Operators](functions-math.html)
  * atand, [Mathematical Functions and Operators](functions-math.html)
  * atanh, [Mathematical Functions and Operators](functions-math.html)
  * authentication\_timeout configuration parameter, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
  * auth\_delay, [auth\_delay — pause on authentication failure](auth-delay.html)
  * auth\_delay.milliseconds configuration parameter, [Configuration Parameters](auth-delay.html#AUTH-DELAY-CONFIGURATION-PARAMETERS)
  * auto-increment (see [serial](#ientry-idp105553307046783))
  * autocommit

    <!---->

      * *   bulk-loading data, [Disable Autocommit](populate.html#DISABLE-AUTOCOMMIT)
    * psql, [Variables](app-psql.html#APP-PSQL-VARIABLES)

      * *   autosummarize storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS)
  * autovacuum

    <!---->

      * *   configuration parameters, [Automatic Vacuuming](runtime-config-autovacuum.html)
    * general information, [The Autovacuum Daemon](routine-vacuuming.html#AUTOVACUUM)

      * *   autovacuum configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * autovacuum\_analyze\_scale\_factor

    <!---->

      * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
    * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

* autovacuum\_analyze\_threshold

  * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

      * *   autovacuum\_enabled storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * autovacuum\_freeze\_max\_age

    <!---->

      * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
    * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

      * *   autovacuum\_freeze\_min\_age storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * autovacuum\_freeze\_table\_age storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * autovacuum\_max\_workers configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * autovacuum\_multixact\_freeze\_max\_age

    <!---->

      * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
    * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

      * *   autovacuum\_multixact\_freeze\_min\_age storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * autovacuum\_multixact\_freeze\_table\_age storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * autovacuum\_naptime configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * autovacuum\_vacuum\_cost\_delay

    <!---->

      * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
    * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

* autovacuum\_vacuum\_cost\_limit

  * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

* autovacuum\_vacuum\_insert\_scale\_factor

  * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

* autovacuum\_vacuum\_insert\_threshold

  * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

* autovacuum\_vacuum\_scale\_factor

  * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

* autovacuum\_vacuum\_threshold

  * *   configuration parameter, [Automatic Vacuuming](runtime-config-autovacuum.html)
  * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

      * *   autovacuum\_work\_mem configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * auto\_explain, [auto\_explain — log execution plans of slow queries](auto-explain.html)
  * auto\_explain.log\_analyze configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_buffers configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_format configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_level configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_min\_duration configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_nested\_statements configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_parameter\_max\_length configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_settings configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_timing configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_triggers configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_verbose configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.log\_wal configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * auto\_explain.sample\_rate configuration parameter, [Configuration Parameters](auto-explain.html#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
  * avals, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * average, [Aggregate Functions](functions-aggregate.html)
  * avg, [Aggregate Functions](functions-aggregate.html)

### B

  * *   B-Tree (see [index](#ientry-idp105553510265215))
* backend\_flush\_after configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* Background workers, [Background Worker Processes](bgworker.html)
* backslash escapes, [String Constants with C-Style Escapes](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-ESCAPE)
* backslash\_quote configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
* backtrace\_functions configuration parameter, [Developer Options](runtime-config-developer.html)
* backup, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP), [Backup and Restore](backup.html)
* Backup Manifest, [Backup Manifest Format](backup-manifest-format.html)
* base type, [The PostgreSQL Type System](extend-type-system.html)
* base64 format, [Binary String Functions and Operators](functions-binarystring.html)
* basebackup\_to\_shell, [basebackup\_to\_shell — example "shell" pg\_basebackup module](basebackup-to-shell.html)
* basebackup\_to\_shell.command configuration parameter, [Configuration Parameters](basebackup-to-shell.html#BASEBACKUP-TO-SHELL-CONFIGURATION-PARAMETERS)
* basebackup\_to\_shell.required\_role configuration parameter, [Configuration Parameters](basebackup-to-shell.html#BASEBACKUP-TO-SHELL-CONFIGURATION-PARAMETERS)
* BASE\_BACKUP, [Streaming Replication Protocol](protocol-replication.html)
* basic\_archive, [basic\_archive — an example WAL archive module](basic-archive.html)
* basic\_archive.archive\_directory configuration parameter, [Configuration Parameters](basic-archive.html#BASIC-ARCHIVE-CONFIGURATION-PARAMETERS)
* batch mode, [Pipeline Mode](libpq-pipeline-mode.html)

    <!---->

* in libpq, [Pipeline Mode](libpq-pipeline-mode.html)

  * *   BEGIN, [BEGIN](sql-begin.html)
* BETWEEN, [Comparison Functions and Operators](functions-comparison.html)
* BETWEEN SYMMETRIC, [Comparison Functions and Operators](functions-comparison.html)
* BGWORKER\_BACKEND\_​DATABASE\_CONNECTION, [Background Worker Processes](bgworker.html)
* BGWORKER\_SHMEM\_ACCESS, [Background Worker Processes](bgworker.html)
* bgwriter\_delay configuration parameter, [Background Writer](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)
* bgwriter\_flush\_after configuration parameter, [Background Writer](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)
* bgwriter\_lru\_maxpages configuration parameter, [Background Writer](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)
* bgwriter\_lru\_multiplier configuration parameter, [Background Writer](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)
* bigint, [Numeric Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS-NUMERIC), [Integer Types](datatype-numeric.html#DATATYPE-INT)
* bigserial, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)
* binary data, [Binary Data Types](datatype-binary.html), [Binary String Functions and Operators](functions-binarystring.html)

    <!---->

* functions, [Binary String Functions and Operators](functions-binarystring.html)

* binary string

  * *   concatenation, [Binary String Functions and Operators](functions-binarystring.html)
  * converting to character string, [Binary String Functions and Operators](functions-binarystring.html)
  * length, [Binary String Functions and Operators](functions-binarystring.html)

      * *   bison, [Requirements](install-requirements.html)
  * bit string, [Bit-String Constants](sql-syntax-lexical.html#SQL-SYNTAX-BIT-STRINGS), [Bit String Types](datatype-bit.html)

    <!---->

      * *   constant, [Bit-String Constants](sql-syntax-lexical.html#SQL-SYNTAX-BIT-STRINGS)
    * data type, [Bit String Types](datatype-bit.html)
    * length, [Bit String Functions and Operators](functions-bitstring.html)

* bit strings, [Bit String Functions and Operators](functions-bitstring.html)

  * functions, [Bit String Functions and Operators](functions-bitstring.html)

      * *   bitmap scan, [Combining Multiple Indexes](indexes-bitmap-scans.html), [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * bit\_and, [Aggregate Functions](functions-aggregate.html)
  * bit\_count, [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
  * bit\_length, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
  * bit\_or, [Aggregate Functions](functions-aggregate.html)
  * bit\_xor, [Aggregate Functions](functions-aggregate.html)
  * BLOB (see [large object](#ientry-idp105553710311423))
  * block\_size configuration parameter, [Preset Options](runtime-config-preset.html)
  * bloom, [bloom — bloom filter index access method](bloom.html)
  * bonjour configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
  * bonjour\_name configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
  * Boolean, [Boolean Type](datatype-boolean.html)

    <!---->

      * *   data type, [Boolean Type](datatype-boolean.html)
    * operators (see operators, logical)

      * *   bool\_and, [Aggregate Functions](functions-aggregate.html)
  * bool\_or, [Aggregate Functions](functions-aggregate.html)
  * booting

    <!---->

  * starting the server during, [Starting the Database Server](server-start.html)

      * *   bound\_box, [Geometric Functions and Operators](functions-geometry.html)
  * box, [Geometric Functions and Operators](functions-geometry.html)
  * box (data type), [Boxes](datatype-geometric.html#DATATYPE-GEOMETRIC-BOXES)
  * bpchar, [Character Types](datatype-character.html)
  * BRIN (see [index](#ientry-idp105553510265215))
  * brin\_desummarize\_range, [Index Maintenance Functions](functions-admin.html#FUNCTIONS-ADMIN-INDEX)
  * brin\_metapage\_info, [BRIN Functions](pageinspect.html#PAGEINSPECT-BRIN-FUNCS)
  * brin\_page\_items, [BRIN Functions](pageinspect.html#PAGEINSPECT-BRIN-FUNCS)
  * brin\_page\_type, [BRIN Functions](pageinspect.html#PAGEINSPECT-BRIN-FUNCS)
  * brin\_revmap\_data, [BRIN Functions](pageinspect.html#PAGEINSPECT-BRIN-FUNCS)
  * brin\_summarize\_new\_values, [Index Maintenance Functions](functions-admin.html#FUNCTIONS-ADMIN-INDEX)
  * brin\_summarize\_range, [Index Maintenance Functions](functions-admin.html#FUNCTIONS-ADMIN-INDEX)
  * broadcast, [Network Address Functions and Operators](functions-net.html)
  * BSD Authentication, [BSD Authentication](auth-bsd.html)
  * btree\_gin, [btree\_gin — GIN operator classes with B-tree behavior](btree-gin.html)
  * btree\_gist, [btree\_gist — GiST operator classes with B-tree behavior](btree-gist.html)
  * btrim, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html)
  * bt\_index\_check, [Functions](amcheck.html#AMCHECK-FUNCTIONS)
  * bt\_index\_parent\_check, [Functions](amcheck.html#AMCHECK-FUNCTIONS)
  * bt\_metap, [B-Tree Functions](pageinspect.html#PAGEINSPECT-B-TREE-FUNCS)
  * bt\_multi\_page\_stats, [B-Tree Functions](pageinspect.html#PAGEINSPECT-B-TREE-FUNCS)
  * bt\_page\_items, [B-Tree Functions](pageinspect.html#PAGEINSPECT-B-TREE-FUNCS)
  * bt\_page\_stats, [B-Tree Functions](pageinspect.html#PAGEINSPECT-B-TREE-FUNCS)
  * buffering storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS)
  * bytea, [Binary Data Types](datatype-binary.html)
  * bytea\_output configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

### C

  * *   C, [libpq — C Library](libpq.html), [ECPG — Embedded SQL in C](ecpg.html)
* C++, [Using C++ for Extensibility](xfunc-c.html#EXTEND-CPP)
* CALL, [CALL](sql-call.html)
* canceling, [Canceling Queries in Progress](libpq-cancel.html)

    <!---->

* SQL command, [Canceling Queries in Progress](libpq-cancel.html)

  * *   cardinality, [Array Functions and Operators](functions-array.html)
* CASCADE, [Dependency Tracking](ddl-depend.html)

    <!---->

  * *   with DROP, [Dependency Tracking](ddl-depend.html)
  * foreign key action, [Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)

      * *   Cascading Replication, [High Availability, Load Balancing, and Replication](high-availability.html)
* CASE, [Conditional Expressions](functions-conditional.html), [UNION, CASE, and Related Constructs](typeconv-union-case.html)

    <!---->

* determination of result type, [UNION, CASE, and Related Constructs](typeconv-union-case.html)

* case sensitivity

  * of SQL commands, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

* cast, [CREATE CAST](sql-createcast.html)

  * I/O conversion, [CREATE CAST](sql-createcast.html)

      * *   cbrt, [Mathematical Functions and Operators](functions-math.html)
  * ceil, [Mathematical Functions and Operators](functions-math.html)
  * ceiling, [Mathematical Functions and Operators](functions-math.html)
  * center, [Geometric Functions and Operators](functions-geometry.html)
  * Certificate, [Certificate Authentication](auth-cert.html)
  * chained transactions, [Transaction Management](plpgsql-transactions.html#PLPGSQL-TRANSACTION-CHAIN), [Parameters](sql-commit.html#SQL-COMMIT-CHAIN), [Parameters](sql-rollback.html#SQL-ROLLBACK-CHAIN)

    <!---->

  * in PL/pgSQL, [Transaction Management](plpgsql-transactions.html#PLPGSQL-TRANSACTION-CHAIN)

      * *   char, [Character Types](datatype-character.html)
  * character, [Character Types](datatype-character.html)
  * character set, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT), [Preset Options](runtime-config-preset.html), [Character Set Support](multibyte.html)
  * character string, [String Constants](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS), [Character Types](datatype-character.html)

    <!---->

      * *   concatenation, [String Functions and Operators](functions-string.html)
    * constant, [String Constants](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS)
    * converting to binary string, [Binary String Functions and Operators](functions-binarystring.html)
    * data types, [Character Types](datatype-character.html)
    * length, [String Functions and Operators](functions-string.html)
    * prefix test, [String Functions and Operators](functions-string.html)

      * *   character varying, [Character Types](datatype-character.html)
  * character\_length, [String Functions and Operators](functions-string.html)
  * char\_length, [String Functions and Operators](functions-string.html)
  * check constraint, [Check Constraints](ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS)
  * CHECK OPTION, [CREATE VIEW](sql-createview.html)
  * checkpoint, [WAL Configuration](wal-configuration.html)
  * CHECKPOINT, [CHECKPOINT](sql-checkpoint.html)
  * checkpoint\_completion\_target configuration parameter, [Checkpoints](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS)
  * checkpoint\_flush\_after configuration parameter, [Checkpoints](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS)
  * checkpoint\_timeout configuration parameter, [Checkpoints](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS)
  * checkpoint\_warning configuration parameter, [Checkpoints](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS)
  * checksums, [Data Checksums](checksums.html)
  * check\_function\_bodies configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * chr, [String Functions and Operators](functions-string.html)
  * cid, [Object Identifier Types](datatype-oid.html)
  * cidr, [cidr](datatype-net-types.html#DATATYPE-CIDR)
  * circle, [Circles](datatype-geometric.html#DATATYPE-CIRCLE), [Geometric Functions and Operators](functions-geometry.html)
  * citext, [citext — a case-insensitive character string type](citext.html)
  * client authentication, [Client Authentication](client-authentication.html)

    <!---->

  * timeout during, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)

      * *   client\_connection\_check\_interval configuration parameter, [TCP Settings](runtime-config-connection.html#RUNTIME-CONFIG-TCP-SETTINGS)
  * client\_encoding configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * client\_min\_messages configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * clock\_timestamp, [Date/Time Functions and Operators](functions-datetime.html)
  * CLOSE, [CLOSE](sql-close.html)
  * cluster

    <!---->

  * of databases (see [database cluster](#ientry-idp105553308565119))

      * *   CLUSTER, [CLUSTER](sql-cluster.html)
  * clusterdb, [clusterdb](app-clusterdb.html)
  * clustering, [High Availability, Load Balancing, and Replication](high-availability.html)
  * cluster\_name configuration parameter, [Process Title](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-PROC-TITLE)
  * cmax, [System Columns](ddl-system-columns.html)
  * cmin, [System Columns](ddl-system-columns.html)
  * COALESCE, [COALESCE](functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL)
  * COLLATE, [Collation Expressions](sql-expressions.html#SQL-SYNTAX-COLLATE-EXPRS)
  * collation, [Collation Support](collation.html)

    <!---->

      * *   in PL/pgSQL, [Collation of PL/pgSQL Variables](plpgsql-declarations.html#PLPGSQL-DECLARATION-COLLATION)
    * in SQL functions, [SQL Functions with Collations](xfunc-sql.html#XFUNC-SQL-COLLATIONS)

      * *   COLLATION FOR, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * color, [Color Support](color.html)
  * column, [Concepts](tutorial-concepts.html), [Table Basics](ddl-basics.html)

    <!---->

      * *   adding, [Adding a Column](ddl-alter.html#DDL-ALTER-ADDING-A-COLUMN)
    * removing, [Removing a Column](ddl-alter.html#DDL-ALTER-REMOVING-A-COLUMN)
    * renaming, [Renaming a Column](ddl-alter.html#DDL-ALTER-RENAMING-COLUMN)
    * system column, [System Columns](ddl-system-columns.html)

* column data type

  * changing, [Changing a Column's Data Type](ddl-alter.html#DDL-ALTER-COLUMN-TYPE)

      * *   column reference, [Column References](sql-expressions.html#SQL-EXPRESSIONS-COLUMN-REFS)
  * col\_description, [Comment Information Functions](functions-info.html#FUNCTIONS-INFO-COMMENT)
  * comment, [Comments](sql-syntax-lexical.html#SQL-SYNTAX-COMMENTS)

    <!---->

      * *   about database objects, [Comment Information Functions](functions-info.html#FUNCTIONS-INFO-COMMENT)
    * in SQL, [Comments](sql-syntax-lexical.html#SQL-SYNTAX-COMMENTS)

      * *   COMMENT, [COMMENT](sql-comment.html)
  * COMMIT, [COMMIT](sql-commit.html)
  * COMMIT PREPARED, [COMMIT PREPARED](sql-commit-prepared.html)
  * commit\_delay configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
  * commit\_siblings configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
  * common table expression (see [WITH](#ientry-idp105553306362495))
  * comparison, [Comparison Functions and Operators](functions-comparison.html), [Subquery Expressions](functions-subquery.html)

    <!---->

      * *   composite type, [Row and Array Comparisons](functions-comparisons.html)
    * operators, [Comparison Functions and Operators](functions-comparison.html)
    * row constructor, [Row and Array Comparisons](functions-comparisons.html)
    * subquery result row, [Subquery Expressions](functions-subquery.html)

* compiling, [Building libpq Programs](libpq-build.html)

  * libpq applications, [Building libpq Programs](libpq-build.html)

* composite type, [Composite Types](rowtypes.html), [The PostgreSQL Type System](extend-type-system.html)

  * *   comparison, [Row and Array Comparisons](functions-comparisons.html)
  * constant, [Constructing Composite Values](rowtypes.html#ROWTYPES-CONSTRUCTING)
  * constructor, [Row Constructors](sql-expressions.html#SQL-SYNTAX-ROW-CONSTRUCTORS)

      * *   computed field, [Using Composite Types in Queries](rowtypes.html#ROWTYPES-USAGE)
  * compute\_query\_id configuration parameter, [Statistics Monitoring](runtime-config-statistics.html#RUNTIME-CONFIG-STATISTICS-MONITOR)
  * concat, [String Functions and Operators](functions-string.html)
  * concat\_ws, [String Functions and Operators](functions-string.html)
  * concurrency, [Concurrency Control](mvcc.html)
  * conditional expression, [Conditional Expressions](functions-conditional.html)
  * configuration

    <!---->

  * of recovery

      * *   general settings, [Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY)
    * of a standby server, [Archive Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY)

      * *   of the server, [Server Configuration](runtime-config.html)
    * of the server

        <!---->

    * functions, [Configuration Settings Functions](functions-admin.html#FUNCTIONS-ADMIN-SET)

      * *   configure, [Installation Procedure](install-make.html#CONFIGURE)
  * configure environment variables, [configure Environment Variables](install-make.html#CONFIGURE-ENVVARS)
  * configure options, [configure Options](install-make.html#CONFIGURE-OPTIONS)
  * config\_file configuration parameter, [File Locations](runtime-config-file-locations.html)
  * conjunction, [Logical Operators](functions-logical.html)
  * connectby, [Functions Provided](tablefunc.html#TABLEFUNC-FUNCTIONS-SECT), [connectby](tablefunc.html#TABLEFUNC-FUNCTIONS-CONNECTBY)
  * connection service file, [The Connection Service File](libpq-pgservice.html)
  * conninfo, [Connection Strings](libpq-connect.html#LIBPQ-CONNSTRING)
  * constant, [Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS)
  * constraint, [Constraints](ddl-constraints.html)

    <!---->

      * *   adding, [Adding a Constraint](ddl-alter.html#DDL-ALTER-ADDING-A-CONSTRAINT)
    * check, [Check Constraints](ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS)
    * exclusion, [Exclusion Constraints](ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION)
    * foreign key, [Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)
    * name, [Check Constraints](ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS)
    * NOT NULL, [Not-Null Constraints](ddl-constraints.html#DDL-CONSTRAINTS-NOT-NULL)
    * primary key, [Primary Keys](ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)
    * removing, [Removing a Constraint](ddl-alter.html#DDL-ALTER-REMOVING-A-CONSTRAINT)
    * unique, [Unique Constraints](ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)

      * *   constraint exclusion, [Partitioning and Constraint Exclusion](ddl-partitioning.html#DDL-PARTITIONING-CONSTRAINT-EXCLUSION), [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
  * constraint\_exclusion configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
  * container type, [The PostgreSQL Type System](extend-type-system.html)
  * CONTINUE

    <!---->

  * in PL/pgSQL, [CONTINUE](plpgsql-control-structures.html#PLPGSQL-CONTROL-STRUCTURES-LOOPS-CONTINUE)

* continuous archiving, [Backup and Restore](backup.html)

  * in standby, [Continuous Archiving in Standby](warm-standby.html#CONTINUOUS-ARCHIVING-IN-STANDBY)

      * *   control file, [Extension Files](extend-extensions.html#EXTEND-EXTENSIONS-FILES)
  * convert, [Binary String Functions and Operators](functions-binarystring.html)
  * convert\_from, [Binary String Functions and Operators](functions-binarystring.html)
  * convert\_to, [Binary String Functions and Operators](functions-binarystring.html)
  * COPY, [Populating a Table With Rows](tutorial-populate.html), [Functions Associated with the COPY Command](libpq-copy.html), [COPY](sql-copy.html)

    <!---->

  * with libpq, [Functions Associated with the COPY Command](libpq-copy.html)

      * *   corr, [Aggregate Functions](functions-aggregate.html)
  * correlation, [Aggregate Functions](functions-aggregate.html)

    <!---->

  * in the query planner, [Extended Statistics](planner-stats.html#PLANNER-STATS-EXTENDED)

      * *   cos, [Mathematical Functions and Operators](functions-math.html)
  * cosd, [Mathematical Functions and Operators](functions-math.html)
  * cosh, [Mathematical Functions and Operators](functions-math.html)
  * cot, [Mathematical Functions and Operators](functions-math.html)
  * cotd, [Mathematical Functions and Operators](functions-math.html)
  * count, [Aggregate Functions](functions-aggregate.html)
  * covariance

    <!---->

      * *   population, [Aggregate Functions](functions-aggregate.html)
    * sample, [Aggregate Functions](functions-aggregate.html)

      * *   covar\_pop, [Aggregate Functions](functions-aggregate.html)
  * covar\_samp, [Aggregate Functions](functions-aggregate.html)
  * covering index, [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html)
  * cpu\_index\_tuple\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
  * cpu\_operator\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
  * cpu\_tuple\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
  * CREATE ACCESS METHOD, [CREATE ACCESS METHOD](sql-create-access-method.html)
  * CREATE AGGREGATE, [CREATE AGGREGATE](sql-createaggregate.html)
  * CREATE CAST, [CREATE CAST](sql-createcast.html)
  * CREATE COLLATION, [CREATE COLLATION](sql-createcollation.html)
  * CREATE CONVERSION, [CREATE CONVERSION](sql-createconversion.html)
  * CREATE DATABASE, [Creating a Database](manage-ag-createdb.html), [CREATE DATABASE](sql-createdatabase.html)
  * CREATE DOMAIN, [CREATE DOMAIN](sql-createdomain.html)
  * CREATE EVENT TRIGGER, [CREATE EVENT TRIGGER](sql-createeventtrigger.html)
  * CREATE EXTENSION, [CREATE EXTENSION](sql-createextension.html)
  * CREATE FOREIGN DATA WRAPPER, [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper.html)
  * CREATE FOREIGN TABLE, [CREATE FOREIGN TABLE](sql-createforeigntable.html)
  * CREATE FUNCTION, [CREATE FUNCTION](sql-createfunction.html)
  * CREATE GROUP, [CREATE GROUP](sql-creategroup.html)
  * CREATE INDEX, [CREATE INDEX](sql-createindex.html)
  * CREATE LANGUAGE, [CREATE LANGUAGE](sql-createlanguage.html)
  * CREATE MATERIALIZED VIEW, [CREATE MATERIALIZED VIEW](sql-creatematerializedview.html)
  * CREATE OPERATOR, [CREATE OPERATOR](sql-createoperator.html)
  * CREATE OPERATOR CLASS, [CREATE OPERATOR CLASS](sql-createopclass.html)
  * CREATE OPERATOR FAMILY, [CREATE OPERATOR FAMILY](sql-createopfamily.html)
  * CREATE POLICY, [CREATE POLICY](sql-createpolicy.html)
  * CREATE PROCEDURE, [CREATE PROCEDURE](sql-createprocedure.html)
  * CREATE PUBLICATION, [CREATE PUBLICATION](sql-createpublication.html)
  * CREATE ROLE, [Database Roles](database-roles.html), [CREATE ROLE](sql-createrole.html)
  * CREATE RULE, [CREATE RULE](sql-createrule.html)
  * CREATE SCHEMA, [CREATE SCHEMA](sql-createschema.html)
  * CREATE SEQUENCE, [CREATE SEQUENCE](sql-createsequence.html)
  * CREATE SERVER, [CREATE SERVER](sql-createserver.html)
  * CREATE STATISTICS, [CREATE STATISTICS](sql-createstatistics.html)
  * CREATE SUBSCRIPTION, [CREATE SUBSCRIPTION](sql-createsubscription.html)
  * CREATE TABLE, [Creating a New Table](tutorial-table.html), [CREATE TABLE](sql-createtable.html)
  * CREATE TABLE AS, [CREATE TABLE AS](sql-createtableas.html)
  * CREATE TABLESPACE, [Tablespaces](manage-ag-tablespaces.html), [CREATE TABLESPACE](sql-createtablespace.html)
  * CREATE TEXT SEARCH CONFIGURATION, [CREATE TEXT SEARCH CONFIGURATION](sql-createtsconfig.html)
  * CREATE TEXT SEARCH DICTIONARY, [CREATE TEXT SEARCH DICTIONARY](sql-createtsdictionary.html)
  * CREATE TEXT SEARCH PARSER, [CREATE TEXT SEARCH PARSER](sql-createtsparser.html)
  * CREATE TEXT SEARCH TEMPLATE, [CREATE TEXT SEARCH TEMPLATE](sql-createtstemplate.html)
  * CREATE TRANSFORM, [CREATE TRANSFORM](sql-createtransform.html)
  * CREATE TRIGGER, [CREATE TRIGGER](sql-createtrigger.html)
  * CREATE TYPE, [CREATE TYPE](sql-createtype.html)
  * CREATE USER, [CREATE USER](sql-createuser.html)
  * CREATE USER MAPPING, [CREATE USER MAPPING](sql-createusermapping.html)
  * CREATE VIEW, [CREATE VIEW](sql-createview.html)
  * createdb, [Creating a Database](tutorial-createdb.html), [Creating a Database](manage-ag-createdb.html), [createdb](app-createdb.html)
  * createrole\_self\_grant

    <!---->

  * configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

* createrole\_self\_grant configuration parameter

  * use in securing functions, [Writing SECURITY DEFINER Functions Safely](sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)

      * *   createuser, [Database Roles](database-roles.html), [createuser](app-createuser.html)
  * CREATE\_REPLICATION\_SLOT, [Streaming Replication Protocol](protocol-replication.html)
  * cross compilation, [Build Process Details](install-make.html#CONFIGURE-OPTIONS-BUILD-PROCESS), [Build Process Details](install-meson.html#MESON-OPTIONS-BUILD-PROCESS)
  * cross join, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * crosstab, [crosstab(text)](tablefunc.html#TABLEFUNC-FUNCTIONS-CROSSTAB-TEXT), [crosstabN(text)](tablefunc.html#TABLEFUNC-FUNCTIONS-CROSSTAB-N-TEXT), [crosstab(text, text)](tablefunc.html#TABLEFUNC-FUNCTIONS-CROSSTAB-TEXT-2)
  * crypt, [crypt()](pgcrypto.html#PGCRYPTO-PASSWORD-HASHING-FUNCS-CRYPT)
  * cstring, [Pseudo-Types](datatype-pseudo.html)
  * CSV (Comma-Separated Values) format

    <!---->

  * in psql, [Meta-Commands](app-psql.html#APP-PSQL-META-COMMANDS)

      * *   ctid, [System Columns](ddl-system-columns.html)
  * CTID, [View Rules in Non-SELECT Statements](rules-views.html#RULES-VIEWS-NON-SELECT)
  * CUBE, [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS)
  * cube (extension), [cube — a multi-dimensional cube data type](cube.html)
  * cume\_dist, [Window Functions](functions-window.html)

    <!---->

  * hypothetical, [Aggregate Functions](functions-aggregate.html)

      * *   current\_catalog, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * current\_database, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * current\_date, [Date/Time Functions and Operators](functions-datetime.html)
  * current\_logfiles

    <!---->

      * *   and the log\_destination configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
    * and the pg\_current\_logfile function, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)

      * *   current\_query, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * current\_role, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * current\_schema, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * current\_schemas, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * current\_setting, [Configuration Settings Functions](functions-admin.html#FUNCTIONS-ADMIN-SET)
  * current\_time, [Date/Time Functions and Operators](functions-datetime.html)
  * current\_timestamp, [Date/Time Functions and Operators](functions-datetime.html)
  * current\_user, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * currval, [Sequence Manipulation Functions](functions-sequence.html)
  * cursor, [Cursors](plpgsql-cursors.html), [CLOSE](sql-close.html), [DECLARE](sql-declare.html), [EXPLAIN](sql-explain.html), [FETCH](sql-fetch.html), [MOVE](sql-move.html)

    <!---->

      * *   CLOSE, [CLOSE](sql-close.html)
    * DECLARE, [DECLARE](sql-declare.html)
    * FETCH, [FETCH](sql-fetch.html)
    * in PL/pgSQL, [Cursors](plpgsql-cursors.html)
    * MOVE, [MOVE](sql-move.html)
    * showing the query plan, [EXPLAIN](sql-explain.html)

      * *   cursor\_tuple\_fraction configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
  * custom scan provider, [Writing a Custom Scan Provider](custom-scan.html)

    <!---->

  * handler for, [Writing a Custom Scan Provider](custom-scan.html)

* Cygwin, [Cygwin](installation-platform-notes.html#INSTALLATION-NOTES-CYGWIN)

  * installation on, [Cygwin](installation-platform-notes.html#INSTALLATION-NOTES-CYGWIN)

### D

  * *   daitch\_mokotoff, [Daitch-Mokotoff Soundex](fuzzystrmatch.html#FUZZYSTRMATCH-DAITCH-MOKOTOFF)
* data area (see [database cluster](#ientry-idp105553308565119))
* data partitioning, [High Availability, Load Balancing, and Replication](high-availability.html)
* data type, [Data Types](datatype.html), [Numeric Types](datatype-numeric.html), [Enumerated Types](datatype-enum.html), [Domain Types](domains.html), [Type Conversion](typeconv.html), [The PostgreSQL Type System](extend-type-system.html), [The PostgreSQL Type System](extend-type-system.html), [The PostgreSQL Type System](extend-type-system.html), [Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC), [Base Types in C-Language Functions](xfunc-c.html#XFUNC-C-BASETYPE), [User-Defined Types](xtypes.html)

    <!---->

  * *   base, [The PostgreSQL Type System](extend-type-system.html)
  * category, [Overview](typeconv-overview.html)
  * composite, [The PostgreSQL Type System](extend-type-system.html)
  * constant, [Constants of Other Types](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS-GENERIC)
  * container, [The PostgreSQL Type System](extend-type-system.html)
  * conversion, [Type Conversion](typeconv.html)
  * domain, [Domain Types](domains.html)
  * enumerated (enum), [Enumerated Types](datatype-enum.html)
  * internal organization, [Base Types in C-Language Functions](xfunc-c.html#XFUNC-C-BASETYPE)
  * numeric, [Numeric Types](datatype-numeric.html)
  * polymorphic, [Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC)
  * type cast, [Type Casts](sql-expressions.html#SQL-SYNTAX-TYPE-CASTS)
  * user-defined, [User-Defined Types](xtypes.html)

* database, [Creating a Database](tutorial-createdb.html), [Managing Databases](managing-databases.html)

  * *   creating, [Creating a Database](tutorial-createdb.html)
  * privilege to create, [Role Attributes](role-attributes.html)

* database activity, [Monitoring Database Activity](monitoring.html)

  * monitoring, [Monitoring Database Activity](monitoring.html)

      * *   database cluster, [Concepts](tutorial-concepts.html), [Creating a Database Cluster](creating-cluster.html)
  * data\_checksums configuration parameter, [Preset Options](runtime-config-preset.html)
  * data\_directory configuration parameter, [File Locations](runtime-config-file-locations.html)
  * data\_directory\_mode configuration parameter, [Preset Options](runtime-config-preset.html)
  * data\_sync\_retry configuration parameter, [Error Handling](runtime-config-error-handling.html)
  * date, [Date/Time Types](datatype-datetime.html), [Dates](datatype-datetime.html#DATATYPE-DATETIME-INPUT-DATES)

    <!---->

      * *   constants, [Special Values](datatype-datetime.html#DATATYPE-DATETIME-SPECIAL-VALUES)
    * current, [Current Date/Time](functions-datetime.html#FUNCTIONS-DATETIME-CURRENT)
    * output format, [Date/Time Output](datatype-datetime.html#DATATYPE-DATETIME-OUTPUT)

        <!---->

    * (see also [formatting](#ientry-idp105553373272959))

      * *   DateStyle configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * date\_add, [Date/Time Functions and Operators](functions-datetime.html)
  * date\_bin, [date\_bin](functions-datetime.html#FUNCTIONS-DATETIME-BIN)
  * date\_part, [Date/Time Functions and Operators](functions-datetime.html), [EXTRACT, date\_part](functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT)
  * date\_subtract, [Date/Time Functions and Operators](functions-datetime.html)
  * date\_trunc, [Date/Time Functions and Operators](functions-datetime.html), [date\_trunc](functions-datetime.html#FUNCTIONS-DATETIME-TRUNC)
  * dblink, [dblink — connect to other PostgreSQL databases](dblink.html), [dblink](contrib-dblink-function.html)
  * dblink\_build\_sql\_delete, [dblink\_build\_sql\_delete](contrib-dblink-build-sql-delete.html)
  * dblink\_build\_sql\_insert, [dblink\_build\_sql\_insert](contrib-dblink-build-sql-insert.html)
  * dblink\_build\_sql\_update, [dblink\_build\_sql\_update](contrib-dblink-build-sql-update.html)
  * dblink\_cancel\_query, [dblink\_cancel\_query](contrib-dblink-cancel-query.html)
  * dblink\_close, [dblink\_close](contrib-dblink-close.html)
  * dblink\_connect, [dblink\_connect](contrib-dblink-connect.html)
  * dblink\_connect\_u, [dblink\_connect\_u](contrib-dblink-connect-u.html)
  * dblink\_disconnect, [dblink\_disconnect](contrib-dblink-disconnect.html)
  * dblink\_error\_message, [dblink\_error\_message](contrib-dblink-error-message.html)
  * dblink\_exec, [dblink\_exec](contrib-dblink-exec.html)
  * dblink\_fetch, [dblink\_fetch](contrib-dblink-fetch.html)
  * dblink\_get\_connections, [dblink\_get\_connections](contrib-dblink-get-connections.html)
  * dblink\_get\_notify, [dblink\_get\_notify](contrib-dblink-get-notify.html)
  * dblink\_get\_pkey, [dblink\_get\_pkey](contrib-dblink-get-pkey.html)
  * dblink\_get\_result, [dblink\_get\_result](contrib-dblink-get-result.html)
  * dblink\_is\_busy, [dblink\_is\_busy](contrib-dblink-is-busy.html)
  * dblink\_open, [dblink\_open](contrib-dblink-open.html)
  * dblink\_send\_query, [dblink\_send\_query](contrib-dblink-send-query.html)
  * deadlock, [Deadlocks](explicit-locking.html#LOCKING-DEADLOCKS)

    <!---->

  * timeout during, [Lock Management](runtime-config-locks.html)

      * *   deadlock\_timeout configuration parameter, [Lock Management](runtime-config-locks.html)
  * DEALLOCATE, [DEALLOCATE](sql-deallocate.html)
  * dearmor, [armor(), dearmor()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-ARMOR)
  * debug\_assertions configuration parameter, [Preset Options](runtime-config-preset.html)
  * debug\_deadlocks configuration parameter, [Developer Options](runtime-config-developer.html)
  * debug\_discard\_caches configuration parameter, [Developer Options](runtime-config-developer.html)
  * debug\_io\_direct configuration parameter, [Developer Options](runtime-config-developer.html)
  * debug\_logical\_replication\_streaming configuration parameter, [Developer Options](runtime-config-developer.html)
  * debug\_parallel\_query configuration parameter, [Developer Options](runtime-config-developer.html)
  * debug\_pretty\_print configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * debug\_print\_parse configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * debug\_print\_plan configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * debug\_print\_rewritten configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * decimal (see [numeric](#ientry-idp105553308165631))
  * DECLARE, [DECLARE](sql-declare.html)
  * decode, [Binary String Functions and Operators](functions-binarystring.html)
  * decode\_bytea

    <!---->

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

      * *   decrypt, [Raw Encryption Functions](pgcrypto.html#PGCRYPTO-RAW-ENC-FUNCS)
  * decrypt\_iv, [Raw Encryption Functions](pgcrypto.html#PGCRYPTO-RAW-ENC-FUNCS)
  * deduplicate\_items storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS)
  * default value, [Default Values](ddl-default.html)

    <!---->

  * changing, [Changing a Column's Default Value](ddl-alter.html#DDL-ALTER-COLUMN-DEFAULT)

      * *   default-roles, [Default Roles Renamed to Predefined Roles](default-roles.html)
  * default\_statistics\_target configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
  * default\_tablespace configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * default\_table\_access\_method configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * default\_text\_search\_config configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * default\_toast\_compression configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * default\_transaction\_deferrable configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * default\_transaction\_isolation configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * default\_transaction\_read\_only configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * deferrable transaction, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

    <!---->

      * *   setting, [SET TRANSACTION](sql-set-transaction.html)
    * setting default, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

      * *   defined, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * degrees, [Mathematical Functions and Operators](functions-math.html)
  * delay, [Delaying Execution](functions-datetime.html#FUNCTIONS-DATETIME-DELAY)
  * DELETE, [Deletions](tutorial-delete.html), [Deleting Data](dml-delete.html), [Returning Data from Modified Rows](dml-returning.html), [DELETE](sql-delete.html)

    <!---->

  * RETURNING, [Returning Data from Modified Rows](dml-returning.html)

      * *   delete, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * deleting, [Deleting Data](dml-delete.html)
  * dense\_rank, [Window Functions](functions-window.html)

    <!---->

  * hypothetical, [Aggregate Functions](functions-aggregate.html)

      * *   diagonal, [Geometric Functions and Operators](functions-geometry.html)
  * diameter, [Geometric Functions and Operators](functions-geometry.html)
  * dict\_int, [dict\_int — example full-text search dictionary for integers](dict-int.html)
  * dict\_xsyn, [dict\_xsyn — example synonym full-text search dictionary](dict-xsyn.html)
  * difference, [Soundex](fuzzystrmatch.html#FUZZYSTRMATCH-SOUNDEX)
  * digest, [digest()](pgcrypto.html#PGCRYPTO-GENERAL-HASHING-FUNCS-DIGEST)
  * dirty read, [Transaction Isolation](transaction-iso.html)
  * DISCARD, [DISCARD](sql-discard.html)
  * disjunction, [Logical Operators](functions-logical.html)
  * disk drive, [WAL Internals](wal-internals.html)
  * disk space, [Recovering Disk Space](routine-vacuuming.html#VACUUM-FOR-SPACE-RECOVERY)
  * disk usage, [Determining Disk Usage](disk-usage.html)
  * DISTINCT, [Querying a Table](tutorial-select.html), [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS), [DISTINCT](queries-select-lists.html#QUERIES-DISTINCT)

    <!---->

      * *   GROUP BY DISTINCT, [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS)
    * SELECT DISTINCT, [DISTINCT](queries-select-lists.html#QUERIES-DISTINCT)

      * *   div, [Mathematical Functions and Operators](functions-math.html)
  * dmetaphone, [Double Metaphone](fuzzystrmatch.html#FUZZYSTRMATCH-DOUBLE-METAPHONE)
  * dmetaphone\_alt, [Double Metaphone](fuzzystrmatch.html#FUZZYSTRMATCH-DOUBLE-METAPHONE)
  * DO, [DO](sql-do.html)
  * document, [What Is a Document?](textsearch-intro.html#TEXTSEARCH-DOCUMENT)

    <!---->

  * text search, [What Is a Document?](textsearch-intro.html#TEXTSEARCH-DOCUMENT)

      * *   dollar quoting, [Dollar-Quoted String Constants](sql-syntax-lexical.html#SQL-SYNTAX-DOLLAR-QUOTING)
  * domain, [Domain Types](domains.html)
  * double precision, [Floating-Point Types](datatype-numeric.html#DATATYPE-FLOAT)
  * DROP ACCESS METHOD, [DROP ACCESS METHOD](sql-drop-access-method.html)
  * DROP AGGREGATE, [DROP AGGREGATE](sql-dropaggregate.html)
  * DROP CAST, [DROP CAST](sql-dropcast.html)
  * DROP COLLATION, [DROP COLLATION](sql-dropcollation.html)
  * DROP CONVERSION, [DROP CONVERSION](sql-dropconversion.html)
  * DROP DATABASE, [Destroying a Database](manage-ag-dropdb.html), [DROP DATABASE](sql-dropdatabase.html)
  * DROP DOMAIN, [DROP DOMAIN](sql-dropdomain.html)
  * DROP EVENT TRIGGER, [DROP EVENT TRIGGER](sql-dropeventtrigger.html)
  * DROP EXTENSION, [DROP EXTENSION](sql-dropextension.html)
  * DROP FOREIGN DATA WRAPPER, [DROP FOREIGN DATA WRAPPER](sql-dropforeigndatawrapper.html)
  * DROP FOREIGN TABLE, [DROP FOREIGN TABLE](sql-dropforeigntable.html)
  * DROP FUNCTION, [DROP FUNCTION](sql-dropfunction.html)
  * DROP GROUP, [DROP GROUP](sql-dropgroup.html)
  * DROP INDEX, [DROP INDEX](sql-dropindex.html)
  * DROP LANGUAGE, [DROP LANGUAGE](sql-droplanguage.html)
  * DROP MATERIALIZED VIEW, [DROP MATERIALIZED VIEW](sql-dropmaterializedview.html)
  * DROP OPERATOR, [DROP OPERATOR](sql-dropoperator.html)
  * DROP OPERATOR CLASS, [DROP OPERATOR CLASS](sql-dropopclass.html)
  * DROP OPERATOR FAMILY, [DROP OPERATOR FAMILY](sql-dropopfamily.html)
  * DROP OWNED, [DROP OWNED](sql-drop-owned.html)
  * DROP POLICY, [DROP POLICY](sql-droppolicy.html)
  * DROP PROCEDURE, [DROP PROCEDURE](sql-dropprocedure.html)
  * DROP PUBLICATION, [DROP PUBLICATION](sql-droppublication.html)
  * DROP ROLE, [Database Roles](database-roles.html), [DROP ROLE](sql-droprole.html)
  * DROP ROUTINE, [DROP ROUTINE](sql-droproutine.html)
  * DROP RULE, [DROP RULE](sql-droprule.html)
  * DROP SCHEMA, [DROP SCHEMA](sql-dropschema.html)
  * DROP SEQUENCE, [DROP SEQUENCE](sql-dropsequence.html)
  * DROP SERVER, [DROP SERVER](sql-dropserver.html)
  * DROP STATISTICS, [DROP STATISTICS](sql-dropstatistics.html)
  * DROP SUBSCRIPTION, [DROP SUBSCRIPTION](sql-dropsubscription.html)
  * DROP TABLE, [Creating a New Table](tutorial-table.html), [DROP TABLE](sql-droptable.html)
  * DROP TABLESPACE, [DROP TABLESPACE](sql-droptablespace.html)
  * DROP TEXT SEARCH CONFIGURATION, [DROP TEXT SEARCH CONFIGURATION](sql-droptsconfig.html)
  * DROP TEXT SEARCH DICTIONARY, [DROP TEXT SEARCH DICTIONARY](sql-droptsdictionary.html)
  * DROP TEXT SEARCH PARSER, [DROP TEXT SEARCH PARSER](sql-droptsparser.html)
  * DROP TEXT SEARCH TEMPLATE, [DROP TEXT SEARCH TEMPLATE](sql-droptstemplate.html)
  * DROP TRANSFORM, [DROP TRANSFORM](sql-droptransform.html)
  * DROP TRIGGER, [DROP TRIGGER](sql-droptrigger.html)
  * DROP TYPE, [DROP TYPE](sql-droptype.html)
  * DROP USER, [DROP USER](sql-dropuser.html)
  * DROP USER MAPPING, [DROP USER MAPPING](sql-dropusermapping.html)
  * DROP VIEW, [DROP VIEW](sql-dropview.html)
  * dropdb, [Destroying a Database](manage-ag-dropdb.html), [dropdb](app-dropdb.html)
  * dropuser, [Database Roles](database-roles.html), [dropuser](app-dropuser.html)
  * DROP\_REPLICATION\_SLOT, [Streaming Replication Protocol](protocol-replication.html)
  * DTD, [Creating XML Values](datatype-xml.html#DATATYPE-XML-CREATING)
  * DTrace, [Developer Options](install-make.html#CONFIGURE-OPTIONS-DEVEL), [Developer Options](install-meson.html#MESON-OPTIONS-DEVEL), [Dynamic Tracing](dynamic-trace.html)
  * duplicate, [Querying a Table](tutorial-select.html)
  * duplicates, [DISTINCT](queries-select-lists.html#QUERIES-DISTINCT)
  * dynamic loading, [Other Defaults](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-OTHER), [Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
  * dynamic\_library\_path, [Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
  * dynamic\_library\_path configuration parameter, [Other Defaults](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-OTHER)
  * dynamic\_shared\_memory\_type configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)

### E

  * *   each, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* earth, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
* earthdistance, [earthdistance — calculate great-circle distances](earthdistance.html)
* earth\_box, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
* earth\_distance, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
* ECPG, [ECPG — Embedded SQL in C](ecpg.html)
* ecpg, [ecpg](app-ecpg.html)
* effective\_cache\_size configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* effective\_io\_concurrency configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* elog, [Reporting Errors Within the Server](error-message-reporting.html)

    <!---->

  * *   in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)
  * in PL/Python, [Utility Functions](plpython-util.html)
  * in PL/Tcl, [Database Access from PL/Tcl](pltcl-dbaccess.html)

* embedded SQL, [ECPG — Embedded SQL in C](ecpg.html)

  * in C, [ECPG — Embedded SQL in C](ecpg.html)

      * *   enabled role, [enabled\_roles](infoschema-enabled-roles.html)
  * enable\_async\_append configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_bitmapscan configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_gathermerge configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_hashagg configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_hashjoin configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_incremental\_sort configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_indexonlyscan configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_indexscan configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_material configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_memoize configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_mergejoin configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_nestloop configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_parallel\_append configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_parallel\_hash configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_partitionwise\_aggregate configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_partitionwise\_join configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_partition\_pruning configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_presorted\_aggregate configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_seqscan configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_sort configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * enable\_tidscan configuration parameter, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * encode, [Binary String Functions and Operators](functions-binarystring.html)
  * encode\_array\_constructor

    <!---->

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

* encode\_array\_literal

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

* encode\_bytea

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

* encode\_typed\_literal

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

      * *   encrypt, [Raw Encryption Functions](pgcrypto.html#PGCRYPTO-RAW-ENC-FUNCS)
  * encryption, [Encryption Options](encryption-options.html), [pgcrypto — cryptographic functions](pgcrypto.html)

    <!---->

  * for specific columns, [pgcrypto — cryptographic functions](pgcrypto.html)

      * *   encrypt\_iv, [Raw Encryption Functions](pgcrypto.html#PGCRYPTO-RAW-ENC-FUNCS)
  * END, [END](sql-end.html)
  * enumerated types, [Enumerated Types](datatype-enum.html)
  * enum\_first, [Enum Support Functions](functions-enum.html)
  * enum\_last, [Enum Support Functions](functions-enum.html)
  * enum\_range, [Enum Support Functions](functions-enum.html)
  * environment variable, [Environment Variables](libpq-envars.html)
  * ephemeral named relation

    <!---->

      * *   registering with SPI, [SPI\_register\_relation](spi-spi-register-relation.html), [SPI\_register\_trigger\_data](spi-spi-register-trigger-data.html)
    * unregistering from SPI, [SPI\_unregister\_relation](spi-spi-unregister-relation.html)

      * *   ereport, [Reporting Errors Within the Server](error-message-reporting.html)
  * erf, [Mathematical Functions and Operators](functions-math.html)
  * erfc, [Mathematical Functions and Operators](functions-math.html)
  * error codes, [PostgreSQL Error Codes](errcodes-appendix.html)

    <!---->

      * *   libpq, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
    * list of, [PostgreSQL Error Codes](errcodes-appendix.html)

      * *   error message, [Connection Status Functions](libpq-status.html)
  * escape format, [Binary String Functions and Operators](functions-binarystring.html)
  * escape string syntax, [String Constants with C-Style Escapes](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-ESCAPE)
  * escape\_string\_warning configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
  * escaping strings, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)

    <!---->

  * in libpq, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)

* event log, [Registering Event Log on Windows](event-log-registration.html)

  * event log, [Registering Event Log on Windows](event-log-registration.html)

* event trigger, [Event Triggers](event-triggers.html), [Writing Event Trigger Functions in C](event-trigger-interface.html)

  * *   in C, [Writing Event Trigger Functions in C](event-trigger-interface.html)
  * in PL/Tcl, [Event Trigger Functions in PL/Tcl](pltcl-event-trigger.html)

      * *   event\_source configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * event\_trigger, [Pseudo-Types](datatype-pseudo.html)
  * event\_triggers

    <!---->

  * configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

      * *   every, [Aggregate Functions](functions-aggregate.html)
  * EXCEPT, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html)
  * exceptions

    <!---->

      * *   in PL/pgSQL, [Trapping Errors](plpgsql-control-structures.html#PLPGSQL-ERROR-TRAPPING)
    * in PL/Tcl, [Error Handling in PL/Tcl](pltcl-error-handling.html)

      * *   exclusion constraint, [Exclusion Constraints](ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION)
  * EXECUTE, [EXECUTE](sql-execute.html)
  * exist, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * EXISTS, [Subquery Expressions](functions-subquery.html)
  * EXIT

    <!---->

  * in PL/pgSQL, [EXIT](plpgsql-control-structures.html#PLPGSQL-CONTROL-STRUCTURES-LOOPS-EXIT)

      * *   exit\_on\_error configuration parameter, [Error Handling](runtime-config-error-handling.html)
  * exp, [Mathematical Functions and Operators](functions-math.html)
  * EXPLAIN, [Using EXPLAIN](using-explain.html), [EXPLAIN](sql-explain.html)
  * expression, [Value Expressions](sql-expressions.html)

    <!---->

      * *   order of evaluation, [Expression Evaluation Rules](sql-expressions.html#SYNTAX-EXPRESS-EVAL)
    * syntax, [Value Expressions](sql-expressions.html)

      * *   extending SQL, [Extending SQL](extend.html)
  * extension, [Packaging Related Objects into an Extension](extend-extensions.html)

    <!---->

  * externally maintained, [Extensions](external-extensions.html)

      * *   external\_pid\_file configuration parameter, [File Locations](runtime-config-file-locations.html)
  * extract, [Date/Time Functions and Operators](functions-datetime.html), [EXTRACT, date\_part](functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT)
  * extra\_float\_digits configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)

### F

  * *   factorial, [Mathematical Functions and Operators](functions-math.html)
* failover, [High Availability, Load Balancing, and Replication](high-availability.html)
* false, [Boolean Type](datatype-boolean.html)
* family, [Network Address Functions and Operators](functions-net.html)
* fast path, [The Fast-Path Interface](libpq-fastpath.html)
* fastupdate storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS)
* fdw\_handler, [Pseudo-Types](datatype-pseudo.html)
* FETCH, [FETCH](sql-fetch.html)
* field

    <!---->

* computed, [Using Composite Types in Queries](rowtypes.html#ROWTYPES-USAGE)

  * *   field selection, [Field Selection](sql-expressions.html#FIELD-SELECTION)
* file system mount points, [Use of Secondary File Systems](creating-cluster.html#CREATING-CLUSTER-MOUNT-POINTS)
* file\_fdw, [file\_fdw — access data files in the server's file system](file-fdw.html)
* fillfactor storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS), [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
* FILTER, [Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES)
* first\_value, [Window Functions](functions-window.html)
* flex, [Requirements](install-requirements.html)
* float4 (see [real](#ientry-idp105553306091263))
* float8 (see [double precision](#ientry-idp105553307075327))
* floating point, [Floating-Point Types](datatype-numeric.html#DATATYPE-FLOAT)
* floating-point

    <!---->

* display, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)

  * *   floor, [Mathematical Functions and Operators](functions-math.html)
* foreign data, [Foreign Data](ddl-foreign-data.html)
* foreign data wrapper, [Writing a Foreign Data Wrapper](fdwhandler.html)

    <!---->

* handler for, [Writing a Foreign Data Wrapper](fdwhandler.html)

* foreign key, [Foreign Keys](tutorial-fk.html), [Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)

  * self-referential, [Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)

      * *   foreign table, [Foreign Data](ddl-foreign-data.html)
  * format, [String Functions and Operators](functions-string.html), [format](functions-string.html#FUNCTIONS-STRING-FORMAT)

    <!---->

  * use in PL/pgSQL, [Executing Dynamic Commands](plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN)

      * *   formatting, [Data Type Formatting Functions](functions-formatting.html)
  * format\_type, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * Free Space Map, [Free Space Map](storage-fsm.html)
  * FreeBSD

    <!---->

      * *   IPC configuration, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
    * shared library, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
    * start script, [Starting the Database Server](server-start.html)

      * *   from\_collapse\_limit configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
  * FSM (see [Free Space Map](#ientry-idp105554245263743))
  * fsm\_page\_contents, [General Functions](pageinspect.html#PAGEINSPECT-GENERAL-FUNCS)
  * fsync configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
  * full text search, [Text Search Types](datatype-textsearch.html), [Text Search Types](datatype-textsearch.html), [Full Text Search](textsearch.html)

    <!---->

      * *   data types, [Text Search Types](datatype-textsearch.html)
    * functions and operators, [Text Search Types](datatype-textsearch.html)

      * *   full\_page\_writes configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
  * function, [Table Functions](queries-table-expressions.html#QUERIES-TABLEFUNCTIONS), [Functions and Operators](functions.html), [Statistics Information Functions](functions-statistics.html), [Functions](typeconv-func.html), [Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC), [User-Defined Functions](xfunc.html), [Query Language (SQL) Functions](xfunc-sql.html), [Internal Functions](xfunc-internal.html), [C-Language Functions](xfunc-c.html)

    <!---->

      * *   default values for arguments, [SQL Functions with Default Values for Arguments](xfunc-sql.html#XFUNC-SQL-PARAMETER-DEFAULTS)
    * in the FROM clause, [Table Functions](queries-table-expressions.html#QUERIES-TABLEFUNCTIONS)
    * internal, [Internal Functions](xfunc-internal.html)
    * invocation, [Function Calls](sql-expressions.html#SQL-EXPRESSIONS-FUNCTION-CALLS)
    * mixed notation, [Using Mixed Notation](sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS-MIXED)
    * named argument, [Arguments for SQL Functions](xfunc-sql.html#XFUNC-SQL-FUNCTION-ARGUMENTS)
    * named notation, [Using Named Notation](sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS-NAMED)
    * output parameter, [SQL Functions with Output Parameters](xfunc-sql.html#XFUNC-OUTPUT-PARAMETERS)
    * polymorphic, [Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC)
    * positional notation, [Using Positional Notation](sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS-POSITIONAL)
    * RETURNS TABLE, [SQL Functions Returning TABLE](xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-TABLE)
    * statistics, [Statistics Information Functions](functions-statistics.html)
    * type resolution in an invocation, [Functions](typeconv-func.html)
    * user-defined, [User-Defined Functions](xfunc.html), [Query Language (SQL) Functions](xfunc-sql.html), [C-Language Functions](xfunc-c.html)

        <!---->

      * *   in C, [C-Language Functions](xfunc-c.html)
      * in SQL, [Query Language (SQL) Functions](xfunc-sql.html)

          * *   variadic, [SQL Functions with Variable Numbers of Arguments](xfunc-sql.html#XFUNC-SQL-VARIADIC-FUNCTIONS)
    * with SETOF, [SQL Functions Returning Sets](xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-SET)

      * *   functional dependency, [The GROUP BY and HAVING Clauses](queries-table-expressions.html#QUERIES-GROUP)
  * fuzzystrmatch, [fuzzystrmatch — determine string similarities and distance](fuzzystrmatch.html)

### G

  * *   gcd, [Mathematical Functions and Operators](functions-math.html)
* gc\_to\_sec, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
* generated column, [Generated Columns](ddl-generated-columns.html), [Parameters](sql-createforeigntable.html#id-1.9.3.66.6), [Parameters](sql-createtable.html#id-1.9.3.85.6)

    <!---->

* in triggers, [Overview of Trigger Behavior](trigger-definition.html)

  * *   generate\_series, [Set Returning Functions](functions-srf.html)
* generate\_subscripts, [Set Returning Functions](functions-srf.html)
* genetic query optimization, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* gen\_random\_bytes, [Random-Data Functions](pgcrypto.html#PGCRYPTO-RANDOM-DATA-FUNCS)
* gen\_random\_uuid, [UUID Functions](functions-uuid.html), [Random-Data Functions](pgcrypto.html#PGCRYPTO-RANDOM-DATA-FUNCS)
* gen\_salt, [gen\_salt()](pgcrypto.html#PGCRYPTO-PASSWORD-HASHING-FUNCS-GEN-SALT)
* GEQO (see [genetic query optimization](#ientry-idp105553575812863))
* geqo configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* geqo\_effort configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* geqo\_generations configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* geqo\_pool\_size configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* geqo\_seed configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* geqo\_selection\_bias configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* geqo\_threshold configuration parameter, [Genetic Query Optimizer](runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
* get\_bit, [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
* get\_byte, [Binary String Functions and Operators](functions-binarystring.html)
* get\_current\_ts\_config, [Text Search Functions and Operators](functions-textsearch.html)
* get\_raw\_page, [General Functions](pageinspect.html#PAGEINSPECT-GENERAL-FUNCS)
* GIN (see [index](#ientry-idp105553510265215))
* gin\_clean\_pending\_list, [Index Maintenance Functions](functions-admin.html#FUNCTIONS-ADMIN-INDEX)
* gin\_fuzzy\_search\_limit configuration parameter, [Other Defaults](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-OTHER)
* gin\_leafpage\_items, [GIN Functions](pageinspect.html#PAGEINSPECT-GIN-FUNCS)
* gin\_metapage\_info, [GIN Functions](pageinspect.html#PAGEINSPECT-GIN-FUNCS)
* gin\_page\_opaque\_info, [GIN Functions](pageinspect.html#PAGEINSPECT-GIN-FUNCS)
* gin\_pending\_list\_limit

    <!---->

  * *   configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS)

      * *   GiST (see [index](#ientry-idp105553510265215))
* gist\_page\_items, [GiST Functions](pageinspect.html#PAGEINSPECT-GIST-FUNCS)
* gist\_page\_items\_bytea, [GiST Functions](pageinspect.html#PAGEINSPECT-GIST-FUNCS)
* gist\_page\_opaque\_info, [GiST Functions](pageinspect.html#PAGEINSPECT-GIST-FUNCS)
* global data, [Global Data in PL/Tcl](pltcl-global.html)

    <!---->

  * *   in PL/Python, [Sharing Data](plpython-sharing.html)
  * in PL/Tcl, [Global Data in PL/Tcl](pltcl-global.html)

      * *   GRANT, [Privileges](ddl-priv.html), [GRANT](sql-grant.html)
* GREATEST, [GREATEST and LEAST](functions-conditional.html#FUNCTIONS-GREATEST-LEAST), [UNION, CASE, and Related Constructs](typeconv-union-case.html)

    <!---->

* determination of result type, [UNION, CASE, and Related Constructs](typeconv-union-case.html)

  * *   Gregorian calendar, [History of Units](datetime-units-history.html)
* GROUP BY, [Aggregate Functions](tutorial-agg.html), [The GROUP BY and HAVING Clauses](queries-table-expressions.html#QUERIES-GROUP)
* grouping, [The GROUP BY and HAVING Clauses](queries-table-expressions.html#QUERIES-GROUP)
* GROUPING, [Aggregate Functions](functions-aggregate.html)
* GROUPING SETS, [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS)
* gssapi, [Secure TCP/IP Connections with GSSAPI Encryption](gssapi-enc.html)
* GSSAPI, [GSSAPI Authentication](gssapi-auth.html)

    <!---->

* with libpq, [Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)

  * *   gss\_accept\_delegation configuration parameter, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
* GUID, [UUID Type](datatype-uuid.html)

### H

  * *   hash (see [index](#ientry-idp105553510265215))
* hash\_bitmap\_info, [Hash Functions](pageinspect.html#PAGEINSPECT-HASH-FUNCS)
* hash\_mem\_multiplier configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* hash\_metapage\_info, [Hash Functions](pageinspect.html#PAGEINSPECT-HASH-FUNCS)
* hash\_page\_items, [Hash Functions](pageinspect.html#PAGEINSPECT-HASH-FUNCS)
* hash\_page\_stats, [Hash Functions](pageinspect.html#PAGEINSPECT-HASH-FUNCS)
* hash\_page\_type, [Hash Functions](pageinspect.html#PAGEINSPECT-HASH-FUNCS)
* has\_any\_column\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_column\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_database\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_foreign\_data\_wrapper\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_function\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_language\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_parameter\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_schema\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_sequence\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_server\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_tablespace\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_table\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* has\_type\_privilege, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* HAVING, [Aggregate Functions](tutorial-agg.html), [The GROUP BY and HAVING Clauses](queries-table-expressions.html#QUERIES-GROUP)
* hba\_file configuration parameter, [File Locations](runtime-config-file-locations.html)
* heap\_page\_items, [Heap Functions](pageinspect.html#PAGEINSPECT-HEAP-FUNCS)
* heap\_page\_item\_attrs, [Heap Functions](pageinspect.html#PAGEINSPECT-HEAP-FUNCS)
* heap\_tuple\_infomask\_flags, [Heap Functions](pageinspect.html#PAGEINSPECT-HEAP-FUNCS)
* height, [Geometric Functions and Operators](functions-geometry.html)
* hex format, [Binary String Functions and Operators](functions-binarystring.html)
* hierarchical database, [Concepts](tutorial-concepts.html)
* high availability, [High Availability, Load Balancing, and Replication](high-availability.html)
* history, [A Brief History of PostgreSQL](history.html)

    <!---->

* of PostgreSQL, [A Brief History of PostgreSQL](history.html)

  * *   hmac, [hmac()](pgcrypto.html#PGCRYPTO-GENERAL-HASHING-FUNCS-HMAC)
* host, [Network Address Functions and Operators](functions-net.html)
* host name, [Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)
* hostmask, [Network Address Functions and Operators](functions-net.html)
* hot standby, [High Availability, Load Balancing, and Replication](high-availability.html)
* hot\_standby configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* hot\_standby\_feedback configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* hstore, [hstore — hstore key/value datatype](hstore.html), [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* hstore\_to\_array, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* hstore\_to\_json, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* hstore\_to\_jsonb, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* hstore\_to\_jsonb\_loose, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* hstore\_to\_json\_loose, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* hstore\_to\_matrix, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
* huge\_pages configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* huge\_pages\_status configuration parameter, [Preset Options](runtime-config-preset.html)
* huge\_page\_size configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* hypothetical-set aggregate

    <!---->

* built-in, [Aggregate Functions](functions-aggregate.html)

### I

  * *   icount, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
* ICU, [Anti-Features](install-make.html#CONFIGURE-OPTIONS-ANTI-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES), [Locale Providers](locale.html#LOCALE-PROVIDERS), [Managing Collations](collation.html#COLLATION-MANAGING), [Parameters](sql-createcollation.html#id-1.9.3.59.6), [Parameters](sql-createdatabase.html#id-1.9.3.61.6)
* icu\_validation\_level configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
* ident, [Ident Authentication](auth-ident.html)
* identifier, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

    <!---->

  * *   length, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
  * syntax of, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

      * *   IDENTIFY\_SYSTEM, [Streaming Replication Protocol](protocol-replication.html)
* ident\_file configuration parameter, [File Locations](runtime-config-file-locations.html)
* idle\_in\_transaction\_session\_timeout configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* idle\_session\_timeout configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* idx, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
* IFNULL, [COALESCE](functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL)
* ignore\_checksum\_failure configuration parameter, [Developer Options](runtime-config-developer.html)
* ignore\_invalid\_pages configuration parameter, [Developer Options](runtime-config-developer.html)
* ignore\_system\_indexes configuration parameter, [Developer Options](runtime-config-developer.html)
* IMMUTABLE, [Function Volatility Categories](xfunc-volatility.html)
* IMPORT FOREIGN SCHEMA, [IMPORT FOREIGN SCHEMA](sql-importforeignschema.html)
* IN, [Subquery Expressions](functions-subquery.html), [Row and Array Comparisons](functions-comparisons.html)
* INCLUDE

    <!---->

* in index definitions, [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html)

* include

  * in configuration file, [Managing Configuration File Contents](config-setting.html#CONFIG-INCLUDES)

* include\_dir

  * in configuration file, [Managing Configuration File Contents](config-setting.html#CONFIG-INCLUDES)

* include\_if\_exists

  * in configuration file, [Managing Configuration File Contents](config-setting.html#CONFIG-INCLUDES)

* index, [Indexes](indexes.html), [Multicolumn Indexes](indexes-multicolumn.html), [Indexes and ORDER BY](indexes-ordering.html), [Combining Multiple Indexes](indexes-bitmap-scans.html), [Unique Indexes](indexes-unique.html), [Indexes on Expressions](indexes-expressional.html), [Partial Indexes](indexes-partial.html), [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html), [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html), [Examining Index Usage](indexes-examine.html), [Preferred Index Types for Text Search](textsearch-indexes.html), [Preferred Index Types for Text Search](textsearch-indexes.html), [Locking and Indexes](locking-indexes.html), [Interfacing Extensions to Indexes](xindex.html), [Building Indexes Concurrently](sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY), [Rebuilding Indexes Concurrently](sql-reindex.html#SQL-REINDEX-CONCURRENTLY), [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)

  * *   and ORDER BY, [Indexes and ORDER BY](indexes-ordering.html)
  * B-Tree, [B-Tree](indexes-types.html#INDEXES-TYPES-BTREE), [B-Tree Indexes](btree.html)
  * BRIN, [BRIN](indexes-types.html#INDEXES-TYPES-BRIN), [BRIN Indexes](brin.html)
  * building concurrently, [Building Indexes Concurrently](sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
  * combining multiple indexes, [Combining Multiple Indexes](indexes-bitmap-scans.html)
  * covering, [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html)
  * examining usage, [Examining Index Usage](indexes-examine.html)
  * on expressions, [Indexes on Expressions](indexes-expressional.html)
  * for user-defined data type, [Interfacing Extensions to Indexes](xindex.html)
  * GIN, [GIN](indexes-types.html#INDEXES-TYPES-GIN), [Preferred Index Types for Text Search](textsearch-indexes.html), [GIN Indexes](gin.html)

        <!---->

  * text search, [Preferred Index Types for Text Search](textsearch-indexes.html)

  * GiST, [GiST](indexes-types.html#INDEXES-TYPE-GIST), [Preferred Index Types for Text Search](textsearch-indexes.html), [GiST Indexes](gist.html)

    * text search, [Preferred Index Types for Text Search](textsearch-indexes.html)

      * *   hash, [Hash](indexes-types.html#INDEXES-TYPES-HASH)
    * Hash, [Hash Indexes](hash-index.html)
    * index-only scans, [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html)
    * locks, [Locking and Indexes](locking-indexes.html)
    * multicolumn, [Multicolumn Indexes](indexes-multicolumn.html)
    * partial, [Partial Indexes](indexes-partial.html)
    * rebuilding concurrently, [Rebuilding Indexes Concurrently](sql-reindex.html#SQL-REINDEX-CONCURRENTLY)
    * SP-GiST, [SP-GiST](indexes-types.html#INDEXES-TYPE-SPGIST), [SP-GiST Indexes](spgist.html)
    * unique, [Unique Indexes](indexes-unique.html)

      * *   Index Access Method, [Index Access Method Interface Definition](indexam.html)
  * index scan, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * index-only scan, [Index-Only Scans and Covering Indexes](indexes-index-only-scans.html)
  * indexam

    <!---->

  * Index Access Method, [Index Access Method Interface Definition](indexam.html)

      * *   index\_am\_handler, [Pseudo-Types](datatype-pseudo.html)
  * inet (data type), [inet](datatype-net-types.html#DATATYPE-INET)
  * inet\_client\_addr, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * inet\_client\_port, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * inet\_merge, [Network Address Functions and Operators](functions-net.html)
  * inet\_same\_family, [Network Address Functions and Operators](functions-net.html)
  * inet\_server\_addr, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * inet\_server\_port, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * infinity

    <!---->

      * *   floating point, [Floating-Point Types](datatype-numeric.html#DATATYPE-FLOAT)
    * numeric (data type), [Arbitrary Precision Numbers](datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL)

      * *   information schema, [The Information Schema](information-schema.html)
  * inheritance, [Inheritance](tutorial-inheritance.html), [Inheritance](ddl-inherit.html)
  * initcap, [String Functions and Operators](functions-string.html)
  * initdb, [Creating a Database Cluster](creating-cluster.html), [initdb](app-initdb.html)
  * Initialization Fork, [The Initialization Fork](storage-init.html)
  * input function, [User-Defined Types](xtypes.html)
  * INSERT, [Populating a Table With Rows](tutorial-populate.html), [Inserting Data](dml-insert.html), [Returning Data from Modified Rows](dml-returning.html), [INSERT](sql-insert.html)

    <!---->

  * RETURNING, [Returning Data from Modified Rows](dml-returning.html)

      * *   inserting, [Inserting Data](dml-insert.html)
  * installation, [Installation from Source Code](installation.html)

    <!---->

      * *   binaries, [Installation from Binaries](install-binaries.html)
    * on Windows, [Installation from Source Code on Windows](install-windows.html)

      * *   instr function, [Appendix](plpgsql-porting.html#PLPGSQL-PORTING-APPENDIX)
  * int2 (see [smallint](#ientry-idp105553306094719))
  * int4 (see [integer](#ientry-idp105553308164351))
  * int8 (see [bigint](#ientry-idp105553308164991))
  * intagg, [intagg — integer aggregator and enumerator](intagg.html)
  * intarray, [intarray — manipulate arrays of integers](intarray.html)
  * integer, [Numeric Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS-NUMERIC), [Integer Types](datatype-numeric.html#DATATYPE-INT)
  * integer\_datetimes configuration parameter, [Preset Options](runtime-config-preset.html)
  * interfaces

    <!---->

  * externally maintained, [Client Interfaces](external-interfaces.html)

      * *   internal, [Pseudo-Types](datatype-pseudo.html)
  * INTERSECT, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html)
  * interval, [Date/Time Types](datatype-datetime.html), [Interval Input](datatype-datetime.html#DATATYPE-INTERVAL-INPUT)

    <!---->

  * output format, [Interval Output](datatype-datetime.html#DATATYPE-INTERVAL-OUTPUT)

    * (see also [formatting](#ientry-idp105553373272959))

      * *   IntervalStyle configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * intset, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
  * int\_array\_aggregate, [Functions](intagg.html#INTAGG-FUNCTIONS)
  * int\_array\_enum, [Functions](intagg.html#INTAGG-FUNCTIONS)
  * inverse distribution, [Aggregate Functions](functions-aggregate.html)
  * in\_hot\_standby configuration parameter, [Preset Options](runtime-config-preset.html)
  * in\_range support functions, [B-Tree Support Functions](btree-support-funcs.html)
  * IS DISTINCT FROM, [Comparison Functions and Operators](functions-comparison.html), [Row and Array Comparisons](functions-comparisons.html)
  * IS DOCUMENT, [IS DOCUMENT](functions-xml.html#FUNCTIONS-PRODUCING-XML-IS-DOCUMENT)
  * IS FALSE, [Comparison Functions and Operators](functions-comparison.html)
  * IS JSON, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
  * IS NOT DISTINCT FROM, [Comparison Functions and Operators](functions-comparison.html), [Row and Array Comparisons](functions-comparisons.html)
  * IS NOT DOCUMENT, [IS NOT DOCUMENT](functions-xml.html#FUNCTIONS-PRODUCING-XML-IS-NOT-DOCUMENT)
  * IS NOT FALSE, [Comparison Functions and Operators](functions-comparison.html)
  * IS NOT NULL, [Comparison Functions and Operators](functions-comparison.html)
  * IS NOT TRUE, [Comparison Functions and Operators](functions-comparison.html)
  * IS NOT UNKNOWN, [Comparison Functions and Operators](functions-comparison.html)
  * IS NULL, [Comparison Functions and Operators](functions-comparison.html), [Platform and Client Compatibility](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-CLIENTS)
  * IS TRUE, [Comparison Functions and Operators](functions-comparison.html)
  * IS UNKNOWN, [Comparison Functions and Operators](functions-comparison.html)
  * isclosed, [Geometric Functions and Operators](functions-geometry.html)
  * isempty, [Range/Multirange Functions and Operators](functions-range.html)
  * isfinite, [Date/Time Functions and Operators](functions-datetime.html)
  * isn, [isn — data types for international standard numbers (ISBN, EAN, UPC, etc.)](isn.html)
  * ISNULL, [Comparison Functions and Operators](functions-comparison.html)
  * isn\_weak, [Functions and Operators](isn.html#ISN-FUNCS-OPS)
  * isopen, [Geometric Functions and Operators](functions-geometry.html)
  * is\_array\_ref

    <!---->

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

* is\_valid, [Functions and Operators](isn.html#ISN-FUNCS-OPS)

### J

  * *   JIT, [Just-in-Time Compilation (JIT)](jit.html)
* jit configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
* jit\_above\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* jit\_debugging\_support configuration parameter, [Developer Options](runtime-config-developer.html)
* jit\_dump\_bitcode configuration parameter, [Developer Options](runtime-config-developer.html)
* jit\_expressions configuration parameter, [Developer Options](runtime-config-developer.html)
* jit\_inline\_above\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* jit\_optimize\_above\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* jit\_profiling\_support configuration parameter, [Developer Options](runtime-config-developer.html)
* jit\_provider configuration parameter, [Shared Library Preloading](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-PRELOAD)
* jit\_tuple\_deforming configuration parameter, [Developer Options](runtime-config-developer.html)
* join, [Joins Between Tables](tutorial-join.html), [Joined Tables](queries-table-expressions.html#QUERIES-JOIN), [Controlling the Planner with Explicit JOIN Clauses](explicit-joins.html)

    <!---->

  * *   controlling the order, [Controlling the Planner with Explicit JOIN Clauses](explicit-joins.html)
  * cross, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * left, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * natural, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * outer, [Joins Between Tables](tutorial-join.html), [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * right, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * self, [Joins Between Tables](tutorial-join.html)

      * *   join\_collapse\_limit configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
* JSON, [JSON Types](datatype-json.html), [JSON Functions and Operators](functions-json.html)

    <!---->

* functions and operators, [JSON Functions and Operators](functions-json.html)

  * *   json constructor, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* JSONB, [JSON Types](datatype-json.html)
* jsonb

    <!---->

  * *   containment, [jsonb Containment and Existence](datatype-json.html#JSON-CONTAINMENT)
  * existence, [jsonb Containment and Existence](datatype-json.html#JSON-CONTAINMENT)
  * indexes on, [jsonb Indexing](datatype-json.html#JSON-INDEXING)

      * *   jsonb\_agg, [Aggregate Functions](functions-aggregate.html)
* jsonb\_agg\_strict, [Aggregate Functions](functions-aggregate.html)
* jsonb\_array\_elements, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_array\_elements\_text, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_array\_length, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_build\_array, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_build\_object, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_each, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_each\_text, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_extract\_path, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_extract\_path\_text, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_insert, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_object, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_object\_agg, [Aggregate Functions](functions-aggregate.html)
* jsonb\_object\_agg\_strict, [Aggregate Functions](functions-aggregate.html)
* jsonb\_object\_agg\_unique, [Aggregate Functions](functions-aggregate.html)
* jsonb\_object\_agg\_unique\_strict, [Aggregate Functions](functions-aggregate.html)
* jsonb\_object\_keys, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_exists, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_exists\_tz, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_match, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_match\_tz, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_query, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_query\_array, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_query\_array\_tz, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_query\_first, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_query\_first\_tz, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_path\_query\_tz, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_populate\_record, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_populate\_recordset, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_pretty, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_set, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_set\_lax, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_strip\_nulls, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_to\_record, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_to\_recordset, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonb\_to\_tsvector, [Text Search Functions and Operators](functions-textsearch.html)
* jsonb\_typeof, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* jsonpath, [jsonpath Type](datatype-json.html#DATATYPE-JSONPATH)
* json\_agg, [Aggregate Functions](functions-aggregate.html)
* json\_agg\_strict, [Aggregate Functions](functions-aggregate.html)
* json\_array, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_arrayagg, [Aggregate Functions](functions-aggregate.html)
* json\_array\_elements, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_array\_elements\_text, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_array\_length, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_build\_array, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_build\_object, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_each, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_each\_text, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_extract\_path, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_extract\_path\_text, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_object, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_objectagg, [Aggregate Functions](functions-aggregate.html)
* json\_object\_agg, [Aggregate Functions](functions-aggregate.html)
* json\_object\_agg\_strict, [Aggregate Functions](functions-aggregate.html)
* json\_object\_agg\_unique, [Aggregate Functions](functions-aggregate.html)
* json\_object\_agg\_unique\_strict, [Aggregate Functions](functions-aggregate.html)
* json\_object\_keys, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_populate\_record, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_populate\_recordset, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_scalar, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_strip\_nulls, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_to\_record, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_to\_recordset, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* json\_to\_tsvector, [Text Search Functions and Operators](functions-textsearch.html)
* json\_typeof, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
* Julian date, [Julian Dates](datetime-julian-dates.html)
* Just-In-Time compilation (see [JIT](#ientry-idp105553641305983))
* justify\_days, [Date/Time Functions and Operators](functions-datetime.html)
* justify\_hours, [Date/Time Functions and Operators](functions-datetime.html)
* justify\_interval, [Date/Time Functions and Operators](functions-datetime.html)

### K

* key word, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS), [SQL Key Words](sql-keywords-appendix.html)

  * *   list of, [SQL Key Words](sql-keywords-appendix.html)
  * syntax of, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

      * *   krb\_caseins\_users configuration parameter, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
  * krb\_server\_keyfile configuration parameter, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)

### L

  * *   label (see [alias](#ientry-idp105553308450815))
* lag, [Window Functions](functions-window.html)
* language\_handler, [Pseudo-Types](datatype-pseudo.html)
* large object, [Large Objects](largeobjects.html)
* lastval, [Sequence Manipulation Functions](functions-sequence.html)
* last\_value, [Window Functions](functions-window.html)
* LATERAL, [LATERAL Subqueries](queries-table-expressions.html#QUERIES-LATERAL)

    <!---->

* in the FROM clause, [LATERAL Subqueries](queries-table-expressions.html#QUERIES-LATERAL)

  * *   latitude, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
* lca, [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
* lcm, [Mathematical Functions and Operators](functions-math.html)
* lc\_messages configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
* lc\_monetary configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
* lc\_numeric configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
* lc\_time configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
* LDAP, [PostgreSQL Features](install-make.html#CONFIGURE-OPTIONS-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES), [LDAP Authentication](auth-ldap.html)
* LDAP connection parameter lookup, [LDAP Lookup of Connection Parameters](libpq-ldap.html)
* ldconfig, [Shared Libraries](install-post.html#INSTALL-POST-SHLIBS)
* lead, [Window Functions](functions-window.html)
* LEAST, [GREATEST and LEAST](functions-conditional.html#FUNCTIONS-GREATEST-LEAST), [UNION, CASE, and Related Constructs](typeconv-union-case.html)

    <!---->

* determination of result type, [UNION, CASE, and Related Constructs](typeconv-union-case.html)

  * *   left, [String Functions and Operators](functions-string.html)
* left join, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
* length, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html), [Geometric Functions and Operators](functions-geometry.html), [Text Search Functions and Operators](functions-textsearch.html)

    <!---->

  * *   of a binary string (see binary strings, length)
  * of a character string (see [character string, length](#ientry-idp105553308273023))

      * *   length(tsvector), [Manipulating Documents](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSVECTOR)
* levenshtein, [Levenshtein](fuzzystrmatch.html#FUZZYSTRMATCH-LEVENSHTEIN)
* levenshtein\_less\_equal, [Levenshtein](fuzzystrmatch.html#FUZZYSTRMATCH-LEVENSHTEIN)
* lex, [Requirements](install-requirements.html)
* libedit, [Requirements](install-requirements.html)

    <!---->

* in psql, [Command-Line Editing](app-psql.html#APP-PSQL-READLINE)

  * *   libperl, [Requirements](install-requirements.html)
* libpq, [libpq — C Library](libpq.html), [Pipeline Mode](libpq-pipeline-mode.html), [Retrieving Query Results Row-by-Row](libpq-single-row-mode.html)

    <!---->

  * *   pipeline mode, [Pipeline Mode](libpq-pipeline-mode.html)
  * single-row mode, [Retrieving Query Results Row-by-Row](libpq-single-row-mode.html)

      * *   libpq-fe.h, [libpq — C Library](libpq.html), [Connection Status Functions](libpq-status.html)
* libpq-int.h, [Connection Status Functions](libpq-status.html)
* libpython, [Requirements](install-requirements.html)
* library initialization function, [Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
* LIKE, [LIKE](functions-matching.html#FUNCTIONS-LIKE)

    <!---->

* and locales, [Behavior](locale.html#LOCALE-BEHAVIOR)

* LIKE\_REGEX, [Differences from SQL Standard and XQuery](functions-matching.html#POSIX-VS-XQUERY), [SQL/JSON Regular Expressions](functions-json.html#JSONPATH-REGULAR-EXPRESSIONS)

  * in SQL/JSON, [SQL/JSON Regular Expressions](functions-json.html#JSONPATH-REGULAR-EXPRESSIONS)

      * *   LIMIT, [LIMIT and OFFSET](queries-limit.html)
  * line, [Lines](datatype-geometric.html#DATATYPE-LINE), [Geometric Functions and Operators](functions-geometry.html)
  * line segment, [Line Segments](datatype-geometric.html#DATATYPE-LSEG)
  * linear regression, [Aggregate Functions](functions-aggregate.html)
  * Linux

    <!---->

      * *   IPC configuration, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
    * shared library, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
    * start script, [Starting the Database Server](server-start.html)

      * *   LISTEN, [LISTEN](sql-listen.html)
  * listen\_addresses configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
  * llvm-config, [PostgreSQL Features](install-make.html#CONFIGURE-OPTIONS-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES)
  * ll\_to\_earth, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
  * ln, [Mathematical Functions and Operators](functions-math.html)
  * lo, [lo — manage large objects](lo.html)
  * LOAD, [LOAD](sql-load.html)
  * load balancing, [High Availability, Load Balancing, and Replication](high-availability.html)
  * locale, [Creating a Database Cluster](creating-cluster.html), [Locale Support](locale.html)
  * localtime, [Date/Time Functions and Operators](functions-datetime.html)
  * localtimestamp, [Date/Time Functions and Operators](functions-datetime.html)
  * local\_preload\_libraries configuration parameter, [Shared Library Preloading](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-PRELOAD)
  * lock, [Explicit Locking](explicit-locking.html), [Advisory Locks](explicit-locking.html#ADVISORY-LOCKS), [Viewing Locks](monitoring-locks.html)

    <!---->

      * *   advisory, [Advisory Locks](explicit-locking.html#ADVISORY-LOCKS)
    * monitoring, [Viewing Locks](monitoring-locks.html)

      * *   LOCK, [Table-Level Locks](explicit-locking.html#LOCKING-TABLES), [LOCK](sql-lock.html)
  * lock\_timeout configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * log, [Mathematical Functions and Operators](functions-math.html)
  * log shipping, [High Availability, Load Balancing, and Replication](high-availability.html)
  * log10, [Mathematical Functions and Operators](functions-math.html)
  * Logging

    <!---->

      * *   current\_logfiles file and the pg\_current\_logfile function, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
    * pg\_current\_logfile function, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)

      * *   logging\_collector configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * Logical Decoding, [Logical Decoding](logicaldecoding.html), [Logical Decoding](logicaldecoding-explanation.html#LOGICALDECODING-EXPLANATION-LOG-DEC)
  * logical\_decoding\_work\_mem configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * login privilege, [Role Attributes](role-attributes.html)
  * log\_autovacuum\_min\_duration

    <!---->

      * *   configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
    * storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)

      * *   log\_btree\_build\_stats configuration parameter, [Developer Options](runtime-config-developer.html)
  * log\_checkpoints configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_connections configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_destination configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * log\_directory configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * log\_disconnections configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_duration configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_error\_verbosity configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_executor\_stats configuration parameter, [Statistics Monitoring](runtime-config-statistics.html#RUNTIME-CONFIG-STATISTICS-MONITOR)
  * log\_filename configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * log\_file\_mode configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * log\_hostname configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_line\_prefix configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_lock\_waits configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_min\_duration\_sample configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_min\_duration\_statement configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_min\_error\_statement configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_min\_messages configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_parameter\_max\_length configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_parameter\_max\_length\_on\_error configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_parser\_stats configuration parameter, [Statistics Monitoring](runtime-config-statistics.html#RUNTIME-CONFIG-STATISTICS-MONITOR)
  * log\_planner\_stats configuration parameter, [Statistics Monitoring](runtime-config-statistics.html#RUNTIME-CONFIG-STATISTICS-MONITOR)
  * log\_recovery\_conflict\_waits configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_replication\_commands configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_rotation\_age configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * log\_rotation\_size configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * log\_startup\_progress\_interval configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_statement configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_statement\_sample\_rate configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_statement\_stats configuration parameter, [Statistics Monitoring](runtime-config-statistics.html#RUNTIME-CONFIG-STATISTICS-MONITOR)
  * log\_temp\_files configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_timezone configuration parameter, [What to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHAT)
  * log\_transaction\_sample\_rate configuration parameter, [When to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHEN)
  * log\_truncate\_on\_rotation configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * longitude, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
  * looks\_like\_number

    <!---->

  * in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)

* loop, [Simple Loops](plpgsql-control-structures.html#PLPGSQL-CONTROL-STRUCTURES-LOOPS)

  * in PL/pgSQL, [Simple Loops](plpgsql-control-structures.html#PLPGSQL-CONTROL-STRUCTURES-LOOPS)

* lower, [String Functions and Operators](functions-string.html), [Range/Multirange Functions and Operators](functions-range.html)

  * and locales, [Behavior](locale.html#LOCALE-BEHAVIOR)

      * *   lower\_inc, [Range/Multirange Functions and Operators](functions-range.html)
  * lower\_inf, [Range/Multirange Functions and Operators](functions-range.html)
  * lo\_close, [Closing a Large Object Descriptor](lo-interfaces.html#LO-CLOSE)
  * lo\_compat\_privileges configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
  * lo\_creat, [Creating a Large Object](lo-interfaces.html#LO-CREATE), [Server-Side Functions](lo-funcs.html)
  * lo\_create, [Creating a Large Object](lo-interfaces.html#LO-CREATE)
  * lo\_export, [Exporting a Large Object](lo-interfaces.html#LO-EXPORT), [Server-Side Functions](lo-funcs.html)
  * lo\_from\_bytea, [Server-Side Functions](lo-funcs.html)
  * lo\_get, [Server-Side Functions](lo-funcs.html)
  * lo\_import, [Importing a Large Object](lo-interfaces.html#LO-IMPORT), [Server-Side Functions](lo-funcs.html)
  * lo\_import\_with\_oid, [Importing a Large Object](lo-interfaces.html#LO-IMPORT)
  * lo\_lseek, [Seeking in a Large Object](lo-interfaces.html#LO-SEEK)
  * lo\_lseek64, [Seeking in a Large Object](lo-interfaces.html#LO-SEEK)
  * lo\_open, [Opening an Existing Large Object](lo-interfaces.html#LO-OPEN)
  * lo\_put, [Server-Side Functions](lo-funcs.html)
  * lo\_read, [Reading Data from a Large Object](lo-interfaces.html#LO-READ)
  * lo\_tell, [Obtaining the Seek Position of a Large Object](lo-interfaces.html#LO-TELL)
  * lo\_tell64, [Obtaining the Seek Position of a Large Object](lo-interfaces.html#LO-TELL)
  * lo\_truncate, [Truncating a Large Object](lo-interfaces.html#LO-TRUNCATE)
  * lo\_truncate64, [Truncating a Large Object](lo-interfaces.html#LO-TRUNCATE)
  * lo\_unlink, [Removing a Large Object](lo-interfaces.html#LO-UNLINK), [Server-Side Functions](lo-funcs.html)
  * lo\_write, [Writing Data to a Large Object](lo-interfaces.html#LO-WRITE)
  * lpad, [String Functions and Operators](functions-string.html)
  * lseg, [Line Segments](datatype-geometric.html#DATATYPE-LSEG), [Geometric Functions and Operators](functions-geometry.html)
  * LSN, [WAL Internals](wal-internals.html)
  * ltree, [ltree — hierarchical tree-like data type](ltree.html)
  * ltree2text, [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
  * ltrim, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html)

### M

  * *   MAC address (see macaddr)
* MAC address (EUI-64 format) (see macaddr)
* macaddr (data type), [macaddr](datatype-net-types.html#DATATYPE-MACADDR)
* macaddr8 (data type), [macaddr8](datatype-net-types.html#DATATYPE-MACADDR8)
* macaddr8\_set7bit, [Network Address Functions and Operators](functions-net.html)
* macOS, [macOS](installation-platform-notes.html#INSTALLATION-NOTES-MACOS)

    <!---->

  * *   installation on, [macOS](installation-platform-notes.html#INSTALLATION-NOTES-MACOS)
  * IPC configuration, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
  * shared library, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)

      * *   magic block, [Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
* maintenance, [Routine Database Maintenance Tasks](maintenance.html)
* maintenance\_io\_concurrency configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* maintenance\_work\_mem configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* make, [Requirements](install-requirements.html)
* makeaclitem, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
* make\_date, [Date/Time Functions and Operators](functions-datetime.html)
* make\_interval, [Date/Time Functions and Operators](functions-datetime.html)
* make\_time, [Date/Time Functions and Operators](functions-datetime.html)
* make\_timestamp, [Date/Time Functions and Operators](functions-datetime.html)
* make\_timestamptz, [Date/Time Functions and Operators](functions-datetime.html)
* make\_valid, [Functions and Operators](isn.html#ISN-FUNCS-OPS)
* MANPATH, [Environment Variables](install-post.html#INSTALL-POST-ENV-VARS)
* masklen, [Network Address Functions and Operators](functions-net.html)
* materialized view, [Materialized Views](rules-materializedviews.html)

    <!---->

* implementation through rules, [Materialized Views](rules-materializedviews.html)

  * *   materialized views, [pg\_matviews](view-pg-matviews.html)
* max, [Aggregate Functions](functions-aggregate.html)
* max\_connections configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
* max\_files\_per\_process configuration parameter, [Kernel Resource Usage](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-KERNEL)
* max\_function\_args configuration parameter, [Preset Options](runtime-config-preset.html)
* max\_identifier\_length configuration parameter, [Preset Options](runtime-config-preset.html)
* max\_index\_keys configuration parameter, [Preset Options](runtime-config-preset.html)
* max\_locks\_per\_transaction configuration parameter, [Lock Management](runtime-config-locks.html)
* max\_logical\_replication\_workers configuration parameter, [Subscribers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SUBSCRIBER)
* max\_parallel\_apply\_workers\_per\_subscription configuration parameter, [Subscribers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SUBSCRIBER)
* max\_parallel\_maintenance\_workers configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* max\_parallel\_workers configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* max\_parallel\_workers\_per\_gather configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* max\_pred\_locks\_per\_page configuration parameter, [Lock Management](runtime-config-locks.html)
* max\_pred\_locks\_per\_relation configuration parameter, [Lock Management](runtime-config-locks.html)
* max\_pred\_locks\_per\_transaction configuration parameter, [Lock Management](runtime-config-locks.html)
* max\_prepared\_transactions configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* max\_replication\_slots configuration parameter

    <!---->

  * *   in a sending server, [Sending Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SENDER)
  * in a subscriber, [Subscribers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SUBSCRIBER)

      * *   max\_slot\_wal\_keep\_size configuration parameter, [Sending Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SENDER)
* max\_stack\_depth configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* max\_standby\_archive\_delay configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* max\_standby\_streaming\_delay configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* max\_sync\_workers\_per\_subscription configuration parameter, [Subscribers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SUBSCRIBER)
* max\_wal\_senders configuration parameter, [Sending Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SENDER)
* max\_wal\_size configuration parameter, [Checkpoints](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS)
* max\_worker\_processes configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* md5, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html)
* MD5, [Password Authentication](auth-password.html)
* median, [Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES)

    <!---->

* (see also [percentile](#ientry-idp105553440428159))

* memory context

  * in SPI, [Memory Management](spi-memory.html)

      * *   memory overcommit, [Linux Memory Overcommit](kernel-resources.html#LINUX-MEMORY-OVERCOMMIT)
  * MERGE, [MERGE](sql-merge.html)
  * Meson, [Requirements](install-requirements.html)
  * metaphone, [Metaphone](fuzzystrmatch.html#FUZZYSTRMATCH-METAPHONE)
  * min, [Aggregate Functions](functions-aggregate.html)
  * MinGW, [MinGW/Native Windows](installation-platform-notes.html#INSTALLATION-NOTES-MINGW)

    <!---->

  * installation on, [MinGW/Native Windows](installation-platform-notes.html#INSTALLATION-NOTES-MINGW)

      * *   min\_dynamic\_shared\_memory configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * min\_parallel\_index\_scan\_size configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
  * min\_parallel\_table\_scan\_size configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
  * min\_scale, [Mathematical Functions and Operators](functions-math.html)
  * min\_wal\_size configuration parameter, [Checkpoints](runtime-config-wal.html#RUNTIME-CONFIG-WAL-CHECKPOINTS)
  * mod, [Mathematical Functions and Operators](functions-math.html)
  * mode

    <!---->

  * statistical, [Aggregate Functions](functions-aggregate.html)

* monitoring, [Monitoring Database Activity](monitoring.html)

  * database activity, [Monitoring Database Activity](monitoring.html)

      * *   MOVE, [MOVE](sql-move.html)
  * moving-aggregate mode, [Moving-Aggregate Mode](xaggr.html#XAGGR-MOVING-AGGREGATES)
  * multirange (function), [Range/Multirange Functions and Operators](functions-range.html)
  * multirange type, [Range Types](rangetypes.html)
  * Multiversion Concurrency Control, [Introduction](mvcc-intro.html)
  * MultiXactId, [Multixacts and Wraparound](routine-vacuuming.html#VACUUM-FOR-MULTIXACT-WRAPAROUND)
  * MVCC, [Introduction](mvcc-intro.html)

### N

* name, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

  * *   qualified, [Creating a Schema](ddl-schemas.html#DDL-SCHEMAS-CREATE)
  * syntax of, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
  * unqualified, [The Schema Search Path](ddl-schemas.html#DDL-SCHEMAS-PATH)

      * *   NaN (see [not a number](#ientry-idp105553306067711))
  * natural join, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * negation, [Logical Operators](functions-logical.html)
  * NetBSD

    <!---->

      * *   IPC configuration, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
    * shared library, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
    * start script, [Starting the Database Server](server-start.html)

      * *   netmask, [Network Address Functions and Operators](functions-net.html)
  * network, [Network Address Types](datatype-net-types.html), [Network Address Functions and Operators](functions-net.html)

    <!---->

  * data types, [Network Address Types](datatype-net-types.html)

      * *   nextval, [Sequence Manipulation Functions](functions-sequence.html)
  * NFS, [NFS](creating-cluster.html#CREATING-CLUSTER-NFS)
  * nlevel, [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
  * non-durable, [Non-Durable Settings](non-durability.html)
  * nonblocking connection, [Database Connection Control Functions](libpq-connect.html), [Asynchronous Command Processing](libpq-async.html)
  * nonrepeatable read, [Transaction Isolation](transaction-iso.html)
  * normalize, [String Functions and Operators](functions-string.html)
  * normalized, [String Functions and Operators](functions-string.html)
  * normal\_rand, [normal\_rand](tablefunc.html#TABLEFUNC-FUNCTIONS-NORMAL-RAND)
  * NOT (operator), [Logical Operators](functions-logical.html)
  * not a number

    <!---->

      * *   floating point, [Floating-Point Types](datatype-numeric.html#DATATYPE-FLOAT)
    * numeric (data type), [Arbitrary Precision Numbers](datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL)

      * *   NOT IN, [Subquery Expressions](functions-subquery.html), [Row and Array Comparisons](functions-comparisons.html)
  * not-null constraint, [Not-Null Constraints](ddl-constraints.html#DDL-CONSTRAINTS-NOT-NULL)
  * notation, [Calling Functions](sql-syntax-calling-funcs.html)

    <!---->

  * functions, [Calling Functions](sql-syntax-calling-funcs.html)

* notice processing, [Notice Processing](libpq-notice-processing.html)

  * in libpq, [Notice Processing](libpq-notice-processing.html)

      * *   notice processor, [Notice Processing](libpq-notice-processing.html)
  * notice receiver, [Notice Processing](libpq-notice-processing.html)
  * NOTIFY, [Asynchronous Notification](libpq-notify.html), [NOTIFY](sql-notify.html)

    <!---->

  * in libpq, [Asynchronous Notification](libpq-notify.html)

      * *   NOTNULL, [Comparison Functions and Operators](functions-comparison.html)
  * now, [Date/Time Functions and Operators](functions-datetime.html)
  * npoints, [Geometric Functions and Operators](functions-geometry.html)
  * nth\_value, [Window Functions](functions-window.html)
  * ntile, [Window Functions](functions-window.html)
  * null value

    <!---->

      * *   with check constraints, [Check Constraints](ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS)
    * comparing, [Comparison Functions and Operators](functions-comparison.html)
    * default value, [Default Values](ddl-default.html)
    * in DISTINCT, [DISTINCT](queries-select-lists.html#QUERIES-DISTINCT)
    * in libpq, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
    * in PL/Perl, [PL/Perl Functions and Arguments](plperl-funcs.html)
    * in PL/Python, [Null, None](plpython-data.html#PLPYTHON-DATA-NULL)
    * with unique constraints, [Unique Constraints](ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)

      * *   NULLIF, [NULLIF](functions-conditional.html#FUNCTIONS-NULLIF)
  * number

    <!---->

  * constant, [Numeric Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS-NUMERIC)

      * *   numeric, [Numeric Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS-NUMERIC)
  * numeric (data type), [Arbitrary Precision Numbers](datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL)
  * numnode, [Text Search Functions and Operators](functions-textsearch.html), [Manipulating Queries](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSQUERY)
  * num\_nonnulls, [Comparison Functions and Operators](functions-comparison.html)
  * num\_nulls, [Comparison Functions and Operators](functions-comparison.html)
  * NVL, [COALESCE](functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL)

### O

* object identifier, [Object Identifier Types](datatype-oid.html)

  * data type, [Object Identifier Types](datatype-oid.html)

      * *   object-oriented database, [Concepts](tutorial-concepts.html)
  * obj\_description, [Comment Information Functions](functions-info.html#FUNCTIONS-INFO-COMMENT)
  * OCCURRENCES\_REGEX, [Differences from SQL Standard and XQuery](functions-matching.html#POSIX-VS-XQUERY)
  * octet\_length, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
  * OFFSET, [LIMIT and OFFSET](queries-limit.html)
  * oid, [Object Identifier Types](datatype-oid.html)
  * OID

    <!---->

  * in libpq, [Retrieving Other Result Information](libpq-exec.html#LIBPQ-EXEC-NONSELECT)

      * *   oid2name, [oid2name](oid2name.html)
  * ON CONFLICT, [INSERT](sql-insert.html)
  * ONLY, [The FROM Clause](queries-table-expressions.html#QUERIES-FROM)
  * OOM, [Linux Memory Overcommit](kernel-resources.html#LINUX-MEMORY-OVERCOMMIT)
  * OpenBSD

    <!---->

      * *   IPC configuration, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
    * shared library, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
    * start script, [Starting the Database Server](server-start.html)

* OpenSSL, [PostgreSQL Features](install-make.html#CONFIGURE-OPTIONS-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES)

  * (see also [SSL](#ientry-idp105553506987391))

* operator, [Operators](sql-syntax-lexical.html#SQL-SYNTAX-OPERATORS), [Operator Precedence](sql-syntax-lexical.html#SQL-PRECEDENCE), [Functions and Operators](functions.html), [Logical Operators](functions-logical.html), [Operators](typeconv-oper.html), [User-Defined Operators](xoper.html)

  * *   invocation, [Operator Invocations](sql-expressions.html#SQL-EXPRESSIONS-OPERATOR-CALLS)
  * logical, [Logical Operators](functions-logical.html)
  * precedence, [Operator Precedence](sql-syntax-lexical.html#SQL-PRECEDENCE)
  * syntax, [Operators](sql-syntax-lexical.html#SQL-SYNTAX-OPERATORS)
  * type resolution in an invocation, [Operators](typeconv-oper.html)
  * user-defined, [User-Defined Operators](xoper.html)

      * *   operator class, [Operator Classes and Operator Families](indexes-opclass.html), [Index Methods and Operator Classes](xindex.html#XINDEX-OPCLASS)
  * operator family, [Operator Classes and Operator Families](indexes-opclass.html), [Operator Classes and Operator Families](xindex.html#XINDEX-OPFAMILY)
  * optimization information, [Function Optimization Information](xfunc-optimization.html), [Operator Optimization Information](xoper-optimization.html)

    <!---->

      * *   for functions, [Function Optimization Information](xfunc-optimization.html)
    * for operators, [Operator Optimization Information](xoper-optimization.html)

      * *   OR (operator), [Logical Operators](functions-logical.html)
  * Oracle, [Porting from Oracle PL/SQL](plpgsql-porting.html)

    <!---->

  * porting from PL/SQL to PL/pgSQL, [Porting from Oracle PL/SQL](plpgsql-porting.html)

* ORDER BY, [Querying a Table](tutorial-select.html), [Sorting Rows (ORDER BY)](queries-order.html)

  * and locales, [Behavior](locale.html#LOCALE-BEHAVIOR)

* ordered-set aggregate, [Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES)

  * built-in, [Aggregate Functions](functions-aggregate.html)

      * *   ordering operator, [System Dependencies on Operator Classes](xindex.html#XINDEX-OPCLASS-DEPENDENCIES)
  * ordinality, [Set Returning Functions](functions-srf.html)
  * outer join, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * output function, [User-Defined Types](xtypes.html)
  * OVER clause, [Window Function Calls](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
  * overcommit, [Linux Memory Overcommit](kernel-resources.html#LINUX-MEMORY-OVERCOMMIT)
  * OVERLAPS, [Date/Time Functions and Operators](functions-datetime.html)
  * overlay, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
  * overloading, [Function Overloading](xfunc-overload.html)

    <!---->

      * *   functions, [Function Overloading](xfunc-overload.html)
    * operators, [User-Defined Operators](xoper.html)

* owner, [Privileges](ddl-priv.html)

### P

  * *   pageinspect, [pageinspect — low-level inspection of database pages](pageinspect.html)
* pages\_per\_range storage parameter, [Index Storage Parameters](sql-createindex.html#SQL-CREATEINDEX-STORAGE-PARAMETERS)
* page\_checksum, [General Functions](pageinspect.html#PAGEINSPECT-GENERAL-FUNCS)
* page\_header, [General Functions](pageinspect.html#PAGEINSPECT-GENERAL-FUNCS)
* palloc, [Writing Code](xfunc-c.html#XFUNC-C-CODE)
* PAM, [PostgreSQL Features](install-make.html#CONFIGURE-OPTIONS-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES), [PAM Authentication](auth-pam.html)
* parallel query, [Parallel Query](parallel-query.html)
* parallel\_leader\_participation configuration parameter, [Asynchronous Behavior](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)
* parallel\_setup\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* parallel\_tuple\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* parallel\_workers storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
* parameter

    <!---->

* syntax, [Positional Parameters](sql-expressions.html#SQL-EXPRESSIONS-PARAMETERS-POSITIONAL)

  * *   parenthesis, [Value Expressions](sql-expressions.html)
* parse\_ident, [String Functions and Operators](functions-string.html)
* partition pruning, [Partition Pruning](ddl-partitioning.html#DDL-PARTITION-PRUNING)
* partitioned table, [Table Partitioning](ddl-partitioning.html)
* partitioning, [Table Partitioning](ddl-partitioning.html)
* password, [Role Attributes](role-attributes.html)

    <!---->

  * *   authentication, [Password Authentication](auth-password.html)
  * of the superuser, [Creating a Database Cluster](creating-cluster.html)

      * *   password file, [The Password File](libpq-pgpass.html)
* passwordcheck, [passwordcheck — verify password strength](passwordcheck.html)
* password\_encryption configuration parameter, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
* path, [Geometric Functions and Operators](functions-geometry.html)

    <!---->

* for schemas, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

  * *   PATH, [Environment Variables](install-post.html#INSTALL-POST-ENV-VARS)
* path (data type), [Paths](datatype-geometric.html#DATATYPE-GEOMETRIC-PATHS)
* pattern matching, [Pattern Matching](functions-matching.html)
* patterns

    <!---->

* in psql and pg\_dump, [Patterns](app-psql.html#APP-PSQL-PATTERNS)

  * *   pclose, [Geometric Functions and Operators](functions-geometry.html)
* peer, [Peer Authentication](auth-peer.html)
* percentile

    <!---->

  * *   continuous, [Aggregate Functions](functions-aggregate.html)
  * discrete, [Aggregate Functions](functions-aggregate.html)

* percent\_rank, [Window Functions](functions-window.html)

  * hypothetical, [Aggregate Functions](functions-aggregate.html)

      * *   performance, [Performance Tips](performance-tips.html)
  * perl, [Requirements](install-requirements.html)
  * Perl, [PL/Perl — Perl Procedural Language](plperl.html)
  * permission (see [privilege](#ientry-idp105553307467775))
  * pfree, [Writing Code](xfunc-c.html#XFUNC-C-CODE)
  * PGAPPNAME, [Environment Variables](libpq-envars.html)
  * pgbench, [pgbench](pgbench.html)
  * PGcancel, [Canceling Queries in Progress](libpq-cancel.html)
  * PGCHANNELBINDING, [Environment Variables](libpq-envars.html)
  * PGCLIENTENCODING, [Environment Variables](libpq-envars.html)
  * PGconn, [Database Connection Control Functions](libpq-connect.html)
  * PGCONNECT\_TIMEOUT, [Environment Variables](libpq-envars.html)
  * pgcrypto, [pgcrypto — cryptographic functions](pgcrypto.html)
  * PGDATA, [Creating a Database Cluster](creating-cluster.html)
  * PGDATABASE, [Environment Variables](libpq-envars.html)
  * PGDATESTYLE, [Environment Variables](libpq-envars.html)
  * PGEventProc, [Event Callback Procedure](libpq-events.html#LIBPQ-EVENTS-PROC)
  * PGGEQO, [Environment Variables](libpq-envars.html)
  * PGGSSDELEGATION, [Environment Variables](libpq-envars.html)
  * PGGSSENCMODE, [Environment Variables](libpq-envars.html)
  * PGGSSLIB, [Environment Variables](libpq-envars.html)
  * PGHOST, [Environment Variables](libpq-envars.html)
  * PGHOSTADDR, [Environment Variables](libpq-envars.html)
  * PGKRBSRVNAME, [Environment Variables](libpq-envars.html)
  * PGLOADBALANCEHOSTS, [Environment Variables](libpq-envars.html)
  * PGLOCALEDIR, [Environment Variables](libpq-envars.html)
  * PGOPTIONS, [Environment Variables](libpq-envars.html)
  * PGPASSFILE, [Environment Variables](libpq-envars.html)
  * PGPASSWORD, [Environment Variables](libpq-envars.html)
  * PGPORT, [Environment Variables](libpq-envars.html)
  * pgp\_armor\_headers, [pgp\_armor\_headers](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-ARMOR-HEADERS)
  * pgp\_key\_id, [pgp\_key\_id()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-KEY-ID)
  * pgp\_pub\_decrypt, [pgp\_pub\_decrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-PUB-DECRYPT)
  * pgp\_pub\_decrypt\_bytea, [pgp\_pub\_decrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-PUB-DECRYPT)
  * pgp\_pub\_encrypt, [pgp\_pub\_encrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-PUB-ENCRYPT)
  * pgp\_pub\_encrypt\_bytea, [pgp\_pub\_encrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-PUB-ENCRYPT)
  * pgp\_sym\_decrypt, [pgp\_sym\_decrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-DECRYPT)
  * pgp\_sym\_decrypt\_bytea, [pgp\_sym\_decrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-DECRYPT)
  * pgp\_sym\_encrypt, [pgp\_sym\_encrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-ENCRYPT)
  * pgp\_sym\_encrypt\_bytea, [pgp\_sym\_encrypt()](pgcrypto.html#PGCRYPTO-PGP-ENC-FUNCS-PGP-SYM-ENCRYPT)
  * PGREQUIREAUTH, [Environment Variables](libpq-envars.html)
  * PGREQUIREPEER, [Environment Variables](libpq-envars.html)
  * PGREQUIRESSL, [Environment Variables](libpq-envars.html)
  * PGresult, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * pgrowlocks, [pgrowlocks — show a table's row locking information](pgrowlocks.html), [Overview](pgrowlocks.html#PGROWLOCKS-OVERVIEW)
  * PGSERVICE, [Environment Variables](libpq-envars.html)
  * PGSERVICEFILE, [Environment Variables](libpq-envars.html)
  * PGSSLCERT, [Environment Variables](libpq-envars.html)
  * PGSSLCERTMODE, [Environment Variables](libpq-envars.html)
  * PGSSLCOMPRESSION, [Environment Variables](libpq-envars.html)
  * PGSSLCRL, [Environment Variables](libpq-envars.html)
  * PGSSLCRLDIR, [Environment Variables](libpq-envars.html)
  * PGSSLKEY, [Environment Variables](libpq-envars.html)
  * PGSSLMAXPROTOCOLVERSION, [Environment Variables](libpq-envars.html)
  * PGSSLMINPROTOCOLVERSION, [Environment Variables](libpq-envars.html)
  * PGSSLMODE, [Environment Variables](libpq-envars.html)
  * PGSSLROOTCERT, [Environment Variables](libpq-envars.html)
  * PGSSLSNI, [Environment Variables](libpq-envars.html)
  * pgstatginindex, [Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
  * pgstathashindex, [Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
  * pgstatindex, [Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
  * pgstattuple, [pgstattuple — obtain tuple-level statistics](pgstattuple.html), [Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
  * pgstattuple\_approx, [Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
  * PGSYSCONFDIR, [Environment Variables](libpq-envars.html)
  * PGTARGETSESSIONATTRS, [Environment Variables](libpq-envars.html)
  * PGTZ, [Environment Variables](libpq-envars.html)
  * PGUSER, [Environment Variables](libpq-envars.html)
  * pgxs, [Extension Building Infrastructure](extend-pgxs.html)
  * pg\_advisory\_lock, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_advisory\_lock\_shared, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_advisory\_unlock, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_advisory\_unlock\_all, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_advisory\_unlock\_shared, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_advisory\_xact\_lock, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_advisory\_xact\_lock\_shared, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_aggregate, [pg\_aggregate](catalog-pg-aggregate.html)
  * pg\_am, [pg\_am](catalog-pg-am.html)
  * pg\_amcheck, [pg\_amcheck](app-pgamcheck.html)
  * pg\_amop, [pg\_amop](catalog-pg-amop.html)
  * pg\_amproc, [pg\_amproc](catalog-pg-amproc.html)
  * pg\_archivecleanup, [pg\_archivecleanup](pgarchivecleanup.html)
  * pg\_attrdef, [pg\_attrdef](catalog-pg-attrdef.html)
  * pg\_attribute, [pg\_attribute](catalog-pg-attribute.html)
  * pg\_authid, [pg\_authid](catalog-pg-authid.html)
  * pg\_auth\_members, [pg\_auth\_members](catalog-pg-auth-members.html)
  * pg\_available\_extensions, [pg\_available\_extensions](view-pg-available-extensions.html)
  * pg\_available\_extension\_versions, [pg\_available\_extension\_versions](view-pg-available-extension-versions.html)
  * pg\_backend\_memory\_contexts, [pg\_backend\_memory\_contexts](view-pg-backend-memory-contexts.html)
  * pg\_backend\_pid, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_backup\_start, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_backup\_stop, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_basebackup, [pg\_basebackup](app-pgbasebackup.html)
  * pg\_blocking\_pids, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_buffercache, [pg\_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache.html)
  * pg\_buffercache\_pages, [pg\_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache.html)
  * pg\_buffercache\_summary, [pg\_buffercache — inspect PostgreSQL buffer cache state](pgbuffercache.html)
  * pg\_cancel\_backend, [Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)
  * pg\_cast, [pg\_cast](catalog-pg-cast.html)
  * pg\_char\_to\_encoding, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_checksums, [pg\_checksums](app-pgchecksums.html)
  * pg\_class, [pg\_class](catalog-pg-class.html)
  * pg\_client\_encoding, [String Functions and Operators](functions-string.html)
  * pg\_collation, [pg\_collation](catalog-pg-collation.html)
  * pg\_collation\_actual\_version, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_collation\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * PG\_COLOR, [When Color is Used](color-when.html)
  * PG\_COLORS, [Configuring the Colors](color-which.html)
  * pg\_column\_compression, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_column\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_config, [pg\_config](app-pgconfig.html), [pg\_config](view-pg-config.html)

    <!---->

      * *   with ecpg, [Processing Embedded SQL Programs](ecpg-process.html)
    * with libpq, [Building libpq Programs](libpq-build.html)
    * with user-defined C functions, [Writing Code](xfunc-c.html#XFUNC-C-CODE)

      * *   pg\_conf\_load\_time, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_constraint, [pg\_constraint](catalog-pg-constraint.html)
  * pg\_controldata, [pg\_controldata](app-pgcontroldata.html)
  * pg\_control\_checkpoint, [Control Data Functions](functions-info.html#FUNCTIONS-INFO-CONTROLDATA)
  * pg\_control\_init, [Control Data Functions](functions-info.html#FUNCTIONS-INFO-CONTROLDATA)
  * pg\_control\_recovery, [Control Data Functions](functions-info.html#FUNCTIONS-INFO-CONTROLDATA)
  * pg\_control\_system, [Control Data Functions](functions-info.html#FUNCTIONS-INFO-CONTROLDATA)
  * pg\_conversion, [pg\_conversion](catalog-pg-conversion.html)
  * pg\_conversion\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_copy\_logical\_replication\_slot, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_copy\_physical\_replication\_slot, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_create\_logical\_replication\_slot, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_create\_physical\_replication\_slot, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_create\_restore\_point, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_ctl, [Creating a Database Cluster](creating-cluster.html), [Starting the Database Server](server-start.html), [pg\_ctl](app-pg-ctl.html)
  * pg\_current\_logfile, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_current\_snapshot, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_current\_wal\_flush\_lsn, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_current\_wal\_insert\_lsn, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_current\_wal\_lsn, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_current\_xact\_id, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_current\_xact\_id\_if\_assigned, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_cursors, [pg\_cursors](view-pg-cursors.html)
  * pg\_database, [Template Databases](manage-ag-templatedbs.html), [pg\_database](catalog-pg-database.html)
  * pg\_database\_collation\_actual\_version, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_database\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_db\_role\_setting, [pg\_db\_role\_setting](catalog-pg-db-role-setting.html)
  * pg\_ddl\_command, [Pseudo-Types](datatype-pseudo.html)
  * pg\_default\_acl, [pg\_default\_acl](catalog-pg-default-acl.html)
  * pg\_depend, [pg\_depend](catalog-pg-depend.html)
  * pg\_describe\_object, [Object Information and Addressing Functions](functions-info.html#FUNCTIONS-INFO-OBJECT)
  * pg\_description, [pg\_description](catalog-pg-description.html)
  * pg\_drop\_replication\_slot, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_dump, [pg\_dump](app-pgdump.html)
  * pg\_dumpall, [pg\_dumpall](app-pg-dumpall.html)

    <!---->

  * use during upgrade, [Upgrading Data via pg\_dumpall](upgrading.html#UPGRADING-VIA-PGDUMPALL)

      * *   pg\_encoding\_to\_char, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_enum, [pg\_enum](catalog-pg-enum.html)
  * pg\_event\_trigger, [pg\_event\_trigger](catalog-pg-event-trigger.html)
  * pg\_event\_trigger\_ddl\_commands, [Capturing Changes at Command End](functions-event-triggers.html#PG-EVENT-TRIGGER-DDL-COMMAND-END-FUNCTIONS)
  * pg\_event\_trigger\_dropped\_objects, [Processing Objects Dropped by a DDL Command](functions-event-triggers.html#PG-EVENT-TRIGGER-SQL-DROP-FUNCTIONS)
  * pg\_event\_trigger\_table\_rewrite\_oid, [Handling a Table Rewrite Event](functions-event-triggers.html#PG-EVENT-TRIGGER-TABLE-REWRITE-FUNCTIONS)
  * pg\_event\_trigger\_table\_rewrite\_reason, [Handling a Table Rewrite Event](functions-event-triggers.html#PG-EVENT-TRIGGER-TABLE-REWRITE-FUNCTIONS)
  * pg\_export\_snapshot, [Snapshot Synchronization Functions](functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION)
  * pg\_extension, [pg\_extension](catalog-pg-extension.html)
  * pg\_extension\_config\_dump, [Extension Configuration Tables](extend-extensions.html#EXTEND-EXTENSIONS-CONFIG-TABLES)
  * pg\_filenode\_relation, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_file\_rename, [adminpack — pgAdmin support toolpack](adminpack.html)
  * pg\_file\_settings, [pg\_file\_settings](view-pg-file-settings.html)
  * pg\_file\_sync, [adminpack — pgAdmin support toolpack](adminpack.html)
  * pg\_file\_unlink, [adminpack — pgAdmin support toolpack](adminpack.html)
  * pg\_file\_write, [adminpack — pgAdmin support toolpack](adminpack.html)
  * pg\_foreign\_data\_wrapper, [pg\_foreign\_data\_wrapper](catalog-pg-foreign-data-wrapper.html)
  * pg\_foreign\_server, [pg\_foreign\_server](catalog-pg-foreign-server.html)
  * pg\_foreign\_table, [pg\_foreign\_table](catalog-pg-foreign-table.html)
  * pg\_freespace, [Functions](pgfreespacemap.html#PGFREESPACEMAP-FUNCS)
  * pg\_freespacemap, [pg\_freespacemap — examine the free space map](pgfreespacemap.html)
  * pg\_function\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_get\_catalog\_foreign\_keys, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_constraintdef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_expr, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_functiondef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_function\_arguments, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_function\_identity\_arguments, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_function\_result, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_indexdef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_keywords, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_object\_address, [Object Information and Addressing Functions](functions-info.html#FUNCTIONS-INFO-OBJECT)
  * pg\_get\_partkeydef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_ruledef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_serial\_sequence, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_statisticsobjdef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_triggerdef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_userbyid, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_viewdef, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_get\_wal\_replay\_pause\_state, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_get\_wal\_resource\_managers, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_group, [pg\_group](view-pg-group.html)
  * pg\_has\_role, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
  * pg\_hba.conf, [The pg\_hba.conf File](auth-pg-hba-conf.html)
  * pg\_hba\_file\_rules, [pg\_hba\_file\_rules](view-pg-hba-file-rules.html)
  * pg\_ident.conf, [User Name Maps](auth-username-maps.html)
  * pg\_identify\_object, [Object Information and Addressing Functions](functions-info.html#FUNCTIONS-INFO-OBJECT)
  * pg\_identify\_object\_as\_address, [Object Information and Addressing Functions](functions-info.html#FUNCTIONS-INFO-OBJECT)
  * pg\_ident\_file\_mappings, [pg\_ident\_file\_mappings](view-pg-ident-file-mappings.html)
  * pg\_import\_system\_collations, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_index, [pg\_index](catalog-pg-index.html)
  * pg\_indexam\_has\_property, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_indexes, [pg\_indexes](view-pg-indexes.html)
  * pg\_indexes\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_index\_column\_has\_property, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_index\_has\_property, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_inherits, [pg\_inherits](catalog-pg-inherits.html)
  * pg\_init\_privs, [pg\_init\_privs](catalog-pg-init-privs.html)
  * pg\_input\_error\_info, [Data Validity Checking Functions](functions-info.html#FUNCTIONS-INFO-VALIDITY)
  * pg\_input\_is\_valid, [Data Validity Checking Functions](functions-info.html#FUNCTIONS-INFO-VALIDITY)
  * pg\_isready, [pg\_isready](app-pg-isready.html)
  * pg\_is\_in\_recovery, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_is\_other\_temp\_schema, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_is\_wal\_replay\_paused, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_jit\_available, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_language, [pg\_language](catalog-pg-language.html)
  * pg\_largeobject, [pg\_largeobject](catalog-pg-largeobject.html)
  * pg\_largeobject\_metadata, [pg\_largeobject\_metadata](catalog-pg-largeobject-metadata.html)
  * pg\_last\_committed\_xact, [Committed Transaction Information Functions](functions-info.html#FUNCTIONS-INFO-COMMIT-TIMESTAMP)
  * pg\_last\_wal\_receive\_lsn, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_last\_wal\_replay\_lsn, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_last\_xact\_replay\_timestamp, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_listening\_channels, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_locks, [pg\_locks](view-pg-locks.html)
  * pg\_logdir\_ls, [adminpack — pgAdmin support toolpack](adminpack.html)
  * pg\_logical\_emit\_message, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_logical\_slot\_get\_binary\_changes, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_logical\_slot\_get\_changes, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_logical\_slot\_peek\_binary\_changes, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_logical\_slot\_peek\_changes, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_log\_backend\_memory\_contexts, [Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)
  * pg\_log\_standby\_snapshot, [Snapshot Synchronization Functions](functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION)
  * pg\_lsn, [pg\_lsn Type](datatype-pg-lsn.html)
  * pg\_ls\_archive\_statusdir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_dir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_logdir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_logicalmapdir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_logicalsnapdir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_replslotdir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_tmpdir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_ls\_waldir, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_matviews, [pg\_matviews](view-pg-matviews.html)
  * pg\_mcv\_list\_items, [Inspecting MCV Lists](functions-statistics.html#FUNCTIONS-STATISTICS-MCV)
  * pg\_my\_temp\_schema, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_namespace, [pg\_namespace](catalog-pg-namespace.html)
  * pg\_notification\_queue\_usage, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_notify, [pg\_notify](sql-notify.html#id-1.9.3.158.7.5)
  * pg\_opclass, [pg\_opclass](catalog-pg-opclass.html)
  * pg\_opclass\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_operator, [pg\_operator](catalog-pg-operator.html)
  * pg\_operator\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_opfamily, [pg\_opfamily](catalog-pg-opfamily.html)
  * pg\_opfamily\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_options\_to\_table, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_parameter\_acl, [pg\_parameter\_acl](catalog-pg-parameter-acl.html)
  * pg\_partitioned\_table, [pg\_partitioned\_table](catalog-pg-partitioned-table.html)
  * pg\_partition\_ancestors, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_partition\_root, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_partition\_tree, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_policies, [pg\_policies](view-pg-policies.html)
  * pg\_policy, [pg\_policy](catalog-pg-policy.html)
  * pg\_postmaster\_start\_time, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_prepared\_statements, [pg\_prepared\_statements](view-pg-prepared-statements.html)
  * pg\_prepared\_xacts, [pg\_prepared\_xacts](view-pg-prepared-xacts.html)
  * pg\_prewarm, [pg\_prewarm — preload relation data into buffer caches](pgprewarm.html)
  * pg\_prewarm.autoprewarm configuration parameter, [Configuration Parameters](pgprewarm.html#PGPREWARM-CONFIG-PARAMS)
  * pg\_prewarm.autoprewarm\_interval configuration parameter, [Configuration Parameters](pgprewarm.html#PGPREWARM-CONFIG-PARAMS)
  * pg\_proc, [pg\_proc](catalog-pg-proc.html)
  * pg\_promote, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_publication, [pg\_publication](catalog-pg-publication.html)
  * pg\_publication\_namespace, [pg\_publication\_namespace](catalog-pg-publication-namespace.html)
  * pg\_publication\_rel, [pg\_publication\_rel](catalog-pg-publication-rel.html)
  * pg\_publication\_tables, [pg\_publication\_tables](view-pg-publication-tables.html)
  * pg\_range, [pg\_range](catalog-pg-range.html)
  * pg\_read\_binary\_file, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_read\_file, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_receivewal, [pg\_receivewal](app-pgreceivewal.html)
  * pg\_receivexlog, [pg\_receivexlog renamed to pg\_receivewal](app-pgreceivexlog.html) (see [pg\_receivewal](#ientry-idp105554114105855))
  * pg\_recvlogical, [pg\_recvlogical](app-pgrecvlogical.html)
  * pg\_relation\_filenode, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_relation\_filepath, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_relation\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_reload\_conf, [Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)
  * pg\_relpages, [Functions](pgstattuple.html#PGSTATTUPLE-FUNCS)
  * pg\_replication\_origin, [pg\_replication\_origin](catalog-pg-replication-origin.html)
  * pg\_replication\_origin\_advance, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_create, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_drop, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_oid, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_progress, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_session\_is\_setup, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_session\_progress, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_session\_reset, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_session\_setup, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_status, [pg\_replication\_origin\_status](view-pg-replication-origin-status.html)
  * pg\_replication\_origin\_xact\_reset, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_origin\_xact\_setup, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_replication\_slots, [pg\_replication\_slots](view-pg-replication-slots.html)
  * pg\_replication\_slot\_advance, [Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
  * pg\_resetwal, [pg\_resetwal](app-pgresetwal.html)
  * pg\_resetxlog, [pg\_resetxlog renamed to pg\_resetwal](app-pgresetxlog.html) (see [pg\_resetwal](#ientry-idp105554110329471))
  * pg\_restore, [pg\_restore](app-pgrestore.html)
  * pg\_rewind, [pg\_rewind](app-pgrewind.html)
  * pg\_rewrite, [pg\_rewrite](catalog-pg-rewrite.html)
  * pg\_roles, [pg\_roles](view-pg-roles.html)
  * pg\_rotate\_logfile, [Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)
  * pg\_rules, [pg\_rules](view-pg-rules.html)
  * pg\_safe\_snapshot\_blocking\_pids, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_seclabel, [pg\_seclabel](catalog-pg-seclabel.html)
  * pg\_seclabels, [pg\_seclabels](view-pg-seclabels.html)
  * pg\_sequence, [pg\_sequence](catalog-pg-sequence.html)
  * pg\_sequences, [pg\_sequences](view-pg-sequences.html)
  * pg\_service.conf, [The Connection Service File](libpq-pgservice.html)
  * pg\_settings, [pg\_settings](view-pg-settings.html)
  * pg\_settings\_get\_flags, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_shadow, [pg\_shadow](view-pg-shadow.html)
  * pg\_shdepend, [pg\_shdepend](catalog-pg-shdepend.html)
  * pg\_shdescription, [pg\_shdescription](catalog-pg-shdescription.html)
  * pg\_shmem\_allocations, [pg\_shmem\_allocations](view-pg-shmem-allocations.html)
  * pg\_shseclabel, [pg\_shseclabel](catalog-pg-shseclabel.html)
  * pg\_size\_bytes, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_size\_pretty, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_sleep, [Delaying Execution](functions-datetime.html#FUNCTIONS-DATETIME-DELAY)
  * pg\_sleep\_for, [Delaying Execution](functions-datetime.html#FUNCTIONS-DATETIME-DELAY)
  * pg\_sleep\_until, [Delaying Execution](functions-datetime.html#FUNCTIONS-DATETIME-DELAY)
  * pg\_snapshot\_xip, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_snapshot\_xmax, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_snapshot\_xmin, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_split\_walfile\_name, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_statio\_all\_indexes, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_statio\_all\_indexes](monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)
  * pg\_statio\_all\_sequences, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_statio\_all\_sequences](monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)
  * pg\_statio\_all\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_statio\_all\_tables](monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)
  * pg\_statio\_sys\_indexes, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_statio\_sys\_sequences, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_statio\_sys\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_statio\_user\_indexes, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_statio\_user\_sequences, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_statio\_user\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_statistic, [Single-Column Statistics](planner-stats.html#PLANNER-STATS-SINGLE-COLUMN), [pg\_statistic](catalog-pg-statistic.html)
  * pg\_statistics\_obj\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_statistic\_ext, [Extended Statistics](planner-stats.html#PLANNER-STATS-EXTENDED), [pg\_statistic\_ext](catalog-pg-statistic-ext.html)
  * pg\_statistic\_ext\_data, [Extended Statistics](planner-stats.html#PLANNER-STATS-EXTENDED), [pg\_statistic\_ext](catalog-pg-statistic-ext.html)
  * pg\_stats, [Single-Column Statistics](planner-stats.html#PLANNER-STATS-SINGLE-COLUMN), [pg\_stats](view-pg-stats.html)
  * pg\_stats\_ext, [pg\_stats\_ext](view-pg-stats-ext.html)
  * pg\_stats\_ext\_exprs, [pg\_stats\_ext\_exprs](view-pg-stats-ext-exprs.html)
  * pg\_stat\_activity, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_activity](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)
  * pg\_stat\_all\_indexes, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_all\_indexes](monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
  * pg\_stat\_all\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_all\_tables](monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)
  * pg\_stat\_archiver, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_archiver](monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW)
  * pg\_stat\_bgwriter, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_bgwriter](monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW)
  * pg\_stat\_clear\_snapshot, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_database, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_database](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW)
  * pg\_stat\_database\_conflicts, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_database\_conflicts](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)
  * pg\_stat\_file, [Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
  * pg\_stat\_get\_activity, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_activity, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_activity\_start, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_client\_addr, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_client\_port, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_dbid, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_idset, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_pid, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_start, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_subxact, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_userid, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_wait\_event, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_wait\_event\_type, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_backend\_xact\_start, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_snapshot\_timestamp, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_xact\_blocks\_fetched, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_get\_xact\_blocks\_hit, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_gssapi, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_gssapi](monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW)
  * pg\_stat\_io, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_io](monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW)
  * pg\_stat\_progress\_analyze, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [ANALYZE Progress Reporting](progress-reporting.html#ANALYZE-PROGRESS-REPORTING)
  * pg\_stat\_progress\_basebackup, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [Base Backup Progress Reporting](progress-reporting.html#BASEBACKUP-PROGRESS-REPORTING)
  * pg\_stat\_progress\_cluster, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [CLUSTER Progress Reporting](progress-reporting.html#CLUSTER-PROGRESS-REPORTING)
  * pg\_stat\_progress\_copy, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [COPY Progress Reporting](progress-reporting.html#COPY-PROGRESS-REPORTING)
  * pg\_stat\_progress\_create\_index, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [CREATE INDEX Progress Reporting](progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)
  * pg\_stat\_progress\_vacuum, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [VACUUM Progress Reporting](progress-reporting.html#VACUUM-PROGRESS-REPORTING)
  * pg\_stat\_recovery\_prefetch, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_recovery\_prefetch](monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH)
  * pg\_stat\_replication, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_replication](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW)
  * pg\_stat\_replication\_slots, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_replication\_slots](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)
  * pg\_stat\_reset, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_reset\_replication\_slot, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_reset\_shared, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_reset\_single\_function\_counters, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_reset\_single\_table\_counters, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_reset\_slru, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_reset\_subscription\_stats, [Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)
  * pg\_stat\_slru, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_slru](monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW)
  * pg\_stat\_ssl, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_ssl](monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW)
  * pg\_stat\_statements, [pg\_stat\_statements — track statistics of SQL planning and execution](pgstatstatements.html)

    <!---->

  * function, [Functions](pgstatstatements.html#PGSTATSTATEMENTS-FUNCS)

      * *   pg\_stat\_statements.max configuration parameter, [Configuration Parameters](pgstatstatements.html#PGSTATSTATEMENTS-CONFIG-PARAMS)
  * pg\_stat\_statements.save configuration parameter, [Configuration Parameters](pgstatstatements.html#PGSTATSTATEMENTS-CONFIG-PARAMS)
  * pg\_stat\_statements.track configuration parameter, [Configuration Parameters](pgstatstatements.html#PGSTATSTATEMENTS-CONFIG-PARAMS)
  * pg\_stat\_statements.track\_planning configuration parameter, [Configuration Parameters](pgstatstatements.html#PGSTATSTATEMENTS-CONFIG-PARAMS)
  * pg\_stat\_statements.track\_utility configuration parameter, [Configuration Parameters](pgstatstatements.html#PGSTATSTATEMENTS-CONFIG-PARAMS)
  * pg\_stat\_statements\_info, [The pg\_stat\_statements\_info View](pgstatstatements.html#PGSTATSTATEMENTS-PG-STAT-STATEMENTS-INFO)
  * pg\_stat\_statements\_reset, [Functions](pgstatstatements.html#PGSTATSTATEMENTS-FUNCS)
  * pg\_stat\_subscription, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_subscription](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION)
  * pg\_stat\_subscription\_stats, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_subscription\_stats](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS)
  * pg\_stat\_sys\_indexes, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_sys\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_user\_functions, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_user\_functions](monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)
  * pg\_stat\_user\_indexes, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_user\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_wal, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_wal](monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW)
  * pg\_stat\_wal\_receiver, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS), [pg\_stat\_wal\_receiver](monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)
  * pg\_stat\_xact\_all\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_xact\_sys\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_xact\_user\_functions, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_stat\_xact\_user\_tables, [Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * pg\_subscription, [pg\_subscription](catalog-pg-subscription.html)
  * pg\_subscription\_rel, [pg\_subscription\_rel](catalog-pg-subscription-rel.html)
  * pg\_surgery, [pg\_surgery — perform low-level surgery on relation data](pgsurgery.html)
  * pg\_switch\_wal, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_tables, [pg\_tables](view-pg-tables.html)
  * pg\_tablespace, [pg\_tablespace](catalog-pg-tablespace.html)
  * pg\_tablespace\_databases, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_tablespace\_location, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_tablespace\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_table\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_table\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_temp, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

    <!---->

  * securing functions, [Writing SECURITY DEFINER Functions Safely](sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)

      * *   pg\_terminate\_backend, [Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)
  * pg\_test\_fsync, [pg\_test\_fsync](pgtestfsync.html)
  * pg\_test\_timing, [pg\_test\_timing](pgtesttiming.html)
  * pg\_timezone\_abbrevs, [pg\_timezone\_abbrevs](view-pg-timezone-abbrevs.html)
  * pg\_timezone\_names, [pg\_timezone\_names](view-pg-timezone-names.html)
  * pg\_total\_relation\_size, [Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
  * pg\_transform, [pg\_transform](catalog-pg-transform.html)
  * pg\_trgm, [pg\_trgm — support for similarity of text using trigram matching](pgtrgm.html)
  * pg\_trgm.similarity\_threshold configuration parameter, [GUC Parameters](pgtrgm.html#PGTRGM-GUC)
  * pg\_trgm.strict\_word\_similarity\_threshold configuration parameter, [GUC Parameters](pgtrgm.html#PGTRGM-GUC)
  * pg\_trgm.word\_similarity\_threshold configuration parameter, [GUC Parameters](pgtrgm.html#PGTRGM-GUC)
  * pg\_trigger, [pg\_trigger](catalog-pg-trigger.html)
  * pg\_trigger\_depth, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * pg\_try\_advisory\_lock, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_try\_advisory\_lock\_shared, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_try\_advisory\_xact\_lock, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_try\_advisory\_xact\_lock\_shared, [Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
  * pg\_ts\_config, [pg\_ts\_config](catalog-pg-ts-config.html)
  * pg\_ts\_config\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_ts\_config\_map, [pg\_ts\_config\_map](catalog-pg-ts-config-map.html)
  * pg\_ts\_dict, [pg\_ts\_dict](catalog-pg-ts-dict.html)
  * pg\_ts\_dict\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_ts\_parser, [pg\_ts\_parser](catalog-pg-ts-parser.html)
  * pg\_ts\_parser\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_ts\_template, [pg\_ts\_template](catalog-pg-ts-template.html)
  * pg\_ts\_template\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_type, [pg\_type](catalog-pg-type.html)
  * pg\_typeof, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * pg\_type\_is\_visible, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
  * pg\_upgrade, [pg\_upgrade](pgupgrade.html)
  * pg\_user, [pg\_user](view-pg-user.html)
  * pg\_user\_mapping, [pg\_user\_mapping](catalog-pg-user-mapping.html)
  * pg\_user\_mappings, [pg\_user\_mappings](view-pg-user-mappings.html)
  * pg\_verifybackup, [pg\_verifybackup](app-pgverifybackup.html)
  * pg\_views, [pg\_views](view-pg-views.html)
  * pg\_visibility, [pg\_visibility — visibility map information and utilities](pgvisibility.html)
  * pg\_visible\_in\_snapshot, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_wait\_events, [pg\_wait\_events](view-pg-wait-events.html)
  * pg\_waldump, [pg\_waldump](pgwaldump.html)
  * pg\_walfile\_name, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_walfile\_name\_offset, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_walinspect, [pg\_walinspect — low-level WAL inspection](pgwalinspect.html)
  * pg\_wal\_lsn\_diff, [Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
  * pg\_wal\_replay\_pause, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_wal\_replay\_resume, [Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
  * pg\_xact\_commit\_timestamp, [Committed Transaction Information Functions](functions-info.html#FUNCTIONS-INFO-COMMIT-TIMESTAMP)
  * pg\_xact\_commit\_timestamp\_origin, [Committed Transaction Information Functions](functions-info.html#FUNCTIONS-INFO-COMMIT-TIMESTAMP)
  * pg\_xact\_status, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * pg\_xlogdump, [pg\_xlogdump renamed to pg\_waldump](pgxlogdump.html) (see [pg\_waldump](#ientry-idp105554110926847))
  * phantom read, [Transaction Isolation](transaction-iso.html)
  * phraseto\_tsquery, [Text Search Functions and Operators](functions-textsearch.html), [Parsing Queries](textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES)
  * pi, [Mathematical Functions and Operators](functions-math.html)
  * PIC, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
  * PID

    <!---->

  * determining PID of server process

    * in libpq, [Connection Status Functions](libpq-status.html)

* pipelining, [Pipeline Mode](libpq-pipeline-mode.html), [Pipelining](protocol-flow.html#PROTOCOL-FLOW-PIPELINING)

  * *   in libpq, [Pipeline Mode](libpq-pipeline-mode.html)
  * protocol specification, [Pipelining](protocol-flow.html#PROTOCOL-FLOW-PIPELINING)

      * *   PITR, [Backup and Restore](backup.html)
  * PITR standby, [High Availability, Load Balancing, and Replication](high-availability.html)
  * pkg-config, [Requirements](install-requirements.html)

    <!---->

      * *   with ecpg, [Processing Embedded SQL Programs](ecpg-process.html)
    * with libpq, [Building libpq Programs](libpq-build.html)

      * *   PL/Perl, [PL/Perl — Perl Procedural Language](plperl.html)
  * PL/PerlU, [Trusted and Untrusted PL/Perl](plperl-trusted.html)
  * PL/pgSQL, [PL/pgSQL — SQL Procedural Language](plpgsql.html)
  * PL/Python, [PL/Python — Python Procedural Language](plpython.html)
  * PL/SQL (Oracle), [Porting from Oracle PL/SQL](plpgsql-porting.html)

    <!---->

  * porting to PL/pgSQL, [Porting from Oracle PL/SQL](plpgsql-porting.html)

      * *   PL/Tcl, [PL/Tcl — Tcl Procedural Language](pltcl.html)
  * plainto\_tsquery, [Text Search Functions and Operators](functions-textsearch.html), [Parsing Queries](textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES)
  * plan\_cache\_mode configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
  * plperl.on\_init configuration parameter, [Configuration](plperl-under-the-hood.html#PLPERL-CONFIG)
  * plperl.on\_plperlu\_init configuration parameter, [Configuration](plperl-under-the-hood.html#PLPERL-CONFIG)
  * plperl.on\_plperl\_init configuration parameter, [Configuration](plperl-under-the-hood.html#PLPERL-CONFIG)
  * plperl.use\_strict configuration parameter, [Configuration](plperl-under-the-hood.html#PLPERL-CONFIG)
  * plpgsql.check\_asserts configuration parameter, [Checking Assertions](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-ASSERT)
  * plpgsql.variable\_conflict configuration parameter, [Variable Substitution](plpgsql-implementation.html#PLPGSQL-VAR-SUBST)
  * pltcl.start\_proc configuration parameter, [PL/Tcl Configuration](pltcl-config.html)
  * pltclu.start\_proc configuration parameter, [PL/Tcl Configuration](pltcl-config.html)
  * point, [Points](datatype-geometric.html#DATATYPE-GEOMETRIC-POINTS), [Geometric Functions and Operators](functions-geometry.html)
  * point-in-time recovery, [Backup and Restore](backup.html)
  * policy, [Row Security Policies](ddl-rowsecurity.html)
  * polygon, [Polygons](datatype-geometric.html#DATATYPE-POLYGON), [Geometric Functions and Operators](functions-geometry.html)
  * polymorphic function, [Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC)
  * polymorphic type, [Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC)
  * popcount (see [bit\_count](#ientry-idp105553374222975))
  * popen, [Geometric Functions and Operators](functions-geometry.html)
  * populate\_record, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * port, [Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)
  * port configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
  * portal

    <!---->

      * *   DECLARE, [DECLARE](sql-declare.html)
    * in PL/pgSQL, [Opening Cursors](plpgsql-cursors.html#PLPGSQL-CURSOR-OPENING)

      * *   position, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
  * POSITION\_REGEX, [Differences from SQL Standard and XQuery](functions-matching.html#POSIX-VS-XQUERY)
  * POSTGRES, [The Berkeley POSTGRES Project](history.html#HISTORY-BERKELEY)
  * postgres, [Architectural Fundamentals](tutorial-arch.html), [Starting the Database Server](server-start.html), [Creating a Database](manage-ag-createdb.html), [postgres](app-postgres.html)
  * postgres user, [The PostgreSQL User Account](postgres-user.html)
  * Postgres95, [Postgres95](history.html#HISTORY-POSTGRES95)
  * postgresql.auto.conf, [Parameter Interaction via the Configuration File](config-setting.html#CONFIG-SETTING-CONFIGURATION-FILE)
  * postgresql.conf, [Parameter Interaction via the Configuration File](config-setting.html#CONFIG-SETTING-CONFIGURATION-FILE)
  * postgres\_fdw, [postgres\_fdw — access data stored in external PostgreSQL servers](postgres-fdw.html)
  * postgres\_fdw\.application\_name configuration parameter, [Configuration Parameters](postgres-fdw.html#POSTGRES-FDW-CONFIGURATION-PARAMETERS)
  * post\_auth\_delay configuration parameter, [Developer Options](runtime-config-developer.html)
  * power, [Mathematical Functions and Operators](functions-math.html)
  * PQbackendPID, [Connection Status Functions](libpq-status.html)
  * PQbinaryTuples, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)

    <!---->

  * with COPY, [Functions Associated with the COPY Command](libpq-copy.html)

      * *   PQcancel, [Canceling Queries in Progress](libpq-cancel.html)
  * PQclear, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQclientEncoding, [Control Functions](libpq-control.html)
  * PQclosePortal, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQclosePrepared, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQcmdStatus, [Retrieving Other Result Information](libpq-exec.html#LIBPQ-EXEC-NONSELECT)
  * PQcmdTuples, [Retrieving Other Result Information](libpq-exec.html#LIBPQ-EXEC-NONSELECT)
  * PQconndefaults, [Database Connection Control Functions](libpq-connect.html)
  * PQconnectdb, [Database Connection Control Functions](libpq-connect.html)
  * PQconnectdbParams, [Database Connection Control Functions](libpq-connect.html)
  * PQconnectionNeedsPassword, [Connection Status Functions](libpq-status.html)
  * PQconnectionUsedGSSAPI, [Connection Status Functions](libpq-status.html)
  * PQconnectionUsedPassword, [Connection Status Functions](libpq-status.html)
  * PQconnectPoll, [Database Connection Control Functions](libpq-connect.html)
  * PQconnectStart, [Database Connection Control Functions](libpq-connect.html)
  * PQconnectStartParams, [Database Connection Control Functions](libpq-connect.html)
  * PQconninfo, [Database Connection Control Functions](libpq-connect.html)
  * PQconninfoFree, [Miscellaneous Functions](libpq-misc.html)
  * PQconninfoParse, [Database Connection Control Functions](libpq-connect.html)
  * PQconsumeInput, [Asynchronous Command Processing](libpq-async.html)
  * PQcopyResult, [Miscellaneous Functions](libpq-misc.html)
  * PQdb, [Connection Status Functions](libpq-status.html)
  * PQdescribePortal, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQdescribePrepared, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQencryptPassword, [Miscellaneous Functions](libpq-misc.html)
  * PQencryptPasswordConn, [Miscellaneous Functions](libpq-misc.html)
  * PQendcopy, [Obsolete Functions for COPY](libpq-copy.html#LIBPQ-COPY-DEPRECATED)
  * PQenterPipelineMode, [Functions Associated with Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-FUNCTIONS)
  * PQerrorMessage, [Connection Status Functions](libpq-status.html)
  * PQescapeBytea, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQescapeByteaConn, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQescapeIdentifier, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQescapeLiteral, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQescapeString, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQescapeStringConn, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQexec, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQexecParams, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQexecPrepared, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQexitPipelineMode, [Functions Associated with Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-FUNCTIONS)
  * PQfformat, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)

    <!---->

  * with COPY, [Functions Associated with the COPY Command](libpq-copy.html)

      * *   PQfinish, [Database Connection Control Functions](libpq-connect.html)
  * PQfireResultCreateEvents, [Miscellaneous Functions](libpq-misc.html)
  * PQflush, [Asynchronous Command Processing](libpq-async.html)
  * PQfmod, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQfn, [The Fast-Path Interface](libpq-fastpath.html)
  * PQfname, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQfnumber, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQfreeCancel, [Canceling Queries in Progress](libpq-cancel.html)
  * PQfreemem, [Miscellaneous Functions](libpq-misc.html)
  * PQfsize, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQftable, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQftablecol, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQftype, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQgetCancel, [Canceling Queries in Progress](libpq-cancel.html)
  * PQgetCopyData, [Functions for Receiving COPY Data](libpq-copy.html#LIBPQ-COPY-RECEIVE)
  * PQgetisnull, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQgetlength, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQgetline, [Obsolete Functions for COPY](libpq-copy.html#LIBPQ-COPY-DEPRECATED)
  * PQgetlineAsync, [Obsolete Functions for COPY](libpq-copy.html#LIBPQ-COPY-DEPRECATED)
  * PQgetResult, [Asynchronous Command Processing](libpq-async.html)
  * PQgetssl, [Connection Status Functions](libpq-status.html)
  * PQgetSSLKeyPassHook\_OpenSSL, [Database Connection Control Functions](libpq-connect.html)
  * PQgetvalue, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQhost, [Connection Status Functions](libpq-status.html)
  * PQhostaddr, [Connection Status Functions](libpq-status.html)
  * PQinitOpenSSL, [SSL Library Initialization](libpq-ssl.html#LIBPQ-SSL-INITIALIZE)
  * PQinitSSL, [SSL Library Initialization](libpq-ssl.html#LIBPQ-SSL-INITIALIZE)
  * PQinstanceData, [Event Support Functions](libpq-events.html#LIBPQ-EVENTS-FUNCS)
  * PQisBusy, [Asynchronous Command Processing](libpq-async.html)
  * PQisnonblocking, [Asynchronous Command Processing](libpq-async.html)
  * PQisthreadsafe, [Behavior in Threaded Programs](libpq-threading.html)
  * PQlibVersion, [Miscellaneous Functions](libpq-misc.html)

    <!---->

  * (see also [PQserverVersion](#ientry-idp105553711783807))

      * *   PQmakeEmptyPGresult, [Miscellaneous Functions](libpq-misc.html)
  * PQnfields, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)

    <!---->

  * with COPY, [Functions Associated with the COPY Command](libpq-copy.html)

      * *   PQnotifies, [Asynchronous Notification](libpq-notify.html)
  * PQnparams, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQntuples, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQoidStatus, [Retrieving Other Result Information](libpq-exec.html#LIBPQ-EXEC-NONSELECT)
  * PQoidValue, [Retrieving Other Result Information](libpq-exec.html#LIBPQ-EXEC-NONSELECT)
  * PQoptions, [Connection Status Functions](libpq-status.html)
  * PQparameterStatus, [Connection Status Functions](libpq-status.html)
  * PQparamtype, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQpass, [Connection Status Functions](libpq-status.html)
  * PQping, [Database Connection Control Functions](libpq-connect.html)
  * PQpingParams, [Database Connection Control Functions](libpq-connect.html)
  * PQpipelineStatus, [Functions Associated with Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-FUNCTIONS)
  * PQpipelineSync, [Functions Associated with Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-FUNCTIONS)
  * PQport, [Connection Status Functions](libpq-status.html)
  * PQprepare, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQprint, [Retrieving Query Result Information](libpq-exec.html#LIBPQ-EXEC-SELECT-INFO)
  * PQprotocolVersion, [Connection Status Functions](libpq-status.html)
  * PQputCopyData, [Functions for Sending COPY Data](libpq-copy.html#LIBPQ-COPY-SEND)
  * PQputCopyEnd, [Functions for Sending COPY Data](libpq-copy.html#LIBPQ-COPY-SEND)
  * PQputline, [Obsolete Functions for COPY](libpq-copy.html#LIBPQ-COPY-DEPRECATED)
  * PQputnbytes, [Obsolete Functions for COPY](libpq-copy.html#LIBPQ-COPY-DEPRECATED)
  * PQregisterEventProc, [Event Support Functions](libpq-events.html#LIBPQ-EVENTS-FUNCS)
  * PQrequestCancel, [Canceling Queries in Progress](libpq-cancel.html)
  * PQreset, [Database Connection Control Functions](libpq-connect.html)
  * PQresetPoll, [Database Connection Control Functions](libpq-connect.html)
  * PQresetStart, [Database Connection Control Functions](libpq-connect.html)
  * PQresStatus, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQresultAlloc, [Miscellaneous Functions](libpq-misc.html)
  * PQresultErrorField, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQresultErrorMessage, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQresultInstanceData, [Event Support Functions](libpq-events.html#LIBPQ-EVENTS-FUNCS)
  * PQresultMemorySize, [Miscellaneous Functions](libpq-misc.html)
  * PQresultSetInstanceData, [Event Support Functions](libpq-events.html#LIBPQ-EVENTS-FUNCS)
  * PQresultStatus, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQresultVerboseErrorMessage, [Main Functions](libpq-exec.html#LIBPQ-EXEC-MAIN)
  * PQsendClosePortal, [Asynchronous Command Processing](libpq-async.html)
  * PQsendClosePrepared, [Asynchronous Command Processing](libpq-async.html)
  * PQsendDescribePortal, [Asynchronous Command Processing](libpq-async.html)
  * PQsendDescribePrepared, [Asynchronous Command Processing](libpq-async.html)
  * PQsendFlushRequest, [Functions Associated with Pipeline Mode](libpq-pipeline-mode.html#LIBPQ-PIPELINE-FUNCTIONS)
  * PQsendPrepare, [Asynchronous Command Processing](libpq-async.html)
  * PQsendQuery, [Asynchronous Command Processing](libpq-async.html)
  * PQsendQueryParams, [Asynchronous Command Processing](libpq-async.html)
  * PQsendQueryPrepared, [Asynchronous Command Processing](libpq-async.html)
  * PQserverVersion, [Connection Status Functions](libpq-status.html)
  * PQsetClientEncoding, [Control Functions](libpq-control.html)
  * PQsetdb, [Database Connection Control Functions](libpq-connect.html)
  * PQsetdbLogin, [Database Connection Control Functions](libpq-connect.html)
  * PQsetErrorContextVisibility, [Control Functions](libpq-control.html)
  * PQsetErrorVerbosity, [Control Functions](libpq-control.html)
  * PQsetInstanceData, [Event Support Functions](libpq-events.html#LIBPQ-EVENTS-FUNCS)
  * PQsetnonblocking, [Asynchronous Command Processing](libpq-async.html)
  * PQsetNoticeProcessor, [Notice Processing](libpq-notice-processing.html)
  * PQsetNoticeReceiver, [Notice Processing](libpq-notice-processing.html)
  * PQsetResultAttrs, [Miscellaneous Functions](libpq-misc.html)
  * PQsetSingleRowMode, [Retrieving Query Results Row-by-Row](libpq-single-row-mode.html)
  * PQsetSSLKeyPassHook\_OpenSSL, [Database Connection Control Functions](libpq-connect.html)
  * PQsetTraceFlags, [Control Functions](libpq-control.html)
  * PQsetvalue, [Miscellaneous Functions](libpq-misc.html)
  * PQsocket, [Connection Status Functions](libpq-status.html)
  * PQsslAttribute, [Connection Status Functions](libpq-status.html)
  * PQsslAttributeNames, [Connection Status Functions](libpq-status.html)
  * PQsslInUse, [Connection Status Functions](libpq-status.html)
  * PQsslStruct, [Connection Status Functions](libpq-status.html)
  * PQstatus, [Connection Status Functions](libpq-status.html)
  * PQtrace, [Control Functions](libpq-control.html)
  * PQtransactionStatus, [Connection Status Functions](libpq-status.html)
  * PQtty, [Connection Status Functions](libpq-status.html)
  * PQunescapeBytea, [Escaping Strings for Inclusion in SQL Commands](libpq-exec.html#LIBPQ-EXEC-ESCAPE-STRING)
  * PQuntrace, [Control Functions](libpq-control.html)
  * PQuser, [Connection Status Functions](libpq-status.html)
  * predicate locking, [Serializable Isolation Level](transaction-iso.html#XACT-SERIALIZABLE)
  * PREPARE, [PREPARE](sql-prepare.html)
  * PREPARE TRANSACTION, [PREPARE TRANSACTION](sql-prepare-transaction.html)
  * prepared statements, [DEALLOCATE](sql-deallocate.html), [EXECUTE](sql-execute.html), [EXPLAIN](sql-explain.html), [PREPARE](sql-prepare.html)

    <!---->

      * *   creating, [PREPARE](sql-prepare.html)
    * executing, [EXECUTE](sql-execute.html)
    * removing, [DEALLOCATE](sql-deallocate.html)
    * showing the query plan, [EXPLAIN](sql-explain.html)

* preparing a query

  * *   in PL/pgSQL, [Plan Caching](plpgsql-implementation.html#PLPGSQL-PLAN-CACHING)
  * in PL/Python, [Database Access Functions](plpython-database.html#PLPYTHON-DATABASE-ACCESS-FUNCS)
  * in PL/Tcl, [Database Access from PL/Tcl](pltcl-dbaccess.html)

      * *   pre\_auth\_delay configuration parameter, [Developer Options](runtime-config-developer.html)
  * primary key, [Primary Keys](ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)
  * primary\_conninfo configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
  * primary\_slot\_name configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
  * privilege, [Privileges](ddl-priv.html), [Schemas and Privileges](ddl-schemas.html#DDL-SCHEMAS-PRIV), [Rules and Privileges](rules-privileges.html), [Rules and Privileges](rules-privileges.html)

    <!---->

      * *   querying, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
    * with rules, [Rules and Privileges](rules-privileges.html)
    * for schemas, [Schemas and Privileges](ddl-schemas.html#DDL-SCHEMAS-PRIV)
    * with views, [Rules and Privileges](rules-privileges.html)

* procedural language, [Procedural Languages](xplang.html), [Writing a Procedural Language Handler](plhandler.html)

  * *   externally maintained, [Procedural Languages](external-pl.html)
  * handler for, [Writing a Procedural Language Handler](plhandler.html)

* procedure, [User-Defined Procedures](xproc.html)

  * user-defined, [User-Defined Procedures](xproc.html)

* procedures

  * output parameter, [SQL Procedures with Output Parameters](xfunc-sql.html#XFUNC-OUTPUT-PARAMETERS-PROC)

* protocol, [Frontend/Backend Protocol](protocol.html)

  * frontend-backend, [Frontend/Backend Protocol](protocol.html)

* ps, [Standard Unix Tools](monitoring-ps.html)

  * to monitor activity, [Standard Unix Tools](monitoring-ps.html)

      * *   psql, [Accessing a Database](tutorial-accessdb.html), [psql](app-psql.html)
  * Python, [PL/Python — Python Procedural Language](plpython.html)

### Q

  * *   qualified name, [Creating a Schema](ddl-schemas.html#DDL-SCHEMAS-CREATE)
* query, [Querying a Table](tutorial-select.html), [Queries](queries.html)
* query plan, [Using EXPLAIN](using-explain.html)
* query tree, [The Query Tree](querytree.html)
* querytree, [Text Search Functions and Operators](functions-textsearch.html), [Manipulating Queries](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSQUERY)
* quotation marks

    <!---->

  * *   and identifiers, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
  * escaping, [String Constants](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS)

      * *   quote\_all\_identifiers configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
* quote\_ident, [String Functions and Operators](functions-string.html)

    <!---->

  * *   in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)
  * use in PL/pgSQL, [Executing Dynamic Commands](plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN)

* quote\_literal, [String Functions and Operators](functions-string.html)

  * *   in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)
  * use in PL/pgSQL, [Executing Dynamic Commands](plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN)

* quote\_nullable, [String Functions and Operators](functions-string.html)

  * *   in PL/Perl, [Utility Functions in PL/Perl](plperl-builtins.html#PLPERL-UTILITY-FUNCTIONS)
  * use in PL/pgSQL, [Executing Dynamic Commands](plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN)

### R

  * *   radians, [Mathematical Functions and Operators](functions-math.html)
* radius, [Geometric Functions and Operators](functions-geometry.html)
* RADIUS, [RADIUS Authentication](auth-radius.html)
* RAISE

    <!---->

* in PL/pgSQL, [Reporting Errors and Messages](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-RAISE)

  * *   random, [Mathematical Functions and Operators](functions-math.html)
* random\_normal, [Mathematical Functions and Operators](functions-math.html)
* random\_page\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
* range table, [The Query Tree](querytree.html)
* range type, [Range Types](rangetypes.html)

    <!---->

  * *   exclude, [Constraints on Ranges](rangetypes.html#RANGETYPES-CONSTRAINT)
  * indexes on, [Indexing](rangetypes.html#RANGETYPES-INDEXING)

      * *   range\_agg, [Aggregate Functions](functions-aggregate.html)
* range\_intersect\_agg, [Aggregate Functions](functions-aggregate.html)
* range\_merge, [Range/Multirange Functions and Operators](functions-range.html)
* rank, [Window Functions](functions-window.html)

    <!---->

* hypothetical, [Aggregate Functions](functions-aggregate.html)

  * *   read committed, [Read Committed Isolation Level](transaction-iso.html#XACT-READ-COMMITTED)
* read-only transaction, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

    <!---->

  * *   setting, [SET TRANSACTION](sql-set-transaction.html)
  * setting default, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

      * *   readline, [Requirements](install-requirements.html)
* Readline

    <!---->

* in psql, [Command-Line Editing](app-psql.html#APP-PSQL-READLINE)

  * *   READ\_REPLICATION\_SLOT, [Streaming Replication Protocol](protocol-replication.html)
* real, [Floating-Point Types](datatype-numeric.html#DATATYPE-FLOAT)
* REASSIGN OWNED, [REASSIGN OWNED](sql-reassign-owned.html)
* record, [Pseudo-Types](datatype-pseudo.html)
* recovery.conf, [recovery.conf file merged into postgresql.conf](recovery-config.html)
* recovery.signal, [Archive Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY)
* recovery\_end\_command configuration parameter, [Archive Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY)
* recovery\_init\_sync\_method configuration parameter, [Error Handling](runtime-config-error-handling.html)
* recovery\_min\_apply\_delay configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* recovery\_prefetch configuration parameter, [Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY)
* recovery\_target configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_action configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_inclusive configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_lsn configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_name configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_time configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_timeline configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* recovery\_target\_xid configuration parameter, [Recovery Target](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)
* rectangle, [Boxes](datatype-geometric.html#DATATYPE-GEOMETRIC-BOXES)
* RECURSIVE, [CREATE VIEW](sql-createview.html)

    <!---->

  * *   in common table expressions, [Recursive Queries](queries-with.html#QUERIES-WITH-RECURSIVE)
  * in views, [CREATE VIEW](sql-createview.html)

      * *   recursive\_worktable\_factor configuration parameter, [Other Planner Options](runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)
* referential integrity, [Foreign Keys](tutorial-fk.html), [Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)
* REFRESH MATERIALIZED VIEW, [REFRESH MATERIALIZED VIEW](sql-refreshmaterializedview.html)
* regclass, [Object Identifier Types](datatype-oid.html)
* regcollation, [Object Identifier Types](datatype-oid.html)
* regconfig, [Object Identifier Types](datatype-oid.html)
* regdictionary, [Object Identifier Types](datatype-oid.html)
* regexp\_count, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_instr, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_like, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_match, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_matches, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_replace, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_split\_to\_array, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_split\_to\_table, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regexp\_substr, [String Functions and Operators](functions-string.html), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
* regnamespace, [Object Identifier Types](datatype-oid.html)
* regoper, [Object Identifier Types](datatype-oid.html)
* regoperator, [Object Identifier Types](datatype-oid.html)
* regproc, [Object Identifier Types](datatype-oid.html)
* regprocedure, [Object Identifier Types](datatype-oid.html)
* regression intercept, [Aggregate Functions](functions-aggregate.html)
* regression slope, [Aggregate Functions](functions-aggregate.html)
* regression test, [Installation Procedure](install-make.html#INSTALL-PROCEDURE-MAKE), [Installation Procedure](install-meson.html#INSTALL-PROCEDURE-MESON)
* regression tests, [Regression Tests](regress.html)
* regrole, [Object Identifier Types](datatype-oid.html)
* regr\_avgx, [Aggregate Functions](functions-aggregate.html)
* regr\_avgy, [Aggregate Functions](functions-aggregate.html)
* regr\_count, [Aggregate Functions](functions-aggregate.html)
* regr\_intercept, [Aggregate Functions](functions-aggregate.html)
* regr\_r2, [Aggregate Functions](functions-aggregate.html)
* regr\_slope, [Aggregate Functions](functions-aggregate.html)
* regr\_sxx, [Aggregate Functions](functions-aggregate.html)
* regr\_sxy, [Aggregate Functions](functions-aggregate.html)
* regr\_syy, [Aggregate Functions](functions-aggregate.html)
* regtype, [Object Identifier Types](datatype-oid.html)
* regular expression, [SIMILAR TO Regular Expressions](functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)

    <!---->

* (see also [pattern matching](#ientry-idp105553375034495))

* regular expressions

  * and locales, [Behavior](locale.html#LOCALE-BEHAVIOR)

      * *   reindex, [Routine Reindexing](routine-reindex.html)
  * REINDEX, [REINDEX](sql-reindex.html)
  * reindexdb, [reindexdb](app-reindexdb.html)
  * relation, [Concepts](tutorial-concepts.html)
  * relational database, [Concepts](tutorial-concepts.html)
  * RELEASE SAVEPOINT, [RELEASE SAVEPOINT](sql-release-savepoint.html)
  * remove\_temp\_files\_after\_crash configuration parameter, [Developer Options](runtime-config-developer.html)
  * repeat, [String Functions and Operators](functions-string.html)
  * repeatable read, [Repeatable Read Isolation Level](transaction-iso.html#XACT-REPEATABLE-READ)
  * replace, [String Functions and Operators](functions-string.html)
  * replication, [High Availability, Load Balancing, and Replication](high-availability.html)
  * Replication Origins, [Replication Progress Tracking](replication-origins.html)
  * Replication Progress Tracking, [Replication Progress Tracking](replication-origins.html)
  * replication slot

    <!---->

      * *   logical replication, [Replication Slots](logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS)
    * streaming replication, [Replication Slots](warm-standby.html#STREAMING-REPLICATION-SLOTS)

* reporting errors

  * in PL/pgSQL, [Reporting Errors and Messages](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-RAISE)

      * *   reserved\_connections configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
  * RESET, [RESET](sql-reset.html)
  * restartpoint, [WAL Configuration](wal-configuration.html)
  * restart\_after\_crash configuration parameter, [Error Handling](runtime-config-error-handling.html)
  * restore\_command configuration parameter, [Archive Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY)
  * RESTRICT, [Dependency Tracking](ddl-depend.html)

    <!---->

      * *   with DROP, [Dependency Tracking](ddl-depend.html)
    * foreign key action, [Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)

      * *   retryable error, [Serialization Failure Handling](mvcc-serialization-failure-handling.html)
  * RETURN NEXT

    <!---->

  * in PL/pgSQL, [RETURN NEXT and RETURN QUERY](plpgsql-control-structures.html#PLPGSQL-STATEMENTS-RETURNING-RETURN-NEXT)

* RETURN QUERY

  * in PL/pgSQL, [RETURN NEXT and RETURN QUERY](plpgsql-control-structures.html#PLPGSQL-STATEMENTS-RETURNING-RETURN-NEXT)

      * *   RETURNING, [Returning Data from Modified Rows](dml-returning.html)
  * RETURNING INTO, [Executing a Command with a Single-Row Result](plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW)

    <!---->

  * in PL/pgSQL, [Executing a Command with a Single-Row Result](plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW)

      * *   reverse, [String Functions and Operators](functions-string.html)
  * REVOKE, [Privileges](ddl-priv.html), [REVOKE](sql-revoke.html)
  * right, [String Functions and Operators](functions-string.html)
  * right join, [Joined Tables](queries-table-expressions.html#QUERIES-JOIN)
  * role, [Database Roles](database-roles.html), [Role Membership](role-membership.html), [Predefined Roles](predefined-roles.html)

    <!---->

      * *   applicable, [applicable\_roles](infoschema-applicable-roles.html)
    * enabled, [enabled\_roles](infoschema-enabled-roles.html)
    * membership in, [Role Membership](role-membership.html)
    * privilege to bypass, [Role Attributes](role-attributes.html)
    * privilege to create, [Role Attributes](role-attributes.html)
    * privilege to inherit, [Role Attributes](role-attributes.html)
    * privilege to initiate replication, [Role Attributes](role-attributes.html)
    * privilege to limit connection, [Role Attributes](role-attributes.html)

      * *   ROLLBACK, [ROLLBACK](sql-rollback.html)
  * rollback

    <!---->

  * psql, [Variables](app-psql.html#APP-PSQL-VARIABLES)

      * *   ROLLBACK PREPARED, [ROLLBACK PREPARED](sql-rollback-prepared.html)
  * ROLLBACK TO SAVEPOINT, [ROLLBACK TO SAVEPOINT](sql-rollback-to.html)
  * ROLLUP, [GROUPING SETS, CUBE, and ROLLUP](queries-table-expressions.html#QUERIES-GROUPING-SETS)
  * round, [Mathematical Functions and Operators](functions-math.html)
  * routine, [User-Defined Procedures](xproc.html)
  * routine maintenance, [Routine Database Maintenance Tasks](maintenance.html)
  * row, [Concepts](tutorial-concepts.html), [Table Basics](ddl-basics.html)
  * ROW, [Row Constructors](sql-expressions.html#SQL-SYNTAX-ROW-CONSTRUCTORS)
  * row estimation, [Row Estimation Examples](row-estimation-examples.html)

    <!---->

      * *   multivariate, [Multivariate Statistics Examples](multivariate-statistics-examples.html)
    * planner, [Row Estimation Examples](row-estimation-examples.html)

* row type, [Composite Types](rowtypes.html)

  * constructor, [Row Constructors](sql-expressions.html#SQL-SYNTAX-ROW-CONSTRUCTORS)

      * *   row-level security, [Row Security Policies](ddl-rowsecurity.html)
  * row-wise comparison, [Row and Array Comparisons](functions-comparisons.html)
  * row\_number, [Window Functions](functions-window.html)
  * row\_security configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * row\_security\_active, [Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
  * row\_to\_json, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
  * rpad, [String Functions and Operators](functions-string.html)
  * rtrim, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html)
  * rule, [The Rule System](rules.html), [Views and the Rule System](rules-views.html), [How SELECT Rules Work](rules-views.html#RULES-SELECT), [Materialized Views](rules-materializedviews.html), [Rules on INSERT, UPDATE, and DELETE](rules-update.html), [Rules on INSERT, UPDATE, and DELETE](rules-update.html), [Rules on INSERT, UPDATE, and DELETE](rules-update.html), [Rules Versus Triggers](rules-triggers.html)

    <!---->

      * *   and materialized views, [Materialized Views](rules-materializedviews.html)
    * and views, [Views and the Rule System](rules-views.html)
    * for DELETE, [Rules on INSERT, UPDATE, and DELETE](rules-update.html)
    * for INSERT, [Rules on INSERT, UPDATE, and DELETE](rules-update.html)
    * for SELECT, [How SELECT Rules Work](rules-views.html#RULES-SELECT)
    * compared with triggers, [Rules Versus Triggers](rules-triggers.html)
    * for UPDATE, [Rules on INSERT, UPDATE, and DELETE](rules-update.html)

### S

  * *   SAVEPOINT, [SAVEPOINT](sql-savepoint.html)
* savepoints, [RELEASE SAVEPOINT](sql-release-savepoint.html), [ROLLBACK TO SAVEPOINT](sql-rollback-to.html), [SAVEPOINT](sql-savepoint.html)

    <!---->

  * *   defining, [SAVEPOINT](sql-savepoint.html)
  * releasing, [RELEASE SAVEPOINT](sql-release-savepoint.html)
  * rolling back, [ROLLBACK TO SAVEPOINT](sql-rollback-to.html)

      * *   scalar (see [expression](#ientry-idp105553309122431))
* scale, [Mathematical Functions and Operators](functions-math.html)
* schema, [Schemas](ddl-schemas.html), [Creating a Schema](ddl-schemas.html#DDL-SCHEMAS-CREATE), [The Public Schema](ddl-schemas.html#DDL-SCHEMAS-PUBLIC), [Overview](manage-ag-overview.html)

    <!---->

  * *   creating, [Creating a Schema](ddl-schemas.html#DDL-SCHEMAS-CREATE)
  * current, [The Schema Search Path](ddl-schemas.html#DDL-SCHEMAS-PATH), [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * public, [The Public Schema](ddl-schemas.html#DDL-SCHEMAS-PUBLIC)
  * removing, [Creating a Schema](ddl-schemas.html#DDL-SCHEMAS-CREATE)

      * *   SCRAM, [Password Authentication](auth-password.html)
* scram\_iterations configuration parameter, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
* search path, [The Schema Search Path](ddl-schemas.html#DDL-SCHEMAS-PATH)

    <!---->

  * *   current, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * object visibility, [Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)

* search\_path configuration parameter, [The Schema Search Path](ddl-schemas.html#DDL-SCHEMAS-PATH), [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

  * use in securing functions, [Writing SECURITY DEFINER Functions Safely](sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)

      * *   SECURITY LABEL, [SECURITY LABEL](sql-security-label.html)
  * sec\_to\_gc, [Cube-Based Earth Distances](earthdistance.html#EARTHDISTANCE-CUBE-BASED)
  * seg, [seg — a datatype for line segments or floating point intervals](seg.html)
  * segment\_size configuration parameter, [Preset Options](runtime-config-preset.html)
  * SELECT, [Querying a Table](tutorial-select.html), [Queries](queries.html), [SELECT Output Columns](typeconv-select.html), [SELECT](sql-select.html)

    <!---->

      * *   determination of result type, [SELECT Output Columns](typeconv-select.html)
    * select list, [Select Lists](queries-select-lists.html)

* SELECT INTO, [Executing a Command with a Single-Row Result](plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW), [SELECT INTO](sql-selectinto.html)

  * in PL/pgSQL, [Executing a Command with a Single-Row Result](plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW)

      * *   semaphores, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
  * send\_abort\_for\_crash configuration parameter, [Developer Options](runtime-config-developer.html)
  * send\_abort\_for\_kill configuration parameter, [Developer Options](runtime-config-developer.html)
  * sepgsql, [sepgsql — SELinux-, label-based mandatory access control (MAC) security module](sepgsql.html)
  * sepgsql.debug\_audit configuration parameter, [GUC Parameters](sepgsql.html#SEPGSQL-PARAMETERS)
  * sepgsql.permissive configuration parameter, [GUC Parameters](sepgsql.html#SEPGSQL-PARAMETERS)
  * sequence, [Sequence Manipulation Functions](functions-sequence.html)

    <!---->

  * and serial type, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)

      * *   sequential scan, [Planner Method Configuration](runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
  * seq\_page\_cost configuration parameter, [Planner Cost Constants](runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
  * serial, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)
  * serial2, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)
  * serial4, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)
  * serial8, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)
  * serializable, [Serializable Isolation Level](transaction-iso.html#XACT-SERIALIZABLE)
  * Serializable Snapshot Isolation, [Introduction](mvcc-intro.html)
  * serialization anomaly, [Transaction Isolation](transaction-iso.html), [Serializable Isolation Level](transaction-iso.html#XACT-SERIALIZABLE)
  * serialization failure, [Serialization Failure Handling](mvcc-serialization-failure-handling.html)
  * server log, [Error Reporting and Logging](runtime-config-logging.html), [Log File Maintenance](logfile-maintenance.html)

    <!---->

  * log file maintenance, [Log File Maintenance](logfile-maintenance.html)

      * *   Server Name Indication, [Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)
  * server spoofing, [Preventing Server Spoofing](preventing-server-spoofing.html)
  * server\_encoding configuration parameter, [Preset Options](runtime-config-preset.html)
  * server\_version configuration parameter, [Preset Options](runtime-config-preset.html)
  * server\_version\_num configuration parameter, [Preset Options](runtime-config-preset.html)
  * session\_preload\_libraries configuration parameter, [Shared Library Preloading](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-PRELOAD)
  * session\_replication\_role configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * session\_user, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
  * SET, [Configuration Settings Functions](functions-admin.html#FUNCTIONS-ADMIN-SET), [SET](sql-set.html)
  * SET CONSTRAINTS, [SET CONSTRAINTS](sql-set-constraints.html)
  * set difference, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html)
  * set intersection, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html)
  * set operation, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html)
  * set returning functions, [Set Returning Functions](functions-srf.html)

    <!---->

  * functions, [Set Returning Functions](functions-srf.html)

      * *   SET ROLE, [SET ROLE](sql-set-role.html)
  * SET SESSION AUTHORIZATION, [SET SESSION AUTHORIZATION](sql-set-session-authorization.html)
  * SET TRANSACTION, [SET TRANSACTION](sql-set-transaction.html)
  * set union, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html)
  * SET XML OPTION, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * setseed, [Mathematical Functions and Operators](functions-math.html)
  * setval, [Sequence Manipulation Functions](functions-sequence.html)
  * setweight, [Text Search Functions and Operators](functions-textsearch.html), [Manipulating Documents](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSVECTOR)

    <!---->

  * setweight for specific lexeme(s), [Text Search Functions and Operators](functions-textsearch.html)

      * *   set\_bit, [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html)
  * set\_byte, [Binary String Functions and Operators](functions-binarystring.html)
  * set\_config, [Configuration Settings Functions](functions-admin.html#FUNCTIONS-ADMIN-SET)
  * set\_limit, [Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
  * set\_masklen, [Network Address Functions and Operators](functions-net.html)
  * sha224, [Binary String Functions and Operators](functions-binarystring.html)
  * sha256, [Binary String Functions and Operators](functions-binarystring.html)
  * sha384, [Binary String Functions and Operators](functions-binarystring.html)
  * sha512, [Binary String Functions and Operators](functions-binarystring.html)
  * shared library, [Shared Libraries](install-post.html#INSTALL-POST-SHLIBS), [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
  * shared memory, [Shared Memory and Semaphores](kernel-resources.html#SYSVIPC)
  * shared\_buffers configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * shared\_memory\_size configuration parameter, [Preset Options](runtime-config-preset.html)
  * shared\_memory\_size\_in\_huge\_pages configuration parameter, [Preset Options](runtime-config-preset.html)
  * shared\_memory\_type configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * shared\_preload\_libraries, [Shared Memory and LWLocks](xfunc-c.html#XFUNC-SHARED-ADDIN)
  * shared\_preload\_libraries configuration parameter, [Shared Library Preloading](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-PRELOAD)
  * shobj\_description, [Comment Information Functions](functions-info.html#FUNCTIONS-INFO-COMMENT)
  * SHOW, [Configuration Settings Functions](functions-admin.html#FUNCTIONS-ADMIN-SET), [SHOW](sql-show.html), [Streaming Replication Protocol](protocol-replication.html)
  * show\_limit, [Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
  * show\_trgm, [Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
  * shutdown, [Shutting Down the Server](server-shutdown.html)
  * SIGHUP, [Parameter Interaction via the Configuration File](config-setting.html#CONFIG-SETTING-CONFIGURATION-FILE), [The pg\_hba.conf File](auth-pg-hba-conf.html), [User Name Maps](auth-username-maps.html)
  * SIGINT, [Shutting Down the Server](server-shutdown.html)
  * sign, [Mathematical Functions and Operators](functions-math.html)
  * signal

    <!---->

  * backend processes, [Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)

      * *   significant digits, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * SIGQUIT, [Shutting Down the Server](server-shutdown.html)
  * SIGTERM, [Shutting Down the Server](server-shutdown.html)
  * SIMILAR TO, [SIMILAR TO Regular Expressions](functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP)
  * similarity, [Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
  * sin, [Mathematical Functions and Operators](functions-math.html)
  * sind, [Mathematical Functions and Operators](functions-math.html)
  * single-user mode, [Options for Single-User Mode](app-postgres.html#id-1.9.5.14.6.5)
  * sinh, [Mathematical Functions and Operators](functions-math.html)
  * skeys, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * sleep, [Delaying Execution](functions-datetime.html#FUNCTIONS-DATETIME-DELAY)
  * slice, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * sliced bread (see [TOAST](#ientry-idp105553710317055))
  * slope, [Geometric Functions and Operators](functions-geometry.html)
  * SLRU, [pg\_stat\_slru](monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW)
  * smallint, [Integer Types](datatype-numeric.html#DATATYPE-INT)
  * smallserial, [Serial Types](datatype-numeric.html#DATATYPE-SERIAL)
  * Solaris, [Solaris](installation-platform-notes.html#INSTALLATION-NOTES-SOLARIS)

    <!---->

      * *   installation on, [Solaris](installation-platform-notes.html#INSTALLATION-NOTES-SOLARIS)
    * shared library, [Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
    * start script, [Starting the Database Server](server-start.html)

      * *   SOME, [Aggregate Functions](functions-aggregate.html), [Subquery Expressions](functions-subquery.html), [Row and Array Comparisons](functions-comparisons.html)
  * sort, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
  * sorting, [Sorting Rows (ORDER BY)](queries-order.html)
  * sort\_asc, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
  * sort\_desc, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
  * soundex, [Soundex](fuzzystrmatch.html#FUZZYSTRMATCH-SOUNDEX)
  * SP-GiST (see [index](#ientry-idp105553510265215))
  * SPI, [Server Programming Interface](spi.html), [spi — Server Programming Interface features/examples](contrib-spi.html)

    <!---->

  * examples, [spi — Server Programming Interface features/examples](contrib-spi.html)

* spi\_commit

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_commit, [SPI\_commit](spi-spi-commit.html)
  * SPI\_commit\_and\_chain, [SPI\_commit](spi-spi-commit.html)
  * SPI\_connect, [SPI\_connect](spi-spi-connect.html)
  * SPI\_connect\_ext, [SPI\_connect](spi-spi-connect.html)
  * SPI\_copytuple, [SPI\_copytuple](spi-spi-copytuple.html)
  * spi\_cursor\_close

    <!---->

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_cursor\_close, [SPI\_cursor\_close](spi-spi-cursor-close.html)
  * SPI\_cursor\_fetch, [SPI\_cursor\_fetch](spi-spi-cursor-fetch.html)
  * SPI\_cursor\_find, [SPI\_cursor\_find](spi-spi-cursor-find.html)
  * SPI\_cursor\_move, [SPI\_cursor\_move](spi-spi-cursor-move.html)
  * SPI\_cursor\_open, [SPI\_cursor\_open](spi-spi-cursor-open.html)
  * SPI\_cursor\_open\_with\_args, [SPI\_cursor\_open\_with\_args](spi-spi-cursor-open-with-args.html)
  * SPI\_cursor\_open\_with\_paramlist, [SPI\_cursor\_open\_with\_paramlist](spi-spi-cursor-open-with-paramlist.html)
  * SPI\_cursor\_parse\_open, [SPI\_cursor\_parse\_open](spi-spi-cursor-parse-open.html)
  * SPI\_exec, [SPI\_exec](spi-spi-exec.html)
  * SPI\_execp, [SPI\_execp](spi-spi-execp.html)
  * SPI\_execute, [SPI\_execute](spi-spi-execute.html)
  * SPI\_execute\_extended, [SPI\_execute\_extended](spi-spi-execute-extended.html)
  * SPI\_execute\_plan, [SPI\_execute\_plan](spi-spi-execute-plan.html)
  * SPI\_execute\_plan\_extended, [SPI\_execute\_plan\_extended](spi-spi-execute-plan-extended.html)
  * SPI\_execute\_plan\_with\_paramlist, [SPI\_execute\_plan\_with\_paramlist](spi-spi-execute-plan-with-paramlist.html)
  * SPI\_execute\_with\_args, [SPI\_execute\_with\_args](spi-spi-execute-with-args.html)
  * spi\_exec\_prepared

    <!---->

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

* spi\_exec\_query

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

* spi\_fetchrow

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_finish, [SPI\_finish](spi-spi-finish.html)
  * SPI\_fname, [SPI\_fname](spi-spi-fname.html)
  * SPI\_fnumber, [SPI\_fnumber](spi-spi-fnumber.html)
  * spi\_freeplan

    <!---->

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_freeplan, [SPI\_freeplan](spi-spi-freeplan.html)
  * SPI\_freetuple, [SPI\_freetuple](spi-spi-freetuple.html)
  * SPI\_freetuptable, [SPI\_freetuptable](spi-spi-freetupletable.html)
  * SPI\_getargcount, [SPI\_getargcount](spi-spi-getargcount.html)
  * SPI\_getargtypeid, [SPI\_getargtypeid](spi-spi-getargtypeid.html)
  * SPI\_getbinval, [SPI\_getbinval](spi-spi-getbinval.html)
  * SPI\_getnspname, [SPI\_getnspname](spi-spi-getnspname.html)
  * SPI\_getrelname, [SPI\_getrelname](spi-spi-getrelname.html)
  * SPI\_gettype, [SPI\_gettype](spi-spi-gettype.html)
  * SPI\_gettypeid, [SPI\_gettypeid](spi-spi-gettypeid.html)
  * SPI\_getvalue, [SPI\_getvalue](spi-spi-getvalue.html)
  * SPI\_is\_cursor\_plan, [SPI\_is\_cursor\_plan](spi-spi-is-cursor-plan.html)
  * SPI\_keepplan, [SPI\_keepplan](spi-spi-keepplan.html)
  * SPI\_modifytuple, [SPI\_modifytuple](spi-spi-modifytuple.html)
  * SPI\_palloc, [SPI\_palloc](spi-spi-palloc.html)
  * SPI\_pfree, [SPI\_pfree](spi-spi-pfree.html)
  * spi\_prepare

    <!---->

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_prepare, [SPI\_prepare](spi-spi-prepare.html)
  * SPI\_prepare\_cursor, [SPI\_prepare\_cursor](spi-spi-prepare-cursor.html)
  * SPI\_prepare\_extended, [SPI\_prepare\_extended](spi-spi-prepare-extended.html)
  * SPI\_prepare\_params, [SPI\_prepare\_params](spi-spi-prepare-params.html)
  * spi\_query

    <!---->

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

* spi\_query\_prepared

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_register\_relation, [SPI\_register\_relation](spi-spi-register-relation.html)
  * SPI\_register\_trigger\_data, [SPI\_register\_trigger\_data](spi-spi-register-trigger-data.html)
  * SPI\_repalloc, [SPI\_repalloc](spi-realloc.html)
  * SPI\_result\_code\_string, [SPI\_result\_code\_string](spi-spi-result-code-string.html)
  * SPI\_returntuple, [SPI\_returntuple](spi-spi-returntuple.html)
  * spi\_rollback

    <!---->

  * in PL/Perl, [Database Access from PL/Perl](plperl-builtins.html#PLPERL-DATABASE)

      * *   SPI\_rollback, [SPI\_rollback](spi-spi-rollback.html)
  * SPI\_rollback\_and\_chain, [SPI\_rollback](spi-spi-rollback.html)
  * SPI\_saveplan, [SPI\_saveplan](spi-spi-saveplan.html)
  * SPI\_scroll\_cursor\_fetch, [SPI\_scroll\_cursor\_fetch](spi-spi-scroll-cursor-fetch.html)
  * SPI\_scroll\_cursor\_move, [SPI\_scroll\_cursor\_move](spi-spi-scroll-cursor-move.html)
  * SPI\_start\_transaction, [SPI\_start\_transaction](spi-spi-start-transaction.html)
  * SPI\_unregister\_relation, [SPI\_unregister\_relation](spi-spi-unregister-relation.html)
  * split\_part, [String Functions and Operators](functions-string.html)
  * SQL/CLI, [SQL Conformance](features.html)
  * SQL/Foundation, [SQL Conformance](features.html)
  * SQL/Framework, [SQL Conformance](features.html)
  * SQL/JRT, [SQL Conformance](features.html)
  * SQL/JSON, [JSON Functions and Operators](functions-json.html)

    <!---->

  * functions and expressions, [JSON Functions and Operators](functions-json.html)

      * *   SQL/JSON path language, [The SQL/JSON Path Language](functions-json.html#FUNCTIONS-SQLJSON-PATH)
  * SQL/MDA, [SQL Conformance](features.html)
  * SQL/MED, [SQL Conformance](features.html)
  * SQL/OLB, [SQL Conformance](features.html)
  * SQL/PGQ, [SQL Conformance](features.html)
  * SQL/PSM, [SQL Conformance](features.html)
  * SQL/Schemata, [SQL Conformance](features.html)
  * SQL/XML, [SQL Conformance](features.html)

    <!---->

  * limits and conformance, [XML Limits and Conformance to SQL/XML](xml-limits-conformance.html)

      * *   sqrt, [Mathematical Functions and Operators](functions-math.html)
  * ssh, [Secure TCP/IP Connections with SSH Tunnels](ssh-tunnels.html)
  * SSI, [Introduction](mvcc-intro.html)
  * SSL, [Secure TCP/IP Connections with SSL](ssl-tcp.html), [SSL Support](libpq-ssl.html)

    <!---->

      * *   in libpq, [Connection Status Functions](libpq-status.html)
    * with libpq, [Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)
    * TLS, [Secure TCP/IP Connections with SSL](ssl-tcp.html), [SSL Support](libpq-ssl.html)

      * *   ssl configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * sslinfo, [sslinfo — obtain client SSL information](sslinfo.html)
  * ssl\_ca\_file configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_cert\_file configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_cipher, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_ciphers configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_client\_cert\_present, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_client\_dn, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_client\_dn\_field, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_client\_serial, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_crl\_dir configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_crl\_file configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_dh\_params\_file configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_ecdh\_curve configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_extension\_info, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_issuer\_dn, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_issuer\_field, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_is\_used, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * ssl\_key\_file configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_library configuration parameter, [Preset Options](runtime-config-preset.html)
  * ssl\_max\_protocol\_version configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_min\_protocol\_version configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_passphrase\_command configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_passphrase\_command\_supports\_reload configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_prefer\_server\_ciphers configuration parameter, [SSL](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SSL)
  * ssl\_version, [Functions Provided](sslinfo.html#SSLINFO-FUNCTIONS)
  * SSPI, [SSPI Authentication](sspi-auth.html)
  * STABLE, [Function Volatility Categories](xfunc-volatility.html)
  * standard deviation, [Aggregate Functions](functions-aggregate.html)

    <!---->

      * *   population, [Aggregate Functions](functions-aggregate.html)
    * sample, [Aggregate Functions](functions-aggregate.html)

      * *   standard\_conforming\_strings configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
  * standby server, [High Availability, Load Balancing, and Replication](high-availability.html)
  * standby.signal, [Archive Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY), [Standby Server Operation](warm-standby.html#STANDBY-SERVER-OPERATION), [Setting Up a Standby Server](warm-standby.html#STANDBY-SERVER-SETUP)

    <!---->

      * *   for hot standby, [Administrator's Overview](hot-standby.html#HOT-STANDBY-ADMIN)
    * pg\_basebackup --write-recovery-conf, [Options](app-pgbasebackup.html#id-1.9.4.10.6)

      * *   standby\_mode (see [standby.signal](#ientry-idp105553577289855))
  * START TRANSACTION, [START TRANSACTION](sql-start-transaction.html)
  * starts\_with, [String Functions and Operators](functions-string.html)
  * START\_REPLICATION, [Streaming Replication Protocol](protocol-replication.html)
  * statement\_timeout configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * statement\_timestamp, [Date/Time Functions and Operators](functions-datetime.html)
  * statistics, [Aggregate Functions](functions-aggregate.html), [Statistics Used by the Planner](planner-stats.html), [Extended Statistics](planner-stats.html#PLANNER-STATS-EXTENDED), [Updating Planner Statistics](routine-vacuuming.html#VACUUM-FOR-STATISTICS), [The Cumulative Statistics System](monitoring-stats.html)

    <!---->

  * of the planner, [Statistics Used by the Planner](planner-stats.html), [Extended Statistics](planner-stats.html#PLANNER-STATS-EXTENDED), [Updating Planner Statistics](routine-vacuuming.html#VACUUM-FOR-STATISTICS)

      * *   stats\_fetch\_consistency configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * stddev, [Aggregate Functions](functions-aggregate.html)
  * stddev\_pop, [Aggregate Functions](functions-aggregate.html)
  * stddev\_samp, [Aggregate Functions](functions-aggregate.html)
  * STONITH, [High Availability, Load Balancing, and Replication](high-availability.html)
  * storage parameters, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * Streaming Replication, [High Availability, Load Balancing, and Replication](high-availability.html)
  * strict\_word\_similarity, [Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
  * string (see [character string](#ientry-idp105553308273023))
  * strings

    <!---->

      * *   backslash quotes, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
    * escape warning, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
    * standard conforming, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)

      * *   string\_agg, [Aggregate Functions](functions-aggregate.html)
  * string\_to\_array, [String Functions and Operators](functions-string.html)
  * string\_to\_table, [String Functions and Operators](functions-string.html)
  * strip, [Text Search Functions and Operators](functions-textsearch.html), [Manipulating Documents](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSVECTOR)
  * strpos, [String Functions and Operators](functions-string.html)
  * subarray, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
  * subltree, [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
  * subpath, [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
  * subquery, [Aggregate Functions](tutorial-agg.html), [Scalar Subqueries](sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES), [Subqueries](queries-table-expressions.html#QUERIES-SUBQUERIES), [Subquery Expressions](functions-subquery.html)
  * subscript, [Subscripts](sql-expressions.html#SQL-EXPRESSIONS-SUBSCRIPTS)
  * substr, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html)
  * substring, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html), [Bit String Functions and Operators](functions-bitstring.html), [SIMILAR TO Regular Expressions](functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP), [POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)
  * SUBSTRING\_REGEX, [Differences from SQL Standard and XQuery](functions-matching.html#POSIX-VS-XQUERY)
  * subtransactions

    <!---->

  * in PL/Tcl, [Explicit Subtransactions in PL/Tcl](pltcl-subtransactions.html)

      * *   sum, [Aggregate Functions](functions-aggregate.html)
  * superuser, [Accessing a Database](tutorial-accessdb.html), [Role Attributes](role-attributes.html)
  * superuser\_reserved\_connections configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
  * support functions

    <!---->

  * in\_range, [B-Tree Support Functions](btree-support-funcs.html)

      * *   suppress\_redundant\_updates\_trigger, [Trigger Functions](functions-trigger.html)
  * svals, [hstore Operators and Functions](hstore.html#HSTORE-OPS-FUNCS)
  * syncfs, [syncfs() Caveats](syncfs.html)
  * synchronize\_seqscans configuration parameter, [Previous PostgreSQL Versions](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-VERSION)
  * synchronous commit, [Asynchronous Commit](wal-async-commit.html)
  * Synchronous Replication, [High Availability, Load Balancing, and Replication](high-availability.html)
  * synchronous\_commit configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
  * synchronous\_standby\_names configuration parameter, [Primary Server](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-PRIMARY)
  * syntax, [SQL Syntax](sql-syntax.html)

    <!---->

  * SQL, [SQL Syntax](sql-syntax.html)

      * *   syslog\_facility configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * syslog\_ident configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * syslog\_sequence\_numbers configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * syslog\_split\_messages configuration parameter, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
  * system catalog, [The System Catalog Schema](ddl-schemas.html#DDL-SCHEMAS-CATALOG)

    <!---->

  * schema, [The System Catalog Schema](ddl-schemas.html#DDL-SCHEMAS-CATALOG)

* systemd, [PostgreSQL Features](install-make.html#CONFIGURE-OPTIONS-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES), [Starting the Database Server](server-start.html)

  * RemoveIPC, [systemd RemoveIPC](kernel-resources.html#SYSTEMD-REMOVEIPC)

* system\_user, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)

### T

* table, [Concepts](tutorial-concepts.html), [Table Basics](ddl-basics.html), [Modifying Tables](ddl-alter.html)

  * *   creating, [Table Basics](ddl-basics.html)
  * inheritance, [Inheritance](ddl-inherit.html)
  * modifying, [Modifying Tables](ddl-alter.html)
  * partitioning, [Table Partitioning](ddl-partitioning.html)
  * removing, [Table Basics](ddl-basics.html)
  * renaming, [Renaming a Table](ddl-alter.html#DDL-ALTER-RENAMING-TABLE)

      * *   Table Access Method, [Table Access Method Interface Definition](tableam.html)
  * TABLE command, [SELECT](sql-select.html)
  * table expression, [Table Expressions](queries-table-expressions.html)
  * table function, [Table Functions](queries-table-expressions.html#QUERIES-TABLEFUNCTIONS), [xmltable](functions-xml.html#FUNCTIONS-XML-PROCESSING-XMLTABLE)

    <!---->

  * XMLTABLE, [xmltable](functions-xml.html#FUNCTIONS-XML-PROCESSING-XMLTABLE)

      * *   table sampling method, [Writing a Table Sampling Method](tablesample-method.html)
  * tableam

    <!---->

  * Table Access Method, [Table Access Method Interface Definition](tableam.html)

      * *   tablefunc, [tablefunc — functions that return tables (crosstab and others)](tablefunc.html)
  * tableoid, [System Columns](ddl-system-columns.html)
  * TABLESAMPLE method, [Writing a Table Sampling Method](tablesample-method.html)
  * tablespace, [Tablespaces](manage-ag-tablespaces.html)

    <!---->

      * *   default, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
    * temporary, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

      * *   table\_am\_handler, [Pseudo-Types](datatype-pseudo.html)
  * tan, [Mathematical Functions and Operators](functions-math.html)
  * tand, [Mathematical Functions and Operators](functions-math.html)
  * tanh, [Mathematical Functions and Operators](functions-math.html)
  * target list, [The Query Tree](querytree.html)
  * Tcl, [PL/Tcl — Tcl Procedural Language](pltcl.html)
  * tcn, [tcn — a trigger function to notify listeners of changes to table content](tcn.html)
  * tcp\_keepalives\_count configuration parameter, [TCP Settings](runtime-config-connection.html#RUNTIME-CONFIG-TCP-SETTINGS)
  * tcp\_keepalives\_idle configuration parameter, [TCP Settings](runtime-config-connection.html#RUNTIME-CONFIG-TCP-SETTINGS)
  * tcp\_keepalives\_interval configuration parameter, [TCP Settings](runtime-config-connection.html#RUNTIME-CONFIG-TCP-SETTINGS)
  * tcp\_user\_timeout configuration parameter, [TCP Settings](runtime-config-connection.html#RUNTIME-CONFIG-TCP-SETTINGS)
  * template0, [Creating a Database](manage-ag-createdb.html), [Template Databases](manage-ag-templatedbs.html)
  * template1, [Creating a Database](manage-ag-createdb.html), [Template Databases](manage-ag-templatedbs.html)
  * temp\_buffers configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * temp\_file\_limit configuration parameter, [Disk](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-DISK)
  * temp\_tablespaces configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * test, [Regression Tests](regress.html)
  * test\_decoding, [test\_decoding — SQL-based test/example module for WAL logical decoding](test-decoding.html)
  * text, [Character Types](datatype-character.html), [Network Address Functions and Operators](functions-net.html)
  * text search, [Text Search Types](datatype-textsearch.html), [Text Search Types](datatype-textsearch.html), [Full Text Search](textsearch.html), [Preferred Index Types for Text Search](textsearch-indexes.html)

    <!---->

      * *   data types, [Text Search Types](datatype-textsearch.html)
    * functions and operators, [Text Search Types](datatype-textsearch.html)
    * indexes, [Preferred Index Types for Text Search](textsearch-indexes.html)

      * *   text2ltree, [Operators and Functions](ltree.html#LTREE-OPS-FUNCS)
  * threads, [Behavior in Threaded Programs](libpq-threading.html)

    <!---->

  * with libpq, [Behavior in Threaded Programs](libpq-threading.html)

      * *   tid, [Object Identifier Types](datatype-oid.html)
  * time, [Date/Time Types](datatype-datetime.html), [Times](datatype-datetime.html#DATATYPE-DATETIME-INPUT-TIMES)

    <!---->

      * *   constants, [Special Values](datatype-datetime.html#DATATYPE-DATETIME-SPECIAL-VALUES)
    * current, [Current Date/Time](functions-datetime.html#FUNCTIONS-DATETIME-CURRENT)
    * output format, [Date/Time Output](datatype-datetime.html#DATATYPE-DATETIME-OUTPUT)

        <!---->

    * (see also [formatting](#ientry-idp105553373272959))

      * *   time span, [Date/Time Types](datatype-datetime.html)
  * time with time zone, [Date/Time Types](datatype-datetime.html), [Times](datatype-datetime.html#DATATYPE-DATETIME-INPUT-TIMES)
  * time without time zone, [Date/Time Types](datatype-datetime.html), [Times](datatype-datetime.html#DATATYPE-DATETIME-INPUT-TIMES)
  * time zone, [Time Zones](datatype-datetime.html#DATATYPE-TIMEZONES), [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT), [POSIX Time Zone Specifications](datetime-posix-timezone-specs.html)

    <!---->

      * *   conversion, [AT TIME ZONE and AT LOCAL](functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT)
    * input abbreviations, [Date/Time Configuration Files](datetime-config-files.html)
    * POSIX-style specification, [POSIX Time Zone Specifications](datetime-posix-timezone-specs.html)

      * *   time zone data, [Build Process Details](install-make.html#CONFIGURE-OPTIONS-BUILD-PROCESS), [Build Process Details](install-meson.html#MESON-OPTIONS-BUILD-PROCESS)
  * time zone names, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * timelines, [Backup and Restore](backup.html)
  * TIMELINE\_HISTORY, [Streaming Replication Protocol](protocol-replication.html)
  * timeofday, [Date/Time Functions and Operators](functions-datetime.html)
  * timeout

    <!---->

      * *   client authentication, [Authentication](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
    * deadlock, [Lock Management](runtime-config-locks.html)

      * *   timestamp, [Date/Time Types](datatype-datetime.html), [Time Stamps](datatype-datetime.html#DATATYPE-DATETIME-INPUT-TIME-STAMPS)
  * timestamp with time zone, [Date/Time Types](datatype-datetime.html), [Time Stamps](datatype-datetime.html#DATATYPE-DATETIME-INPUT-TIME-STAMPS)
  * timestamp without time zone, [Date/Time Types](datatype-datetime.html), [Time Stamps](datatype-datetime.html#DATATYPE-DATETIME-INPUT-TIME-STAMPS)
  * timestamptz, [Date/Time Types](datatype-datetime.html)
  * TimeZone configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * timezone\_abbreviations configuration parameter, [Locale and Formatting](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-FORMAT)
  * TOAST, [TOAST](storage-toast.html)

    <!---->

      * *   and user-defined types, [TOAST Considerations](xtypes.html#XTYPES-TOAST)
    * per-column storage settings, [Description](sql-altertable.html#id-1.9.3.35.5), [Parameters](sql-createtable.html#id-1.9.3.85.6)
    * per-type storage settings, [Description](sql-altertype.html#id-1.9.3.42.5)
    * versus large objects, [Introduction](lo-intro.html)

      * *   toast\_tuple\_target storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
  * token, [Lexical Structure](sql-syntax-lexical.html)
  * to\_ascii, [String Functions and Operators](functions-string.html)
  * to\_bin, [String Functions and Operators](functions-string.html)
  * to\_char, [Data Type Formatting Functions](functions-formatting.html)

    <!---->

  * and locales, [Behavior](locale.html#LOCALE-BEHAVIOR)

      * *   to\_date, [Data Type Formatting Functions](functions-formatting.html)
  * to\_hex, [String Functions and Operators](functions-string.html)
  * to\_json, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
  * to\_jsonb, [Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
  * to\_number, [Data Type Formatting Functions](functions-formatting.html)
  * to\_oct, [String Functions and Operators](functions-string.html)
  * to\_regclass, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regcollation, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regnamespace, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regoper, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regoperator, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regproc, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regprocedure, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regrole, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_regtype, [System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
  * to\_timestamp, [Data Type Formatting Functions](functions-formatting.html), [Date/Time Functions and Operators](functions-datetime.html)
  * to\_tsquery, [Text Search Functions and Operators](functions-textsearch.html), [Parsing Queries](textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES)
  * to\_tsvector, [Text Search Functions and Operators](functions-textsearch.html), [Parsing Documents](textsearch-controls.html#TEXTSEARCH-PARSING-DOCUMENTS)
  * trace\_locks configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_lock\_oidmin configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_lock\_table configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_lwlocks configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_notify configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_recovery\_messages configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_sort configuration parameter, [Developer Options](runtime-config-developer.html)
  * trace\_userlocks configuration parameter, [Developer Options](runtime-config-developer.html)
  * track\_activities configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * track\_activity\_query\_size configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * track\_commit\_timestamp configuration parameter, [Sending Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SENDER)
  * track\_counts configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * track\_functions configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * track\_io\_timing configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * track\_wal\_io\_timing configuration parameter, [Cumulative Query and Index Statistics](runtime-config-statistics.html#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  * transaction, [Transactions](tutorial-transactions.html)
  * transaction ID, [Preventing Transaction ID Wraparound Failures](routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)

    <!---->

  * wraparound, [Preventing Transaction ID Wraparound Failures](routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)

      * *   transaction isolation, [Transaction Isolation](transaction-iso.html)
  * transaction isolation level, [Transaction Isolation](transaction-iso.html), [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

    <!---->

      * *   read committed, [Read Committed Isolation Level](transaction-iso.html#XACT-READ-COMMITTED)
    * repeatable read, [Repeatable Read Isolation Level](transaction-iso.html#XACT-REPEATABLE-READ)
    * serializable, [Serializable Isolation Level](transaction-iso.html#XACT-SERIALIZABLE)
    * setting, [SET TRANSACTION](sql-set-transaction.html)
    * setting default, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)

      * *   transaction log (see [WAL](#ientry-idp105553640639359))
  * transaction\_deferrable configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * transaction\_isolation configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * transaction\_read\_only configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
  * transaction\_timestamp, [Date/Time Functions and Operators](functions-datetime.html)
  * transform\_null\_equals configuration parameter, [Platform and Client Compatibility](runtime-config-compatible.html#RUNTIME-CONFIG-COMPATIBLE-CLIENTS)
  * transition tables, [CREATE TRIGGER](sql-createtrigger.html)

    <!---->

      * *   (see also [ephemeral named relation](#ientry-idp105553842007935))
    * implementation in PLs, [SPI\_register\_trigger\_data](spi-spi-register-trigger-data.html)
    * referencing from C trigger, [Writing Trigger Functions in C](trigger-interface.html)

      * *   translate, [String Functions and Operators](functions-string.html)
  * TRANSLATE\_REGEX, [Differences from SQL Standard and XQuery](functions-matching.html#POSIX-VS-XQUERY)
  * transparent huge pages, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * trigger, [Pseudo-Types](datatype-pseudo.html), [Triggers](triggers.html), [Writing Trigger Functions in C](trigger-interface.html), [Rules Versus Triggers](rules-triggers.html), [Trigger Functions](plpgsql-trigger.html), [Trigger Functions](plpython-trigger.html)

    <!---->

      * *   arguments for trigger functions, [Overview of Trigger Behavior](trigger-definition.html)
    * constraint trigger, [Description](sql-createtrigger.html#id-1.9.3.93.6)
    * for updating a derived tsvector column, [Triggers for Automatic Updates](textsearch-features.html#TEXTSEARCH-UPDATE-TRIGGERS)
    * in C, [Writing Trigger Functions in C](trigger-interface.html)
    * in PL/pgSQL, [Trigger Functions](plpgsql-trigger.html)
    * in PL/Python, [Trigger Functions](plpython-trigger.html)
    * in PL/Tcl, [Trigger Functions in PL/Tcl](pltcl-trigger.html)
    * compared with rules, [Rules Versus Triggers](rules-triggers.html)

      * *   triggered\_change\_notification, [tcn — a trigger function to notify listeners of changes to table content](tcn.html)
  * trim, [String Functions and Operators](functions-string.html), [Binary String Functions and Operators](functions-binarystring.html)
  * trim\_array, [Array Functions and Operators](functions-array.html)
  * trim\_scale, [Mathematical Functions and Operators](functions-math.html)
  * true, [Boolean Type](datatype-boolean.html)
  * trunc, [Mathematical Functions and Operators](functions-math.html), [Network Address Functions and Operators](functions-net.html)
  * TRUNCATE, [TRUNCATE](sql-truncate.html)
  * trusted, [Trusted and Untrusted PL/Perl](plperl-trusted.html)

    <!---->

  * PL/Perl, [Trusted and Untrusted PL/Perl](plperl-trusted.html)

      * *   tsm\_handler, [Pseudo-Types](datatype-pseudo.html)
  * tsm\_system\_rows, [tsm\_system\_rows — the SYSTEM\_ROWS sampling method for TABLESAMPLE](tsm-system-rows.html)
  * tsm\_system\_time, [tsm\_system\_time — the SYSTEM\_TIME sampling method for TABLESAMPLE](tsm-system-time.html)
  * tsquery (data type), [tsquery](datatype-textsearch.html#DATATYPE-TSQUERY)
  * tsquery\_phrase, [Text Search Functions and Operators](functions-textsearch.html), [Manipulating Queries](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSQUERY)
  * tsvector (data type), [tsvector](datatype-textsearch.html#DATATYPE-TSVECTOR)
  * tsvector concatenation, [Manipulating Documents](textsearch-features.html#TEXTSEARCH-MANIPULATE-TSVECTOR)
  * tsvector\_to\_array, [Text Search Functions and Operators](functions-textsearch.html)
  * tsvector\_update\_trigger, [Trigger Functions](functions-trigger.html)
  * tsvector\_update\_trigger\_column, [Trigger Functions](functions-trigger.html)
  * ts\_debug, [Text Search Functions and Operators](functions-textsearch.html), [Configuration Testing](textsearch-debugging.html#TEXTSEARCH-CONFIGURATION-TESTING)
  * ts\_delete, [Text Search Functions and Operators](functions-textsearch.html)
  * ts\_filter, [Text Search Functions and Operators](functions-textsearch.html)
  * ts\_headline, [Text Search Functions and Operators](functions-textsearch.html), [Highlighting Results](textsearch-controls.html#TEXTSEARCH-HEADLINE)
  * ts\_lexize, [Text Search Functions and Operators](functions-textsearch.html), [Dictionary Testing](textsearch-debugging.html#TEXTSEARCH-DICTIONARY-TESTING)
  * ts\_parse, [Text Search Functions and Operators](functions-textsearch.html), [Parser Testing](textsearch-debugging.html#TEXTSEARCH-PARSER-TESTING)
  * ts\_rank, [Text Search Functions and Operators](functions-textsearch.html), [Ranking Search Results](textsearch-controls.html#TEXTSEARCH-RANKING)
  * ts\_rank\_cd, [Text Search Functions and Operators](functions-textsearch.html), [Ranking Search Results](textsearch-controls.html#TEXTSEARCH-RANKING)
  * ts\_rewrite, [Text Search Functions and Operators](functions-textsearch.html), [Query Rewriting](textsearch-features.html#TEXTSEARCH-QUERY-REWRITING)
  * ts\_stat, [Text Search Functions and Operators](functions-textsearch.html), [Gathering Document Statistics](textsearch-features.html#TEXTSEARCH-STATISTICS)
  * ts\_token\_type, [Text Search Functions and Operators](functions-textsearch.html), [Parser Testing](textsearch-debugging.html#TEXTSEARCH-PARSER-TESTING)
  * tuple\_data\_split, [Heap Functions](pageinspect.html#PAGEINSPECT-HEAP-FUNCS)
  * txid\_current, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_current\_if\_assigned, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_current\_snapshot, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_snapshot\_xip, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_snapshot\_xmax, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_snapshot\_xmin, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_status, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * txid\_visible\_in\_snapshot, [Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
  * type (see [data type](#ientry-idp105553308172031))
  * type cast, [Numeric Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS-NUMERIC), [Type Casts](sql-expressions.html#SQL-SYNTAX-TYPE-CASTS)
  * typedef

    <!---->

  * in ECPG, [Typedefs](ecpg-variables.html#ECPG-VARIABLES-NONPRIMITIVE-C-TYPEDEFS)

### U

  * *   UESCAPE, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS), [String Constants with Unicode Escapes](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-UESCAPE)
* unaccent, [unaccent — a text search dictionary which removes diacritics](unaccent.html), [Functions](unaccent.html#UNACCENT-FUNCTIONS)
* Unicode escape, [String Constants with Unicode Escapes](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-UESCAPE)

    <!---->

  * *   in identifiers, [Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
  * in string constants, [String Constants with Unicode Escapes](sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-UESCAPE)

      * *   Unicode normalization, [String Functions and Operators](functions-string.html)
* UNION, [Combining Queries (UNION, INTERSECT, EXCEPT)](queries-union.html), [UNION, CASE, and Related Constructs](typeconv-union-case.html)

    <!---->

* determination of result type, [UNION, CASE, and Related Constructs](typeconv-union-case.html)

  * *   uniq, [intarray Functions and Operators](intarray.html#INTARRAY-FUNCS-OPS)
* unique constraint, [Unique Constraints](ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)
* unistr, [String Functions and Operators](functions-string.html)
* Unix domain socket, [Parameter Key Words](libpq-connect.html#LIBPQ-PARAMKEYWORDS)
* unix\_socket\_directories configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
* unix\_socket\_group configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
* unix\_socket\_permissions configuration parameter, [Connection Settings](runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)
* unknown, [Pseudo-Types](datatype-pseudo.html)
* UNLISTEN, [UNLISTEN](sql-unlisten.html)
* unnest, [Array Functions and Operators](functions-array.html)

    <!---->

  * *   for multirange, [Range/Multirange Functions and Operators](functions-range.html)
  * for tsvector, [Text Search Functions and Operators](functions-textsearch.html)

      * *   unqualified name, [The Schema Search Path](ddl-schemas.html#DDL-SCHEMAS-PATH)
* updatable views, [Updatable Views](sql-createview.html#SQL-CREATEVIEW-UPDATABLE-VIEWS)
* UPDATE, [Updates](tutorial-update.html), [Updating Data](dml-update.html), [Returning Data from Modified Rows](dml-returning.html), [UPDATE](sql-update.html)

    <!---->

* RETURNING, [Returning Data from Modified Rows](dml-returning.html)

  * *   update\_process\_title configuration parameter, [Process Title](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-PROC-TITLE)
* updating, [Updating Data](dml-update.html)
* upgrading, [Upgrading a PostgreSQL Cluster](upgrading.html)
* upper, [String Functions and Operators](functions-string.html), [Range/Multirange Functions and Operators](functions-range.html)

    <!---->

* and locales, [Behavior](locale.html#LOCALE-BEHAVIOR)

  * *   upper\_inc, [Range/Multirange Functions and Operators](functions-range.html)
* upper\_inf, [Range/Multirange Functions and Operators](functions-range.html)
* UPSERT, [INSERT](sql-insert.html)
* URI, [Connection Strings](libpq-connect.html#LIBPQ-CONNSTRING)
* user, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION), [Database Roles](database-roles.html)

    <!---->

* current, [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)

  * *   user mapping, [Foreign Data](ddl-foreign-data.html)
* User name maps, [User Name Maps](auth-username-maps.html)
* user\_catalog\_table storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
* UUID, [UUID Type](datatype-uuid.html), [UUID Type](datatype-uuid.html), [PostgreSQL Features](install-make.html#CONFIGURE-OPTIONS-FEATURES), [PostgreSQL Features](install-meson.html#MESON-OPTIONS-FEATURES)

    <!---->

* generating, [UUID Type](datatype-uuid.html)

  * *   uuid-ossp, [uuid-ossp — a UUID generator](uuid-ossp.html)
* uuid\_generate\_v1, [uuid-ossp Functions](uuid-ossp.html#UUID-OSSP-FUNCTIONS-SECT)
* uuid\_generate\_v1mc, [uuid-ossp Functions](uuid-ossp.html#UUID-OSSP-FUNCTIONS-SECT)
* uuid\_generate\_v3, [uuid-ossp Functions](uuid-ossp.html#UUID-OSSP-FUNCTIONS-SECT)

### V

  * *   vacuum, [Routine Vacuuming](routine-vacuuming.html)
* VACUUM, [VACUUM](sql-vacuum.html)
* vacuumdb, [vacuumdb](app-vacuumdb.html)
* vacuumlo, [vacuumlo](vacuumlo.html)
* vacuum\_buffer\_usage\_limit configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
* vacuum\_cost\_delay configuration parameter, [Cost-based Vacuum Delay](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
* vacuum\_cost\_limit configuration parameter, [Cost-based Vacuum Delay](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
* vacuum\_cost\_page\_dirty configuration parameter, [Cost-based Vacuum Delay](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
* vacuum\_cost\_page\_hit configuration parameter, [Cost-based Vacuum Delay](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
* vacuum\_cost\_page\_miss configuration parameter, [Cost-based Vacuum Delay](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
* vacuum\_failsafe\_age configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* vacuum\_freeze\_min\_age configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* vacuum\_freeze\_table\_age configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* vacuum\_index\_cleanup storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
* vacuum\_multixact\_failsafe\_age configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* vacuum\_multixact\_freeze\_min\_age configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* vacuum\_multixact\_freeze\_table\_age configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* vacuum\_truncate storage parameter, [Storage Parameters](sql-createtable.html#SQL-CREATETABLE-STORAGE-PARAMETERS)
* value expression, [Value Expressions](sql-expressions.html)
* VALUES, [VALUES Lists](queries-values.html), [UNION, CASE, and Related Constructs](typeconv-union-case.html), [VALUES](sql-values.html)

    <!---->

* determination of result type, [UNION, CASE, and Related Constructs](typeconv-union-case.html)

  * *   varchar, [Character Types](datatype-character.html)
* variadic function, [SQL Functions with Variable Numbers of Arguments](xfunc-sql.html#XFUNC-SQL-VARIADIC-FUNCTIONS)
* variance, [Aggregate Functions](functions-aggregate.html)

    <!---->

  * *   population, [Aggregate Functions](functions-aggregate.html)
  * sample, [Aggregate Functions](functions-aggregate.html)

      * *   var\_pop, [Aggregate Functions](functions-aggregate.html)
* var\_samp, [Aggregate Functions](functions-aggregate.html)
* version, [Accessing a Database](tutorial-accessdb.html), [Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION), [Upgrading a PostgreSQL Cluster](upgrading.html)

    <!---->

* compatibility, [Upgrading a PostgreSQL Cluster](upgrading.html)

* view, [Views](tutorial-views.html), [Views and the Rule System](rules-views.html), [Materialized Views](rules-materializedviews.html), [Cooperation with Views](rules-update.html#RULES-UPDATE-VIEWS)

  * *   implementation through rules, [Views and the Rule System](rules-views.html)
  * materialized, [Materialized Views](rules-materializedviews.html)
  * updating, [Cooperation with Views](rules-update.html#RULES-UPDATE-VIEWS)

      * *   Visibility Map, [Visibility Map](storage-vm.html)
  * VM (see [Visibility Map](#ientry-idp105554245272703))
  * void, [Pseudo-Types](datatype-pseudo.html)
  * VOLATILE, [Function Volatility Categories](xfunc-volatility.html)
  * volatility, [Function Volatility Categories](xfunc-volatility.html)

    <!---->

  * functions, [Function Volatility Categories](xfunc-volatility.html)

* VPATH, [Installation Procedure](install-make.html#INSTALL-PROCEDURE-MAKE), [Extension Building Infrastructure](extend-pgxs.html)

### W

  * *   WAL, [Reliability and the Write-Ahead Log](wal.html)
* wal\_block\_size configuration parameter, [Preset Options](runtime-config-preset.html)
* wal\_buffers configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_compression configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_consistency\_checking configuration parameter, [Developer Options](runtime-config-developer.html)
* wal\_debug configuration parameter, [Developer Options](runtime-config-developer.html)
* wal\_decode\_buffer\_size configuration parameter, [Recovery](runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY)
* wal\_init\_zero configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_keep\_size configuration parameter, [Sending Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SENDER)
* wal\_level configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_log\_hints configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_receiver\_create\_temp\_slot configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* wal\_receiver\_status\_interval configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* wal\_receiver\_timeout configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* wal\_recycle configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_retrieve\_retry\_interval configuration parameter, [Standby Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY)
* wal\_segment\_size configuration parameter, [Preset Options](runtime-config-preset.html)
* wal\_sender\_timeout configuration parameter, [Sending Servers](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SENDER)
* wal\_skip\_threshold configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_sync\_method configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_writer\_delay configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* wal\_writer\_flush\_after configuration parameter, [Settings](runtime-config-wal.html#RUNTIME-CONFIG-WAL-SETTINGS)
* warm standby, [High Availability, Load Balancing, and Replication](high-availability.html)
* websearch\_to\_tsquery, [Text Search Functions and Operators](functions-textsearch.html)
* WHERE, [The WHERE Clause](queries-table-expressions.html#QUERIES-WHERE)
* where to log, [Where to Log](runtime-config-logging.html#RUNTIME-CONFIG-LOGGING-WHERE)
* WHILE

    <!---->

* in PL/pgSQL, [WHILE](plpgsql-control-structures.html#PLPGSQL-CONTROL-STRUCTURES-LOOPS-WHILE)

  * *   width, [Geometric Functions and Operators](functions-geometry.html)
* width\_bucket, [Mathematical Functions and Operators](functions-math.html)
* window function, [Window Functions](tutorial-window.html), [Window Function Calls](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS), [Window Function Processing](queries-table-expressions.html#QUERIES-WINDOW), [Window Functions](functions-window.html)

    <!---->

  * *   built-in, [Window Functions](functions-window.html)
  * invocation, [Window Function Calls](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
  * order of execution, [Window Function Processing](queries-table-expressions.html#QUERIES-WINDOW)

* WITH, [WITH Queries (Common Table Expressions)](queries-with.html), [SELECT](sql-select.html)

  * in SELECT, [WITH Queries (Common Table Expressions)](queries-with.html), [SELECT](sql-select.html)

      * *   WITH CHECK OPTION, [CREATE VIEW](sql-createview.html)
  * WITHIN GROUP, [Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES)
  * witness server, [High Availability, Load Balancing, and Replication](high-availability.html)
  * word\_similarity, [Functions and Operators](pgtrgm.html#PGTRGM-FUNCS-OPS)
  * work\_mem configuration parameter, [Memory](runtime-config-resource.html#RUNTIME-CONFIG-RESOURCE-MEMORY)
  * wraparound

    <!---->

      * *   of multixact IDs, [Multixacts and Wraparound](routine-vacuuming.html#VACUUM-FOR-MULTIXACT-WRAPAROUND)
    * of transaction IDs, [Preventing Transaction ID Wraparound Failures](routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)

### X

  * *   xid, [Object Identifier Types](datatype-oid.html)
* xid8, [Object Identifier Types](datatype-oid.html)
* xmax, [System Columns](ddl-system-columns.html)
* xmin, [System Columns](ddl-system-columns.html)
* XML, [XML Type](datatype-xml.html)
* XML export, [Mapping Tables to XML](functions-xml.html#FUNCTIONS-XML-MAPPING)
* XML Functions, [XML Functions](functions-xml.html)
* XML option, [Creating XML Values](datatype-xml.html#DATATYPE-XML-CREATING), [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* xml2, [xml2 — XPath querying and XSLT functionality](xml2.html)
* xmlagg, [xmlagg](functions-xml.html#FUNCTIONS-XML-XMLAGG), [Aggregate Functions](functions-aggregate.html)
* xmlbinary configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* xmlcomment, [xmlcomment](functions-xml.html#FUNCTIONS-PRODUCING-XML-XMLCOMMENT)
* xmlconcat, [xmlconcat](functions-xml.html#FUNCTIONS-PRODUCING-XML-XMLCONCAT)
* xmlelement, [xmlelement](functions-xml.html#FUNCTIONS-PRODUCING-XML-XMLELEMENT)
* XMLEXISTS, [XMLEXISTS](functions-xml.html#XML-EXISTS)
* xmlforest, [xmlforest](functions-xml.html#FUNCTIONS-PRODUCING-XML-XMLFOREST)
* xmloption configuration parameter, [Statement Behavior](runtime-config-client.html#RUNTIME-CONFIG-CLIENT-STATEMENT)
* xmlparse, [Creating XML Values](datatype-xml.html#DATATYPE-XML-CREATING)
* xmlpi, [xmlpi](functions-xml.html#FUNCTIONS-PRODUCING-XML-XMLPI)
* xmlroot, [xmlroot](functions-xml.html#FUNCTIONS-PRODUCING-XML-XMLROOT)
* xmlserialize, [Creating XML Values](datatype-xml.html#DATATYPE-XML-CREATING)
* xmltable, [xmltable](functions-xml.html#FUNCTIONS-XML-PROCESSING-XMLTABLE)
* xml\_is\_well\_formed, [xml\_is\_well\_formed](functions-xml.html#XML-IS-WELL-FORMED)
* xml\_is\_well\_formed\_content, [xml\_is\_well\_formed](functions-xml.html#XML-IS-WELL-FORMED)
* xml\_is\_well\_formed\_document, [xml\_is\_well\_formed](functions-xml.html#XML-IS-WELL-FORMED)
* XPath, [xpath](functions-xml.html#FUNCTIONS-XML-PROCESSING-XPATH)
* xpath\_exists, [xpath\_exists](functions-xml.html#FUNCTIONS-XML-PROCESSING-XPATH-EXISTS)
* xpath\_table, [xpath\_table](xml2.html#XML2-XPATH-TABLE)
* XQuery regular expressions, [Differences from SQL Standard and XQuery](functions-matching.html#POSIX-VS-XQUERY)
* xslt\_process, [xslt\_process](xml2.html#XML2-XSLT-XSLT-PROCESS)

### Y

* yacc, [Requirements](install-requirements.html)

### Z

  * *   zero\_damaged\_pages configuration parameter, [Developer Options](runtime-config-developer.html)
* zlib, [Requirements](install-requirements.html), [Anti-Features](install-make.html#CONFIGURE-OPTIONS-ANTI-FEATURES), [Anti-Features](install-meson.html#MESON-OPTIONS-ANTI-FEATURES)

***

|                                     |                                                       |    |
| :---------------------------------- | :---------------------------------------------------: | -: |
| [Prev](biblio.html "Bibliography")  |  [Up](index.html "PostgreSQL 17devel Documentation")  |    |
| Bibliography                        | [Home](index.html "PostgreSQL 17devel Documentation") |    |
