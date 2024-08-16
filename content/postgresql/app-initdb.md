[#id](#APP-INITDB)

## initdb

initdb — create a new PostgreSQL database cluster

## Synopsis

`initdb` \[_`option`_...] \[ `--pgdata` | `-D` ]_` directory`_

[#id](#R1-APP-INITDB-1)

## Description

`initdb` creates a new PostgreSQL [\*\*](glossary#GLOSSARY-DB-CLUSTER)_[database cluster](glossary#GLOSSARY-DB-CLUSTER)_.

Creating a database cluster consists of creating the [\*\*](glossary#GLOSSARY-DATA-DIRECTORY)_[directories](glossary#GLOSSARY-DATA-DIRECTORY)_ in which the cluster data will live, generating the shared catalog tables (tables that belong to the whole cluster rather than to any particular database), and creating the `postgres`, `template1`, and `template0` databases. The `postgres` database is a default database meant for use by users, utilities and third party applications. `template1` and `template0` are meant as source databases to be copied by later `CREATE DATABASE` commands. `template0` should never be modified, but you can add objects to `template1`, which by default will be copied into databases created later. See [Section 23.3](manage-ag-templatedbs) for more details.

Although `initdb` will attempt to create the specified data directory, it might not have permission if the parent directory of the desired data directory is root-owned. To initialize in such a setup, create an empty data directory as root, then use `chown` to assign ownership of that directory to the database user account, then `su` to become the database user to run `initdb`.

`initdb` must be run as the user that will own the server process, because the server needs to have access to the files and directories that `initdb` creates. Since the server cannot be run as root, you must not run `initdb` as root either. (It will in fact refuse to do so.)

For security reasons the new cluster created by `initdb` will only be accessible by the cluster owner by default. The `--allow-group-access` option allows any user in the same group as the cluster owner to read files in the cluster. This is useful for performing backups as a non-privileged user.

`initdb` initializes the database cluster's default locale and character set encoding. These can also be set separately for each database when it is created. `initdb` determines those settings for the template databases, which will serve as the default for all other databases.

By default, `initdb` uses the locale provider `libc` (see [Section 24.1.4](locale#LOCALE-PROVIDERS)). The `libc` locale provider takes the locale settings from the environment, and determines the encoding from the locale settings.

To choose a different locale for the cluster, use the option `--locale`. There are also individual options `--lc-*` and `--icu-locale` (see below) to set values for the individual locale categories. Note that inconsistent settings for different locale categories can give nonsensical results, so this should be used with care.

Alternatively, `initdb` can use the ICU library to provide locale services by specifying `--locale-provider=icu`. The server must be built with ICU support. To choose the specific ICU locale ID to apply, use the option `--icu-locale`. Note that for implementation reasons and to support legacy code, `initdb` will still select and initialize libc locale settings when the ICU locale provider is used.

When `initdb` runs, it will print out the locale settings it has chosen. If you have complex requirements or specified multiple options, it is advisable to check that the result matches what was intended.

More details about locale settings can be found in [Section 24.1](locale).

To alter the default encoding, use the `--encoding`. More details can be found in [Section 24.3](multibyte).

[#id](#id-1.9.5.3.6)

## Options

- `-A authmethod``--auth=authmethod` [#](#APP-INITDB-OPTION-AUTH)

  This option specifies the default authentication method for local users used in `pg_hba.conf` (`host` and `local` lines). See [Section 21.1](auth-pg-hba-conf) for an overview of valid values.

  `initdb` will prepopulate `pg_hba.conf` entries using the specified authentication method for non-replication as well as replication connections.

  Do not use `trust` unless you trust all local users on your system. `trust` is the default for ease of installation.

- `--auth-host=authmethod` [#](#APP-INITDB-OPTION-AUTH-HOST)

  This option specifies the authentication method for local users via TCP/IP connections used in `pg_hba.conf` (`host` lines).

- `--auth-local=authmethod` [#](#APP-INITDB-OPTION-AUTH-LOCAL)

  This option specifies the authentication method for local users via Unix-domain socket connections used in `pg_hba.conf` (`local` lines).

- `-D directory``--pgdata=directory` [#](#APP-INITDB-OPTION-PGDATA)

  This option specifies the directory where the database cluster should be stored. This is the only information required by `initdb`, but you can avoid writing it by setting the `PGDATA` environment variable, which can be convenient since the database server (`postgres`) can find the data directory later by the same variable.

- `-E encoding``--encoding=encoding` [#](#APP-INITDB-OPTION-ENCODING)

  Selects the encoding of the template databases. This will also be the default encoding of any database you create later, unless you override it then. The character sets supported by the PostgreSQL server are described in [Section 24.3.1](multibyte#MULTIBYTE-CHARSET-SUPPORTED).

  By default, the template database encoding is derived from the locale. If [`--no-locale`](app-initdb#APP-INITDB-OPTION-NO-LOCALE) is specified (or equivalently, if the locale is `C` or `POSIX`), then the default is `UTF8` for the ICU provider and `SQL_ASCII` for the `libc` provider.

- `-g``--allow-group-access` [#](#APP-INITDB-ALLOW-GROUP-ACCESS)

  Allows users in the same group as the cluster owner to read all cluster files created by `initdb`. This option is ignored on Windows as it does not support POSIX-style group permissions.

- `--icu-locale=locale` [#](#APP-INITDB-ICU-LOCALE)

  Specifies the ICU locale when the ICU provider is used. Locale support is described in [Section 24.1](locale).

- `--icu-rules=rules` [#](#APP-INITDB-ICU-RULES)

  Specifies additional collation rules to customize the behavior of the default collation. This is supported for ICU only.

- `-k``--data-checksums` [#](#APP-INITDB-DATA-CHECKSUMS)

  Use checksums on data pages to help detect corruption by the I/O system that would otherwise be silent. Enabling checksums may incur a noticeable performance penalty. If set, checksums are calculated for all objects, in all databases. All checksum failures will be reported in the [`pg_stat_database`](monitoring-stats#MONITORING-PG-STAT-DATABASE-VIEW) view. See [Section 30.2](checksums) for details.

- `--locale=locale` [#](#APP-INITDB-OPTION-LOCALE)

  Sets the default locale for the database cluster. If this option is not specified, the locale is inherited from the environment that `initdb` runs in. Locale support is described in [Section 24.1](locale).

- `--lc-collate=locale``--lc-ctype=locale``--lc-messages=locale``--lc-monetary=locale``--lc-numeric=locale``--lc-time=locale` [#](#APP-INITDB-OPTION-LC-COLLATE)

  Like `--locale`, but only sets the locale in the specified category.

- `--no-locale` [#](#APP-INITDB-OPTION-NO-LOCALE)

  Equivalent to `--locale=C`.

- `--locale-provider={libc|icu}` [#](#APP-INITDB-OPTION-LOCALE-PROVIDER)

  This option sets the locale provider for databases created in the new cluster. It can be overridden in the `CREATE DATABASE` command when new databases are subsequently created. The default is `libc` (see [Section 24.1.4](locale#LOCALE-PROVIDERS)).

- `-N``--no-sync` [#](#APP-INITDB-OPTION-NO-SYNC)

  By default, `initdb` will wait for all files to be written safely to disk. This option causes `initdb` to return without waiting, which is faster, but means that a subsequent operating system crash can leave the data directory corrupt. Generally, this option is useful for testing, but should not be used when creating a production installation.

- `--no-instructions` [#](#APP-INITDB-OPTION-NO-INSTRUCTIONS)

  By default, `initdb` will write instructions for how to start the cluster at the end of its output. This option causes those instructions to be left out. This is primarily intended for use by tools that wrap `initdb` in platform-specific behavior, where those instructions are likely to be incorrect.

- `--pwfile=filename` [#](#APP-INITDB-OPTION-PWFILE)

  Makes `initdb` read the bootstrap superuser's password from a file. The first line of the file is taken as the password.

- `-S``--sync-only` [#](#APP-INITDB-OPTION-SYNC-ONLY)

  Safely write all database files to disk and exit. This does not perform any of the normal initdb operations. Generally, this option is useful for ensuring reliable recovery after changing [fsync](runtime-config-wal#GUC-FSYNC) from `off` to `on`.

- `-T config``--text-search-config=config` [#](#APP-INITDB-OPTION-TEXT-SEARCH-CONFIG)

  Sets the default text search configuration. See [default_text_search_config](runtime-config-client#GUC-DEFAULT-TEXT-SEARCH-CONFIG) for further information.

- `-U username``--username=username` [#](#APP-INITDB-OPTION-USERNAME)

  Selects the user name of the [\*\*](glossary#GLOSSARY-BOOTSTRAP-SUPERUSER)_[bootstrap superuser](glossary#GLOSSARY-BOOTSTRAP-SUPERUSER)_. This defaults to the name of the [\*\*](glossary#GLOSSARY-CLUSTER-OWNER)_[cluster owner](glossary#GLOSSARY-CLUSTER-OWNER)_.

- `-W``--pwprompt` [#](#APP-INITDB-OPTION-PWPROMPT)

  Makes `initdb` prompt for a password to give the bootstrap superuser. If you don't plan on using password authentication, this is not important. Otherwise you won't be able to use password authentication until you have a password set up.

- `-X directory``--waldir=directory` [#](#APP-INITDB-OPTION-WALDIR)

  This option specifies the directory where the write-ahead log should be stored.

- `--wal-segsize=size` [#](#APP-INITDB-OPTION-WAL-SEGSIZE)

  Set the _WAL segment size_, in megabytes. This is the size of each individual file in the WAL log. The default size is 16 megabytes. The value must be a power of 2 between 1 and 1024 (megabytes). This option can only be set during initialization, and cannot be changed later.

  It may be useful to adjust this size to control the granularity of WAL log shipping or archiving. Also, in databases with a high volume of WAL, the sheer number of WAL files per directory can become a performance and management problem. Increasing the WAL file size will reduce the number of WAL files.

Other, less commonly used, options are also available:

- `-c name=value``--set name=value` [#](#APP-INITDB-OPTION-SET)

  Forcibly set the server parameter _`name`_ to _`value`_ during `initdb`, and also install that setting in the generated `postgresql.conf` file, so that it will apply during future server runs. This option can be given more than once to set several parameters. It is primarily useful when the environment is such that the server will not start at all using the default parameters.

- `-d``--debug` [#](#APP-INITDB-OPTION-DEBUG)

  Print debugging output from the bootstrap backend and a few other messages of lesser interest for the general public. The bootstrap backend is the program `initdb` uses to create the catalog tables. This option generates a tremendous amount of extremely boring output.

- `--discard-caches` [#](#APP-INITDB-OPTION-DISCARD-CACHES)

  Run the bootstrap backend with the `debug_discard_caches=1` option. This takes a very long time and is only of use for deep debugging.

- `-L directory` [#](#APP-INITDB-OPTION-L)

  Specifies where `initdb` should find its input files to initialize the database cluster. This is normally not necessary. You will be told if you need to specify their location explicitly.

- `-n``--no-clean` [#](#APP-INITDB-OPTION-NO-CLEAN)

  By default, when `initdb` determines that an error prevented it from completely creating the database cluster, it removes any files it might have created before discovering that it cannot finish the job. This option inhibits tidying-up and is thus useful for debugging.

Other options:

- `-V``--version` [#](#APP-INITDB-OPTION-VERSION)

  Print the initdb version and exit.

- `-?``--help` [#](#APP-INITDB-OPTION-HELP)

  Show help about initdb command line arguments, and exit.

[#id](#id-1.9.5.3.7)

## Environment

- `PGDATA` [#](#APP-INITDB-ENVIRONMENT-PGDATA)

  Specifies the directory where the database cluster is to be stored; can be overridden using the `-D` option.

- `PG_COLOR` [#](#APP-INITDB-ENVIRONMENT-PG-COLOR)

  Specifies whether to use color in diagnostic messages. Possible values are `always`, `auto` and `never`.

- `TZ` [#](#APP-INITDB-ENVIRONMENT-TZ)

  Specifies the default time zone of the created database cluster. The value should be a full time zone name (see [Section 8.5.3](datatype-datetime#DATATYPE-TIMEZONES)).

This utility, like most other PostgreSQL utilities, also uses the environment variables supported by libpq (see [Section 34.15](libpq-envars)).

[#id](#id-1.9.5.3.8)

## Notes

`initdb` can also be invoked via `pg_ctl initdb`.

[#id](#id-1.9.5.3.9)

## See Also

[pg_ctl](app-pg-ctl), [postgres](app-postgres), [Section 21.1](auth-pg-hba-conf)
