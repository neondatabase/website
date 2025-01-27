---
title: Migrate from Microsoft SQL Server to Neon Postgres
subtitle: Learn how to migrate a Microsoft SQL Server database to Neon Postgres using
  pgloader
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.069Z'
---

This guide describes how to migrate your database from a Microsoft SQL Server (MSSQL) database to Neon Postgres using [pgloader](https://pgloader.readthedocs.io/en/latest/intro.html).

The `pgloader` utility transforms data to a Postgres-compatible format as it reads from your MSSQL database. It uses the Postgres `COPY` protocol to stream the data into your Postgres database.

## Prerequisites

- An MSSQL instance containing the data you want to migrate.

  For this guide, we use `Azure SQL`, which is a managed cloud-based offering of Microsoft SQL server. We set up an Azure SQL Database and populate it with the [Northwind sample dataset](https://github.com/microsoft/sql-server-samples/tree/master/samples/databases/northwind-pubs). This dataset contains sales data corresponding to a fictional company that imports and exports food products, organized across multiple tables.

- A Neon project to move the data to.

  For detailed information on creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

- Neon's Free Plan supports 500 MiB of data. If your data size is more than 500 MiB, you'll need to upgrade to one of Neon's paid plans. See [Neon plans](/docs/introduction/plans) for more information.

- Review the [Pgloader MSSQL to Postgres Guide](https://pgloader.readthedocs.io/en/latest/ref/mssql.html) guide. It will provide you with a good understanding of `pgloader` capabilities and how to configure your `pgloader` configuration file, if necessary.

- See [Pgloader configuration](#pgloader-configuration) for a `pgloader` configuration file update that may be required to connect to MSSQL from `pgloader`.

<Steps>

## Prepare your MSSQL database

### Retrieve Your MSSQL database credentials

Before starting the migration process, collect your MSSQL database credentials. If you are using Azure SQL, you can use the following steps to retrieve them:

1. Log into the Azure portal and navigate to your Azure SQL Database resource.
2. Navigate to the **Connection strings** tab under the `Settings` section and identify the connection string for your database. Make note of the following details:
   - Server
   - Database
   - User
   - Password (Not displayed in the Azure portal)

Keep the database connection details handy for later use.

### Allow inbound traffic from Neon

If you are using Azure SQL, you need to allow inbound traffic from your local machine, so `pgloader` can connect to your database. To do this, follow these steps:

1. Log into the Azure portal and navigate to your Azure SQL Server resource.

2. Click on the **Networking** option under the `Settings` section in the sidebar. Navigate to the **Firewall Rules** section under the `Public access` tab.

3. Click on the `Add your Client IPv4 address` option, which will automatically create a new rule with the IP address of your local machine. If you are running `pgloader` elsewhere, replace both the `Start IP` and `End IP` fields with the IP address of that machine.

4. CLick `Save` at the bottom to make sure all changes are saved.

## Prepare your Neon destination database

This section describes how to prepare your destination Neon PostgreSQL database to receive the migrated data.

### Create the Neon database

To maintain parity with the MSSQL deployment, you might want to create a new database in Neon with the same name. Refer to the [Create a database](/docs/manage/databases#create-a-database) guide for more information.

For this example, we will create a new database named `Northwind` in the Neon project. Use `psql` to connect to your Neon project (alternatively, you can use the `Query editor` in the Neon console) and run the following query:

```sql
CREATE DATABASE "Northwind";
```

### Retrieve your Neon database connection string

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

## Install pgloader

Here's how you can set up `pgloader` for your database migration:

1. Install the `pgloader` utility using your preferred installation method. Debian (apt), RPM package, and Docker methods are supported, as well as Homebrew for macOS (`brew install pgloader`). If your macOS has an ARM processor, use the Homebrew installation method.

   See [Installing pgloader](https://pgloader.readthedocs.io/en/latest/install.html) for Debian (apt), RPM package, and Docker installation instructions.

2. Create a `pgloader` configuration file (e.g., `mssql_to_neon.load`). Use your MSSQL database credentials to define the connection string for your database source. Use the Neon database connection string as the destination.

   Example configuration in `mssql_to_neon.load`:

   ```plaintext
   LOAD DATABASE
        FROM mssql://migration_user:password@host:port/AdventureWorks
        INTO postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

   Make sure to replace the connection string values with your own MSSQL and Neon credentials.

## Run the migration with pgloader

To initiate the migration process, run:

```shell
pgloader mssql_to_neon.load
```

The command output will show the progress of the migration, including any errors encountered and the total time taken. For our sample dataset, the output looks similar to this:

```plaintext
2024-09-12T10:46:54.307953Z LOG report summary reset
              table name     errors       read   imported      bytes      total time       read      write
------------------------  ---------  ---------  ---------  ---------  --------------  ---------  ---------
         fetch meta data          0         65         65                     0.280s
          Create Schemas          0          0          0                     0.116s
        Create SQL Types          0          0          0                     0.232s
           Create tables          0         26         26                     9.120s
          Set Table OIDs          0         13         13                     0.120s
------------------------  ---------  ---------  ---------  ---------  --------------  ---------  ---------
dbo.customercustomerdemo          0          0          0                     1.300s     0.124s
          dbo.categories          0          8          8    64.4 kB          1.224s     0.144s     0.004s
           dbo.customers          0         91         91    11.3 kB          2.520s     0.140s
dbo.customerdemographics          0          0          0                     2.152s     0.088s
           dbo.employees          0          9          9    76.0 kB          3.088s     0.136s     0.004s
 dbo.employeeterritories          0         49         49     0.4 kB          3.112s     0.096s
              dbo.orders          0        830        830   118.5 kB          3.656s     1.380s     0.060s
     dbo."Order Details"          0       2155       2155    44.0 kB          3.268s     1.372s     0.008s
              dbo.region          0          4          4     0.2 kB          2.832s     0.132s
            dbo.products          0         77         77     4.2 kB          2.660s     0.132s
           dbo.suppliers          0         29         29     3.9 kB          3.508s     0.120s
            dbo.shippers          0          3          3     0.1 kB          2.892s     0.104s
         dbo.territories          0         53         53     3.1 kB          3.568s     0.108s
------------------------  ---------  ---------  ---------  ---------  --------------  ---------  ---------
 COPY Threads Completion          0          4          4                     5.576s
          Create Indexes          0         39         39                    14.252s
  Index Build Completion          0         39         39                     3.072s
         Reset Sequences          0          6          6                     1.500s
            Primary Keys          0         13         13                     5.024s
     Create Foreign Keys          0         13         13                     5.016s
         Create Triggers          0          0          0                     0.256s
        Install Comments          0          0          0                     0.000s
------------------------  ---------  ---------  ---------  ---------  --------------  ---------  ---------
       Total import time          ✓       3308       3308   326.0 kB         34.696s
2024-09-12T10:46:54.339953Z INFO Stopping monitor
```

## Verify the migration

After the migration is complete, connect to your Neon database and run some queries to verify that the data has been transferred correctly. For example:

```sql
SELECT productname, unitprice, unitsinstock
FROM dbo.products
WHERE discontinued = false
ORDER BY unitprice DESC
LIMIT 5;
```

This query returns the following result:

```plaintext
      productname       | unitprice | unitsinstock
------------------------+-----------+--------------
 Côte de Blaye          |     263.5 |           17
 Sir Rodney's Marmalade |      81.0 |           40
 Carnarvon Tigers       |      62.5 |           42
 Raclette Courdavault   |      55.0 |           79
 Manjimup Dried Apples  |      53.0 |           20
(5 rows)
```

Compare the results with the same queries run on your MSSQL database to ensure data integrity.

## Clean up

After successfully migrating and verifying your data on Neon:

1. Consider backing up your MSSQL database before decommissioning it.

2. Update your application code to make SQL queries using the Postgres dialect.

3. Update your application's connection strings to point to your new Neon database.

</Steps>

## Other migration options

While this guide focuses on using `pgloader`, you might need more manual adjustments to ensure:

- There are no unintended changes to the application behavior. For example, all MSSQL data types don't translate one-to-one to Postgres data types.
- The application code is compatible with Neon Postgres.

For complex migrations or when you need more control over the migration process, you might consider developing a custom Extract, Transform, Load (ETL) process using tools like Python with SQLAlchemy.

## Pgloader configuration

- `Pgloader` automatically detects table schemas, indexes, and constraints, but depending on the input table schemas, you might need to specify manual overrides in the configuration file. Refer to the [Command clauses](https://pgloader.readthedocs.io/en/latest/command.html#common-clauses) section of the `pgloader` documentation for more information.

- With Azure SQL database, `pgloader` often runs into connection errors. To solve them, you might need to manually specify the FreeTDS driver configuration (which `pgloader` uses to connect to MSSQL). Please refer to the related issues in the [PGLoader GitHub repository](https://github.com/dimitri/pgloader/) for more information.

  Below is the section required to make `pgloader` work, at the time of writing. Replace the values with your own Azure SQL database credentials.

  ```plaintext
  # /etc/freetds/freetds.conf

  ...

  [host-name]
  tds version = 7.4
  client charset = UTF-8
  encrypt = require
  host = ...
  port = 1433
  database = ...
  ```

## Reference

For more information on `pgloader` and database migration, refer to the following resources:

- [pgloader documentation - MSSQL to Postgres](https://pgloader.readthedocs.io/en/latest/ref/mssql.html)
- [Neon documentation](/docs/introduction)

<NeedHelp/>
