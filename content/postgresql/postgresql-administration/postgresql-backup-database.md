---
title: "PostgreSQL Backup"
page_title: "PostgreSQL Backup - pg_dump & pg_dumpall"
page_description: "This tutorial shows you how to use PostgreSQL backup tools including pg_dump and pg_dumpall to backup databases in PostgreSQL."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-backup-database/"
ogImage: ""
updatedOn: "2024-02-20T02:00:57+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL DROP TABLESPACE Statement"
  slug: "postgresql-administration/postgresql-drop-tablespace"
next_page: 
  title: "PostgreSQL Restore Database"
  slug: "postgresql-administration/postgresql-restore-database"
---




**Summary**: in this tutorial, you will learn how to backup the PostgreSQL databases using the `pg_dump` and `pg_dumpall` tools.


## Introduction to PostgreSQL backup

A PostgreSQL backup is a copy of the data that you can use to recover the database later. Typically, a backup includes all or selected data, schema, and configuration settings necessary to restore the database to a desired state.

You need to back up PostgreSQL databases regularly to prevent data loss in case of human errors, hardware failures, disasters, or other unforeseen circumstances.

Before backing up the databases, you should consider the following types of backups:

* Logical backups
* Physical backups

PostgreSQL comes with `pg_dump` and `pg_dumpall` tools that help you perform logical backups effectively.


### pg\_dump

The `pg_dump` tool is a command\-line utility that you can use to create a logical backup of a PostgreSQL database.

The `pg_dump` extracts a PostgreSQL database into a script file or other archive file. The file represents the snapshot of the database at the time `pg_dump` begins running.

Here’s the syntax of the `pg_dump` command:


```csssql
pg_dump [connection_option] [option] [dbname]
```
The following table illustrates the options for the `pg_dump` command:



| Option | Description |
| --- | --- |
| \-U, –username\=USERNAME | Specifies the username to connect to the database. |
| \-h, –host\=HOSTNAME | Specifies the hostname of the server on which the PostgreSQL server is running. |
| \-p, –port\=PORT | Specifies the port number on which the PostgreSQL server is listening. |
| \-d, –dbname\=DBNAME | Specifies the name of the database to be dumped. |
| \-n, –schema\=SCHEMA | Specifies the schema(s) to be dumped. Multiple schemas can be specified, separated by commas. |
| \-t, –table\=TABLE | Specifies the table(s) to be dumped. Multiple tables can be specified, separated by commas. |
| \-F, –format\=FORMAT | Specifies the output file format (e.g., plain, custom, directory). |
| \-f, –file\=FILENAME | Specifies the name of the output file. |
| \-W, –password | Forces pg\_dump to prompt for a password before connecting to the PostgreSQL server. |
| \-w, –no\-password | Suppresses the password prompt, but the password might be supplied in other ways (e.g., .pgpass file). |
| \-c, –clean | Adds SQL commands to clean (drop) database objects before recreating them. |
| \-C, –create | Adds SQL commands to create the database before restoring data into it. |
| \-a, –data\-only | Dumps only the data, not the schema (no schema\-creating commands are included). |
| \-s, –schema\-only | Dumps only the schema, not the data. |
| \-x, –no\-privileges | Excludes access privileges (GRANT/REVOKE commands) from the dump. |
| \-X, –no\-owner | Prevents dumping of object ownership information (such as `OWNER TO`). |
| \-h, –help | Displays help and usage information. |


### pg\_dumpall

The `pg_dumpall` tool is a command\-line utility that you can use to create logical backups of the entire PostgreSQL cluster, including all databases, schemas, roles, and other cluster\-wide objects.

Unlike the `pg_dump` tool which backups individual databases or objects, the `pg_dumpall` tool offers a convenient way to make a backup of all databases in an PostgreSQL cluster (instance) in a single operation.

Here’s the syntax for `pg_dumpall` command:


```css
pg_dump [connection_option] [option]
```
The following table presents some common command\-line options for `pg_dumpall` utility:



| Option | Description |
| --- | --- |
| \-U, –username\=USERNAME | Specifies the username to connect to the PostgreSQL server. |
| \-h, –host\=HOSTNAME | Specifies the hostname of the server on which the PostgreSQL server is running. |
| \-p, –port\=PORT | Specifies the port number on which the PostgreSQL server is listening. |
| \-g, –globals\-only | Dumps only global objects (roles and tablespaces), no database\-specific objects. |
| \-r, –roles\-only | Dumps only role (user and group) definitions, no databases or tablespaces. |
| \-t, –tablespaces\-only | Dumps only the definitions of tablespaces, no databases or roles. |
| \-c, –clean | Adds SQL commands to clean (drop) database objects before recreating them. |
| \-C, –create | Adds SQL commands to create the database before restoring data into it. |
| \-x, –no\-privileges | Excludes access privileges (GRANT/REVOKE commands) from the dump. |
| \-X, –no\-owner | Prevents dumping of object ownership information (such as `OWNER TO`). |
| \-s, –schema\-only | Dumps only the schema, no data. |
| \-v, –verbose | Displays verbose output, including informational messages during the dump process. |
| \-V, –version | Displays the version of pg\_dumpall and exits. |
| \-?, –help | Displays help and usage information. |


## PostgreSQL backup examples

Let’s take some examples of backing up PostgreSQL databases.


