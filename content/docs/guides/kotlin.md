---
title: Connect a Kotlin application to Neon
subtitle: Create a Gradle project, link it with neon link, and query Lakebase Postgres from Kotlin with the PostgreSQL JDBC driver
summary: >-
  To connect a Kotlin app to Lakebase Postgres on Neon, create a Gradle project,
  run neon link to write DATABASE_URL to .env.local, and query it with the
  PostgreSQL JDBC driver. Covers one runnable example (create, insert, select,
  update, delete, and a transaction), running the app elsewhere, troubleshooting,
  and the Java and Micronaut Kotlin guides as next steps.
enableTableOfContents: true
updatedOn: '2026-11-20T21:26:20.094Z'
---

<PromptBlock src="/prompts/kotlin-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Kotlin project"]} />

<Steps>

## Create a Kotlin project

Create a project with [Gradle](https://gradle.org/install/), the standard build tool for Kotlin. The command below uses the Kotlin DSL and runs without prompts. It needs JDK 21: the generated build sets a Java 21 toolchain. If no JDK 21 is installed, Gradle downloads one through the foojay resolver that `--java-version` adds to `settings.gradle.kts`, which needs network access. Skip this step if you already have a Kotlin project, and run the rest of the guide from the module that holds your app's code.

```bash filename="Terminal"
mkdir neon-kotlin-app
cd neon-kotlin-app
gradle init --type kotlin-application --dsl kotlin --package com.neon.quickstart --no-split-project --java-version 21 --use-defaults
cd app
```

This creates `neon-kotlin-app` with the Gradle wrapper (`gradlew`) and one module, `app`, which holds a sample `App.kt` in `app/src/main/kotlin` and a test in `app/src/test`. Gradle creates the `app` module even with `--no-split-project`, so the last command moves you into it. The rest of this guide runs from `app`, and its file paths are relative to `app`. `--use-defaults` answers the remaining questions.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is Kotlin.

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

## Install the PostgreSQL JDBC driver

Add the [PostgreSQL JDBC driver](https://jdbc.postgresql.org/documentation/) for Postgres (JDBC, Java Database Connectivity, is Java's standard database API), and [dotenv-kotlin](https://github.com/cdimascio/dotenv-kotlin), which loads the env file in development, to the `dependencies` block of `build.gradle.kts`:

```kotlin filename="build.gradle.kts"
implementation("org.postgresql:postgresql:42.7.14")
implementation("io.github.cdimascio:dotenv-kotlin:6.5.1")
```

Gradle downloads them on the next build. The [Java guide](/docs/guides/java) covers JDBC in more depth.

## Connect and run a query

Create `Database.kt` with a `connect()` function, which every example calls. It reads `DATABASE_URL` and converts it to the JDBC form. The PostgreSQL JDBC driver doesn't read `user:password@` from the URL, so the function passes the user and password separately. The driver also names the parameter `channelBinding`, not `channel_binding`, so the function renames it. Without the rename, pgJDBC ignores `channel_binding` and falls back to `prefer`, without an error.

```kotlin filename="src/main/kotlin/com/neon/quickstart/Database.kt"
package com.neon.quickstart

import io.github.cdimascio.dotenv.dotenv
import java.net.URI
import java.sql.Connection
import java.sql.DriverManager

fun connect(): Connection {
    val dotenv = dotenv {
        filename = ".env.local"
        ignoreIfMissing = true
    }
    val databaseUrl = dotenv["DATABASE_URL"] ?: error("DATABASE_URL is not set")

    val uri = URI(databaseUrl)
    val (user, password) = uri.userInfo.split(":", limit = 2)
    val query = uri.rawQuery.orEmpty().replace("channel_binding=", "channelBinding=")
    return DriverManager.getConnection(
        "jdbc:postgresql://${uri.rawAuthority.substringAfter('@')}${uri.rawPath}?$query",
        user,
        password
    )
}
```

Replace the sample `App.kt` in `src/main/kotlin/com/neon/quickstart/` with a script that prints the Postgres version:

```kotlin filename="src/main/kotlin/com/neon/quickstart/App.kt"
package com.neon.quickstart

fun main() {
    connect().use { conn ->
        conn.createStatement().use { stmt ->
            stmt.executeQuery("SELECT version()").use { rs ->
                rs.next()
                println(rs.getString(1))
            }
        }
    }
}
```

The generated test in `src/test` refers to the sample `App` class you just replaced, so delete the `src/test` directory. `../gradlew run` doesn't compile tests, but `../gradlew build` does.

Run the app from the `app` directory. The wrapper is in the parent directory, so run `../gradlew run`. On Windows, use `..\gradlew.bat run`:

```bash filename="Terminal"
../gradlew run
```

The output is the Postgres version of your database, which confirms the connection. `dotenv-kotlin` reads `.env.local` from the directory the app runs in, which is `app`, where `neon link` wrote it. If `neon link` wrote `.env`, change `filename` in `Database.kt` to `.env`.

</Steps>

## Examples

This example replaces `App.kt` with one program that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The program deletes the rows it adds, so you can run it again. If `App.kt` has code you wrote, don't replace it: ask first, or put the example in a new file and point `mainClass` at it. Run it on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```kotlin filename="src/main/kotlin/com/neon/quickstart/App.kt"
package com.neon.quickstart

import java.sql.Connection
import java.sql.SQLException

fun insertBook(conn: Connection, title: String, author: String, year: Int): Int =
    conn.prepareStatement("INSERT INTO books (title, author, year) VALUES (?, ?, ?) RETURNING id").use { ps ->
        ps.setString(1, title)
        ps.setString(2, author)
        ps.setInt(3, year)
        ps.executeQuery().use { rs ->
            rs.next()
            rs.getInt(1)
        }
    }

fun main() {
    connect().use { conn ->
        conn.createStatement().use { stmt ->
            stmt.execute(
                """
                CREATE TABLE IF NOT EXISTS books (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    author TEXT NOT NULL,
                    year INT
                )
                """.trimIndent()
            )
        }

        // Insert a row and get its id back
        val dune = insertBook(conn, "Dune", "Frank Herbert", 1965)

        // Select the row
        conn.prepareStatement("SELECT title, year FROM books WHERE id = ?").use { ps ->
            ps.setInt(1, dune)
            ps.executeQuery().use { rs ->
                while (rs.next()) {
                    println("Selected: ${rs.getString("title")} (${rs.getInt("year")})")
                }
            }
        }

        // Update the row
        conn.prepareStatement("UPDATE books SET year = ? WHERE id = ?").use { ps ->
            ps.setInt(1, 1966)
            ps.setInt(2, dune)
            ps.executeUpdate()
        }

        // Insert two rows in a transaction: both commit, or neither does
        conn.autoCommit = false
        val added = try {
            val ids = listOf(
                insertBook(conn, "Emma", "Jane Austen", 1815),
                insertBook(conn, "Persuasion", "Jane Austen", 1817),
            )
            conn.commit()
            ids
        } catch (e: SQLException) {
            conn.rollback()
            throw e
        } finally {
            conn.autoCommit = true
        }

        // Select all rows
        conn.createStatement().use { stmt ->
            stmt.executeQuery("SELECT title, year FROM books ORDER BY year").use { rs ->
                while (rs.next()) {
                    println("Book: ${rs.getString("title")} (${rs.getInt("year")})")
                }
            }
        }

        // Delete the rows this program added
        conn.prepareStatement("DELETE FROM books WHERE id = ?").use { ps ->
            for (id in listOf(dune) + added) {
                ps.setInt(1, id)
                ps.executeUpdate()
            }
        }
    }
}
```

Run it with `../gradlew run`. The JDBC driver commits each statement on its own by default (`autoCommit` is on). The transaction block turns it off, commits when both inserts succeed, and rolls back if one fails. `use` closes the connection and statements, so the code doesn't call `close()`.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file. `connect()` reads it from there first, because variables in the host environment take precedence over the file, and dotenv-kotlin doesn't fail when the file is missing. For production, use your default branch's pooled connection string (it goes through Neon's [connection pooler](/docs/connect/connection-pooling)): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Neon's pooler already pools connections, so you don't need to add a pool in your app; if you do, return connections to it promptly (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)).

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below says what the service does and links to its docs.

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

`java.lang.IllegalStateException: DATABASE_URL is not set`
: `connect()` found no `DATABASE_URL` in the environment or in `.env.local`, in the `app` directory, where the app runs. Check that the file is in `app`. If `neon link` wrote `.env`, change `filename` in `Database.kt` to `.env`.

`The program reaches a different database than your branch`
: A `DATABASE_URL` already set in your shell takes precedence over the env file. Run `unset DATABASE_URL` in that shell, then run the app again.

</DefinitionList>

## Next steps

- [Java guide](/docs/guides/java): the same PostgreSQL JDBC driver from Java, with more on JDBC.
- [Connect a Micronaut Kotlin application to Lakebase Postgres on Neon](/docs/guides/micronaut-kotlin): Use the Micronaut framework with Kotlin instead of raw JDBC.

<NeedHelp/>
