---
title: Data anonymization
subtitle: Mask sensitive data in development branches using Postgres Anonymizer
redirectFrom:
  - /docs/concepts/anonymized-data
tag: new
enableTableOfContents: true
updatedOn: '2025-10-21T09:00:11.984Z'
---

<FeatureBeta />

Need to test against production data without exposing sensitive information? Anonymized branches let you create development copies with masked PII, emails, phone numbers, and other sensitive data.

Neon uses [Postgres Anonymizer](https://postgresql-anonymizer.readthedocs.io/) for static data masking, and applies masking rules when you create or update the branch. This approach gives you realistic test data while protecting user privacy and supporting compliance requirements like GDPR.

**Key characteristics:**
- **Static masking**: Data is masked once during branch creation or when you rerun anonymization
- **Postgres Anonymizer integration**: Uses the [Postgres Anonymizer extension's](/docs/extensions/postgresql-anonymizer) masking functions
- **Branch-specific rules**: Define different masking rules for each anonymized branch

<Admonition type="info" title="Static versus dynamic masking">
This feature uses **static masking**, which permanently transforms data in the branch when anonymization runs. Unlike dynamic masking (which masks data during queries), static masking creates an actual masked copy of the data. To get fresh data from the parent, create a new anonymized branch.
</Admonition>

## Create a branch with anonymized data

<Tabs labels={["Console", "API"]}>

<TabItem>

Select **Anonymized data** as the data option when creating a new branch.

1. Navigate to your project in the Neon Console
2. Select **Projects** -> **Branches** from the sidebar
3. Click **New Branch**
4. In the **Create new branch** dialog:
   - Select your **Parent branch** (typically `production` or `main`)
   - (Optional) Enter a **Branch name**
   - (Optional) Set **Expire branch after** if you want automatic cleanup
   - Under data options, select **Anonymized data**
5. Click **Create**

After creation, the Console loads the **Data Masking** page where you define and execute anonymization rules for your branch.

![Neon Console 'Create new branch' dialog with 'Anonymized data' selected](/docs/workflows/anon-create-a-new-branch.png)

</TabItem>

<TabItem>

Use the [Create anonymized branch](https://api-docs.neon.tech/reference/createprojectbranchanonymized) endpoint, for example:

```bash
curl -X POST \
  'https://console.neon.tech/api/v2/projects/{project_id}/branch_anonymized' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "masking_rules": [
      {
        "database_name": "neondb",
        "schema_name": "public",
        "table_name": "users",
        "column_name": "email",
        "masking_function": "anon.dummy_free_email()"
      }
    ],
    "start_anonymization": true
  }'
```

**Request parameters:**

- `masking_rules` (optional): Array of masking rules to apply to the branch. Each rule specifies:
  - `database_name`: Target database
  - `schema_name`: Target schema (typically `public`)
  - `table_name`: Table containing sensitive data
  - `column_name`: Column to mask
  - `masking_function`: Postgres Anonymizer function to apply
- `start_anonymization` (optional): Set to `true` to automatically start anonymization after branch creation

The API supports all Postgres Anonymizer masking functions, providing more options than the Console UI. You can also export and import masking rules to manage them outside of Neon.

</TabItem>

</Tabs>

## Manage masking rules

<Tabs labels={["Console", "API"]}>

<TabItem>

From the **Data Masking** page:

1. Select the Schema, Table, and Column you wish to mask.
2. Choose a Masking function from the dropdown list (e.g., "Dummy Free Email" to execute `anon.dummy_free_email()`). The Console provides a curated list of common functions. For the full set of Postgres Anonymizer functions, you must use the API.
3. Repeat for all sensitive columns.
4. When you are ready, click `Apply Masking Rules` to start the anonymization job. You can monitor its progress on this page.

> Important: Rerunning the anonymization process on the anonymized branch applies rules to previously anonymized data, not fresh data from the parent branch. To start from the parent's original data, create a new anonymized branch.

![Neon Console 'data masking' dialog with example masking functions configured](/docs/workflows/anon-data-masking.png)

</TabItem>

<TabItem>

**Get masking rules**
```bash
GET /projects/{project_id}/branches/{branch_id}/masking_rules
```

Retrieves all masking rules defined for the branch.

**Update masking rules**
```bash
PATCH /projects/{project_id}/branches/{branch_id}/masking_rules
```

Updates masking rules for the branch. After updating rules, use the start anonymization endpoint to apply the changes.

**Start anonymization**
```bash
POST /projects/{project_id}/branches/{branch_id}/anonymize
```

Starts or restarts the anonymization process for branches in `initialized`, `error`, or `anonymized` state.

**Get anonymization status**
```bash
GET /projects/{project_id}/branches/{branch_id}/anonymized_status
```

Returns the current state (`created`, `initialized`, `initialization_error`, `anonymizing`, `anonymized`, or `error`) and progress information.

</TabItem>

</Tabs>

## Common workflow

1. Create an anonymized branch from your production branch.
2. Define masking rules for sensitive columns (emails, names, addresses, etc.).
3. Apply the masking rules.
4. Connect your development environment to the anonymized branch.
5. When you need fresh data, create a new anonymized branch.

## How anonymization works

When you create a branch with anonymized data:

1. Neon creates a new branch by copying schema and data from the parent branch.
2. You define masking rules for tables and columns containing sensitive data:
   - **Console**: The Data Masking page opens automatically after branch creation.
   - **API**: Include masking rules in the creation request or add them later via the masking rules endpoint.
3. You apply the masking rules (in Console, click **Apply Masking Rules**), and the Postgres Anonymizer extension masks the branch data.
4. You can update rules and rerun anonymization on the branch as needed.

The parent branch data remains unchanged. Rerunning anonymization applies rules to the branch's current (already masked) data, not fresh data from the parent.

<Admonition type="note">
The branch is unavailable for connections while anonymization is in progress.
</Admonition>

## Limitations

- Cannot reset to parent, restore, or delete the read-write endpoint for anonymized branches.
- Rerunning anonymization works on already-masked data. Create a new branch for fresh parent data.
- Branch is unavailable during anonymization.
- Masking does not enforce database constraints (e.g., primary keys can be masked as NULL).
- The Console provides a curated subset of masking functions, use the API for all [Postgres Anonymizer masking functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/).

## Related resources

- [Postgres Anonymizer documentation](https://postgresql-anonymizer.readthedocs.io/)
- [Neon branching overview](/docs/introduction/branching)
- [Neon API reference](https://api-docs.neon.tech/reference/)

---

## Automate data anonymization with GitHub Actions

<Admonition type="important">
The GitHub Actions workflow below uses manual SQL commands with Postgres Anonymizer. For automation using the new Console/API approach documented above, wait for upcoming post-beta improvements to better support automated anonymization.
</Admonition>

As an interim solution, you can automate anonymized branch creation using direct SQL commands as outlined below.

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

1. Customize the workflow for your environment by adjusting the branch naming convention and security labels
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
