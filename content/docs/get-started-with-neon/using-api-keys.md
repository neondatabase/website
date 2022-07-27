---
title: Using API Keys
---

## Neon User

A Neon user is identified by their email address.

A user registers and authenticates in Neon Web UI with their GitHub or Google account. More authentication methods are coming soon.

Once authenticated, a user can create and access Projects and [query Project data](../tutorials#query-via-ui). You can also manage [Postgres Users](../../reference/glossary/#postgres-users) and [Databases](../../reference/glossary/#postgres-databases) in each Project.

## Using API keys as a Neon User

API keys allow users to access Neon application programming interface.

An API key provides access to any action available to the user. Currently, API keys cannot be scoped to the specific Projects. Neon users can provision multiple API keys. An API key that is no longer needed can be revoked; this action cannot be reverted. Any issued API key is valid forever until it is revoked.

Check out the [API Reference](https://console.neon.tech/api-docs) for more information about using the API keys and available API methods.
