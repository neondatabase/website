---
title: Setting Up a Project
---

To set up a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. If you are creating your very first project, click **Create the first project**. Otherwise, click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**. Upon creating a project, you are presented with a dialog that provides the following information:

    - A generated password for the project
    - An `export` command that you can use to export your project password to a `PGPASSWORD` environment variable:

        `export PGPASSWORD=<password>`

    - Commands for adding your password to `.pgpass`; for example:

    ```bash
    touch ~/.pgpass && \
    chmod 0600 ~/.pgpass && \
    echo -e "jolly-bird-041656.us-east-2.aws.neon.tech:5432:main:<username>:<password>\n$(cat ~/.pgpass)" > ~/.pgpass
    ```

For information about connecting to Neon using `psql`, see [Querying with psql](/docs/get-started-with-neon/query-with-psql-editor).

<Admonition type="important">
After navigating away from the Neon Console or refreshing the browser page, the password is no longer accessible. If you forget or misplace your password, your only option is to reset it. You can reset a password on the **User** page, which is found on the **Settings** page in the Neon Console.
</Admonition>

Creating a Neon project automatically creates a Neon compute instance for the project's [root branch](../../reference/glossary/#root-branch). 

Each Neon project is created with a default database named `main`. This database and every new database created in Neon contains a `public` schema. As with any standalone PostgreSQL installation, tables and other objects are created in the `public` schema by default. For more information about the `public` schema, refer to [The Public schema](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PUBLIC), in the _PostgreSQL documentation_.

You can query a Neon project database from the Neon SQL Editor or a `psql` client. For instructions, see:

- [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor)
- [Query with psql](/docs/get-started-with-neon/query-with-psql-editor)

For information about connecting to Neon from an application, refer to the _Guides_ section in the [Neon documentation](https://neon.tech/docs/cloud/about/),

All operations supported by the Neon Console can also be performed with the [Neon API](/docs/reference/api-reference). Using the Neon API requires an API key. For instructions, see [Using API Keys](/docs/get-started-with-neon/using-api-keys).
