---
title: Announcing Monitoring and Organizations
description: Announcing enhanced monitoring and organizations on Neon.
excerpt: >-
  Neon’s serverless Postgres improves developer velocity and allows
  organizations to ship faster. When using a database for your app, monitoring
  its performance is crucial. You can do that using Postgres extensions such as
  pg_stat_statements. However, if you’d rather do it from the...
date: '2024-04-16T16:10:15'
updatedOn: '2024-04-17T09:33:35'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/cover.jpg
  alt: Neon Monitoring Blogpost Cover
isFeatured: false
seo:
  title: Announcing Monitoring and Organizations - Neon
  description: Announcing enhanced monitoring and organizations on Neon.
  keywords: []
  noindex: false
  ogTitle: Announcing Monitoring and Organizations - Neon
  ogDescription: >-
    Neon’s serverless Postgres improves developer velocity and allows
    organizations to ship faster. When using a database for your app, monitoring
    its performance is crucial. You can do that using Postgres extensions such
    as pg_stat_statements. However, if you’d rather do it from the UI, we’re
    happy to announce the release of the monitoring page on the […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/social.jpg
---

![Neon Monitoring Blogpost Cover](https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/cover.jpg)

Neon’s serverless Postgres improves developer velocity and allows organizations to ship faster.

When using a database for your app, monitoring its performance is crucial. You can do that using Postgres extensions such as pg_stat_statements. However, if you’d rather do it from the UI, we’re happy to announce the release of the monitoring page on the Neon console.

We also understand that modern application development requires collaboration and teamwork, so we added Organizations to the Console, which is currently in Private Preview. Customers on the Launch and Scale plans can request access by contacting [customer-success@neon.tech](mailto:customer-success@neon.tech).

Let’s take a quick tour of these new features.

## Monitoring

Using Neon means using Postgres. When you interact with Neon, you aren’t doing so using a wrapper – you’re interacting directly with a Postgres database.

This provides you with a great deal of power and flexibility. It also means you can exhaust connections, cause deadlocks, and max out your allocated CPU and RAM. That’s why we’ve shipped a comprehensive [monitoring dashboard](https://neon.tech/docs/introduction/monitoring-page) in the Neon console.

The usual suspects, CPU and RAM, are present, but it also includes:

- Connections count
- Buffer cache hit rate
- Database size
- Deadlocks
- Rows

Understanding your application’s baseline performance and general performance trends is essential. Database branching alongside this knowledge enables teams to ship with greater confidence since they can use branches to test and compare their changes against their baseline. As the saying goes, [“Measure twice, cut once”](https://en.wiktionary.org/wiki/measure_twice_and_cut_once).

## Take Monitoring for a Spin with pgbench

Take a test scenario created using `pgbench` as an example. First, prepare a database using `pgbench`.

```bash
pgbench -i -s 100 $DATABASE_URL
```

This results in a database that’s approximately 1.5 GiB in size, assuming it was empty prior. You can confirm the size using the new metrics **dashboard database** size field.

Now you can test the performance of this database and generate metrics using the following `pgbench` command. Try various values for the number of concurrent clients (`-c`) and see how the progress report changes every 30 seconds.

```bash
pgbench -c 95 -j 4 -P 30 -t 10000 $PG_URL
```

Using the default 0.25 CU [compute size](https://neon.tech/docs/manage/endpoints#compute-size-and-autoscaling-configuration) results in a lower number of transactions per second (TPS) versus 3 CU. You can see this clearly in the screenshot below. The cache hit rate increases dramatically after autoscaling is enabled and up to 12 GB of RAM becomes available to Postgres.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/monitoring-cache-hit-1024x579-398978bf.jpg)

Monitoring can help you identify potential performance issues, but the metrics can also help you understand your storage usage. The **Rows** metric tracks the inserts, updates, and deletes you’ve made. More changes mean a larger [history](https://neon.tech/docs/reference/glossary#history), which means [increased storage usage](https://neon.tech/docs/introduction/usage-metrics#storage-details) if you have a large history retention window configured.

## Organizations

Each project in Neon provides an isolated database timeline, the ability to create read-write endpoints and read-replicas, and branches for development and testing. Projects can be [shared with other Neon users](https://neon.tech/docs/manage/projects#share-a-project) to facilitate collaboration.

Today, we’re announcing our Organizations feature in Private Preview. An organization represents a collection of projects, and members of the organization have access to those projects.

Take the following screenshot, for example. It looks like a regular Neon account that contains a single project, right?

![Post image](https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/orgs-personal-1024x575-448401e0.jpg)

Clicking the dropdown in the navigation bar reveals that this user is part of an organization, **Evan’s org**.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/orgs-selector-1024x580-557fb2e1.jpg)

Selecting the organization reveals that the user can access the two projects within the organization.

![Post image](https://cdn.neonapi.io/public/images/pages/blog/announcing-monitoring-and-organizations/org-two-projects-1024x577-85fb62f0.jpg)

Projects within an organization can be shared just like personal projects, so you can invite individuals to a project, even if it’s within an organization. If you’re keen to try out organizations, then you should get in touch with [customer-success@neon.tech](mailto:customer-success@neon.tech).

## Conclusion

Monitoring will provide you with better insights into your Neon usage and help you better understand your application’s traffic and load patterns.

Our new organizations feature is the next step for us in supporting our customers who are managing a fleet of Postgres databases and teams on Neon.

Remember, contact our customer success team if you’d like early access to organizations! Join us in [Discord](https://neon.tech/discord), follow us on [X](https://x.com/neondatabase), and let us know what observability tools you’d like us to integrate with so you can scale your applications to millions of users.
