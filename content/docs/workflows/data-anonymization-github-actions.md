---
title: Data anonymization with GitHub Actions
subtitle: Automate anonymized branch creation in your CI/CD pipeline
summary: >-
  Automate anonymized branch creation in your CI/CD pipeline using GitHub
  Actions with the Neon Create Branch Action, allowing for the definition of
  masking rules directly in your workflow.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.153Z'
---

This page shows how to automate data anonymization with GitHub Actions. For conceptual overview and usage instructions, see [Data Anonymization](/docs/workflows/data-anonymization).

Automate anonymized branch creation using the [Neon Create Branch Action](https://github.com/neondatabase/create-branch-action). The `masking_rules` input lets you define masking rules directly in your workflow, creating an anonymized branch in a single step.

<Steps>

## Requirements

Before setting up the workflow:

- A **Neon project** with a populated parent branch
- The following GitHub repository secrets:
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`

<Admonition type="tip">
The Neon GitHub integration configures these secrets automatically. See [Neon GitHub integration](/docs/guides/neon-github-integration).
</Admonition>

## Set up the workflow

Create a file at `.github/workflows/create-anon-branch.yml` with the following content:

```yaml
name: Create Anonymized Branch for PR

on:
  pull_request:
    types: [opened, reopened]

jobs:
  create-anon-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Create anonymized branch
        uses: neondatabase/create-branch-action@v6
        id: create-branch
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch_name: anon-pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
          masking_rules: |
            [
              {
                "database_name": "neondb",
                "schema_name": "public",
                "table_name": "users",
                "column_name": "email",
                "masking_function": "anon.dummy_free_email()"
              },
              {
                "database_name": "neondb",
                "schema_name": "public",
                "table_name": "users",
                "column_name": "first_name",
                "masking_function": "anon.fake_first_name()"
              },
              {
                "database_name": "neondb",
                "schema_name": "public",
                "table_name": "users",
                "column_name": "last_name",
                "masking_function": "anon.fake_last_name()"
              }
            ]

      - name: Output branch details
        run: |
          echo "Branch ID: ${{ steps.create-branch.outputs.branch_id }}"
          echo "Database URL: ${{ steps.create-branch.outputs.db_url }}"
```

The `masking_rules` input accepts a JSON array where each rule specifies:

| Field              | Description                             |
| ------------------ | --------------------------------------- |
| `database_name`    | Target database (e.g., `neondb`)        |
| `schema_name`      | Target schema (typically `public`)      |
| `table_name`       | Table containing sensitive data         |
| `column_name`      | Column to mask                          |
| `masking_function` | PostgreSQL Anonymizer function to apply |

For available masking functions, see [PostgreSQL Anonymizer documentation](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/) or the [Manage masking rules](/docs/workflows/data-anonymization#manage-masking-rules) section of the main guide.

<Admonition type="note">
The `masking_rules` input creates a new anonymized branch. Masking rules cannot be applied to existing branches.
</Admonition>

## Testing the workflow

1. Customize and push the workflow file to your repository
2. Open a new pull request
3. Check the **Actions** tab to monitor workflow execution
4. Verify the anonymized branch in the Neon Console or connect to it to confirm data is masked

## Clean up branches

Clean up anonymized branches when no longer needed. Automate this with the [delete-branch-action](https://github.com/neondatabase/delete-branch-action) when PRs close:

```yaml
name: Delete Branch on PR Close

on:
  pull_request:
    types: closed

jobs:
  delete-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Delete anonymized branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch: anon-pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

</Steps>
