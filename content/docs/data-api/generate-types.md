---
title: Generate TypeScript types from your database schema
subtitle: Automatically generate TypeScript types from your database schema for
  type-safe Data API interactions.
summary: >-
  How to generate TypeScript types from your database schema using the Neon SDK
  CLI tool, enhancing type safety and developer experience for Data API
  interactions.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.808Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Data API</a>
    <a href="/docs/data-api/demo">Building a note-taking app</a>
    <a href="/docs/data-api/sql-to-rest">SQL to REST API Translator</a>
  </DocsList>
</InfoBlock>

The Neon SDK offers a CLI tool that introspects your database schema to generate a TypeScript definition file. This promotes type safety and enhances the developer experience when interacting with your database via the Data API, particularly with PostgREST clients like [`@neondatabase/postgrest-js`](https://www.npmjs.com/package/@neondatabase/postgrest-js) and [`@neondatabase/neon-js`](https://www.npmjs.com/package/@neondatabase/neon-js). Key benefits include:

- **Autocomplete** for table names and columns.
- **Type inference** for query results.
- **Compile-time error checking** for invalid queries.

## Generate types

Use `npx` to run the type generator. You must provide your **Direct Connection String** (Postgres URL) so the tool can connect to and inspect your database.

```bash
npx @neondatabase/neon-js gen-types \
  --db-url "postgresql://user:pass@ep-id.region.neon.tech/neondb" \
  --output src/types/database.ts
```

### Options

| Flag        | Alias | Description                                    | Default               |
| :---------- | :---- | :--------------------------------------------- | :-------------------- |
| `--db-url`  | `-c`  | The PostgreSQL connection string (Required).   | -                     |
| `--output`  | `-o`  | The path where the file will be saved.         | `./types/database.ts` |
| `--schemas` | `-s`  | Comma-separated list of schemas to introspect. | `public`              |

## Use generated types

Once generated, import the `Database` interface and pass it as a generic argument to `createClient`.

```typescript
// Import the generated type
import type { Database } from '@/types/database';
import { createClient } from '@neondatabase/neon-js';

// Pass the generic to the client
const client = createClient<Database>({
  auth: { url: process.env.NEON_AUTH_URL },
  dataApi: { url: process.env.NEON_DATA_API_URL },
});

// 3. Enjoy full type safety
const { data, error } = await client
  .from('posts') // Autocomplete: only 'posts' or existing tables
  .select('id, content') // Autocomplete: only columns in 'posts'
  .eq('is_published', true); // Type check: ensures 'is_published' expects a boolean
```

### Response types

The client automatically infers the return type based on your query.

```typescript
// 'data' is automatically typed as: { id: number; content: string }[] | null
const { data } = await client.from('posts').select('id, content');

// 'data' is automatically typed as: { id: number; content: string } | null
const { data } = await client.from('posts').select('id, content').single();
```

### Helper types

The generated file also exports utility types for working with your tables outside of queries:

```typescript
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

// Tables<> gives you the row type (what you get back from queries)
type Note = Tables<'notes'>;

// TablesInsert<> gives you the insert type (for creating new rows)
type NewNote = TablesInsert<'notes'>;

// TablesUpdate<> gives you the update type (for partial updates)
type NoteUpdate = TablesUpdate<'notes'>;
```

These are useful when you need to type function parameters, state variables, or props separately from your queries.

## Automate with package.json

To keep your types in sync with your database schema, we recommend adding a script to your `package.json`.

```json
{
  "scripts": {
    "generate-types": "npx @neondatabase/neon-js gen-types --db-url \"$DATABASE_URL\" --output src/types/database.ts"
  }
}
```

You can now run `npm run generate-types` whenever you make schema changes (like adding a new table or column).

## Using with the Neon PostgREST Client

If you are using `@neondatabase/postgrest-js` (without Neon Auth), the types work exactly the same way:

```typescript
import type { Database } from '@/types/database';
import { NeonPostgrestClient } from '@neondatabase/postgrest-js';

const client = new NeonPostgrestClient<Database>({
  dataApiUrl: process.env.NEON_DATA_API_URL,
});
```
