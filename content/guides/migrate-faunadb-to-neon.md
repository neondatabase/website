---
title:  Migrating from FaunaDB to Neon Postgres
subtitle: 'Learn how to migrate your data and applications from FaunaDB to Neon Postgres'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-03-23T00:00:00.000Z'
updatedOn: '2025-03-23T00:00:00.000Z'
---

Neon, like Fauna, offers a **serverless architecture**—but it’s built on **Postgres**. That means you get the scalability of serverless along with the reliability and familiarity of a proven SQL database.

This guide is designed to help FaunaDB users understand how to transition to Neon Postgres.

<Admonition type="note">
Migrating from FaunaDB to Neon Postgres involves schema translation, data migration, and query conversion. This guide provides a structured approach to help you navigate the migration process effectively.

If you have questions or require help with migrating large production datasets from FaunaDB, please [contact Neon for migration assistance](/migration-assistance).
</Admonition>

## FaunaDB vs. Neon (Postgres)

Before diving into the migration process, it's important to understand the fundamental differences between FaunaDB and Neon (Postgres). While both are databases, they operate with distinct paradigms:

| Feature          | FaunaDB                                    | Neon (Postgres)                               |
|-------------------|---------------------------------------------|-----------------------------------------------|
| **Database type** | Multi-model (document-relational)          | Relational (SQL)        |
| **Data model** | JSON documents in collections, flexible schema | Tables with rows and columns, rigid schema  |
| **Query language**| FQL (Fauna Query Language), functional     | SQL (Structured Query Language), declarative  |
| **Schema** | Implicit, schemaless/schema-optional, evolving | Explicit, schema-first, requires migrations    |
| **Transactions** | ACID, stateless, HTTPS requests | ACID, stateful/Stateless, persistent TCP/HTTP/Websocket connections      |
| **Server model** | Serverless (managed), cloud-native          | Serverless (managed), cloud-native            |


## Migration steps

The migration process from FaunaDB to Neon Postgres involves several key steps, each essential for a successful transition. These steps include exporting your data and schema from FaunaDB, translating your schema to Postgres DDL, importing your data into Neon, and converting your queries from FQL to SQL. Let's break down these steps in detail:

### Step 1: Exporting data from FaunaDB

If you are on a paid FaunaDB plan, you can utilize the database's export functionality to save data in JSON format directly to an Amazon S3 bucket. [Fauna CLI](https://docs.fauna.com/fauna/current/build/cli/v4/) can be used to [export data to S3](https://docs.fauna.com/fauna/current/manage/exports/)

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

In addition to your data, you'll need to export your FaunaDB schema, defined in Fauna Schema Language (FSL).

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

### Step 3: Schema translation - FSL to Postgres DDL

<Admonition type="info" title="Manual schema translation 🥺">
Unfortunately, there isn't a fully automated FSL to SQL DDL converter as these are fundamentally different database paradigms. You'll need to manually translate your FaunaDB schema to Postgres DDL. This process involves mapping FaunaDB collections, fields, indexes, and constraints to Postgres tables, columns, indexes, and constraints.
</Admonition>

Begin by thoroughly examining the exported Fauna Schema Language (FSL) files. This step is crucial for gaining a comprehensive understanding of your FaunaDB schema structure. Pay close attention to the definitions of collections, their associated fields, indexes, and constraints.

For instance, the Product collection, as shown in the above example `collections.fsl` file, includes fields like `name`, `description`, `price`, `category`, and `stock`. The schema also specifies unique and check constraints for data integrity, along with indexes to optimize query performance.

Once you have a clear grasp of your exported FSL schema, the next step involves translating it into Postgres Data Definition Language (DDL). This translation process is necessary to create equivalent tables and indexes within your Postgres database. By accurately converting your FaunaDB schema into DDL, you ensure a smooth transition and maintain the structural integrity of your data during migration.

If you need a refresher on Postgres, you can refer to Neon's [PostgreSQL Tutorial](/postgresql/tutorial).

**Key translation considerations:**

