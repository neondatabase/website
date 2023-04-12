---
title: Use Grafbase resolvers with Neon
subtitle: Learn how to use Grafbase with Neon
enableTableOfContents: true
isDraft: true
---

Grafbase allows you to combine your data sources into a centralized GraphQL endpoint. This guide describes how to create a new GraphQL API using Grafbase and use Grafbase [resolvers](https://website-git-gb-3006-add-changelog-for-resolvers.grafbase-vercel.dev/docs/edge-gateway/resolvers) to interact with your Neon database at the edge.

You example project used in the guide simulates a marketplace of products, where product price is dynamically calculated and retrieved based on data in your Neon database.

## Prerequisites

- A [Grafbase account](https://grafbase.com/)
- A Neon project. See [Create a Neon project]()

## Create a backend with Grafbase

1. Create a directory for your Grafbase project and run the following command to initialize it:

    ```bash
    mkdir grafbase-neon
    cd grafbase-neon
    npx grafbase init
    ```

2. In your project directory, open the `grafbase/schema.graphql` file and replace the contents with the following schema:

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
2. Open the **SQL Editor**and run the following `CREATE TABLE` statement:

    ```sql
    CREATE TABLE product_visits(id SERIAL PRIMARY KEY, product_id TEXT NOT NULL);
    ```

This table stores product page view data used to dynamically calculate a product price.

## Create the resolvers

The schema includes a custom `addProductVisit` query and `prodcut/price` a field resolver. To create resolvers for those, create the following files in your project directory:

- `grafbase/resolvers/add-product-visit.js`
- `grafbase/resolvers/product/price.js`

Add the following code to each file:

  ```graphql
  export default function Resolver(root, params) {
    // ...
  }
  ```

More code will be added to these files in a later step.

## Install the Neon serverless driver

Inside the `grafbase` directory in your project, run the following commands to install the Neon serverless driver:

  ```bash
  npm init -y
  npm install @neondatabase/serverless
  ```

## Retrieve your Neon connection string

A database connection string is required to forward queries are forwarded to your Neon database. 

1. Navigate to the Neon Dashboard.
2. Copy the connection string for your database from the **Connection Details** widget. The connection string should look something like this:

    ```text
    postgres://<user>:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb
    ```

3. Add the connection string to a `DATABASE_URL` variable in your `grafbase/.env` file. For example:

    ```text
    DATABASE_URL=postgres://<user>:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb
    ```

## Add code to your resolvers

1. In the `respolvers/product/add-product-visit` resolver, add the following code, which will insert a new record in the `product_visits` table with the `productId` each time the resolver is queried.

    ```graphql
    // grafbase/resolvers/add-product-visit.js
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

In the `product/price` resolver, add the following code, which calculates the product price based on the number of visits (interest) in the product.

    ```graphql
    // grafbase/resolvers/product/price.js
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

1. Start the Grafbase CLI:

    ```bash
    npx grafbase dev
    ```

2. Go to http://localhost:4000 and execute the following GraphQL mutation, which creates a new product:

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

Grab the `id`, and then use it to execute the following mutation, which will add a row in our database table:

  ```graphql
  mutation {
    addProductVisit(productId: "PREVIOUS_PRODUCT_ID")
  }
  ```

Then query the same product, and check the price:

  ```graphql
  query {
    product(input: { by: "PREVIOUS_PRODUCT_ID" }) {
      id
      name
      price
    }
  }
  ```

The price increases as you run more `addProductVisit` queries.
