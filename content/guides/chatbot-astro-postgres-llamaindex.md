---
title: Build a RAG chatbot with Astro, Postgres, and LlamaIndex
subtitle: A step-by-step guide for building a RAG chatbot in an Astro application with LlamaIndex and Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-06-11T00:00:00.000Z'
updatedOn: '2024-06-11T00:00:00.000Z'
---

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- An [OpenAI](https://platform.openai.com/api-keys) account
- An [AWS](https://aws.amazon.com/free) account

## Steps

- [Generate the OpenAI API token](#generate-the-openai-api-token)
- [Provisioning a Serverless Postgres](#provisioning-a-serverless-postgres)
- [Create a new Astro application](#create-a-new-astro-application)
  - [Add Tailwind CSS to the application](#add-tailwind-css-to-the-application)
  - [Integrate React in your Astro project](#integrate-react-in-your-astro-project)
  - [Enabling Server Side Rendering in Astro using Node.js Adapter](#enabling-server-side-rendering-in-astro-using-nodejs-adapter)
- [Setting up a Postgres database connection](#setting-up-a-postgres-database-connection)
- [Define the Astro application routes](#define-the-astro-application-routes)
  - [Build Conversation User Interface using Vercel AI SDK](#build-conversation-user-interface-using-vercel-ai-sdk)
  - [Build UI to update Chabot’s Knowledge](#build-ui-to-update-chabots-knowledge)
  - [Build an entrypoint React component](#build-an-entrypoint-react-component)
  - [Initialize Postgres Vector Store in LlamaIndex](#initialize-postgres-vector-store-in-llamaindex)
  - [Build the Chat API Endpoint](#build-the-chat-api-endpoint)
  - [Build the Learn API Endpoint](#build-the-learn-api-endpoint)
- [Dockerize your Astro application](#dockerize-your-astro-application)
- [Deploy your Astro application to Amazon ECS](#deploy-your-astro-application-to-amazon-ecs)
  - [Create Amazon ECR private repository](#create-amazon-ecr-private-repository)
  - [Configure your IAM Roles](#configure-your-iam-roles)
  - [Create an Amazon ECS Task Definition](#create-an-amazon-ecs-task-definition)
  - [Create an Amazon ECS Cluster](#create-an-amazon-ecs-cluster)
  - [Create an Amazon ECS Service](#create-an-amazon-ecs-service)
  - [Create Access Keys for IAM users](#create-access-keys-for-iam-users)
- [Configure GitHub Actions for Continuous Deployment (CD) Workflow](#configure-github-actions-for-continuous-deployment-cd-workflow)

## Generate the OpenAI API token

To create vector embeddings, you will use OpenAI API with LlamaIndex. To set up OpenAI, do the following:

- Log in to your [OpenAI](https://platform.openai.com/) account.
- Navigate to the [API Keys](https://platform.openai.com/api-keys) page.
- Enter a name for your token and click the **Create new secret key** button to generate a new key.
- Copy and securely store this token for later use as the **OPENAI_API_KEY** environment variable.

## Provisioning a Serverless Postgres

Using a serverless Postgres database lets you scale compute resources down to zero, which helps you save on compute costs.

To get started, go to the [Neon Console](https://console.neon.tech/app/projects) and create a project.

You will then be presented with a dialog that provides a connection string of your database. You can enable the **Connection pooling** toggle for a pooled connection string.

![](/guides/images/chatbot-astro-postgres-llamaindex/c200c4ed-f62d-469c-9690-c572c482c536.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host with `neon.tech` as the [top-level domain (TLD)](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. `neondb` is the default database created with a Neon project if you do not define your own database.
- `?sslmode=require` an optional query parameter that enforces [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode for better security when connecting to the Postgres instance.

Save the connection string somewhere safe. It will be used to set the **POSTGRES_URL** variable later.

## Create a new Astro application

Let’s get started by creating a new Astro project. Open your terminal and run the following command:

```bash
npm create astro@latest my-app
```

`npm create astro` is the recommended way to scaffold an Astro project quickly.

When prompted, choose:

- `Empty` when asked how to start the new project.
- `Yes` when asked if you plan to write Typescript.
- `Strict` when asked how strict Typescript should be.
- `Yes` when prompted to install dependencies.
- `Yes` when prompted to initialize a git repository.

Once that’s done, change the project directory and start the app:

```bash
cd my-app
npm run dev
```

The app should be running on [localhost:4321](http://localhost:4321/). Let's close the development server for now.

Next, execute the command in your terminal window below to install the necessary libraries and packages for building the application:

```bash
npm install dotenv ai llamaindex@0.3.4
```

The command installs the following packages:

- `dotenv`: A library for handling environment variables.
- `ai`: A library to build AI-powered streaming text and chat UIs.
- `llamaindex`: A data framework for creating LLM applications.

Next, make the following additions in your `astro.config.mjs` file to populate the environment variables and make them accessible via `process.env` object:

```tsx
// File: astro.config.mjs

import 'dotenv/config'; // [!code ++]
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

Then, add the following code to your `tsconfig.json` file to make relative imports within the project easier:

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    // [!code ++]
    "baseUrl": ".", // [!code ++]
    "paths": {
      // [!code ++]
      "@/*": ["src/*"] // [!code ++]
    } // [!code ++]
  } // [!code ++]
}
```

Let's move on to integrating Tailwind CSS into the Astro application.

### Add Tailwind CSS to the application

For styling the app, you will be using Tailwind CSS. Install and set up Tailwind at the root of our project's directory by running:

```bash
npx astro add tailwind
```

When prompted, choose:

- `Yes` when prompted to install the Tailwind dependencies.
- `Yes` when prompted to generate a minimal `tailwind.config.mjs` file.
- `Yes` when prompted to make changes to Astro configuration file.

After making the selections outlined above, the command finishes integrating TailwindCSS into your Astro project and installs the following dependencies:

- `tailwindcss`: TailwindCSS as a package to scan your project files and generate corresponding styles.
- `@astrojs/tailwind`: An adapter that brings Tailwind's utility CSS classes to every `.astro` file and framework component in your project.

Let's move on to integrating React into the Astro application.

### Integrate React in your Astro project

To prototype the reactive user interface quickly, you will use React as the library with Astro. In your terminal window, execute the following command:

```bash
npx astro add react
```

`npx` allows us to execute npm package binaries without having to install `npm` globally.

When prompted, choose the following:

- `Yes` to install the React dependencies.
- `Yes` to make changes to Astro configuration file.
- `Yes` to make changes to `tsconfig.json` file.

Let's move on to enabling server-side rendering in the Astro application.

### Enabling Server Side Rendering in Astro using Node.js Adapter

To interact with the chatbot over a server-side API, you will enable server-side rendering in your Astro application. Execute the following command in your terminal:

```bash
npx astro add node
```

When prompted, choose:

- `Yes` to install the Node.js dependencies.
- `Yes` to make changes to Astro configuration file.

After making the selections outlined above, the command finishes integrating the Node.js adapter into your Astro project and installs the following dependency:

- `@astrojs/node`: The adapter that allows your Astro SSR site to deploy to Node targets.

Let's move on to loading the Postgres URL through an environment variable in the Astro application.

## Setting up a Postgres database connection

Create an `.env` file in the root directory of your project with the following environment variable to initiate the setup of a database connection:

```bash
# Neon Postgres Pooled Connection URL

POSTGRES_URL="postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require"
```

The file, `.env`, should be kept secret and not included in your Git history. Ensure that `.env` is added to the `.gitignore` file in your project.

## Define the Astro application routes

The structure below is what our `src/pages` directory will look like at the end of this section:

```bash
├── index.astro
├── api/
└───── chat.ts
└───── learn.ts
```

- `index.astro` will serve responses with dynamically created HTML to incoming requests at the index route.
- `api/chat.ts` will serve responses as an API Endpoint to incoming requests at `/api/chat`.
- `api/learn.ts` will serve responses as an API Endpoint to incoming requests at `/api/learn`.

### Build Conversation User Interface using Vercel AI SDK

Inside the `src` directory, create a `Chat.jsx` file with the following code:

```tsx
// File: src/Chat.jsx

import { useChat } from 'ai/react';

export default function () {
  const { messages, handleSubmit, input, handleInputChange } = useChat();
  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[300px] flex-col">
      <span className="text-2xl font-semibold">Chat</span>
      <input
        id="input"
        name="prompt"
        value={input}
        onChange={handleInputChange}
        placeholder="What's your next question?"
        className="mt-3 rounded border px-2 py-1 outline-none focus:border-black"
      />
      <button
        type="submit"
        className="mt-3 max-w-max rounded border px-5 py-1 outline-none hover:bg-black hover:text-white"
      >
        Ask &rarr;
      </button>
      {messages.map((message, i) => (
        <div className="mt-3 border-t pt-3" key={i}>
          {message.content}
        </div>
      ))}
    </form>
  );
}
```

The code above does the following:

- Imports the `useChat` hook by `ai` SDK to manage the conversation between the user and the chatbot. It simplifies the management of the conversation between the user and the chatbot. By default, it posts to the `/api/chat` endpoint to obtain responses from the chatbot.
- Exports a React component that returns a form containing an `<input>` element to allow users to enter their query.
- Creates a conversation UI looping over the set of messages (managed by the AI SDK).

Now, let’s create a component that will allow the user to add text to the chatbot's knowledge.

### Build UI to update Chabot’s Knowledge

Inside the `src` directory, create a `Learn.jsx` file with the following code:

```jsx
// File: src/Learn.jsx

import { useState } from 'react';

export default function () {
  const [message, setMessage] = useState();
  return (
    <form
      className="flex w-full max-w-[300px] flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (message) {
          fetch('/api/learn', {
            method: 'POST',
            body: JSON.stringify({ message }),
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }}
    >
      <span className="text-2xl font-semibold">Learn</span>
      <textarea
        value={message}
        placeholder="A text to learn."
        onChange={(e) => setMessage(e.target.value)}
        className="mt-3 min-h-[100px] rounded border px-2 py-1 outline-none focus:border-black"
      />
      <button
        type="submit"
        className="mt-3 max-w-max rounded border px-5 py-1 outline-none hover:bg-black hover:text-white"
      >
        Learn &rarr;
      </button>
    </form>
  );
}
```

The code above does the following:

- Imports `useState` hook by React.
- Exports a React component that returns a form containing a `<textarea>` element to accept a string.
- Upon form submission, it posts the message string input by the user as JSON to the `/api/learn` endpoint.

### Build an entrypoint React component

Inside the `src` directory, create a `App.jsx` file with the following code:

```tsx
// File: src/App.jsx

import Chat from './Chat';
import Learn from './Learn';

export default function () {
  return (
    <>
      <Chat />
      <Learn />
    </>
  );
}
```

The code above imports and renders both the Chat and the Learn component created earlier. Finally, update the `index.astro` file to import the `App` component:

```astro
---
// File: src/pages/index.astro // [!code ++]

import App from "../App"; // [!code ++]
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body
   class="flex w-screen flex-col md:flex-row items-center md:items-start md:justify-center md:gap-x-3 md:mt-12" // [!code ++]
  >
    <h1>Astro</h1> // [!code --]
    <App client:load /> // [!code ++]
  </body>
</html>
```

The changes above import the App component. Additionally, using Astro's [`client:load` directive](https://docs.astro.build/en/reference/directives-reference/#clientload) the code makes sure that the React application is hydrated immediately on the page.

Let's move on to using Postgres as the vector store for your chatbot.

### Initialize Postgres Vector Store in LlamaIndex

To query and add documents to the Postgres vector store, you are going to use `PGVectorStore` class to communicate. Inside the `src` directory, create `vectorStore.ts` with the following code:

```tsx
// File: src/vectorStore.ts

import 'dotenv/config';
import { PGVectorStore } from 'llamaindex';

export default new PGVectorStore({
  connectionString: process.env.POSTGRES_URL,
});
```

The code above begins with importing the `dotenv/config`, loading all the environment variables into the scope. Additionally, it exports an instance of `PGVectorStore` initialized using the Postgres pooled connection URL obtained earlier.

Let's move on to building the chat API endpoint.

### Build the Chat API Endpoint

The Vercel AI SDK uses `/api/chat` by default to obtain the chatbot responses. Create a file `src/pages/api/chat.ts` with the following code:

```tsx
// File: src/pages/api/chat.ts

import type { APIContext } from 'astro';

import vectorStore from '@/vectorStore';
import { VectorStoreIndex } from 'llamaindex';

export async function POST({ request }: APIContext) {
  const { messages = [] } = await request.json();
  const userMessages = messages.filter((i: { role: string }) => i.role === 'user');
  const encoder = new TextEncoder();
  const index = await VectorStoreIndex.fromVectorStore(vectorStore);
  const queryEngine = index.asQueryEngine();
  const query = userMessages[userMessages.length - 1].content;
  const stream = await queryEngine.query({ query, stream: true });
  const customReadable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.response));
      }
      controller.close();
    },
  });
  return new Response(customReadable, {
    headers: {
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream; charset=utf-8',
    },
  });
}
```

The code above does the following:

- Imports the vector store instance that is using Postgres.
- Imports the VectorStoreIndex helper by llamaindex.
- Exports a POST HTTP Handler which responds to incoming POST requests on `/api/chat`.
- Destructs messages array from the request body.
- Creates the LlamaIndex's query engine using Postgres as the vector store.
- Creates a stream handler that streams the response from LlamaIndex's query engine.
- Returns the stream handler as a standard Web Response.

Let's move on to building the endpoint to update chatbot's knowledge.

### Build the Learn API Endpoint

As you saw earlier, with LlamaIndex you do not need to manually create context and pass it to an external API. The vector store is searched for similar vector embeddings based on the user query, internally. To keep the knowledge of the chatbot up-to-date, create a file `src/pages/api/learn.ts` with the following code:

```tsx
// File: src/pages/api/learn.ts

import type { APIContext } from 'astro';

import {
  Document,
  Settings,
  OpenAIEmbedding,
  VectorStoreIndex,
  storageContextFromDefaults,
} from 'llamaindex';
import vectorStore from '@/vectorStore';

export async function POST({ request }: APIContext) {
  Settings.embedModel = new OpenAIEmbedding();
  const { text } = await request.json();
  if (!text) return new Response(null, { status: 400 });
  const storageContext = await storageContextFromDefaults({ vectorStore });
  const document = new Document({ text });
  await VectorStoreIndex.fromDocuments([document], { storageContext });
}
```

The code above does the following:

- Imports the vector store instance that is using Postgres.
- Imports the VectorStoreIndex and storageContextFromDefaults helpers by llamaindex.
- Exports a POST HTTP Handler which responds to incoming POST requests on `/api/learn`.
- Destructs the text message from the request body.
- Creates a LlamaIndex document with text as its sole data.
- Pushes the vector embeddings generated for the text along with the document metadata to the Postgres database.

Let's move on to dockerizing the Astro application.

## Dockerize your Astro application

To dockerize your Astro application, you are going to create two files at the root of your Astro project:

- `.dockerignore`: The set of files that would not be included in your Docker image.
- `Dockerfile`: The set of instructions that would be executed while your Docker image builds.

Create the `.dockerignore` file at the root of your Astro project with the following code:

```
# build output
dist/

# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# macOS-specific files
.DS_Store
```

Create the `Dockerfile` file at the root of your Astro project with the following code:

```bash
ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-slim as base

WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm install

# Copy application code
COPY --link . .

# Build application
RUN npm run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV PORT=80
ENV HOST=0.0.0.0

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "node", "./dist/server/entry.mjs" ]
```

The Dockerfile above defines the following set of actions:

- Sets up Node.js 20.11.0.
- Sets the environment to `production` with `NODE_ENV` environment variable.
- Instasll the dependencies of your Astro project.
- Builds the application with `astro build`.
- Sets the `PORT` environment variable to `80` (default port on Amazon ECS).
- Sets the `HOST` environment variable to `0.0.0.0` to listen to all incoming requests on the host.
- Runs the production server with `node ./dist/server/entry.mjs` command.

Now, let's create a file that creates Amazon ECS Task definition during the deployment via GitHub Actions. This is useful as it protects the secrets stored in the GitHub repo. Create an `env.mjs` file at the root of your Astro application with the following code:

```tsx
// File: env.mjs

import 'dotenv/config';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

if (!process.env.AWS_ACCOUNT_ID || !process.env.POSTGRES_URL || !process.env.OPENAI_API_KEY) {
  console.error(`AWS_ACCOUNT_ID, POSTGRES_URL or OPENAI_API_KEY environment variable not found.`);
  process.exit();
}

writeFileSync(
  join(process.cwd(), 'task-definition.json'),
  JSON.stringify({
    containerDefinitions: [
      {
        cpu: 256,
        memory: 512,
        portMappings: [
          {
            containerPort: 80,
            hostPort: 80,
            protocol: 'tcp',
          },
        ],
        essential: true,
        name: 'astro-app',
        image: `${process.env.AWS_ACCOUNT_ID}.dkr.ecr.ap-south-1.amazonaws.com/${process.env.AWS_ECR_REPOSITORY_NAME}`,
        environment: [
          {
            name: 'POSTGRES_URL',
            value: process.env.POSTGRES_URL,
          },
          {
            name: 'OPENAI_API_KEY',
            value: process.env.OPENAI_API_KEY,
          },
        ],
      },
    ],
    cpu: '1024',
    memory: '3072',
    family: 'astro-task-definitions',
    networkMode: 'awsvpc',
    taskRoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/ecsTaskRole`,
    executionRoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole`,
  }),
  'utf8'
);
```

The code above does the following:

- Imports `dotenv/config` to load all the environment variables into the scope and make them accessible via the `process.env` object.
- Validates the presense of `AWS_ACCOUNT_ID`, `POSTGRES_URL`, and `OPENAI_API_KEY` environment variables.
- Writes a `task-definition.json` file at the root of your Astro application following the format used earlier, and adds the `OPENAI_API_KEY` and `POSTGRES_URL` environment variables.

## Deploy your Astro application to Amazon ECS

In this section, you will learn how to create an Amazon ECR repository for your Docker-based deployments, spin up Amazon ECS Cluster and an ECS service, create AWS ECS Task Definition(s) and grant ECS Full Access to your AWS IAM user.

### Create Amazon ECR private repository

- Open the [Amazon ECR console](https://console.aws.amazon.com/ecr/repositories), and click **Get started**.

![](/guides/images/chatbot-astro-postgres-llamaindex/bf86c622-e7b2-4d43-80d0-140757512e7d.png)

- Enter a repository name, say `astro-repo`, for example. Scroll down and choose **Create repository**.

![](/guides/images/chatbot-astro-postgres-llamaindex/9c566960-540a-448e-880e-97ec16ba4f0f.png)

You are now done setting up an Amazon ECR repository. Let’s move on to configuring IAM roles for your account.

### Configure your IAM Roles

- Open the [IAM console](https://console.aws.amazon.com/iam/), and click **Create role**.

![](/guides/images/chatbot-astro-postgres-llamaindex/7fdeea5f-f2f6-4115-9f55-0b904b510944.png)

- Select **AWS Service** and choose **Elastic Container Service** as the Service or use case.

![](/guides/images/chatbot-astro-postgres-llamaindex/fd0ce7ed-21f7-492c-ac01-9c4cff96d590.png)

- Filter the large set of permissions policies, select **AmazonECS_FullAccess** only, and click **Next**.

![](/guides/images/chatbot-astro-postgres-llamaindex/202bcbe5-5614-404a-ac45-562ef580ede6.png)

- Enter `ecsTaskRole` as the **Role name**.

![](/guides/images/chatbot-astro-postgres-llamaindex/6f33848c-8d6a-42eb-922a-2a4916a430c3.png)

- Go back to the IAM Console, and click **Create role**.

![](/guides/images/chatbot-astro-postgres-llamaindex/25510e84-f354-47fc-8bdd-0380e0480477.png)

- Select **AWS Service** and choose **Elastic Container Service Task** as the Service or use case.

![](/guides/images/chatbot-astro-postgres-llamaindex/325c52ce-dbc4-4906-97e0-5f29ba510560.png)

- Filter the large set of permissions policies, select **AmazonECSTaskExecutionRolePolicy** only, and click **Next**.

![](/guides/images/chatbot-astro-postgres-llamaindex/6fbb4748-9380-4264-9d81-d36f2d6f83aa.png)

- Enter `ecsTaskExecutionRole` as the **Role name**.

![](/guides/images/chatbot-astro-postgres-llamaindex/c6f45124-7441-4562-81d4-d45e93f9a567.png)

You are now done setting up IAM Roles for your account. Let’s move on to creating an Amazon ECS task definition.

### Create an Amazon ECS Task Definition

- Open the [Amazon ECS Console](https://console.aws.amazon.com/ecs/v2) and choose **Task Definitions**. Further, select **Create new task definition with JSON**.

![](/guides/images/chatbot-astro-postgres-llamaindex/afdc546d-2214-45b0-916d-bd0868fbe2dc.png)

- Copy the following JSON in the field, and click **Create**.

```json
{
  "containerDefinitions": [
    {
      "cpu": 256,
      "memory": 512,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "name": "astro-app",
      "image": "2*.dkr.ecr.ap-south-1.amazonaws.com/astro-repo"
    }
  ],
  "cpu": "1024",
  "memory": "3072",
  "family": "astro-task-definitions",
  "networkMode": "awsvpc",
  "taskRoleArn": "arn:aws:iam::2*:role/ecsTaskRole",
  "executionRoleArn": "arn:aws:iam::2*:role/ecsTaskExecutionRole"
}
```

![](/guides/images/chatbot-astro-postgres-llamaindex/b812ef9a-df98-4d46-aa0a-71711a967eeb.png)

You are now done setting up an Amazon ECS task definition for your service. Let's move on to creating an Amazon ECS Cluster.

### Create an Amazon ECS Cluster

- Open [Amazon ECS Console](https://console.aws.amazon.com/ecs/v2) and click **Create cluster**.

![](/guides/images/chatbot-astro-postgres-llamaindex/fe2342b6-fd6e-4f6f-8e0d-39aff8a87060.png)

- Enter a name for your cluster, say `astro-cluster`, and choose **Create**.

![](/guides/images/chatbot-astro-postgres-llamaindex/cb8e6d74-5745-4c2a-88c7-2598ac85e286.png)

You are now done setting up an Amazon ECS Cluster for your service.

![](/guides/images/chatbot-astro-postgres-llamaindex/9a88a385-3ff9-496c-8ec0-7389fc4c69b0.png)

Let's move on to creating an Amazon ECS Service.

### Create an Amazon ECS Service

- Click on the Cluster created in the section earlier, and click on **Create** in the Services section.

![](/guides/images/chatbot-astro-postgres-llamaindex/9a88a385-3ff9-496c-8ec0-7389fc4c69b0.png)

- Enter a name for your service, say `astro-service`, and expand the **Networking** section.

![](/guides/images/chatbot-astro-postgres-llamaindex/eccf2a66-c1e8-43e4-95dc-4e8550488a8d.png)

- Select the **VPC** created earlier (or the default one). Select **Create a new security group** option and enter the following details for it:
  - Security group name: `astro-sg`
  - Security group description: `astro sg`
  - Inbound rules for security groups:
    - Type: `HTTP`
    - Source: `Anywhere`

![](/guides/images/chatbot-astro-postgres-llamaindex/7dc7a5ea-e593-40a0-adb3-f9519536bdea.png)

You are now done creating an ECS Service in your ECS Cluster. Let's move on to creating access keys for IAM users for your account.

### Create Access Keys for IAM users

- In the navigation bar in your AWS account, choose your user name, and then choose **Security credentials**.

![](/guides/images/chatbot-astro-postgres-llamaindex/75769ba6-07ee-48d3-9421-4f7005c9127d.png)

- Scroll down to **Access keys** and click on **Create access key**.

![](/guides/images/chatbot-astro-postgres-llamaindex/780854a9-c705-4a86-9c16-f4a54fec02fa.png)

- Again, click on **Create access key**.

![](/guides/images/chatbot-astro-postgres-llamaindex/68d86de4-ab60-4a94-bd10-a9492a458f0e.png)

- Copy the **Access key** and **Secret access key** generated to be used as `AWS_ACCESS_KEY_ID` and `AWS_ACCESS_KEY_SECRET` respectively.

![](/guides/images/chatbot-astro-postgres-llamaindex/8586ea3d-d5b2-43dc-b81c-38c1a991b593.png)

Let's move on to configuring GitHub Workflows for continuous deployments.

## Configure GitHub Actions for Continuous Deployment (CD) Workflow

First, let's add all the required environment variables obtained in the AWS steps above to your GitHub repo as repository Secrets. Go to your GitHub repository's Settings, and click on **Secrets and Variables**. Then, click on **New repository secret**.

![](/guides/images/chatbot-astro-postgres-llamaindex/c95dacdf-987c-4a78-97e3-68668f0e1ad5.png)

- Enter **AWS_ACCOUNT_ID** as the value obtained earlier.

![](/guides/images/chatbot-astro-postgres-llamaindex/357f312c-af9d-4f11-991c-71b7df20a285.png)

- Enter **AWS_ACCESS_KEY_ID** as the value obtained earlier.

![](/guides/images/chatbot-astro-postgres-llamaindex/816e7d04-5723-4e11-bde1-5debcd788e1a.png)

- Enter **AWS_ACCESS_KEY_SECRET** as the value obtained earlier.

![](/guides/images/chatbot-astro-postgres-llamaindex/bd5e7d9a-ea81-464a-8949-1f65d292c10b.png)

- Enter **POSTGRES_URL** as the value obtained earlier.

![](/guides/images/chatbot-astro-postgres-llamaindex/80e9eb62-3ffa-4ab9-a6cd-ed0190692ae6.png)

- Enter **OPENAI_API_KEY** as the value obtained earlier.

![](/guides/images/chatbot-astro-postgres-llamaindex/6848ea49-3eb5-4201-927c-183fdf9cb0d7.png)

Next, to automate deployments of your Astro application, you are going to use [GitHub Actions](https://github.com/features/actions). Create a `.github/workflows/deploy.yml` with the following code:

```yml
name: Deploy Astro to Amazon ECS on AWS Fargate

on:
  push:
    branches:
      - master
  workflow_dispatch:

env:
  # AWS ECS
  AWS_CONTAINER_NAME_NAME: astro-app
  AWS_ECS_CLUSTER_NAME: astro-cluster
  AWS_ECS_SERVICE_NAME: astro-service
  AWS_ECS_TASK_DEFINITION: ./task-definition.json

  # AWS ECR
  AWS_ECR_REPOSITORY_NAME: astro-repo

  # AWS Account
  AWS_REGION: us-west-1
  AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ env.AWS_REGION }}
          aws-access-key-id: ${{ env.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ env.AWS_SECRET_ACCESS_KEY }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Load Environment Variables
        id: environment-variables
        env:
          AWS_ACCOUNT_ID: ${{ env.AWS_ACCOUNT_ID }}
          POSTGRES_URL: ${{ secrets.POSTGRES_URL }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          npm install
          node ./env.mjs

      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          IMAGE_TAG: ${{ github.sha }}
          AWS_ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          # Build a docker container and
          # push it to ECR so that it can
          # be deployed to ECS.
          docker build -t $AWS_ECR_REGISTRY/$AWS_ECR_REPOSITORY_NAME:$IMAGE_TAG .
          docker push $AWS_ECR_REGISTRY/$AWS_ECR_REPOSITORY_NAME:$IMAGE_TAG
          echo "image=$AWS_ECR_REGISTRY/$AWS_ECR_REPOSITORY_NAME:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Fill in the new image ID in the Amazon ECS task definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          container-name: ${{ env.AWS_CONTAINER_NAME_NAME }}
          image: ${{ steps.build-image.outputs.image }}
          task-definition: ${{ env.AWS_ECS_TASK_DEFINITION }}

      - name: Deploy Amazon ECS task definition
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          service: ${{ env.AWS_ECS_SERVICE_NAME }}
          cluster: ${{ env.AWS_ECS_CLUSTER_NAME }}
          wait-for-service-stability: true
          task-definition: ${{ steps.task-def.outputs.task-definition }}
```

The workflow above does the following:

- Allows itself to be triggered manually or when a git push is done to the master branch.
- Sets global environment variables as per your AWS setup variables (we obtained earlier during the setup).
- Loads the environment variables added to the GitHub repo as secrets into the scope.
- Writes the task definition including the environment variables.
- Builds and pushes the Docker image to Amazon ECR.
- Loads the updated (if) task definition to Amazon ECS.

Now, push the added GitHub workflow file to your GitHub repo. Follow the steps below to trigger the deployment:

- Go to your GitHub repository's **Actions** tab.

- Select **Deploy to Amazon ECS** workflow.

- Click **Run workflow**.

- Once the action is completed, open [ECS Console](https://console.aws.amazon.com/ecs/v2) and select your service.

![image](/guides/images/chatbot-astro-postgres-llamaindex/932be3bf-f3b1-43d9-b465-828b72a8cd4c.png)

- Click on the **Tasks** tab.

![image (1)](/guides/images/chatbot-astro-postgres-llamaindex/b1904935-d5e3-411f-9e57-922d450ed26a.png)

- Click on the completed **Task**.

![image (2)](/guides/images/chatbot-astro-postgres-llamaindex/3b6f3c70-ee7f-4d80-b1b8-c73cb7d649a0.png)

- Click **open address** to open your deployment.

![image (3)](/guides/images/chatbot-astro-postgres-llamaindex/d4c77bfb-83ab-46e1-a70c-02f25e6c6314.png)

## Summary

In this guide, you learned how to build a RAG Chatbot using LlamaIndex, Astro, and Neon Postgres. Additionally, you learned how to automate deployments of your Astro application using GitHub Actions to Amazon ECS on Amazon Fargate.

<NeedHelp />
