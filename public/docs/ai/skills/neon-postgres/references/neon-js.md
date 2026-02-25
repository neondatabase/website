# Neon JS SDK

The `@neondatabase/neon-js` SDK provides a unified client for Neon Auth and Data API. It combines authentication handling with PostgREST-compatible database queries.

**Auth only?** Use `@neondatabase/auth` instead (see `neon-auth.md`) for smaller bundle size.

See the [official JavaScript SDK docs](https://neon.com/docs/reference/javascript-sdk.md) for complete details.

## Package Selection

| Use Case        | Package                      | Notes               |
| --------------- | ---------------------------- | ------------------- |
| Auth + Data API | `@neondatabase/neon-js`      | Full SDK            |
| Auth only       | `@neondatabase/auth`         | Smaller bundle      |
| Data API only   | `@neondatabase/postgrest-js` | Bring your own auth |

## Installation

```bash
npm install @neondatabase/neon-js@latest
```

> **Note:** While this package is in pre-release (beta), you must use `@latest` with npm. Without it, npm may install an older version. This is not needed with pnpm or yarn.

## Quick Setup Patterns

### Next.js

**1. Server Auth Instance:**

```typescript
// lib/auth/server.ts
import { createNeonAuth } from "@neondatabase/neon-js/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

**2. API Route Handler:**

```typescript
// app/api/auth/[...path]/route.ts
import { auth } from "@/lib/auth/server";
export const { GET, POST } = auth.handler();
```

**3. Auth Client:**

```typescript
// lib/auth/client.ts
"use client";
import { createAuthClient } from "@neondatabase/neon-js/auth/next";
export const authClient = createAuthClient();
```

**4. Database Client:**

```typescript
// lib/db/client.ts
import { createClient } from "@neondatabase/neon-js";
import type { Database } from "./database.types";

export const dbClient = createClient<Database>({
  auth: { url: process.env.NEON_AUTH_BASE_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

**5. Middleware + UI setup** — See [Neon Auth reference](neon-auth.md) for middleware configuration, `NeonAuthUIProvider`, CSS imports, and `AuthView`/`AccountView` page components.

### React SPA

```typescript
import { createAuthClient } from "@neondatabase/neon-js/auth";

const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

> **Note:** If you need React hooks like `useSession()` in custom components, pass an adapter:
> `createAuthClient(url, { adapter: BetterAuthReactAdapter() })`.
> UI components (`AuthView`, `SignedIn`, etc.) do not require an adapter.

### React SPA with Data API

```typescript
import { createClient } from "@neondatabase/neon-js";

const client = createClient<Database>({
  auth: { url: import.meta.env.VITE_NEON_AUTH_URL },
  dataApi: { url: import.meta.env.VITE_NEON_DATA_API_URL },
});

export const authClient = client.auth;
```

## Environment Variables

```bash
# Next.js (.env)
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
NEON_DATA_API_URL=https://ep-xxx.apirest.us-east-1.aws.neon.tech/neondb/rest/v1

# Vite/React (.env)
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.us-east-1.aws.neon.tech/neondb/rest/v1
```

Get your Auth URL from the Neon Console: Project -> Branch -> Auth -> Configuration.

Generate a cookie secret: `openssl rand -base64 32`

## Database Queries (PostgREST / Data API)

> **Prerequisite:** The Data API must be enabled per branch before making queries. Enable it via the Neon Console (Project → Data API), the MCP server's `provision_neon_data_api` tool, or the [REST API](https://api-docs.neon.tech/reference/createprojectbranchdataapi) (`POST /projects/{project_id}/branches/{branch_id}/data-api/{database_name}`). Without it, requests will return 404.

All query methods follow PostgREST syntax (same as Supabase).

```typescript
// Select with filters
const { data } = await client
  .from("items")
  .select("id, name, status")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(10);

// Select single row
const { data, error } = await client
  .from("items")
  .select("*")
  .eq("id", 1)
  .single();

// Insert (returns inserted row)
const { data, error } = await client
  .from("items")
  .insert({ name: "New Item", status: "pending" })
  .select()
  .single();

// Insert multiple
const { data } = await client
  .from("items")
  .insert([{ name: "A" }, { name: "B" }])
  .select();

// Update
await client.from("items").update({ status: "completed" }).eq("id", 1);

// Update and return updated row
const { data } = await client
  .from("items")
  .update({ status: "completed" })
  .eq("id", 1)
  .select()
  .single();

// Delete
await client.from("items").delete().eq("id", 1);

// Delete and return deleted row
const { data } = await client
  .from("items")
  .delete()
  .eq("id", 1)
  .select()
  .single();

// Upsert
await client.from("items").upsert({ id: 1, name: "Updated", status: "active" });
```

### Filter Operators

| Operator      | Example                                      |
| ------------- | -------------------------------------------- |
| `.eq()`       | `.eq("status", "active")`                    |
| `.neq()`      | `.neq("status", "archived")`                 |
| `.gt()`       | `.gt("price", 100)`                          |
| `.gte()`      | `.gte("price", 100)`                         |
| `.lt()`       | `.lt("price", 100)`                          |
| `.lte()`      | `.lte("price", 100)`                         |
| `.like()`     | `.like("name", "%item%")`                    |
| `.ilike()`    | `.ilike("name", "%item%")`                   |
| `.is()`       | `.is("deleted_at", null)`                    |
| `.in()`       | `.in("status", ["active", "pending"])`       |
| `.contains()` | `.contains("tags", ["important"])`           |
| `.or()`       | `.or("status.eq.active,price.gt.100")`       |
| `.not()`      | `.not("status", "eq", "archived")`           |
| `.order()`    | `.order("created_at", { ascending: false })` |
| `.limit()`    | `.limit(10)`                                 |
| `.range()`    | `.range(0, 9)` (first 10 items)              |

**Pagination formula**: `.range((page - 1) * pageSize, page * pageSize - 1)`

### Relationships

```typescript
// One-to-many
const { data } = await client
  .from("posts")
  .select("id, title, author:users(name, email)");

// Many-to-many
const { data } = await client
  .from("posts")
  .select("id, title, tags:post_tags(tag:tags(name))");

// Nested
const { data } = await client.from("posts").select(`
    id, title,
    author:users(id, name, profile:profiles(bio, avatar))
  `);
```

### Error Handling

```typescript
const { data, error } = await client.from("items").select();
if (error) {
  console.error(error.message, error.code, error.details);
  return;
}
```

Common error codes: `PGRST116` (no rows with `.single()`), `23505` (unique violation), `23503` (FK violation), `42P01` (table not found).

### Next.js Usage Examples

**Server Component:**

```typescript
// app/posts/page.tsx
import { dbClient } from "@/lib/db/client";

export default async function PostsPage() {
  const { data: posts, error } = await dbClient
    .from("posts")
    .select("id, title, created_at, author:users(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return <div>Error loading posts</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author?.name}</p>
        </li>
      ))}
    </ul>
  );
}
```

**API Route:**

```typescript
// app/api/posts/route.ts
import { dbClient } from "@/lib/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await dbClient.from("posts").select();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { data, error } = await dbClient
    .from("posts")
    .insert(body)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
```

## Auth Methods

### BetterAuth API (Default)

```typescript
await client.auth.signIn.email({ email, password });
await client.auth.signUp.email({ email, password, name });
await client.auth.signOut();
const { data: session } = await client.auth.getSession();
await client.auth.signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});
```

### Supabase-Compatible API

```typescript
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

