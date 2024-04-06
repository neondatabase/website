---
title: What is Neon?
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
updatedOn: '2024-01-26T16:30:34.542Z'
---

**Neon is serverless Postgres optimized for developer experience, velocity, and scalability.**

## Neon is Postgres

Above all else, **Neon is Postgres**, the most popular open-source database in the world that developers know and trust. Neon supports Postgres 14, 15, and 16, allowing you to select the version you want to use when creating a Neon project. If your application runs on Postgres, it runs on Neon.

In addition to being truly Postgres, Neon's architecture enables features that allow developers to build modern applications with greater speed, flexibility, and cost efficiency.

## Neon is truly serverless

Neon's autoscaling capability automatically and transparently scales up compute resources on demand, in response to your application workload, and scales down to zero during periods of inactivity. This serverless architecture ensures your only using your compute allowances when you're actually using the database, which can lead to significant cost savings, potentially delivering up to a 10x reduction in costs compared to traditional database solutions. Neon’s serverless approach removes the need for manual scaling, allowing you to focus more on your application rather than managing infrastructure

## Neon is fully managed

Neon being a fully managed service means that it provides high availability without requiring users to handle administrative, maintenance, or scaling burdens associated with managing a database system. This approach allows developers to focus more on productivity and less on the operational aspects of database management. Neon takes care of the complexities of scaling, backups, and ensuring availability, making it easier for users to manage their Postgres databases without worrying about the underlying infrastructure.

- Databases that spin up in seconds
- Instant branching:
- Autoscaling
- Autosuspend
- Connection pooling
- Vector search
- Point-in-Time Restore
- Time Travel Connections
- Neon CLI
- Neon API

Neon's serverless architecture can help you streamline your workflows by eliminating the need for managing database servers and scaling infrastructure manually. This means you or your developers can focus more on creating applications without worrying about backend constraints. 


Neon enhances velocity by automatically scaling resources to match demand, ensuring that applications remain performant under varying loads. Moreover, its optimization for developer experience includes intuitive tooling and seamless integration with existing development environments, making it easier to implement advanced database functionalities. With Neon, scalability is no longer a challenge but an inherent feature, supporting the growth of applications from startup to enterprise scale effortlessly.


Neon's architecture separates storage and compute to provide modern developer features such as serverless operations, branching, bottomless storage, and more. Neon is designed for scalability, automatically adjusting compute resources based on demand, and scaling down to zero during inactivity to help reduce costs. Additionally, it supports branching for databases, making it easy to manage development, test, and staging environments. Neon is open source, built in Rust, and compatible with the latest versions of Postgres. It aims to enhance developer productivity without the administrative overhead of traditional database management

Neon is a fully managed serverless Postgres with a generous free tier.
Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and more. Neon is open source and written in Rust.

## Serverless

Neon automatically and transparently scales up compute on demand, in response to application workload. Neon also scales down to zero on inactivity. Since Neon is serverless, it only charges for what you use and can deliver up to a 10x reduction in cost. To learn more, see [Autoscaling](/docs/introduction/autoscaling), and [Autosuspend configuration](/docs/manage/endpoints#auto-suspend-configuration).

## Built for developer productivity

Neon allows you to create a branch of your Postgres database. It's easy to create branches for development, test, and staging environments.

Branching is instant and has close to zero overhead, as it is implemented using the "copy-on-write" technique in Neon storage.
In fact, branches are so cheap that you can create a branch for every code deployment in your CI/CD pipeline. To learn more about our branching feature, see [Branching](/docs/introduction/branching).

## Fully managed

Neon provides high availability without any administrative, maintenance, or scaling burden.

## Bottomless storage

Our engineering team has developed a purpose-built, multi-tenant storage system for the cloud.
Neon storage allows virtually unlimited storage while providing high availability and durability guarantees.

Neon storage integrates storage, backups, and archiving into one system. This reduces operational headaches associated with checkpoints, data backups, and restore.

Neon storage is designed with cloud costs in mind and uses a multi-tier architecture to deliver on latency, throughput, and cost. It integrates a cloud object store, such as S3, to push cold data to the cheapest storage medium, and uses locally attached SSDs for low latency, high-performance data. Neon storage is written in Rust for maximum performance and usability.

## Open source

You can find [neondatabase](https://github.com/neondatabase/neon) on GitHub. We develop in public under the Apache 2.0 license. For an overview of Neon's architecture, refer to Neon's [architecture documentation](/docs/introduction/architecture-overview).

## Compatibility

Neon compute is the latest version of Postgres. It is 100% compatible with any application that uses the official release of Postgres. Currently, we support [Postgres 14](https://www.postgresql.org/docs/14/release-14.html), [Postgres 15](https://www.postgresql.org/docs/15/release-15.html), and [Postgres 16](https://www.postgresql.org/docs/16/release-16.html) (the default). For details refer to the [Postgres compatibility](/docs/reference/compatibility) page.
