# Neon Auth concepts

> The "Neon Auth concepts" document explains the authentication mechanisms and configurations within the Neon database platform, detailing how users can securely manage access and permissions.

## Source

- [Neon Auth concepts HTML](https://neon.com/docs/neon-auth/tutorial): The original HTML version of this documentation

Related docs:
- [About Neon Auth](https://neon.com/docs/guides/neon-auth)
- [Manage Neon Auth using the API](https://neon.com/docs/guides/neon-auth-api)

  Sample project:
- [Neon Auth Demo App](https://github.com/neondatabase-labs/neon-auth-demo-app)

Modern application development is becoming increasingly reliant on third-party authentication providers like [Clerk](https://clerk.com), [Stack Auth](https://stack-auth.com), etc., to handle secure user management. While these platforms excel at streamlining login workflows and protecting sensitive data, developers frequently encounter a hidden challenge: maintaining parity between external identity records and their application's database.

Profile updates, role changes, and user deletions in your authentication service don't automatically reflect in your application's data layer. Today, developers typically address this gap through several approaches:

- **Webhooks**: Many providers offer real-time event notifications (e.g., `user.updated`) to trigger immediate updates in your system.
- **Polling**: Periodically querying the auth provider's API checks for changes, but this approach introduces latency and risks hitting rate limits.
- **Login-time sync**: Fetching fresh profile data during authentication ensures accuracy for active users at the expense of increased latency while also leaving stale data for inactive accounts.

While these methods partially mitigate the problem, they often require writing custom synchronization scripts, implementing brittle listeners, and manually reconciling data discrepancies – turning a theoretical time-saver into an ongoing maintenance burden.

Neon Auth offers a streamlined solution to this common challenge. Instead of grappling with complex synchronization methods, Neon Auth automatically synchronizes user profiles directly to your Neon Postgres database. This eliminates the need for manual updates, ensuring accurate, real-time data. You gain the benefits of efficient, automated user data management while retaining complete control over your core application information

## A typical user data synchronization scenario

To illustrate the benefits of Neon Auth, let's consider a common scenario where you need to synchronize user data between your authentication provider and your application's database.

### Scenario overview

_This scenario uses Clerk as an example of a typical third-party auth provider. With Neon Auth, you don't need to worry about manual sync or provider integration — Neon Auth handles it for you._

You are building a social media platform where users can create profiles, post content, and interact with others. You use Clerk as your authentication provider to handle user registration, login, and password management. Your application's database stores user profiles, posts, comments, and other social data.

### Data synchronization requirements

- **User profiles**: When a user registers or updates their profile on Clerk, you need to synchronize their profile data to your application's database. This includes user ID, name, email, profile picture, and other relevant information.

- **User deletion**: If a user deletes their account, you must remove their profile and associated data from your application's database.

- **Data consistency**: Ensure that user data in your application's database remains consistent with the latest information from Clerk. Any changes to user profiles should reflect immediately in your database.

### Challenges with manual synchronization

Without Neon Auth, you would typically address these requirements using manual synchronization methods like webhooks, polling, or login-time sync. However, these approaches introduce several challenges:



- **Infrastructure and maintenance burden**: Setting up and maintaining a robust synchronization system manually involves significant infrastructure overhead. This includes configuring secure webhook endpoints, managing job queues for retries and background processing, and deploying worker processes – all adding to operational complexity. Consider the example of a webhook handler, demonstrating just a fraction of the code needed for basic user synchronization and validation:

  ```typescript
  // Webhook handler for a `user.created` event

  import { WebhookEvent, UserJSON } from '@clerk/nextjs/server';
  import { headers } from 'next/headers';
  import { Webhook } from 'svix';
  import { db } from '@/app/db/server';
  import { User, users } from '@/app/schema';

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

  async function validateRequest(request: Request) {
    const payloadString = await request.text();
    const headerPayload = await headers();

    const svixHeaders = {
      'svix-id': headerPayload.get('svix-id')!,
      'svix-timestamp': headerPayload.get('svix-signature')!,
      'svix-signature': headerPayload.get('svix-signature')!,
    };
    const wh = new Webhook(webhookSecret);
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  }

  export async function POST(request: Request) {
    const payload = await validateRequest(request);
    const payloadData = payload.data as UserJSON;
    const user = {
      userId: payload.data.id,
      name: `${payloadData.first_name} ${payloadData.last_name}`,
      email: payloadData.email_addresses[0].email_address,
    } as User;
    await db.insert(users).values(user);
    return Response.json({ message: 'User added' });
  }
  ```

       **Important** Complexity Multiplies with Event Types: Crucially, this code only handles a single event: `user.created`. *To achieve complete synchronization, you would need to write separate webhook handlers for `user.updated`, `user.deleted`, and potentially other event types* (like role changes, email updates, profile changes, etc.), depending on your application's needs and the capabilities of your auth provider. Each new webhook handler multiplies the complexity of your synchronization system and introduces more potential points of failure. This quickly becomes a brittle and unwieldy system where, inevitably, **everything that is bound to fail will fail.**

- **Development overhead**: Building custom synchronization logic requires significant development effort. You need to write code for event parsing, data mapping, database updates, and complex error handling. Polling and login-time sync, while alternatives, introduce their own complexities in terms of rate limit management, latency, and data consistency.

- **Query inefficiency**: Without synchronized data, applications often resort to fetching user data from the auth provider API at runtime, leading to increased latency and complex queries. This dependency on external APIs can impact performance and reliability.

- **Data Inconsistency risks**: Manual synchronization methods are inherently prone to inconsistencies. Webhook failures, polling delays, or errors in custom logic can lead to your database containing stale or inaccurate user data, potentially causing application errors and data integrity issues.

## Streamlining user data sync

Neon Auth offers a streamlined solution to these challenges by automating user data synchronization. Let's examine how Neon Auth simplifies the process and eliminates the complexities associated with manual methods.

### Simplified Architecture

Neon Auth introduces a simplified architecture that removes the need for webhooks, polling, and custom synchronization scripts. As shown in the diagram below, Neon Auth acts as an intermediary layer that automatically synchronizes user data to your Neon Postgres database.



With Neon Auth, the architecture is significantly cleaner and more efficient:

- **Automated synchronization**: Neon Auth handles the entire synchronization process automatically in the background. You no longer need to set up and maintain complex synchronization logic.
- **No webhooks or polling**: No need to develop and maintain webhook endpoints for different user events (e.g., `user.created`, `user.updated`, `user.deleted`). Neon Auth automatically syncs user data changes to your database without requiring external triggers.
- **Direct database access**: Your application can directly query user data from the `neon_auth.users_sync` table in your Neon Postgres database. This simplifies data access and improves query performance.
- **Error handling and retries**: Neon Auth includes built-in error handling and retry mechanisms to ensure data consistency without requiring custom code.

### Enhanced data consistency

Neon Auth ensures enhanced data consistency by providing a reliable and automated synchronization mechanism. Neon Auth continuously monitors for user data changes and automatically synchronizes these changes to your Neon Postgres database.

## Get started with Neon Auth

Watch the following video to see how Neon Auth simplifies user data synchronization:



## Accessing synchronized user data

With Neon Auth, accessing synchronized user data becomes incredibly straightforward. You can directly query the `neon_auth.users_sync` table within your Neon Postgres database.

Neon Auth automatically creates and manages this table, populating it with user data from your connected authentication provider. The table schema including the following columns:

- `id`: The unique user ID from your authentication provider.
- `name`: The user's display name.
- `email`: The user's email address.
- `created_at`: Timestamp of user creation in the auth provider.
- `updated_at`: Timestamp of the last user profile update.
- `deleted_at`: Timestamp indicating user deletion (if applicable).
- `raw_json`: A JSON column containing the full raw user data received from the authentication provider.

You can query this table using standard SQL, just like any other table in your Postgres database.

**Example Query:**

To retrieve all user information, you can use a simple `SELECT` statement:

```sql
SELECT * FROM neon_auth.users_sync;
```

This query will return a result set similar to the example below:

| id          | name          | email             | created_at          | updated_at          | deleted_at | raw_json                     |
| ----------- | ------------- | ----------------- | ------------------- | ------------------- | ---------- | ---------------------------- |
| d37b6a30... | Jordan Rivera | jordan@company.co | 2025-02-12 19:44... | null                | null       | \{"id": "d37b6a30...", ...\} |
| 0153cc96... | Alex Kumar    | alex@acme.com     | 2025-02-12 19:44... | null                | null       | \{"id": "0153cc96...", ...\} |
| 51e491df... | Sam Patel     | sam@startup.dev   | 2025-02-12 19:43... | 2025-02-12 19:46... | null       | \{"id": "51e491df...", ...\} |

**Efficient queries with JOINs**: You can easily join user data with other application tables to build complex queries. For example, to retrieve posts along with the author's name, you can use a simple `JOIN` statement:

```sql
SELECT posts.*, neon_auth.users_sync.name AS author_name
FROM posts
JOIN neon_auth.users_sync ON posts.author_id = neon_auth.users_sync.id;
```

## Conclusion

Neon Auth streamlines user data synchronization, replacing cumbersome manual methods with an automated, efficient solution. This simplifies development, accelerates query performance, ensures data consistency, and minimizes infrastructure costs.

By leveraging Neon Auth, you can focus on building your application's core features while leaving the complexities of user data management to Neon.
