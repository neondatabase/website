---
title: Optimize Lakebase Search
subtitle: Tune search to hit your recall, latency, and cost targets
summary: >-
  A goal-oriented guide to tuning Lakebase Search on Neon. For each target, it
  names the main lever and a concrete starting move: lakebase_ann.probes for
  recall, prefilter and fewer probes for latency, RaBitQ operator classes for
  index size, lakebase_ann_prewarm for cold starts, and the lakebase_bm25
  parameters for full-text and hybrid search. Start with lakebase_ann_advise,
  then hand-tune only where you need to. For exact ranges and defaults, it
  links to the lakebase_vector and lakebase_text reference pages.
enableTableOfContents: true
updatedOn: '2026-11-20T19:45:34.848Z'
---

Lakebase Search performs well on its defaults, so most projects never need to tune it. When you do, tuning is a tradeoff between three things: recall (getting the right rows back), latency (how fast the query returns), and cost (how much compute you use). This page names the main lever for each goal, says which way it moves things, and gives you one concrete move. For exact ranges and defaults, it links to the [lakebase_vector](/docs/extensions/lakebase-vector) and [lakebase_text](/docs/extensions/lakebase-text) reference pages rather than repeating them.

If you're still setting up, start with [Lakebase Search](/docs/ai/lakebase-search) for the architecture and the [Get started guide](/docs/ai/lakebase-search-get-started) for a working search before you tune it.

## At a glance

Each goal has one main lever. Changing it trades one of recall, latency, or cost for another.

| Goal                  | What to change                                                      | The tradeoff                  |
| :-------------------- | :------------------------------------------------------------------ | :---------------------------- |
| Higher recall         | More probes (`lakebase_ann.probes`)                                 | Slower queries                |
| Lower query latency   | Fewer probes, plus `lakebase_ann.prefilter` for selective filters   | Lower recall                  |
| Lower cost            | A smaller index with RaBitQ operator classes (`rabitq8`, `rabitq4`) | Some loss of precision        |
| Faster cold starts    | `lakebase_ann_prewarm` before traffic arrives                       | Warming work up front         |
| Accurate BM25 ranking | `VACUUM` after bulk loads                                           | Maintenance work on the table |

## Start with the advisor

Before you hand-tune anything, run `lakebase_ann_advise` and let it recommend a `probes` value for your workload. It runs a set of sample queries against your index and returns candidate `probes` values across a range of recall, each with its measured latency. You pick the fastest row that meets your recall target and apply its value, so you tune with your own data instead of by guessing.

Pass real query vectors if you have them, or sample from the indexed table with `lakebase_ann_sample`:

```sql
SELECT probes, recall, avg_ms, p50_ms, p95_ms
FROM lakebase_ann_advise(
  'items_embedding_idx'::regclass,
  ARRAY(
    SELECT embedding FROM lakebase_ann_sample(NULL::items, 512)
    WHERE embedding IS NOT NULL
  )
);
```

Then set the `probes` value from the row you chose:

```sql
SET lakebase_ann.probes TO '10';
```

The advisor recommends and measures; it doesn't change your index. On a large index the call can take a while, and its recall and latency are estimates, so verify a value on your real workload before you rely on it in production. `lakebase_ann_advise` is built on `lakebase_ann_tune` and `lakebase_ann_latency`, which you can also run on their own. For the full inputs, column meanings, and version requirements, see [Get recommended probes values](/docs/extensions/lakebase-vector#get-recommended-probes-values).

## Improve recall

The main dial for recall is **`lakebase_ann.probes`**, the number of IVF partitions the query scans. Raising it searches more of the index, so you get more of the true nearest neighbors back, at the cost of latency. Check your index's partition layout with `lakebase_ann_index_info` first, because the shape of `probes` has to match the `lists` array it reports (one value for a one-level index, two for a two-level one).

```sql
-- Find your lists array, then set probes to match its shape.
SELECT lakebase_ann_index_info('items_embedding_idx');

SET lakebase_ann.probes TO '20';
```

