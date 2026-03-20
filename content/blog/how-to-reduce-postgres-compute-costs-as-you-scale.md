---
title: How to reduce Postgres compute costs as you scale
description: >-
  While you're focused on lowering storage costs, compute keeps eating your
  budget
excerpt: >-
  Reducing cloud costs is on everyone’s mind. While storage prices continue to
  drop, fewer innovations have been made to reduce compute costs, even though
  compute typically consumes a larger chunk of the bill. That’s why we’ve built
  Neon with scale to zero and autoscaling, so that...
date: '2024-04-29T15:31:21'
updatedOn: '2024-04-30T18:21:11'
category: postgres
categories:
  - postgres
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-reduce-postgres-compute-costs-as-you-scale/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to reduce Postgres compute costs as you scale - Neon
  description: >-
    Storage costs are in everyone's mind, but it is very likely that compute
    will account for the majority of your bill.
  keywords: []
  noindex: false
  ogTitle: How to reduce Postgres compute costs as you scale - Neon
  ogDescription: >-
    Storage costs are in everyone's mind, but it is very likely that compute
    will account for the majority of your bill.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-reduce-postgres-compute-costs-as-you-scale/social.jpg
source:
  wpId: 5853
  wpSlug: how-to-reduce-postgres-compute-costs-as-you-scale
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-reduce-postgres-compute-costs-as-you-scale/neon-reduce-costs-1024x576-3ebecbd5.jpg)

