---
title: SQL to PostgREST Converter
subtitle: Convert SQL queries to PostgREST API calls with real-time preview
summary: >-
  The SQL to PostgREST Converter translates SQL SELECT statements into
  equivalent PostgREST REST API calls with real-time preview. It covers
  filtering, sorting, pagination, joins, and aggregations. Use it to move from
  raw SQL to HTTP-based PostgREST queries against a Neon Data API endpoint
  without manually constructing URL parameters. PostgREST auto-generates a
  RESTful API from a PostgreSQL schema; this converter makes that translation
  immediate and explorable.
enableTableOfContents: false
updatedOn: '2026-06-05T17:20:32.620Z'
---

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Neon Data API</a>
    <a href="/docs/data-api/demo">Building a note-taking app</a>
  </DocsList>
</InfoBlock>

Enter your SQL query below and see the equivalent PostgREST API calls in real-time.
This tool supports common SELECT statements with filtering, sorting, pagination, joins, and aggregations.

<SqlToRestConverter />

## About PostgREST

PostgREST automatically generates a RESTful API from your PostgreSQL schema.
It supports filtering, sorting, pagination, joins, and many other SQL features through URL parameters.
Learn more about PostgREST at [postgrest.org](https://postgrest.org/)