*   **Collections to tables:** Each FaunaDB collection in your FSL schema could become a Neon Postgres table.
*   **Field definitions to columns:**  FaunaDB field definitions will guide your Neon Postgres column definitions. Pay attention to data types like `String`, `Number`, `Time`, `Ref`, and optionality (`?` for nullable).
*   **Unique constraints:** Translate FaunaDB `unique` constraints in FSL to `UNIQUE` constraints in your Postgres `CREATE TABLE` statements.
*   **Indexes:** Translate FaunaDB `index` definitions in FSL to `CREATE INDEX` statements in Postgres.  Consider the `terms` and `values` of FaunaDB indexes to create effective Postgres indexes.
*   **Computed fields/functions:**  FaunaDB's more advanced schema features like `compute`, functions will require careful consideration for translation.  Computed fields might translate to Postgres views or computed columns. UDFs will likely need to be rewritten as stored procedures or application logic.

#### Example FSL to Postgres DDL translation

Let's consider the `Category` collection from the FSL schema and translate it to a `categories` table in Neon Postgres. Here's the FSL schema for the `Category` collection:

```fsl
collection Category {
  name: String
  description: String
  compute products: Set<Product> = (category => Product.byCategory(category))

  unique [.name]

  index byName {
    terms [.name]
  }
}
```

**Neon Postgres DDL (Translated):**

Here's how you can translate the `Category` collection to a `categories` table with the necessary constraints and indexes:

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  -- Constraints
  CONSTRAINT unique_category_name UNIQUE (name)
);

-- Indexes (create indexes after data migration if possible for speeding up data import)
CREATE INDEX idx_categories_name ON categories(name);
```

Now let's consider the `Product` collection from the FSL schema and translate it to a `products` table in Neon Postgres. Here's the FSL schema for the `Product` collection:

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

Now that you have a `categories` table created in Neon Postgres, here's how you can translate the `Product` collection to a `products` table with the necessary constraints, references and indexes:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  category_id INT NOT NULL,
  stock INT NOT NULL,
  -- Constraints
  CONSTRAINT unique_product_name UNIQUE (name),
  CONSTRAINT stock_valid CHECK (stock >= 0),
  CONSTRAINT price_valid CHECK (price > 0),
  -- Foreign key
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Indexes (create indexes after data migration if possible for speeding up data import)
CREATE INDEX idx_products_category ON products(category_id); 
CREATE INDEX idx_products_price_asc ON products(price) INCLUDE (name, description, stock);
```

Here we are adding a foreign key constraint `fk_category` to ensure that the `category_id` in the `products` table references the `id` column in the `categories` table. This constraint enforces referential integrity between the two tables.

<Admonition type="tip" title="Don't want to use Raw SQL?">
If you prefer a more programmatic approach to schema translation, you can use any Postgres library or ORM (object-relational mapping) tool in your chosen programming language. These tools can help automate the schema creation process and provide a more structured way to define your Postgres schema. Learn more on our [language guides](/docs/get-started-with-neon/languages) and [ORM guides](/docs/get-started-with-neon/orms) section.
</Admonition>

### Step 4: Data import to Neon Postgres

With your Neon Postgres database ready and your data exported from FaunaDB, the next step is to import this data into your newly created tables.

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
When importing data that spans multiple collections with relationships (for instance, `Product` collection documents referencing `Category` collection documents), it is **essential to import data in the correct order** to maintain data integrity.

Specifically, you must **import the data for the *referenced* collection (e.g., `Category`) *before* importing the data for the *referencing* collection (e.g., `Product`)**.

Keep the following considerations in mind when importing data with relationships:

- **Establish referenced data first:**  Postgres, being a relational database, relies on foreign key constraints to enforce relationships between tables. When you import data into the `Product` table that is intended to reference entries in the `Category` table, those `Category` entries must already exist in Postgres.

