---
title: Comparing token economics across 42 AI models
description: >-
  We ran the same workload through all models listed in Neon AI Gateway and
  compared total costs, accuracy, and time to completion
excerpt: >-
  If headcount is often a company's largest cost, tokens will be a close second
  soon as agents take on more work. Imagine how much $$ a software company will
  be able to save just by pre-selecting models that are efficient to run,
  especially in large companies with many engineers using coding agents.
date: '2026-09-04T12:00:00'
updatedOn: '2026-09-03T19:50:00'
category: community
categories:
  - community
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Comparing token economics across 42 AI models - Neon
  description: >-
    We ran the same workload through all models listed in Neon AI Gateway and
    compared total costs, accuracy, and time to completion
  keywords: []
  noindex: false
  ogTitle: Comparing token economics across 42 AI models - Neon
  ogDescription: >-
    We ran the same workload through all models listed in Neon AI Gateway and
    compared total costs, accuracy, and time to completion
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/social.jpg
---

If headcount is a company's largest cost, tokens will soon be a close second as agents take on more work. Token economics (tokenomics?) will be a very important thing - imagine how much $$ a software company will be able to save just by pre-selecting models that are efficient to run, especially in large companies with many engineers using coding agents.

To beyond just imagination, we actually ran a small experiment: we wrote a synthetic workload (responding to 100 support tickets) and asked the LLMs to execute it, all through 42 models listed in [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview). We then took a look at the final costs, how usable was the output in each model, and how much time it required each LLM to finish.

