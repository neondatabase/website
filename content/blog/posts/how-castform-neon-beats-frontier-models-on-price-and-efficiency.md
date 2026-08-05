---
title: How Castform + Neon Beats Frontier Models on Price and Efficiency
description: >-
  A 4B open-source model post-trained with Castform retrieved search results as
  accurately as GPT-5.6 Sol, while costing 100x less
excerpt: >-
  “Most teams' best training data is just sitting in their databases. The
  problem is that turning raw data into something usable is hard, and letting
  agents read, search, and mutate data cheaply at scale requires advanced infra.
  Pointing Castform at Neon skips both.” — Ying Hang Seah, cofounder, Castform
date: '2026-08-05T12:00:00'
updatedOn: '2026-08-04T21:00:00'
category: product
categories:
  - product
authors:
  - pranav-aurora
  - ying-hang-seah
  - angel-pan
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency/cover.jpg'
  alt: How Castform + Neon Beats Frontier Models on Price and Efficiency
isFeatured: false
seo:
  title: How Castform + Neon Beats Frontier Models on Price and Efficiency - Neon
  description: >-
    A 4B open-source model post-trained with Castform retrieved search results
    as accurately as GPT-5.6 Sol, while costing 100x less.
  keywords: []
  noindex: false
  ogTitle: How Castform + Neon Beats Frontier Models on Price and Efficiency - Neon
  ogDescription: >-
    A 4B open-source model post-trained with Castform retrieved search results
    as accurately as GPT-5.6 Sol, while costing 100x less.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency/social.jpg'
---

