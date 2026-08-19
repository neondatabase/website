---
title: Open-weight models are fast on Neon AI Gateway. Here's why
description: >-
  AI Gateway runs on the Databricks Foundation Model APIs, which boosts
  performance with prompt caching and other optimizations
excerpt: >-
  Open-weight models are built for performance, but how they're served
  determines whether end users actually feel that speed. Neon AI Gateway calls
  Databricks Foundation Model APIs for Databricks-hosted open-weight models, a
  stack that has years of inference engineering behind it.
date: '2026-08-20T12:00:00'
updatedOn: '2026-08-19T12:54:00'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Open-weight models are fast on Neon AI Gateway. Here's why - Neon
  description: >-
    AI Gateway runs on the Databricks Foundation Model APIs, which boosts
    performance with prompt caching and other optimizations
  keywords: []
  noindex: false
  ogTitle: Open-weight models are fast on Neon AI Gateway. Here's why - Neon
  ogDescription: >-
    AI Gateway runs on the Databricks Foundation Model APIs, which boosts
    performance with prompt caching and other optimizations
  image: null
---

Open-weight models are built for performance, but how they’re served determines whether end users actually feel that speed. [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) calls [Databricks Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/) for Databricks-hosted open-weight models, a stack that has years of inference engineering behind it - including continuous batching and KV-cache paging, a TensorRT-LLM-era backend with custom kernels, careful quantization, hardware-tuned multi-GPU layouts, and prompt caching. Neon users now inherit the performance boost that comes from this work.

