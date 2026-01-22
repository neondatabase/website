---
title: Getting started with Zero and Neon
subtitle: A step-by-step guide to integrating Zero with Neon Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-01T00:00:00.000Z'
updatedOn: '2025-05-01T00:00:00.000Z'
---

This guide demonstrates how to integrate [Zero](https://zero.rocicorp.dev/) by [Rocicorp](https://rocicorp.dev/) with Neon Postgres. Zero allows you to build reactive, real-time applications by writing queries directly in your client code against your backend database schema. It synchronizes query results efficiently to a client-side cache, enabling instant UI updates and a local-first feel.

Zero achieves this using its custom streaming query engine, [ZQL](https://zero.rocicorp.dev/docs/reading-data), and a stateful middleware service called `zero-cache`. `zero-cache` maintains a SQLite replica of your upstream Postgres database and serves ZQL queries to clients over WebSockets.

This guide provides a step-by-step walkthrough of setting up Zero with Neon Postgres. You will learn how to:

- Prepare your Neon Postgres database for Zero integration.
- Clone and run the Zero `hello-zero` quickstart application as a practical example.
- Test the integration to ensure data syncs correctly between the application, `zero-cache`, and Neon.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed and configured:

- **Neon Account:** Sign up for a free [Neon account](https://console.neon.tech/signup) if you don't have one already. Neon provides a Postgres database for your Zero application.
- **Node.js v20+:** Node.js (version 20 or higher) is required to run the `hello-zero` example application and Zero tooling. Download and install it from [nodejs.org](https://nodejs.org).

## Setting up Neon Database

Zero requires a Postgres database (version 15+) with logical replication enabled. You'll configure your Neon project accordingly.

1.  **Create a Neon Project:** If you haven't already, create a new Neon project using [pg.new](https://pg.new).
2.  **Enable Logical Replication:** Zero uses Postgres logical replication (`wal_level = logical`) to receive changes from your database.
    - Navigate to your Neon Project using the [Neon Console](https://console.neon.tech/).
    - Open the **Settings** menu.
    - Click on **Logical Replication**.
    - Click the **Enable** button to enable logical replication.
      ![Neon dashboard settings with option to enable logical replication](/docs/guides/neon-console-settings-logical-replication.png)

3.  **Retrieve Connection String:**
    - Navigate to the **Dashboard** of your Neon project.
    - Click on the **Connect** button which opens a modal.
    - Select your database and branch, and copy the connection string with connection pooling disabled.
      <Admonition type="important">
      Make sure to turn off connection pooling in the connection string modal. This is essential for `zero-cache` to maintain a persistent connection to the Neon database.
      </Admonition>
      ![Neon direct connection string modal](/docs/guides/neon-console-direct-connection-string.png)

## Setting up the `hello-zero` example application

With your Neon database prepared, let's set up the `hello-zero` example application from [Zero's Quickstart](https://zero.rocicorp.dev/docs/quickstart) to connect to it.

1.  **Clone the `hello-zero` repository and install dependencies:**
    In a terminal window, navigate to the directory where you want to clone the `hello-zero` repository. Run the following commands:

    ```bash
    git clone https://github.com/rocicorp/hello-zero.git
    cd hello-zero
    npm install
    ```

    This clones the `hello-zero` repository and installs the necessary Node.js dependencies.

    <Admonition type="note" title="Using non-npm package managers?">
    If you are using `pnpm` or `bun` instead of `npm`, you might need to explicitly allow the postinstall script for `@rocicorp/zero-sqlite3`, which installs native binaries. Follow the instructions on [Zero's Docs](https://zero.rocicorp.dev/docs/quickstart#not-npm) to configure your package manager correctly.
    </Admonition>

2.  **Apply database schema/seed data:**
    To run the example application, you need to set up the database schema and seed initial data by running the SQL migrations. The project includes the necessary SQL commands in the `docker/seed.sql` file.

    You can execute this file using `psql` (ensure it's installed locally) or the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor).

    Using `psql`, run the following command. Replace `YOUR_NEON_CONNECTION_STRING` with your database connection string copied from the Neon Console:

    ```bash
    psql "YOUR_NEON_CONNECTION_STRING" -f docker/seed.sql
    ```

    > Alternatively, you can run the SQL commands directly in the Neon SQL Editor. Copy the contents of `docker/seed.sql` and paste them into the SQL Editor in the Neon Console. Click **Run** to execute the commands.

3.  **Configure environment variables:**
    Open the `.env` file and modify the `ZERO_UPSTREAM_DB` variable to point to your Neon database. It should look something like this:

    ```env
    # other environment variables...
    ZERO_UPSTREAM_DB="YOUR_NEON_CONNECTION_STRING"
    ```

    > Replace `YOUR_NEON_CONNECTION_STRING` with the actual connection string from your Neon project dashboard which you copied earlier.

4.  **Run the `zero-cache` service:**
    Now, start the `zero-cache` service using the provided npm script. In your terminal, still within the `hello-zero` directory, run:

    ```bash
    npm run dev:zero-cache
    ```

    This command starts the `zero-cache` process. It connects to your Neon database, applies necessary [permissions](https://zero.rocicorp.dev/docs/permissions) required for the `hello-zero` application, and starts the replication process. The terminal will display logs indicating the connection status and replication progress. Keep this terminal window open as it runs the `zero-cache` service.

    <Admonition type="tip" title="Topology">
    To optimize performance, deploy your `zero-cache` service in close proximity to your Neon database to minimize latency in production. During local development, you might notice logs indicating a higher ping time if your `zero-cache` service and Neon database are not in the same region. This is expected and can be disregarded in a development environment. However, for production, it is crucial to deploy the `zero-cache` service in the same region as your Neon database to achieve minimal latency. For more information on deployment, refer to [Deploying Zero](https://zero.rocicorp.dev/docs/deployment#topology).
    </Admonition>

5.  **Run the `hello-zero` UI:**
    Open a _new_ terminal window, navigate back to the `hello-zero` directory, and run the following command to start the frontend application:
    ```bash
    npm run dev:ui
    ```
    This command starts the Vite development server, making the application available at `http://localhost:5173`. Open this URL in your browser.

## Using the demo application

You should now have the `hello-zero` application running in your browser. It connects to the `zero-cache` process running in your first terminal window, which synchronizes data with your Neon Postgres database.

1.  **Access the application:** Open `http://localhost:5173` in your browser.
2.  **Test functionality:** Try the features described in the [Zero Quickstart Overview](https://zero.rocicorp.dev/docs/quickstart#quick-overview):
    - Click **Add Messages**. New messages should appear instantly.
    - Open the app in a second browser tab or window. Changes made in one window should appear nearly instantaneously in the other.
    - Click **Login**. You'll be logged in as a random user.
    - Try **Remove Messages**. This should work now that you are logged in.
      ![Demo of the hello-zero app](/docs/guides/hello-zero-demo.gif)
    - Try editing a message (pencil icon). You should only be able to edit messages created by the user you are logged in as.
    - Use the **From** or **Contains** filters.
3.  **Verify data in Neon (Optional):** In the Neon Console, navigate to **Tables** and select the `message` table. You should see the messages you added in the application. This confirms that data is being synchronized correctly between the application, `zero-cache`, and Neon.
    ![Neon messages table](/docs/guides/zero-message-table.png)

Congratulations! You have successfully set up Rocicorp Zero with Neon Postgres using the `hello-zero` example application. Check out [Canvas](https://github.com/neondatabase-labs/canvas), a collaborative drawing app built with Zero and Neon, for a more complex example of Zero in action.

<Admonition type="note" title="Schema Changes">
Zero uses Postgres event triggers for efficient schema migration handling. While Neon now supports event triggers, Zero may still perform a **full reset of the `zero-cache` and all connected client states** whenever schema changes are detected to ensure correctness.

This reset mechanism can be inefficient for larger databases (e.g., > 1GB) or applications undergoing frequent schema evolution. For smaller databases or projects with stable schemas, the impact is typically acceptable. Consider this behavior when managing schema changes for your Zero application, especially for larger projects.
</Admonition>

## Resources

- [Zero Documentation](https://zero.rocicorp.dev/docs)
- [Zero Quickstart](https://zero.rocicorp.dev/docs/quickstart)
- [Zero Deployment Guide](https://zero.rocicorp.dev/docs/deployment)
- [`hello-zero` Repository](https://github.com/rocicorp/hello-zero)
- [Neon Documentation](/docs)
- [Canvas - A collaborative drawing app built with Zero and Neon](https://github.com/neondatabase-labs/canvas)

<NeedHelp/>
