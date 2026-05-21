---
title: Agent Skills in 2026
description: Reusable knowledge and workflows for coding agents
excerpt: >-
  2026 is starting off hot, and skills are suddenly everywhere. The Agent Skills
  spec is now supported across all major coding agents and increasingly adopted
  by developer tools, including Neon. But let’s start from the beginning. The
  origins of agent skills The concept of agent sk...
date: "2026-01-22T18:13:30"
updatedOn: "2026-01-22T18:50:37"
category: ai
categories:
  - ai
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/agent-skills-in-2026/cover.png
  alt: null
isFeatured: true
seo:
  title: Agent Skills in 2026 - Neon
  description: >-
    Agent Skills are becoming the standard for AI coding agents. Learn how they
    work, why they matter, and how Neon is adopting them.
  keywords: []
  noindex: false
  ogTitle: Agent Skills in 2026 - Neon
  ogDescription: >-
    Agent Skills are becoming the standard for AI coding agents. Learn how they
    work, why they matter, and how Neon is adopting them.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/agent-skills-in-2026/social.png
---

<figure>
<video autoPlay muted loop playsInline width="1280" height="1000" src="https://cdn.neonapi.io/public/videos/pages/blog/agent-skills-in-2026/vznem2syffde6jmh-75457a6b.mp4"></video>
</figure>

