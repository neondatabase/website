---
title: Lessons From a Zero-Downtime User-to-Org Migration
description: >-
  How we moved millions of projects to team accounts without downtime or
  customer action
excerpt: >-
  Something fairly big happened at Neon recently, but nobody noticed – and
  that’s a good thing. We silently migrated many thousands of user accounts to
  organizations (team-owned accounts), moving more than +10M projects in the
  process. We managed to do this without downtime, withou...
date: '2025-12-22T17:26:47'
updatedOn: '2026-01-08T16:11:53'
category: engineering
categories:
  - engineering
authors:
  - adi-griever
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/lessons-from-a-zero-downtime-user-to-org-migration/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Lessons From a Zero-Downtime User-to-Org Migration - Neon
  description: >-
    The story of how we silently migrated many thousands of user accounts to
    team accounts, moving more than +10M projects in the process.
  keywords: []
  noindex: false
  ogTitle: Lessons From a Zero-Downtime User-to-Org Migration - Neon
  ogDescription: >-
    The story of how we silently migrated many thousands of user accounts to
    team accounts, moving more than +10M projects in the process.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/lessons-from-a-zero-downtime-user-to-org-migration/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/lessons-from-a-zero-downtime-user-to-org-migration/neon-lessons-1024x576-9f844662.jpg)

