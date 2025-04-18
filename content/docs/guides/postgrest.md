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

## What is PostgREST?

PostgREST is a standalone web server that automatically turns your PostgreSQL database schema into a RESTful API. It uses the database's structure, constraints, and permissions to create API endpoints without requiring you to write any backend code. The API follows REST conventions and supports full CRUD operations, filtering, pagination, and even complex joins.

This guide shows you how to set up PostgREST with a Neon Postgres database using Docker for local development. You'll learn how to configure basic read access, add authenticated endpoints with JWT tokens, and implement row-level security for fine-grained access control.

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

## Next Steps

Now that you have a basic PostgREST API running with Neon, here are some ways to expand your implementation:

### Enhance Your API

- **Explore advanced querying**: Implement [filtering](https://docs.postgrest.org/en/v12/api.html#horizontal-filtering-rows), [ordering](https://docs.postgrest.org/en/v12/api.html#ordering), and [pagination](https://docs.postgrest.org/en/v12/api.html#limits-and-pagination) in your API requests
- **Add resource embedding**: Use [resource embedding](https://docs.postgrest.org/en/v12/api.html#resource-embedding) to fetch related data in a single request
- **Implement stored procedures**: Expose [PostgreSQL functions](https://docs.postgrest.org/en/v12/api.html#stored-procedures) as API endpoints for complex operations

### Integrate with Frontend Frameworks

- Connect your API to frontend frameworks using client libraries:
  - [postgrest-js](https://github.com/supabase/postgrest-js) for TypeScript/JavaScript applications
  - [postgrest-py](https://github.com/supabase/postgrest-py) for Python applications
  - [vue-postgrest](https://github.com/technowledgy/vue-postgrest) for Vue.js applications
  - [Other client libraries](https://docs.postgrest.org/en/v12/ecosystem.html#client-side-libraries) for various languages

### Move to Production

- **Deploy to cloud platforms**: Set up PostgREST on [Kubernetes](https://github.com/cloudstark/helm-charts), [Cloud Run](https://github.com/cyril-sabourault/postgrest-cloud-run), or other cloud services
- **Add a reverse proxy**: Configure Nginx as a reverse proxy for caching, SSL termination, and load balancing
- **Implement monitoring**: Set up [observability](https://docs.postgrest.org/en/v12/references/observability.html) for your PostgREST service
- **Secure your deployment**: Review the [security checklist](https://docs.postgrest.org/en/v12/explanations/security.html) before going to production

### Explore Example Applications

- Browse [example applications](https://docs.postgrest.org/en/v12/ecosystem.html#example-apps) built with PostgREST to get inspiration for your own projects
- Try out [templates](https://docs.postgrest.org/en/v12/ecosystem.html#templates) that combine PostgREST with various frontend technologies

</Steps>

<NeedHelp/>
