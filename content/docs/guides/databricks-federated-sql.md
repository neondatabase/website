---
title: Federated Query Access via Databricks SQL to Neon Postgres
subtitle: Connect Databricks SQL to a Neon Postgres database using the built-in PostgreSQL connector
enableTableOfContents: true
updatedOn: '2025-04-27T11:08:17.424Z'
---

This guide explains how to connect Databricks SQL to a Neon Postgres database using the built-in PostgreSQL connector, so you can query live Postgres data directly in Databricks.

## ✅ Prerequisites

- A Neon Postgres project with a branch
- A Databricks workspace (on AWS, Azure, or GCP)
- A Databricks SQL Warehouse or compute cluster
- (Optional) A read-only branch or read replica in Neon for analytics use

<Steps>

## Get your Neon connection details

1. Open your project in the [Neon Console](https://console.neon.tech).
2. Navigate to your branch and click **Connection Details**.
3. Copy the Postgres connection string.

   Example:

   ```bash
   postgresql://myuser:password@ep-silent-wind-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

4. Extract the following values:

- **Host**: `ep-silent-wind-123456.us-east-1.aws.neon.tech`
- **Port**: `5432` (default)
- **Database**: `neondb`
- **Username**: `myuser`
- **Password**: `your-password`
- **SSL**: Required (`sslmode=require`)

---

## Add Neon as a PostgreSQL data source in Databricks

1. In Databricks, go to **Catalog > Add Data > Create a connection**.
2. Enter a **Connect name**.
3. For **Connection type**, select **PostgreSQL**.
4. CLick **Next**.
5. Fill in the connection form:

- **Host**: `ep-silent-wind-123456.us-east-1.aws.neon.tech`
- **Port**: `5432`
- **User**: `myuser`
- **Password**: `your_password`

4. Click **Create connection**.

---

## Query your Neon Postgres data

1. Open the **SQL Editor** in Databricks.
2. Select your Neon data source and schema.
3. Write and run a query:

```sql
SELECT * FROM playing_with_neon LIMIT 10;
```

You can now join data from Neon with Delta tables or create dashboards in Databricks SQL.

</Steps>

## 🔗 Resources

- [Neon Docs](https://neon.tech/docs)
- [Databricks PostgreSQL Connector Documentation](https://docs.databricks.com/en/query-federation/postgresql.html)
- [Databricks SQL Warehouses](https://docs.databricks.com/en/sql/admin/sql-endpoints.html)
- [Databricks SQL Editor](https://docs.databricks.com/en/sql/user/sql-editor.html)
- [Databricks Data Sources Overview](https://docs.databricks.com/en/external-data/index.html)
- [Neon Connection Details](https://neon.tech/docs/introduction/connecting-to-your-database)
