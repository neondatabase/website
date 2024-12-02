---
title: Migrate from Firebase Firestore to Neon Postgres
subtitle: Learn how to migrate your data from Firebase Firestore to Neon Postgres using
  a custom Python script
redirectFrom:
  - /docs/import/import-from-firebase
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.067Z'
---

This guide describes how to migrate data from Firebase Firestore to Neon Postgres.

We'll use a custom Python script to export data from Firestore to a local file, and then import the data into Neon Postgres. This approach allows us to handle Firestore's document-based structure and convert it into the relational database format suitable for Postgres.

## Prerequisites

- A Firebase project containing the Firestore data you want to migrate.

- A Neon project to move the data to.

  For detailed information on creating a Neon project, see [Create a project](/docs/manage/projects#create-a-project).

- Python 3.10 or later installed on your local machine. Additionally, add the following packages to your Python virtual environment: `firebase_admin`, which is Google's python SDK for Firebase and `psycopg`, which is used to connect to Neon Postgres database.

  You can install them using `pip`:

  ```bash
  pip install firebase-admin "psycopg[binary,pool]"
  ```

## Retrieve Firebase credentials

This section describes how to fetch the credentials to connect to your Firebase Firestore database.

1. Log in to your Firebase Console and navigate to your project.
2. Go to **Project settings** (the gear icon next to "Project Overview" in the left sidebar).
3. Under the **Service Accounts** tab, click **Generate new private key**. This will download a JSON file containing your credentials.
4. Save this JSON file securely on your local machine. We'll use it in our Python script.

For more information, please consult the [Firebase documentation](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments).

## Export data from Firestore

In this step, we will use a Python script to export data from Firestore. This script will:

1. Connect to Firestore
2. Retrieve all collections and documents
3. Save the Firestore documents to a format suitable for ingesting into Postgres later

Here's the Python script:

```python
import argparse
import json
import os
from collections import defaultdict

import firebase_admin
from firebase_admin import credentials, firestore


def download_from_firebase(db, output_dir):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Initialize a defaultdict to store documents for each collection
    output: dict[str, list[dict]] = defaultdict(list)

    def _download_collection(collection_ref):
        print(f"Downloading from collection: {collection_ref.id}")

        # Determine the parent path for the current collection
        if collection_ref.parent:
            parent_path = collection_ref.parent.path
        else:
            parent_path = None

        # Iterate through all documents in the collection
        for doc in collection_ref.get():
            # Add document data to the output dictionary
            output[collection_ref.id].append(
                {
                    "id": doc.reference.path,
                    "parent_id": parent_path,
                    "data": doc.to_dict(),
                }
            )

            # Recursively handle subcollections
            for subcoll in doc.reference.collections():
                _download_collection(subcoll)

    # Start the download process with top-level collections
    for collection in db.collections():
        _download_collection(collection)

    # Save all (sub)collections to corresponding files
    for collection_id, docs in output.items():
        with open(os.path.join(output_dir, f"{collection_id}.json"), "w") as f:
            for doc in docs:
                f.write(json.dumps(doc) + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Download data from Firebase Firestore"
    )
    parser.add_argument(
        "--credentials", required=True, help="Path to Firebase credentials JSON file"
    )
    parser.add_argument(
        "--output",
        default="firestore_data",
        help="Output directory for downloaded data",
    )

    args = parser.parse_args()

    # Initialize Firebase app
    cred = credentials.Certificate(args.credentials)
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    # Download data from Firebase
    download_from_firebase(db, args.output)
    print(f"Firestore data downloaded to {args.output}")


if __name__ == "__main__":
    main()
```

Save this script as `firebase-download.py`. To run the script, you need to provide the path to your Firebase credentials JSON file and the output directory for the downloaded data. Run the following command in your terminal:

```bash shouldWrap
python firebase-download.py --credentials path/to/your/firebase-credentials.json --output firestore_data
```

For each unique collection id, this script creates a line-delimited JSON file, and all documents in that collection (spanning different top-level documents) are saved to it. For example, if you have a collection with the following structure:

```
/users
  /user1
    /orders
      /order1
      /order2
        /items
          /item1
          /item2
  /user2
    /orders
      /order3
```

The script will create the following files:

- `users.json`: Contains all user documents, i.e., `user1`, `user2`.
- `orders.json`: Contains all order documents across all users - `order1`, `order2`, `order3`.
- `items.json`: Contains all item documents across all orders - `item1`, `item2`.

Each file contains a JSON object for each document. To illustrate, `order1` gets saved to `orders.json` in the following format:

```json
{
  "id": "users/user1/orders/order1",
  "parent_id": "users/user1",
  "data": {
    "order_date": "2023-06-15",
    "total_amount": 99.99
  }
}
```

This structure allows for easy reconstruction of the hierarchical relationships between users, orders, and items, while also providing a flat file structure that's easy to process and import into other systems.

## Prepare your Neon destination database

This section describes how to prepare your destination Neon Postgres database to receive the imported data.

### Create the Neon database

1. In the Neon Console, go to your project dashboard.
2. In the sidebar, click on **Databases**.
3. Click the **New Database** button.
4. Enter a name for your database and click **Create**.

For more information, see [Create a database](/docs/manage/databases#create-a-database).

### Retrieve Neon connection details

1. In the Neon Console, go to your project dashboard.
2. Find the **Connection Details** widget, and toggle to the correct `Database` option.
3. Copy the connection string. It will look similar to this:

   ```
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

## Import data into Neon

We use another python script to import the firestore data we previously downloaded into Neon.

```python
import argparse
import json
import os

import psycopg
from psycopg.types.json import Jsonb


def upload_to_postgres(input_dir, conn_string):
    # Connect to the Postgres database
    conn = psycopg.connect(conn_string)

    # Iterate through all JSON files in the input directory
    for filename in os.listdir(input_dir):
        cur = conn.cursor()
        if filename.endswith(".json"):
            table_name = filename[:-5]  # Remove .json extension
            print("Writing to table: ", table_name)

            # Create table for the collection if it doesn't exist
            create_table_query = f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                id TEXT PRIMARY KEY,
                parent_id TEXT,
                data JSONB
            )
            """
            cur.execute(create_table_query)

            # Read and insert data from the JSON file
            with open(os.path.join(input_dir, filename), "r") as f:
                insert_query = f"""
                INSERT INTO {table_name} (id, parent_id, data)
                VALUES (%s, %s, %s)
                ON CONFLICT (id) DO UPDATE
                SET parent_id = EXCLUDED.parent_id, data = EXCLUDED.data
                """
                batch = []
                for line in f:
                    doc = json.loads(line)
                    batch.append((doc["id"], doc["parent_id"], Jsonb(doc["data"])))
                    if len(batch) == 20:
                        cur.executemany(insert_query, batch)
                        batch = []

                # Commit changes
                conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()


def main():
    parser = argparse.ArgumentParser(description="Upload data to Postgres")
    parser.add_argument(
        "--input",
        default="firestore_data",
        help="Input directory containing JSON files",
    )
    parser.add_argument("--postgres", required=True, help="Postgres connection string")

    args = parser.parse_args()

    # Upload data to Postgres
    upload_to_postgres(args.input, args.postgres)
    print(f"Data from {args.input} uploaded to Postgres")


if __name__ == "__main__":
    main()
```

Save this script as `neon-import.py`. To run the script, you need to provide the path to the input directory containing the JSON files and the Neon connection string. Run the following command in your terminal:

```bash shouldWrap
python neon-import.py --input firestore_data --postgres "<neon-connection-string>"
```

This script iterates over each JSON file in the input directory, creates a table in the Neon database for each collection, and inserts the data into the table. It also handles conflicts by updating the existing data with the new data.

## Verify the migration

After running both the Firestore export and the Neon import scripts, you should verify that your data has been successfully migrated:

1. Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or `psql`.

2. List all tables in your database:

   ```sql
   \dt
   ```

3. Run some sample queries to check that the data has been successfully imported. For example, the following query fetches all orders made by the first two customers:

   ```sql
   SELECT data FROM orders
   WHERE parent_id IN (
       SELECT id FROM customers
       LIMIT 2
   )
   ```

   Compare the results with those from your Firestore database to ensure data integrity. Note that using the `parent_id` field, we can navigate through the hierarchical structure of the original data.

## Other migration options

While this guide focuses on using a custom Python script, there are other migration options available:

- **Firestore managed export/import**

  If you have a large volume of data to migrate, you can use the [Google Cloud Firestore managed export and import service](https://firebase.google.com/docs/firestore/manage-data/export-import). It allows you to export your Firestore data to a Google Cloud Storage bucket, from where you can download and ingest it into Neon.

- **Open source utilities**

  There are also a number of open source utilities available that can help export data from Firestore to local files.

  - [firestore-import-export](https://github.com/dalenguyen/firestore-import-export)
  - [firestore-backup-restore](https://github.com/dalenguyen/firestore-backup-restore)

  However, these utilities are not as robust as the managed export/import service. If your data size is not big, we recommend using the sample code provided above or adapting it to your specific needs.

## Reference

For more information on the tools and libraries used in this guide, refer to the following documentation:

- [Migrating data to Neon](/docs/import/migrate-intro)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Cloud Firestore API](https://cloud.google.com/python/docs/reference/firestore/latest/index.html)
- [psycopg](https://www.psycopg.org/docs/)

<NeedHelp/>
