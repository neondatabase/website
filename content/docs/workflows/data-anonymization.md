---
title: Data anonymization
subtitle: Anonymize data in Neon branches using the PostgreSQL Anonymizer extension
enableTableOfContents: true
updatedOn: '2025-03-07T21:44:32.257Z'
tag: new
---

When working with production data, it's crucial to ensure that sensitive user information remains protected — especially in development or testing environments. With Neon, creating branches is fast, but how do you safely clone a production branch without exposing personal data?

The [PostgreSQL Anonymizer extension (`anon`)](/docs/extensions/postgresql-anonymizer) provides tools to mask, randomize, or obfuscate personal data, making it easy to create safe, anonymized branches for development and testing.

<Admonition type="important">
Neon currently only supports **static masking** with the `anon` extension. Static masking permanently modifies the data, unlike dynamic anonymization which masks data on-the-fly. Additionally, the `anon` extension is currently **experimental** in Neon, requiring explicit activation as shown below.
</Admonition>

This guide demonstrates two approaches to anonymize data on a Neon branch:
1. A manual procedure using SQL commands
2. An automated process using GitHub Actions workflows

## Anonymize branch data manually

<Steps>

## Prerequisites

Before you begin, make sure you have:

- A **Neon project** with a populated parent branch
- A Postgres client such as `psql`, pgAdmin, or Neon's SQL Editor

## Create sample data

For this example, we'll use a `production` branch with a `users` table containing sensitive information:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    iban TEXT
);

-- Insert sample data
DO $$
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO users (first_name, last_name, email, iban)
    VALUES (
      'First Name ' || i,
      'Last Name ' || i,
      'user' || i || '@example.com',
      'IBAN' || i
    );
  END LOOP;
END $$;
```

Verify the data with:

```sql
SELECT * FROM users LIMIT 3;
```

The output:

| id | first_name    | last_name    | email               | iban   |
|----|---------------|--------------|---------------------|--------|
| 1  | First Name 1  | Last Name 1  | user1@example.com   | IBAN1  |
| 2  | First Name 2  | Last Name 2  | user2@example.com   | IBAN2  |
| 3  | First Name 3  | Last Name 3  | user3@example.com   | IBAN3  |

## Create a new branch

Create a branch from your `production` branch that you'll anonymize, called `anonymized-dev` in this example:

```bash
neonctl branch create --project-id <my-project-id> --name anonymized-dev --parent production --psql
```

This creates a branch with an exact copy (snapshot) of your production data, ready for anonymization.

## Enable the `anon` extension

Get a connection string for your new branch:

```bash
neonctl cs anonymized-dev --project-id <my-project-id>
```

Connect to the branch:

```bash
psql <connection_string>
```

Enable experimental extensions and install `anon`:

```sql
-- Enable experimental extensions
SET neon.allow_unstable_extensions = 'true';

-- Install the anonymizer extension
CREATE EXTENSION anon;
```

## Choose a masking strategy

Apply security labels to define how each sensitive column should be anonymized.

In this example, we will use the faking strategy to anonymize columns in our `users` table. The faking strategy replaces sensitive data with random values that look similar to the original data but are not real:

```sql
-- Replace personal data with realistic-looking fake values
SECURITY LABEL FOR anon ON COLUMN users.first_name IS 'MASKED WITH FUNCTION anon.fake_first_name()';
SECURITY LABEL FOR anon ON COLUMN users.last_name IS 'MASKED WITH FUNCTION anon.fake_last_name()';
SECURITY LABEL FOR anon ON COLUMN users.iban IS 'MASKED WITH FUNCTION anon.fake_iban()';
SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
```

<Admonition type="tip">
PostgreSQL Anonymizer offers multiple masking strategies beyond faking, including pseudonymization, partial scrambling, noise addition, and generalization. See the [masking function documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) for all available functions.
</Admonition>

## Anonymize the data

With the masking strategy set, now initialize the extension and also run the anonymization process to anonymize the data:

```sql
-- Load necessary data for the anonymization functions
SELECT anon.init();

-- Apply masking rules to transform the data
SELECT anon.anonymize_database();
```

<Admonition type="warning">
Static masking permanently modifies your data. The original values cannot be recovered after anonymization.
</Admonition>

## Verify the results

Check that your data has been properly anonymized:

```sql
SELECT * FROM users LIMIT 3;
```

You should see the sensitive columns replaced with fake but realistic-looking values, similar to:

| id | first_name | last_name | email                 | iban                    |
|----|------------|-----------|----------------------|-------------------------|
| 1  | Rhonda     | Alvarado  | bryanalan@example.net | GB34QDZL89198122631902 |
| 2  | Darius     | Reyes     | brandon57@example.com | GB96LBQE53732061681569 |
| 3  | Stefanie   | Byrd      | barbara40@example.com | GB67CAZQ75813049489060 |

## Tips for safely anonymizing data

<Admonition type="caution">
Always double-check that you are on the correct branch before running anonymization.

Never run `anon.init()` and `anon.anonymize_database()` on your parent branch. These functions should only be executed on child branches intended for anonymization. Running them on a parent branch will permanently modify your source data.
</Admonition>

- Generally, you should always back up your data before making any changes. With Neon, you can quickly restore a branch to a previous state using [Instant restore](/docs/introduction/branch-restore) if needed.
- Test anonymization on a small subset of data first (e.g., test with `anon.anonymize_table()` instead of `anon.anonymize_database()`).
- Periodically audit your masking rules as your schema evolves to ensure all sensitive fields remain protected.
- Use different anonymization strategies for different types of data, such as:
  - Use `anon.partial()` for partial masking of identifiers
  - Use `anon.noise()` for numerical data where approximate values are acceptable
  - Use `anon.generalize_int4range()` for age or date ranges
- To streamline your workflow, you can enable the `anon` extension and define masking rules on your parent branch. These settings will be inherited by all child branches you create, eliminating repetitive setup.

</Steps>

The following example shows how to **automate the creation of anonymized Neon branches** using **GitHub Actions**, triggered each time a pull request is opened or updated.

## Automate data anonymization

Creating anonymized database copies for development, testing, or preview environments can be automated with GitHub Actions. The following workflow creates anonymized Neon branches automatically whenever a pull request is opened or updated.

**What you'll achieve for each pull request:**

- Automatic creation of a new Neon branch
- Installation and initialization of the PostgreSQL Anonymizer extension
- Application of predefined masking rules to sensitive fields
- A ready-to-use anonymized dataset for use in CI, preview environments, or manual testing

<Steps>

## Requirements

Before setting up the GitHub Action:

- A **Neon project** with a populated parent branch
- The following GitHub repository secrets:
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`

