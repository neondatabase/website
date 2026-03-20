---
title: Under the hood of a deploy-agent API that works across any runtime environment
description: >-
  How we designed a single controller to deploy AI agents across the xpander.ai
  cloud and customer clusters, with the same developer experience
excerpt: >-
  When we started building xpander.ai’s agent platform, one of our core promises
  to enterprise customers was freedom of deployment. Some wanted to run agents
  entirely inside xpander cloud, using our managed infrastructure. Others needed
  to host agents on their own Kubernetes cluste...
date: '2025-10-27T16:13:17'
updatedOn: '2025-10-27T16:14:30'
category: community
categories:
  - community
  - ai
authors:
  - ran-sheinberg
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/deploy-agent-api-xpander/cover.jpg
  alt: null
isFeatured: true
seo:
  title: >-
    Under the hood of a deploy-agent API that works across any runtime
    environment - Neon
  description: >-
    Learn how xpander solved a tricky problem for agent platforms: how to make
    deploying AI agents feel identical across clouds and clusters.
  keywords: []
  noindex: false
  ogTitle: >-
    Under the hood of a deploy-agent API that works across any runtime
    environment - Neon
  ogDescription: >-
    Learn how xpander solved a tricky problem for agent platforms: how to make
    deploying AI agents feel identical across clouds and clusters.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/deploy-agent-api-xpander/social.png
source:
  wpId: 11312
  wpSlug: deploy-agent-api-xpander
  exportedAt: '2026-03-20T13:31:00.745Z'
---

