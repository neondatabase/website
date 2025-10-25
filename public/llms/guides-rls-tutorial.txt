# Secure your app with RLS

> The document "Secure your app with RLS" guides Neon users on implementing Row-Level Security (RLS) to enhance data access control within their applications, detailing steps for configuring RLS policies in a Neon database environment.

## Source

- [Secure your app with RLS HTML](https://neon.com/docs/guides/rls-tutorial): The original HTML version of this documentation

Sample project:
- [Neon Data API + Neon Auth](https://github.com/neondatabase-labs/neon-data-api-neon-auth)

Related docs:
- [Row-Level security in Drizzle](https://orm.drizzle.team/docs/rls)

In this tutorial, you'll clone and modify up a sample React.js note-taking app to demonstrate how Postgres Row-Level Security (RLS) provides an additional security layer beyond application logic. The app integrates with a Neon database via the Neon Data API.

For authentication, **Neon Auth** issues a unique `userId` in a JSON Web Token (JWT) for each user. This `userId` is passed to Postgres, where RLS policies enforce access control directly at the database level. This setup ensures each user can only interact with their own **notes**, even if application-side logic fails. While this example uses Neon Auth, any JWT-issuing provider like Auth0 or Clerk can be used.

## Prerequisites

To get started, you'll need:

- **Neon account**: Sign up at [Neon](https://neon.tech) and create your first project in **AWS** (note: [Azure](https://neon.com/docs/guides/neon-rls#current-limitations) regions are not currently supported).
- **Neon Data API + Neon Auth example application**: Clone the sample [Neon Data API + Neon Auth repository](https://github.com/neondatabase-labs/neon-data-api-neon-auth):

  ```bash
  git clone https://github.com/neondatabase-labs/neon-data-api-neon-auth.git
  ```

  Follow the instructions in the README to set up Neon Data API with Neon Auth, configure environment variables, and run database migrations.

  > When enabling Neon Data API, ensure you select **Neon Auth** with Neon Data API.

## Create test users

Start the sample application:

```bash
npm run dev
```

Open the app in your browser using [`localhost:5173`](http://localhost:5173).

Now, let's create the two users we'll use to show how RLS policies can prevent data leaks between users, and what can go wrong if you don't. The sample app supports Google and Github logins, so let's create one of each. For this guide, we'll call our two users Alice and Bob.

Create your `Alice` user using Google. Then, using a private browser session, create your `Bob` user account using Github or other Google account.

Side by side, here's the empty state for both users:



When each user creates a note, it's securely linked to their `ownerId` in the database schema. Here's the structure of the `notes` table:

```typescript
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
```

The `ownerId` column is populated directly from the authenticated `(auth.user_id())` in the JWT, ensuring that each note is tied to the correct user.

## Create notes

Let's create some sample notes for both Alice and Bob.



The paragraphs in the notes are:



> The notes act as a top level container for paragraphs. Each paragraph is stored in `paragraphs` table, linked to the parent note by `noteId`.

### Notes are isolated

In this sample app, isolation of Notes to each user is handled both in the application logic and using Row-level Security (RLS) policies defined in our application's schema file.

Let's take a look at the `useNotes` function in the `src/routes/index.tsx` file:

```typescript
function useNotes() {
  const postgrest = usePostgrest();
  const user = useUser({ or: 'redirect' });
  return useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<Array<Note>> => {
      // `eq` filter is optional because of RLS. But we send it anyway for
      // performance reasons.
      const { data, error } = await postgrest
        .from('notes')
        .select('id, title, created_at, owner_id, shared')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
```

The `eq` clause is technically enough to make sure data is properly isolated. Neon gets `user.id` from the Neon Auth JWT and matches that to the `owner_id` column in the `notes` tables, so each user can only see their own notes.

Even though isolation is backed by our RLS policies, we include it here for performance reasons: it helps Postgres build a better query plan and use indexes where possible.

### RLS policy for viewing notes

In the application's `schema.ts` file, you can find the RLS policies written in Drizzle that provide access control at the database level. Here is a look at one of those policies:

```typescript
crudPolicy({
  role: authenticatedRole,
  read: authUid(table.ownerId),
  modify: authUid(table.ownerId),
});
```

`authUid` is a helper function that evaluates to

```
sql`(select auth.user_id() = owner_id)`
```

which is a SQL expression that checks if the `owner_id` of a row matches the `auth.user_id()` from the JWT.

This policy ensures that read (`SELECT`) queries only returns rows where the `owner_id` matches the `auth.user_id()` derived from the authenticated user's JWT. This means that users can only access their own notes. By enforcing this rule at the database level, the RLS policy provides an extra layer of security beyond the application layer.

## Remove access control from application code

Now, let's test what happens when we remove access control from the application layer to rely solely on RLS at the database level.

In the `src/routes/index.tsx` file, modify the `useNotes` function to remove the `eq` clause that filters notes by `owner_id`:

```typescript
function useNotes() {
  const postgrest = usePostgrest();
  const user = useUser({ or: 'redirect' });
  return useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<Array<Note>> => {
      const { data, error } = await postgrest
        .from('notes')
        .select('id, title, created_at, owner_id, shared')
        // .eq("owner_id", user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
```

Check your two open Notes users, reload the page, and see what happens:



Nothing happens. RLS is still in place, and isolation is maintained: no data leaks. 💪

## Disable RLS

Let's see what happens when we disable RLS on our notes and paragraphs tables. Go to your project in the Neon Console and in the SQL Editor run:

```sql
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraphs DISABLE ROW LEVEL SECURITY;
```



Bob can see all of Alice's notes and paragraphs within them, including the 'inquisitive cyan' note where her birthday party is planned. Alice now knows about her birthday party. Disabling RLS removed all RLS policies, including the `crudPolicy` on `read` queries that helped enforce data isolation. Birthday surprise is _ruined_.

### Re-enable RLS

Now, let's re-enable RLS from Neon:

```bash
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraphs ENABLE ROW LEVEL SECURITY;
```



With RLS back on, there are no more data leaks, despite the lack of access control in the application code. In this case, RLS acts as a backstop, preventing unintended data exposure due to application-side mistakes.

Order is restored, thanks to RLS. Now go fix your app before you forget:

```typescript
function useNotes() {
  const postgrest = usePostgrest();
  const user = useUser({ or: 'redirect' });
  return useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<Array<Note>> => {
      const { data, error } = await postgrest
        .from('notes')
        .select('id, title, created_at, owner_id, shared')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
```

## Appendix: Understanding RLS policies in Drizzle

In this section, we provide an overview of the Row-Level Security (RLS) policies implemented in the Notes application, found in the `schema.ts` file.

These policies are written in Drizzle, which now supports defining RLS policies alongside your schema in code. Writing RLS policies can be complex, so we worked with Drizzle to develop the `crudPolicy` function – a wrapper that works with Neon's predefined roles (`authenticated` and `anonymous`), letting you consolidate all policies that apply to a given role into a single function. See [Row-level Security](https://orm.drizzle.team/docs/rls) in the Drizzle docs for details.

For the `notes` table, the `crudPolicy` function defines RLS policies for the `authenticated` role, which is assigned to users who have successfully logged in. The `read` and `modify` parameters use the `authUid` helper function to ensure that users can only read or modify rows where the `ownerId` matches their own `auth.user_id()` from the JWT.

```typescript
// for `notes` table
crudPolicy({
  role: authenticatedRole,
  read: authUid(table.ownerId),
  modify: authUid(table.ownerId),
});
```

For the `paragraphs` table, the `crudPolicy` function also applies to the `authenticated` role. However, since paragraphs are linked to notes via the `noteId`, the `read` and `modify` parameters use a SQL subquery to check that the `owner_id` of the associated note matches the `auth.user_id()` from the JWT. This ensures that users can only read or modify paragraphs that belong to notes they own.

```typescript
// for `paragraphs` table
crudPolicy({
  role: authenticatedRole,
  read: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
  modify: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
});
```

These policies together enforce strict access control at the database level, ensuring that users can only interact with their own notes and paragraphs, regardless of any application-side logic.

### Implementing Share Notes functionality

In the `schema.ts` file, you can find additional RLS policies than defined above, which support the "Share Notes" functionality in the application. This feature allows users to share specific notes with others by setting the `shared` column to `true`. The RLS policies for the `notes` table include a condition that permits read access to notes marked as shared, regardless of ownership. The final RLS policy for the `notes` and `paragraphs` tables looks like this:

```typescript
...schema definitions...

// for `notes` table
crudPolicy({
    role: authenticatedRole,
    read: authUid(table.ownerId),
    modify: authUid(table.ownerId),
}),

pgPolicy('shared_policy', {
    for: 'select',
    to: authenticatedRole,
    using: sql`${table.shared} = true`,
})

// for `paragraphs` table
crudPolicy({
    role: authenticatedRole,
    read: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
    modify: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
}),

pgPolicy('shared_policy', {
    for: 'select',
    to: authenticatedRole,
    using: sql`(select notes.shared from notes where notes.id = ${table.noteId})`,
});
```

The `shared_policy` enables any authenticated user to read notes marked as shared (`shared = true`), allowing others to view shared notes even if they are not the owner. This policy applies similarly to paragraphs, checking if the linked note is shared.

Although RLS permits read access to shared notes for all authenticated users, the shared notes are not directly visible in other users' UI. Instead, sharing occurs via the "Share" button, which copies the note's URL to the clipboard. This URL includes the note's ID, enabling authenticated users to access the shared note and its paragraphs with-in in a read-only mode.

### RLS policies table

To check out the RLS policies defined for the `notes` table in Postgres, run this query:

```sql
   SELECT * FROM pg_policies WHERE tablename = 'notes';
```

Here is the output, showing columns `policyname, cmd, qual, with_check` only:

```sql
policyname                      | cmd    | qual                                        | with_check
--------------------------------+--------+---------------------------------------------+---------------------------------------
crud-authenticated-policy-select | SELECT | (SELECT (auth.user_id() = notes.owner_id)) |
crud-authenticated-policy-insert | INSERT |                                            | (SELECT (auth.user_id() = notes.owner_id))
crud-authenticated-policy-update | UPDATE | (SELECT (auth.user_id() = notes.owner_id)) | (SELECT (auth.user_id() = notes.owner_id))
crud-authenticated-policy-delete | DELETE | (SELECT (auth.user_id() = notes.owner_id)) |
shared_policy                    | SELECT | (shared = true)                            |
(5 rows)
```

To get an understanding of `auth.user_id()` and the role it plays in these policies, see this [explanation](https://neon.com/docs/guides/neon-rls#how-neon-rls-gets-authuserid-from-the-jwt).
