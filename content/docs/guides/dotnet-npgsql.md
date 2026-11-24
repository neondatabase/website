---
title: Connect a .NET (C#) application to Neon
subtitle: Create a console app, link it with neon link, and query Lakebase Postgres from C# with Npgsql
summary: >-
  To connect a .NET app to Lakebase Postgres on Neon, create a console app, run
  neon link to write DATABASE_URL to .env.local, and query it with Npgsql.
  Covers one runnable example (create, insert, select, update, delete, and a
  transaction), running the app elsewhere, troubleshooting, and the Entity
  Framework guide as the next step.
enableTableOfContents: true
updatedOn: '2026-11-20T21:26:47.058Z'
---

<PromptBlock src="/prompts/dotnet-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your .NET project"]} />

<Steps>

## Create a .NET project

Create a console app with the .NET SDK's `dotnet` tool. You need the .NET 10 SDK, the current long-term support (LTS) release, which Microsoft supports until November 14, 2028. Skip this step if you already have a .NET project.

```bash filename="Terminal"
dotnet new console -o neon-dotnet-app
cd neon-dotnet-app
```

This creates `neon-dotnet-app.csproj` and a `Program.cs` placeholder. For an ASP.NET Core app, see the [Entity Framework guide](/docs/guides/dotnet-entity-framework) instead.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is .NET.

```bash filename="Terminal"
npx neon@latest skills
```

The [Neon MCP Server](/docs/ai/neon-mcp-server) connects your agent to Neon's tools as well; its page covers the setup.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and [Managed Better Auth](/docs/auth/overview) run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project. The npm install needs Node.js 20.19 or later; without Node.js, run `brew install neonctl` (Homebrew) or use another option on the install page:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

The first tab runs `neon link --no-config` in your project directory, which writes `DATABASE_URL` into `.env.local` (or `.env` if one exists); the second tab copies the connection string into that file by hand. Add the env files to `.gitignore` first, so the connection string stays out of git. If the project has no `.gitignore` yet, run `dotnet new gitignore` before this command:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

.NET doesn't read env files itself. The program in [Connect and run a query](#connect-and-run-a-query) loads them with DotNetEnv, so you don't set variables by hand.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's Neon variables, including `DATABASE_URL`, into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for Node.js projects.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the pooled connection string from **Connect** in the Console nav, or from the API response, in its `postgresql://` form. Add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install the Npgsql driver

