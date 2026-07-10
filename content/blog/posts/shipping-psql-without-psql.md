---
title: 'Shipping psql without psql: a pure-TypeScript Postgres client in neonctl'
description: >-
  How we shipped an embedded, pure-TypeScript psql client inside neonctl, why
  we built a byte-exact conformance harness against PostgreSQL's own regression
  suite, and what it takes to trust AI-written code on an auth/TLS path.
excerpt: >-
  neonctl psql used to fail with "command not found" whenever psql wasn't on
  your PATH — which is most macOS laptops, slim Linux containers, Windows
  boxes, CI runners, and sandboxes. So we did the uncomfortable thing:
  reimplemented the psql client in pure TypeScript, embedded it in the CLI,
  and built a byte-exact conformance harness against PostgreSQL's own
  regression suite to prove it actually behaves like psql...
date: '2026-06-12T10:30:00'
category: engineering
categories:
  - engineering
  - ai
authors:
  - vadim-kharitonov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/shipping-psql-without-psql/cover.jpg
  alt: Shipping psql without psql
isFeatured: false
draft: false
seo:
  title: 'Shipping psql without psql: a pure-TypeScript client in neonctl - Neon'
  description: >-
    How we built an embedded, pure-TypeScript psql client inside neonctl and
    proved it behaves like the real thing with a byte-exact conformance
    harness against PostgreSQL's own regression suite.
  keywords: []
  noindex: false
  ogTitle: 'Shipping psql without psql: a pure-TypeScript client in neonctl - Neon'
  ogDescription: >-
    How we built an embedded, pure-TypeScript psql client inside neonctl and
    proved it behaves like the real thing with a byte-exact conformance
    harness against PostgreSQL's own regression suite.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/shipping-psql-without-psql/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/shipping-psql-without-psql/cover.jpg)

To be upfront, this was built almost entirely by an AI coding agent. Claude (via Claude Code) wrote the embedded `psql` implementation, the conformance harness, and the fixes for the security review below. A human handled the scope, reviewed diffs, and made the calls. We want to be clear about that because it's central to the story. Reimplementing a security-sensitive, 30-year-old C tool with an AI is exactly the kind of situation where you can't just eyeball the output and trust it. That's why we built the conformance harness and ran the adversarial security review. The machine wrote the code. The test and the review are what made it trustworthy.

## Why rewrite psql at all?

`neonctl psql` (and `neonctl connection-string --psql`) has always done the obvious thing: find `psql` on your `$PATH` and hand off to it. That works great until `psql` isn't there.

And it's frequently not there. macOS ships without it. Slim Linux containers don't have it. Windows boxes without pgAdmin don't have it. Most CI runners and sandboxes don't have it. For a CLI whose whole job is to make Postgres easy to reach, `command not found: psql` is a lousy place to land.

So we asked an uncomfortable question: what if `neonctl` just *was* `psql`?

Not "shells out to `psql`." Not "bundles a prebuilt `psql` binary per platform." A real, pure-TypeScript reimplementation of the `psql` client, embedded in the CLI, that activates automatically when no native `psql` is found. Nothing to install, no native dependencies, and the same binary on every platform.

This post is about building that, and about the more interesting part: how we convinced ourselves it was actually correct.

## "Feature parity" is a bigger number than you think

Upstream `psql` is ~24k lines of C across a dozen files. Tab-completion alone is ~8k lines. The surface area we signed up for:

