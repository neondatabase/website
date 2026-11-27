---
title: Connect a Rust application to Neon
subtitle: Create a Cargo project, link it with neon link, and query Lakebase Postgres from Rust with sqlx
summary: >-
  To connect a Rust app to Lakebase Postgres on Neon, create a Cargo project, run
  neon link to write DATABASE_URL to .env.local, and query it with sqlx. Covers one
  runnable example (create, insert, select, update, delete, and a transaction),
  running the app elsewhere, troubleshooting, and next steps.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/rust
  - /docs/integrations/rust
updatedOn: '2026-11-21T00:01:32.800Z'
---

<PromptBlock src="/prompts/rust-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Rust project"]} />

<Steps>

## Create a Rust project

Create a project with [Cargo](https://doc.rust-lang.org/cargo/), Rust's build tool and package manager. Install Rust with [rustup](https://www.rust-lang.org/tools/install), or run `rustup update` if you have it. You need Rust 1.94 or later, the minimum for sqlx 0.9. Skip this step if you already have a Rust project.

```bash filename="Terminal"
cargo new neon-rust-app
cd neon-rust-app
```

This creates `Cargo.toml`, a `src/main.rs` placeholder, and a git repository with a `.gitignore`.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is Rust.

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

The first tab runs `neon link --no-config` in your project directory, which writes `DATABASE_URL` into `.env.local` (or `.env` if one exists); the second tab copies the connection string into that file by hand. Add the env files to `.gitignore` first, so the connection string stays out of git:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

Cargo doesn't read env files itself. The code loads `.env.local`, or `.env` if `neon link` wrote that, with the dotenvy crate in debug builds, so `cargo run` picks it up without a shell variable.

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

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

Then change `sslmode=require` to `sslmode=verify-full` in the same file. `require` doesn't check the server certificate. `verify-full` checks it, and the host name, against sqlx's built-in root certificates. Neon's certificates chain to ISRG Root X1, which that set includes.

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install [sqlx](https://docs.rs/sqlx/latest/sqlx/), an async Postgres toolkit for Rust with a built-in connection pool. Rust packages are called crates, and sqlx is one of them. Its `runtime-tokio` feature runs it on [Tokio](https://tokio.rs/), Rust's async runtime. Its `tls-rustls-ring-webpki` feature adds TLS through rustls, a Rust TLS library, so no system OpenSSL library is needed. A feature is an optional part of a crate that you switch on with `--features`.

The `sslmode` setting in the connection string turns TLS on, so the code doesn't configure TLS itself. sqlx ignores the `channel_binding` parameter in that string. The examples use the `query` functions, not sqlx's `query!` macros, so they don't need a database at build time.

```bash filename="Terminal"
cargo add sqlx --features runtime-tokio,tls-rustls-ring-webpki,postgres
cargo add tokio --features macros,rt-multi-thread
cargo add dotenvy
```

`cargo add` records the crates in `Cargo.toml` and downloads them on the next build. `tokio` runs the `async` code, and `dotenvy` loads the env file.

## Connect and run a query

In a new project, replace the `src/main.rs` that `cargo new` created with a script that prints the Postgres version. The script loads the env file in debug builds, which is what `cargo run` builds.

```rust filename="src/main.rs"
use sqlx::PgPool;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        // neon link writes .env.local, or .env if the project already has one.
        let _ = dotenvy::from_filename(".env.local").or_else(|_| dotenvy::dotenv());
    }
    let pool = PgPool::connect(&std::env::var("DATABASE_URL")?).await?;

    let version: String = sqlx::query_scalar("SELECT version()").fetch_one(&pool).await?;
    println!("{version}");

    Ok(())
}
```

```bash filename="Terminal"
cargo run
```

The output shows the Postgres version of your database, which confirms the connection:

```text
PostgreSQL 18.x ...
```

</Steps>

## Examples

Each example is one script that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The script deletes the rows it adds, so you can run it again. Run these commands from the project root, the directory with `Cargo.toml`. Create an `examples` directory there (`cargo new` doesn't make one), save the script as `examples/books.rs`, and run it with `cargo run --example books`. The examples create the `books` table and write rows to the branch that your `DATABASE_URL` points at, so run them on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```rust filename="examples/books.rs"
use sqlx::PgPool;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    if cfg!(debug_assertions) {
        // neon link writes .env.local, or .env if the project already has one.
        let _ = dotenvy::from_filename(".env.local").or_else(|_| dotenvy::dotenv());
    }
    let pool = PgPool::connect(&std::env::var("DATABASE_URL")?).await?;

    // Create a table
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INT
        )",
    )
    .execute(&pool)
    .await?;

    // Insert a row and get its id back
    let dune_id: i32 = sqlx::query_scalar(
        "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
    )
    .bind("Dune")
    .bind("Frank Herbert")
    .bind(1965)
    .fetch_one(&pool)
    .await?;

    // Select the row
    let book: (i32, String, i32) =
        sqlx::query_as("SELECT id, title, year FROM books WHERE id = $1")
            .bind(dune_id)
            .fetch_one(&pool)
            .await?;
    println!("Selected: {book:?}");

    // Update the row
    sqlx::query("UPDATE books SET year = $1 WHERE id = $2")
        .bind(1966)
        .bind(dune_id)
        .execute(&pool)
        .await?;

    // Insert two rows in a transaction: both commit, or neither does
    let mut tx = pool.begin().await?;
    let emma_id: i32 = sqlx::query_scalar(
        "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
    )
    .bind("Emma")
    .bind("Jane Austen")
    .bind(1815)
    .fetch_one(&mut *tx)
    .await?;
    let persuasion_id: i32 = sqlx::query_scalar(
        "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
    )
    .bind("Persuasion")
    .bind("Jane Austen")
    .bind(1817)
    .fetch_one(&mut *tx)
    .await?;
    tx.commit().await?;

    let all: Vec<(String, i32)> = sqlx::query_as("SELECT title, year FROM books ORDER BY year")
        .fetch_all(&pool)
        .await?;
    println!("All books: {all:?}");

    // Delete the rows this script added
    sqlx::query("DELETE FROM books WHERE id = ANY($1)")
        .bind(vec![dune_id, emma_id, persuasion_id])
        .execute(&pool)
        .await?;

    Ok(())
}
```

The transaction commits when `tx.commit()` succeeds. If the code returns an error before that, the transaction rolls back when `tx` is dropped, so the two inserts never leave a partial result.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead. Release builds (`cargo build --release`) don't load the env file, so the variable has to come from the host. For production, use your default branch's pooled connection string, which goes through [Neon's connection pooler](/docs/connect/connection-pooling): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Change `sslmode=require` in that string to `sslmode=verify-full`, as in [Connect your app to the project](#connect-your-app-to-the-project). `PgPool` is sqlx's pool in your app: create one at startup and share it instead of connecting for each request. It returns each connection when its query finishes, so it works with Neon's pooler (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)).

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below says what the service does.

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

`Error: NotPresent`
: The program ran without `DATABASE_URL` in its environment. Run it with `cargo run` from the project directory, where the env file is, and check that the file sets `DATABASE_URL`, or set the variable in your shell.

</DefinitionList>

## Next steps

- [Connection pooling](/docs/connect/connection-pooling): When to use the pooled connection string, and how it handles prepared statements.
- [Branching](/docs/introduction/branching): Give each change its own copy-on-write branch of your database.

<NeedHelp/>
