---
title: Migrate from PlanetScale MySQL to Neon Postgres
subtitle: Learn how to migrate your database from PlanetScale to Neon Postgres using
  pgloader
summary: >-
  Migrating a PlanetScale MySQL (Vitess-compatible) database to Neon Postgres
  uses pgloader, which converts schema, maps types (MySQL AUTO_INCREMENT to
  Postgres SERIAL, TINYINT to BOOLEAN), and transfers data in a single
  point-in-time operation. Writes on PlanetScale must be paused during
  migration to prevent data loss. Use this guide when switching from PlanetScale
  to Neon and needing a full schema-plus-data transfer. Neon's Free plan
  supports up to 0.5 GB; larger databases require a paid plan. The Neon
  connection string needs the endpoint ID embedded in the password field as a
  pgloader workaround.
enableTableOfContents: true
isDraft: false
---

This guide provides step-by-step instructions for migrating a PlanetScale MySQL database to Neon Postgres using the `pgloader` utility. `pgloader` is an open-source tool that facilitates data migration from various sources to Postgres, including MySQL databases like PlanetScale. It handles schema creation, data type mapping, and data transfer efficiently, making it a popular choice for MySQL to Postgres migrations.

## Prerequisites

Before you begin, make sure that you have the following:

- A PlanetScale account and a database you want to migrate. PlanetScale databases use MySQL-compatible Vitess.
- A Neon account and a project. See [Sign up](/docs/get-started/signing-up).
- A properly named database. For example, if you are migrating a database named `my_app`, you might want to create a database of the same name in Neon. See [Create a database](/docs/manage/databases#create-a-database) for instructions.
- Neon's Free plan supports 0.5 GB of data. If your data size is more than 0.5 GB, you'll need to upgrade to one of Neon's paid plans. See [Neon plans](/docs/introduction/plans) for more information.
- **Schedule migration downtime:** `pgloader` performs a point-in-time migration, which means that any changes made to the PlanetScale database after the migration process has started will not be reflected in the Neon database. You will need to pause writes to your PlanetScale database (schedule downtime) during the migration to avoid data loss.
- **Configure IP allowlisting:** Ensure that the machine running `pgloader` has its IP address permitted on both the PlanetScale and Neon sides. See [PlanetScale IP restrictions](https://planetscale.com/docs/postgres/connecting/ip-restrictions) and Neon [IP allow rules](/docs/manage/projects#configure-ip-allow).

Also, a close review of the [Pgloader MySQL to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/mysql.html) is recommended before you start. This guide will provide you with a good understanding of `pgloader` capabilities and how to configure your `pgloader` configuration file, if necessary.

<Steps>

## Retrieve your PlanetScale database credentials

You'll need your PlanetScale database connection details to configure `pgloader` for the migration:

1. Log into the [PlanetScale dashboard](https://app.planetscale.com) and select your database.
2. Click the **Connect** button.
3. Select **MySQL CLI** to get the connection details. Make sure to select **Direct connection string** to get a standard MySQL connection string that you can use in your `pgloader` configuration file.

   ![PlanetScale Connect modal showing MySQL CLI connection string](/docs/import/planetscale_connect_modal.png)

Save your PlanetScale connection details.

## Retrieve your Neon database connection string

Log in to the [Neon Console](https://console.neon.tech). Find the connection string for your database by clicking the **Connect** button on your **Project Dashboard**. Make sure the **Connection pooling** toggle is disabled to get a direct connection string.

![Neon Connect modal showing connection string](/docs/connect/connection_details_without_connection_pooling.png)

Your connection string should look similar to this:

```plaintext shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Update the connection string to include your **endpoint ID** (ep-cool-darkness-123456 in this example) along with your password by using the `endpoint` keyword. Also remove the `channel_binding` parameter, as it is not supported by `pgloader`. The modified connection string should look like this:

```plaintext shouldWrap
postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
Passing the `endpoint ID` with your password is a required workaround for some Postgres drivers, including the one used by `pgloader`. For more information about this workaround and why it's required, refer to our [connection workaround](/docs/connect/connection-errors#d-specify-the-endpoint-id-in-the-password-field) documentation.
</Admonition>

Keep your Neon connection string handy for later use.

## Install pgloader

You'll need to have `pgloader` installed on your local machine to perform the migration:

1. Install the `pgloader` utility using your preferred installation method. Debian (apt), RPM package, and Docker methods are supported, as well as Homebrew for macOS (`brew install pgloader`). If your macOS has an ARM processor, use the Homebrew installation method.

   See [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html) for Debian (apt), RPM package, and Docker installation instructions.

2. Create a `pgloader` configuration file (for example, `planetscale_to_neon.load`). Use your PlanetScale database credentials to define the connection string for your database source. Use the Neon database connection string you retrieved and modified in the previous step as the destination.

   <Admonition type="note">
   If you need to specify an SSL mode in your connection string, the following format is recommended: `sslmode=require`. Other formats may not work.
   </Admonition>

   Example configuration in `planetscale_to_neon.load`:

   ```plaintext shouldWrap
   load database
    from mysql://username:password@host/source_db?sslmode=require
    into postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require;
   ```

   > Replace `username`, `password`, `host`, and `source_db` with your PlanetScale database credentials (`DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_HOST`, and `DATABASE_NAME`). Also update the destination connection string with your modified Neon connection string.

## Run the migration with pgloader

To initiate the migration process, run:

```shell
pgloader planetscale_to_neon.load
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

<Admonition type="warning" title="fell through ECASE expression error?">
If you encounter an `ERROR mysql: 255 fell through ECASE expression` (or similar) error when running the migration, this is a known issue that can occasionally occur. To fix this, you may need to build `pgloader` from source. For more information, refer to this [Stack Overflow thread](https://stackoverflow.com/questions/75493241/mysql-to-postgres-migration-pgloader-error-mysql-76-fell-through-ecase-express).
</Admonition>

## Verify the migration

After the migration is complete, connect to your Neon database and run some queries to verify that the data has been transferred correctly:

1. Connect to your Neon database using the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or [psql](/docs/connect/query-with-psql-editor).
2. Run a few queries to check your data. For example:

   ```sql
   SELECT COUNT(*) FROM your_table_name;
   SELECT id, name FROM your_table_name ORDER BY created_at DESC LIMIT 5;
   ```

3. Compare the results with the same queries run on your PlanetScale database to ensure data integrity.

</Steps>

## MySQL to Postgres considerations

MySQL and Postgres have different data types, SQL syntax, and features. `pgloader` handles most common type conversions automatically, but review the mapped types after migration.

For example, MySQL's `AUTO_INCREMENT` becomes Postgres `SERIAL`, `TINYINT` becomes `BOOLEAN`, and `DATETIME` becomes `TIMESTAMP`. Follow the [Pgloader MySQL Database Casting Rules](https://pgloader.readthedocs.io/en/latest/ref/mysql.html#mysql-database-casting-rules) if you need specific type casting or want to customize conversions according to your own requirements.

Here's an example of how to specify type casting in your `pgloader` configuration file:

```plaintext
load database
 from mysql://username:password@host/source_db?sslmode=require
 into postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require;

 CAST type datetime to timestamp drop default drop not null;
```

This example casts MySQL's `DATETIME` type to Postgres `TIMESTAMP` while dropping any default values and `NOT NULL` constraints. Adjust the casting rules as needed for your specific schema and data types.

## References

- [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html)
- [Pgloader Tutorial: Migrating from MySQL to PostgreSQL](https://pgloader.readthedocs.io/en/latest/tutorial/tutorial.html#migrating-from-mysql-to-postgresql)
- [Pgloader MySQL to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/mysql.html)
- [Pgloader MySQL Database Casting Rules](https://pgloader.readthedocs.io/en/latest/ref/mysql.html#mysql-database-casting-rules)

<NeedHelp/>
