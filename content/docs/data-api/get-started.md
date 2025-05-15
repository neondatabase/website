---
title: Getting started with Neon Data API
description: Learn how to use the Neon Data API, a ready-to-use REST API built on top of your Neon database
enableTableOfContents: true
---

<PrivatePreview />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Neon Auth</a>
  </DocsList>
  <DocsList title="Demo app" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-data-api-neon-auth">Neon Data API Demo App</a>
  </DocsList>
</InfoBlock>

The Neon Data API is a ready-to-use REST API for your Neon database, powered by [PostgREST](https://docs.postgrest.org/en/v13/), a trusted project in the PostgreSQL community. It lets you work with every table, view, or function in a database's schema using standard HTTP verbs. More importantly, this means you can use a nice SDK like `Postgrest.js` to run queries from the client, like this:

```javascript
const { data } = await client
  .from('playing_with_neon')
  .select('*')
  .gte('value', 0.5);
```

<Steps>
## Enabling the Data API

You enable the Data API at the branch level for a single database. This can be done in the Console or programmatically via the Neon API.

<Tabs labels={["Console", "API"]}>
<TabItem>

Go to the **Data API** tab for your branch and click the button to enable the Data API.

![Data API tab with enable button](/docs/data-api/data-api-tab.png)

Once enabled, you'll see your Data API Project URL here. Use this endpoint in your application.

![Data API enabled view with Project URL](/docs/data-api/data-api-enabled.png)

**Next step:**  
To read and write data securely with the Data API, set up [Neon Auth](/docs/guides/neon-auth) as well as Row-Level Security (RLS) policies. [Drizzle RLS](/docs/guides/neon-rls-drizzle) makes that easier.

</TabItem>

<TabItem>
You can enable the Neon Data API for your project by sending a `POST` request to our `/data-api` endpoint.

Typically, you can call `/data-api` with no parameters at all. If your branch only has one database, we'll select it automatically. If there are multiple databases, you'll need to specify which one you want to use, as shown below:

Example `curl` request:

```bash
curl --location 'https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>/data-api' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <token>' \
  --data '{
       "database_name": "only-when-more-than-one-database"
  }'
```

Sample response:

```json
{
  "url": "https://app-restless-salad-23184734.dpl.myneon.app"
}
```

</TabItem>
</Tabs>

Once enabled, your Data API instance usually takes about **15 seconds** to boot up (the endpoint URL is returned instantly). The instance will automatically scale down to zero when your database is idle, and scale back up on demand — aligning with your serverless database.

## API Authentication

When you call the `/data-api` endpoint described above, we automatically provision [**Neon Auth**](/docs/guides/neon-auth) for that project. We set up the Data API's authentication to match this instance of Neon Auth.

This means you need to send a valid JWT from Neon Auth with every Data API request that is protected by RLS policies.

### Custom JWKS

You can also bring your own **JWKS** from a third-party provider (like Clerk, Keycloak, Auth0, or Better Auth), adding more auth flexibility. Just include `jwks_url` (and optionally `jwks_audience`) in your request:

```bash
curl --location 'https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>/data-api' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <token>' \
  --data '{
       "jwks_url": "https://url.to.your/.well-known/jwks.json"
  }'
```

## Using the Data API

By default, all tables in your database are accessible via the API with `SELECT` permissions granted to **unauthenticated requests**. This lets you directly interact with the API without requiring additional authorization headers.

Example table from our SQL editor:

```sql
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value) 
  SELECT LEFT(md5(i::TEXT), 10), random() 
  FROM generate_series(1, 10) s(i);
SELECT * FROM playing_with_neon;
```

Example `curl` request:

```bash
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

```javascript
import { PostgrestClient } from '@supabase/postgrest-js';

// https://github.com/supabase/postgrest-js/blob/master/src/PostgrestClient.ts#L41
const client = new PostgrestClient(
  'https://app-restless-salad-23184734.dpl.myneon.app',
  { "Authorization": "Bearer <jwt> "}
);

const { data } = await client
  .from('playing_with_neon')
  .select('*')
  .gte('value', 0.5);

console.table(data);
```

</Steps>

## What's Next?

- Faster cold starts (we're working on it)

With these features in place, the Data API will become fully extensible to any service capable of signing a **JWT**. Combined with **Row-Level Security (RLS)** policies, you'll be able to create powerful backends for both authenticated and unauthenticated users.
