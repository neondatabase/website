---
title: Dump and restore Postgres data
subtitle: Learn how to dump your PostgreSQL data and restore it to Neon Serverless Postgres 
enableTableOfContents: true
isDraft: true
---

This topic describes how to dump data from another Postgres instance and restore it into your Neon Postgres database using the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) utilities.

## Prerequisites

- The `pg_dump` and `pg_restore` utilities.
- The connection details for your source source PostgreSQL instance, including a username, hostname, port, and database name.
- A Neon project and a database. The following example restores data to the default Neon database, `neondb`. You can create a different database in Neon. See [Create a database](../manage/databases#create-a-database) for instructions.

The following instructions assume compatibility between the source and target databases in terms of versions and installed extensions. For any incompatibilities, additional steps may be needed.

## Dump the existing PostgreSQL database

In your terminal or command window, run the following command to create a dump of your existing database:

```bash
pg_dump -U [username] -h [hostname] -p [port] -d [database_name] -Fc > database_dump.bak
```

- Replace [username] with the username of your PostgreSQL instance.
- Replace [hostname] with the hostname of your PostgreSQL instance (localhost if it's on your machine).
- Replace [port] with the port of your PostgreSQL instance (typically `5432`).
- Replace [database_name] with the name of the database you want to dump.

You'll be prompted to enter the password for the given username. The dump will be saved as `database_dump.bak` in your current directory.

## Retrieve your Neon connection string

A database connection string is required to connect to your Neon database. To retrieve a connection string for your database:

1. Navigate to the Neon Dashboard.
2. Copy the connection string for your database from the Connection Details widget. The connection string should appear similar to the following:

```bash
postgres://daniel:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb
```

## Restore the dump into your Neon Postgres database

Now, on your Neon Serverless Postgres system, use the `pg_restore` command to restore the database from the dump.

1. Parse your connection string to identify the individual components: username, password, hostname, port, and database name. For instance, for the connection string shown above, the components would be:

User: daniel
Password: `<password>`
Hostname: ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech
Port: 5432
Database name: neondb

2. Use these components to construct your `pg_restore` command. You can include the password in the command by using the `PGPASSWORD` environment variable to avoid being prompted for the password.

```bash
PGPASSWORD=[password] pg_restore -U [username] -h [hostname] -p [port] -d [database_name] -Fc database_dump.bak
```

Replace the placeholders as per the details parsed from your connection string.

## Optimizing the pg_dump process

 The `pg_dump` utility provides several options that can help optimize the dump operation, speed up the process, and avoid potential issues. Here are a few key options to consider:

`-j, --jobs=[number]`: This option allows pg_dump to dump multiple tables in parallel. You can specify the number of concurrent jobs. This can greatly speed up the dump process, particularly for large databases with multiple tables. Note that not all the output formats support parallel dumping.

`--data-only`: This option dumps only the data, not the schema. You may find this useful if you're only interested in the data and the schema already exists on the target system.

`--schema-only`: Contrary to --data-only, this option dumps only the schema, not the data. This can be useful if you want to replicate the database structure without the data.

`-Fc, --format=c`: This option creates a dump in the custom archive file format. It's the most flexible format in terms of restoring, and it allows for parallel and selective restoring of items.

`-Fp, --format=p`: This option creates a dump in plain-text SQL script file format. This format is useful for examining the dumped SQL commands and making manual modifications before restoring.

`--compress=[0-9]`: This option controls the compression level of the data in the custom archive file format. The range is from 0 (no compression, but faster dump) to 9 (maximum compression, but slower dump).

`--no-owner`: This option prevents pg_dump from outputting commands to set ownership of objects to match the original database. It's useful when the user running pg_restore might not have the necessary permissions to execute those commands.

`--encoding=[ENCODING]`: This option allows you to specify the character encoding for the dump. By default, the dump is created in the database encoding.

`-T, --exclude-table=[table]`: This option allows you to exclude a specific table from the dump. This can be useful if you have large or unneeded tables that would slow down the dump and restore process.

These are just some of the options available with `pg_dump`. Please refer to the official PostgreSQL documentation for a full list of options and their detailed explanations. Remember, it's essential to understand what each option does before using it, as improper use can lead to data loss or corruption.

## Optimizing the pg_restore process

the pg_restore utility also has several options that can help you customize the restore process, optimize for speed, and avoid potential issues. Here are some key options:

`-j, --jobs=[number]`: Similar to pg_dump, this option allows pg_restore to restore multiple tables in parallel. This can significantly speed up the restore process, particularly for large databases with multiple tables. Note that this option is only available when using the directory archive format.

`--data-only`: This option tells pg_restore to restore only the data, not the schema. It's useful if your target database already has the correct schema in place.

`--schema-only`: Contrary to --data-only, this option tells pg_restore to restore only the schema, not the data. This can be useful if you're setting up a new, empty database with the same structure as the original one.

`-L, --use-list=[filename]`: This option allows you to specify a reorder file that pg_restore will use to reorder the items to be restored. This can be useful when restoring a dump to a different database system that has dependencies not present in the original system.

`-n, --schema=[name]`: This option allows you to restore only objects that are part of a specific schema.

`-t, --table=[name]`: This option allows you to restore only a specific table.

`--no-owner`: This option instructs pg_restore not to execute commands to set ownership of objects to match the original database. It can be useful when the user running pg_restore does not have the necessary permissions to execute those commands.

`--disable-triggers`: This option disables triggers during data-only restore. This is useful when restoring data to a database that has referential integrity checks.

`-C, --create`: This option creates a new database before restoring into it. This is useful when restoring to a completely fresh instance of PostgreSQL.

These are just a few of the options available with `pg_restore`. For a complete list and detailed explanations, please refer to the official PostgreSQL documentation. As always, it's essential to understand what each option does before using it, as improper use can lead to data loss or corruption.

## Monitoring pg_dump and pg_restore Operations

Monitoring `pg_dump` and `pg_restore` operations is crucial in understanding the progress of your data transfer and identifying any potential issues. Here are some strategies for doing this:

1. Verbosity:

Both pg_dump and pg_restore have a verbosity option (-v or --verbose) that increases the amount of information displayed during the operation. This can be very useful for monitoring the progress of the operation and for troubleshooting if something goes wrong.

The command would look like this:

```bash
pg_dump -v -U [username] -h [hostname] -p [port] -d [database_name] -Fc > database_dump.bak
```

or

```bash
pg_restore -v -U [username] -h [hostname] -p [port] -d [database_name] -Fc database_dump.bak
```

2. Using the pv command:

The `pv` command, or "pipe viewer," can be used to monitor the progress of data through a pipeline. It gives you a visual display of how much data has been processed, how long it has been running, and an ETA of how much longer it will run.

First, install `pv` if it's not already installed:

On Ubuntu/Debian:

```bash
sudo apt-get install pv
```

On On CentOS/RHEL:

```bash
sudo yum install pv
```

Then, you can use it with `pg_dump` or `pg_restore` like so:

```bash
pg_dump -U [username] -h [hostname] -p [port] -d [database_name] -Fc | pv -W > database_dump.bak
```

or

```bash
pv database_dump.bak | pg_restore -U [username] -h [hostname] -p [port] -d [database_name] -Fc

```

3. PostgreSQL's `pg_stat_activity` view:

PostgreSQL's `pg_stat_activity` view shows you what activities are currently being performed by your PostgreSQL server. You can check this view during a `pg_dump` or `pg_restore` operation to see what's happening.

To do so, log into your PostgreSQL database and run:

```sql
SELECT * FROM pg_stat_activity;
```

You'll see a row for each active connection, including the pg_dump or pg_restore connection if it's running. This can help you monitor the progress of these operations.
