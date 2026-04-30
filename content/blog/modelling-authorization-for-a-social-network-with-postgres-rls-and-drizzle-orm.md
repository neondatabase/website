---
title: Modelling Authorization for a Social Network with Postgres RLS and Drizzle ORM
description: 'How to implement secure, user-specific access controls'
excerpt: >-
  Postgres’s Row-Level Security feature allows us to set up the access rules for
  our data. In other words, it can be used to declare the authorization model
  for an application or a service. As I’ve been trying to better understand RLS
  and its pros and cons, I decided to work on an...
date: '2024-11-11T19:21:18'
updatedOn: '2025-09-11T18:57:06'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/modelling-authorization-for-a-social-network-with-postgres-rls-and-drizzle-orm/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Modelling Authorization for a Social Network with Postgres RLS and Drizzle
    ORM - Neon
  description: >-
    Learn how to implement a RLS-backed authorization model in Postgres via this
    example for a social network, inspired by Twitter.
  keywords: []
  noindex: false
  ogTitle: >-
    Modelling Authorization for a Social Network with Postgres RLS and Drizzle
    ORM - Neon
  ogDescription: >-
    Learn how to implement a RLS-backed authorization model in Postgres via this
    example for a social network, inspired by Twitter.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/modelling-authorization-for-a-social-network-with-postgres-rls-and-drizzle-orm/social.jpg
source:
  wpId: 7577
  wpSlug: >-
    modelling-authorization-for-a-social-network-with-postgres-rls-and-drizzle-orm
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/modelling-authorization-for-a-social-network-with-postgres-rls-and-drizzle-orm/neon-nightly-backups-3-1024x576-3682b249.jpg)

