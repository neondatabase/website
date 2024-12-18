---
title: Schema diff tutorial
subtitle: Step-by-step guide showing you how to compare two development branches using
  Schema Diff
enableTableOfContents: true
updatedOn: '2024-12-12T15:31:10.129Z'
---

In this guide we will create an initial schema on a new database called `people` on our `main` branch. We'll then create a development branch called `dev/jordan`, following our recommended convention for naming development branches. After making schema changes on `dev/jordan`, we'll use the **Schema Diff** tool on the **Branches** page to get a side-by-side, GitHub-style visual comparison between the `dev/jordan` development branch and `main`.

## Before you start

To complete this tutorial, you'll need:

- A Neon account. Sign up [here](/docs/get-started-with-neon/signing-up).
- To interact with your Neon database from the command line:

  - Install the [Neon CLI](/docs/reference/cli-install)
  - Download and install the [psql](https://www.postgresql.org/download/) client

## Step 1: Create the Initial Schema

First, create a new database called `people` on the `main` branch and add some sample data to it.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Create the database.

   In the **Neon Console**, go to **Databases** &#8594; **New Database**. Make sure your `main` branch is selected, then create the new database called `people`.

1. Add the schema.

   Go to the **SQL Editor**, enter the following SQL statement and click **Run** to apply.

   ```sql
   CREATE TABLE person (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
   );
   ```

</TabItem>

<TabItem>

1. Create the database.

   Use the following CLI command to create the `people` database.

   ```bash
   neon databases create --name people
   ```

   <Admonition type="note">
   If you have multiple projects, include `--project-id`. Or set the project context so you don't have to specify project id in every command. Example:

   ```bash
   neon set-context --project-id empty-glade-66712572
   ```

   You can find your project ID on the **Settings** page in the Neon Console.

   </Admonition>

1. Copy your connection string:

   ```bash
   neon connection-string --database-name people
   ```

1. Connect to the `people` database with psql:

   ```bash
   psql 'postgresql://neondb_owner:*********@ep-crimson-frost-a5i6p18z.us-east-2.aws.neon.tech/people?sslmode=require'
   ```

1. Create the schema:

   ```sql
   CREATE TABLE person (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
   );
   ```

</TabItem>

<TabItem>

1. Create the database.

   Use the [Create database](https://api-docs.neon.tech/reference/createprojectbranchdatabase) API to create the `people` database.

   ```bash
   curl --request POST \
   --url https://console.neon.tech/api/v2/projects/royal-band-06902338/branches/br-bitter-bird-a56n6lh4/databases \
   --header 'accept: application/json' \
   --header 'authorization: Bearer $NEON_API_KEY' \
   --header 'content-type: application/json' \
   --data '{
      "database": {
         "name": "people",
         "owner_name": "alex"
      }
   }'
   ```

2. Retrieve your database connection string using [Get connection URI](https://api-docs.neon.tech/reference/getconnectionuri) endpoint:

   ```bash
   curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/royal-band-06902338/connection_uri?branch_id=br-bitter-bird-a56n6lh4&database_name=people&role_name=alex' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
   ```

   The API call will return an connection string similar to this one:

   ```json
   {
     "uri": "postgresql://alex:*********@ep-green-surf-a5yaumj3-pooler.us-east-2.aws.neon.tech/people?sslmode=require"
   }
   ```

3. Connect to the `people` database with `psql`:

   ```bash
   psql 'postgresql://alex:*********@ep-green-surf-a5yaumj3-pooler.us-east-2.aws.neon.tech/people?sslmode=require'
   ```

4. Create the schema:

   ```sql
   CREATE TABLE person (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
   );
   ```

</TabItem>

</Tabs>

## Step 2: Create a development branch

Create a new development branch off of `main`. This branch will be an exact, isolated copy of `main`.

For the purposes of this tutorial, name the branch `dev/jordan`, following our recommended convention of creating a long-lived development branch for each member of your team.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Create the development branch

   On the **Branches** page, click **Create Branch**, making sure of the following:

   - Select `main` as the default branch.
   - Name the branch `dev/jordan`.

1. Verify the schema on your new branch

   From the **SQL Editor**, use the meta-command `\d person` to inspect the schema of the `person` table. Make sure that the `people` database on the branch `dev/jordan` is selected.

   ![use metacommand to inspect schema](/docs/guides/schema_diff_d_metacommand.png)

</TabItem>

<TabItem>

1. Create the branch

   If you're still in `psql`, exit using `\q`.

   Using the Neon CLI, create the development branch. Include `--project-id` if you have multiple projects.

   ```bash
   neon branches create --name dev/jordan --parent main
   ```

1. Verify the schema

   To verify that this branch includes the initial schema created on `main`, connect to `dev/jordan`, then view the `person` table.

   1. Get the connection string for the `people` database on branch `dev/jordan` using the CLI.

      ```bash
      neon connection-string dev/jordan --database-name people
      ```

      This gives you the connection string which you can then copy.

      ```bash
      postgresql://neondb_owner:*********@ep-hidden-rain-a5pe72oi.us-east-2.aws.neon.tech/people?sslmode=require
      ```

   1. Connect to `people` using psql.

      ```bash
      psql 'postgresql://neondb_owner:*********@ep-hidden-rain-a5pe72oi.us-east-2.aws.neon.tech/people?sslmode=require'
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

      You can do the same thing for your `main` branch and get identical results.

</TabItem>

<TabItem>

Using the [Create branch](https://api-docs.neon.tech/reference/createprojectbranch) API, create a development branch named `dev/jordan`.

```bash
curl --request POST \
--url https://console.neon.tech/api/v2/projects/royal-band-06902338/branches \
--header 'accept: application/json' \
--header 'authorization: Bearer $NEON_API_KEY' \
--header 'content-type: application/json' \
--data '{
   "branch": {
      "name": "dev/jordan",
      "parent_id": "br-bitter-bird-a56n6lh4"
   },
   "endpoints": [
      {
      "type": "read_write"
      }
   ]
}'
```

</TabItem>

</Tabs>

## Step 3: Update schema on a dev branch

Let's introduce some differences between the two branches. Add a new table to store addresses on the `dev/jordan` branch.

<Tabs labels={["Console","CLI", "API"]}>

<TabItem>
In the **SQL Editor**, make sure you select `dev/jordan` as the branch and `people` as the database.

Enter this SQL statement to create a new `address` table.

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

</TabItem>

<TabItem>

1. Connect to your `dev/jordan` branch

   By adding `--psql` to the CLI command, you can start the `psql` connection without having to enter the connection string directly:

   ```bash
   neon connection-string dev/jordan --database-name people --psql
   ```

   Response:

   ```bash
   INFO: Connecting to the database using psql...
   psql (16.1, server 16.2)
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
   Type "help" for help.

   people=>
   ```

1. Add a new address table

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

</TabItem>

<TabItem>

1. Retrieve your database connection string using [Get connection URI](https://api-docs.neon.tech/reference/getconnectionuri) endpoint:

   ```bash
   curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/royal-band-06902338/connection_uri?branch_id=br-mute-dew-a5930esi&database_name=people&role_name=alex' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
   ```

   The API call will return an connection string similar to this one:

   ```json
   {
     "uri": "postgresql://alex:JZb5eKPpg0vD@ep-hidden-sun-a5de9i5h-pooler.us-east-2.aws.neon.tech/people?sslmode=require"
   }
   ```

1. Connect to the people database with `psql`:

   ```bash
   psql 'postgresql://alex:JZb5eKPpg0vD@ep-hidden-sun-a5de9i5h-pooler.us-east-2.aws.neon.tech/people?sslmode=require'
   ```

1. Add a new address table

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

</TabItem>

</Tabs>

## Step 4: View the schema differences

Now that you have some differences between your branches, you can view the schema differences.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Click on `dev/jordan` to open the detailed view, then under **Compare to Parent** click **Open schema diff**.

   ![select branches for schema diff](/docs/guides/schema_diff_make_selection.png)

1. Make sure you select `people` as the database and then click **Compare**.

   ![schema diff results](/docs/guides/schema_diff_result.png)

You will see the schema differences between `dev/jordan` and its parent `main`, including the new address table that we added to the `dev/jordan` branch.

You can also launch Schema Diff from the **Restore** page, usually as part of verifying schemas before you restore a branch to its own or another branch's history. See [Branch restore](/docs/guides/branch-restore) for more info.

</TabItem>

<TabItem>

Compare the schema of `dev/jordan` to its parent branch using the `schema-diff` command.

```bash
neon branches schema-diff main dev/jordan --database people
```

The result shows a comparison between the `dev/jordan` branch and its parent branch for the database `people`. The output indicates that the `address` table and its related sequences and constraints have been added in the `dev/jordan` branch but are not present in its parent branch `main`.

```diff
--- Database: people	(Branch: br-falling-dust-a5bakdqt) // [!code --]
+++ Database: people	(Branch: br-morning-heart-a5ltt10i) // [!code ++]
@@ -20,8 +20,46 @@

 SET default_table_access_method = heap;

 --
+-- Name: address; Type: TABLE; Schema: public; Owner: neondb_owner // [!code ++]
+-- // [!code ++]
+ // [!code ++]
+CREATE TABLE public.address ( // [!code ++]
+    id integer NOT NULL, // [!code ++]
+    person_id integer NOT NULL, // [!code ++]
+    street text NOT NULL, // [!code ++]
+    city text NOT NULL, // [!code ++]
+    state text NOT NULL, // [!code ++]
+    zip_code text NOT NULL // [!code ++]
+); // [!code ++]
+ // [!code ++]
+ // [!code ++]
+ALTER TABLE public.address OWNER TO neondb_owner; // [!code ++]
+ // [!code ++]
+... // [!code ++]
```

</TabItem>

<TabItem>

Compare the schema of `dev/jordan` to its parent branch using the `compare-schema` API.

```bash
curl -X GET \
  "https://console.neon.tech/api/v2/projects/royal-band-06902338/branches/br-mute-dew-a5930esi/compare_schema" \
  -G \
  --data-urlencode "base_branch_id=br-bitter-bird-a56n6lh4" \
  --data-urlencode "db_name=people" \
  -H "accept: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" | jq -r '.diff'
```

| Parameter          | Description                                                                               | Required | Example                   |
| ------------------ | ----------------------------------------------------------------------------------------- | -------- | ------------------------- |
| `<project_id>`     | The ID of your Neon project.                                                              | Yes      | `royal-band-06902338`     |
| `<branch_id>`      | The ID of the target branch to compare.                                                   | Yes      | `br-mute-dew-a5930esi`    |
| `<base_branch_id>` | The ID of the base branch for comparison — the parent branch in this case.                | Yes      | `br-bitter-bird-a56n6lh4` |
| `<db_name>`        | The name of the database in the target branch.                                            | Yes      | `people`                  |
| `Authorization`    | Bearer token for API access (your [Neon API key](https://neon.tech/docs/manage/api-keys)) | Yes      | `$NEON_API_KEY`           |

<Admonition type="note">
The optional `jq -r '.diff'` command extracts the diff field from the JSON response and outputs it as plain text to make it easier to read. This command would not be necessary when using the endpoint programmatically.
</Admonition>

The result shows a comparison between the `dev/jordan` branch and its parent branch for the database `people`. The output indicates that the `address` table and its related sequences and constraints have been added in the `dev/jordan` branch but are not present in its parent branch.

```diff
--- a/people
+++ b/people
@@ -21,6 +21,44 @@
 SET default_table_access_method = heap;

 --
+-- Name: address; Type: TABLE; Schema: public; Owner: alex
+--
+
+CREATE TABLE public.address (
+    id integer NOT NULL,
+    person_id integer NOT NULL,
+    street text NOT NULL,
+    city text NOT NULL,
+    state text NOT NULL,
+    zip_code text NOT NULL
+);
+
+
+ALTER TABLE public.address OWNER TO alex;
+
+--
+-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: alex
+--
+
+CREATE SEQUENCE public.address_id_seq
+    AS integer
+    START WITH 1
+    INCREMENT BY 1
+    NO MINVALUE
+    NO MAXVALUE
+    CACHE 1;
+
+
+ALTER SEQUENCE public.address_id_seq OWNER TO alex;
+
+--
+-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alex
+--
+
+ALTER SEQUENCE public.address_id_seq OWNED BY public.address.id;
+
+
+--
 -- Name: person; Type: TABLE; Schema: public; Owner: alex
 --

@@ -56,6 +94,13 @@


 --
+-- Name: address id; Type: DEFAULT; Schema: public; Owner: alex
+--
+
+ALTER TABLE ONLY public.address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);
+
+
+--
 -- Name: person id; Type: DEFAULT; Schema: public; Owner: alex
 --

@@ -63,6 +108,14 @@


 --
+-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: alex
+--
+
+ALTER TABLE ONLY public.address
+    ADD CONSTRAINT address_pkey PRIMARY KEY (id);
+
+
+--
 -- Name: person person_email_key; Type: CONSTRAINT; Schema: public; Owner: alex
 --

@@ -79,6 +132,14 @@


 --
+-- Name: address address_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alex
+--
+
+ALTER TABLE ONLY public.address
+    ADD CONSTRAINT address_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id);
+
+
+--
 -- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
 --
```

</TabItem>

</Tabs>
