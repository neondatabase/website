[#id](#VIEW-PG-SETTINGS)

## 54.24. `pg_settings` [#](#VIEW-PG-SETTINGS)

The view `pg_settings` provides access to run-time parameters of the server. It is essentially an alternative interface to the [`SHOW`](sql-show) and [`SET`](sql-set) commands. It also provides access to some facts about each parameter that are not directly available from [`SHOW`](sql-show), such as minimum and maximum values.

[#id](#id-1.10.5.28.4)

**Table 54.24. `pg_settings` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` `text`Run-time configuration parameter name                                                                                                                                                                                                                                                       |
| `setting` `text`Current value of the parameter                                                                                                                                                                                                                                                           |
| `unit` `text`Implicit unit of the parameter                                                                                                                                                                                                                                                              |
| `category` `text`Logical group of the parameter                                                                                                                                                                                                                                                          |
| `short_desc` `text`A brief description of the parameter                                                                                                                                                                                                                                                  |
| `extra_desc` `text`Additional, more detailed, description of the parameter                                                                                                                                                                                                                               |
| `context` `text`Context required to set the parameter's value (see below)                                                                                                                                                                                                                                |
| `vartype` `text`Parameter type (`bool`, `enum`, `integer`, `real`, or `string`)                                                                                                                                                                                                                          |
| `source` `text`Source of the current parameter value                                                                                                                                                                                                                                                     |
| `min_val` `text`Minimum allowed value of the parameter (null for non-numeric values)                                                                                                                                                                                                                     |
| `max_val` `text`Maximum allowed value of the parameter (null for non-numeric values)                                                                                                                                                                                                                     |
| `enumvals` `text[]`Allowed values of an enum parameter (null for non-enum values)                                                                                                                                                                                                                        |
| `boot_val` `text`Parameter value assumed at server startup if the parameter is not otherwise set                                                                                                                                                                                                         |
| `reset_val` `text`Value that [`RESET`](sql-reset) would reset the parameter to in the current session                                                                                                                                                                                                    |
| `sourcefile` `text`Configuration file the current value was set in (null for values set from sources other than configuration files, or when examined by a user who neither is a superuser nor has privileges of `pg_read_all_settings`); helpful when using `include` directives in configuration files |
| `sourceline` `int4`Line number within the configuration file the current value was set at (null for values set from sources other than configuration files, or when examined by a user who neither is a superuser nor has privileges of `pg_read_all_settings`).                                         |
| `pending_restart` `bool``true` if the value has been changed in the configuration file but needs a restart; or `false` otherwise.                                                                                                                                                                        |

There are several possible values of `context`. In order of decreasing difficulty of changing the setting, they are:

- `internal`

  These settings cannot be changed directly; they reflect internally determined values. Some of them may be adjustable by rebuilding the server with different configuration options, or by changing options supplied to initdb.

- `postmaster`

  These settings can only be applied when the server starts, so any change requires restarting the server. Values for these settings are typically stored in the `postgresql.conf` file, or passed on the command line when starting the server. Of course, settings with any of the lower `context` types can also be set at server start time.

- `sighup`

  Changes to these settings can be made in `postgresql.conf` without restarting the server. Send a SIGHUP signal to the postmaster to cause it to re-read `postgresql.conf` and apply the changes. The postmaster will also forward the SIGHUP signal to its child processes so that they all pick up the new value.

- `superuser-backend`

  Changes to these settings can be made in `postgresql.conf` without restarting the server. They can also be set for a particular session in the connection request packet (for example, via libpq's `PGOPTIONS` environment variable), but only if the connecting user is a superuser or has been granted the appropriate `SET` privilege. However, these settings never change in a session after it is started. If you change them in `postgresql.conf`, send a SIGHUP signal to the postmaster to cause it to re-read `postgresql.conf`. The new values will only affect subsequently-launched sessions.

- `backend`

  Changes to these settings can be made in `postgresql.conf` without restarting the server. They can also be set for a particular session in the connection request packet (for example, via libpq's `PGOPTIONS` environment variable); any user can make such a change for their session. However, these settings never change in a session after it is started. If you change them in `postgresql.conf`, send a SIGHUP signal to the postmaster to cause it to re-read `postgresql.conf`. The new values will only affect subsequently-launched sessions.

- `superuser`

  These settings can be set from `postgresql.conf`, or within a session via the `SET` command; but only superusers and users with the appropriate `SET` privilege can change them via `SET`. Changes in `postgresql.conf` will affect existing sessions only if no session-local value has been established with `SET`.

- `user`

  These settings can be set from `postgresql.conf`, or within a session via the `SET` command. Any user is allowed to change their session-local value. Changes in `postgresql.conf` will affect existing sessions only if no session-local value has been established with `SET`.

See [Section 20.1](config-setting) for more information about the various ways to change these parameters.

This view cannot be inserted into or deleted from, but it can be updated. An `UPDATE` applied to a row of `pg_settings` is equivalent to executing the `SET` command on that named parameter. The change only affects the value used by the current session. If an `UPDATE` is issued within a transaction that is later aborted, the effects of the `UPDATE` command disappear when the transaction is rolled back. Once the surrounding transaction is committed, the effects will persist until the end of the session, unless overridden by another `UPDATE` or `SET`.

This view does not display [customized options](runtime-config-custom) unless the extension module that defines them has been loaded by the backend process executing the query (e.g., via a mention in [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES), a call to a C function in the extension, or the [`LOAD`](sql-load) command). For example, since [archive modules](archive-modules) are normally loaded only by the archiver process not regular sessions, this view will not display any customized options defined by such modules unless special action is taken to load them into the backend process executing the query.
