---
title: Create a REST API from Postgres with PostgREST
subtitle: Generate a REST API automatically from your Neon Postgres database schema
enableTableOfContents: true
updatedOn: '2025-04-18T22:19:31.000Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What is PostgREST and how it works</p>
<p>Setting up a Neon project for PostgREST</p>
<p>Running PostgREST with Docker</p>
<p>Adding authentication with JWT</p>
<p>Implementing Row-Level Security</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
<a href="https://docs.postgrest.org/en/v12/">PostgREST Documentation</a>
<a href="https://postgrest.org/en/v12/tutorials/tut0.html">PostgREST Tutorials</a>
</DocsList>

<DocsList title="Source code" theme="repo">
<a href="https://github.com/PostgREST/postgrest">PostgREST GitHub Repository</a>
</DocsList>
</InfoBlock>

## What is PostgREST?

PostgREST is a standalone web server that automatically turns your PostgreSQL database schema into a RESTful API. It uses the database's structure, constraints, and permissions to create API endpoints without requiring you to write any backend code. The API follows REST conventions and supports full CRUD operations, filtering, pagination, and even complex joins.

This guide shows you how to set up PostgREST with a Neon Postgres database using Docker for local development. You'll learn how to configure basic read access, add authenticated endpoints with JWT tokens, and implement row-level security for fine-grained access control.

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Set up your database

From the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client such as [psql](/docs/connect/query-with-psql-editor), set up your database using the following queries:

```sql shouldWrap
CREATE SCHEMA api;

CREATE TABLE api.students (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

INSERT INTO api.students (first_name, last_name) VALUES
('Ada', 'Lovelace'),
('Alan', 'Turing');

CREATE ROLE anonymous NOLOGIN;
GRANT anonymous TO neondb_owner;
GRANT USAGE ON SCHEMA api TO anonymous;
GRANT SELECT ON ALL TABLES IN SCHEMA api TO anonymous;
ALTER DEFAULT PRIVILEGES IN SCHEMA api GRANT SELECT ON TABLES TO anonymous;
```

## Copy your database connection string

Retrieve an unpooled database connection string — PostgREST requires a direct connection to your database.

1. Navigate to your **Project Dashboard** in the Neon Console.
2. Click the **Connect** button to open the **Connect to your database modal**.
3. Toggle **Connection pooling** to disable it — you need an unpooled connection string.
4. Copy the connection string.

![Connect to your database modal](/docs/guides/postgrest_connection_string.png)

## Run PostgREST

Use Docker to run PostgREST locally, specifying the **unpooled** database connection string.

<Tabs labels={["Linux", "macOS", "Windows"]}>

<TabItem>
```bash
docker run --rm --net=host \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  postgrest/postgrest
```

</TabItem>

<TabItem>
```bash
docker run --rm \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  -p 3000:3000 \
  postgrest/postgrest
```

</TabItem>

<TabItem>
```bash
docker run --rm \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  -p 3000:3000 \
  postgrest/postgrest
```

</TabItem>

</Tabs>

Once running, visit http://localhost:3000/students to confirm the API is working. You should see the following records in your browser:

![local host students](/docs/guides/postgrest_local_host_students.png)

## Add authenticated access

To support full CRUD operations (inserts, updates, and deletes), you need to set up permissions in your database by creating a role for authenticated users. Here, we create an `authenticated` role, assign privileges, and grant the role to our database owner (`neondb_owner`). Run these commands from the Neon SQL Editor or an SQL client.

```sql
CREATE ROLE authenticated NOLOGIN;
GRANT authenticated TO neondb_owner;
GRANT USAGE ON SCHEMA api TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA api TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA api TO authenticated;
```

## Run PostgREST with a JWT secret

Run PostgREST again, this time with a JWT secret that will be used by PostgREST to verify the JWT that we will attach to our requests in a later step.

<Tabs labels={["Linux", "macOS", "Windows"]}>

<TabItem>
```bash
docker run --rm --net=host \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_JWT_SECRET="reallyreallyreallyreallyverysafe" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  postgrest/postgrest
```
</TabItem>

<TabItem>
```bash
docker run --rm \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_JWT_SECRET="reallyreallyreallyreallyverysafe" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  -p 3000:3000 \
  postgrest/postgrest
```
</TabItem>

<TabItem>
```bash
docker run --rm \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_JWT_SECRET="reallyreallyreallyreallyverysafe" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  -p 3000:3000 \
  postgrest/postgrest
```
</TabItem>

</Tabs>

## Authenticate requests using JWT

Now that we have defined our JWT secret above (`reallyreallyreallyreallyverysafe`), we'll create a sample JWT that's signed with this secret. If you didn't change the secret used above, you can use this JWT:

```text shouldWrap
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.XOGSeHS8usEzEELkUl8SWOrsOLP7xWmHckRSTgpyP3o
 ``` 
 
