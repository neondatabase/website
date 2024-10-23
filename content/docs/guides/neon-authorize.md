---
title: About Neon Authorize
subtitle: Secure your application at the database level using Postgres's Row-Level Security
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>JSON Web Tokens (JWT)</p>
<p>Row-level Security (RLS)</p>
<p>How Neon Authorize works</p>
</DocsList>

<DocsList title="Sample projects" theme="repo">
  <a href="https://github.com/neondatabase-labs/clerk-nextjs-frontend-neon-authorize">Clerk + Neon Authorize (frontend sql)</a>
  <a href="https://github.com/neondatabase-labs/stack-nextjs-neon-authorize">Stack Auth + Neon Authorize</a>
  <a href="https://github.com/neondatabase-labs/auth0-nextjs-neon-authorize">Auth0 + Neon Authorize</a>
</DocsList>
</InfoBlock>

<ComingSoon/>

**Neon Authorize** integrates with third-party **JWT-based authentication providers** like Auth0 and Clerk, bringing authorization closer to your data by leveraging **Row-Level Security (RLS)** at the database level.

## Authentication and authorization

When implementing user authentication in your application, third-party authentication providers like **Clerk**, **Auth0**, and others simplify the process of managing user identities, passwords, and security tokens. Once a user's identity is confirmed, the next step is **authorization** — controlling who can do what in your app based on their user type or role — for example, admins versus regular users. With Neon Authorize, you can manage authorization directly within Postgres, either alongside or as a complete replacement for security at other layers.

## How Neon Authorize works

Most authentication providers issue **JSON Web Tokens (JWTs)** on user authentication to convey user identity and claims. The JWT is a secure way of proving that logged-in users are who they say they are &#8212; and passing that proof on to other entities.

With **Neon Authorize**, the JWT is passed on to Neon, where you can make use of the validated user identity right in Postgres. To integrate with an authentication provider, add your provider's JWT discovery URL to your project. This lets Neon retrieve the necessary keys to validate the JWTs.

