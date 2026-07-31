---
title: Neon’s Microsoft Azure Native Integration is Generally Available
description: >-
  Deploy and manage Neon Serverless Postgres as a deeply integrated Azure-native
  service
excerpt: >-
  Neon’s Microsoft Azure Native Integration has reached General Availability,
  providing developers with a powerful, serverless Postgres solution on Azure.
  Neon integrates with your existing Azure workflows, including unified billing,
  Microsoft single-sign on (SSO), and full MACC el...
date: '2025-05-07T18:01:03'
updatedOn: '2025-08-14T09:25:40'
category: product
categories:
  - product
  - company
authors:
  - monica-steinke
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/azure-native-integration-ga/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Neon’s Microsoft Azure Native Integration is Generally Available - Neon
  description: >-
    Neon’s Microsoft Azure Native Integration has reached General Availability:
    developers have a powerful, serverless Postgres solution on Azure.
  keywords: []
  noindex: false
  ogTitle: Neon’s Microsoft Azure Native Integration is Generally Available - Neon
  ogDescription: >-
    Neon’s Microsoft Azure Native Integration has reached General Availability:
    developers have a powerful, serverless Postgres solution on Azure.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/azure-native-integration-ga/social.jpg
---

**Neon’s Microsoft Azure Native Integration has reached General Availability,** providing developers with a powerful, serverless Postgres solution on Azure. Neon integrates with your existing Azure workflows, including unified billing, [Microsoft single-sign on (SSO)](https://learn.microsoft.com/en-us/azure/partner-solutions/neon/manage), and full [MACC eligibility](https://neon.tech/docs/introduction/billing-azure-marketplace#microsoft-azure-consumption-commitment-macc). Whether you’re building new apps or scaling global workloads, Neon brings the power of serverless Postgres to your Azure environment with zero friction.

<video autoPlay muted loop width="1476" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/azure-native-integration-ga/lifr-ga-video-2f8b16f6.mp4" />
</video>

<Admonition type="info" title="context">
Neon is working with Microsoft to bring serverless Postgres to the Azure ecosystem. [Review our original announcement](https://neon.tech/blog/neon-is-coming-to-azure) for a refresher.
</Admonition>

## What Is the Neon Azure Native Integration?

[Neon’s Azure Native Integration](https://learn.microsoft.com/en-us/azure/partner-solutions/neon/overview) lets you use Neon like any other native Azure service, fully embedded within your Azure workflows, identity systems, and billing structure.

You can provision Neon Serverless Postgres directly from the [Azure portal](https://portal.azure.com/), where it appears alongside Microsoft’s own database offerings in the Databases section, complete with a partner badge:

![Post image](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf24hOiRAfyuyTBMGLJERRXPX2MkfsBEx_AR-0lLgaFgwDX2xT1P5srwboUAy3i4MQYUOKC9ELgxFuc92624S84f8ASXS1JjNm8SnJDG7UQs7yK3Y_n3bih2fbFEjd3BBfV-POxRg?key=Lvjl-lrKGNJJhzj3YImvjvTa)

Once provisioned, you can manage Neon projects, branches, and connection strings using the Azure Command-Line Interface (CLI) and SDK.

This deep integration also simplifies security and procurement:

- Authenticate using Microsoft Entra ID (formerly Azure Active Directory)
- Consolidate Neon usage into your Azure bill—no separate account or payment required

## What’s New with General Availability?

While in preview, developers were able to create a Neon organization through Azure; now, with general availability, they can also manage Neon projects, branches, and connection strings directly through Azure.

![Post image](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf8ZnjusHUNvMorjd__Pa_x0enV7AR_HYLKHnSqBKhYoNFszWZ9pOeH--mMhfeEtDQjrv1jO4pB1_POjFKryihVEMsMs5vALwnCVbZ7lcCAVW6zHpKpH5e48SdSHuCcb6qAGYlcvw?key=Lvjl-lrKGNJJhzj3YImvjvTa)

This update makes it easier to operationalize Neon across your team, enabling tighter CI/CD integration, more granular environment management, and a faster path from provisioning to production.

And while we’re excited about the improvements available today, we’re already working on our next enhancement, designed to further simplify identity and access management, making your workflow even more streamlined within the Azure ecosystem.

## Who Benefits From the Neon Azure Native Integration?

### Enterprises with Azure MACC

If your organization has a [Microsoft Azure Consumption Commitment (MACC)](https://learn.microsoft.com/en-us/marketplace/microsoft-commercial-marketplace-benefits#azure-consumption-commitment), Neon is now an eligible partner. Any Neon usage through the Azure Marketplace contributes toward your committed Azure spend, with no additional procurement steps or vendor onboarding required. This makes it simple for enterprises to adopt serverless Postgres within their existing Azure contracts and governance structures.

#### **Why Neon** for Enterprise

[Enterprises choose Neon](https://neon.tech/enterprise) due to its efficient scalability, strong recovery guarantees, and developer workflows that align with modern software development practices:

- **Efficient scalability**: [Neon’s compute layer scales automatically based on workload](https://neon.tech/docs/introduction/autoscaling), including CPU, memory, and active connections. There’s no need to overprovision resources or worry about connection limits. The benefits are smoother performance during peak traffic, lower infrastructure costs, and reduced operational overhead for engineering teams.
- **Reliable recovery options**: Neon also enables [instant restores](https://neon.tech/docs/introduction/branch-restore), even for multi-terabyte databases. This significantly reduces downtime in the event of failures, providing a [strong safety net for production environments](https://neon.tech/blog/the-true-cost-of-slow-postgres-restores). Every database on Neon also includes [high availability by default,](https://neon.tech/docs/introduction/high-availability) with no need to manage replicas or monitor replication lag.
- **Smoother development workflows**: Neon’s [database branching](https://neon.tech/docs/introduction/branching) makes it easy to create isolated, production-like environments for testing, CI/CD, and feature development. Teams can spin up branches in seconds, iterate quickly, and [launch with confidence](https://neon.tech/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches). And with scale-to-zero, idle dev and staging environments incur no cost, keeping budgets lean across the SDLC.

All of this is backed by Neon’s commitment to [enterprise-grade security and compliance.](https://neon.tech/security) We follow industry best practices for encryption, access control, and data protection.

<Admonition type="important" title="talk to us">
If you’re just discovering Neon, [schedule a meeting with our team](https://neon.tech/contact-sales). Our Solutions Engineers are ready to review your requirements and help you evaluate whether Neon is the right fit.
</Admonition>

### AI Startups scaling on Azure

If you’re a startup, especially if part of the [Microsoft for Startups program](https://www.microsoft.com/startups) and embracing the AI wave, the Neon Azure Native Integration is also a perfect fit. Neon’s serverless Postgres architecture delivers the speed, flexibility, and automation that modern AI applications demand. Here’s how AI startups are building on Neon:

### AI agents powered by Neon

[Replit Agent and Create.xyz are using Neon as a foundation for agentic app creation](https://x.com/nikitabase/status/1837138637516931252). These AI agents automatically spin up Neon databases in response to user input, whether it’s a new AI workspace, a micro SaaS, or a proof-of-concept app.

Neon’s instant provisioning, fully managed storage, and [powerful API](https://neon.tech/blog/provision-postgres-neon-api) enable agents to deploy Postgres completely autonomously. No manual setup, no disk provisioning, no credential management. Neon handles it all in the background, so the agent can stay focused on the user experience.

### RAG pipelines with pgvector

Neon is also an ideal vector store for Retrieval-Augmented Generation (RAG) workflows. Startups are building pipelines that generate embeddings with Azure OpenAI Service and store them in Neon using the pgvector extension, unlocking fast, SQL-native semantic search inside a fully managed Postgres environment.

There’s no need for a separate vector database or added infrastructure. With Neon, you get native vector search, seamless scaling, and the simplicity of standard Postgres tooling to insert, index, and retrieve vectors efficiently.

And if you’re building with Microsoft-native tools, [Neon integrates directly with Semantic Kernel](https://github.com/microsoft/semantic-kernel/tree/main/samples/apps/NeonMemory). Using the Postgres memory connector, you can orchestrate a full RAG pipeline:

- Generate embeddings with Azure OpenAI Service
- Store and query them in Neon with pgvector
- Retrieve relevant results in milliseconds, all with SQL

## A Big Milestone, But We’re Just Getting Started

This release is the result of close collaboration between Neon and Microsoft engineering teams. With a roadmap and ongoing co-investment, we’re working to make Neon truly native to the Microsoft developer ecosystem.

Whether you’re an individual developer or part of an enterprise engineering team, log in to the Azure Marketplace and [try Neon’s Native Integration today.](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=overview)

<Admonition type="tip" title="Find us at MS Build">
If you’re attending [Microsoft Build 2025](https://build.microsoft.com/en-US/home), come find us at booth 518. We’d love to meet you and hear your feedback on how we can build the best serverless Postgres experience on Azure!
</Admonition>
