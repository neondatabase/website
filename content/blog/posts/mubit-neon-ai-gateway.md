---
title: "Mubit + Neon AI Gateway: an agent that cuts its own frontier-model tokens by 73%"
description: >-
  An agent on Neon Functions, Lakebase Postgres, and AI Gateway that hands its
  routine steps to a small model tuned on its own traffic
excerpt: >-
  Mubit is middleware for AI agents. It sits between your agent and the model
  with a one-line endpoint change, learns from every call, and moves recurring
  steps to small models tuned on your own traffic, while the frontier model
  keeps the hard ones. There's nothing extra to host...
date: "2026-11-12T09:00:00"
updatedOn: "2026-11-12T09:00:00"
category: community
categories:
  - community
  - product
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/mubit-neon-ai-gateway/cover.jpg
  alt: Mubit and Neon AI Gateway
isFeatured: false
draft: false
seo:
  title: "Mubit + Neon AI Gateway: an agent that cuts its own frontier-model tokens by 73% - Neon"
  description: >-
    Mubit sits between your agent and Neon AI Gateway, learns from every call,
    and moves routine steps to a small model tuned on your own traffic. In the
    example workload, that cut gpt-5.5 tokens by 73%.
  keywords: []
  noindex: false
  ogTitle: "Mubit + Neon AI Gateway: an agent that cuts its own frontier-model tokens by 73% - Neon"
  ogDescription: >-
    Mubit sits between your agent and Neon AI Gateway, learns from every call,
    and moves routine steps to a small model tuned on your own traffic. In the
    example workload, that cut gpt-5.5 tokens by 73%.
  image: https://cdn.neonapi.io/public/images/pages/blog/mubit-neon-ai-gateway/social.png
---

## The agent runs on Neon Functions, Lakebase Postgres, and AI Gateway, and hands its routine steps to a small model tuned on its own traffic

