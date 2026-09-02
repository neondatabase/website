---
title: Get started with your AI agent
subtitle: Prompt your AI coding agent to build a working Next.js app on Neon Postgres
summary: >-
  A prompt-forward quickstart. Connect your AI coding assistant to Neon with the
  Neon CLI and MCP server, then send one prompt that creates a table, seeds it
  with sample rows, and adds a page that renders them. Includes the unattended
  CLI sequence an autonomous agent can run start to finish, the files and output
  to expect, and follow-up prompts for auth, Object Storage, Functions, and the
  AI Gateway.
enableTableOfContents: true
updatedOn: '2026-09-02T19:06:46.133Z'
---

Set up Neon and build on it without leaving your editor. Every step on this page is a prompt or a command you can hand to an AI coding assistant: you connect the agent to Neon once, then send it a single prompt that creates a table, seeds sample rows, and adds a page that displays them. You end up with a running Next.js app, not just a proven connection.

Two paths, so pick the one that matches how you work. This page is the prompt-forward path, where your agent writes the code. [Build a full backend](/docs/get-started/full-backend-quickstart) is the read-and-understand path, where you write every line yourself and the page explains each one. New to the platform? The [backend overview](/docs/get-started/backend-overview) shows how Postgres, Managed Better Auth, Object Storage, Functions, and the AI Gateway fit together.

This page is an experiment in prompt-forward documentation. Every command below was checked against the Neon CLI 4.14.0 command and help semantics on 2026-09-02, and pins that version so the flags stay valid. That check covers the flags and their documented behavior, not an end-to-end live run.

## Before you start

You'll need:

