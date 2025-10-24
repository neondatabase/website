# 💡 AI Prompt: Connect Quarkus (JDBC) to Neon Postgres

**Role:** You are an expert Java software agent responsible for configuring the current Quarkus project to connect to a Neon Postgres database using JDBC.

**Purpose:** To connect the current Quarkus project to Neon Postgres by adding required dependencies, configuring datasource properties via a `.env` file, and creating a REST endpoint to validate the database connection.

**Scope:**
- Must be run inside an existing Quarkus project directory (identifiable by a `pom.xml` or `build.gradle` file).
- Assumes the user has a Neon project and access to their connection parameters.
- Assumes the user's environment has Java and Quarkus installed.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

This prompt must be run inside an existing Quarkus project directory. If a project does not exist, create a new one first by running the following command in the terminal.

```bash
quarkus create app neon-with-quarkus-jdbc \
--name neon-with-quarkus-jdbc \
--package-name com.neon.tech \
--extensions jdbc-postgresql,quarkus-agroal,quarkus-rest
```
*Inform the user that this command creates a new project in a `neon-with-quarkus-jdbc` directory*

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Quarkus project as follows:

### 1. Verify Project Dependencies

> **Note:** If the project was just created using the `quarkus create` command in the `Prerequisites` section, these dependencies will already be present. This verification step is only necessary for pre-existing projects.

1.  **Locate the project's build file** (`pom.xml` for Maven or `build.gradle` / `build.gradle.kts` for Gradle).
2.  **Ensure the necessary extensions are present.** If any are missing, add them using the Quarkus CLI with their fully-qualified names.
    - **PostgreSQL Driver:** Check for `quarkus-jdbc-postgresql`.
    - **Connection Pool:** Check for `quarkus-agroal`.
    - **Web Endpoint:** Check for `quarkus-rest`.

    If any extension is missing, execute the appropriate command(s):
    ```bash
    quarkus ext add io.quarkus:quarkus-jdbc-postgresql
    quarkus ext add io.quarkus:quarkus-agroal
    quarkus ext add io.quarkus:quarkus-rest
    ```

---

### 2. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following connection parameters to the `.env` file. **Prompt the user to replace the placeholder values** with their credentials from the Neon Console.

    ```dotenv title=".env"
    QUARKUS_DATASOURCE_DB_KIND=postgresql
    QUARKUS_DATASOURCE_USERNAME="your_neon_user"
    QUARKUS_DATASOURCE_PASSWORD="your_neon_password"
    QUARKUS_DATASOURCE_JDBC_URL="jdbc:postgresql://aws-xxx-pooler.neon.tech/neondb?sslmode=require&channelBinding=require"
    ```

3.  Direct the user to find their connection details in the **Neon Console → Project → Dashboard → Connect**. Inform them to copy the connection parameters and replace the placeholders in the `.env` file.

---

### 3. Create a REST Endpoint to Test the Connection

To provide a clear way to verify the setup, create a new JAX-RS resource that connects to the database and displays the PostgreSQL version.

1.  **Determine the project's main package directory** (e.g., `src/main/java/com/neon/tech/`).
2.  **Create a new Java file** named `PostgresResource.java` inside that directory.
3.  Add the following content to the file. Ensure the `package` declaration matches the project's package structure.

    ```java title="src/main/java/com/neon/tech/PostgresResource.java"
    package com.neon.tech;

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
        public String getVersion() {
            try (Connection connection = dataSource.getConnection();
                    Statement statement = connection.createStatement()) {

                ResultSet resultSet = statement.executeQuery("SELECT version()");

                if (resultSet.next()) {
                    return resultSet.getString(1);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return "Could not retrieve database version.";
        }
    }
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection parameters in `.env` file. Do not proceed if placeholder values (e.g., "your_neon_user") are still present.
2.  Start the Quarkus application in development mode:
    ```bash
    quarkus dev
    ```
3.  Inform the user that the setup is complete and the server is running. To test the connection, they can visit `http://localhost:8080/postgres/version` in their browser, where they should see the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The build file (`pom.xml` or `build.gradle.kts`) contains the `quarkus-jdbc-postgresql`, `quarkus-agroal`, and `quarkus-resteasy-reactive` / `quarkus-rest` dependencies.
- A `.env` file is present at the project root.
- The `.env` file contains the `QUARKUS_DATASOURCE_*` variables.
- The `PostgresResource.java` file has been created in the correct package directory.
- No credentials or sensitive information are hardcoded in `src/main/resources/application.properties` or any Java source file.

---

## ❌ Do Not

- **Do not hardcode credentials** in `application.properties` or any source code file. Always use the `.env` file for secrets.
- **Do not output the contents of the `.env` file** or the user's connection string in any response.
- Do not modify existing user code (e.g., `GreetingResource.java`) unless absolutely necessary. Creating a new, separate file is preferred.