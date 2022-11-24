---
title: Connection from any application
enableTableOfContents: true
---
When developing an application, you will need to connect to a database in your Neon project. In Neon, a database belongs to a branch, which can be the root branch of your Neon project (`main`) or a child branch. You can create databases in either.

```text
Neon project
    |------root branch (main)
               |
               |------ database
               |
          child branch
               |
               |------ database
```

In order to connect to a database, you must connect to the branch where the database resides, and you must do so by connecting through an endpoint, which is the compute instance associated with the branch.

```text
Neon project
    |------root branch (main) ---- endpoint (compute) <--- application
               |
               |------ database
               |
          child branch ---- endpoint (compute) <--- application
               |
               |------ database  
```

You can obtain the connection details for your endpoint and database from **Connection Details** widget on the **Neon Dashboard**. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you, which contains the details required to configure the database connection in your application.

![Connection details widget](./images/connection_details.png)

Either the connection string itself or details from the connection string can be used configure your database connection. For example, connection details might be placed in an `.env` file or a `DATABASE_URL` variable. Given the following connection string, an `.env` file or a `DATABASE_URL` variable can be configured as shown below.

Connection string:

```text
postgres://casey@ep-polished-water-579720.us-east-2.aws.neon.tech/main
             ^                    ^                                 ^
             | - <user>           |- <endpoint_hostname>            |- <database>                         
```

`.env` file:

```text
PGHOST='casey:ep-polished-water-579720.us-east-2.aws.neon.tech:5432'
PGDATABASE='main'
PGUSER='casey'
PGPASSWORD='<password>'
```

`DATABASE_URL` variable:

```text
DATABASE_URL="postgres://casey:ep-polished-water-579720.us-east-2.aws.neon.tech/main"
```

<Admonition type="tip">
For additional information about Neon connection strings, see [Connection strings](../connect-strings).
</Admonition>

## Passwords

A password is provided for the initial database user that was created when you created your Neon project. A password is also also provided whenever you create a new user. If you have misplaced a database user's password, refer to [Users](tbd) for password reset instructions.

## Connection examples for applications and frameworks

The **Connection Details** widget on the **Neon Dashboard** (see above) also provides connection examples for different languages and frameworks, constructed for the branch, database, and user that you select. Click **connection examples**  in **Connection Details** widget to view them.

![Connection details widget](./images/code_connection_examples.png)
