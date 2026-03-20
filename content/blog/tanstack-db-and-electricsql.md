---
title: TanStack DB with Sync – the future of real-time UI
description: >-
  Achieving end-to-end reactivity and optimistic updates with Postgres,
  ElectricSQL, and TanStack DB
excerpt: >-
  Multiplayer UIs aren’t new. Tools like Figma and Google Docs have brought
  collaborative, real-time experiences to millions of users. But for most
  developers, building robust and scalable real-time applications has always
  been out of reach. Real-time is hard. The benefits are obvi...
date: '2025-08-07T00:14:47'
updatedOn: '2025-09-16T15:53:58'
category: community
categories:
  - community
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/tanstack-db-and-electricsql/cover.jpg
  alt: null
isFeatured: true
seo:
  title: TanStack DB with Sync - the future of real-time UI - Neon
  description: >-
    Learn how to achieve end-to-end reactivity and optimistic UI updates with
    Electric SQL, TanStack DB, and Postgres.
  keywords: []
  noindex: false
  ogTitle: TanStack DB with Sync - the future of real-time UI - Neon
  ogDescription: >-
    Learn how to achieve end-to-end reactivity and optimistic UI updates with
    Electric SQL, TanStack DB, and Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/tanstack-db-and-electricsql/social.jpg
source:
  wpId: 10527
  wpSlug: tanstack-db-and-electricsql
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Multiplayer UIs aren’t new. Tools like Figma and Google Docs have brought collaborative, real-time experiences to millions of users. But for most developers, building robust and scalable real-time applications has always been out of reach. Real-time is hard.

The benefits are obvious: no stale data, seamless collaboration, and multi-device and multiplayer flows. Many apps could benefit from real-time updates, but most don’t implement them, largely because today’s web frameworks lack built-in primitives. The web is still largely built on a client-request, server-response model.

However, real-time is increasingly expected in modern apps. With tools like Linear and Notion setting the bar for great UX.

## From Socket.io to Sync Engines

WebSocket, long polling, and Server-Sent Events aren’t new protocols or standards. They’ve been around for decades and are widely used for real-time updates across the web. However, these are low-level primitives, and building robust and scalable reactive UIs on top of them requires significant effort.

To use these successfully, developers need to build their own logic to track changes, manage client sessions, and broadcast updates. In a naive implementation, that logic often ends up on the app server, adding complexity and introducing scaling constraints.

Now, a new generation of tools – sync engines – pushes this responsibility into a dedicated service.

## Introducing Sync Engines

A sync engine is a system that handles syncing state across a distributed system, usually between clients and a central server. Emerging sync engines like Zero, PowerSync, and ElectricSQL offer this as a dedicated service that connects directly to your database, often using Postgres logical replication to detect changes and push updates to subscribed clients.

Instead of managing WebSocket connections and broadcasting updates in your app server, the sync engine handles real-time updates for you. This decouples real-time logic from your backend.

## ElectricSQL

