---
title: Getting Started with Claude Skills
description: Neon’s first set of skills are now available to install
excerpt: >-
  When Anthropic introduced Claude Skills, of course we tried it right away.
  This post walks through how we built, tested, and published our first set of
  Claude Skills for Neon, bundled into a plugin that includes four ready-to-use
  Skills and an MCP server integration. What’s a Cla...
date: '2025-10-30T16:43:28'
updatedOn: '2026-01-16T13:30:00'
category: ai
categories:
  - ai
authors:
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/getting-started-with-claude-skills/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Getting Started with Claude Skills - Neon
  description: >-
    A hands-on introduction to Claude Skills: what they are, how they work, and
    how you can start incorporating them into your Neon workflows.
  keywords: []
  noindex: false
  ogTitle: Getting Started with Claude Skills - Neon
  ogDescription: >-
    A hands-on introduction to Claude Skills: what they are, how they work, and
    how you can start incorporating them into your Neon workflows.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/getting-started-with-claude-skills/social.jpg
---

<img src="https://cdn.neonapi.io/public/images/pages/blog/getting-started-with-claude-skills/neon-claude-skills-1-1024x576-f9433ba7.jpg" alt="Post image" width="1024" height="576" />

[When Anthropic introduced Claude Skills](https://www.anthropic.com/news/skills), of course we tried it right away. This post walks through how we built, tested, and published our first set of Claude Skills for Neon, [bundled into a plugin](https://github.com/neondatabase-labs/ai-rules) that includes four ready-to-use Skills and an MCP server integration.

## What’s a Claude Skill Anyway?

Truth be told, there’s nothing particularly special about a Claude Skill: it’s just a bundle of markdown files with a bunch of instructions.

Each skill lives in its own folder, which contains an entrypoint called `SKILL.md`. You describe a workflow in plain language, usually step by step – something like “copy this file, look for references there, paste it over here.” In a few cases, like image or PDF editing, you can also specify which executables or binaries the workflow should use. But underneath, it’s still just markdown. You can look at some examples of skills that Claude Code has built-in in this [repository](https://github.com/anthropics/skills).

```bash
---
name: edit-images
description: Use this skill whenever the user asks to modify or transform an image.
tools: [image_editor]
---

1. Open the target image file.
2. Apply the requested transformation.
3. Save the modified image to the same directory.
```

## The Anatomy of a Claude Skill

The most interesting aspect of Skills is not their anatomy, but rather the way in which Claude manages them. Instead of fully loading every skill’s workflow, Claude maintains only the name and description of each skill within its global context. When a specific skill is required, Claude then dynamically loads the complete workflow, ensuring the system remains efficient and resources are utilized only as needed.

![Image](https://cdn.neonapi.io/public/images/pages/blog/getting-started-with-claude-skills/scheme-2-1024x399-69c6ad62.png)

So if you ask it, “can you edit this image and make it a bit taller?”, it looks at the Skill descriptions, finds one that matches (“use this skill whenever you need to edit an image”), loads the file, and follows the steps inside.

It’s a simple idea, but powerful. Instead of constantly re-explaining the same workflow, you can define it once and let Claude decide when to apply it.

|                                                                                                                | `skills.md` | MCP server | Custom commands | `CLAUDE.md` / `AGENTS.md` |
| -------------------------------------------------------------------------------------------------------------- | ----------- | ---------- | --------------- | ------------------------- |
| API integration                                                                                                |             | ✅         |                 |                           |
| Best practices / Global rules<br />_– Always use absolute imports_<br />_– Use functional components_          |             |            |                 | ✅                        |
| Reusable workflows with code execution<br />_– Create a PR<br />– Do data analysis<br />– Format this project_ | ✅          |            | ✅              |                           |

At Neon, we were already using repeatable workflows (e.g. setting up Drizzle, creating databases, adding best-practice docs) so skills gave us a clean way to package all that into reusable, self-contained guides inside Claude Code.

## Skills vs. Commands vs. Sub-agents

When we first started experimenting with Skills, we realized they sit right between custom commands and full agents. If you look at Anthropic’s model, it’s kind of a spectrum:

```bash
 Commands → Skills → Subagents
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/getting-started-with-claude-skills/scheme-1-1024x486-948b9cab.png)

- A command is something like `/summarize` or `/refactor`, where every input and output is tightly controlled by the developer.
- A skill is more like a workflow, a markdown file that tells Claude how to approach a task, but still leaves room for interpretation.
- A subagent is basically another Claude instance spun up to reason independently on a problem, that has its own context window.

Commands are deterministic: you tell Claude exactly what and when to do something, and it executes that action once. Subagents are the opposite: they’re autonomous and can make decisions on their own. Skills live somewhere in the middle.

|                | `skills.md`                                                                                       | Subagents                                                  |
| -------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Model          | Inherit                                                                                           | Customizable                                               |
| Context window | Shared with main agent thread<br />Only the metadata is included by default in the context window | New context window on every invocation                     |
| Trigger        | Model invoked (differs from custom commands)                                                      | Model invoked                                              |
| Parallelism    | Sequential (it’s just tool calls)                                                                 | Can run in parallel                                        |
| Use case       | Low context size Workflows, template-driven                                                       | Independent reasoning, tasks that require a lot of context |

So when you say “edit this image” or “connect my project to Neon,” Claude checks if it already knows a workflow that matches that description. If it finds one, it pulls in the Skill and executes the steps. That’s what makes skills interesting, they feel structured enough to be predictable, but flexible enough to adapt to context.

|                                                        | `skills.md` | custom commands | Reasoning                                                                                                                                                                |
| ------------------------------------------------------ | ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Automating multi-step workflows                        | ✅          |                 | Custom commands don’t allow automating, they need user intervention                                                                                                      |
| Bundling scripts/resources                             | ✅          |                 | They need multiple files and scripts, custom commands only allow a single file or disperse files across the project                                                      |
| Simple modifications (can be defined in a single file) |             | ✅              | This can be done in a single file and usually we want them to be a one time thing                                                                                        |
| High risk actions                                      |             | ✅              | For “high risk” actions like deploying, it’s better not to allow direct access for the agent and have them manually triggered instead                                    |
| Context-aware, triggered by Claude                     | ✅          |                 | Custom commands are not as deeply integrated with the CC session context as `skills.md`, since these are invoked by the model and have the required context for the task |

## The Neon AI Rules Plugin

<Admonition type="tip" title="About Neon">
If you’re new to Neon: it’s a serverless Postgres platform with instant provisioning, autoscaling, and branching - plus a generous Free Plan. Neon powers tens of thousands of databases for developers and AI agents, with over 40,000 new databases created every day. [Take a look.](https://neon.com/)
</Admonition>

Once we got comfortable with how skills worked, we wanted to see what it would look like to actually bundle them into something reusable – that’s how the Neon AI Rules plugin came together:

[https://github.com/neondatabase-labs/ai-rules](https://github.com/neondatabase-labs/ai-rules)

The idea was to create a small marketplace for Claude Code where we could group multiple Neon plugins, starting with just one. Inside that plugin, we included four Claude skills plus an MCP server to handle API interactions.

```bash
/plugin marketplace add neondatabase-labs/ai-rules
```

The marketplace acts like a container. You can add other things to it later:

- Commands, for quick single-step actions
- Subagents, for more autonomous tasks
- Hooks, to integrate with Claude Code itself

For now, we kept it minimal and published a single plugin called Neon. It’s already available in Claude Code, and once you install it, you get everything preloaded – the four Neon Skills and a Neon MCP server.

```bash
/plugin install neon-plugin@neon
```

The MCP (Model Context Protocol) part is important. It’s what gives Claude runtime access to Neon’s APIs, things like checking project info, creating new databases, or validating a schema connection. Every tool inside Claude Code can now talk directly to Neon through that MCP interface.

## Installing the Neon Plugin in Claude Code

Getting the Neon plugin running inside Claude Code is pretty straightforward. It follows the same flow you’d use for any other marketplace plugin. You open Claude Code, go through the Quick Start, and add the Neon Marketplace. From there, just install the Neon plugin and restart Claude Code. That’s it.

Once it’s up, Claude automatically detects the Neon MCP connection, so every tool inside Claude Code can talk to Neon. You can even ask Claude, “what skills do you have access to?”, and it will list the Neon ones. All installation steps (and details on how the marketplace works) are in the [AI Rules README](https://github.com/neondatabase-labs/ai-rules#readme).

## The Four Neon Skills

We plan to keep expanding this, but by now, there’s four skills bundled into the plugin:

### neon-drizzle

This Skill explains how to connect Drizzle ORM to a Neon database. It walks through different flows depending on what you’re doing: setting up a new project, connecting an existing one, or updating a schema. The steps handle scaffolding, schema creation, and connection setup automatically. You can just ask Claude Code for something like “Integrate Neon with Drizzle” and Claude knows what to do.

### neon-serverless

This one focuses on integrating Neon’s serverless driver. It teaches Claude how to set up the connection string, configure environment variables, and test queries. It’s all about connecting your app to Neon’s compute/storage-separated architecture with minimal boilerplate.

### neon-toolkit

This is a set of workflows around Neon’s Management API – creating and managing databases, provisioning projects, or fetching connection URLs. It’s the skill you’d want if you’re building automation on top of Neon or provisioning resources dynamically inside Claude Code.

### add-neon-knowledge

This one covers Neon’s best practices and docs. It helps Claude include relevant documentation snippets or usage patterns in its responses. It’s the “Neon brain”, a way to give Claude contextual knowledge about how Neon is typically used, directly from our documentation and internal examples.

## Wrap Up

Over time, the plan is to expand the marketplace with more plugins, subagents, and specialized workflows that cover more of Neon’s developer stack. [Explore the full setup and code](https://github.com/neondatabase-labs/ai-rules) and reach us in Discord if you have any questions.

---

_More good stuff:_

- _[Check out this Claude Code Cheatsheet](https://neon.com/blog/our-claude-code-cheatsheet)_
- _And if you need a Postgres database for your personal projects, side gig, or startup, [give Neon a try](https://console.neon.tech/signup)_
