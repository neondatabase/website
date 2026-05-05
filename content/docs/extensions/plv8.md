---
title: The plv8 extension (deprecated)
subtitle: JavaScript procedural language for Postgres — no longer available on Neon
summary: >-
  plv8 is deprecated on Neon due to security concerns. New installations are
  blocked; use plpgsql or application-side logic instead.
enableTableOfContents: false
updatedOn: '2026-05-01T12:00:00.000Z'
---

<Admonition type="warning" title="The plv8 extension is deprecated on Neon.">

**plv8** is deprecated because of **security risks** tied to embedding the V8 JavaScript engine inside Postgres. Neon blocks **`CREATE EXTENSION plv8`** with an explicit deprecation message (same mechanism as other deprecated extensions).

**If you use plv8 today:** move business logic out of JavaScript-in-SQL—for example rewrite functions in **[plpgsql](https://www.postgresql.org/docs/current/plpgsql.html)** or run JavaScript in your **application** or **worker** layer—and then drop **`plv8`** from databases that still have it. See also [Supported Postgres extensions](/docs/extensions/pg-extensions).

**Alternatives:**

- **SQL and built-in languages:** [plpgsql](https://www.postgresql.org/docs/current/plpgsql.html) (Postgres default procedural language); [plpgsql_check](https://pgxn.org/dist/plpgsql_check/) for optional validation in CI
- **Calling external services:** use **`http`** patterns from app code, queues, or **`pg_net`** / HTTP from Postgres where appropriate for your stack

Upstream project (reference only): [plv8 on GitHub](https://github.com/plv8/plv8).

</Admonition>

Neon previously shipped **plv8** so you could write Postgres functions in JavaScript via the V8 engine. That capability is **no longer offered** on new installs.
