---
title: Bring Your Own Extensions to Serverless PostgreSQL
description: Announcing Dynamic Extension Loading
excerpt: >-
  Extensions in PostgreSQL are comparable to libraries in programming languages
  or plugins in web browsers. They are pivotal in the PostgreSQL ecosystem,
  providing additional functionalities ranging from encryption and AI to
  handling time series and geospatial data. More complex ex...
date: '2024-01-17T14:07:36'
updatedOn: '2024-03-27T11:33:26'
category: postgres
categories:
  - postgres
  - community
authors:
  - anastasia-lubennikova
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/bring-your-own-extensions-to-serverless-postgresql/cover.png
  alt: null
isFeatured: false
seo:
  title: Bring Your Own Extensions to Serverless PostgreSQL - Neon
  description: Announcing Dynamic Extension Loading
  keywords: []
  noindex: false
  ogTitle: Bring Your Own Extensions to Serverless PostgreSQL - Neon
  ogDescription: >-
    Extensions in PostgreSQL are comparable to libraries in programming
    languages or plugins in web browsers. They are pivotal in the PostgreSQL
    ecosystem, providing additional functionalities ranging from encryption and
    AI to handling time series and geospatial data. More complex extensions can
    transform PostgreSQL into a graph or analytical database, and some companies
    even create custom […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/bring-your-own-extensions-to-serverless-postgresql/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/bring-your-own-extensions-to-serverless-postgresql/cover.png)

Extensions in PostgreSQL are comparable to libraries in programming languages or plugins in web browsers. They are pivotal in the PostgreSQL ecosystem, providing additional functionalities ranging from encryption and AI to handling time series and geospatial data. More complex extensions can transform PostgreSQL into a graph or analytical database, and some companies even create custom private extensions for specific business logic.

Neon’s compute in stateless PostgreSQL runs as a VM or a Kubernetes pod. The compute image comes with a list of [supported extensions](https://neon.tech/docs/extensions/pg-extensions). However, supporting a wide range of PostgreSQL extensions can pose performance and security risks in a multi-tenant serverless environment like Neon. This is why we are excited to announce we added [support for private and custom extensions](https://neon.tech/docs/extensions/pg-extensions#custom-built-extensions) using Dynamic Extension Loading.

This feature is currently in beta on request only. You need to [have an account](https://console.neon.tech/) and [contact support](https://support@neon.tech) if you want to bring your own extensions to Neon. In this article, we’ll introduce Dynamic Extension Loading, its implementation, its benefits, and our future plans.

## Extensions in PostgreSQL

![Image](https://cdn.neonapi.io/public/images/pages/blog/bring-your-own-extensions-to-serverless-postgresql/image-14-1024x511-63c80259.png)

PostgreSQL is a robust and versatile database system that is further enhanced by its support for extensions. Some of the most popular extensions are [PostGIS](https://postgis.net/) for geolocation, [pg_stat_statement](https://www.postgresql.org/docs/current/pgstatstatements.html), or [pgvector](https://github.com/pgvector/pgvector) for vector similarity search.

Extensions in PostgreSQL come in various forms:

1. **SQL Object Packages**: These are the most common, comprising domain-specific data types, functions, triggers, etc.
2. **Procedural Languages**: Extensions like [PLPython](https://www.postgresql.org/docs/current/plpython.html) or [PLV8](https://github.com/plv8/plv8) enable the use of different programming languages within PostgreSQL.
3. **Internal API Enhancements**: Written in C, these powerful extensions can introduce new storage methods, volume replication, background jobs, and configuration parameters.
4. **Extensions in Other Languages**: Beyond C, extensions can be developed in languages like C++ or Rust, broadening the scope of functionality.

To use an extension, it must be built against the correct major version of PostgreSQL. The installation involves placing files in the shared directory and library files in the libdir, paths that vary across platforms. After placing the files, the `CREATE EXTENSION` command is executed in the database, prompting PostgreSQL to locate and run the installation scripts for the extension.

## Extension support limitations in serverless environments

In Neon’s serverless PostgreSQL environment, each compute runs as an ephemeral Kubernetes pod or VM. A compute instance can be scaled up, down, and descheduled whenever the workload changes. Therefore, supporting a wide range of PostgreSQL extensions presents significant challenges such as:

- **Compatibility**: Many extensions are not designed for serverless architectures, particularly those needing persistent storage or deep system integration, such as [pg_cron](https://github.com/citusdata/pg_cron) and [file_fdw](https://www.postgresql.org/docs/current/file-fdw.html).
- **Performance Issues**: Embedding all extensions in the compute image significantly increases its size, leading to slower start times and reduced performance.
- **Maintenance Overhead**: Traditional methods require frequent updates to the entire compute image for each extension update, causing potential service disruptions.
- **Security Risks**: A larger set of extensions in the base image increases the potential attack surface, especially with extensions that remain unused by many users.
- **Limited Customization**: The open-source nature of compute images restricts the inclusion of custom or closed-source extensions, limiting tailored solutions for specific customer needs.

Therefore, the conventional method of bundling extension files into compute images is impractical due to the sheer number of extensions and the varied needs of users. This led us to rethink how we provide extensions with Dynamic Extension Loading.

## Dynamic Extension Loading: A New Approach

At Neon, we’ve addressed these challenges with our dynamic extension loading mechanism. Here’s how it works:

1. **Building and Storing Extensions**: We build extensions in a separate repository and store the resulting files in an S3 bucket.
2. **Configuring Extensions**: Extensions are configured per user in the Neon control plane, enhancing customization.
3. **On-Demand Loading**: Compute instances download control files at startup, and library files are fetched as needed when extension functions are called.

With Dynamic Extension Loading, private and default extensions can be added to compute instances without restarting, reducing maintenance overhead. Additionally, it brings performance benefits to Neon. Our plans with Dynamic Extension Loading include moving all default-supported extensions to the extension storage, resulting in a smaller compute image size and faster start times.

## How to bring your own extension to Neon

To request support for a Postgres extension, paid plan users can [open a support ticket](https://console.neon.tech/app/projects?modal=support). Free plan users can submit a request via the feedback channel on our [Discord Server](https://discord.com/invite/92vNTzKDGp).

Our engineers will then evaluate the compatibility of your extensions with Neon, build it, and upload the artifacts to the extension storage once it pass all the security tests.

## Conclusion

This feature is currently in beta, with plans for general availability in the near future. This development marks a significant step forward in making PostgreSQL more adaptable and efficient in a serverless environment.

What about you? Do you use PostgreSQL extensions in your projects? Join us on Discord and let us know which extensions you use and how we can enhance your PostgreSQL experience in the cloud.
