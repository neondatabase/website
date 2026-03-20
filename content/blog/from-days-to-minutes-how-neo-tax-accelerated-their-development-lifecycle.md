---
title: 'From days to minutes: how Neo.Tax accelerated their development lifecycle'
description: The team is much more agile now that they can use database branches
excerpt: >-
  “Database branching is the best quality-of-life improvement to my tech stack
  that I can think of in recent years. Second to maybe only Copilot” Miguel
  Hernandez, Backend Tech Lead at Neo.Tax Neo.Tax specializes in automating the
  calculation of tax credits for startups, enterprise...
date: '2024-06-03T16:40:27'
updatedOn: '2024-06-03T16:40:29'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    From days to minutes: how Neo.Tax accelerated their development lifecycle -
    Neon
  description: >-
    By adopting database branches in Neon, they could speed up their end-to-end
    testing process and start fixing bugs quickly.
  keywords: []
  noindex: false
  ogTitle: >-
    From days to minutes: how Neo.Tax accelerated their development lifecycle -
    Neon
  ogDescription: >-
    By adopting database branches in Neon, they could speed up their end-to-end
    testing process and start fixing bugs quickly.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle/social.jpg
source:
  wpId: 6149
  wpSlug: from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle/neon-neotax-1-1-1024x576-cee0d102.jpg)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>“Database branching is the best quality-of-life improvement to my tech stack that I can think of in recent years. Second to maybe only Copilot”</strong></p>
<cite>Miguel Hernandez, Backend Tech Lead at Neo.Tax</cite>
</blockquote>

