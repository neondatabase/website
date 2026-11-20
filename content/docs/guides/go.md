---
title: Connect a Go application to Neon
subtitle: Create a Go module, link it with neon link, and query Lakebase Postgres from Go with pgx
summary: >-
  To connect a Go app to Lakebase Postgres on Neon, create a Go module, run neon
  link to write DATABASE_URL to .env.local, and query it with pgx v5. Covers one
  runnable example (create, insert, select, update, delete, and a transaction),
  running the app elsewhere, troubleshooting, and the GORM guide as a next step.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/go
  - /docs/integrations/go
updatedOn: '2026-11-20T21:24:22.510Z'
---

<PromptBlock src="/prompts/golang-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Go project"]} />

<Steps>

## Create a Go project

Create a Go module with `go mod init`, the Go command that starts a project and records its dependencies. You need Go 1.25 or later, the minimum for pgx v5.13, the version `go get` installs in [Install a Postgres driver](#install-a-postgres-driver). If Go isn't installed, follow the [official installation guide](https://go.dev/doc/install). Skip this step if you already have a Go module.

```bash filename="Terminal"
mkdir neon-go-app
cd neon-go-app
go mod init neon-go-app
```

This creates a `go.mod` file that lists the module's dependencies. It doesn't create a git repository, so run `git init` if you want one.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is Go.

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

Go doesn't read env files itself. The examples load them with [godotenv](https://github.com/joho/godotenv), which you install in [Install a Postgres driver](#install-a-postgres-driver).

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

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install [pgx](https://github.com/jackc/pgx) v5, the Postgres driver and toolkit for Go, and godotenv, which loads your env file in development. pgx takes the connection string from `neon link` as it is, including `channel_binding=require`, so you don't need to change it.

```bash filename="Terminal"
go get github.com/jackc/pgx/v5 github.com/joho/godotenv
```

`go get` adds both packages to `go.mod` and downloads them. The [pgx reference](https://pkg.go.dev/github.com/jackc/pgx/v5) lists its API.

## Connect and run a query

Create `main.go` in the project directory with a program that connects and prints the Postgres version. The `godotenv` calls read `.env.local`, then `.env`. Variables already set in your shell take priority over both.

```go filename="main.go"
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	// neon link writes .env.local, or .env if your project already has one.
	// In production, set DATABASE_URL in the host's environment instead.
	_ = godotenv.Load(".env.local")
	_ = godotenv.Load()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, databaseURL)
	if err != nil {
		log.Fatal("Unable to connect: ", err)
	}
	defer conn.Close(ctx)

	var version string
	if err := conn.QueryRow(ctx, "SELECT version()").Scan(&version); err != nil {
		log.Fatal("Query failed: ", err)
	}
	fmt.Println(version)
}
```

```bash filename="Terminal"
go run .
```

The output shows the Postgres version of your database, which confirms the connection. The exact text varies with the version and platform:

```text
PostgreSQL 18.x ...
```

</Steps>

## Examples

The example is one program that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. It deletes the rows it adds, so you can run it again. Save it as `cmd/books/main.go` (create the `cmd/books` directory first), then run it with `go run ./cmd/books`. It lives in its own directory because two `main` functions in one directory won't build.

The example writes to the branch that your `DATABASE_URL` points at, so run it on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```go filename="cmd/books/main.go"
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load(".env.local")
	_ = godotenv.Load()

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, databaseURL)
	if err != nil {
		log.Fatal("Unable to connect: ", err)
	}
	defer conn.Close(ctx)

	// Create a table
	_, err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS books (
			id SERIAL PRIMARY KEY,
			title TEXT NOT NULL,
			author TEXT NOT NULL,
			year INT
		)`)
	if err != nil {
		log.Fatal("Create table failed: ", err)
	}

	// Insert a row and get its id back
	var duneID int
	err = conn.QueryRow(ctx,
		"INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
		"Dune", "Frank Herbert", 1965,
	).Scan(&duneID)
	if err != nil {
		log.Fatal("Insert failed: ", err)
	}

	// Select the row
	var title string
	var year int
	err = conn.QueryRow(ctx, "SELECT title, year FROM books WHERE id = $1", duneID).Scan(&title, &year)
	if err != nil {
		log.Fatal("Select failed: ", err)
	}
	fmt.Println("Selected:", title, year)

	// Update the row
	_, err = conn.Exec(ctx, "UPDATE books SET year = $1 WHERE id = $2", 1966, duneID)
	if err != nil {
		log.Fatal("Update failed: ", err)
	}

	// Insert two rows in a transaction: both commit, or neither does
	tx, err := conn.Begin(ctx)
	if err != nil {
		log.Fatal("Begin failed: ", err)
	}
	defer tx.Rollback(ctx) // does nothing after a successful Commit

	var emmaID, persuasionID int
	err = tx.QueryRow(ctx,
		"INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
		"Emma", "Jane Austen", 1815,
	).Scan(&emmaID)
	if err != nil {
		log.Fatal("Insert failed: ", err)
	}
	err = tx.QueryRow(ctx,
		"INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id",
		"Persuasion", "Jane Austen", 1817,
	).Scan(&persuasionID)
	if err != nil {
		log.Fatal("Insert failed: ", err)
	}
	if err := tx.Commit(ctx); err != nil {
		log.Fatal("Commit failed: ", err)
	}

	// Select all rows, ordered by year
	rows, err := conn.Query(ctx, "SELECT title, year FROM books ORDER BY year")
	if err != nil {
		log.Fatal("Select failed: ", err)
	}
	fmt.Println("All books:")
	for rows.Next() {
		var t string
		var y int
		if err := rows.Scan(&t, &y); err != nil {
			log.Fatal("Scan failed: ", err)
		}
		fmt.Printf("  %s (%d)\n", t, y)
	}
	if err := rows.Err(); err != nil {
		log.Fatal("Rows failed: ", err)
	}

	// Delete the rows this program added
	_, err = conn.Exec(ctx, "DELETE FROM books WHERE id = ANY($1)", []int{duneID, emmaID, persuasionID})
	if err != nil {
		log.Fatal("Delete failed: ", err)
	}
	fmt.Println("Deleted the rows this program added.")
}
```

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file. For production, use your default branch's pooled connection string, which goes through [Neon's connection pooler](/docs/connect/connection-pooling): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Neon's pooler already pools connections, so you don't need to add a pool in your app; if you do, return connections to it promptly (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)).

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below says what the service does.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files, so any S3 client works from Go. See [Object Storage](/docs/storage/overview).

AI Gateway
: Routes calls to models from Anthropic, OpenAI, Google, and more through one OpenAI-compatible endpoint on your branch. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute (the server that runs your code next to your database), called over HTTP. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`DATABASE_URL is not set`
: The program ran without `DATABASE_URL` in its environment. Run it from the project directory, where the env file is, or set the variable in your shell.

`SSL SYSCALL error: EOF detected`, or a similar connection-reset error
: The app reused a connection after the Neon compute was suspended for inactivity. This mainly affects long-running servers that keep a connection pool open, such as a `pgxpool` pool. The request that hits the closed connection can fail; the next request opens a new connection, so retrying the request resolves it.

`no required module provides package github.com/jackc/pgx/v5`
: The `go get` command in [Install a Postgres driver](#install-a-postgres-driver) hasn't run, so `go.mod` doesn't list the package. Run that command from the project directory, then run the program again. The same error names `github.com/joho/godotenv` when that package is missing.

</DefinitionList>

## Next steps

- [Using GORM with Lakebase Postgres](/guides/golang-gorm-postgres): Use GORM's models and queries instead of raw SQL.

<NeedHelp/>