2026 is starting off hot, and **skills** are suddenly everywhere. The [Agent Skills](https://agentskills.io/specification) spec is now supported across all major coding agents and [increasingly adopted by developer tools](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem), [including Neon](https://github.com/neondatabase/agent-skills).

But let’s start from the beginning.

## The origins of agent skills

The concept of agent skills didn’t arrive fully formed:

- [Anthropic published the skills spec](https://github.com/anthropics/skills), and initially [only Claude Code supported it](https://code.claude.com/docs/en/skills).
- [Cursor had skill support behind a feature flag](https://cursor.com/docs/context/skills) for a few weeks but distribution was an issue.
- Claude Code has plugins for distribution, but how do you share skills for Cursor users?
- This problem was solved early this year, when [Vercel published a large React best-practices skill](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem) and simultaneously introduced the `npx skills` CLI, which finally solved the distribution problem.

<EmbedTweet url="https://twitter.com/rauchg/status/2012345679721771474?ref_src=twsrc%5Etfw" />

- Now skills can be shared by just publishing them in a public GitHub repository, and every major harness (Claude Code, Cursor, VS Code, OpenCode, Antigravity) can be selected and configured by npx skills.

## **What agent skills are (and why they matter)**

With the ecosystem in place, the shape of agent skills has become clear:

- Agent skills package instructions, scripts, and references into a folder that an agent can load when needed.
- The core of every skill is the `SKILL.md` file, which acts as the entry point and gives the agent a high-level map of what the skill can do.
- When a task matches, the agent pulls in more detailed guidance on demand. This design keeps context small and helps the agent follow a structured workflow.

What’s special about skills (compared to most previous rule or prompt-based setups) is that **the spec assumes skills are always known to the agent.** That promise is ultimately up to agent developers to uphold, but if it holds, it gives skill authors a reliable way to steer agent behavior.

This is a meaningful step forward from having to reference MCP resources or invoke slash commands in every prompt just to remind the agent to play by the rules (_pun intended_).

## Our own early work

If you were already coding with AI, the need for something like agent skills (and a way to distribute them) was hard to miss. We felt that pain firsthand at Neon, so before the Agent Skills spec existed, we were already experimenting with a similar idea which we called [“AI rules”.](https://neon.com/blog/ai-rules-bring-neon-context-into-your-editor)

We published [Neon AI Rules](https://neon.com/docs/ai/ai-rules) as a way to give coding agents reliable, structured guidance when working with Neon, starting with agent rules, examples, and a Claude Code plugin for local development. In hindsight, AI Rules surfaced the same underlying need the Agent Skills spec formalizes today.

Since then, we’ve transitioned this work to Agent Skills, reshaping it based on what we’ve learned about authoring skills and adopting the folder structure introduced by Vercel. It’s all skills now, a more portable and accepted standard.

## Introducing neondatabase/agent-skills

So we’re now launching our own skill repository, which lives at [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills). You can install it with:

```bash
npx skills add neondatabase/agent-skills
```

This installs the **`using-neon` skill**, which includes guidelines and best practices for using Neon.

<figure>
<a href="https://github.com/neondatabase/agent-skills">
<img src="https://cdn.neonapi.io/public/images/pages/blog/agent-skills-in-2026/screenshot-2026-01-22-at-100028-am-788x1024-3e4bc534.png" alt="Post image" />
</a>
<figcaption>https://github.com/neondatabase/agent-skills</figcaption>
</figure>

### **Why a single Neon skill**?

You may be wondering why we shipped only one Neon skill instead of one per feature. The reason is simple: **the SKILL.md file is always loaded into the agent’s context** (or is always considered available by the harness). That means we want to keep this file small, stable, and long-lived.

Neon has a large surface area. If we create a top-level skill for every part of Neon, we would either overload the context or force users to install many skills. Both are unnecessary. It’s cleaner to ship one skill that gives a clear overview of Neon and then links into deeper detail.

## Progressive discovery: how the using-neon skill is structured

Modern coding agents are very good at **progressive discovery**, the same pattern you see in UI navigation when moving from `menu → submenu → detail`. Instead of giving the agent everything up front, we let it discover information step by step.

The Neon skill follows this pattern:

1. `SKILL.md` gives a tight overview of what the skill covers.
2. It points to files in a `reference/ directory`.
3. Those reference files point to specific Neon docs pages.
4. The agent is prompted to `curl` the right docs page when it needs details.<br />

This keeps the top-level skill small. It also makes navigation predictable: the agent follows the references like a decision tree until it has the information it needs.

## The docs stay the source of truth

Another reason we rely on progressive discovery is that **skills can go stale**. Once a user installs a skill, it lives on disk until they reinstall it with `npx skills add neondatabase/agent-skills`.

That works, but most users won’t update their skills often. If we packed too much static content into the skill, it would drift away from the current state of the Neon API. So instead, we keep the source of truth in one place: [the Neon documentation.](https://neon.com/docs/introduction)

We’ve optimized our docs for AI:

- We publish an `LLMs.txt` file with a list of all documentation. This serves as the index for agents.
- Our docs accept `Accept: text/markdown`, so a simple curl returns clean Markdown.
- We put a lot of thought and our docs in general for a better developer experience which also serves agents well.

The skill’s job is not to copy the docs; its job is to help the agent find and retrieve the right docs page at the right time. This avoids staleness and keeps the skill lightweight.

## How the using-neon skill works with our MCP server

Agent skills and MCPs actually solve different problems, so they work well together:

- The `using-neon` skill provides best practices and instructions for reusable workflows, and decision logic.
- The [Neon MCP](https://github.com/neondatabase/mcp-server-neon) exposes real capabilities as authenticated, structured tools.<br />

In other words: the Neon skill teaches the agent _how_ to work with Neon (how to set up a new project, what connection method to pick based on the project architecture, how to set up different ORMs, how branching workflows looks like). And the MCP server lets the agent _act_ (create branches, inspect projects, list databases, query a database, and so on).

It’s helpful to think of **skills as the reasoning layer**, and **MCP as the capabilities layer**. Both matter, but for different reasons.

## Add using-neon to your project

Thanks to `npx skills`, installing agent skills across coding agents is now straightforward. Check the repository out on GitHub here: [https://github.com/neondatabase/agent-skills](https://github.com/neondatabase/agent-skills), and install our `using-neon` skill using `npx skill add`:

```bash
npx skills add neondatabase/agent-skills
```
