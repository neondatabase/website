---
title: Setting Up a Project
---

To set up a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon console.
2. If you are creating your very first project, click **Create the first project**. Otherwise, click **New Project**. 
3. Enter a name for your project and click **Create Project**. Upon creating a project, you are presented with a dialog that provides the following information:

- A generated password for the project
- An `export` command that you can use to export your project password to a `PGPASSWORD` environment variable:

    `export PGPASSWORD=<password>`

- Commands for adding your password to `.pgpass`; for example:

```bash
touch ~/.pgpass && \
chmod 0600 ~/.pgpass && \
echo -e "jolly-bird-965235.cloud.neon.tech:5432:main:<username>:<password>\n$(cat ~/.pgpass)" > ~/.pgpass
```

**_Important_**: After the dialog containing your project's password information is closed, it is no longer accessible. If you forget or misplace your project password, your only option is to reset it.

Creating a Neon project automatically creates a Neon compute instance. For the Technical Preview, a Neon compute instance is deployed with PostgreSQL 14.5, 1 vCPU, and 256MB of RAM. For more information about limits associated with the Technical Preview, see [Technical Preview Free Tier](../reference/technical-preview-free-tier). 

Each Neon project is created with a default database named `main`.

You can query a Neon project database from the Neon SQL Editor or a `psql` client. For instructions, see:

- [Query with Neon's SQL Editor](../get-started-with-neon/query-with-neon-sql-editor)
- [Query with psql](../get-started-with-neon/query-with-psql-editor)

For information about connecting to a Neon project from an application, refer to The _Integrations_ section in the [Neon documentation](https://neon.tech/docs/cloud/about/), 

All operations supported by the Neon console can also be performed with the [Neon API](../../reference/api-reference). Using the Neon API requires an API key. For instructions, see [Using API Keys](using-api-keys).