Behind the scenes, the [Neon Proxy](#the-role-of-the-neon-proxy) performs the validation, while the open source extension [pg_session_jwt](#how-the-pg_session_jwt-extension-works) makes the extracted `user_id` available to Postgres. You can then use **Row-Level Security (RLS)** policies in Postgres to enforce access control at the row level, ensuring that users can only access or modify data according to the defined rules. Since these rules are implemented directly in the database, they can offer a secure fallback — or even a primary solution — in case security in other layers of your application fail. See [when to rely on RLS](#when-to-rely-on-rls) for more information.

![neon authorize architecture](/docs/guides/neon_authorize_architecture.png)

## Before and after Neon Authorize

Let's take a **before/after** look at moving authorization from the application level to the database to demonstrate how Neon Authorize offers a different approach to securing your application.

### Before Neon Authorize (application-level checks):

In a traditional setup, you might handle authorization for a function directly in your backend code:

```typescript shouldWrap
export async function insertTodo(newTodo: { newTodo: string; userId: string }) {
  const { userId } = auth(); // Gets the user's ID from the JWT or session

  if (!userId) throw new Error('No user logged in'); // No user authenticated

  if (newTodo.userId !== userId) throw new Error('Unauthorized'); // User mismatch

  // Inserts the new todo, linking it to the authenticated user
  await fetchWithDrizzle(async (db) => {
    return db.insert(schema.todos).values({
      task: newTodo.newTodo,
      isComplete: false,
      userId, // Explicitly ties todo to the user
    });
  });

  revalidatePath('/');
}
```

In this case, you have to:

- Check if the user is authenticated and their `userId` matches the data they are trying to modify.
- Handle both task creation and authorization in the backend code.

### After Neon Authorize (RLS in the database):

With Neon Authorize, you can let the database handle the authorization through **Row-Level Security** (RLS) policies. Here's an example of applying authorization for creating new todo items, where only authenticated users can insert data:

<Tabs labels={["SQL", "Drizzle"]}>
<TabItem>

```sql
CREATE POLICY "create todos" ON "todos"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (auth.user_id() = user_id);
```

</TabItem>

<TabItem>

```typescript
pgPolicy('create todos', {
  for: 'insert',
  to: 'authenticated',
  withCheck: sql`(select auth.user_id() = user_id)`,
});
```

</TabItem>
</Tabs>

Now, in your backend, you can simplify the logic, removing the user authentication checks and explicit authorization handling.

```typescript shouldWrap
export async function insertTodo(newTodo: { newTodo: string }) {
  await fetchWithDrizzle(async (db) => {
    return db.insert(schema.todos).values({
      task: newTodo.newTodo,
      isComplete: false,
    });
  });

  revalidatePath('/');
}
```

This approach is flexible: you can manage RLS policies directly in SQL, or use an ORM to centralize them within your schema. Keeping both schema and authorization in one place can make it easier to maintain security. Some ORMs like Drizzle are adding support for declaritive RLS, which makes the logic easier to scan and scale.

## How Neon Authorize gets `auth.user_id()` from the JWT

Let's break down the RLS policy controlling who can **view todos** to see what Neon Authorize is actually doing:

<Tabs labels={["SQL", "Drizzle"]}>

<TabItem>

```sql
CREATE POLICY "view todos" ON "todos" AS PERMISSIVE
  FOR SELECT TO authenticated
  USING ((select auth.user_id() = user_id));
```

</TabItem>

<TabItem>

```typescript
pgPolicy('view todos', {
  for: 'select',
  to: 'authenticated',
  using: sql`(select auth.user_id() = user_id)`,
});
```

</TabItem>

</Tabs>

This policy enforces that a user can only view their own `todos`. Here's how each component works together.

### The role of the Neon Proxy

When a request is made, the Neon Proxy validates the JWT by checking its signature and expiration date against the public keys. Once validated, the Neon Proxy extracts the `user_id` from the JWT's claims and forwards it to the database session, making it available within Postgres.

### How the `pg_session_jwt` extension works

The **pg_session_jwt** extension makes the extracted user ID accessible within your SQL queries and RLS policies:

```typescript
using: sql`(select auth.user_id() = user_id)`,
```

- `auth.user_id()`: This function, provided by `pg_session_jwt`, retrieves the authenticated user's ID from the JWT (it looks for it in the `sub` field).
- `user_id`: This refers to the `user_id` column in the `todos` table, representing the owner of each to-do item.

The RLS policy compares the `user_id` from the JWT with the `user_id` in the todos table. If they match, the user is allowed to view their own todos; if not, access is denied.

## When to rely on RLS

For early-stage applications, **RLS** might be all the security you need to scale your project. For more mature applications, where larger development teams are involved, RLS can act as a backstop or final guarantee. Even if other security layers fail — for example, a front-end component exposes access to a part of your app that it shouldn't, or your backend misapplies authorization — RLS ensures that unauthorized users will not be able to interact with your data. The exposed action will fail, protecting your sensitive database-backed resources.

## Supported providers

Here is a non-exhaustive list of authentication providers. The table shows which providers Neon Authorize supports, links out to provider documentation for details, and the discovery URL pattern each provider typically uses.

| Provider               | Supported? | Documentation                                                                                                                 | JWKS URL                                                                                    |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Clerk**              | ✅         | [docs](https://clerk.com/docs/backend-requests/making/jwt-templates#create-a-jwt-template)                                    | `https://{yourClerkDomain}/.well-known/jwks.json`                                           |
| **Stack Auth**         | ✅         | [docs](https://sage.storia.ai/stack-auth)                                                                                     | `https://api.stack-auth.com/api/v1/projects/{project_id}/.well-known/jwks.json`             |
| **Auth0**              | ✅         | [docs](https://auth0.com/docs/security/tokens/json-web-tokens/json-web-key-sets)                                              | `https://{yourDomain}/.well-known/jwks.json`                                                |
| **Firebase Auth**      | ✅         | [docs](https://cloud.google.com/api-gateway/docs/authenticating-users-firebase)                                               | `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com` |
| **Stytch**             | ✅         | [docs](https://stytch.com/docs/api/jwks-get)                                                                                  | `https://{live or test}.stytch.com/v1/sessions/jwks/{project-id}  `                         |
| **Keycloak**           | ✅         | [docs](https://documentation.cloud-iam.com/how-to-guides/configure-remote-jkws.html)                                          | `https://{your-keycloak-domain}/auth/realms/{realm-name}/protocol/openid-connect/certs`     |
| **Supabase**           | ❌         | N/A                                                                                                                           | N/A                                                                                         |
| **Amazon Cognito**     | ✅         | [docs](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html) | `https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json`             |
| **Azure AD**           | ✅         | [docs](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens)                                               | `https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens`                   |
| **GCP Cloud Identity** | ✅         | [docs](https://developers.google.com/identity/openid-connect/openid-connect#discovery)                                        | `https://www.googleapis.com/oauth2/v3/certs`                                                |

## Sample applications

You can use these sample ToDo applications to get started using Neon Authorize with the following popular authentication providers.

<DetailIconCards>
<a href="https://github.com/neondatabase-labs/clerk-nextjs-frontend-neon-authorize" description="A Todo List built with Clerk, Next.js, and Neon Authorize (SQL from the Frontend)" icon="github">Clerk (Frontend) + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/stack-nextjs-neon-authorize" description="A Todo List built with Stack Auth, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Stack Auth + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/auth0-nextjs-neon-authorize" description="A Todo List built with Auth0, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Auth0 + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/stytch-nextjs-neon-authorize" description="A Todo List built with Stytch, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Stytch + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/azure-ad-b2c-nextjs-neon-authorize" description="A Todo List built with Azure AD B2C, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Azure AD B2C + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/authorize-demo-custom-jwt" description="A demo of Neon Authorize with custom generated JWTs" icon="github">Neon Authorize with custom JWTs</a>
</DetailIconCards>

## Current limitations

While this feature is in its early-access phase, there are some limitations to be aware of:

- **Authentication provider requirements**: Your authentication provider must provider must support **Asymmetric Keys**. For example, **Supabase Auth** will not be compatible until asymetric key support is added. You can track progress on this item [here](https://github.com/orgs/supabase/discussions/29289).
- **Connection type**: Your application must use **HTTP** to connect to Neon. At this time, **TCP** and **WebSockets** are not supported. This means you need to use the [Neon serverless driver](/docs/serverless/serverless-driver) over HTTP.
- **JWT expiration delay**: After removing an authentication provider from your project, it may take a few minutes for JWTs signed by that provider to stop working.
- **Algorithm support**: Only JWTs signed with the **ES256** and **RS256** algorithms are supported.
- **Postgres 17:** Postgres 17 is currently unsupported but may be available soon.
- **Azure:** Neon Authorize does not yet support projects set up in Azure regions.

These limitations will evolve as we continue developing the feature. If you have any questions or run into issues, please let us know.
