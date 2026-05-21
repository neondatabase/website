---
title: >-
  Database-per-User Architecture With Shared Application Environments: How and
  Why
description: Design advice for your SaaS
excerpt: >-
  Neon works best with a project-per-user architecture, but there’s more than
  one way to design, implement, and manage this. Each of the two main strategies
  has different advantages and drawbacks. Today, we’re going to talk about the
  one that most resembles what you might think of...
date: '2024-10-18T15:41:57'
updatedOn: '2025-02-27T10:09:42'
category: workflows
categories:
  - workflows
authors:
  - dian-m-fay
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/shared-application-environment/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    Database-per-User Architecture With Shared Application Environments: How and
    Why - Neon
  description: >-
    Design advice for building a "classic SaaS" (a single application
    environment shared among all users) with a database per user.
  keywords: []
  noindex: false
  ogTitle: >-
    Database-per-User Architecture With Shared Application Environments: How and
    Why - Neon
  ogDescription: >-
    Design advice for building a "classic SaaS" (a single application
    environment shared among all users) with a database per user.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/shared-application-environment/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/shared-application-environment/neon-shared-environment-3-1-1024x576-2579151b.jpg)

Neon works best with a project-per-user architecture, but there’s more than one way to design, implement, and manage this. Each of the two main strategies has different advantages and drawbacks.

**Today, we’re going to talk about the one that most resembles what you might think of as “classic SaaS”: deploying a single application environment shared among all users.** This is a familiar and simple design: there’s only a single set of things to deploy on a single set of servers (at least at first) and it offers you a lot of flexibility.

