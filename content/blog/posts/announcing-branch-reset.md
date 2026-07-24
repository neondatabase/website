---
title: Announcing Branch Reset
description: Pull the latest data and schema from a parent branch
excerpt: >-
  One of the benefits of Neon’s serverless architecture, which sets it apart
  from other Postgres providers, is its database branching capabilities. Neon’s
  database branching allows you to create an instant copy-on-write clone of your
  data (a child branch) that you can modify withou...
date: '2023-12-14T12:35:03'
updatedOn: '2024-03-27T11:26:53'
category: product
categories:
  - product
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-branch-reset/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Announcing Branch Reset - Neon
  description: Pull the latest data and schema from a parent branch
  keywords: []
  noindex: false
  ogTitle: Announcing Branch Reset - Neon
  ogDescription: >-
    One of the benefits of Neon’s serverless architecture, which sets it apart
    from other Postgres providers, is its database branching capabilities.
    Neon’s database branching allows you to create an instant copy-on-write
    clone of your data (a child branch) that you can modify without compromising
    your main data (parent branch). You can use it to manage […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-branch-reset/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-branch-reset/neon-database-branch-reset1-1024x576-22acba36.jpg)

One of the benefits of Neon’s serverless architecture, which sets it apart from other Postgres providers, is its database branching capabilities.

Neon’s [database branching](https://neon.tech/docs/introduction/branching#what-is-a-branch) allows you to create an instant copy-on-write clone of your data (a child branch) that you can modify without compromising your main data (parent branch). You can use it to manage your database environments, for development purposes, or incorporate it into your CI/CD pipeline using the [Neon API](https://neon.tech/docs/reference/api-reference) or [CLI](https://neon.tech/docs/reference/cli-install).

Today, we are announcing the release of our newest feature for your developer workflows: branch reset.

## Streamline your development workflows with Branch Reset

Imagine you’re working on a new feature in a development branch of your database. While you’re busy coding, one of your teammates merges a pull request that includes critical schema changes. This is where Neon’s branch reset feature comes into play.

Branch reset functions much like a \`git reset –hard parent\` in traditional Git workflows. It allows you to seamlessly update your development branch with the latest schema and data from the main branch. This ensures that your work remains compatible with the most recent changes made by your team.

![Image](https://cdn.neonapi.io/public/images/pages/blog/announcing-branch-reset/image-4-1024x600-d909f0fd.png)

Here’s how it works in practice.

1. Suppose you have a project with the id=raspy-water-84552850. You can find the id associated with your project using the `neonclt projects list` command or in your project’s settings. You can create a new branch using the following command:

```bash
neonctl branches create --project-id=raspy-water-84552850
```

Output:

```bash
┌──────────────────────────┬──────────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                       │ Name                     │ Primary │ Created At           │ Updated At           │
├──────────────────────────┼──────────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-divine-glade-19837478 │ br-divine-glade-19837478 │ false   │ 2023-12-13T16:14:56Z │ 2023-12-13T16:14:56Z │
└──────────────────────────┴──────────────────────────┴─────────┴──────────────────────┴──────────────────────┘
endpoints
┌─────────────────────────┬──────────────────────┐
│ Id                      │ Created At           │
├─────────────────────────┼──────────────────────┤
│ ep-winter-hall-10626581 │ 2023-12-13T16:14:56Z │
└─────────────────────────┴──────────────────────┘
connection_uris
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Connection Uri                                                                             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ postgres://<USERNAME>:<PASSWORD>@ep-winter-hall-10626581.us-east-2.aws.neon.tech/neondb │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

Notice that output contains the branch id `br-divine-glade-19837478`. You can always find your branch-id using `neonctl branches list` command like so:

```bash
neonctl branches list --project-id=raspy-water-84552850
```

Output:

```bash
┌────────────────────────────┬──────────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                         │ Name                     │ Primary │ Created At           │ Updated At           │
├────────────────────────────┼──────────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-divine-glade-19837478   │ br-divine-glade-19837478 │ false   │ 2023-12-13T16:14:56Z │ 2023-12-14T11:16:04Z │
├────────────────────────────┼──────────────────────────┼─────────┼──────────────────────┼──────────────────────┤
```

2. You can then instantly align your branch with the latest version of the main branch using the following command in the CLI: `neonctl branches reset <branch-id|name> --parent`. For example:

```bash
neonctl branches reset br-divine-glade-19837478 --parent --project-id=raspy-water-84552850
```

Output:

```bash
┌──────────────────────────┬──────────────────────────┬─────────┬──────────────────────┬──────────────────────┐
│ Id                       │ Name                     │ Primary │ Created At           │ Last Reset At        │
├──────────────────────────┼──────────────────────────┼─────────┼──────────────────────┼──────────────────────┤
│ br-divine-glade-19837478 │ br-divine-glade-19837478 │ false   │ 2023-12-13T16:14:56Z │ 2023-12-14T11:16:03Z │
└──────────────────────────┴──────────────────────────┴─────────┴──────────────────────┴──────────────────────┘
```

The reset process fetches the latest data and schema from the parent branch, integrating them into your current branch.

## Limitations

The reset process fetches the latest data and schema from the parent branch, integrating them into your current branch. However, it’s essential to be aware of certain limitations.

The reset operation is a complete overwrite, meaning any local changes in your branch will be lost. Also, while the reset is in progress, database connections will be temporarily interrupted, though they will automatically re-establish once the reset is completed.

By leveraging the branch reset feature, you can ensure that your development efforts are always in sync with your team’s progress, leading to a more efficient and collaborative development process.<br />We encourage you to log in or [create a Neon account](https://console.neon.tech/login) to explore the branch reset feature and see how it can transform your development process. [Read more about branch reset in the docs](https://neon.tech/docs/manage/branches#reset-a-branch-from-parent) and share your feedback. Join our [Discord](https://neon.tech/discord) and tell us what you think.
