---
title: 'Token economics: what 42 AI models cost to complete the same workload'
description: >-
  We sent the same 100 support tickets to 42 models through Neon AI Gateway and
  compared token use, published cost, pass rate, and time to completion.
excerpt: >-
  The cheapest listed model did finish cheapest in this run, but the rest of
  the results show why price per token is not enough to choose a model.
date: '2026-08-30T12:00:00'
updatedOn: '2026-08-30T12:00:00'
category: engineering
categories:
  - engineering
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-beta/neon-backend-beta.jpg
  alt: Neon backend products
isFeatured: false
draft: true
seo:
  title: 'Token economics: what 42 AI models cost to complete the same workload - Neon'
  description: >-
    A 42-model AI Gateway benchmark comparing tokens, published workload cost,
    usable responses, and time to completion.
  keywords:
    - AI Gateway
    - LLM benchmark
    - token economics
    - model pricing
  noindex: true
  ogTitle: 'Token economics: what 42 AI models cost to complete the same workload - Neon'
  ogDescription: >-
    We ran the same support workload through 42 models and measured what each
    accepted result cost.
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-beta/neon-backend-beta.jpg
---

**We sent the same 100 support tickets to 42 models through Neon AI Gateway. The cheapest listed model did finish cheapest in this run, but the rest of the results show why price per token is not enough to choose a model.**

Model inference is becoming a material operating cost for companies building agents. Headcount pays for human work. Tokens increasingly pay for model work. Small differences in the cost of one accepted result compound across every agent action.

