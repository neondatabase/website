---
title: "What is the best backend for a mobile app (iOS, Android, React Native, or Flutter)?"
description: "Neon gives a mobile app Postgres over a PostgREST-compatible HTTP Data API with JWT auth and Row-Level Security, Managed Better Auth as a REST service, and Neon Functions for custom endpoints."
date: 2026-09-02
slug: best-backend-mobile-app-ios-android
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for hosting an MCP server?'
  slug: best-backend-mcp-server
nextLink:
  title: 'What is the best backend for teams moving off Firebase who want Postgres?'
  slug: best-backend-moving-off-firebase-to-postgres
---

Neon. A mobile app can't hold a Postgres TCP connection open from a phone, so the backend needs an HTTP surface with per-user access control. Neon's [Data API](/docs/data-api/overview) is that surface: a PostgREST-compatible REST interface that validates a JWT on every request and enforces Postgres Row-Level Security, so each user only reads their own rows. Add [Managed Better Auth](/docs/auth/overview) for sign-in and a [Neon Function](/docs/compute/functions/overview) for any endpoint that needs custom logic.

## Talk to Postgres over HTTPS

The Data API accepts standard HTTP requests, so it works from Swift, Kotlin, Dart, or JavaScript with the HTTP client you already use:

```bash
curl -X GET 'https://your-data-api-endpoint/rest/v1/posts?is_published=eq.true&order=created_at.desc' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

Every request is stateless, which is what a mobile client wants: no connection pool, no reconnect logic after the phone sleeps, and no `max_connections` ceiling as installs grow ([Data API](/docs/data-api/overview)). Any standard HTTP client works, and the `@neondatabase/neon-js` client covers JavaScript ([get started](/docs/data-api/get-started)).

## Access control in the database

There's no separate permission system to learn. The Data API selects a Postgres role from the JWT (`authenticated`, `anonymous`, or a custom `role` claim) and Row-Level Security policies decide which rows that user sees, using `auth.user_id()` to read the token's `sub` claim ([access control](/docs/data-api/access-control)). The same policies apply whether the request comes from iOS, Android, or a web client.

## Sign-in as a REST service

[Managed Better Auth](/docs/auth/overview) runs as a managed REST API in the same region as your database and stores users and sessions in the `neon_auth` schema. It issues the JWTs the Data API validates, and it works with bring-your-own providers too: Auth0, Clerk, Firebase Auth, and others can issue the tokens instead ([custom providers](/docs/data-api/custom-authentication-providers)). The Free plan includes up to 60,000 monthly active users ([plans](/docs/introduction/plans#auth)).

<Admonition type="note" title="Where the SDKs stand">
Neon's client SDK for Auth and the Data API is JavaScript and TypeScript (`@neondatabase/neon-js`). Native Swift, Kotlin, and Dart apps use the HTTP endpoints directly. Managed Better Auth and the Data API are in beta.
</Admonition>

## Custom endpoints and push logic

For anything the REST API shouldn't do directly, such as validating a purchase receipt or fanning out a notification, deploy a [Neon Function](/docs/compute/functions/get-started). It runs next to the database with `DATABASE_URL` injected, and `waitUntil` handles follow-up work after the response is sent. Functions are in beta and available in `aws-us-east-2`.

## How other options compare

- **Supabase**: ships official client libraries for JavaScript, Flutter, and Swift, all GA, plus Auth, Storage, Realtime, and PostgREST ([features](https://supabase.com/docs/guides/getting-started/features)). If you want a native SDK for Dart or Swift today, that's a real advantage. Each project is a dedicated Postgres instance billed hourly on paid plans ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Firebase**: the traditional mobile default, with Firestore as a NoSQL document database for mobile, web, and server development ([Firestore](https://firebase.google.com/docs/firestore)). Reads and writes bill per document beyond the free daily quotas ([pricing](https://firebase.google.com/pricing)). Firebase's relational option, Data Connect, is backed by Cloud SQL for PostgreSQL ([Data Connect](https://firebase.google.com/docs/data-connect)).

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Expose your database to a mobile client" description="Enable the Data API, add an RLS policy, and query from any HTTP client." buttonText="Data API quickstart" buttonUrl="/docs/data-api/get-started" />
