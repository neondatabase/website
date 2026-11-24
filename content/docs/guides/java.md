---
title: Connect a Java application to Neon
subtitle: Create a Maven project, link it with neon link, and query Lakebase Postgres from Java with the Postgres JDBC driver
summary: >-
  To connect a Java app to Lakebase Postgres on Neon, create a Maven project, run
  neon link to write DATABASE_URL to .env.local, and query it with the Postgres
  JDBC driver (pgJDBC). Covers one runnable example (create, insert, select,
  update, delete, and a transaction), converting DATABASE_URL for JDBC, running
  the app elsewhere, troubleshooting, and the Spring Boot and Quarkus guides as
  next steps.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/java
  - /docs/integrations/java
updatedOn: '2026-11-20T21:25:57.225Z'
---

<PromptBlock src="/prompts/java-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Java project"]} />

<Steps>

## Create a Java project

Create a project with [Maven](https://maven.apache.org/), the build tool for Java. You need JDK 17 or later, the minimum the `pom.xml` below targets. Skip this step if you already have a Java project.

```bash filename="Terminal"
mkdir -p neon-java-app/src/main/java/com/example
cd neon-java-app
```

Save this file as `pom.xml` in `neon-java-app`. It sets the Java release, and declares the Postgres JDBC driver and dotenv-java, which loads the env file in development:

```xml filename="pom.xml"
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>neon-java-app</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <maven.compiler.release>17</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <version>42.7.14</version>
    </dependency>
    <dependency>
      <groupId>io.github.cdimascio</groupId>
      <artifactId>dotenv-java</artifactId>
      <version>3.2.0</version>
    </dependency>
  </dependencies>
</project>
```

With Gradle, add these two lines to `dependencies` in `build.gradle.kts`: `implementation("org.postgresql:postgresql:42.7.14")` and `implementation("io.github.cdimascio:dotenv-java:3.2.0")`.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is Java.

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

The example in [Connect and run a query](#connect-and-run-a-query) loads `.env.local` with dotenv-java, so you don't need to pass the file to the command.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's Neon variables, including `DATABASE_URL`, into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for JavaScript projects.

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

The `pom.xml` from the first step declares the [PostgreSQL JDBC driver (pgJDBC)](https://jdbc.postgresql.org), the Java library that connects to Postgres. Compile the project to download it and dotenv-java into your local Maven repository:

```bash filename="Terminal"
mvn compile
```

## Connect and run a query

Create `Db.java` in `src/main/java/com/example/`. It has the connection helper that the examples use, and a `main` method that prints `SELECT version()`.

```java filename="src/main/java/com/example/Db.java"
package com.example;

import io.github.cdimascio.dotenv.Dotenv;
import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Objects;

public class Db {

    public static void main(String[] args) throws SQLException {
        try (Connection conn = connect();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT version()")) {
            rs.next();
            System.out.println(rs.getString(1));
        }
    }

    // Converts DATABASE_URL (postgresql://user:password@host/dbname?...) to the
    // jdbc:postgresql:// form pgJDBC accepts, with the user and password passed separately.
    public static Connection connect() throws SQLException {
        String url = Dotenv.configure().filename(".env.local").ignoreIfMissing().load().get("DATABASE_URL");
        Objects.requireNonNull(url, "DATABASE_URL is not set");
        URI uri = URI.create(url);
        String[] userInfo = uri.getUserInfo().split(":", 2);
        String authority = uri.getRawAuthority();
        String query = Objects.requireNonNullElse(uri.getRawQuery(), "").replace("channel_binding=", "channelBinding=");
        String jdbcUrl = "jdbc:postgresql://" + authority.substring(authority.indexOf('@') + 1)
                + uri.getRawPath() + "?" + query;
        return DriverManager.getConnection(jdbcUrl, userInfo[0], userInfo[1]);
    }
}
```

pgJDBC doesn't accept a `postgresql://user:password@host/dbname` URL, so `connect()` moves the user and password into the arguments of `DriverManager.getConnection`. It also renames `channel_binding` to `channelBinding`, because pgJDBC has no property by that name: without the rename, it ignores the setting and uses its default, `prefer`, without an error.

Run the class with:

```bash filename="Terminal"
mvn compile exec:java -Dexec.mainClass=com.example.Db
```

The output shows the Postgres version of your database, which confirms the connection:

```text filename="Output"
PostgreSQL 18.7 (84da7d8) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Examples

The example is one class that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The class deletes the rows it adds, so you can run it again. Save it as `Books.java` in `src/main/java/com/example/`, and run it with `mvn compile exec:java -Dexec.mainClass=com.example.Books`. The example creates the `books` table and writes rows to the branch that your `DATABASE_URL` points at, so run it on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```java filename="src/main/java/com/example/Books.java"
package com.example;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Books {

    public static void main(String[] args) throws SQLException {
        try (Connection conn = Db.connect()) {
            // Create a table
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("""
                    CREATE TABLE IF NOT EXISTS books (
                        id SERIAL PRIMARY KEY,
                        title TEXT NOT NULL,
                        author TEXT NOT NULL,
                        year INT
                    )""");
            }

            // Insert a row and get its id back
            long dune = insert(conn, "Dune", "Frank Herbert", 1965);

            // Select the row
            try (PreparedStatement ps = conn.prepareStatement("SELECT id, title, year FROM books WHERE id = ?")) {
                ps.setLong(1, dune);
                try (ResultSet rs = ps.executeQuery()) {
                    rs.next();
                    System.out.printf("Selected: %s (%d)%n", rs.getString("title"), rs.getInt("year"));
                }
            }

            // Update the row
            try (PreparedStatement ps = conn.prepareStatement("UPDATE books SET year = ? WHERE id = ?")) {
                ps.setInt(1, 1966);
                ps.setLong(2, dune);
                ps.executeUpdate();
            }

            // Insert two rows in a transaction: both commit, or neither does
            conn.setAutoCommit(false);
            long emma;
            long persuasion;
            try {
                emma = insert(conn, "Emma", "Jane Austen", 1815);
                persuasion = insert(conn, "Persuasion", "Jane Austen", 1817);
                conn.commit();
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true);
            }

            // Select all rows
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT title, year FROM books ORDER BY year")) {
                while (rs.next()) {
                    System.out.printf("Book: %s (%d)%n", rs.getString("title"), rs.getInt("year"));
                }
            }

            // Delete the rows this program added
            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM books WHERE id IN (?, ?, ?)")) {
                ps.setLong(1, dune);
                ps.setLong(2, emma);
                ps.setLong(3, persuasion);
                ps.executeUpdate();
            }
        }
    }

    private static long insert(Connection conn, String title, String author, int year) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO books (title, author, year) VALUES (?, ?, ?) RETURNING id")) {
            ps.setString(1, title);
            ps.setString(2, author);
            ps.setInt(3, year);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        }
    }
}
```

The transaction block commits or rolls back explicitly. The other statements run in autocommit mode, so each one commits when it finishes.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file. `Db.connect()` uses that value when `.env.local` doesn't exist. If `DATABASE_URL` is also set in your shell, the shell value wins over `.env.local`. For production, use your default branch's pooled connection string: run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Neon's pooler already pools connections, so you don't need to add a pool in your app; if you do, return connections to it promptly (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)).

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below says what the service does.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files, used with any S3 client library. See [Object Storage](/docs/storage/overview).

AI Gateway
: Routes calls to models from Anthropic, OpenAI, Google, and more through one OpenAI-compatible endpoint on your branch, used with any OpenAI-compatible client. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute (the server that runs your code next to your database), called over HTTP. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`DATABASE_URL` in `.env.local` is ignored
: A `DATABASE_URL` already set in your shell wins over `.env.local`, so the program reaches whichever database the shell points at. Run `unset DATABASE_URL` in that shell, then run the command again.

`DATABASE_URL is not set`
: The program found no `DATABASE_URL` in `.env.local` or its environment. Run the command from the project directory, where `neon link` wrote the file, or set the variable in your shell. If `neon link` wrote `.env` because your project already had one, change the filename in `Db.java` to `.env`.

`No suitable driver found for postgresql://...`
: `DriverManager` got the `postgresql://` URL as is. Pass the URL through `Db.connect()`, which converts it to the `jdbc:postgresql://` form.

`Unable to parse URL jdbc:postgresql://user:...`
: The JDBC URL puts the user and password before the host (`user:password@host`), which pgJDBC doesn't parse. Pass them as arguments to `DriverManager.getConnection`, as `Db.connect()` does.

</DefinitionList>

## Next steps

- [Database schema changes with Hibernate, Spring Boot, and Neon](/guides/spring-boot-hibernate): Use Hibernate's entities and queries instead of raw SQL.
- [Database migrations in Spring Boot with Flyway and Neon](/guides/spring-boot-flyway): Keep your schema in sync with versioned migration files.
- [Connect a Quarkus application (JDBC) to Neon](/docs/guides/quarkus-jdbc): Query Neon from a Quarkus REST resource over JDBC.

<NeedHelp/>
