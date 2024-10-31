---
title: Neon Authorize tutorial
subtitle: Learn how Row-level Security (RLS) protects user data
enableTableOfContents: true
updatedOn: '2024-10-30T15:45:40.104Z'
---

<InfoBlock>
<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize">Clerk + Neon Authorize</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize">About Neon Authorize</a>
  <a href="https://orm.drizzle.team/docs/rls">Row-Level security in Drizzle</a>
</DocsList>
</InfoBlock>

In this tutorial, you’ll set up a sample `todos` application to learn how Postgres Row-Level Security (RLS) policies can protect user data, adding an extra layer of security beyond application logic.

## About the sample application

This `todos` app is built with Next.js and Drizzle ORM, using Clerk for user authentication and session management. Clerk handles logins and issues a unique `userId` in a JSON Web Token (JWT) for each authenticated user. This `userId` is then passed to Postgres, where RLS policies enforce access control directly in the database. This setup ensures that each user can only interact with their own todos, even if application-side logic fails or is misconfigured.

## Prerequisites

To get started, you’ll need:

- **Neon account**: Sign up at [Neon](https://neon.tech) and create your first project in **AWS** (note: [Azure](/docs/guides/neon-authorize#current-limitations) regions are not currently supported).
- **Clerk account**: Sign up for a [Clerk](https://clerk.com/) account and application. Clerk provides a free plan to get you started.
- **Neon Authorize + Clerk example application**: Clone the sample [Clerk + Neon Authorize repository](https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize):

  ```bash
  git clone https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize.git
  ```

  Follow the instructions in the readme to set up Clerk, configure environment variables, and start the application. You can also find more info in our [Clerk and Neon Authorize Quickstart](/docs/guides/neon-authorize-clerk).

## Step 1 — Create test users

Start the sample application:

```bash
npm run dev
```

Open the app in your browser using `localhost:3000`.

Now, let's create the two users we'll use to show how RLS policies can prevent data leaks between users, and what can go wrong if you don't. The sample app supports Google and email logins, so let's create one of each. For this guide, we'll call our two users Alice and Bob.

Create your `Alice` user using Google. Then, using a private browser session, try the email sign-up to create `Bob`. You'll receive a verification email from `MyApp`, probably in your spam folder.

Side by side, here's the empty state for both users:

![empty state two users in clerk demo](/docs/guides/authorize_tutorial_empty_state.png)

When each user creates a todo, it’s securely linked to their `userId` in the database schema. Here’s the structure of the `todos` table:

```typescript
{
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    userId: text("user_id")
      .notNull()
      .default(sql`(auth.user_id())`), // [!code highlight]
    task: text("task").notNull(),
    isComplete: boolean("is_complete").notNull().default(false),
    insertedAt: timestamp("inserted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
}
```

The `userId` column is populated directly from the authenticated `(auth.user_id())` in the Clerk JWT, linking each todo to the correct user.

## Step 2 — Create todos

Let's create some sample Todos for both Alice and Bob.

![isolated todo lists](/docs/guides/authorize_tutorial_isolated_todos.png)

### Todos are isolated

In this sample app, isolation of Todos to each user is handled both in the application logic and using Row-level Security (RLS) policies defined in our application's schema file.

Let's take a look at the `getTodos` function in the `actions.tsx` file:

```typescript shouldWrap
export async function getTodos(): Promise<Array<Todo>> {
  return fetchWithDrizzle(async (db, { userId }) => {
    // WHERE filter is optional because of RLS. But we send it anyway for
    // performance reasons.
    return db
      .select()
      .from(schema.todos)
      .where(eq(schema.todos.userId, sql`auth.user_id()`)) // [!code highlight]
      .orderBy(asc(schema.todos.insertedAt));
  });
}
```

The `WHERE` clause is technically enough to make sure data is properly isolated. Neon gets `auth.user_id` from the Clerk JWT and matches that to the `userId` column in the `todos` tables, so each user can only see their own Todos.

Even though isolation is backed by our RLS policies, we include it here for performance reasons: it helps Postgres build a better query plan and use indexes where possible.

### RLS policy for viewing todos

In the application's `schema.ts` file, you can find the RLS policies written in Drizzle that provide access control at the database level. Here is a look at one of those policies:

```typescript shoulWrap
pgPolicy('view todos', {
  for: 'select',
  to: 'authenticated',
  using: sql`(select auth.user_id() = user_id)`,
});
```

This policy ensures that each `SELECT` query only returns rows where the `user_id` matches the `auth.user_id()` derived from the authenticated user’s JWT. This means that users can only access their own Todos. By enforcing this rule at the database level, the RLS policy provides an extra layer of security beyond the application layer.

## Step 3 — Remove access control from application code

Now, let's test what happens when we remove access control from the application layer to rely solely on RLS at the database level.

In the `getTodos` function in `actions.tsx`, comment out the `WHERE` clause that filters todos by `userId`:

```typescript shouldWrap
export async function getTodos(): Promise<Array<Todo>> {
  return fetchWithDrizzle(async (db, { userId }) => {
    // WHERE filter is optional because of RLS. But we send it anyway for
    // performance reasons.
    return (
      db
        .select()
        .from(schema.todos)
        // .where(eq(schema.todos.userId, sql`auth.user_id()`)) // [!code highlight]
        .orderBy(asc(schema.todos.insertedAt))
    );
  });
}
```

Check your two open Todo users, reload the page, and see what happens:

![isolated todo lists](/docs/guides/authorize_tutorial_isolated_todos.png)

Nothing happens. RLS is still in place, and isolation is maintained: no data leaks. 💪

## Step 4 — Disable RLS

Let's see what happens when we disable RLS on our todos table. Go to your Clerk project in the Neon Console and in the SQL Editor run:

```sql shouldWrap
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;
```

![data leak](/docs/guides/authorize_tutorial_data_leak.png)

Bob sees all of Alice's todos, and Alice now knows about her birthday party. Disabling RLS removed all RLS policies, including the `view todos` policy on `SELECT` queries that helped enforce data isolation. Birthday surprise is _ruined_.

## Step 5 — RLS as a safety net

Another scenario, imagine a team member writes the `getTodos` function like this, thinking it's filtering todos by the current user:

```typescript shouldWrap
export async function getTodos(): Promise<Array<Todo>> {
  return fetchWithDrizzle(async (db) => {
    const todos = await db
      .select()
      .from(schema.todos)
      .where(eq(schema.todos.userId, schema.todos.userId)) // Woops // [!code highlight]
      .orderBy(asc(schema.todos.insertedAt));

    return todos;
  });
}
```

The `where` clause here might look like a valid comparison, and in a busy review, it might even go unnoticed. The developer likely intended to compare `schema.todos.userId` to an authenticated `userId`, like `schema.session.userId`. But `userId = userId` is a tautology, and will always evaluate to true.

Go ahead and replace the `getTodos` in `actions.tsx` with this incorrect version. Referesh your open Todo pages and you'll see all todos still showing for both user sessions, as expected.

### Re-enable RLS

Now, let's re-enable RLS from Neon:

```bash
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
```

![isolated todo lists](/docs/guides/authorize_tutorial_isolated_todos.png)

With RLS back on, there are no more data leaks, despite the incorrect check on the application side. In this case, RLS acts as a backstop, preventing unintended data exposure due to application-side mistakes.

Order is restored, thanks to RLS. Now go fix your app before you forget:

```typescript shouldWrap
export async function getTodos(): Promise<Array<Todo>> {
  return fetchWithDrizzle(async (db, { userId }) => {
    // WHERE filter is optional because of RLS. But we send it anyway for
    // performance reasons.
    return db
      .select()
      .from(schema.todos)
      .where(eq(schema.todos.userId, sql`auth.user_id()`))
      .orderBy(asc(schema.todos.insertedAt));
  });
}
```

## Appendix: Understanding RLS policies in Drizzle

In this section, we provide an overview of the Row-Level Security (RLS) policies implemented in the `todos` application, found in the `schema.ts` file.

These policies are written in Drizzle, which now supports defining RLS policies alongside your schema in code. Writing RLS policies can be complex, so we worked with Drizzle to develop the `crudPolicy` function – a wrapper that works with Neon’s predefined roles (`authenticated` and `anonymous`), letting you consolidate all policies that apply to a given role into a single function. See [Row-level Security](https://orm.drizzle.team/docs/rls) in the Drizzle docs for details.

The examples here use `pgPolicy` for custom control over each action.

### create todos

```typescript
p1: pgPolicy("create todos", {
  for: "insert",
  to: "authenticated",
  withCheck: sql`(select auth.user_id() = user_id)`,
}),
```

This policy allows authenticated users to perform `INSERT` operations only if the `user_id` matches the `auth.user_id()` from the JWT. This ensures that when a new todo is created, it is linked to the correct user.

### view todos

```typescript
p2: pgPolicy("view todos", {
  for: "select",
  to: "authenticated",
  using: sql`(select auth.user_id() = user_id)`,
}),
```

This policy allows authenticated users to perform `SELECT` operations where the `user_id` matches the `auth.user_id()` from the JWT, ensuring they only see their own todos.

### update todos

```typescript
p3: pgPolicy("update todos", {
  for: "update",
  to: "authenticated",
  using: sql`(select auth.user_id() = user_id)`,
}),
```

This policy permits authenticated users to perform `UPDATE` operations on todos only if the `user_id` matches their authenticated `user_id`. This protects against unauthorized modifications.

### delete todos

```typescript
p4: pgPolicy("delete todos", {
  for: "delete",
  to: "authenticated",
  using: sql`(select auth.user_id() = user_id)`,
}),
```

This policy enables authenticated users to perform `DELETE` operations on their todos only if the `user_id` corresponds to their `auth.user_id()`. This ensures that users can only remove their own entries.

These policies are designed to enforce that only the authenticated user can create, view, update, or delete their own todos, thereby maintaining secure data access within the application.

### RLS policies table

To check out the RLS policies defined for the `todos` table in Postgres, run this query:

```sql
   SELECT * FROM pg_policies WHERE tablename = 'todos';
```

Here is the output, showing columns `policyname, cmd, qual, with_check` only:

```sql
  policyname  |  cmd   |                    qual                    |                 with_check
--------------+--------+--------------------------------------------+--------------------------------------------
 create todos | INSERT |                                            | ( SELECT (auth.user_id() = todos.user_id))
 update todos | UPDATE | ( SELECT (auth.user_id() = todos.user_id)) |
 delete todos | DELETE | ( SELECT (auth.user_id() = todos.user_id)) |
 view todos   | SELECT | ( SELECT (auth.user_id() = todos.user_id)) |
(4 rows)
```