[Mubit](https://mubit.ai/) is middleware for AI agents. It sits between your agent and the model with a one-line endpoint change, learns from every call, and moves recurring steps to small models tuned on your own traffic, while the frontier model keeps the hard ones. There's nothing extra to host.

To show how that works with Neon, they built a [template](https://github.com/MubitLabs/mubit-neon-db-agent) for cutting frontier-model token spend - an agent on [Neon Functions](https://neon.com/docs/compute/functions/overview) and [Lakebase Postgres](https://neon.com/docs/introduction/architecture-overview) that sends every model call through Mubit to [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview). The example workload is a data analyst agent that answers business questions over Postgres, but the setup applies to any agent on Neon that calls frontier models through AI Gateway:

[https://github.com/MubitLabs/mubit-neon-db-agent](https://github.com/MubitLabs/mubit-neon-db-agent)

Once Mubit has tuned a small model for the routine steps, it serves them itself, and lessons from verified runs help the agent avoid repeating mistakes. **In the example workload, using Mubit cut the agent's gpt-5.5 tokens by 73% and made it 40% faster, without losing accuracy.**

<video autoPlay muted loop playsInline width="708" height="413" aria-label="Data analyst agent architecture">
<source src="https://cdn.neonapi.io/public/images/pages/blog/mubit-neon-ai-gateway/data-analyst-agent.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/mubit-neon-ai-gateway/data-analyst-agent.mp4" type="video/mp4" />
</video>

> "Neon gives agents a database and a model endpoint in one place. Mubit sits in between and learns from every call, so an agent on Neon gets cheaper and more reliable the more it runs" — Anil Peri, CEO at Mubit

> "We built AI Gateway so agents on Neon can call frontier models through one endpoint. Mubit is a good example of what you can put in front of it. The agent passes the repetitive stuff to small models, and when your schema changes, it drops what's out of date and figures out the new tables on its own" — Bryan Clark, Product Lead at Databricks

## Where agents spend their tokens

Teams often build an agent on a frontier model and send every call to it. That's quite inefficient token-wise - cost and latency grow with every step, and a lot of those steps are routine - you end up paying frontier prices for work that doesn't need a frontier model.

Mubit measured this with the [template's example agent.](https://github.com/MubitLabs/mubit-neon-db-agent) On their benchmark, gpt-5.5 alone needed about 10 model calls, 21.7k gpt-5.5 input tokens, and 26 seconds to answer one question. Most of those calls were mechanical, like listing tables, reading table definitions, and writing up an answer the query had already found. Only the SQL steps actually needed the frontier model.

<video autoPlay muted loop playsInline width="708" height="357" aria-label="Agent calls that require a frontier model">
<source src="https://cdn.neonapi.io/public/images/pages/blog/mubit-neon-ai-gateway/where-frontier-model.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/mubit-neon-ai-gateway/where-frontier-model.mp4" type="video/mp4" />
</video>

Agents also don't remember what they've learned. Each question starts a fresh conversation, so the agent works out the schema again from scratch and can repeat a mistake it made an hour ago, like joining refunds to orders before adding them up.

A schema change makes this worse. In the [template's demo data](https://github.com/MubitLabs/mubit-neon-db-agent), a migration moves refunds into their own table - the agent has to rediscover how revenue works, and any notes written for the old schema now point at columns that no longer exist. In Mubit's benchmark, which also includes a schema change, gpt-5.5 alone got only 7 of 30 runs right on the changed schema.

## Plugging Mubit into Neon AI Gateway

[Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) gives a Neon project one OpenAI-compatible endpoint for models from many providers, billed to the Neon account. Mubit sits between the agent and that endpoint.

As a human developer, you would store your AI Gateway token in a Mubit project once, as that project's only provider key. The agent then keeps its OpenAI SDK and changes two settings:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.MUBIT_API_KEY,
  baseURL: "https://api.mubit.ai/openai/v1",
});
```

From then on, until a tuned model takes over a step, every call goes through Mubit to Neon AI Gateway and back unchanged. Mubit records a copy after the answer is sent, so recording doesn't add latency. This is the part you can apply to any agent on Neon that calls frontier models through AI Gateway.

## Making the agent cheaper and smarter as it runs

Mubit solves the above by doing two things for an agent: it moves routine steps to a small tuned model, and it helps the agent remember what worked.

To illustrate how things work, take the [template's example agent](https://github.com/MubitLabs/mubit-neon-db-agent) and imagine we ask it this question: "What was net revenue by country in August 2026?"

### Moving routine steps to a small model

To answer that question with gpt-5.5 alone, the agent makes about 10 model calls. It lists tables, reads a few table definitions, writes and runs SQL, and writes up the answer. Mubit records each call and groups calls with the same instructions, tools, and output format into one task. The template's agent always uses the same instructions and tools, so every question it answers adds examples to the same task.

Once the task has at least 25 good replies, plus enough for an exam, Mubit trains a small open-weight model on them. The median training job takes about 7 minutes. Before the tuned model serves anything, it has to pass an exam built from the task's own traffic. Mubit holds back whole conversations, never trains on them, and checks the tuned model's replies against gpt-5.5's.

Even after passing, the tuned model earns live traffic in stages:

1. Shadow: it answers copies of live calls, graded against gpt-5.5's replies
2. Canary: it serves a share of real calls
3. Promoted: it takes over once it has proved no worse than the version it replaces

After promotion, Mubit keeps checking a sample of calls against gpt-5.5. If quality drops, the tuned model is demoted and calls go back to AI Gateway. The first tuned version is usually ready 15 to 30 minutes after the task collects its 25th good reply.

In the template's agent, the tuned model takes the routine steps: listing tables, reading table definitions, and writing up the answer.

gpt-5.5 still writes every SQL query, and that's by design: Mubit only hands over steps the small model has proven it can do. In Mubit's tests, the tuned model matched gpt-5.5 every time on listing tables and on the final answer, but its own SQL got the same result only 8 to 10% of the time, so SQL stays with the frontier model. Open models from 4B to 32B, running the whole agent, solved at most 30% of the questions, against 60% for gpt-5.5.

### Remembering what worked

Going back to our "what was net revenue by country in August 2026?" question - say a reviewer marks the answer as correct. The template derives up to three short lessons from that run, and Mubit stores them:

1. the schema mapping it used
2. the verified SQL
3. a pitfall the SQL hit, such as adding up refunds before joining them to orders.

The next related question (e.g. "which countries had the largest revenue drop from August to September?") can recall those lessons within seconds.

Each lesson is tied to the schema version it came from. After the migration moves refunds into their own table, the old mappings are set aside, and the agent works out the new schema itself instead of following outdated notes. That's where lessons pay off most, as the results below show.

## The numbers

To demo this effect, Mubit ran the template's agent on 20 questions from [CL-bench](https://github.com/pgasawa/continual-learning-bench), a benchmark for agents that learn over time, three times each, with the benchmark's data loaded into Neon branches before and after its schema change. The results:

| Setup | Accuracy | gpt-5.5 input tokens per question | gpt-5.5 cost (60 runs) | Time per question |
| --- | --- | --- | --- | --- |
| gpt-5.5 alone | 60% | 21.7k | $5.79 | 26 s |
| gpt-5.5 + Mubit lessons | 68% | 14.3k | $4.30 | 20.1 s |
| gpt-5.5 + Mubit lessons + tuned small model | 65% | 5.9k | $1.78 | 15.6 s |

**With the tuned model handling about two thirds of the calls, the agent used 73% fewer gpt-5.5 tokens than gpt-5.5 alone and answered 40% faster, without losing accuracy.** Compared with lessons alone, it got 39 of 60 runs right against 41, a gap of two runs that's within noise.

Lessons made the biggest difference after the schema change. On the benchmark's changed schema, gpt-5.5 alone got 7 of 30 runs right. With Mubit's lessons, it got 14.

## Running the agent on Neon

> "To test schema changes and how they affect the agent, we needed the same data under the old schema and the new one, side by side. With Neon branches, that's just one branch per schema, created in seconds" — Shankha Dutta, CTO, Mubit

The agent, its data, and its frontier-model calls run on a [Neon backend](https://neon.com/). Mubit trains and serves the tuned model on its own infrastructure.

### The agent is a Neon Function

The template's agent runs as a [Neon Function](https://neon.com/docs/compute/functions/overview) that serves an HTTP API. Each question starts a bounded loop: at most 8 model turns, 12 tool calls, and a 45-second deadline.

The model gets three tools, list_tables, describe_table, and query, and never sees the whole schema up front. It connects as a read-only Postgres role, and every query must be a single SELECT.

When a reviewer or evaluator marks an answer right or wrong, the Function records the verdict and queues the run's lessons for Mubit in the same Postgres transaction. It then sends them to Mubit. Anything that fails to send stays queued, and a [scheduled Function Trigger](https://neon.com/docs/compute/functions/triggers/schedule) checks the queue every 15 minutes and resends what's due:

```
triggers: {
  "learning-deliveries": {
    type: "schedule",
    function: "dbagent",
    cron: "*/15 * * * *",
    functionPath: "/triggers/deliveries",
  },
},
```

The result is a reliable feedback loop with no separate queue, worker, or feedback store to run.

### Testing schema changes with branches

The worst moment for an agent is when the schema changes under it. Everything it learned about the old schema is suddenly wrong - column names, where the data lives, how to calculate revenue. A frontier model working alone has to rediscover all of it, and it often gets it wrong. In Mubit's benchmark, gpt-5.5 alone got 7 of 30 runs right on the changed schema.

To show how an agent copes with this, you need two versions of the same database: one before the migration and one after, with the same business data in both, so the only difference is the schema.

The [template](https://github.com/MubitLabs/mubit-neon-db-agent) uses Neon branches for this:

- `acme-v1` holds the seeded store: 5,000 customers and 100,000 orders
- `demo-v1` is a branch of `acme-v1`. The agent queries the original schema here
- `demo-v2` is another branch with a migration applied. It renames a column and moves refunds into their own table. The migration only commits if revenue totals match before and after, so both branches describe the same business
- `agent-control` stores the agent's own runs, verdicts, and lessons, kept apart from the demo data so the demo branches can be reset or migrated without losing history

A [Neon branch](https://neon.com/docs/introduction/branching) is a copy of the backend created in seconds, without dumping and restoring data. The same agent can run against both schemas side by side. The [template's setup script](https://github.com/MubitLabs/mubit-neon-db-agent) creates these branches, so anyone who deploys it gets the same before-and-after setup in their own Neon project.

## Try it

The template deploys to your Neon project with a few commands. Start with the [repo](https://github.com/MubitLabs/mubit-neon-db-agent) or paste this prompt into your coding agent:

```
Deploy the Mubit + Neon template from https://github.com/MubitLabs/mubit-neon-db-agent to my Neon project.

Before you start, confirm with me that:
- I have a Mubit project whose only provider key is a Neon AI Gateway key, and I have its Mubit project key.
- My Neon project has AI Gateway prepaid credits and is in a region that supports Neon Functions and AI Gateway.
- Node 24+ and the Neon CLI are installed, and I'm signed in to the Neon CLI.

Then:
1. Clone the repo and run `npm ci`.
2. Ask me to store the Mubit key myself, in my own terminal. Never ask me to paste the key to you, never print it, and wait until I say it's stored.
   - On macOS: `security add-generic-password -a "$USER" -s mubit-neon-demo-key -w` (it prompts for the key).
   - On Linux or Windows: add the line `MUBIT_API_KEY=<key>` to a `.env` file in the repo. The file is gitignored.
3. Run `npm run demo:prepare -- --neon --project-id <my project id> --seed 42`. This creates the acme-v1, demo-v1, demo-v2 and agent-control branches and writes their connection strings to `.env`. It keeps any values already there and doesn't change my default branch.
4. Run `npm run check`, and stop if the model route, tools or calibration check fails.
5. Run `npm run deploy -- --plan`, show me what it will change, and deploy with `npm run deploy` once I confirm.
6. Ask the agent a first question with `npm run ask -- "What was net revenue by country in August 2026?" --environment demo-v1 --mode calibration`, and show me the answer and its run ID.
7. If I confirm the answer is right, run `npm run verify -- <run ID> --correct` and show me the lessons it sends to Mubit.
```

To set up the Mubit project, [sign up for Mubit](https://app.mubit.ai/) and follow [Connect with the Neon AI Gateway](https://docs.mubit.ai/guides/connect-neon) in Mubit's docs.
