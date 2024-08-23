---
title: 'Postgres for SaaS'
subtitle: Build your SaaS at serverless speed with Neon. Compatible with your favorite open-source frameworks and tools.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

## What is Neon?

Neon is serverless Postgres. We take the world’s most loved database and deliver it as a serverless platform designed to help you build and scale SaaS applications faster thanks to features like instant provisioning, autoscaling, and database branching.

- Prototype for free. You can get a Postgres database ready in less than a second with the Neon Free tier, with enough compute to run it 24/7.
- Iterate and ship faster. Once you’re ready to build new features, take advantage of database branches to onboard engineers quickly. Integrate Neon with your CI/CD pipelines via database branching workflows.
- Scale as you go. Once in production, enable autoscaling to scale up resources in response to your workload, and watch your compute scale down automatically when you no longer need it to save costs.
- Grow your user base. The Neon API enables you to serve +100K users without big teams or big budgets, even [when you need a database-per-user architecture]. (Link DB per tenant page)

## Serverless how?

The word serverless is thrown away with different meanings in the database world. For Neon, serverless means:

✔️ Usage-based pricing. You are charged for the amount of compute and storage consumed by your workload, without overprovisioning.

✔️ No server management. You don’t need to provision, maintain, or administer servers.

✔️ Autoscaling. We automatically scale resources up or down based on demand, without requiring manual intervention.

✔️ Managed infrastructure. The cloud provider (us) handles all underlying infrastructure, including security patches, load balancing, and capacity planning.

✔️ Focus on business logic. You can concentrate on writing code for your application's core functionality rather than dealing with infrastructure concerns.

✔️ Built-in availability and fault tolerance.

To us, serverless does NOT mean…

❌ Neon only works with Serverless architectures. While Neon works great with serverless tooling, it is 100% Postgrs—everything that works with Postgres works with Neon: Django, Rails, some bash script running in your basement, everything.

❌ Pay per query. In Neon, there are two main billing metrics at the end of the month: compute and storage. You could run billions of queries for $19 month if they don’t need more resources than what is allotted in the launch plan.

❌A bad actor or heavy traffic to your site could run your Neon bill from $19 to $19k in a month. You always define a maximum compute autoscaling limit, and you can always check what your maximum compute cost could theoretically be. Storage grows more slowly, and we always reach out to you if your storage usage is rising to make sure everything’s working as expected.

## Kickstart your SaaS project

With our free tier and broad compatibility with popular tools, Neon makes it easy to bring your SaaS vision to life:

1. Create a free Neon account.
2. Deploy on platforms like Vercel, Fly, and Qovery.
3. Use your favorite frameworks and ORMs like Next.js, Drizzle, Prisma, Django, React, Bun, Laravel, or Astro.
4. Authenticate with Clerk, Auth0, or Okta.
5. Add AI features via pgvector, LangChain, and LlamaIndex

## Iterate and scale faster

Once your foundation is built, rely on Neon's serverless features to rapidly grow your project while keeping costs low:

- Spin up new instances in seconds, allowing you to deploy applications instantly without waiting on slow-moving infrastructure.
- Save on costs by automatically scaling non-production environments down to zero when they’re not in use.
- As you start to get traffic, Neon automatically scales compute based on demand, ensuring high performance and reliability without manual intervention.
- Use database branches to create isolated environments with production-like copies of your data and schema for testing, development, and CI/CD workflows.
- Streamline your database operations using the Neon API.

“In GCP, we had to constantly think about provisioning new instances and migrating data, which added operational overhead. With Neon, we can start small and scale up. We don’t have to think about some level of operational stuff. That’s awesome.” (Paul Dlug, CTO of Comigo.ai)

## One database per user

If your SaaS project could benefit from multitenancy, Neon makes it simple to create a dedicated database for each user:

- No pre-provisioning: In Neon, there’s no need to provision infrastructure in advance. You can scale your architecture progressively, from a few tenants to thousands, without breaking the bank.
- Cost efficiency: You only pay for the Neon instances that are actively running. Thanks to scale-to-zero, creating instances doesn’t incur compute costs unless they’re actually in use.
- Instant deployment: Neon databases are created in milliseconds via APIs. An API call can spin up a new project whenever your end-user needs a database, without slowing things down.

“The ability to spawn databases that can scale down to zero is incredibly helpful and a model fits well with our one database per customer architecture” (Guido Marucci, co-founder at Cedalio)

## Additional Resources

- [Build a SaaS App with Django, Stripe, Neon PostgreSQL, TailwindCSS, GitHub Actions](https://www.youtube.com/watch?v=WbNNESIxJnY)
- [Build & Deploy AI SaaS with Reoccurring Revenue (Next.js, OpenAI, Stripe, Tailwind, Vercel)](https://www.youtube.com/watch?v=r895rFUbGtE&t=6391s)
- [Build a Finance SaaS Platform With Nextjs, React, Honojs with CSV Upload](https://www.youtube.com/watch?v=N_uNKAus0II)
- [SaasS Automation Builder: Clerk Authentication, Neon Tech, Uploadcare, Ngrok, Nextjs 14, Stripe, Bun](https://www.youtube.com/watch?v=XkOXNlHJP6M)
- [SaasS AI Chatbot - Email Marketing, Nextjs15, Clerk, Neon, Uploadcare, Cloudways, Bun, Stripe, Pusher](https://www.youtube.com/watch?v=9pCsyBlpmrc)
- [Build a Full-stack E-Commerce app using React Native, Express, Zustand, Drizzle and Neon](https://www.youtube.com/watch?v=9pCsyBlpmrc)
- [Let’s build an Intercom Clone with NEXT.JS 14! (Neon PostgreSQL, Clerk, AI Agent, OpenAI, IBM)](https://www.youtube.com/watch?v=6XezQQJGdjI)