### 1\) Backing up a single database using the pg\_dump utility

First, open the Command Prompt on Windows or Terminal on Unix\-like systems.

Second, execute the following `pg_dump` to back up the `dvdrental` database on the local server:


```css
pg_dump -U postgres -d dvdrental -F tar -f d:\backup\dvdrental.tar
```
In this command:

* `-U postgres`:  specifies the user (`postgres`) that connects to the PostgreSQL database server.
* `-d dvdrental`: specifies the database name that you want to back up.
* `-F tar` : specifies `tar` as the output format of the archive file.
* `-f d:\backup\dvdrental.tar`: This is the file path of the output backup file. Note that the `D:\backup` directory must exist. Also, it is a good practice to place a backup file in a server that is not the same as the one the PostgreSQL server is running.

After you run the command, `pg_dump` will prompt you to enter a password for the `postgres` user:


```css
Password:
```
After you enter a valid password, the `pg_dump` will create the backup file `dvdrental.tar` in the `d:\backup` directory.

If you want to automate the backup regularly, you need to use [a password file](postgresql-password-file-pgpass) (`.pgpass` on Unix\-like systems and `pgpass.conf` on Windows) so that when the command executes, it doesn’t ask for the password.


### 2\) Backing up all databases using the pg\_dumpall utility

First, open the Command Prompt on Windows or Terminal on Unix\-like systems.

Second, run the `pg_dumpall` command to back up all databases in the local PostgreSQL server into the all\_databases.sql file:


```
pg_dumpall -U postgres > D:\backup\all_databases.sql
```
This command will prompt you to enter a password for each database in the PostgreSQL server.

To suppress the password prompt, you can use the `-w` option:


```
pg_dumpall -U postgres > D:\backup\all_databases.sql
```
However, you need to use a [password file](postgresql-password-file-pgpass) with the following entry:


```css
hostname:port:database:username:password
```
For example:


```css
localhost:5432:*:postgres:SecurePass1
```
The asterisk (\*) means all databases.


### 3\) Backing up database objects using the pg\_dumpall utility

Sometimes, you want to backup only database object definitions, not the data. This is helpful in the testing phase, in which you do not want to move test data to the live system.

To back up objects in all databases, including roles, tablespaces, databases, schemas, tables, indexes, triggers, functions, constraints, views, ownerships, and privileges, you use the following command:


```plaintext
pg_dumpall --schema-only > d:\backup\schemas.sql
```
If you want to back up role definition only, use the following command:


```plaintext
pg_dumpall --roles-only > D:\backup\roles.sql
```
If you want to back up [tablespaces](postgresql-create-tablespace "PostgreSQL Tablespaces") definition, use the following command:


```plaintext
pg_dumpall --tablespaces-only > d:\backup\tablespaces.sql
```

## Creating backup script on Windows

The following backup script assumes that you have [a password file](postgresql-password-file-pgpass) setup properly.

First, open a text editor such a Notepad.

Second, write a batch script to generate backup file with a date and timestamp:


```bash
@echo off
REM Set variables for database connection
set PGUSER=your_username
set PGDATABASE=your_database_name

REM Set the path where you want to store the backup files
set BACKUP_DIR=C:\path\to\backup\directory

REM Get current date and time
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set "datestamp=%%c-%%a-%%b")
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set "timestamp=%%a%%b")

REM Execute pg_dump command to dump the database
pg_dump -U %PGUSER% -d %PGDATABASE% -f "%BACKUP_DIR%\%PGDATABASE%_%datestamp%_%timestamp%.sql"
```
In the script, you need to replace `your_username`, `your_database_name`, and the `C:\path\to\backup\directory` with your actual ones that you want to use.

Third, save the script to a file with the .bat extension such as backup.bat.

Finally, run the script by double\-clicking it.

If you want to make a regular backup, you can use the Task Scheduler on Windows to run the backup.bat file periodically.


## Creating backup script on Linux or macOS

The following backup script assumes that you have a [password file](postgresql-password-file-pgpass) setup properly.

First, open a text editor.

Second, write a shell script to generate a backup file with a date and timestamp:


```shell
#!/bin/bash

# Set variables for database connection
PGUSER=your_username
PGDATABASE=your_database_name

# Set the path where you want to store the backup files
BACKUP_DIR=/path/to/backup/directory

# Get current date and time
datestamp=$(date +'%Y-%m-%d')
timestamp=$(date +'%H%M')

# Execute pg_dump command to dump the database
pg_dump -U "$PGUSER" -d "$PGDATABASE" > "$BACKUP_DIR/$PGDATABASE"_"$datestamp"_"$timestamp".sql

```
In this script, you need to replace `your_username`, `your_database_name`, and `/path/to/backup/directory` with your actual ones that you want to use.

Third, save the script with a `.sh` extension such as `backup.sh`.

Fourth, make the script executable by executing the following command on your terminal:


```css
chmod +x backup_script.sh
```
Fifth, run the script by executing it in your terminal:


```
./backup.sh
```
This will execute the `pg_dump` command to dump your database into a backup file with extension .sql with the current date and timestamp appended to its name.

If you want to backup a database regularly, you can create a cron job to run the script periodically.


## Summary

* Back up PostgreSQL databases regularly for recovery later.
* Use the `pg_dump` and `pg_dumpall` tools to perform logical backups.
* Use a password file to automate the backup processes.

