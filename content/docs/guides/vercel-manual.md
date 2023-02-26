---
title: Connect Vercel and Neon manually
enableTableOfContents: true
---

This guide describes how to manually connect a Vercel project to a Neon database.

<Admonition type="note">
Alternatively, you can connect using the [Neon Vercel Integration](https://vercel.com/integrations/neon), which automatically creates a branch for each preview deployment. For more information, see [Connect with the Neon Vercel Integration](/docs/guides/vercel).
</Admonition>

## Prerequisites

- A Neon project. If you do not have one, see [Set up a project](/docs/get-started-with-neon/setting-up-a-project).
- A [Vercel account](https://vercel.com).
- A project deployed to Vercel. If you do not have one, see [Creating a project](https://vercel.com/docs/concepts/projects/overview#creating-a-project), in the _Vercel documentation_.

## Gather your Neon connection details

You can gather most of these details from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

The connection string includes the role name, hostname, and database name. For example:

```text
postgres://sally:<password>@ep-cold-poetry-404091.us-east-2.aws.neon.tech/neondb
             ^                              ^                                ^
             |- <role name>                 |- <hostname>                    |- <database name>
```

- role name: `sally`
- hostname: `ep-cold-poetry-404091.us-east-2.aws.neon.tech`
- database name: `neondb`

The password is only included in the connection string when the project is first created or after retting a the password. If you misplaced your password, you can reset it by selecting the **Reset Password** link on the **Connection Details** widget or by navigating to the **Roles** page.

## Configure project environment variables in Vercel

The environment variables required to connect your application to Neon depend on your application. Some applications use a `DATABASE_URL` environment variable with a database connection string:

```text
DATABASE_URL="sally:<password>@ep-cold-poetry-404091.us-east-2.aws.neon.tech/neondb"
```

Other applications may use `PG*` environment variables to define database connection details:

```text
PGHOST=ep-cold-poetry-404091.us-east-2.aws.neon.tech
PGUSER=sally
PGDATABASE=neondb
PGPASSWORD=<password>
PGPORT=5432
```

<Admonition type="note">
Neon uses the default PostgreSQL port, `5432`.
</Admonition>

To configure the environment variables required by your application:

<Admonition type="note">
Vercel environment variables can also be configured when you first deploy an application to Vercel.
</Admonition>

1. Navigate to the [Vercel dashboard](https://vercel.com/).
1. Select your Vercel project.
1. Select **Settings**.
1. Select **Environment variables**.
1. Enter the environment variable name in the **Key** field and add the value.
1. Click **Add another** if you need to add more variables.
1. Select the Vercel environments to which the variable(s) will apply (**Production**, **Preview**, **Development**)
1. Click **Save**.

![Add Vercel environment variable settings](/docs/guides/vercel_env_settings.png)

You must redeploy your application in Vercel for the environment variable settings to take effect.
