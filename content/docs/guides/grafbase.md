---
title: Use Grafbase Edge Resolvers with Neon
subtitle: Learn how to build and deploy serverless GraphQL backends with Grafbase and
  Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.392Z'
---

_This guide was contributed by Josep Vidal from Grafbase_

Grafbase allows you to combine your data sources into a centralized GraphQL endpoint and deploy a serverless GraphQL backend.

This guide describes how to create a GraphQL API using Grafbase and use Grafbase [Edge Resolvers](https://grafbase.com/docs/edge-gateway/resolvers) with the [Neon serverless driver](/docs/serverless/serverless-driver) to interact with your Neon database at the edge.

The example project in this guide simulates a marketplace of products, where the product price is dynamically calculated based on data retrieved from your Neon database.

## Prerequisites

- The [Grafbase CLI](https://grafbase.com/cli)
- A Neon project. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Create a backend with Grafbase

1. Create a directory and initialize your Grafbase project by running the following commands:

   ```bash
   npx grafbase init grafbase-neon
   cd grafbase-neon
   ```

2. In your project directory, open the `grafbase/schema.graphql` file and replace the existing content with the following schema:

   ```graphql
   extend type Mutation {
     addProductVisit(productId: ID!): ID! @resolver(name: "add-product-visit")
   }

   type Product @model {
     name: String!
     price: Float @resolver(name: "product/price")
   }
   ```

## Create the schema in Neon

1. Navigate to the Neon Console and select your project.
2. Open the Neon **SQL Editor** and run the following `CREATE TABLE` statement:

   ```sql
   CREATE TABLE product_visits(id SERIAL PRIMARY KEY, product_id TEXT NOT NULL);
   ```

   The `product_visits` table stores product page view data that the application uses to dynamically calculate a product price.

## Create the resolver files

The schema includes an `addProductVisit` query and `prodcut/price` field. Create resolvers for those by creating the following files in your project directory:

- `grafbase/resolvers/add-product-visit.js`
- `grafbase/resolvers/product/price.js`

You can use the following commands to create the files:

```bash
cd grafbase
mkdir resolvers
cd resolvers
touch add-product-visit.js
mkdir product
cd product
touch price.js
```

You will add code to these files in a later step.

## Install the Neon serverless driver

Inside the `grafbase` directory in your project, run the following commands to install the Neon serverless driver:

```bash
cd ..
npm init -y
npm install @neondatabase/serverless
```

## Retrieve your Neon connection string

A database connection string is required to forward queries to your Neon database. To retrieve the connection string for your database:

1. Navigate to the Neon **Dashboard**.
2. Copy the connection string for your database from the **Connection Details** widget. The connection string should appear similar to the following:

   ```text shouldWrap
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

3. Add a `DATABASE_URL` environment variable to your `grafbase/.env` file and set the value to your connection string. For example:

   ```text shouldWrap
   DATABASE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

## Add code to the resolvers

1. In the `resolvers/product/add-product-visit` resolver, add the following code, which inserts a new record in the `product_visits` table with a `productId` each time the resolver is queried.

   ```javascript
   # grafbase/resolvers/add-product-visit.js
   import { Client } from '@neondatabase/serverless'

   export default async function Resolver(_, { productId }) {
     const client = new Client(process.env.DATABASE_URL)

     await client.connect()
     await client.query(
       `INSERT INTO product_visits (product_id) VALUES ('${productId}')`
     )
     await client.end()

     return productId
   }
   ```

2. In the `grafbase/resolvers/product/price.js` resolver, add the following code, which calculates the product price based on the number of product visits (the number of visits represents customer interest in the product).

   ```javascript
   # grafbase/resolvers/product/price.js
   import { Client } from '@neondatabase/serverless'

   export default async function Resolver({ id }) {
     const client = new Client(process.env.DATABASE_URL)
     await client.connect()

     const {
       rows: [{ count }]
     } = await client.query(
       `SELECT COUNT(*) FROM product_visits WHERE product_id = '${id}'`
     )
     await client.end()

     return Number.parseInt(count)
   }
   ```

## Test the resolvers

To test the resolvers with Neon, perform the following steps:

1. Start the Grafbase CLI:

   ```bash
   npx grafbase dev
   ```

2. Go to [http://localhost:4000](http://localhost:4000) and execute the following GraphQL mutation, which creates a new product:

   ```graphql
   mutation {
     productCreate(input: { name: "Super Product" }) {
       product {
         id
         name
       }
     }
   }
   ```

3. Use the product `id` to execute the following mutation, which adds a row to the database table in Neon:

   ```graphql
   mutation {
     addProductVisit(productId: "PREVIOUS_PRODUCT_ID")
   }
   ```

4. Query the same product, and check the price:

   ```graphql
   query {
     product(input: { by: "PREVIOUS_PRODUCT_ID" }) {
       id
       name
       price
     }
   }
   ```

5. Run the query several more times and watch how the price increases as "interest" in the product increases.
