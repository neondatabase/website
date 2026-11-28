---
title: Add guardrails, data masking and audit to Lakebase Postgres with Hoop
subtitle: Run the Hoop Sidecar in front of your Neon branches and control what AI agents and people can run
summary: >-
  Hoop is a self-hosted sidecar that sits between Postgres clients and a
  Lakebase Postgres database. It blocks destructive statements, masks sensitive
  values in query results and records every statement, with no change to
  application code. Use this guide to run the Sidecar in Docker with one
  listener per Neon branch, point psql, drivers and AI agents at it, verify
  masking and denials, and combine it with IP Allow so that only the Sidecar can
  reach a protected branch. Covers why clients drop channel_binding=require and
  use sslmode=disable on the hop to the Sidecar.
enableTableOfContents: true
updatedOn: '2026-11-03T12:00:00.000Z'
---

[Hoop](https://hoop.dev/?utm_source=neon&utm_medium=docs&utm_campaign=integrations) is a self-hosted sidecar for databases. It runs in your infrastructure, between your Postgres clients and your Lakebase Postgres database, and applies three things to every connection: guardrails that block statements, data masking on query results, and an audit trail of every statement. Clients keep their Postgres driver and only change the host and port in the connection string.

This guide shows how to run the Hoop Sidecar in front of a Neon project with one listener per branch, how to point AI agents, developers and applications at it, and how to use Neon's IP Allow so that the Sidecar is the only way into a protected branch.

## How it works

The Sidecar is one container. Each listener in its config fronts one Neon branch: it accepts Postgres connections on a local port, inspects every statement and result, and opens a TLS connection to that branch's host on Neon. The Sidecar holds no database password. It relays the login from the client to Neon, so Neon still authenticates every user.

<Admonition type="important">
The Sidecar sees Postgres connections only. The Neon serverless driver over HTTP and WebSocket, the Data API, the Neon MCP server and the SQL Editor in the Neon Console reach the database inside Neon, so their traffic does not pass through the Sidecar. See [Allow only the Sidecar with IP Allow](#allow-only-the-sidecar-with-ip-allow) for how to close the direct path to a protected branch.
</Admonition>

## Prerequisites

- A Neon project. The Free plan is enough for this guide. IP Allow needs the Scale plan.
- Docker on a host that can reach Neon on port `5432`.
- A Postgres client such as `psql`.

<Steps>

## Get the host of each branch

Each Neon branch has its own host, so each branch gets its own Sidecar listener.

In the Neon Console, select the branch and click **Connect**. The host is the part of the connection string between `@` and `/`.

![Neon Connect dialog with the connection string for the production branch](/docs/guides/hoop-neon-connect.png)

Or use the Neon CLI:

```bash
neon connection-string production
neon connection-string dev
```

Either way you get a string in this form:

```text shouldWrap
postgresql://neondb_owner:[PASSWORD]@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Copy the host of each branch. The pooled host, with `-pooler` after the endpoint ID, also works behind the Sidecar, and prepared statements from drivers and ORMs work on both hosts. Neon refuses startup options such as `PGOPTIONS` on the pooled host, which matters for [Name who ran each statement](#name-who-ran-each-statement).

## Write the Sidecar config

Save this as `config.yaml` and replace the two `upstream` hosts with yours. Add one listener for every branch the Sidecar should front.

```yaml title="config.yaml"
admin:
  listen: 0.0.0.0:19000

audit:
  file: '-'
  query_sessions: 500

guardrails:
  rules:
    - name: no-destructive-sql
      type: operation
      operations: [drop, delete, truncate]
      message: destructive statements are blocked by Hoop

mask:
  rules:
    - { name: emails, entities: [EMAIL_ADDRESS], strategy: redact }

listeners:
  - name: neon-production
    protocol: postgres
    listen: 0.0.0.0:15432
    upstream: ep-<production-id>.<region>.aws.neon.tech:5432
    upstream_tls: {}
  - name: neon-dev
    protocol: postgres
    listen: 0.0.0.0:15433
    upstream: ep-<dev-id>.<region>.aws.neon.tech:5432
    upstream_tls: {}
```

- `guardrails` blocks `DROP`, `DELETE` and `TRUNCATE` on every listener.
- `mask` replaces email addresses in results on every listener.
- `audit` writes every statement to stdout as JSON lines. `query_sessions` turns on the `/api/sessions` endpoint.
- `upstream_tls: {}` encrypts the hop to Neon and verifies Neon's certificate against the host trust store. Neon's certificates chain to a public root, so there is no file to download.
- `admin` serves health checks and the audit API. It has no authentication, so the next step publishes it on loopback only.

The Sidecar takes the TLS server name from the `upstream` host, and Neon routes the login to that branch.

## Start the Sidecar

Validate the config, then start the container. Versions are on the [Hoop releases page](https://github.com/hoophq/hoop/releases).

```bash
docker run --rm \
  -v "$PWD/config.yaml:/etc/hoop-inspect/config.yaml:ro" \
  hoophq/hoopsidecar:<version> hoop start sidecar --validate

docker run -d --name hoop-neon \
  -p 127.0.0.1:15432:15432 -p 127.0.0.1:15433:15433 -p 127.0.0.1:19000:19000 \
  -v "$PWD/config.yaml:/etc/hoop-inspect/config.yaml:ro" \
  hoophq/hoopsidecar:<version>
```

`--validate` prints `config OK: 2 listener(s)` and one line per listener with its rule count.

## Point your clients at the Sidecar

Change the host and port, and drop `channel_binding=require`. The user, password and database stay the same.

```text shouldWrap
before: postgresql://neondb_owner:[PASSWORD]@ep-<production-id>.<region>.aws.neon.tech/neondb?sslmode=require&channel_binding=require
after:  postgresql://neondb_owner:[PASSWORD]@127.0.0.1:15432/neondb?sslmode=disable
```

Every client with a Postgres connection string takes the same change: a Postgres MCP server or `psql` that an AI agent uses, a developer's `psql`, and application drivers and ORMs. The Neon MCP server uses Neon's API instead of a connection string, so it stays outside the Sidecar.

</Steps>

## Why sslmode=disable appears in the connection string

The `sslmode=disable` applies only to the hop from the client to the Sidecar on the same host. The Sidecar then connects to Neon over TLS and verifies Neon's certificate, so the connection to your database stays encrypted.

```text
Client → Sidecar (127.0.0.1, no TLS)
Sidecar → Neon (TLS, certificate verified)
```

With Neon's default string the client refuses this hop. With `sslmode=require` it stops with `server does not support SSL, but SSL was required`. With `channel_binding=require` it stops with `channel binding required, but SSL not in use`.

When clients reach the Sidecar over a network, turn on [`downstream_tls`](https://hoop.dev/docs/setup/configuration/hoop-sidecar/protocols/postgres#tls-on-each-leg) in the Sidecar and connect with `sslmode=require`. Leave `channel_binding` at its default, because the Sidecar offers `SCRAM-SHA-256` without channel binding.

## Verify

Connect through the Sidecar and create a test table:

```bash shouldWrap
psql "postgresql://neondb_owner:[PASSWORD]@127.0.0.1:15432/neondb?sslmode=disable"
```

```sql
CREATE TABLE customers (id SERIAL PRIMARY KEY, name TEXT, email TEXT);
INSERT INTO customers (name, email) VALUES ('Ana Souza', 'ana.souza@example.com');
```

A `SELECT` returns the email masked:

```text title="Output"
neondb=> SELECT * FROM customers;
 id |   name    |          email
----+-----------+--------------------------
  1 | Ana Souza | [REDACTED:EMAIL_ADDRESS]
```

A destructive statement is refused with your message:

```text title="Output"
neondb=> DROP TABLE customers;
FATAL:  destructive statements are blocked by Hoop
```

The audit lists each session with its listener, its principal and counts:

```bash
curl -s 127.0.0.1:19000/api/sessions
```

```json title="Output"
{"sessions":[{"principal":"neondb_owner","protocol":"postgres","connection":"neon-production","denied_count":1,"masked_count":1,"verdict":"denied"}],"total":1}
```

Repeat on port `15433` to reach the `dev` branch. Its sessions show `"connection":"neon-dev"`.

## Allow only the Sidecar with IP Allow

Without a network rule, a client with the password can still connect to the branch directly and skip the Sidecar. Neon's [IP Allow](/docs/introduction/ip-allow) closes that path. It is available on the Scale plan and applies to every branch, or to protected branches only.

Allow only the Sidecar's egress IP on the branches you lock down. Give the Sidecar a static egress IP of its own, because workloads that share its host or NAT gateway keep the same access.

The protected-branches shape keeps development branches open while the Sidecar fronts the branches that matter:

1. Mark `production` as a [protected branch](/docs/guides/protected-branches) in the Neon Console.
2. Add the Sidecar's IP to IP Allow, scoped to protected branches:

   ```bash
   neon ip-allow add <ip> --protected-only --project-id <project-id>
   ```

<Admonition type="note">
IP Allow also applies to the serverless driver and the Neon MCP server, which connect from other IPs. The Data API is not available on projects with IP Allow. For a VPC, [Private Networking](/docs/guides/neon-private-networking) over AWS PrivateLink is the alternative, also on the Scale plan.
</Admonition>

A new branch is a new host. Add a listener for it and restart the Sidecar, because a config reload does not add listeners. With IP Allow on protected branches only, the new branch stays open to direct connections until you protect it, like any other development branch.

## Name who ran each statement

By default every client connects as `neondb_owner`, so the audit shows one shared user. Two ways give each statement a name.

**A role per person.** Create a Postgres role for each person in the Neon Console or with the Neon CLI, grant it what it needs, and connect as that role. The audit records it as the principal. Roles belong to a branch, and child branches copy them.

```bash shouldWrap
neon roles create --project-id <project-id> --branch production --name alice
psql "postgresql://alice:[PASSWORD]@127.0.0.1:15432/neondb?sslmode=disable"
```

**A tag on the connection.** On the direct host, send a custom setting in the startup options. The Sidecar records it on every event of the session, and Neon passes it to the database, where `current_setting('hoop.user')` returns it.

```bash shouldWrap
PGOPTIONS='-c hoop.user=alice' psql "postgresql://neondb_owner:[PASSWORD]@127.0.0.1:15432/neondb?sslmode=disable"
```

The pooled host refuses the tag at login with `unsupported startup parameter in options: hoop.user`. On that host, use a role per person.

<Admonition type="warning">
The audit records the full statement text. Create roles in the Neon Console or with the Neon CLI, so no `CREATE ROLE ... PASSWORD` statement goes through the Sidecar.
</Admonition>

## Things to know

- **A denied statement closes the connection.** The client reads the message as `FATAL` with SQLSTATE `42501`, and Postgres rolls back the open transaction. Connection pools open a new connection.
- **Neon errors reach the client unchanged.** A login failure, an IP Allow refusal or a pooler message reads the same with or without the Sidecar.
- **The Sidecar removes channel binding.** It offers `SCRAM-SHA-256` instead of `SCRAM-SHA-256-PLUS`, with the same password.
- **Scale to zero works through the Sidecar.** Neon wakes a suspended compute at the next login. Through the Sidecar, a connection to a suspended compute took 1.8 s against 1.0 s for a warm one. The client's connect timeout governs the wake.
- **One listener per branch.** A listener cannot be pointed at another branch at runtime, because the TLS server name comes from `upstream` and Neon routes the login by it.
- **Free and licensed features.** The free Sidecar allows one guardrail rule and one masking rule per process, shared by all of its listeners. More rules, reviews and central management need a Hoop license.

## Resources

- [Hoop Sidecar with Neon](https://hoop.dev/docs/integrations/neon?utm_source=neon&utm_medium=docs&utm_campaign=integrations), the same setup with the full config reference
- [Hoop guardrails](https://hoop.dev/docs/features/guardrails) and [data masking](https://hoop.dev/docs/features/data-masking)
- [Hoop Postgres lane reference](https://hoop.dev/docs/setup/configuration/hoop-sidecar/protocols/postgres)
- [Neon IP Allow](/docs/introduction/ip-allow)
- [Neon protected branches](/docs/guides/protected-branches)

<NeedHelp/>
