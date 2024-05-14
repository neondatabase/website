---
title: Anonymize sensitive data with Neosync
subtitle: Learn how to anonymize sensitive data stored in your Neon Postgres dfatabase with Neosync 
enableTableOfContents: true
---

[Neosync](https://www.neosync.dev/) is an open-source synthetic data orchestration platform that can create anonymized or synthetic data and sync it across all of your neon environments for better security, privacy and development.

In this guide, we'll show you how to anonymize sensitive data in your Neon database with synthetic data for testing and rapid development using the Neosync platform.

## Prerequisites

To complete the steps in the guide, you require the following:

- A Neon account and project. If you do not have those, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- A [Neosync](https://www.neosync.dev/) account.

## Neon setup

In Neon, we'll set up two databases. One will act as the source database and the other as the destimation database. We'll then add a database schema to the source database.

### Create the source and destination databases

Neosync requires two separate databases to show data syncing from a source to a destination.

To create a source database, which we'll call `neosync-source`, perform the following steps:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select your project.
1. Select **Databases** from the sidebar.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter a database name (`neosync-source`), and select a database owner.
1. Click **Create**.

Now, follow the same steps to create a destination database, which we'll call `neonsync-destination`.

### Create your schema

## Neosync setup