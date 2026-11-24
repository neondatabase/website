---
title: Connect a Quarkus application (Reactive) to Neon
subtitle: Connect a Quarkus app to Lakebase Postgres on Neon with the Reactive SQL Client, develop on a branch, query it from a REST resource, deploy, and add the rest of your backend
summary: >-
  Connect a Quarkus 3.40 app to Lakebase Postgres on Neon with the Vert.x
  Reactive SQL Client: create the app with the Quarkus CLI (reactive-pg-client,
  rest), optionally add Neon's agent skills, create a Neon project (Neon CLI,
  API, or Console), link the directory with the Neon CLI, and pass the pooled
  connection string to Quarkus as its reactive URL. Query Postgres from a REST
  resource without blocking, and run migrations on the direct connection.
  Covers JDK 25, Quarkus dev mode, deployment, native builds, troubleshooting,
  and Neon's other backend services from Quarkus.
enableTableOfContents: true
updatedOn: '2026-11-19T01:52:28.310Z'
---

<PromptBlock src="/prompts/quarkus-reactive-prompt.md" labels={["Set up your agent and follow this guide", "Look up Quarkus's docs", "Connect your Quarkus app"]} />

[Quarkus](https://quarkus.io/) is a Java framework for cloud-native applications. This guide connects a Quarkus app to Neon with the Reactive SQL Client, a non-blocking Postgres client built on Vert.x. It serves the Postgres version from a REST route that returns a Mutiny `Uni`.

<Steps>

## Create a Quarkus app

Install [JDK 25](https://adoptium.net/) if you don't have it, and the [Quarkus CLI](https://quarkus.io/guides/cli-tooling). Then create a project if you don't have one:

```bash filename="Terminal"
quarkus create app com.example:my-app --package-name=com.example --extension=reactive-pg-client,rest
cd my-app
printf '\n.env\n.env.local\n' >> .gitignore
```

This creates a Quarkus 3.40 app with Maven in the `com.example` package, with the Reactive PostgreSQL client and the `rest` extension for REST routes. Quarkus 3.40 runs on Java 17 or later. The project targets the newest of Java 17, 21, or 25 that the JDK running the Quarkus CLI supports, so JDK 25 gives Java 25. The `.gitignore` lines keep the env files, which may hold Neon's variables, out of git.

The properties and extensions this guide uses also exist in Quarkus 3.33 LTS. To scaffold a 3.33 app instead, pass `--stream 3.33` to `quarkus create app`.

For an existing app, run this from its project root (the folder with `pom.xml`) to add the extensions this guide uses:

```bash filename="Terminal"
quarkus ext add io.quarkus:quarkus-reactive-pg-client io.quarkus:quarkus-rest
```

## Add Neon's agent skills (optional)

If your AI coding agent doesn't have Neon's [agent skills](/docs/ai/agent-skills) yet, add them to this project. The agent prompt at the top of this page installs them, so skip this step if you used it. From your project directory, run:

```bash filename="Terminal"
npx neon@latest skills
```

To also connect the [Neon MCP Server](/docs/ai/neon-mcp-server), run `npx neon@latest mcp`.

Quarkus publishes an index of its docs for AI agents at [quarkus.io/llms.txt](https://quarkus.io/llms.txt), which the agent prompt at the top of this page points your agent to.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and Managed Better Auth run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

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

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your app's directory, link it to the Neon project. Find the IDs with `neon orgs list` and `neon projects list --org-id <org-id>`:

```bash filename="Terminal"
touch .env
neon link -y --org-id org-cool-sky-12345678 --project-id cool-sky-12345678 --no-config
```

Replace the example IDs with your own, from `neon orgs list` and `neon projects list`. `neon link` writes a `.neon` file with the project context and pins a branch. Without `--branch`, `-y` pins the project's default branch. It also pulls that branch's variables into `.env`, including `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct). The `touch` creates `.env` first, so the CLI writes there and not to `.env.local`. `--no-config` skips the offer to create a `neon.ts`, which this Maven project doesn't use. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

</TabItem>

<TabItem>

In the Neon Console, click **Connect** in the project's nav. The modal shows the pooled string by default. Keep **Connection pooling** on, and copy the string. In [Configure the datasource](#configure-the-datasource), set `url` to that string, in place of the `neon connection-string` part, and run the same command. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

</TabItem>

</Tabs>

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch and pins it in `.neon`. The command in the next step reads that pin, so the app uses the new branch with no other change. To switch back, run `neon checkout main` (or `production`).

## Configure the datasource

The Reactive SQL Client takes one `postgresql://` URL that includes the user and password, so no splitting is needed. The command below reads the pooled string for the pinned branch and sets it as `QUARKUS_DATASOURCE_REACTIVE_URL` for that one run. If the Neon CLI prints no connection string, the command stops before Quarkus starts:

```bash filename="Terminal" shouldWrap
url="$(neon connection-string --pooled | grep '^postgresql://')" && test -n "$url" && QUARKUS_DATASOURCE_REACTIVE_URL="$url" quarkus dev
```

Without the CLI, set `url="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"` to the string you copied from Connect, in place of the `neon connection-string` part, and run the same command. The values in this example are placeholders, so replace them with your own.

Quarkus reads the variable from the environment, which takes priority over every file. The URL isn't written to disk, and a branch switch takes effect the next time you run the command. The client reads the `channel_binding` parameter in the string and applies it to SCRAM authentication, so the string can stay as it is. If you set a password yourself, percent-encode every character except letters, digits, and `-`, `.`, `_`, and `~`. The URL carries the password as written, and the command passes it through. Neon-generated passwords, which start with `npg_`, need no encoding. Add one line to `src/main/resources/application.properties` to name the database kind, as the [Reactive SQL Client](https://quarkus.io/guides/reactive-sql-clients) guide's example does:

```properties filename="src/main/resources/application.properties"
quarkus.datasource.db-kind=postgresql
```

The pooled string sends connections through Neon's pooler, which is what this guide uses for the app. For the trade-offs, and for the direct connection that migrations use, see [Pooled and direct connections](#pooled-and-direct-connections).

## Query the database from a REST resource

Create `PostgresResource.java` in the `src/main/java/com/example` directory, next to the `GreetingResource.java` that Quarkus generated. Leave `GreetingResource.java` as it is.

```java filename="src/main/java/com/example/PostgresResource.java"
package com.example;

import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.sqlclient.Pool;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/postgres")
public class PostgresResource {

    @Inject
    Pool client;

    @GET
    @Path("/version")
    @Produces(MediaType.TEXT_PLAIN)
    public Uni<String> getVersion() {
        return client.query("SELECT version()").execute()
                .map(rows -> rows.iterator().next().getString(0));
    }
}
```

The route returns a `Uni`, so the query runs without blocking the request thread. If the query fails, the `Uni` fails, Quarkus returns an HTTP 500 response, and the app keeps running.

## Run the app

Start the app in development mode from the project root, with the same command as in [Configure the datasource](#configure-the-datasource):

```bash filename="Terminal" shouldWrap
url="$(neon connection-string --pooled | grep '^postgresql://')" && test -n "$url" && QUARKUS_DATASOURCE_REACTIVE_URL="$url" quarkus dev
```

Visit [localhost:8080/postgres/version](http://localhost:8080/postgres/version) in your web browser. Your Neon database's Postgres version will be returned. For example:

```text
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

</Steps>

## Pooled and direct connections

The guide uses the pooled string for the app, the same as the other guides' deploy steps. Neon's pooler is PgBouncer in transaction mode, and it accepts up to 10,000 client connections. The client keeps its own pool on top of the pooler, with `quarkus.datasource.reactive.max-size` connections (20 by default). If you run several instances, lower `max-size` in `application.properties` so the total fits your workload. Transaction mode also means session settings, temporary tables, and session-level advisory locks don't carry across transactions.

Neon's pooler supports protocol-level prepared statements, as the [connection pooling](/docs/connect/connection-pooling) guide describes. Whether the client's default caching works through the pooler is untested in this guide. If you see prepared-statement errors through the pooler, you can turn on the layer 7 proxy mode and turn off caching in `application.properties`. This is an option, not a requirement:

```properties filename="src/main/resources/application.properties"
quarkus.datasource.reactive.postgresql.use-layer7-proxy=true
quarkus.datasource.reactive.cache-prepared-statements=false
```

The trade-off is speed: with caching off, the client sends each statement in full on every call. The `useLayer7Proxy` javadoc in Vert.x's `PgConnectOptions` (the source for this setting, which Vert.x marks `@Unstable`) says caching must be off with a layer 7 proxy such as PgBouncer.

<Admonition type="warning">
Test your queries through the pooler before you rely on these settings.
</Admonition>

For the direct connection, use `neon connection-string` without `--pooled`. Direct connections count against Postgres's `max_connections`, which depends on the compute size. The [connection pooling](/docs/connect/connection-pooling) guide lists the limits. For a 0.25 CU compute, 112 connections are allowed, 7 of them reserved for the Neon superuser account, so 105 are left for your app.

Run migrations on the direct connection, not through the app. Neon's [connection pooling](/docs/connect/connection-pooling) guide recommends it for schema migrations. Quarkus's Flyway and Liquibase extensions use JDBC, so they need a JDBC datasource, and this guide runs SQL files with `neon psql` instead. A sample migration creates a table for your own code. The route in this guide only runs `SELECT version()`:

```sql filename="migrations/001-create-book.sql"
CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);
```

`neon psql` connects directly by default, to the branch that `.neon` pins when you don't name one. Run the file on your development branch with:

```bash filename="Terminal"
neon psql -- -f migrations/001-create-book.sql
```

For SSL, `sslmode=require` in the URL requires SSL and skips the host name check. To use `verify-full` instead, set these in `application.properties`:

```properties filename="src/main/resources/application.properties"
quarkus.datasource.reactive.postgresql.ssl-mode=verify-full
quarkus.datasource.reactive.hostname-verification-algorithm=HTTPS
```

The Vert.x client refuses `verify-full` unless the hostname verification algorithm is set.

<Admonition type="warning">
The Vert.x client also requires trust options for `verify-full`, and this guide doesn't set any. Test the connection before you rely on this setting.
</Admonition>

## Deploy

<Admonition type="warning">
Don't deploy `.env`. Quarkus reads it in production as well, and it holds passwords.
</Admonition>

Set the variable on your host instead. Environment variables take priority over `.env` and `application.properties`:

- `QUARKUS_DATASOURCE_REACTIVE_URL`: the output of the command below for your production branch. Use `production` in place of `main` if the project was created in the Console. Check that the output isn't empty, then copy it to the host, and don't commit it.

```bash filename="Terminal"
neon connection-string main --pooled | grep '^postgresql://'
```

Build the app with `./mvnw package`. It writes `target/quarkus-app/quarkus-run.jar`, which you run with `java -jar target/quarkus-app/quarkus-run.jar`. Quarkus listens on port 8080 unless you set `QUARKUS_HTTP_PORT`, which your host may assign.

Run migrations on the production branch's direct connection before you start the new version. Use `production` in place of `main` for a project created in the Console:

```bash filename="Terminal"
neon psql main -- -f migrations/001-create-book.sql
```

To build a native executable, run `./mvnw package -Dnative` with GraalVM or Mandrel installed, or `./mvnw package -Dnative -Dquarkus.native.container-build=true` to build it in a container with Docker or Podman. See [Building a native executable](https://quarkus.io/guides/building-native-image). The executable reads the same environment variables.

## Add more of your backend

Neon's other backend services branch with your database. Object Storage, Neon Functions, the AI Gateway, and Realtime need a project in a [supported region](#create-a-neon-project). After you create one, run `neon env pull` to add its variables to your env file, and set them on your host too.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files.
: Create a bucket with [`neon buckets create`](/docs/cli/buckets), and use it from Quarkus with an S3 client such as the AWS SDK for Java and the bucket's `AWS_*` variables. See [Object Storage](/docs/storage/overview).

AI Gateway
: One credential for models from Anthropic, OpenAI, Google, and more.
: `neon env pull` writes the branch's default token to `NEON_AI_GATEWAY_TOKEN`, along with `NEON_AI_GATEWAY_BASE_URL`. Call the OpenAI-compatible API at `${NEON_AI_GATEWAY_BASE_URL}/v1` from a resource with that token. For a token of your own, run `neon credentials create --scope ai_gateway:invoke --name my-app`; it prints the token once. See [AI Gateway authentication](/docs/ai-gateway/authentication).

Neon Functions
: Long-running Node.js compute next to your database.
: Create one from a template with [`neon functions new basic --slug jobs --no-install --no-add-to-config`](/docs/cli/functions#new), which writes its handler to `functions/jobs/` without adding npm packages or a `neon.ts` to your project. Deploy it with `neon functions deploy jobs --src functions/jobs/index.ts`. Use a function for work that outlasts a request on your Quarkus host, such as agents and webhooks, and call it over HTTP; run it on a schedule with a [function trigger](/docs/cli/triggers). See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

To manage services declaratively instead, see [`neon.ts`](/docs/reference/neon-ts). Its tooling installs npm packages in your project, which a Maven project doesn't need.

## Troubleshooting

<DefinitionList>

Quarkus starts a Postgres container, or Docker is required
: Quarkus Dev Services starts a database container only when no datasource URL is configured. The command in this guide stops before Quarkus starts if the URL is empty, so this means you started `quarkus dev` another way. Use the command in this guide, or set `QUARKUS_DATASOURCE_REACTIVE_URL` yourself. To turn Dev Services off explicitly, add `quarkus.datasource.devservices.enabled=false` to `src/main/resources/application.properties`.

The command stops without starting Quarkus
: The Neon CLI printed no connection string, or the string didn't start with `postgresql://`, so the `grep` or `test` stopped the command. Any error from the Neon CLI is on your terminal. Check that you're logged in with `neon me` and that `.neon` pins a project and branch, run `neon link` if it doesn't, and then run the command again.

Cannot parse invalid connection URI: postgresql://...
: The Vert.x client's message, shown when `QUARKUS_DATASOURCE_REACTIVE_URL` is malformed, for example after a manual edit. The message includes the URL, so don't paste it into a chat or an issue. Build the URL again from the string the Neon CLI prints.

</DefinitionList>

**Tests start a Postgres container.** `./mvnw test` doesn't get the URL from the command above, so the tests use Dev Services and need Docker. To run them against a Neon branch, run this command, which sets the URL for the test run:

```bash filename="Terminal" shouldWrap
url="$(neon connection-string --pooled | grep '^postgresql://')" && test -n "$url" && QUARKUS_DATASOURCE_REACTIVE_URL="$url" ./mvnw test
```

<Admonition type="warning">
Tests that write data should use a development branch, not production.
</Admonition>

<DefinitionList>

Port 8080 already in use
: Another server, often an earlier `quarkus dev`, is still using the port. Stop it, or set `QUARKUS_HTTP_PORT` to use another port.

</DefinitionList>

## Next steps

- [Quarkus reactive SQL clients](https://quarkus.io/guides/reactive-sql-clients): pool settings, prepared queries, transactions, and multiple datasources.
- [Quarkus datasources](https://quarkus.io/guides/datasource): the full list of datasource settings.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
