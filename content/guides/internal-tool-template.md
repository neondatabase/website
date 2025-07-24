---
title: Building Internal Tools Using Neon, StackAuth, and Vercel’s Free Plans
subtitle: Get secure, host, and deploy internal tools in minutes, for free
author: sam-harri
enableTableOfContents: true
createdAt: '2025-07-08T00:00:00.000Z'
---

Almost every tech company, from small startups to Fortune 500 enterprises, relies on internal tools. Larger organizations often have dedicated services and structured procedures in place, but for many others, internal tools can be messy, often ending up as either insecure setups hosted behind a VPN or overly complex solutions cobbled together from a surprising number of AWS services.

It shouldn't feel like you're managing a full-fledged production application or rack up monthly bills for basic functionalities, especially without compromising on security.

[This template](https://github.com/sam-harri/internal_tooling_neon_stack), built with Neon, StackAuth, and Vercel’s free plans, gives you a secure and scalable starting point for internal tools. It comes preconfigured with a Postgres database, API routes, authentication, authorization, and a built-in admin panel - everything you need to get an application running in minutes.

![Tool Overview](/guides/images/internal-tool-template/internal-tool-template.gif)

## Getting Started with the Template

Using the template, you can get your internal tool up and running in minutes, and all you need are Neon, Stack Auth, and Vercel accounts.

```bash
git clone https://github.com/sam-harri/internal_tooling_neon_stack.git
```

Then open that new project in your editor of choice, and install the dependencies:

```bash
npm install
```

Next, set up the environment variables by copying over the `.env.example` to a new `.env` file. Fill these in with the connection string from your Neon database project in the console, and the Stack Auth keys from the Auth tab.

Since the template comes with some admin logic already, you’ll need to sync your database by applying the schema:

```bash
npx drizzle-kit push
```

## Set Up Roles and Claim Your Project

Head to the Auth tab in the Neon console and claim the project with your Stack Auth account. From there, create two project roles: `admin` and `user`, where `user` is contained within `admin`.

Your Project Permissions section should look like this afterward:

![Project Permissions settings in the Neon Console Auth tab](/guides/images/internal-tool-template/project-permissions.png)

Once that’s done, boot up the project locally, log in, and head over to `/setup` to claim your admin privileges. You can then deploy your app with Vercel. Don’t forget to add your Vercel-provided domain to the allowed domains in Neon’s Auth tab, or your custom domain if you're using one.

## Authentication and Access Control with StackAuth

You obviously don't want just anyone to be able to access your internal tools. Luckily, Neon comes with an auth solution supporting social and password sign-on, role-based access control, and much more.

In this template, only authorized users can access the tools. The application admin can whitelist domains, allowing anyone with an email from a specific domain (e.g. `yourcompany.tld`) and a verified email to sign up and get access.

Likewise, you can grant and revoke access to specific external email addresses, perfect for contractors or partners. Emails can also be explicitly blocked even if their domain is whitelisted. Managing access is straightforward via the built-in admin panel at `/tools/admin`. Admins can assign or revoke privileges to other users, giving you complete control over your application's access policies.

These rules are meant to cover most of the common scenarios you might face, but since it’s a template, you can easily update it to add features like regex validation or subdomain whitelisting.

![Admin Panel Overview](/guides/images/internal-tool-template/admin-page.png)

## Database and Logic with Neon and Next.js

Internal tools inherently require business logic and data storage. Neon provides a free serverless Postgres database, along with all the most popular Postgres extensions, and offers a serverless database driver that’s perfect for single-shot queries in Next.js serverless functions.

For business logic, you can use Next’s server actions and API routes without the overhead of managing and deploying a separate API—ideal for simple internal tools. Vercel makes hosting your Next.js app painless, even allowing you to attach a custom domain so that you can host it at something like `yourtool.yourcompany.tld`.

## Customize the App for Your Team

Customization is designed to be simple. Just fill out your company-specific details in `config/app.ts`, then add your custom tools to the `app/tools` directory and declare them within the configuration file.

To get started, play around with `app/tools/tool1/page.tsx`.

## Get Started

[Clone the template](https://github.com/sam-harri/internal_tooling_neon_stack), connect your Neon and StackAuth accounts, and deploy to Vercel. Your next internal tool is just a few commands away!
