[#id](#PGTESTFSYNC)

## pg_test_fsync

pg_test_fsync — determine fastest `wal_sync_method` for PostgreSQL

## Synopsis

`pg_test_fsync` \[_`option`_...]

[#id](#id-1.9.5.10.5)

## Description

pg_test_fsync is intended to give you a reasonable idea of what the fastest [wal_sync_method](runtime-config-wal#GUC-WAL-SYNC-METHOD) is on your specific system, as well as supplying diagnostic information in the event of an identified I/O problem. However, differences shown by pg_test_fsync might not make any significant difference in real database throughput, especially since many database servers are not speed-limited by their write-ahead logs. pg_test_fsync reports average file sync operation time in microseconds for each `wal_sync_method`, which can also be used to inform efforts to optimize the value of [commit_delay](runtime-config-wal#GUC-COMMIT-DELAY).

[#id](#id-1.9.5.10.6)

## Options

pg_test_fsync accepts the following command-line options:

- `-f``--filename`

  Specifies the file name to write test data in. This file should be in the same file system that the `pg_wal` directory is or will be placed in. (`pg_wal` contains the WAL files.) The default is `pg_test_fsync.out` in the current directory.

- `-s``--secs-per-test`

  Specifies the number of seconds for each test. The more time per test, the greater the test's accuracy, but the longer it takes to run. The default is 5 seconds, which allows the program to complete in under 2 minutes.

- `-V``--version`

  Print the pg_test_fsync version and exit.

- `-?``--help`

  Show help about pg_test_fsync command line arguments, and exit.

[#id](#id-1.9.5.10.7)

## Environment

The environment variable `PG_COLOR` specifies whether to use color in diagnostic messages. Possible values are `always`, `auto` and `never`.

[#id](#id-1.9.5.10.8)

## See Also

[postgres](app-postgres)
