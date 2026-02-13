---
title: Connect to Neon
subtitle: Everything you need to know about connecting to Neon
summary: >-
  Covers the various methods to connect to a Neon database, including standard
  Postgres connections, specialized drivers, and tools for different
  environments and applications.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.788Z'
---

This section covers all the ways to connect to your Neon database, from standard Postgres connections to specialized drivers and tools. For framework-specific guides and quick starts, see [Get Started](/docs/get-started/connect-neon).

## Getting started with connections

<DetailIconCards>

<a href="/docs/connect/connect-from-any-app" description="Learn about connection strings and how to connect to Neon from any application" icon="network">Connect from any app</a>

<a href="/docs/connect/choose-connection" description="How to select the right driver and connection type for your application" icon="split-branch">Choose a connection type</a>

</DetailIconCards>

## Connection methods

<DetailIconCards>

<a href="/docs/serverless/serverless-driver" description="Connect from serverless and edge environments over HTTP or WebSockets" icon="audio-jack">Neon serverless driver</a>

<a href="/docs/data-api/overview" description="Query Postgres via HTTP without database drivers or connection pooling" icon="transactions">Data API</a>

<a href="/docs/connect/query-with-psql-editor" description="Connect with psql, the native command-line client for Postgres" icon="cli">Connect with psql</a>

<a href="/docs/connect/connect-postgres-gui" description="Connect from GUI tools like pgAdmin, DBeaver, and TablePlus" icon="gui">GUI applications</a>

<a href="/docs/local/vscode-extension" description="Connect to Neon branches and manage your database directly in VS Code, Cursor, and other editors" icon="code">VS Code Extension</a>

<a href="/docs/connect/passwordless-connect" description="Connect to psql without a password using Neon's passwordless auth" icon="unlock">Passwordless auth</a>

</DetailIconCards>

## Optimize and secure your connections

<DetailIconCards>

<a href="/docs/connect/connection-pooling" description="Enable connection pooling to support up to 10,000 concurrent connections" icon="network">Connection pooling</a>

<a href="/docs/connect/connect-securely" description="Connect securely using SSL/TLS encryption and certificate verification" icon="privacy">Secure connections</a>

<a href="/docs/connect/connection-latency" description="Strategies for managing connection latency and timeouts" icon="stopwatch">Latency and timeouts</a>

</DetailIconCards>

## Troubleshooting

<DetailIconCards>

<a href="/docs/connect/connection-errors" description="Resolve common connection errors including SNI issues and driver compatibility" icon="warning">Connection errors</a>

</DetailIconCards>
