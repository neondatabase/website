---
title: Neon Read Replicas
subtitle: Scale your app, run ad-hoc queries, and provide read-only access without
  duplicating data
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.071Z'
---

Neon read replicas are independent computes designed to perform read operations on the same data as your primary read-write compute. Neon's read replicas do not replicate or duplicate data. Instead, read requests are served from the same storage, as shown in the diagram below. While your read-write queries are directed through your primary compute, read queries can be offloaded to one or more read replicas.

![read replica simple](/docs/introduction/read_replica_simple.png)

You can instantly create read replicas for any branch in your Neon project and configure the amount of vCPU and memory allocated to each. Read replicas also support Neon's [Autoscaling](/docs/introduction/autoscaling) and [Autosuspend](/docs/introduction/auto-suspend) features, providing you with the same control over compute resources that you have with your primary compute.

## How are Neon read replicas different?

- **No additional storage is required**: With read replicas reading from the same source as your primary read-write compute, no additional storage is required to create a read replica. Data is neither duplicated nor replicated. Creating a read replica involves spinning up a read-only compute instance, which takes a few seconds.
- **You can create them almost instantly**: With no data replication required, you can create read replicas almost instantly.
- **They are cost-efficient**: With no additional storage or transfer of data, costs associated with storage and data transfer are avoided. Neon's read replicas also benefit from Neon's [Autoscaling](/docs/introduction/autoscaling) and [Autosuspend](/docs/manage/endpoints#auto-suspend-configuration) features, which allow you to manage compute usage.
- **They are instantly available**: You can allow read replicas to scale to zero when not in use without introducing lag. When a read replica starts up in response to a query, it is up to date with your primary read-write compute almost instantly.

## How do you create read replicas?

You can create read replicas using the Neon Console, [Neon CLI](/docs/reference/neon-cli), or [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), providing the flexibility required to integrate read replicas into your workflow or CI/CD processes.

From the Neon Console, it's a simple **Add Read Replica** action on a branch.

<Admonition type="note">
You can add as many read replicas to a branch as you need, accommodating any scale.
</Admonition>

![Create a read replica](/docs/introduction/create_read_replica.png)

From the CLI or API:

<CodeTabs labels={["CLI", "API"]}>

```bash
neon branches add-compute mybranch --type read_only
```

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/late-bar-27572981/endpoints \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "endpoint": {
    "type": "read_only",
    "branch_id": "br-young-fire-15282225"
  }
}
' | jq
```

</CodeTabs>

For more details and how to connect to a read replica, see [Create and manage Read Replicas](/docs/guides/read-replica-guide).

## Read Replica architecture

The following diagram shows how your primary compute and read replicas send read requests to the same Pageserver, which is the component of the [Neon architecture](/docs/introduction/architecture-overview) that is responsible for serving read requests.

![read replica computes](/docs/introduction/read_replicas.jpg)

Neon read replicas are asynchronous, which means they are _eventually consistent_. As updates are made by your primary compute, Safekeepers store the data changes durably until they are processed by Pageservers. At the same time, Safekeepers keep read replica computes up to date with the most recent changes to maintain data consistency.

Neon supports creating read replicas in the same region as your database. Cross-region read replicas are currently not supported.

## Use cases

Neon's read replicas have a number of applications:

- **Horizontal scaling**: Scale your application by distributing read requests across replicas to improve performance and increase throughput.
- **Analytics queries**: Offloading resource-intensive analytics and reporting workloads to reduce load on the primary compute.
- **Read-only access**: Granting read-only access to users or applications that don't require write permissions.

## Get started with read replicas

To get started with read replicas, refer to our guides:

<DetailIconCards>

<a href="/docs/guides/read-replica-guide" description="Learn how to create, connect to, configure, delete, and monitor read replicas" icon="ladder">Create and manage Read Replicas</a>

<a href="/docs/guides/read-replica-integrations" description="Scale your app with read replicas using built-in framework support" icon="scale-up">Scale your app with Read Replicas</a>

<a href="/docs/guides/read-replica-data-analysis" description="Leverage read replicas for running data-intensive analytics queries" icon="chart-bar">Run analytics queries with Read Replicas</a>

<a href="/docs/guides/read-replica-adhoc-queries" description="Leverage read replicas for running ad-hoc queries" icon="queries">Run ad-hoc queries with Read Replicas</a>

<a href="/docs/guides/read-only-access-read-replicas" description="Leverage read replicas to provide read-only access to your data" icon="screen">Provide read-only access with Read Replicas</a>

</DetailIconCards>