<Admonition type="tip">
You can use [jwt.io](https://jwt.io/) to generate your own JWT. Make sure to use the **HS256** algorithm.
</Admonition> 

Now let's test different CRUD operations using standard HTTP methods. Notice that we've attached the JWT in the `Authorization` header as a bearer token.

**Insert a student:**

```bash
curl http://localhost:3000/students \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.XOGSeHS8usEzEELkUl8SWOrsOLP7xWmHckRSTgpyP3o" \
  -d '{"first_name": "Grace", "last_name": "Hopper"}'
```

You should see the following records after refreshing your browser:

![local host students](/docs/guides/postgrest_local_host_students_insert.png)

**Update a student:**

```bash
curl "http://localhost:3000/students?id=eq.1" \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.XOGSeHS8usEzEELkUl8SWOrsOLP7xWmHckRSTgpyP3o" \
  -d '{"first_name": "Ada I.", "last_name": "Lovelace"}'
```

Refresh your browser to see the updated records:

![local host students](/docs/guides/postgrest_local_host_students_insert.png)

**Delete a student:**

```bash shouldWrap
curl "http://localhost:3000/students?id=eq.3" \
  -X DELETE \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.XOGSeHS8usEzEELkUl8SWOrsOLP7xWmHckRSTgpyP3o"
```

You should now see these records:

![local host students](/docs/guides/postgrest_local_host_students_delete.png)

## Use Row-Level Security (RLS)

PostgREST supports Postgres RLS for fine-grained access control. Here's an example policy to restrict access to a user's own records:. Run these statements on your database in the Neon SQL Editor or an SQL client.

```sql
ALTER TABLE api.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY students_policy ON api.students
    FOR ALL
    TO authenticated
    USING (id = (SELECT current_setting('request.jwt.claims', true)::json->>'sub')::integer)
    WITH CHECK (id = (SELECT current_setting('request.jwt.claims', true)::json->>'sub')::integer);
```

The JWT token used in the CRUD examples above contain a payload with `{"role": "authenticated"}`, which tells PostgREST to use the `authenticated` role for those requests.

In a real application, you would want to:

- Generate tokens with proper expiration times
- Include user-specific claims in the JWT (most likely, a "sub" field which corresponds to users' IDs)
- Implement a proper authentication server/service (or use a third-party managed auth provider)

## Using Row-Level Security (RLS)

You can also use Row-Level Security (RLS) policies in Postgres for more granular access control. Here's an example RLS policy that only allows users to see and edit their own records based on their student/user ID. Run this from the Neon SQL Editor or client.

```sql
-- Enable RLS on the students table
ALTER TABLE api.students ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows users to view/edit their own records
-- This uses the 'sub' claim from the JWT as the user identifier
CREATE POLICY students_policy ON api.students
    FOR ALL
    TO authenticated
    USING (id = (SELECT current_setting('request.jwt.claims', true)::json->>'sub')::integer)
    WITH CHECK (id = (SELECT current_setting('request.jwt.claims', true)::json->>'sub')::integer);
```

Now, let's generate a new JWT that has the following payload defining the student ID (and sign it with the same JWT secret from above):

```
{
  role: "authenticated",
  sub: "1",
}
```

Here's the new secret:

```text shouldWarp
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjEifQ.U_EgeU0y0pAM5cTsMXndJe_cR1vG5Vf9dq4DkqfMAxs
```

Now, run this command with the new secret:

```bash
$ curl "http://localhost:3000/students" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6IjEifQ.U_EgeU0y0pAM5cTsMXndJe_cR1vG5Vf9dq4DkqfMAxs"
[{"id":1,"firstname":"Ada I.","lastname":"Lovelace"}]
```

Because the `students` table has a RLS policy attached to the student's ID, the student can only view their own records.

</Steps>

## Summary

The examples shown above are simple, but they illustrate how PostgREST works. With Neon and PostgREST, you can instantly turn your Postgres database into a REST API—no backend code required. This setup is ideal for rapid prototyping, internal tools, or even production workloads where you want to focus on your data and business logic rather than boilerplate API code.

## Next steps

Now that you have a basic PostgREST API running with Neon, here are some things you can try next:

- **Explore advanced querying**: Implement [filtering](https://docs.postgrest.org/en/v12/api.html#horizontal-filtering-rows), [ordering](https://docs.postgrest.org/en/v12/api.html#ordering), and [pagination](https://docs.postgrest.org/en/v12/api.html#limits-and-pagination) in your API requests
- **Add resource embedding**: Use [resource embedding](https://docs.postgrest.org/en/v12/api.html#resource-embedding) to fetch related data in a single request
- **Implement stored procedures**: Expose [PostgreSQL functions](https://docs.postgrest.org/en/v12/api.html#stored-procedures) as API endpoints for complex operations
- **Example applications**: Explore [example applications](https://docs.postgrest.org/en/v12/ecosystem.html#example-apps)  built with PostgREST to get inspiration for your own projects
- **Try out templates**: These [templates](https://docs.postgrest.org/en/v12/ecosystem.html#templates) combine PostgREST with various frontend technologies

<NeedHelp/>
