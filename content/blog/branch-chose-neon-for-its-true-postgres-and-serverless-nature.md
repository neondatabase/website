---
title: Branch chose Neon for its true Postgres and serverless nature
description: 'Going serverless to ship product, not babysit infrastructure'
excerpt: >-
  Using Neon has meant our developers can continue to spend their time on things
  that meaningfully drive the business forward, instead of babysitting
  infrastructure. Adithya Reddy, Developer 4 at Branch Branch is a leader in
  innovative home and auto insurance that’s simple to buy a...
date: '2024-01-18T08:41:35'
updatedOn: '2024-02-29T14:50:43'
category: case-study
categories:
  - case-study
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/branch-chose-neon-for-its-true-postgres-and-serverless-nature/cover.png
  alt: null
isFeatured: false
seo:
  title: Branch chose Neon for its true Postgres and serverless nature - Neon
  description: >-
    Neon is a perfect match for serverless architectures, simplifying database
    management while providing flexibility and scalability.
  keywords: []
  noindex: false
  ogTitle: Branch chose Neon for its true Postgres and serverless nature - Neon
  ogDescription: >-
    Neon is a perfect match for serverless architectures, simplifying database
    management while providing flexibility and scalability.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/branch-chose-neon-for-its-true-postgres-and-serverless-nature/social.jpg
source:
  wpId: 4319
  wpSlug: branch-chose-neon-for-its-true-postgres-and-serverless-nature
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/branch-chose-neon-for-its-true-postgres-and-serverless-nature/image-17-1024x576-90f0608e.png)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>Using Neon has meant our developers can continue to spend their time on things that meaningfully drive the business forward, instead of babysitting infrastructure.</em></p>
<cite>Adithya Reddy, Developer 4 at Branch</cite>
</blockquote>

[Branch](https://www.ourbranch.com/) is a leader in innovative home and auto insurance that’s simple to buy and built for savings. As their services expanded, they needed a database solution capable of supporting complex queries and diverse data access patterns — a requirement that Amazon DynamoDB and other providers couldn’t fulfill.

## Beyond NoSQL and the quest for a true serverless database

> _We were fully serverless from the start, but as we grew, our database needs evolved beyond what NoSQL could offer._

Branch has embraced a fully serverless tech stack from day one and initially used Amazon DynamoDB for all applications. However, they faced limitations with the NoSQL database, particularly in data storage and query flexibility. This led them to explore other options, including Aurora Serverless v1 and v2, and other distributed, and MySQL providers, but none met their needs of fast scale-up or scale-down to zero, resulting in a substantial bill for idle instances.

> _DynamoDB served and continues to serve us well, but its query limitations were a roadblock to our evolving data needs._

The company’s challenges with its previous database included:

- **Inefficiency in Data Handling**: DynamoDB’s limitations in handling diverse query patterns.
- **Infrastructure Management**: Challenges with Aurora Serverless, including slow scaling, VPC limitations, and cost inefficiencies.
- **Technical Limitations**: Issues with payload limitations during large migrations and Aurora V2’s inability to scale to zero.

Ultimately, they chose Neon Serverless Postgres for its true serverless nature, scaling capabilities, and compatibility with their existing systems.

> _Neon checks all of our boxes. It’s real Postgres, scales down to zero, has no instances to manage, and only charges for data storage and actual usage_

## A perfect match for serverless architecture

Branch’s tech stack, including AWS Lambda, Vercel, Algolia, and Upstash, seamlessly integrates with Neon. Each developer at Branch is provided with their own isolated deployment environment using Neon’s database branching, ensuring a streamlined developer workflow. After extensive testing, Branch transitioned to Neon for its:<br />

- **True Serverless Nature**: Neon’s capacity to scale to zero and handle complex queries seamlessly.
- **Ease of Use**: Simplified developer’s workflows with database branching, allowing developers to focus on app development rather than infrastructure.
- **Flexibility**: Support for a wide range of PostgreSQL features, such as stored procedures and triggers.

## An integrated part of the growth strategy

> _The best measure of Neon’s success for us has been that we have never had to think about Neon._

The implementation of Neon led to significant improvements:

- **Operational Efficiency**: Zero time spent on database capacity and infrastructure management.
- **Scalability**: Efficiently managed increasing data requirements with Neon’s automatic scaling capabilities.
- **Cost-Effectiveness**: Pay-per-use model reduced costs significantly compared to other solutions.

## Conclusion

Neon’s serverless Postgres database proved to be an ideal solution for Branch, aligning perfectly with their serverless architecture and simplifying database management while providing the flexibility and scalability required for their growing needs.<br />For companies seeking a hassle-free, scalable, and efficient database solution, Neon is a prime example of modern database technology, perfectly tailored for serverless architectures. Discover how Neon can eliminate operational burdens and bring standard Postgres into the modern development workflow by [signing up here](https://console.neon.tech/signup).
