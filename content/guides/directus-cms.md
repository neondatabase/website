---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-22T00:00:00.000Z'
updatedOn: '2024-12-22T00:00:00.000Z'
title: Using Directus CMS with Neon Postgres and Astro to build a blog
subtitle: A step-by-step guide for building your own blog in an Astro application with Directus CMS and Postgres powered by Neon
---

In this guide, you will learn how to set up a serverless Postgres database with Neon, configure Directus CMS with Postgres, define a blog schema, and author content using Directus CMS. The guide also covers configuring API read permissions and building a dynamic frontend with Astro to display blog pages fetched from the Directus CMS instance.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) set up locally

## Provisioning a serverless Postgres database

Using a serverless Postgres database powered by Neon lets you scale compute resources down to zero, which helps you save on compute costs.

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and create a project. You will then be presented with a dialog that provides a connection string for your database. You will be using the connection string to connect the Directus CMS instance to your Postgres database.

## Setting up Directus locally with Postgres

Let's begin with creating a Directus CMS backend to serve the content for blog posts. Open your terminal and run the following command:

```bash
mkdir directus-cms
cd directus-cms
```

and create a `docker-compose.yml` with the following code:

```yml
services:
  directus:
    image: directus/directus:11.3.5
    ports:
      - 8055:8055
    volumes:
      - ./database:/directus/database
      - ./uploads:/directus/uploads
      - ./extensions:/directus/extensions
    environment:
      SECRET: 'replace-with-secure-random-value'
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'd1r3ctu5'
      DB_CLIENT: 'pg'
      DB_CONNECTION_STRING: 'postgresql://neondb_owner:...@ep-...us-east-1.aws.neon.tech/neondb?sslmode=require'
      DB_SSL__REJECT_UNAUTHORIZED: 'true'
      WEBSOCKETS_ENABLED: 'true'
      CORS_ENABLED: 'true'
      CORS_ORIGIN: '*'
```

Now, update the `DB_CONNECTION_STRING` value to be the connection string obtained in the step earlier. Finally, run the following command to start the local Directus CMS instance:

```shell
docker-compose up -d
```

