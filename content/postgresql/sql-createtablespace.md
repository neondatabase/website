<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 CREATE TABLESPACE                 |                                        |              |                                                       |                                                                     |
| :-----------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](sql-createtableas.html "CREATE TABLE AS")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createtsconfig.html "CREATE TEXT SEARCH CONFIGURATION") |

***

## CREATE TABLESPACE

CREATE TABLESPACE — define a new tablespace

## Synopsis

```

CREATE TABLESPACE tablespace_name
    [ OWNER { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER } ]
    LOCATION 'directory'
    [ WITH ( tablespace_option = value [, ... ] ) ]
```

## Description

`CREATE TABLESPACE` registers a new cluster-wide tablespace. The tablespace name must be distinct from the name of any existing tablespace in the database cluster.

A tablespace allows superusers to define an alternative location on the file system where the data files containing database objects (such as tables and indexes) can reside.

A user with appropriate privileges can pass *`tablespace_name`* to `CREATE DATABASE`, `CREATE TABLE`, `CREATE INDEX` or `ADD CONSTRAINT` to have the data files for these objects stored within the specified tablespace.

### Warning

A tablespace cannot be used independently of the cluster in which it is defined; see [Section 23.6](manage-ag-tablespaces.html "23.6. Tablespaces").

## Parameters

* *`tablespace_name`*

    The name of a tablespace to be created. The name cannot begin with `pg_`, as such names are reserved for system tablespaces.

* *`user_name`*

    The name of the user who will own the tablespace. If omitted, defaults to the user executing the command. Only superusers can create tablespaces, but they can assign ownership of tablespaces to non-superusers.

* *`directory`*

    The directory that will be used for the tablespace. The directory must exist (`CREATE TABLESPACE` will not create it), should be empty, and must be owned by the PostgreSQL system user. The directory must be specified by an absolute path name.

* *`tablespace_option`*

    A tablespace parameter to be set or reset. Currently, the only available parameters are `seq_page_cost`, `random_page_cost`, `effective_io_concurrency` and `maintenance_io_concurrency`. Setting these values for a particular tablespace will override the planner's usual estimate of the cost of reading pages from tables in that tablespace, and the executor's prefetching behavior, as established by the configuration parameters of the same name (see [seq\_page\_cost](runtime-config-query.html#GUC-SEQ-PAGE-COST), [random\_page\_cost](runtime-config-query.html#GUC-RANDOM-PAGE-COST), [effective\_io\_concurrency](runtime-config-resource.html#GUC-EFFECTIVE-IO-CONCURRENCY), [maintenance\_io\_concurrency](runtime-config-resource.html#GUC-MAINTENANCE-IO-CONCURRENCY)). This may be useful if one tablespace is located on a disk which is faster or slower than the remainder of the I/O subsystem.

## Notes

`CREATE TABLESPACE` cannot be executed inside a transaction block.

## Examples

To create a tablespace `dbspace` at file system location `/data/dbs`, first create the directory using operating system facilities and set the correct ownership:

```

mkdir /data/dbs
chown postgres:postgres /data/dbs
```

Then issue the tablespace creation command inside PostgreSQL:

```

CREATE TABLESPACE dbspace LOCATION '/data/dbs';
```

To create a tablespace owned by a different database user, use a command like this:

```

CREATE TABLESPACE indexspace OWNER genevieve LOCATION '/data/indexes';
```

## Compatibility

`CREATE TABLESPACE` is a PostgreSQL extension.

## See Also

[CREATE DATABASE](sql-createdatabase.html "CREATE DATABASE"), [CREATE TABLE](sql-createtable.html "CREATE TABLE"), [CREATE INDEX](sql-createindex.html "CREATE INDEX"), [DROP TABLESPACE](sql-droptablespace.html "DROP TABLESPACE"), [ALTER TABLESPACE](sql-altertablespace.html "ALTER TABLESPACE")

***

|                                                   |                                                       |                                                                     |
| :------------------------------------------------ | :---------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](sql-createtableas.html "CREATE TABLE AS")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createtsconfig.html "CREATE TEXT SEARCH CONFIGURATION") |
| CREATE TABLE AS                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                    CREATE TEXT SEARCH CONFIGURATION |
