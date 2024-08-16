[#id](#EVENT-TRIGGER-MATRIX)

## 40.2. Event Trigger Firing Matrix [#](#EVENT-TRIGGER-MATRIX)

[Table 40.1](event-trigger-matrix#EVENT-TRIGGER-BY-COMMAND-TAG) lists all commands for which event triggers are supported.

[#id](#EVENT-TRIGGER-BY-COMMAND-TAG)

**Table 40.1. Event Trigger Support by Command Tag**

| Command Tag                        | `ddl_​command_​start` | `ddl_​command_​end` | `sql_​drop` | `table_​rewrite` | Notes                  |
| ---------------------------------- | --------------------- | ------------------- | ----------- | ---------------- | ---------------------- |
| `ALTER AGGREGATE`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER COLLATION`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER CONVERSION`                 | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER DOMAIN`                     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER DEFAULT PRIVILEGES`         | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER EXTENSION`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER FOREIGN DATA WRAPPER`       | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER FOREIGN TABLE`              | `X`                   | `X`                 | `X`         | `-`              |                        |
| `ALTER FUNCTION`                   | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER LANGUAGE`                   | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER LARGE OBJECT`               | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER MATERIALIZED VIEW`          | `X`                   | `X`                 | `-`         | `X`              |                        |
| `ALTER OPERATOR`                   | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER OPERATOR CLASS`             | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER OPERATOR FAMILY`            | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER POLICY`                     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER PROCEDURE`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER PUBLICATION`                | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER ROUTINE`                    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER SCHEMA`                     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER SEQUENCE`                   | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER SERVER`                     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER STATISTICS`                 | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER SUBSCRIPTION`               | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER TABLE`                      | `X`                   | `X`                 | `X`         | `X`              |                        |
| `ALTER TEXT SEARCH CONFIGURATION`  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER TEXT SEARCH DICTIONARY`     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER TEXT SEARCH PARSER`         | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER TEXT SEARCH TEMPLATE`       | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER TRIGGER`                    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER TYPE`                       | `X`                   | `X`                 | `-`         | `X`              |                        |
| `ALTER USER MAPPING`               | `X`                   | `X`                 | `-`         | `-`              |                        |
| `ALTER VIEW`                       | `X`                   | `X`                 | `-`         | `-`              |                        |
| `COMMENT`                          | `X`                   | `X`                 | `-`         | `-`              | Only for local objects |
| `CREATE ACCESS METHOD`             | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE AGGREGATE`                 | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE CAST`                      | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE COLLATION`                 | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE CONVERSION`                | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE DOMAIN`                    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE EXTENSION`                 | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE FOREIGN DATA WRAPPER`      | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE FOREIGN TABLE`             | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE FUNCTION`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE INDEX`                     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE LANGUAGE`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE MATERIALIZED VIEW`         | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE OPERATOR`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE OPERATOR CLASS`            | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE OPERATOR FAMILY`           | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE POLICY`                    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE PROCEDURE`                 | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE PUBLICATION`               | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE RULE`                      | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE SCHEMA`                    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE SEQUENCE`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE SERVER`                    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE STATISTICS`                | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE SUBSCRIPTION`              | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TABLE`                     | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TABLE AS`                  | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TEXT SEARCH CONFIGURATION` | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TEXT SEARCH DICTIONARY`    | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TEXT SEARCH PARSER`        | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TEXT SEARCH TEMPLATE`      | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TRIGGER`                   | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE TYPE`                      | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE USER MAPPING`              | `X`                   | `X`                 | `-`         | `-`              |                        |
| `CREATE VIEW`                      | `X`                   | `X`                 | `-`         | `-`              |                        |
| `DROP ACCESS METHOD`               | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP AGGREGATE`                   | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP CAST`                        | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP COLLATION`                   | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP CONVERSION`                  | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP DOMAIN`                      | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP EXTENSION`                   | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP FOREIGN DATA WRAPPER`        | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP FOREIGN TABLE`               | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP FUNCTION`                    | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP INDEX`                       | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP LANGUAGE`                    | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP MATERIALIZED VIEW`           | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP OPERATOR`                    | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP OPERATOR CLASS`              | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP OPERATOR FAMILY`             | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP OWNED`                       | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP POLICY`                      | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP PROCEDURE`                   | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP PUBLICATION`                 | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP ROUTINE`                     | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP RULE`                        | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP SCHEMA`                      | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP SEQUENCE`                    | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP SERVER`                      | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP STATISTICS`                  | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP SUBSCRIPTION`                | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TABLE`                       | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TEXT SEARCH CONFIGURATION`   | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TEXT SEARCH DICTIONARY`      | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TEXT SEARCH PARSER`          | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TEXT SEARCH TEMPLATE`        | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TRIGGER`                     | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP TYPE`                        | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP USER MAPPING`                | `X`                   | `X`                 | `X`         | `-`              |                        |
| `DROP VIEW`                        | `X`                   | `X`                 | `X`         | `-`              |                        |
| `GRANT`                            | `X`                   | `X`                 | `-`         | `-`              | Only for local objects |
| `IMPORT FOREIGN SCHEMA`            | `X`                   | `X`                 | `-`         | `-`              |                        |
| `REFRESH MATERIALIZED VIEW`        | `X`                   | `X`                 | `-`         | `-`              |                        |
| `REVOKE`                           | `X`                   | `X`                 | `-`         | `-`              | Only for local objects |
| `SECURITY LABEL`                   | `X`                   | `X`                 | `-`         | `-`              | Only for local objects |
| `SELECT INTO`                      | `X`                   | `X`                 | `-`         | `-`              |                        |
