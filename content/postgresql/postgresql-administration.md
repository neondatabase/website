---
title: 'PostgreSQL Administration'
page_title: 'PostgreSQL Administration'
page_description: 'PostgreSQL administration covers common database administrative tasks including role and database management, backup, and restore.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/'
ogImage: ''
updatedOn: '2024-02-22T07:13:56+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL JSON Index'
  slug: 'postgresql-indexes/postgresql-json-index'
nextLink:
  title: 'PostgreSQL CREATE DATABASE'
  slug: 'postgresql-administration/postgresql-create-database'
---

The **PostgreSQL administration** covers the most important PostgreSQL database server administration tasks.

## Section 1\. Managing Databases

In this section, you will learn how to manage databases in PostgreSQL including creating databases, modifying existing database features, and deleting databases.

- [Create Database](postgresql-administration/postgresql-create-database 'PostgreSQL CREATE DATABASE') – create a new database using `CREATE DATABASE` statement.
- [Alter Database](postgresql-administration/postgresql-alter-database 'PostgreSQL ALTER DATABASE') – modify the features of an existing database using the `ALTER DATABASE` statement.
- [Rename Database](postgresql-administration/postgresql-rename-database) – change the name of the database to a new one.
- [Drop Database](postgresql-administration/postgresql-drop-database 'PostgreSQL DROP DATABASE') – remove a database permanently using the `DROP DATABASE` statement.
- [Copy a Database](postgresql-administration/postgresql-copy-database) – copy a database within a database server or from one server to another.
- [Get Database Object Sizes](postgresql-administration/postgresql-database-indexes-table-size) – introduce you to various handy functions to get the database size, table, and indexes.

## Section 2\. Managing Schemas

- [Schema](postgresql-administration/postgresql-schema) – introduce the schema concept and explain how the schema search path works in PostgreSQL.
- [Create Schema](postgresql-administration/postgresql-create-schema) – show you how to create a new schema in a database.
- [Alter Schema](postgresql-administration/postgresql-alter-schema) – rename a schema or change its owner to the new one.
- [Drop schema](postgresql-administration/postgresql-drop-schema) – delete one or more schemas with their objects from a database.

## Section 3\. Managing Tablespaces

PostgreSQL tablespaces allow you to control how data is stored in the file system. The tablespaces are very useful in many cases such as managing large tables and improving database performance.

- [Creating Tablespaces](postgresql-administration/postgresql-create-tablespace 'PostgreSQL Creating Tablespaces') – introduce you to PostgreSQL tablespaces and shows you how to create tablespaces by using `CREATE TABLESPACE` statement.
- [Changing Tablespaces](postgresql-administration/postgresql-alter-tablespace 'PostgreSQL ALTER TABLESPACE') – show you how to rename, change owner, and set the parameter for a tablespace by using `ALTER TABLESPACE` statement.
- [Delete Tablespaces](postgresql-administration/postgresql-drop-tablespace 'Deleting Tablespaces Using PostgreSQL DROP TABLESPACE Statement') – learn how to delete tablespaces by using `DROP TABLESPACE` statement.

## Section 4\. Roles \& Privileges

PostgreSQL represents user accounts as roles. Roles that can log in are called login roles or users. Roles that contain other roles are called group roles. In this section, you will learn how to manage roles and groups effectively.

- [Create role](postgresql-administration/postgresql-roles 'PostgresQL Roles Management') – introduce you to the concept of the role and show you how to create roles and groups.
- [Grant](postgresql-administration/postgresql-grant) – show you how to grant privileges on database objects to a role.
- [Revoke](postgresql-administration/postgresql-revoke) – guide you on revoking granted privileges on database objects from a role.
- [Alter role](postgresql-administration/postgresql-alter-role) – show you how to use the alter role statement to modify the attributes of roles, rename roles, and set the configuration parameters.
- [Drop role](postgresql-administration/postgresql-drop-role) – learn how to drop a role, especially one with dependent objects.
- [Role membership](postgresql-administration/postgresql-role-membership) – learn how to create group roles to manage role membership better.
- [SET ROLE](postgresql-administration/postgresql-set-role) – show you how to temporarily switch the current role to one of its group roles using the SET ROLE statement.
- [CURRENT_USER](postgresql-administration/postgresql-current_user) – discover how to get the currently logged\-in user and show you the difference between current_user and session_user.
- [List roles](postgresql-administration/postgresql-list-users) – show you how to list all roles on the PostgreSQL server.
- [Superuser](postgresql-administration/create-superuser-postgresql) – learn about a special role called superuser in PostgreSQL.
- [Row\-level Security](postgresql-administration/postgresql-row-level-security) – show you how to use row\-level security (RLS) to restrict rows returned by a query based on a condition.

## Section 5\. Backup \& Restore Databases

This section shows you how to use various PostgreSQL backup and restore tools including `pg_dump`, `pg_dumpall`, `psql`,  `pg_restore` and  `pgAdmin` to backup and restore databases.

- [Backup](postgresql-administration/postgresql-backup-database 'PostgreSQL Backup') – introduce you to practical ways to perform a logical backup of a database or all databases in a PostgreSQL cluster using the `pg_dump` and `pg_dumpall` tools.
- [Restore](postgresql-administration/postgresql-restore-database 'PostgreSQL Restore Database') –  show how to restore a PostgreSQL database from an archive file using the `pg_restore` tool.

## Section 6\. PostgreSQL Tips

- [Reset Password](postgresql-administration/postgresql-reset-password) – show you how to reset the forgotten password of the postgres user.
- [psql Commands](postgresql-administration/psql-commands) – give you the most common psql command to help you query data from PostgreSQL faster and more effectively.
- [Describe Table](postgresql-administration/postgresql-describe-table) – get information on a particular table.
- [Show Databases](postgresql-administration/postgresql-show-databases) – list all databases in the current database server
- [Show Tables](postgresql-administration/postgresql-show-tables) – show all tables in the current database.
