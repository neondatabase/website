---
title: Connect a Quarkus application (JDBC) to Neon
subtitle: Connect a Quarkus app to Lakebase Postgres on Neon over JDBC, develop on a branch, query it from a REST resource, deploy, and add the rest of your backend
summary: >-
  Connect a Quarkus 3.40 app to Lakebase Postgres on Neon over JDBC: create the
  app with the Quarkus CLI (jdbc-postgresql, agroal, rest), optionally add
  Neon's agent skills, create a Neon project (Neon CLI, API, or Console), link
  the directory with the Neon CLI, and pass the pooled connection to Quarkus as
  a JDBC URL with the user and password in its query string. Query Postgres from
  a REST resource through the Agroal pool, and run migrations on the direct
  connection. Covers JDK 25, Quarkus dev mode, deployment, native builds,
  troubleshooting, and Neon's other backend services from Quarkus.
enableTableOfContents: true
updatedOn: '2026-11-19T01:52:28.310Z'
---

<PromptBlock src="/prompts/quarkus-jdbc-prompt.md" labels={["Set up your agent and follow this guide", "Look up Quarkus's docs", "Connect your Quarkus app"]} />

[Quarkus](https://quarkus.io/) is a Java framework for cloud-native applications. This guide connects a Quarkus app to Neon over JDBC, using the PostgreSQL JDBC driver and the Agroal connection pool that Quarkus includes. It serves the Postgres version from a REST route.

<Steps>

## Create a Quarkus app

Install [JDK 25](https://adoptium.net/) if you don't have it, and the [Quarkus CLI](https://quarkus.io/guides/cli-tooling). Then create a project if you don't have one:

```bash filename="Terminal"
quarkus create app com.example:my-app --package-name=com.example --extension=jdbc-postgresql,agroal,rest
cd my-app
printf '\n.env\n.env.local\n' >> .gitignore
```

This creates a Quarkus 3.40 app with Maven in the `com.example` package, with the PostgreSQL JDBC driver, the Agroal connection pool, and the `rest` extension for REST routes. Quarkus 3.40 runs on Java 17 or later. The project targets the newest of Java 17, 21, or 25 that the JDK running the Quarkus CLI supports, so JDK 25 gives Java 25. The `.gitignore` lines keep the env files, which may hold Neon's variables, out of git.

The properties and extensions this guide uses also exist in Quarkus 3.33 LTS. To scaffold a 3.33 app instead, pass `--stream 3.33` to `quarkus create app`.

For an existing app, run this from its project root (the folder with `pom.xml`) to add the extensions this guide uses:

```bash filename="Terminal"
quarkus ext add io.quarkus:quarkus-jdbc-postgresql io.quarkus:quarkus-agroal io.quarkus:quarkus-rest
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

In the Neon Console, click **Connect** in the project's nav. The modal shows the pooled string by default. Keep **Connection pooling** on, then build the JDBC URL from the string and keep it for [Configure the datasource](#configure-the-datasource):

```text shouldWrap
jdbc:postgresql://[neon_hostname]/[dbname]?user=[user]&password=[password]&sslmode=require&channelBinding=require
```

Take `[user]` and `[password]` from the `user:password` part between `//` and `@`, split at the colon. Take `[neon_hostname]` and `[dbname]` from after `@`. Keep the `-pooler` suffix on the host for the pooled connection. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

</TabItem>

</Tabs>

## Work on a development branch (optional)

If you linked your project's default branch, your app uses the branch where production data usually lives. That's `main` for projects created with the CLI or API, and `production` for projects created in the Console. Create a [branch](/docs/introduction/branching) for local development instead. A branch starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch and pins it in `.neon`. The command in the next step reads that pin, so the app uses the new branch with no other change. To switch back, run `neon checkout main` (or `production`).

## Configure the datasource

Quarkus connects over JDBC with a JDBC URL, a user, and a password. A `postgresql://` string isn't a JDBC URL, so the connection string can't be passed as it is. Instead, pass a `jdbc:postgresql://` URL that carries the user and password as query parameters, which the driver accepts. The command below reads the pooled string for the pinned branch, rewrites it, and sets it as `QUARKUS_DATASOURCE_JDBC_URL` for that one run. If the Neon CLI prints no connection string, the command stops before Quarkus starts:

```bash filename="Terminal" shouldWrap
url="$(neon connection-string --pooled | sed -n -E 's#^postgresql://([^:]+):([^@]+)@([^/]+)/([^?]+)\?(.*)$#jdbc:postgresql://\3/\4?user=\1\&password=\2\&\5#p' | sed 's/channel_binding=/channelBinding=/')" && test -n "$url" && QUARKUS_DATASOURCE_JDBC_URL="$url" quarkus dev
```

Without the CLI, set `url="jdbc:postgresql://ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?user=alex&password=AbC123dEf&sslmode=require&channelBinding=require"` to the URL you built in [Connect your app to the project](#connect-your-app-to-the-project), in place of the `neon connection-string` part, and run the same command. The values in this example are placeholders, so replace them with your own.

Quarkus reads the variable from the environment, which takes priority over every file. The URL isn't written to disk, and a branch switch takes effect the next time you run the command. If you set a password yourself, percent-encode every character except letters, digits, and `-`, `.`, `_`, and `~`. The URL carries the password as written, and the command passes it through. Neon-generated passwords, which start with `npg_`, need no encoding. Add one line to `src/main/resources/application.properties` so Quarkus uses PostgreSQL without looking up the driver:

```properties filename="src/main/resources/application.properties"
quarkus.datasource.db-kind=postgresql
```

The pooled string sends connections through Neon's pooler, which is what this guide uses for the app. For the trade-offs, and for the direct connection that migrations use, see [Pooled and direct connections](#pooled-and-direct-connections).

## Query the database from a REST resource

Create `PostgresResource.java` in the `src/main/java/com/example` directory, next to the `GreetingResource.java` that Quarkus generated. Leave `GreetingResource.java` as it is.

```java filename="src/main/java/com/example/PostgresResource.java"
package com.example;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/postgres")
public class PostgresResource {

    @Inject
    DataSource dataSource;

    @GET
    @Path("/version")
    @Produces(MediaType.TEXT_PLAIN)
    public String getVersion() throws SQLException {
        try (Connection connection = dataSource.getConnection();
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery("SELECT version()")) {
            resultSet.next();
            return resultSet.getString(1);
        }
    }
}
```

The route gets a connection from the Agroal pool, runs `SELECT version()`, and returns the result as plain text. If the query fails, Quarkus returns an HTTP 500 response, and the app keeps running.

## Run the app

Start the app in development mode from the project root, with the same command as in [Configure the datasource](#configure-the-datasource):

```bash filename="Terminal" shouldWrap
url="$(neon connection-string --pooled | sed -n -E 's#^postgresql://([^:]+):([^@]+)@([^/]+)/([^?]+)\?(.*)$#jdbc:postgresql://\3/\4?user=\1\&password=\2\&\5#p' | sed 's/channel_binding=/channelBinding=/')" && test -n "$url" && QUARKUS_DATASOURCE_JDBC_URL="$url" quarkus dev
```

Visit [localhost:8080/postgres/version](http://localhost:8080/postgres/version) in your web browser. Your Neon database's Postgres version will be returned. For example:

```text
PostgreSQL 18.6 (ac70818) on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0, 64-bit
```

</Steps>

## Pooled and direct connections

The guide uses the pooled string for the app, the same as the other guides' deploy steps. Neon's pooler is PgBouncer in transaction mode, and it accepts up to 10,000 client connections. Agroal's pool runs inside the app, on top of the pooler. Agroal holds up to 50 connections per instance by default (`quarkus.datasource.jdbc.max-size`). Those are client connections, so they don't count directly against Postgres's `max_connections`. If you run several instances, lower `max-size` in `application.properties` so the total fits your workload. Transaction mode also means session settings, temporary tables, and session-level advisory locks don't carry across transactions.

Two options change this:

- Turn off Agroal's pool with `quarkus.datasource.jdbc.pooling-enabled=false`. Each request then opens a connection through the pooler, which adds latency.
- Use the direct string for the app: `neon connection-string` without `--pooled`. Direct connections count against `max_connections`, which depends on the compute size. The [connection pooling](/docs/connect/connection-pooling) guide lists the limits. For a 0.25 CU compute, 112 connections are allowed, 7 of them reserved for the Neon superuser account, so 105 are left for your app.

<Admonition type="note">
PgJDBC switches to server-side prepared statements after five executions of the same statement (`prepareThreshold`). Neon's pooler supports protocol-level prepared statements, but this guide hasn't tested PgJDBC's default through it. If you see prepared-statement errors through the pooler, set `quarkus.datasource.jdbc.additional-jdbc-properties.prepareThreshold=0`.
</Admonition>

Run migrations on the direct connection, not through the app. Neon's [connection pooling](/docs/connect/connection-pooling) guide recommends it for schema migrations. Flyway and Liquibase would use the app's pooled datasource, so this guide runs SQL files with `neon psql` instead. A sample migration creates a table for your own code. The route in this guide only runs `SELECT version()`:

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

## Deploy

<Admonition type="warning">
Don't deploy `.env`. Quarkus reads it in production as well, and it holds passwords.
</Admonition>

Set the variables on your host instead. Environment variables take priority over `.env` and `application.properties`:

- `QUARKUS_DATASOURCE_JDBC_URL`: the output of the command below for your production branch. Use `production` in place of `main` if the project was created in the Console. Check that the output isn't empty, then copy it to the host, and don't commit it.

```bash filename="Terminal" shouldWrap
neon connection-string main --pooled | sed -n -E 's#^postgresql://([^:]+):([^@]+)@([^/]+)/([^?]+)\?(.*)$#jdbc:postgresql://\3/\4?user=\1\&password=\2\&\5#p' | sed 's/channel_binding=/channelBinding=/'
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
: Quarkus Dev Services starts a database container only when no datasource URL is configured. The command in this guide stops before Quarkus starts if the URL is empty, so this means you started `quarkus dev` another way. Use the command in this guide, or set `QUARKUS_DATASOURCE_JDBC_URL` yourself. To turn Dev Services off explicitly, add `quarkus.datasource.devservices.enabled=false` to `src/main/resources/application.properties`.

The command stops without starting Quarkus
: The Neon CLI printed no connection string, or the string didn't match what the command expects: it has no `?` query part, or it starts with `postgres://` instead of `postgresql://`. Any error from the Neon CLI is on your terminal. Check that you're logged in with `neon me` and that `.neon` pins a project and branch, run `neon link` if it doesn't, and then run the command again.

Unable to parse URL jdbc:postgresql://...
: PgJDBC's message, shown when `QUARKUS_DATASOURCE_JDBC_URL` is malformed, for example after a manual edit. The message includes the URL, so don't paste it into a chat or an issue. Build the URL again from the string the Neon CLI prints.

</DefinitionList>

**Tests start a Postgres container.** `./mvnw test` doesn't get the URL from the command above, so the tests use Dev Services and need Docker. To run them against a Neon branch, run this command, which sets the URL for the test run:

```bash filename="Terminal" shouldWrap
url="$(neon connection-string --pooled | sed -n -E 's#^postgresql://([^:]+):([^@]+)@([^/]+)/([^?]+)\?(.*)$#jdbc:postgresql://\3/\4?user=\1\&password=\2\&\5#p' | sed 's/channel_binding=/channelBinding=/')" && test -n "$url" && QUARKUS_DATASOURCE_JDBC_URL="$url" ./mvnw test
```

<Admonition type="warning">
Tests that write data should use a development branch, not production.
</Admonition>

<DefinitionList>

Port 8080 already in use
: Another server, often an earlier `quarkus dev`, is still using the port. Stop it, or set `QUARKUS_HTTP_PORT` to use another port.

</DefinitionList>

## Next steps

- [Quarkus datasources](https://quarkus.io/guides/datasource): pool settings, named datasources, and Dev Services.
- [Quarkus Flyway](https://quarkus.io/guides/flyway): schema migrations, if you give Flyway a datasource on the direct connection.
- [Branching](/docs/introduction/branching): Give each preview deployment or pull request its own branch of your database.

<NeedHelp/>
