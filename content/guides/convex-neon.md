---
title: Getting started with Convex and Neon
subtitle: A step-by-step guide to integrating Convex with Neon Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-14T00:00:00.000Z'
updatedOn: '2025-02-14T00:00:00.000Z'
---

This guide explores Convex's new self-hosting capability and demonstrates how to use it with Neon Postgres. [Convex](https://www.convex.dev) is a reactive backend platform designed for building real-time applications.  A [recent release](https://news.convex.dev/self-hosting) removes previous limitations of the initial open-source version, which lacked a dashboard and restricted data storage to SQLite.  This new self-hosted version includes the dashboard and allows you to use Postgres as your database.

Convex empowers developers to create dynamic, live-updating applications. Self-hosting preserves these core features while providing greater control over the deployment environment. While SQLite remains the default database for self-hosted instances, Postgres is now a supported alternative, offering enhanced scalability and robustness.

This guide provides a step-by-step walkthrough of integrating Convex with Neon Postgres, covering the following:

- Setting up Convex for self-hosting using Docker Compose
- Configuring Convex to use Neon Postgres for data storage
- Running the Convex [chat application tutorial](https://docs.convex.dev/tutorial)
- Testing the integration to ensure proper functionality

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- **Neon Account:** Sign up for a free [Neon account](https://console.neon.tech/signup) if you don't already have one. Neon provides a Postgres database that we will use as the data store for the Convex chat application.
- **Docker:** Docker is required to run the Convex backend and dashboard locally. If Docker is not installed on your system, download and install Docker Desktop from [docker.com](https://www.docker.com/get-started). Ensure Docker is running before proceeding with the guide.
- **Node.js v18+:** Node.js is required to run the Convex chat application example. Download and install Node.js version 18 or higher from [nodejs.org](https://nodejs.org).

## Setting up Neon Database

<Admonition type="note" title="Database Location and Latency Considerations">

    Keep in mind that the geographic distance between your Neon database and your self-hosted Convex backend can impact application performance.  Latency increases as the distance grows, potentially slowing down your app.

    For optimal performance, it's best to locate your Neon database and Convex backend in the same geographical region. Convex's cloud-hosted platform achieves very low query times  because the database and backend are co-located.

    While this guide focuses on setup and integration specifically for local development, for production applications, consider the physical proximity of your Neon Postgres and Convex Backend server to minimize latency.
</Admonition>

Before integrating Convex with Neon, you need to set up a Neon database. Convex expects a database named `convex_self_hosted` to work with, so you will create this database in Neon.

- Navigate to the [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) in your Neon project console and run the following SQL command to create the `convex_self_hosted` database:

    ```sql
    CREATE DATABASE convex_self_hosted;
    ```

- Once the database is created, you can retrieve the connection string by clicking on **Connect** in the Neon project's dashboard. Select the `convex_self_hosted` database and copy the connection string. You will need this connection string later to configure the Convex backend to use Neon Postgres.

    ![Neon Connection string for convex_self_hosted database](/docs/guides/neon-connection-string-for-convex-database.png)

## Setting up self-hosted Convex with Docker Compose

The next step is to set up a self-hosted Convex backend using Docker Compose. This backend will be configured to use the Neon Postgres database you created in the previous step.

1.  **Create a project directory:** Begin by creating a new directory for your Convex project. This directory will house the `docker-compose.yml` file. Open your terminal and execute the following commands to create the directory and navigate into it:

    ```bash
    mkdir convex-neon-integration
    cd convex-neon-integration
    ```

2.  **Download the Docker Compose configuration:** Convex provides a default `docker-compose.yml` file for self-hosting. Download this file directly into your project directory using the following command:

    ```bash
    npx degit get-convex/convex-backend/self-hosted/docker/docker-compose.yml docker-compose.yml
    ```

    This command utilizes [`npx degit`](https://www.npmjs.com/package/degit) to download the `docker-compose.yml` file from the [Convex GitHub repository](https://github.com/get-convex/convex-backend/blob/main/self-hosted/docker/docker-compose.yml) and places it in your current directory.

3. **Configure Neon connection string:** To instruct Convex to use Neon Postgres as its database, you need to provide the Neon connection string via an environment variable. Create a `.env` file in the same directory as your `docker-compose.yml` file. Add the following line to your `.env` file, replacing `[YOUR_NEON_CONNECTION_STRING]` with your actual Neon connection string obtained in the previous step [Setting up Neon Database](#setting-up-neon-database):

    <Admonition type="important">
        When configuring the `DATABASE_URL` environment variable, it's crucial to ensure your Neon connection string is in the correct format for Convex. Convex expects the connection string to include only the core connection details, specifically in the format: `postgres://username:password@hostname:port`.

        **Important:** You need to remove the database name and any additional parameters appended after the hostname in your Neon-provided connection string.

        **For example:**

        If your Neon connection string looks like this:
        `postgresql://neondb_owner:password@ep-xxxxx.aws.neon.tech/**convex_self_hosted?sslmode=require**`

        You should modify it to this format for Convex:
        `postgres://neondb_owner:password@ep-xxxxx.aws.neon.tech`
    </Admonition>

    ```env
    DATABASE_URL=[YOUR_NEON_CONNECTION_STRING]
    ```

    

4.  **Start Convex services with Docker Compose:** With the configuration in place, start the Convex backend and dashboard services using Docker Compose. Execute the following command in your terminal within the `convex-neon-integration` directory:

    ```bash
    docker compose up -d
    ```

    The `-d` flag runs the containers in detached mode, meaning they will run in the background. Docker Compose will now pull the necessary images, create containers, and start the Convex backend and dashboard services.

5. **Verify Convex dashboard access:** Once the `docker compose up -d` command completes, the Convex dashboard should be accessible in your web browser. Open your browser and navigate to [http://localhost:6791](http://localhost:6791). You should see the Convex dashboard, indicating that the Convex services are running. Initial startup may take a few moments for all services to become fully operational. If the dashboard is not immediately accessible, wait briefly and refresh the page.

Upon successful setup, you should see the Convex dashboard similar to the screenshot below:

![Convex Dashboard](/docs/guides/convex-dashboard.png)

You can also take a moment to **verify that Convex is indeed using your Neon Postgres database** by examining the Docker container logs. This step confirms that the `DATABASE_URL` environment variable was correctly processed and that Convex has established a connection to Neon instead of the default SQLite.

To view the logs, use the following Docker Compose command in your terminal or access the container logs through Docker Desktop:

```bash
docker compose logs -f
```

![Convex Postgres Logs](/docs/guides/convex-postgres-logs.png)

By inspecting these logs, you should observe messages indicating a successful connection to a Postgres database, similar to the above screenshot. This confirms that Convex is now using Neon Postgres as its database backend.

Next, let's retrieve the `CONVEX_SELF_HOSTED_ADMIN_KEY` which you'll need to configure your chat application and login to the dashboard. Execute the following Docker Compose command in your terminal to retrieve the admin key:

```bash
docker compose exec backend ./generate_admin_key.sh
```

The output will display the generated admin key. Copy this key as you will need it in the next steps.

```
convex-self-hosted|01xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

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

3. **Update Convex library version:** It is required to update the `convex` npm package to the latest version within the `convex-tutorial` project. This is needed as the existing version present in the tutorial repository is not the latest and will cause issues with the self-hosted Convex backend.

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

5. **Initialize Convex project:** Run the following command to initialize the Convex project and generate the necessary TypeScript files for the chat application:

    ```bash
    npm run predev
    ```

    This would start the Convex server and generate the necessary TypeScript files for the chat application.

5.  **Implement the `sendMessage` Mutation:** Following the [Convex tutorial - Your first mutation](https://docs.convex.dev/tutorial/#your-first-mutation) section, create a new file `convex/chat.ts` in your `convex-tutorial` project. Add the following code to this file. This code defines a Convex mutation function to insert new messages into the database:

    ```typescript
    // convex/chat.ts
    import { mutation } from "./_generated/server";
    import { v } from "convex/values";

    export const sendMessage = mutation({
        args: {
            user: v.string(),
            body: v.string(),
        },
        handler: async (ctx, args) => {
            console.log("This TypeScript function is running on the server.");
            await ctx.db.insert("messages", {
                user: args.user,
                body: args.body,
            });
        },
    });
    ```

6.  **Update `src/App.tsx` to use `sendMessage` mutation:** Now, update the `src/App.tsx` file. Modify the `src/App.tsx` file to include the `useMutation` hook and call the `sendMessage` mutation when a user submits a message. Replace the relevant section in `src/App.tsx` with the following code:

    ```tsx
    // src/App.tsx
    import { useMutation } from "convex/react"; // [!code ++]
    import { api } from "../convex/_generated/api"; // [!code ++]
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
              alert("Mutation not implemented yet"); // [!code --]
              await sendMessage({ user: NAME, body: newMessageText }); // [!code ++]
              setNewMessageText("");
            }}
          >
            {/* ... form input and button */}
          </form>
        </main>
      );
    }
    ```

7. **Implement the `getMessages` query:** Following the [Convex tutorial - Your first query](https://docs.convex.dev/tutorial/#your-first-query) section, add a Convex query function to `convex/chat.ts` to fetch messages from the database. Add the following `getMessages` query function to your `convex/chat.ts` file:

    ```typescript
    // convex/chat.ts
    import { query, mutation } from "./_generated/server"; // [!code ++]
    // ... existing sendMessage mutation

    export const getMessages = query({ // [!code ++]
        args: {}, // [!code ++]
        handler: async (ctx) => { // [!code ++]
            const messages = await ctx.db.query("messages").order("desc").take(50); // [!code ++]
            return messages.reverse(); // [!code ++]
        }, // [!code ++]
    }); // [!code ++]
    ```

8. **Update `src/App.tsx` to Use `getMessages` query:** Finally, update `src/App.tsx` to fetch and display messages using the `useQuery` hook and the `getMessages` query function. Replace the relevant section in `src/App.tsx` with the following code:

    ```tsx
    // src/App.tsx
    import { useQuery, useMutation } from "convex/react"; // [!code ++]
    // ... other imports and component setup

    export default function App() {
        const messages = [ // [!code --]
            { _id: "1", user: "Alice", body: "Good morning!" }, // [!code --]
            { _id: "2", user: NAME, body: "Beautiful sunrise today" }, // [!code --]
        ]; // [!code --]
        const messages = useQuery(api.chat.getMessages); // [!code ++]

        // ... remaining component code
    }
    ```

9. Your `App.tsx` file should look like the following code after all updates:

    ```tsx
    import { useEffect, useState } from "react";
    import { faker } from "@faker-js/faker";
    import { api } from "../convex/_generated/api";
    import { useQuery, useMutation } from "convex/react";

    const NAME = getOrSetFakeName();

    export default function App() {
    const messages = useQuery(api.chat.getMessages);
    const sendMessage = useMutation(api.chat.sendMessage);
    const [newMessageText, setNewMessageText] = useState("");

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
                <article
                    key={message._id}
                    className={message.user === NAME ? "message-mine" : ""}
                >
                <div>{message.user}</div>
                <p>{message.body}</p>
                </article>
            ))}
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await sendMessage({ user: NAME, body: newMessageText });
                    setNewMessageText("");
                }} >
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
        const NAME_KEY = "tutorial_name";
        const name = sessionStorage.getItem(NAME_KEY);
        if (!name) {
            const newName = faker.person.firstName();
            sessionStorage.setItem(NAME_KEY, newName);
            return newName;
        }
        return name;
    }
    ```

9. Your `convex/chat.ts` file should look like the following code after all updates:

    ```typescript
    // convex/chat.ts
    import { query, mutation } from "./_generated/server";
    import { v } from "convex/values";

    export const sendMessage = mutation({
        args: {
            user: v.string(),
            body: v.string(),
        },
        handler: async (ctx, args) => {
            console.log("This TypeScript function is running on the server.");
            await ctx.db.insert("messages", {
                user: args.user,
                body: args.body,
            });
        },
    });

    export const getMessages = query({
        args: {},
        handler: async (ctx) => {
            const messages = await ctx.db.query("messages").order("desc").take(50);
            return messages.reverse();
        },
    });
    ```

9.  **Run the Convex chat application** by executing the following command in your terminal within the `convex-tutorial` directory:

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