const client = createClient({
  auth: { adapter: SupabaseAuthAdapter(), url },
  dataApi: { url },
});

await client.auth.signInWithPassword({ email, password });
await client.auth.signUp({ email, password });
const {
  data: { session },
} = await client.auth.getSession();
```

## Key Imports

```typescript
// Main client
import {
  createClient,
  SupabaseAuthAdapter,
  BetterAuthVanillaAdapter,
} from "@neondatabase/neon-js";

// Server auth (Next.js) -- unified instance
import { createNeonAuth } from "@neondatabase/neon-js/auth/next/server";

// Client auth (Next.js) -- auto-includes React adapter
import { createAuthClient } from "@neondatabase/neon-js/auth/next";

// Client auth (React SPA / vanilla)
import { createAuthClient } from "@neondatabase/neon-js/auth";

// React adapter (only needed for useSession() in custom components)
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";

// UI components (use /auth/react -- superset of /auth/react/ui and /auth/react/adapters)
import {
  NeonAuthUIProvider,
  AuthView,
  AccountView,
  SignedIn,
  SignedOut,
  UserButton,
} from "@neondatabase/neon-js/auth/react";
import { accountViewPaths } from "@neondatabase/neon-js/auth/react/ui/server";

// CSS (choose one, never both)
import "@neondatabase/neon-js/ui/css"; // Without Tailwind
// @import '@neondatabase/neon-js/ui/tailwind'; // With Tailwind v4 (in CSS file)
```

## Generate Types

```bash
npx neon-js gen-types --db-url "$DATABASE_URL" --output src/types/database.ts
```

Use types in the client for autocomplete and compile-time checking:

```typescript
import type { Database } from "./database.types";
const client = createClient<Database>({ ... });
```

## Supabase Migration

The Neon JS SDK uses the same PostgREST API as Supabase. Query syntax is identical:

```typescript
// Before (Supabase)
import { createClient } from "@supabase/supabase-js";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

// After (Neon)
import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";
const client = createClient({
  auth: { adapter: SupabaseAuthAdapter(), url: NEON_AUTH_URL },
  dataApi: { url: NEON_DATA_API_URL },
});

// Queries work the same
const { data } = await client.from("items").select();
```

## Common Mistakes

### Using old v0.1 server APIs

Use `createNeonAuth()` + `auth.handler()`, not standalone `authApiHandler()`. See `neon-auth.md` for the v0.2 pattern.

### Missing NEON_AUTH_COOKIE_SECRET

Required for Next.js, must be 32+ characters. Generate with `openssl rand -base64 32`.

### Missing force-dynamic on server components

Server components using `auth.getSession()` need `export const dynamic = 'force-dynamic'`.

### Wrong adapter import path

`BetterAuthReactAdapter` must be imported from a subpath and called as a function:

```typescript
// WRONG
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";

// CORRECT
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";
auth: {
  adapter: BetterAuthReactAdapter();
} // Don't forget ()
```

### CSS import conflicts

Choose ONE method. Never import both -- causes duplicate styles:

```css
/* With Tailwind v4 */
@import "tailwindcss";
@import "@neondatabase/neon-js/ui/tailwind";
```

```typescript
/* Without Tailwind */
import "@neondatabase/neon-js/ui/css";
```

### Missing "use client" directive

Required for any component using `useSession()` or other React hooks:

```typescript
"use client"; // Required!
import { authClient } from "@/lib/auth/client";
```

### Wrong API for adapter type

| Adapter                | Sign In                                   | Sign Up                             |
| ---------------------- | ----------------------------------------- | ----------------------------------- |
| BetterAuthReactAdapter | `signIn.email({ email, password })`       | `signUp.email({ email, password })` |
| SupabaseAuthAdapter    | `signInWithPassword({ email, password })` | `signUp({ email, password })`       |