**Reducing cloud costs is on everyone’s mind. While storage prices continue to drop, fewer innovations have been made to reduce compute costs, even though compute typically consumes a larger chunk of the bill. That’s why we’ve built [Neon](https://console.neon.tech/signup) with scale to zero and autoscaling, so that teams only pay for the compute resources they actually use without compromising performance or requiring annoying resizes, downtimes, or manual work.**

It’s great to see your startup take off, but success comes (literally) at a cost. Many successful startups have seen their database costs skyrocket as they scale up to meet growing demand. It’s a good problem to have, but it’s a problem nonetheless, and one that can put a significant strain on your budget and resources.

[Postgres is eating the database world](https://medium.com/@fengruohang/postgres-is-eating-the-database-world-157c204dcfc4), so when we talk about reducing database costs, we’re really talking about reducing Postgres costs. And from the two main elements that make up your managed Postgres bill (storage and compute), the latter is the most overlooked—which is odd, since it is very likely that compute will account for the majority of your bill.

## How compute is billed in Amazon RDS

[Amazon RDS](https://aws.amazon.com/rds/postgresql/) is the most popular managed Postgres service on the market, so we’ll focus primarily on RDS in this article, although most of the conclusions can apply to other services as well.

In Amazon RDS, compute costs are largely determined by:

- **Instance class**. How much vCPUs and RAM are allocated to your database instance. Logically, larger instances with more resources will cost more. This is _allocation pricing_: it’s independent of how much resources you actually use, as we’ll see below.
- **On-demand vs reserved**. With On-demand instances, you will pay “by the hour” (though effectively _by the month_) for the allocated compute capacity. If you want a discount, you can make an upfront payment for a 1 or 3-year term to access Reserved pricing.
- **Single-AZ vs multi-AZ**. Single-AZ deployments give you one database instance in a single Availability Zone. Multi-AZ deployments cost double, and come with a primary database instance and a standby replica in a different AZ for high availability.

## Lowering down compute costs in Amazon RDS: your options

Now, with the billing structure in mind, let’s explore what can be done to optimize the compute bill as much as possible.

### Choosing the best database strategy

First things first: if you’re choosing a traditional managed database service like RDS and you don’t want to be ripped off over time, it is essential that you plan your database strategy correctly. Managing AWS infra takes more money, time, and effort the more your deployment grows, so make sure to ask yourself the right questions upfront:

- How many prod instances do you need? E.g., if you want to create one-database-per-tenant, should every database be on its own instance? [In RDS, this architecture often means not only higher costs but also complex operations overtime.](https://neon.tech/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers) Do you prefer to fit many databases into a larger production instance? This is often more cost-effective, but be aware of potential performance isolation problems, complexities with region-dependent data compliance regulations, and more complex Postgres management.
- Similarly, ask yourself how many non-production instances do you need. Do you want one separate dev instance per engineer? Make sure to audit your testing and staging environments too, and evaluate if you really need them.
- If you want multi-AZ for your production instances, _make sure you really need this level of availability_. High-availability deployments are expensive (in RDS and elsewhere).

### Choosing the right instance size

Once you’ve determined how your deployment is going to look, the next step seems obvious—but it’s easier said than done. Nothing will be more effective in optimizing your compute costs than rightsizing your instance, avoiding overprovisioning.

A hard truth to swallow is that, in RDS deployments (and in all allocation-based databases), **the majority of allocated compute capacity remains unused most of the time**. This is obviously a huge innefficiency in terms of costs. The reason why this is so common is that [it’s actually hard to estimate how much compute capacity a workload will need](https://www.reddit.com/r/aws/comments/vgt2kx/which_instance_to_choose/); so in order to ensure a good user experience and to avoid outages and other nasty things, developers tend to overprovision.

You can try to avoid this by investing time to know your workload as best as possible. Run experiments to determine the right size for your prod instance, and analyze usage patterns of similar instances you might have running (e.g. dev or testing instances).

### Manually downsizing / pausing instances

If this ship has sailed and you suspect you’re indeed overprovisioned, the next step would be to analyze your RDS usage metrics over a significant period to identify consistent patterns of low resource utilization, for example by looking at these [AWS Cloudwatch](https://aws.amazon.com/cloudwatch/) metrics:

- `CPUUtilization`: if your CPU utilization is consistently low (e.g., below 10-20%) this indicates that you are overprovisioned.
- `FreeableMemory`: similarly, if your RDS instance consistently has a high amount of freeable memory (e.g., more than 50% of the total memory), it suggests that the instance is overprovisioned.

Now, imagine you’ve decided that you can downsize your instance class. In theory, Amazon RDS allows you to stop and start your DB instance, which could theoretically be used to switch to a smaller (and cheaper) instance when less compute power is required. However, [beware](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html):

- Stopping and restarting instances involves downtime (sometimes seconds, sometimes more)
- Changing the instance type involves modifying the DB instance settings
- Pausing and resizing instances in multi-AZ deployments can have some consequences – e.g. the primary and secondary might switch roles
- If you’re looking at the production instance, you should first test and validate any downsizing to avoid any unwanted effects on performance. This means creating a test environment that mirrors your production setup, then downsizing the instances in the test environment and monitoring performance and resource utilization. Ideally, you would perform load testing and simulate real-world workloads to ensure the downsized instances can handle the expected traffic.

As you can see, the process of downsizing has a significant amount of friction in RDS, enough to make it too time-consuming to resize and pause many instances regularly. This is an impactful one-time strategy for optimization, but **it’s important to avoid having to do this manual process (with its corresponding downtime) on a regular basis.**

### Optimizing your Postgres database

The advice we’ve covered so far works when your current setup shows that you are overprovisioned. But what if this is ot the case? Optimizations can still be made within your database for performance gains. These optimizations focus on improving the efficiency of your Postgres database and reducing the compute resources required to handle the workload.

The first thing you can look into is [query optimization](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance). If you are hand-rolling your SQL, you can analyze and optimize slow-running queries using tools like [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) and [ANALYZE](https://www.postgresql.org/docs/current/sql-analyze.html). Here’s a quick example of `EXPLAIN`:

```sql
EXPLAIN ANALYZE
SELECT c.customer_name, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_status = 'Active'
GROUP BY c.customer_name
ORDER BY total_spent DESC
LIMIT 10;
```

Here, we have a query that retrieves the top 10 active customers based on their total spent amount. The query joins the customers and orders tables, filters active customers, groups the results by customer name, and orders by the total spent amount in descending order.

<br />When we run the `EXPLAIN ANALYZE` command, it provides a detailed execution plan along with the actual runtime statistics. Here’s an example output:

```sql

                                                              QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=1234.56..1234.78 rows=10 width=42) (actual time=15.043..15.052 rows=10 loops=1)
   ->  Sort  (cost=1234.56..1256.78 rows=8889 width=42) (actual time=15.042..15.048 rows=10 loops=1)
         Sort Key: (sum(o.total_amount)) DESC
         Sort Method: top-N heapsort  Memory: 25kB
         ->  HashAggregate  (cost=1000.00..1111.11 rows=8889 width=42) (actual time=12.345..14.321 rows=500 loops=1)
               Group Key: c.customer_name
               ->  Hash Join  (cost=500.00..900.00 rows=50000 width=38) (actual time=5.678..10.987 rows=45000 loops=1)
                     Hash Cond: (c.customer_id = o.customer_id)
                     ->  Seq Scan on customers c  (cost=0.00..200.00 rows=5000 width=22) (actual time=0.010..2.345 rows=5000 loops=1)
                           Filter: (customer_status = 'Active'::text)
                     ->  Hash  (cost=300.00..300.00 rows=10000 width=20) (actual time=3.456..3.456 rows=10000 loops=1)
                           Buckets: 16384  Batches: 1  Memory Usage: 768kB
                           ->  Seq Scan on orders o  (cost=0.00..300.00 rows=10000 width=20) (actual time=0.005..2.789 rows=10000 loops=1)
 Planning Time: 0.500 ms
 Execution Time: 16.000 ms
```

The execution plan shows the steps and costs involved in executing the query. By analyzing the execution plan, we can identify potential performance bottlenecks and optimize the query accordingly. Some possible optimizations here are:

- Add an index on the `customer_status` column in the customers table to speed up the filtering of active customers.
- Create an index on the `customer_id` column in the orders table to improve the join performance.
- Consider using a [materialized view](https://www.postgresql.org/docs/current/rules-materializedviews.html) to pre-aggregate the total spent amount per customer if this query is frequently executed.

This helps identify and optimize queries that consume significant CPU resources or have high execution times. [Other options for improving DB performance include:](https://neon.tech/blog/performance-tips-for-neon-postgres)

- Use appropriate indexes to improve query performance and reduce the need for full table scans.
- Avoid using unnecessary joins or complex subqueries that can impact performance.
- Optimize query parameters and use parameterized queries to avoid query plan cache misses.

Caching is also an option to reduce database load by storing frequently accessed data in memory. You can implement application-level caching using tools like [Redis](https://neon.tech/blog/how-supergood-unlocked-their-postgres-developer-productivity#building-supergood-using-neon-redis-and-timescaledb) to cache query results or frequently accessed objects.

### ORMs and query optimization

If you are using an ORM, query optimization is something to be especially aware of. **ORMs are amazing but they can generate inefficient queries**, especially in scenarios involving complex relationships between data entities.

One of the most common issues with ORMs is the [N+1 query problem](https://scoutapm.com/blog/understanding-n1-database-queries). This occurs when the ORM fetches a parent object and then performs a separate query for each related child object. In a large dataset, this can quickly lead to performance bottlenecks.

A few things you can do:

- Use monitoring tools to find inefficient queries, particularly those that cause N+1 problems or involve excessive joins.
- Refactor your ORM queries to use eager or batch loading as appropriate. This might involve changing how you structure queries in your application code to make full use of the ORM’s capabilities.
- Ensure that your Postgres tables are properly indexed based on the queries generated by the ORM. Indexes should be aligned with the most frequently accessed columns and those used in join conditions.
- Regularly review and test your ORM-generated queries, especially after major changes to the application or the database schema. This ongoing process helps maintain optimal performance and avoid regressions.

## The Neon way: Reduce Postgres compute costs with autoscaling and autosuspend

All the resource-optimization strategies we discussed above are good strategies, but there is a problem–all of it is time-consuming. _Extremely_ time-consuming.

Trying to determine how many resources you exactly need for each instance; tracking if you got it right by going through and measuring metrics and running experiments for each downscaling; tracking down every single database every junior developer has spun up to test a new feature…. **It’s all doable in theory, but it never happens in practice.** (Literally: as I was writing this and going through RDS, I realized I had left two test instances up and running. $$$ down the drain…)

To point out just a few drawbacks of the manual RDS approach:

- First, all manual intervention is prone to human error.
- Second, with manual scaling, there is always a delay between when a performance issue arises and when it is addressed. By the time you notice a problem and take action, your users may have already experienced slow response times or service disruptions.
- Third, [resizing and restarts require downtime](https://neon.tech/blog/how-recrowd-uses-neon-autoscaling-to-meet-fluctuating-demand). Sometimes this is only a few seconds, sometimes your instances get stuck.
- Manual sizing and scaling inevitably lead to overprovisioning or underprovisioning of resources. As we discussed earlier, it is very unlikely that you’ll have a workload that 1) you know so well in advance to size properly, and 2) it is so steady that you can allocate exactly the resources you need. Realistically, it’s one of two options: you may allocate too many resources to your database, leading to wasted spending, or too few resources, resulting in poor performance. Finding the right balance is challenging and requires constant adjustment.

If you’re open to trying a better way, Neon takes care of this problem by **dynamically autoscaling your compute instances in response to load, downsizing them all way down to zero if you so wish.** This means costs always match load, without you having to do anything.

### Autoscale Postgres

[Neon’s autoscaling](https://neon.tech/docs/introduction/autoscaling) dynamically adjusts the compute resources allocated to a Neon compute endpoint based on the current load, eliminating manual intervention. The benefits:

- Neon automatically handles workloads with varying demand, such as applications with regional or time-based changes in traffic.
- Neon optimizes resource utilization, ensuring you only pay for the resources you need rather than over-provisioning for peak loads.
- Autoscaling operates within min and max user-defined limits, ensuring your compute resources and costs don’t scale indefinitely.
- Autoscaling requires no manual intervention, allowing you to focus on your applications once enabled and configured.

[Under the hood, autoscaling is built using a combination of the autoscaler-agent, a modified Kubernetes scheduler, and the NeonVM tool.](https://neon.tech/blog/1-year-of-autoscaling-postgres-at-neon) The autoscaler-agent collects metrics, makes scaling decisions, and coordinates with the scheduler to allocate resources. NeonVM manages creating and modifying the virtual machines hosting the Postgres instances.

### Scale Postgres to zero

[Autosuspend](https://neon.tech/docs/introduction/auto-suspend) complements autoscaling by allowing compute instances to scale to zero when not in use. By default, a Neon compute instance scales to zero after 300 seconds (5 minutes) of inactivity, but as a user, you can configure this behavior as you please. For example, [you can disable autosuspend for your production databases (which they’ll most likely stay on 24/7 anyways) and keep it enabled for your non-production instances to optimize compute costs.](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero)

### Simplify one-database-per-tenant

A powerful side effect of all of this is how easy it is in Neon to manage full isolation architectures, a.k.a with one-database-per-tenant with each tenant on its own instance.

Remember at the start of the post where we discussed how in RDS, it is a _pain_ to manage fleets of thousands of instances, therefore you should think about this architecture very carefully? This problem goes away in Neon, since creating instances doesn’t require cost overhead (due to scale to zero) or management overhead (all databases can be handled automatically via APIs on a serverless manner). [Neon partners are running fleets of hundreds of thousands of databases very cost-effectively and without a dedicated DevOps team.](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases)

### Don’t worry about dev and testing instances (they’re cheap)

Similarly, in Neon you don’t have to worry too much about how many dev and testing instances you need and how much resources to allocate to them. [You can use database branching to give every engineer in your team their own isolated database to work on](https://neon.tech/blog/how-supergood-unlocked-their-postgres-developer-productivity), which will scale to zero when idle.

## Stop watching the inverse

The inflated costs of compute still fly under the radar for many developers. Most engineers are used to looking at usage metrics, but they look at them from the other perspective—a.k.a, making sure they aren’t underprovisioned to avoid poor usage experience and severe performance issues. If they see a CPU utilization of 25%, many developers aren’t thinking, _“let’s downsize;”_ they are thinking, _“phew, I don’t have to upsize.”_

In the cloud era, this is the wrong way to think about databases. At the very least, it’s an _expensive_ way to think about them. You want your databases up when you have load, but you also want them down when you don’t; otherwise, **you are paying to compute nothing**.

We’re building Neon to improve this experience. If you are curious, you can get started for free by [signing up for our Free tier](https://console.neon.tech/signup). [You can also reach out to us](https://neon.tech/contact-sales) to request a free trial for Neon’s paid plans.

## 📚 Continue Reading

- **[Why you want a database that scales to zero:](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero)** scale to zero sometimes gets a bad rep when talking about databases, but it is actually an incredibly helpful feature to lower cloud costs.
- **[Autoscaling in review:](https://neon.tech/blog/1-year-of-autoscaling-postgres-at-neon)** Neon can autoscale your Postgres instance without dropping connections or interrupting your queries, avoiding the need for overprovisioning or resizing manually.
- **[Architecture decisions in Neon:](https://neon.tech/blog/architecture-decisions-in-neon)** we’re building serverless Postgres by separating storage and compute and re-designing the storage engine from the ground up. The end goal: to improve the developer experience of building with Postgres.
