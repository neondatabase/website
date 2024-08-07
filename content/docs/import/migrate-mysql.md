---
title: Migrate your MySQL database to Neon Postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-06T15:23:10.952Z'
---

This topic describes how to migrate your MySQL database to Neon Postgres using [pgloader](https://pgloader.readthedocs.io/en/latest/intro.html).

The `pgloader` utility transforms data to a Postgres-compatible format as it is read from your MySQL database. It uses the `COPY` Postgres protocol to stream the data into your Postgres database.

## Before you begin

Before you begin, make sure that you have the following:

- A Neon account and a project. See [Sign up](/docs/get-started-with-neon/signing-up).
- A properly named database. For example, if you are migrating a database named `sakila`, you might want to create a database of the same name in Neon. See [Create a database](/docs/manage/databases#create-a-database) for instructions.
- Neon's Free Plan supports 500 MiB of data. If your data size is more than 500 MiB, you'll need to upgrade to one of Neon's paid plans. See [Neon plans](/docs/introduction/plans) for more information.

Also, a close review of the [Pgloader MySQL to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/mysql.html) guide is recommended before you start. This guide will provide you with a good understanding of `pgloader` capabilities and how to configure your `pgloader` configuration file, if necessary.

## Retrieve Your MySQL database credentials

Before starting the migration process, collect your MySQL database credentials:

1. Log into your MySQL database provider.
2. Identify and record the following details or grab your MySQL database connection string.
   - Hostname or IP address
   - Database name
   - Username
   - Password

Keep your MySQL database connection details handy for later use.

## Retrieve your Neon database connection string

Log in to the Neon Console and navigate to the **Connection Details** section on the **Dashboard** to find your Postgres database connection string. It should look similar to this:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Now, modify the connection string as follows to pass your **endpoint ID** (`ep-cool-darkness-123456` in this example) to Neon with your password using the `endpoint` keyword, as shown here:

```bash shouldWrap
postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
Passing the `endpoint ID` with your password is a required workaround for some Postgres drivers, including the one used by `pgloader`. For more information about this workaround and why it's required, refer to our [connection workaround](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field) documentation. 
</Admonition>

Keep your Neon connection string handy for later use.

### Install pgloader

Here's how you can set up `pgloader` for your database migration:

1. Install the `pgloader` utility using your preferred installation method. Debian (apt), RPM package, and Docker methods are supported, as well as Homebrew for macOS (`brew install pgloader`). If your macOS has an ARM processor, use the Homebrew installation method.

   See [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html) for Debian (apt), RPM package, and Docker installation instructions.

2. Create a `pgloader` configuration file (e.g., `config.load`). Use your MySQL database credentials to define the connection string for your database source. Use the Neon database connection string you retrieved and modified in the previous step as the destination.

   <Admonition type="note">
   If you need to specify an SSL mode in your connection string, the following format is recommended: `sslmode=require`. Other formats may not work.
   </Admonition>

   Example configuration in `config.load`:

   ```plaintext
   load database
     from mysql://user:password@host/source_db?sslmode=require
     into postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require;
   ```

## Run the migration with pgloader

To initiate the migration process, run:

```shell
pgloader config.load
```

The command output will look similar to this:

```bash
LOG report summary reset
             table name     errors       rows      bytes      total time
-----------------------  ---------  ---------  ---------  --------------
        fetch meta data          0          2                     0.727s
         Create Schemas          0          0                     0.346s
       Create SQL Types          0          0                     0.178s
          Create tables          0          2                     0.551s
         Set Table OIDs          0          1                     0.094s
-----------------------  ---------  ---------  ---------  --------------
    "db-test".dbname             0          1     0.0 kB          0.900s
-----------------------  ---------  ---------  ---------  --------------
COPY Threads Completion          0          4                     0.905s
 Index Build Completion          0          1                     0.960s
         Create Indexes          0          1                     0.257s
        Reset Sequences          0          0                     1.083s
           Primary Keys          0          1                     0.263s
    Create Foreign Keys          0          0                     0.000s
        Create Triggers          0          0                     0.169s
        Set Search Path          0          1                     0.427s
       Install Comments          0          0                     0.000s
-----------------------  ---------  ---------  ---------  --------------
      Total import time          ✓          1     0.0 kB          4.064s
```

## SSL verify error

If you encounter an `SSL verify error: 20 X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT_LOCALLY` error while attempting the instructions described above using `pgloader` from a Docker container, try the solution identified in this [GitHub issue](https://github.com/dimitri/pgloader/issues/768#issuecomment-693390290), which involves specifying `sslmode=allow` in the Postgres connection string and using the `--no-ssl-cert-verification` option with `pgloader`.

The following configuration file and Docker command were verified to work with Docker on Windows but may apply generally when using `pgloader` in a Docker container. In your `pgloader` config file, replace the MySQL and Postgres connection string values with your own. In the Docker command, specify the path to your `pgloader` config file, and replace the container ID value (the long alphanumeric string) with your own.

`pgloader` config.load file:

```plaintext
load database
  from mysql://user:password@host/source_db?sslmode=require
  into postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=allow;
```

Docker command:

```plaintext
docker run -v C:\path\to\config.load:/config.load d183dc100d3af5e703bd867b3b7826c117fa16b7ee2cd360af591dc895b121dc pgloader --no-ssl-cert-verification /config.load
```

## References

- [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html)
- [Pgloader Tutorial: Migrating from MySQL to PostgreSQL](https://pgloader.readthedocs.io/en/latest/tutorial/tutorial.html#migrating-from-mysql-to-postgresql)
- [Pgloader MySQL to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/mysql.html)
- [How to Migrate from MySQL to PostgreSQL RDBMS: An Enterprise Approach](https://jfrog.com/community/data-science/how-to-migrate-from-mysql-to-postgresql-rdbms-an-enterprise-approach/)
