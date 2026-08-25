---
title: 'Neon CLI command: claim'
subtitle: Create and claim a temporary Neon project without an account
summary: >-
  The Neon CLI `claim` command (`neon claimable` is an alias) creates a
  temporary Neon project before anyone signs in. The CLI stores an identity
  assertion, writes credentials to `.env`, and later opens a claim URL so a
  human can take the project. See [Claimable Neon](/docs/reference/claimable-neon).
enableTableOfContents: true
---

The `claim` command creates a temporary Neon project when there is no Neon account yet. `neon claimable` is an alias. The CLI stores an identity assertion on the machine, writes provisioned variables to `.env` (or `.env.local`), and later opens a claim URL so a human can take the project into their organization.

If `neon claim` is not a command, or `neon claim --help` does not list `create`, install the latest CLI (`npm i -g neon@latest`) or use the HTTP flow in [Claimable Neon](/docs/reference/claimable-neon).

Do not pass `--api-key` or `--profile`. Those are refused. `neon auth` and `neon init --agent` need a human Neon account; use this command instead when there is none.

Start in the browser at [neon.com/claimable-neon](/claimable-neon), or give an agent [`auth.md`](https://neon.com/auth.md).

<CliSubcommands command="claim" />

## neon claim create (#create)

Creates a temporary project and saves its identity assertion. Postgres is always requested. Pass `--service` for Data API, Managed Better Auth, or other services. If a [`neon.ts`](/docs/reference/neon-ts) file is present, declared services are requested automatically.

<CliUsage command="claim create" />

<CliOptions command="claim create" />

```bash
neon claim create --env-pull
```

```bash
neon claim create \
  --service data-api \
  --service auth \
  --env-pull
```

`--env-pull` is on by default. It writes provisioned vars to an existing `.env`, otherwise `.env.local`, and gitignores that file. If `.env` or `.env.local` already has a `DATABASE_URL` (or other Neon-managed keys), pass `--file <path>` or `--no-env-pull`.

After create, regular Neon CLI commands use the saved assertion. Explicit Neon account credentials take precedence when you pass them.

## neon claim status (#status)

Shows the linked claimable project's lifecycle and claim status.

<CliUsage command="claim status" />

<CliOptions command="claim status" />

```bash
neon claim status
```

## neon claim accept (#accept)

Creates a claim code and opens the URL where a human signs in and takes the project. `--open` is on by default. `--no-open` prints the URL.

<CliUsage command="claim accept" />

<CliOptions command="claim accept" />

```bash
neon claim accept --no-open
```

Continuing to Neon from that URL freezes issuance and rotates `DATABASE_URL` before the console org picker.

## neon claim list (#list)

Lists claimable projects saved on this machine.

<CliUsage command="claim list" />

<CliOptions command="claim list" />

```bash
neon claim list
```

## neon claim delete (#delete)

Permanently deletes the linked unclaimed project. Pass `--yes` to skip the confirmation prompt.

<CliUsage command="claim delete" />

<CliOptions command="claim delete" />

```bash
neon claim delete --yes
```