![Image](https://cdn.neonapi.io/public/images/pages/blog/shared-application-environment/ad4nxddukjhjbngilrvfcrpqbxy7n7pv70tefptdi4b0e7e6efuqzq98trpekhlyf5eyemrclvivsxhyq1bco3ujvpwj0tkalerfgj1dadmbirwg7pwna7gqm1nju0ihnk6jafyzyiywilrqxeqx7tjnui-y-9eea5d9f.png)

This article is part of a series on building [database-per-user architectures](https://neon.tech/blog/multi-tenancy-and-database-per-user-design-in-postgres). In the next article, we cover the opposite design choice: [isolated application environments.](https://neon.tech/blog/database-per-user-architecture-with-isolated-application-environments)

## Disclaimers

The advantages of deploying a shared application environment don’t come for free. The flexibility you gain with a shared-environment strategy directly limits the flexibility you can offer your users. In particular:

- Staying at a specific version of the software while the world moves on is off the table: with a single application deployment, databases have to be maintained at a single consistent schema version. If you target smaller spending from more customers, they’re usually amenable to if not expecting to buy what you’re selling, that day and every day. However, fewer customers laying out significant sums might expect more control.
- Issues like data residency and geographical proximity are difficult to navigate until you’ve gone multi-region, and even then it has to be the _right_ region to make the difference you need. If you don’t have to deal with geographic constraints or can put that off until you scale to multiple regions, the shared-environment strategy can work for you.

## Getting Into a Single App Environment

The way your customers access your application will inform both its design and the architecture of your [control plane](https://neon.tech/blog/control-planes-for-database-per-user-in-neon). With a single environment, you’re already gravitating toward one set of choices — things like “bring your own URL” are much more difficult to implement. However, you still have decisions to make among the set that remain.

To route queries and data to the correct database, users need to **authenticate**. What information do they need to provide in order to log in? At minimum, likely a username and password; ideally, a second factor from a hardware key or authenticator app. But how do you know which customer they’re authenticating on behalf of, and whose data to show them?

1. They could tell you at the same time as they log in, similar to how the AWS console asks for an account ID or alias;
2. They could tell you _before_ they log in, by connecting to a subdomain reserved to the customer;
3. Or, you could look it up with the credential they’ve given you.

The last option especially throws a major implication into sharp relief. Looking up the user’s associated organization means that the user:organization link, and therefore the user listing itself, is in your catalog database. Customers in this scenario don’t self-manage accounts to any great degree.

There are many cases in which this is fine! If your target customers are individuals rather than organizations (but do ask yourself whether it’s guaranteed to stay that way), or if individual users carry their accounts across multiple organizations like Carta or GitHub, there’s usually little need for detailed organization-level account management.

However, in more strictly hierarchical situations where user accounts are owned and operated within an organization, customer admins will often need to do more and faster than they can by operating with limited tools and sending support requests your way.

The first and second options are more alike. Subdomains personalize navigation, insofar as anyone looks at URLs anymore, and improve the login experience: if you know who’s logging in, you can render simple customizations into pre-authentication screens. This entails some DNS work and ongoing care with link construction to ensure that navigation doesn’t break with absolute URLs. Using URL paths or querystrings to customize adds even more routing complexity, and should be avoided.

## Talking to the Right Database

Once a user has authenticated against a particular customer, however you’ve chosen to represent that relationship, it’s time to start shuttling their data around. The shared application environment is _shared_ — that user’s requests are structurally identical to everyone else’s requests for data from other customers entirely. Only by tracking the user’s membership can you determine which database should serve their requests.

This tracking is a primary function of the catalog database in the shared-environment approach. In fact, there’s no other place to put this information: clients can lie, and hardcoding a map of organizations to Neon project ids in your code would require a full redeployment for each new customer. The catalog database is the only stable repository of information on your side of the client-server divide that you’re guaranteed to know about.

You can see it in this [example repo](https://github.com/neondatabase/db-per-tenant). [Mahmoud’s](https://x.com/thisismahmoud_) code:

1. Looks up the authenticated user’s database based on their id;
2. Instantiates a Neon API client;
3. Retrieves a connection URI to start querying.

When individual user accounts are managed by other customer users instead of in the catalog database, a couple of elements here do get more complex, but the overall workflow is about the same. The authenticating user’s customer id needs to be stored in a signed token like a JWT that they can pass back to the server with each request. When they do so, the router validates the token, picks the customer id back out, and uses that to find the appropriate database.

The demo connection router goes step by step for clarity, but there are a couple of useful optimizations that can speed up production code. First, the API client can be a long-lived object rather than created and destroyed in each request, since the application’s Neon API key is static. Second, you can add the [pooled](https://api-docs.neon.tech/reference/getconnectionuri) option in step 3 to use Neon’s [built-in pgBouncer pooling](https://neon.tech/docs/connect/connection-pooling).

## The Control Plane and Catalog Database in a Shared Application Environment

We covered the [general attributes and uses of the control plane and catalog db in a previous post](https://neon.tech/blog/control-planes-for-database-per-user-in-neon). The main point of specialization in a shared environment is responsibility for Neon project **connections**. When a customer signs up and a new Neon project is provisioned, that project id needs to become an option for connections on behalf of that customer’s users.

When you’re deploying only the one system, it can be tempting to build the control plane into it, as an administrative mode or control panel. This does simplify operations — as long as things go well. When they start going wrong, you might find yourself without the tools you need to resolve problems quickly if the application has taken your control plane down with it.

Tier and feature enablement is also well suited for the catalog database. While you’ll likely rely on software like [LaunchDarkly](https://launchdarkly.com/) to provide different experiences and feature sets, the information that something should be turned on has to come from somewhere. The catalog database is the furthest upstream and gives you the most flexibility to enrich the context you pass into any feature-flagging solution.

All of this, as well as the connection routing example above, illustrates an important principle: **the more you can push into the catalog database, the easier things get**. Obviously, there’s a limit to this. If you take it to the extreme, you’re back at shared-schema multitenancy in a single database, but the shared environment strategy is already some distance from the isolated-environments end of the continuum.

A shared application environment with per-user Neon projects simplifies your security model for user data management. All the little decisions about who can do what and where are rolled up into the single big decision of which database someone can read and write. Information that that someone doesn’t need to manage for themselves can live in the central catalog database where it’s more accessible and more legible to you as you operate and maintain the system. Nowhere are the gains more evident than in schema upgrade rollout.

## Upgrading Everything at the Same Time

One big reason to deploy a shared application environment is to have as few things needing maintenance as possible. The classic “as-a-service” approach makes routine server code and styling updates about as easy as possible; the catch is when a change reaches all the way back to the database. Or databases, plural.

There’s enough to discuss about schema changes in a database-per-user context to fill a post or even a series of its own. With a shared application environment specifically, though, keeping all user databases at the same schema version is of paramount importance. Any given application deployment will expect every database to have a consistent schema, and violating that expectation leads to bugs and undefined behavior.

In this situation, there are two ways to manage schema changes safely.

First, you can move slowly, and roll out changes well before the application starts relying on them. Some types of change are more amenable to this than others: new columns are as easy as it gets, but redefining a table starts to require scaffolding in the form of views and triggers to present the same “interface” to client code.

Second, you can test upgrades against each user database. This is a discrete step from upgrade rollout, and blocks the upgrade if any individual database fails testing. [Branching](https://neon.tech/docs/manage/branches) is a great way to test potential changes without blocking activity in the primary databases.

It’s important to remember that these are risk mitigation strategies rather than guarantees! The most thorough tests cannot stop someone from adding a null where you’re about to require a value — _after_ you mark their database test passed.

## Conclusion

The overall operational simplicity of deploying a single system is a big point in favor of the shared-environment strategy. Especially with a smaller engineering team, the ability to focus on a single instance enables more _internal_ complexity within that system — more components, more data flows, more external integrations.

It isn’t all simple, of course. However, even fully isolated environments face exactly the same upgrade issues, for example: the only difference is that the upgrades don’t have to happen in lockstep. Some complexity is irreducible.

---

**This article is part of a series. Check out the previous two articles on the topic of building database-per-user architectures:**

- [Part I: Multi-tenancy and Database-per-User Design in Postgres](https://neon.tech/blog/multi-tenancy-and-database-per-user-design-in-postgres)
- [Part II: Control Planes for Database-Per-User](https://neon.tech/blog/control-planes-for-database-per-user-in-neon)

And [the next article in the series](https://neon.tech/blog/database-per-user-architecture-with-isolated-application-environments) where we cover isolated application environments.
