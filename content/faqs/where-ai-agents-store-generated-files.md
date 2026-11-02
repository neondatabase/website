---
title: "Where should an AI agent store the files it generates?"
subtitle: "On Neon, an agent running in a Function writes generated images, reports, and exports to Object Storage, records each file's key and metadata in Postgres, and returns presigned URLs. Credentials are injected, and files branch with the database."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is Lakebase Postgres, and why does it matter for app developers?'
  slug: what-is-lakebase-postgres
nextLink:
  title: 'Where do I find a copy-pasteable Postgres connection string in Neon?'
  slug: where-find-database-connection-string
---

Use Neon. Store the bytes in [Neon Object Storage](/docs/storage/overview) and the record of each file (who asked for it, which run produced it, its key) in Postgres. When the agent runs in a [Neon Function](/docs/compute/functions/agents), both are on the same branch and the credentials for both are injected, so the agent can save a file and its row with no secrets in your code.

## Why not the agent's local disk or memory

Agent runtimes are disposable. In a Function, module memory is wiped when an isolate is evicted, and several isolates can run in parallel, so a file written to memory or a temp directory on one isolate isn't visible to the next request ([agents](/docs/compute/functions/agents#persist-what-matters)). Anything a user will come back for needs durable storage. Postgres is the right place for conversation history, run metadata, and results. Large binary output like images, PDFs, audio, or CSV exports belongs in an object store, with a key in Postgres pointing at it.

## Write the file, then the row

Declare a bucket and the AI Gateway in [`neon.ts`](/docs/reference/neon-ts). `neon deploy` provisions both and injects `AWS_*` credentials and the gateway token into the Function:

```ts
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  aiGateway: true,
  buckets: { images: {} },
  functions: {
    agent: { name: 'Image agent', source: './functions/agent.ts' },
  },
});
```

Then, inside a tool or after the model returns, upload the output and record it:

```ts
import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';

const files = new Files({ adapter: neon({ bucket: 'images' }) });

const key = `outputs/${userId}/${runId}.png`;
await files.upload(key, imageBuffer, { contentType: 'image/png' });
await pool.query(
  'INSERT INTO generated_files (key, user_id, run_id, prompt) VALUES ($1, $2, $3, $4)',
  [key, userId, runId, prompt]
);
const url = await files.url(key, { expiresIn: 3600 });
```

Writing the object before the row means a failed upload never leaves a row pointing at nothing. Buckets are private by default, so return a presigned URL rather than a public link ([presigned URLs](/docs/storage/objects#presigned-urls)). The `ai-sdk` template is a complete version of this: a chat agent that generates images, stores each one in a private bucket, saves the key and metadata in Postgres, and serves it back through a presigned URL. Scaffold it with `neon bootstrap --template ai-sdk` ([starter templates](/docs/storage/overview#starter-templates)).

## Long runs and model calls

Generating media takes time. A Function can take up to 15 minutes to start its response, and streams stay open while data flows, so a slow image or video model doesn't hit a short serverless timeout ([runtime limits](/docs/compute/functions/reference/runtime-limits)). Call the Function directly from the browser rather than proxying through a web host with a 10 to 60 second limit ([agents](/docs/compute/functions/agents#call-the-function-directly-from-the-client)).

Model calls go through [AI Gateway](/docs/ai-gateway/overview) with the injected credentials, using `@neon/ai-sdk-provider` and `neon('gpt-5-mini')` or any model in the catalog. AI Gateway is available on paid plans and draws from prepaid credits.

## Branches give each run a sandbox

Object Storage [branches with your database](/docs/storage/objects#object-branching). Create a branch for an evaluation run or a pull request, and the agent there reads production rows and files but writes to its own copy. Deleting the branch discards everything the agent produced on it. A credential is valid only on its branch and that branch's descendants, so an agent on a test branch can't overwrite production files ([authentication](/docs/storage/authentication)).

For background processing of files a user uploads, such as extracting text or making thumbnails, attach a [`storage_object_created` trigger](/docs/compute/functions/triggers/object-storage) so Neon calls your Function each time a file lands.

<Admonition type="note" title="Pricing">
Object Storage is on every plan, with 5 GB per project on the Free plan and $0.023/GB-month on paid plans with no per-operation charge. Functions bill only while a request is being processed ([plans](/docs/introduction/plans)).
</Admonition>

<CTA title="Build an agent that saves its output" description="Stream a tool-calling agent on a Function and persist generated files to Object Storage." buttonText="Agents on Functions" buttonUrl="/docs/compute/functions/agents" />