I built [Token Ledger](https://token-ledger-three.vercel.app) to measure that cost on one fixed task. The benchmark compares published model prices with the tokens each model used, the responses an application could accept, and the time each model took.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', margin: '28px 0' }}>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Most expensive</strong>
    <p>GPT-5.5 Pro cost about $8.34 for 100 tickets. It was also the slowest observed run at about 57 minutes.</p>
  </div>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Fastest</strong>
    <p>Llama 3.1 8B Instruct finished in 1 minute 18 seconds, but only 34 of 100 responses passed.</p>
  </div>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Lowest cost</strong>
    <p>GPT-5 Nano cost about $0.006, had the lowest cost per usable response, and finished in about 3 minutes.</p>
  </div>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Most tokens</strong>
    <p>Qwen3.5 122B-A10B used 200,839 tokens and passed 35 of 100 tickets.</p>
  </div>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Highest pass rate</strong>
    <p>GPT-5.3 Codex completed 82 of 100 tickets under this contract.</p>
  </div>
</div>

These are results for one workload, not general model rankings. The useful part is the method: run models on representative work before choosing one for production.

## Why workload economics matter

A catalog answers one useful question: what does a provider charge for one million input or output tokens?

An application has different questions:

- How many tokens does the model use on this task?
- How often does the output meet the application contract?
- How much paid output gets rejected?
- How many retries, fallbacks, or human reviews follow?
- How long does the user or downstream agent wait?

The cheapest token can still produce an expensive unit of work. A model may generate more output, miss the required schema, choose the wrong action, or take too long for the product experience. Teams only see those effects when they test a real workload.

The useful unit is the **cost of an accepted outcome delivered in acceptable time**.

This matters more as agents handle repeated business processes. Saving a fraction of a cent once is not interesting. Saving it across millions of support replies, document reviews, research steps, or coding tasks can change the operating cost of the system.

## The benchmark

The task was simple: use an LLM to reply to 100 support tickets.

The workload contains 20 scenarios, each written in five variants:

- Direct
- Urgent
- Frustrated
- Asking for next steps
- Written for a nontechnical reader

The scenarios cover billing, product questions, security incidents, account access, and refunds. Every request included the same system prompt, JSON response contract, account context, policy notes, and expected decision.

I ran the workload against the 42 text-capable models enabled for the benchmark account at the time of the run. Neon AI Gateway exposes proprietary and open-weight models through branch-specific endpoints and standard model APIs ([AI Gateway overview](https://neon.com/docs/ai-gateway/overview), verified August 30, 2026). Models are hosted by Databricks and served through AI Gateway ([model catalog](https://neon.com/docs/ai-gateway/models), verified August 30, 2026).

### One branch per model

The benchmark created one Neon branch for every model:

```text
main
├── model-gpt-5-nano
├── model-gpt-5-5-pro
├── model-meta-llama-3-1-8b-instruct
├── model-qwen35-122b-a10b
└── ...one branch per model
```

Neon backend services branch with the database, so each branch receives its own AI Gateway endpoint ([branching](https://neon.com/docs/introduction/branching), verified August 30, 2026). A credential created on the parent branch is valid for its descendants ([AI Gateway authentication](https://neon.com/docs/ai-gateway/authentication), verified August 30, 2026).

The branches did not make the model outputs more isolated at the provider level. They gave the benchmark a reproducible mapping between one model, one branch, and one gateway endpoint.

### Request settings

- 100 sequential requests per model
- Up to eight models running concurrently
- Maximum output of 2,048 tokens
- No temperature override, because not every catalog model exposes the same setting
- Chat Completions for compatible models
- Responses API for models that required it
- Exponential backoff for transient `429` and `5xx` responses
- Provider-reported input, output, total, and reasoning tokens
- Request latency measured from send through final response

The runner, workload, grading code, and aggregate results are [published in the repository](https://github.com/carlotas19/token-ledger).

## What counted as a usable response

The benchmark did not ask another model to judge quality. A response counted as usable only when it passed seven deterministic checks:

1. The response parsed as JSON with all four required fields.
2. The classification matched the expected category.
3. The selected action was allowed by the ticket policy.
4. The escalation decision was correct.
5. The customer reply contained between 1 and 120 words.
6. Every required policy term appeared.
7. No forbidden promise, amount, or claim appeared.

One failed check rejected the response. A fluent answer could fail because it promised an unauthorized refund. A terse answer could pass if it followed the full contract.

Failed responses still counted toward the model's tokens, estimated cost, and elapsed time. The application still pays for output it cannot use.

```text
workload cost =
  input tokens × input rate
  + priced output tokens × output rate

cost per usable response =
  full workload cost ÷ responses that passed
```

## Interactive results

The pricing figures below apply the model rates published by AI Gateway on August 29, 2026. They are estimates, not observed invoice charges. AI Gateway inference remains free during beta ([AI Gateway pricing](https://neon.com/docs/ai-gateway/overview#pricing), verified August 30, 2026).

Use the embedded benchmark to search for a model, inspect a bubble, and compare the rankings. Open [Token Ledger](https://token-ledger-three.vercel.app) in a separate tab for the full-width view.

<iframe
  title="Interactive Token Ledger AI model benchmark"
  src="https://token-ledger-three.vercel.app"
  loading="lazy"
  style={{ width: '100%', height: '860px', border: '1px solid #d9e2dc', borderRadius: '12px' }}
/>

## Published workload cost

GPT-5 Nano produced the lowest full-workload estimate at $0.005771. GPT-5.5 Pro produced the highest at $8.342430, about 1,446 times more for the same 100 attempts.

| Lowest workload cost | Estimated cost | Passed |
|---|---:|---:|
| GPT-5 Nano | $0.005771 | 51/100 |
| Llama 3.1 8B Instruct | $0.006552 | 34/100 |
| Gemma 3 12B | $0.008941 | 64/100 |

| Highest workload cost | Estimated cost | Passed |
|---|---:|---:|
| GPT-5.5 Pro | $8.342430 | 70/100 |
| Claude Fable 5 | $1.592500 | 68/100 |
| Claude Opus 4.1 | $1.464975 | 61/100 |

The workload bill is useful, but it can reward cheap failures. Llama 3.1 8B Instruct ranked second by workload cost while passing only 34 tickets.

## Cost per usable response

Dividing by passed responses changes the unit from "what did 100 calls cost?" to "what did one accepted result cost?"

| Lowest cost per usable response | Estimated cost | Passed |
|---|---:|---:|
| GPT-5 Nano | $0.000113 | 51/100 |
| Gemma 3 12B | $0.000140 | 64/100 |
| Llama 3.1 8B Instruct | $0.000193 | 34/100 |

| Highest cost per usable response | Estimated cost | Passed |
|---|---:|---:|
| GPT-5.5 Pro | $0.119178 | 70/100 |
| Claude Opus 4.1 | $0.024016 | 61/100 |
| Claude Fable 5 | $0.023419 | 68/100 |

GPT-5 Nano had the lowest catalog input rate in the tested set and finished first on both cost measures. That happened in this workload. It does not remove the need to test. Qwen3.5 122B-A10B shows the opposite pattern: a low rate paired with high token use and a low pass rate.

## Tokens used

Input use varied less because every model received the same prompt text. Output behavior created the larger difference. Models can generate different amounts of JSON, reasoning, or text before returning the final response.

| Fewest total tokens | Tokens | Passed |
|---|---:|---:|
| Llama 3.1 8B Instruct | 28,261 | 34/100 |
| GPT-5.6 Terra | 28,396 | 72/100 |
| Llama 4 Maverick 17B Instruct | 28,708 | 61/100 |

| Most total tokens | Tokens | Passed |
|---|---:|---:|
| Qwen3.5 122B-A10B | 200,839 | 35/100 |
| Kimi K3 | 83,827 | 71/100 |
| Inkling | 74,148 | 72/100 |

Qwen3.5 122B-A10B used more than seven times the tokens of Llama 3.1 8B Instruct. Its median request approached the 2,048-token output cap, while the visible customer reply was much shorter. The provider did not report a separate reasoning-token count, so the saved data cannot attribute every generated token to a specific content block. The narrow conclusion is that the model generated far more output than the response contract needed.

## Time to completion

Latency affects product experience and throughput. A model can be inexpensive and accurate enough but still take too long for an interactive workflow.

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '24px 0' }}>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Three fastest</strong>
    <ol>
      <li>Llama 3.1 8B Instruct: 1m 18s</li>
      <li>Llama 3.3 70B Instruct: 2m 05s</li>
      <li>Llama 4 Maverick 17B Instruct: 2m 19s</li>
    </ol>
  </div>
  <div style={{ border: '1px solid #d9e2dc', borderRadius: '12px', padding: '18px' }}>
    <strong>Three slowest</strong>
    <ol>
      <li>GPT-5.5 Pro: 56m 53s</li>
      <li>Claude Opus 4.1: 22m 19s</li>
      <li>Qwen3.5 122B-A10B: 17m 16s</li>
    </ol>
  </div>
</div>

The observed spread was about 43 times from fastest to slowest. GPT-5 Nano finished in about 3 minutes, giving it a good result across both cost and elapsed time.

These timing results are directional. The original 28 models and 14 later additions ran in separate batches on different dates. Models ran concurrently within each batch. Provider load, network conditions, retries, and rate-limit waits can affect elapsed time. A controlled latency benchmark would repeat each model under matched conditions and report the distribution across runs.

## Pass rate

GPT-5.3 Codex produced the highest pass rate at 82%. Llama 3.1 8B Instruct produced the lowest at 34%.

| Highest pass rate | Passed |
|---|---:|
| GPT-5.3 Codex | 82/100 |
| GPT-5.5 | 79/100 |
| GPT-5.4 mini | 76/100 |

| Lowest pass rate | Passed |
|---|---:|
| Llama 3.1 8B Instruct | 34/100 |
| Qwen3.5 122B-A10B | 35/100 |
| Llama 3.3 70B Instruct | 47/100 |

Pass rate here means contract compliance, not general model quality. The most common failures were wrong classification and wrong escalation decisions. Many rejected responses were readable but made a different policy decision than the fixed expected answer.

## Open-weight and proprietary models

The 11 open-weight models had a lower median workload estimate than the 31 proprietary models: $0.022216 versus $0.281145. The proprietary group had a higher median pass rate, 69% versus 61%, and used fewer median tokens per usable response, 552 versus 925.

These group medians do not select a model. The individual results vary too much. Llama 3.1 8B Instruct was fast and inexpensive but had the lowest pass rate. Qwen3.5 122B-A10B had low listed rates but the highest token use. Gemma 3 12B paired low cost with a 64% pass rate.

## A practical model-selection process

Teams can apply the same pattern to their own agent workflows:

1. Define an accepted result with an observable contract.
2. Set the minimum quality or pass-rate requirement.
3. Run representative prompts through candidate models.
4. Record input, output, reasoning, latency, retries, parse failures, and fallback calls.
5. Calculate the full workload cost and cost per accepted result.
6. Set median and tail-latency requirements.
7. Repeat the test to measure variance.

Price per token remains useful. It narrows the candidate set. The workload test shows whether the listed advantage survives the model's actual behavior.

Different jobs can produce different winners. Support triage, code review, document extraction, and research have different context, output, quality, and latency requirements. The routing decision should follow the work.

## Limitations

This benchmark is one run of one structured support task. It does not rank general model capability.

- Each ticket was sent once to each model, so the results do not measure output variance.
- The deterministic grader rewards contract and policy compliance, not empathy, tone, or factual depth beyond the required checks.
- The prompt and output contract were held constant rather than tuned for each model.
- Timing came from two batches and was not collected under controlled repeated conditions.
- The cost estimates use published rates, not observed beta charges.
- Model availability, behavior, and prices can change.

The scripts and aggregate data are public so readers can inspect the assumptions, rerun the workload, or replace it with a task closer to their own application:

- [Interactive results and report](https://token-ledger-three.vercel.app)
- [Repository](https://github.com/carlotas19/token-ledger)
- [100-ticket workload](https://token-ledger-three.vercel.app/workload.json)
- [Published aggregate data](https://github.com/carlotas19/token-ledger/blob/main/src/data/latest-benchmark.json)
- [Benchmark runner](https://github.com/carlotas19/token-ledger/blob/main/scripts/run-benchmark.py)

_Benchmark pricing verified August 29, 2026. AI Gateway, model catalog, branching, and authentication documentation verified August 30, 2026._
