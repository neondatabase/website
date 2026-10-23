---
title: Keep missing values separate in versioned model outputs
subtitle: Preserve JSONB status, model version, and source dates
summary: Classify missing and null scores before comparing versioned model outputs in Postgres.
enableTableOfContents: true
author: sedat-anak
createdAt: '2026-09-13T00:00:00.000Z'
---

Missing keys, JSON null and numeric zero have different meanings. Preserve status, model version and dates before comparing scores.

## Classify before casting

The six rows are invented. `source_as_of` dates the input; `generated_at` dates the output. No tables are created.

```sql
-- Six original synthetic rows; no production data.
WITH sample(id, model_version, source_as_of, payload) AS (
  VALUES
    (1, 'v1', DATE '2026-08-28', '{}'::jsonb),
    (2, 'v2', DATE '2026-08-28', '{"score":null}'::jsonb),
    (3, 'v2', DATE '2026-08-28', '{"score":0}'::jsonb),
    (4, 'v2', DATE '2026-08-29', '{"score":82}'::jsonb),
    (5, 'v2', DATE '2026-08-29', '{"score":"82"}'::jsonb),
    (6, 'v2', DATE '2026-08-29', NULL::jsonb)
)
SELECT id, model_version, source_as_of,
       TIMESTAMPTZ '2026-08-30 12:00:00+00' AS generated_at,
       CASE
         WHEN payload IS NULL THEN 'sql_null'
         WHEN jsonb_typeof(payload) <> 'object' THEN 'invalid_payload'
         WHEN NOT (payload ? 'score') THEN 'missing'
         WHEN jsonb_typeof(payload -> 'score') = 'null' THEN 'json_null'
         WHEN jsonb_typeof(payload -> 'score') <> 'number' THEN 'invalid_type'
         ELSE 'numeric'
       END AS score_state,
       CASE WHEN jsonb_typeof(payload -> 'score') = 'number'
            THEN (payload ->> 'score')::numeric END AS score
FROM sample
ORDER BY id;
```

Observed results:

| id | model_version | source_as_of | score_state | score |
| --- | --- | --- | --- | --- |
| 1 | v1 | 2026-08-28 | missing | NULL |
| 2 | v2 | 2026-08-28 | json_null | NULL |
| 3 | v2 | 2026-08-28 | numeric | 0 |
| 4 | v2 | 2026-08-29 | numeric | 82 |
| 5 | v2 | 2026-08-29 | invalid_type | NULL |
| 6 | v2 | 2026-08-29 | sql_null | NULL |

Check [key existence](https://neon.com/postgresql/json-functions/jsonb-operators), then [jsonb_typeof](https://neon.com/postgresql/json-functions/jsonb_typeof), before casting. The string `"82"` stays invalid.

## Compare a defined group

Run this query independently to select only version `v2` and the input date `2026-08-28`. It repeats the same six synthetic rows, so no earlier statement or table is required.

```sql
WITH classified AS (
-- Six original synthetic rows; no production data.
WITH sample(id, model_version, source_as_of, payload) AS (
  VALUES
    (1, 'v1', DATE '2026-08-28', '{}'::jsonb),
    (2, 'v2', DATE '2026-08-28', '{"score":null}'::jsonb),
    (3, 'v2', DATE '2026-08-28', '{"score":0}'::jsonb),
    (4, 'v2', DATE '2026-08-29', '{"score":82}'::jsonb),
    (5, 'v2', DATE '2026-08-29', '{"score":"82"}'::jsonb),
    (6, 'v2', DATE '2026-08-29', NULL::jsonb)
)
SELECT id, model_version, source_as_of,
       TIMESTAMPTZ '2026-08-30 12:00:00+00' AS generated_at,
       CASE
         WHEN payload IS NULL THEN 'sql_null'
         WHEN jsonb_typeof(payload) <> 'object' THEN 'invalid_payload'
         WHEN NOT (payload ? 'score') THEN 'missing'
         WHEN jsonb_typeof(payload -> 'score') = 'null' THEN 'json_null'
         WHEN jsonb_typeof(payload -> 'score') <> 'number' THEN 'invalid_type'
         ELSE 'numeric'
       END AS score_state,
       CASE WHEN jsonb_typeof(payload -> 'score') = 'number'
            THEN (payload ->> 'score')::numeric END AS score
FROM sample
ORDER BY id
)
SELECT COUNT(*) AS records, COUNT(score) AS numeric_scores, AVG(score) AS mean_score
FROM classified
WHERE model_version = 'v2' AND source_as_of = DATE '2026-08-28';
```

Observed result (`mean_score` is displayed without trailing zeros):

| records | numeric_scores | mean_score |
| --- | --- | --- |
| 2 | 1 | 0 |

The score 82 belongs to another date. Keep the raw payload and status: `COALESCE(score, 0)` makes unavailable scores indistinguishable from measured zeroes. Explicit model and input-date filters prevent these example groups from being combined accidentally.

## Context and disclosure

The [first-party audit of 6,213 archived records](https://www.stockexpertai.com/street-notes/what-a-stock-score-means-an-audit-of-6-213-records) motivates the distinction. Its raw archive is private; public aggregates and reproduction code are available. These invented rows are separate from that archive, and no result establishes predictive performance.

Sedat Anak is the founder overseeing Stock Expert AI. Codex drafted this text and SQL using public references. Both queries were checked in memory with PostgreSQL 18.3 in PGlite 0.5.8.
