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

Neon. A phone app shouldn't hold database credentials or a Postgres TCP connection, so the backend needs an HTTP API with per-user access control. Neon's [Data API](/docs/data-api/overview) is a PostgREST-compatible REST interface that validates a JWT on every request and enforces Postgres Row-Level Security, so each user sees only the rows your policies allow. Add [Managed Better Auth](/docs/auth/overview) for sign-in and a [Neon Function](/docs/compute/functions/overview) for any endpoint that needs custom logic.

## Query Postgres over HTTPS

The Data API accepts standard HTTP requests, so it works from Swift, Kotlin, Dart, or JavaScript with the HTTP client you already use:

```bash
curl -X GET 'https://your-data-api-endpoint/rest/v1/posts?is_published=eq.true&order=created_at.desc' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

Every request is stateless, so the app doesn't need a connection pool or reconnect logic after the phone sleeps, and the API scales to thousands of concurrent users without exhausting database connections ([Data API](/docs/data-api/overview)). For JavaScript apps that use Managed Better Auth, the `@neondatabase/neon-js` client handles tokens for you ([get started](/docs/data-api/get-started)).

## Access control in the database

Permissions live in Postgres. The Data API selects a Postgres role from the JWT (`authenticated`, `anonymous`, or a custom `role` claim) and Row-Level Security policies decide which rows that user sees, using `auth.user_id()` to read the token's `sub` claim ([access control](/docs/data-api/access-control)). The same policies apply whether the request comes from iOS, Android, or a web client.

## Sign-in as a REST service

[Managed Better Auth](/docs/auth/overview) runs as a managed REST API in the same region as your database and stores users and sessions in the `neon_auth` schema. It issues the JWTs the Data API validates. If you already use Auth0, Clerk, Firebase Auth, or another JWT provider, the Data API can validate its tokens instead ([custom providers](/docs/data-api/custom-authentication-providers)). The Free plan includes up to 60,000 monthly active users ([plans](/docs/introduction/plans#auth)).

<Admonition type="note" title="Where the SDKs stand">
Neon's client SDK for Auth and the Data API is JavaScript and TypeScript (`@neondatabase/neon-js`). Native Swift, Kotlin, and Dart apps use the HTTP endpoints directly.
</Admonition>

## Custom endpoints

For anything the REST API shouldn't do directly, such as validating a purchase receipt or fanning out a notification, deploy a [Neon Function](/docs/compute/functions/get-started). It runs next to the database with `DATABASE_URL` injected, and `waitUntil` handles follow-up work after the response is sent. Functions are available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions).

## How other options compare

- **Supabase**: ships official client libraries for JavaScript, Flutter, and Swift, all GA, plus Auth, Storage, Realtime, and PostgREST ([features](https://supabase.com/docs/guides/getting-started/features)). If you want a native Dart or Swift SDK, Supabase has one and Neon doesn't. The SDKs call the auto-generated API from the phone, so your data is protected only when every exposed table has a correct RLS policy. The production checklist says tables without RLS "allow any client to access and modify their data" ([going into prod](https://supabase.com/docs/guides/deployment/going-into-prod), [Neon vs Supabase](/guides/neon-vs-supabase#auth)). The same applies to Neon's Data API, which also relies on RLS. Auth includes 50,000 MAU on Free and 100,000 on Pro, then $0.00325 per MAU, so an app with 150,000 monthly users adds $162.50/month ([pricing](https://supabase.com/pricing)). Neon's paid plans include up to 1M MAU ([plans](/docs/introduction/plans#auth)). The built-in email sender allows 2 auth emails per hour project-wide until you connect your own SMTP ([rate limits](https://supabase.com/docs/guides/auth/rate-limits)). Each project is a fixed Postgres instance billed hourly on paid plans ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Firebase**: Firestore is a NoSQL document database for mobile, web, and server development ([Firestore](https://firebase.google.com/docs/firestore)). Reads and writes bill per document beyond the free daily quotas ([pricing](https://firebase.google.com/pricing)). Firebase's relational option, Firebase SQL Connect (formerly Data Connect), is backed by Cloud SQL for PostgreSQL ([SQL Connect](https://firebase.google.com/docs/data-connect)).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Expose your database to a mobile client" description="Enable the Data API, add an RLS policy, and query from any HTTP client." buttonText="Data API quickstart" buttonUrl="/docs/data-api/get-started" />
