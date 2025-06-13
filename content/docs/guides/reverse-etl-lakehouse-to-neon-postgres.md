---
title: 'Reverse ETL: Syncing Databricks Delta Lake Insights to Neon Postgres'
subtitle: A comprehensive guide to operationalizing your analytical data from Databricks Delta Lake into Neon Postgres for real-time applications and user-facing systems.
enableTableOfContents: true
isDraft: false
updatedOn: '2025-06-11T00:00:00.000Z'
---

**Reverse ETL** is the process of moving curated, analytical insights from a data warehouse or data lake, like Databricks Delta Lake, back into operational systems. This makes data actionable, powering everyday business applications, customer-facing interfaces, and intelligent AI agents.

This guide details how to build Reverse ETL pipelines to synchronize data from Databricks Delta Lake into a Neon Postgres database.

### Why Sync Delta Lake Insights to Neon Postgres?

![Delta Lake to Neon Postgres Reverse ETL Common use cases](/docs/guides/reverse-etl-lakehouse-to-neon-postgres-use-cases.svg)

The primary goal is to bridge the gap between powerful analytics performed in Databricks and the operational systems that drive daily business processes.

#### Key Benefits

- **Activate Data for applications:** Make refined data (e.g., customer segments, product recommendations, inventory levels) directly available to web/mobile apps, CRMs, marketing tools, and other operational systems for immediate use.
- **Enhance customer experiences:** Deliver personalized content, targeted offers, and timely support by feeding real-time customer insights from Delta Lake into Neon-backed applications.
- **Empower AI and Automation:** Provide AI agents and automated workflows with fresh, curated data from Delta Lake via Neon to improve decision-making and task execution.
- **Improve operational efficiency:** Streamline business processes by ensuring operational tools have access to the latest, analytics-driven information, reducing manual work and latency.

**Common use cases:**

- Populating user profiles in a customer-facing application with data from Delta Lake.
- Syncing product recommendations or eligibility scores to an e-commerce platform.
- Updating inventory or pricing in real-time for operational dashboards and systems.
- Feeding personalized data to marketing automation tools or customer support platforms.

## Architectural considerations for Reverse ETL

The typical Reverse ETL flow involves extracting transformed data from Delta Lake, processing it if necessary, and loading it into Neon Postgres.

### Key synchronization patterns

1.  **Initial Load (Full Batch Sync):**
    - For the first-time setup, a full load of historical data from the Delta table to the target Neon table is often required.
    - This is typically a batch process.
