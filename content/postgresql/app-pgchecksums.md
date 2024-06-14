[#id](#APP-PGCHECKSUMS)

## pg_checksums

pg_checksums — enable, disable or check data checksums in a PostgreSQL database cluster

## Synopsis

`pg_checksums` \[_`option`_...] \[\[ `-D` | `--pgdata` ]_`datadir`_]

[#id](#R1-APP-PGCHECKSUMS-1)

## Description

pg_checksums checks, enables or disables data checksums in a PostgreSQL cluster. The server must be shut down cleanly before running pg_checksums. When verifying checksums, the exit status is zero if there are no checksum errors, and nonzero if at least one checksum failure is detected. When enabling or disabling checksums, the exit status is nonzero if the operation failed.

When verifying checksums, every file in the cluster is scanned. When enabling checksums, each relation file block with a changed checksum is rewritten in-place. Disabling checksums only updates the file `pg_control`.

[#id](#id-1.9.5.5.6)

## Options

The following command-line options are available:

- `-D directory``--pgdata=directory`

  Specifies the directory where the database cluster is stored.

- `-c``--check`

  Checks checksums. This is the default mode if nothing else is specified.

- `-d``--disable`

  Disables checksums.

- `-e``--enable`

  Enables checksums.

- `-f filenode``--filenode=filenode`

  Only validate checksums in the relation with filenode _`filenode`_.

- `-N``--no-sync`

  By default, `pg_checksums` will wait for all files to be written safely to disk. This option causes `pg_checksums` to return without waiting, which is faster, but means that a subsequent operating system crash can leave the updated data directory corrupt. Generally, this option is useful for testing but should not be used on a production installation. This option has no effect when using `--check`.

- `-P``--progress`

  Enable progress reporting. Turning this on will deliver a progress report while checking or enabling checksums.

- `-v``--verbose`

  Enable verbose output. Lists all checked files.

- `-V``--version`

  Print the pg_checksums version and exit.

- `-?``--help`

  Show help about pg_checksums command line arguments, and exit.

[#id](#id-1.9.5.5.7)

## Environment

- `PGDATA`

  Specifies the directory where the database cluster is stored; can be overridden using the `-D` option.

- `PG_COLOR`

  Specifies whether to use color in diagnostic messages. Possible values are `always`, `auto` and `never`.

[#id](#id-1.9.5.5.8)

## Notes

Enabling checksums in a large cluster can potentially take a long time. During this operation, the cluster or other programs that write to the data directory must not be started or else data loss may occur.

When using a replication setup with tools which perform direct copies of relation file blocks (for example [pg_rewind](app-pgrewind)), enabling or disabling checksums can lead to page corruptions in the shape of incorrect checksums if the operation is not done consistently across all nodes. When enabling or disabling checksums in a replication setup, it is thus recommended to stop all the clusters before switching them all consistently. Destroying all standbys, performing the operation on the primary and finally recreating the standbys from scratch is also safe.

If pg_checksums is aborted or killed while enabling or disabling checksums, the cluster's data checksum configuration remains unchanged, and pg_checksums can be re-run to perform the same operation.
