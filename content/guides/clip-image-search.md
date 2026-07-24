---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-07-24T00:00:00.000Z'
updatedOn: '2026-07-24T00:00:00.000Z'
title: Build image search over CLIP embeddings with Lakebase Search
subtitle: Search a Flickr30k corpus by text, by image, and by caption from one vector(512) column on Neon Postgres with Lakebase Search.
---

What if you tried to expand beyond the usual image search demos where you embed a few thousand photos, a text query, and then run `order by embedding <=> $1 limit 20` to display results. While that does work, as the corpus grows, the HNSW index behind that query becomes the slowest thing to update. Builds that [stretch into hours on tens of millions of vectors](https://github.com/pgvector/pgvector/issues/807) are a common complaint with such a setup.

This is where [Lakebase Search](https://docs.databricks.com/aws/en/oltp/projects/lakebase-search) gets fun. Its `lakebase_ann` index uses IVF partitioning with RaBitQ quantisation instead of a graph, so it builds 50 to 100 times faster than HNSW on the same data. This guide searches a Flickr30k corpus three ways from one `vector(512)` column: by a phrase, by another photo, and by caption. The captions also get a BM25 index, so you can read a semantic ranking against a keyword one, plus a fourth shape, a radius scan, that pgvector cannot serve from an index.

You will use Neon Postgres, the `lakebase_vector` and `lakebase_text` extensions, CLIP through transformers.js, and the [nlphuji/flickr30k](https://huggingface.co/datasets/nlphuji/flickr30k) dataset.

## Demo

Try it at [neon-demo-lakebase-search-clip-embeddings.vercel.app](https://neon-demo-lakebase-search-clip-embeddings.vercel.app). The tabs below cover each search mode in the application:

<Tabs labels={["Semantic Search", "Keyword Search", "Captions Search", "Near-duplicates Search"]}>

<TabItem>

**Semantic** ranks photos by cosine distance against `lakebase_ann`. It reads meaning, so a photo can rank near the top even when its caption shares no word with the query.

[dogs running in a grassy field](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?q=dogs+running+in+a+grassy+field&mode=semantic)

![Semantic search over CLIP image embeddings](/docs/guides/clip-search-semantic.png)

</TabItem>

<TabItem>

**Keyword** runs the same words through `lakebase_bm25`, which ranks captions by the words they contain.

[bicycle](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?q=bicycle&mode=keyword)

![Keyword search with BM25](/docs/guides/clip-search-keyword.png)

</TabItem>

<TabItem>

**Captions** runs the query vector against the caption table. The result shows how the model describes a scene.

[dogs running in a grassy field](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?q=dogs+running+in+a+grassy+field&mode=captions)

![Caption search](/docs/guides/clip-search-captions.png)

</TabItem>

<TabItem>

**Near-duplicates** returns every photo inside a cosine radius of a photo you choose. Move the slider to widen the band.

[near-duplicates of this dog at 0.15](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?photo=1020651753&mode=radius&radius=0.15)

![Near-duplicate search](/docs/guides/clip-search-near-duplicates.png)

</TabItem>

</Tabs>

## Prerequisites

- Node.js 22 or newer
- A [Neon](https://console.neon.tech) account

## Create the Next.js application

Since there's lot to cover in this application, the easier way is to clone the project, install its dependencies and then learn the core parts around vector and text search with Lakebase.

Run the following commands to clone and install the project:

```bash
git clone https://github.com/rishi-raj-jain/lakebase-search-clip-embeddings
cd lakebase-search-clip-embeddings
npm install
```

It installs the following important dependencies:

- `@huggingface/transformers` to run the CLIP model on CPU in Node
- `@neondatabase/serverless` to query Neon over HTTP (for the app) and over WebSocket (for the setup scripts)
- `aws4fetch` to sign S3 requests to Neon Storage
- `hyparquet` to read the dataset's parquet shards over HTTP range requests to avoid downloading a whole shard at once

Then, copy the environment variable file with the following command:

```bash
cp .env.example .env
```

Now, let's provision a serverless Postgres and a Neon Storage bucket so that you can use the keys to remotely manage the images and perform vector & text search, all within Neon infrastructure.

## Provision a serverless Postgres

Create a project in the [Neon console](https://console.neon.tech) in the US East 2. Once your project is created, you will receive a connection string that you can use to connect to your Neon database. The connection string will look like this:

```bash
# .env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

The app uses this in `src/db/index.ts`, and it opens two kinds of connection:

- `neon()` sends each query as one HTTP `fetch`. It is for a serverless function where every request is a single self-contained statement. The deployed app uses only this.
- `Client` opens one WebSocket session. The setup scripts need it for transactions, `create index concurrently`, and per-session settings like `set lakebase_ann.probes`.

## Provision a Neon Storage bucket

The photos in the dataset are remotely stored in the bucket, and the browser loads them over presigned URLs. Create a [Neon Storage](https://neon.com/docs/storage/get-started) bucket and add its keys to the `.env` file:

```bash
# .env
AWS_ENDPOINT_URL_S3=https://your-bucket-id.storage.region.aws.neon.tech
AWS_ACCESS_KEY_ID=nak_...
AWS_SECRET_ACCESS_KEY=nsk_...
AWS_REGION=us-east-2
S3_BUCKET=storage-test
```

The `src/lib/storage.ts` file in the codebase signs every request with SigV4 over `fetch`. The bucket can stay private, as the app presigns a short-lived public URL for each result, without routing images through the server.

## Understand lakebase_vector and lakebase_text

[Lakebase Search](/docs/ai/lakebase-search) is powered by the following two Postgres extensions:

- [`lakebase_vector`](https://docs.databricks.com/aws/en/oltp/projects/lakebase-vector): provides the `lakebase_ann` index for approximate nearest-neighbour search. It reuses pgvector's `vector` type and pgvector's distance operators, so `<->`, `<#>`, and `<=>` can be used as usual, and the opclasses are the same `vector_l2_ops`, `vector_ip_ops`, and `vector_cosine_ops`. Underneath, it uses [IVF partitioning with RaBitQ quantisation](/docs/extensions/lakebase-vector#why-lakebasevector), an architecture built to scale past what HNSW reaches. RaBitQ compresses the vectors 4 to 8 times and builds the index 50 to 100 times faster than HNSW at the same corpus size, and cold starts stay fast.

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
```

- [`lakebase_text`](https://docs.databricks.com/aws/en/oltp/projects/lakebase-text): provides `lakebase_bm25`, which indexes a `tsvector` column and ranks with BM25. Postgres already has full-text search through GIN and `ts_rank`, but `ts_rank` scores a row without any view of the corpus, so its numbers deviate as the table grows. BM25 uses document frequency and average document length. The index also does [top-K pushdown with Block-Max WAND](/docs/extensions/lakebase-text#why-lakebasetext), so a `limit 24` can stop scoring once it proves nothing else can enter the top 24.

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_text;
```

## Pull the Flickr30k dataset

[nlphuji/flickr30k](https://huggingface.co/datasets/nlphuji/flickr30k) fits this project well because each photo carries five human-written captions, giving you a caption table five times the size of the photo table to index. The images are everyday Flickr snapshots of people and animals, so it can be used to test semantic queries against real scenes.

Hugging Face serves the dataset as nine parquet shards, and the JPEG bytes are inline in an `image.bytes` column. The `scripts/pull-dataset.ts` file in the codebase reads those shards over HTTP range requests, decodes each photo to a local cache, and uploads it to the bucket.

The important piece of code with reading parquet shards is the following:

```ts
const rows = await parquetReadObjects({ file, compressors, rowStart, rowEnd, utf8: false })
```

Using `utf8: false` stops the parquet reader from decoding every `BYTE_ARRAY` column as a string. The caption columns carry a UTF8 converted type, so they still come back as strings either way.

The dataset pull runs in two passes: first decodes shards to disk and the second uploads images to the bucket.

Run the dataset pull and push script with the following command:

```bash
npm run dataset:pull
```

## Embed images and text into one vector column

[CLIP](https://huggingface.co/docs/transformers/en/model_doc/clip) is two encoders trained together against a contrastive loss. A vision transformer reads images, a text transformer reads strings, and both project into the same 512-dimension space. The training objective pulls a photo and its caption toward each other and pushes mismatched pairs apart, so a vector means the same thing whichever tower produced it.

That is the reason this project has one embedding column instead of two. Once you hold 512 floats, text-to-image search and image-to-image search are the same SQL statement with a different value bound to `$1`.

The code uses [`Xenova/clip-vit-base-patch32`](https://huggingface.co/Xenova/clip-vit-base-patch32) through [transformers.js](https://github.com/huggingface/transformers.js), which runs the ONNX weights on CPU in Node. Both towers load lazily as singletons in `src/lib/clip.ts` file, so the weights download once and stay in memory for the life of the process.

```ts
export const MODEL_ID = 'Xenova/clip-vit-base-patch32'
export const CLIP_DIMS = 512
```

In the code, `WithProjection` model classes are used to read the projection head, the layer the contrastive loss operated on, so its 512-float output is the one that compares across towers.

### Normalise vectors before you store them

CLIP's projection heads do not emit unit vectors. Raw norms out of this checkpoint run somewhere around 8 to 12 and move with image content. Make sure to normalise them once, at the write time:

```ts
function normalise(v: ArrayLike<number>): number[] {
  let sumSquares = 0
  for (let i = 0; i < v.length; i++) sumSquares += v[i]! * v[i]!
  const norm = Math.sqrt(sumSquares)
  if (norm === 0) throw new Error('cannot normalise a zero vector')
  const out = new Array<number>(v.length)
  for (let i = 0; i < v.length; i++) out[i] = v[i]! / norm
  return out
}
```

`vector_cosine_ops` already divides by the norms, so ranking would still work if you skip this step. But two other things need it:

- The distances you read back only mean something on a unit sphere, so a radius like 0.18 has no fixed meaning when vectors have any length.
- If you ever swap `vector_cosine_ops` for `vector_ip_ops`, an unnormalised index ranks by magnitude instead of angle, and the results fail to then measure similarity.

The embed step reads each photo from the bucket, runs both towers, and writes `data/embeddings.jsonl`. It skips any photo id it has already embedded. Run the embedding step with the following command:

```bash
npm run dataset:embed
```

## Set up the database schema

The schema is two tables and a small cache table:

```sql
create extension if not exists vector;

create table if not exists photos (
  id        text primary key,
  filename  text not null,
  width     integer not null,
  height    integer not null,
  split     text not null,
  embedding vector(512) not null
);

create table if not exists captions (
  id        serial primary key,
  photo_id  text not null references photos(id) on delete cascade,
  idx       smallint not null,
  body      text not null,
  embedding vector(512) not null,
  tsv       tsvector generated always as (to_tsvector('english', body)) stored
);
```

In the schema:

- `photos.embedding` holds vision-tower output and `captions.embedding` holds text-tower output, and both are `vector(512)`. They are directly comparable because CLIP puts them in the same space.

- `captions.tsv` is a generated column, and BM25 indexes it. It's built from the `body` column, so its words and the caption text stay in sync.

There is also a small `query_embeddings` table keyed on the normalised query text. A repeated text search then costs one indexed primary-key lookup instead of a full model load. Run the schema creation with the following command:

```bash
npm run db:schema
```

## Load the corpus and build the indexes

Each index created by both the extensions reads the corpus as it builds. `lakebase_ann` partitions the rows with IVF, so it needs them in place to form the partitions it later uses. `lakebase_bm25` computes its corpus statistics once, at build time, so it needs the full caption set to learn document frequencies and average document length. Load the rows first with the following command:

```bash
npm run dataset:load
```

Then build the three indexes from the code in `scripts/create-indexes.ts`:

```sql
create index photos_embedding_ann on photos
using lakebase_ann (embedding vector_cosine_ops)
with (build_mode = 'standard');

create index captions_embedding_ann on captions
using lakebase_ann (embedding vector_cosine_ops)
with (build_mode = 'standard');

create index captions_tsv_bm25 on captions
using lakebase_bm25 (tsv tsvector_bm25_ops)
with (k1 = 1.2, b = 0.75);
```

In the queries above:

- `build_mode` takes `standard`, which optimises for recall.
- On the BM25 side, `k1` controls term-frequency saturation and `b` controls document-length normalisation. Flickr captions are short and even in length, so `b` does very little for this kind of dataset.

Now, run the following command to build all three indexes:

```bash
npm run db:index
```

## Search photos by text

To search photos by text, the following query in the application ranks every photo by cosine distance from the query vector `$1` and returns the 24 closest:

```sql
select id, filename, embedding <=> $1 as distance
from photos
order by embedding <=> $1
limit 24;
```

See that this is the same statement you would write against pgvector's HNSW or IVFFlat. Swapping the index type changes the plan, the build time, and the recall profile. That is what makes `lakebase_vector` easy to adopt on an existing project. You keep using the pgvector query you already have and change only the index.

In `src/lakebase/ann.ts` the vector binds as a parameter and casts, so the plan is reused and nothing user-supplied reaches the query text:

```ts
const rows = await db.query(
  `select id, filename, embedding <=> $1::vector as distance
   from photos order by embedding <=> $1::vector limit $2`,
  [JSON.stringify(embedding), 24],
)
```

Try it: [dogs running in a grassy field](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?q=dogs+running+in+a+grassy+field&mode=semantic).

## Search photos by image

To search by photos by image, you simply embed the incoming image with the vision tower (instead of embedding a string with the text tower), and then you run the query above.

In the [demo](#demo), it's the upload image dialog box. Drop in any image, read the file bytes and embed them with the vision tower:

```ts
const bytes = new Uint8Array(await file.arrayBuffer())
const { embedding } = await embedImage(new Blob([bytes], { type: file.type }))
```

When the query image is already a row in your table, do not fetch its vector and send it back. A 512-dimension vector is about 8 KB of JSON in each direction. Instead, emit a subselect instead, and let Postgres resolve the vector inside the same statement:

```sql
select p.id, p.filename,
       p.embedding <=> (select embedding from photos where id = $1) as distance
from photos p
where p.id <> $1
order by p.embedding <=> (select embedding from photos where id = $1)
limit 24;
```

The `where p.id <> $1` is there because a photo is always its own nearest neighbour at distance zero.

## Rank captions against a photo

Rank the caption corpus against a photo's own embedding, and you get the model's description of the scene:

```sql
select c.body, c.embedding <=> $1 as score
from captions c
order by c.embedding <=> $1
limit 24;
```

Notice that nothing in the query above compares an image to text. It simply compares the 512 floats of a caption against the 512 floats of a photo.

Try it: [captions for dogs running in a grassy field](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?q=dogs+running+in+a+grassy+field&mode=captions).

## Compare BM25 with the vector ranking

Vector search ranks by what a photo looks like, while BM25 ranks by which captions contain your words. Running both over the same captions is a quick way to see what your embeddings are doing:

```sql
select body,
       tsv <@> to_bm25query(
         to_tsvector('english', $1),
         'captions_tsv_bm25'
       ) as score
from captions
order by score
limit 24;
```

The following two parts in that query are new with lakebase extensions, even if you have written full-text search in Postgres before:

- `to_bm25query` takes the index name as its second argument. BM25 needs document frequencies and an average document length, both of which are properties of a corpus, and both of which are stored in the index. A plain `tsvector @@ tsquery` match has no equivalent, because it never consults the corpus at all.
- `<@>` returns a negative score, so ascending order puts the most relevant row first.

Try [bicycle in keyword mode](https://neon-demo-lakebase-search-clip-embeddings.vercel.app/?q=bicycle&mode=keyword) and then in the semantic mode. Keyword mode returns captions that contain the word bicycle. Semantic mode returns photos of people cycling, some of whose captions say bike.

## Run an indexed radius search

Every query so far we've learnt has a pgvector equivalent. This one is different: pgvector can't serve it from an index.

With pgvector, searching for every photo within 0.15 cosine of a given one would just be a filter: an HNSW or IVFFlat index sorts by distance but cannot seek by it, so Postgres reads the rows first and then applies the bound. `lakebase_ann` instead registers a radius operator, `<<=>>`, on `vector_cosine_ops`, so the bound goes into the index and only the matching region is read.

```sql
-- pgvector: scans the table, then filters
select id from photos where embedding <=> $1 < 0.15;

-- lakebase_ann: sphere() builds the region, <<=>> tests it against the index
select id, filename
from photos
where embedding <<=>> sphere($1, $2)
order by embedding <=> $1
limit 60;
```

The `order by` still uses `<=>` because you usually want the matches sorted, even though the answer is a set rather than a top-k.

## Inspect and tune the ANN index

`lakebase_vector` extension also has two helpful functions:

### lakebase_ann_index_info to report the index's partition layout, probe counts, and epsilon

```sql
select lakebase_ann_index_info('photos_embedding_ann'::regclass);
```

It returns JSON with the partition layout, the default probe counts, and the default epsilon. The `lists` array is empty until the corpus is large enough for the index to partition, and while it is empty every query already scans everything, so no probe setting changes a single result.

Once `lists` is populated, two settings come into play:

- `lakebase_ann.probes` takes one integer per partition level. Higher values read more of the index and raise recall at the cost of latency.
- `lakebase_ann.epsilon` is the re-ranking margin. It defaults to 1.9 and is valid from 0.0 to 4.0.

Both are session settings, so you set them per connection with `SET`, and they are only valid until the connection closes. Raise `probes` or `epsilon` to read more of the index and gain recall but at the cost of latency.

```sql
set lakebase_ann.probes to '32';
```

Because a serverless function on the HTTP driver has no session to hold these, use a pooled connection when you need non-default values at query time.

### lakebase_ann_prewarm to load the index into memory and cut first-query cold-start latency

```sql
select lakebase_ann_prewarm('photos_embedding_ann'::regclass);
```

Lakebase ANN indexes are storage-backed and survive a scale-to-zero on their own, so this call only removes cold-start latency on the first query afterwards. You can see all of this from one command in the application:

```bash
npm run db:stats
```

## Deploy to Vercel

<a href="https://vercel.com/new/clone?repository-url=https://github.com/rishi-raj-jain/clip-image-search">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>

The repository is ready to deploy to Vercel. Use the following steps to deploy:

- Fork [the GitHub repository](https://github.com/rishi-raj-jain/lakebase-search-clip-embeddings).
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you've just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy.

## Summary

You now have image search over CLIP embeddings in Postgres, with three retrieval shapes coming out of one `vector(512)` column: text-to-image, image-to-image, and image-to-caption. The captions carry a `lakebase_bm25` index as well, so you can run the same query through a semantic ranking and a keyword ranking and see they don't match. The radius operator `<<=>>` then gives you an indexed near-duplicate search that pgvector cannot serve from an index.
