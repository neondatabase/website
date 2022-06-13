---
title: Run a Hasura App
---

### Introduction

Hasura is a cloud-based GraphQL provider for existing databases. This guide will cover zero-coding integration between Neon cloud service and Hasura Cloud. By the end of this guide, you will have a working HTTP API endpoint that uses GraphQL to query Neon's serverless database and responds with a set of rows.

## Step 1 — Set up a Neon Project

In this step, you will create or select an existing Neon Project to be used as a data source for Hasura.

First, go to the [Neon console](https://console.neon.tech).

Next, you will obtain the connection details. Keep your connection details as we will need them later.

Then, open the Project page, and copy the connection string (`DATABASE_URL`) if you created a new Project.

Note: The following method bellow will disconnect all existing clients

Otherwise, if you are using a previously created Project, there are two options: either create a new user or reset password of an existing user to get the complete connection string.

Keep these connection details, we will need them later.

## Step 2 — Add Project as a Data Source in the Hasura Cloud Project

In this section, you will head to Hasura Cloud, paste your DATABASE_URL, and connect your project to Hasura.

Head over to the [Hasura Cloud projects list](https://cloud.hasura.io/projects).

Then, create a new Hasura project or launch a console for the existing one.

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
