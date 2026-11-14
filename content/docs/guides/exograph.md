---
title: Use Exograph with Neon
subtitle: Build GraphQL backends in minutes with Exograph and Neon
summary: >-
  Exograph is a Rust-based GraphQL backend framework that uses Postgres for data
  persistence, making it a natural fit for Neon. This guide walks through
  scaffolding an Exograph project with `exo new`, applying the schema to a Neon
  database using `exo schema create | psql`, and starting a local dev server
  with `exo dev` that exposes a GraphQL endpoint and playground.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-06-05T17:20:32.620Z'
---

_This guide was contributed by the Exograph team_

[Exograph](https://exograph.dev) is a framework for building GraphQL backends. You define your data model in an `.exo` file, and Exograph serves a GraphQL API for it. Its runtime is written in Rust. The CLI covers development, deployment, and schema management.

Exograph supports Postgres for data persistence, which makes it a great fit to use with Neon.

## Prerequisites

- Exograph CLI. See [Install Exograph](https://exograph.dev/docs/getting-started).
- A Neon project. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Create a backend with Exograph

Let's create a starter project with Exograph. Run the following commands:

```bash
exo new todo
cd todo
```

You can check the code it created by examining the `src/index.exo` file (which has a definition for the `Todo` type). If you would like, you can try the [yolo](https://exograph.dev/docs/cli-reference/development/yolo) mode by trying the `exo yolo` command.

Next, let's set up the Neon database.

## Create the schema in Neon

1. Navigate to the Neon Console, select your project, and copy the connection string, which will look something like this: `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require`.
2. Create schema in Neon using Exograph CLI:

```bash
exo schema create | psql <the connection string>
```

## Launch the backend

```bash
EXO_POSTGRES_URL=<the connection string> exo dev --read-write
```

The `--read-write` flag lets the server run mutations, such as the `createTodo` mutation below. Without it, `exo dev` starts in read-only mode, and mutations fail.

The command prints the information for connecting to the backend.

```raw
Starting server in development mode...
Watching the current directory for changes...

Verifying new model...
Starting server...
Started server on localhost:9876 in 995.77 ms
- GraphQL endpoint hosted at:
	http://localhost:9876/graphql
- MCP endpoint hosted at:
	http://localhost:9876/mcp
- Playground hosted at:
	http://localhost:9876/playground
```

Open [http://localhost:9876/playground](http://localhost:9876/playground) in your browser to see the GraphQL Playground.

You can create a todo by running the following mutation:

```graphql
mutation {
  createTodo(data: { title: "Set up Exograph with Neon", completed: true }) {
    id
  }
}
```

To get all todos, try the following query:

```graphql
query {
  todos {
    id
    title
    completed
  }
}
```

And you should see the todo you just added. Please follow Exograph's [guide to creating a simple application](https://exograph.dev/docs/getting-started#creating-a-simple-application) for more details.

## Learn more

In this guide, we have created a basic todo backend using Exograph and Neon. You can extend this further by establishing relationships between types, implementing access control rules, and integrating custom business logic. Check out Exograph's [application tutorial](https://exograph.dev/docs/application-tutorial) for more details.

To deploy Exograph in the cloud and connect it to Neon, follow the guide below (select the "External Database" tab for Neon-specific instructions in each case):

1. Deploying on [Fly.io](https://exograph.dev/docs/deployment/flyio) (these instructions can be adapted to other cloud providers)
2. Deploying on [AWS Lambda](https://exograph.dev/docs/deployment/aws-lambda)
