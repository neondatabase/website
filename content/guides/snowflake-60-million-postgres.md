---
title: Efficiently Syncing 60 Million Rows from Snowflake to Postgres
subtitle: A comprehensive guide on optimizing data transfer from Snowflake to Postgres using chunking and upsert strategies.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-11-26T00:00:00.000Z'
updatedOn: '2024-11-26T00:00:00.000Z'
---

Transferring large datasets can be challenging, especially when dealing with memory constraints and the need for atomic operations. This guide will provide a structured approach to efficiently sync data from Snowflake to Postgres, ensuring minimal memory usage and the ability to rollback in case of errors. In this guide, we will explore an efficient method to sync a large dataset (60 million rows) from Snowflake to Postgres on a nightly basis. We will discuss the challenges faced with the traditional `COPY INTO` method and provide a robust solution using chunking and upsert strategies.

## Table of Contents

- [Challenges with the easiest approach](#challenges-with-the-easiest-approach)
- [Proposed Solution](#proposed-solution)
- [When to Upsert or Copy](#when-to-upsert-or-copy)
- [Implementation steps for Chunking](#implementation-steps-for-chunking)
- [Conclusion](#conclusion)

## Challenges with the easiest approach

The easiest method involves saving data from Snowflake to a local CSV file and then performing a massive `COPY INTO` operation to Postgres. This approach has several drawbacks, some of them being:

- **High Memory Usage**: Loading 60 million rows at once can lead to significant memory consumption.
- **Performance Issues**: The single transaction approach can lead to performance bottlenecks.

## Proposed Solution

To address these challenges, we recommend the following strategies:

1. **Chunking**: Split the data into smaller chunks (e.g., 5 million rows) to reduce memory usage.
2. **Upsert Operations**: Instead of truncating and copying, use upsert queries to handle both new and existing records efficiently.
3. **Automated Rollback**: Implement a rollback mechanism to ensure data integrity in case of errors.

## When to Upsert or Copy

If the data from Snowflake contains a mix of new rows and rows that need updates in Postgres, you should opt for the upsert method. This approach allows you to efficiently handle both new and existing records. However, if you choose to use the upsert method, ensure that you create relevant indexes to improve lookup speed during updates and conflict resolution via a key.

On the other hand, if your dataset consists solely of new records, the traditional truncate and copy approach may be more appropriate, as it simplifies the process and can be more performant in such cases.

## Implementation steps for Chunking

### 1. Chunking the Data

Use the `split` command to divide the CSV file into manageable chunks. For example, to split a large CSV file of 60 million rows into chunks of 5 million rows, use the following command:

```shell
split -l 5000000 large_data.csv chunk_
```

### 2. Python Script for Data Transfer

Below is a Python script that connects to Neon and processes each chunk (of 5 million rows). It uses the `psycopg2` library to handle database operations with automatic rollback in case of any errors.

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

- Uses glob to read all files in the current directory that match the pattern "chunk_*".
- Establishes a connection to the PostgreSQL database with manual transaction management enabled.
- Iterates over each chunk file, opening it for reading, and then uses the COPY command to load data from each chunk file into the specified table in the database.
- Commits the transaction after successfully processing each chunk; if an error occurs, it rolls back the transaction and stops further processing.
- Closes the database cursor and connection after processing all chunks or upon encountering an error.

### 3. Running the Script

To execute the script, run the following command in your terminal:

```shell
python3 sync_script.py
```

### 4. Maintenance

After the data transfer, consider running a `VACUUM` command to clean up unnecessary storage and reclaim space:

```sql
VACUUM ANALYZE table_name;
```

## Conclusion

By implementing chunking and upsert strategies, you can efficiently sync large datasets from Snowflake to Neon while minimizing memory usage and ensuring data integrity. This approach not only improves performance but also provides a robust error handling mechanism.

With these strategies in place, you can confidently manage your nightly data syncs without the risk of overwhelming your system resources.

<NeedHelp />
