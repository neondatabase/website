---
title: 'Build an image processing API with Neon Functions, Sharp, and Neon AI Gateway'
subtitle: 'Learn how to build an image API that resizes, crops, optimizes, analyzes, and captions images using Neon Functions, Sharp, and the Neon AI Gateway.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-08-24T00:00:00.000Z'
updatedOn: '2026-08-24T07:44:20.743Z'
---

If you're building an application that handles images (profile avatars, product photos, or user uploads), you run into the same set of problems every time. Users upload 12-megapixel photos straight from their phones, and if you serve those files back as-is, pages get slow and bandwidth costs climb. Every image needs resizing for different layouts, cropping to fit, and re-encoding into modern formats like WebP. On top of that, every image needs alt text for accessibility and SEO.

This guide shows you how to build a complete image processing API that handles all of that in one place. The API provides five endpoints to resize, crop, optimize, analyze, and caption images. You'll also learn how to store the processed images in your branch's [Neon Object Storage](/docs/storage/overview) bucket, so you can serve them directly from S3 instead of reprocessing on every request.

The API runs on [**Neon Functions**](/docs/compute/functions/overview) which provide a serverless compute environment in the same region as your Neon Postgres database. Image transformations run on [**Sharp**](https://sharp.pixelplumbing.com), a high-performance image processing library powered by libvips. And for captions, the [**Neon AI Gateway**](/docs/ai-gateway/overview) provides access to the latest vision models.

## How it works

```mermaid
flowchart LR
    Client[Client] -->|"POST image (raw or multipart)"| API["Hono API<br/>(Neon Functions)"]
    API -->|"/resize /crop /optimize /analyze"| Sharp["Sharp pipeline"]
    Sharp -->|"processed image"| Client
    API -->|"/caption"| Gateway["Neon AI Gateway<br/>(llama-4-maverick)"]
    Gateway -->|"caption text"| Client
```

1. **Upload**: The client POSTs an image to any endpoint, either as a raw binary body with an `image/*` content type or as a `multipart/form-data` upload.
2. **Sharp processing**: The `/resize`, `/crop`, `/optimize`, and `/analyze` routes decode the image and run the pipeline in-process.
3. **AI captioning**: The `/caption` route uses Sharp to downscale the image, then sends it to the Neon AI Gateway for captioning. The gateway handles authentication and routing to the model.

## Prerequisites

Before starting, ensure you have:

1. **Node.js**: Version 20 or later (v24 recommended). Download from [nodejs.org](https://nodejs.org/).
2. **Neon Account**: Sign up for an account at [console.neon.tech](https://console.neon.tech/signup).
3. **The Neon CLI**: Installed globally (`npm i -g neon`) and authenticated (`neon auth`). See the [Neon CLI Quickstart](/docs/cli/quickstart) for details.

<Steps>

## Set up the project

Create a directory for the project and initialize a workspace:

```bash
mkdir image-api && cd image-api
npm init -y
```

Run the Neon CLI initialization command:

```bash
neon init
```

Use the default setup options for all prompts: this enables AI skills, configures the MCP server, and installs the VS Code extension. These ensure AI agents such as Claude Code and Cursor can assist you in building and working with Neon.

During initialization, **Neon Platform** and **Postgres** skills are installed automatically. You'll also need the **Neon Functions**, **Neon AI Gateway**, and **Neon Object Storage** skills so AI agents have the context to help you build and deploy your image API. Install them with the following command:

```bash
npx skills add neondatabase/agent-skills --skill neon-ai-gateway --skill neon-functions --skill neon-object-storage
```

Link your local workspace to a Neon project:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** named `image-api` (or pick an existing one). Next, select a region. Choose **AWS US East 2 (Ohio)** (`aws-us-east-2`), as Neon Functions are currently available only in this region during beta. When asked which Neon services you require, select **Functions** and **AI Gateway**. Finally, confirm that you want to manage your setup as code, which generates a `neon.ts` file in your project root:

```text
$ neon link
✔ Which organization would you like to link? › MyOrg (org-example-12345678)
✔ Which project would you like to link? › ＋ Create new project…
✔ Name for the new project: … image-api
✔ Which region should the new project run in? › AWS US East 2 (Ohio) (aws-us-east-2)
Created project quiet-fog-09491284 ("image-api") in aws-us-east-2.
Linked ~/image-api/.neon:
  orgId:     org-example-12345678
  projectId: quiet-fog-09491284
  branch:    main

INFO: Pulled 3 Neon variables into ~/image-api/.env.local: NEON_BRANCH, DATABASE_URL, DATABASE_URL_UNPOOLED
✔ Manage this project's Neon setup as code? Adds a neon.ts you can edit and apply with `neon config apply`. … yes
✔ Which Neon services should neon.ts declare? (space to toggle, enter to confirm) › Functions
INFO: Created neon.ts declaring functions.
INFO: Created hello.ts - the source of the hello function.
INFO: Installing @neon/config, @neon/env with npm…
```

The `neon link` command also creates a placeholder function, `hello.ts`, at your project root. You'll build the image API in your own `index.ts` file, so delete the placeholder:

```bash
rm hello.ts
```

It also creates a `.env.local` file with your project's variables.

Install the dependencies for your function. You'll need `hono` for routing, `sharp` for image processing, and the Neon AI SDK provider and Vercel AI SDK for captioning. You'll also install TypeScript and Node.js types for development:

```bash
npm install hono sharp @neon/ai-sdk-provider ai
npm install --save-dev @types/node typescript esbuild
```

- `hono`: A lightweight web framework for routing the API endpoints.
- `sharp`: A high-performance image processing library (resizing, cropping, format conversion, metadata) powered by libvips.
- `@neon/ai-sdk-provider`: Neon's provider for the [Vercel AI SDK](https://ai-sdk.dev/docs), giving you access to models through the Neon AI Gateway.
- `ai`: The Vercel AI SDK, used here for `generateText` with image input.

TypeScript needs a `tsconfig.json` for the linter to resolve types correctly. Create it in your project root:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Build the image API

Create an `index.ts` file in the root of your project. This is where you'll implement the API endpoints.

### Import dependencies and set constants

Import the required modules and define constants for maximum image size, allowed formats, and fit modes. Also, define a custom error class for handling bad requests:

```ts filename="index.ts"
import { Hono, type Context } from 'hono';
import sharp, { type FitEnum, type FormatEnum } from 'sharp';
import { neon } from '@neon/ai-sdk-provider';
import { generateText } from 'ai';

const app = new Hono();

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const FORMATS = ['jpeg', 'png', 'webp', 'avif'];
const FITS = ['cover', 'contain', 'fill', 'inside', 'outside'];

class BadRequest extends Error {}

```

- `hono` is the web framework that handles routing, and `sharp` is the image processing library. `Context`, `FitEnum`, and `FormatEnum` are types used across the route handlers.
- `neon` is Neon's AI SDK provider, and `generateText` comes from the Vercel AI SDK. You'll use both in the `/caption` route.
- `MAX_IMAGE_SIZE` caps uploads at 10 MB. `FORMATS` and `FITS` are the allowed values for the `format` and `fit` query parameters; the routes validate against them.
- `BadRequest` is a custom error type. Routes throw it for bad input, and the central error handler at the bottom maps it to a `400` response.

### Read the uploaded image

Every endpoint starts the same way: reading the image bytes from the request. This helper accepts the image two ways, as a raw binary body with an `image/*` content type (what `curl --data-binary` sends) or as `multipart/form-data` with the file in a `file` field (what browsers and HTML forms send). Anything else gets a `400`, and uploads are capped at 10 MB:

```ts filename="index.ts"
// Reads the uploaded image from the request, either as a raw binary body
// (Content-Type: image/*) or as multipart/form-data with a "file" field.
async function getImageBuffer(c: Context): Promise<Buffer> {
  const contentType = c.req.header('content-type') ?? '';

  if (contentType.startsWith('multipart/form-data')) {
    const form = await c.req.parseBody();
    const file = form['file'];
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      throw new BadRequest('Expected an image in the "file" form field');
    }
    return checkSize(Buffer.from(await file.arrayBuffer()));
  }

  if (!contentType.startsWith('image/')) {
    throw new BadRequest(
      'Send the image as a raw body with an image/* Content-Type, or as multipart/form-data'
    );
  }

  return checkSize(Buffer.from(await c.req.arrayBuffer()));
}

function checkSize(buffer: Buffer): Buffer {
  if (buffer.byteLength === 0) throw new BadRequest('Empty request body');
  if (buffer.byteLength > MAX_IMAGE_SIZE) throw new BadRequest('Image exceeds the 10 MB limit');
  return buffer;
}

```

`getImageBuffer` branches on the `Content-Type` header. For a multipart body it reads the `file` field from the parsed form; for a raw body it reads the entire request as a buffer. Both paths run through `checkSize`, which rejects empty requests and anything over 10 MB.

### Output helpers

Two small helpers shape every response. `getFormat` reads the `format` query parameter (default `webp`) and validates it against `FORMATS`. `imageResponse` builds the response with the right `Content-Type`, a long-lived `Cache-Control` header, and any extra headers you pass in:

```ts filename="index.ts"
function getFormat(c: Context): keyof FormatEnum {
  const format = c.req.query('format') ?? 'webp';
  if (!FORMATS.includes(format)) throw new BadRequest(`format must be one of: ${FORMATS.join(', ')}`);
  return format as keyof FormatEnum;
}

function imageResponse(c: Context, output: Buffer, format: keyof FormatEnum, extraHeaders: Record<string, string> = {}) {
  return c.body(new Uint8Array(output), 200, {
    'Content-Type': `image/${format}`,
    'Cache-Control': 'public, max-age=31536000, immutable',
    ...extraHeaders,
  });
}

```

The `Cache-Control` header marks processed images as immutable for a year, so you can cache them at the edge or in a CDN. The `/optimize` route uses `extraHeaders` to report the size savings.

### List the endpoints

A `GET /` route returns the list of available endpoints, which is handy for a quick smoke test after deployment:

```ts filename="index.ts"
app.get('/', (c) =>
  c.json({
    endpoints: ['POST /resize', 'POST /crop', 'POST /optimize', 'POST /analyze', 'POST /caption'],
  })
);

```

### Resize images

The `/resize` route resizes to the given `width` and `height`. Pass one or both; if you pass only one, Sharp preserves the aspect ratio. The `fit` parameter controls how the image fills the box: `cover` fills it and crops the overflow, `contain` fits it entirely inside the box, and so on. `.rotate()` applies any EXIF orientation first, so phone photos come out upright:

```ts filename="index.ts"
app.post('/resize', async (c) => {
  const input = await getImageBuffer(c);
  const width = Number(c.req.query('width')) || undefined;
  const height = Number(c.req.query('height')) || undefined;
  const fit = c.req.query('fit') ?? 'cover';
  const format = getFormat(c);

  if (!width && !height) throw new BadRequest('Pass at least one of ?width or ?height');
  if (!FITS.includes(fit)) throw new BadRequest(`fit must be one of: ${FITS.join(', ')}`);

  const output = await sharp(input)
    .rotate() // normalize EXIF orientation from phone cameras
    .resize({ width, height, fit: fit as keyof FitEnum })
    .toFormat(format, { quality: 80 })
    .toBuffer();

  return imageResponse(c, output, format);
});

```

The route validates its query parameters up front: at least one dimension is required, and `fit` must be one of `FITS`. Then the Sharp pipeline runs `.rotate()` → `.resize()` → `.toFormat()` → `.toBuffer()`, and the result goes out through `imageResponse`.

### Crop images

The `/crop` route extracts a pixel rectangle defined by `left`, `top`, `width`, and `height` using Sharp's [`extract`](https://sharp.pixelplumbing.com/api-operation#extract):

```ts filename="index.ts"
app.post('/crop', async (c) => {
  const input = await getImageBuffer(c);
  const left = Number(c.req.query('left'));
  const top = Number(c.req.query('top'));
  const width = Number(c.req.query('width'));
  const height = Number(c.req.query('height'));
  const format = getFormat(c);

  const valid =
    Number.isInteger(left) && left >= 0 &&
    Number.isInteger(top) && top >= 0 &&
    Number.isInteger(width) && width > 0 &&
    Number.isInteger(height) && height > 0;
  if (!valid) {
    throw new BadRequest('Pass non-negative integer ?left and ?top, and positive integer ?width and ?height');
  }

  const output = await sharp(input)
    .rotate()
    .extract({ left, top, width, height })
    .toFormat(format, { quality: 80 })
    .toBuffer();

  return imageResponse(c, output, format);
});

```

Unlike resize, crop coordinates are absolute pixels, so the route is strict about validation: `left` and `top` must be non-negative integers, and `width` and `height` must be positive integers.

### Optimize images

The `/optimize` route re-encodes the image to `format` (default `webp`) at `quality` (1-100, default 80). The `X-Original-Size` and `X-Optimized-Size` response headers let you see the savings without opening the file:

```ts filename="index.ts"
app.post('/optimize', async (c) => {
  const input = await getImageBuffer(c);
  const format = getFormat(c);
  const quality = Math.min(Math.max(Number(c.req.query('quality')) || 80, 1), 100);

  const output = await sharp(input)
    .rotate()
    .toFormat(format, { quality })
    .toBuffer();

  return imageResponse(c, output, format, {
    'X-Original-Size': String(input.byteLength),
    'X-Optimized-Size': String(output.byteLength),
  });
});

```

`quality` is clamped to the 1-100 range, so a bad value can't crash the pipeline or produce a useless output.

### Analyze images

The `/analyze` route runs [`metadata()`](https://sharp.pixelplumbing.com/api-input#metadata) and [`stats()`](https://sharp.pixelplumbing.com/api-input#stats) in parallel and returns the dimensions, format, size, alpha channel, and dominant color as a hex string. The dominant color is useful for placeholder backgrounds and theme colors while the full image loads:

```ts filename="index.ts"
app.post('/analyze', async (c) => {
  const input = await getImageBuffer(c);
  const [metadata, stats] = await Promise.all([sharp(input).metadata(), sharp(input).stats()]);

  const { r, g, b } = stats.dominant;
  const toHex = (v: number) => v.toString(16).padStart(2, '0');

  return c.json({
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    sizeBytes: input.byteLength,
    hasAlpha: metadata.hasAlpha,
    dominantColor: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
  });
});

```

Because the two Sharp calls run in `Promise.all`, metadata and stats are gathered concurrently. The response is JSON rather than an image, so this route returns through `c.json` instead of `imageResponse`.

### Caption images

The `/caption` route is the AI-powered one. It downscales the image to fit within 1024x1024 first. Vision models don't benefit from full-resolution input, so this cuts token usage and latency. The downscaled JPEG then goes to `llama-4-maverick` as an `image` content part in a [`generateText`](https://ai-sdk.dev/cookbook/node/generate-text-with-image-prompt) call, and the model returns a one-sentence alt text caption:

```ts filename="index.ts"
app.post('/caption', async (c) => {
  const input = await getImageBuffer(c);

  // Downscale before calling the model: vision models don't need full-resolution
  // input, and a smaller image costs fewer tokens and less latency.
  const thumbnail = await sharp(input)
    .rotate()
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const { text } = await generateText({
    model: neon('llama-4-maverick'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Write a concise one-sentence alt text caption for this image. Describe only what is visible.',
          },
          { type: 'image', image: thumbnail, mediaType: 'image/jpeg' },
        ],
      },
    ],
  });

  return c.json({ caption: text });
});

```

Notice there are no credentials in this code. The `neon()` provider reads `NEON_AI_GATEWAY_BASE_URL` and `NEON_AI_GATEWAY_TOKEN` from the environment. Neon injects both automatically when the AI Gateway is enabled, which you'll do in `neon.ts` next. See [Neon Functions environment variables](/docs/compute/functions/environment-variables) for the full list of injected variables.

<Admonition type="note" title="Model access">
For improved captioning, you can use frontier vision models like `gemini-3-flash` instead of `llama-4-maverick`.

Frontier models are [rolling out gradually](/docs/ai-gateway/models#model-access). If `gemini-3-flash` isn’t available in your project yet, open-weight vision models such as `llama-4-maverick` and `gemma-3-12b` are accessible immediately. Just swap the model ID in the `/caption` route. No other changes are required.
</Admonition>

### Handle errors and export

Finally, the central error handler. Bad input throws a `BadRequest`, which `onError` maps to a `400` JSON response. Unexpected failures, including Sharp rejecting a corrupt file, become a `500`. Defining the mapping once keeps the route handlers focused on the image pipeline. The last line exports the app so Neon Functions can serve it:

```ts filename="index.ts"
// Central error handler: BadRequest becomes a 400, anything else a 500.
app.onError((err, c) => {
  if (err instanceof BadRequest) return c.json({ error: err.message }, 400);
  console.error(err);
  return c.json({ error: 'Failed to process image' }, 500);
});

export default app;
```

### Full code

Every snippet above is added to the same `index.ts` file. Here's the complete file, ready to copy:

<details>
<summary>Complete `index.ts` file</summary>

```ts filename="index.ts"
import { Hono, type Context } from 'hono';
import sharp, { type FitEnum, type FormatEnum } from 'sharp';
import { neon } from '@neon/ai-sdk-provider';
import { generateText } from 'ai';

const app = new Hono();

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const FORMATS = ['jpeg', 'png', 'webp', 'avif'];
const FITS = ['cover', 'contain', 'fill', 'inside', 'outside'];

class BadRequest extends Error {}

// Reads the uploaded image from the request, either as a raw binary body
// (Content-Type: image/*) or as multipart/form-data with a "file" field.
async function getImageBuffer(c: Context): Promise<Buffer> {
  const contentType = c.req.header('content-type') ?? '';

  if (contentType.startsWith('multipart/form-data')) {
    const form = await c.req.parseBody();
    const file = form['file'];
    if (!(file instanceof File) || !file.type.startsWith('image/')) {
      throw new BadRequest('Expected an image in the "file" form field');
    }
    return checkSize(Buffer.from(await file.arrayBuffer()));
  }

  if (!contentType.startsWith('image/')) {
    throw new BadRequest(
      'Send the image as a raw body with an image/* Content-Type, or as multipart/form-data'
    );
  }

  return checkSize(Buffer.from(await c.req.arrayBuffer()));
}

function checkSize(buffer: Buffer): Buffer {
  if (buffer.byteLength === 0) throw new BadRequest('Empty request body');
  if (buffer.byteLength > MAX_IMAGE_SIZE) throw new BadRequest('Image exceeds the 10 MB limit');
  return buffer;
}

function getFormat(c: Context): keyof FormatEnum {
  const format = c.req.query('format') ?? 'webp';
  if (!FORMATS.includes(format)) throw new BadRequest(`format must be one of: ${FORMATS.join(', ')}`);
  return format as keyof FormatEnum;
}

function imageResponse(c: Context, output: Buffer, format: keyof FormatEnum, extraHeaders: Record<string, string> = {}) {
  return c.body(new Uint8Array(output), 200, {
    'Content-Type': `image/${format}`,
    'Cache-Control': 'public, max-age=31536000, immutable',
    ...extraHeaders,
  });
}

app.get('/', (c) =>
  c.json({
    endpoints: ['POST /resize', 'POST /crop', 'POST /optimize', 'POST /analyze', 'POST /caption'],
  })
);

app.post('/resize', async (c) => {
  const input = await getImageBuffer(c);
  const width = Number(c.req.query('width')) || undefined;
  const height = Number(c.req.query('height')) || undefined;
  const fit = c.req.query('fit') ?? 'cover';
  const format = getFormat(c);

  if (!width && !height) throw new BadRequest('Pass at least one of ?width or ?height');
  if (!FITS.includes(fit)) throw new BadRequest(`fit must be one of: ${FITS.join(', ')}`);

  const output = await sharp(input)
    .rotate() // normalize EXIF orientation from phone cameras
    .resize({ width, height, fit: fit as keyof FitEnum })
    .toFormat(format, { quality: 80 })
    .toBuffer();

  return imageResponse(c, output, format);
});

app.post('/crop', async (c) => {
  const input = await getImageBuffer(c);
  const left = Number(c.req.query('left'));
  const top = Number(c.req.query('top'));
  const width = Number(c.req.query('width'));
  const height = Number(c.req.query('height'));
  const format = getFormat(c);

  const valid =
    Number.isInteger(left) && left >= 0 &&
    Number.isInteger(top) && top >= 0 &&
    Number.isInteger(width) && width > 0 &&
    Number.isInteger(height) && height > 0;
  if (!valid) {
    throw new BadRequest('Pass non-negative integer ?left and ?top, and positive integer ?width and ?height');
  }

  const output = await sharp(input)
    .rotate()
    .extract({ left, top, width, height })
    .toFormat(format, { quality: 80 })
    .toBuffer();

  return imageResponse(c, output, format);
});

app.post('/optimize', async (c) => {
  const input = await getImageBuffer(c);
  const format = getFormat(c);
  const quality = Math.min(Math.max(Number(c.req.query('quality')) || 80, 1), 100);

  const output = await sharp(input)
    .rotate()
    .toFormat(format, { quality })
    .toBuffer();

  return imageResponse(c, output, format, {
    'X-Original-Size': String(input.byteLength),
    'X-Optimized-Size': String(output.byteLength),
  });
});

app.post('/analyze', async (c) => {
  const input = await getImageBuffer(c);
  const [metadata, stats] = await Promise.all([sharp(input).metadata(), sharp(input).stats()]);

  const { r, g, b } = stats.dominant;
  const toHex = (v: number) => v.toString(16).padStart(2, '0');

  return c.json({
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    sizeBytes: input.byteLength,
    hasAlpha: metadata.hasAlpha,
    dominantColor: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
  });
});

app.post('/caption', async (c) => {
  const input = await getImageBuffer(c);

  // Downscale before calling the model: vision models don't need full-resolution
  // input, and a smaller image costs fewer tokens and less latency.
  const thumbnail = await sharp(input)
    .rotate()
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const { text } = await generateText({
    model: neon('llama-4-maverick'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Write a concise one-sentence alt text caption for this image. Describe only what is visible.',
          },
          { type: 'image', image: thumbnail, mediaType: 'image/jpeg' },
        ],
      },
    ],
  });

  return c.json({ caption: text });
});

// Central error handler: BadRequest becomes a 400, anything else a 500.
app.onError((err, c) => {
  if (err instanceof BadRequest) return c.json({ error: err.message }, 400);
  console.error(err);
  return c.json({ error: 'Failed to process image' }, 500);
});

export default app;
```

</details>

## Configure neon.ts

The `neon link` command created a `neon.ts` file in your project root. Replace its contents with the following:

```ts filename="neon.ts" {4-12}
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    functions: {
      imageapi: {
        name: 'Image API',
        source: './index.ts',
        externalPackages: ['sharp'],
      },
    },
    aiGateway: true,
  },
});
```

Here's what each property does:

- **`preview.functions.imageapi`**: Registers `index.ts` as a deployable function. The key (`imageapi`) is the function's slug, which becomes part of its invocation URL and can't be changed after the first deploy. Slugs are limited to lowercase letters and numbers, so it's `imageapi`, not `image-api`.
- **`externalPackages: ['sharp']`**: Ships Sharp's files with the deploy instead of bundling them into the function bundle. Sharp depends on a compiled native library (libvips), which can't be bundled. This matters most when you deploy from an x86-64 machine; see the admonition below.
- **`aiGateway: true`**: Enables the Neon AI Gateway on the branch. This is what injects the `NEON_AI_GATEWAY_*` credentials your `/caption` route uses.

<Admonition type="important" title="Deploying from an x86-64 machine">
Sharp loads a compiled libvips binary from a platform-specific package, like `@img/sharp-libvips-linux-x64`. Neon Functions run on `linux-arm64`, so if you deploy from an x86-64 machine, npm installs the wrong build locally, and a compiled binary can't be bundled into the function anyway. `neon deploy` warns about this, but the warning doesn't fail the deploy; instead, the function fails at invoke time when it tries to load Sharp. Setting `externalPackages: ['sharp']` avoids this by shipping Sharp's files with the deploy instead of bundling them.
</Admonition>

## Test locally

You can run your function locally using `neon dev`, which starts a local server with your branch's environment variables injected:

```bash
neon dev
```

Grab a sample image to test with (any photo works; this one is from Wikimedia Commons):

```bash shouldWrap
curl -o sample.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/2024_Solar_Eclipse_Prominences.jpg/1280px-2024_Solar_Eclipse_Prominences.jpg"
```

Try the endpoints. First, a raw binary upload to `/resize`:

```bash shouldWrap
curl -X POST "http://localhost:8787/resize?width=400" -H "Content-Type: image/jpeg" --data-binary @sample.jpg -o resized.webp
```

Then a multipart upload to `/optimize`:

```bash shouldWrap
curl -X POST "http://localhost:8787/optimize?format=webp&quality=70" -F "file=@sample.jpg" -o optimized.webp
```

And the AI-powered `/caption` route:

```bash shouldWrap
curl -X POST "http://localhost:8787/caption" -H "Content-Type: image/jpeg" --data-binary @sample.jpg
```

```json
{
  "caption": "A total solar eclipse glows in a dark sky, with pink prominences visible along the sun's edge."
}
```

## Deploy the API

Deploy your function to Neon:

```bash
neon deploy --env .env.local
```

The CLI bundles your function, applies the `neon.ts` configuration (which enables the AI Gateway), and prints the public URL:

```text
Function URLs
  • imageapi: https://br-damp-voice-xxx-imageapi.compute.c-3.us-east-2.aws.neon.tech
```

Your API is now live. If you need to retrieve the URL later, run `neon functions get imageapi`.

## Test the deployed API

Export the function URL to keep the commands short:

```bash shouldWrap
export API_URL="https://br-damp-voice-xxx-imageapi.compute.c-3.us-east-2.aws.neon.tech"
```

**List the endpoints:**

```bash
curl $API_URL/
```

**Resize** an image to a 400x400 square thumbnail:

```bash shouldWrap
curl -X POST "$API_URL/resize?width=400&height=400&fit=cover" -H "Content-Type: image/jpeg" --data-binary @sample.jpg -o thumbnail.webp
```

**Crop** a 600x600 region starting at (300, 100):

```bash shouldWrap
curl -X POST "$API_URL/crop?left=300&top=100&width=600&height=600" -H "Content-Type: image/jpeg" --data-binary @sample.jpg -o crop.webp
```

**Optimize** an image and inspect the size headers:

```bash shouldWrap
curl -si -X POST "$API_URL/optimize?format=webp&quality=70" -H "Content-Type: image/jpeg" --data-binary @sample.jpg -o optimized.webp
```

```text
HTTP/2 200
content-type: image/webp
x-original-size: 196431
x-optimized-size: 38210
...
```

**Analyze** an image:

```bash shouldWrap
curl -X POST "$API_URL/analyze" -H "Content-Type: image/jpeg" --data-binary @sample.jpg
```

```json
{
  "width": 1280,
  "height": 853,
  "format": "jpeg",
  "sizeBytes": 196431,
  "hasAlpha": false,
  "dominantColor": "#0d1b2e"
}
```

**Caption** an image:

```bash shouldWrap
curl -X POST "$API_URL/caption" -H "Content-Type: image/jpeg" --data-binary @sample.jpg
```

The response is the same caption you got during local testing, now generated by your deployed function.

You now have a working image processing API deployed on Neon Functions: five endpoints, no servers to manage, and AI captions with no provider keys to juggle.

## Optional: Store processed images in your branch bucket

The endpoints you've built return the processed bytes directly in the response. That works, but the same image gets reprocessed from scratch on every cache miss. The `Cache-Control: immutable` header only helps clients and CDNs, not your function. Storing each result in your branch's [Neon Object Storage](/docs/storage/overview) bucket turns this into a real media pipeline: process once, store, and serve from the bucket. The `AWS_*` credentials for the bucket are injected into your function automatically, so there are still no secrets in your code.

### Install the AWS SDK

Add the S3 client and presigner packages:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Add a `/store` route

Add an S3 client and a `/store` route to `index.ts`. The route processes the image the same way `/resize` does, uploads the result to your branch's bucket, and returns a presigned URL you can hand to a client:

```ts filename="index.ts"
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET = 'processed-images';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

app.post('/store', async (c) => {
  const input = await getImageBuffer(c);
  const width = Number(c.req.query('width')) || undefined;
  const height = Number(c.req.query('height')) || undefined;
  const fit = c.req.query('fit') ?? 'cover';
  const format = getFormat(c);

  if (!width && !height) throw new BadRequest('Pass at least one of ?width or ?height');
  if (!FITS.includes(fit)) throw new BadRequest(`fit must be one of: ${FITS.join(', ')}`);

  const output = await sharp(input)
    .rotate()
    .resize({ width, height, fit: fit as keyof FitEnum })
    .toFormat(format, { quality: 80 })
    .toBuffer();

  const key = `processed/${Date.now()}.${format}`;
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: output }));

  const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
    expiresIn: 3600,
  });

  return c.json({ key, url });
});
```

A few notes on this code:

- **No credentials in the code.** The `S3Client` reads `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_ENDPOINT_URL_S3` from the environment. Neon injects all four once the bucket is declared in `neon.ts` (next step), just like it injects the AI Gateway credentials.
- **`forcePathStyle: true`** is required: Neon's storage endpoint uses path-style addressing.
- **Presigned URL.** `getSignedUrl` returns a link to the stored object that expires after one hour. It lets you control access without making the bucket public, and you can mint a new link any time from the stored object.
- **Unique keys.** `Date.now()` keeps keys unique so a later upload doesn't overwrite an earlier one. In a real app, tie the key to the original image, like a hash of its bytes.
- If you want, add `'POST /store'` to the endpoint list returned by `GET /`.

### Declare the bucket

Add the bucket to the `preview` block in `neon.ts`, next to the function and the AI Gateway:

```ts filename="neon.ts" {13-15}
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    functions: {
      imageapi: {
        name: 'Image API',
        source: './index.ts',
        externalPackages: ['sharp'],
      },
    },
    aiGateway: true,
    buckets: {
      'processed-images': {},
    },
  },
});
```

The `{}` means the bucket is `private`: only the branch's credentials can read and write it. Set `access: 'public_read'` instead if you want clients to fetch objects without a presigned URL.

### Redeploy and test

Redeploy. This provisions the bucket and injects the `AWS_*` credentials into your function:

```bash
neon deploy --env .env.local
```

Then store a resized image:

```bash shouldWrap
curl -X POST "$API_URL/store?width=400&format=webp" -H "Content-Type: image/jpeg" --data-binary @sample.jpg
```

```json
{
  "key": "processed/1723430987654.webp",
  "url": "https://br-damp-voice-xxx.storage.c-3.us-east-2.aws.neon.tech/processed-images/processed/1723430987654.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
}
```

The URL is a presigned GET link that works for an hour. The object also lives in your bucket, so you can list it with `neon buckets object list processed-images` or browse it in the Neon Console.

</Steps>

## Extending this workflow

The API you built processes images on the fly and returns them directly, which is a solid foundation. Because the function runs on your Neon branch with Postgres and Object Storage credentials already injected, you can grow it into a full media pipeline:

- **Persist images with Neon Object Storage**: The `/store` route above shows the pattern: process, upload to your branch's S3-compatible bucket, and return a presigned URL. To go further, save originals alongside their processed variants, or switch the bucket to `public_read` for unauthenticated serving. See the [Object Storage docs](/docs/storage/overview).
- **Cache transforms and captions in Postgres**: Image transforms are deterministic, so hash the image bytes plus the query parameters and cache the result location in a table. You can also store every caption and `/analyze` result alongside the image record, giving you a searchable media library with alt text included. `DATABASE_URL` is already injected into your function.
- **Add authentication and rate limiting**: Image processing burns CPU, and AI captions burn tokens. Verify callers with a JWT and cap per-user usage using the pattern from [Build an LLM proxy with Neon Functions, Neon AI Gateway, and Managed Better Auth](/guides/llm-proxy-neon-functions).
- **Smarter cropping**: Instead of cropping from the center, pass `position: sharp.strategy.attention` to `resize()` and Sharp crops around the most visually interesting region of the image.
- **Remote images**: Accept a `?url=` parameter that fetches an image from a URL when the client has a link instead of the bytes, then run it through the same pipeline.

## Source code

You can find the complete source code for this example on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/image-processing-api-neon-functions" description="Complete source code for the Image processing API example" icon="github">Image Processing API Example Repository</a>
</DetailIconCards>

## Resources

- [Neon Functions overview](/docs/compute/functions/overview)
- [Neon Functions environment variables](/docs/compute/functions/environment-variables)
- [Neon AI Gateway overview](/docs/ai-gateway/overview)
- [AI Gateway models](/docs/ai-gateway/models)
- [Neon Object Storage overview](/docs/storage/overview)
- [Neon Object Storage get started](/docs/storage/get-started)
- [Sharp API documentation](https://sharp.pixelplumbing.com/)
- [Vercel AI SDK: Generate Text with Image Prompt](https://ai-sdk.dev/cookbook/node/generate-text-with-image-prompt)
- [Neon AI SDK Provider](https://github.com/neondatabase/neon-pkgs/tree/main/packages/ai-sdk-provider)
- [Hono Framework](https://hono.dev/)

<NeedHelp/>
