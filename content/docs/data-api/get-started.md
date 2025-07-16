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

The Neon Data API is a ready-to-use REST API for your Neon database, powered by [PostgREST](https://docs.postgrest.org/en/v13/), a trusted project in the PostgreSQL community. It lets you work with every table, view, or function in a database's schema using standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`). Even better, you can use a handy SDK like [`postgrest-js`](https://github.com/supabase/postgrest-js), [`postgrest-py`](https://github.com/supabase-community/postgrest-py), or [`postgrest-go`](https://github.com/supabase-community/postgrest-go) to run queries from your client:

```javascript shouldWrap
const { data } = await client.from('playing_with_neon').select('*').gte('value', 0.5);
```

<Steps>
## Enabling the Data API

You enable the Data API at the branch level for a single database.

To get started, navigate to the **Data API** tab in the Neon Console for your branch and click **Enable**.

![Data API tab with enable button](/docs/data-api/data-api-tab.png)

Once enabled, you'll see your Data API Project URL here.

![Data API enabled view with Project URL](/docs/data-api/data-api-enabled.png)

You can use this URL for your API requests  — but make sure you secure your data before using in production.

## API authentication

When you enable the Data API, you'll see a configuration screen that shows the security status of your setup.

![configuration section of Data API](/docs/data-api/data_api_config.png)

The security model has two parts:

### Neon Auth (automatically configured)
Neon Auth provides user authentication for your application. It generates JWT tokens that your app uses to authenticate users and make secure API requests. 

**What you need to do:**
- Get your JWKS URL from the **Auth** > **Configuration** tab
- Add that JWKS URL to your project's RLS settings so your policies can validate user tokens

### Row-Level Security (RLS)

RLS is a Postgres feature that controls which rows users can access in your tables. **Neon does not automatically enable RLS on existing tables** - you have to do this manually.

See [secure your tables with RLS](#secure-your-tables-with-rls) below.

<Admonition type="warning">
**Critical Security:** If you see warnings about tables being "publicly accessible," this means RLS is not enabled on those tables. You must enable RLS and create appropriate policies before using the Data API in production.
</Admonition>

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

Before using the Data API in production, you must enable Neon RLS and create policies for your tables:

```sql
-- Enable RLS on your table
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create a policy (example: users can only access their own data)
CREATE POLICY "user_can_access_own_data" ON your_table
  FOR ALL USING (auth.user_id() = user_id);
```

> **Important:** If you don't enable RLS, your tables will be publicly accessible via the Data API.

For detailed RLS setup, see our [RLS tutorial](/docs/guides/neon-rls-tutorial). We recommend using [Drizzle](/docs/guides/neon-rls-drizzle) to help simplify your RLS policies.

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

