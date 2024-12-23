---
title: 'Mastering Database Branching Workflows'
subtitle: Ship software faster using Neon branches as ephemeral environments
enableTableOfContents: true
updatedOn: '2024-12-21T09:00:00.000Z'
---

## Traditional database workflows are broken

Modern developer tooling keeps shortening the software lifecycle—but the database is still the bottleneck for many teams. Way too much engineering time is wasted in these tasks still today:

- **Maintaining seed files.** Keeping seed data up to date across all environments is a pain that every production team has experienced. Any schema or data change forces manual updates to seed files. This maintenance overhead increasingly grows, distracting engineers from the actual release.
- **Manually setting up and resetting environments.** End-to-end testing requires clean, isolated environments. Traditional workflows—i.e. spinning up new database instances, manually importing seed data into all of them—create delays in the testing pipeline.
- **Managing shared development instances.** Having multiple developers share the same instance for dev is problematic due to conflicting changes or overwritten test data. To avoid this, teams end up creating many dev instances. The larger the team, the more of a time sink it is to manage this growing deployment.

## How Neon reimagines them

To fix this broken system, we propose rethinking database workflows. Instead of using separate, long-lived development instances, we embrace the concept of **ephemeral environments**—environments that are by default short-lived, instantly deployable, active only when being used, and programmatically created or deleted.

These ephemeral environments replicate an exact copy of both the schema and data from a parent environment. Teams can concentrate on managing this single parent environment while easily spinning up many ephemeral environments from it, without needing manual maintenance.

