---
title: Fork a running app and its database together with boxd and Neon branching
subtitle: Give every fork of a boxd machine its own Neon branch, so code, running processes and data branch at the same time.
author: michiel-voortman
enableTableOfContents: true
createdAt: '2026-11-12T00:00:00.000Z'
updatedOn: '2026-11-12T00:10:25.790Z'
---

A [boxd](https://boxd.sh?ref=neon-website) machine is a full Linux computer with a persistent disk and its own HTTPS URL. You can fork a running machine: the fork gets a copy of the disk, the memory and every running process, so your app is already running on the fork, with its dependencies installed. [Neon branching](/docs/introduction/branching) does the same for Postgres: a branch is a copy-on-write copy of your database.

Put the two together and you can fork a whole development environment for each feature, pull request or coding agent: the machine with the app running on it, plus a Neon branch with a copy of the data. What one fork does to its code or schema never reaches the base machine, the main branch or any other fork.

There is one thing to get right. A fork starts as an exact copy of the parent's memory, so the app on the fork still holds the parent's `DATABASE_URL`. In this guide, you write a small helper that creates the branch, forks the machine, points the app on the fork at the new branch, restarts it and waits until it answers. The fork has its own URL from the moment it exists, so for a second or two, until the restart, a request to it still reaches the parent's data. If your app runs background jobs that write on their own, stop them on the base machine before you fork, or make them wait for the restart.

You will:

1. Run a small notes API on a boxd machine, connected to your Neon project's main branch.
2. Fork it into an environment with its own branch, and check that writes stay apart.
3. Let Claude Code change the schema on a fork, without touching main.
4. Delete the fork and its branch when you are done.

## Prerequisites

- **Neon account and project:** Sign up at [console.neon.tech](https://console.neon.tech/signup) and create a project. Copy the connection string of the `main` branch from **Connect**.
- **Neon API key:** In the Neon Console, open **Settings** > **API keys** and create a key.
- **boxd account and API key:** Sign up at [boxd.sh](https://boxd.sh?ref=neon-website) and create an API key in the [boxd console](https://app.boxd.sh?ref=neon-website) or with `boxd auth keys create neon-guide`.
- **Node.js 20 or later** on your computer.
- Optional, for step 5: an Anthropic API key.

<Steps>

## Step 1: Create the project

Create a folder, install the Neon and boxd SDKs, and set your keys:

```bash
mkdir neon-boxd-forks && cd neon-boxd-forks
npm init -y && npm pkg set type=module
npm install @neon/sdk @boxd-sh/sdk
npm install -D tsx typescript @types/node
mkdir app src scripts
```

```bash
export NEON_API_KEY=your_neon_api_key
export NEON_PROJECT_ID=your_neon_project_id
export BOXD_API_KEY=your_boxd_api_key
export BOXD_REGION=nyc   # or fra
```

`scripts/clients.ts` creates both clients once:

```typescript
import { Boxd } from '@boxd-sh/sdk';
import { createNeonClient } from '@neon/sdk';

// Reads BOXD_API_KEY and BOXD_REGION from the environment.
export const boxd = new Boxd();

export const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY!, throwOnError: true });

export const projectId = process.env.NEON_PROJECT_ID!;
```

## Step 2: Write the app

The app is a small notes API. Like most apps, it reads `DATABASE_URL` once when it starts. It answers every request with the host it is connected to. Every Neon branch has its own endpoint host, so the host tells you which branch a machine uses.

`app/server.mjs`:

```javascript
// A small notes API. It reads DATABASE_URL once at start, like most apps do.
import http from 'node:http';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// Neon closes idle connections. Log it instead of crashing; the pool opens a new one on the next query.
pool.on('error', (err) => console.error('idle client error:', err.message));
// On Neon, every branch has its own endpoint host, so the host tells you which branch this is.
const host = new URL(process.env.DATABASE_URL).hostname;
await pool.query('CREATE TABLE IF NOT EXISTS notes (id serial PRIMARY KEY, body text NOT NULL)');

http
  .createServer(async (req, res) => {
    try {
      if (req.method === 'POST' && req.url === '/notes') {
        let body = '';
        for await (const chunk of req) body += chunk;
        await pool.query('INSERT INTO notes (body) VALUES ($1)', [body]);
      }
      const db = await pool.query('SELECT current_database() AS name');
      const notes = await pool.query('SELECT body FROM notes ORDER BY id');
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ host, database: db.rows[0].name, notes: notes.rows.map((r) => r.body) }));
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  })
  .listen(8000);
```

It runs as a systemd service on port 8000, the port boxd serves at the machine's HTTPS URL. `app/notes.service`:

```ini
[Unit]
Description=Notes API
After=network-online.target

[Service]
User=boxd
WorkingDirectory=/home/boxd/app
EnvironmentFile=/home/boxd/app/.env
ExecStart=/usr/local/bin/node server.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

## Step 3: Start the base machine

`src/setup-app.ts` uploads the app to a machine, writes its `.env`, installs `pg` and starts the service:

```typescript
import { readFile } from 'node:fs/promises';
import type { Boxd } from '@boxd-sh/sdk';

/**
 * Install the notes app on a machine as a systemd service on port 8000,
 * connected to `databaseUrl`. The connection string goes into .env through the file API, readable by its owner only.
 */
export async function setupApp(boxd: Boxd, machineId: string, databaseUrl: string): Promise<void> {
  await boxd.machines.files.mkdir(machineId, '/home/boxd/app');
  const appDir = new URL('../app/', import.meta.url);
  await boxd.machines.files.upload(machineId, '/home/boxd/app/server.mjs', await readFile(new URL('server.mjs', appDir)));
  await boxd.machines.files.upload(machineId, '/home/boxd/app/notes.service', await readFile(new URL('notes.service', appDir)));
  await boxd.machines.fs.write(machineId, '/home/boxd/app/.env', `DATABASE_URL=${databaseUrl}\n`, { mode: 0o600 });
  const script = [
    'set -e',
    'cd /home/boxd/app',
    'npm init -y >/dev/null',
    'npm install --silent pg@8',
    'sudo cp notes.service /etc/systemd/system/notes.service',
    'sudo systemctl daemon-reload',
    'sudo systemctl enable --now notes',
    'for i in $(seq 1 30); do curl -fsS localhost:8000 && exit 0; sleep 1; done; exit 1',
  ].join('\n');
  const r = await boxd.machines.exec(machineId, {
    command: ['bash', '-c', script],
    timeout: 300_000,
  });
  if (r.exitCode !== 0) throw new Error(`app setup failed: ${r.stderr.trim()}`);
}
```

`scripts/create-base.ts` creates the base machine and sets up the app on it, connected to the main branch. `isolated: true` keeps the machine off your private boxd network and gives it no boxd credentials or connected integrations, which is what you want for a machine that will run an agent. Forks keep this setting:

```typescript
import { boxd } from './clients.ts';
import { setupApp } from '../src/setup-app.ts';

const name = process.argv[2] ?? 'notes-main';

const machine = await boxd.machines.create({ name, isolated: true });
console.error(`created ${machine.id}, installing the app`);
await boxd.machines.waitUntilReady(machine.id);
await setupApp(boxd, machine.id, process.env.DATABASE_URL!);

console.log(JSON.stringify({ id: machine.id, url: machine.access.url }, null, 2));
```

Run it with the connection string of the main branch:

```bash
DATABASE_URL='postgresql://...main branch...' npx tsx scripts/create-base.ts notes-main
```

```json
{
  "id": "0631baed-0075-4946-892b-e1e36d67ab09",
  "url": "https://notes-main.nyc.boxd.sh"
}
```

Add a note on the base machine:

```bash
curl -X POST https://notes-main.nyc.boxd.sh/notes -d "Buy milk"
```

```json
{ "host": "ep-sweet-frog-bd2ihfzb-pooler.c-8.us-east-2.aws.neon.tech", "database": "neondb", "notes": ["Buy milk"] }
```

## Step 4: Fork the machine with its own branch

`src/fork-with-branch.ts` does the work. It creates a Neon branch from the main branch with [`branches.createAndConnect`](/docs/reference/typescript-sdk), forks the base machine under the same name, writes the branch's connection string into the fork's `.env`, restarts the app on the fork and waits until it answers. It labels the fork with the id of its branch (`neon-branch`), so you can see which branch a fork was created with. If any step fails, it tries to delete the fork and the branch again and throws the first error, so check for leftovers after a failed run.

```typescript
import { NotFoundError, type Boxd, type Machine } from '@boxd-sh/sdk';
import type { NeonClient } from '@neon/sdk';

export interface ForkWithBranchOptions {
  /** The machine to fork. It runs your app with DATABASE_URL pointing at the parent branch. */
  baseMachineId: string;
  /** Neon project that holds the parent branch. */
  projectId: string;
  /** Parent branch id. Defaults to the project's default branch. */
  parentBranchId?: string;
  /** Name for both the boxd machine and the Neon branch. */
  name: string;
  /** File the app reads DATABASE_URL from. */
  envFile?: string;
  /** Command that restarts the app so it picks up the new DATABASE_URL. */
  restartCommand?: string;
  /** Command that exits 0 once the restarted app answers. Tried for up to 30 seconds. */
  healthCommand?: string;
  /** Labels for the forked machine. The helper adds `neon-branch` with the branch id. */
  labels?: Record<string, string>;
}

export interface ForkedEnvironment {
  machine: Machine;
  branchId: string;
  databaseUrl: string;
  url: string;
}

/**
 * Set DATABASE_URL in the text of an env file. Every other line stays as it is, blank lines and
 * comments included. An `export DATABASE_URL=` line stays an export, with the value quoted for the shell.
 */
export function withDatabaseUrl(envFile: string, databaseUrl: string): string {
  const assignment = /^(\s*export\s+)?\s*DATABASE_URL=/;
  const render = (line: string) =>
    assignment.exec(line)?.[1]
      ? `export DATABASE_URL='${databaseUrl.replaceAll("'", `'\\''`)}'`
      : `DATABASE_URL=${databaseUrl}`;
  const lines = envFile === '' ? [] : envFile.replace(/\n$/, '').split('\n');
  if (!lines.some((line) => assignment.test(line))) lines.push('DATABASE_URL=');
  return lines.map((line) => (assignment.test(line) ? render(line) : line)).join('\n') + '\n';
}

/**
 * Fork a running boxd machine and give the fork its own Neon branch.
 *
 * The fork starts as a copy of the base machine's disk, memory and processes, so its app
 * still talks to the parent branch until it restarts. This writes the branch's connection
 * string into the env file, restarts the app and waits until it answers before returning.
 * If any step fails, it tries to delete the fork and the branch again and throws the first error.
 */
export async function forkWithBranch(
  boxd: Boxd,
  neon: NeonClient<true>,
  opts: ForkWithBranchOptions,
): Promise<ForkedEnvironment> {
  const envFile = opts.envFile ?? '/home/boxd/app/.env';
  const restartCommand = opts.restartCommand ?? 'sudo systemctl restart notes';
  const healthCommand = opts.healthCommand ?? 'curl -fsS -o /dev/null localhost:8000';

  const { branch, connectionString } = await neon.branches.createAndConnect({
    projectId: opts.projectId,
    parentId: opts.parentBranchId,
    name: opts.name,
  });

  let machine: Machine | undefined;
  try {
    // The label ties the fork to its branch. It is also how a failed call recognizes its own fork below.
    machine = await boxd.machines.fork(opts.baseMachineId, {
      name: opts.name,
      labels: { ...opts.labels, 'neon-branch': branch.id },
    });
    machine = await boxd.machines.waitUntilReady(machine.id);

    // Write the file through the file API, not a command line, and keep it readable by its owner only.
    const current = (await boxd.machines.fs.exists(machine.id, envFile))
      ? new TextDecoder().decode(await boxd.machines.fs.read(machine.id, envFile))
      : '';
    await boxd.machines.fs.write(machine.id, envFile, withDatabaseUrl(current, connectionString), { mode: 0o600 });

    const script = [
      'set -e',
      restartCommand,
      `for i in $(seq 1 30); do if ${healthCommand}; then exit 0; fi; sleep 1; done`,
      'echo "the app did not answer after the restart" >&2; exit 1',
    ].join('\n');
    const result = await boxd.machines.exec(machine.id, { command: ['bash', '-c', script], timeout: 60_000 });
    if (result.exitCode !== 0) {
      throw new Error(`could not point ${machine.name} (${machine.id}) at branch ${branch.id}: ${result.stderr.trim()}`);
    }
  } catch (err) {
    // fork() can throw after the machine was made. Look it up by name, and take it only if it carries this branch's label.
    machine ??= await boxd.machines.get(opts.name).then(
      (found) => (branch.id && found.labels['neon-branch'] === branch.id ? found : undefined),
      () => undefined,
    );
    await Promise.allSettled([
      machine ? boxd.machines.delete(machine.id) : Promise.resolve(),
      neon.branches.delete({ projectId: opts.projectId, branchId: branch.id }),
    ]);
    throw err;
  }

  return {
    machine,
    branchId: branch.id,
    databaseUrl: connectionString,
    url: machine.access.url,
  };
}

/** A machine or branch that is already gone. Neon answers 422 "branch is already deleted" for a branch deleted moments ago. */
const isGone = (err: unknown) => {
  if (err instanceof NotFoundError) return true;
  const { status, message } = (err ?? {}) as { status?: unknown; message?: unknown };
  return status === 404 || (status === 422 && /already deleted/i.test(String(message)));
};

/** Delete a forked machine and its Neon branch. Safe to run again: what is already gone is skipped. */
export async function deleteForkedEnvironment(
  boxd: Boxd,
  neon: NeonClient<true>,
  env: { machineId: string; projectId: string; branchId: string },
): Promise<void> {
  const results = await Promise.allSettled([
    boxd.machines.delete(env.machineId),
    neon.branches.delete({ projectId: env.projectId, branchId: env.branchId }),
  ]);
  const failed = results.flatMap((r) => (r.status === 'rejected' && !isGone(r.reason) ? [r.reason] : []));
  if (failed.length > 0) throw failed[0];
}
```

The connection string goes to the fork through the boxd file API, straight into `.env` with mode `0600`, so it never appears in a command line, and only the app's user can read it.

`scripts/fork.ts` calls it from the command line, and `scripts/delete.ts` removes a fork and its branch. You can run the delete again safely: it skips what is already gone.

```typescript
import { boxd, neon, projectId } from './clients.ts';
import { forkWithBranch } from '../src/fork-with-branch.ts';

const [baseMachineId, name] = process.argv.slice(2);

const env = await forkWithBranch(boxd, neon, { baseMachineId, projectId, name });

console.log(JSON.stringify({ machineId: env.machine.id, branchId: env.branchId, url: env.url }, null, 2));
```

```typescript
import { boxd, neon, projectId } from './clients.ts';
import { deleteForkedEnvironment } from '../src/fork-with-branch.ts';

const [machineId, branchId] = process.argv.slice(2);

await deleteForkedEnvironment(boxd, neon, { machineId, projectId, branchId });

console.log(`deleted machine ${machineId} and branch ${branchId}`);
```

Fork the base machine:

```bash
npx tsx scripts/fork.ts 0631baed-0075-4946-892b-e1e36d67ab09 feature-tags
```

```json
{
  "machineId": "48fc1f72-78a7-463e-995a-95ed62922d85",
  "branchId": "br-calm-dawn-bdbyl8dc",
  "url": "https://feature-tags.nyc.boxd.sh"
}
```

The fork answers right away with the data from main, on its own branch's endpoint:

```bash
curl https://feature-tags.nyc.boxd.sh
```

```json
{ "host": "ep-silent-dust-bdljr9ey-pooler.c-8.us-east-2.aws.neon.tech", "database": "neondb", "notes": ["Buy milk"] }
```

Write on the fork, then read the base machine:

```bash
curl -X POST https://feature-tags.nyc.boxd.sh/notes -d "Only on the fork"
curl https://notes-main.nyc.boxd.sh
```

```json
{ "host": "ep-sweet-frog-bd2ihfzb-pooler.c-8.us-east-2.aws.neon.tech", "database": "neondb", "notes": ["Buy milk"] }
```

The note you wrote on the fork is on the fork's branch only. You can check that in the Neon Console: the project now has a `feature-tags` branch.

<Admonition type="tip" title="Name both after the same thing">
Use one name for the machine and the branch: a pull request number, a ticket id, an agent run. Then you always know which branch belongs to which machine, and cleaning up is one call.
</Admonition>

## Step 5: Let a coding agent change the schema on a fork

Claude Code is installed on boxd machines. Because the fork has its own branch, the agent can run migrations without any risk to main. `scripts/agent.ts` runs one Claude Code task on a machine and passes your Anthropic key as an environment variable of that one command:

```typescript
import { boxd } from './clients.ts';

const [machineId] = process.argv.slice(2);

const task =
  'In /home/boxd/app, write and run migrate.mjs, a Node script that uses the pg package and DATABASE_URL from .env ' +
  'to add a boolean column done, default false, to the notes table. Then change server.mjs so GET returns ' +
  'notes as [{ body, done }]. Restart the app with: sudo systemctl restart notes.';

const shellQuote = (value: string) => `'${value.replaceAll("'", `'\\''`)}'`;

const result = await boxd.machines.exec(machineId, {
  command: ['bash', '-lc', `cd /home/boxd/app && claude -p --model haiku --dangerously-skip-permissions ${shellQuote(task)} < /dev/null`],
  env: { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY! },
  timeout: 400_000,
});

console.log(result.stdout);
process.exit(result.exitCode ?? 1);
```

```bash
ANTHROPIC_API_KEY=your_anthropic_key npx tsx scripts/agent.ts 48fc1f72-78a7-463e-995a-95ed62922d85
```

Afterwards the fork returns `done` for every note, and the base machine still returns plain strings from main:

```json
{
  "host": "ep-silent-dust-bdljr9ey-pooler.c-8.us-east-2.aws.neon.tech", "database": "neondb",
  "notes": [
    { "body": "Buy milk", "done": false },
    { "body": "Only on the fork", "done": false }
  ]
}
```

To review the schema change, compare the fork's branch with its parent in the Neon Console, or from code with [`branches.compareSchema`](/docs/guides/schema-diff):

```typescript
const { diff } = await neon.branches.compareSchema({ projectId, branchId: 'br-calm-dawn-bdbyl8dc', databaseName: 'neondb' });
console.log(diff);
```

```diff
--- a/neondb
+++ b/neondb
-    body text NOT NULL
+    body text NOT NULL,
+    done boolean DEFAULT false NOT NULL
```

## Step 6: Pause, wake and delete forks

A fork you are not using does not need to run. boxd hibernates a machine after it has been idle for a while (4 hours by default), and you can hibernate one yourself with `boxd.machines.hibernate(id)`. Opening the fork's URL in a browser wakes it. Scripts and CI jobs call `boxd.machines.wake(id)`. The app on the fork comes back with its processes as they were and reconnects to its branch. On the Neon side, the branch's compute scales to zero after 5 minutes of inactivity by default and starts again on the next query.

When the work is merged or thrown away, delete the machine and the branch:

```bash
npx tsx scripts/delete.ts 48fc1f72-78a7-463e-995a-95ed62922d85 br-calm-dawn-bdbyl8dc
```

```text
deleted machine 48fc1f72-78a7-463e-995a-95ed62922d85 and branch br-calm-dawn-bdbyl8dc
```

</Steps>

## Why fork both

- **The whole environment branches, not only the data.** A fork starts with the app running, packages installed and caches filled. There is no image to build and no install step per environment.
- **Each fork works on its own copy.** A broken migration or an agent's changes stay on its own machine and its own branch. A new branch has the same roles and passwords as its parent, so for agents you do not trust with main, connect the fork with a role you create on its branch only.
- **Idle forks cost little.** Idle forks hibernate, and idle branches scale their compute to zero, so you can keep one per open pull request.
- **Every fork has a URL.** Each machine gets its own HTTPS address, so a fork is also a preview environment you can share for review.

## Extending this

- **One fork per pull request:** call `scripts/fork.ts` from a GitHub Actions workflow when a pull request opens, and `scripts/delete.ts` when it closes. The [Neon GitHub Actions guide](/docs/guides/branching-github-actions) shows the branch side of this.
- **Branch expiration:** set an [expiration time](/docs/guides/branch-expiration) on branches you create, so a forgotten branch goes away on its own.
- **Reset a fork:** if an agent breaks its data, [reset the branch from its parent](/docs/guides/reset-from-parent) and restart the app on the fork.

## Resources

- [Neon branching](/docs/introduction/branching)
- [Neon TypeScript SDK](/docs/reference/typescript-sdk)
- [boxd TypeScript SDK](https://docs.boxd.sh/reference/typescript-sdk?ref=neon-website)
- [Forking boxd machines](https://docs.boxd.sh/guides/fork?ref=neon-website)

<NeedHelp />