<Admonition type="tip">
The Neon GitHub integration can configure these secrets automatically. See [Neon GitHub integration](/docs/guides/neon-github-integration).
</Admonition>

## Set up the GitHub action workflow

Create a file at `.github/workflows/create-anon-branch.yml` (or similar) with the following content. It implements the same masking rules we used in the manual approach:

<Admonition type="note">
This simple workflow example covers the basics. For production use, consider enhancing it with error handling, retry logic, and additional security controls.
</Admonition>

```yaml
name: PR Open - Create Branch, Run Static Anonymization

on:
  pull_request:
    types: opened

jobs:
  on-pr-open:
    runs-on: ubuntu-latest
    steps:
      - name: Create branch
        uses: neondatabase/create-branch-action@v6
        id: create-branch
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch_name: anon-pr-${{ github.event.number }}
          role: neondb_owner
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Confirm branch created
        run: echo branch_id ${{ steps.create-branch.outputs.branch_id }}

      - name: Confirm connection possible
        run: |
          echo "Checking connection to the database..."
          psql "${{ steps.create-branch.outputs.db_url }}" -c "SELECT NOW();"

      - name: Enable anon extension
        run: |
          echo "Initializing the extension..."
          psql "${{ steps.create-branch.outputs.db_url }}" <<EOSQL
            SET neon.allow_unstable_extensions='true';
            CREATE EXTENSION IF NOT EXISTS anon CASCADE;
          EOSQL
          echo "Anon extension initialized."

      - name: Apply security labels
        run: |
          echo "Applying security labels..."
          psql "${{ steps.create-branch.outputs.db_url }}" <<EOSQL
            SECURITY LABEL FOR anon ON COLUMN users.first_name IS 'MASKED WITH FUNCTION anon.fake_first_name()';
            SECURITY LABEL FOR anon ON COLUMN users.last_name IS 'MASKED WITH FUNCTION anon.fake_last_name()';
            SECURITY LABEL FOR anon ON COLUMN users.iban IS 'MASKED WITH FUNCTION anon.fake_iban()';
            SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
          EOSQL
          echo "Security labels applied."

      - name: Run anonymization
        run: |
          echo "Running anonymization..."
          psql "${{ steps.create-branch.outputs.db_url }}" <<EOSQL
            SELECT anon.init();
            SELECT anon.anonymize_database();
          EOSQL
          echo "Database anonymization completed successfully."
```

## Testing the workflow

To test this automation workflow:

1. Customize the workflow for your environment by adjusting the branch naming convention and  security labels
2. Push the changes to your repository
3. Open a new pull request
4. Check the **Actions** tab in your GitHub repository to monitor the workflow execution
5. Verify the anonymized branch creation and data anonymization by:
   - Viewing the GitHub Actions logs
   - Connecting to the new branch and confirm that the original values were replaced
   - Checking the data in the Neon Console's **Tables** view

## Cleaning up

Remember to clean up anonymized branches when they're no longer needed. You can delete them manually or automate cleanup with the [delete-branch-action](https://github.com/neondatabase/delete-branch-action) GitHub Action when PRs are closed.

</Steps>

## Conclusion

The PostgreSQL Anonymizer extension with Neon's branching functionality provides a solution for protecting sensitive data in development workflows. By using static masking with Neon branches, you can:

- Create realistic test environments without exposing sensitive information
- Obfuscate sensitive information such as names, addresses, emails, and other personally identifiable details (PII)
- Automate anonymization processes as part of your CI/CD pipeline

While only static masking is currently supported in Neon, this approach offers a robust solution for most development and testing use cases.

## Additional Resources

- [PostgreSQL Anonymizer extension documentation](/docs/extensions/postgresql-anonymizer)
- [PostgreSQL Anonymizer masking functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/)
- [PostgreSQL extensions supported by Neon](/docs/extensions/pg-extensions)
- [GitHub Action for Creating Neon Branches](https://github.com/neondatabase/create-branch-action)
- [GitHub Action for Deleting Neon Branches](https://github.com/neondatabase/delete-branch-action)