How do you do it? With [Neon branches](https://neon.tech/docs/introduction/branching).

## Turning Neon branches into ephemeral environments

A Neon branch is a lightweight, copy-on-write clone of your database. It acts as an isolated, fully functional replica of the parent, including both schema and data, without requiring a full duplication of the underlying storage.

Here’s how branches work:

- **Copy-on-write.** When developers create a branch, Neon doesn’t duplicate the entire database. Instead, it references the same data pages as the parent environment. Only when a modification is made to the branch does Neon write a new copy of the changed data.
- **Instant.** Because branches leverage the copy-on-write mechanism, they can be spun up in seconds, even for very large datasets. There’s no need to wait for lengthy data exports, imports, or replication setups.
- **Ephemeral by design.** Neon branches are designed to be temporary. They can be created for a specific purpose—such as a development task, a test run, or staging for a deployment—and deleted once the task is complete. By default, the compute endpoint attached to them scales to zero.
- **One-click reset.** Branches can be reset to match the parent environment instantaneously. With just a single click (or an API call), the branch discards all changes and reverts to the exact state of the parent. Having a clean slate for testing or development takes no effort. Only the parent needs to be maintained.

<Testimonial
text="We’re a small team, but we’re scaling quickly and doing a lot. We’re shipping multiple times a day—to do that, we need to test stuff quickly and merge to main very quickly as well. Neon branches are a game changer for this."
author={{
  name: 'Avi Romanoff',
  company: 'Founder at Magic Circle',
  }}
/>

<Testimonial
text="Neon’s branching paradigm has been great for us. It lets us create isolated environments without having to move huge amounts of data around. This has lightened the load on our ops team, now it’s effortless to spin up entire environments."
author={{
  name: 'Jonathan Reyes',
  company: 'Principal Engineer at Dispatch',
  }}
/>

<Testimonial
text="Developers already face significant delays when working on a PR—running CI tests, ensuring everything is ready for preview, it all adds up. Time to launch is crucial for us: when we tried Neon and saw that spinning up a new branch takes seconds, we were blown away."
author={{
  name: 'Alex Co',
  company: 'Head of Platform Engineering at Mindvalley',
  }}
/>

<CTA title="Launch a branching demo" description="See how it takes <500 ms to create environments preloaded with 1 TB " buttonText="Start" buttonUrl="https://fyi.neon.tech/branching" />

## Examples of database branching workflows you can implement

The concept of database branching is new, and it takes a while to get used to. To help you visualize how it can be achieved in practice, we’ll cover three initial workflows:

### Preview Environment Workflow: One Database Branch per Preview

Each time a developer creates a pull request, Neon can generate a database branch that pairs with your preview deployment automatically, for example with Vercel previews.

How it works:

- The preview environment uses the preview branch, reflecting the same state as production at the moment the branch was created.
- When the PR is closed, the branch is discarded.

Why it’s better than the traditional workflow:

- You get isolated and consistent testing environments for each pull request
- Any schema changes in production can be reflected in a new preview without the need to manually updating any database
- Bugs and errors are catched early because you’re testing on real data, not a mock

### Dev/Test Workflow (or Neon Twin)

In this workflow, you use Neon branches to create isolated environments for development and testing, mirroring a production-like state from a production database hosted outside of Neon (e.g., Amazon RDS).

How it works:

- Teams regularly sync a subset of production data or a testing dataset into a Neon main branch (e.g. via nightly dump/restores)
- From this one branch, they create as many ephemeral environments as they need—e.g. to test features, run integration tests, or stage deployments
- Once the task is completed, branches are discarded

Why it’s better than the traditional workflow:

- Hundreds of ephemeral environments can be created instantaneously, complete with schema and data
- Everything can be automated via API, adding to existing CI/CD pipelines
- If environments need to be reset, it takes one API call

### Local Development Workflow: One Database Branch per Developer

In this workflow, you use database branching to create personalized development environments for every developer on a team.

How it works:

- Each developer gets their own database branch, which is essentially a isolated copy of the main dataset

Why it’s better than the traditional workflow:

- Developers can work with realistic data sets instead of mocked or outdated seed files
- Every developer has a fully independent environment, free from concurrency issues or conflicts, without needing to spin up a separate instance

## Preview Environment Workflow

To implement this workflow, follow the steps [in this guide.](https://neon.tech/docs/guides/vercel-previews-integration) The process looks like this:

1. Install the `Neon <> Vercel` integration
   - In the Neon Console, navigate to the Integrations section and select the Vercel integration
   - Click Add from Vercel to initiate the installation process
   - Follow the prompts to link your Neon account with your Vercel project
2. Configure the integration
   - During setup, choose the Neon project, database, and role that Vercel will use to connect
   - Enable the creation of a development branch for your Vercel development environment
   - Enable automatic deletion of Neon branches when the corresponding Git branches are merged or deleted
3. Deploy preview environments
   - With the integration configured, each time you push commits to a new branch in your source code repository, Vercel triggers a preview deployment
   - The integration automatically creates a corresponding database branch in Neon, named with the prefix `preview/` followed by your Git branch name
   - Vercel sets environment variables (`DATABASE_URL` and `DATABASE_URL_UNPOOLED`) to connect the preview deployment to the new Neon branch

## Dev/Test Workflow (Neon Twin)

[This guide](https://neon.tech/docs/use-cases/dev-test) will give you information on how to implement the Dev/Test workflow. The process changes slightly from team to team, but it looks like this:

1. Set up a Neon Project for your dev/test environments
   - Create a new project in the Neon Console, and name it appropriately (e.g., "Dev/Test Environments")
2. Create a Neon Twin
   - Establish a synchronized copy of your production or staging database (or a subset of it) within Neon’s main branch—which we call Neon Twin. This serves as the primary source for all your development and testing environments
   - Automate data synchronization using tools like `pg_dump/restore` or AWS DMS, scheduling regular updates (e.g., nightly) to keep the Neon Twin current.
3. Set up ephemeral environments as child branches
   - Create isolated child branches from the main branch for every individual development or testing tasks. This can be automated into your CI/CD pipelines via the Neon API.
4. Delete/reset branches
   - After completing development or testing, delete the child branches to conserve resources. This can be automatically set up. Environments can also be sync with the latest data and schema from the main branch instantaneously via an API call

## Local Development Workflow

To implement a local development workflow with a database branch per developer, follow these steps:

1. [Download the Neon CLI](/docs/reference/neon-cli#install).
2. Connect your Neon account:

   ```bash
   neonctl auth
   ```

3. Create a database branch for each developer:

   ```bash
   neonctl branches create --name dev/developer_name
   ```

4. Get the connection string for the Neon database branch:

   ```bash
   neonctl connection-string dev/developer_name
   ```

5. Optionally, reset the development branch to the current state of `main` (data and schema).

   ```bash
   neonctl branches reset  dev/developer_name --parent
   ```

   This step is useful when you want to discard the changes in your existing dev branch and start fresh with dev branch that reflects the current state of the parent's data and schema.

## This is only the beginning

The workflows described here are examples already popular among our users. We have ambitious plans to expand on them, such as incorporating anonymization of Personally Identifiable Information (PII). If you’d like to participate by providing feedback or testing a prototype, [reach out to us](https://neon.tech/contact-sales).

[See more branching workflows in the wild →](https://neon.tech/case-studies)
