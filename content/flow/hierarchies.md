---
title: 'Hierarchies'
subtitle: 'Learn how to structure your database branching strategy with root branches and child environments'
updatedOn: '2025-07-08T12:47:21.296Z'
---

Every Neon project begins with a root branch: a baseline environment from which all others can be derived. By default, this is typically called `main`, but the name and purpose are entirely up to you. What matters is that this root branch serves as the anchor for the rest of your environments.

From there, you can create child branches - lightweight copies that inherit schema and data from the root, but operate independently. These branches can be reset, discarded, or promoted without affecting their parents. Think of them as safe, on-demand workspaces built from a known-good state.

In most projects, the root branch (often `main`) becomes your source of truth. It might represent your actual production environment, or a production-like clone seeded with trusted data. From this base, teams derive temporary environments for development, testing, QA, automation, and so on.

This model also makes it easy to handle sensitive data responsibly. When production contains PII or other regulated information, teams can create a schema-only branch. This is a type of branch that includes only the database structure, not the data itself.

Anonymized or synthetic data can then be loaded into this branch, creating a safe, production-like baseline for development, testing, and preview environments. It becomes a trusted intermediate layer in your branching hierarchy - one step removed from production, but still faithful to its shape and scale.
