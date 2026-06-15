---
title: Neon Platform private preview guide
subtitle: Get started with Neon Functions, Storage, and AI Gateway
enableTableOfContents: true
---

You're in the private preview of the Neon platform. This guide covers what's included, how to get set up, and what to expect.

<YoutubeIframe embedId="xvBlIwoqwuo" />

## What's in the preview

Three new services join Postgres and Neon Auth, all scoped to your branches:

- **Neon Functions**: long-running Node.js compute next to your database. WebSocket servers, SSE streams, AI agents.
- **Neon Storage**: S3-compatible object storage that branches with your data.
- **Neon AI Gateway**: one credential for frontier and open-source models (Claude, GPT, Gemini, and more).

You declare all of it in one `neon.ts` file, and it branches together: fork a branch and you get an isolated copy of your database, files, storage, functions, and gateway.

This is a private preview. Expect rough edges. It's not for production workloads. Build something real and tell us everything that hurts.

## Who has access

Access is a flag on your Neon account. If you received the invite email, your flag should already be set.

Preview services work on **new projects** in **AWS us-east-2** only. They can't be enabled on existing projects.

All usage of Functions, Storage, and AI Gateway during the preview is free, subject to fair usage. After the preview, these services will be included in Neon plans, which may include a free tier.

## Check your access

Go to [console.neon.tech](https://console.neon.tech), create a new project in **US East (Ohio)** (`us-east-2`), and check the left navigation for **Functions**, **Storage**, and **AI Gateway**. If those don't appear, post in [#neon-platform-private-preview](https://discord.com/channels/1176467419317940276/1514002115024916643) on Discord and we'll fix your flag.

## Get started

### 1. Check your CLI version

Confirm `neonctl` is at version 2.26.2 or later:

```bash
npm install -g neonctl@latest
neonctl --version
```

If the version is still older after upgrading, another copy on your `PATH` is shadowing the npm install. Run `which -a neonctl` to find all copies. Homebrew's `neonctl` may be outdated; run `brew uninstall neonctl` if needed.

### 2. Create or navigate to your project directory

```bash
mkdir my-app && cd my-app
```

### 3. Install Neon agent skills

```bash
npx skills add neondatabase/agent-skills -s neon -s neon-postgres -s neon-functions -s neon-object-storage -s neon-ai-gateway -y
```

You can also let your agent install them during setup.

### 4. Set up with an agent

Paste this prompt into your AI agent:

```text
I'm part of the Neon Platform private preview (Neon Functions, Object Storage,
and AI Gateway, all branch-scoped and configured via a neon.ts file).

Set up Neon in this directory:

1. Install or upgrade the CLI: npm install -g neonctl@latest
   Then verify `neonctl --version` reports 2.26.2 or later. If it's older, an
   outdated copy (often Homebrew's) is shadowing it; check `which -a neonctl`.
2. Run and follow the setup flow: `neonctl init --preview`

Notes:
- Signing in opens a browser window; I'll complete the OAuth step myself.
- Create a new Neon project in AWS us-east-2 (the only preview region). Preview
  services don't work on existing projects created before this functionality was added.
- If offered a starter template, ask me whether I want one before proceeding.
  Installing one is recommended.
- The Neon agent skills may already be installed. If not, run:
  npx skills add neondatabase/agent-skills -s neon -s neon-postgres -s neon-functions -s neon-object-storage -s neon-ai-gateway -y
- If any command fails with a message about preview access, stop and tell me;
  I may need my account flag fixed.
- Platform features are free during preview (free and paid orgs), subject to fair usage.
- Use the Neon skills as docs.
```

## Bootstrap from a template

As an alternative to agent-driven setup, scaffold a starter template with `neonctl bootstrap`:

```bash
neonctl bootstrap
```

Use `--template` to skip the interactive picker:

| Template        | What it builds                                                                         |
| --------------- | -------------------------------------------------------------------------------------- |
| `hono`          | REST API with Drizzle and Postgres on Neon Functions                                   |
| `ai-sdk`        | Image-generation agent with AI Gateway, Object Storage, and Postgres on Neon Functions |
| `mastra`        | Personal assistant with AI Gateway and Postgres-backed memory on Neon Functions        |
| `realtime-chat` | Realtime chat with Next.js, Neon Auth, and WebSockets on Neon Functions                |
| `realtime-sse`  | Realtime counter with TanStack Router and SSE on Neon Functions                        |

Then follow the README to set up and deploy. Browse all templates at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/).

## Dev loop

| Command                     | What it does                                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `neonctl link`              | Connect a directory to a Neon project (one-time setup)                                                          |
| `neonctl checkout <branch>` | Create and switch to another branch                                                                             |
| Edit `neon.ts`              | Declare your infra: functions, buckets, AI Gateway ([about neon.ts](https://neon.com/blog/introducing-neon-ts)) |
| `neonctl deploy`            | Apply `neon.ts` to the checked-out branch, deploy functions, and refresh local env vars                         |
| `neonctl dev`               | Run your functions locally with hot reload                                                                      |

The loop is the same whichever services you use. `neonctl dev` only matters when functions are in play.

Keep the CLI up to date: run `npm i -g neonctl@latest` before each session and before reporting a bug. The preview CLI updates frequently.

## Docs

Docs are evolving daily during the preview. Use the Neon agent skills as your primary reference.

- [Neon Functions](/docs/compute/functions/overview): overview, get started, neon.ts reference, runtime limits
- [Neon Storage](/docs/storage/overview): buckets, objects, S3 compatibility
- [Neon AI Gateway](/docs/ai-gateway/overview): get started, model catalog, SDK dialects
- [Model catalog on models.dev](https://models.dev/providers/neon): every model ID the gateway serves

For inspiration, see [Build on Neon](https://build-on-neon.vercel.app/): an index of demo apps built on the full platform stack.

Related source code: [neonctl](https://github.com/neondatabase/neonctl) and [neon-pkgs](https://github.com/neondatabase/neon-pkgs).

## Known limitations

- New projects in AWS us-east-2 only. Existing projects don't work.
- Functions: memory is fixed at 2048 MiB.
- Logs from deployed functions can't be retrieved yet. Use `neonctl dev` during development, and have deployed functions write diagnostics to Postgres. Error trackers work today: `@sentry/node` bundles and runs fine; set `SENTRY_DSN` as a deploy-time env var.
- The console UI is read-only for preview services. The CLI is the configuration surface.

## Feedback

Post in [#neon-platform-private-preview](https://discord.com/channels/1176467419317940276/1514002115024916643) on Discord: bugs, confusion, docs gaps, feature requests, and what you build. We run office hours and user interviews throughout the preview. Details in the channel.

Tell us what you build. We'd love to feature it.

<NeedHelp/>
