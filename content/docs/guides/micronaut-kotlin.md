---
title: Connect a Micronaut Kotlin application to Lakebase Postgres on Neon
subtitle: Connect a Micronaut Kotlin app to Lakebase Postgres on Neon, migrate it with Flyway, query it from a controller, develop on a branch, deploy, and add the rest of your backend
summary: >-
  Connect a Micronaut 5 Kotlin app to Lakebase Postgres on Neon: create the app
  with the Micronaut Launch API (postgres, jdbc-hikari, flyway, data-jdbc,
  yaml), optionally add Neon's agent skills, create a Neon project (Neon CLI,
  API, or Console), link it with the Neon CLI to pull DATABASE_URL into
  .env.local, turn DATABASE_URL into JDBC settings in Application.kt, load the
  env file in ./gradlew run, run a Flyway migration, and query Postgres from a
  controller and a Micronaut Data repository. Covers JDK 25 with Gradle, plus
  deployment, troubleshooting, and Neon's other backend services.
enableTableOfContents: true
updatedOn: '2026-11-18T16:41:34.386Z'
---

<PromptBlock src="/prompts/micronaut-kotlin-prompt.md" labels={["Set up your agent and follow this guide", "Look up Micronaut's docs", "Connect your Micronaut app"]} />

[Micronaut](https://micronaut.io/) is a JVM framework for microservice and serverless applications. This guide connects a Micronaut Kotlin app to Neon, creates a table with Flyway, and serves it from a controller and a Micronaut Data repository.

<Steps>

## Create a Micronaut app

Install [JDK 25](https://adoptium.net/) if you don't have it, then create a project if you don't have one. The [Micronaut Launch](https://micronaut.io/launch/) API creates it with one request, without installing the Micronaut CLI:

```bash filename="Terminal"
curl -o my-app.zip "https://launch.micronaut.io/create/default/com.example.my-app?lang=KOTLIN&build=GRADLE_KOTLIN&features=postgres,jdbc-hikari,flyway,data-jdbc,yaml"
unzip my-app.zip
cd my-app
printf '\n.env\n.env.local\n' >> .gitignore
```

This creates a Micronaut 5 app with Gradle, in the `com.example` package, with the Postgres JDBC driver, the Hikari connection pool, Flyway migrations, Micronaut Data JDBC, and YAML configuration. The `.gitignore` lines keep the env file, which will hold your connection string, out of git. The [Micronaut CLI](https://micronaut.io/download/) and the Launch website create the same project when you give them the same package and app name (`com.example.my-app`), Kotlin, the Gradle Kotlin DSL, and the same features; this guide's code uses the `com.example` package.

The app targets JDK 25. To target JDK 21 instead, add `&javaVersion=JDK_21` to the URL and build with JDK 21. If you're adding Neon to an existing Micronaut app, see what these features add with the Launch API's diff:

```bash filename="Terminal"
curl "https://launch.micronaut.io/diff/default/com.example.my-app?lang=KOTLIN&build=GRADLE_KOTLIN&features=postgres,jdbc-hikari,flyway,data-jdbc,yaml"
```

It compares a new default project with one that has these features, so add the `+` lines your project lacks to `build.gradle.kts` and your configuration file, and keep your own settings. Use your app's package and name where the diff and this guide's code use `com.example` and `my-app`, keep your configuration in one file (the diff moves it from `application.properties` to `application.yml`), and add `.env` and `.env.local` to your `.gitignore`. The diff doesn't include this guide's later changes to `Application.kt` and `build.gradle.kts`; make those too.

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The prompt above installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`. The prompt above has your agent look up Micronaut's [documentation](https://docs.micronaut.io/latest/guide/).

## Create a Neon project

Skip this step if you already have a Neon project you want to use.

Consider picking a region that supports all Neon backend services: US East (Ohio), US East (N. Virginia), Europe (Frankfurt), or Asia Pacific (Singapore). Postgres and Managed Better Auth run in every region, while Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four, with support expanding toward [all regions](/docs/introduction/regions#product-availability).

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region; pass a different one to pick another of the regions above. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

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

Get a `DATABASE_URL` into an env file. Micronaut doesn't read env files itself; the next step loads it.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project (install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't):

```bash filename="Terminal"
neon link
```

`neon link` prompts you to pick an organization and a project, or to create a new project. It writes a `.neon` file with the project context, pins a branch (pass `--branch` to choose one), and pulls that branch's `DATABASE_URL` into `.env.local`, or into `.env` if your project already has one.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The optional development branch step and [Add more of your backend](#add-more-of-your-backend) use the Neon CLI. To use them, run `neon link` in this directory.

</TabItem>

</Tabs>

## Load the connection string

`DATABASE_URL` is a Postgres URL with the user and password in it. The Postgres JDBC driver doesn't accept a user and password in the URL, so the app splits `DATABASE_URL` into the JDBC URL, user, and password that Micronaut's default datasource reads. Micronaut configures the pool from `datasources.default` (the generated `application.yml` sets its driver and dialect), so the app sets that datasource's `url`, `username`, and `password` at startup. Replace `src/main/kotlin/com/example/Application.kt` (in an existing app, start it with `Micronaut.build(*args).properties(datasourceFromDatabaseUrl()).start()` instead of `run(*args)`, and add the `datasourceFromDatabaseUrl` function):

```kotlin filename="src/main/kotlin/com/example/Application.kt"
package com.example

import io.micronaut.runtime.Micronaut
import java.net.URI

fun main(args: Array<String>) {
    Micronaut.build(*args)
        .properties(datasourceFromDatabaseUrl())
        .start()
}

// Turns DATABASE_URL (postgresql://user:password@host/dbname?sslmode=require&channel_binding=require)
// into JDBC settings. JDBC spells channel_binding as channelBinding.
private fun datasourceFromDatabaseUrl(): Map<String, Any> {
    val databaseUrl = System.getenv("DATABASE_URL") ?: error("DATABASE_URL is not set")
    val uri = URI(databaseUrl)
    // userInfo is percent-decoded, so a percent-encoded password comes through as is.
    val (user, password) = uri.userInfo?.split(":", limit = 2)?.takeIf { it.size == 2 }
        ?: error("DATABASE_URL must include a user and password")
    val port = if (uri.port == -1) "" else ":${uri.port}"
    val query = uri.rawQuery?.replace("channel_binding=", "channelBinding=")?.let { "?$it" } ?: ""
    return mapOf(
        "datasources.default.url" to "jdbc:postgresql://${uri.host}$port${uri.path}$query",
        "datasources.default.username" to user,
        "datasources.default.password" to password,
    )
}
```

The app reads `DATABASE_URL` from its environment, as it will on your host. To load your env files when you run it locally, add this to the end of `build.gradle.kts`. A variable already set in your shell takes priority, and `.env.local` takes priority over `.env`:

```kotlin filename="build.gradle.kts"
tasks.named<JavaExec>("run") {
    listOf(".env", ".env.local").map { file(it) }.filter { it.isFile }.forEach { envFile ->
        envFile.readLines()
            .map { it.trim() }
            .filter { it.isNotEmpty() && !it.startsWith("#") && "=" in it }
            .forEach { line ->
                val (key, value) = line.split("=", limit = 2).map { it.trim() }
                if (System.getenv(key) == null) {
                    environment(key, value.removeSurrounding("\"").removeSurrounding("'"))
                }
            }
    }
}
```

Keep `DATABASE_URL` in only one env file; if both have it, `.env.local` wins.

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema with copy-on-write, so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Create a table with Flyway

Flyway runs the migrations in `src/main/resources/db/migration` when the app starts. Create the first one:

```sql filename="src/main/resources/db/migration/V1__create_book_table.sql"
CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);

INSERT INTO book (title, author) VALUES ('The Hobbit', 'J.R.R. Tolkien');
INSERT INTO book (title, author) VALUES ('1984', 'George Orwell');
```

## Query the database from a controller

Return the Postgres version from `/`. The controller uses the app's datasource, and `@ExecuteOn(TaskExecutors.BLOCKING)` keeps the JDBC call off the event loop:

```kotlin filename="src/main/kotlin/com/example/VersionController.kt"
package com.example

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn
import javax.sql.DataSource

@Controller("/")
class VersionController(private val dataSource: DataSource) {

    @Get
    @ExecuteOn(TaskExecutors.BLOCKING)
    fun version(): Map<String, String> =
        dataSource.connection.use { connection ->
            connection.createStatement().use { statement ->
                statement.executeQuery("SELECT version()").use { rows ->
                    rows.next()
                    mapOf("version" to rows.getString(1))
                }
            }
        }
}
```

Then serve the `book` table through a [Micronaut Data](https://micronaut-projects.github.io/micronaut-data/latest/guide/#jdbc) repository. The entity maps to the table, the repository provides the queries, and the controller exposes them at `/books`:

```kotlin filename="src/main/kotlin/com/example/Book.kt"
package com.example

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn
import io.micronaut.serde.annotation.Serdeable

@MappedEntity
@Serdeable
data class Book(
    @field:Id @field:GeneratedValue var id: Long? = null,
    var title: String,
    var author: String,
)

@JdbcRepository(dialect = Dialect.POSTGRES)
interface BookRepository : CrudRepository<Book, Long>

@Controller("/books")
@ExecuteOn(TaskExecutors.BLOCKING)
class BookController(private val books: BookRepository) {

    @Get
    fun list(): List<Book> = books.findAll().toList()

    @Get("/{id}")
    fun get(id: Long): Book? = books.findById(id).orElse(null)

    @Post
    fun create(@Body book: Book): Book = books.save(book)
}
```

## Run the app

Start the app:

```bash filename="Terminal"
./gradlew run
```

Flyway creates the `book` table on the first start. Open [localhost:8080](http://localhost:8080) to see your Postgres version, confirming the connection:

```json
{"version":"PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu, compiled by gcc ..."}
```

Then try the books API:

```bash filename="Terminal"
curl http://localhost:8080/books
# [{"id":1,"title":"The Hobbit","author":"J.R.R. Tolkien"},{"id":2,"title":"1984","author":"George Orwell"}]

curl http://localhost:8080/books/1
# {"id":1,"title":"The Hobbit","author":"J.R.R. Tolkien"}

curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald"}' \
  http://localhost:8080/books
# {"id":3,"title":"The Great Gatsby","author":"F. Scott Fitzgerald"}
```

</Steps>

## Deploy

Set `DATABASE_URL` everywhere your app runs.

- Use your default branch for production. Get its connection string with `neon connection-string main --pooled` (or `production`), or from **Connect** in the Console.
- Build the app with `./gradlew shadowJar`, which writes a runnable JAR with its dependencies to `build/libs/` (the one ending in `-all.jar`). Start it with `java -jar`, with `DATABASE_URL` set in the host's environment; the env file is only for `./gradlew run`.
- Micronaut listens on port 8080. To use the port your host assigns, set `MICRONAUT_SERVER_PORT`.
- To build a container image instead, run `./gradlew dockerBuild`, which needs Docker. For an app that targets JDK 21, change the `dockerfile` task's `baseImage` in `build.gradle.kts` to `eclipse-temurin:21-jre`. See Micronaut's [Gradle plugin docs](https://micronaut-projects.github.io/micronaut-gradle-plugin/latest/) for this and native images.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, and the AI Gateway need a project in a [supported region](#create-a-neon-project). After you create one, run `neon env pull` to add its variables to your env file, and set them on your host too.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with [`neon buckets create`](/docs/cli/buckets), and use it from Micronaut with an S3 client such as the AWS SDK for Java and the bucket's `AWS_*` variables. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: `neon env pull` writes the branch's default token to `NEON_AI_GATEWAY_TOKEN`, along with `NEON_AI_GATEWAY_BASE_URL`. Call the OpenAI-compatible API at `${NEON_AI_GATEWAY_BASE_URL}/v1` from a controller with that token. For a token of your own, run `neon credentials create --scope ai_gateway:invoke --name my-app`; it prints the token once. See [AI Gateway authentication](/docs/ai-gateway/authentication).

Neon Functions
: Long-running Node.js compute next to your database.
: Create one from a template with [`neon functions new basic --slug jobs --no-install --no-add-to-config`](/docs/cli/functions#new), which writes its handler to `functions/jobs/` without adding npm packages or a `neon.ts` to your project, and deploy it with `neon functions deploy jobs --src functions/jobs/index.ts`. Use a function for work that outlasts a request on your Micronaut host, such as agents and webhooks, and call it over HTTP; run it on a schedule with a [function trigger](/docs/cli/triggers). See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

To manage services declaratively instead, see [`neon.ts`](/docs/reference/neon-ts). Its tooling installs npm packages in your project.

## Troubleshooting

<DefinitionList>

`java.lang.IllegalStateException: DATABASE_URL is not set`
: The app started without `DATABASE_URL`. Locally, check that `.env.local` or `.env` has it and that `build.gradle.kts` has the `run` block from [Load the connection string](#load-the-connection-string), or run `neon env pull`. With `java -jar` or on a host, set it in the environment.

Tests need Docker
: The project includes Micronaut [Test Resources](https://micronaut-projects.github.io/micronaut-test-resources/latest/guide/). The generated test doesn't run `main`, so when no datasource URL is set, Test Resources starts a Postgres container for `./gradlew test`, which needs Docker. To run tests against a Neon branch instead, set `DATASOURCES_DEFAULT_URL` to the JDBC form (`jdbc:postgresql://[neon_hostname]/[dbname]?sslmode=require&channelBinding=require`), plus `DATASOURCES_DEFAULT_USERNAME` and `DATASOURCES_DEFAULT_PASSWORD`, in the test environment. Tests run the Flyway migrations, so use a branch for them, not your production branch.

`Inconsistent JVM-target compatibility` or `Unsupported class file major version`
: The JDK running Gradle doesn't match the app's target. Use JDK 25, or create the app with `&javaVersion=JDK_21` and use JDK 21.

Port 8080 already in use
: Another server, often an earlier `./gradlew run`, is still using the port. Stop it, or set `MICRONAUT_SERVER_PORT` to use another port.

</DefinitionList>

## Next steps

- [Micronaut Data JDBC](https://micronaut-projects.github.io/micronaut-data/latest/guide/#jdbc): repositories, queries, and transactions.
- [Micronaut Flyway](https://micronaut-projects.github.io/micronaut-flyway/latest/guide/): migration settings.
- [Micronaut SQL](https://micronaut-projects.github.io/micronaut-sql/latest/guide/#jdbc): Hikari connection pool settings.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own copy of your database.

<NeedHelp/>