- **The REPL:** prompts, `%`-escapes, history, `.psqlrc`, line editing (Ctrl-A/E/K/W, Alt-B/F, vi mode), Ctrl-C cancellation, the pager.
- **Every backslash command:** `\d`-family describes (all ~46 variants, with full per-relation detail: indexes, FKs, triggers, RLS, partitions, AMs, publications…), `\copy`, `\gset`/`\gdesc`/`\gexec`, `\crosstabview`, large objects, pipeline mode (`\bind`/`\parse`/`\startpipeline`), `\if`/`\elif`.
- **Every output format:** aligned, wrapped, expanded, unaligned, CSV, JSON, HTML, asciidoc, latex, troff.
- **The connection layer:** URI + conninfo + `PG`* env + `~/.pgpass` + `pg_service.conf`, multi-host failover, `target_session_attrs`, load balancing, Unix sockets.
- **Auth and TLS:** SCRAM-SHA-256(-PLUS) with channel binding, the full `sslmode` ladder, client certs, CRLs, `sslnegotiation=direct`.

A few deliberate non-goals kept it tractable and dependency-free:

- **No native bindings.** We hand-rolled a VT100 line editor instead of pulling in `node-pty`. The wire protocol rides on `pg-protocol` (the pure-TS codec from `node-postgres`); we supply the socket, TLS, and SCRAM ourselves.
- **No Kerberos.** GSSAPI/SSPI needs a native binding nobody wants to ship, and Neon doesn't use it. We accept `gssencmode=disable`/`prefer` and reject `require` with a clear error.

## Validating results with a conformance harness

We needed a way to confirm that our reimplementation worked exactly the same. "It looks right when I try it" does not scale to 46 describe commands across 5 Postgres versions.

So before writing much `psql` code at all, we built a conformance harness whose job is to make that question mechanical:

1. **Fetch the source of truth from upstream.** At test time, the harness pulls PostgreSQL's own regression scripts (`psql.sql`, `psql_pipeline.sql`, `psql_crosstab.sql`) and their expected `.out` files, pinned to a specific release tag, plus the relevant TAP tests.
2. **Run the same script through our `psql`** against a real PostgreSQL booted in a container (`@testcontainers/postgresql`).
3. **Normalize and diff.** A small set of rules scrubs the legitimately variable noise (version banner, ephemeral ports, timing numbers, absolute paths) and then diffs byte-for-byte against upstream's expected output.
4. **Assert the diff is empty.**

After many iterations, our output is indistinguishable from the reference `psql`'s, down to the spaces. The harness runs as a CI matrix across PG 14–18 plus a dedicated real-DNS load-balancing job, and it's a blocking check.

(Getting it blocked had its own saga — more below.)

## Lessons learned

A reimplementation like this is mostly a long tail of "huh, that's not what I expected." A few were good enough to keep.

### "Our cipher is weaker than vanilla psql!" (it wasn't)

Our embedded `psql` was negotiating `TLS_AES_128_GCM_SHA256` against a Neon endpoint, but real `psql` hitting the same endpoint got `TLS_AES_256_GCM_SHA384`. Same server, different cipher. That was suspicious.

We captured the raw ClientHello from both clients. Identical: same TLS 1.3 ciphersuite list, same order (AES-256, ChaCha20, AES-128), same SNI, same ALPN. In TLS 1.3, the server picks from the client's offer, so identical offers should produce identical results.

The tell: the user was launching the dev build with `bun`, not `node`. Bun's TLS stack is BoringSSL; Node's is OpenSSL. BoringSSL steers the negotiation toward AES-128-GCM, while OpenSSL lands on AES-256-GCM. Same code, different runtime, both perfectly secure TLS 1.3 AEAD suites. Under the runtime `neonctl` actually ships on (Node), you get AES-256, matching vanilla. Nothing to fix in our code; a stale comment to correct and a docs note to add.

The lesson that keeps recurring: in a pure-TS client, a surprising amount of behavior belongs to the runtime's crypto/TLS library, not to you.

### Getting to byte-perfect was a fight

"Diff against upstream's expected output" sounds clean. It wasn't. Upstream's `psql.sql` is not a standalone script, and that assumption broke us in a dozen small ways.

