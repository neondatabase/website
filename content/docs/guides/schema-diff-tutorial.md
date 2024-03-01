---
title: Schema diff tutorial
subtitle: Step-by-step guide showing you how to compare two development branches using Schema Diff
enableTableOfContents: true
---

In this guide we will create an initial schema on a new database called `staging` on our `main` branch. We'll then create two child development branches called `dev/alex` and `dev/jordan`, following our recommended convention for naming development branches. After making schema changes on `dev/jordan`, we'll use use the **Schema Diff** tool on the **Restore** page to get a side-by-side, Github-style visual comparison between these two development branches.

## Initial Setup

### Step 1: Create the Initial Schema

Start by creating a new `staging` database using the CLI. If you've got multiple projects, include `--project-id`.

```bash
neonctl databases create --name staging
```

Now create the initial schema that will serve as the base from which future changes and branches will diverge.

1. Connect to the new database with psql:

    ```bash
    psql 'postgresql://alex:*********@ep-sparkling-rain-93067869.us-east-2.aws.neon.build/staging?sslmode=require'
    ```

2. Create the schema:

    ```sql
    CREATE TABLE person (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    );
    ```

### Step 2: Create your team's branches

If you're still in `psql`, exit using `\q`. Using the CLI, create child branches for each member of your team. Include `--project-id` if you have multiple projects.

```bash
neonctl branches create --name dev/alex --parent main
```

```bash
neonctl branches create --name dev/jordan --parent main
```

If you want to verity that these branches include the initial schema, connect to that branch and view the `person` table.

1. Here's how to get the connection string for the `staging` database on branch `dev/alex` using the CLI.

    ```bash
    neonctl connection-string dev/alex --database-name staging
    ```

    This gives you the connection string which you can then copy.

    ```bash
    postgres://alex:*********@ep-hidden-rain-a5pe72oi.us-east-2.aws.neon.tech/staging?sslmode=require
    ```

1. Connect to `staging` using psql.

    ```bash
    psql 'postgres://alex:*********@ep-hidden-rain-a5pe72oi.us-east-2.aws.neon.tech/staging?sslmode=require'
    ```

1. View the schema for the `person` table we created earlier.

    ```bash
    \d person
    ```

    Which shows you the schema:

    ```bash
    Table "public.person"
    Column |  Type   | Collation | Nullable |              Default               
    --------+---------+-----------+----------+------------------------------------
    id     | integer |           | not null | nextval('person_id_seq'::regclass)
    name   | text    |           | not null | 
    email  | text    |           | not null | 
    Indexes:
        "person_pkey" PRIMARY KEY, btree (id)
        "person_email_key" UNIQUE CONSTRAINT, btree (email)
    ```

### Step 3: Update schema on a dev branch

Now, let's make some schema changes on the dedicated branch for `dev\jordan`, adding a new table to store relevant addresses.

This time, we'll use the **SQL editor** in the Neon Console. Make sure you select `dev\jordan` as the branch and `staging` as the database.

Enter this SQL statemenet to create a new `address` table.

```sql
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    FOREIGN KEY (person_id) REFERENCES person(id)
);
```

### Step 4: Visualize the schema differences

From the Neon Console, go to the **Restore** page. The Schema Diff tool is meant to assist you with restoring branches and is built into the Time Travel assist editor. Just like with Time Travel assist, your first step is to choose a target and source branch:

1. For the target, using the **Branch to restore** dropdown, select `dev\alex`.
1. For the source, switch to the **From another branch** tab and from the **REstore from** dropdown, select `dev\jordan`.

   ![select branches for schema diff](/docs/guides/schema_diff_make_selection.png)

1. In the Time travel assist editor, click the **Schema Diff** button.

    ![schema diff results](/docs/guides/schema_diff_result.png)

    You will see the schema differnces between the two develpment branches including the new address table that we added to the `dev\jordan` branch.
