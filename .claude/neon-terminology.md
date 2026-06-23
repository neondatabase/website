# Neon Terminology Reference

Preferred terms and patterns for Neon documentation. Used by `/review-content` and `/humanize` for programmatic checks.

**Scope:** `content/docs/` and `content/changelog/` only. Does not apply to `content/postgresql/` (that section has its own conventions).

---

## Postgres vs PostgreSQL

Use **Postgres** in almost all cases.

Use **PostgreSQL** only when:
- Referring specifically to the open source project ("the PostgreSQL project", "the PostgreSQL community")
- Citing an official version release ("PostgreSQL 17", "PostgreSQL 16.2")
- Making a formal reference to the official software product

When in doubt, use Postgres.

---

## Product UI and surfaces

| Use | Avoid | Notes |
| --- | --- | --- |
| Neon Console | dashboard, admin panel, control panel, the UI | Always capitalize |
| SQL Editor | query editor, SQL tool | Capitalize both words |

---

## Core concepts

| Use | Avoid | Notes |
| --- | --- | --- |
| compute | instance, server, container, pod | Lowercase noun. "A compute" or "the compute" is correct. |
| branch | copy, clone, fork | Lowercase. Avoid conflating with git branches in mixed contexts. |
| project | workspace, environment, app | A Neon project is a specific resource — don't use generically |
| endpoint | | Lowercase. Has a specific meaning in Neon architecture — don't use loosely to mean "URL" or "connection" |
| read replica | replica, standby, read-only instance | Lowercase, two words, no hyphen |
| connection pooling | | Lowercase. PgBouncer powers this in Neon. |
| connection string | connection URL, DSN, connection URI | Neon standardizes on "connection string" |
| compute unit | | Lowercase when written out. Abbreviate as "CU" after first mention. |
| CU | vCPU (as a synonym for CU) | Standard abbreviation for compute unit |

---

## Official Neon feature names

**Capitalization rule:** Capitalize a feature name when you're explicitly referring to the named feature ("Neon's Autoscaling feature", "configure Scale to Zero"). Use lowercase when you're describing the concept in general prose ("your compute autoscales", "the branch scales to zero", "create a read replica").

Named features that are always capitalized regardless of context — these are proper nouns, not concepts:

| Always capitalize | Notes |
| --- | --- |
| Neon Console | The web UI |
| Neon Auth | Not "Neon Authentication" |
| Neon CLI | "Neon CLI" in prose; `neonctl` only in code |
| Neon MCP Server | Full name on first mention; "the MCP Server" after |
| Neon Serverless Driver | The `@neondatabase/serverless` package |
| Data API | Neon's PostgREST-based API |
| Import Data Assistant | |
| IP Allow | Not "IP allowlist" as the feature name |

Feature names — capitalize when referring to the feature, lowercase in general prose:

| Feature name | Lowercase in prose example |
| --- | --- |
| Autoscaling | "your compute autoscales automatically" |
| Scale to Zero | "the compute scales to zero after inactivity" |
| Branching | "create a branch", "use branching in your workflow" |
| Read Replicas | "create a read replica", "use read replicas for analytics" |
| Logical Replication | "set up logical replication" |
| High Availability | "configure high availability for your project" |
| Branch Restore | "restore a branch to a previous state" |
| Backup & Restore | Ampersand, not "and" |
| Private Networking | "connect via private networking" |

---

## Postgres-ecosystem terminology

| Use | Avoid | Notes |
| --- | --- | --- |
| Postgres | PostgreSQL (in general prose) | See rule above |
| psql | PSQL, Psql | Always lowercase |
| pgvector | PgVector, pg_vector, pgVector | Lowercase, one word |
| PgBouncer | pgbouncer, pg_bouncer | Capital P, capital B — this is the official name |
| pg_dump | pg-dump, pgdump | Lowercase with underscore |
| pg_restore | pg-restore, pgrestore | Lowercase with underscore |

---

## Connection strings

Use `postgresql://` not `postgres://` in examples. Standard format:

```
postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

Always include `?sslmode=require` in examples unless demonstrating a specific non-SSL scenario.

---

## Words and phrases to avoid

| Avoid | Use instead | Notes |
| --- | --- | --- |
| utilize | use | |
| leverage | use, or be specific | |
| seamlessly | cut, or describe what actually happens | |
| robust | cut, or be specific | |
| powerful | cut, or be specific | |
| comprehensive | cut, or be specific | |
| straightforward | cut | |
| easy, simple, quick (before steps) | cut — let the steps speak | |
| simply, just (before an action) | cut | |
| out of the box | by default | |
| sanity check | verify, confirm | |
| whitelist | allowlist | |
| blacklist | blocklist | |
| master (branch name in examples) | main | |

---

## Capitalization rules

- Capitalize feature names when explicitly referring to the named feature; use lowercase when describing the concept in prose
- Proper brand names are always capitalized: Neon Console, Neon Auth, Neon CLI, Data API, etc.
- Generic concepts are always lowercase in prose: compute, branch, project, endpoint, database, table, role
- Postgres extensions are lowercase: pgvector, pg_stat_statements, postgis
- "Neon" is always capitalized — never "neon"
- Third-party names follow official style: Vercel, GitHub, Prisma, Drizzle, SQLAlchemy, Next.js, PgBouncer