**The full experiment is published** [here](https://get.neon.com/tokenomics)**. There's an interactive chart where you can play with every model and see how it did, together with a report.** We'll update it regularly with the latest models (we're already behind, things move just too fast!)

<figure>
<video autoPlay muted loop playsInline width="1416" height="916" aria-label="Token economics benchmark demo">
<source src="https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/benchmark-demo.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/benchmark-demo.mp4" type="video/mp4" />
</video>
</figure>

Some interesting results:

- **The cheapest model for the task was GPT-5 Nano,** cheaper than the open weight models. It had the lowest cost per usable response, and was also very fast - it finished in about 3 minutes
- **The fastest model to finish was Llama 3.1 8B Instruct** with 1 minute 18 seconds, but guess what - only 34 of 100 responses passed our accuracy test, so most of the output was actually not usable…
- **The most expensive model to run was GPT-5.5 Pro** at about $8.34 for 100 tickets. It was also very slow to run: it took 57 minutes - which might have been a one-off thing, but still worth noting, since no other model stalled that bad
- **The model that ate up more tokens was** Qwen3.5 122B-A10B. It only passed 35 of 100 tickets as well
- **The highest pass rate (the most accurate model for this task) was for GPT-5.3 Codex,** which one-shotted 82 out of 100 tickets

![Summary of benchmark results across 42 AI models](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-1.jpg)

At the end of the test, to get back to our tokenomics question, we estimated how much money one could save if picking, for example, Llama 3.1 8B Instruct (the third cheapest model in our test) versus Claude Fable 5 (the third most expensive), assuming a software company where every engineer is running one 1-million-token agent task per workday.

**For 50 engineers, there'd be a $18k/month difference** between the cheap model and the expensive one. That's $188k per month if there were 500 engineers, or a **86× price gap** from model choice alone (and we're not even picking the extremes).

![Monthly cost comparison between Llama 3.1 8B Instruct and Claude Fable 5](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-2.jpg)

Of course, these are results for one workload, not general model rankings, and this was a small experiment run in messy real-world conditions, not a lab. Still, it shows why tokenomics will matter a lot as agents become part of how companies get work done.

## How we built this: The benchmark

## The task

The task we gave the LLM was simple but interesting enough to allow us to define some pass/no-pass quality criteria: we asked the AIs to reply to 100 support tickets we synthetically generated. This collection of support tickets contains 20 scenarios, each written in five variants that change the customer tone (`direct`, `urgent`, `frustrated`, `asking for next steps`, and `written for a nontechnical reader`).

The scenarios cover billing, product questions, security incidents, account access, and refunds. Every request included the same system prompt, JSON response contract, account context, policy notes, and expected decision.

Here are two example tickets from the set:

**Ticket 1: billing, no credit**

- Account context - Plan: Launch, Active projects: 3, Storage: 2.1 GB, Compute usage: 38 CU-hours
- Policy: _Explain compute and storage separately. Do not issue credits without billing review._

```
Direct: "I was charged $42 this month but expected the Launch plan minimum. Can you explain the invoice?"
```

```
Urgent variant: "…This is blocking our team today."
```

```
Frustrated variant: "…We have already spent too much time on this."
```

```
Asking for next steps variant: "…Please give us the next concrete step."
```

```
Nontechnical variant: "…Please explain this without assuming deep technical knowledge."
```

**Ticket 2: security, must escalate**

- Account context: _Production branch active_, _The gist is confirmed public_
- Policy: _Treat this as a security incident. Recommend rotation and escalate._

```
Direct: "Our database password appeared in a public gist."
```

### What counted as a usable response\*\*

As we all know from experience, not all output from an LLM is usable, but the tries still count for token use. We wanted to simulate some simple quality criteria to decide if a generated response was usable or not. The rules we ended up using are these - a response counted as usable only when it passed these 7 checks:

1. The response parsed as JSON with all four required fields
2. The classification matched the expected category
3. The selected action was allowed as defined by a ticket policy we included
4. The escalation decision was correct
5. The customer reply contained between 1 and 120 words
6. Every required policy term appeared
7. The LLM didn't make a forbidden promise or claim (according to the rules we defined)

For example, going back to the tickets above,

- For ticket 1 - the expected output would be something like: _classify as billing, do not escalate, reply only, mention storage, do not say "full refund approved."_ A passing reply explains the invoice and names storage; a failing reply invents a credit or promises a refund.
- For ticket 2, the expected output would be something like: _classify as security, escalate, take the security-escalation action, mention rotation._ A passing reply treats it as an incident and escalates. A "don't worry, rotate the password and you're fine" reply fails because it skipped the required escalation.

![Seven checks used to determine a usable support-ticket response](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-3.jpg)

## Tech stack

[The app itself](https://get.neon.com/tokenomics) has three parts: a benchmark runner, a data layer, and a web app.

<figure>
<video autoPlay muted loop playsInline width="1416" height="928" aria-label="Token economics benchmark tech stack">
<source src="https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/tech-stack.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/tech-stack.mp4" type="video/mp4" />
</video>
</figure>

**Backend on Neon**

One Neon project contains the `main` branch. From there, we created one child branch per model. That gives a reproducible mapping between one model, one branch, and one gateway endpoint.

```
main
├── model-gpt-5-nano
├── model-gpt-5-5-pro
├── model-meta-llama-3-1-8b-instruct
├── model-qwen35-122b-a10b
└── ...one branch per model
```

The runner creates model branches with the Neon CLI and `--no-compute`, because the benchmark only needs each branch's AI Gateway endpoint. By default, `neon branches create` also adds a read-write compute. `--no-compute` skips that, so we don't pay for Postgres compute we never use.

```
neon branches create \
  --project-id "$PROJECT_ID" \
  --parent "$PARENT_BRANCH" \
  --name "model-gpt-5-nano" \
  --no-compute
```

Each branch still gets its own AI Gateway host. The runner builds that URL from the branch ID and sends that model's 100 tickets through it. A credential created on `main` with the `ai_gateway:invoke` scope works on these descendant branches.

[Lakebase Postgres](https://neon.com/docs/postgres/overview) (the database in the Neon backend) tables define benchmark runs, model snapshots, and individual inference results. The published aggregate also lives in a committed JSON snapshot, so the numbers remain reviewable and the app can render if the database-backed read is unavailable.

<Admonition type="note" title="Learn more about Neon branches">
[Branches](https://neon.com/docs/introduction/branching) are the flagship feature of the Neon backend. They let you copy your environment the way you copy a git branch: a copy-on-write clone of your backend, created instantly. Each branch includes [Lakebase Postgres](https://neon.com/docs/postgres/overview) (the database), [Object Storage](https://neon.com/docs/storage/overview), [Managed Better Auth](https://neon.com/docs/auth/overview), [Functions](https://neon.com/docs/compute/functions/overview), and [AI Gateway](https://neon.com/docs/ai-gateway/overview).
</Admonition>

**Benchmark runner**

A Python script loads the JSON workload, reads the enabled text models from AI Gateway, provisions missing branches, sends requests, retries transient errors, grades responses, and records usage and latency. Each model processes its 100 tickets sequentially.

**Web app**

We used Next.js 15, React 19, and TypeScript to render the report. Recharts draws the benchmark visualizations, Tailwind CSS handles styling, Zod defines runtime schemas, and the [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver) reads benchmark data from Lakebase Postgres.

**Deployment and automation**

Vercel hosts the public app. A GitHub Actions workflow runs the benchmark on a schedule or on demand, then uploads the aggregate and raw responses as artifacts. Publishing a new aggregate remains a reviewed commit.

## Results

### Cost per usable response

For our workload, GPT-5 Nano was the cheapest model to run. (It was also quite accurate and fast, making it a great choice overall, as we'll see later). GPT-5.5 Pro was instead the most expensive, about 1,446x more than Nano for the same 100 attempts, followed by the Opus and Fable family.

![Cost per usable response across 42 AI models](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-4.jpg)

### Total tokens used

Input use varied less because every model received the same prompt text (output behavior is what created the larger difference). Still, Qwen3.5 122B-A10B used more than seven times the tokens of Llama 3.1 8B Instruct.

![Total tokens used across 42 AI models](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-5.jpg)

### Time to completion

It is important to also look at latency, since it affects the experience significantly - a model can be inexpensive and accurate enough but still take too long for an interactive workflow. The observed spread was about 43x from fastest to slowest: GPT-5 Nano finished in about 3 minutes, giving it a good result across both cost and elapsed time.

![Time to completion across 42 AI models](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-6.jpg)

Of course, these timing results are directional. Provider load, network conditions, retries, and rate-limit waits can affect elapsed time. A controlled latency benchmark would repeat each model under matched conditions and report the distribution across runs - but a little variability also happens in real life, so it is fine for this test. Many model benchmarks trend to make it too academic therefore moving away from the conditions of the real world.

### Pass rate

Pass rate is also interesting to look at, measuring compliance with the conditions of the prompt (not general model quality). As we covered earlier in the post, the most common failures here were wrong classification and wrong escalation decisions. GPT-5.3 Codex produced the highest pass rate at 82%, while Llama 3.1 8B Instruct produced the lowest at 34%.

![Pass rate across 42 AI models](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-7.jpg)

### GPT-5.6 Sol vs Claude Fable 5

We thought it would be fun to directly compare OpenAI's and Anthropic's flagship models right now, GPT-5.6 Sol and Fable 5:

- Pass rate was nearly tied: Sol completed 69 tickets, Fable 68
- The economics were not close:
  - Sol used 34,663 tokens and cost $0.535 for the full workload
  - Fable used 57,010 tokens and cost $1.59, about 3× more per usable response
  - Fable also took 2.3× as long to finish

![GPT-5.6 Sol versus Claude Fable 5 benchmark comparison](https://cdn.neonapi.io/public/images/pages/blog/comparing-token-economics-across-42-ai-models/figure-8.jpg)

### Open-weight vs proprietary models

Perhaps not surprisingly, the 11 open-weight models had a way lower median cost than the 31 proprietary models ($0.022216 versus $0.281145). Pass rate was higher among the frontier models, but quite similar ( 69% median versus 61%). Open weight models also used fewer tokens per usable response, 552 (median) versus 925.

The individual results vary a ton though (this is the danger of looking at medians). Llama 3.1 8B Instruct was fast and inexpensive but had the lowest pass rate; Qwen3.5 122B-A10B had low listed rates but the highest token use; Gemma 3 12B paired low cost with a 64% pass rate.

## $$ projections

The reflection behind this blog post was that now that tokens are widespread, especially among software companies, small differences in model efficiency become large costs when coding agents run across an engineering organization.

So to amuse us,

1. Let's pick two models from the benchmark (avoiding the extremes to make it even more conservative): Llama 3.1 8B Instruct, the third lowest by cost per usable response, and Claude Fable 5, the third highest by the same metric.
2. Let's model token consumption
   1. let's assume one coding-agent task per engineer per workday
   2. Let's say each task consumes 1 million tokens
   3. This is 20 million tokens per engineer per month. _(This is actually a conservative relative to_ [a 2026 study of coding agents on SWE-bench Verified](https://www.microsoft.com/en-us/research/publication/how-do-ai-agents-spend-your-money-analyzing-and-predicting-token-consumption-in-agentic-coding-tasks/)_.)._
3. Let's do some math and estimate some costs with these assumptions:
   1. 80% input tokens and 20% output tokens
   2. No prompt-caching or volume discount
   3. Half of company employees are engineers
   4. Every engineer uses a coding agent

At published AI gateway rates, this would come up to:

**[ADD FIGURE 9]**

Under these assumptions, model selection would change inference spend by roughly 86×. Of course, this would not mean that Llama is the right coding model for either company - all kinds of metrics have to be evaluated and tested, including the other parameters we mentioned in this experiment (time to completion, pass rate) plus overall output quality. But this is a good sample to indicate the huge impact optimization in token cost can have in companies today.

## Your daily reminder to pick your models mindfully

This fun experiment shows the importance of tokenomics, and also of how comparing catalog price is not quite enough - a model can look cheap but still produce an expensive unit of work. The opposite is also true: a higher-priced model can finish cheaper if it uses fewer tokens, fails less often, or returns faster.

We will keep re-running this with the newest models and report on what we find!
