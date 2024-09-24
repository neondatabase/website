---
title: Serverless
subtitle: Postgres with instant provisioning, no server management, and pay-per-usage
  billing
enableTableOfContents: true
updatedOn: '2024-08-29T10:48:38.733Z'
---

Neon takes the world's most loved database &#8212; Postgres &#8212; and delivers it as a serverless platform, enabling teams to ship reliable and scalable applications faster.

Enabling serverless Postgres begins with Neon's [native decoupling of storage and compute](https://neon.tech/blog/architecture-decisions-in-neon). By separating these components, Neon can dynamically scale up during periods of high activity and down to zero when idle. Developers can be hands-off instead of sizing infrastructure manually.

This serverless character also makes Neon databases highly agile and well-suited for use cases that require automatic creation, management, and deletion of a high number of Postgres databases, like [database-per-user architectures with thousands of tenants](https://neon.tech/use-cases/database-per-tenant), as well as [database branching workflows](https://neon.tech/flow) that accelerate development by enabling the management of dev/testing databases via CI/CD.

![Multi-tenant storage](/docs/introduction/multi_tenant_storage.png)

Read our [Architecture](https://neon.tech/docs/introduction/architecture-overview) section for more information on how Neon is built.

## What “serverless” means to us

At Neon, we interpret “serverless” not only as the absence of servers to manage but as a set of principles and features designed to streamline your development process and optimize operational efficiency for your database.

To us, serverless means:

- **Instant provisioning**: Neon allows you to spin up Postgres databases in seconds, eliminating the long setup times traditionally associated with database provisioning.
- **No server management**: You don’t have to deal with the complexities of provisioning, maintaining, and administering servers. Neon handles it all, so you can focus on your application.
- **Autoscaling**: Compute resources automatically scale up or down based on real-time demand, ensuring optimal performance without manual intervention.
- **Usage-based pricing**: Your costs are directly tied to the resources your workload consumes—both compute and storage. There's no need to over-provision or pay for idle capacity.
- **Built-in availability and fault tolerance**: We’ve designed our architecture for high availability and resilience, ensuring your data is safe and your applications are always accessible.
- **Focus on business logic**: With the heavy lifting of infrastructure management handled by Neon, you can dedicate your time and effort to writing code and delivering value to your users.

## To us, serverless does not mean…

_That Neon only works with serverless architectures_. Neon is fully compatible with the entire PostgreSQL ecosystem. Whether you're using [Django](/docs/guides/django), [Rails](/docs/guides/ruby-on-rails), or even a bash script in your basement, if it works with Postgres, it works with Neon.

_That you have to pay per query_. Your charges are based on compute and storage usage, not the number of queries. For example, you could run billions of queries for as little as $19 per month if they fit within the resources allotted in the [Launch plan](/docs/introduction/plans#launch). The CPU allowance is ample for running sites 24/7 with low CPU requirements.

_That you’ll get unpredictable costs due to traffic spikes_. We provide transparency in your potential costs. You always set a maximum autoscaling limit to avoid unpredictable bills, and you can always [check your consumption](/docs/introduction/monitor-usage). We send you notifications if your storage usage grows quickly.

## Learn more

- [Autoscaling](/docs/introduction/autoscaling)
- [Autosuspend](/docs/introduction/auto-suspend)
- [Plans and billing](/docs/introduction/about-billing)
- [Database-per-tenant use cases](https://neon.tech/use-cases/database-per-tenant)
- [Variable workload use cases](https://neon.tech/variable-load)
- [Postgres for SaaS use cases](https://neon.tech/use-cases/postgres-for-saas)
