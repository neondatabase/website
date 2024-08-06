---
title: Use StepZen with Neon
subtitle: Learn how to use StepZen to build a GraphQL API for your Neon database
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-06T15:23:10.950Z'
---

_This guide was contributed by Roy Derks from StepZen_

GraphQL has been around for years and is becoming increasingly popular among web developers. It is a query language for APIs and a runtime for fulfilling queries with your existing data. GraphQL allows clients to access data flexibly and efficiently. However, building a GraphQL API often requires writing a lot of code and familiarizing yourself with a new framework. This guide shows how you can generate a GraphQL API for your Neon database in minutes using [StepZen](https://stepzen.com/).

Why use Neon and StepZen together? Neon is serverless Postgres. Neon separates storage and compute to offer modern developer features such as scale-to-zero and database branching. With Neon, you can be up and running with a Postgres database in just a few clicks, and you can easily create and manage your database in the Neon Console and connect to it using [psql](/docs/connect/query-with-psql-editor) or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). What if you want to let clients consume your data through an API in a way that is both flexible and efficient? That's where StepZen comes in. StepZen is a GraphQL API platform that lets you build a GraphQL API for your Neon database in minutes. Just like Neon, it's serverless and offers a generous free plan.

## Set up Neon

Before generating a GraphQL API, you must set up a Neon database, which you can do it in a few steps:

