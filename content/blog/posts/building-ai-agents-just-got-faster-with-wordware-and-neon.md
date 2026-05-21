---
title: Building AI agents just got faster with Wordware (and Neon)
description: >-
  Wordware enables anyone to develop, iterate, and deploy useful AI Agents.
  Built on Neon
excerpt: >-
  “Wordware is all about building and iterating quickly, so there’s alignment
  with Neon. With Neon’s preview branches, we can catch issues early (like a
  migration breaking on a copy of the main database) and fix them before they
  hit production. By spotting and fixing problems ear...
date: '2024-08-19T15:23:42'
updatedOn: '2024-08-29T18:10:13'
category: community
categories:
  - community
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-ai-agents-just-got-faster-with-wordware-and-neon/cover.png
  alt: null
isFeatured: false
seo:
  title: Building AI agents just got faster with Wordware (and Neon) - Neon
  description: >-
    Wordware has built an IDE for prompt engineering, allowing you to build
    useful AI Agents much faster. Backed by Neon.
  keywords: []
  noindex: false
  ogTitle: Building AI agents just got faster with Wordware (and Neon) - Neon
  ogDescription: >-
    Wordware has built an IDE for prompt engineering, allowing you to build
    useful AI Agents much faster. Backed by Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-ai-agents-just-got-faster-with-wordware-and-neon/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/building-ai-agents-just-got-faster-with-wordware-and-neon/screenshot-2024-08-19-at-83009percente2percent80percentafam-1024x523-be6395b1.png)

<blockquote>
<p><strong>“Wordware is all about building and iterating quickly, so there’s alignment with Neon. With Neon’s preview branches, we can catch issues early (like a migration breaking on a copy of the main database) and fix them before they hit production. By spotting and fixing problems early, we can move fast while ensuring stability in production.”</strong></p>
<cite>Robert Chandler, CTO at Wordware.ai</cite>
</blockquote>

