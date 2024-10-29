---
title: The future for Neon Authorize
subtitle: Our vision for what comes next
enableTableOfContents: true
---

[Neon Authorize](/docs/guides/neon-authorize) is an exciting feature, and we want to build more on top of it.

Here's what we'd like to work on next — in no particular order (unless stated otherwise). If you see something you like, or something you'd like to see but don't, let us know in [Discord](https://discord.com/channels/1176467419317940276/1176788564890112042)!

## Accepting JWTs for TCP and WebSocket connections

We want Neon Authorize to work over any type of connection: TCP, HTTP, or WebSockets. This is probably our highest priority. Accepting JWTs over TCP (in the password field for the Postgres role) would mean that any Postgres SDK in any programming language could support Neon Authorize. We will build this.

## Custom roles

We aim to introduce custom roles for Neon Authorize, in addition to the "authenticated" and "anonymous" roles we have now. We're also exploring the idea of adding a "Neon-managed" role, which would be managed by our platform and included by default in every branch and read replica.

## JWT audience checks

The `aud` field in a JWT typically defines the token's intended recipients. In the future, we want to allow users to customize the expected `aud` field in the JWTs they use with Neon Authorize, providing greater flexibility and control.

## Multi-tenancy through Neon Authorize

We want to support multi-tenancy with Neon Authorize, allowing users to configure JWTs that trigger Neon to route database requests to different Neon instances.

## Neon CLI for configuration

We would like to add support for configuring Neon Authorize from the Neon CLI.

## Neon Authorize for Neon Console frontend database requests

Using Neon Authorize for database requests from our SQL Editor can help map the individual Neon Console user more easily to the person in the organization who triggered the request.

## Proxy rate limiting

Implementing rate limiting will make SQL from the client safer.

## Query allow-listing

A query allow-list would also help increase the safety of SQL queries from the client.

## Investigate React/TanStack query hooks for SQL queries

We're exploring the generation of React Query hooks for SQL queries, simplifying the process of building applications that leverage SQL from the front end.

## Simplified OAuth flow for JWKS endpoint

Instead of manually copying and pasting the JWKS endpoint from your authentication provider's console, we're working on an OAuth flow that allows you to simply `Sign in with <Provider>`, automatically populating the JWKS endpoint.

## User interface for RLS and user impersonation

We'd like to add a friendly UI for managing RLS policies, with AI assistance plus a way to simulate SQL queries from different application users and JWT properties.
