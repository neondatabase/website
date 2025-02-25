---
title: Schema-only branches
subtitle: Protect sensitive data with schema-only branches
enableTableOfContents: true
updatedOn: '2025-02-07T17:55:42.638Z'
---

<EarlyAccess />

Neon supports creating schema-only branches, letting you create branches that replicate only the database schema from a source branch — without copying any of the actual data. This feature is ideal for working with confidential information. Instead of duplicating this sensitive data, you can now create a branch with just the database structure and populate it with randomized or anonymized data instead. This provides your team with a secure and compliant environment for developing and testing using Neon branches.

## Creating schema-only branches

You can create schema-only branches in the Neon Console or using the Neon API, in much the same way you create any Neon branch. Support for the Neon CLI will come in a future release.

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To create a schema-only branch from the Neon Console:

1. In the console, select your project.
2. Select **Branches**.
3. Click **Create branch** to open the branch creation dialog.
4. Under **Include**, Select the **Schema-only** option.
5. Provide a name for the branch.
6. In the **From Branch** field, select the source branch. The schema from the source branch will be copied to your new schema-only branch.
7. Click **Create branch**.

</TabItem>

<TabItem>

To create a schema-only branch using the Neon CLI:

```bash
neon branch create --schema-only
```

If you have more than one project, you'll need to specify the `--project-id` option. See [Neon CLI - branch create](/docs/reference/cli-branches#create).

</TabItem>

<TabItem>

<Admonition type="note">
The API is in Beta and subject to change.
</Admonition>

To create a schema-only branch using the Neon API, use the [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) endpoint with the `init_source` option set to `schema-only`, as shown below. Required values include:

- Your Neon `project_id`
- The `parent_id`, which is the branch ID of the branch containing the schema you want to copy

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/wispy-salad-58347608/branches \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "branch": {
    "parent_id": "br-super-mode-w371g4od",
    "name": "my_schema_only_branch",
    "init_source": "schema-only"
  }
}
'
```

</TabItem>

</Tabs>

## Schema-only branching example

To try out schema-only branches:

1. Start by creating an `employees` table on your Neon project's `main` branch and adding some dummy data. You can do this from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client by copying and pasting the following statements:

   ```sql
   CREATE TABLE employees (
       employee_id SERIAL PRIMARY KEY,
       first_name VARCHAR(50),
       last_name VARCHAR(50),
       email VARCHAR(100),
       phone_number VARCHAR(15),
       job_title VARCHAR(50),
       salary NUMERIC(10, 2),
       hire_date DATE
   );

   INSERT INTO employees (first_name, last_name, email, phone_number, job_title, salary, hire_date) VALUES
   ('John', 'Doe', 'john.doe@example.com', '123-456-7890', 'Software Engineer', 95000.00, '2020-01-15'),
   ('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210', 'Product Manager', 110000.00, '2019-03-22'),
   ('Alice', 'Johnson', 'alice.johnson@example.com', '555-123-4567', 'HR Specialist', 65000.00, '2021-06-10'),
   ('Bob', 'Brown', 'bob.brown@example.com', '555-987-6543', 'Data Analyst', 78000.00, '2018-09-05'),
   ('Charlie', 'Davis', 'charlie.davis@example.com', '444-555-6666', 'Marketing Manager', 95000.00, '2017-11-14'),
   ('Diana', 'Miller', 'diana.miller@example.com', '333-444-5555', 'Sales Representative', 72000.00, '2022-04-18'),
   ('Edward', 'Wilson', 'edward.wilson@example.com', '222-333-4444', 'DevOps Engineer', 98000.00, '2020-12-03'),
   ('Fiona', 'Clark', 'fiona.clark@example.com', '111-222-3333', 'UI/UX Designer', 85000.00, '2016-08-29'),
   ('George', 'Harris', 'george.harris@example.com', '999-888-7777', 'Financial Analyst', 90000.00, '2021-01-11'),
   ('Hannah', 'Martin', 'hannah.martin@example.com', '888-777-6666', 'Backend Developer', 92000.00, '2019-07-23');
   ```

2. Navigate to the **Tables** page in the Neon Console, and select your `main` branch from the bread-crumb menu at the top of the console. Your `employees` table will have both schema and data, as shown here:

   ![main branch with schema and data](/docs/guides/schema-data-branch.png)

3. Create a schema-only branch following the instructions above. See [Creating schema-only branches](#creating-schema-only-branches). In this example, we've named the branch `employees_schema_only`.

   ![schema-only branch creation](/docs/guides/create_schema_only_branch.png)

4. On the **Tables** page, select your newly created `employees_schema_only` branch from the bread-crumb menu at the top of the console. You can see that the schema-only branch contains the schema, but no data. The same will be true for any table in any database on the schema-only branch — only the schema will be present.

   ![schema-only branch with only the schema](/docs/guides/schema-only-branch.png)

## Connect to a schema-only branch

Connecting to a schema-only branch works the same way as connecting to any Neon branch. You'll connect via a compute associated with the branch. Follow these steps to connect using `psql` and a connection string obtained from the Neon Console.

1. In the Neon Console, select a project.
2. From the project **Dashboard**, click **Connect**, and select your schema-only branch, the database, and the role you want to connect with.
   ![Connection details modal](/docs/guides/schema_only_branch_connect.png)
3. Copy the connection string. A connection string includes your role name, the compute hostname, and the database name.

   ```bash shouldWrap
   postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

## What's different about schema-only branches?

Unlike other branches, schema-only branches do not have a parent branch, as you can see below. Both the `main` branch of the project and the schema-only branch have no parent, indicated by the dash in the **Parent** column (`-`) on the **Branches** page in your Neon project.

![schema-only branch](/docs/guides/schema_only_no_parent.png)

Schema-only branches are independent [root branches](/docs/reference/glossary#root-branch), just like the `main` branch in your Neon project. When you create a schema-only branch, you’re creating a new **root branch**.

### Key points about schema-only branches

- **No parent branch**: Schema-only branches are root branches. They do not have a parent branch.
- **No shared history**: Data added to a schema-only branch is independent and adds to your storage. There is no shared history with a parent.
- **Reset from parent is not supported**: With no parent branch, [reset from parent](/docs/manage/branches#reset-a-branch-from-parent) operations are not supported.
- **Restore is supported, but...** performing a [restore](/docs/guides/branch-restore) operation on a schema-only branch copies both schema and data from the source branch.
- **Branch protection is supported**: Like any other branch, you can enable [branch protection](/docs/guides/protected-branches) for schema-only branches.

## Schema-only branch allowances

There are certain allowances associated with schema-only branches:

- A schema-only branch is a [root branch](/docs/reference/glossary#root-branch), and only a certain number of root branches are permitted per Neon project, depending on your Neon plan.
- The `main` root branch created with each Neon project counts toward the _root branch allowance per project_, as do certain [backup branches](/docs/reference/glossary#backup-branch) created by restore operations.
- On the Free plan, all branches share a total storage limit of 0.5 GB. Schema-only branches count toward this limit like any other branch. On paid plans, storage limits are higher, but each schema-only branch has a maximum storage allowance, as outlined in the following table.

| Plan     | Root branch allowance per project | Maximum storage allowance per schema-only branch |
| :------- | :-------------------------------- | :----------------------------------------------- |
| Free     | 3                                 | 0.5 GB                                           |
| Launch   | 5                                 | 3 GB                                             |
| Scale    | 10                                | 5 GB                                             |
| Business | 25                                | 20 GB                                            |

Once you use up your root branch allowance, you will not be able to create additional schema-only branches. You will be required to remove existing root branches first.