Install [Npgsql](https://www.npgsql.org/doc/index.html), the .NET data provider for Postgres, and [DotNetEnv](https://github.com/tonerdo/dotnet-env), which loads the env file if one exists; on a host, `DATABASE_URL` is set instead. Npgsql 11 targets .NET 10, the SDK this guide uses.

```bash filename="Terminal"
dotnet add package Npgsql
dotnet add package DotNetEnv
```

`dotnet add package` records each package in the `.csproj` file and downloads it from NuGet. Npgsql's connection string is a list of keywords, such as `Host=...;Password=...`, so the next step converts the `postgresql://` URL.

## Connect and run a query

Replace the `Program.cs` that `dotnet new console` created with a program that loads the env file, converts `DATABASE_URL`, and prints the Postgres version.

```csharp filename="Program.cs"
using DotNetEnv;
using Npgsql;

Env.NoClobber().LoadMulti(new[] { ".env.local", ".env" });
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidOperationException("DATABASE_URL is not set.");

await using var conn = new NpgsqlConnection(ToNpgsqlConnectionString(databaseUrl));
await conn.OpenAsync();

await using var cmd = new NpgsqlCommand("SELECT version()", conn);
Console.WriteLine(await cmd.ExecuteScalarAsync());

// Npgsql takes keyword connection strings, not postgresql:// URLs
static string ToNpgsqlConnectionString(string url)
{
    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':', 2);
    return new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Database = uri.AbsolutePath.TrimStart('/'),
        Username = Uri.UnescapeDataString(userInfo[0]),
        Password = Uri.UnescapeDataString(userInfo[1]),
        SslMode = SslMode.VerifyFull,
        ChannelBinding = ChannelBinding.Require,
    }.ConnectionString;
}
```

`ToNpgsqlConnectionString` splits the URL into the host, database, user name, and password that Npgsql expects. It sets `SSL Mode` (whether the connection uses TLS) to `VerifyFull`, which is stricter than `sslmode=require` because it checks the server certificate. It sets `Channel Binding` (a check that ties the login to the TLS connection) to `Require`, which matches `channel_binding=require` in the URL. Neon's certificates are publicly trusted, so no certificate file is needed.

`DotNetEnv` loads `.env.local`, or `.env` if `neon link` wrote there. `NoClobber` keeps any value already set in your shell. See [Run it elsewhere](#run-it-elsewhere) for production.

Run the program from the project directory:

```bash filename="Terminal"
dotnet run
```

The output starts with `PostgreSQL` and your database's Postgres version, which confirms the connection.

</Steps>

## Examples

Each example is one program that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The program deletes the rows it adds, so you can run it again. Replace `Program.cs` with the code below and run it with `dotnet run`. The examples create the `books` table and write rows to the branch that your `DATABASE_URL` points at, so run them on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```csharp filename="Program.cs"
using DotNetEnv;
using Npgsql;

Env.NoClobber().LoadMulti(new[] { ".env.local", ".env" });
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? throw new InvalidOperationException("DATABASE_URL is not set.");

await using var conn = new NpgsqlConnection(ToNpgsqlConnectionString(databaseUrl));
await conn.OpenAsync();

// Create a table
await using (var cmd = new NpgsqlCommand(@"
    CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INT
    )", conn))
{
    await cmd.ExecuteNonQueryAsync();
}

// Insert a row and get its id back
var duneId = await InsertBookAsync(conn, null, "Dune", "Frank Herbert", 1965);

// Select the row
await using (var cmd = new NpgsqlCommand("SELECT id, title, year FROM books WHERE id = @id", conn))
{
    cmd.Parameters.AddWithValue("id", duneId);
    await using var reader = await cmd.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        Console.WriteLine($"Selected: {reader.GetInt32(0)}, {reader.GetString(1)}, {reader.GetInt32(2)}");
    }
}

// Update the row
await using (var cmd = new NpgsqlCommand("UPDATE books SET year = @year WHERE id = @id", conn))
{
    cmd.Parameters.AddWithValue("year", 1966);
    cmd.Parameters.AddWithValue("id", duneId);
    await cmd.ExecuteNonQueryAsync();
}

// Insert two rows in a transaction: both commit, or neither does
int emmaId, persuasionId;
await using (var tx = await conn.BeginTransactionAsync())
{
    emmaId = await InsertBookAsync(conn, tx, "Emma", "Jane Austen", 1815);
    persuasionId = await InsertBookAsync(conn, tx, "Persuasion", "Jane Austen", 1817);
    await tx.CommitAsync();
}

// Select all rows
await using (var cmd = new NpgsqlCommand("SELECT title, year FROM books ORDER BY year", conn))
await using (var reader = await cmd.ExecuteReaderAsync())
{
    while (await reader.ReadAsync())
    {
        Console.WriteLine($"All books: {reader.GetString(0)}, {reader.GetInt32(1)}");
    }
}

// Delete the rows this program added
await using (var cmd = new NpgsqlCommand("DELETE FROM books WHERE id = ANY(@ids)", conn))
{
    cmd.Parameters.AddWithValue("ids", new[] { duneId, emmaId, persuasionId });
    await cmd.ExecuteNonQueryAsync();
}

static async Task<int> InsertBookAsync(NpgsqlConnection conn, NpgsqlTransaction? tx, string title, string author, int year)
{
    await using var cmd = new NpgsqlCommand(
        "INSERT INTO books (title, author, year) VALUES (@title, @author, @year) RETURNING id", conn, tx);
    cmd.Parameters.AddWithValue("title", title);
    cmd.Parameters.AddWithValue("author", author);
    cmd.Parameters.AddWithValue("year", year);
    return (int)(await cmd.ExecuteScalarAsync())!;
}

// Npgsql takes keyword connection strings, not postgresql:// URLs
static string ToNpgsqlConnectionString(string url)
{
    var uri = new Uri(url);
    var userInfo = uri.UserInfo.Split(':', 2);
    return new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Database = uri.AbsolutePath.TrimStart('/'),
        Username = Uri.UnescapeDataString(userInfo[0]),
        Password = Uri.UnescapeDataString(userInfo[1]),
        SslMode = SslMode.VerifyFull,
        ChannelBinding = ChannelBinding.Require,
    }.ConnectionString;
}
```

`InsertBookAsync` runs a parameterized `INSERT` and returns the new row's id. The transaction commits only when `CommitAsync` runs. Npgsql rolls back a transaction that isn't committed when it's disposed, so an error before the commit leaves the table unchanged.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file. `DotNetEnv` skips a missing file, so the same program runs there unchanged. For production, use your default branch's pooled connection string, which goes through [Neon's connection pooler](/docs/connect/connection-pooling): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Npgsql pools connections in the app by default and returns each one when it's disposed, as `await using` does in the examples, so you don't need another pool on top of Neon's pooler (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)).

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below links to its docs.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files. See [Object Storage](/docs/storage/overview).

AI Gateway
: Routes calls to models from Anthropic, OpenAI, Google, and more through one endpoint on your branch. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute (the server that runs your code next to your database), called over HTTP. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`InvalidOperationException: DATABASE_URL is not set.`
: The program ran without `DATABASE_URL` in its environment. Run it from the project directory, where `neon link` wrote the env file, or set the variable in your shell. If the program reaches a different database than your branch, unset `DATABASE_URL` in your shell, because values already set win over the env file.

</DefinitionList>

## Next steps

- [Connect an Entity Framework application to Neon](/docs/guides/dotnet-entity-framework): Use Entity Framework Core's models and migrations instead of raw SQL.

<NeedHelp/>
