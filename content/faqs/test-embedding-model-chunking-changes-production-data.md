---
title: "How do I test a new embedding model or chunking strategy on production data without affecting production?"
subtitle: "Branch your Neon database. The branch starts with production's rows and Lakebase Search indexes, so you can re-embed or re-chunk on the copy, compare results side by side, and delete it when you're done."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I test a different LLM model on a preview branch before switching production?'
  slug: test-different-llm-model-preview-branch
nextLink:
  title: 'How do I test cron jobs in staging or a preview environment without running them twice against production?'
  slug: test-scheduled-jobs-preview-branch-without-double-running
---

Use Neon. Retrieval quality depends on your real documents and your real queries, so a sample dataset won't tell you whether a new embedding model or a different chunk size is better. Testing on production itself is risky, and copying a large vector table to a staging database takes time, storage, and a full index rebuild before you can run a single query. On Neon, you [branch](/docs/introduction/branching) the database instead.

## Why a branch works for this

A Neon branch is a copy-on-write copy of your database at a point in time. It's created instantly, and writes on the branch are saved as deltas, so production sees no extra load ([branching](/docs/introduction/branching)).

That includes your search indexes. With [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search, the `lakebase_ann` and `lakebase_bm25` indexes live in storage, so they're available on every branch without re-indexing ([how lakebase_ann scales](/docs/ai/lakebase-search#how-lakebaseann-scales)). Your baseline is queryable on the branch from the start.

Files come along too. If your source documents are in [Object Storage](/docs/storage/overview), the branch can read every object that existed in the parent's buckets at fork time, and anything you write there stays on the branch ([object branching](/docs/storage/objects#object-branching)).

## A test loop

1. **Branch from production.** In the Console, the CLI (`neon branches create`), or the API.
2. **Record the baseline.** Run a set of real queries against the existing embeddings and save the top results.
3. **Apply the change on the branch.** For a new chunking strategy, re-chunk the source documents into the table. For a new model, re-embed into a new column so the baseline stays intact:

   ```sql
   ALTER TABLE chunks ADD COLUMN embedding_v2 vector(1024);
   -- backfill embedding_v2 with the new model, then:
   CREATE INDEX ON chunks USING lakebase_ann (embedding_v2 vector_cosine_ops);
   ```

   [AI Gateway](/docs/ai-gateway/embeddings) serves several 1024-dimensional models on one OpenAI-compatible endpoint, so trying `qwen3-embedding-0-6b` against `bge-large-en` is a one-line change. `bge-large-en` reads only the first 512 tokens of each input, which matters if your chunks are long.

4. **Compare.** Run the same queries against both columns, or against vector, BM25, and hybrid ranking, and compare which results are relevant. If you rebuild the BM25 index after a large reload, run `VACUUM` so scores reflect the new corpus ([lakebase_text](/docs/extensions/lakebase-text)).
5. **Promote or discard.** Apply the winning change to production as a migration, then delete the branch. Production was never touched.

Run several branches in parallel to compare more than two options.

## Use the same pipeline code

If documents are indexed by a [Neon Function](/docs/compute/functions/overview), the branch runs its own deployment of it against the branch's data and buckets. Deploy the new chunking code to the branch and it writes only there. Inherited triggers start disabled on the branch, so enable the upload trigger there if you want new test uploads indexed automatically ([triggers and branching](/docs/compute/functions/triggers/overview#triggers-and-branching)). See [automatically indexing uploaded documents](/faqs/index-uploaded-documents-for-search-automatically).

## Cost

A child branch starts with no storage of its own and bills the lesser of its accumulated changes or its logical data size, which here is mostly the new embeddings ([storage](/docs/introduction/plans#storage)). Branches beyond your plan's allowance bill per branch-month. The branch's compute scales to zero between test runs, and embedding calls through AI Gateway bill on input tokens. Delete the branch when you're done so it stops billing.

<CTA title="Try Lakebase Search on a branch" description="Install the extensions, embed documents with AI Gateway, and run vector, BM25, and hybrid queries." buttonText="Lakebase Search quickstart" buttonUrl="/docs/ai/lakebase-search-get-started" />