<Admonition type="important" title="Update: Neon RLS is now part of the Neon Data API">
We’ve moved the functionality previously known as Neon RLS / Neon Authorize into the Neon Data API. You can [read more about the Data API here](https://neon.com/docs/data-api/get-started) and start using it in your projects today.
</Admonition>

Postgres’s [Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) feature allows us to set up the access rules for our data. In other words, it can be used to **declare the** **authorization model** for an application or a service. As I’ve been trying to better understand RLS and its pros and cons, I decided to work on an RLS-backed authorization model for a social network. This social network’s data model is inspired by Twitter:

- Users
  - And user profiles
- Public posts (tweets)
  - With public comments (tweet responses)
- Private Chats
  - With chat messages and chat participants

This ended up being harder than I expected, so a few of us had to collaborate on the implementation. You can find the full implementation on this [GitHub repository here](https://github.com/neondatabase-labs/social-network-drizzle-rls).

If you’re new to RLS, you might want to read [some docs](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) or watch a good Youtube video before moving on. Notice also that we’ll be using the open-source [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) Postgres extension for the authentication to Postgres (the `auth.user_id()` function in the code snippets comes from this extension).

## Users and Profiles

Let’s start with users and their profiles. This is what we’ve ended up with:

```typescript
// private table without RLS policies / this is admin-only
export const users = pgTable("users", {
  userId: text().primaryKey(),
  email: text().unique().notNull(),
}).enableRLS();

// public read / authenticated user modify
export const userProfiles = pgTable(
  "user_profiles",
  {
    userId: text().references(() => users.userId).unique(),
    name: text(),
  },
  (table) =>
    // simple CRUD tables use the `crudPolicy` function
    [
      // anyone (anonymous) can read
      crudPolicy({
        role: anonymousRole, // default role
        read: true,
        modify: null,
      }),
      // authenticated users can only modify their data
      crudPolicy({
        role: authenticatedRole, // default role
        read: true,
        modify: authUid(table.userId),
      }),
    ],
);
```

To simplify the authorization implementation, we’ve separated the `users` and the `user_profiles` tables. The `users` table has no RLS policies, meaning that nobody can read or write to it. So, how does it get populated if this is a real application?

- One option is that this table is just being synchronized from an external auth provider using a [FDW](https://www.postgresql.org/docs/current/postgres-fdw.html) or some data synchronization job.
- Another option, if you roll your own auth, is to allow your app to read and write to this table using a Postgres role that has the `BYPASSRLS` attribute.

Then, the `user_profiles` table has fairly simple RLS policies:

- A user can update its own profile
- Anyone (authenticated or not) can see anyone’s profile

## Posts and Comments

Posts and comments have a very simple schema:

```typescript
export const posts = pgTable(
  "posts",
  {
    id: text().primaryKey(),
    title: text().notNull(),
    content: text().notNull(),
    userId: text().references(() => users.userId),
  },
  (table) => [
    // anyone (anonymous) can read
    crudPolicy({
      role: anonymousRole,
      read: true,
      modify: null,
    }),
    // authenticated users can read and modify their own posts
    crudPolicy({
      role: authenticatedRole,
      read: true,
      // `userId` column matches `auth.user_id()` allows modify
      modify: authUid(table.userId),
    }),
  ],
);
```

```typescript
export const comments = pgTable(
  "comments",
  {
    id: text().primaryKey(),
    postId: text().references(() => posts.id),
    content: text(),
    userId: text().references(() => users.userId),
  },
  (table) => [
    // anyone (anonymous) can read
    crudPolicy({
      role: anonymousRole,
      read: true,
      modify: null,
    }),
    // authenticated users can can read and modify their own comments
    crudPolicy({
      role: authenticatedRole,
      read: true,
      modify: authUid(table.userId),
    }),
  ],
);
```

The posts and comments are both simple:

- You can only insert/update a new post or comment if you’re the author of said post or comment
- Anyone (authenticated or not) can view any post or any comment

## Chats, chat participants and chat messages

The private chats have **more complex requirements** around who can read/write what, so let’s break it down table by table.

### Chats

The `chats` table is a good place to start:

```typescript
export const chats = pgTable(
  "chats",
  {
    id: text().primaryKey(),
    title: text().notNull(),
    ownerId: text().references(() => users.userId),
  },
  (table) => [
    // authenticated users can read the list of chats they are participating in. Anyone can create a chat and become the owner
    // of that chat.
    crudPolicy({
      role: authenticatedRole,

      // The `(select auth.user_id()) = ${table.ownerId} OR` clause is needed because RLS rules are evaluated
      // based on existing RLS restrictions. Without this clause, we couldn’t insert the first chatParticipant
      // in a chat, as the initial rule only allowed access to chats where the user is already a participant.
      read: sql`((select auth.user_id()) = ${table.ownerId} or (select auth.user_id()) in (select user_id from MY_CHATS_PARTICIPANTS where chat_id = ${table.id}))`,
      modify: authUid(table.ownerId),
    }),
  ],
);
```

<br />First of all, you’ll notice that anonymous users (i.e., unauthenticated users) cannot see the list of chats. In fact, chats are only visible to authenticated users who happen to be a participant in the chat (as per the `my_chats_participants` view – which we’ll get to in a bit).

### Chat participants

The chat participants table is more complex. We need a table, as well as a view, since we need a circular RLS policy that allows one to see all other chat participants in a chat **if they’re a participant themselves**. The best way to handle this using Drizzle is with a table+view.

```typescript
// chat participants, connecting users and chats tables
export const chatParticipants = pgTable(
  "chat_participants",
  {
    chatId: text().references(() => chats.id),
    userId: text().references(() => users.userId),
  },
  (table) => [
    primaryKey({ columns: [table.chatId, table.userId] }),
    // authenticated users can read chat participant list
    crudPolicy({
      role: authenticatedRole,

      // Since we can't create an RLS policy for this rule,
      // we rely on the view `my_chats_participants` for reads
      read: false,
      modify: sql`(select auth.user_id() = (select owner_id from chats where id = ${table.chatId}))`,
    }),
  ],
);
```

The view is necessary because RLS does not support rules that filter a table based on its own data in a recursive way. Specifically, RLS cannot handle conditions like: “Show only the chat participants of chats where I am also a participant.” Attempting to enforce this rule directly on the `chatParticipants` table leads to a recursion error. Using a view allows us to apply this filtering logic without running into RLS limitations. That way, the view returns the list of chat participants for each chat that the user belongs to.

While using a view can be very effective to solve any “recursion issues” in RLS, it also comes with a catch — by default, the view inherits the permissions of the role that created it. In our case, that would be the database owner, which has full access to the database.

To ensure security, it’s essential to make this view **read-only**. This approach allows the view to serve as a safe, accessible data layer without granting unintended write permissions. All data modifications can then be handled directly through the `chat_participants` table.

PostgreSQL doesn’t provide an explicit option to make a view read-only, but there’s a reliable workaround. By adding certain SQL clauses — such as `JOIN`, `WITH`, or `DISTINCT` — we can turn the view into a “non-simple view”, A non-simple view in PostgreSQL is inherently read-only, preventing any data modification.

```typescript
export const myChatParticipantsView = pgView("my_chats_participants").as(
  (qb) => {
    const myChats = qb
      .select({ chatId: chatParticipants.chatId })
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, sql`auth.user_id()`));

    return (
      qb
        // 'DISTINCT' is needed to make sure the view is read-only
        // Only 'simple' views are considered read-write
        .selectDistinct()
        .from(chatParticipants)
        .where(inArray(chatParticipants.chatId, myChats))
    );
  },
);
```

### Chat messages

Our `chat_messages` table gets to reuse our prior `my_chat_participants` view to see who can read/insert what, and no one is allowed to modify or delete messages, whether they be their own or others.

```typescript
export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text().primaryKey(),
    message: text().notNull(),
    chatId: text().references(() => chats.id),
    sender: text()
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    // authenticated users can read messages for chats they participate in
    crudPolicy({
      role: authenticatedRole,
      read: sql`((select auth.user_id()) in (select user_id from my_chats_participants where chat_id = ${table.chatId}))`,
      modify: null,
    }),

    // complex table access requires `pgPolicy` functions
    // authenticated users can only insert – because there is no delete or update policy, users cannot update or delete their own or others' messages
    pgPolicy("chats-policy-insert", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`((select auth.user_id()) = ${table.sender} and (select auth.user_id()) in (select user_id from my_chats_participants where chat_id = ${table.chatId}))`,
    }),
  ],
);
```

We have two policies:

1. We use `crudPolicy` to generate a single RLS policy for `SELECT`. The policy dictates that you can only see messages in a chat if you are a participant of that chat. (We could have done this with `pgPolicy` too, but `crudPolicy` is slightly nicer.)
2. We use `pgPolicy` to generate a single RLS policy for `INSERT`. This policy dictates that you can only insert chat messages of which you are the author, and in chats where you are a participant.
3. Editing or deleting chat messages is not possible in this model (since we don’t have any policies for the UPDATE or DELETE operations).

# Summing up

I have a few takeaways from having worked on this project:

1. Writing RLS policies in raw SQL is just a difficult experience with lots of pitfalls. You have to write a lot of long statements and repetitive code. And the same is true with Drizzle’s [pgPolicy](https://orm.drizzle.team/docs/rls#policies). Instead, I advocate for **using crudPolicy from drizzle-orm/neon** — and this will work on any Postgres database, not just Neon!
2. In general, if you’re going to expose your database schema directly to your frontend (either with SQL from the client, or with [Postgrest](https://docs.postgrest.org/en/stable/)), you need to **put a lot of time and effort into validating your RLS policies**. It’s extremely easy to forget to have all the checks, and that can lead to data leaks.
   1. This is not the kind of work you can trust an LLM for.
3. In the same vein, a database schema that’s exposed via [Postgrest](https://postgrest.org/) or SQL from the frontend needs to be carefully designed **besides just the RLS policies**.
   1. For example, we had to make sure that the `userId` column in the `user_profiles` table is tagged with `unique`. This is because we want to prevent a user from creating multiple profiles for themselves.
   2. If you have a traditional backend, a lot of this logic can be encapsulated there.
4. Testing RLS policies is hard. I know there are some tools out there that simplify this (and we have some ideas ourselves), but we had to actually try to create an app using [Neon RLS](https://neon.tech/docs/guides/neon-authorize) in order to fully test this schema.
5. This schema not only has access logic baked into it, as well as some other logical constraints (column uniqueness, cascade deletes and referential integrity via foreign keys). I believe it’s a good idea, most of the time, to push down all this logic to the database layer.

Finally, I’d like to thank some folks at Neon who helped get this example together (Pedro, Bryan, Jakub and others). If you’d like to learn more about Neon RLS, you can [find the docs here](https://neon.tech/docs/guides/neon-authorize). And if you’re curious about the future of Neon RLS, we’ve also [written at length about it here](https://neon.tech/docs/guides/neon-authorize-future).
