---
title: How Cedalio uses Neon for an efficient development workflow
description: They choose Neon over RDS because of its superior developer experience
excerpt: >-
  We love Postgres, and for us, being able to use Postgres database branches
  that can be integrated with our CI/CD pipeline is a killer feature. The
  ability to spawn databases that can scale down to zero is also incredibly
  helpful. This model fits well with our one database per cus...
date: '2024-05-29T19:38:07'
updatedOn: '2024-05-29T22:41:54'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Cedalio uses Neon for an efficient development workflow - Neon
  description: >-
    They choose Neon over RDS because of its superior developer experience with
    scale to zero, database branching, and a user-friendly API.
  keywords: []
  noindex: false
  ogTitle: How Cedalio uses Neon for an efficient development workflow - Neon
  ogDescription: >-
    They choose Neon over RDS because of its superior developer experience with
    scale to zero, database branching, and a user-friendly API.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow/neon-cedalio-1-1024x576-cec779f0.jpg)

<blockquote>
<p><strong>We love Postgres, and for us, being able to use Postgres database branches that can be integrated with our CI/CD pipeline is a killer feature. The ability to spawn databases that can scale down to zero is also incredibly helpful. This model fits well with our one database per customer architecture.</strong></p>
<cite>Guido Marucci, co-founder at Cedalio</cite>
</blockquote>

[Cedalio](https://cedalio.com/) (YC23) is a data platform that focuses on sustainability and transparency by leveraging AI and smart contracts. It offers a robust solution for companies needing to streamline their Environmental, Social, and Governance (ESG) reporting and data verification processes, automating the entire experience and making the data untamperable.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow/cedalio-platform-1024x650-5b96e39b.png)

## Making sustainability information auditable by default

[Greenwashing](https://www.un.org/en/climatechange/science/climate-issues/greenwashing#:~:text=By%20misleading%20the%20public%20to,some%20more%20obvious%20than%20others.), the practice of providing misleading information about the environmental benefits of a product or service, is becoming increasingly common — companies need to find a user-friendly way to certify their data so they can confidently support their sustainability claims.

Cedalio is building a platform to help companies do this, and they’re doing it by leveraging two cutting-edge technologies: AI and smart contracts.

- Most companies still rely on manual data gathering for audits, which is a very time-consuming process. Cedalio improves operational efficiency by automating data extraction using AI, centralizing information for immediate reporting through dashboards and control panels, and managing suppliers with automated tracking.
- The Cedalio platform also ensures data transparency by organizing and structuring information from various sources while preserving the origin as evidence. Companies can store data on a blockchain, providing an auditable record of each piece of data. Every change made to the stored information is tracked, identifying who made the change and what was changed.

## Neon vs RDS: the quest for a developer-friendly Postgres

When they first started building their platform, Cedalio used DynamoDB as their database – but the team was a fan of Postgres, and as soon as they realized that Postgres would be enough to handle their load, they decided to transition.

Cedalio wanted to use a managed Postgres that was easy to use and implement within their stack. They first considered RDS, but the developer experience was not quite there. The AWS console and APIs were quite convoluted and required extensive setup and configuration to achieve even basic tasks. Not ideal for a startup that needs to quickly iterate.

After trying out Neon, the team at Cedalio much preferred Neon’s intuitive API and user interface, which offered a big improvement in developer experience compared to RDS. Neon also offered game-changing features for accelerating development workflows and reducing costs of non-prod environments: database branching and scale to zero.

## Adopting database branching workflows via GitHub Actions and Fly.io

Cedalio **[uses Neon branches to automate the setup of isolated environments for each PR](https://neon.tech/flow): when a developer creates a PR, GitHub Actions trigger the creation of a new database branch in Neon and deploy a corresponding application instance on Fly.io.** This isolated setup allows the Cedalio engineers to test changes without affecting the production database and without doing any manual work.

Once the PR is approved and merged, GitHub Actions automates the deployment of changes to the production environment and cleans up the temporary database branch and application instance. This workflow accelerates the development cycle while reducing manual steps.

An important benefit of using Neon for this workflow is **[scale to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero),** which **makes these non-production database branches very affordable.** Since these temporary environments are often only needed during active development and testing, the ability to scale down to zero resources when not in use significantly reduces costs. Cedalio can maintain multiple database branches for different PRs without worrying about the bill.

## Ensuring data isolation with a DB-per-customer design

Another important capability of Neon is how [**it facilitates one-database-per-customer architectures via its flexible and user-friendly API**.](https://neon.tech/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers) This is important for Cedalio, as they need this architecture to ensure complete data isolation and enhance security – something important given the company’s background in blockchain and user-owned data.

By using dedicated databases, Cedalio’s developers also avoid the potential errors associated with (for example) filtering data for different clients. This design also makes it easier to implement and test features, ensuring that changes in one customer’s environment do not inadvertently affect others.

## The Cedalio platform architecture

Now, let’s take a closer look at the [Cedalio platform](https://docs.cedalio.com/):

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow/cedalio-architecture-1024x591-70b96f5a.png)

The centralized hub is the Studio, where users (primarily non-developers) interact with various data sources. It is designed to facilitate the management of sustainability and provenance information through an intuitive interface. Users can initiate data collection processes using custom forms, integrate APIs for automatic data imports, and leverage AI assistants for processing various documents.

- The `AI Data Processor Module` extracts relevant information from uploaded utility invoices, with plans to expand to certificates, purchase orders, and more complex documents.
- The `Data Validation & Heuristic Module` runs heuristics and validations on extracted information to ensure accuracy and consistency across documents.
- The `Auditable Storage Module` Manages storage of processed information, tracking changes and enabling public auditing via blockchain, currently supporting electricity, gas, and water utilities.
- The `Audit View` provides access to data points via the Document AI API or a link generating an HTML page, displaying the entire change history and original document for auditing purposes.
-

Cedalio’s backend design has undergone significant design changes recently. The new architecture leverages the Postgres WAL to ensure that all operations within the database are captured and secured:

- The Studio hooks into Postgres WAL to capture all operations executed in the database.
- All operations are bundled together, encrypted, and optionally persisted into decentralized storage solutions like IPFS or Arweave.
- The encrypted bundle of operations is hashed, and this hash is committed to a smart contract.
- The smart contract mirrors the client database and is owned by a wallet controlled by the client. This setup provides an independent verification mechanism for clients and third parties to ensure that the database’s final state has not been tampered with.

By persisting WAL operations and database checkpoints in decentralized storage, Cedalio ensures that data recovery can occur independently of Cedalio’s infrastructure. Clients also have the flexibility to choose other storage methods for backups, such as S3 or their internal data services, enhancing the reliability and accessibility of their data.

## Wrap up

If you want to learn more about Cedalio, you can book yourself some time with the team [here](https://calendly.com/lucianareznik/30min?month=2024-05). And if you’re also on the hunt for a developer-friendly Postgres, [give Neon a go](https://console.neon.tech/signup) — you can get started with our [free tier,](https://neon.tech/pricing) and take it from there as you scale.
