---
title: About Neon Authorize
subtitle: Secure your application at the database level using Postgres's Row-Level
  Security
enableTableOfContents: true
updatedOn: '2024-12-11T13:08:18.288Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>JSON Web Tokens (JWT)</p>
<p>Row-level Security (RLS)</p>
<p>How Neon Authorize works</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize-tutorial">Neon Authorize Tutorial</a>
  <a href="/docs/postgresql/postgresql-row-level-security">Postgres Row-Level Security tutorial</a>
  <a href="/docs/guides/neon-authorize-drizzle">Simplify RLS with Drizzle</a>
</DocsList>

</InfoBlock>

**Neon Authorize** integrates with third-party **JWT-based authentication providers** like Auth0 and Clerk, bringing authorization closer to your data by leveraging [Row-Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) at the database level.

## Authentication and authorization

When implementing user authentication in your application, third-party authentication providers like **Clerk**, **Auth0**, and others simplify the process of managing user identities, passwords, and security tokens. Once a user's identity is confirmed, the next step is **authorization** — controlling who can do what in your app based on their user type or role — for example, admins versus regular users. With Neon Authorize, you can manage authorization directly within Postgres, either alongside or as a complete replacement for security at other layers.

## How Neon Authorize works

Most authentication providers issue **JSON Web Tokens (JWTs)** on user authentication to convey user identity and claims. The JWT is a secure way of proving that logged-in users are who they say they are &#8212; and passing that proof on to other entities.

With **Neon Authorize**, the JWT is passed on to Neon, where you can make use of the validated user identity directly in Postgres. To integrate with an authentication provider, you will add your provider's JWT discovery URL to your Neon project. This lets Neon retrieve the necessary keys to validate the JWTs.

```typescript shouldWrap
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_AUTHENTICATED_URL, { authToken: myAuthProvider.getJWT() });

await sql(`select * from todos`);
```

