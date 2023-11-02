## 54.5. `pg_config` [#](#VIEW-PG-CONFIG)

The view `pg_config` describes the compile-time configuration parameters of the currently installed version of PostgreSQL. It is intended, for example, to be used by software packages that want to interface to PostgreSQL to facilitate finding the required header files and libraries. It provides the same basic information as the [pg\_config](app-pgconfig "pg_config") PostgreSQL client application.

By default, the `pg_config` view can be read only by superusers.

**Table 54.5. `pg_config` Columns**

| Column TypeDescription              |
| ----------------------------------- |
| `name` `text`The parameter name     |
| `setting` `text`The parameter value |