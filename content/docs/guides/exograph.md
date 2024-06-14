---
title: Use Exograph with Neon
subtitle: Build GraphQL backends in minutes with Exograph and Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.390Z'
---

_This guide was contributed by the Exograph team_

[Exograph](https://exograph.dev) is a new approach to building GraphQL backends. With it, you can effortlessly create flexible, secure, high-performing GraphQL backends in minutes. Powered by a Rust-based runtime, Exograph ensures fast startup times, efficient execution, and minimal memory consumption. Exograph comes equipped with a comprehensive set of tools designed to support every stage of the development lifecycle: from initial development to deployment to ongoing maintenance.

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

1. Navigate to the Neon Console, select your project, and copy the connection string, which will look something like this: `postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname`.
2. Create schema in Neon using Exograph CLI:

```bash
exo schema create | psql <the connection string>
```

## Launch the backend

```bash
EXO_POSTGRES_URL=<the connection string> exo dev
```

It will print the necessary information for connecting to the backend.

```raw
Starting server in development mode...
Watching the src directory for changes...

Verifying new model...
Started server on 0.0.0.0:9876 in 717.19 ms
- Playground hosted at:
 http://0.0.0.0:9876/playground
- Endpoint hosted at:
 http://0.0.0.0:9876/graphql
```

That's it! You can now open [http://localhost:9876/playground](http://localhost:9876/playground) in your browser to see the GraphQL Playground.

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

In this guide, we have created a basic todo backend using Exograph and Neon. You can extend this further by establishing relationships between types, implementing access control rules, and integrating custom business logic. Check out Exograph's [application tutorial](https://exograph.dev/docs/application-tutorial/overview) for more details.

To deploy Exograph in the cloud and connect it to Neon, follow the guide below (select the "External Database" tab for Neon-specific instructions in each case):

1. Deploying on [Fly.io](https://exograph.dev/docs/deployment/flyio) (these instructions can be adapted to other cloud providers)
2. Deploying on [AWS Lambda](https://exograph.dev/docs/deployment/aws-lambda)
