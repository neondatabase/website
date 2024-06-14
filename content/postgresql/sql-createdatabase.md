[#id](#SQL-CREATEDATABASE)

## CREATE DATABASE

CREATE DATABASE — create a new database

## Synopsis

```
CREATE DATABASE name
    [ WITH ] [ OWNER [=] user_name ]
           [ TEMPLATE [=] template ]
           [ ENCODING [=] encoding ]
           [ STRATEGY [=] strategy ] ]
           [ LOCALE [=] locale ]
           [ LC_COLLATE [=] lc_collate ]
           [ LC_CTYPE [=] lc_ctype ]
           [ ICU_LOCALE [=] icu_locale ]
           [ ICU_RULES [=] icu_rules ]
           [ LOCALE_PROVIDER [=] locale_provider ]
           [ COLLATION_VERSION = collation_version ]
           [ TABLESPACE [=] tablespace_name ]
           [ ALLOW_CONNECTIONS [=] allowconn ]
           [ CONNECTION LIMIT [=] connlimit ]
           [ IS_TEMPLATE [=] istemplate ]
           [ OID [=] oid ]
```

[#id](#id-1.9.3.61.5)

## Description

`CREATE DATABASE` creates a new PostgreSQL database.

To create a database, you must be a superuser or have the special `CREATEDB` privilege. See [CREATE ROLE](sql-createrole).

By default, the new database will be created by cloning the standard system database `template1`. A different template can be specified by writing `TEMPLATE name`. In particular, by writing `TEMPLATE template0`, you can create a pristine database (one where no user-defined objects exist and where the system objects have not been altered) containing only the standard objects predefined by your version of PostgreSQL. This is useful if you wish to avoid copying any installation-local objects that might have been added to `template1`.

[#id](#id-1.9.3.61.6)

## Parameters

- _`name`_ [#](#CREATE-DATABASE-NAME)

  The name of a database to create.

- _`user_name`_ [#](#CREATE-DATABASE-USER-NAME)

  The role name of the user who will own the new database, or `DEFAULT` to use the default (namely, the user executing the command). To create a database owned by another role, you must be able to `SET ROLE` to that role.

- _`template`_ [#](#CREATE-DATABASE-TEMPLATE)

  The name of the template from which to create the new database, or `DEFAULT` to use the default template (`template1`).

- _`encoding`_ [#](#CREATE-DATABASE-ENCODING)

  Character set encoding to use in the new database. Specify a string constant (e.g., `'SQL_ASCII'`), or an integer encoding number, or `DEFAULT` to use the default encoding (namely, the encoding of the template database). The character sets supported by the PostgreSQL server are described in [Section 24.3.1](multibyte#MULTIBYTE-CHARSET-SUPPORTED). See below for additional restrictions.

- _`strategy`_ [#](#CREATE-DATABASE-STRATEGY)

  Strategy to be used in creating the new database. If the `WAL_LOG` strategy is used, the database will be copied block by block and each block will be separately written to the write-ahead log. This is the most efficient strategy in cases where the template database is small, and therefore it is the default. The older `FILE_COPY` strategy is also available. This strategy writes a small record to the write-ahead log for each tablespace used by the target database. Each such record represents copying an entire directory to a new location at the filesystem level. While this does reduce the write-ahead log volume substantially, especially if the template database is large, it also forces the system to perform a checkpoint both before and after the creation of the new database. In some situations, this may have a noticeable negative impact on overall system performance.

- _`locale`_ [#](#CREATE-DATABASE-LOCALE)

  Sets the default collation order and character classification in the new database. Collation affects the sort order applied to strings, e.g., in queries with `ORDER BY`, as well as the order used in indexes on text columns. Character classification affects the categorization of characters, e.g., lower, upper, and digit. Also sets the associated aspects of the operating system environment, `LC_COLLATE` and `LC_CTYPE`. The default is the same setting as the template database. See [Section 24.2.2.3.1](collation#COLLATION-MANAGING-CREATE-LIBC) and [Section 24.2.2.3.2](collation#COLLATION-MANAGING-CREATE-ICU) for details.

  Can be overridden by setting [_`lc_collate`_](sql-createdatabase#CREATE-DATABASE-LC-COLLATE), [_`lc_ctype`_](sql-createdatabase#CREATE-DATABASE-LC-CTYPE), or [_`icu_locale`_](sql-createdatabase#CREATE-DATABASE-ICU-LOCALE) individually.

  ### Tip

  The other locale settings [lc_messages](runtime-config-client#GUC-LC-MESSAGES), [lc_monetary](runtime-config-client#GUC-LC-MONETARY), [lc_numeric](runtime-config-client#GUC-LC-NUMERIC), and [lc_time](runtime-config-client#GUC-LC-TIME) are not fixed per database and are not set by this command. If you want to make them the default for a specific database, you can use `ALTER DATABASE ... SET`.

- _`lc_collate`_ [#](#CREATE-DATABASE-LC-COLLATE)

  Sets `LC_COLLATE` in the database server's operating system environment. The default is the setting of [_`locale`_](sql-createdatabase#CREATE-DATABASE-LOCALE) if specified, otherwise the same setting as the template database. See below for additional restrictions.

  If [_`locale_provider`_](sql-createdatabase#CREATE-DATABASE-LOCALE-PROVIDER) is `libc`, also sets the default collation order to use in the new database, overriding the setting [_`locale`_](sql-createdatabase#CREATE-DATABASE-LOCALE).

- _`lc_ctype`_ [#](#CREATE-DATABASE-LC-CTYPE)

  Sets `LC_CTYPE` in the database server's operating system environment. The default is the setting of [_`locale`_](sql-createdatabase#CREATE-DATABASE-LOCALE) if specified, otherwise the same setting as the template database. See below for additional restrictions.

  If [_`locale_provider`_](sql-createdatabase#CREATE-DATABASE-LOCALE-PROVIDER) is `libc`, also sets the default character classification to use in the new database, overriding the setting [_`locale`_](sql-createdatabase#CREATE-DATABASE-LOCALE).

- _`icu_locale`_ [#](#CREATE-DATABASE-ICU-LOCALE)

  Specifies the ICU locale (see [Section 24.2.2.3.2](collation#COLLATION-MANAGING-CREATE-ICU)) for the database default collation order and character classification, overriding the setting [_`locale`_](sql-createdatabase#CREATE-DATABASE-LOCALE). The [locale provider](sql-createdatabase#CREATE-DATABASE-LOCALE-PROVIDER) must be ICU. The default is the setting of [_`locale`_](sql-createdatabase#CREATE-DATABASE-LOCALE) if specified; otherwise the same setting as the template database.

- _`icu_rules`_ [#](#CREATE-DATABASE-ICU-RULES)

  Specifies additional collation rules to customize the behavior of the default collation of this database. This is supported for ICU only. See [Section 24.2.3.4](collation#ICU-TAILORING-RULES) for details.

- _`locale_provider`_ [#](#CREATE-DATABASE-LOCALE-PROVIDER)

  Specifies the provider to use for the default collation in this database. Possible values are `icu` (if the server was built with ICU support) or `libc`. By default, the provider is the same as that of the [_`template`_](sql-createdatabase#CREATE-DATABASE-TEMPLATE). See [Section 24.1.4](locale#LOCALE-PROVIDERS) for details.

- _`collation_version`_ [#](#CREATE-DATABASE-COLLATION-VERSION)

  Specifies the collation version string to store with the database. Normally, this should be omitted, which will cause the version to be computed from the actual version of the database collation as provided by the operating system. This option is intended to be used by `pg_upgrade` for copying the version from an existing installation.

  See also [ALTER DATABASE](sql-alterdatabase) for how to handle database collation version mismatches.

- _`tablespace_name`_ [#](#CREATE-DATABASE-TABLESPACE-NAME)

  The name of the tablespace that will be associated with the new database, or `DEFAULT` to use the template database's tablespace. This tablespace will be the default tablespace used for objects created in this database. See [CREATE TABLESPACE](sql-createtablespace) for more information.

- _`allowconn`_ [#](#CREATE-DATABASE-ALLOWCONN)

  If false then no one can connect to this database. The default is true, allowing connections (except as restricted by other mechanisms, such as `GRANT`/`REVOKE CONNECT`).

- _`connlimit`_ [#](#CREATE-DATABASE-CONNLIMIT)

  How many concurrent connections can be made to this database. -1 (the default) means no limit.

- _`istemplate`_ [#](#CREATE-DATABASE-ISTEMPLATE)

  If true, then this database can be cloned by any user with `CREATEDB` privileges; if false (the default), then only superusers or the owner of the database can clone it.

- _`oid`_ [#](#CREATE-DATABASE-OID)

  The object identifier to be used for the new database. If this parameter is not specified, PostgreSQL will choose a suitable OID automatically. This parameter is primarily intended for internal use by pg_upgrade, and only pg_upgrade can specify a value less than 16384.

Optional parameters can be written in any order, not only the order illustrated above.

[#id](#id-1.9.3.61.7)

## Notes

`CREATE DATABASE` cannot be executed inside a transaction block.

Errors along the line of “could not initialize database directory” are most likely related to insufficient permissions on the data directory, a full disk, or other file system problems.

Use [`DROP DATABASE`](sql-dropdatabase) to remove a database.

The program [createdb](app-createdb) is a wrapper program around this command, provided for convenience.

Database-level configuration parameters (set via [`ALTER DATABASE`](sql-alterdatabase)) and database-level permissions (set via [`GRANT`](sql-grant)) are not copied from the template database.

Although it is possible to copy a database other than `template1` by specifying its name as the template, this is not (yet) intended as a general-purpose “`COPY DATABASE`” facility. The principal limitation is that no other sessions can be connected to the template database while it is being copied. `CREATE DATABASE` will fail if any other connection exists when it starts; otherwise, new connections to the template database are locked out until `CREATE DATABASE` completes. See [Section 23.3](manage-ag-templatedbs) for more information.

The character set encoding specified for the new database must be compatible with the chosen locale settings (`LC_COLLATE` and `LC_CTYPE`). If the locale is `C` (or equivalently `POSIX`), then all encodings are allowed, but for other locale settings there is only one encoding that will work properly. (On Windows, however, UTF-8 encoding can be used with any locale.) `CREATE DATABASE` will allow superusers to specify `SQL_ASCII` encoding regardless of the locale settings, but this choice is deprecated and may result in misbehavior of character-string functions if data that is not encoding-compatible with the locale is stored in the database.

The encoding and locale settings must match those of the template database, except when `template0` is used as template. This is because other databases might contain data that does not match the specified encoding, or might contain indexes whose sort ordering is affected by `LC_COLLATE` and `LC_CTYPE`. Copying such data would result in a database that is corrupt according to the new settings. `template0`, however, is known to not contain any data or indexes that would be affected.

There is currently no option to use a database locale with nondeterministic comparisons (see [`CREATE COLLATION`](sql-createcollation) for an explanation). If this is needed, then per-column collations would need to be used.

The `CONNECTION LIMIT` option is only enforced approximately; if two new sessions start at about the same time when just one connection “slot” remains for the database, it is possible that both will fail. Also, the limit is not enforced against superusers or background worker processes.

[#id](#id-1.9.3.61.8)

## Examples

To create a new database:

```
CREATE DATABASE lusiadas;
```

To create a database `sales` owned by user `salesapp` with a default tablespace of `salesspace`:

```
CREATE DATABASE sales OWNER salesapp TABLESPACE salesspace;
```

To create a database `music` with a different locale:

```
CREATE DATABASE music
    LOCALE 'sv_SE.utf8'
    TEMPLATE template0;
```

In this example, the `TEMPLATE template0` clause is required if the specified locale is different from the one in `template1`. (If it is not, then specifying the locale explicitly is redundant.)

To create a database `music2` with a different locale and a different character set encoding:

```
CREATE DATABASE music2
    LOCALE 'sv_SE.iso885915'
    ENCODING LATIN9
    TEMPLATE template0;
```

The specified locale and encoding settings must match, or an error will be reported.

Note that locale names are specific to the operating system, so that the above commands might not work in the same way everywhere.

[#id](#id-1.9.3.61.9)

## Compatibility

There is no `CREATE DATABASE` statement in the SQL standard. Databases are equivalent to catalogs, whose creation is implementation-defined.

[#id](#id-1.9.3.61.10)

## See Also

[ALTER DATABASE](sql-alterdatabase), [DROP DATABASE](sql-dropdatabase)
