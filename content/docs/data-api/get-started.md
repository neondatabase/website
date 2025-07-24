---
title: Getting started with Neon Data API
description: >-
  Learn how to use the Neon Data API, a ready-to-use REST API built on top of
  your Neon database
enableTableOfContents: true
updatedOn: '2025-07-18T16:37:36.059Z'
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

> When using the Data API, it is essential to set up RLS policies so that you can safely expose your databases to clients such as web apps. Make sure that _all_ of your tables have RLS policies, and that you have carefully reviewed each policy.

<Steps>
## Enabling the Data API

Enable the Data API at the **branch** level for a single database.

To get started, navigate to the **Data API** tab in the Neon Console for your branch and click **Enable**.

![Data API tab with enable button](/docs/data-api/data_api_tab.png)

Once enabled, you'll see your Data API **Project URL** here — this is your endpoint for API requests.

![Data API enabled view with Project URL](/docs/data-api/data-api-enabled.png)

Always secure your data before using the Data API in production.

## Authentication

Once enabled, the **Working with the Data API** section shows your current security status.

![configuration section of Data API](/docs/data-api/data_api_config.png)

The security model consists of two parts:

### Neon Auth (automatically configured)

Neon Auth manages user authentication, generating JWT tokens for secure API requests.

**What you need to do**:

- Add Neon Auth keys to your app's environment variables.
- Include JWT tokens in Data API requests.
- **Recommended**: Use the Neon Auth SDK for user sign-in/sign-up.

> You can start using the Data API immediately without authentication, but make sure you set up auth and RLS before going to production.

### Row-Level Security (RLS)

RLS controls row access in tables. **Neon does not auto-enable RLS**; enable it manually per table.

```sql
-- Enable RLS on your table
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create a policy (example: users can only access their own data)
CREATE POLICY "user_can_access_own_data" ON your_table
  FOR ALL USING (auth.user_id() = user_id);
```

We recommend using [Drizzle](/docs/guides/neon-rls-drizzle) to help simplify writing RLS policies.

## Using the Data API

By default, all tables in your database are accessible via the API with `SELECT` permissions granted to **unauthenticated requests**. This lets you directly interact with the API without requiring additional authorization headers.

> **Warning:** This means your data is **publicly accessbile** until you enable Row-Level Security (RLS). Again, enable RLS on _all_ your tables before using the Data API in production.

### Example of creating a table and querying it via the Data API

First, create a table and enable RLS (as shown in [Secure your tables with RLS](#secure-your-tables-with-rls) above):

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  value REAL
);

-- Enable RLS and create policy (see section 3 for details)
ALTER TABLE playing_with_neon ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_can_access_own_data" ON playing_with_neon
FOR ALL USING (auth.user_id() = user_id);

INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random()
  FROM generate_series(1, 10) s(i);

SELECT * FROM playing_with_neon;
```

#### Querying with Curl

- **Without JWT (unauthenticated request):**

  ```bash shouldWrap
  curl --location --request GET 'https://app-restless-salad-23184734.dpl.myneon.app/playing_with_neon'
  --header 'Accept: application/json'
  ```

  **Response:**

  ```json should wrap
  []
  ```

  _No data returned because RLS denies access without authentication._

- **With JWT (authenticated request):**

  ```bash shouldWrap
  curl --location --request GET 'https://app-restless-salad-23184734.dpl.myneon.app/playing_with_neon'
  --header 'Accept: application/json'
  --header 'Authorization: Bearer <jwt>'
  ```

  **Response:**

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

  _You get expected data since the token is included in the request._

As the Data API is built on **PostgREST**, it follows PostgREST query and data manipulation formats. You can use also wrapper libraries like [postgrest-js](https://github.com/supabase/postgrest-js) for a more ORM-like interface.

```javascript shouldWrap
import { PostgrestClient } from '@supabase/postgrest-js';

// https://github.com/supabase/postgrest-js/blob/master/src/PostgrestClient.ts#L41
const client = new PostgrestClient('https://app-restless-salad-23184734.dpl.myneon.app', {
  Authorization: 'Bearer <jwt>',
});

const { data } = await client.from('playing_with_neon').select('*').gte('value', 0.5);

console.table(data);
```

> For a complete example of how to configure the Bearer token with Neon Auth, see the [postgrest.ts](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/lib/postgrest.ts) file from our demo app.

## Try the demo app

To see a complete, working example of an application built with the Data API, Neon Auth, and RLS, check out our demo note-taking app.

- **[Live Demo](https://neon-data-api-neon-auth.vercel.app/)**
- **[GitHub Repository](https://github.com/neondatabase-labs/neon-data-api-neon-auth)**

</Steps>

## What's Next?

- Faster cold starts (we're working on it)
