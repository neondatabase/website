---
title: Use Grafbase resolvers with Neon
subtitle: Learn how to use Grafbase with Neon
enableTableOfContents: true
isDraft: true
---

Grafbase allows you to combine your data sources into a centralized GraphQL endpoint, which you can deploy at the edge using the [Grafbase Edge Gateway](https://website-git-gb-3006-add-changelog-for-resolvers.grafbase-vercel.dev/docs/edge-gateway).

This guide describes how to create a new GraphQL API using Grafbase and use Grafbase [resolvers](https://website-git-gb-3006-add-changelog-for-resolvers.grafbase-vercel.dev/docs/edge-gateway/resolvers) to interact with your Neon database at the edge.

## Prerequisites

- A Grafbase account
- A Neon project

## Create a backend with Grafbase

Inside a new directory or an existing project run the following command:

```bash
npx grafbase init
```

You will simulate a marketplace of products, where the price is dynamically calculated and retrieved based on data in an external database.

Open the file grafbase/schema.graphql and replace the contents with this schema:

```graphql
extend type Mutation {
  addProductVisit(productId: ID!): ID! @resolver(name: "add-product-visit")
}

type Product @model {
  name: String!
  price: Float @resolver(name: "product/price")
}
```

Navigate to the Neon Console and select your project. Run the following statement in the **SQL Editor**:

```sql
CREATE TABLE product_visits(id SERIAL PRIMARY KEY, product_id TEXT NOT NULL);
```

This statement creates a table in Neon where you will store product page views that will be used to dynamically calculate a product price.

## Create the resolvers

The schema includes a custom query `addProductVisit` and a field resolver `prodcut/price`. We have to create them, let's do that now.

Create the file grafbase/resolvers/add-product-visit.js and grafbase/resolvers/product/price.js and add the following:

```graphql
export default function Resolver(root, params) {
  // ...
}
```

## Install the Neon serverless driver

Inside the grafbase directory, run the following:

```bash
npm init -y
npm install @neondatabase/serverless
```

## Retrive your Neon connection string

We'll be forwarding queries to our newly created database in Neon, from the previously visited dashboard, copy the line inside the Connection string input in the Connection Details card.

The connection string should look something like this

```text
postgres://<user>:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb
```

Add your connection string to the file grafbase/.env in this format:

```text
DATABASE_URL=postgres://<user>:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb
```

## Add code to your resolvers

In both resolvers, we'll use the @neondatabase/serverless NPM dependency to connect to our Neon database.

Inside respolvers/product/add-product-visit we will insert a new record in the product_visits with the productId each time this resolver is queried.

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

On product/price we will calculate the product price based on the number of visits (interest) in the product.

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

You can learn more about Neon and Postgres by reading their documentation introduction.

## Test the resolvers

We're now ready to start playing with it!

Start the Grafbase CLI:

```bash
npx grafbase dev
```

Then go to http://localhost:4000 and execute the following GraphQL mutation, which will create a new product:

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

Grab the id, and then use it to execute the following mutation, which will add a row in our database table:

```graphql
mutation {
  addProductVisit(productId: "PREVIOUS_PRODUCT_ID")
}
```

Then try to query the same product, and check the price:

```graphql
query {
  product(input: { by: "PREVIOUS_PRODUCT_ID" }) {
    id
    name
    price
  }
}
```

That's it! You'll see how the price increase as you query more and more `addProductVisit`.
