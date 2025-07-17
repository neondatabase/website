---
title: Getting started with Neon Data API
description: >-
  Learn how to use the Neon Data API, a ready-to-use REST API built on top of
  your Neon database
enableTableOfContents: true
updatedOn: '2025-06-20T15:34:40.024Z'
tag: beta
---

<FeatureBetaProps feature_name="Neon Data API" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Neon Auth</a>
    <a href="/docs/data-api/demo">Building a note-taking app</a>
  </DocsList>
  <DocsList title="Demo app" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-data-api-neon-auth">Neon Data API demo note-taking app</a>
  </DocsList>
</InfoBlock>

The Neon Data API, powered by [PostgREST](https://docs.postgrest.org/en/v13/), offers a ready-to-use REST API for your Neon database. You can interact with any table, view, or function using standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`). To simplify querying, use client libraries like [`postgrest-js`](https://github.com/supabase/postgrest-js), [`postgrest-py`](https://github.com/supabase-community/postgrest-py), or [`postgrest-go`](https://github.com/supabase-community/postgrest-go):

```javascript shouldWrap
const { data } = await client.from('playing_with_neon').select('*').gte('value', 0.5);
```

<Steps>
## Enabling the Data API

Enable the Data API at the **branch** level for a single database.

To get started, navigate to the **Data API** tab in the Neon Console for your branch and click **Enable**.

![Data API tab with enable button](/docs/data-api/data-api-tab.png)

Once enabled, you'll see your Data API **Project URL** here — this is your endpoint for API requests.

![Data API enabled view with Project URL](/docs/data-api/data-api-enabled.png)

Always secure your data before using the Data API in production.

## Authentication

Once enabled, the **Working with the Data API** section shows your current security status.

![configuration section of Data API](/docs/data-api/data_api_config.png)

The security model consists of two parts:

### Neon Auth (automatically configured)

Neon Auth manages user authentication, generating JWT tokens for secure API requests.

- Add Neon Auth keys to your app's environment variables.
- Include JWT tokens in Data API requests.
- **Recommended**: Use the Neon Auth SDK for user sign-in/sign-up.

> You can start using the Data API immediately without authentication, but make sure you set up auth and RLS before going to production.

### Row-Level Security (RLS)

RLS controls row access in tables. **Neon does not auto-enable RLS**; enable it manually per table.

See [secure your tables with RLS](#secure-your-tables-with-rls) below.

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

## Secure your tables with RLS

Before using the Data API in production, you must enable Row-Level Security (RLS) on your tables and create policies.

```sql
-- Enable RLS on your table
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create a policy (example: users can only access their own data)
CREATE POLICY "user_can_access_own_data" ON your_table
  FOR ALL USING (auth.user_id() = user_id);
```

> **Important:** If you don't enable RLS, your tables will be publicly accessible via the Data API.

For a detailed guide, see our [PostgREST tutorial](/docs/guides/postgrest#use-row-level-security-rls). We also recommend using [Drizzle](/docs/guides/neon-rls-drizzle) to help simplify writing RLS policies.

## Using the Data API

By default, all tables in your database are accessible via the API with SELECT permissions granted to unauthenticated requests. However, **we strongly recommend enabling RLS** for production use.

Here's how to make authenticated requests:

### Using postgrest-js
```javascript
import { PostgrestClient } from '@supabase/postgrest-js';

const client = new PostgrestClient('YOUR_DATA_API_URL');

// Include JWT token for authenticated requests
client.auth(userToken);

const { data } = await client.from('playing_with_neon').select('*').gte('value', 0.5);
```

### Using curl
```bash
curl --location --request GET 'YOUR_DATA_API_URL/playing_with_neon' \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <jwt>'
```

**Note:** The Data API is built on PostgREST, so you can use any PostgREST client library.

## Try the demo app

To see a complete, working example of an application built with the Data API, Neon Auth, and RLS, check out our demo note-taking app.

- **[Live Demo](https://neon-data-api-neon-auth.vercel.app/)**
- **[GitHub Repository](https://github.com/neondatabase-labs/neon-data-api-neon-auth)**

</Steps>

## What's Next?

- Faster cold starts (we're working on it)

