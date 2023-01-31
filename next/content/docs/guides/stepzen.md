---
title: Use StepZen with Neon
enableTableOfContents: true
isDraft: false
---

_This guide was contributed by [Roy Derks](https://twitter.com/gethackteam?s=20&t=hq7VO7rPL2BOMo3A1ohkKg) from [StepZen](https://stepzen.com/)_

GraphQL has been around for years and is becoming increasingly popular among web developers. It is a query language for APIs and a runtime for fulfilling queries with your existing data. GraphQL allows clients to access data flexibly and efficiently. However, building a GraphQL API often requires writing a lot of code and familiarizing yourself with a new framework. This guide shows how you can generate a GraphQL API for your Neon database in minutes using [StepZen](https://stepzen.com/).

Why use Neon and StepZen together? Neon is serverless PostgreSQL. Neon separates storage and compute to offer modern developer features such as scale-to-zero and database branching. With Neon, you can be up and running with a PostgreSQL database in just a few clicks. You can easily create and manage your database through the Neon Console, and you can connect to Neon using [psql](/docs/connect/query-with-psql-editor) or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). What if you want to let clients consume your data through an API in a way that is both flexible and efficient? That's where StepZen comes in. StepZen is a GraphQL API platform that lets you build a GraphQL API for your Neon database in minutes. Just like Neon, it's serverless and offers a generous free tier.

## Set up Neon

Before generating a GraphQL API, you must set up a Neon database. Setting up a Neon database is easy, and you can do it in a few steps:

1. Sign in to Neon, or [sign up](/docs/get-started-with-neon/signing-up) if you do not yet have an account.
2. [Create a new project](/docs/get-started-with-neon/setting-up-a-project).
3. [Create a database](/docs/manage/databases#create-a-database) or use the default `neondb` database.

You can find the connection string for your database in the **Connection Details** widget in the Neon Console.

![Connection details widget](/docs/connect/stepzen_connection_details.png)

Using the connection string, you can seed the database with the data from the `init.sql` file, which you can find [here](https://github.com/stepzen-dev/examples/blob/main/with-neon/init.sql).

This will create the tables `address`, `customer`, `product`, and `order` and populate them with the data from the `init.sql` file. Also, it will create tables to connect the tables `customer` with the table `address` and the table `order` with the table `product`.

Using `psql` we can seed the database directly from the terminal by running the following command to populate the database:

```bash
psql postgres://sally:*************@ep-morning-field-723223.us-east-2.aws.neon.tech/neondb < init.sql
```

This command takes a connection string as the first argument and a file as the second argument.

In the terminal, you can see from the output that the tables are created and populated with the data from the `init.sql` file. Also, you can see that the tables and data are created by viewing the **Tables** page in the Neon Console.

![Neon database seeded with data](/docs/connect/stepzen_tables_view.png)

Next, you will connect StepZen to the Neon database and use it to generate a GraphQL schema for the database.

## Connect StepZen to Neon

To generate a GraphQL schema for the data in the Neon database, you need to connect StepZen to the Neon database. This can be done manually or by using the StepZen CLI.

The StepZen CLI can be installed with `npm` (or Yarn), and you need to install it globally:

```bash
npm install -g stepzen
```

After you install the CLI, create a StepZen account. You can do this by opening the website [https://stepzen.com/](https://stepzen.com) and clicking the **Start for Free** button in the top right corner.

To link your StepZen account to the CLI, log in using the following command:

```bash
stepzen login
```

<Admonition type="note">
You can also use StepZen without creating an account. The difference is that you will get a public account, which means that your schema will be public, and everyone with the link can query data from your database. You can find more information about this in the [StepZen documentation](https://stepzen.com/docs/quick-start/install-and-setup).
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
? What is your host? YOUR_NEON_HOST:5432 (e.g., `ep-morning-field-723223.us-east-2.aws.neon.tech:5432`)
? What is your database name? YOUR_NEON_DATABASE (e.g., `neondb`)
? What is the username? YOUR_NEON_USERNAME (e.g., `sally`)
? What is the password? [hidden] YOUR_NEON_PASSWORD
? Automatically link types based on foreign key relationships using @materializer
 (https://stepzen.com/docs/features/linking-types) Yes
? What is your database schema (leave blank to use defaults)?

Starting... done
Successfully imported schema postgresql from StepZen
```

The CLI has now created a GraphQL schema based on the tables and data in your Neon database. You can find the schema in the `stepzen` folder at the root of your project. The schema is generated in the `postgresql/index.graphql` file.

The **Automatically link types based on foreign key relationships using @materializer** step is essential, as it  automatically links the tables based on foreign key relationships. This means, for example, that you can query data from the `customer` table and get the related data from the `address` table.

Also, the connection details for the Neon database are stored in the `config.yaml` file. The StepZen CLI uses this file to connect to the Neon database. But we need to make two changes to the file:

```bash
configurationset:
  - configuration:
      name: postgresql_config
      uri: YOUR_NEON_DSN?user=YOUR_NEON_USERNAME&password=YOUR_NEON_PASSWORD&options=project=YOUR_NEON_PROJECT_ID&sslmode=require
```

Above, you need to append `&options=project=YOUR_NEON_PROJECT_ID` to the `uri` connection string. This is needed to establish a secure connection to the Neon database. The `project` option is the ID of the project in Neon. You can find this ID in the Neon dashboard under **Settings** or in the URL of your project.

The next section explores the GraphQL API to see how the connection between the Neon PostgreSQL database and StepZen works.

## Explore the GraphQL API

The GraphQL schema that StepZen generates still needs to be deployed to the cloud before your are able to explore the GraphQL API. With StepZen, you have multiple options to deploy your schema. You can deploy it to the StepZen cloud or run it locally using Docker. This guide uses the StepZen cloud, as this is the fastest way to get started.

To deploy the schema to the StepZen cloud, run the following command:

```bash
stepzen start
```

This command deploys the schema to the StepZen cloud and starts a local development server. The development server runs on `http://localhost:5001/with-neon` by default. You can also find the production endpoint in the terminal output and a cURL command to test the GraphQL API.

<Admonition type="note">
You can only use the endpoint to the development server to explore the GraphQL API when the `stepzen start` command is running. If you would like to query the GraphQL API from your application or a remote host, you need to use the production endpoint.
</Admonition>

You can explore the GraphQL API by opening the development server in the browser. You can find the development server at `http://localhost:5001/with-neon`.

From GraphiQL, you can find the GraphQL schema visualized in a section called "docs". You can also use GraphiQL to interact with the GraphQL API by writing queries and mutations in the left section and viewing the result in the right section.

It's time to start querying the GraphQL API. Start by querying the `customer` table. You can do this by writing the following query in the left section:

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

In GraphQL, the result has the same shape as the query (or other operation) you used to retrieve this result. The GraphQL API will retrieve only the fields present in the query from the database. The query it sends to the Neon database has the following shape:

```sql
SELECT name, email FROM public.customer
```

The following section dives deeper into the GraphQL API, showing how GraphQL API queries are translated to SQL queries for your Neon database.

## From GraphQL query to SQL query

You have explored the GraphQL API and seen how you can query data from the Neon database. But how does this work? How does a GraphQL query translate to an SQL query that executes against your Neon database?

In the previous example, StepZen only requests the fields in the query, improving the GraphQL API's performance. Requesting all fields from the database makes no sense if only a few fields are requested.

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

Here, the `getCustomerList` query defined in the GraphQL schema returns an array of the type `Customer`. The `@dbquery` directive is used to define that this query is a database query. The `type` argument is the type of database that is used, and in this case it's PostgreSQL. The `schema` argument is the schema in the database, and in this case, it's `public`. The `table` argument is the table in the database, and in this case, it's `customer`. And the `configuration` argument is the name of the connection configuration that is used to connect to the database, and in this case it's `postgresql_config`.

Earlier, we saw that the CLI created connections based on foreign key relationships. For example, the `order` table has a foreign key relationship with the `customer` table. This means that we can query data from the `order` table, and get the related data from the `customer` table. We can query the customer linked to an order like this:

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

Next to the `id` and `shippingcost` fields, we also request the `name` and `email` fields from the `customer` table. So how does it get the `customer` field?

The `getOrderList` query is defined in the GraphQL schema, and returns a list of the type `Order` with a field called `customerid`. This relationship is defined as a foreign key in the database and the GraphQL schema has a field called `customer` which is linked to the `customerid` field.

```graphql
type Order {
  carrier: String
  createdat: Date!
  customer: Customer
    @materializer(
      query: "getCustomer"
      arguments: [{ name: "id", field: "customerid" }]
    )
  customerid: Int!
  id: Int!
  lineitemList: [Lineitem] @materializer(query: "getLineitemUsingOrderid")
  shippingcost: Float
  trackingid: String
}
```

The `@materializer` directive links the `customer` field to the `customerid` field. The `query` argument is the name of the query that is used to retrieve the data, in this case it's `getCustomer`. The `arguments` argument is an array of objects that define the arguments that are passed to the query. In this case the `id` argument is passed to the `getCustomer` query, and the value of the `id` argument is the value of the `customerid` field.

When you retrieve a list of orders from the database, you can include the `customer` field for each order. StepZen will then execute the `getCustomer` query with the `id` argument set to the value of the `customerid` field.

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

This GraphQL query will translate to the following query to the Neon PostgreSQL database:

```sql
SELECT name, email FROM public.customer WHERE id = $1
```

And together with the previous query, it will translate to the following query to the Neon PostgreSQL database:

```sql
SELECT id, shippingcost, customerid FROM public.order
SELECT name, email FROM public.customer WHERE id = $1
```

StepZen will reuse SQL queries or merge queries when possible to get the data out of the Neon database more efficiently. For example, if you request the `customer` field for multiple orders, StepZen will only execute the `getCustomer` query once for every recurring value of `customerid`.

<Admonition type="note">
In addition to letting StepZen generate the query that should be sent to the Neon database, you can also define a raw query in the GraphQL schema. This is useful when you want to explicitly query data from multiple tables or when you want to use a more complex query. You can find an example in the `getOrderUsingCustomerid` query in the `postgresql/index.graphql` file.
</Admonition>

In this guide, we've explored the GraphQL API and seen how you can query data from the Neon database. Besides databases, you can also use StepZen to combine data from your Neon database with REST API or other GraphQL APIs, for example, when you want to connect with an authentication service.

## Conclusion

You have learned how to generate a GraphQL API from a Neon database. For this, you have used StepZen, which offers GraphQL-as-a-Service and a CLI to generate GraphQL APIs from data sources such as databases and REST APIs. You've seen how to create a Neon database and populate it with data. Using StepZen, you can quickly generate a GraphQL API from a Neon database and use it to query data from the database. Also, you looked at how StepZen translates queries to the GraphQL API into SQL queries to the Neon database.

You can find the complete code example [here](https://github.com/stepzen-dev/examples).
