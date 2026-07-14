---
title: Connect a Vue.js application to Neon
subtitle: Set up a Neon project in seconds and connect from a Vue.js application
summary: >-
  Connecting a Vue.js application to a Neon Postgres database requires
  server-side access because Neon cannot be queried directly from the browser.
  Use a Vue meta-framework such as Nuxt.js or Quasar Framework to run database
  queries on the server and expose data to your Vue frontend.
enableTableOfContents: true
updatedOn: '2026-07-14T19:04:57.024Z'
---

Vue.js is a progressive JavaScript framework for building user interfaces.

Neon Postgres should be accessed from the server side in Vue.js applications. You can achieve this using Vue.js meta-frameworks like Nuxt.js or Quasar Framework.

## Vue Meta-Frameworks

Find detailed instructions for connecting to Neon from various Vue.js meta-frameworks.

<TechCards>

<a href="/docs/guides/nuxt" title="Nuxt.js" description="Connect a Nuxt.js application to Neon" icon="nuxt"></a>

</TechCards>

## Next steps

- [Set up Managed BetterAuth](/docs/auth/overview): Add managed authentication that branches with your database
- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Deploy a Function](/docs/compute/functions/overview): Run backend compute next to your database, no separate hosting needed
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>