- **ID handling depends on your strategy:**  While FaunaDB uses its own distributed document ID system, Postgres ID generation is more flexible. **Whether you need to transform IDs depends on your chosen ID strategy in Postgres:**

    - **Scenario 1: Using Postgres-Generated IDs:** If you are using Postgres's default ID generation mechanisms (like `SERIAL`, `UUID`, or `IDENTITY` columns), then **Postgres will automatically generate *new* IDs** for the rows in your tables. In this scenario, you *will* need to manage ID transformation for relationships.

    - **Scenario 2: Retaining FaunaDB IDs:**  If you are explicitly setting IDs during import to retain FaunaDB IDs in Postgres, you must ensure that the IDs are correctly mapped and managed. You may choose this approach if you:
        -  Want to retain FaunaDB IDs for compatibility and speed up the migration process.
        -  Have a strategy to manage ID collisions and ensure uniqueness at the application level.

- **Managing IDs for Relationships (Regardless of ID retention):**  Even if you *do* successfully retain FaunaDB IDs in Postgres (Scenario 2),  you still need to be mindful of how relationships are established.  If you are using foreign keys in Postgres (the recommended approach for relational data), you must ensure that the IDs used in your referencing tables (e.g., `product.category_id`) **correctly match the IDs in the referenced table (e.g., `categories.id`)**. This will be be valid if you are mapping the JSON data to Postgres tables without any transformation.

