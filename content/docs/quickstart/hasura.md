---
title: Run a Hasura App
---

### Introduction

Hasura is a cloud-based GraphQL provider for existing databases. This guide will cover zero-coding integration between Neon cloud service and Hasura Cloud. By the end of this guide, you will have a working HTTP API endpoint that uses GraphQL to query Neon's serverless database and responds with a set of rows.

## Step 1 — Set up a Neon Project

In this step, you will create or select an existing Neon Project to be used as a data source for Hasura.

First, go to the [Neon console](https://console.neon.tech/app/projects).

Next, create a new Project or use any existing one.

Then, open the Project page, and click the **Generate token** button.

Finally, copy DATABASE_URL. We will need it later.

## Step 2 — Add Project as a Data Source in the Hasura Cloud Project

In this section, you will head to Hasura Cloud, paste your DATABASE_URL, and connect your project to Hasura.

Head over to the [Hasura Cloud projects list](https://cloud.hasura.io/projects).

Then, create a new project or launch a console for the existing one.

Now, go to the DATA section. In the 'Connect Existing Database' tab, paste DATABASE_URL into the corresponding form field. Give your database an appropriate name, and click connect.

That is mostly it! Hasura Cloud will connect and automatically discover the public schema.

Neon will spin up a new compute node for your database when any new connection arrives and suspend it when it is idle.

## Step 3 — Create a Table using the Hasura Console

Once your database is connected to Hasura, you can then create a table and perform queries.

Now, you can create the first table using the Hasura Console web interface. Let it be table 't' with a single column 'text' of a type 'Text'. Once created, you can put some rows into it and finally navigate to the API section for endpoint creation.

In the GraphQL tab, we can query our table with GraphQL, for example:

```graphql
query MyQuery {
  t {
    text
  }
}
```

Then, save this GraphQL query as an HTTP API endpoint by clicking the REST tab. Let us call the endpoint 'query_t'.

Finally, you can use this endpoint to get the table content now.

Your output on the screen should be similar to the example below:

```bash
$ curl -H 'x-hasura-admin-secret: {admin_secret}' https://{your_project_name}.hasura.app/api/rest/query_t
{"t":[{"text":"test"}]}
```

Thanks for your time, and keep hacking!

## Conclusion

In this tutorial, you performed an integration between Neon cloud service and Hasura Cloud. Now you can use an HTTP API endpoint that uses GraphQL to query Neon's serverless database and returns a set of rows.
