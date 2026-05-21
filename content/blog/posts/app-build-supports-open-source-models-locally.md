---
title: 'Generate Apps Locally for Free: App.build Now Supports Open Source Models'
description: 'Run it locally with Ollama, LMStudio, and OpenRouter'
excerpt: >-
  App.build now supports open weights LLMs via Ollama, LMStudio, and OpenRouter
  – enabling you to generate complete applications end-to-end without cloud API
  dependency or associated costs. Why Run App.build Locally? Zero API costs
  Cloud LLM APIs can become expensive fast during ex...
date: '2025-08-11T19:41:53'
updatedOn: '2025-10-02T00:23:37'
category: ai
categories:
  - ai
authors:
  - arseni-kravchenko
  - evgenii-kniazev
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/app-build-supports-open-source-models-locally/cover.jpg
  alt: null
isFeatured: true
seo:
  title: >-
    Generate Apps Locally for Free: App.build Now Supports Open Source Models -
    Neon
  description: >-
    App.build, our open-source architecture reference for building agents, now
    supports open weights LLMs via Ollama, LMStudio, and OpenRouter.
  keywords: []
  noindex: false
  ogTitle: >-
    Generate Apps Locally for Free: App.build Now Supports Open Source Models -
    Neon
  ogDescription: >-
    App.build, our open-source architecture reference for building agents, now
    supports open weights LLMs via Ollama, LMStudio, and OpenRouter.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/app-build-supports-open-source-models-locally/social.png
---

<Admonition type="comingSoon" title="app.build is evolving into something new">
Since publishing this post, we’ve shifted focus. The managed version of app.build has been discontinued, but the source code is available - if you’re also building an agent, you can still explore the app.build [agent](https://github.com/appdotbuild/agent) and [platform](https://github.com/appdotbuild/platform) code for reference and implementation examples. We’re also applying this learnings and code to our next project.
</Admonition>

App.build now supports open weights LLMs via Ollama, LMStudio, and OpenRouter – enabling you to generate complete applications end-to-end without cloud API dependency or associated costs.

## Why Run App.build Locally?

### Zero API costs

Cloud LLM APIs can become expensive fast during extended coding sessions. Even our small dev team can burn through hundreds of dollars in API costs during a single intensive testing session. That is acceptable for a company and less so for hobbyists, and we want more enthusiasts to hack around our framework.

### No rate limits or outages

API-based tools frequently hit rate limits during intensive development sessions, especially when major providers struggle with the load. Getting 5xx errors from Anthropic isn’t uncommon.

### Data privacy and control

Running locally means your code, ideas, and proprietary information never leave your machine – addressing GDPR, HIPAA, and IP protection concerns without relying on cloud provider policies.

### Because it’s cool!

Using open weights models, running everything locally, contributing to the open source ecosystem – [sometimes the philosophical reasons matter too](https://www.smbc-comics.com/comic/2010-12-09). 🙂 We’re having a lot of fun working on app.build, and want to align it with our personal preferences.

## The Open Weights Models Situation

### Hardware available for pet projects

Consumer GPUs like RTX 3090/4090 with 24GB VRAM can run capable 8B models at full precision or heavily quantized 30B models (e.g. Qwen3-30B3A). Apple M4 Macbooks with up to 48GB unified memory offer excellent local inference performance with even more flexibility.

E.g. MoE (mixture of experts) models like aforementioned Qwen3-30B3A or recent GPT-OSS-20B by OpenAI can be inferred with very reasonable speed on such laptops (~60-70 tokens per second in 4-bit quantized versions, which is [comparable](https://artificialanalysis.ai/models#speed) to some popular commercial APIs). Among the other upcoming hardware for local LLM inference we should mention [Nvidia DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/), [Asus Ascent GX10](https://www.asus.com/networking-iot-servers/desktop-ai-supercomputer/ultra-small-ai-supercomputers/asus-ascent-gx10/); there are also rumors on next gen of Mac Studios being a great choice for local LLMs.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/app-build-supports-open-source-models-locally/image-6-768x1024-6d1d461c.png" alt="Image" />
<figcaption>app.build works in your homelab too 🙂 ours pictured</figcaption>
</figure>

### OpenRouter: best of two worlds

Not everyone is a hardware enthusiast and wants to fill their apartment with GPUs. It should not be a blocker for experiments!

[OpenRouter](https://openrouter.ai/) is a service allowing users to query multiple LLMs via unified API, including both closed models and open weights ones served by various infra providers, including [Cerebras](https://www.cerebras.ai/) and [Groq](https://groq.com/) – companies with unique serving tech allowing for hyperfast inference. Unlike local inference, OpenRouter can’t guarantee absolute privacy, though they claim not to store users’ prompts unless stated explicitly for some models.

Using OpenRouter allows you to try open-source models that are barely available for typical home setup and require 100s of GB VRAM. It comes with a very reasonable pricing: e.g. [Kimi K2](https://moonshotai.github.io/Kimi-K2/) – open-source model comparable to Claude Sonnet can be inferred for $0.6/$2.50 for 1M input/output tokens (compare it with $3/$15 for Sonnet). The model has 1T parameters, which is an absolute blocker for most self-serving adepts.

### What’s the situation with available models?

We don’t have a holistic benchmark to evaluate the whole model variety (and are working on closing this gap). However, our early evaluation shows large open source models being approximately on par with closed source alternatives. Honorable mentions: Qwen3-Coder, Kimi K2.

Smaller open source models do not really perform well enough at the moment. Building an app in a single shot with a model served on your local laptop is a very probabilistic gamble: you may get lucky, but more likely the model gets confused and fails to converge. Some of the failures are associated with malformed tool calling that is likely to be addressed by the inference software. However, overall performance on agentic tasks – that are crucial for app.build needs – is still lagging behind closed models.

We’re certain the next generation of open source models runnable on consumer hardware will get closer to production-ready experience. For now, we consider them applicable for less autonomous use cases rather than generating full apps in a single run.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/app-build-supports-open-source-models-locally/ad4nxcvzz4hns3qpmje31gkeetssvwcyqhfk3smxkkq8dbg0h1rppl03zbi8oxa0yqliwjqdy69fded-3nqr0pqteqxeru3em5vtl8nrzc9zz550bf2va0gocgmssaogfirv2uq41c-20caf76c.png" alt="Image" />
<figcaption><em>A screenshot of the app generated using open weights models</em></figcaption>
</figure>

## Getting Started

We added new environmental variable for the agent configuration forcing it to use non-default models:

```bash
LLM_BEST_CODING_MODEL=openrouter:qwen/qwen3-coder
LLM_UNIVERSAL_MODEL=openrouter:z-ai/glm-4.5-air uv run generate "make me another todo app but make it stylized to Roman Empire because I think about it too often"
```

For local inference use `ollama:vendor/model` and `lmstudio:host` variables (`lmstudio:` with no host works too – we like reasonable defaults).

## The Bottom Line

Local LLM support gives you the freedom to experiment, prototype, and build without vendor lock-in, cost anxiety, or data sharing concerns. Combined with the rapid improvement of open source models, local app generation is not quite a viable alternative to cloud APIs, but getting there quickly.

---

[Try app.build locally](https://github.com/appdotbuild/agent/) _or use our_ [managed service](https://app.build/) _for free. If you’re interested in building something similar, [check out the code (](https://github.com/appdotbuild/agent) and contribute!)._
