---
title: Getting started with Convex and Neon
subtitle: A step-by-step guide to integrating Convex with Neon Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-14T00:00:00.000Z'
updatedOn: '2025-02-14T00:00:00.000Z'
---

This guide explores Convex's self-hosting capability and demonstrates how to use it with Neon Postgres. [Convex](https://www.convex.dev) is a reactive backend platform ideal for building real-time applications. A [recent release](https://news.convex.dev/self-hosting) significantly enhances the self-hosted experience, overcoming limitations of the initial open-source version which lacked a dashboard and relied solely on SQLite. The new self-hosted Convex includes the [dashboard](https://docs.convex.dev/dashboard) and supports Postgres as a robust and scalable database option.

Convex empowers developers to create dynamic, live-updating applications. Self-hosting retains these core features while granting you greater control over your deployment environment. While SQLite remains the default for simplicity, Postgres integration unlocks enhanced scalability and resilience, especially beneficial for production applications.

This guide provides a step-by-step walkthrough of integrating Convex with Neon Postgres. You will learn how to:

- Set up Convex for self-hosting using Docker Compose.
- Configure Convex to utilize Neon Postgres for persistent data storage.
- Run the Convex [chat application tutorial](https://docs.convex.dev/tutorial) as a practical example.
- Test the integration to ensure everything functions correctly.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed and configured:

- **Neon Account:** Sign up for a free [Neon account](https://console.neon.tech/signup) if you don't have one already. Neon will provide a managed Postgres database for your Convex chat application.
- **Docker:** Docker is essential for running the Convex backend and dashboard locally. If Docker is not installed, download and install Docker Desktop from [docker.com](https://www.docker.com/get-started). Make sure Docker is running before proceeding.
- **Node.js v18+:** Node.js (version 18 or higher) is required to run the Convex chat application example. Download and install it from [nodejs.org](https://nodejs.org).

<Admonition type="note" title="Database Location and Latency Considerations">

    Remember that the physical distance between your Neon database and your self-hosted Convex backend can impact your application's performance due to latency.  Increased distance generally means higher latency and potentially slower response times.

    For optimal performance, especially in production, it's highly recommended to locate your Neon database and Convex backend in the same geographical region. Convex's cloud-hosted platform achieves extremely low query times because the database and backend are co-located within their infrastructure.

    While this guide focuses on setup and integration specifically for local development, for production applications, consider the physical proximity of your Neon Postgres and Convex Backend server to minimize latency.

</Admonition>

## Setting up Neon Database

To get started with your Postgres database, create a new Neon project using [pg.new](https://pg.new). This project will provide the Postgres instance that Convex will use to store your application data. Within this Neon project, you'll need to create a database named `convex_self_hosted` – this is the specific database Convex is configured to use for storing chat messages. Follow these steps to set up your Neon Postgres database:

- Navigate to the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) in your Neon project console to create the `convex_self_hosted` database.
- Execute the following SQL command to create the database:

  ```sql
  CREATE DATABASE convex_self_hosted;
  ```

- Once the database is created, you can retrieve the connection string by clicking on "Connect" in the Neon project's dashboard. Select the `convex_self_hosted` database and copy the connection string. You will need this connection string later to configure the Convex backend to use Neon Postgres.

  ![Neon Connection string for convex_self_hosted database](/docs/guides/neon-connection-string-for-convex-database.png)

## Setting up Self-Hosted Convex with Docker Compose

Now, you'll set up the self-hosted Convex backend using Docker Compose, configuring it to use your Neon Postgres database.

1.  **Create a Project Directory:** Open your terminal and create a new directory for your Convex project. Navigate into it:

    ```bash
    mkdir convex-neon-integration
    cd convex-neon-integration
    ```

2.  **Download Docker Compose Configuration:** Download the default `docker-compose.yml` file provided by Convex directly into your project directory:

    ```bash
    npx degit get-convex/convex-backend/self-hosted/docker/docker-compose.yml docker-compose.yml
    ```

    This command uses [`npx degit`](https://www.npmjs.com/package/degit) to fetch the `docker-compose.yml` file from the [Convex GitHub repository](https://github.com/get-convex/convex-backend/blob/main/self-hosted/docker/docker-compose.yml).

3.  **Set up Neon connection string:** Add your Neon connection string you copied earlier to a `.env` file to configure Convex.
    1.  Create a `.env` file in the same directory as `docker-compose.yml`.
    1.  Add this line:
        ```env
        POSTGRES_URL=[YOUR_NEON_CONNECTION_STRING]
        ```
    1.  Modify `[YOUR_NEON_CONNECTION_STRING]` for Convex:

        Convex requires a specific connection string format for Neon:

        `postgres://username:password@hostname`

        Remove the database name and extra parameters from your Neon connection string.

        **Neon default:**

        ```bash
        postgresql://neondb_owner:password@ep-xxxxx.aws.neon.tech/convex_self_hosted?sslmode=require&channel_binding=require
        ```

        **For Convex:**

        ```bash
        postgres://neondb_owner:password@ep-xxxxx.aws.neon.tech
        ```

4.  **Start Convex services with Docker Compose:** With the configuration in place, start the Convex backend and dashboard services using Docker Compose. Execute the following command in your terminal within the `convex-neon-integration` directory:

    ```bash
    docker compose up -d
    ```

    The `-d` flag runs the containers in detached mode (in the background). Docker Compose will download the necessary images, create containers, and start the Convex services.

5.  **Access the Convex Dashboard:** Once `docker compose up -d` completes, the Convex dashboard should be accessible in your browser at [http://localhost:6791](http://localhost:6791). It might take a few moments for the services to fully start. If it's not immediately available, wait a short time and refresh the page.

    You should see the Convex dashboard login screen:

    ![Convex Dashboard](/docs/guides/convex-dashboard.png)

    **Login to the Convex Dashboard:**
    - When you access the dashboard for the first time, you will be prompted to log in.
    - For the password, you will use the `CONVEX_SELF_HOSTED_ADMIN_KEY` generated in the next step.

6.  **Verify Neon Postgres Connection (Optional but Recommended):** You can confirm that Convex is using your Neon Postgres database by checking the Docker container logs. This verifies that the `POSTGRES_URL` environment variable was correctly processed.

    Run this command in your terminal within the `convex-neon-integration` directory:

    ```bash
    docker compose logs -f
    ```

    Examine the logs for messages indicating a successful connection to a Postgres database, similar to the example below:

    ![Convex Postgres Logs](/docs/guides/convex-postgres-logs.png)

7.  **Retrieve the Admin Key:** You need the `CONVEX_SELF_HOSTED_ADMIN_KEY` to log into the Convex dashboard and configure your chat application. Execute this command to retrieve it:

    ```bash
    docker compose exec backend ./generate_admin_key.sh
    ```

    The output will display the generated admin key. **Copy this key carefully.** You'll need it in the next steps to log in to the dashboard and configure the chat application.

    ```
    convex-self-hosted|01xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

    **Use this admin key as the password when logging into the Convex dashboard at http://localhost:6791**

## Setting up the Convex chat application example

With the self-hosted Convex backend powered by Neon running, the next step is to set up the Convex chat application example to connect to this backend and complete the chat functionality as described in the Convex tutorial.

1.  **Clone the Convex tutorial repository:** Open a new terminal window, ensuring the Docker Compose process from the previous step remains running. Clone the Convex tutorial repository to your local machine. This repository contains the source code for the chat application example.

    ```bash
    git clone https://github.com/get-convex/convex-tutorial.git
    cd convex-tutorial
    ```

2.  **Install application dependencies:** Navigate into the `convex-tutorial` directory and install the required npm packages. This step downloads all necessary JavaScript libraries and dependencies for the chat application.

    ```bash
    npm install
    ```

3.  **Update Convex library version:** It is required to update the `convex` npm package to the latest version within the `convex-tutorial` project. This is needed as the existing version present in the tutorial repository is not the latest and will cause issues with the self-hosted Convex backend.

    ```bash
    npm install convex@latest
    ```

4.  **Configure environment variables for chat app:** To connect the chat application to your self-hosted Convex backend, you need to configure specific environment variables. Create a `.env.local` file in the root of the `convex-tutorial` directory. Add the following variables to this file:

    ```env
    VITE_CONVEX_URL=http://localhost:3210
    CONVEX_SELF_HOSTED_URL='http://localhost:3210'
    CONVEX_SELF_HOSTED_ADMIN_KEY='<your_generated_admin_key>'
    ```

    - `VITE_CONVEX_URL`: Specifies the URL of your self-hosted Convex backend. In this case, it's set to `http://localhost:3210`, the default for local Convex backends.
    - `CONVEX_SELF_HOSTED_URL`: Also set to the same URL, `http://localhost:3210`.
    - `CONVEX_SELF_HOSTED_ADMIN_KEY`: This key is essential for authenticating development operations against your self-hosted Convex instance. Replace `<your_generated_admin_key>` with the admin key you generated in the previous step [Setting up self-hosted Convex with Docker Compose](#setting-up-self-hosted-convex-with-docker-compose).

5.  **Initialize Convex project:** Run the following command to initialize the Convex project and generate the necessary TypeScript files for the chat application:

    ```bash
    npm run predev
    ```

    This starts the Convex server and generates the necessary TypeScript files for the chat application.

6.  **Implement the `sendMessage` Mutation:** Following the [Convex tutorial - Your first mutation](https://docs.convex.dev/tutorial/#your-first-mutation) section, create a new file `convex/chat.ts` in your `convex-tutorial` project. Add the following code to this file. This code defines a Convex mutation function to insert new messages into the database:

    ```typescript
    // convex/chat.ts
    import { mutation } from './_generated/server';
    import { v } from 'convex/values';

    export const sendMessage = mutation({
      args: {
        user: v.string(),
        body: v.string(),
      },
      handler: async (ctx, args) => {
        console.log('This TypeScript function is running on the server.');
        await ctx.db.insert('messages', {
          user: args.user,
          body: args.body,
        });
      },
    });
    ```

7.  **Update `src/App.tsx` to use `sendMessage` mutation:** Now, update the `src/App.tsx` file. Modify the `src/App.tsx` file to include the `useMutation` hook and call the `sendMessage` mutation when a user submits a message. Replace the relevant section in `src/App.tsx` with the following code:

    ```tsx
    // src/App.tsx
    import { useMutation } from 'convex/react'; // [!code ++]
    import { api } from '../convex/_generated/api'; // [!code ++]
    // ... other imports and component setup

    export default function App() {
      const sendMessage = useMutation(api.chat.sendMessage); // [!code ++]
      // ... other hooks and state variables

      return (
        <main className="chat">
          {/* ... other JSX elements */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              alert('Mutation not implemented yet'); // [!code --]
              await sendMessage({ user: NAME, body: newMessageText }); // [!code ++]
              setNewMessageText('');
            }}
          >
            {/* ... form input and button */}
          </form>
        </main>
      );
    }
    ```

8.  **Implement the `getMessages` query:** Following the [Convex tutorial - Your first query](https://docs.convex.dev/tutorial/#your-first-query) section, add a Convex query function to `convex/chat.ts` to fetch messages from the database. Add the following `getMessages` query function to your `convex/chat.ts` file:

    ```typescript
    // convex/chat.ts
    import { query, mutation } from './_generated/server'; // [!code ++]
    // ... existing sendMessage mutation

    export const getMessages = query({
      // [!code ++]
      args: {}, // [!code ++]
      handler: async (ctx) => {
        // [!code ++]
        const messages = await ctx.db.query('messages').order('desc').take(50); // [!code ++]
        return messages.reverse(); // [!code ++]
      }, // [!code ++]
    }); // [!code ++]
    ```

9.  **Update `src/App.tsx` to Use `getMessages` query:** Finally, update `src/App.tsx` to fetch and display messages using the `useQuery` hook and the `getMessages` query function. Replace the relevant section in `src/App.tsx` with the following code:

    ```tsx
    // src/App.tsx
    import { useQuery, useMutation } from 'convex/react'; // [!code ++]
    // ... other imports and component setup

    export default function App() {
      const messages = [
        // [!code --]
        { _id: '1', user: 'Alice', body: 'Good morning!' }, // [!code --]
        { _id: '2', user: NAME, body: 'Beautiful sunrise today' }, // [!code --]
      ]; // [!code --]
      const messages = useQuery(api.chat.getMessages); // [!code ++]

      // ... remaining component code
    }
    ```

10. Your `App.tsx` file should look like the following code after all updates:

    ```tsx
    import { useEffect, useState } from 'react';
    import { faker } from '@faker-js/faker';
    import { api } from '../convex/_generated/api';
    import { useQuery, useMutation } from 'convex/react';

    const NAME = getOrSetFakeName();

    export default function App() {
      const messages = useQuery(api.chat.getMessages);
      const sendMessage = useMutation(api.chat.sendMessage);
      const [newMessageText, setNewMessageText] = useState('');

      useEffect(() => {
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 0);
      }, [messages]);

      return (
        <main className="chat">
          <header>
            <h1>Convex Chat</h1>
            <p>
              Connected as <strong>{NAME}</strong>
            </p>
          </header>
          {messages?.map((message) => (
            <article key={message._id} className={message.user === NAME ? 'message-mine' : ''}>
              <div>{message.user}</div>
              <p>{message.body}</p>
            </article>
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await sendMessage({ user: NAME, body: newMessageText });
              setNewMessageText('');
            }}
          >
            <input
              value={newMessageText}
              onChange={async (e) => {
                const text = e.target.value;
                setNewMessageText(text);
              }}
              placeholder="Write a message…"
              autoFocus
            />
            <button type="submit" disabled={!newMessageText}>
              Send
            </button>
          </form>
        </main>
      );
    }

    function getOrSetFakeName() {
      const NAME_KEY = 'tutorial_name';
      const name = sessionStorage.getItem(NAME_KEY);
      if (!name) {
        const newName = faker.person.firstName();
        sessionStorage.setItem(NAME_KEY, newName);
        return newName;
      }
      return name;
    }
    ```

11. Your `convex/chat.ts` file should look like the following code after all updates:

    ```typescript
    // convex/chat.ts
    import { query, mutation } from './_generated/server';
    import { v } from 'convex/values';

    export const sendMessage = mutation({
      args: {
        user: v.string(),
        body: v.string(),
      },
      handler: async (ctx, args) => {
        console.log('This TypeScript function is running on the server.');
        await ctx.db.insert('messages', {
          user: args.user,
          body: args.body,
        });
      },
    });

    export const getMessages = query({
      args: {},
      handler: async (ctx) => {
        const messages = await ctx.db.query('messages').order('desc').take(50);
        return messages.reverse();
      },
    });
    ```

12. **Run the Convex chat application** by executing the following command in your terminal within the `convex-tutorial` directory:

    ```bash
    npm run dev
    ```

## Using the chat application

With the Convex chat application running and connected to your self-hosted Convex backend powered by Neon Postgres, you can now test the chat functionality.

1.  **Access the Chat application in your browser:** Open your web browser and navigate to[http://localhost:5173](http://localhost:5173). You should see the Convex chat application interface.

2.  **Open a second browser window:** Open a second browser window and navigate to [http://localhost:5173](http://localhost:5173).

3.  **Send and receive real-time messages:** In one chat window, type and send a message. Verify that the message appears in real-time in both chat windows. Send messages from both windows and observe the bidirectional real-time updates.

Congratulations! You have successfully integrated Convex with Neon Postgres and implemented a real-time chat application using Convex queries and mutations.

## Resources

- [Convex documentation](https://docs.convex.dev)
- [Convex self-hosting guide](https://stack.convex.dev/self-hosted-develop-and-deploy)
- [Neon documentation](/docs)
- [Neon Console](https://console.neon.tech)
- [Convex tutorial: A chat app](https://docs.convex.dev/tutorial)

<NeedHelp/>