**It assumes the whole test suite has already run.** `psql.sql` is one file in PostgreSQL's serial regression schedule. By the time it runs for real, earlier tests have created tables (`onek`, `tenk1`) and an extra access method called `heap2`. Run it alone, and none of that exists, so `\dA` lists one fewer row than expected, and every line below it shifts. We had to seed those prerequisites into the test database first.

**One byte off cascades into hundreds.** That `\dA` case is the whole pattern. A single early divergence (a missing row, a stray newline, an unresolved `:'VAR'`, a crash) pushes everything after it out of alignment, and the diff explodes into 600+ hunks. The only sane way through is to fix the *first* mismatch and re-run, never the last.

**The test driver quietly changes `psql`'s settings.** Upstream's `pg_regress` injects `\set HIDE_TABLEAM on` and `\set HIDE_TOAST_COMPRESSION on` before each script, so the expected output assumes them. Miss that and `\d+` prints extra "Access method:" and compression footers that diverge from the very first table. We pass the same flags in.

**The expected output is version-specific.** `psql.sql`'s reference output bakes in PG-18-only shapes (a `Leakproof?` column, generated columns, new `GRANT` syntax, …). So we pin the byte-exact comparison to PG 18 and skip it on older majors, while the version-agnostic scripts (crosstab, pipeline) run across all of 14–18.

The reward for all that fuss: on PG 18, our output matches the reference `psql`'s down to the last space.

## What we don't pretend to do

The embedded `psql` documents its limitations rather than faking them:

- **GSSAPI/SSPI:** unsupported by design (no native deps) and errors clearly.
- `**keepalives_interval` / `keepalives_count`:** Node's socket API exposes only `enable` and idle delay, so these are accepted but not applied.
- **TLS cipher is runtime-dependent** (the Bun/BoringSSL story above). Both outcomes are secure TLS 1.3.

## Why built with AI is better here

It's worth being explicit, because it shaped every engineering decision: the ~24k-LOC-equivalent reimplementation, the conformance harness, and all security-review fixes were written by an AI coding agent (Claude Code). A human set the scope, reviewed the diffs, and made the judgment calls; the agent typed.

That doesn't make the result automatically good, but it makes verification non-negotiable. AI-written code is fluent and plausible, which is precisely the failure mode you should fear in an auth/TLS path: it looks right. Several of the security findings (the silent `sslmode` downgrade, the skippable SCRAM mutual-auth check, the `\restrict` escape) were exactly that shape: confident, correct-looking code that voided a guarantee on a path nobody clicks through by hand.

So the workflow that actually worked was not "trust the model." It was:

1. **Port tests.** The conformance harness diffs the AI's output against real PostgreSQL byte-for-byte. The model can't talk its way past a failing diff.
2. **Adversarial review.** A thorough, file-by-file pass over the security-sensitive surface — the kind that assumes the code is wrong and tries to prove it — caught the bugs that the happy path hid.
3. **A blocking CI gate.** Once green, the matrix stays the contract: any regression the AI (or anyone) introduces later fails the build.

To summarize: an AI agent can plausibly reimplement a venerable tool, but trust in the result comes from the harness and the review.

## Takeaways

- **Reimplementing a venerable C tool in TypeScript is feasible — if you build the conformance harness first.** The harness, not the code, is the keystone: it turns "does this behave like `psql`?" from a judgment call into a diff.
- **Pin to the source of truth and diff byte-for-byte.** Fetching upstream's own regression suite at test time means you're always testing against the exact behavior you claim to match.
- **In a pure-TS client, the runtime owns more than you think** — TLS ciphers, DER decoding, signal delivery. Test on the runtime you actually ship.
- **Security-sensitive reimplementations demand adversarial review.** The findings were almost all on paths that "worked fine" in casual use.
- **With AI-written code, trust comes from the tests, not the model.** A capable agent + a byte-exact conformance harness + a paranoid security pass shipped this; any two of the three without the others would not have.

The result: run `neonctl psql` on a machine with no Postgres client installed, and it just works — same experience, every platform, zero native dependencies. The trap is gone.