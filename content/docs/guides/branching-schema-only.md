---
title: Schema-only branches
subtitle: Protect sensitive data with schema-only branches
enableTableOfContents: true
updatedOn: '2025-01-10T00:37:35.161Z'
---

<EarlyAccess />

Schema-only branches let you create branches that copy only the database schema from a parent branch—without copying any data. This feature is useful when working with datasets containing sensitive data. By working with schema-only branches, you can replicate your database structure without exposing confidential information, giving your team a safe, compliant way to build and test.

## Creating schema-only branches

<Admonition type="note">
Schema-only branching is currently supported in the Neon Console only. CLI and API support are planned for a future release.
</Admonition>

You can create schema only branches in the Neon Console, in the same way you create any Neon branch.

1. In the Neon Console, select your project.
2. Select **Branches**.
3. Click **Create branch** to open the branch creation dialog.
   ![Create branch dialog](/docs/manage/create_branch.png)
4. For **Type**, select **Schema-only**.
4. Enter a name for the branch.
5. In the **From Branch** field, select the source branch. The schema from this branch will be copied to your new branch. 
6. Click **Create new branch**.

## Schema-only branching example

To try out schema-only branches, you can create a table with some fake Personally Identifiable Information (PII):

1. In the Neon SQL Editor, create an `employees` table on your Neon project's `main` branch, and add some Personally Identifiable Information (PII):

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

2. Create a schema-only branch following the branch creation instructions above — call the branch `employees_schema_only`.

3. Navigate to the **Tables** page in the Neon Console, and view the data in the `main` branch, which contains both schema and data.

4. Next, on the **Tables** page again, select your newly created schema-only branch (`employees_schema_only`) from the bread-crumb menu at the top of the window. You can see that the schema-only branch contains the schema, but no data. The same would be true for any user-created table in the database.

## Connect to a schema-only branch

Connecting to a schema-only branch works the same way as connecting to any Neon branch. You'll connect via a compute associated with the branch. Follow these steps to connect using `psql` and a connection string obtained from the Neon Console.

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select your schema-only branch, the database, and the role you want to connect with.
   ![Connection details widget](/docs/connect/connection_details.png)
3. Copy the connection string. A connection string includes your role name, the compute hostname, and the database name.
4. Connect with `psql` as shown below.

```bash shouldWrap
psql postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

## What's different about schema-only branches?

Unlike other branches, a schema-only branch is not a child of a parent branch. It's an independent [root branch](/docs/reference/glossary#root-branch), just like the `main` branch in your Neon project. When you create a schema-only branch, you’re creating a new, empty root branch and copying the schema from another branch you select.

### Key points about schema-only branches

- **Independent data and storage**: Schema-only branches are completely independent of other branches when it comes to data and storage.
- **No shared data**: Data is not shared with any parent branch. Any data added to a schema-only branch is separate and contributes to its own storage. There is no shared history with a parent branch.
- **No parent relationship**: As a root branch, a schema-only branch has no parent. This means it does not support [Reset from parent](/docs/manage/branches#reset-a-branch-from-parent).
- **Restore behavior**: Performing a [restore](/docs/guides/branch-restore) operation on a schema-only branch copies both schema and data from the source branch. After a restore, the branch will no longer be schema-only.


## Limitations

- Schema-only branches do no


