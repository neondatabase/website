---
title: Getting started with ElectricSQL and Neon
subtitle: A step-by-step guide to integrating ElectricSQL with Neon Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-28T00:00:00.000Z'
updatedOn: '2025-05-28T00:00:00.000Z'
---

This guide demonstrates how to integrate [ElectricSQL](https://electric-sql.com/) with Neon Postgres. ElectricSQL is a Postgres sync engine designed to handle partial replication, fan-out, and data delivery, making apps faster and more collaborative. It can scale to millions of users while maintaining low, stable, and predictable compute and memory usage.

ElectricSQL acts as a read-path sync engine, efficiently replicating partial subsets of your Postgres data to client applications. These data subsets are defined using [Shapes](https://electric-sql.com/docs/guides/shapes), which are similar to live queries. Writes are handled by your application's existing API and backend logic, ensuring ElectricSQL integrates smoothly with your current stack.

This guide provides a step-by-step walkthrough of setting up ElectricSQL with Neon Postgres. You will learn how to:

- Prepare your Neon Postgres database for ElectricSQL integration.
- Configure and run Electric using Docker.
- Set up a simple React application that subscribes to data changes on Neon Postgres via ElectricSQL.
- Test the real-time data synchronization.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed and configured:

- **Neon Account:** Sign up for a free [Neon account](https://console.neon.tech/signup) if you don't have one already.
- **Node.js:** Node.js is required to run the React example application. Download and install it from [nodejs.org](https://nodejs.org).
- **Docker:** Docker is required to run Electric. Install Docker from [docker.com](https://www.docker.com/products/docker-desktop/).

## Setting up Neon Database

ElectricSQL requires a Postgres database with logical replication enabled. You'll configure your Neon project accordingly.

1.  **Create a Neon Project:** If you haven't already, create a new Neon project. You can use the Neon Console or [pg.new](https://pg.new).
2.  **Enable Logical Replication:** ElectricSQL uses Postgres logical replication (`wal_level = logical`) to receive changes from your database.
    - Navigate to your Neon Project in the [Neon Console](https://console.neon.tech/).
    - Open the **Settings** menu.
    - Click on **Logical Replication**.
    - Click the **Enable** button to enable logical replication.

      ![Neon dashboard settings with option to enable logical replication](/docs/guides/neon-console-settings-logical-replication.png)

3.  **Retrieve connection string:**
    - Navigate to the **Dashboard** of your Neon project.
    - Click on the **Connect** button which opens a modal.
    - Select your database and branch, and copy the connection string with connection pooling disabled.

      <Admonition type="important">
      Make sure to turn off connection pooling in the connection string modal. This is essential for Electric to maintain a persistent connection to the Neon database.
      </Admonition>

      ![Neon direct connection string modal](/docs/guides/neon-console-direct-connection-string.png)

## Setting up Electric

With your Neon database ready, you can now set up Electric to connect to it. We'll use Docker to run Electric. Run the following commands in your terminal to create a new directory for your ElectricSQL project and navigate into it:

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
The `ELECTRIC_INSECURE=true` setting is for local development only. Electric doesn't perform any authentication or authorization checks. You will need to proxy requests through an authorization layer in production to secure Electric. Please refer to [Using ElectricSQL in Production](#using-electricsql-in-production) for a typical production setup.
</Admonition>

Create a `.env` file in the same directory to store your Neon database connection string:

```env
NEON_DATABASE_URL="YOUR_NEON_UNPOOLED_CONNECTION_STRING"
```

Replace `YOUR_NEON_UNPOOLED_CONNECTION_STRING` with the actual unpooled connection string you copied from your Neon project dashboard.

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

You should see logs indicating that Electric has connected to your Neon Postgres database.

## Sample application

Now that Electric is running and connected to your Neon database, you can test it with a simple React application that uses ElectricSQL to sync data from Neon. We will be following the [ElectricSQL Quickstart](https://electric-sql.com/docs/quickstart) to set up a basic React app that subscribes to changes in a Postgres table.

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

2.  Install ElectricSQL React client:

    ```bash
    npm install @electric-sql/react
    ```

3.  Replace the content of `src/App.tsx` with the following code.

    ```tsx
    import { useShape } from '@electric-sql/react';

    function Component() {
      const { data } = useShape({
        url: `http://localhost:3000/v1/shape`,
        params: {
          table: `scores`,
        },
      });

      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }

    export default Component;
    ```

    ElectricSQL uses Shapes to define subsets of your Postgres data for real-time synchronization. Here, `useShape` subscribes to a shape representing the `scores` table, ensuring your React app always has the latest score data.

4.  Start the React development server by running the following command in your terminal:

    ```bash
    npm run dev
    ```

    This will start the development server at [`localhost:5173`](http://localhost:5173)

## Using the demo application

Your React application should now be running in your browser. It's actively connected to the Electric, which maintains a real-time link to your Neon Postgres database via Logical Replication.

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

    - Observe your React application. The new data for 'Charlie' should appear automatically without needing a page refresh. This demonstrates ElectricSQL's real-time sync capabilities.
    - Try updating or deleting rows in Neon and see the changes reflect in the app.

      ```sql
      UPDATE scores SET value = 6.28 WHERE name = 'Alice';
      ```

    - The value for Alice should update in the React app to `6.28`.

      ![React app displaying real-time data from Neon Postgres](/docs/guides/electric-sql-react-app.gif)

3.  **Understanding writes:**
    ElectricSQL handles the read-path synchronization (data from Postgres to client). To write data back to your Neon database (e.g., from user input in the React app), you would typically:
    - Implement an API endpoint in your backend application.
    - This API endpoint would receive write requests from your React app.
    - The API endpoint then performs these operations directly on your Neon Postgres database.
    - Once the data is written to Neon, Electric will detect these changes via Logical replication and automatically sync them to all connected clients.

    For detailed patterns on handling writes, refer to the [ElectricSQL Writes documentation](https://electric-sql.com/docs/guides/writes).

## Using ElectricSQL in Production

While ElectricSQL simplifies real-time data synchronization, Electric itself does not handle authentication or authorization. In production, you must implement a secure architecture to ensure that only authorized users can access and sync data.

The core principle for a secure and scalable ElectricSQL deployment is to place an **Authorization Proxy** in front of Electric. This proxy becomes the gatekeeper for data access, ensuring that clients only sync the data they are permitted to see. Additionally, you may whitelist Electric to only accept requests from your proxy, preventing direct access from end users.

### Production Architecture overview

A typical production architecture with ElectricSQL and Neon Postgres involves the following components:

1.  **Client application:** Your web or mobile application using an ElectricSQL client (e.g., `@electric-sql/react`).
2.  **Caching proxy (recommended for performance):** While optional, deploying Electric behind a caching proxy like Nginx, Caddy, Varnish, or a CDN (e.g., Cloudflare, Fastly) is recommended. This setup can significantly improve performance and reduce load by caching responses from Electric.
3.  **Authorization proxy:** A service (which could be part of your existing backend or a dedicated middleware) that intercepts requests destined for Electric. Its primary roles are authentication and authorization.
4.  **Electric:** Electric handles the real-time data synchronization between your client application requests and the Neon Postgres database.
5.  **Neon Postgres Database:** Your source of truth.

### Securing read access

The read path (data syncing from Neon to your client via ElectricSQL) needs to be robustly secured.

**Typical flow for read requests (`GET /v1/shape`):**

`User Client -> Caching Proxy (optional) -> Authorization Proxy -> ElectricSQL -> Neon Postgres`

1.  **Client request:** The ElectricSQL client in the user's application initiates a shape subscription request. This request should include authentication credentials (e.g., a JWT in an `Authorization` header) and the desired shape definition (e.g., `table=items`).

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
    - **Authorization & Dynamic Shape modification:** Upon successful authentication, the proxy determines the user's identity and permissions. It then _modifies_ the incoming shape request before forwarding it to Electric. This can be done by adding or augmenting `WHERE` clauses to the shape's `params`.
      For example, a user should only see projects belonging to their organization, the proxy would:
      - Extract `user_id` or `org_id` from the validated token.
      - If the original client request was for `table=projects`, the proxy might transform the request to Electric to include a `where` clause like:
        `GET /v1/shape?table=projects&where="organization_id"='user_actual_org_id'`
        This ensures that Electric only processes and syncs data relevant to that specific user.
    - **(Optional) Adding `ELECTRIC_SECRET`:** You can configure Electric by setting the `ELECTRIC_SECRET` environment variable when initializing the service. Your Authorization Proxy should then include this secret with requests it sends to Electric. This allows Electric to verify that requests originate from your trusted proxy, enhancing security by ensuring only authenticated requests are processed.

    For more details on securing ElectricSQL in production, refer to the [ElectricSQL Security Guide](https://electric-sql.com/docs/guides/security).

Congratulations! You have successfully set up ElectricSQL with Neon Postgres and built a basic real-time React application.

## Resources

- [ElectricSQL Documentation](https://electric-sql.com/docs/intro)
- [ElectricSQL Quickstart](https://electric-sql.com/docs/quickstart)
- [ElectricSQL Shapes](https://electric-sql.com/docs/guides/shapes)
- [Neon Documentation](/docs)

<NeedHelp/>
