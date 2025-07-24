---
title: Connect Looker Studio to Neon
subtitle: Learn how to connect your Neon Postgres database to Looker Studio
enableTableOfContents: true
updatedOn: '2025-07-24T14:21:30.696Z'
---

[Looker Studio](https://lookerstudio.google.com/) is Google's data visualization and business intelligence platform. This guide explains how to connect your Neon Postgres database to Looker Studio using a PostgreSQL data source.

<Steps>

## Get your connection string

1. In the Neon Console, select the **project** and **branch** you want to connect to.
2. On the project dashboard, click **Connect**.
3. Click **Show Password** and copy the connection string.

For more details, see [Connect from any application](/docs/connect/connect-from-any-app).

## Add a PostgreSQL data source in Looker Studio

1. In Looker Studio, choose **New Data Source**.
2. Select **PostgreSQL** from the list of connectors.
3. In the **Basic** section, fill in the fields using the details from your connection string.

For example, if your connection string is:

```
psql 'postgresql://neondb_owner:npg_aaaaaaaaaaaa@ep-super-firefly-abcdefg.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

You would enter:

- **Host name or IP**: `ep-super-firefly-abcdefg.ap-southeast-1.aws.neon.tech`
- **Port (optional)**: Leave blank
- **Database**: `neondb`
- **Username**: `neondb_owner`
- **Password**: `npg_aaaaaaaaaaaa`

## Configure SSL settings

1. Ensure **Enable SSL** is checked.
2. Ensure **Enable client authentication** is unchecked.

## Upload the server certificate

1. Download the `isrgrootx1.pem` file from https://letsencrypt.org/certs/isrgrootx1.pem. For more information about SSL certificates, see [Connect to Neon securely](/docs/connect/connect-securely).
2. In Looker Studio, upload the `isrgrootx1.pem` file using the **Upload** button next to the **Server Certificate** box.

## Authenticate and connect

Click **Authenticate** to verify the connection. If successful, you will see your Neon tables listed in Looker Studio.

</Steps>

<NeedHelp/>
