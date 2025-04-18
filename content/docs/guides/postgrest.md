---
title: Create a REST API from Postgres with PostgREST
subtitle: Generate a REST API automatically from your Neon Postgres database schema
enableTableOfContents: true
updatedOn: '2025-04-18T22:19:31.000Z'
---

<InfoBlock>
<DocsList title="Related docs" theme="docs">
<a href="https://docs.postgrest.org/en/v12/">PostgREST Documentation</a>
<a href="https://github.com/PostgREST/postgrest">PostgREST GitHub Repository</a>
</DocsList>
</InfoBlock>

This guide shows you how to automatically generate a REST API from your Postgres schema using [PostgREST](https://postgrest.org/), an open-source tool that connects directly to your database. We'll walk through how to pair PostgREST with a Neon Postgres database in a local development environment.

<Steps>

## Set up your Neon project

1. [Create a Neon account](https://neon.tech).
2. Create a new project from the Neon Console.
3. Connect to your database using your preferred Postgres client or the Neon Console SQL Editor.
4. Create a schema, a sample table, and set basic permissions:

Example setup:

```sql shouldWrap
CREATE SCHEMA api;

CREATE TABLE api.students (
  id SERIAL PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL
);

INSERT INTO api.students (firstName, lastName) VALUES
('Ada', 'Lovelace'),
('Alan', 'Turing');

CREATE ROLE anonymous NOLOGIN;
GRANT anonymous TO neondb_owner;
GRANT USAGE ON SCHEMA api TO anonymous;
GRANT SELECT ON ALL TABLES IN SCHEMA api TO anonymous;
```

## Run PostgREST

Use Docker to run PostgREST locally:

```bash shouldWrap
docker run --rm --net=host \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  -p 3434:3000 \
  postgrest/postgrest
```

You can find the non-pooled connection string in the Neon Console.

Once running, visit http://localhost:3000/students to confirm the API is working.

## Add authenticated access

To support full CRUD operations, create a role for authenticated users:

```sql shouldWrap
CREATE ROLE authenticated NOLOGIN;
GRANT authenticated TO neondb_owner;
GRANT USAGE ON SCHEMA api TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA api TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA api TO authenticated;
```

Run PostgREST again, this time with a JWT secret:

```bash shouldWrap
docker run --rm --net=host \
  -e PGRST_DB_URI="<non-pooled-connection-string-from-neon-console>" \
  -e PGRST_DB_SCHEMA="api" \
  -e PGRST_JWT_SECRET="your_jwt_secret" \
  -e PGRST_DB_ANON_ROLE="anonymous" \
  -p 3434:3000 \
  postgrest/postgrest
```

## Authenticate requests using JWT

Use JWTs to access endpoints with the `authenticated` role. Example token payload:

```json
{
  "role": "authenticated"
}
```

Attach the token in the `Authorization` header as a bearer token. Here are a few examples using `curl`:

Insert a student:

```bash shouldWrap
curl http://localhost:3000/students \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"firstname": "Grace", "lastname": "Hopper"}'
```

Update a student:

```bash shouldWrap
curl "http://localhost:3000/students?id=eq.1" \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"firstname": "Ada I.", "lastname": "Lovelace"}'
```

Delete a student:

```bash shouldWrap
curl "http://localhost:3000/students?id=eq.3" \
  -X DELETE \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Use Row-Level Security (RLS)

PostgREST supports Postgres RLS for fine-grained access control. Here's an example policy to restrict access to a user's own records:

```sql shouldWrap
ALTER TABLE api.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY students_policy ON api.students
    FOR ALL
    TO authenticated
    USING (id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer)
    WITH CHECK (id = (current_setting('request.jwt.claims', true)::json->>'sub')::integer);
```

Example JWT payload for RLS:

```json
{
  "role": "authenticated",
  "sub": "1"
}
```

With this token, an API call to `/students` will only return records where `id = 1`.

## Summary

Using Neon and PostgREST, you can instantly expose your Postgres database as a REST API with full CRUD support and row-level access control—without writing any backend code.

This setup is ideal for:

- Prototyping APIs quickly
- Building internal tools
- Reducing boilerplate in production apps

</Steps>

<NeedHelp/>
