---
title: 'Neon’s Instant Branches: Schema-Only or With Data, the Choice Is Yours'
description: >-
  Instant schema-only branches just landed at Neon, but there's more to the
  story.
excerpt: >-
  If you’ve been keeping up with the Neon story, we introduced database
  branching in December 2022. Our instant branches—complete copies of
  production, including data and schema—have enabled thousands of developers to
  work and test efficiently within the safety of their own isolate...
date: '2025-02-05T14:51:44'
updatedOn: '2025-08-14T09:28:39'
category: product
categories:
  - product
  - engineering
authors:
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/instant-branches-schema-only-or-with-data-the-choice-is-yours/cover.jpg
  alt: 'Neon’s Instant Branches: Schema-Only or With Data, the Choice Is Yours'
isFeatured: true
seo:
  title: >-
    Neon’s Instant Branches: Schema-Only or With Data, the Choice Is Yours -
    Neon
  description: >-
    Instant schema-only branches just landed at Neon, but there's more to the
    story.
  keywords: []
  noindex: false
  ogTitle: >-
    Neon’s Instant Branches: Schema-Only or With Data, the Choice Is Yours -
    Neon
  ogDescription: >-
    Instant schema-only branches just landed at Neon, but there's more to the
    story.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/instant-branches-schema-only-or-with-data-the-choice-is-yours/social.jpg
---

![Neon’s Instant Branches: Schema-Only or With Data, the Choice Is Yours](https://cdn.neonapi.io/public/images/pages/blog/instant-branches-schema-only-or-with-data-the-choice-is-yours/neon-schema-only-featured-1024x576-5e0cc385.jpg)

If you’ve been keeping up with the Neon story, we introduced database branching in December 2022. Our instant branches—complete copies of production, including data and schema—have enabled thousands of developers to work and test efficiently within the safety of their own isolated environments.

<blockquote>
<p>Neon allows us to develop much faster than we’ve ever been used to. Instead of putting a lot of effort into getting a synthetic dataset within Docker or local Postgres, we just test in a Neon branch with a perfect copy of production data. — Alex Klarfeld, – CEO and co-founder of Supergood.ai</p>
</blockquote>

The positive impact of branches on our customers’ workflows has been extraordinary. Building on this success, we’re thrilled to introduce [instant schema-only branches](https://neon.tech/docs/guides/branching-schema-only) for users in our [Early Access Program](https://console.neon.tech/app/settings/early-access), and spoiler alert: later this year, we plan to launch **anonymized branching**, enabling the anonymization of sensitive data whenever a new branch is created with data.

## Database branches recap

A database branch is similar to a code branch—a replica or copy of the main production database branch. However, unlike a code branch, [database branches](https://neon.tech/docs/introduction/branching) can be created in two different ways: schema-only, which includes only the structure that defines the tables and their data types, and data+schema, which consists of the structure and all the data stored in the database; a complete copy.

Initially, we only supported full branching, but today we’re introducing schema-only branches. Both types can now be created **instantly** through the Neon console or via our [API](https://neon.tech/docs/reference/api-reference). Please note that the API is subject to change during the early development stages as we continue to refine and improve the functionality.

## A closer look at schema-only branches

Schema-only branches do precisely as the name suggests—they’re a branch containing just the schema—perfect for those navigating strict PII policies.

<video autoPlay playsInline muted loop width="1660" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/instant-branches-schema-only-or-with-data-the-choice-is-yours/schema-only-branches-v3-f2a88a33.mp4" />
</video>

But now what? A database branch without any data may not be that useful if you’re investigating query response times or implementing UI features that handle null data, e.g.

```bash
$ SELECT * FROM users;

user_id | first_name | last_name | email | password_hash 
--------+------------+-----------+-------+---------------

(0 rows) 👈
```

That said, schema-only branches are often the ideal solution for sensitive data. By creating a schema-only branch free of production data, you can safely seed it with synthetic data ready for use by developers.

Adding a seeding step to your branching workflow introduces some additional complexity and, in some cases, might impact developer productivity. However, it’s a reliable way to navigate around PII restrictions.

## Can Neon anonymize sensitive data?

Creating instant branches on Neon with production data has occasionally sparked debate. While many production datasets do include sensitive information, many don’t, and if they do, it’s typically confined to a small number of tables and, more specifically, to just a few columns within those tables.

Nonetheless, the concerns are valid, and we’ve been working hard to find a new solution that allows you to anonymize sensitive data whenever a branch is created.

Here’s a sneak peek at what we’ve been working on: branches with anonymized data. Can your database do that?

<figure>
<a href="https://discord.gg/92vNTzKDGp">
<img src="https://cdn.neonapi.io/public/images/pages/blog/instant-branches-schema-only-or-with-data-the-choice-is-yours/wip-anonymize-data-image-4-1024x576-be34a373.png" alt="Mockup of Anonymize data feature" />
</a>
<figcaption><em>Only a mockup. <a href="https://discord.gg/92vNTzKDGp">Reach out on Discord</a> if you want to give feedback while we develop this feature.</em></figcaption>
</figure>

With the upcoming addition of [data anonymiziation](https://neon.tech/docs/introduction/roadmap#what-were-working-on-now), Neon is set to transform database workflows—by making them as seamless, intuitive, and effective as other modern development tools.

## Try schema-only branches

Instant schema-only branches will be released to all Neon users very soon. But for now, they are available to users in our [Early Access Program](https://console.neon.tech/app/settings/early-access)—join the program if you want to start using them right away. For more info, [read the docs](https://neon.tech/docs/guides/branching-schema-only).
