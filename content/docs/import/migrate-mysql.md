---
title: Migrate your MySQL database to Neon Postgres
enableTableOfContents: true
isDraft: true
---

This topic describes how to migrate your MySQL database to Neon Postgres using [pgloader](https://pgloader.readthedocs.io/en/latest/intro.html).

The `pgloader` utility transforms the data to a Postgres-compatible format as it is read from your MySQL database. It uses the `COPY` Postgres protocol to stream the data into your Postgres instance. It manages errors by writing them to `reject.dat` and `reject.log` files.

## Before you begin

Before you start, make sure that you have the following:

- A Neon account and a project. See [Sign up](/docs/get-started-with-neon/signing-up).
- Neon's Free Tier supports 500 MiB of data. If your data size is more than 500 MiB, you'll need to upgrade to one of Neon's paid plans. See [Neon plans](/docs/introduction/plans) for more information.

## Retrieve Your MySQL database credentials

Before starting the migration process, collect your MySQL database credentials:

1. Log into your MySQL database provider.
2. Identify and record the following details:
   - Hostname or IP address
   - Database name
   - Username
   - Password

### Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Now, modify the connection string as follows to pass your endpoint ID to Neon with your password:

```bash
postgres://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
Passing the `endpoint_id` with your password is a required workaround for some Postgres drivers, including the one used by `pgloader`. For more information, refer to our [connection workaround](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field) documentation. 
</Admonition>

Keep your connection string handy for later use.

### Install pgloader

Here's how you can set up `pgloader` and prepare for your database migration:

1. Install the `pgloader` utility using your preferred installation method. Debian (apt), RPM package, and Docker methods are supported, and installation is also supported with Homebrew for macOS users (`brew install pgloader`). See [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html). 
2. Create a `pgloader` configuration file (for example, named `config.load`). Use your MySQL database credentials to define the connection string for your database source. Use the Neon database connection string you retrieved in the previous step as the destination.

   Example configuration in `config.load`:
   
   ```plaintext
   load database
     from mysql://user:password@host/source_db?sslmode=require
     into postgres://alex:endpoint=ep-cool-darkness-123456:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require;
   ```

## Run the Migration with pgloader

To initiate the migration process, run:

```shell
pgloader config.load
```

## References

- [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html)
- [Pgloader Tutorial: Migrating from MySQL to PostgreSQL](https://pgloader.readthedocs.io/en/latest/tutorial/tutorial.html#migrating-from-mysql-to-postgresql)
- [Pgloader MySQL to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/mysql.html)
