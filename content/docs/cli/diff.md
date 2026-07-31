---
title: 'Neon CLI command: diff'
subtitle: 'Show a git-style schema diff between two branches'
summary: >-
  The Neon CLI `diff` command prints a git-style schema diff between two
  branches: the branch under review (the `+++` side) and the branch you
  compare against (the `---` side). Use this reference for the exact
  positional argument and flags: set the branch under review with `--branch`,
  the branch to compare against with the `compare-branch` positional, limit
  output to one database with `--database`, and target a project with
  `--project-id`.
enableTableOfContents: true
---

The `diff` command shows a git-style schema diff between two branches, in the same unified diff format `git diff` produces. The branch under review is the `+++` side; the branch you compare against is the `---` side. Omit the `compare-branch` argument to diff against the reviewed branch's parent, which answers "what did I change since branching?". See [Schema diff](/docs/guides/schema-diff) for more on comparing schemas in Neon.

The `+++` branch comes from `--branch`, or the branch pinned in your [`.neon` context file](/docs/cli/set-context), or the project's default branch, in that order. `diff` covers every database on that branch unless you pass `--database`. Use `--output json` or `--output yaml` for a machine-readable diff, one entry per database.

`neon diff` is a shortcut for comparing branch schemas. To compare against a historical point in time (by timestamp or LSN), use the [`neon branches schema-diff`](/docs/cli/branches#schema-diff) subcommand.

## Usage

<CliUsage command="diff" />

## Options

<CliOptions command="diff" />

## Examples

Diff the branch pinned in your `.neon` context against its parent. This works only when the pinned branch has a parent; against the project's default branch it errors, since there's nothing above it to compare:

```bash
neon diff
```

Diff the reviewed branch's schema against the `main` branch:

```bash
neon diff main
```

## Example output

Say your `feature/checkout` branch adds a `discount_code` column to the `orders` table and a new `coupons` table on top of `main`. Diff it against `main` with `--branch`, which reviews an explicit branch regardless of your `.neon` context:

```bash
neon diff main --branch feature/checkout
```

```diff filename="Output" shouldWrap
INFO: → Comparing schema main → feature/checkout
diff --neon database neondb
--- main (br-solitary-block-atxzqx8a)
+++ feature/checkout (br-wandering-bar-atq2lw6c)
@@ -22,6 +22,19 @@
 SET default_table_access_method = heap;

 --
+-- Name: coupons; Type: TABLE; Schema: public; Owner: neondb_owner
+--
+
+CREATE TABLE public.coupons (
+    code text NOT NULL,
+    percent_off integer NOT NULL,
+    expires_at timestamp with time zone
+);
+
+
+ALTER TABLE public.coupons OWNER TO neondb_owner;
+
+--
 -- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
 --

@@ -29,7 +42,8 @@
     id integer NOT NULL,
     customer_id integer NOT NULL,
     total numeric(10,2) NOT NULL,
-    created_at timestamp with time zone DEFAULT now()
+    created_at timestamp with time zone DEFAULT now(),
+    discount_code text
 );
```

Each branch's schema is dumped as `pg_dump --schema-only` SQL and the two dumps are compared, so the diff includes generated lines you didn't write directly, such as `-- Name: ...` comments and `ALTER TABLE ... OWNER TO` statements. Lines prefixed with `+` exist only on the branch under review; `-` lines exist only on the compare branch. If the schemas match, `diff` reports no differences instead.
