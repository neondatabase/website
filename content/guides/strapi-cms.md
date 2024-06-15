---
title: Using Strapi CMS with Neon Postgres and Astro to build a blog
subtitle: A step-by-step guide for building your own blog in an Astro application with Strapi CMS and Postgres powered by Neon
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-06-06T00:00:00.000Z'
updatedOn: '2024-06-06T00:00:00.000Z'
---

In this guide, you will learn how to set up a serverless Postgres database with Neon, configure Strapi CMS with Postgres, define a blog schema, and author content using Strapi CMS. The guide also covers configuring API read permissions and building a dynamic frontend with Astro to display blog pages based on Strapi content.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account

## Steps

- [Provisioning a serverless Postgres database powered by Neon](#provisioning-a-serverless-postgres-database-powered-by-neon)
- [Setting up Strapi locally with Postgres](#setting-up-strapi-locally-with-postgres)
- [Configure a blog schema in Strapi CMS](#configure-a-blog-schema-in-strapi-cms)
- [Configure API read permissions in Strapi CMS](#configure-api-read-permissions-in-strapi-cms)
- [Create a new Astro application](#create-a-new-astro-application)
- [Integrate Tailwind CSS in your Astro application](#integrate-tailwind-css-in-your-astro-application)
- [Create dynamic blog routes in Astro](#create-dynamic-blog-routes-in-astro)
- [Build and test your Astro application locally](#build-and-test-your-astro-application-locally)
- [Scale-to-zero with Postgres (powered by Neon)](#scale-to-zero-with-postgres-powered-by-neon)

## Provisioning a serverless Postgres database powered by Neon

Using a serverless Postgres database powered by Neon lets you scale compute resources down to zero, which helps you save on compute costs.

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and create a project.

You will then be presented with a dialog that provides a connection string of your database. Click on **Pooled connection** option and the connection string automatically updates to a pooled connection string.

![Neon Connection Details](/guides/images/strapi-cms/20b94d5f-aff4-4594-b60b-3a65d4fc884c.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

- `<user>` is the database user.
- `<password>` is the database user’s password.
- `<endpoint_hostname>.neon.tech` is the host with `neon.tech` as the [top-level domain (TLD)](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `<port>` is the Neon port number. The default port number is 5432.
- `<dbname>` is the name of the database. **neondb** is the default database created with each Neon project if you do not define your own.
- `?sslmode=require` is an optional query parameter that enforces [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode for better security when connecting to the Postgres instance.

Each of the above values (except `sslmode`) is used in the next step &#8212; creating a local instance of the Strapi CMS application with Postgres.

## Setting up Strapi locally with Postgres

Let's begin with creating a Strapi CMS backend to serve the content for blog posts. Open your terminal and run the following command:

```bash
npx create-strapi-app@latest blog-api
```

`npx create-strapi-app` is the recommended way to scaffold a Strapi CMS project quickly.

When prompted, choose the following:

![Create Strapi CMS project](/guides/images/strapi-cms/bbdb6810-5336-4a10-9feb-c63b27874a80.png)

- `Custom (manual) settings` as the installation type.
- `TypeScript` as the preferred language.
- `postgres` as the default database client.
- `neondb` as the database name.
- `<endpoint_hostname>.neon.tech` as the host.
- `5432` as the port.
- `neondb_owner` as the username.
- `<password>` as the password.
- `y` to enable an SSL connection.

Once that’s done, change to the project directory and start the app:

```bash
cd blog-api
yarn develop
```

The command `strapi develop` runs, which takes care of creating the minimal schema required by Strapi CMS in the Neon Postgres database. When the setup is complete, you will be taken to `http://localhost:1337/admin` automatically. You will need to create an account for your locally hosted Strapi CMS instance. Strapi CMS makes sure to store the credentials (and all other data) in your Neon Postgres database.

![](/guides/images/strapi-cms/52fbde59-04bd-4af0-9e85-5bb33694d7a5.png)

To proceed, click the **Let's start** button to access the admin dashboard. Now, let's learn how to create the blog schema in Strapi CMS.

## Configure a blog schema in Strapi CMS

Once you have logged into the admin dashboard, it will by default, take you to the **Content-Type Builder** section. Here's where you can start to create the Blog schema. Click on **+ Create new collection type** to get started.

![Content-Type Builder](/guides/images/strapi-cms/55407bd1-68d4-4251-af02-571ef400f943.png)

Enter the **Display name** for your blog schema. For example, name it **Blog**, and click **Continue**.

![Create a collection type](/guides/images/strapi-cms/3f6b865d-100c-46ca-980d-c70ecefb4e86.png)

The application now asks you to create the first field inside the schema. Let's start with the **Title** of the blog first. Select **Text**, and it will automatically take you to the field detail section.

![Select a field](/guides/images/strapi-cms/6118918b-e0f2-493a-a80f-366b1577246c.png)

Enter **Title** as the Name of the first field and click **Finish**.

![Add new title field](/guides/images/strapi-cms/c4570e47-7a3e-4dfe-b855-6c461fe94748.png)

Once that's done, you are taken to an overview of the newly created **Blog** schema. Let's add two more fields. Click on **+ Add another field to this collection type**.

![Add another field](/guides/images/strapi-cms/e7437391-5fdf-4cbd-a922-fd500ab1f6d2.png)

First, you will add an `image` to be associated with the blog. Select **Media** and you are automatically taken to the asset detail section.

![Add media](/guides/images/strapi-cms/9a96ebf1-a6c7-4805-a219-c5b56f7a5b30.png)

Enter **Image** as the Name of the image field and click **Finish**.

![Add image field](/guides/images/strapi-cms/45f62587-a717-4b39-a47e-4d57b4e83517.png)

Next, you will add a `markdown` to be associated with the blog. Select **Rich Text (Markdown)**. You are automatically taken to the field detail section.

![Add Markdown field](/guides/images/strapi-cms/b5a13e5d-139a-44bd-9a36-751785aec8f8.png)

Enter **text** as the Name of the markdown field and click **Finish**.

![Enter markdown field name](/guides/images/strapi-cms/76b789ff-a15f-48ba-84a4-0cfe2cb37eb7.png)

Great! Click **Save** to save the present configuration.

![Configuration saved](/guides/images/strapi-cms/32a0b6ca-e7fd-4f6e-9942-4d63cc66d02b.png)

Click on the **Content Manager** button in the sidebar to start adding your first blog content. Click **+ Create new entry** to get started.

![Content Manager](/guides/images/strapi-cms/c735741c-1b1d-49f0-8f61-4ba210f799a6.png)

Enter the **Title**, select the **Image**, and input the markdown associated with the blog. You are now done writing your first post in the local Strapi CMS instance. All the data is synchronized in Postgres (powered by Neon). To finish off the content creation process, click **Save** and **Publish**.

![Create an entry](/guides/images/strapi-cms/045777e9-a898-490a-bf2b-271858e7ba6a.png)

With that done, let's move on to configuring read permissions for connected clients to access the data corresponding to the blog schema via an API.

## Configure API Read Permissions in Strapi CMS

To be able to fetch the data authored in your local Strapi CMS instance, you will need to configure what is readable and writeable using APIs. Navigate to **Settings > API Tokens** in your admin dashboard. Click on **Create new API Token** to start creating a new API token.

![API tokens](/guides/images/strapi-cms/846d9a45-138c-4474-b34d-33ddc8027e03.png)

Enter a Name to be associated with the token and set **Token Duration** to **unlimited** for the sake of this example. Finally, click **Save** to obtain the API token.

![Create API token](/guides/images/strapi-cms/10f85000-9b9b-428e-ab03-3faaa54cbaf3.png)

Copy the API token and store it somewhere safe as **STRAPI_API_TOKEN**.

Now, let's move on to creating an Astro application to create dynamic blog pages based on blog data that's accessible via your locally hosted instance of Strapi CMS.

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
npm install dotenv marked @tailwindcss/typography
npm install -D @types/node
```

The commands above install the packages, with the `-D` flag specifying the libraries intended for development purposes only.

The libraries installed include:

- [dotenv](https://npmjs.com/package/dotenv): A library for handling environment variables.
- [marked](https://npmjs.com/package/marked): A markdown parser and compiler.
- [@tailwindcss/typography](https://npmjs.com/package/@tailwindcss/typography): A set of `prose` classes for HTML rendered from Markdown or pulled from a CMS.

The development-specific libraries include:

- [@types/node](https://npmjs.com/package/@types/node): Type definitions for node.

Then, add the following lines to your `tsconfig.json` file to make relative imports within the project easier:

```diff
{
  "extends": "astro/tsconfigs/strict",
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

STRAPI_API_TOKEN="..."
```

## Integrate Tailwind CSS in your Astro application

For styling the app, you will use Tailwind CSS. Install and set up Tailwind at the root of your project's directory by running:

```bash
npx astro add tailwind
```

When prompted, choose:

- `Yes` when prompted to install the Tailwind dependencies.
- `Yes` when prompted to generate a minimal `tailwind.config.mjs` file.
- `Yes` when prompted to make changes to the Astro configuration file.

The command finishes integrating TailwindCSS into your Astro project and installs the following dependencies:

- `tailwindcss`: TailwindCSS as a package to scan your project files to generate corresponding styles.
- `@astrojs/tailwind`: The adapter that brings Tailwind's utility CSS classes to every `.astro` file and framework component in your project.

To load pre-configured styles for your HTML (rendered from markdown), update your `tailwind.config.mjs` as follows:

```tsx
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')], // [!code ++]
};
```

## Create dynamic blog routes in Astro

To programmatically create pages as you keep authoring more content in your locally hosted Strapi CMS, you are going to use [dynamic routes](https://docs.astro.build/en/guides/routing/#dynamic-routes) in Astro. With dynamic routes, you create a single file with a name like `[slug].astro`, where slug represents a [unique and dynamic variable](https://docs.astro.build/en/reference/api-reference/#contextparams) for each blog. Using [getStaticPaths](https://docs.astro.build/en/reference/api-reference/#getstaticpaths), you can programmatically create multiple blog pages with custom data using Strapi CMS as your data source. Let's see this in action. Create a file named `[slug].astro` in the `src/pages` directory with the following code:

```astro
---
// File: src/pages/[slug].astro

import "dotenv/config";
import { marked } from 'marked';

export async function getStaticPaths() {
  const response = await fetch(`http://127.0.0.1:1337/api/blogs?populate=Image`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });
  const {data} = await response.json();
  return data.map(({ id, attributes }) => ({
    params: { slug: id },
    props: attributes,
  }));
}

const { Title, text, Image } = Astro.props

const markdown = marked.parse(text)
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>{Title}</h1>
    <img src={`http://127.0.0.1:1337${Image.data[0].attributes.url}`} />
    <article set:html={markdown} />
  </body>
</html>
```

Let's understand the code above in two parts:

- Inside `getStaticPaths` function, a fetch call is made to the locally hosted Strapi CMS API to get all the blogs with their **Title**, **Image** and **text** values. Looping over each blog item, an array is created that passes all the data obtained as the [**props**](https://docs.astro.build/en/reference/api-reference/#contextprops), and its **id** as the unique variable to be associated with each blog.

- The HTML section represents the content of a particular blog page. The blog data attributes such as Title, Image URL, and markdown are obtained from `Astro.props` (passed in `getStaticPaths` as props). Further, the markdown is parsed into HTML using the `marked` library, and injected into the DOM using `set:html` template directive of Astro.

## Build and Test your Astro application locally

To test the Astro application in action, prepare a build and run the preview server using the following command:

```bash
npm run build && npm run preview
```

## Scale-to-zero with Postgres (powered by Neon)

Interestingly, during the entire process of building this application, you have used Neon's **Scale-to-zero** feature which places your Postgres compute endpoint into an `Idle` state after 5 minutes of inactivity. Click the **Operations** button in your Neon console sidebar to see when the compute was started and automatically suspended to reduce compute usage.

![Neon Monitoring page](/guides/images/strapi-cms/ee753f7d-3da8-4a4c-84c5-be7b6cdce486.png)

## Summary

In this guide, you learned how to build a blog in an Astro application using Strapi CMS and a serverless Postgres database (powered by Neon). Additionally, you learned how to create content collections in Strapi CMS and dynamic blog routes in an Astro application.

<NeedHelp />