- **Strategies for ID management (If Not Retaining FaunaDB IDs):** If you are using Postgres-generated IDs, you will need a strategy to:
    - **Option 1: Pre-map IDs:**  Before importing `Product` data, you might need to process your JSON data to replace the FaunaDB `Category` document IDs with the **newly generated Postgres IDs** of the corresponding categories. This involves creating a mapping between the FaunaDB IDs and the Postgres-generated IDs for the `Category` table and replacing the `category.id` references in your `Product.json` data dump with the corresponding Postgres IDs.
    - **Option 2:  Lookup-based Insertion:** During the import of `Product` data, instead of directly inserting IDs, you might perform a **lookup** in the already imported `Category` table based on a unique identifier (like category name) from your JSON data to retrieve the correct Postgres `category_id` to use as a foreign key. You can use the [example below](#inserting-a-new-document) as a reference.
</Admonition>


### Step 5: Query conversion - FQL to SQL

<Admonition type="tip" title="Gradual migration with Flags">
We recommend using a flag-based approach to gradually migrate your application from FaunaDB to Neon Postgres. This approach involves running your application with both FaunaDB and Neon Postgres connections simultaneously, using a feature flag to switch between the two databases. This strategy allows you to test and validate your application's behavior on Neon Postgres without disrupting your production environment. Once you see that your application is functioning correctly with Neon Postgres, you can fully transition away from FaunaDB.
</Admonition>

This is a critical step in the migration process, as it involves converting your application's FaunaDB queries (written in Fauna Query Language - FQL) to equivalent SQL queries.

Here are some key translation patterns to consider when converting Fauna's `FQL` to Postgres `SQL`:

#### Retrieving all documents from a collection

For example, to retrieve all documents from the `Product` collection using FQL:

```fql
let collection = Collection("Product")
collection.all()
```

Assuming you have ported 'Product' collection to 'products' table in Neon Postgres, the equivalent SQL query would be:

```sql
SELECT * FROM products;
```

#### Filtering data - Simple WHERE clause

For example, to filter products by name in FQL:

```fql
Product.where(.name == 'avocados');
```

The equivalent SQL query would be:

```sql
SELECT * FROM products WHERE name = 'avocados';
```

#### Filtering data - Nested field WHERE clause (Joins equivalent)

For example, to filter products by category name in FQL:

```fql
Product.where(.category?.name == "party")
```

The equivalent SQL query would involve a join between the `products` and `categories` tables:

```sql
SELECT p.*
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'party';
```

#### Ordering data

For example, to order products by price in ascending order:

```fql
Product.all().order(.price)
```

The equivalent SQL query would be:

```sql
SELECT * FROM products ORDER BY price ASC;
```

#### Counting documents

For example, to count all documents in the `Product` collection in FQL:

```fql
Product.all().count();
```

The equivalent SQL query would be:

```sql
SELECT COUNT(*) FROM products;
```

#### Aggregations

For example, to calculate the total stock count of all products in FQL:

```fql
let stockCounts = Product.all().map(doc => doc.stock )
stockCounts.aggregate(0, (a, b) => a + b)
```

The equivalent SQL query would be:

```sql
SELECT SUM(stock) FROM products;
```
#### Filtering data -  `AND` and `OR` conditions

For example, to filter products that are both priced above $10 AND have less than 50 units in stock in FQL:

```fql
Product.where(.price > 10 && .stock < 50)
```

The equivalent SQL query to achieve the same filtering would be:

```sql
SELECT * FROM products WHERE price > 10 AND stock < 50;
```

For example, to filter products that are either in the "party" category OR priced below 20 in FQL:

```fql
Product.where(.category?.name == "party" || .price < 20)
```

The equivalent SQL query, involving a join to access the category name, would be:

```sql
SELECT p.*
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'party' OR p.price < 20;
```

#### Updating a document

For example, to update the description of a product named "avocados" in FQL:

```fql
let productRef = Product.where(.name == 'avocados').first()
Product.byId(productRef!.id)!.update({ description: "Fresh, ripe avocados from California" })
```

The equivalent SQL query to update the same product description would be:

```sql
UPDATE products
SET description = 'Fresh, ripe avocados from California'
WHERE name = 'avocados'
LIMIT 1;
```

#### Deleting a document

For example, to delete a product named "pizza" in FQL:

```fql
let productRef = Product.where(.name == 'pizza').first()
Product.byId(productRef!.id)!.delete()
```

The equivalent SQL query to delete the same product would be:

```sql
DELETE FROM products
WHERE name = 'pizza'
LIMIT 1;
```

#### Inserting a new document

For example, to insert a new product "Organic Strawberries" in FQL, linking it to the "produce" category:

```fql
Product.create({
  name: "Organic Strawberries",
  price: 699,
  stock: 150,
  description: "Fresh strawberries",
  category: Category.where(.name == "produce").first()
})
```

The equivalent SQL query to insert the same product and link it to the "produce" category would be:

```sql
INSERT INTO products (name, price, stock, description, category_id)
VALUES ('Organic Strawberries', 699, 150, 'Fresh strawberries', (SELECT id FROM categories WHERE name = 'produce'))
RETURNING *;
```

**Actionable steps for query conversion:**

1.  **Review application queries:** Identify the key queries in your application that interact with FaunaDB.
2.  **Translate FQL to SQL (focus on key queries):** Translate these key FQL queries into equivalent SQL queries, focusing on the patterns shown in the examples above.
3.  **Test SQL queries:** Test your translated SQL queries against your Neon Postgres database to ensure they function correctly, return the expected data, and are performant. You might need to use [`EXPLAIN ANALYZE`](/postgresql/postgresql-tutorial/postgresql-explain) in Postgres to analyze query performance and optimize indexes if needed.


<Admonition type="note" title="Recommendation for complex queries">
Given the potential volume of unstructured data insertion and retrieval queries in your application, which can be challenging to implement within a short timeframe, we recommend prioritizing the queries that are most critical to your application's core functionality and performance. For handling deeply nested unstructured data, consider using the [JSONB datatype in Postgres](/postgresql/postgresql-tutorial/postgresql-json)
</Admonition>

## Resources

- [The Future of Fauna](https://fauna.com/blog/the-future-of-fauna)
- [Migrate off Fauna](https://docs.fauna.com/fauna/current/migrate/?lang=javascript)
- Modernizing from PostgreSQL to Serverless with Fauna: [Part 1](https://fauna.com/blog/modernizing-from-postgresql-to-serverless-with-fauna-part-1) [Part 2](https://fauna.com/blog/modernizing-from-postgresql-to-serverless-with-fauna-part-2) [Part 3](https://fauna.com/blog/modernizing-from-postgresql-to-serverless-with-fauna-part-3)

<NeedHelp />