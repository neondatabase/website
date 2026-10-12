---
title: Using LlamaIndex with Postgres to build your own reverse image search engine
subtitle: Build a reverse image search engine in an Astro application with LlamaIndex and Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-06-11T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

A reverse image search engine takes an image as the query and returns similar images. [Google Images](https://images.google.com/) is a widely used example. In this guide, you will build one yourself: a system that indexes images into a collection in Postgres and returns the images most similar to an uploaded one.

## Prerequisites

To follow this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- A [Vercel](https://vercel.com) account

## Steps

- [Provision a Postgres database on Neon](#provision-a-postgres-database-on-neon)
- [Create a new Astro application](#create-a-new-astro-application)
- [Enable server-side rendering in Astro with Vercel](#enable-server-side-rendering-in-astro-with-vercel)
- [Setting up a Postgres database connection](#setting-up-a-postgres-database-connection)
  - [Initialize the Postgres vector store in LlamaIndex](#initialize-the-postgres-vector-store-in-llamaindex)
- [Build the image indexing API endpoint](#build-the-image-indexing-api-endpoint)
- [Build the reverse image search API endpoint](#build-the-reverse-image-search-api-endpoint)
- [Build the reverse image search UI](#build-the-reverse-image-search-ui)
- [Deploy to Vercel](#deploy-to-vercel)

## Provision a Postgres database on Neon

Neon can scale your compute down to zero when the database is idle, so you don't pay for compute while it's suspended (storage is still billed).

To get started, go to the [Neon Console](https://console.neon.tech/app/projects) and create a project with the name of your choice.

Then click **Connect** on your project dashboard to open the **Connect to your branch** modal, which shows the connection string for your database. The **Connection pooling** toggle is on by default, which gives you a pooled connection string.

![](/guides/images/llamaindex-postgres-search-images/create-database.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host with `neon.tech` as the [TLD](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.
- `?sslmode=require&channel_binding=require` are optional query parameters that enforce [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode and channel binding for better security when connecting to Postgres.

Save this connection string somewhere safe. You'll use it as `POSTGRES_URL` later in the guide.

## Create a new Astro application

Create a new Astro project. Open your terminal and run the following command:

```bash
npm create astro@latest my-app
```

`npm create astro` is the recommended way to scaffold an Astro project quickly.

When prompted, choose:

- `Empty` when prompted on how to start the new project.
- `Yes` when prompted if you plan to write Typescript.
- `Strict` when prompted how strict Typescript should be.
- `Yes` when prompted to install dependencies.
- `Yes` when prompted to initialize a git repository.

Once that’s done, you can move into the project directory and start the app:

```bash
cd my-app
npm run dev
```

The app should be running on [localhost:4321](http://localhost:4321/). Stop the development server for now.

Next, run the following command to install the packages the application needs:

```bash
npm install dotenv llamaindex@0.3.4 uuid
```

The above command installs the following packages:

- [dotenv](https://npmjs.com/package/dotenv): A library for handling environment variables.
- [LlamaIndex](https://npmjs.com/package/llamaindex): A data framework for creating LLM applications.
- [uuid](https://npmjs.com/package/uuid): A library to generate RFC-compliant UUIDs in JavaScript.

Then, make the following additions in your `tsconfig.json` file to make relative imports within the project easier:

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    // [!code ++]
    "baseUrl": ".", // [!code ++]
    "paths": {
      // [!code ++]
      "@/*": ["src/*"] // [!code ++]
    } // [!code ++]
  } // [!code ++]
}
```

## Enable server-side rendering in Astro with Vercel

Indexing and searching images happens on the server. Enable server-side rendering in your Astro project with the following command:

```bash
npx astro add vercel
```

When prompted, choose:

- `Yes` when prompted to install the Vercel dependencies.
- `Yes` when prompted to make changes to Astro configuration file.

The command above installed the following dependency:

- `@astrojs/vercel`: The adapter that allows you to server-side render your Astro application on Vercel.

Your Astro application can now run in development mode and deploy to Vercel without changes.

## Setting up a Postgres database connection

First, create an `.env` file in the root directory of your project with the following environment variable to initiate the setup of a database connection:

```bash
# Neon Postgres Pooled Connection URL

POSTGRES_URL="postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
```

Keep the `.env` file secret and out of your Git history by adding it to your project's `.gitignore` file.

### Initialize the Postgres vector store in LlamaIndex

To index and query images (via their vector embeddings), you will use LlamaIndex's `PGVectorStore` class, which stores and queries the embeddings in Postgres for you. Inside `src` directory, create a `neon.ts` file with the following code:

```tsx
// File: src/neon.ts

import 'dotenv/config';
import { PGVectorStore } from 'llamaindex';

// Create and export a new instance of PGVectorStore
// This instance represents the vector store using PostgreSQL as the backend
export default new PGVectorStore({
  connectionString: process.env.POSTGRES_URL,
  dimensions: 512,
});
```

The code above begins with importing the `dotenv/config`, loading all the environment variables into the scope. It then exports an instance of `PGVectorStore` initialized with the pooled connection string you saved earlier.

## Build the image indexing API endpoint

With `ClipEmbedding`, LlamaIndex retrieves the remote images, extracts their features with the CLIP model, and generates vector embeddings: numerical representations of each image's visual and semantic features. You don't write any of the feature extraction yourself.

To index images via an API endpoint, create a file `src/pages/api/upsert.ts` with the following code:

```tsx
// File: src/pages/api/upsert.ts

import { v4 as uuidv4 } from 'uuid';
import imageVectorStore from '@/neon';
import type { APIContext } from 'astro';
import { ClipEmbedding, ImageDocument, Settings, VectorStoreIndex } from 'llamaindex';

// Set the embedding model to Clip for image embeddings
Settings.embedModel = new ClipEmbedding();

export async function POST({ request }: APIContext) {
  // Parse the JSON body of the request to get the list of image URLs
  const { images = [] }: { images: string[] } = await request.json();
  // Convert image URLs into ImageDocument objects
  const documents = images.map(
    (imageURL: string) =>
      new ImageDocument({
        // Generate a unique ID for each image document
        id_: uuidv4(),
        // Convert imageURL to a URL object
        image: new URL(imageURL),
        // Attach metadata with the image URL
        metadata: { url: imageURL },
      })
  );
  // Index the ImageDocument objects in the vector store
  await VectorStoreIndex.fromDocuments(documents, { imageVectorStore });
}
```

The code above begins with importing modules including `uuid`, `llamaindex`, and `imageVectorStore` (an alias for the instance of the `PGVectorStore` instance created earlier). The code then **sets the embedding model to Clip for image embeddings**. This takes care of extracting features from images, and creating their vector embeddings.

In the `POST` function, it handles incoming requests, expecting a JSON body with an array of image URLs. It converts each URL into an `ImageDocument` object, generating a unique ID for each, and attaching metadata containing the original URL.

The `ImageDocument` objects are then indexed in the vector store using `VectorStoreIndex.fromDocuments()`, which takes the documents array and options object as parameters. **The `imageVectorStore` is specified as the target store for indexing**.

## Build the reverse image search API endpoint

In a reverse image search, a user uploads an image and you return similar images, ranked by similarity. Similarity is computed between numerical representations of the images' visual and semantic features. LlamaIndex computes these features with the CLIP model (by OpenAI), and a query returns a set of images along with a similarity score for each, which measures how closely the two images are related.

To reverse image search via an API endpoint, create a file `src/pages/api/query.ts` with the following code:

```tsx
// File: src/pages/api/query.ts

import type { APIContext } from 'astro';

export async function POST({ request }: APIContext) {
  // Parse the form data from the request to get the file
  const data = await request.formData();
  const file = data.get('file') as File;
  // If no file is provided, return a 400 Bad Request response
  if (!file) return new Response(null, { status: 400 });
  // Read the file contents into a buffer
  const fileBuffer = await file.arrayBuffer();
  // Create a Blob from the buffer with the correct MIME type
  const fileBlob = new Blob([fileBuffer], { type: file.type });
  // ...
}
```

The code above implements a `POST` function, expecting a form data request with a file attached. It retrieves the file from the request and checks that it's present.

It then reads the file contents into a buffer using `arrayBuffer()` and creates a Blob with the correct MIME type. Because the endpoint accepts images directly in the request, the server doesn't have to fetch a remote image URL to search on.

The following code adds the final steps: creating a vector embedding of the uploaded image and returning similar images.

```tsx
// File: src/pages/api/query.ts

// ...

import neonStore from '@/neon';
import { ClipEmbedding, VectorStoreQueryMode } from 'llamaindex';

export async function POST({ request }: APIContext) {
  // ...
  // Get the image embedding using ClipEmbedding
  const image_embedding = await new ClipEmbedding().getImageEmbedding(fileBlob);
  // Query the Neon Postgres vector store for similar images
  const { similarities, nodes } = await neonStore.query({
    similarityTopK: 100,
    queryEmbedding: image_embedding,
    mode: VectorStoreQueryMode.DEFAULT,
  });
  // Initialize an array to store relevant image URLs
  const relevantImages: string[] = [];
  if (nodes) {
    similarities.forEach((similarity: number, index: number) => {
      // Check if similarity is greater than 90% (i.e., similarity threshold)
      if (100 - similarity > 90) {
        const document = nodes[index];
        relevantImages.push(document.metadata.url);
      }
    });
  }
  return new Response(JSON.stringify(relevantImages), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

The code above adds two new imports: `neonStore` (an alias for the `PGVectorStore` instance) and `ClipEmbedding` from `llamaindex`. **It uses the Clip embedding model to extract the image embedding**. It then queries the Postgres vector store for similar images using that embedding. The query parameters include the number of results to return (`similarityTopK`) and the image embedding.

The relevant images are filtered based on a similarity threshold of 90%, and their URLs are stored in an array. Finally, the endpoint returns a JSON response containing the URLs of the relevant images.

## Build the reverse image search UI

The user interface needs two things: a place to upload the image to search with, and a place to show the search results.

Update the `index.astro` file in your `src/pages` directory with the following code to allow them to upload an image to search with.

```html
---
// File: src/pages/index.astro
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content="{Astro.generator}" />
    <title>Astro</title>
  </head>
  <body class="flex flex-col items-center">
    <form class="flex flex-col" id="fileUploadForm" enctype="multipart/form-data">
      <input
        class="rounded border px-4 py-3"
        type="file"
        id="fileInput"
        name="file"
        accept="image/*"
      />
      <button id="query" class="mt-3 max-w-max rounded bg-black px-4 py-1 text-white" type="submit">
        Query &rarr;
      </button>
    </form>
  </body>
</html>
```

The HTML above contains a form element with the id `fileUploadForm`, which allows users to upload image files. It consists of an input field of type file and a submit button labeled "Query". **The form is set to handle multipart/form-data encoding**.

To programmatically render the search results, you would need to fetch the response from `/api/query` endpoint and then create `img` HTML elements on the webpage. Add the following JavaScript to your index route.

```html
---
// File: src/pages/index.astro
---

<html lang="en">
  <head>
    <!-- Head -->
  </head>
  <body class="flex flex-col items-center">
    <!-- Form -->
    <script>
      document.getElementById('fileUploadForm')?.addEventListener('submit', async function (event) {
        event.preventDefault()
        // remove the previous search results
        document.getElementById('searchResults')?.remove()
        // create a new form data object that contains the uploaded file
        const formData = new FormData()
        const fileInput = document.getElementById('fileInput') as HTMLInputElement
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) return
        formData.append('file', fileInput.files[0])
        // query for similar images
        const queryCall = await fetch('/api/query', { method: 'POST', body: formData })
        const queryResp = await queryCall.json()
        // create the search results div
        const searchResultsDiv = document.createElement('div')
        searchResultsDiv.setAttribute('id', 'searchResults')
        // append all the image results to the search results div
        queryResp.forEach((eachImage: string) => {
          const img = document.createElement('img')
          img.setAttribute('class', 'size-100')
          img.setAttribute('src', eachImage)
          searchResultsDiv.append(img)
        })
        document.body.append(searchResultsDiv)
      })
    </script>
  </body>
</html>
```

The code above adds an event listener that runs when the form is submitted. Upon submission, it extracts the uploaded file, creates a FormData object containing the file, and sends a POST request to `/api/query` with the file data.

The response from the query API is received and parsed as JSON. A new div element is dynamically created to hold the search results, and each image URL from the response is used to create an image element, which is then appended to the search results div.

Your Astro application is now ready to deploy on Vercel.

## Deploy to Vercel

The repository is now ready to deploy to Vercel. Use the following steps to deploy:

- Start by creating a GitHub repository containing your app's code.
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you've just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy.

## Summary

You built a reverse image search engine in an Astro application that creates image embeddings with `ClipEmbedding` and stores and searches them in Postgres on Neon through the LlamaIndex Postgres vector store.

<NeedHelp />
