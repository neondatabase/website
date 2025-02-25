---
title: Neon for Development and Testing
subtitle: Boost developer productivity with Neon—a flexible development sandbox for running non-production workloads.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
image: '/images/social-previews/use-cases/dev-test.jpg'
---

![Dev/Test branching](/use-cases/dev-test-branching.jpg)

<Admonition type="note" title="TL;DR">
Database branching is a game-changer for dev/test environments: there's no need to manage seed data, keep environments in sync, or wait for instances to be available. What you get: more developer velocity with +75% less costs.
- You can use Neon for your ephemeral environments even when production lives somewhere else:  
  - You keep your production DB in your current Postgres
  - You "move" your non-prod environments to Neon (i.e. by syncing a subset of data daily)
  - To build / test / debug in Neon
  - Once the changes are tested, you apply them back to prod
Try this workflow in Neon right away ([we have a Free plan](https://console.neon.tech/signup)). Follow the steps [in this guide](https://neon.tech/docs/use-cases/dev-test) to set things up.
</Admonition>

## Ephemeral Environments Are Inefficient in Traditional Postgres

---

<TestimonialsWrapper>

<Testimonial
className="!mt-0"
text="Getting realistic data into our verification environments was largely unfeasible, it was time-consuming, expensive, and a beast to maintain. You need to process hefty backups, transfer costs stack up, and there’s a lot of manual oversight required just to move that data."
author={{
  name: 'Jonathan Reyes',
  company: 'Principal Engineer at Dispatch',
}}
url="/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora"
/>

<Testimonial
className="!mt-0"
text="When we were using RDS, we had trouble keeping the same environment on my computer, my developer’s environment, and production."
author={{
  name: 'Léonard Henriquez',
  company: 'Co-founder and CTO, Topo.io',
}}
url="/blog/why-topo-io-switched-from-amazon-rds-to-neon"
/>

<Testimonial
className="!mt-0"
text="RDS becomes a bottleneck if you don’t have full-time DevOps dedicated to it."
author={{
  name: 'Joey Teunissen',
  company: 'CTO at OpusFlow',
}}
url="/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers"
/>

</TestimonialsWrapper>

**Provisioning instances is slow. Once they're live, you have to babysit them**. New instances have to be configured, they take a while to be available, and once running, they need constant oversight to ensure they are appropriately sized and ready.

**You pay for non-prod instances 24/7 even if you only use them for a few hours**. Production databases stay on 24/7, but this is not the case for dev/test instances. But in RDS/Aurora, unless you manually pause them, you’ll keep paying even if they're not running.

**It's hard to keep data in sync across environments**. Syncing data across many instances requires repetitive, manual work. This leads to discrepancies that compromise test reliability and slow down deployments.

**These problems get worse over time, not better**. As your number of instances grows, the manual setup and configuration work grows too.

![Persistent environments in AWS RDS](/use-cases/aws-rds-environments.jpg)

## Use Neon Branches For Your Dev/Test Workflows

---

<TestimonialsWrapper>

<Testimonial
text="Developers already face significant delays when working on a PR—running CI tests, ensuring everything is ready for preview, it all adds up. Time to launch is crucial for us: when we tried Neon and saw that spinning up a new branch takes seconds, we were blown away"
author={{
  name: 'Alex Co',
  company: 'Head of Platform Engineering at Mindvalley',
}}
url="/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches"
/>

<Testimonial
text="Neon’s branching paradigm has been great for us. It lets us create isolated environments without having to move huge amounts of data around. This has lightened the load on our ops team, now it’s effortless to spin up entire environments."
author={{
  name: 'Jonathan Reyes',
  company: 'Principal Engineer at Dispatch',
}}
url="/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora"
/>

</TestimonialsWrapper>

We get it—migrating a production database is a big project, but you can still improve your non-pod experience by moving your dev/test environments to Neon.

### Why should I move my dev databases to Neon?

Neon is a Postgres provider that offers a much more modern developer experience than databases like RDS. We’ve built a serverless platform for Postgres focused on helping you ship faster instead of being held back by database management. As the cherry on top, you’ll save money.

### Why it’s faster (and more affordable) to do dev/test in Neon?

1. **Instant provisioning**. In Neon, it takes seconds to spin up new Postgres instances. Developers can start coding and testing immediately, no waiting time.
2. **Database branching for ephemeral environments**. Neon's copy-on-write branching allows devs to create full copies of their testing dataset instantly and without consuming extra storage. This eliminates the operational load that comes with keeping testing data in sync across environments: In Neon, you can sync data with parent in one click. Branches are also extremely affordable.
3. **Non-prod environments are automatically paused when unused**. If a database branch is idle, Neon pauses it automatically to save costs (and management work).
4. **Intuitive DX with CI/CD integration**. Neon comes with a modern interface and APIs (no need to waste time navigating AWS obscurities). You can add Neon to your CI/CD pipelines to automate branch creation /deletion.

![Ephemeral environments in Neon](/use-cases/ephemeral-environments.jpg)

### How does it work?

Here's how you'll go about it:

1. **Set up a single Neon Project for dev/test**. Many non-prod instances can be substituted by a single Neon project.
2. **Sync testing data to the main branch**. Load data from your staging database / testing data into the main branch within the Neon project. This main branch acts as the primary source for all dev/test environments, and it's the only place you need to update with new data or schema changes.
3. **Creating ephemeral environments as child branches**. To instantly create ephemeral environments, derive child branches from the main branch. These branches are fully isolated resource-wise and provide you a full copy of the testing dataset. They can then be synced with the main branch with just one click, ensuring they always have the latest data while saving you the work of loading testing datasets to every single environment.
4. **Automatic branch cleanup and scale to zero**. After development or testing is complete, ephemeral branches can be deleted automatically via the API. Neon's scale to zero automatically pauses these environments when unused, so you don't have to worry too much about them.

### How much cost savings have you seen vs RDS/Aurora?

By leveraging Neon's shared storage and compute autoscaling, it’s not rare to see **customers lowering their non-production database costs by 75% or more**. You only pay for the compute you actually use—no more bloating in your bill. The same goes for data redundancies—they’re also avoided.

### Show me a real use case example

**Non-prod deployment in AWS RDS (us-east-1):**

- 10 development and test instances (db.m5.large: 2 vCPUs, 8 GB RAM) with 50 GB storage allocated in each instance
- They’re active 4 hours/day on average
- RDS monthly costs: $1,356.90
  - Compute costs: $0.178/hour \* 730 hours \* 10 instances = $1,299.40 /month
  - Storage costs: 50 GB \* $0.115 GB-month \* 10 instances = $57.50

**Equivalent non-prod deployment in Neon:**

- [Scale pricing plan](/pricing): $69 /month
- Includes 50 GB of storage - 1,000 projects - 500 branches per project
- Plus 750 compute hours, additional compute hours billed at $0.16 per CU
- **Neon monthly costs: $338.12**
  - Compute hours per branch per month: 2 CU \* 4 hours \* 30.4 days/month = 243.2
  - Total compute hours: 243.2 \* 10 branches = 2432
  - Cost of additional compute hours: [2432 - 750] \* $0.16 = $269.12 /month

In this case, migrating non-production environments from AWS RDS to Neon meant 75% cost savings.

<ComputeCalculator
className="mt-10"
databases={[
{
type: 'Dev databases',
instance: 'db.t4g.micro',
usage: 'Used interminently',
},
{
type: 'Test databases',
instance: 'db.t3.medium',
usage: 'Used interminently',
},
]}
inputParamsBlock={[
{
title: 'Deployment',
items: [
{
name: 'test_databases_num',
title: 'Number of test databases',
values: [1, 3, 5, 10],
},
{
name: 'dev_databases_num',
title: 'Number of dev databases',
values: [1, 3, 5, 10],
},
],
},
{
title: 'Usage',
items: [
{
name: 'test_databases_daily_hrs',
title: 'How many hrs/day are test databases&nbsp;running?',
values: [1, 2, 3, 5, 8],
},
{
name: 'dev_databases_daily_hrs',
title: 'How many hrs/day are dev databases&nbsp;running?',
values: [1, 2, 3, 5, 8],
},
],
},
]}
values={[
{
name: 'wasted_money',
title: 'Dollars overpaid',
valueClassName: 'bg-variable-value-1',
period: 'month',
},
{
name: 'saved_money',
title: 'Bill that could be saved',
period: 'month',
valueClassName: 'bg-variable-value-2',
text: 'With scale to zero',
},
]}
textSize="md"
/>

<CTA title="Reach out to us for an exact quote" description="Tell us more about your use case and we’ll send you back detailed information on how much you could save with Neon." buttonText="Contact us" buttonUrl="/contact-sales" />

### Can Neon also help lower the costs of my production database?

Yes. Overprovisioning is a big problem—we see this daily while talking to customers. If you suspect this is you, Neon can help: [autoscaling](/docs/introduction/autoscaling) is a powerful weapon against overprovisioning and the unnecessarily high costs it causes for production databases. [Read more about it here](/blog/neon-autoscaling-is-generally-available#why-autoscaling), and don’t hesitate to ask us about the migration assistance we offer. **We not only help you move production safely but also waive all migration-related fees.**

<TestimonialsWrapper>
  
<Testimonial
text="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS."
author={{
  name: 'Cody Jenkins',
  company: 'Head of Engineering at Invenco',
}}
/>

<Testimonial
text="We had to overprovision Aurora to handle our spiky traffic, and even then, the writer database would get overwhelmed. We provision 10x more than we need on average to keep things running smoothly."
author={{
  name: 'Jonathan Reyes',
  company: 'Principal Engineer at Dispatch',
}}
url="/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora"
/>

</TestimonialsWrapper>

## Get Started in Two Steps

- **1. Create a Neon account**. Sign up for our Free Plan [here](https://console.neon.tech/signup) (no credit card required).
- **2. Explore our guide in docs.** [Follow these steps](https://neon.tech/docs/use-cases/dev-test) help you get started.

---

<Admonition type="note" title="Get $100 in credits">
Neon offers a Free Plan, and we’ll discount up to $100 off your first invoice when you upgrade. Claim the offer by signing up through [this link](https://fyi.neon.tech/credits).
</Admonition>

---

<CTA title="Got Questions? Reach out" description="There's no one size fits all with ephemeral environments - but we’re here to help you set things up. We can also discuss pricing options, annual contracts, and migration assistance." buttonText="Book a meeting with a Solutions Engineer" buttonUrl="/contact-sales" buttonClassName="xs:text-xs xs:whitespace-normal" theme="column" />
