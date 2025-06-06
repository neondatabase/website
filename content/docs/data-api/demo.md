---
title: Neon Data API Demo
subtitle: Learn CRUD queries with postgrest-js from our demo app
enableTableOfContents: true
---

These examples show how to use Neon's Data API and postgrest-js for basic database operations. They're taken from our [note-taking demo app](https://github.com/neondatabase-labs/neon-data-api-neon-auth), which you can clone to try them yourself:

1. [Create a Neon project](https://pg.new) and [enable the Data API](/docs/data-api/get-started#enabling-the-data-api), noting the Data API URL.
2. Clone and set up the [demo](https://github.com/neondatabase-labs/neon-data-api-neon-auth):

   ```bash
   git clone https://github.com/neondatabase-labs/neon-data-api-neon-auth
   ```

   Follow the readme, adding your Data API URL to the `.env` file.

> The app uses `notes` and `paragraphs` tables. [See schema in the repo](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/db/schema.ts). 
> Make sure to enable Row-Level Security (RLS) for your tables. [See Example RLS for this demo app below.](#example-rls)

<Steps>

## INSERT

The demo app creates a new note like this:
```typescript
const { data, error } = await postgrest
  .from("notes")
  .insert({ title: "My Note" }) // [!code highlight]
  .select("id, title, shared, owner_id")
  .single();
```

See [src/routes/note.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/routes/note.tsx)

## SELECT

To display all notes, ordered by creation date, the app uses:

```typescript
const { data, error } = await postgrest
  .from("notes")
  .select("id, title, created_at, owner_id, shared") // [!code highlight]
  .order("created_at", { ascending: false });
```

See [src/routes/index.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/routes/index.tsx)

## UPDATE

When a user edits a note's title, the following query runs:

```typescript
const { error } = await postgrest
  .from("notes")
  .update({ title: "Updated Title" }) // [!code highlight]
  .eq("id", noteId);
```

See [src/components/app/note-title.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/components/app/note-title.tsx)

## DELETE

The demo app doesn't include delete by default, but if you wanted to add it, you'd use something like:

```typescript
const { error } = await postgrest
  .from("notes")
  .delete() // [!code highlight]
  .eq("id", noteId);
```

Now let's look at a more advanced pattern you can use with postgrest-js.

## INSERT with relationship query

You may have noticed that our INSERT example above includes `.select("*")`. This is a great feature of postgrest-js - you can insert a record and immediately fetch it back in a single query. But it gets even better! You can also fetch related records at the same time:

```typescript
const { data, error } = await postgrest
  .from("notes")
  .insert({ title: generateNameNote() })
  .select("id, title, shared, owner_id, paragraphs (id, content, created_at, note_id)") // [!code highlight]
  .single();
```

This is particularly useful when you need to:

- Create a record and immediately show it in the UI
- Ensure data consistency by getting the exact state from the database
- Reduce the number of API calls needed

See [src/routes/note.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/routes/note.tsx)

</Steps>

## Example RLS

Before using the Data API from the frontend, you **must** secure your tables with Row-Level Security (RLS). In our demo app, RLS is defined using Drizzle ORM directly in the schema:

```typescript
// src/db/schema.ts - Drizzle RLS policies for the notes table
crudPolicy({
  role: authenticatedRole,
  read: authUid(table.ownerId),
  modify: authUid(table.ownerId),
}),
pgPolicy("shared_policy", {
  for: "select",
  to: authenticatedRole,
  using: sql`${table.shared} = true`,
}),
```

- Users can only access their own notes.
- Shared notes are visible to authenticated users.
- Data access is enforced at the database level.

> _If you're working directly in SQL/Postgres, you can view or manage policies in the Neon Console or generate equivalent SQL from your Drizzle migrations._

## Learn more

- [Getting started with Data API](/docs/data-api/get-started)
- [Neon Auth documentation](/docs/guides/neon-auth)
- [postgrest-js documentation](https://github.com/supabase/postgrest-js)
