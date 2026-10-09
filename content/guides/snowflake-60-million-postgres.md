---
title: Syncing 60 million rows from Snowflake to Postgres
subtitle: A guide to optimizing data transfer from Snowflake to Postgres using chunking and upsert strategies.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-11-26T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Transferring large datasets gets hard when you're working within memory constraints and need atomic operations. This guide shows how to sync a large dataset (60 million rows) from Snowflake to Postgres on a nightly basis while keeping memory usage low and rolling back on errors. It covers the problems with a single large `COPY` and an alternative using chunking and upserts.

A common reason to sync data from Snowflake to Postgres is to use third-party datasets from the Snowflake Marketplace that need transformation. Once the data is loaded into Neon, you can create relationships between it and your application tables and query everything through a single ORM.

## Table of contents

- [Problems with the easiest approach](#problems-with-the-easiest-approach)
- [Proposed approach](#proposed-approach)
- [When to upsert or copy](#when-to-upsert-or-copy)
- [Implementation steps for chunking](#implementation-steps-for-chunking)

## Problems with the easiest approach

The easiest method is to save data from Snowflake to a local CSV file and then load it into Postgres with one large `COPY` operation. This approach has drawbacks:

- **High memory usage**: Loading 60 million rows at once can lead to significant memory consumption.
- **Performance issues**: A single large transaction can become a bottleneck, and one error rolls back the entire load.

## Proposed approach

To address these problems, use the following strategies:

1. **Chunking**: Split the data into smaller chunks (e.g., 5 million rows) to reduce memory usage.
2. **Upserts**: Instead of truncating and copying, use upsert queries (`INSERT ... ON CONFLICT`) to handle both new and existing records.
3. **Automatic rollback**: Roll back a chunk's transaction if it fails, so partial chunks never land in the table.

## When to upsert or copy

If the data from Snowflake contains a mix of new rows and rows that need updates in Postgres, you should opt for the upsert method. It handles both new and existing records. If you use upserts, create a unique index on the conflict key so lookups during updates and conflict resolution stay fast.

If your dataset contains only new records, truncate and copy is simpler and usually faster.

## Implementation steps for chunking

### 1. Chunking the data

Use the `split` command to divide the CSV file into manageable chunks. For example, to split a large CSV file of 60 million rows into chunks of 5 million rows, use the following command:

```shell
split -l 5000000 large_data.csv chunk_
```

### 2. Python script for data transfer

Below is a Python script that connects to Neon and processes each chunk (of 5 million rows). It uses the `psycopg2` library and rolls back a chunk's transaction if loading that chunk fails. The script loads each chunk with `COPY`, which fits the new-records case. For the upsert case, `COPY` each chunk into a staging table and then run `INSERT ... ON CONFLICT` from the staging table into the target table.

```python
# File: sync_script.py

import glob
import psycopg2
from psycopg2 import sql, DatabaseError

# Database connection parameters
db_params = {
    "dbname": "neondb",
    "user": "neondb_owner",
    "password": "...",
    "host": "ep-...us-east-2.aws.neon.tech",
    "port": 5432
}

tableName = "my_table"

# Read all files that have chunk_ in the present directory
chunk_files = glob.glob("chunk_*")

try:
    # Connect to the database
    conn = psycopg2.connect(**db_params)
    conn.autocommit = False  # Enable manual transaction management
    cur = conn.cursor()

    for chunk in chunk_files:
        with open(chunk, 'r') as f:
            print(f"Processing {chunk}...")
            try:
                cur.copy_expert(sql.SQL("COPY {} FROM STDIN WITH CSV").format(sql.Identifier(tableName)), f)
                # Commit after successfully processing the chunk
                conn.commit()
                print(f"Successfully loaded {chunk}")
            except Exception as e:
                # Rollback all changes if any chunk fails
                conn.rollback()
                print(f"Error processing {chunk}: {e}")
                break  # Stop processing on first error

    cur.close()
    conn.close()
    print("All chunks processed.")

except DatabaseError as db_err:
    print(f"Database connection error: {db_err}")
    if conn:
        conn.rollback()
        conn.close()
```

The script above does the following:

- Uses glob to read all files in the current directory that match the pattern "chunk\_\*".
- Connects to the Postgres database with manual transaction management enabled.
- Iterates over each chunk file, opening it for reading, and then uses the COPY command to load data from each chunk file into the specified table in the database.
- Commits the transaction after each chunk loads. If a chunk fails, it rolls back that chunk's transaction and stops. Chunks that were already committed stay in the table.
- Closes the database cursor and connection after processing all chunks or upon encountering an error.

### 3. Running the script

To execute the script, run the following command in your terminal:

```shell
python3 sync_script.py
```

### 4. Maintenance

After the data transfer, run `VACUUM ANALYZE` to clean up dead rows and update planner statistics:

```sql
VACUUM ANALYZE table_name;
```

## Conclusion

Chunking the export and loading each chunk in its own transaction lets you sync large datasets from Snowflake to Neon with low memory usage and a clean recovery point when a chunk fails. As a next step, schedule the script as a nightly job and add the staging-table upsert if your data includes updates to existing rows.

<NeedHelp />
