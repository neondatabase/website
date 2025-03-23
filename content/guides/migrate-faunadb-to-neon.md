---
title: The missing FaunaDB migration guide
subtitle: 'Learn how to migrate from FaunaDB to Neon Postgres effectively'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-03-23T00:00:00.000Z'
updatedOn: '2025-03-23T00:00:00.000Z'
---

As FaunaDB [announces the end of its services](https://fauna.com/blog/the-future-of-fauna) by **May 30, 2025**, many users are now seeking robust and reliable database alternatives to maintain their application momentum. FaunaDB has been valued for its flexible document-relational model and global reach, powering a wide array of applications.  With the upcoming discontinuation, finding a replacement that offers both similar capabilities and long-term stability, while also mitigating vendor lock-in, is paramount.

For FaunaDB users considering their next steps, **Neon emerges as a strong contender**.  Like Fauna, Neon offers a **serverless architecture**, providing effortless scalability and operational simplicity.  However, Neon distinguishes itself by being built on **pure Postgres**. This foundation provides the best of both worlds: the modern, scalable benefits of serverless with the rock-solid reliability and widespread familiarity of Postgres, all while avoiding vendor lock-in.

This guide is designed to help FaunaDB users understand how to transition to Neon Postgres effectively, ensuring a seamless migration process and continued success for your applications beyond the FaunaDB sunset, all while embracing the freedom of open standards.

<Admonition type="note">
Migrating from FaunaDB to Neon Postgres is a complex process involving schema translation, data migration, and query conversion. This guide provides a structured approach to help you navigate the migration process effectively.

If you have questions or require help with migrating large production datasets from FaunaDB, please contact [Neon Support](/migration-assistance)
</Admonition>

## FaunaDB vs. Neon (Postgres)

Before diving into the migration process, it's crucial to understand the fundamental differences between FaunaDB and Neon (Postgres). While both are databases, they operate with distinct paradigms:

| Feature          | FaunaDB                                    | Neon (Postgres)                               |
|-------------------|---------------------------------------------|-----------------------------------------------|
| **Database type** | Multi-Model (Document-Relational)          | Relational (SQL)        |
| **Data model** | JSON documents in collections, flexible schema | Tables with rows and columns, rigid schema  |
| **Query language**| FQL (Fauna Query Language), Functional     | SQL (Structured Query Language), Declarative  |
| **Schema** | Implicit, Schemaless/Schema-optional, evolving | Explicit, Schema-first, Requires migrations    |
| **Indexes** | Explicit, Application-driven, Materialized views | Implicit/Explicit, Query planner-driven, Standard indexes |
| **Transactions** | ACID, Stateless, HTTPS requests | ACID, Stateful, Persistent/HTTP/Websocket Connections      |
| **Server model** | Serverless (Managed), Cloud-Native          | Serverless (Managed), Cloud-Native            |
| **Data Integrity** | Application level constraints             | Schema level constraints |


## Migration steps

The migration process from FaunaDB to Neon Postgres involves several key steps, each essential for a successful transition. These steps include exporting your data and schema from FaunaDB, translating your schema to Postgres DDL, importing your data into Neon, converting your queries from FQL to SQL. Let's break down these steps in detail:

### Step 1: Exporting data from FaunaDB

If you are on a paid FaunaDB plan, you can utilize the database's export functionality to save data in JSON format directly to an Amazon S3 bucket. [Fauna CLI](https://docs.fauna.com/fauna/current/build/cli/v4/) can be used to [export data to S3](https://docs.fauna.com/fauna/current/manage/exports/).

```bash
fauna export create s3 \
  --database <database_name> \
  --collection <collection_name> \
  --bucket <s3_bucket_name> \
  --path <s3_bucket_path> \
  --format simple
```

For smaller datasets, you can export data directly to your local filesystem using FQL. The following script demonstrates exporting data from FaunaDB collections as JSON files. For example, here's a Node.js script that exports data from specific collections (e.g., `Product`, `Category`) to JSON files (e.g., `Product.json`, `Category.json`):

```javascript
import { Client, fql, FaunaError } from "fauna";
import fs from "fs";

// Route queries to a specific database
// using the authentication secret in
// the `FAUNA_SECRET` environment variable.
const client = new Client();

// Specify the collections to export.
// You can retrieve a list of user-defined collections
// using a `Collection.all()` query.
const collectionsToExport = ["Product", "Category"];

// Loop through the collections.
for (const collectionName of collectionsToExport) {
  try {
    // Compose a query using an FQL template string.
    // The query returns a Set containint all documents
    // in the collection.
    const query = fql`
      let collection = Collection(${collectionName})
      collection.all()`;

    // Run the query.
    const pages = client.paginate(query);

    // Iterate through the resulting document Set.
    const documents = [];
    for await (const page of pages.flatten()) {
      documents.push(page);
    }

    // Convert the 'documents' array to a JSON string.
    const jsonData = JSON.stringify(documents, null, 2);

    // Write the JSON string to a file named `<collectionName>.json`.
    fs.writeFileSync(`${collectionName}.json`, jsonData, "utf-8");

    console.log(
      `${collectionName} collection data written to ${collectionName}.json`
    );
  } catch (error) {
    if (error instanceof FaunaError) {
      console.error(`Error exporting ${collectionName}:`, error);
    } else {
      console.error(
        `An unexpected error occurred for ${collectionName}:`,
        error
      );
    }
  }
}

client.close();
```

You can learn more about exporting data from FaunaDB in the [official documentation](https://docs.fauna.com/fauna/current/migrate/?lang=javascript).

For example, here's a sample JSON file for the exported `Product` collection:

```json
[
  {
    "data": [
      {
        "id": "426122714129891392",
        "coll": "Product",
        "ts": "2025-03-22T10:58:58.290Z",
        "name": "cups",
        "description": "Translucent 9 Oz, 100 ct",
        "price": 698,
        "stock": 100,
        "category": {
          "id": "426122714117308480",
          "coll": "Category"
        }
      },
      .... other records
  }
]
```

### Step 2: Exporting FaunaDB schema (FSL schema pull)

Alongside data, you'll need to export your FaunaDB schema, defined in Fauna Schema Language (FSL).

**Using `fauna schema pull` command:**

The `fauna schema pull` command in the Fauna CLI is used to export your database schema to a local directory.

**Fauna CLI command:**

```bash
fauna schema pull \
  --database <your_faunadb_database_name> \
  --dir <local_schema_directory> \
  --active
```

For example, here's a sample FSL schema file `collections.fsl` exported from FaunaDB:

```fsl
collection Product {
  name: String
  description: String
  // Use an Integer to represent cents.
  // This avoids floating-point precision issues.
  price: Int
  category: Ref<Category>
  stock: Int

  // Use a unique constraint to ensure no two products have the same name.
  unique [.name]
  check stockIsValid (product => product.stock >= 0)
  check priceIsValid (product => product.price > 0)

  index byCategory {
    terms [.category]
  }

  index sortedByCategory {
    values [.category]
  }

  index byName {
    terms [.name]
  }

  index sortedByPriceLowToHigh {
    values [.price, .name, .description, .stock]
  }
}
```

### Step 3: Schema translation - FSL to Neon Postgres DDL

<Admonition type="info" title="Manual schema translation 🥺">
Unfortunately, there isn't a fully automated FSL to SQL DDL converter as these are fundamentally different database paradigms. You'll need to manually translate your FaunaDB schema to Neon Postgres DDL. This process involves mapping FaunaDB collections, fields, indexes, and constraints to Postgres tables, columns, indexes, and constraints.
</Admonition>

Begin by thoroughly examining the exported Fauna Schema Language (FSL) files. This step is crucial for gaining a comprehensive understanding of your FaunaDB schema structure. Pay close attention to the definitions of collections, their associated fields, indexes, and constraints.

For instance, the Product collection, as shown in the above example `collections.fsl` file, includes fields like `name`, `description`, `price`, `category`, and `stock`. The schema also specifies unique and check constraints for data integrity, along with indexes to optimize query performance.

Once you have a clear grasp of your exported FSL schema, the next step involves translating it into Neon Postgres Data Definition Language (DDL). This translation process is necessary to create equivalent tables and indexes within your Neon Postgres database. By accurately converting your FaunaDB schema into DDL, you ensure a smooth transition and maintain the structural integrity of your data during migration.

If you need a refresher on Postgres, you can refer to our [PostgreSQL Tutorial](/postgresql/tutorial).

**Key translation considerations:**

*   **Collections to Tables:** Each FaunaDB collection in your FSL schema could become a Neon Postgres table.
*   **Field Definitions to Columns:**  FaunaDB field definitions will guide your Neon Postgres column definitions. Pay attention to data types like `String`, `Number`, `Time`, `Ref`, and optionality (`?` for nullable).
*   **Unique constraints:** Translate FaunaDB `unique` constraints in FSL to `UNIQUE` constraints in your Postgres `CREATE TABLE` statements.
*   **Indexes:** Translate FaunaDB `index` definitions in FSL to `CREATE INDEX` statements in Postgres.  Consider the `terms` and `values` of FaunaDB indexes to create effective Postgres indexes.
*   **Computed Fields/Functions/Roles:**  FaunaDB's more advanced schema features like `compute`, functions, and roles will require careful consideration for translation.  Computed fields might translate to Postgres views or computed columns. UDFs will likely need to be rewritten as stored procedures or application logic.

#### Example FSL to Postgres DDL translation

```fsl
collection Product {
  name: String
  description: String
  price: Int
  category: Ref<Category>
  stock: Int

  unique [.name]
  check stockIsValid (product => product.stock >= 0)
  check priceIsValid (product => product.price > 0)

  index byCategory {
    terms [.category]
  }

  index sortedByCategory {
    values [.category]
  }

  index byName {
    terms [.name]
  }

  index sortedByPriceLowToHigh {
    values [.price, .name, .description, .stock]
  }
}
```

**Neon Postgres DDL (Translated):**

```sql
-- Neon Postgres Table for Product
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  category_id BIGINT NOT NULL,
  stock INT NOT NULL,
  CONSTRAINT unique_product_name UNIQUE (name),
  CONSTRAINT stock_valid CHECK (stock >= 0),
  CONSTRAINT price_valid CHECK (price > 0)
);
```

<Admonition type="tip" title="Donot want to use Raw SQL?">
If you prefer a more programmatic approach to schema translation, you can use any Postgres library or ORM (object-relational mapping) tool in your chosen programming language. These tools can help automate the schema creation process and provide a more structured way to define your Postgres schema. Learn more on our [language guides](/docs/get-started-with-neon/languages) and [ORM guides](/docs/get-started-with-neon/orms) section.
</Admonition>

### Step 4: Data import to Neon Postgres

With your Neon Postgres database ready and your data exported from FaunaDB, the next crucial step is to import this data into your newly created tables.

For this guide, we'll demonstrate importing data from the `product.json` file (exported from FaunaDB) into the `products` table in Neon Postgres.

This example Node.js script reads the `Product.json` file, parses the JSON data, and then generates and executes `INSERT` statements to populate your `products` table in Neon Postgres.

You can get `NEON_CONNECTION_STRING` from your Neon dashboard. Learn more about [Connecting Neon to your stack](/docs/get-started-with-neon/connect-neon)

```javascript
import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

async function importProducts() {
    const neonConnectionString = process.env.NEON_CONNECTION_STRING;
    const client = new Client({ connectionString: neonConnectionString });

    try {
        await client.connect();
        const rawData = fs.readFileSync('Product.json');
        const productData = JSON.parse(rawData);

        // Start transaction
        await client.query('BEGIN');

        // Build a bulk insert query for a batch of records
        const insertValues = [];
        const placeholders = [];

        productData[0].data.forEach((product, index) => {
            const { name, description, price, stock, category } = product;
            const categoryId = Number(category.id);

            const offset = index * 5;
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
            insertValues.push(name, description, price, stock, categoryId);
        });

        const insertQuery = `
          INSERT INTO products (name, description, price, stock, category_id)
          VALUES ${placeholders.join(', ')}
        `;

        await client.query(insertQuery, insertValues);
        await client.query('COMMIT');
        console.log('Products imported successfully!');

    } catch (error) {
        console.error('Error during product import:', error);
        await client.query('ROLLBACK');
    } finally {
        await client.end();
    }
}

importProducts();
```

You can adapt this script to import data from other collections by adjusting the file paths, table names, and data transformations as needed.

<Admonition type="tip" title="Importing multiple collections with references">
When importing data from multiple collections with references (e.g., `Product` referencing `Category`), you'll need to ensure that the referenced data is imported first, i.e., `Category` data before `Product` data. This sequence ensures that foreign key constraints are satisfied during the import process.
</Admonition>


### Step 5: Query conversion - FQL to SQL

<Admonition type="tip" title="Gradual migration with Flags">
We recommend using a flag-based approach to gradually migrate your application from FaunaDB to Neon Postgres. This approach involves running your application with both FaunaDB and Neon Postgres connections simultaneously, using a feature flag to switch between the two databases. This strategy allows you to test and validate your application's behavior on Neon Postgres without disrupting your production environment. Once you see that your application is functioning correctly with Neon Postgres, you can fully transition away from FaunaDB.
</Admonition>

This is a critical step in the migration process, as it involves converting your application's FaunaDB queries (written in Fauna Query Language - FQL) to equivalent SQL queries.

Here are some key translation patterns to consider when converting Fauna's `FQL` to Postgres `SQL`:

#### Retrieving all documents from a collection

**Fauna (FQL):**

```fql
let collection = Collection(${collection_name})
collection.all()
```

**Neon Postgres (SQL):**

```sql
SELECT * FROM <your_table_name>; -- Replace <your_table_name> with your Neon table name
```

#### Retrieving a document by ID

**FaunaDB (FQL):**

```fql
Product.where(.name == 'avocados');
```

**Neon Postgres (SQL):**

```sql
SELECT * FROM products WHERE name = 'avocados';
```

#### Filtering data

**FaunaDB (FQL):**

```fql
Product.where(.category?.name == "party")
```

**Neon Postgres (SQL):**

```sql
SELECT p.*
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'party';
```

**Actionable steps for query conversion:**

1.  **Review application queries:** Identify the key queries in your application that interact with FaunaDB.
2.  **Translate FQL to SQL (focus on key queries):** Translate these key FQL queries into equivalent SQL queries, focusing on the patterns shown in the examples above.
3.  **Test SQL queries:** Test your translated SQL queries to ensure they function correctly and efficiently.

<Admonition type="note" title="Recommendation for complex queries">
Given the potential volume of unstructured data insertion and retrieval queries in your application, which can be challenging to implement within a two-month timeframe, we recommend prioritizing the queries that are most critical to your application's core functionality and performance. For handling deeply nested unstructured data, consider using the [JSONB datatype in Postgres](/postgresql/postgresql-tutorial/postgresql-json)
</Admonition>

<NeedHelp />