Two secondary levers help once probes alone stops paying off. `lakebase_ann.epsilon` controls how many candidates get reranked with full-precision distances, so a higher value recovers precision that quantization gave up, and it takes longer. At index build time, `build_mode = 'quality'` improves recall in exchange for a much longer build (use it only for tables up to 50 million vectors), and setting `lists` explicitly lets you override the automatic partition layout. The reference covers the ranges and defaults for all three: see [Index tuning](/docs/extensions/lakebase-vector#index-tuning).

## Lower query latency

The fastest way to cut latency is to **scan less of the index**: lower `lakebase_ann.probes`. That's the direct inverse of raising it for recall, so move it in small steps and watch recall as you go. The advisor's latency columns show you the cost of each value before you commit to one.

For a filtered query, `lakebase_ann.prefilter` evaluates your `WHERE` conditions before full-precision reranking instead of after, which avoids reranking rows the filter would throw away. It helps when the filter is cheap and removes most rows, and it can add overhead when the filter matches many rows or is expensive, so measure it on your own query. See [Prefilter](/docs/extensions/lakebase-vector#prefilter).

One thing to get right from application code: these settings are session GUCs, so the `SET` and the query have to run on the same connection. With a connection pool or the [Neon serverless driver](/docs/serverless/serverless-driver), where each statement can land on a different connection, issue the `SET` and the query together in a single transaction.

## Lower cost and speed up cold starts

Cost tracks index size and how much compute you run, and the main lever on size is **RaBitQ quantization**. The `rabitq8` and `rabitq4` operator classes store vectors in a smaller, quantized form, which shrinks the index in exchange for some loss of precision that you can offset with `lakebase_ann.epsilon`. See the [operator classes](/docs/extensions/lakebase-vector#operator-classes) table for the full set and the metric each one supports.

Compute scales to zero when the database is idle, so an idle search database costs nothing (see [how Lakebase Search works](/docs/ai/lakebase-search#how-lakebase-search-works)). The tradeoff is the first query after a wake, which is slower while the index loads into memory. Run `lakebase_ann_prewarm` after the compute starts and before traffic arrives to absorb that work up front:

```sql
-- Full search scope: prewarm everything the search path reads.
SELECT lakebase_ann_prewarm('items_embedding_idx');

-- Routing scope: faster, and a better cost-performance tradeoff on large indexes.
SELECT lakebase_ann_prewarm('items_embedding_idx', scope => 'routing');
```

Use `routing` scope for a large index when you want most of the cold-start benefit for less warming work, and `search` scope to warm the full hot portion. See [Prewarm an index](/docs/extensions/lakebase-vector#prewarm-an-index).

## Tune full-text (BM25)

For BM25 search, the first lever is **`lakebase_bm25.default_limit`**, the number of results the index returns before your query's `LIMIT` applies. Setting it to match your `LIMIT` stops the index from doing top-K work you throw away:

```sql
SET lakebase_bm25.default_limit TO 10;
```

Relevance itself is tuned at the index with two storage parameters: `k1` controls term-frequency saturation and `b` controls document-length normalization. Because BM25 scores depend on corpus-wide statistics that are computed at build time and refreshed by `VACUUM`, keeping `VACUUM` current is what keeps scores accurate; after a bulk load, run it manually. For a table dedicated to search, setting `autovacuum_vacuum_insert_scale_factor` to `0` keeps the insert-triggered threshold from drifting as the table grows. As with vector search, `lakebase_bm25.prefilter` helps a strict, cheap filter and can hurt a loose or expensive one. See [Configure default_limit](/docs/extensions/lakebase-text#configure-default_limit), [Keep the index accurate](/docs/extensions/lakebase-text#keep-the-index-accurate), and [Prefilter](/docs/extensions/lakebase-text#prefilter).

If you change tokenization (stop words, synonyms, or the language analyzer) through [lakebase_tokenizer](/docs/extensions/lakebase-tokenizer), regenerate the stored `tsvector` values so old and new rows tokenize the same way. Otherwise your scores mix two tokenizations.

## Tune hybrid search

Hybrid search has no single index knob; you tune it in the query that fuses the two result lists. The two levers are the **candidate count** each search contributes and the **RRF constant** that weights rank positions. Fewer candidates run faster and can drop borderline matches; the RRF constant shifts how much a high rank in one list counts. The [hybrid search example](/docs/ai/lakebase-search-get-started#fuse-ranks-with-rrf) is the place to adjust both, since it owns the full query.

Reranking with Jev is an optional third lever: it reads each candidate alongside the query and reorders by relevance, which can lift quality but adds one AI Gateway call per query. Weigh that call against your latency and cost budget, and keep the plain [RRF path](/docs/ai/lakebase-search-get-started#fuse-ranks-with-rrf) as a fallback. See [Combine results with hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search).

## Advanced: force a plan for a slow filtered query

<Admonition type="warning" title="Situational, and workload-specific">
The techniques below are standard Postgres, not Lakebase Search settings, and they help only in specific situations. They can make the common case slower. Treat them as last resorts, test them against your own queries, and keep them only if you measure a clear win.
</Admonition>

Sometimes a filtered query picks a plan that ignores the ANN index or scans more than it needs, and no amount of index tuning fixes the plan choice itself. Two Postgres-level tricks that teams reach for in that case:

- **Force the planner's hand.** Turning off a scan type the planner keeps choosing, with `SET enable_bitmapscan = off`, or forcing a custom plan for a parameterized query, with `SET plan_cache_mode = force_custom_plan`, can push it toward the index scan you want. These are blunt, so scope them as tightly as you can.
- **One vector index per tenant.** For a multi-tenant table where every query filters to one tenant, a separate index per tenant can beat a single shared index with a tenant filter, at the cost of more indexes to build and maintain.

Both depend entirely on your data and query shapes. Measure the plan before and after on your own queries before you adopt either one.

<NeedHelp />
</content>
</invoke>
