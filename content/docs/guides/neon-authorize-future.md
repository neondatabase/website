---
title: The future for Neon Authorize
subtitle: Our vision for what comes next
enableTableOfContents: true
updatedOn: '2024-11-01T12:42:55.025Z'
---

[Neon Authorize](/docs/guides/neon-authorize) is an exciting feature, and we want to build more capabilities on top of it.

Here are some ideas of things we could build next — in no particular order (unless stated otherwise). If you see something you like, or something you'd like to see but don't, let us know in [Discord](https://discord.com/channels/1176467419317940276/1176788564890112042)!

## Accepting JWTs for TCP and WebSocket connections

We want Neon Authorize to work over any type of connection: TCP, HTTP, or WebSockets. This is probably our highest priority. Accepting JWTs over TCP (in the password field for the Postgres role) would mean that any Postgres SDK in any programming language could support Neon Authorize.

## Local development experience

We'd like to offer a very easy experience for developers to use Neon Authorize in their local machines without an Internet connection.

## Custom roles

We aim to introduce custom roles for Neon Authorize, in addition to the "authenticated" and "anonymous" roles we have now. We're also exploring the idea of adding "Neon-managed" roles, which would be managed by our platform and included by default in every branch and read replica.

## Automatic installation of `pg_session_jwt` and set up of role grants

The `pg_session_jwt` extension is required for Neon Authorize to work. We're exploring the idea of automatically installing the extension and setting up the role grants for the `authenticated` and `anonymous` roles.

## JWT audience checks

The `aud` field in a JWT typically defines the token's intended recipients. In the future, we want to allow users to customize the expected `aud` field in the JWTs they use with Neon Authorize, providing greater flexibility and control.

## Multi-tenancy through Neon Authorize

We've discussed supporting multi-tenancy via Neon Authorize, allowing users to configure how their JWTs should trigger Neon to route database requests to different Neon instances.

## Neon CLI for configuration

We would like to add support for configuring Neon Authorize from the Neon CLI.

## Neon Authorize for Neon Console frontend database requests

Using Neon Authorize for database requests from the Neon SQL Editor can help map the Neon Console user to the individual who issued the request.

## Proxy rate limiting

Implementing proxy rate limiting will make SQL from the client safer.

## Query allow-listing

The ability to define a query allow-list would help increase the safety of SQL queries from the client.

## Investigate React/TanStack query hooks for SQL queries

We're exploring the generation of React Query hooks for SQL queries, simplifying the process of building applications that leverage SQL from the frontend, or that use React Server Components.

## Simplified OAuth flow for JWKS endpoint

Instead of manually copying and pasting the JWKS endpoint from your authentication provider's console, we are interested in developing an OAuth flow that allows you to simply `Sign in with <Provider>`, automatically populating the JWKS endpoint.

## User interface for RLS and user impersonation

We'd like to add a user-friendly UI for managing RLS policies with AI assistance and a way to simulate SQL queries from different application users and JWT properties.
