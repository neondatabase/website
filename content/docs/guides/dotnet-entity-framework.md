---
title: Connect from Entity Framework Core to Neon
subtitle: Create a Neon project, link it with neon link, and define a model, run a migration, and query Lakebase Postgres with Entity Framework Core and Npgsql
summary: >-
  To connect an Entity Framework Core app to Lakebase Postgres on Neon, run
  neon link to write a pooled DATABASE_URL and a direct DATABASE_URL_UNPOOLED,
  then define a model, run a migration with dotnet ef through the direct
  connection, and query it with Npgsql.EntityFrameworkCore.PostgreSQL. Covers
  the design-time DbContext factory, why migrations use the direct connection
  (Neon recommends it for schema changes), an optional development branch, the
  agent prompt, and troubleshooting.
enableTableOfContents: true
updatedOn: '2026-11-20T21:29:15.992Z'
---

<PromptBlock src="/prompts/dotnet-ef-prompt.md" labels={["Set up your agent and follow this guide", "Look up Entity Framework docs", "Connect your Entity Framework project"]} />

<Steps>

## Start from a .NET project

Entity Framework Core (EF Core), the .NET object-relational mapper, requires .NET 10, the current long-term support (LTS) release, so this guide needs the .NET 10 SDK. Use a console app you already have, or create one with the steps in [Connect a .NET (C#) application to Neon](/docs/guides/dotnet-npgsql). Skip this step if you already have a project. For an ASP.NET Core app, the same steps apply, but register the context in `Program.cs` with `AddDbContext` instead of the console code shown below.

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

Get two connection strings into an env file: `DATABASE_URL`, the **pooled** connection, which goes through Neon's connection pooler, and `DATABASE_URL_UNPOOLED`, the **direct** connection, which goes straight to Postgres. Add the env files to `.gitignore` first, so the connection strings stay out of git. If the project has no `.gitignore` yet, run `dotnet new gitignore` first:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

.NET doesn't read env files itself. The code in the next steps loads them with DotNetEnv, so you don't set variables by hand.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't:

```bash filename="Terminal"
neon link --no-config
```

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's Neon variables, including `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for Node.js projects.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy both connection strings from **Connect** in the Neon Console, or from the API response, and add them to a `.env.local` file in your project directory. Use the pooled string for `DATABASE_URL` (its host name has `-pooler`) and the direct string for `DATABASE_URL_UNPOOLED`. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install Entity Framework Core and the Npgsql provider

The `Microsoft.EntityFrameworkCore.Design` package, the `Npgsql.EntityFrameworkCore.PostgreSQL` provider, and the `DotNetEnv` package come from NuGet with these commands. Run them in the project directory. The EF Core packages are pinned: 10.0.15 for the design package, and 10.0.3 for Npgsql's provider, which targets EF Core 10 (its EF Core 11 build is still a release candidate). DotNetEnv has no pin. Use the same EF Core version for the tool:

```bash filename="Terminal"
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.15
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0.3
dotnet add package DotNetEnv
```

Install the `dotnet ef` command as a local tool, so the project pins its version in a manifest file:

```bash filename="Terminal"
dotnet tool install dotnet-ef --version 10.0.15
```

This writes a `dotnet-tools.json` manifest in the project directory. Run `dotnet ef` from the project directory. On a new clone, run `dotnet tool restore` first.

`dotnet add package` records each package in the `.csproj` file and downloads it from NuGet. Npgsql's connection string is a list of keywords, such as `Host=...;Password=...`, so the next step converts the `postgresql://` URLs before EF Core uses them.

## Configure the DbContext

The code below is for a console app. It has three files:

- `NeonConnection.cs` reads an env variable and converts its `postgresql://` URL to Npgsql's keyword format.
- `AppDbContext.cs` defines the `Book` model and the `DbContext` that maps it.
- `AppDbContextFactory.cs` tells the `dotnet ef` tool how to build the context at design time, with the direct connection.

The factory is this guide's choice, not a requirement. In a console app, without a factory the tool falls back to a constructor with no parameters or to `OnConfiguring`, and neither can pick the direct connection from the env file. Host-based apps first try the host builder instead.

Create `NeonConnection.cs`:

```csharp filename="NeonConnection.cs"
using DotNetEnv;
using Npgsql;

namespace NeonEfApp;

public static class NeonConnection
{
    // Reads an env variable from .env.local, or .env if neon link wrote there
    public static string ConnectionString(string variable = "DATABASE_URL")
    {
        Env.NoClobber().LoadMulti(new[] { ".env.local", ".env" });
        var databaseUrl = Environment.GetEnvironmentVariable(variable)
            ?? throw new InvalidOperationException($"{variable} is not set.");
        return ToNpgsqlConnectionString(databaseUrl);
    }

    // Npgsql takes keyword connection strings, not postgresql:// URLs
    public static string ToNpgsqlConnectionString(string url)
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
}
```

`ToNpgsqlConnectionString` splits the URL into the host, database, user name, and password that Npgsql expects. It sets `SSL Mode` (whether the connection uses TLS) to `VerifyFull`, which is stricter than `sslmode=require` because it checks the server certificate. It sets `Channel Binding` (a check that ties the login to the TLS connection) to `Require`, which matches `channel_binding=require` in the URL. Neon's certificates are publicly trusted, so no certificate file is needed. `Env.NoClobber` keeps any value already set in your shell.

Create `AppDbContext.cs`:

```csharp filename="AppDbContext.cs"
using Microsoft.EntityFrameworkCore;

namespace NeonEfApp;

public class Book
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public int? Year { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
}
```

Create `AppDbContextFactory.cs`. The `dotnet ef` tool calls it to build the context for migrations, using `DATABASE_URL_UNPOOLED`:

```csharp filename="AppDbContextFactory.cs"
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NeonEfApp;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(NeonConnection.ConnectionString("DATABASE_URL_UNPOOLED"))
            .Options;
        return new AppDbContext(options);
    }
}
```

## Create a migration and apply it

Create the first migration, which writes the `Books` table definition into a `Migrations` folder, then apply it to the database. Run both from the project directory, on the branch your connection strings point to. That's the `dev` branch if you ran the optional [development branch](#work-on-a-development-branch-optional) step, and otherwise your default branch:

```bash filename="Terminal"
dotnet ef migrations add InitialCreate
dotnet ef database update
```

`database update` creates the `__EFMigrationsHistory` table and the `Books` table. It uses the direct connection, as explained in [Why two connection strings?](#why-two-connection-strings). After each model change, run `dotnet ef migrations add` with a new name, then `dotnet ef database update`.

## Query it

Replace `Program.cs` with a program that creates a book, reads it back, and prints the Postgres version. The app uses the pooled `DATABASE_URL`:

```csharp filename="Program.cs"
using Microsoft.EntityFrameworkCore;
using NeonEfApp;

await using var db = new AppDbContext(
    new DbContextOptionsBuilder<AppDbContext>()
        .UseNpgsql(NeonConnection.ConnectionString())
        .Options);

var book = new Book { Title = "Dune", Author = "Frank Herbert", Year = 1965 };
db.Books.Add(book);
await db.SaveChangesAsync();

var found = await db.Books.FirstAsync(b => b.Id == book.Id);
Console.WriteLine($"Book: {found.Id}, {found.Title}, {found.Author}, {found.Year}");

var version = await db.Database.SqlQuery<string>($"SELECT version() AS \"Value\"").SingleAsync();
Console.WriteLine($"Postgres version: {version}");
```

Run the program from the project directory:

```bash filename="Terminal"
dotnet run
```

The output shows the new book and the Postgres version. Each run adds one book, so run it on a development branch.

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through Neon's connection pooler. Migrations use the direct `DATABASE_URL_UNPOOLED`, because Neon recommends the direct connection for schema changes: the pooler runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode), which doesn't keep session state between transactions.

## Run it elsewhere

On a host, set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in its environment instead of an env file, and run `dotnet ef database update` with the direct one before the app starts. Get the strings with `neon connection-string main --pooled` and `neon connection-string main` in your own terminal, since each prints a password, and replace `main` with `production` if that's your default branch.

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each one branches with your database:

- [Object Storage](/docs/storage/overview) for uploads and files.
- [AI Gateway](/docs/ai-gateway/overview) for calls to models from Anthropic, OpenAI, Google, and more, through one endpoint.
- [Neon Functions](/docs/compute/functions/overview) for long-running Node.js compute next to your database.

## Troubleshooting

<DefinitionList>

`InvalidOperationException: DATABASE_URL is not set.`
: The program ran without `DATABASE_URL` in its environment. Run it from the project directory, where `neon link` wrote the env file, or set the variable in your shell. If the program reaches a different database than your branch, unset the variable in your shell, because values already set win over the env file.

`InvalidOperationException: DATABASE_URL_UNPOOLED is not set.`
: `dotnet ef` ran without `DATABASE_URL_UNPOOLED`, which the design-time factory reads for migrations. Run the command from the project directory, where `neon link` wrote both variables, and check that `.env.local` or `.env` contains the line.

`dotnet ef` isn't found
: The local tool isn't installed on this clone. Run `dotnet tool restore` in the project directory, then run `dotnet ef` from there.

</DefinitionList>

## Next steps

- [Connect a .NET (C#) application to Neon](/docs/guides/dotnet-npgsql): the Npgsql driver without an ORM, with raw SQL examples.

<NeedHelp/>