Once the migrations are ran succesfully, the Directus CMS instance would be accessible at [localhost:8055/admin](http://localhost:8055/admin/). Sign in with the credentials set in the `docker-compose.yml` file.

## Configure the authors schema in Directus CMS

Navigate to the [Data Model](http://localhost:8055/admin/settings/data-model) view, and click the `+` icon to start creating a new data model.

Set the **Name** field to be **authors**, press the next arrow icon, and save by clicking the tick icon.

![](/guides/images/directus-cms/author-1.png)

Once that's done, click on `Create Field` to add a field to the `authors` schema.

![](/guides/images/directus-cms/author-2.png)

Select the field type as `Input` and set the `Key` as **name** to signify the field to be representative of author's name.

![](/guides/images/directus-cms/author-3.png)

Finally, click `Save` to finish adding the `name` field to the `authors` schema.

![](/guides/images/directus-cms/author-4.png)

Now, let's move on to creating the post schema in Directus CMS.

## Configure the posts schema in Directus CMS

Navigate to the [Data Model](http://localhost:8055/admin/settings/data-model) view, and click the `+` icon to start creating a new data model.

Set the **Name** field to be **posts**, press the next arrow icon, and save by clicking the `+` icon.

Then, follow the process as earlier to add the following fields to the `posts` schema:

- An **Input** field called **title**.
- A **WYSIWYG** field called **content**.
- An **Image** field called **image**.
- A **Datetime** field called **published_date**.
- A **Many to One** field called **author** with the **Related Collection** set to **authors**.

## Configure API Read Permissions in Directus CMS

To be able to fetch the data authored in your local Directus CMS instance, you will need to configure what is readable and writeable using APIs. Navigate to [Settings > Access Policies](http://localhost:8055/admin/settings/policies), click on **Public**, and add the permissions for the `authors`, `posts` and `directus_files` to be read publicly.

![](/guides/images/directus-cms/public-api.png)

Now, let's move on to creating an Astro application to create dynamic blog pages based on blog data that's accessible via your locally hosted instance of Directus CMS.

## Create a new Astro application

Let’s get started by creating a new Astro project. Open your terminal and run the following command:

```bash
npm create astro@latest blog-ui
```

`npm create astro` is the recommended way to scaffold an Astro project quickly.

When prompted, choose:

- `Empty` when prompted on how to start the new project.
- `Yes` when prompted if plan to write Typescript.
- `Strict` when prompted how strict Typescript should be.
- `Yes` when prompted to install dependencies.
- `Yes` when prompted to initialize a git repository.

Once that’s done, change to the project directory and start the app:

```bash
cd blog-ui
npm run dev
```

The app should be running on [localhost:4321](http://localhost:4321/). Let's close the development server for now.

Next, execute the following command to install the necessary libraries and packages for building the application:

```bash
npm install @directus/sdk
npm install -D typescript
```

The commands above install the packages, with the `-D` flag specifying the libraries intended for development purposes only.

The libraries installed include:

- [@directus/sdk](https://npmjs.com/package/@directus/sdk): Typescript SDK to query from your Directus CMS instance.

The development-specific libraries include:

- [typescript](https://npmjs.com/package/typescript): TypeScript is a language for application-scale JavaScript.

Then, add the following lines to your `tsconfig.json` file to make relative imports within the project easier:

```diff
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": { // [!code ++]
    "baseUrl": ".", // [!code ++]
    "paths": { // [!code ++]
      "@/*": ["src/*"] // [!code ++]
    } // [!code ++]
  } // [!code ++]
}
```

Now, create a `.env` file. You are going to add the API token obtained earlier.

The `.env` file should contain the following keys:

```bash
# .env

DIRECTUS_URL="http://localhost:8055"
```

## Create dynamic blog routes in Astro

To programmatically create pages as you keep authoring more content in your locally hosted Directus CMS, you are going to use [dynamic routes](https://docs.astro.build/en/guides/routing/#dynamic-routes) in Astro. With dynamic routes, you create a single file with a name like `[slug].astro`, where slug represents a [unique and dynamic variable](https://docs.astro.build/en/reference/api-reference/#contextparams) for each blog. Using [getStaticPaths](https://docs.astro.build/en/reference/api-reference/#getstaticpaths), you can programmatically create multiple blog pages with custom data using Directus CMS as your data source. Let's see this in action. Create a file named `[slug].astro` in the `src/pages` directory with the following code:

```astro
---
// File: src/pages/[slug].astro

import Layout from "@/layouts/Layout.astro";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export async function getStaticPaths() {
  const posts = await directus.request(
    readItems("posts", {
      fields: ['*'],
    })
  );
  return posts.map((post) => ({ params: { slug: post.slug }, props: post }));
}
const post = Astro.props;
---

<Layout title={post.title}>
  <main>
    <img src={`${import.meta.env.DIRECTUS_URL}/assets/${post.image}`} />
    <h1>{post.title}</h1>
    <div set:html={post.content} />
  </main>
</Layout>
```

Let's understand the code above in two parts:

- Inside `getStaticPaths` function, a fetch call is made to the locally hosted Directus CMS API to get all the blogs with their **title**, **image** and **content** values. Looping over each blog item, an array is created that passes all the data obtained as the [props](https://docs.astro.build/en/reference/api-reference/#contextprops), and its **slug** as the unique variable to be associated with each blog.

- The HTML section represents the content of a particular blog page. The blog data attributes such as Title, Image URL, and the blog content in HTML are obtained from `Astro.props` (passed in `getStaticPaths` as props).

## Build and Test your Astro application locally

To test the Astro application in action, prepare a build and run the preview server using the following command:

```bash
npm run build && npm run preview
```

## Summary

In this guide, you learned how to build a blog in an Astro application using Directus CMS and a serverless Postgres database (powered by Neon). Additionally, you learned how to create content collections in Directus CMS and dynamic blog routes in an Astro application.

<NeedHelp />