![Comparison of Castform fine-tune and frontier models by inference cost and mean evaluation reward](https://cdn.neonapi.io/public/images/pages/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency/diagram-1.jpg)

<blockquote>
<p>“Most teams' best training data is just sitting in their databases. The problem is that turning raw data into something usable is hard, and letting agents read, search, and mutate data cheaply at scale requires advanced infra. Pointing Castform at Neon skips both.”</p>
<cite>Ying Hang Seah, cofounder, Castform</cite>
</blockquote>

A "good agent" needs to be strong in 2 areas:

- **Context**: can we provide the tools to find the right data?
- **Model**: can the model decide what to search for?

[Neon](https://neon.com/) (Lakebase Postgres) and their new [Search](https://neon.com/blog/lakebase-search-on-neon) extensions solve the first; [Castform](https://castform.com/) solves the second.

## Evolution of agentic search

In ~2022, the industry was going all in on embedding search. Every database provider added one, and pgvector was Neon's most downloaded extension. To provide context to LLMs, engineers handcrafted RAG pipelines, which in essence, is some form of embedding similarity search.

In ~2025, agents started to gain more traction. Developers started creating multi-hop search workflows, decomposing big problems into smaller ones. Retrieval has shifted from the one-shot search systems to agentic retrieval. Instead of issuing a single query, models plan and search multiple times in a loop. Every loop iteration meant another call to the frontier model, increasing the overall cost and latency per user request.

![Comparison of a traditional RAG pipeline and an agentic search workflow](https://cdn.neonapi.io/public/images/pages/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency/diagram-2.jpg)

Concretely, a typical multi-turn search request with gpt-5.6-sol takes >10s and costs ~$0.03 end-to-end, making it prohibitively slow and expensive.

Meanwhile, small open-weights models are 100x cheaper. But, out of the box, their capabilities lag behind closed api models. RL post-training helps bridge this gap. On specific tasks like search, post-trained open-source models can match & beat frontier models while costing orders of magnitude less per request.

That is why we built Castform: to enable developers to RL post-train models without having to deal with machine learning & gpu internals. The goal's to make post-training as approachable as prompt engineering.

## How does Castform use Neon?

Castform's pipeline runs against Neon via Lakebase Search:

| Stage                     | Neon + Lakebase Search                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| Corpus storage            | Raw documents live in Postgres on Neon                                                        |
| Synthetic data generation | Castform training pipeline uses `lakebase_text` and `lakebase_vector` to write training tasks |
| RL Training               | Every rollout's search tool call uses Lakebase Search on Neon                                 |
| Production Inference      | The final model uses the same search tool call during inference                               |

## Your best training data already exists

To perform RL post-training effectively, you need a task (e.g. answer a user's question), the environment for the agent to run in (e.g. a search tool for your corpus) and a reward function (e.g. is the answer correct?).

With all 3 pieces in place, the RL post-training is a loop of trial and error: the model attempts the task given the tools, the reward function scores the attempt, and the feedback signal guides the model on how to hill-climb its way to optimal performance.

Yet, most companies do not have a clean dataset of tasks and reward functions ready for post-training.

Enterprises do have a large set of proprietary data:

- internal documentation
- product records
- support articles
- customer interactions
- wikis
- operational databases

This data contains the knowledge an agent needs, but turning it into an effective training dataset normally requires substantial data engineering and manual labeling.

That leads many teams to dismiss post-training for one of two reasons:

- "We don't have the training data."
- "Fine-tuning is too difficult and requires infrastructure we don't have."

Castform addresses both. It turns an [existing corpus into training tasks](https://castform.com/blog/rag-to-riches/), then manages the RL loop needed to teach an open-source model how to use that data effectively.

## Using Castform

With Castform, you can turn your company knowledge base into a model:

- **Document (from your data):** Trains booked through Navan will be paid by GitLab travel card. Train rides must be standard cabin class with 14 day booking lead time
- **Ground truth (inferred from your data):** Train rides must be standard cabin class with a 14 day booking lead time.
- **Question (synthetically generated):** When booking a rail trip in Navan, what are the rules for how early I need to reserve it and which seating level I'm expected to choose?

With the generated question-answer dataset, Castform lets you scaffold the training run by specifying the tools the agent has access to and a reward function.

The reward function specifies what you want your model to get good at. In our case, we want it to retrieve the correct chunks, cite the right sources along with providing the right final answer.

```python
def run_tool(tool, tool_args):
    """Single tool: hybrid search over Lakebase."""
    if tool == "search":
        query = tool_args["query"]
        bm25 = neon.lakebase_text(query, k)
        vector = neon.lakebase_vector(query, k)
        return rrf_merge(bm25, vector, k)

def reward(trace, ground_truth):
    """Grade a trace against the ground-truth answer."""
    answer = parse_trace(trace)
    retrieval = ...     # did it retrieve the right source
    citation = ...      # did it cite the right chunk
    correctness = ...   # did it land on the right answer
    return retrieval + citation + correctness
```

See a comprehensive code example [here](https://github.com/castform-ai/benchmax/tree/main/examples/neon_rag).

## Observability: Watch the model learn

Castform gives you full observability into your RL run. You can monitor your reward climb with each step, but more importantly you can drop into individual tasks/prompts to watch how the model performs qualitatively, allowing you to debug problems such as broken tools or reward hacking.

For more details on how to monitor your training runs, you can check out the [Castform blog here](https://castform.com/blog/monitoring-rl-runs/). You can also check out our [example training run here](https://app.castform.com/train/a7a898f6-d802-4908-b044-acb812f14a48?tab=train).

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency/image-3.jpg" alt="Average reward over training steps" />
<figcaption>Average reward</figcaption>
</figure>

## Why Neon 'just works'

During training, the agent repeatedly calls Lakebase Search until it has enough context to answer. Across thousands of parallel rollouts, each potentially making dozens of calls, this creates a highly bursty workload.

![Neon CPU allocation and usage during a Castform training run](https://cdn.neonapi.io/public/images/pages/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency/image-4.jpg)

Neon's dynamic compute scaling absorbs these peaks without requiring Castform to provision for maximum capacity around the clock. Training runs get low-latency search when demand spikes, while compute scales down during idle periods.

This infrastructure becomes even more valuable as agents move beyond search and begin modifying data. Training stateful agents requires isolated environments that can be created and reset cheaply, preventing one rollout's actions from affecting another or touching production.

[Neon branching](https://neon.com/docs/introduction/branching) can give each rollout an isolated database state, while time-travel queries make it possible to reconstruct and inspect the state an agent encountered. Combined with autoscaling and scale-to-zero, this creates a path toward training thousands of stateful agent rollouts without maintaining thousands of continuously running environments.

_Castform makes it easy for any developer to post-train open-source models to be cheaper, faster, better than the frontier. Post-train your first model today at [castform.com](https://castform.com)._
