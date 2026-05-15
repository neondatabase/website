---
title: 'AI-Native App Development with Stripe Projects and Neon'
subtitle: 'How AI agents can provision infrastructure and build real applications without manual setup'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-05-15T00:00:00.000Z'
updatedOn: '2026-05-15T06:36:44.402Z'
---

AI has made writing code insanely easy, but all the tiny setup tasks around it still kill your momentum.

You've likely been there: you open your laptop on a Friday night, thinking you’ll prototype a fun idea in an hour. You fire up your editor, and your AI agent is ready to write the code. But before you can actually build anything, you hit the setup wall.

First, you need a database. So you open a new tab, sign up for a provider, verify your email, click through an onboarding flow, provision a database, and copy the connection string. Then you realize you need an LLM, so you go to [OpenRouter](https://openrouter.ai) to create an account and generate an API key. Your app needs to scrape websites? Time to go to [Firecrawl](https://firecrawl.dev), sign up, and copy _another_ API key. And if you hit a rate limit and need paid access, you're pulling out your credit card and entering your details separately on every single site.

None of these tasks are difficult on their own. But together, they pile up into a wall of friction. After 45 minutes of juggling dashboards, pasting API keys into `.env` files, and wrangling accounts, you start to wonder if this side project which might not even survive tomorrow is worth the grind. You’re stuck acting as human glue, shuffling secrets between half a dozen SaaS dashboards.

Writing code got fast. Provisioning infrastructure didn’t. Until now.

This is where AI-assisted development is headed next. The future isn’t just about generating code faster; it’s about removing the drag of setup, provisioning, and service management via ClickOps altogether. To tackle this exact pain point, Stripe recently introduced [Projects.dev](https://stripe.dev/blog/production-ready-dev-stack-from-terminal).

## What is Projects.dev?

[Projects.dev](https://projects.dev) is Stripe’s new platform for AI-native development. Think of it as an agent-friendly, simplified version of Terraform with unified billing built in. It offers a CLI and a growing ecosystem of [integrations](https://projects.dev/providers/) that let you and your AI agents provision third-party services directly from the terminal, without leaving your editor.

The core idea is simple but powerful: instead of asking you to go to a provider’s dashboard, create an account, and copy API keys, Projects.dev lets your AI agent run commands that automatically provision resources on your behalf. The credentials are securely retrieved and injected directly into your local environment, so you can start building immediately.

## How does it work?

To understand how this works, you need to know about [**Agent Skills**](https://agentskills.io/home#what-are-agent-skills). Agent Skills are a standardized, open format that gives AI agents new capabilities. Instead of relying solely on an LLM’s pre-training to guess how to configure a system, you can give your agent a “skill” (essentially a set of instructions and CLI tools) that teaches it how to interact with external platforms securely.

Stripe Projects provides a CLI and an Agent Skill that standardizes how third-party services are provisioned. The catalog includes providers like Neon (for Postgres), Vercel (for hosting), OpenRouter (for AI models), and Firecrawl (for web scraping) etc.

When you give your AI agent the Stripe Projects skill, it gains the ability to run commands like `stripe projects add neon/database` to provision a Neon database, without you having to touch a single dashboard. The CLI handles the authentication, provisioning, and secure retrieval of credentials, which are then automatically synced to your local `.env` file for immediate use in your code.

The AI handles the heavy lifting; you just guide the architecture.

<Admonition type="note" title="Bring your own agent">
This guide uses **OpenCode** as the primary example because its shareable chat sessions make it easy to demonstrate the workflow. However, this approach works with any AI coding agent that supports Agent Skills (such as Cursor, Claude Code, or Windsurf). Focus on the *workflow*, not the specific agent.
</Admonition>

## What you will build

To demonstrate this, you will build an **AI-powered Travel Concierge app**. Users will enter a destination, travel dates, budget, and interests. The app will scrape recent travel data, use an LLM to generate a personalized itinerary, and save the trip to a Neon Postgres database so it can be shared via a public link.

**The Stack:**

- **Frontend and API:** Next.js
- **Database:** Neon Postgres
- **LLM Provider:** OpenRouter
- **Data Gathering:** Firecrawl
- **Deployment:** Vercel

Let's look at how you can build this entire stack without opening a single provider dashboard.

<Steps>

## Install the Stripe CLI and Projects plugin

First, you need to install the Stripe CLI and the Projects plugin.

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

When you initialize a project, Stripe Projects automatically writes the necessary Agent Skill context files and a `.projects` directory to your project. This includes the state of your provisioned resources.

The AI agent skills describe how to use the `stripe projects` CLI to provision resources. By giving your agent access to these skills, you enable it to manage your infrastructure directly from your code.

## Prompt your AI agent

Now, launch your AI coding agent in your terminal. For example, if you're using OpenCode, simply run:

```bash
opencode
```

For this guide, you will use the following prompt to instruct your agent to build the Travel Concierge app and provision the necessary infrastructure as needed (update the prompt as necessary to fit your specific app idea):

```text shouldWrap
Build an AI-powered travel concierge app using Next.js and Neon Postgres where users enter destinations, travel dates, budget, traveler count, travel style, interests, and preferences to generate personalized itineraries.

The app should:
- Use Firecrawl to gather travel information.
- Use OpenRouter for AI planning
- Store trips (for share functionality) in Neon Postgres
Make the app look modern. Do not add extra features and keep it simple as asked.
Use free tier for all the services used via stripe projects.
```

The prompt is intentionally kept high‑level. The AI agent decides on the exact architecture, provisions the necessary services, and connects everything together. Your role is simply to guide the agent with the functionality you want, while it takes care of the implementation details and provisioning behind the scenes.

## Watch the AI agent build and provision

Your AI agent begins by analyzing the prompt and determining which services are needed. From there, it leverages the Stripe Projects CLI to provision those services automatically on your behalf.

You can inspect its logs to see the exact commands executed and the reasoning behind them. While the agent’s output won’t match this guide word‑for‑word, agents are inherently non‑deterministic but the overall workflow will be similar.

### 1. Provisioning the infrastructure

Instead of asking you to go generate API keys, the agent searches the `projects.dev` catalog and executes CLI commands to provision the required services on their free tiers:

```bash
stripe projects add neon/postgres --no-interactive
stripe projects add firecrawl/api --no-interactive
stripe projects add openrouter/api --no-interactive
```

_Behind the scenes:_ Stripe Projects interacts directly with Neon, Firecrawl, and OpenRouter to provision these resources. Unlike traditional relational databases that can take minutes to spin up, Neon provisions in milliseconds, allowing the agent to iterate rapidly without waiting for infrastructure.

The CLI then securely retrieves the resulting credentials (like your `DATABASE_URL` and API keys) and writes them to a local `.projects/vault/vault.json` file, automatically syncing them to your `.env` file.

### 2. Writing the application code

With the infrastructure provisioned and the `.env` populated, the agent begins writing the actual application:

- It installs the required packages (`nextjs`, `pg`, etc.) as necessary for the application.
- It sets up the database schema for the trips.
- It writes the Next.js API routes to handle user input, interact with Firecrawl to scrape data, call OpenRouter for itinerary generation, and save the results to Neon.
- It builds a modern frontend interface.

You can explore the following OpenCode session to see the full terminal output - including the CLI commands executed and the agent’s reasoning as it built the app and provisioned the infrastructure:

[opncd.ai/share/QuK9345F](https://opncd.ai/share/QuK9345F)

From the session log, it’s clear how a single prompt was enough for the agent to orchestrate the entire development process: provisioning infrastructure, writing code, and managing credentials - all without any manual setup.

### 3. Testing locally

Once the agent finishes, you have a complete, fully configured codebase. You didn't have to copy a single connection string or manage a single dashboard.

To test it, simply run:

```bash
npm run dev
```

Open your browser, and you will see a fully functional, AI-powered travel concierge app backed by a live Neon database.

## Deploying to production

Your app is working locally, but what about getting it online? Because Vercel and Cloudflare are also part of the available providers in the Projects.dev integration catalog, your agent can deploy the app for you without any manual configuration.

For example, you can instruct your agent:

```text shouldWrap
Deploy this project to Vercel using Stripe Projects.
```

The agent will execute:

```bash
stripe projects add vercel/project
```

It will link a Vercel project, sync the environment variables (your Neon `DATABASE_URL`, OpenRouter key, etc.) securely into Vercel, and trigger a deployment.

You should see the deployment logs in your terminal, and within minutes, your app is live on the internet with zero manual setup.

The app built in this guide is available here: [travel-concierge-app.vercel.app](https://travel-concierge-app.vercel.app)

> Note: The link above relies entirely on free‑tier resources (OpenRouter, Firecrawl). Because of this, usage limits may be reached after a period of activity, which could cause the app to stop functioning until those limits reset. You can easily build this app yourself by following the steps in this guide, which will give you your own set of API keys and resources to work with.

</Steps>

## Maintenance and long-term benefits

Building an MVP without leaving your editor is an incredible experience, but the real power of this workflow becomes obvious when you look at the long-term lifecycle of your app.

### 1. Seamless upgrades with unified billing

Eventually, your weekend project might gain traction. You hit the free-tier limits on Firecrawl, you need a larger compute size in Neon, or you want to use a more expensive AI model on OpenRouter.

Normally, upgrading means logging into three different provider dashboards, entering your credit card details three separate times, and navigating three different billing UIs.

With `projects.dev`, billing is centralized. Because Stripe already handles your KYC (Know Your Customer) and payment details globally, upgrading is incredibly frictionless. First, configure your billing on Stripe by running:

```bash
stripe projects billing add
```

Once configured, you just ask your agent to upgrade the resources:

```text shouldWrap
Upgrade my Neon database and OpenRouter services to their paid tiers.
```

Stripe uses a Shared Payment Token to handle the transaction securely in the background. Your resources are upgraded instantly, and you never have to enter your credit card details on multiple sites again.

### 2. Painless credential rotation

If you accidentally commit your `.env` file to GitHub or need to cycle your credentials for security reasons, the manual process is miserable. You have to log into every platform, revoke the old keys and generate new ones, then update your local `.env` file and redeploy your app.

With this setup, replacing credentials across dozens of services is trivial. You can simply ask your AI agent to handle it:

```text shouldWrap
Rotate all the secrets used via stripe projects.dev.
```

The agent will then run the necessary commands on your behalf:

```bash
stripe projects rotate neon-postgres --no-interactive --yes
stripe projects rotate openrouter-api --no-interactive --yes
stripe projects rotate firecrawl-api --no-interactive --yes
stripe projects env --pull --no-interactive
```

The CLI rotates the key at the provider level and updates your `.env` safely.

### 3. Zero-friction experimentation

You no longer have to weigh the "cost of setup" against the value of an idea. You can spin up fully realized, full-stack applications with stateful databases, AI features, and hosting in minutes.

Because Neon is serverless and scales to zero, you can provision databases for dozens of AI side projects and forget about them. When you aren't using them, they consume zero compute. If one of those projects suddenly goes viral, Neon's autoscaling seamlessly handles the traffic spikes without requiring you to manually provision larger instances. If you abandon a project a week later, you haven't cluttered your password manager or your credit card statement with orphaned accounts.

### 4. Direct dashboard access

While CLI-driven provisioning eliminates setup friction, you are never locked out of traditional UI workflows. If you prefer to visually inspect your data or tweak configurations manually, you can still access the provider's specific dashboard at any time.

Just ask your AI agent to open the provider's dashboard, or run the command manually. For example, to seamlessly authenticate and open the Neon console, run:

```bash
stripe projects open neon
```

You will then be provided with a secure link to access the Neon dashboard without needing to enter credentials:

```text

✓ Signing into Neon dashboard...

Press Enter to open the browser or visit https://console.neon.tech/app-deeplink?token=ffcffc1fxxx
```

This securely logs you into the auto-provisioned Neon account without needing a password, dropping you right into the console where you can visually browse your tables, run ad-hoc queries in the SQL Editor and manage your database.

## Conclusion

The grind of juggling dashboards, API keys, and environment variables is finally ending. With services like OpenRouter, Firecrawl, and Neon provisioned automatically through Projects.dev, modern AI coding agents can handle the setup, billing, and integration work that used to slow developers down.

That means you can focus entirely on what you want to build, while your AI assistant takes care of the tedious how. You can use other providers in the Projects.dev catalog to add features like user authentication, payment processing, analytics, and more - all without leaving your editor. Checkout the [Resources](#resources) section below for links to all the providers currently available.

## Resources

- [Projects.dev Provider Directory](https://projects.dev/providers)
- [Stripe Projects CLI Documentation](https://docs.stripe.com/cli)
- [Neon Postgres](/docs/introduction/about)
- [OpenCode](https://opencode.ai/)
- [Agent Skills](https://github.com/agentskills/agentskills)

<NeedHelp />
