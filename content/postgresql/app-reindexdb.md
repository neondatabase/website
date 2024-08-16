[#id](#APP-REINDEXDB)

## reindexdb

reindexdb — reindex a PostgreSQL database

## Synopsis

`reindexdb` \[_`connection-option`_...] \[_`option`_...] \[ `-S` | `--schema` _`schema`_ ] ... \[ `-t` | `--table` _`table`_ ] ... \[ `-i` | `--index` _`index`_ ] ... \[_`dbname`_]

`reindexdb` \[_`connection-option`_...] \[_`option`_...] `-a` | `--all`

`reindexdb` \[_`connection-option`_...] \[_`option`_...] `-s` | `--system` \[_`dbname`_]

[#id](#id-1.9.4.21.5)

## Description

reindexdb is a utility for rebuilding indexes in a PostgreSQL database.

reindexdb is a wrapper around the SQL command [`REINDEX`](sql-reindex). There is no effective difference between reindexing databases via this utility and via other methods for accessing the server.

[#id](#id-1.9.4.21.6)

## Options

reindexdb accepts the following command-line arguments:

- `-a``--all`

  Reindex all databases.

- `--concurrently`

  Use the `CONCURRENTLY` option. See [REINDEX](sql-reindex), where all the caveats of this option are explained in detail.

- `[-d] dbname``[--dbname=]dbname`

  Specifies the name of the database to be reindexed, when `-a`/`--all` is not used. If this is not specified, the database name is read from the environment variable `PGDATABASE`. If that is not set, the user name specified for the connection is used. The _`dbname`_ can be a [connection string](libpq-connect#LIBPQ-CONNSTRING). If so, connection string parameters will override any conflicting command line options.

- `-e``--echo`

  Echo the commands that reindexdb generates and sends to the server.

- `-i index``--index=index`

  Recreate _`index`_ only. Multiple indexes can be recreated by writing multiple `-i` switches.

- `-j njobs``--jobs=njobs`

  Execute the reindex commands in parallel by running _`njobs`_ commands simultaneously. This option may reduce the processing time but it also increases the load on the database server.

  reindexdb will open _`njobs`_ connections to the database, so make sure your [max_connections](runtime-config-connection#GUC-MAX-CONNECTIONS) setting is high enough to accommodate all connections.

  Note that this option is incompatible with the `--index` and `--system` options.

- `-q``--quiet`

  Do not display progress messages.

- `-s``--system`

  Reindex database's system catalogs only.

- `-S schema``--schema=schema`

  Reindex _`schema`_ only. Multiple schemas can be reindexed by writing multiple `-S` switches.

- `-t table``--table=table`

  Reindex _`table`_ only. Multiple tables can be reindexed by writing multiple `-t` switches.

- `--tablespace=tablespace`

  Specifies the tablespace where indexes are rebuilt. (This name is processed as a double-quoted identifier.)

- `-v``--verbose`

  Print detailed information during processing.

- `-V``--version`

  Print the reindexdb version and exit.

- `-?``--help`

  Show help about reindexdb command line arguments, and exit.

reindexdb also accepts the following command-line arguments for connection parameters:

- `-h host``--host=host`

  Specifies the host name of the machine on which the server is running. If the value begins with a slash, it is used as the directory for the Unix domain socket.

- `-p port``--port=port`

  Specifies the TCP port or local Unix domain socket file extension on which the server is listening for connections.

- `-U username``--username=username`

  User name to connect as.

- `-w``--no-password`

  Never issue a password prompt. If the server requires password authentication and a password is not available by other means such as a `.pgpass` file, the connection attempt will fail. This option can be useful in batch jobs and scripts where no user is present to enter a password.

- `-W``--password`

  Force reindexdb to prompt for a password before connecting to a database.

  This option is never essential, since reindexdb will automatically prompt for a password if the server demands password authentication. However, reindexdb will waste a connection attempt finding out that the server wants a password. In some cases it is worth typing `-W` to avoid the extra connection attempt.

- `--maintenance-db=dbname`

  Specifies the name of the database to connect to to discover which databases should be reindexed, when `-a`/`--all` is used. If not specified, the `postgres` database will be used, or if that does not exist, `template1` will be used. This can be a [connection string](libpq-connect#LIBPQ-CONNSTRING). If so, connection string parameters will override any conflicting command line options. Also, connection string parameters other than the database name itself will be re-used when connecting to other databases.

[#id](#id-1.9.4.21.7)

## Environment

- `PGDATABASE``PGHOST``PGPORT``PGUSER`

  Default connection parameters

- `PG_COLOR`

  Specifies whether to use color in diagnostic messages. Possible values are `always`, `auto` and `never`.

This utility, like most other PostgreSQL utilities, also uses the environment variables supported by libpq (see [Section 34.15](libpq-envars)).

[#id](#id-1.9.4.21.8)

## Diagnostics

In case of difficulty, see [REINDEX](sql-reindex) and [psql](app-psql) for discussions of potential problems and error messages. The database server must be running at the targeted host. Also, any default connection settings and environment variables used by the libpq front-end library will apply.

[#id](#id-1.9.4.21.9)

## Notes

reindexdb might need to connect several times to the PostgreSQL server, asking for a password each time. It is convenient to have a `~/.pgpass` file in such cases. See [Section 34.16](libpq-pgpass) for more information.

[#id](#id-1.9.4.21.10)

## Examples

To reindex the database `test`:

```

$ reindexdb test
```

To reindex the table `foo` and the index `bar` in a database named `abcd`:

```

$ reindexdb --table=foo --index=bar abcd
```

[#id](#id-1.9.4.21.11)

## See Also

[REINDEX](sql-reindex)