1. Sign in to Neon, or [sign up](/docs/get-started-with-neon/signing-up) if you do not yet have an account.
2. Select a Neon project. If you do not have one, see [Create a project](/docs/manage/projects#create-a-project).
3. [Create a database](/docs/manage/databases#create-a-database) or use the ready-to-use `dbname` database.

You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**.

![Connection details widget](/docs/connect/connection_details.png)

Using the connection string, you can seed the database with the data from the `init.sql` file, which you can find [here](https://github.com/stepzen-dev/examples/blob/main/with-neon/init.sql).

Running the `init.sql` file creates the `address`, `customer`, `product`, and `order` tables and populates them with the data. It also creates tables that connect the `customer` table with the `address` table, and the `order` table with the `product` table.

You can seed the database directly from the terminal by running the following `psql` command:

```bash shouldWrap
psql postgres://[user]:[password]@[neon_hostname]/[dbname] < init.sql
```

The command takes a Neon connection string as the first argument and a file as the second argument.

In the terminal, you can see that the tables are created and populated with the data. You can also view the tables and data from the **Tables** page in the Neon Console.

![Neon database seeded with data](/docs/guides/stepzen_tables_view.png)

Next, you will connect StepZen to the Neon database and use it to generate a GraphQL schema for the database.

## Connect StepZen to Neon

To generate a GraphQL schema for the data in your Neon database, you need to connect StepZen to Neon. This can be done manually or by using the StepZen CLI.

The StepZen CLI can be installed with `npm` (or Yarn), and it must be installed globally:

```bash
npm install -g stepzen
```

After you install the CLI, create a StepZen account. You can do this by navigating to [https://stepzen.com/](https://stepzen.com) and clicking the **Start for Free** button.

To link your StepZen account to the CLI, log in using the following command:

```bash
stepzen login
```

<Admonition type="note">
You can also use StepZen without creating an account. The difference is that you will have a public account, which means that your schema will be public, and everyone with the link can query data from your database. For more information, refer to the [StepZen documentation](https://stepzen.com/docs/quick-start/install-and-setup).
</Admonition>

Next, create a local directory for your StepZen workspace and navigate to the directory. For example:

```bash
mkdir stpezen
cd stepzen
```

Specify your data source with the `stepzen import` CLI. Answer the setup questions as shown below.

```bash
stepzen import postgresql

? What would you like your endpoint to be called? api/with-neon
? What is your host? YOUR_NEON_HOST:5432 (e.g., `ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432`)
? What is your database name? YOUR_NEON_DATABASE (e.g., `dbname`)
? What is the username? YOUR_NEON_USERNAME (e.g., `alex`)
? What is the password? [hidden] YOUR_NEON_PASSWORD
? Automatically link types based on foreign key relationships using @materializer
 (https://stepzen.com/docs/features/linking-types) Yes
? What is your database schema (leave blank to use defaults)?

Starting... done
Successfully imported schema postgresql from StepZen
```

The CLI has now created a GraphQL schema based on the tables and data in your Neon database. You can find the schema in the `stepzen` folder at the root of your project. The schema is generated in the `postgresql/index.graphql` file.

<Admonition type="note">
The **Automatically link types based on foreign key relationships using @materializer** step is essential, as it automatically links the tables based on foreign key relationships, which allows you to query data from the `customer` table and get related data from the `address` table.
</Admonition>

The `config.yaml` file stores connection details for the Neon database. The StepZen CLI uses this file to connect to the Neon database. But you need to make two changes to the file:

```bash
configurationset:
  - configuration:
      name: postgresql_config
      uri: YOUR_NEON_DSN?user=YOUR_NEON_USERNAME&password=YOUR_NEON_PASSWORD&options=project=YOUR_NEON_PROJECT_ID&sslmode=require
```

As shown above, you need to append `&options=project=YOUR_NEON_PROJECT_ID` to the `uri` connection string. This is needed to establish a secure connection to the Neon database. The `project` option is the ID of the project in Neon. You can find the project ID in the Neon Console under **Project settings** or in the URL of your project.

The next section explores the GraphQL API to see how the connection between the Neon Postgres database and StepZen works.

## Explore the GraphQL API

The GraphQL schema that StepZen generates still needs to be deployed to the cloud before you are able to explore the GraphQL API. With StepZen, you have multiple options to deploy your schema. You can deploy it to the StepZen cloud or run it locally using Docker. This guide uses the StepZen cloud, which the fastest way to get started.

To deploy the schema to the StepZen cloud, run the following command:

```bash
stepzen start
```

After the schema is deployed, you can explore the GraphQL API in the [StepZen dashboard](https://dashboard.stepzen.com/explorer).

From the dashboard, you can view the GraphQL schema, try out queries and mutations, and generate code snippets for your favorite programming language.

The CLI also outputs the URL of your GraphQL API endpoint. You can use this endpoint to query your API from other tools or applications.

It's time to start querying the GraphQL API. Start by querying the `customer` table. You can do this by writing the following query on the left-hand side of the dashboard:

```graphql
{
  getCustomerList {
    name
    email
  }
}
```

The GraphQL API will retrieve the `name` and `email` fields from the `customer` table. The result looks like this:

```json
{
  "data": {
    "getCustomerList": [
      {
        "name": "Lucas Bill",
        "email": "lucas.bill@example.com"
      },
      {
        // ...
      }
    ]
  }
}
```

In GraphQL, the result has the same shape as the query (or other operation) you used to retrieve it. The GraphQL API will only retrieve the fields from the database that are present in the query. The query sent to the Neon database has the following shape:

```sql
SELECT name, email FROM public.customer
```

The following section dives deeper into the GraphQL API, showing how GraphQL API queries are translated to SQL.

## From GraphQL query to SQL

You have explored the GraphQL API, learning how to query data from the Neon database. But how does this work? How is a GraphQL query translated to an SQL query that runs on your Neon database?

In the previous example, StepZen only requests the fields in the query, improving the GraphQL API's performance. Requesting all fields from the database makes no sense if only a few are requested.

Below, you can see a snippet of the `getCustomerList` query in the `postgresql/index.graphql` file:

```graphql
type Query {
  getCustomerList: [Customer]
    @dbquery(
      type: "postgresql"
      schema: "public"
      table: "customer"
      configuration: "postgresql_config"
    )
}
```

The `getCustomerList` query defined in the GraphQL schema returns an array of the type `Customer`.

- The `@dbquery` directive identifies the query as a database query
- `type` defines the type of database
- `schema` defines the schema
- `table` defines the table in the database
- `configuration` defines the name of the connection configuration used to connect to the database

Earlier, the CLI created connections based on foreign key relationships. For example, the `order` table has a foreign key relationship with the `customer` table. This means that you can query data from the `order` table, and get the related data from the `customer` table. You can query the customer linked to an order like this:

```graphql
{
  getOrderList {
    id
    shippingcost
    customer {
      name
      email
    }
  }
}
```

In addition to the `id` and `shippingcost` fields, the `name` and `email` fields are requested from the `customer` table. So how does the query get the `customer` field?

The `getOrderList` query is defined in the GraphQL schema, and returns a list of the type `Order` with a field called `customerid`. This relationship is defined as a foreign key in the database and the GraphQL schema has a field called `customer`, which is linked to the `customerid` field.

```graphql
type Order {
  carrier: String
  createdat: Date!
  customer: Customer
    @materializer(query: "getCustomer", arguments: [{ name: "id", field: "customerid" }])
  customerid: Int!
  id: Int!
  lineitemList: [Lineitem] @materializer(query: "getLineitemUsingOrderid")
  shippingcost: Float
  trackingid: String
}
```

The `@materializer` directive links the `customer` field to the `customerid` field. The `query` argument is the name of the query that retrieves the data, which in this case is `getCustomer`. The `arguments` argument is an array of objects that define the arguments passed to the query. In this case, the `id` argument is passed to the `getCustomer` query, and the value of the `id` argument is the value of the `customerid` field.

When you retrieve a list of orders from the database, you can include the `customer` field for each order. StepZen then executes the `getCustomer` query with the `id` argument set to the value of the `customerid` field.

```graphql
type Query {
  getCustomer(id: Int!): Customer
    @dbquery(
      type: "postgresql"
      schema: "public"
      table: "customer"
      configuration: "postgresql_config"
    )
}
```

This GraphQL query is translated to the following SQL query, which is run on the Neon Postgres database.

```sql
SELECT name, email FROM public.customer WHERE id = $1
```

And together with the previous query, it is translated to the following SQL query for the Neon Postgres database:

```sql
SELECT id, shippingcost, customerid FROM public.order
SELECT name, email FROM public.customer WHERE id = $1
```

StepZen reuses SQL queries or merges queries when possible to retrieve data from the Neon database more efficiently. For example, if you request the `customer` field for multiple orders, StepZen only executes the `getCustomer` query once for every recurring value of `customerid`.

<Admonition type="note">
In addition to having StepZen generate the query that is sent to the Neon database, you can also define a raw query in the GraphQL schema. Defining a raw query is useful when you want to query data from multiple tables or when you want to use a more complex query. You can find an example in the `getOrderUsingCustomerid` query in the `postgresql/index.graphql` file.
</Admonition>

## Conclusion

In this guide, you have learned how to generate a GraphQL API from a Neon database. You have used StepZen, which offers GraphQL-as-a-Service and a CLI to generate GraphQL APIs from data sources such as databases and REST APIs. Using StepZen, you can quickly generate a GraphQL API from a Neon database and use it to query data from the database. You also looked at how StepZen translates queries to the GraphQL API into SQL queries that run on your Neon database.

You can find the complete code example [here](https://github.com/stepzen-dev/examples).
