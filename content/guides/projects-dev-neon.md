---
title: 'AI-native app development with Stripe Projects and Neon'
subtitle: 'How AI agents can provision infrastructure and build real applications without manual setup'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-05-15T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

AI has made writing code easy, but the setup tasks around it still kill your momentum.

You've likely been there: you open your laptop on a Friday night, thinking you’ll prototype a fun idea in an hour. You fire up your editor, and your AI agent is ready to write the code. But before you can actually build anything, you hit the setup wall.

First, you need a database. So you open a new tab, sign up for a provider, verify your email, click through an onboarding flow, provision a database, and copy the connection string. Then you realize you need an LLM, so you go to [OpenRouter](https://openrouter.ai) to create an account and generate an API key. Your app needs to scrape websites? Time to go to [Firecrawl](https://firecrawl.dev), sign up, and copy _another_ API key. And if you hit a rate limit and need paid access, you're entering your credit card details separately on every site.

None of these tasks is difficult on its own, but together they add up. After 45 minutes of juggling dashboards, pasting API keys into `.env` files, and wrangling accounts, you start to wonder if a side project that might not survive tomorrow is worth it. You're stuck shuffling secrets between half a dozen SaaS dashboards.

Writing code got fast. Provisioning infrastructure didn't. Stripe introduced [Projects.dev](https://stripe.dev/blog/production-ready-dev-stack-from-terminal) to remove that setup and provisioning work.

## What is Projects.dev?

[Projects.dev](https://projects.dev) is Stripe's tool for provisioning third-party services from the terminal. Think of it as an agent-friendly, simplified version of Terraform with a single bill built in. It offers a CLI and a growing ecosystem of [integrations](https://projects.dev/providers/) that let you and your AI agents provision third-party services directly from the terminal, without leaving your editor.

Instead of going to a provider's dashboard, creating an account, and copying API keys, your AI agent runs commands that provision resources on your behalf. The CLI retrieves the credentials and writes them into your local environment.

## How does it work?

To understand how this works, you need to know about [**Agent Skills**](https://agentskills.io/home#what-are-agent-skills). Agent Skills are an open format for giving AI agents new capabilities. Instead of relying on an LLM's pre-training to guess how to configure a system, you give your agent a "skill" (a set of instructions and CLI tools) that teaches it how to work with an external service.

Stripe Projects provides a CLI and an Agent Skill that standardizes how third-party services are provisioned. The catalog includes providers like Neon (for Postgres), Vercel (for hosting), OpenRouter (for AI models), and Firecrawl (for web scraping).

With the Stripe Projects skill, your AI agent can run commands like `stripe projects add neon/postgres` to provision a database on Neon without you opening a dashboard. The CLI handles authentication, provisioning, and credential retrieval, then syncs the credentials to your local `.env` file.

<Admonition type="note" title="Bring your own agent">
This guide uses **OpenCode** as the primary example because its shareable chat sessions make it easy to demonstrate the workflow. The same approach works with any AI coding agent that supports Agent Skills, such as Cursor, Claude Code, or Windsurf.
</Admonition>

## What you'll build

You'll build an **AI travel concierge app**. Users will enter a destination, travel dates, budget, and interests. The app will scrape recent travel data, use an LLM to generate a personalized itinerary, and save the trip to a Lakebase Postgres database so it can be shared via a public link.

**The stack:**

- **Frontend and API:** Next.js
- **Database:** Lakebase Postgres
- **LLM provider:** OpenRouter
- **Data gathering:** Firecrawl
- **Deployment:** Vercel

You'll build this stack without opening a provider dashboard.

<Steps>

## Install the Stripe CLI and Projects plugin

Install the Stripe CLI by following the instructions in the [official Stripe documentation](https://docs.stripe.com/stripe-cli/install#install).

After installing the Stripe CLI, run the following command to install the Projects plugin:

```bash
stripe plugin install projects
```

Authenticate your Stripe CLI if you haven't already:

```bash
stripe login
```

## Initialize your workspace

Create a new directory for your app and navigate into it:

```bash
mkdir travel-concierge && cd travel-concierge
```

Then, initialize a new Stripe Projects workspace:

```bash
stripe projects init
```

When you initialize a project, Stripe Projects writes Agent Skill context files and a `.projects` directory, which holds the state of your provisioned resources, to your project.

The skills describe how to use the `stripe projects` CLI to provision resources, so your agent can manage your infrastructure from your project directory.

## Prompt your AI agent

Launch your AI coding agent in your terminal. For example, if you're using OpenCode, run:

```bash
opencode
```

This guide uses the following prompt to instruct your agent to build the travel concierge app and provision the necessary infrastructure as needed (update the prompt as necessary to fit your specific app idea):

```text shouldWrap
Build an AI-powered travel concierge app using Next.js and Neon Postgres where users enter destinations, travel dates, budget, traveler count, travel style, interests, and preferences to generate personalized itineraries.

The app should:
- Use Firecrawl to gather travel information.
- Use OpenRouter for AI planning
- Store trips (for share functionality) in Neon Postgres
Make the app look modern. Do not add extra features and keep it simple as asked.
Use free tier for all the services used via stripe projects.
```

The prompt is intentionally high-level. The agent decides on the architecture, provisions the services, and connects everything. You describe the functionality you want, and it handles the implementation details and provisioning.

## Watch the AI agent build and provision

Your AI agent begins by analyzing the prompt and determining which services are needed. Then it uses the Stripe Projects CLI to provision those services on your behalf.

You can inspect its logs to see the exact commands executed and the reasoning behind them. Agents are non-deterministic, so your output won't match this guide word for word, but the overall workflow will be similar.

### 1. Provision the infrastructure

Instead of asking you to generate API keys, the agent searches the `projects.dev` catalog and runs CLI commands to provision the required services on their free plans:

```bash
stripe projects add neon/postgres --no-interactive
stripe projects add firecrawl/api --no-interactive
stripe projects add openrouter/api --no-interactive
```

_Behind the scenes:_ Stripe Projects calls Neon, Firecrawl, and OpenRouter directly to provision these resources. Traditional databases can take minutes to spin up; a Neon project comes up in under a second, so the agent doesn't wait on infrastructure.

The CLI then retrieves the resulting credentials (like your `DATABASE_URL` and API keys) and writes them to a local `.projects/vault/vault.json` file, syncing them to your `.env` file.

### 2. Write the application code

With the infrastructure provisioned and the `.env` populated, the agent writes the application:

- It installs the required packages (`next`, `pg`, and others).
- It sets up the database schema for the trips.
- It writes the Next.js API routes to handle user input, interact with Firecrawl to scrape data, call OpenRouter for itinerary generation, and save the results to Neon.
- It builds the frontend.

You can explore the following OpenCode session to see the full terminal output, including the CLI commands executed and the agent’s reasoning as it built the app and provisioned the infrastructure:

[opncd.ai/share/QuK9345F](https://opncd.ai/share/QuK9345F)

The session log shows a single prompt driving the whole process: provisioning infrastructure, writing code, and managing credentials, with no manual setup.

### 3. Test locally

When the agent finishes, you have a configured codebase, and you didn't copy a connection string or open a dashboard.

To test it, run:

```bash
npm run dev
```

Open your browser to see the travel concierge app, backed by a live database on Neon.

## Deploy to production

Vercel and Cloudflare are also providers in the Projects.dev catalog, so your agent can deploy the app for you.

For example, you can instruct your agent:

```text shouldWrap
Deploy this project to Vercel using Stripe Projects.
```

The agent will execute:

```bash
stripe projects add vercel/project
```

It links a Vercel project, syncs the environment variables (your Neon `DATABASE_URL`, OpenRouter key, and so on) into Vercel, and triggers a deployment.

The deployment logs appear in your terminal, and within minutes your app is live.

The app built in this guide is available here: [travel-concierge-app.vercel.app](https://travel-concierge-app.vercel.app)

> Note: The app above runs on free resources (OpenRouter, Firecrawl), so it may stop working when usage limits are reached, until those limits reset. You can build this app yourself by following the steps in this guide, which will give you your own set of API keys and resources to work with.

</Steps>

## Maintenance

This workflow also helps after the first build, as your app changes over time.

### 1. Upgrades with a single bill

Eventually, your weekend project might gain traction. You hit the free limits on Firecrawl, you need a larger compute size in Neon, or you want to use a more expensive AI model on OpenRouter.

Normally, upgrading means logging into three different provider dashboards, entering your credit card details three separate times, and navigating three different billing UIs.

With `projects.dev`, billing is centralized. Stripe already holds your KYC (Know Your Customer) and payment details, so upgrading takes a single command. First, configure your billing on Stripe by running:

```bash
stripe projects billing add
```

Then ask your agent to upgrade the resources:

```text shouldWrap
Upgrade my Neon database and OpenRouter services to their paid tiers.
```

Stripe uses a Shared Payment Token to handle the transaction in the background. Your resources are upgraded, and you don't enter your credit card details on each provider's site.

### 2. Credential rotation

If you accidentally commit your `.env` file to GitHub or need to rotate your credentials, the manual process is slow. You have to log into every platform, revoke the old keys and generate new ones, then update your local `.env` file and redeploy your app.

With this setup, you can ask your AI agent to rotate credentials across services:

```text shouldWrap
Rotate all the secrets used via stripe projects.dev.
```

The agent runs the commands on your behalf:

```bash
stripe projects rotate neon-postgres --no-interactive --yes
stripe projects rotate openrouter-api --no-interactive --yes
stripe projects rotate firecrawl-api --no-interactive --yes
stripe projects env --pull --no-interactive
```

The CLI rotates the key at the provider level and updates your `.env`.

### 3. Cheap experimentation

Setup cost no longer weighs against the value of an idea. You can spin up full-stack apps with databases, AI features, and hosting in minutes.

Lakebase Postgres computes scale to zero when idle, so databases for side projects you aren't using don't bill for compute; you pay only for their storage. If one of those projects gets traffic, autoscaling adds compute without you provisioning larger instances. If you abandon a project a week later, you haven't cluttered your password manager or your credit card statement with orphaned accounts.

### 4. Direct dashboard access

You can still use each provider's dashboard to inspect your data or change configuration.

Ask your AI agent to open the provider's dashboard, or run the command yourself. For example, to authenticate and open the Neon console, run:

```bash
stripe projects open neon
```

You get a link that opens the Neon Console without entering credentials:

```text

✓ Signing into Neon dashboard...

Press Enter to open the browser or visit https://console.neon.tech/app-deeplink?token=ffcffc1fxxx
```

The link logs you into the auto-provisioned Neon account without a password, so you can browse your tables, run ad hoc queries in the SQL Editor, and manage your database.

## Conclusion

You built and deployed a travel concierge app with Neon, OpenRouter, Firecrawl, and Vercel, all provisioned by an AI agent through Projects.dev. To add features like authentication, payments, or analytics, browse the other providers in the [Projects.dev provider directory](https://projects.dev/providers).

## Resources

- [Projects.dev provider directory](https://projects.dev/providers)
- [Stripe Projects CLI documentation](https://docs.stripe.com/cli)
- [Neon documentation](/docs/introduction)
- [OpenCode](https://opencode.ai/)
- [Agent Skills](https://github.com/agentskills/agentskills)

<NeedHelp />
