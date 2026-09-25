---
title: Building internal tools using Neon, Stack Auth, and Vercel’s free plans
subtitle: Secure, host, and deploy internal tools in minutes on free plans
author: sam-harri
enableTableOfContents: true
createdAt: '2025-07-08T00:00:00.000Z'
---

<Admonition type="important" title="This template uses legacy Neon Auth">
This template is built on legacy Neon Auth (Stack Auth), which no longer accepts new users. Existing legacy users can keep using it. For new projects, use [Managed Better Auth](/docs/auth/overview), and see [Migrate to Managed Better Auth](/docs/auth/migrate/from-legacy-auth) for the code differences.
</Admonition>

Almost every tech company, from small startups to Fortune 500 enterprises, relies on internal tools. Larger organizations often have dedicated services and structured procedures in place, but for many others, internal tools can be messy, often ending up as either insecure setups hosted behind a VPN or overly complex setups cobbled together from a surprising number of AWS services.

An internal tool shouldn't need the upkeep of a full production application or rack up monthly bills for basic features, and it still needs to be secure.

[This template](https://github.com/sam-harri/internal_tooling_neon_stack), built with Neon, Stack Auth, and Vercel’s free plans, gives you a starting point for internal tools. It comes preconfigured with a Postgres database, API routes, authentication, authorization, and a built-in admin panel, so you can get an application running in minutes.

![Tool Overview](/guides/images/internal-tool-template/internal-tool-template.gif)

## Getting started with the template

Using the template, you can get your internal tool up and running in minutes, and all you need are Neon, Stack Auth, and Vercel accounts.

```bash
git clone https://github.com/sam-harri/internal_tooling_neon_stack.git
```

Then open that new project in your editor of choice, and install the dependencies:

```bash
npm install
```

Next, set up the environment variables by copying over the `.env.example` to a new `.env` file. Fill these in with the connection string from your Neon project in the Neon Console, and the Stack Auth keys from the Auth tab.

Since the template comes with some admin logic already, you’ll need to sync your database by applying the schema:

```bash
npx drizzle-kit push
```

## Set up roles and claim your project

Head to the Auth tab in the Neon Console and claim the project with your Stack Auth account. From there, create two project roles: `admin` and `user`, where `user` is contained within `admin`.

Your Project Permissions section should look like this afterward:

![Project Permissions settings in the Neon Console Auth tab](/guides/images/internal-tool-template/project-permissions.png)

Once that’s done, boot up the project locally, log in, and head over to `/setup` to claim your admin privileges. You can then deploy your app with Vercel. Don’t forget to add your Vercel-provided domain to the allowed domains in Neon’s Auth tab, or your custom domain if you're using one.

## Authentication and access control with Stack Auth

You don't want just anyone to be able to access your internal tools. Legacy Neon Auth (Stack Auth) supports social and password sign-in and role-based access control.

In this template, only authorized users can access the tools. The application admin can whitelist domains, allowing anyone with an email from a specific domain (e.g. `yourcompany.tld`) and a verified email to sign up and get access.

Likewise, you can grant and revoke access to specific external email addresses, which is useful for contractors or partners. Emails can also be explicitly blocked even if their domain is whitelisted. You manage access in the built-in admin panel at `/tools/admin`, where admins can assign or revoke privileges for other users.

These rules are meant to cover most of the common scenarios you might face, but since it’s a template, you can update it to add features like regex validation or subdomain whitelisting.

![Admin Panel Overview](/guides/images/internal-tool-template/admin-page.png)

## Database and logic with Neon and Next.js

Internal tools need business logic and data storage. The Neon Free plan includes a Lakebase Postgres database with support for popular Postgres extensions, and the [Neon serverless driver](/docs/serverless/serverless-driver) suits single-shot queries from Next.js serverless functions.

For business logic, you can use Next’s server actions and API routes without managing and deploying a separate API, which is enough for simple internal tools. Vercel hosts the Next.js app and lets you attach a custom domain, so you can serve it at something like `yourtool.yourcompany.tld`.

## Customize the app for your team

To customize the template, fill out your company-specific details in `config/app.ts`, then add your custom tools to the `app/tools` directory and declare them within the configuration file.

To get started, play around with `app/tools/tool1/page.tsx`.

## Get started

[Clone the template](https://github.com/sam-harri/internal_tooling_neon_stack), connect your Neon and Stack Auth accounts, and deploy to Vercel. Your next internal tool is a few commands away.
