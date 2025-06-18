---
title: Replicate data from Neon to Databricks
subtitle: Learn how to replicate data from Neon into Databricks with Airbyte
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-11T11:32:44.535Z'
---

Learn how to replicate data from a Neon Postgres database into Databricks Delta Lake using [Airbyte](https://airbyte.com/). This pattern uses Neon's logical replication and Airbyte's CDC (Change Data Capture) features to deliver real-time or near-real-time streaming updates from your operational database into your analytical lakehouse.

---

## Prerequisites

- A [Neon account](https://console.neon.tech/) with logical replication enabled
- An [Airbyte account](https://airbyte.com/)
- A running [Databricks workspace](https://databricks.com/)

---

## Step 1: Prepare your Neon source

Follow the steps in the [Replicate data with Airbyte](/docs/guides/logical-replication-airbyte) guide to:

1. Enable **logical replication** in your Neon project.
2. Create a **replication role** in Neon.
3. Grant schema and table **read access** to the role.
4. Create a **replication slot** and **publication** in your Neon database.
5. Set up Neon as a **Postgres source** in Airbyte using the CDC method.

---

## Step 2: Configure Databricks as a destination

To set up Databricks as a destination in Airbyte following these instructions: [Databricks Lakehouse](https://docs.airbyte.com/integrations/destinations/databricks)

1. In Airbyte, go to **Destinations** and add a new one.
2. Select **Delta Lake on Databricks** as the destination type.
3. Provide the following required values:
   - **Databricks workspace URL**
   - **Personal access token** See [Databricks personal access tokens for workspace users](https://docs.databricks.com/aws/en/dev-tools/auth/pat)
   - **Database/schema name**
   - **Target path in DBFS or S3 (for staging)**
   - **Cluster ID** or SQL Warehouse ID
4. Save the destination configuration.

For details, see [Airbyte: Delta Lake on Databricks](https://docs.airbyte.com/integrations/destinations/delta-lake/).

---

## Step 3: Create the connection

1. In Airbyte, create a **connection** between your Neon Postgres source and your Databricks Delta Lake destination.
2. Select **CDC** as the replication mode (if available).
3. Set the **sync frequency** to control how often Airbyte replicates changes.
4. Map source tables to destination Delta tables.

---

## Step 4: Run the sync

1. Trigger the initial sync to populate data from Neon into Delta Lake.
2. Airbyte will continuously read WAL logs from Neon via logical replication and deliver inserts, updates, and deletes into Delta tables.
