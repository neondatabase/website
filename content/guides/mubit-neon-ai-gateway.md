---
title: 'Route an agent through Mubit to Neon AI Gateway'
subtitle: 'Deploy a template agent on Neon Functions that sends its model calls through Mubit, so recurring steps can move to small models trained on its own traffic.'
author: neon-team
enableTableOfContents: true
createdAt: '2026-11-10T00:00:00.000Z'
updatedOn: '2026-11-10T00:00:00.000Z'
---

Most of an agent's model calls repeat the same steps: reading a schema, picking a table, writing a familiar kind of query. Each of those calls goes to a frontier model, even after the agent has done the step many times.

[Mubit](https://mubit.ai) sits between your agent and the model. You change the agent's base URL and key, and Mubit records each call, groups similar calls into tasks, and trains a small model (an adapter) for a task once it has enough examples. Mubit tests each adapter version against your provider model's answers. The agent can also store lessons from runs it has checked and recall them on later runs, which Mubit calls runtime calibration.

[Neon AI Gateway](/docs/ai-gateway/overview) gives you one credential for models from many providers, billed against prepaid credits. When a Mubit project holds an AI Gateway key, Mubit forwards the agent's calls to your branch's gateway, so the agent needs no provider keys of its own.

In this guide, you'll deploy Mubit's [Neon database agent template](https://github.com/MubitLabs/mubit-neon-db-agent). It's a data analyst agent that answers business questions over a sample store in Lakebase Postgres, runs as a [Neon Function](/docs/compute/functions/overview), and sends every model call through Mubit to AI Gateway. You'll learn how to:

- Add an AI Gateway key to a Mubit project.
- Create the template's branches and seed data.
- Deploy the agent and its [schedule trigger](/docs/compute/functions/triggers/schedule).
- Verify a run so its lessons reach Mubit, then watch the agent handle a schema change.

## Prerequisites

Before you begin, make sure you have the following:

- **A Neon account with AI Gateway credits:** AI Gateway needs [prepaid credits](/docs/ai-gateway/prepaid-credits) ($5 minimum), which you can buy on any plan, including Free. Sign up at [console.neon.tech](https://console.neon.tech/signup) if you don't have an account.
- **A Mubit account:** Sign up at [app.mubit.ai](https://app.mubit.ai/). The Neon AI Gateway provider key is offered in workspaces on app.mubit.ai.
- **The latest Neon CLI, authenticated:** Functions commands change often, so upgrade before you start with `npm install -g neon@latest`.
- **Node.js 24 or later:** Download it from [nodejs.org](https://nodejs.org/).

<Admonition type="info" title="Region availability">
AI Gateway and Functions are available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Create your project in one of these regions. Support is expanding toward [all regions](/docs/introduction/regions).
</Admonition>

<Steps>

## Create a Neon project

1. In the [Neon Console](https://console.neon.tech), click **New Project**.
2. Enter a **Project name**, such as `mubit-db-agent`, and choose a **Region** that supports AI Gateway and Functions, such as AWS US East (Ohio) (`aws-us-east-2`).
3. Under **Services**, make sure **AI gateway** is enabled.
4. Click **Create project**.

![The create project dialog with the AI gateway service enabled](/docs/guides/create-neon-project-with-ai-gateway.png 'no-border')

Keep the default `neondb` database and `neondb_owner` role. The template's setup script connects with them. Copy the project ID from **Settings** for a later step.

## Get your AI Gateway credential

1. Open your project and click **Connect** at the top of the sidebar.
2. Switch to the **AI Gateway** tab, then click **Copy snippet** to copy the gateway URL and token.

![The AI Gateway tab in the Connect dialog showing the environment variables and credential controls](/docs/guides/connect-ai-gateway.png 'no-border')

## Add the credential to Mubit

In the Mubit console, an admin of your organization adds the gateway URL and token as a provider key. Under **Provider keys**, choose **Neon AI Gateway** from the **Provider** menu. Mubit's [Provider keys](https://docs.mubit.ai/admin/provider-keys#add-a-neon-key) page walks through it.

Mubit uses a project's own key for a provider before its Neon key. Keep the AI Gateway key as the project's only provider key, so the agent's OpenAI-format calls go to AI Gateway. A project takes one Neon key, so all of its calls go to one branch's gateway. See [Connect with the Neon AI Gateway](https://docs.mubit.ai/guides/connect-neon) for how Mubit routes each call.

Then create a Mubit key for the project, as shown in [step 1 of Mubit's Quickstart](https://docs.mubit.ai/quickstart#1-set-up-in-the-console). The agent sends this key to Mubit in place of a provider key.

## Clone the template

```bash filename="Terminal"
git clone https://github.com/MubitLabs/mubit-neon-db-agent.git
cd mubit-neon-db-agent
npm ci
cp .env.example .env
```

Open `.env` and set your Mubit key:

```env filename=".env"
MUBIT_API_KEY=your_mubit_key
```

The rest of `.env.example` already holds working defaults. `BASE_MODEL` is `gemini-3-8-flash`, a model AI Gateway serves, and you can change it to any chat model in the [AI Gateway catalog](/docs/ai-gateway/models). `MUBIT_SESSION_METADATA` is `off` because AI Gateway's upstream models refuse OpenAI's `metadata` field.

<Admonition type="tip" title="macOS keychain">
On macOS, you can leave `MUBIT_API_KEY` unset and store the key in the keychain item `mubit-neon-demo-key` instead. The template reads the keychain only when the variable is unset.
</Admonition>

## Create the branches and seed data

Run the setup script with your project ID:

```bash filename="Terminal"
npm run demo:prepare -- --neon --project-id <project_id> --seed 42
```

The script uses the Neon CLI to create four [branches](/docs/introduction/branching) from your default branch, which it leaves unchanged:

| Branch | Holds |
| --- | --- |
| `acme-v1` | The seeded store: 5,000 customers, 500 products and 100,000 orders over 12 months |
| `demo-v1` | A branch of `acme-v1` the agent queries |
| `demo-v2` | A branch of `acme-v1` migrated to a new schema: `gross_cents` is renamed to `subtotal_cents`, and refunds move into their own table |
| `agent-control` | The agent's runs, events and pending deliveries to Mubit |

The agent queries the demo branches as `agent_reader`, a role with `SELECT` on the store's tables and nothing else. The script writes the connection strings and a bearer token, `DEMO_ACCESS_TOKEN`, to `.env`, and keeps the values you already set.

Check the setup before you deploy:

```bash filename="Terminal"
npm run check
```

It checks the model route through Mubit, the agent's tools and JSON output, and runtime calibration.

## Deploy the Function

```bash filename="Terminal"
npm run deploy
```

The deploy builds the agent and applies `neon.ts` to the `agent-control` branch. `neon.ts` declares the `dbagent` Function, its settings from `.env`, and a schedule trigger:

```ts filename="neon.ts"
triggers: {
  "learning-deliveries": {
    type: "schedule",
    function: "dbagent",
    cron: "*/15 * * * *",
    functionPath: "/triggers/deliveries",
  },
},
```

When you mark a run correct, the agent queues its lessons and sends them to Mubit right away. If a send fails, the delivery stays pending, and the trigger retries it every 15 minutes.

The deploy prints the Function's URL when it finishes. To preview the changes first without applying them, run `npm run deploy -- --plan`.

## Ask a question and verify the answer

The `ask` and `verify` commands run the agent from your machine, with the settings in `.env`. Ask the agent a question about the v1 schema:

```bash filename="Terminal"
npm run ask -- "What was net revenue by country in August 2026?" --environment demo-v1 --mode calibration
```

The output lists each step: the model replies with their Mubit request IDs, the tables the agent looked up, and the SQL it ran. Each question gets at most 8 model turns, 12 tool calls and 45 seconds.

Mark the run correct:

```bash filename="Terminal"
npm run verify -- <run_id> --correct
```

The verdict turns the run into up to three short lessons, such as the schema mapping and the verified SQL, and sends them to Mubit. The template writes the lessons from the run's evidence; no model writes them.

Ask a related question. The agent recalls the lessons that fit its database and schema:

```bash filename="Terminal"
npm run ask -- "Which countries had the largest net revenue drop from August to September 2026?" --mode calibration
```

Now ask a question on `demo-v2`:

```bash filename="Terminal"
npm run ask -- "Compare September 2026 net revenue for repeat customers by country." --environment demo-v2 --mode calibration
```

The v1 schema mappings don't apply to the new schema, so the agent sets them aside and works out the new refunds table itself.

To run the same steps through the deployed Function's HTTP API, pass its URL to the walkthrough script:

```bash filename="Terminal"
npm run walkthrough -- <function_url>
```

</Steps>

## What happens as the agent runs

Every call carries the same instructions, tools and response format, so Mubit groups the agent's calls into one task and records them. Open **Requests** in the Mubit console to see each call and the model that answered it.

Once Mubit has enough kept examples for a task, it trains an adapter and tests each version against your provider model's answers. A version that passes can answer Chat Completions calls in place of AI Gateway, and the calls it doesn't take keep going to AI Gateway. See [Create your first adapter](https://docs.mubit.ai/guides/first-adapter) and [Calls answered by an adapter](https://docs.mubit.ai/guides/adapter-routing).

The template's evaluation calls send `x-middleware-record: metadata`, so they never become training data. To run the evaluation set of 60 questions against trusted reference SQL, see the template's [README](https://github.com/MubitLabs/mubit-neon-db-agent#evaluation).

## Resources

- [Mubit database agent template](https://github.com/MubitLabs/mubit-neon-db-agent)
- [Mubit: Connect with the Neon AI Gateway](https://docs.mubit.ai/guides/connect-neon)
- [Neon AI Gateway overview](/docs/ai-gateway/overview)
- [Neon Functions](/docs/compute/functions/overview)
- [Schedule triggers](/docs/compute/functions/triggers/schedule)

<NeedHelp/>
