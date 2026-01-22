---
title: Implementing Database Migrations in Go Applications with Neon
subtitle: Learn how to manage database schema changes in Go applications using Neon's serverless Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-02-22T00:00:00.000Z'
updatedOn: '2025-02-22T00:00:00.000Z'
---

Database migrations are essential for managing schema evolution in applications as they grow and change over time. When working with Go applications and Neon's serverless Postgres, implementing a good migration strategy allows you to have smooth deployments and database changes without disruption.

This guide will walk you through implementing and managing database migrations for Go applications using Neon Postgres, covering everything from basic concepts to advanced production deployment strategies.

## Prerequisites

Before diving into database migrations, make sure you have:

- [Go](https://golang.org/dl/) 1.18 or later installed
- A [Neon](https://console.neon.tech/signup) account and project
- Basic understanding of SQL and database schemas
- Familiarity with Go programming

## Understanding Database Migrations

Database migrations provide a structured approach to evolve your database schema over time. Each migration represents a discrete change to your database structure, such as adding a table, modifying a column, or creating an index.

Some of the main benefits of using database migrations include:

- Track changes to your schema alongside your application code.
- Easily set up new development or production databases.
- Apply changes incrementally with the ability to roll back.
- Multiple developers can make schema changes without conflicts.
- Integrate database changes into your CI/CD pipeline.

Without migrations, managing database schema changes becomes increasingly challenging as applications grow and team sizes increase.

## Migration Tools for Go

As with many programming languages, Go has a rich ecosystem of tools for managing database migrations. These tools help you create, apply, and roll back migrations in a controlled and repeatable manner.

Let's explore the most popular options:

### golang-migrate

[golang-migrate](https://github.com/golang-migrate/migrate) is one of the most widely used migration tools in the Go ecosystem. It provides:

- Support for multiple databases including Postgres
- Migration files in SQL or Go formats
- CLI tools for migration management
- A Go library for programmatic migration control
- Versioned migrations with up/down operations

### Other Options

While we'll focus on golang-migrate in this guide, other notable migration tools include:

- **[sql-migrate](https://github.com/rubenv/sql-migrate)**: Uses goose-style migrations with support for multiple databases
- **[goose](https://github.com/pressly/goose)**: A migration tool with support for Go or SQL migrations
- **[atlas](https://github.com/ariga/atlas)**: A newer tool that provides declarative schema migrations
- **[dbmate](https://github.com/amacneil/dbmate)**: A database migration tool that's language-agnostic

## Setting Up golang-migrate

Let's set up golang-migrate to work with your Neon Postgres database. It can be used both from the command line and programmatically within your Go code. We'll cover both approaches in this guide.

Let's start by installing the golang-migrate CLI.

### Install the Migration Tool

First, install the golang-migrate CLI. You can do this using `go install`:

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

Or alternatively, you can also use a package manager or follow the [installation instructions](https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md) from the golang-migrate repository depending on your operating system.

### Project Structure

Create a structure for your migrations in your Go project:

```
your-go-project/
├── cmd/
│   └── main.go
├── internal/
│   └── app/
├── migrations/
│   ├── 000001_create_users_table.up.sql
│   ├── 000001_create_users_table.down.sql
│   ├── 000002_add_user_roles.up.sql
│   └── 000002_add_user_roles.down.sql
└── go.mod
```

The `migrations` directory will store all your migration files. Each migration consists of two files:

- `NNNNNN_name.up.sql`: Contains SQL to apply the migration
- `NNNNNN_name.down.sql`: Contains SQL to revert the migration

### Creating Your First Migration

Next, let's create your first migration to establish a users table:

```bash
# Create the migrations directory if it doesn't exist
mkdir -p migrations

# Create the migration files
migrate create -ext sql -dir migrations -seq create_users_table
```

This command creates two files:

- `migrations/000001_create_users_table.up.sql`
- `migrations/000001_create_users_table.down.sql`

Now, edit the up migration file with the SQL to create your users table:

```sql
-- migrations/000001_create_users_table.up.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

And edit the down migration to reverse these changes:

```sql
-- migrations/000001_create_users_table.down.sql
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS users;
```

A few important points about this migration:

1. We're creating a table with a primary key and various constraints
2. We're adding an index for performance optimization
3. We're creating a trigger to automatically update the `updated_at` timestamp
4. The down migration reverses all changes in the correct order

Notice how the down migration drops objects in reverse order compared to how they were created in the up migration. This is important to avoid dependency issues when rolling back.

## Connecting to Neon Postgres

To run migrations against your Neon database, you'll need to construct a proper connection string. Neon provides a secure, TLS-enabled connection:

```
postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
```

Replace the placeholders with your actual Neon connection details, which you can find in the Neon Console under your project's connection settings.

For convenience, you might want to store this connection string in an environment variable:

```bash
export NEON_DB_URL="postgresql://user:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

## Running Migrations

With your migration files created and your connection string ready, you can now run migrations against your Neon database.

### Running Migrations from CLI

To apply all pending migrations:

```bash
migrate -database "${NEON_DB_URL}" -path ./migrations up
```

To roll back the most recent migration:

```bash
migrate -database "${NEON_DB_URL}" -path ./migrations down 1
```

To migrate to a specific version:

```bash
migrate -database "${NEON_DB_URL}" -path ./migrations goto 2
```

To check the current migration version:

```bash
migrate -database "${NEON_DB_URL}" -path ./migrations version
```

Having the ability to run migrations from the command line is useful for local development and debugging. However, for production deployments, let's look at how to run migrations programmatically from your Go code.

### Running Migrations from Go Code

For many applications, you'll want to run migrations programmatically from your Go code, especially during application startup or as part of CI/CD processes.

Create a `migrations.go` file in your project:

```go
package migrations

import (
	"errors"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// RunMigrations applies database migrations to the specified database
func RunMigrations(dbURL, migrationsPath string) error {
	m, err := migrate.New("file://"+migrationsPath, dbURL)
	if err != nil {
		return err
	}

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}

	srcErr, dbErr := m.Close()
	if srcErr != nil {
		return srcErr
	}
	if dbErr != nil {
		return dbErr
	}

	log.Println("Migrations applied successfully")
	return nil
}
```

Then call this function during your application startup:

```go
package main

import (
	"log"
	"os"

	"your-module/migrations"
)

func main() {
	dbURL := os.Getenv("NEON_DB_URL")
	if dbURL == "" {
		log.Fatal("NEON_DB_URL environment variable is not set")
	}

	err := migrations.RunMigrations(dbURL, "./migrations")
	if err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Continue with application startup...
}
```

This approach allows you to run migrations as part of your application's initialization process. You can also integrate this code into your CI/CD pipeline to ensure migrations are applied consistently across environments.

## Creating Additional Migrations

As your application evolves, you'll need to create additional migrations to modify your database schema. Let's create a second migration to add user roles:

```bash
migrate create -ext sql -dir migrations -seq add_user_roles
```

Edit the up migration:

```sql
-- migrations/000002_add_user_roles.up.sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('user'), ('admin'), ('editor');

-- Add a default role for existing users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE r.name = 'user';
```

And the down migration:

```sql
-- migrations/000002_add_user_roles.down.sql
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
```

This migration shows a few common patterns:

1. Creating related tables with foreign key constraints
2. Seeding tables with initial data
3. Migrating existing data to maintain consistency

## Best Practices for Migrations

When working with migrations in Go applications and Neon Postgres, follow these best practices:

### 1. Keep Migrations Small and Focused

Each migration should do one thing and do it well. Small, focused migrations are:

- Easier to review
- Quicker to apply
- Simpler to roll back if needed
- Less likely to cause problems

For example, split adding a table and populating it with data into separate migrations when possible.

### 2. Make Migrations Idempotent When Possible

Idempotent migrations can be applied multiple times without changing the result. Use conditionals in your SQL to make migrations more robust:

```sql
-- Check if the index exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email'
    ) THEN
        CREATE INDEX idx_users_email ON users(email);
    END IF;
END
$$;
```

### 3. Use Transactions for Safety

Ensure your migrations run within transactions to maintain database consistency. If a migration fails partway through, all changes should be rolled back.

The golang-migrate tool automatically wraps each migration in a transaction by default, but you can also explicitly include transactions in your SQL:

```sql
BEGIN;

-- Migration steps here

COMMIT;
```

There has been a feature request to add support for transactions in the golang-migrate tool, you can track the progress [here](https://github.com/golang-migrate/migrate/issues/196) but for now, you would need to handle transactions manually in your SQL.

### 4. Test Migrations Before Applying to Production

Always test migrations in a non-production environment first. Ideally, have a staging environment that mirrors production as closely as possible.

You can achieve this by setting up a separate Neon branch to test migrations before applying them to your production branch. You can learn more about Neon branches in the [Neon documentation](/docs/introduction/branching).

### 5. Version Control Your Migrations

Store migrations in version control alongside your application code to make sure that:

- Changes are tracked
- Code reviewers can see database changes
- Migration history is preserved

### 6. Never Edit Existing Migrations

Once a migration has been applied to any environment, consider it immutable. If you need to change something, create a new migration. This avoids inconsistencies between environments.

## Integrating with CI/CD Pipelines

Automating migrations as part of your CI/CD pipeline ensures database changes are applied consistently across environments.

### Example GitHub Actions Workflow

Here's an example GitHub Actions workflow that runs migrations during deployment:

```yaml
name: Deploy with Migrations

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.20'

      - name: Install migrate
        run: |
          curl -L https://github.com/golang-migrate/migrate/releases/download/v4.18.2/migrate.linux-amd64.tar.gz | tar xvz
          sudo mv migrate /usr/bin/migrate
          which migrate

      - name: Run migrations
        run: migrate -database "${NEON_DB_URL}" -path ./migrations up
        env:
          NEON_DB_URL: ${{ secrets.NEON_DB_URL }}

      # Continue with application deployment...
```

The workflow will trigger on pushes to the main branch, then perform the following steps:

1. Fetch the repository code
2. Prepare the Go environment
3. Download and install the `migrate` tool
4. Apply migrations to the database using the connection string stored in a GitHub secret
5. Continue with the deployment process

Running your database migrations directly on your production database can be risky. For a safer approach, let's look at how to test migrations on a Neon branch before deploying them to production.

### Running Migrations on a Neon Branch

For a more robust approach, you can use Neon's branching capabilities to test migrations before applying them to your production database.

Neon has a set of [GitHub Actions](/docs/guides/branching-github-actions) that allow you to create, delete, and compare branches programmatically. Here's an extended GitHub Actions workflow that uses Neon's branching actions to spin up a temporary branch for testing migrations:

```yaml
name: Test and Deploy Migrations

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - 'migrations/**'
  push:
    branches: [main]
    paths:
      - 'migrations/**'

jobs:
  migration-test:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.20'

      - name: Install migrate
        run: |
          curl -L https://github.com/golang-migrate/migrate/releases/download/v4.18.2/migrate.linux-amd64.tar.gz | tar xvz
          sudo mv migrate /usr/bin/migrate

      # Create a temporary branch for testing migrations
      - name: Create Neon branch for testing
        id: create-branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          parent: main
          branch_name: migration-test-${{ github.run_id }}
          username: ${{ vars.NEON_DB_USER }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Run migrations on test branch
        run: |
          migrate -database "${{ steps.create-branch.outputs.db_url }}" -path ./migrations up
          echo "Migrations applied successfully to test branch"

      # Run tests against the migrated schema
      - name: Run database schema tests
        run: |
          go test ./tests/db/... -db-url="${{ steps.create-branch.outputs.db_url }}"

      # For pull requests, generate a schema diff
      - name: Generate schema diff
        if: github.event_name == 'pull_request'
        uses: neondatabase/schema-diff-action@v1
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          compare_branch: migration-test-${{ github.run_id }}
          base_branch: main
          api_key: ${{ secrets.NEON_API_KEY }}
          database: ${{ vars.NEON_DB_NAME || 'neondb' }}
          username: ${{ vars.NEON_DB_USER }}

      # Clean up the test branch
      - name: Delete test branch
        if: always()
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: migration-test-${{ github.run_id }}
          api_key: ${{ secrets.NEON_API_KEY }}

  # Only run on push to main
  deploy-production:
    needs: migration-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install migrate
        run: |
          curl -L https://github.com/golang-migrate/migrate/releases/download/v4.18.2/migrate.linux-amd64.tar.gz | tar xvz
          sudo mv migrate /usr/bin/migrate

      # Run migrations on production database
      - name: Run migrations on production
        run: migrate -database "${NEON_PROD_DB_URL}" -path ./migrations up
        env:
          NEON_PROD_DB_URL: ${{ secrets.NEON_PROD_DB_URL }}

      # Continue with application deployment...
```

This extended workflow does the following:

1. Triggers on both pull requests affecting migration files and pushes to the main branch
2. Creates a temporary branch specifically for testing migrations using Neon's create-branch-action
3. Runs migrations on the test branch to verify they apply correctly
4. Executes schema tests to ensure the migrated schema works as expected
5. Generates a schema diff for pull requests, providing reviewers with a clear view of the proposed changes
6. Cleans up by deleting the test branch after testing
7. Deploys to production only when changes are pushed to the main branch, after successful testing

This approach provides several benefits:

- Migrations are thoroughly tested before being applied to production
- Pull request reviewers can see exactly what schema changes are being proposed
- Failed migrations don't affect your production database
- The workflow is fully automated as part of your CI/CD pipeline

To use this workflow, you'll need to set up the following GitHub repository secrets and variables:

- **Secrets**:
  - `NEON_API_KEY`: Your Neon API key
  - `NEON_PROD_DB_URL`: Production database connection string

- **Variables**:
  - `NEON_PROJECT_ID`: Your Neon project ID
  - `NEON_DB_USER`: Database username
  - `NEON_DB_NAME`: Database name (defaults to 'neondb' if not specified)

You can add more steps to this workflow depending on your specific deployment needs, such as building and deploying your application after successful migrations.

## Working with Multiple Environments

Most applications require different database configurations for development, testing, staging, and production environments.

### Environment-Specific Configurations

Manage environment-specific database URLs using environment variables or configuration files:

```go
package config

import (
	"os"
	"fmt"
)

// GetDatabaseURL returns the appropriate database URL for the current environment
func GetDatabaseURL() string {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development" // Default
	}

	switch env {
	case "production":
		return os.Getenv("NEON_PROD_DB_URL")
	case "staging":
		return os.Getenv("NEON_STAGING_DB_URL")
	case "test":
		return os.Getenv("NEON_TEST_DB_URL")
	default:
		return os.Getenv("NEON_DEV_DB_URL")
	}
}
```

## Conclusion

Database migrations are a critical part of managing application evolution. When working with Go applications and Neon Postgres, a well-implemented migration strategy ensures that your schema changes are version-controlled and applied consistently across environments.

The combination of Go's strong tooling, the flexibility of golang-migrate, and Neon's powerful Postgres capabilities provides an excellent foundation for managing database schema changes throughout your application's lifecycle.

## Additional Resources

- [golang-migrate documentation](https://github.com/golang-migrate/migrate)
- [Neon Documentation](/docs)
- [PostgreSQL Alter Table documentation](https://www.postgresql.org/docs/current/ddl-alter.html)
- [PostgreSQL schema design best practices](https://www.postgresql.org/docs/current/ddl-schemas.html)

<NeedHelp />
