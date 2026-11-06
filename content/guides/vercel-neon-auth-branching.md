---
title: 'Testing auth changes safely with Vercel and Neon branching'
subtitle: 'Use Vercel preview deployments and Neon branching to test sensitive authentication features without risking production data'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-01-15T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Authentication and user management are among the hardest parts of an application to test. For example, how do you validate a moderation feature without risking real user data? Or make sure that role-based access control changes work correctly across your entire user base?

Traditionally, teams rely on staging environments, but keeping them in sync with production is complex, and synthetic data rarely reflects real behavior. A better approach is to give each feature branch access to realistic production data. The problem is that cloning an entire database for every branch is slow and costly, and keeping authentication data aligned is hard.

Neon addresses this with **branching**. Branches use [copy‑on‑write](/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write), so they're created instantly without copying data up front, which makes it practical to spin up a new database for every pull request. This extends to [Managed Better Auth](/docs/auth/branching-authentication): because identity data lives in the database's `neon_auth` schema, it's cloned with each branch, so you can test destructive authentication flows against production‑like data without touching production.

This guide walks through that workflow with **Neon branching** and **Vercel**. With the [Vercel-Managed Integration](/docs/guides/vercel-managed-integration), every pull request triggers a Vercel preview deployment, and Neon provisions a matching database branch containing a snapshot of your production users.

You will build a simple message board to demonstrate this workflow:

