---
title: Integrate Neon Postgres with Sequelize ORM
subtitle: Set up Neon Postgres and run migrations for your Javascript project using Sequelize ORM
enableTableOfContents: true
updatedOn: '2024-03-06T10:15:00.000Z'
---

[Sequelize](https://sequelize.org/) is a promise-based Node.js ORM that supports multiple relational databases. Its robust transaction support, relations, eager and lazy loading, read replication, and more, make it a great choice for enterprise-grade applications.

In this guide, we'll explore how to use `Sequelize` ORM with the `Neon` managed Postgres database in a JavaScript project. We'll cover setting up a Node.js application, configuring Sequelize, and executing migrations to interact with the database.

## Prerequisites

Before we dive in, ensure you have:

- A Neon account. Sign up at [Neon](https://neon.tech) to get a Postgres database.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

