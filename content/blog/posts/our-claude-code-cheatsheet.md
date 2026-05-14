---
title: Our Claude Code Cheatsheet
description: A few tricks learned from using Claude Code every day at Neon
excerpt: >-
  Many of us at Neon use Claude Code almost every day: for debugging, for
  scaffolding new features, or keeping the flow going when context-switching
  between projects. I noticed pretty quickly that everyone seemed to have their
  own way of working with it though. For me, it clicked o...
date: "2025-10-14T15:54:54"
updatedOn: "2025-10-20T16:35:05"
category: engineering
categories:
  - engineering
  - ai
authors:
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/our-claude-code-cheatsheet/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Our Claude Code Cheatsheet - Neon
  description: >-
    Claude Code is part of our daily workflow at Neon. Here’s a practical
    cheatsheet of the features, commands, and tweaks we rely on most.
  keywords: []
  noindex: false
  ogTitle: Our Claude Code Cheatsheet - Neon
  ogDescription: >-
    Claude Code is part of our daily workflow at Neon. Here’s a practical
    cheatsheet of the features, commands, and tweaks we rely on most.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/our-claude-code-cheatsheet/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/our-claude-code-cheatsheet/neon-claude-code-1024x576-e4ec1202.jpg)

Many of us at Neon use Claude Code almost every day: for debugging, for scaffolding new features, or keeping the flow going when context-switching between projects. I noticed pretty quickly that everyone seemed to have their own way of working with it though.

For me, it clicked once I started experimenting with configuration, memory files, and a few add-ons. I kept jotting down notes in Apple Notes as I figured out what worked best. Over time, those notes turned into a cheatsheet – part reference, part personal workflow guide.

