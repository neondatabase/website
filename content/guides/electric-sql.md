---
title: Getting started with Electric and Neon
subtitle: A step-by-step guide to integrating Electric with Lakebase Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-28T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

This guide demonstrates how to integrate [Electric](https://electric.ax/) with Lakebase Postgres. Electric is a Postgres sync engine that handles partial replication, fan-out, and data delivery to client apps. According to Electric, it can scale to millions of users with low, predictable compute and memory usage.

<Admonition type="info" title="Electric has joined Neon">
Electric, the team behind the Electric sync engine, is [joining Neon at Databricks](/blog/electric-joins-neon). Real-time sync is coming to Neon, with deeper integration already underway. In the meantime, this guide shows how to use Electric with Neon today.
</Admonition>

Electric is a read-path sync engine: it replicates subsets of your Postgres data to client applications. You define these subsets with [Shapes](https://electric.ax/docs/guides/shapes), which are similar to live queries. Your application's existing API and backend logic still handle writes, so Electric fits alongside your current stack.

You will learn how to:

- Prepare your Lakebase Postgres database for Electric integration.
- Configure and run Electric using Docker.
- Set up a simple React application that subscribes to data changes on Lakebase Postgres via Electric.
- Test the real-time data synchronization.

## Prerequisites

Before you begin, make sure you have the following:

- **Neon account:** Sign up for a free [Neon account](https://console.neon.tech/signup) if you don't have one already.
- **Node.js:** Node.js is required to run the React example application. Download and install it from [nodejs.org](https://nodejs.org).
- **Docker:** Docker is required to run Electric. Install Docker from [docker.com](https://www.docker.com/products/docker-desktop/).

## Set up your Neon database

Electric requires a Postgres database with logical replication enabled. You'll configure your Neon project accordingly.

1.  **Create a Neon project:** If you haven't already, create a new Neon project. You can use the [Neon Console](https://console.neon.tech).
2.  **Enable logical replication:** Electric uses Postgres logical replication (`wal_level = logical`) to receive changes from your database. Enabling it restarts all computes in the project and can't be reverted. See [Enable logical replication](/docs/guides/logical-replication-neon#enable-logical-replication).
    - Select your project in the [Neon Console](https://console.neon.tech/).
    - On the **Project Dashboard**, select **Settings**.
    - Select **Postgres**, then **Logical replication**.
    - Click **Enable**.

      ![Neon dashboard settings with option to enable logical replication](/docs/guides/neon-console-settings-logical-replication.png)

3.  **Retrieve connection string:**
    - Navigate to the **Dashboard** of your Neon project.
    - Click the **Connect** button to open the connection modal.
    - Select your database and branch, and copy the connection string with connection pooling disabled.

      <Admonition type="important">
      Make sure to turn off connection pooling in the connection string modal. Electric needs a direct connection to use logical replication.
      </Admonition>

      ![Neon direct connection string modal](/docs/guides/neon-console-direct-connection-string.png)

## Set up Electric

With your Neon database ready, set up Electric to connect to it. We'll use Docker to run Electric. Run the following commands in your terminal to create a new directory for your Electric project and navigate into it:

```bash
mkdir neon-electric-quickstart
cd neon-electric-quickstart
```

Create a `docker-compose.yml` file in your project root with the following content:

```yaml
services:
  electric:
    container_name: electric
    image: electricsql/electric:1.0.17
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=${NEON_DATABASE_URL}
      - ELECTRIC_INSECURE=true
    restart: always
```

<Admonition type="note">
The `ELECTRIC_INSECURE=true` setting is for local development only. Electric doesn't perform any authentication or authorization checks. In production, proxy requests through an authorization layer. See [Use Electric in production](#use-electric-in-production) for a typical production setup.
</Admonition>

Create a `.env` file in the same directory to store your Neon database connection string:

```env
NEON_DATABASE_URL="YOUR_NEON_UNPOOLED_CONNECTION_STRING"
```

Replace `YOUR_NEON_UNPOOLED_CONNECTION_STRING` with the unpooled connection string you copied from the **Connect to your branch** modal.

Start Electric using Docker Compose. Run the following command in your terminal:

```bash
docker compose up -d
```

This command starts Electric in detached mode. You can view its logs using:

```bash
docker compose logs -f electric

# ... (other logs)
# Connected to Postgres xxxx and timeline
```

You should see logs indicating that Electric has connected to your Lakebase Postgres database.

## Sample application

With Electric running and connected to your Neon database, you can test it with a React application that uses Electric to sync data from Neon. We'll follow the [Electric Quickstart](https://electric.ax/docs/quickstart) to set up a basic React app that subscribes to changes in a Postgres table.

### Create sample data in Neon

Connect to your Neon database using `psql` or the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) and run the following SQL commands to create a sample table and insert some data. This is the schema our React application will use.

```sql
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  value FLOAT
);

INSERT INTO scores (name, value) VALUES
  ('Alice', 3.14),
  ('Bob', 2.71);
```

### Set up the React application

1.  Create a new React application using Vite. Open your terminal and run the following commands:

    ```bash
    npm create vite@latest react-app -- --template react-ts
    cd react-app
    npm install
    ```

2.  Install Electric React client:

    ```bash
    npm install @electric-sql/react
    ```

3.  Replace the content of `src/App.tsx` with the following code.

    ```tsx
    import { useShape } from '@electric-sql/react';

    function Component() {
      const { data, isLoading } = useShape({
        url: `http://localhost:3000/v1/shape`,
        params: {
          table: `scores`,
        },
      });

      if (isLoading) {
        return <pre>Loading...</pre>;
      }

      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }

    export default Component;
    ```

    Electric uses Shapes to define subsets of your Postgres data for real-time synchronization. Here, `useShape` subscribes to a shape representing the `scores` table, so the React app receives new score data as it changes.

4.  Start the React development server by running the following command in your terminal:

    ```bash
    npm run dev
    ```

    This starts the development server at [`localhost:5173`](http://localhost:5173).

## Use the demo application

Your React application is now connected to Electric, which receives changes from your database through logical replication.

1.  **Access the application:** Open [`localhost:5173`](http://localhost:5173) in your browser. You should see the data from the `scores` table (`Alice` and `Bob`) displayed on the page.

    ```json
    [
      {
        "id": 1,
        "name": "Alice",
        "value": 3.14
      },
      {
        "id": 2,
        "name": "Bob",
        "value": 2.71
      }
    ]
    ```

2.  **Test real-time updates:**
    - Open the Neon SQL Editor or use `psql` to connect to your Neon database.
    - Insert a new row into the `scores` table:

      ```sql
      INSERT INTO scores (name, value) VALUES ('Charlie', 1.618);
      ```

    - Observe your React application. The new data for 'Charlie' should appear without a page refresh.
    - Try updating or deleting rows in Neon and see the changes reflect in the app.

      ```sql
      UPDATE scores SET value = 6.28 WHERE name = 'Alice';
      ```

    - The value for Alice should update in the React app to `6.28`.

      ![React app displaying real-time data from Lakebase Postgres](/docs/guides/electric-sql-react-app.gif)

3.  **Handle writes:**
    Electric handles the read-path synchronization (data from Postgres to client). To write data back to your Neon database (e.g., from user input in the React app), you would typically:
    - Implement an API endpoint in your backend application.
    - This API endpoint would receive write requests from your React app.
    - The API endpoint then performs these operations directly on your Lakebase Postgres database.
    - Once the data is written to Neon, Electric detects the changes via logical replication and syncs them to all connected clients.

    For detailed patterns on handling writes, refer to the [Electric Writes documentation](https://electric.ax/docs/guides/writes).

## Use Electric in production

Electric doesn't handle authentication or authorization. In production, you need to make sure only authorized users can access and sync data.

To do that, place an **authorization proxy** in front of Electric. The proxy controls data access, so clients only sync the data they're permitted to see. You can also configure Electric to accept requests only from your proxy, which blocks direct access from end users.

### Production architecture overview

A typical production architecture with Electric and Lakebase Postgres involves the following components:

1.  **Client application:** Your web or mobile application using an Electric client (e.g., `@electric-sql/react`).
2.  **Caching proxy (recommended for performance):** While optional, deploying Electric behind a caching proxy like Nginx, Caddy, Varnish, or a CDN (e.g., Cloudflare, Fastly) is recommended. Caching responses from Electric improves performance and reduces load.
3.  **Authorization proxy:** A service (which could be part of your existing backend or a dedicated middleware) that intercepts requests destined for Electric. Its primary roles are authentication and authorization.
4.  **Electric:** Electric handles the real-time data synchronization between your client application requests and the Lakebase Postgres database.
5.  **Lakebase Postgres database:** Your source of truth.

### Securing read access

The read path (data syncing from Neon to your client via Electric) needs to be secured.

**Typical flow for read requests (`GET /v1/shape`):**

`User Client -> Caching Proxy (optional) -> Authorization Proxy -> Electric -> Lakebase Postgres`

1.  **Client request:** The Electric client in the user's application initiates a shape subscription request. This request should include authentication credentials (e.g., a JWT in an `Authorization` header) and the desired shape definition (e.g., `table=items`).

    ```typescript
    // Example: Client-side useShape hook with an auth header
    import { useShape } from '@electric-sql/react';

    const electricUrl = 'https://your-auth-proxy.com/electric/v1/shape'; // Points to your CDN/authorization proxy

    const MyComponent = () => {
      const { data } = useShape({
        url: electricUrl,
        params: {
          table: 'projects',
          // Base shape definition, will be augmented by the proxy
        },
        headers: {
          Authorization: `Bearer ${getAuthToken()}`, // Function to retrieve user's auth token
        },
      });
      // ... render component
    };
    ```

2.  **Authorization proxy:**
    - **Authentication:** The proxy validates the `Authorization` header (or other credentials) sent by the client. If authentication fails, it returns a `401 Unauthorized` or `403 Forbidden` error.
    - **Authorization and dynamic shape modification:** Upon successful authentication, the proxy determines the user's identity and permissions. It then _modifies_ the incoming shape request before forwarding it to Electric. This can be done by adding or augmenting `WHERE` clauses to the shape's `params`.
      For example, if a user should only see projects belonging to their organization, the proxy would:
      - Extract `user_id` or `org_id` from the validated token.
      - If the original client request was for `table=projects`, the proxy might transform the request to Electric to include a `where` clause like:
        `GET /v1/shape?table=projects&where="organization_id"='user_actual_org_id'`
        This ensures that Electric only processes and syncs data relevant to that specific user.
    - **(Optional) Adding `ELECTRIC_SECRET`:** You can configure Electric by setting the `ELECTRIC_SECRET` environment variable when initializing the service. Your Authorization Proxy should then include this secret with requests it sends to Electric. Electric then rejects requests that don't come from your proxy.

    For more details on securing Electric in production, refer to the [Electric security guide](https://electric.ax/docs/guides/security).

You have set up Electric with Lakebase Postgres and built a basic real-time React application.

## Resources

- [Electric documentation](https://electric.ax/docs/intro)
- [Electric Quickstart](https://electric.ax/docs/quickstart)
- [Electric Shapes](https://electric.ax/docs/guides/shapes)
- [Neon documentation](/docs)

<NeedHelp/>