[Wordware.ai](https://www.wordware.ai) is set to transform the way you build with AI. Think of it as an IDE for prompt engineering; with its user-friendly, Notion-like interface, it allows you to build AI applications much faster by streamlining the feedback loop through natural language programming. You can create AI agents by writing prompts in plain English, iterating with your team on the results while Wordware handles the heavy lifting. To help you get started quickly, Wordware also offers a variety of useful templates:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/building-ai-agents-just-got-faster-with-wordware-and-neon/wordware-templates-27313961.gif)

## The origin story

The Wordware cofounders, [Robert](https://www.linkedin.com/in/robertjhchandler/) and [Filip](https://www.linkedin.com/in/filipkozera/), began working with AI almost a decade ago. Shortly after they met at Cambridge, Filip focused on augmenting human memory, _battling_ with GPT-2—while Robert joined [Five AI,](https://www.five.ai/) helping it grow before its acquisition by Bosch.

Inspired by their personal experiences (and challenges) in building AI products, they started working on a project together. A turning point came with the release of the new GPT models, which showcased unprecedented reasoning capabilities in AI. For several months, Robert and Filip focused on building AI agents and experimenting with various technologies and frameworks.

## Building better agents by iterating with expert feedback

<blockquote>
<p>“If prompting is the new programming, tools must involve domain experts and enable rapid iteration. You want the fastest possible cycle between changing the prompt, running it, and reviewing the output. This prompt-first approach allows domain experts and engineers to iterate together, making the AI development environment both efficient and effective”</p>
<cite>Robert Chandler, CTO at Wordware.ai</cite>
</blockquote>

During these exploratory months, the cofounders expected to spend much of their time building amazing AI products. Instead, they discovered that working with AI often meant getting lost in implementation details.

The key to creating effective AI agents lay in crafting high-quality prompts, yet most AI tech based on LLMs buried the prompts deep within highly complex code, slowing down the refinement process. The Wordware cofounders realized that by doing the opposite—streamlining the process of refining prompts with human feedback—the development of useful AI agents could be much faster.

What engineers needed was an environment that allowed them to involve domain experts directly in the development process (e.g., salespeople for sales agents, lawyers for legal assistants) to incorporate their feedback and continuously refine the prompts.

And just like that, Wordware was born. The result is a web-based IDE for building AI apps that feels intuitive and familiar, much like Notion. It facilitates collaboration between engineers and domain experts, improving the quality of the final product—the AI agent—while speeding up development.

## How Wordware uses Neon to ship faster and safer

Since Wordware is all about building and iterating quickly, their architecture couldn’t fall behind. When they discovered Neon, it was a match.

[Neon](https://neon.tech/) is a serverless Postgres database that prioritizes development speed. With serverless features like scale-to-zero and autoscaling, it saves developers the hassle of sizing servers and paying for unused capacity.

On top of it, Neon’s [native database branching capabilities via copy-on-write](https://neon.tech/docs/introduction/branching) allow Wordware to instantly create previews on real data with minimal setup. The compounded value of this feature is “immense”, they said—it enables them to identify and fix problems early, preventing major system outages and reducing the need for emergency fixes.

<blockquote>
<p><strong>“Creating previews on real data gives us another level of confidence that, when we merge changes into prod, things will actually work. In Wordware, everything – from Stripe webhooks to just new code that’s being run— gets put on some preview URL using a Neon branch”</strong></p>
<cite>(Robert Chandler, CTO at Wordware.ai</cite>
</blockquote>

Wordware’s development workflow is designed for speed and efficiency, focusing on minimizing friction to maximize velocity:

- When a developer picks up a ticket in Linear, they create a new Git branch for their work. As soon as they push this branch, it gets deployed as a fresh instance via [Vercel](https://neon.tech/docs/guides/vercel).
- This deployment process includes hooking up a new Neon branch for the database, making the environment an exact copy of production. [Everything is set up automatically](https://neon.tech/flow).
- Every change, whether it’s code, environment variables, or database migrations, is deployed to a preview URL.
- The team can then review and test the merge request without having to check out the code or configure their local environments. This setup allows anyone to run and interact with the new feature without any manual set up, ensuring any issues are identified early.

As developers continue to make changes and push updates, these get built and deployed continuously. This rapid feedback loop helps Wordware catch bugs as soon as they emerge, highlighting any differences between local and production environments.

## The flexibility of Postgres, but serverless

<blockquote>
<p>“Neon is truly serverless. In some “serverless” databases, you still pay for reserved capacity, and that’s not very helpful if you want to use branch-based development. What you need is the ability to quickly spin up branches and test them in real production settings”</p>
<cite>Robert Chandler, CTO at Wordware.ai</cite>
</blockquote>

Another area where Neon and Wordware align is in their serverless approach. Wordware is built on serverless architecture; serverless unlocks scalability without the need to manage infrastructure, and Neon brings the serverless experience to Postgres. Neon has an [API-first feel](https://neon.tech/docs/reference/api-reference), robust [connection pooling](https://neon.tech/docs/connect/connection-pooling), and works seamlessly with an architecture that relies heavily on AWS Lambdas, like Wordware’s.

Neon’s uniqueness lies in its ability to apply serverless practices while maintaining the flexibility of traditional Postgres. While other serverless databases like DynamoDB excel at scale by enforcing specific access patterns through a key-value store architecture, this can be limiting during the early stages of a startup. In DynamoDB, adding new records requires careful planning on how they will be read, written, updated, and queried. Running joins is challenging, and denormalizing data can be cumbersome.

In contrast, Neon is just Postgres—without the server management. It offers the flexibility and compatibility essential in early development, allowing Wordware to leverage Postgres fully without giving up a serverless experience to build and scale fast.

<blockquote>
<p>“I love DynamoDB at scale, if you know what your access patterns are going to be—but when you’re early in a startup, you don’t always know. That’s when you need Postgres”</p>
<cite>Robert Chandler, CTO at Wordware.ai</cite>
</blockquote>

## Try it out: build your first AI app

Both Wordware and Neon have free plans. [Click here](https://app.wordware.ai/register) to get started with Wordware, and [create a Neon account](https://console.neon.tech/signup) to get the feel for serverless Postgres.

PS: Want to play with an app built on Wordware? Check this out: [https://twitter.wordware.ai](https://twitter.wordware.ai/)

![Post image](https://cdn.neonapi.io/public/images/pages/blog/building-ai-agents-just-got-faster-with-wordware-and-neon/screenshot-2024-08-16-at-105522percente2percent80percentafam-1024x581-f68e8983.png)
