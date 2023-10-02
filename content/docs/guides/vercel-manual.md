---
title: Connect Vercel and Neon manually
subtitle: Learn how to connect a Vercel project to a Neon database manually
enableTableOfContents: true
updatedOn: '2023-08-22T10:20:37Z'
---

This guide describes how to manually connect a Vercel project to a Neon database.

<Admonition type="note">
For other Vercel integration options, refer to the [Neon and Vercel integration overview](/docs/guides/vercel-overview).
</Admonition>

## Prerequisites

- A Neon project. If you do not have one, see [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- A [Vercel account](https://vercel.com).
- A project deployed to Vercel. If you do not have one, see [Creating a project](https://vercel.com/docs/concepts/projects/overview#creating-a-project), in the _Vercel documentation_.

## Gather your Neon connection details

You can these details from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

The connection string includes the role name, hostname, and database name. For example:

```text
postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb
             ^                                 ^                           ^
             |- <role>                         |- <hostname>               |- <database>
```

- role name: `daniel`
- hostname: `ep-raspy-cherry-95040071.us-east-2.aws.neon.tech`
- database name: `neondb`

## Configure project environment variables in Vercel

The environment variables required to connect your application to Neon depend on your application. Some applications use a `DATABASE_URL` environment variable with a database connection string:

```text
DATABASE_URL="postgres://daniel:<password>@ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb"
```

Other applications may use `PG*` environment variables to define database connection details:

```text
PGHOST=ep-raspy-cherry-95040071.us-east-2.aws.neon.tech/neondb
PGUSER=daniel
PGDATABASE=neondb
PGPASSWORD=<password>
PGPORT=5432
```

<Admonition type="note">
Neon uses the default Postgres port, `5432`.
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
1. Select the Vercel environments to which the variable(s) will apply (**Production**, **Preview**, **Development**).
1. Click **Save**.

![Add Vercel environment variable settings](/docs/guides/vercel_env_settings.png)

You must redeploy your application in Vercel for the environment variable settings to take effect.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
