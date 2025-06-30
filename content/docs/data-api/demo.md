---
title: Neon Data API tutorial
subtitle: Set up our demo note-taking app to learn about postgrest-js queries
enableTableOfContents: true
updatedOn: '2025-06-20T15:34:40.021Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

In this tutorial, we'll walk through our note-taking app to show how you can use Neon's Data API and `postgrest-js` to write queries from your frontend code, with proper authentication and Row-Level Security (RLS) policies ensuring your data stays secure.

## About the sample application

This note-taking app is built with React and Vite. It uses Neon Auth for authentication, the Data API for direct database access, and Drizzle ORM for handling the schema.

![Notes app UI](/docs/data-api/all_notes.png)

> If you want to see this notes app in action without installing it yourself, check out this live preview:
> [Neon Data API Notes App](https://neon-data-api-neon-auth.vercel.app/)

## Prerequisites

To follow this tutorial, you'll need to:

1. [Create a Neon project](https://pg.new) and [enable the Data API](/docs/data-api/get-started#enabling-the-data-api), noting the **Data API URL**.
2. Clone and set up the [demo](https://github.com/neondatabase-labs/neon-data-api-neon-auth):

   ```bash
   git clone https://github.com/neondatabase-labs/neon-data-api-neon-auth
   ```

   Follow the README, adding your **Data API URL** to the `.env` file.

## Database Schema

The app uses two main tables: `notes` and `paragraphs`. Here's how they're structured:

```typescript
// src/db/schema.ts - Defines the database tables and their relationships

// notes table
{
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .default(sql`auth.user_id()`),
  title: text("title").notNull().default("untitled note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  shared: boolean("shared").default(false),
}

// paragraphs table
{
  id: uuid("id").defaultRandom().primaryKey(),
  noteId: uuid("note_id").references(() => notes.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}
```

Each note belongs to a user (via `ownerId`), and paragraphs are linked to notes through `noteId`.

<Steps>

## Secure your tables with RLS

Before we dive into the queries, let's first secure our tables. When making direct database queries from the frontend, **Row-Level Security (RLS) policies** are essential. They make sure that users can access **only their own data**.

RLS is crucial for any real-world app. RLS policies act as a safety net at the database level, so even if your frontend code has bugs, your data stays protected.

Our demo app uses [Drizzle](/docs/guides/neon-rls-drizzle) ORM to define RLS policies, which we highly recommend as a simpler, more maintable way of writing RLS policies:

```typescript shouldWrap
// src/db/schema.ts - RLS policies using Drizzle
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

These Drizzle policies generate the equivalent SQL policies for all CRUD operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). For example:

```sql
-- SELECT
CREATE POLICY "crud-authenticated-policy-select" ON "notes"
  AS PERMISSIVE FOR SELECT TO "authenticated"
  USING ((select auth.user_id() = "notes"."owner_id"));
-- DELETE (similar for INSERT and UPDATE)
CREATE POLICY "crud-authenticated-policy-delete" ON "notes"
  AS PERMISSIVE FOR DELETE TO "authenticated"
  USING ((select auth.user_id() = "notes"."owner_id"));
CREATE POLICY "shared_policy" ON "notes"
  AS PERMISSIVE FOR SELECT TO "authenticated"
  USING ("notes"."shared" = true);
```

The policies ensure:

1. Users can only access their own notes (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)
2. Shared notes are visible to authenticated users
3. Data access is enforced at the database level

The paragraphs table uses similar Drizzle policies that check ownership through the parent note:

```typescript shouldWrap
// src/db/schema.ts - Paragraphs RLS policies
crudPolicy({
  role: authenticatedRole,
  read: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
  modify: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
}),
pgPolicy("shared_policy", {
  for: "select",
  to: authenticatedRole,
  using: sql`(select notes.shared from notes where notes.id = ${table.noteId})`,
}),
```

<Admonition type="info" title="About auth.user_id()">
Neon's RLS policies use the <code>auth.user_id()</code> function, which extracts the user's ID from the JWT (JSON Web Token) provided by your authentication provider. In this demo, <a href="/docs/guides/neon-auth">Neon Auth</a> issues the JWTs, and Neon's Data API passes them to Postgres, so RLS can enforce per-user access.

See our [RLS docs](/docs/guides/neon-rls) and [Neon Auth](/docs/guides/neon-auth) for details.
</Admonition>

Now that our tables are secure, let's look at how to perform CRUD operations using our note-taking app as an example.

## INSERT

Let's start with creating new notes. The demo app does it like this:

```typescript
const { data, error } = await postgrest
  .from('notes')
  .insert({ title: generateNameNote() }) // [!code highlight]
  .select('id, title, shared, owner_id, paragraphs (id, content, created_at, note_id)')
  .single();
```

When you create a new note, the app automatically generates a unique, codename-style label for the title using `generateNameNote()`. That's why you'll see names like "tender fuchsia" (as shown below) in your notes list.

Here's what it looks like after creating a note and adding a couple paragraphs:

![New note UI](/docs/data-api/new_note.png)

See [src/routes/note.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/routes/note.tsx)

## SELECT

To display all notes for the current user, ordered by creation date, the app uses:

```typescript
const { data, error } = await postgrest
  .from('notes')
  .select('id, title, created_at, owner_id, shared') // [!code highlight]
  .eq('owner_id', user.id) // [!code highlight]
  .order('created_at', { ascending: false });
```

> `.eq('owner_id', user.id)` is a `postgrest-js` method that filters results, much like a SQL `WHERE` clause, to only include notes belonging to the current user.

Here's what your notes list will look like after fetching all notes from the database.

![Notes list UI](/docs/data-api/all_notes.png)

> **Hint:** To get back to your main notes list, click the **"note."** heading at the top of the app.

See [src/routes/index.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/routes/index.tsx)

## UPDATE

You can rename any note by editing its title directly in the app (for example, changing "additional jade" to "water the plants"). When you do, the app updates the note in the database behind the scenes.

Here's how the app updates a note's title using the UPDATE operation:

```typescript
const { error } = await postgrest
  .from('notes')
  .update({ title: 'Updated Title' }) // [!code highlight]
  .eq('id', noteId);
```

> Tip: With postgrest-js, you can chain methods like `.from()`, `.update()`, and `.eq()` to build queries, like in the example above.

Here's how a note looks after you update its title to something more meaningful in the UI:

![Note title updated UI](/docs/data-api/renamed_note.png)

See [src/components/app/note-title.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/components/app/note-title.tsx)

Now let's look at a more advanced pattern you can use with postgrest-js.

## INSERT and fetch related data

You may have noticed that our earlier `INSERT` example included `.select("*")`, chained after `.insert()`. This lets you insert a record and immediately fetch it back in a single query. This is a useful pattern provided by postgrest-js's chainable API (as mentioned above). And you can take it further: you can also fetch **related data** (from other tables linked by foreign keys) at the same time.

For example, in our INSERT example from earlier, we immediately fetch the new note **and** any related paragraphs (if they exist):

```typescript
const { data, error } = await postgrest
  .from('notes')
  .insert({ title: generateNameNote() }) // [!code highlight]
  .select('id, title, shared, owner_id, paragraphs (id, content, created_at, note_id)') // [!code highlight]
  .single();
```

This is particularly useful when you need to:

- Create a record and immediately show it in the UI
- Ensure data consistency by getting the exact state from the database
- Reduce the number of API calls needed

See [src/routes/note.tsx](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/routes/note.tsx)

## Adding delete functionality to the app

If you've played with the app at all, you may also have noticed — there's no way to delete a note.

This is the hands-on part of the tutorial. Let's go ahead and add delete functionality to your local version of the app. You'll see how to implement a complete DELETE operation with postgrest-js.

### Step 1: Add a delete button to your note card component

First, update the `NoteCard` component to include a delete button:

```typescript
import { Link } from "@tanstack/react-router";
import moment from "moment";
import { Trash2Icon } from "lucide-react"; // [!code highlight]

export default function NoteCard({
  id,
  title,
  createdAt,
  onDelete, // [!code highlight]
}: {
  id: string;
  title: string;
  createdAt: string;
  onDelete?: () => void; // [!code highlight]
}) {
  return (
    <div className="flex justify-between items-center"> // [!code highlight]
      <Link to="/note" search={{ id }} className="flex-1 flex justify-between"> // [!code highlight]
        <h5>{title}</h5> // [!code highlight]
        <p className="text-sm text-foreground/70"> // [!code highlight]
          {moment(createdAt).fromNow()} // [!code highlight]
        </p> // [!code highlight]
      </Link> // [!code highlight]
      {onDelete && ( // [!code highlight]
        <button // [!code highlight]
          onClick={onDelete} // [!code highlight]
          className="ml-2 p-1 text-muted-foreground hover:text-red-500" // [!code highlight]
        > // [!code highlight]
          <Trash2Icon size={16} /> // [!code highlight]
        </button> // [!code highlight]
      )}
    </div>
  );
}
```

> **Note:** Make sure to import the trash can icon: `import { Trash2Icon } from "lucide-react";`

### Step 2: Add the delete handler to your notes list

Next, add the delete handler to your `NotesList` component:

```typescript
// src/components/app/notes-list.tsx
import { usePostgrest } from '@/lib/postgrest'; // [!code highlight]

const handleDelete = async (id: string) => {
  // [!code highlight]
  const { error } = await postgrest.from('notes').delete().eq('id', id); // [!code highlight]
  if (!error) {
    window.location.reload(); // [!code highlight]
  }
};
```

> Make sure to import `usePostgrest` to get the postgrest client

Then pass the delete handler to each `NoteCard`:

```typescript
<NoteCard
  id={note.id}
  title={note.title}
  createdAt={note.created_at}
  onDelete={() => handleDelete(note.id)} // [!code highlight]
/>
```

Your app now includes a delete trash can next to each note. Go ahead and delete a couple notes to try it out:

![notes app with delete](/docs/data-api/app_with_delete.png)

> If you can't delete a note, it likely still has paragraphs attached. Postgres prevents deleting notes that have related paragraphs because of the foreign key relationship.

## Enable ON DELETE CASCADE

To allow deleting a note and all its paragraphs in one go, you'll need to update your schema to use `ON DELETE CASCADE` on the `paragraphs.note_id` foreign key.

You can do this in the Neon SQL editor:

```sql
ALTER TABLE paragraphs
  DROP CONSTRAINT paragraphs_note_id_notes_id_fk,
  ADD CONSTRAINT paragraphs_note_id_notes_id_fk
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE;
```

If you get an error about the constraint name, your database may use a different name for the foreign key.

To find it, run:

```sql
SELECT conname FROM pg_constraint WHERE conrelid = 'paragraphs'::regclass;
```

Then, use the name you find (e.g. `paragraphs_note_id_notes_id_fk`) in the `DROP CONSTRAINT` and `ADD CONSTRAINT` commands above.

</Steps>

## Learn more

- [Getting started with Data API](/docs/data-api/get-started)
- [Neon Auth documentation](/docs/guides/neon-auth)
- [postgrest-js documentation](https://github.com/supabase/postgrest-js)
- [PostgREST documentation](https://docs.postgrest.org/en/v13/)
- [Simplify RLS with Drizzle](/docs/guides/neon-rls-drizzle)
