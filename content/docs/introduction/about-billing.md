---
title: Billing
enableTableOfContents: true
subtitle: Learn how Neon billing works to save you money
---

Find all the documentation you need to understand, manage, and reduce your monthly Neon bill.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)

## Pricing calculators and metrics

Start with our pricing calculators to get a sense of how different compute and storage sizes can affect your bill. Then get more detail about the underlying metrics.

<DetailIconCards>

<a href="/docs/introduction/billing-calculators" description="Our pricing calculator and cost estimator tools help you estimate your next Neon bill." icon="branching">Pricing calculators</a>

<a href="h/docs/introduction/billing-metrics" description="Find detailed descriptions of the metrics that make up your bill" icon="split-branch">Billing metrics</a>

</DetailIconCards>

## Reference

Read our sample billing page to see how costs accrue in a typical medium-sized organization. Get a detailed cost breakdown for compute and storage in your region.

<DetailIconCards>

<a href="/docs/introduction/billing-sample" description="See how billing breaks down for a sample project." icon="branching">Sample projects</a>

<a href="h/docs/introduction/billing-regions" description="Reference table of billing rates per region" icon="split-branch">Billing rates</a>

</DetailIconCards>

## Manage billing

Find information about invoices, payment methods, and other actions around viewing and managing your bill.

<DetailIconCards>

<a href="/docs/introduction/manage-billing" description="Manage your monthly bill." icon="branching">Manage billing</a>

</DetailIconCards>


---

Just as we separate storage from compute in our architecture, we separate storage from compute when calculating your bill.

<Tabs labels={["Compute", "Storage"]}>

<TabItem>
With key features like [autoscaling](), [autosuspend](), minimum and max [compute sizes]() all enabled, you can get a sense of how your compute costs might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)
</TabItem>

<TabItem>
Neon storage uses copy-on-write branching to keep storage size as small as possible. This can make it hard to visualize "how big is my database", since branches with a shared history don't immediately add to storage costs. Your storage size is a combination of the data itself and the change history that is used to enable features like x, y, z. Neon charges you by the hour based on the size of your project storage, using the following calcuation.

![Storage calculation](/docs/introduction/storage_calc.png)

</TabItem>
</Tabs>



