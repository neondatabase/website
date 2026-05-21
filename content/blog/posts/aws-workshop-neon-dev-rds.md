---
title: Learn How to Use Neon with AWS RDS to Boost Development Velocity in Postgres
description: AWS Workshop is out
excerpt: >-
  AWS workshops are a fantastic free resource created by the AWS team to help
  you tackle real-world challenges using AWS infrastructure. As an AWS Partner,
  we’ll be launching an AWS workshop to teach you how to use Neon as a
  development environment while keeping production workload...
date: "2025-01-29T18:01:36"
updatedOn: "2025-03-16T19:49:28"
category: workflows
categories:
  - workflows
authors:
  - savannah-longoria
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/aws-workshop-neon-dev-rds/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Learn How to Use Neon with AWS RDS to Boost Development Velocity in Postgres
    - Neon
  description: >-
    In this AWS Workshop, learn to use Neon as a dev environment for AWS RDS,
    and improving your workflows without complex production migrations.
  keywords: []
  noindex: false
  ogTitle: >-
    Learn How to Use Neon with AWS RDS to Boost Development Velocity in Postgres
    - Neon
  ogDescription: >-
    In this AWS Workshop, learn to use Neon as a dev environment for AWS RDS,
    and improving your workflows without complex production migrations.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/aws-workshop-neon-dev-rds/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/aws-workshop-neon-dev-rds/neon-aws-workshops-1024x576-5cc6169e.jpg)

[AWS workshops](https://workshops.aws/) are a fantastic free resource created by the AWS team to help you tackle real-world challenges using AWS infrastructure. As an AWS Partner, we’ll be launching an AWS workshop to teach you **how to use Neon as a development environment while keeping production workloads on AWS RDS:**

<figure>
<video autoPlay playsInline muted loop width="1592" height="1080" src="https://cdn.neonapi.io/public/videos/pages/blog/aws-workshop-neon-dev-rds/aws-workshop-1-50fce327.mp4"></video>
</figure>

You can follow the guided workshop here: [https://neon.awsworkshop.io/](https://neon.awsworkshop.io/)

_Tip: Make sure to login to your AWS account to be able to see the content!_

## Why use Neon as a development environment for AWS RDS

<blockquote>
<p><strong>“Neon’s branching paradigm has been great for us. It lets us create isolated environments without having to move huge amounts of data around. This has lightened the load on our ops team, now it’s effortless to spin up entire environments.”</strong> <em>(Jonathan Reyes, Principal Engineer at <a href="https://www.dispatchit.com">Dispatch</a>)</em></p>
</blockquote>

Teams love using [Neon](https://neon.tech/use-cases/dev-test) as a development environment because it reduces operational overhead, boosting productivity. Since it’s 100% Postgres, it integrates perfectly with AWS RDS, giving teams a superior development experience for their development and testing pipelines without forcing them into hairy production migrations. On top of it, using Neon can also help you reduce your monthly bill.

If you’re an AWS RDS user but have never heard of Neon, here’s how it can help you:

### Ephemeral environments provisioned instantly

Neon supports **database branching with data and schema**, which is a game-changer for deploying environments. Instead of manually maintaining development and testing instances and struggling to keep them up to date with production, you can spin up ephemeral database environments in seconds—complete with an up-to-date copy of schema and data.

### No more issues caused by lack of data consistency

This agility allows you to **automate environment creation** via CI/CD pipelines. For example, you can:

- Create ephemeral environments for every pull request.
- Run tests in isolated environments.
- Discard environments as soon as tasks are complete.

Need to sync an environment with the latest production state? It’s as simple as making one API call in Neon.

### Easy team collaboration without production risks

Neon serves as the perfect development sandbox for teams, with each process or developer having their own independent environment. **Each environment is a dedicated database branch in Neon**, complete with its own compute resources, and hundreds of branches can be active in parallel. This setup allows teams to safely experiment, run migrations, or test changes without the risk of disrupting production or interfering with one another’s work.

### Scale-to-zero saves costs

Neon environments automatically **scale-to-zero when idle**, pausing to eliminate unnecessary compute costs. When you need them again, they wake up with a fast cold start of under 1 second.

## What you’ll learn in the AWS RDS and Neon workshop

<blockquote>
<p><strong>“We are using the Neon Twin workflow. We just install the GitHub action and it takes care of the rest. Developers may not know how to dump and restore well, but they know how to run a GitHub Action. It’s amazing”</strong><em><strong> </strong>(Alex Co, Head of Platform Engineering at <a href="https://www.mindvalley.com">Mindvalley</a>)</em></p>
</blockquote>

![Image](https://cdn.neonapi.io/public/images/pages/blog/aws-workshop-neon-dev-rds/ad4nxf6bpj5umoaunoxg5g8kb6vmbxybdgt9gwozcby7tqadm2z7r3dbymetcjozk-owjj-hcxkiipqqdjmecpvx9imgmhcovkidmfoerkbywfv2i28acek3thqwiih2qvdyztk6-a17ac5a4.png)

You may be wondering how it’s possible to implement this workflow without migrating from AWS RDS. That’s exactly what we’ll teach you how to do in the workshop.

We’ll cover all of this and more:

#### Introduction to Neon as a complement to RDS

For those of you unfamiliar with Neon, we’ll kick off the workshop by introducing you to its key features, focusing on how it enhances development workflows. You’ll also learn how to configure your first Neon project for integration with RDS.

#### How to set up a synchronized copy of your RDS database in Neon (a Neon Twin)

A Neon Twin is an isolated, up-to-date replica of your RDS database, designed specifically for development and testing in Neon. You’ll learn how to automate the creation of this synchronized copy using tools like pg_dump and pg_restore.

#### Automate synchronization of environments with production

To ensure your Neon Twin stays current with your production RDS database, we’ll teach you how to automate synchronization workflows. Using GitHub Actions, you’ll configure nightly backups to keep your development environments consistently in sync, without manual effort.

#### Set up environments as database branches

Once your Neon Twin is ready, you’ll learn how to use Neon’s database branching to create multiple isolated environments. This allows for parallel development, enabling team members or CI/CD pipelines to work independently without impacting the main database or each other’s branches.

#### Best practices

We’ll wrap up the workshop by sharing best practices for setting up efficient workflows. You’ll learn tricks for parallel development and how to keep your environments responsive and cost-effective.

## Get started

The workshop is live here: [https://neon.awsworkshop.io/](https://neon.awsworkshop.io/)

We’re planning to expand it with many more scenarios. If there’s something you’d like to see covered, [tell us.](https://neon.tech/contact-sales)