- [Node.js 20+](https://nodejs.org/). Use Node.js 22.20+ if you install [agent skills](/docs/cli/skills) directly, which run through `npx`.
- [`jq`](https://jqlang.github.io/jq/), which the setup sequence uses to read IDs out of JSON output.
- A supported AI coding assistant, such as Cursor or Claude Code (see [supported clients](/docs/ai/connect-mcp-clients-to-neon#supported-agents-add-mcp)).
- A Neon account. Sign up at [console.neon.tech](https://console.neon.tech/signup).

To install or upgrade the CLI globally, run `npm install -g neon@latest`. The commands below call `npx neon@4.14.0` instead, so they don't depend on what you have installed.

## Connect your agent to Neon

Your agent needs two things: the [Neon MCP server](/docs/ai/neon-mcp-server) plus [agent skills](/docs/ai/agent-skills), and a linked Neon project with a `DATABASE_URL` in your env file. The `neon plugins` command installs the first, and `neon link` does the second.

### The unattended sequence

This is the canonical setup. It runs start to finish with no terminal input, so an agent or a CI job can lift the whole block and run it as is:

```bash shouldWrap filename="Unattended setup, Neon CLI 4.14.0"
# Precondition: NEON_API_KEY is the unattended login. There is no non-interactive
# `neon auth`, so without this variable sign-in opens a browser and the run stalls.
# Create a key in the Neon Console, under API keys. The line below asserts the key
# is already exported and exits with a message if it isn't. It never prints the key.
: "${NEON_API_KEY:?Set NEON_API_KEY to a Neon API key before running. Create one in the Neon Console, under API keys}"

# Optional safety belt: turns any prompt that does slip through into an immediate
# error instead of a wait that never ends.
export CI=true

# 1. Pick the organization to create the project in. This takes the first one the
#    key can see, which is the only one on most accounts. If you belong to several,
#    run `npx neon@4.14.0 orgs list` and set ORG_ID to the one you want instead.
ORG_ID=$(npx neon@4.14.0 orgs list --output json | jq -r '.[0].id')

# 2. Create the project and capture its ID. --no-secrets keeps the connection
#    string out of the log, which matters when an agent or CI job is capturing it.
PROJECT_ID=$(npx neon@4.14.0 projects create --name my-app --region-id aws-us-east-2 --org-id "$ORG_ID" --no-secrets --output json | jq -r '.project.id')

# 3. Link this directory to the project. `link` needs --project-id here: --yes only
#    skips the "already linked" confirmation, so on its own it still asks which
#    project to use. Linking writes the org and project IDs to a .neon file, so
#    later commands and prompts can read the project ID back from there. It also
#    pulls DATABASE_URL and the other Neon variables into .env, or into .env.local
#    if no .env exists.
npx neon@4.14.0 link --project-id "$PROJECT_ID" --yes

# 4. Install the Neon plugin, which bundles the skills and MCP access, into your
#    agent. Naming the agent skips the picker. Set AGENT_ID to the agent you use:
#    claude-code, cursor, codex, vscode, and others are supported.
AGENT_ID=claude-code
npx neon@4.14.0 plugins --agent "$AGENT_ID" -y

# 5. Optional: scaffold a neon.ts config, ready for other Neon services later.
npx neon@4.14.0 config init --services none
```

Two requirements make the difference between a clean run and a hang: `NEON_API_KEY` has to be exported, and `link` has to be given a `--project-id`. There's no separate `neon env pull` step because `link` pulls the env vars itself. Run [`neon env pull --file .env.local`](/docs/cli/env) only if you need the variables in a specific file.

<Admonition type="important" title="neon init -y is not the non-interactive form">
`neon init` orchestrates these same commands, but it forwards no project identity to `link`, so `link` still asks which project to use unless the directory is already linked. In a pseudo-terminal, which is what most agent harnesses allocate, that question waits forever, and `init` has already written agent config to disk by then. Use the explicit sequence above whenever nobody is there to answer. This is drawn from how 4.14.0 orchestrates those commands and from the CLI's own help for `link --yes`, which says it still asks for a project unless one is already linked, rather than from an observed end-to-end run.
</Admonition>

### Or one command, if you're at a terminal

When you're running the setup yourself, one command covers it:

```bash
npx neon@4.14.0 init
```

`neon init` is interactive. It asks how your coding agents should get Neon (a plugin, or skills and the MCP server), links a Neon project, and writes a `neon.ts` config. In an empty directory it scaffolds a starter template first. See the [`neon init` reference](/docs/cli/init) for the full flow.

If you only want the MCP server, run [`npx neon@4.14.0 mcp`](/docs/cli/mcp). If you only want agent skills, run [`npx neon@4.14.0 skills`](/docs/cli/skills).

## Build the app with one prompt

Paste this into your editor's AI chat. It works in a fresh directory and in an existing Next.js app:

```text shouldWrap filename="AI assistant prompt"
Build me a working Next.js page backed by Neon Postgres, and use the Neon skills and MCP server you have installed.

Set up:

1. Decide whether a Next.js app already exists here. Check for a `package.json` that lists Next.js as a dependency, not whether the directory has files in it: the Neon setup already wrote a `.neon` file and an env file, so even a brand new project looks non-empty. If Next.js isn't installed, scaffold a new Next.js app in this directory (App Router, TypeScript) and leave the existing `.neon` and env files in place. If it is installed, add to that app instead of replacing it.
2. Confirm Neon is connected. Read `projectId` from the `.neon` file in this directory and use that ID whenever a Neon CLI command needs one. If there's no `.neon` file, the unattended setup sequence from this page hasn't run here, so run that first: it creates a project, captures the ID, and links this directory. Then check that DATABASE_URL is in my env file. Never print connection strings or other secrets back to me.
3. Install `drizzle-orm`, `@neondatabase/serverless`, and `@next/env`, plus `drizzle-kit` and `tsx` as dev dependencies. Install `@next/env` explicitly rather than relying on it arriving with Next.js, because the Drizzle config and the seed script both import `loadEnvConfig` from it.

Then build:

4. Define a `notes` table with Drizzle: a bigint identity primary key, `title` (text, not null, and unique so the seed can skip rows it already inserted), `body` (text, not null), and `created_at` (timestamptz, not null, defaults to now).
5. Add a `drizzle.config.ts`. `drizzle-kit` is a standalone CLI and does not read `.env.local` on its own, so load the env first with `loadEnvConfig` from `@next/env`.
6. Apply the schema with `npx drizzle-kit push`.
7. Seed 5 sample notes from a script at `lib/db/seed.ts`, and make it idempotent: one insert with `onConflictDoNothing` targeting the unique `title`, so rerunning it leaves the count at 5 instead of inserting duplicates. Call `loadEnvConfig` in the script and build its own Drizzle client there. Don't import the shared client, because that module reads DATABASE_URL when it loads, before the env is in place. Add an `npm run db:seed` script that runs it with `tsx`.
8. Add a `/notes` page as a Server Component that queries the notes through Drizzle and renders them newest first. Set `export const dynamic = 'force-dynamic'` so Next.js does not statically cache the page.
9. Prove it works. Run `npm run db:seed`, then `npm run build`, then start the dev server and fetch http://localhost:3000/notes. Show me the rows you actually got back, not "setup complete". Then give me commands I can rerun myself, such as `npm run db:seed` followed by `npx neon@4.14.0 psql -- -c "select count(*) from notes"`.

If any step fails, show me the error and what you tried. Don't route around it silently.
```

## What you'll get

Use this section to check the agent's work. If you're an agent reading this page, treat it as the spec for step 4 onward.

Paths depend on the scaffold, so `src/`-prefixed variants are fine:

```text filename="Files you should end up with"
.env.local             DATABASE_URL and other Neon vars, written by `neon link`
.neon                  org, project, and branch context, written by `neon link`
drizzle.config.ts      points drizzle-kit at DATABASE_URL
lib/db/schema.ts       the notes table
lib/db/client.ts       Drizzle client over @neondatabase/serverless
lib/db/seed.ts         idempotent seed for the 5 sample notes
app/notes/page.tsx     Server Component that renders the rows
```

The table definition, the client, the seed, and the page:

```typescript filename="lib/db/schema.ts"
import { bigint, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  title: text('title').notNull().unique(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

```typescript filename="lib/db/client.ts"
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

The seed builds its own client instead of importing `lib/db/client.ts`, because that module reads `DATABASE_URL` at import time, before `loadEnvConfig` has run:

```typescript filename="lib/db/seed.ts"
import { neon } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/neon-http';

import { notes } from './schema';

loadEnvConfig(process.cwd());

const sampleNotes = [
  { title: 'Welcome to Neon', body: 'This row came from the seed script.' },
  { title: 'Branching', body: 'Copy the whole database in seconds.' },
  { title: 'Autoscaling', body: 'Compute follows your traffic.' },
  { title: 'Scale to zero', body: 'Idle computes suspend, so you stop paying for them.' },
  { title: 'Serverless driver', body: 'Query Postgres over HTTP from the edge.' },
];

async function seed() {
  const db = drizzle(neon(process.env.DATABASE_URL!));

  await db.insert(notes).values(sampleNotes).onConflictDoNothing({ target: notes.title });

  console.log(`Seeded ${sampleNotes.length} notes`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

```tsx filename="app/notes/page.tsx"
import { desc } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { notes } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  const rows = await db.select().from(notes).orderBy(desc(notes.createdAt)).limit(10);

  return (
    <ul>
      {rows.map((note) => (
        <li key={note.id}>
          <strong>{note.title}</strong>
          <p>{note.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

Then verify it yourself. Push the schema, seed, build, and count the rows:

```bash filename="Terminal"
npx drizzle-kit push
npm run db:seed
npm run build
npx neon@4.14.0 psql -- -c "select count(*) from notes"
```

```text filename="Output"
 count
-------
     5
(1 row)
```

Rerun `npm run db:seed` as often as you like. Because the insert skips conflicts on `title`, the count stays at 5.

With `npm run dev` running, `http://localhost:3000/notes` lists the 5 seeded notes, newest first. You can also open the table in the [Neon Console](https://console.neon.tech).

## Next steps

Keep prompting. Each block below adds one capability to the app you just built. Send them one at a time and let the agent verify each before you move on.

<Admonition type="note" title="Region support for the beta services">
Object Storage, Functions, and the AI Gateway are in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). The setup sequence above creates the project in `aws-us-east-2` for that reason. Postgres works in any region.
</Admonition>

Add authentication, so notes belong to a signed-in user:

```text shouldWrap filename="Prompt: add auth"
Add Managed Better Auth to this app so notes belong to a signed-in user. Declare auth in neon.ts, run `npx neon@4.14.0 deploy` to provision it, then `npx neon@4.14.0 env pull` to pull the new credentials. Add a `user_id` column to the notes table, scope every query to the signed-in user, and add sign-in and sign-out. Then prove it: sign in as a test user, create a note, and show me that a second user cannot see it. Follow https://neon.com/docs/auth/authentication-flow.md rather than your training data, since this API is in beta and changes often.
```

Add file uploads, with the object key on the row:

```text shouldWrap filename="Prompt: add file storage"
Let each note carry an image. Declare Object Storage in neon.ts, run `npx neon@4.14.0 deploy`, then `npx neon@4.14.0 env pull`. Store the object key on the notes row, never the bytes. Add an upload control to the notes page and render each image from its key. Then prove it: upload a file, show me the stored key, and fetch the object back. Follow https://neon.com/docs/storage/get-started.md for the current package and config syntax.
```

Call a model through one credential:

```text shouldWrap filename="Prompt: add AI"
Generate a one-line summary for each note using the Neon AI Gateway, and store it in a `summary` column. Declare the AI gateway in neon.ts, run `npx neon@4.14.0 deploy`, then `npx neon@4.14.0 env pull`. Pick a current text model from the catalog rather than guessing an ID. Then prove it: summarize the seeded notes and show me the generated text. Follow https://neon.com/docs/ai-gateway/models.md for endpoints, model IDs, and modality.
```

Move that long-running call into a Function:

```text shouldWrap filename="Prompt: add a function"
Move the summarization call into a Neon Function so it runs on compute next to the database instead of in a route handler, and stream the result back. Declare the function in neon.ts, run `npx neon@4.14.0 deploy`, then `npx neon@4.14.0 env pull`. Inside the function, connect with a `pg` Pool opened once at module scope; don't use `@neondatabase/serverless` there, since it's built for short-lived per-request work. Then prove it: call the function endpoint and show me the response. Follow https://neon.com/docs/compute/functions/get-started.md for the injected env var names and connection guidance.
```

Branch the whole backend to try any of these in isolation:

```text shouldWrap filename="Prompt: work on a branch"
Create a Neon branch for this work and switch to it: `npx neon@4.14.0 branches create --name my-feature`, then `npx neon@4.14.0 checkout my-feature`. Always name the branch, since a bare `checkout` prompts interactively. Confirm which branch my env file now points at, and tell me how to switch back.
```

<NeedHelp/>