2.  **Incremental syncs (Ongoing):**
    - **Batch CDC:** Using [Delta Lake's Change Data Feed (CDF)](https://docs.databricks.com/aws/en/delta/delta-change-data-feed), process changes in batches on a defined schedule (e.g., every 5 minutes, hourly). This is efficient as only changed data is moved.
    - **Streaming CDC:** For lower latency, leverage [Spark Structured Streaming](https://www.databricks.com/spark/getting-started-with-apache-spark/streaming) with Delta Lake CDF as a source to continuously process and sync changes to Neon in near real-time.

### Bridging analytical and operational systems

Databricks Delta Lake is designed for large-scale analytical processing, while Neon Postgres is an OLTP database optimized for transactional workloads and fast point lookups. The Reverse ETL pipeline must efficiently transfer data without overwhelming Postgres, especially with its potentially more constrained (though scalable) OLTP architecture compared to a distributed data lakehouse. This necessitates:

- Efficient data transfer mechanisms.
- Throttling strategies.
- Careful handling of `UPSERT` and `DELETE` operations on the target.

## Technical Implementation: Step-by-step guide

This section details how to build a Reverse ETL pipeline from a Databricks Delta Lake table to Neon Postgres using PySpark and Spark Structured Streaming. We'll focus on an incremental sync strategy using Delta CDF. For the initial load, we'll use Spark JDBC to write data to Neon.

### Prerequisites

- **Databricks Workspace:**
  - Unity Catalog enabled.
  - Cluster running Databricks Runtime 13.3 LTS or above (for JDBC access and streaming capabilities).
  - Permissions:
    - To read from the source Delta table(s).
    - To create and run jobs/notebooks.
- **Neon Account & Postgres Database:**
  - A Neon project and database.
  - Connection details (host, port, user, password, database name).
  - Permissions: A dedicated Postgres role with `CONNECT`, `CREATE` (on schema if needed), `INSERT`, `UPDATE`, `DELETE` permissions on the target table(s).

### Step 1: Prepare the Neon Postgres Target Table

Define the schema for your target table in Neon. Ensure you have primary keys for efficient updates and deletes.

**Example (in Neon SQL Editor or psql):**

```sql
CREATE SCHEMA IF NOT EXISTS operational_data;

CREATE TABLE IF NOT EXISTS operational_data.customer_profiles (
    customer_id VARCHAR(255) PRIMARY KEY,
    full_name TEXT,
    email VARCHAR(255) UNIQUE,
    segment VARCHAR(100),
    last_purchase_date TIMESTAMP WITH TIME ZONE,
    total_spend NUMERIC(10, 2),
    propensity_score FLOAT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- To track sync time
);
```

> Optionally, create indexes after the initial load for performance, especially on frequently queried columns like `segment` or `last_purchase_date`.

### Step 2: Enable Change Data Feed (CDF) on Source Delta Table

#### Optional: Create a Sample Delta Table

If you are testing the pipeline and need sample data, you can create a Delta table in Databricks with mock data by following this guide. This approach allows you to validate the Reverse ETL process without requiring a full production dataset.

To create a sample Delta table, run the following SQL in a Databricks notebook:

```sql

CREATE CATALOG IF NOT EXISTS main_catalog;
USE CATALOG main_catalog;
CREATE SCHEMA IF NOT EXISTS operational_source_data;
USE SCHEMA operational_source_data;

-- Create the Delta table with Change Data Feed enabled
CREATE TABLE main_catalog.operational_source_data.customer_profiles_delta (
  customer_id STRING NOT NULL COMMENT 'Unique identifier for the customer',
  full_name STRING COMMENT 'Full name of the customer',
  email STRING COMMENT 'Email address of the customer',
  segment STRING COMMENT 'Customer segment (e.g., High Value, Churn Risk)',
  last_purchase_date TIMESTAMP COMMENT 'Date of the last purchase',
  total_spend DECIMAL(10, 2) COMMENT 'Total amount spent by the customer',
  propensity_score DOUBLE COMMENT 'Score indicating likelihood of a future action (e.g., purchase, churn)',
  is_active BOOLEAN COMMENT 'Flag indicating if the customer account is active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() COMMENT 'Timestamp of when the record was created',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() COMMENT 'Timestamp of when the record was last updated'
)
USING DELTA
TBLPROPERTIES (
  'delta.enableChangeDataFeed' = 'true',
  'delta.feature.allowColumnDefaults' = 'enabled',
  'delta.autoOptimize.optimizeWrite' = 'true',
  'delta.autoOptimize.autoCompact' = 'true'
)
COMMENT 'Delta table storing customer profile information for Reverse ETL to Neon.';

-- Insert some sample data
INSERT INTO main_catalog.operational_source_data.customer_profiles_delta
  (customer_id, full_name, email, segment, last_purchase_date, total_spend, propensity_score, is_active, created_at, updated_at)
VALUES
  ('cust_001', 'Alice Wonderland', 'alice.wonder@example.com', 'High Value', current_timestamp() - INTERVAL '10' DAYS, 250.75, 0.85, true, current_timestamp() - INTERVAL '90' DAYS, current_timestamp() - INTERVAL '10' DAYS),
  ('cust_002', 'Bob The Builder', 'bob.builder@example.com', 'New User', current_timestamp() - INTERVAL '2' DAYS, 50.20, 0.65, true, current_timestamp() - INTERVAL '5' DAYS, current_timestamp() - INTERVAL '2' DAYS),
  ('cust_003', 'Charlie Chaplin', 'charlie.chap@example.com', 'Churn Risk', current_timestamp() - INTERVAL '120' DAYS, 800.00, 0.23, true, current_timestamp() - INTERVAL '365' DAYS, current_timestamp() - INTERVAL '60' DAYS),
  ('cust_004', 'Diana Prince', 'diana.prince@example.com', 'Loyal Customer', current_timestamp() - INTERVAL '5' DAYS, 1250.50, 0.92, true, current_timestamp() - INTERVAL '180' DAYS, current_timestamp() - INTERVAL '5' DAYS),
  ('cust_005', 'Edward Scissorhands', 'ed.hands@example.com', 'Inactive', current_timestamp() - INTERVAL '400' DAYS, 150.00, 0.10, false, current_timestamp() - INTERVAL '500' DAYS, current_timestamp() - INTERVAL '300' DAYS),
  ('cust_006', 'Fiona Gallagher', 'fiona.g@example.com', 'High Value', current_timestamp() - INTERVAL '1' DAY, 320.00, 0.78, true, current_timestamp() - INTERVAL '30' DAYS, current_timestamp() - INTERVAL '1' DAY);
```

![Sample Delta Table Data](/docs/guides/reverse-etl-lakehouse-to-neon-postgres-sample-data.png)

This dataset serves as a basic example to help you begin. In a production environment, your Delta table would typically contain a much larger and more intricate dataset.

#### Enable Change Data Feed (CDF)

If your source Delta table is not already configured for Change Data Feed, you need to enable it. This allows Delta Lake to track changes (inserts, updates, deletes) to the table, which is essential for incremental syncs. To enable CDF, you can use the following SQL command in a Databricks notebook or SQL editor:

**Example (in a Databricks notebook):**

```sql
ALTER TABLE main_catalog.operational_source_data.customer_profiles_delta
SET TBLPROPERTIES (delta.enableChangeDataFeed = true);
```

> Replace `main_catalog.operational_source_data.customer_profiles_delta` with your actual Delta table name.

<Admonition type="info">
CDF only records changes made after it's enabled. Historical changes prior to enabling CDF won't be captured.
</Admonition>

### Step 3: Initial Data Load (One-Time)

For the very first sync, or if CDF history is not sufficient, you'll need to perform an initial full load.

**Strategy:** Use Spark JDBC for efficient batch writes. To ensure idempotency on repeated runs, you can load into a temporary table in Neon and then swap it with the production table within a transaction. This minimizes downtime and allows for rollback in case of errors.

**PySpark Example for Initial Load:**

```python
# Databricks Notebook
# Neon connection details
neon_jdbc_url = "jdbc:postgresql://<your_neon_host>:<port>/<your_database>"
neon_connection_properties = {
    "user": "<your_neon_user>",
    "password": "<your_neon_password>",
    "driver": "org.postgresql.Driver"
}
target_table_full_name = "operational_data.customer_profiles"
temp_target_table_full_name = "operational_data.customer_profiles_temp_load"

# Read full data from source Delta table
source_df = spark.table("main_catalog.operational_source_data.customer_profiles_delta")

import psycopg2

def connect_to_neon():
    return psycopg2.connect(
        host="<your_neon_host>",
        port="<port>",
        dbname="<your_database>",
        user="<your_neon_user>",
        password="<your_neon_password>"
    )

# Write to a temporary table in Neon
source_df.write
  .format("jdbc")
  .option("url", neon_jdbc_url)
  .option("dbtable", temp_target_table_full_name)
  .option("user", neon_connection_properties["user"])
  .option("password", neon_connection_properties["password"])
  .option("driver", neon_connection_properties["driver"])
  .option("truncate", "true") # Truncate temp table before loading
  .mode("overwrite") # Overwrite schema and data in temp table
  .save()

print(f"Data loaded into temporary table: {temp_target_table_full_name}")

# Swap tables within a transaction using psycopg2
try:
    conn = connect_to_neon()
    conn.autocommit = False # Start transaction
    cur = conn.cursor()

    # Drop old production table if it exists (e.g., from a previous failed swap)
    cur.execute(f"DROP TABLE IF EXISTS {target_table_full_name}_old;")
    # Rename current production table to old (if it exists)
    cur.execute(f"ALTER TABLE IF EXISTS {target_table_full_name} RENAME TO {target_table_full_name}_old;")
    # Rename temp table to production table
    cur.execute(f"ALTER TABLE {temp_target_table_full_name} RENAME TO {target_table_full_name};")
    # Optionally, drop the old table
    cur.execute(f"DROP TABLE IF EXISTS {target_table_full_name}_old;")

    conn.commit()
    print(f"Successfully swapped {temp_target_table_full_name} to {target_table_full_name}")

except Exception as e:
    if conn:
        conn.rollback()
    print(f"Error during table swap: {e}")
    raise
finally:
    if cur:
        cur.close()
    if conn:
        conn.close()

# IMPORTANT: Ensure your Spark streaming job (next step) starts reading CDF
# from a version *after* this initial load completes to avoid processing duplicates.
# You might need to record the Delta table version after this load.
```

### Step 4: Implement Incremental Sync with Spark Structured Streaming & CDF

This is the core of the ongoing Reverse ETL process.

**Delta Lake CDF `_change_type` Mapping to PostgreSQL Operations:**

| `_change_type`     | Description                             | Corresponding PostgreSQL Operation                  |
| :----------------- | :-------------------------------------- | :-------------------------------------------------- |
| `insert`           | A new row was inserted.                 | `INSERT`                                            |
| `update_preimage`  | The state of a row _before_ an update.  | (Used with `update_postimage` for `UPDATE`/`MERGE`) |
| `update_postimage` | The state of a row _after_ an update.   | `UPDATE` or `UPSERT` (`INSERT ... ON CONFLICT`)     |
| `delete`           | A row was deleted from the Delta table. | `DELETE`                                            |

**PySpark Code for Incremental Sync:**

```python
# Databricks Notebook
from pyspark.sql.functions import col, when, lit
import psycopg2 # For fine-grained UPSERT/DELETE

# Neon connection parameters (reuse from Step 3 or define here)
neon_host = "<your_neon_host>"
neon_port = "<port>"
neon_database = "<your_database>"
neon_user = "<your_neon_user>"
neon_password = "<your_neon_password>"
target_table = "operational_data.customer_profiles"
primary_key_column = "customer_id" # Primary key of your Neon table

# Delta table configuration
source_delta_table_name = "main_catalog.operational_source_data.customer_profiles_delta"
checkpoint_location = "/mnt/reverse_etl_checkpoints/neon_customer_profiles" # DBFS path


# Function to process each micro-batch
def upsert_to_neon(batch_df, batch_id):
    print(f"Processing batch ID: {batch_id}")
    if batch_df.count() == 0:
        print("Batch is empty, skipping.")
        return

    final_state_df = batch_df.filter(col("_change_type").isin("insert", "update_postimage"))
    delete_df = batch_df.filter(col("_change_type") == "delete")

    conn = None
    cur = None
    try:
        conn = psycopg2.connect(host=neon_host, port=neon_port, dbname=neon_database, user=neon_user, password=neon_password)
        cur = conn.cursor()

        if not final_state_df.isEmpty():
            print(f"Processing {final_state_df.count()} upserts...")
            for row in final_state_df.collect():
                upsert_sql = f"""
                INSERT INTO {target_table} (customer_id, full_name, email, segment, last_purchase_date, total_spend, propensity_score, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT ({primary_key_column}) DO UPDATE SET
                    full_name = EXCLUDED.full_name,
                    email = EXCLUDED.email,
                    segment = EXCLUDED.segment,
                    last_purchase_date = EXCLUDED.last_purchase_date,
                    total_spend = EXCLUDED.total_spend,
                    propensity_score = EXCLUDED.propensity_score,
                    updated_at = NOW()
                WHERE {target_table}._commit_timestamp IS NULL OR EXCLUDED._commit_timestamp >= {target_table}._commit_timestamp;
                """

                cur.execute(upsert_sql, (
                    row.customer_id, row.get("full_name"), row.get("email"), row.get("segment"),
                    row.get("last_purchase_date"), row.get("total_spend"), row.get("propensity_score")
                ))


        # Process Deletes
        if not delete_df.isEmpty():
            print(f"Processing {delete_df.count()} deletes...")
            delete_ids = [row[primary_key_column] for row in delete_df.select(primary_key_column).collect()]
            # Use %s for parameterization to prevent SQL injection
            # The extra comma in (delete_ids,) makes it a tuple for the IN clause with psycopg2
            delete_sql = f"DELETE FROM {target_table} WHERE {primary_key_column} IN %s;"
            cur.execute(delete_sql, (tuple(delete_ids),))

        conn.commit()
        print(f"Batch {batch_id} committed successfully.")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error processing batch {batch_id}: {e}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

streaming_cdf_df = (
    spark.readStream
    .format("delta")
    .option("readChangeData", "true")
    .table(source_delta_table_name)
)

query = (
    streaming_cdf_df.writeStream
    .foreachBatch(upsert_to_neon)
    .outputMode("update")
    .option("checkpointLocation", checkpoint_location)
    .trigger(availableNow=True)
    .start()
)
```

**Important considerations for the `upsert_to_neon` function:**

- **Column Mapping:** Ensure your PySpark DataFrame columns correctly map to your Neon table columns.
- **Error Handling & Retries:** Implement robust error handling. Spark Streaming's checkpointing helps with retries from the last successful batch.
- **Idempotency:** The `INSERT ... ON CONFLICT DO UPDATE` statement in Postgres is inherently idempotent for upserts based on the conflict target (primary key). Delete operations are also generally idempotent (deleting a non-existent row does nothing).
- **Performance:** For very high volumes, `psycopg2` row-by-row execution can be slow. Consider:
  - Using `psycopg2.extras.execute_values` or `execute_batch` for more efficient batch DML.
  - Writing micro-batches to temporary staging tables in Neon first, then using SQL MERGE operations within Neon for better performance, though this adds complexity. The Spark JDBC connector is often faster for bulk operations but lacks fine-grained UPSERT/DELETE control for CDC streams directly.
- **`_commit_timestamp`:** If you are syncing `_commit_timestamp` from Delta to a corresponding column in Neon, you can use it in your `ON CONFLICT ... DO UPDATE SET ... WHERE target._commit_timestamp < EXCLUDED._commit_timestamp` to ensure you only apply newer changes if records arrive out of order or during reprocessing.

### Step 5: Orchestration and Scheduling

- **Initial Load:** Run the initial load script (Step 3) once manually or as a one-time job. Note the Delta table version _after_ this load completes.
- **Incremental Sync:** Schedule the Spark Structured Streaming job (Step 4) using Databricks Jobs.
  - Configure the `startingVersion` or `startingTimestamp` in your `readStream` options to begin processing changes _after_ the initial load.
  - If using `trigger(availableNow=True)`, schedule the Databricks job to run at your desired frequency (e.g., every 5 minutes, 15 minutes).

## Best practices and addressing challenges

- **Data Volume and Scalability:**
  - **Always use CDF:** For incremental syncs, CDF is paramount to avoid full table scans.
  - **Throttling:** Use `maxFilesPerTrigger`, `maxBytesPerTrigger`, or `trigger(processingTime=...)` in Spark Streaming to control the batch size and frequency, preventing overload on Neon.
  - **Optimize Data Models:** Only sync necessary columns and data to Neon. Transform and filter in Databricks before the sink.
  - **Neon Scalability:** Monitor Neon's performance. While serverless, understand its connection limits and resource utilization. Consider read replicas in Neon if the operational read load is very high.
- **Data Consistency, Quality, and Latency:**
  - **Schema Management:** Plan for schema evolution. Delta Lake handles schema evolution gracefully. Ensure your Reverse ETL pipeline and Neon target schema can adapt or have a process for schema changes.
  - **Data Quality Checks:** Implement data quality checks in Databricks (e.g., using Delta Live Tables expectations or custom Spark jobs) _before_ data is pushed to Neon.
  - **Idempotent Operations:** Crucial. Ensure your `foreachBatch` logic is idempotent to handle retries or reprocessing without data corruption.
  - **Minimize Latency:** For near real-time needs, use streaming CDC with appropriate trigger intervals. Optimize Neon tables with proper indexing for fast reads by operational applications.
- **Security, Privacy, and Compliance:**
  - **Least Privilege:** Use dedicated roles with minimal necessary permissions in both Databricks (Unity Catalog for Delta table access) and Neon (for target table operations).
  - **Secure Credentials:** Store Neon credentials in Databricks Secrets.
  - **Encryption:** Ensure data is encrypted in transit (SSL for JDBC/psycopg2 connections to Neon) and at rest (default in Delta Lake and Neon).
  - **PII/Sensitive Data:** Consider masking or anonymization techniques in the Databricks transformation phase if full PII is not required in the operational system.
- **Monitoring, Alerting, and Fault Tolerance:**
  - **Pipeline Monitoring:** Use Databricks job monitoring, Spark UI, and custom logging to track pipeline health, data freshness, throughput, and error rates.
  - **Alerting:** Set up alerts for pipeline failures or significant data discrepancies.
  - **Checkpointing:** Essential for Spark Structured Streaming to ensure fault tolerance and exactly-once processing semantics (within micro-batches).
  - **Dead Letter Queues (DLQ):** For records that consistently fail processing, consider a DLQ mechanism to investigate them separately without halting the entire pipeline.
- **Neon-Specific Optimizations:**
  - **Indexing:** Properly index columns in Neon tables that are frequently used in query predicates by your operational applications.
  - **Connection Pooling:** If your operational applications connect directly to Neon, ensure they use connection pooling to manage connections efficiently.

## Conclusion

Implementing Reverse ETL from Databricks Delta Lake to Neon Postgres operationalizes your valuable analytical insights, empowering real-time applications, AI agents, and frontline business teams. By leveraging Delta Lake's Change Data Feed and Spark Structured Streaming, you can build efficient, incremental pipelines that keep your Neon operational datastore synchronized with your analytical truth.

This pattern is central to the "Lakebase" vision, where Neon serves as the high-performance, Postgres-compatible operational database layer seamlessly integrated with the Databricks Data Intelligence Platform. As data operationalization trends towards real-time everything, AI-powered activation, and unified data platforms, the ability to effectively bridge analytical and operational worlds with solutions like Databricks and Neon will become increasingly critical.

By following this guide and adapting the principles to your specific needs, you can unlock significant value from your data, transforming insights into immediate, impactful actions.

## References

- [Databricks Delta Lake Change Data Feed](https://docs.databricks.com/aws/en/delta/delta-change-data-feed)
- [Spark Structured Streaming + Delta Lake](https://docs.databricks.com/aws/en/structured-streaming/delta-lake)
- [Neon Documentation](/docs)

<NeedHelp />
