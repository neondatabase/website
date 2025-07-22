---
title: Neon Local Connect Extension
enableTableOfContents: true
subtitle: Develop with Neon using Neon Local Connect in VS Code, Cursor, Windsurf, and other editors
updatedOn: '2025-07-16T16:34:45.288Z'
---

The Neon Local Connect extension lets you connect to any Neon branch using a familiar localhost connection string. Available for VS Code, Cursor, Windsurf, and other VS Code-compatible editors, the underlying Neon Local service handles the routing, authentication, and branch management behind the scenes. Your app connects to `localhost:5432` like a local Postgres instance, but Neon Local routes traffic to your actual Neon branch in the cloud.

You can use this connection string in your app:

```env
DATABASE_URL="postgres://neon:npg@localhost:5432/<database_name>"
```

Switch branches, and your app keeps using the same connection string.

## What you can do

With the Neon Local Connect extension, you can:

- Instantly connect to any Neon branch using a single, static localhost connection string
- Create, switch, or reset branches directly from the extension panel
- Automate ephemeral branch creation and cleanup, no scripts required
- Open the Neon SQL Editor or Table View for your current branch with one click
- Launch a psql shell in your integrated terminal for direct SQL access

All without leaving your editor.  
Learn more about [branching in Neon](/docs/guides/branching-intro) and [Neon Local](/docs/local/neon-local).

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [VS Code 1.85.0+](https://code.visualstudio.com/), [Cursor](https://cursor.sh/), [Windsurf](https://codeium.com/windsurf), or other VS Code-compatible editor
- A [Neon account](https://neon.tech) and [API key](/docs/manage/api-keys) (for ephemeral branches only; you can also create new keys from the extension)

<Steps>

## Install the extension

The Neon Local Connect extension is available on both marketplaces:

**For VS Code:**

- Open the [Neon Local Connect extension page](https://marketplace.visualstudio.com/items?itemName=databricks.neon-local-connect) in the VS Code Marketplace.
- Click **Install**.

**For Cursor, Windsurf, and other VS Code-compatible editors:**

- Open the [Neon Local Connect extension page](https://open-vsx.org/extension/databricks/neon-local-connect) in the OpenVSX Registry.
- Click **Install** or follow your editor's extension installation process.

## Sign in to Neon

- Open the Neon Local Connect panel in the VS Code sidebar and click **Sign in**.

  ![Sign in with your Neon account](/docs/local/sign-in.png)

- Authenticate with Neon in your browser when prompted.

  ![Neon OAuth authorization in browser](/docs/local/authorize.png)

## Connect to a branch

You'll need to make a few selections — organization, project, and then branch — before connecting. If you're new to Neon, this reflects our object hierarchy: organizations contain projects, and projects contain branches. [Learn more about how Neon organizes your data.](/docs/manage/overview)

You can connect to two types of branches:

- **Existing branch:**  
  For ongoing development, features, or team collaboration. The branch remains available until you delete it. Use this when you want to keep your changes and collaborate with others.

- **Ephemeral branch:**  
  For temporary, disposable environments (tests, CI, experiments). The extension creates the branch when you connect and deletes it automatically when you disconnect—no manual cleanup required. In CI or CLI workflows, you’d have to script this yourself. The extension does it for you.

As part of choosing your connection, you'll also be asked to choose driver type: **PostgreSQL** for most Postgres connections, or **Neon serverless** for edge/HTTP. [Read more about connection types](/docs/connect/choose-connection).

<Tabs labels={["Existing branch", "Ephemeral branch"]}>

<TabItem>
Connect to an existing branch (e.g., `main`, `development`, or a feature branch):

![Existing branch connected](/docs/local/connected.png)
</TabItem>

<TabItem>
Connect to an ephemeral branch (created just for your session):

![Ephemeral branch connected](/docs/local/ephemeral_connected.png)
</TabItem>

</Tabs>

<Admonition type="note">
Selecting an ephemeral branch will prompt you to create and import API key for authentication.
</Admonition>

## Create a new branch

Or you can create a new persistent branch for feature development, bug fixes, or collaborative work:

1. Select your organization and project
2. Click **Create new branch...** in the branch dropdown
3. Enter a descriptive branch name (e.g., `feature/user-authentication`, `bugfix/login-validation`)
4. Choose the parent branch you want to branch from (e.g., `production`, `development`)

The extension creates the new branch and connects you immediately. This branch persists until you manually delete it.

## Use the static connection string

After connecting, find your local connection string in the extension panel. Copy it, update with your database name, and add it to your app’s `.env` or config.

![Local connection details](/docs/local/connection_string.png)

```env
DATABASE_URL="postgres://neon:npg@localhost:5432/<database_name>"
```

Your app connects to `localhost:5432`, while the Neon Local service routes the traffic to your actual Neon branch in the cloud.

> You only need to set this connection string once, no matter how many times you create, switch, or reset branches. Neon Local handles all the routing behind the scenes, so you never have to update your app config again.

## Start developing

Your application now connects to `localhost:5432` using the driver you selected in the extension (Postgres or Neon serverless). See the quickstart for your language or framework for more details.

- [Framework quickstarts](/docs/get-started-with-neon/frameworks)
- [Language quickstarts](/docs/get-started-with-neon/languages)

</Steps>

## Available commands

You can run any command by opening the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and typing “Neon Local Connect: ...”.

_All commands below are available under the “Neon Local Connect:” prefix in the Command Palette._

| Command                  | Description                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **Import API Key**       | Import your Neon API key for authentication.                                         |
| **Launch PSQL**          | Open a psql shell in your integrated terminal for direct SQL access.                 |
| **Open SQL Editor**      | Launch the Neon SQL Editor in your browser for advanced queries and data inspection. |
| **Open Table View**      | Browse your database schema and data in the Neon Console.                            |
| **Disconnect**           | Stop the local proxy connection.                                                     |
| **Clear Authentication** | Remove stored authentication tokens.                                                 |

## Panel actions

And here's what you can do directly from the Neon panel.

<table>
  <thead>
    <tr>
      <th>Action</th>
      <th>What it does</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="/docs/local/reset.png" alt="Reset from parent branch" style={{ verticalAlign: "middle" }} />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <strong>Reset from parent branch</strong> — Instantly reset your branch to match its parent’s state. Great for rerunning tests or starting fresh. <a href="/docs/guides/reset-from-parent">Learn more</a>
      </td>
    </tr>
    <tr>
      <td>
        <img src="/docs/local/sql-editor.png" alt="Open SQL Editor" style={{ verticalAlign: "middle" }} />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <strong>Open SQL Editor</strong> — Launch the Neon SQL Editor in your browser for advanced queries and data inspection. <a href="/docs/get-started-with-neon/query-with-neon-sql-editor">Learn more</a>
      </td>
    </tr>
    <tr>
      <td>
        <img src="/docs/local/table_view.png" alt="Open Table View" style={{ verticalAlign: "middle" }} />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <strong>Open Table View</strong> — Browse your database schema and data in the Neon Console. <a href="/docs/guides/tables">Learn more</a>
      </td>
    </tr>
    <tr>
      <td>
        <img src="/docs/local/psql.png" alt="Launch PSQL" style={{ verticalAlign: "middle" }} />
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <strong>Launch PSQL</strong> — Open a psql shell in your integrated terminal for direct SQL access. Use to test schema changes, run migrations, or debug from your IDE. <a href="/docs/connect/query-with-psql-editor">Learn more</a>
      </td>
    </tr>
  </tbody>
</table>

## Next steps & resources

- [Neon Local documentation](/docs/local/neon-local)
- [Branching in Neon](/docs/guides/branching-intro)
- [Serverless driver](/docs/serverless/serverless-driver)
- [API keys](/docs/manage/api-keys)

<NeedHelp/>
