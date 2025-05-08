---
title: Data anonymization
subtitle: Learn how to create anonymized Neon branches using the PostgreSQL Anonymizer extension
enableTableOfContents: true
updatedOn: '2025-03-07T21:44:32.257Z'
---

When working with production data, it's crucial to ensure that sensitive user information remains protected — especially in development or testing environments. With Neon, creating branches is fast, but how do you safely clone a production branch without exposing personal data?

The [`anon`](https://postgresql-anonymizer.readthedocs.io) extension is ready to help: it's a PostgreSQL extension for data anonymization. It allows you to mask, randomize, or obfuscate personal data, making it easy to create safe, anonymized branches.

<Admonition type="note" type="important">
Neon currently only supports **static masking** — not dynamic anonymization.
It is also an **experimental extension**, so you must explicitly enable it on your project,
see the docs [here](https://neon.tech/docs/extensions/pg-extensions#experimental-extensions).
</Admonition>

---

## Prerequisites

- You have a **Neon project** with a populated parent branch
- `psql` or any PostgreSQL client, such as psql, pgAdmin, or Neon's SQL editor

---

<Steps>

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

Start by creating a branch from the branch you want to anonymize. For example, if you have a `production` branch, you can create a new branch called `anonymized-dev`:

```bash
neonctl branch create --project-id <my-project-id> --name anonymized-dev --parent production --psql
```

This gives you a new branch with a snapshot of your data, but without anonymization... yet.

## Enable the `anon` Extension

Get a connection string for your new branch:

```bash
neonctl cs anonymized-dev --project-id <my-project-id>
```

To use the `anon` extension, you need to enable it on your branch. Connect to your branch using `psql`:

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

In this example, we will use the faking strategy to anonymize our `users` table. The faking strategy replaces sensitive data with random values that look similar to the original data but are not real:

```sql
SECURITY LABEL FOR anon ON COLUMN users.first_name IS 'MASKED WITH FUNCTION anon.fake_first_name()';
SECURITY LABEL FOR anon ON COLUMN users.last_name IS 'MASKED WITH FUNCTION anon.fake_last_name()';
SECURITY LABEL FOR anon ON COLUMN users.iban IS 'MASKED WITH FUNCTION anon.fake_iban()';
SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
```

You can read the [anon documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) for more details on the available strategies.

### Anonymize the data

After setting the security labels, you need to initialize the `anon` extension. This step is crucial as it prepares the extension for the anonymization process:

```sql
SELECT anon.init();
```

Now that we have set up the masking strategy, we can run the anonymization process, by executiny `anonymize_database()` function, we can anonymize all the data in the database according to the masking strategy defined in the previous step:

```sql
SELECT anon.anonymize_database();
```

### Check the results

To verify that the data has been anonymized, you can run a simple `SELECT` query on the `users` table:

```sql
SELECT * FROM users LIMIT 10;
```

You should see that the sensitive data has been replaced with fake values.

</Steps>

---

### Tips for safely anonymizing data

- Double-check that you are on the correct branch before running the anonymization process.
- Always back up your data before making any changes. With Neon, it's easy to restore a branch to a previous state.
- Test the anonymization process on a small subset of data before applying it to the entire database.
- Consider using different anonymization strategies for different columns based on their sensitivity.
- Regularly review and update your masking strategies to ensure you cover all sensitive data.
- You can enable the `anon` extension on your parent branch and set masking rules there, so you don't have to do it every time when creating a child branch. But be careful not to init and run the anonymization process on the parent branch!

---

## Automate anonymized branch creation in Neon using GitHub Actions

Creating anonymized database copies for development, testing, or preview environments is critical to protecting user data. With [Neon](https://neon.tech) and the [`anon`](https://postgresql-anonymizer.readthedocs.io/) extension, you can mask sensitive data — but doing it manually every time can be tedious.

In this post, we’ll show you how to **automate the creation of anonymized Neon branches** using **GitHub Actions**, triggered every time a pull request is opened or updated.

In this example, we will use static masking to anonymize our `users` table. The faking strategy replaces sensitive data with random values that look similar to the original data but are not real.

---

### What you’ll achieve

Each time a PR is opened:

- A **new Neon branch** is created (e.g. `anon-pr-42`).
- The `anon` PostgreSQL extension is initialized.
- Masking rules are applied to sensitive fields.
- A fully anonymized version of your parent's branch dataset is ready for use in CI, preview environments, or manual testing.

---

### Prerequisites

Before setting up the GitHub Action:

- You have a **Neon project** with a populated parent branch.
- You’ve added the following repository secrets to your GitHub repository:
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`

---

### �� GitHub Action Workflow

Here’s an example of a YAML file describing Anonymization workflow (e.g. to be stored as `.github/workflows/create-anon-branch.yml`),
the masking rules are the same as in the article above.

> ⚠️ **Important Note**:
> This is a simplified example. In a production environment, you should consider adding error handling, security measures, and other best practices.

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

## Testing the Workflow

To test:

1. Adjust the workflow file to your needs (set the right branch name, security labels, ensure anonymization is run on the right branch, etc).
2. Push the changes to your repository.
3. Open a new pull request.
4. Check the Actions tab in your GitHub repository to see the workflow run.
5. Verify that the anonymized branch has been created and that the data has been anonymized.

## Cleaning Up

Don't forget to clean up the anonymized branches after you're done testing. You can do this manually or automate it with[delete-branch-action](https://github.com/neondatabase/delete-branch-action) GitHub Action that you can run on PR close.

## Conclusion

With Neon, anon extension, and GitHub Actions, you can easily create anonymized branches for development and testing. This ensures that sensitive user data is protected while still allowing your team to work with realistic datasets.

## Additional Resources

- [PostgreSQL Anonymizer extension docs](https://postgresql-anonymizer.readthedocs.io/)
- [PostgreSQL extensions supported by Neon](https://neon.tech/docs/extensions/pg-extensions)
- [GitHub Action for Creating Neon Branches](https://github.com/neondatabase/create-branch-action)
