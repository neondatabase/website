---
title: Data anonymization
subtitle: Mask sensitive data in development branches using PostgreSQL Anonymizer
summary: >-
  Covers the setup of anonymized branches in Neon to mask sensitive data using
  PostgreSQL Anonymizer, enabling realistic testing without exposing personally
  identifiable information (PII).
redirectFrom:
  - /docs/concepts/anonymized-data
tag: new
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.153Z'
---

<FeatureBeta />

Need to test against production data without exposing sensitive information? Anonymized branches let you create development copies with masked personally identifiable information (PII) - such as emails, phone numbers, and other sensitive data.

Neon uses [PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/) for static data masking, and applies masking rules when you create or update the branch. This approach gives you realistic test data while protecting user privacy and supporting compliance requirements like GDPR.

**Key characteristics:**

- **Static masking**: Data is masked once during branch creation or when you rerun anonymization
- **PostgreSQL Anonymizer integration**: Uses the [PostgreSQL Anonymizer extension's](/docs/extensions/postgresql-anonymizer) masking functions
- **Branch-specific rules**: You can define different masking rules for each anonymized Neon branch

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
   - (Optional) **Automatically delete branch after** is checked by default with 1 day selected. You can change it, uncheck it, or leave it as is to automatically delete the branch after the specified time.
   - Under data options, select **Anonymized data**
5. Click **Create**

![Neon Console 'Create new branch' dialog with 'Anonymized data' selected](/docs/workflows/anon-create-a-new-branch.png)

After creation, the Console loads the [Data Masking](#manage-masking-rules) page where you define and execute anonymization rules for your branch.
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

For complete parameter documentation and additional examples, see [Create anonymized branch](/docs/workflows/data-anonymization-api#create-anonymized-branch) in the API reference. The API supports all PostgreSQL Anonymizer masking functions, providing more options than the Console UI. You can also export and import masking rules to manage them outside of Neon.

</TabItem>

</Tabs>

## How anonymization works

When you create a branch with anonymized data:

1. Neon creates a new branch with the schema and data from the parent branch.
2. You define masking rules for tables and columns containing sensitive data. You can use any combination of these methods:
   - **Console**: The Data Masking page opens automatically after branch creation.
   - **API**: Include masking rules in the creation request or add them later via the masking rules endpoint.
   - **SQL**: Connect to the branch (after initial anonymization) and use `SECURITY LABEL` commands.
3. You apply the masking rules (in Console, click **Apply masking rules**; via API, call the [start anonymization endpoint](/docs/workflows/data-anonymization-api#start-anonymization)), and the PostgreSQL Anonymizer extension masks the branch data.
4. You can update rules and rerun anonymization on the branch as needed.

The parent branch data remains unchanged. Rerunning anonymization applies rules to the branch's current (already masked) data, not fresh data from the parent.

<Admonition type="note">
The branch is unavailable for connections while anonymization is in progress.
</Admonition>

## Manage masking rules

You can create and manage masking rules via the Console, API, or SQL. All three methods are interchangeable and produce equivalent results.

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

From the **Data Masking** page:

1. Select the schema, table, and column you want to mask.
2. Choose a masking function from the dropdown list (e.g., **Dummy Free Email** to execute `anon.dummy_free_email()`). The Console provides a curated list of common functions. For the full set of PostgreSQL Anonymizer functions, you must use the API or SQL.

<Admonition type="tip">
For email columns with unique constraints, use **Random Unique Email**, which generates UUID-based emails that maintain uniqueness while preserving the email format.
</Admonition>

<Admonition type="note" title="usage notes">
- Foreign key columns cannot be masked directly to maintain referential integrity. If you attempt to mask a foreign key column, the Console will display an alert with a "Go to primary key" action that navigates to the corresponding primary key column where you can apply masking rules. Primary key columns can be anonymized. Neon automatically handles foreign key constraints during the anonymization process to maintain referential integrity across related tables.
- If you've defined custom masking rules via the API or SQL (such as custom PostgreSQL expressions like `pg_catalog.concat(anon.dummy_uuidv4(), '@customdomain.com')` that aren't available in the Console's dropdown), these rules will display as text in the Console showing the underlying expression. The Console preserves these custom rules when you run anonymization. You can safely mix Console, API, and SQL workflows.
</Admonition>

3. Repeat for all sensitive columns.
4. When you are ready, click **Apply masking rules** to start the anonymization job. You can monitor its progress on this page or via the [API](/docs/workflows/data-anonymization-api#get-anonymization-status).

![Neon Console 'data masking' dialog with example masking functions configured](/docs/workflows/anon-data-masking.png)

<Admonition type="important">
Rerunning the anonymization process on the anonymized branch applies rules to previously anonymized data, not fresh data from the parent branch. To start from the parent's original data, create a new anonymized branch.
</Admonition>

</TabItem>

<TabItem>

For complete API documentation with request/response examples, see the [Data anonymization API reference](/docs/workflows/data-anonymization-api). Note that the Console uses friendly labels for masking functions (e.g., **Random Unique Email**), but the API returns and accepts the underlying PostgreSQL expressions (e.g., `pg_catalog.concat(anon.dummy_uuidv4(), '@example.com')`).

**Update masking rules**

```bash
PATCH /projects/{project_id}/branches/{branch_id}/masking_rules
```

Example request to mask an email column:

```bash
curl -X PATCH \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/masking_rules' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "masking_rules": [{
      "database_name": "neondb",
      "schema_name": "public",
      "table_name": "users",
      "column_name": "email",
      "masking_function": "anon.dummy_free_email()"
    }]
  }'
```

<Admonition type="important">
The API replaces all masking rules with the provided array. To add a new rule, include all existing rules in your request.
</Admonition>

**Start anonymization**

```bash
POST /projects/{project_id}/branches/{branch_id}/anonymize
```

**Get anonymization status**

```bash
GET /projects/{project_id}/branches/{branch_id}/anonymized_status
```

</TabItem>

<TabItem>

You can create masking rules directly using PostgreSQL Anonymizer's `SECURITY LABEL` syntax. This requires connecting to your anonymized branch after it has reached the `anonymized` state (create and run initial rules via Console or API first).

Example creating a masking rule for an email column:

```sql
SECURITY LABEL FOR anon ON COLUMN users.email
IS 'MASKED WITH FUNCTION anon.dummy_free_email()';
```

Remove a masking rule:

```sql
SECURITY LABEL FOR anon ON COLUMN users.email IS NULL;
```

<Admonition type="note">
After creating or modifying rules via SQL, use the Console or API to run anonymization. Rules using standard functions appear normally in the Console; custom functions appear as text.
</Admonition>

</TabItem>

</Tabs>

## Retrieve masking rules

You can view existing masking rules via the Console, API, or SQL.

<Tabs labels={["Console", "API", "SQL"]}>

<TabItem>

From the **Data Masking** page, all defined masking rules are displayed for each table and column. Rules using standard functions appear as dropdown selections, while custom rules (functions not available in the Console dropdown) appear as text showing the underlying PostgreSQL expression.

</TabItem>

<TabItem>

Use the [Get masking rules](https://api-docs.neon.tech/reference/getmaskingrules) endpoint:

```bash
curl -X GET \
  'https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/masking_rules' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Accept: application/json'
```

Example response:

```json
{
  "masking_rules": [
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
      "column_name": "phone",
      "masking_function": "anon.partial(phone, 2, 'XXX-XXXX', 2)"
    },
    {
      "database_name": "neondb",
      "schema_name": "public",
      "table_name": "users",
      "column_name": "address",
      "masking_value": "'CONFIDENTIAL'"
    }
  ]
}
```

The API returns all rules regardless of how they were created (Console, API, or SQL). Rules can use either `masking_function` (for dynamic masking) or `masking_value` (for static values).

</TabItem>

<TabItem>

Connect to your anonymized branch and query the `anon.pg_masking_rules` view:

```sql
SELECT relnamespace, relname, attname, masking_function, masking_value
FROM anon.pg_masking_rules
ORDER BY relname, attname;
```

Example result:

```
 relnamespace | relname | attname |       masking_function        | masking_value
--------------+---------+---------+-------------------------------+---------------
 public       | users   | address |                               | 'CONFIDENTIAL'
 public       | users   | email   | anon.dummy_free_email()       |
 public       | users   | phone   | anon.partial(phone, 2, 'XXX-XXXX', 2) |
```

This query returns all rules regardless of how they were created (Console, API, or SQL). Rules defined with `MASKED WITH FUNCTION` populate `masking_function`, while rules defined with `MASKED WITH VALUE` populate `masking_value`.

</TabItem>

</Tabs>

## Common workflow

1. Create an anonymized branch from your production branch.
2. Define masking rules for sensitive columns (emails, names, addresses, etc.).
3. Apply the masking rules.
4. [Connect](/docs/connect/connect-from-any-app) your development environment to the anonymized branch.
5. When you need fresh data, create a new anonymized branch.

## Limitations

- Currently cannot reset to parent, restore, or delete the read-write endpoint for anonymized branches.
- Branch is unavailable during anonymization.
- Masking does not fully enforce database constraints, but improvements are ongoing. For example, use **Random Unique Email** for columns with unique constraints on emails.
- **Foreign key columns cannot be masked directly.** To maintain referential integrity, mask the corresponding primary key column instead. Neon automatically handles foreign key constraints during anonymization, temporarily modifying them to cascade updates and restoring them to their original state after the process completes. The Console displays an alert with a "Go to primary key" action that navigates to the relevant primary key column.
- Anonymized branches do not currently support projects with [IP Allow](/docs/manage/projects#configure-ip-allow) or [Private Networking](/docs/guides/neon-private-networking) enabled.
- The Console provides a curated subset of masking functions for creation. Use the API or SQL for all [PostgreSQL Anonymizer masking functions](https://postgresql-anonymizer.readthedocs.io/en/latest/masking_functions/).

## Related resources

- [Data Anonymization API Reference](/docs/workflows/data-anonymization-api) - Complete API documentation with request/response examples
- [Data Anonymization with GitHub Actions](/docs/workflows/data-anonymization-github-actions) - Automate anonymized branch creation in CI/CD
- [PostgreSQL Anonymizer documentation](https://postgresql-anonymizer.readthedocs.io/)
- [Neon branching overview](/docs/introduction/branching)
- [Neon API reference](https://api-docs.neon.tech/reference/)
