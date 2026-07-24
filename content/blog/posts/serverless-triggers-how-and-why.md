---
title: 'Serverless Triggers: How and Why'
description: Improve your serverless workflows with database triggers
excerpt: >-
  Neon is a true serverless database, with connection pooling and automatic
  scaling. To add to the serverless stack, we recently co-launched the Inngest
  integration with Neon, which enables you to leverage Neon’s Logical
  Replication to trigger Serverless functions (Vercel Functions...
date: '2024-11-06T17:43:25'
updatedOn: '2024-11-06T18:37:54'
category: community
categories:
  - community
authors:
  - tony-holdstock-brown
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Serverless Triggers: How and Why - Neon'
  description: >-
    The Inngest integration allows Neon users to trigger serverless functions
    from database changes. Here are 3 popular use cases.
  keywords: []
  noindex: false
  ogTitle: 'Serverless Triggers: How and Why - Neon'
  ogDescription: >-
    The Inngest integration allows Neon users to trigger serverless functions
    from database changes. Here are 3 popular use cases.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/neon-triggers1-1024x576-d91afb16.jpg)

Neon is a true serverless database, with [connection pooling](https://neon.tech/docs/connect/connection-pooling) and [automatic scaling](https://neon.tech/docs/introduction/autoscaling). To add to the serverless stack, we recently [co-launched the Inngest integration with Neon](https://www.inngest.com/blog/neon-postgres-database-triggers-for-durable-functions?utm_source=neon&utm_medium=trigger-serverless-functions-blog-post), which enables you to leverage Neon’s [Logical Replication](https://neon.tech/docs/guides/logical-replication-guide) to trigger Serverless functions (Vercel Functions, AWS Lambdas, Cloudflare Workers, and more) from database changes.

In this blog post, **we discuss a few use cases unlocked with these new serverless triggers**—from user onboarding to building AI workflows.

## Use case #1: The quickest way to prototype AI workflows

Let’s jump right into the burning topic of AI workflows.

As AI features now combine more and more tools and also [include some reasoning and planning](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/), the initial development effort required to ship some AI keeps increasing. This is where building your AI workflows on top of your Neon database by leveraging serverless triggers comes in handy.

With a few lines of code, Inngest enables you to plug some AI workflows into your Neon database:

```javascript
export const contactEnrichment = inngest.createFunction(
  {
    id: "Contact Enrichment Workflow",
  },
  { event: "db/contacts.inserted" },
  async ({ event, step }) => {
    const { email, companyName } = event.data

    // Step 1: Gather company information
    const companyInfo = await step.run("gather-company-info", async () => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Find key business information about ${companyName}. Include: industry, approximate size, key products/services, and main competitors.`,
          },
        ],
      });
      return completion.choices[0].message.content;
    });

    // Step 2: Enrich contact details
    const enrichedContact = await step.run("enrich-contact", async () => {
      // ...
    });

    // Step 3: Generate engagement suggestions
    const engagementSuggestions = await step.run("generate-suggestions", async () => {
      // ...
    });

    // Step 4: Save information
    await step.run("save-information", async () => {
      // ...
    });
  }
);
```

Your AI workflows immediately benefit from Inngest Function’s features.

### Fighting API flakiness and improving workflow reliability

Inngest Functions are built around the concept of step.run(), a practical way to divide your AI workflows into retriable and cached steps. Without boilerplate, your AI workflows automatically recover from external failures without rerunning successful steps, saving you some costly LLM calls.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/graph-3-1024x710-540f7a8d.jpg)

### Scaling with multiple tools and models

AI Workflows now mix multiple tools (third-party APIs) and models to get the best results, which leads to dealing with multiple rate-limiting policies. Adding concurrency or throttling policies to your AI Workflows to fit your user’s usage only requires a few configuration lines:

```javascript
export const contactEnrichment = inngest.createFunction(
  {
    id: "Contact Enrichment Workflow",
    throttling: { // 5 runs per minute
      limit: 5,
      interval: "1m",
    },
    concurrency: 5,
  },
  { event: "db/contacts.inserted" },
  async ({ event, step }) => {
    const { email, companyName } = event.data
    
    // ...

});
```

### Adding reasoning and “Human in the loop” to your AI workflows

Are you a developer evolving on the edge of AI Engineering and building some AI agents?

Then, you need a way for your AI Workflow to dynamically execute some steps and hand back the control to a human. Inngest Function’s `waitForEvent()` combined with the Inngest Workflow Kit, will give your AI Agent total freedom to plan and wait for human feedback.

Find a deployable open-source example of an AI-Agent built with Neon and Inngest in [this article](https://www.inngest.com/blog/nextjs-openai-o1?utm_source=neon&utm_medium=trigger-serverless-functions-blog-post).

## Use case #2: Stream your database into an ETL pipeline

Someone on Twitter once [famously said](https://x.com/jakubtomsu_/status/1849730611537150260):

![](https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/ad4nxdqljow3b0qyaf-n9jcp2jjg4twitlilpdpwkd0-ozwyhzb3svi2copugkcexoa6vmad0pkqazeiunmgxcgqx112zyac8odohzkxq11mq45rx6csrfesuvojoyznvz-yqoubxynoudoq6z1hnfbto2v-e4763b6f.png)

ETL pipelines are pretty common when it comes to building SaaS applications, whether for importing user data, processing eCommerce orders, or enriching CRM contacts with AI.

ETL pipelines and other data-intensive features can now streamline their processing directly using database updates in combination with batching and throttling capabilities of Inngest:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/graph-2-1024x529-93007bf5.jpg)

Batching similar database updates together can also be done at a granular level by leveraging Batching with keys:

```javascript
export const processOrders = inngest.createFunction(
  {
    id: "process-orders",
    batchEvents: {
      maxSize: 100,
      timeout: "60s",
      key: "event.data.shop_id",
    },
  },
  { event: "db/orders.inserted" },
  async ({ events }) => {
    // events.data contains from 1 to 100 records from the same `shop_id`
  },
);
```

## Use case #3: Build user workflows that react to your database changes

Using Neon Server Function triggers is also a perfect fit to power regular SaaS features such as user onboarding workflows:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/graph-1-1024x549-ff5eb638.jpg)

With a few lines of code, add the following Inngest Function to your Next.js application to power an email drip campaign onboarding your user with nice-looking Resend emails:

```javascript
// inngest/functions/new-user.ts
import { inngest } from '../client'

export const newUser = inngest.createFunction(
  { id: "new-user" },
  { event: "db/users.inserted" },
  async ({ event, step }) => {
    const user = event.data.new;
    await step.run("send-welcome-email", async () => {
      // Send welcome email
      await sendEmail({
        template: "welcome",
        to: user.email,
      });
    });
    await step.sleep("wait-before-tips", "3d");
    await step.run("send-new-user-tips-email", async () => {
      // Follow up with some helpful tips
      await sendEmail({
        template: "new-user-tips",
        to: user.email,
      });
    });
  }
);
```

## Get started

You can start triggering serverless functions from your Neon database by installing the Inngest integrations in under a few minutes [with its one-click installation](https://neon.tech/docs/guides/trigger-serverless-functions).

![](https://cdn.neonapi.io/public/images/pages/blog/serverless-triggers-how-and-why/ad4nxcyrl0fz7zqqn6wcd2xkof82yt6kou2wegax3abghwtupid9ieg9lyulmsz9ett3oqia5ytd2un9geyh4mfdt0khjir5es6pafm6jy8rojqv-ls4e8ny3wduloc0fujpupqp38mzumgtyha4fdpfv7jhl4-de79ff4c.png)