Something fairly big happened at Neon recently, but nobody noticed – and that’s a good thing. We silently migrated many thousands of user accounts to [organizations](https://neon.com/docs/manage/organizations) (team-owned accounts), moving more than **+10M projects** in the process. We managed to do this without downtime, without API changes, and without asking customers to do anything at all.

This took some sweat and tears from the team, though. In this post, we’ll tell you the story of our own migration – but if you’re building a SaaS, our advice is this: start with team accounts from day one. Thank us later.

## How Neon Started: User Accounts First

When [Neon](https://neon.com/) first launched, we didn’t have organizations. Every project belonged directly to an individual user, and billing was tied to that user as well. At the beginning, that model seemed to work well enough, but as Neon grew, our customers did too. Teams scaled, automation increased, and at that point, the idea that a critical project was “owned” by a single person (even if others had access) started to feel too fragile.

[That’s when we first launched Neon organizations](https://neon.com/docs/changelog/2024-11-29), which are essentially team accounts – they let multiple people collaborate on the same projects and made it possible to manage access and billing at a company level instead of a personal one. But adding organizations created a new class of problems for us internally.

## When Two Ownership Models Collide

Once organizations existed, Neon effectively had two ways to own a project:

- A project could be owned directly by a user,
- or it could be owned by an organization that the user belonged to

These two models worked on their own, but supporting both at the same time turned out to be surprisingly tricky. A user could have their own billing setup and also be a member of one or more organizations with separate billing; depending on how a project was created, ownership and responsibility weren’t always obvious. Even simple questions like “who is actually paying for this project?” could have more than one answer.

From an engineering perspective, it was worse. [Projects](https://neon.com/docs/manage/projects) are the foundation of almost everything in Neon, and they’re tied to specific accounts – they assume there’s a single, well-defined owner. APIs, permissions, usage tracking, and billing all depend on that assumption, so every system had to handle twice the number of edge cases.

We could have kept papering over those edge cases, but it was clear we’d be carrying that complexity forward forever. We were also asking customers to understand this complexity and navigate it themselves, introducing unnecessary friction – for example, many users were still starting out in a “personal” mode by default and only later discovering team accounts, and by that point, moving existing projects and billing was already painful.

So we stepped back and asked a simpler question: what if this distinction just… didn’t exist?

## Every Customer Gets an Org

We decided to give every customer in Neon an organization from the get-go:

- Every new Neon signup automatically came with an organization. Projects lived inside an organization from day one, making collaboration and shared ownership the default instead of an upgrade
- We introduced organizations on the [Free Plan](https://neon.com/pricing) so users start with the right ownership model from day one, and can transition smoothly to team collaboration as they grow
- Only organizations could own projects and be billed. To fully commit to the model, we needed a single source of truth for billing

Once those rules were in place, we were left with a non-trivial problem:

<blockquote>
<p>Thousands of existing Neon users already owned projects. Those users had real production workloads, some of them very critical and with tight uptime requirements – and they had automation, and billing already set up under their personal accounts.</p>
</blockquote>

So the end goal became explicit: migrate every existing user to an organization, transfer all of their projects, and preserve their settings and billing exactly as they were.

## Migration Non-Negotiables

Before writing any migration code, we agreed on a short list of rules that this transition could not violate:

- **No downtime.** Production workloads had to keep running throughout the migration. This included those large, high-traffic customers and background jobs that assume the database is always available.
- **No breaking API changes.** Existing API calls had to keep working exactly as before.
- **No API key rotation.** User-scoped API keys were already embedded in CI pipelines, scripts, agents, and automation.
- **No customer action.** Customers shouldn’t have to opt in, click through a migration flow, or even know this was happening.

## Solving Backwards Compatibility at the API Layer

The biggest technical challenge in this migration was making sure existing [API](https://neon.com/docs/reference/api-reference) usage kept working exactly as it did before.

In Neon, API requests are authenticated using API keys, and those keys have scopes. Some scopes are narrow (e.g. access to a specific project) but at a higher level, every API key is associated with either a user or an organization. That distinction mattered a lot once projects stopped being owned by users. Before the migration, many customers were using user-scoped API keys to do things like:

- List projects
- Create new projects
- Query usage and consumption
- Automate workflows across multiple projects

Those API calls often didn’t specify any organization context, because they didn’t need to – the user owned the projects directly. After the migration, however, all of those projects lived inside organizations. In a strictly org-only world, those same API calls would suddenly need to know which organization they were operating on. Requiring customers to update every request to include an organization identifier would have violated several of our non-negotiables at once.

To stay fully backward compatible, we decided to introduce a new internal concept: the **migrated organization.**

### Migrated organizations

For every user that was migrated, we created a corresponding organization and marked it as that user’s migrated organization. This organization mirrored the user’s previous setup, including ownership, permissions, and billing. From there, the rule was:

- If an API request is made with a user-scoped API key,
- and the request does not specify an organization,
- and the user has a migrated organization,
- then Neon transparently falls back to that migrated organization when handling the request.

This fallback applies to all non-project-specific APIs, such as listing projects, creating new projects, or fetching account-level usage. As a result, the same API calls returned the same data as before, even though ownership had changed underneath.

User-scoped API keys still exist in this org-only world. The difference is that they now grant access to all organizations the user is a member of, while org-scoped API keys grant access to a single organization. That distinction is internal to Neon. From the customer’s point of view, their existing keys kept working.

## Preserving Billing Without Breaking Invoices

If APIs were the most visible surface area of this migration, billing was the riskiest one. Any break in the billing chain would show up immediately (and loudly).

Before the migration, billing in Neon could be associated either with a user account or with an organization. Moving to an org-only model meant consolidating all billing under organizations without changing how customers were charged or how invoices were generated. To make that work, we introduced another internal concept: the **migrated billing account**.

### Migrated billing accounts

When an organization was created for a user, we moved the existing billing data from the user account to the new organization. This included things like billing email, billing address, payment method, and usage history. Crucially, _we preserved the underlying billing account identifier during the move._

Keeping that identifier stable meant that

- Existing invoices remained intact
- Future invoices were generated exactly as before
- Integrations with our external billing systems (e.g. Stripe, Orb) continued to work

## Executing This at Scale (and On-The-Fly)

By the time we ran this migration, Neon had many thousands of customers. **Some agentic companies alone owned 1M+ active projects by the time of the migration** which continuously interacted with the Neon API. There was no safe “maintenance window” where we could pause activity. We also had to be careful about rate limits and cascading effects, i.e. migrating one account at the wrong moment shouldn’t slow down or disrupt others.

That ruled out a lot of common migration techniques. Instead, the migration was designed to be incremental and resilient by default:

- Users were migrated one at a time, not in a big-bang operation. This was a tedious process and we took many weeks to execute it, to make sure it was done safely.
- The system explicitly supported a mixed state for a while, where some users were already migrated while others were not.
- Ownership resolution happened at request time, using migrated organizations and billing accounts as fallbacks when needed.
- All critical paths (APIs, permissions, usage tracking, and billing) were built to tolerate that ambiguity.

This approach was especially important for large customers. Migrating a single agentic customer involved transferring ownership of thousands of projects, but we made it happen gradually, in the background. If a request came in while a user was mid-migration, it still resolved ownership, permissions, and billing correctly.

## If You’re Building a SaaS, Read This

The specifics of this migration are unique to Neon, but the lesson isn’t. If your product will ever support teams, your account model is more foundational than you think.

We were able to make this transition without downtime or customer action only because we had enough engineering resources to dedicate to it, so we could invest heavily in backward compatibility and design the system to tolerate mixed states during the migration. But if we were starting Neon today, team accounts would be the default from day one. If you’re building your own SaaS, that’s our advice to you as well.

If you want a backend that already reflects those lessons, Neon now has all the pieces in place to build on that foundation from the start. Organization-first ownership is the default across the platform, including [Neon Auth](https://neon.com/docs/auth/overview), where identity and permissions live in the database and align cleanly with team accounts. [Start on the Free Plan](https://console.neon.tech/signup), which now includes up to 100 projects.
