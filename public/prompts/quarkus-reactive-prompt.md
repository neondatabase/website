# 💡 AI Prompt: Connect Quarkus (Reactive) to Neon Postgres

**Role:** You are an expert Java software agent responsible for configuring the current Quarkus project to connect to a Neon Postgres database using a Reactive SQL Client.

**Purpose:** To connect the current Quarkus project to Neon Postgres by adding the required reactive dependencies, configuring the reactive datasource URL via a `.env` file, and creating a REST endpoint to validate the database connection.

**Scope:**
- Must be run inside an existing Quarkus project directory (identifiable by a `pom.xml` or `build.gradle` file).
- Assumes the user has a Neon project and access to their connection string.
- Assumes the user's environment has Java and Quarkus installed.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

This prompt must be run inside an existing Quarkus project directory. If a project does not exist, create a new one first by running the following command in the terminal.

```bash
quarkus create app neon-with-quarkus \
--name neon-with-quarkus \
--package-name com.neon.tech \
--extensions reactive-pg-client,resteasy-reactive
```

*Inform the user that this command creates a new project in a `neon-with-quarkus` directory with the Reactive Postgres client and RESTEasy Reactive.*

---

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:
- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

When this prompt is triggered, automatically configure the open Quarkus project as follows:

### 1. Verify Project Dependencies

> **Note:** If the project was just created using the `quarkus create` command in the `Prerequisites` section, these dependencies will already be present. This verification step is only necessary for pre-existing projects.

1.  **Locate the project's build file** (`pom.xml` for Maven or `build.gradle` / `build.gradle.kts` for Gradle).
2.  **Ensure the necessary extensions are present.** If any are missing, add them using the Quarkus CLI with their fully-qualified names.
    - **Reactive PostgreSQL client:** `quarkus-reactive-pg-client`
    - **REST:** `quarkus-resteasy-reactive`

    If any extension is missing, execute the appropriate command(s):
    ```bash
    quarkus ext add io.quarkus:quarkus-reactive-pg-client
    quarkus ext add io.quarkus:quarkus-resteasy-reactive
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the reactive datasource URL in the same form as the manual guide. **Do not wrap the value in quotes** (the reactive URL parser can mis-parse quoted values).

    ```dotenv
    QUARKUS_DATASOURCE_REACTIVE_URL=postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
    ```

3.  **Prompt the user to replace** `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` using the **Connect** details from the **Project Dashboard**. For more detail, see [Connect from any application](https://neon.tech/docs/connect/connect-from-any-app).

---

### 3. Create a REST Endpoint to Test the Connection

To provide a clear way to verify the setup, create a new JAX-RS resource that reactively connects to the database and displays the PostgreSQL version.

1.  **Determine the project's main package directory** (e.g., `src/main/java/com/neon/tech/`).
2.  **Create a new Java file** named `PostgresResource.java` inside that directory.
3.  Add the following content to the file. Ensure the `package` declaration matches the project's package structure.

    ```java title="src/main/java/com/neon/tech/PostgresResource.java"
    package com.neon.tech;

    import jakarta.inject.Inject;
    import io.smallrye.mutiny.Multi;
    import io.vertx.mutiny.sqlclient.Row;
    import io.vertx.mutiny.sqlclient.RowSet;
    import jakarta.ws.rs.GET;
    import jakarta.ws.rs.Path;
    import jakarta.ws.rs.Produces;
    import jakarta.ws.rs.core.MediaType;

    @Path("/postgres")
    public class PostgresResource {
        @Inject
        io.vertx.mutiny.pgclient.PgPool client;

        @GET
        @Path("/version")
        @Produces(MediaType.TEXT_PLAIN)
        public Multi<String> getVersion() {
            return client.query("SELECT version()")
                    .execute()
                    .onItem().transformToMulti(this::extractVersion);
        }

        private Multi<String> extractVersion(RowSet<Row> rowSet) {
            return Multi.createFrom().iterable(rowSet)
                    .map(r -> r.getValue(0).toString());
        }
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify `QUARKUS_DATASOURCE_REACTIVE_URL` in the `.env` file uses real credentials and host/db segments, not `[user]` / `[password]` placeholders.
2.  Start the Quarkus application in development mode:
    ```bash
    quarkus dev
    ```
3.  Inform the user that the setup is complete and the server is running. To test the connection, they can visit `http://localhost:8080/postgres/version` in their browser, where they should see the PostgreSQL version from their Neon database.
4.  **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The build file (`pom.xml` or `build.gradle.kts`) contains the `quarkus-reactive-pg-client` and `quarkus-resteasy-reactive` dependencies.
- A `.env` file is present at the project root.
- The `.env` file contains the `QUARKUS_DATASOURCE_REACTIVE_URL` variable.
- The `PostgresResource.java` file has been created in the correct package directory.
- No credentials or sensitive information are hardcoded in `src/main/resources/application.properties` or any Java source file.

---

## ❌ Do Not

- **Do not hardcode credentials** in `application.properties` or any source code file. Always use the `.env` file for secrets.
- **Do not output the contents of the `.env` file** or the user's connection string in any response.
- Do not modify existing user code unless absolutely necessary. Creating a new, separate file is preferred.