<Admonition type="info" title="Agent Builders x Neon">
This post was created in collaboration with [xpander.ai](https://neon.com/blog/xpander-ai-agents-slack-neon-backend), as part of our agent builders series - where agent platform teams share how they built, scaled, and refined their systems.
</Admonition>

When we started building [xpander.ai](https://xpander.ai)’s agent platform, one of our core promises to enterprise customers was freedom of deployment. Some wanted to run agents entirely inside xpander cloud, using our managed infrastructure. Others needed to host agents on their own Kubernetes clusters – be it simply in a cloud VPC, private clouds, on-premise environments, edge locations, etc.

That raised a big question:

**How do we make deploying a AI agents feel identical, whether it runs on our cloud or theirs?**

We did not want separate SDKs, different APIs, or special build steps. We wanted one upload, one deploy call, and one consistent lifecycle across every environment – whether the developer calls the deploy API themselves, or their CI/CD pipeline calls it.

This post explains how we made that happen through what we now call our deploy-agent API, and how a complex, multi-environment system is abstracted under this single API call.

## The Problem: Two Environments, One Experience

A typical AI agent runtime at xpander runs as a containerized microservice. Developers can extend, fine-tune, or ship their own agents, often uploading gzipped Docker image archives (`.tar.gz`) produced by their local builds.

But the deployment flow looked very different depending on where it lived:

- Cloud tenants needed to stream those images from S3 → ECR → Kubernetes, with AWS credentials and multi-tenant registry management.
- Self deployed tenants uploaded their images directly to local Docker registries, where our system had no access.

That duality created a maintenance problem. Different storage systems, network rules, authentication methods, and Kubernetes contexts meant two entirely separate workflows. We knew we could not maintain that in the long term.

So we asked: _What would it take to make both flows converge into one API surface?_

## The Design Principle: Mirror, Don’t Fork

Our guiding design principle became:

**Same inputs, same outputs, different under the hood.**

We built a single deploy-agent API that handled every container lifecycle event – upload, deploy, start, stop, and logs – and routed requests dynamically based on tenant type.

When a developer uploads an agent or a CI/CD pipeline calls the API, the same endpoint runs:

```bash
POST /api/deploy-agent
```

The controller checks the environment which is configured as the runtime for that specific agent:

- If it is a cloud environment, it returns a presigned S3 URL so the image can be uploaded directly to S3.
- If it is a self-deployed, it exposes a loopback upload stream, decompresses the tarball locally, and pushes it into the private registry running on the customer’s Kubernetes cluster, which was deployed by our engine (Helm chart).

The code paths then come together again. Both result in a validated image reference and a standardized call to `apply_agent_container()`, the asynchronous function that launches the Kubernetes job.

From a user perspective, and for the rest of our backend, the deployment process is completely environment-agnostic.

## Under the Hood: Two Paths That Look Like One

Here is what happens behind the curtain.

### Cloud Path (S3 → ECR → Kubernetes)

1. The controller streams the uploaded image from S3 directly into ECR using an `aws | skopeo copy` pipeline. No temporary disk writes and no Docker daemon.<br />
2. Credentials are injected securely from AWS ECR tokens, then redacted from logs before storage.<br />
3. Once uploaded, we mark the deployment in our registry, start the Kubernetes Job, and update the state: `Starting → Up`.

### Self-deployed environment Path (Upload → Local Registry → Kubernetes)

1. The controller accepts the file stream and decompresses the `.tar.gz` archive on disk.<br />
2. It uses skopeo again – same command, same logic – to push the uncompressed tar into a local registry. The only difference is that it skips AWS and disables TLS verification for air-gapped setups.<br />
3. From here, it triggers the same downstream logic, `apply_agent_container()` and `start_agent_container()`, to run the agent pod.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/deploy-agent-api-xpander/image-3-1024x802-e65777e1.png" alt="Image" />
<figcaption>Same API, different plumbing.</figcaption>
</figure>

## Bridging to Kubernetes Safely

Both flows converge when creating the Kubernetes Job (which is the actual agent container runtime)

Here is what makes that piece both tricky and elegant:

- The controller loads the kubeconfig context from base64-encoded environment variables.
  - For xpander cloud, it connects to our shared managed cluster.
  - For self-deploy, it uses the customer’s own context and credentials.
- It injects organization-scoped secrets and environment variables, so every agent pod runs with its own API keys and configuration.
- It waits for pod startup, monitors crash loops, and updates the registry with the result.

This context-loading method lets us dynamically switch clusters for each request. No static config files and no persistent Kubernetes clients. It is a full multi-cluster orchestrator written in Python.

## Making It Observable

Once the pod is live, developers need logs, ideally in real time.

The challenge was that the Kubernetes Python client’s log stream is blocking, while our API server uses FastAPI’s asynchronous event loop.

To fix that, we built a threaded log streamer. It tails logs in a background thread, pushes lines into an `asyncio.Queue`, and exposes them over Server-Sent Events (SSE) to the UI.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/deploy-agent-api-xpander/image-4-1024x508-e26b01e8.png" alt="Image" />
<figcaption>Agent execution logs shown in the xpander AI Workbench</figcaption>
</figure>

For longer debugging sessions, we can backfill logs from S3 for historical context. Whether your agent runs in xpander cloud or in your own cluster, `GET /agents/\{id\}/logs` just works – same endpoint, same interface.

## Why This Matters

For us, this was not just an architectural exercise.

Unifying cloud and on-prem orchestration gives customers tangible benefits:

- **Predictability** – one deploy-agent API with consistent behavior everywhere.
- **Security** – credentials never leave tenant boundaries and there are no cross-cloud assumptions.
- **Portability** – agents can move from our cloud to theirs with no rebuild or code change.
- **Maintainability** – our engineering team maintains one pipeline instead of two.

It is one of those engineering decisions that is invisible when it works, but transformative for scale.

## Closing Thoughts

In the end, our deploy-agent API became the foundation for xpander’s agent infrastructure when it comes deployment DevEx and CI/CD integration.

Whether a customer deploys 10 agents in xpander cloud or 1,000 agents across self-hosted clusters, the workflow stays the same – simple, secure, and transparent.

When we say _“run agents anywhere”_, this is what makes it possible.

[xpander.ai](https://xpander.ai) **is the ultimate agent toolbox: memory, tools, MCP, storage, slack integrations. Get a production-ready backend for your agents** [via their Free Plan](https://app.xpander.ai/signup).

<Admonition type="important" title="Apply to the Neon Agent Plan">
If you're building your own agent platform and need a backend, [take a look at Neon's Agent Plan.](https://neon.com/use-cases/ai-agents) Get special pricing, resource limits, and assistance to get your platform up and running.
</Admonition>