1.  **Start with an open board** where anyone can post (Production).
2.  **Develop a "Moderation" feature** where only Admins can approve posts (Preview Deployment).
3.  **Test the Admin flow** using real user accounts in the isolated Preview environment.
4.  **Verify** that production remains unaffected throughout the process.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js `v20.0` or later.
- A [Vercel account](https://vercel.com) and a [GitHub account](https://github.com).

<Steps>

## Deploy the base application

You will start with a basic message board application where any authenticated user can post messages and see messages from others. To focus on the branching workflow this guide uses a pre-built starter repository.

<Admonition type="note">
If you need a refresher on setting up a new Next.js application with Managed Better Auth from scratch, see [Getting started with Managed Better Auth and Next.js](/guides/neon-auth-nextjs).
</Admonition>

### Fork the repository

Navigate to the [starter repository](https://github.com/dhanushreddy291/vercel-neon-auth-branching) and fork it into your own GitHub account.

<DetailIconCards>
    <a href="https://github.com/dhanushreddy291/vercel-neon-auth-branching" description="Message board application with Managed Better Auth and Vercel preview branching" icon="github">
      Starter repository
    </a>
</DetailIconCards>

This project is built with **Next.js (App Router)**, **Managed Better Auth** for authentication, and **Drizzle ORM** for database interactions.

### Deploy to production

Now deploy the forked repository to Vercel.

1. Open your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New -> Project**.
2. Select the forked repository from **your** GitHub account.
3. Deploy the project using the default settings.
   <Admonition type="important" title="Initial deployment failure">
   The initial deployment **will fail**. This is expected. Vercel does not yet have the required environment variables to connect to Neon. You will configure these in the next step using the Neon-Vercel integration.
   </Admonition>

### Connect Vercel to Neon

You will need to create a Neon project and connect it to Vercel using the Neon Vercel integration.

1. Open the [Neon integration on the Vercel Marketplace](https://vercel.com/marketplace/neon) and click **Install**.
2. In the **Install Neon** modal, choose one of the following options depending on whether you already have a Neon account:
   - **Create New Neon Account**
   - **Link Existing Neon Account**  
     ![Create a New Neon Account](/docs/guides/vercel_install_neon_modal_new_account.png)
3. Accept the terms, then select a region and plan for your Neon project.
4. Make sure **Auth** is checked, then click **Continue**.  
   ![Vercel Neon Create Project Modal](/docs/guides/vercel_create_neon_project_with_auth.png)
5. Enter a project name (for example, `vercel-neon-auth-branching`) and click **Create**.
6. After creation, you should be redirected to a page showing the details of your newly created Neon project. Click **Connect Project**.
   ![Vercel Neon Connect Project](/docs/guides/vercel_connect_project_button.png)
7. In the Connect Project modal:
   - Select the Vercel project you just created.
   - Enable **Create Database Branch for Deployment** for **Preview** deployments.
     ![Vercel Neon Connect Project Modal](/docs/guides/vercel_neon_connect_project_modal.png)

8. Click Connect to finalize the integration.

Vercel will automatically inject the database connection strings and Managed Better Auth URLs into your selected project’s environment variables for both production and preview deployments.

<Admonition type="info" title="How automated Auth configuration works">
The Vercel integration is aware of Managed Better Auth. For the `production` branch, it injects your production Auth URL. For preview deployments, it creates a new database branch, provisions a dedicated Auth API endpoint for that branch, and automatically injects *that specific endpoint* into the Vercel preview environment.
</Admonition>

Now that the integration is set up, trigger a new deployment by navigating to the **Deployments** tab and clicking **Redeploy** on the latest deployment. You should see a successful deployment this time.

![Vercel redeploy button](/docs/guides/vercel_redeploy_button.png)

### Configure redirect URLs

To enable proper redirection after authentication, you must configure the allowed redirect URLs in the **Neon Console** for your production environment. For preview deployments, the Vercel–Neon integration automatically manages this configuration using the Vercel preview URLs, so this step is required only for production.

1. In your Vercel dashboard, open the **Storage** tab and select your Neon project.  
   Click **Open in Neon** to access the Neon Console.
2. In the Neon Console, navigate to **Auth → Configuration**.
3. Under **Domains**, add your Vercel production URL (for example, `https://your-vercel-project.vercel.app`) and click **Add domain**.

![Add production domain in Neon Console](/docs/changelog/neon-auth-domains.png)

### Test the production deployment

Open your Vercel production URL in a browser. You should see the message board application.

Test the core functionality:

1. Sign up as a new user.
2. Log in with the newly created account.
3. Post a message and verify it appears on the board.
4. Open another browser or incognito window, sign up as a different user, and verify that you can see messages posted by others.

![Message board application screenshot](/docs/guides/message_board_application.png)

Once you have verified that the base application is functioning correctly in production, you are ready to develop the moderation feature.

## Develop the moderation feature

Now imagine your message board starts receiving spam. To address this, you want to restrict posting so that only Admins can publish directly, while regular users require approval.

This is a sensitive change: a mistake could prevent real users from posting or viewing messages. With the Neon–Vercel branching workflow, you can implement and test this feature safely against real user data, without impacting production.

### Clone the repository locally

Clone your forked repository to your local machine.

```bash
git clone <YOUR_FORKED_REPO_URL> vercel-neon-auth-branching
cd vercel-neon-auth-branching
```

### Create a feature branch

Start by creating a new git branch for your work.

```bash
git checkout -b feat/moderation-queue
```

<Admonition type="tip" title="How to test locally with real data">
You can create a branch of your production database in the **Neon Console** for local development. That lets you test changes against real data before deploying to a Vercel preview environment, which you can then share with your team.

Learn more in [Create a branch](/docs/manage/branches#create-a-branch).

**You don’t need to do this as part of this guide**, but it’s a useful feature for local testing.
</Admonition>

### Modify the database schema

The current message board schema does not support moderation. To implement this, you will add a new column `is_approved` to the `messages` table to track whether a message has been approved by an admin.

Add a new column `is_approved` to the `messages` table in `app/db/schema.ts`:

```typescript {15}
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

// ... other schema definitions ...

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  userId: uuid("user_id").references(() => authUsers.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  // default to true to allow existing messages to be shown
  isApproved: boolean("is_approved").default(true).notNull() // [!code ++]
});
```

Generate the migration file locally by running:

```bash
npx drizzle-kit generate
```

The migration file is generated in the `drizzle/migrations` folder. During deployment, Vercel automatically applies the migration to the appropriate database (production or preview branch), so you don’t need to run it manually.

<details>
<summary>How are migrations applied during build?</summary>

Before building the application, the Vercel build process needs to run the migrations.  
You can configure this by updating the `build` script in your `package.json` to run Drizzle migrations before the Next.js build:

```json
"scripts": {
  "build": "drizzle-kit migrate && next build",
  // ... other scripts ...
}
```

The current setup in the starter repository already includes this step, so no changes are needed.

</details>

### Implement role-based logic

Update `app/actions.ts` to check the user's role. If they are an admin, their messages are auto-approved; otherwise, they require approval.

```typescript
'use server';

import { db } from '@/app/db';
import { revalidatePath } from 'next/cache';
import { createAuthServer } from '@neondatabase/neon-js/auth/next/server';
import { messages } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

const authServer = createAuthServer();

export async function postMessage(formData: FormData) {
    const { data } = await authServer.getSession();
    if (!data || !data.session) throw new Error("Unauthorized");

    const isAdmin = data.user.role === 'admin';

    await db.insert(messages).values({
        content: formData.get('content') as string,
        userId: data.user.id,
        // Auto approve if admin else false
        isApproved: isAdmin
    });
    revalidatePath('/');
}

export async function approveMessage(messageId: string) {
    const { data } = await authServer.getSession();
    if (!data || data.user.role !== 'admin') throw new Error("Unauthorized");
    await db.update(messages)
        .set({ isApproved: true })
        .where(eq(messages.id, messageId));
    revalidatePath('/');
}
```

<details>

<summary>How does the role-based logic work here?</summary>

The `postMessage` function checks the user's role when they submit a message. If the user is an admin, the message is automatically approved by setting `isApproved` to `true`. For regular users, it defaults to `false`, meaning their messages require admin approval.

The `approveMessage` function is restricted to admin users only. It updates the `isApproved` status of a message to `true` when an admin approves it.

</details>

### Update the UI

Modify `app/page.tsx` to conditionally render the Moderation Queue for admins.

```tsx
import { db } from '@/app/db';
import { messages } from '@/app/db/schema';
import { postMessage, approveMessage } from './actions';
import { desc, eq, and } from 'drizzle-orm';
import { authServer } from '@/lib/auth/server';

export default async function Home() {
  const { data } = await authServer.getSession();
  const isAdmin = data?.user.role === 'admin';

  const publicMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.isApproved, true))
    .orderBy(desc(messages.createdAt));

  const pendingMessages = isAdmin
    ? await db.select().from(messages).where(eq(messages.isApproved, false))
    : [];

  const userPending = data?.session
    ? await db
      .select()
      .from(messages)
      .where(and(eq(messages.userId, data.user.id), eq(messages.isApproved, false)))
    : [];

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans text-gray-900 dark:text-gray-200">

      <header className="flex justify-between items-center mb-8 border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Community Message Board&nbsp;
          {isAdmin && <span className="text-red-500">(Admin Mode)</span>}
        </h1>
      </header>

      {data?.session && (
        <form
          action={postMessage}
          className="mb-10 bg-gray-100 dark:bg-gray-800 p-5 rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm"
        >
          <label className="block mb-3 font-medium">Post a message</label>
          <div className="flex gap-3">
            <input
              name="content"
              required
              placeholder="What's on your mind?"
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
              Post
            </button>
          </div>
        </form>
      )}

      {data?.session && userPending.length > 0 && !isAdmin && (
        <div className="mb-8 p-4 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-800 shadow-sm">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            Your message is pending admin review and will appear once approved.
          </p>
        </div>
      )}

      {isAdmin && pendingMessages.length > 0 && (
        <div className="mb-10 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-5 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-4">
            Moderation Queue
          </h2>

          <div className="space-y-3">
            {pendingMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm"
              >
                <div>
                  <p className="text-gray-900 dark:text-gray-100">{msg.content}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Posted by <span className="font-medium">{msg.userId}</span>
                  </span>
                </div>

                <form action={approveMessage.bind(null, msg.id)}>
                  <button className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition">
                    Approve
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Live Messages</h2>

      <div className="space-y-4">
        {publicMessages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow transition"
          >
            <p className="text-gray-800 dark:text-gray-200 mb-2">{msg.content}</p>

            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>
                Posted by{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {msg.userId}
                </span>
              </span>
              <span>{msg.createdAt?.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
```

<details>

<summary>How does the UI update work?</summary>

The UI checks the user's role using `data?.user.role`. If the user is an admin, it fetches and displays messages pending approval in a separate "Moderation Queue" section. Regular users see a notification if their message is pending approval.

</details>

## Test in preview deployment

Now that you have implemented the moderation feature, test it in an isolated environment using Vercel preview deployments and Neon branching.

You need to verify that the moderation flow works correctly with real user accounts, without affecting your production environment.

### Push to GitHub

Commit your changes and push the branch.

```bash
git add .
git commit -m "feat: implement moderation queue"
git push origin feat/moderation-queue
```

Navigate to your forked repository on GitHub and open a pull request (PR) from the `feat/moderation-queue` branch to `main`.

### Automated provisioning

When you open the pull request, the Neon-Vercel integration kicks in:

1.  **Neon** creates a database branch (e.g., `preview/feat-moderation...`). This branch contains a snapshot of production, **including your real users**.
2.  **Vercel** deploys the preview, injecting the connection string and `NEON_AUTH_BASE_URL` specific to that branch.
3.  **Build step:** Vercel runs `drizzle-kit migrate` as part of the build step, adding the `is_approved` column to the **preview database only**.

### Verify in the preview environment

Open the Vercel Preview URL provided in the PR comment ([see example](https://github.com/dhanushreddy291/vercel-neon-auth-branching/pull/1#issuecomment-3755610791)).

**Verify data integrity**

1.  Log in as an existing user from production.
2.  **Verify:** All previous messages from production are visible in the **Live Messages** feed.

**Test the regular user**

1.  Log in as a regular user.
2.  Post a message: "Can anyone see this?"
3.  **Verify:** The message should **not** appear in the **Live Messages** list. It's held in the pending state for moderation.

**Test the admin flow**
To test the admin functionality, you need to promote a user to `admin` role in the Neon Console for the preview branch.

1.  Go to the **Neon Console**.
2.  Use the **BRANCH** selector to select the preview branch created for your PR (e.g., `preview/feat-moderation...`).
3.  Navigate to **Auth → Users**.
4.  Find a user and change their role to `admin` by clicking the three-dot menu and selecting **Make admin**.
    ![Assign admin role in Neon Console](/docs/guides/neon_auth_make_admin_for_preview_branch.png)
    Now you have an admin user in your preview environment.
5.  Go back to the Vercel Preview URL and log in as the admin user.
6.  **Verify:** You should see the **Moderation Queue**. Click **Approve** on the message. It should move to the main feed.
    ![Approve message in Moderation Queue](/docs/guides/message_board_admin_view.png)
7.  Log out and log back in as the regular user.
8.  **Verify:** The message "Can anyone see this?" now appears to everyone.

### Verify production isolation

Go to your live Production URL.

1.  Log in as the admin user you modified in the preview branch.
2.  **Verify:** They are **still a regular user**. The role change you made in the Neon Console only affected the branch.
3.  **Verify:** The "Can anyone see this?" message **does not exist**.
4.  Production is completely unaffected.

## Merge and cleanup

When you're satisfied that the code works:

1. Merge your pull request on GitHub. Vercel deploys the new code to Production and applies the migration to the main database.
2. The integration deletes the preview database branch when Vercel removes the corresponding preview deployment, which follows [Vercel's deployment retention policy](https://vercel.com/docs/deployment-retention) (6 months by default). To clean up sooner, delete the branch manually or automate it; see [Managing Vercel preview branch cleanup](/docs/guides/vercel-branch-cleanup).

</Steps>

## Conclusion

You implemented an authorization change and tested it against real user accounts in a preview branch, using **Vercel preview deployments** and **Neon branching**, without mocking data or seeding test accounts. Production users and data stayed untouched, because changes in a preview branch stay in that branch.

### Other use cases

This guide used a simple message board, but the same approach applies to many scenarios in authentication and user management:

- **Refactoring RBAC:** Simulate new permission models against your full user base to catch edge cases before rollout.
- **Destructive flows:** Test sensitive actions like _Delete Account_ or _Cancel Subscription_ on real data in an isolated branch. If something goes wrong, discard the branch; production stays untouched.
- **Penetration testing:** Provide auditors with a dedicated branch of your production environment to run security tests (e.g., SQL injection, privilege escalation) without risking downtime or data loss.

## Resources

- [Managed Better Auth Admin API Reference](/docs/auth/guides/plugins/admin)
- [Managed Better Auth Overview](/docs/auth/overview)
- [Vercel-Managed Neon Integration](/docs/guides/vercel-managed-integration)
- [Neon branching](/branching)
- [Getting started with Managed Better Auth and Next.js](/guides/neon-auth-nextjs)