Behind the scenes, the [Neon Proxy](#the-role-of-the-neon-proxy) performs the validation, while Neon's open source [pg_session_jwt](/docs/guides/neon-authorize#how-the-pgsessionjwt-extension-works) extension makes the extracted `user_id` available to Postgres. You can then use **Row-Level Security (RLS)** policies in Postgres to enforce access control at the row level, ensuring that users can only access or modify data according to the defined rules. Since these rules are implemented directly in the database, they can offer a secure fallback — or even a primary authorization solution — in case security in other layers of your application fail. See [when to rely on RLS](#when-to-rely-on-rls) for more information.

![neon authorize architecture](/docs/guides/neon_authorize_architecture.png)

## Database roles

Neon Authorize works with two primary database roles:

- **Authenticated role**: This role is intended for users who are logged in. Your application should send the authorization token when connecting using this role.
- **Anonymous role**: This role is intended for users who are not logged in. It should allow limited access, such as reading public content (e.g., blog posts) without authentication.

<Admonition type="note">
Some authentication providers, like Firebase, support "anonymous authentication" where a unique user ID is automatically generated for visitors who haven't explicitly logged in. This is useful for features like shopping carts, where you want to track a user's actions before they create an account. These anonymous users will still have a valid JWT and can use the anonymous role, making it possible to track their actions while maintaining security.
</Admonition>

### Using Neon Authorize with custom JWTs

If you don’t want to use a third-party authentication provider, you can build your application to generate and sign its own JWTs. Here’s a sample application that demonstrates this approach: [See demo](https://github.com/neondatabase/authorize-demo-custom-jwt)

## Before and after Neon Authorize

Let's take a **before/after** look at moving authorization from the application level to the database to demonstrate how Neon Authorize offers a different approach to securing your application.

### Before Neon Authorize (application-level checks):

In a traditional setup, you might handle authorization for a function directly in your backend code:

```typescript shouldWrap
export async function insertTodo(newTodo: { newTodo: string; userId: string }) {
  const { userId, getToken } = auth(); // Gets the user's ID and getToken from the JWT or session
  const authToken = await getToken(); // Await the getToken function

  if (!userId) throw new Error('No user logged in'); // No user authenticated
  if (newTodo.userId !== userId) throw new Error('Unauthorized'); // User mismatch

  const db = drizzle(process.env.DATABASE_AUTHENTICATED_URL!, { schema });

  return db.$withAuth(authToken).insert(schema.todos).values({
    task: newTodo.newTodo,
    isComplete: false,
    userId, // Explicitly ties todo to the user
  });
}
```

In this case, you have to:

- Check if the user is authenticated and their `userId` matches the data they are trying to modify.
- Handle both task creation and authorization in the backend code.

### After Neon Authorize (RLS in the database):

With Neon Authorize, you only need to pass the JWT to the database - authorization checks happen automatically through RLS policies:

<Tabs labels={["Drizzle", "SQL"]}>

<TabItem>

```typescript
pgPolicy('create todos', {
  for: 'insert',
  to: 'authenticated',
  withCheck: sql`(select auth.user_id() = user_id)`,
});
```

</TabItem>

<TabItem>

```sql
CREATE POLICY "create todos" ON "todos"
    AS PERMISSIVE FOR INSERT
    TO authenticated
    WITH CHECK (auth.user_id() = user_id);
```

</TabItem>
</Tabs>

Now, in your backend, you can simplify the logic, removing the user authentication checks and explicit authorization handling.

```typescript shouldWrap
export async function insertTodo({ newTodo }: { newTodo: string }) {
  const { getToken } = auth();
  const authToken = await getToken();
  const db = drizzle(process.env.DATABASE_AUTHENTICATED_URL!, { schema });

  return db.$withAuth(authToken).insert(schema.todos).values({
    task: newTodo,
    isComplete: false,
  });
}
```

This approach is flexible: you can manage RLS policies directly in SQL, or use an ORM like Drizzle to centralize them within your schema. Keeping both schema and authorization in one place can make it easier to maintain security. Some ORMs like [Drizzle](https://orm.drizzle.team/docs/rls#using-with-neon) are adding support for declaritive RLS, which makes the logic easier to scan and scale.

## How Neon Authorize gets `auth.user_id()` from the JWT

Let's break down the RLS policy controlling who can **view todos** to see what Neon Authorize is actually doing:

<Tabs labels={["Drizzle", "SQL"]}>

<TabItem>

```typescript
pgPolicy('view todos', {
  for: 'select',
  to: 'authenticated',
  using: sql`(select auth.user_id() = user_id)`,
});
```

</TabItem>

<TabItem>

```sql
CREATE POLICY "view todos" ON "todos" AS PERMISSIVE
  FOR SELECT TO authenticated
  USING ((select auth.user_id() = user_id));
```

</TabItem>

</Tabs>

This policy enforces that an authenticated user can only view their own `todos`. Here's how each component works together.

### What Neon does for you

When your application makes a request, Neon validates the JWT by checking its signature and expiration date against a public key. Once validated, Neon extracts the `user_id` from the JWT and uses it in the database session, making it accessible for RLS.

### How the `pg_session_jwt` extension works

The **pg_session_jwt** extension enables RLS policies to verify user identity directly within SQL queries:

```typescript
using: sql`(select auth.user_id() = user_id)`,
```

- `auth.user_id()`: This function, provided by `pg_session_jwt`, retrieves the authenticated user's ID from the JWT (it looks for it in the `sub` field).
- `user_id`: This refers to the `user_id` column in the `todos` table, representing the owner of each to-do item.

The RLS policy compares the `user_id` from the JWT with the `user_id` in the todos table. If they match, the user is allowed to view their own todos; if not, access is denied.

## When to rely on RLS

For early-stage applications, **RLS** might offer all the security you need to scale your project. For more mature applications or architectures where multiple backends read from the same database, RLS centralizes authorization rules within the database itself. This way, every service that accesses your database can benefit from secure, consistent access controls without needing to reimplement them individually in each connecting application.

RLS can also act as a backstop or final guarantee to prevent data leaks. Even if other security layers fail — for example, a front-end component exposes access to a part of your app that it shouldn't, or your backend misapplies authorization — RLS ensures that unauthorized users will not be able to interact with your data. In these cases, the exposed action will fail, protecting your sensitive database-backed resources.

## Supported providers

Here is a non-exhaustive list of authentication providers. The table shows which providers Neon Authorize supports, links out to provider documentation for details, and the discovery URL pattern each provider typically uses.

| Provider                                  | Supported? | JWKS URL                                                                                                                                                           | Documentation                                                                                                                 |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Clerk**                                 | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://{yourClerkDomain}/.well-known/jwks.json`</span>                                           | [docs](https://clerk.com/docs/backend-requests/making/jwt-templates#create-a-jwt-template)                                    |
| **Stack Auth**                            | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://api.stack-auth.com/api/v1/projects/{project_id}/.well-known/jwks.json`</span>             | [docs](https://sage.storia.ai/stack-auth)                                                                                     |
| **Auth0**                                 | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://{yourDomain}/.well-known/jwks.json`</span>                                                | [docs](https://auth0.com/docs/security/tokens/json-web-tokens/json-web-key-sets)                                              |
| **Firebase Auth / GCP Identity Platform** | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`</span> | [docs](https://cloud.google.com/api-gateway/docs/authenticating-users-firebase)                                               |
| **Stytch**                                | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://{live_or_test}.stytch.com/v1/sessions/jwks/{project-id}`</span>                           | [docs](https://stytch.com/docs/api/jwks-get)                                                                                  |
| **Keycloak**                              | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://{your-keycloak-domain}/auth/realms/{realm-name}/protocol/openid-connect/certs`</span>     | [docs](https://documentation.cloud-iam.com/how-to-guides/configure-remote-jkws.html)                                          |
| **Supabase Auth**                         | ❌         | Not supported until Supabase [supports asymmetric keys](https://github.com/orgs/supabase/discussions/29289).                                                       | N/A                                                                                                                           |
| **Amazon Cognito**                        | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json`</span>             | [docs](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html) |
| **Azure AD**                              | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://login.microsoftonline.com/{tenantId}/discovery/v2.0/keys`</span>                          | [docs](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens)                                               |
| **Google Identity**                       | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://www.googleapis.com/oauth2/v3/certs`</span>                                                | [docs](https://developers.google.com/identity/openid-connect/openid-connect#discovery)                                        |
| **Descope Auth**                          | ✅         | <span style={{ whiteSpace: "normal", wordBreak: "break-word" }}>`https://api.descope.com/{YOUR_DESCOPE_PROJECT_ID}/.well-known/jwks.json`</span>                   | [docs](https://docs.descope.com/project-settings/jwt-templates)                                                               |

### JWT Audience Checks

Neon Authorize can also verify the `aud` claim in the JWT. This is useful if you want to restrict access to a specific application or service.

For authentication providers such as Firebase Auth and GCP Cloud Identity, Neon Authorize **mandates** the definition of an expected audience. This is because these providers share the same JWKS URL for all of their projects.

The configuration of the expected audience can be done via the Neon Authorize UI or via the [Neon Authorize API](https://api-docs.neon.tech/reference/addprojectjwks).

## Sample applications

You can use these sample ToDo applications to get started using Neon Authorize with popular authentication providers.

<DetailIconCards>
<a href="https://github.com/neondatabase-labs/clerk-nextjs-frontend-neon-authorize" description="A Todo List built with Clerk, Next.js, and Neon Authorize (SQL from the Frontend)" icon="github">Clerk (Frontend) + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/stack-nextjs-neon-authorize" description="A Todo List built with Stack Auth, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Stack Auth + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/auth0-nextjs-neon-authorize" description="A Todo List built with Auth0, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Auth0 + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/stytch-nextjs-neon-authorize" description="A Todo List built with Stytch, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Stytch + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/azure-ad-b2c-nextjs-neon-authorize" description="A Todo List built with Azure AD B2C, Next.js, and Neon Authorize (SQL from the Backend)" icon="github">Azure AD B2C + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/descope-react-frontend-neon-authorize" description="A Todo list built with Descope, Next.js, and Neon Authorize (SQL from the frontend)" icon="github">Descope + Neon Authorize</a>
<a href="https://github.com/neondatabase-labs/authorize-demo-custom-jwt" description="A demo of Neon Authorize with custom generated JWTs" icon="github">Neon Authorize with custom JWTs</a>
</DetailIconCards>

## Current limitations

While this feature is in its early-access phase, there are some limitations to be aware of:

- **Authentication provider requirements**:
  - Your authentication provider must support **Asymmetric Keys**. For example, **Supabase Auth** will not be compatible until asymetric key support is added. You can track progress on this item [here](https://github.com/orgs/supabase/discussions/29289).
  - The provider must generate a unique set of public keys for each project and expose those keys via a unique URL for each project.
- **Connection type**: Your application must use **HTTP** to connect to Neon. At this time, **TCP** and **WebSockets** connections are not supported. This means you need to use the [Neon serverless driver](/docs/serverless/serverless-driver) over HTTP as your Postgres driver.
- **JWT expiration delay**: After removing an authentication provider from your project, it may take a few minutes for JWTs signed by that provider to stop working.
- **Algorithm support**: Only JWTs signed with the **ES256** and **RS256** algorithms are supported.

These limitations will evolve as we continue developing the feature. If you have any questions or run into issues, please let us know.