[Neo.Tax](https://www.neo.tax/) specializes in automating the calculation of tax credits for startups, enterprises, and mid-market companies through the use of AI and machine learning. With a team armed with previous experience at Intuit and the IRS, Neo.Tax is inspired to make it simple for businesses to uncover (and claim!) valuable tax advantages, maximizing potential savings with 100% accuracy and security.

![Image](https://cdn.neonapi.io/public/images/pages/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle/9p2vksgvwnhnoylqoztuuxxg3ukspwggfpwhv25k7wbrcmuh6qeq0l-1ppxxlj8tg440bg9fj-rfablhebxwu8rpwwicza0xgptaoitbn38aeugl3jw9ukfp4v03o0owmnwalm2iqjzzabbelj0fm-db69dca2.png)

## E2E testing with accurate data is hard

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“Our testing process was very manual before. Product would create a test customer in our development environment, then generate PDFs; the QA team would test and manually run through all the math; then an engineer would have to go into the database, look at all the values, and handwrite them into fixtures for our end-to-end tests… That’s multiple days for every single change”</p>
<cite>Miguel Hernandez, Backend Tech Lead at Neo.Tax</cite>
</blockquote>

One of the awesome things about the Neo.Tax platform is that it’s able to aggregate and analyze across many different sources: ticketing data, logs, GitHub pull requests, accounting expenses, payroll information… This is a manual process for most businesses that Neo.Tax automates. From this data, they calculate the most beneficial tax claims for every business.

To ensure the accuracy of their calculations, the team put a QA process in place that involves generating accurate previews of tax documents to validate any changes and new features. But pulling this off in a regular database is a laborious process, manual and time-consuming. Before Neon, this process looked something like this:

1. When a new feature or change needed to be added to the platform, the Product team would create a customer in the development environment, generate PDFs for testing, and then manually verify all calculations.
2. Then, engineers then had to transfer these verified values into fixtures for end-to-end tests. This involved performing SQL dumps and pushes to replicate the data produced by the Product team in a development enviroment.

## How database branching helps

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“Neon shortened the lifecycle for us between making a change in the product, validating it, and generating the PDFs we expect. Before, it used to be terrible: resetting your database, running migrations, all of that. With Neon, we just create a database branch, link it with the ticket, and use that URL in local development. This has significantly streamlined our end-to-end testing process”</p>
<cite>Miguel Hernandez, Backend Tech Lead at Neo.tax</cite>
</blockquote>

Now, Neo.Tax uses Neon to streamline this process. The big difference is this: with Neon, the team can create accurate [deploy previews](https://neon.tech/flow) by leveraging [database branching](https://neon.tech/docs/introduction/branching). Here’s how the new process works:

1. When a PR is open, Neo.Tax uses the [Neon CLI](https://neon.tech/docs/reference/neon-cli) to create a new branch from the development database. The branch name is associated with the GitHub branch name for consistency.
2. The new branch URL is injected into their Cloud Run instances via environment variables in CircleCI.
3. Product and QA teams can now perform manual and automatic tests using this isolated database branch. They can generate PDFs, compare data, and ensure all calculations are accurate.
4. When the PR is merged, the associated database branch is deleted.

## Using Neon branches to reproduce errors locally

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><strong>“Whenever we have an issue that we can’t solve, or need to pair with someone else, you can just send your URL for your Neon database, and they immediately have a reproducible problem”</strong></p>
<cite>Miguel Hernandez, Backend Tech Lead at Neo.tax</cite>
</blockquote>

The Neo.Tax team also takes advantage of another great application of database branches: fixing bugs. Instead of following the traditional process of creating database dumps and moving data to local machines, they now follow this process:

1. When a bug is identified, a branch is created from the production database. This branch is associated with a specific issue or ticket.
2. The branch URL is shared among developers, allowing them to work with the exact same data. This setup ensures that all developers have a consistent environment, making it easier to replicate and troubleshoot issues.
3. Developers work on the branch to fix the issue. Once the fix is implemented, it is validated in the same consistent environment.
4. If data becomes corrupted or needs to be reset for any reason, developers can simply reset the branch from the parent development branch. This takes one second.
5. Once the issue is fixed and the ticket is closed, the database branch is deleted.

This method is not only more convenient but also more secure, as it avoids the risks associated with handling sensitive data on local devices and ensures compliance with data security policies. It also allows Neo.Tax to avoid the complexity of resyncing data and mitigate variations that can be caused by LLMs, which can introduce inconsistencies in data processing.

## A note on Neon design: environments, branches, projects

Especially for those users already familiar with Neon [and its object hierarchy,](https://neon.tech/docs/manage/overview) you might be curious to know how Neo.Tax structured their Neon deployment. Here’s an overview:

**Environments**

Neo.Tax uses three primary environments, each one with its own separate [project](https://neon.tech/docs/manage/overview#projects) in Neon: development, staging, and production. Each of these projects has a main branch that serves as the base for creating other branches.

- `development` isused for day-to-day development tasks.
- `staging` acts as a middle ground where features and fixes from development are tested before being released to production.
- `production` is the live environment where the actual application runs.

**Branches**

Within each project, Neo.Tax creates branches for individual tasks, including:

- Feature development: developers branch off the main development branch to work on new features or bug fixes.
- Bug fixing: for bugs identified in production, branches are created from the production project and named after the associated ticket or issue.
- End-to-end testing: branches are created to generate deploy previews with pre-built accounts to ensure that calculations and document generation are accurate before merging changes into the main branch.
- Reproducible environments: when issues arise that require collaboration, developers can create branches from the main branch and share the branch URL. This allows other team members to work with the exact same data.

**Single / multi-tenancy**

In reality, Neo.Tax handles more than one production project:

- For most users, Neo.Tax uses a shared database with schema-based isolation. Authentication and authorization ensure data isolation within the same database.
- For their enterprise customers, who oftentimes need a dedicated tenant, Neo.Tax creates a separate project for that customer.

## Less is more

Database management and taxes have one thing in common: the less you have to do them, the better.

If you’re also struggling with your database workflows, [try out Neon](https://console.neon.tech/realms/prod-realm/protocol/openid-connect/registrations?client_id=neon-console&redirect_uri=https%3A%2F%2Fconsole.neon.tech%2Fauth%2Fkeycloak%2Fcallback&response_type=code&scope=openid+profile+email&state=9r-s37V5ewTKwMpF_bbqBQ%3D%3D%2C%2C%2C) and [experiment with database branches](https://neon.tech/flow). And if your startup could get some help with taxes (_and who doesn’t?_), [sign up for Neo.Tax for free](https://app.neo.tax/signup?_gl=1*r4t96k*_gcl_au*MTA1OTkxMDQ2Ny4xNzE2MjI4MTMy) and explore the platform.