That last optimization (prompt caching) is the one that maps most directly to agent loops, a main use case for the Neon backend. Coding agents and multi-step tool loops tend to resend the same system prompt, tools schema, and few-shot examples on every turn - prompt caching speeds up that traffic pattern. When Databricks first rolled prompt caching out on gpt-oss in a large production batch-inference pipeline, [per-replica input-token throughput went up 2.5× and P50 latency went down 3×, even at a ~30% cache hit rate.](https://www.databricks.com/blog/accelerating-llm-inference-prompt-caching-open-source-models-databricks)

## Open-weight models are built to be fast, but bad serving cancels that

The [Neon AI Gateway catalog](https://neon.com/docs/ai-gateway/models) includes several Mixture-of-Experts (MoE) models. Each layer has many “expert” sub-networks; a small router activates only a few of them per token. That keeps total parameter count high for quality while keeping active compute per token lower than a dense model of similar size.

At small batch sizes the workload is memory-bandwidth bound, so loading only the active experts can reach [well over the tokens-per-second of a comparable dense model under a tight latency budget](https://www.databricks.com/blog/accelerated-dbrx-inference-mosaic-ai-model-serving). You see the same pattern in model releases - e.g. [Llama 4 Maverick delivering over 40% faster inference than Llama 3.3 70B](https://www.databricks.com/blog/introducing-metas-llama-4-databricks-data-intelligence-platform) for exactly this reason. That’s mostly an architecture win.

MoE only pays off in production if the serving stack can keep up. Serve those weights poorly and the paper latency win disappears under real traffic.

## How we optimize performance in open-weight models

AI Gateway’s open-weight path runs on [Databricks Foundation Model APIs](https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/), the same production stack Databricks uses to serve [well over 145 trillion tokens a month](https://neon.com/blog/neon-backend-is-beta). Neon does not reimplement that engine: you get the serving optimizations Databricks already ships. These are just a few examples:

### Continuous batching

LLM requests don’t arrive in neat, uniform batches - one user asks for a long generation, another wants a yes/no… With static batching, you’d group requests and run them through one forward pass together, but the whole batch would be blocked by its slowest member, which causes time-to-first-token to spike (and GPUs sit half-idle).

[Continuous batching](https://www.databricks.com/blog/fast-secure-and-reliable-enterprise-grade-llm-inference) schedules at the iteration level instead of the request level. Every decoding step, the scheduler decides which requests run next - a finished request drops out immediately and frees its slot, and a newly arrived request can join the in-flight batch on the next step instead of waiting for the current batch to drain.

Two things make this approach hold up under real traffic:

- KV-cache paging. Every in-flight request keeps a key/value cache in GPU memory that grows with its context, and those caches can’t be evicted mid-request. Databricks manages them with a [PagedAttention-style allocator](https://www.databricks.com/blog/fast-secure-and-reliable-enterprise-grade-llm-inference) (the vLLM approach): the cache is split into fixed-size token blocks allocated on demand, which cuts fragmentation and packs more concurrent requests onto the same GPU before running out of memory.
- Overlaying prefill and decode. Processing a new prompt (prefill) and generating tokens for existing requests (decode) compete for the same GPU. The stack overlays them in the same batch up to a tuned token budget, so prompt processing for a new request doesn’t stall token generation for everyone already streaming.

The real goal is maximum throughput under a fixed latency budget, not peak tokens/second in a benchmark. Databricks holds target P90/P95 time-to-first-token and time-per-output-token, then pushes batch size and utilization as high as they’ll go underneath that ceiling. That’s the number that matches what a user feels under load.

### A TensorRT-LLM-era backend

Continuous batching decides what runs each step; the runtime decides how fast each step executes. Databricks moved Foundation Model endpoints onto a backend built around [NVIDIA’s TensorRT-LLM](https://www.databricks.com/blog/Integrating-NVIDIA-TensorRT-LLM), a compiled, GPU-optimized inference runtime, plus custom kernels on top. When that cutover landed, Foundation Model endpoints ran [about 1.5× to 1.7× faster than the previous APIs](https://www.databricks.com/blog/fast-secure-and-reliable-enterprise-grade-llm-inference).

Concretely:

- Fused kernels. Sequences of GPU ops are [collapsed into single fused kernels](https://www.databricks.com/blog/accelerated-dbrx-inference-mosaic-ai-model-serving) to cut redundant reads and writes to GPU memory, often the real bottleneck rather than raw compute.
- MoE-aware kernels. For MoE layers, Databricks uses [GroupGEMM-style kernels](https://www.databricks.com/blog/accelerated-dbrx-inference-mosaic-ai-model-serving) so sparse matrix multiplies run without dropping tokens or wasting compute on padding (the inference counterpart to the dropless routing story in [MegaBlocks](https://www.databricks.com/blog/bringing-megablocks-databricks)).
- Tuned tensor parallelism. Big models are split across multiple GPUs. For MoE serving specifically, Databricks [prefers tensor parallelism over expert parallelism](https://www.databricks.com/blog/fast-secure-and-reliable-enterprise-grade-llm-inference) so work stays evenly distributed across GPUs even when tokens aren’t perfectly load-balanced across experts, then tunes the layout and cross-GPU sync so the split itself doesn’t eat the speedup.

### Quantization

Serving weights at lower precision shrinks the memory footprint so the same GPU can hold a larger batch at the same latency budget. On Llama 2 70B with FP8 on H100s, Databricks measured [roughly 2× larger max batch size and ~2.2× throughput](https://www.databricks.com/blog/serving-quantized-llms-nvidia-h100-tensor-core-gpus) versus FP16, with ~30% better TTFT on prefill from faster FP8 math - after quality checks on the Mosaic Gauntlet eval suite showed no meaningful average quality drop across dozens of benchmarks.

### Per-GPU and per-cloud tuning

On top of the runtime itself, Databricks [benchmarks and tunes TensorRT-LLM configs](https://www.databricks.com/blog/Integrating-NVIDIA-TensorRT-LLM) (continuous batch sizes, tensor sharding, pipelining) across GPU types and clouds, then deploys those configs for the models on the fleet.

You don’t pick kernel parameters or parallelism layouts when you call a model through Neon or Databricks, this deployment is tuned for you.

## Prompt caching for open-weight models

Agents are repetitive by nature: they tend to run the same long system prompt, the same tool schema, the same examples. Without caching, the server runs the full prefill over that prefix every time, building the KV cache for every token in it, before it can generate a single new token. On a long, stable prefix, that’s a lot of compute spent re-deriving the same thing.

Prompt caching removes that waste. When requests share a prefix, the stack keeps the KV cache for that prefix and reuses it on a hit, skips prefill for the cached tokens, and jumps closer to generating new ones. That lowers time-to-first-token and raises tokens per replica because the GPU isn’t burning cycles on repeated prefixes.

Databricks already ran prompt caching for proprietary models, and then they [extended it to open-weight models](https://www.databricks.com/blog/accelerating-llm-inference-prompt-caching-open-source-models-databricks) across batch, pay-per-token, and provisioned-throughput workloads. The impact was substantial - when the feature first rolled out on gpt-oss in a large production batch-inference pipeline, per-replica input-token throughput improved 2.5×, P50 latency went down 3×, and at a relatively low cache hit ratio of ~30%.

It’s worth noting that that’s a batch pipeline, not a Neon AI Gateway agent benchmark - but agent loops that keep a stable system/tools prefix are exactly the traffic pattern prompt caching is built for. The more your agent reuses that prefix, the more often you hit cache, and the more TTFT should improve. For many agent workloads, that’s the single biggest serving lever once the rest of the stack is in place.

## Call your LLMs from Neon

However you’re calling open-weight models today, moving to AI Gateway is a base-URL-and-key change. The SDK you already use keeps working. Simply [create a Neon credential](https://neon.com/docs/ai-gateway/authentication) with ai_gateway:invoke (or set aiGateway: true in [neon.ts](https://neon.com/docs/reference/neon-ts) and run neon deploy) and point the client at Neon.

```
import OpenAI from 'openai';
import 'dotenv/config';
const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});
// Keep this prefix stable across turns so caching can hit
// (on models where FMAPI prompt caching is enabled).
const system = `You are a support agent for Acme.
Always search the knowledge base before answering.
Return citations as [{doc_id, quote}].
/* … long stable instructions … */`;
const response = await client.chat.completions.create({
  model: 'gpt-oss-120b',
  messages: [
    { role: 'system', content: system },
    { role: 'user', content: 'What is the refund window for EU orders?' },
  ],
});
```

You’d pay the standard per-token rate for each model, with no Neon markup on top. If you’re a Neon user, calling AI Gateway is a no-brainer - you’ll get a boost in performance and convenience without price penalties.

<Admonition type="note" title="Neon AI Gateway is in beta - try it">
Tokens are free during the beta period. Spin up a Neon project on a Launch or Scale plan in aws-us-east-2, point your SDK at Neon, and benchmark latency on your own agent loop. If you have any feedback, [please send it over](https://discord.gg/92vNTzKDGp) - we’re working hard to bring AI Gateway ([and the rest of the Neon backend](https://neon.com/blog/neon-backend-is-beta)) to GA.
</Admonition>
