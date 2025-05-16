---
title: Getting started with Neon Data API
description: >-
  Learn how to use the Neon Data API, a ready-to-use REST API built on top of
  your Neon database
enableTableOfContents: true
updatedOn: '2025-05-16T18:44:09.379Z'
---

<PrivatePreviewEnquire />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Neon Auth</a>
  </DocsList>
  <DocsList title="Demo app" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-data-api-neon-auth">Neon Data API Demo App</a>
  </DocsList>
</InfoBlock>

The Neon Data API is a ready-to-use REST API for your Neon database, powered by [PostgREST](https://docs.postgrest.org/en/v13/), a trusted project in the PostgreSQL community. It lets you work with every table, view, or function in a database's schema using standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`). Even better, you can use a handy SDK like [`postgrest-js`](https://github.com/supabase/postgrest-js), [`postgrest-py`](https://github.com/supabase-community/postgrest-py), or [`postgrest-go`](https://github.com/supabase-community/postgrest-go) to run queries from your client:

```javascript shouldWrap
const { data } = await client.from('playing_with_neon').select('*').gte('value', 0.5);
```

> When using the Data API, it is essential to set up RLS policies so that you can safely expose your databases to clients such as web apps. Make sure that _all_ of your tables have RLS policies, and that you have carefully reviewed each policy.

<Steps>
## Enabling the Data API

You enable the Data API at the branch level for a single database.

Go to the **Data API** tab for your branch and click the button to enable the Data API.

![Data API tab with enable button](/docs/data-api/data-api-tab.png)

Once enabled, you'll see your Data API Project URL here. Use this endpoint in your application.

![Data API enabled view with Project URL](/docs/data-api/data-api-enabled.png)

**Next step:**  
To secure your Data API, create Row-Level Security (RLS) policies for your tables. Using [Drizzle RLS](/docs/guides/neon-rls-drizzle) makes this much easier.

## API Authentication

When you call the `/data-api` endpoint described above, we automatically provision [**Neon Auth**](/docs/guides/neon-auth) for that project. We set up the Data API's authentication to match this instance of Neon Auth.

When you enable the Data API — either by calling the `/data-api` endpoint or from the Console — we automatically provision [**Neon Auth**](/docs/guides/neon-auth) for your project if it isn't already set up. If your project already has Neon Auth enabled, the Data API will re-use your existing configuration.

This means you need to send a valid JWT from Neon Auth with every Data API request that is protected by RLS policies.

### Third-party auth

You can also bring your own **JWKS** from a third-party provider (like Clerk, Keycloak, Auth0, or Better Auth), adding more auth flexibility. Just include `jwks_url` (and optionally `jwks_audience`) in your request:

```bash shouldWrap
curl --location 'https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>/data-api' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <token>' \
  --data '{
       "jwks_url": "https://url.to.your/.well-known/jwks.json"
  }'
```

## Using the Data API

By default, all tables in your database are accessible via the API with `SELECT` permissions granted to **unauthenticated requests**. This lets you directly interact with the API without requiring additional authorization headers.

<Admonition type="warning">
We strongly recommend enabling Row Level Security (RLS) on _all_ tables as soon as you enable the Data API. You can do this with:

```sql
-- for every table, on every schema
ALTER TABLE <schema_name>.<table_name> ENABLE ROW LEVEL SECURITY;
```

Review and test your RLS policies to ensure your data is protected.
</Admonition>

Here’s an example of how you might set up and query a table:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  value REAL
);

-- Enable Row Level Security
ALTER TABLE playing_with_neon ENABLE ROW LEVEL SECURITY;

-- (Optional) Example permissive policy for demo/testing:
CREATE POLICY "Allow read access" ON playing_with_neon
  FOR SELECT
  USING (true);

INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random()
  FROM generate_series(1, 10) s(i);

SELECT * FROM playing_with_neon;
```

Example `curl` request:

```bash shouldWrap
curl --location --request GET 'https://app-restless-salad-23184734.dpl.myneon.app/playing_with_neon' \
     --header 'Accept: application/json' \
     --header 'Bearer: <jwt>'
```

Sample response:

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "c4ca4238a0",
    "value": 0.36675808
  },
  ... (shortened)
  {
    "id": 10,
    "name": "6512bd43d9",
    "value": 0.72407603
  }
]

```

As the Data API is built on **PostgREST**, it follows PostgREST query and data manipulation formats. You can also use popular wrapper libraries such as **postgrest-js** [https://github.com/supabase/postgrest-js](https://github.com/supabase/postgrest-js) for more advanced integration.

```javascript shouldWrap
import { PostgrestClient } from '@supabase/postgrest-js';

// https://github.com/supabase/postgrest-js/blob/master/src/PostgrestClient.ts#L41
const client = new PostgrestClient('https://app-restless-salad-23184734.dpl.myneon.app', {
  Authorization: 'Bearer <jwt>',
});

const { data } = await client.from('playing_with_neon').select('*').gte('value', 0.5);

console.table(data);
```

## Try our demo app!

See how the Neon Data API works in a demo project:

- [Demo app repo](https://github.com/neondatabase-labs/neon-data-api-neon-auth)
- [Live demo](https://neon-data-api-neon-auth.vercel.app/handler/sign-in?after_auth_return_to=%2F)

This project shows how to build a modern web app using direct-to-database queries (no backend required) with the Neon Data API and Neon Auth for authentication.

</Steps>

## What's Next?

- Faster cold starts (we're working on it)

With these features in place, the Data API will become fully extensible to any service capable of signing a **JWT**. Combined with **Row-Level Security (RLS)** policies, you'll be able to create powerful backends for both authenticated and unauthenticated users.