[I figured it might be useful to share with others](https://gist.github.com/pffigueiredo/252bac8c731f7e8a2fc268c8a965a963#file-claude-code-sheet-md), so in this post, I’ll walk through it, with a bit of commentary on why they matter and how I use them in practice.

## Plan Mode

One of the first things I figured out is that Claude Code isn’t just one “mode”. You can nudge it into different ways of thinking. I use Plan Mode (Shift + Tab + Tab) whenever I want Claude to step back and outline a bigger approach before diving into code. It’s almost like asking it to whiteboard the solution first. This might not look like much, but using Plan Mode first, really is a difference maker and will produce code that covers a lot more use cases and with much less bugs. Also it gives the developer an opportunity to go back and forth with Claude Code before actually adding the code changes to the codebase.

## Multi-Agent Workflows

Sometimes one perspective isn’t enough. Claude Code actually makes it easy to spin up multiple agents in parallel, each with its own “personality” or point of view.

I like to run up to 15 task agents at once, asking each of them to review the same code but from a different lens: security-obsessed reviewer, pedantic style checker, performance tuner, etc. It’s like having a room full of very opinionated engineers, each pointing out something you might have missed.

For more complex setups, it’s very handy to use tools like [Claude Swarm](https://github.com/parruda/claude-swarm), [Conductor](https://conductor.build/) and [Sculptor](https://imbue.com/sculptor/), which are all very useful to run Claude Code in parallel in different ways.

I don’t always use this, since it’s overkill for a quick refactor. But when I’m working on things like prompt testing, a tricky change or something that touches a lot of systems, getting a chorus of feedback and multiple generations at once is surprisingly effective.

## Managing Context

**Claude is only as good as the context you give it.** This looks like something simple to understand, and yet, we all fail at it at some point, by not being extremely explicit about our requirements and how we want things to be done, or sometimes, by keeping context that is no longer relevant for the current task.

The two commands I use constantly are:

- `/clear` → wipes the slate clean when the session gets too noisy
- `/compact` → instead of throwing everything away, it summarizes the chat so you keep the essence without the bloat
- `/context` → it’s really handy to understand what’s taking up space in your context

For bigger inputs, I’ve found it’s much better to add text as a file rather than pasting huge blocks directly into the terminal. Drop the text into a new file in your repo, and then reference it with the @filename tag. Claude picks it up instantly, and you keep your chat history readable.

It even works with images: just paste them in with Ctrl + V and they become part of the session context. And when I need to pick up where I left off, `claude -c` continues the last session. It’s like bookmarking a conversation thread so I don’t have to rebuild context from scratch.

## MCP Servers

Out of all the hype about MCP, I’ve landed on just a few that I actually use all the time:

- [Serena](https://github.com/oraios/serena) → This one hooks into your language server and makes “find and replace” work at the symbol level instead of just raw text. In practice, it means Claude can actually follow references, trace functions, and connect code paths semantically instead of fumbling with grep.<br />
- Context7 → Think of this as an always up-to-date library of docs. If I’m using React, Go, or any popular library, it’s in there. Instead of crawling the web or pasting docs, I just tell Claude to look things up through Context7.<br />
- Playwright → This one is for UI testing. Claude can spin up and check UI behavior directly, which is a nice way to validate frontend changes without wiring up a whole test harness.

## Agent Memory

Claude Code feels smarter when it has memory, but it’s important to set it right. By default, it looks for a `CLAUDE.md` file in your project. Drop one in the root of your repo, and suddenly you’ve got a persistent knowledge base that Claude will always reference.

Some folks also use `AGENTS.md`, and there are open PRs asking Anthropic to make that the default. For now though, `CLAUDE.md` takes priority, so that’s the one I rely on.

In practice, I’ll keep multiple memory files depending on the project:

- A high-level `CLAUDE.md` in the repo root describing the packages, overall architecture, and conventions.

More specific files (say, one in `/web`) that go deep on things like routing, API integration, or testing practices.

## Status Line

This one makes a big difference. Claude Code lets you customize a status line, a little strip of info that sits just under the chat input. Mine shows the repo name, current branch, which model I’m using, and how many tokens I’ve burned through.

This is all powered by the `/statusline` command. You can add anything you want:

```bash
/statusline add Model | Git Branch | Tokens | Directory
```

The cool part is you can script it. Claude can generate the bash script for you, drop it into your machine, and run it on startup. That means every time I open Claude Code, I get instant feedback on where I am and what resources I’m using.

![Image](https://cdn.neonapi.io/public/images/pages/blog/our-claude-code-cheatsheet/screenshot-2025-10-14-at-112723percente2percent80percentafam-1024x236-0c076308.png)

## Sub-Agents & Code Surgeons

It seems to me that people are still not aware of the full power of Claude Code sub-agents and why they are such a core piece in AI workflows. These are “specialized helpers” that Claude Code spawns for specific tasks and contexts. And the best part is, they start with a clean context (no clutter, no token bloat) focused solely on the problem you give them and driven by a clear, singular objective.

I’ve built multiple different sub-agents, and the ones I find the most useful are what I calll “code surgeons.” These are sub-agents designed to operate across any codebase, regardless of stack, e.g.

- A codebase analyzer that dives deep into components and dependencies
- A similar examples finder that hunts for patterns across the repo
- A web searcher that steps outside when the local context isn’t enough
- A UI analyzer that uses MCP to verify frontend behavior

## Types First

One habit I’ve picked up is starting with types instead of diving straight into code. Claude Code responds really well when you give it a structure to work from.

That might mean sketching out a DB schema, or writing Zod schemas if I’m in TypeScript, or just laying down the core business model before worrying about implementation details. Once those types are in place, Claude tends to generate code that’s more consistent, easier to reason about, and less likely to drift.

It’s basically the same principle we follow in software design: define the contracts, then fill in the functions. But with Claude, it’s even more powerful because the types act as guardrails for the model.

If you’ve ever had Claude wander off into vague, over-engineered territory, try giving it strong types first. You’ll be surprised at how much cleaner the code output becomes.

## Custom Commands

If you find yourself repeating the same prompts over and over, Claude Code makes it easy to automate them. You can drop Markdown files into a `.claude/commands` folder in your repo, and those become slash commands you can call directly in the terminal.

For example, some I keep handy are

- `/create-plan` to create a very detailed plan in a markdown file of a possible implementation
- `/pr-review` to review a git branch diff in parallel by multiple specialized sub-agents that analyze different aspects of the changes
- `/investigate-codebase` for when I’m working on a new codebase and I don’t have enough context to hand to Claude Code

Each Markdown file can contain a “Front Matter header”, which is where you define things like purpose, arguments and model. So when you type / you’ll actually see hints for your custom commands. And because these live in the repo, you can check them into git so your whole team has the same custom commands available.

## Thinking Modes & Token Windows

Claude has different “thinking modes” you can dial up or down depending on the problem. By default, it just thinks, but you can explicitly push it further:

- `think` → normal reasoning
- `think hard` → more deliberate
- `think harder` → even deeper
- `ultrathink` → full-on heavy reasoning mode

I use these when I want Claude to slow down and really chew on a problem, say, refactoring a tricky async flow or reasoning about trade-offs in a system design.

The other lever is token windows. Claude supports 4k, 8k, 16k, and 32k contexts (roughly). For small, surgical edits, 4k or 8k is plenty. But if I want it to understand an entire module or reason across multiple files, I’ll bump it up to 16k or 32k.

The combination of higher thinking mode + bigger token window can feel like overkill, but when you’re tackling something complex, it’s worth the extra compute and time.

## Headless Mode & Automation

Claude Code isn’t just for interactive chats, you can also run it in headless mode. That means piping the output of another command straight into Claude and saving the results, no UI involved.

One example I use often is with `npm audit`:

```bash
npm audit --json | claude -p "Order the vulnerabilities by the most critical fixes needed" > vulnerabilities.md
```

That takes the audit output, has Claude rank the issues by priority, and writes a nice Markdown report I can drop into a PR or share with the team.

This pattern works with basically anything that spits out JSON or logs. Run the command, pipe it through Claude with a prompt, and capture the output. It’s like having an extra processing step you can insert anywhere in your CLI workflows.

## Session Management

Long coding sessions can get messy, and Claude has a few tricks that make it easier to keep things under control.

- **Resume where you left off**: run `claude --resume` to pick up the last session without reloading context from scratch
- **Undo mistakes**: `/rewind` or just hitting Esc + Esc rolls back the last piece of work
- **YOLO Mode**: launch Claude with `--dangerous-skip-permissions` and it won’t prompt you for every single action. I only use this sparingly (as the name suggests, it’s risky), but it’s handy when I want to move fast in a sandboxed environment

## Cost & Usage Checks

One thing I try to stay mindful of is how much compute I’m burning through. Claude Code makes it pretty painless to check:

- `npx ccusage` → shows overall usage stats
- `/cost` → gives a quick look at the tokens and dollars you’ve spent in the current session
- `/usage` → shows how far you are in your usage percentage

I’ve even added cost to my status line so it’s always visible and I don’t get surprised.

## And That’s It

This cheatsheet is still evolving, and I’m sure I’ll keep adding to it as new features land. If you’ve found other workflows that work for you, I’d love to hear them – share it with us on [Discord](https://discord.gg/92vNTzKDGp). And if you just want the raw reference, here’s the full [Claude Code Cheatsheet](https://gist.github.com/pffigueiredo/252bac8c731f7e8a2fc268c8a965a963).