[ElectricSQL](https://electric-sql.com/) is a Postgres-native sync engine. Electric utilizes Postgres logical replication to detect database changes and push them to clients in real-time. This turns Postgres into the **source of truth** of the real-time updates.

It’s magical when you update a row in Postgres and instantly see the UI reflect that change. This simplifies background tasks, makes multi-device and multi-user flows easier to reason about, and reduces boilerplate in your app logic. Just write to Postgres and let the sync engine do the rest.

Clients connect to the ElectricSQL sync engine server through long-polling. This means real-time updates with ElectricSQL run entirely over HTTP and can be easily proxied through your existing web server. This makes it easy to debug, inspect, and integrate. It’s also additive: you can keep using your existing backend architecture and rely on cookie-based authentication without changing your app’s security model.

Different sync engines have different scopes. ElectricSQL focuses on reads. It doesn’t support sending write queries to the sync engine. Instead, you continue using GraphQL, REST, server actions, or tRPC to update the database, and ElectricSQL syncs the changes to all clients. Real-time is achieved through propagating Postgres data updates to clients, while mutations remain an application server concern.

## TanStack DB

For truly instant UIs, network roundtrips must happen in the background, outside of the user-visible flow. To achieve this, we need:

- Prefetching data so it’s already available when needed
- Server-sent changes whenever data is mutated
- Optimistic updates for instant UI responsiveness

[TanStack DB](https://tanstack.com/db/latest) helps achieve this vision. It’s a new set of packages within the TanStack ecosystem, built by [Kyle Mathews](https://x.com/kylemathews), [Sam Willis](https://x.com/samwillis), and [Kevin De Porre](https://x.com/KevinDP55) from the ElectricSQL team. In true TanStack fashion, TanStack DB is frontend framework agnostic, with packages coming for React, Svelte, and Solid. It’s built in partnership with ElectricSQL but designed to work with REST and GraphQL backends and also other sync engines. Of course, real-time updates are only enabled when pairing TanStack DB with a sync engine like ElectricSQL.

However, real-time updates aren’t the only thing TanStack DB handles. It also manages optimistic mutations, including transactional updates. With optimistic updates, changes are applied immediately on user action and rolled back only if the server fails to persist them. TanStack DB provides callbacks for optimistically inserting, updating, and deleting items in your collections. You simply move your server calls into these callbacks, and the library handles the rest.

TanStack DB is currently in beta. You can read more about the vision and design decisions in the [v0.1 blog post](https://tanstack.com/blog/tanstack-db-0.1-the-embedded-client-database-for-tanstack-query).

## Putting it together: TanStack DB with ElectricSQL

Pairing TanStack DB with ElectricSQL isn’t just beneficial for real-time UIs, it’s ideal for applications involving background tasks or AI agents. By isolating real-time synchronization logic from your main application server, your app can remain serverless, scalable, and maintain a clear separation of concerns. Your sync engine manages stateful updates, while AI agents and background tasks simply write to Postgres, knowing the changes will propagate automatically.

What’s most impressive is how simple it is to work with. I recorded a short video to demo this experience:

<YoutubeIframe embedId="OKHYUISDYmk" isDocPost={false} />

## Jumping into the code

Let’s jump into some code to see how this can look end to end. You can find the demo contacts list application from the video [here on GitHub](https://github.com/andrelandgraf/contacts-app-tanstack-db-demo). You can find setup instructions in the README if you want to run it yourself.

Firstly, we have a Postgres database deployed on Neon. The schema is managed with Drizzle. The application is deployed running on Next.js and Vercel. We have a few React server functions for creating, updating, and deleting contacts. All of this regular full-stack TypeScript stuff with Next.js.<br />Where it becomes interesting is the TanStack DB collection that takes care of fetching the data on the client:

```typescript
import { createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { selectContactSchema } from "@/schema";
import {
  createContactAction,
  updateContactAction,
  deleteContactAction,
} from "@/actions/contacts";
export { type Contact } from "@/schema";

export const contactCollection = createCollection(
  electricCollectionOptions({
    id: "contacts",
    shapeOptions: {
      url: new URL(
        `/api/contacts`,
        typeof window !== `undefined`
          ? window.location.origin
          : `https://localhost:3000`,
      ).toString(),
      params: {
        table: "contacts",
      },
    },
    schema: selectContactSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const contactData = mutation.modified;
        const result = await createContactAction(contactData);

        if (!result.success) {
          throw new Error(result.error || "Failed to create contact");
        }
        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },
    onUpdate: async ({ transaction }) => {
      const results = [];
      for (const mutation of transaction.mutations) {
        const contactId = String(mutation.key);
        const changes = mutation.changes;
        const { id, ...updateData } = changes;

        const result = await updateContactAction(contactId, updateData);
        if (!result.success) {
          throw new Error(result.error || "Failed to update contact");
        }

        results.push(Date.now()); // Use timestamp as txid
      }

      return { txid: results };
    },

    onDelete: async ({ transaction }) => {
      const results = [];

      for (const mutation of transaction.mutations) {
        const contactId = String(mutation.key);
        const result = await deleteContactAction(contactId);

        if (!result.success) {
          throw new Error(result.error || "Failed to delete contact");
        }
        results.push(Date.now()); // Use timestamp as txid
      }
      return { txid: results };
    },
  }),
);
```

This code handles creating the contacts collection, including client-side callbacks for managing insert, update, and delete actions. These callbacks call the actual server actions to persist the changes and are part of how TanStack DB takes care of optimistic updates for us.

In your server functions, you should implement a proper transaction system and return transaction ids to help TanStack DB track transactions and potential rollbacks. Here, we just use timestamps for the sake of simplicity.

Next, we can use the collection in our components, using live queries:

```jsx
export function ContactsList() {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: contacts,
    isLoading,
    isError,
  } = useLiveQuery(
    (q) => {
      if (!searchTerm.trim()) {
        return q.from({ contacts: contactCollection });
      }

      const searchPattern = `%${searchTerm}%`;
      return q
        .from({ contacts: contactCollection })
        .where(({ contacts }) =>
          or(
            ilike(contacts.name, searchPattern),
            ilike(contacts.email, searchPattern),
            ilike(contacts.tel, searchPattern),
            ilike(contacts.title, searchPattern),
            ilike(contacts.company, searchPattern),
          ),
        );
    },
    [searchTerm],
  );

  const handleDeleteContact = async (contactId: string) => {
    try {
      await contactCollection.delete(contactId);
    } catch (error) {
      toast.error("Failed to delete contact. Please try again.");
    }
  };

  return <ContactsTable contacts={contacts} handleDeleteContact={handleDeleteContact} ... />
}
```

In TanStack DB, collections map one-to-one with database tables. To filter items from a collection, you use the `useLiveQuery` hook with it’s SQL-lite query syntax. You can even use live queries to join several collections together.

What’s left is to implement the proxy endpoint for the TanStack DB collection. Instead of having TanStack DB call the ElectricSQL server directly, we proxy the request through our application server, using a standard HTTP GET API endpoint. TanStack DB’s ElectricSQL adapter will long-poll against the proxying, allowing us to handle authentication and authorization logic in our backend without exposing the ElectricSQL server credentials to the client:

```typescript
export async function GET(request: NextRequest) {
  const user = await stackServerApp.getUser({ or: "redirect" });
  try {
    const requestUrl = new URL(request.url);
    const electricUrl = new URL("https://api.electric-sql.cloud/v1/shape");

    // Add ElectricSQL credentials
    electricUrl.searchParams.set(
      "source_id",
      process.env.ELECTRIC_SQL_CLOUD_SOURCE_ID!,
    );
    electricUrl.searchParams.set(
      "source_secret",
      process.env.ELECTRIC_SQL_CLOUD_SOURCE_SECRET!,
    );

    requestUrl.searchParams.forEach((value, key) => {
      if (["live", "handle", "offset", "cursor"].includes(key)) {
        electricUrl.searchParams.set(key, value);
      }
    });ne

    electricUrl.searchParams.set("table", "contacts");
    const filter = `user_id='${user.id}'`;
    electricUrl.searchParams.set("where", filter);

    // Proxy the request to ElectricSQL
    const response = await fetch(electricUrl);

    // Remove problematic headers that could break decoding
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error("ElectricSQL proxy error:", error);
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
```

Notice, how we can utilize our application’s authentication logic (in this case Neon Auth) and apply additional filters to the request, ensuring that a user can only query their own contacts.

Just like that, we implemented end-to-end sync in our application. Writing to Postgres, now updates our contacts application UI.<br />

## Conclusion

Whether you’re building collaborative tools, multi-device flows, agent background tasks, or simple dashboards, TanStack DB and Electric SQL provide a new and simpler way to add end-to-end reactivity and real time UI to your web applications. With this new stack, Postgres becomes the source of truth for state synchronization which greatly simplifies how you can approach state updates, and with TanStack DB we can further add optimistic UI updates to our applications.

## Try it out today!

TanStack DB is still in beta and the API may change but you can already try it out today. You can follow this guide to set up [Electric SQL with Neon](https://neon.com/guides/electric-sql). Further, ElectricSQL Cloud is now generally available and you can [sign up here](https://dashboard.electric-sql.cloud/). The Electric team published a nice starter template [here on GitHub](https://github.com/electric-sql/electric/tree/main/examples/tanstack-db-web-starter) and you can find further pointers in the [README on GitHub](https://github.com/andrelandgraf/contacts-app-tanstack-db-demo) of the contact management app accompanying this blog post.

Happy coding!
