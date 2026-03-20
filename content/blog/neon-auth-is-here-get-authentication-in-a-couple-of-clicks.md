---
title: 'Neon Auth is Here: Get Authentication in a Couple of Clicks'
description: Spin up authentication fast while avoiding lock-in
excerpt: >-
  We’re excited to announce Neon Auth, a fully managed authentication solution
  tightly integrated into the Neon platform. It now takes seconds to provision
  an auth solution directly from the Neon console; once set up, your user
  profiles automatically sync to your database. The best...
date: '2025-02-20T17:35:57'
updatedOn: '2025-02-20T17:52:37'
category: company
categories:
  - company
authors:
  - brian-holt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'Neon Auth is Here: Get Authentication in a Couple of Clicks - Neon'
  description: >-
    Neon Auth is a fully managed authentication solution tightly integrated into
    the Neon platform. Provision auth directly from the console.
  keywords: []
  noindex: false
  ogTitle: 'Neon Auth is Here: Get Authentication in a Couple of Clicks - Neon'
  ogDescription: >-
    Neon Auth is a fully managed authentication solution tightly integrated into
    the Neon platform. Provision auth directly from the console.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/social.png
source:
  wpId: 8547
  wpSlug: neon-auth-is-here-get-authentication-in-a-couple-of-clicks
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/neon-neon-auth-1-1024x576-e09dcd5f.jpg)

**We’re excited to announce** [Neon Auth](https://neon.tech/docs/guides/neon-auth)**, a fully managed authentication solution tightly integrated into the Neon platform.** It now takes seconds to provision an auth solution directly from the Neon console; once set up, your user profiles automatically sync to your database.

**The best part: if you ever decide to move away from Neon, you can transfer ownership of your managed auth configuration to an external account just as easily as you set it up.** And if you ever decide to change auth providers, all your auth data lives in your database, which makes any migration much easier.

<video controls width="1708" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/neon-auth-f9bcc01e.mp4" />
</video>

## Authentication in seconds, with full portability

Behind the scenes, Neon Auth works as an automated provisioning and synchronization layer between an authentication provider ([Stack Auth](https://stack-auth.com), an open-source auth provider) and your Neon database. Because it’s fully managed by Neon, it keeps user profiles in sync automatically without requiring any extra code, background jobs, or webhooks.

<Admonition type="comingSoon" title="Coming soon">
Stack Auth is only the start. We're working with other authentication providers, such as [Clerk](https://clerk.com), in order to have a larger offering on our platform soon. Stay tuned!
</Admonition>

To set it up for your project, simply open the Auth section in the [Neon console](https://console.neon.tech/signup) and click Setup Stack Auth:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/ad4nxfhodnmbqerf3g7calgzws27bl4koajmdx6qh1bwccymeyqsu3095y2jec7xzvwh-slkqtux4fhdurjp-nw1obwuhglfsddp1xjsatddjbvvaqn6exuhndic5g3p75hnvrlucda-176e09db.png)

This _managed layer_ approach **prevents vendor lock-in**:

- When you click “Setup Stack Auth”, a Stack Auth project is automatically provisioned for you.
- You can claim ownership of this project at any time by clicking “Transfer ownership”, and it will be moved to your Stack Auth account. And the best part is that the user synchronization feature will continue to work.

That means you’ll always retain full control over your authentication layer—even if your deployment changes in the future.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/ad4nxc39xbfg0-pho-vcep4m1ogkhnqlhvoq68vsmuimclpuzadxoeuwaun06qfu984vxwmagpavcl5kb2e69ufc8qzbtar7ezrygiiajurg-xiqhl5jl9octzjt3xf8q2fy4-eoq-c655ae7c.png)

If you’re already a Stack Auth user or if you need additional customization (like choosing a custom project name), you can also use the “Manual setup” option. During this process, you’ll simply select the Stack Auth project you want to integrate with Neon Auth. Once connected, Neon will keep your user data synchronized automatically.

## Before Neon Auth

Let’s now dig a little deeper into why we’ve built Neon Auth.

Imagine you’re building a SaaS application that allows teams to collaborate on projects. Users sign up and authenticate through an external authentication provider. Your Postgres database stores projects, tasks, and user permissions, with a data model that looks something like this:

- `users` table: Stores user information (`id`, `email`, `name`, etc.)
- `projects` table: Stores project details (`id`, `name`, `created_by`)
- `user_roles` table: Defines user permissions (`user_id`, `project_id`, `role`)

Once you ship your application, what needs to stay in sync between your authentication provider and the Postgres database?

- User creation. When a new user signs up, their profile should be available in Postgres.
- User updates. If a user changes their email or display name in the auth provider, the update should reflect in the database.
- User deletion. If a user is deleted or disabled in the auth provider, access should be revoked immediately.
- Role changes. If the auth provider manages user roles (e.g., team owner, editor, viewer), those permissions must sync with the database.

You would typically handle this sync manually using one of:

- Webhook listeners (listening for changes from the authentication provider)
- Background jobs (running periodic tasks to fetch and update user data)
- API calls on every login (querying the auth provider when a user logs in to ensure data is fresh)

This is a lot of extra work. Not only do you have to manage authentication and Postgres separately, but you also have to:

- Write and maintain sync logic
- Handle API failures and rate limits: If the auth provider’s API is slow or temporarily down, your user sync breaks

## After Neon Auth

Neon Auth removes this complexity:

1. It manages authentication for you, provisioning a fully configured auth provider (via Stack Auth for now) in just a couple of clicks
2. It exposes user data as a standard Postgres table (`neon_auth.users_sync`), keeping it continuously in sync with the auth provider (this prevents lock-in)

Now, instead of managing custom sync logic, you can just query your database like any other table:

```sql
SELECT * FROM neon_auth.users_sync;
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks/screenshot-2025-02-20-at-85154percente2percent80percentafam-1024x418-592bb4be.png)

## How is this helpful?

Since your auth data is in your Neon database, you can easily reference it with JOINs. This data can also be really useful for building admin consoles and dashboards, and for cron scripts which are easier to hook up to Postgres than to your auth provider’s REST API.

With Neon Auth, authentication and user data management are simplified. No more custom sync scripts. No more webhooks. Just SQL.

## Ensuring fresh user data

Neon Auth synchronizes user profiles from the underlying authentication provider to your Postgres database asynchronously: updates happen with a short delay (should be sub-second in the vast majority of instances), so there is a very brief window where a newly authenticated user may not yet exist in the `neon_auth.users_sync` table. How to handle this?

It’s simple: Use `LEFT JOIN` instead of `INNER JOIN` for queries that depend on user data.

```sql
SELECT todos.*, neon_auth.users_sync.name
FROM todos
LEFT JOIN neon_auth.users_sync ON todos.user_id = neon_auth.users_sync.id
WHERE neon_auth.users_sync.deleted_at IS NULL;
```

Using `LEFT JOIN` ensures the main query still executes, even if the user record hasn’t arrived yet. Once the user profile is synced, the `name` column will automatically populate.

## Get started

[Auth](https://neon.tech/docs/guides/neon-auth) is available to all Neon users, **currently in Beta**. Check out our documentation for details, and [jump into to the console](https://v/) to set it up.

---

_Not yet a Neon user? Sign up for our Fee Plan_ [here](https://console.neon.tech/signup)_._
