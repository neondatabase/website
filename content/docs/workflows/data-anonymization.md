---
title: Data anonymization
subtitle: Anonymize data in Neon branches using the PostgreSQL Anonymizer extension
enableTableOfContents: true
updatedOn: '2025-03-07T21:44:32.257Z'
---

When working with production data, it's crucial to ensure that sensitive user information remains protected — especially in development or testing environments. With Neon, creating branches is fast, but how do you safely clone a production branch without exposing personal data?

The [PostgreSQL Anonymizer extension (`anon`)](https://postgresql-anonymizer.readthedocs.io) is ready to help. This Postgres extension allows you to mask, randomize, or obfuscate personal data, making it easy to create safe, anonymized branches.

<Admonition type="note" type="important">
Neon currently only supports **static masking** — not dynamic anonymization, which means you are modifying data. Additionally, the `anon` extension is currently **experimental** in Neon, so you must explicitly enable it on your project — we show how to do this below.
</Admonition>

In this guide, we demonstrate how to anonymize data on a Neon branch — we'll look at how to do this manually, and then we'll show how to automate this process using a GutHub Actions workflow.

## Anonymize branch data manually

<Steps>

## Prerequisites

Before you begin, make sure you have the following:

- A **Neon project** with a populated parent branch
- `psql` or any Postgres client, such as `psql`, pgAdmin, or Neon's SQL Editor

## Create sample data

In this example, we use a `production` branch containing a database with a `users` table with a few columns representing sensitive information.

You can create a sample data set with the following SQL commands:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    iban TEXT
);

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

To check the data, you can run a simple `SELECT` query:

```sql
SELECT * FROM users LIMIT 10;
```

## Create a new branch

Start by creating a branch from your `production` branch to anonymize. For example, you can create a new branch called `anonymized-dev`:

```bash
neonctl branch create --project-id <my-project-id> --name anonymized-dev --parent production --psql
```

This gives you a new branch with a snapshot of your data — not yet anonymized.

## Enable the `anon` extension

Get a connection string for your new branch:

```bash
neonctl cs anonymized-dev --project-id <my-project-id>
```

Connect to your branch using `psql`:

```bash
psql <connection_string>
```

Once connected, run the following command to enable the experimental extensions:

```sql
SET neon.allow_unstable_extensions = 'true';
```

Now you can enable the `anon` extension:

```sql
CREATE EXTENSION anon;
```

## Choose a masking strategy

In this example, we will use the faking strategy to anonymize columns in our `users` table. The faking strategy replaces sensitive data with random values that look similar to the original data but are not real:

```sql
SECURITY LABEL FOR anon ON COLUMN users.first_name IS 'MASKED WITH FUNCTION anon.fake_first_name()';
SECURITY LABEL FOR anon ON COLUMN users.last_name IS 'MASKED WITH FUNCTION anon.fake_last_name()';
SECURITY LABEL FOR anon ON COLUMN users.iban IS 'MASKED WITH FUNCTION anon.fake_iban()';
SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
```

You can read the [anon documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) for more details on the available strategies.

## Anonymize the data

After setting the security labels, you need to initialize the `anon` extension. This step is crucial as it prepares the extension for the anonymization process:

```sql
SELECT anon.init();
```

Now that you have set up the masking strategy, you can run the anonymization process. By executing `anonymize_database()` function, you can anonymize all the data in the database according to the masking strategy defined in the previous step:

```sql
SELECT anon.anonymize_database();
```

## Check the results

To verify that the data has been anonymized, you can run a simple `SELECT` query on the `users` table:

```sql
SELECT * FROM users LIMIT 10;
```

You should see that the sensitive data has been replaced with fake values.

## Tips for safely anonymizing data

- Double-check that you are on the correct branch before running the anonymization process.
- Generally, you should always back up your data before making any changes. With Neon, you can quickly restore a branch to a previous state. See [Instant restore](/docs/introduction/branch-restore).
- Test the anonymization process on a small subset of data before applying it to the entire database.
- Consider using different anonymization strategies for different columns based on their sensitivity.
- Regularly review and update your masking strategies to ensure you cover all sensitive data.
- You can enable the `anon` extension on your parent branch and set masking rules there, so you don't have to do it every time when creating a child branch, **but be careful not to init and run the anonymization process on the parent branch. Only do this on your child branch.** 

</Steps>


## Automate data anonymization

Creating anonymized database copies for development, testing, or preview environments is critical to protecting sensitive data. With [Neon](https://neon.tech) and the [`anon`](https://postgresql-anonymizer.readthedocs.io/) extension, you can mask sensitive data — but doing it manually every time can be tedious.

The following example shows how to **automate the creation of anonymized Neon branches** using **GitHub Actions**, triggered each time a pull request is opened or updated.

In this example, we will use static masking to anonymize our `users` table. The faking strategy replaces sensitive data with random values that look similar to the original data but are not real.

**What you’ll achieve**

Each time a PR is opened:

- A **new Neon branch** is created
- The `anon` PostgreSQL extension is initialized
- Masking rules are applied to sensitive fields
- A fully anonymized version of your parent's branch dataset is ready for use in CI, preview environments, or manual testing

<Steps>

## Prerequisites

Before setting up the GitHub Action:

- You have a **Neon project** with a populated parent branch.
- You’ve added the following repository secrets to your GitHub repository:
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`

<Admonition type="tip">
The Neon GitHub integration can set these secrets for your Neon project automatically. See [Neon GitHub integration](/docs/guides/neon-github-integration).
</Admonition>

## Set up the GitHub Action Workflow

Here’s an example of a YAML file describing Anonymization workflow (e.g. to be stored as `.github/workflows/create-anon-branch.yml`).
The masking rules are the same as in the manual anonymization steps above.

<Admonition type="note">
This is a simplified example. In a production environment, you should consider adding error handling, security measures, and other best practices.
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
          psql "${{ steps.create-branch.outputs.db_url }}" -c "SELECT * FROM NOW();"

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

To test the workflow:

1. Adjust the workflow file to your needs — define the right branch name, security labels, and ensure anonymization is run on the right branch.
2. Push the changes to your repository.
3. Open a new pull request.
4. Check the **Actions** tab in your GitHub repository to see the workflow run.
5. Verify that the anonymized Neon branch was created and that the data has been anonymized. You can quickly do so by connecting to the new branch or by viewing the table on the **Tables** page in the Neon Console.

## Cleaning up

Don't forget to clean up the anonymized branches after you're done testing. You can do this manually or automate it with[delete-branch-action](https://github.com/neondatabase/delete-branch-action) GitHub Action that you can run on PR close.

</Steps>

## Conclusion

With Neon, the PostgreSQL Anonymizer extension, you can easily create anonymized branches for development and testing — and with GitHub Actions, you can automate a Neon branch anonymization workflow. This ensures that sensitive user data is protected while still allowing your team to work with realistic datasets.

## Additional Resources

- [PostgreSQL Anonymizer extension docs](https://postgresql-anonymizer.readthedocs.io/)
- [PostgreSQL extensions supported by Neon](https://neon.tech/docs/extensions/pg-extensions)
- [GitHub Action for Creating Neon Branches](https://github.com/neondatabase/create-branch-action)
