---
title: Fixing JavaScript Timezone Issues
description: How we resolved a common timezone problem in our parking app
excerpt: >-
  Working with timezones in JavaScript often feels like navigating a minefield.
  Recently, I faced a timezone issue when building a parking booking app while
  handling date storage in our database, something you may also encounter if
  you’re working across timezones. Here’s what went...
date: '2025-01-31T17:02:39'
updatedOn: '2025-01-31T17:02:41'
category: community
categories:
  - community
authors:
  - deepesh-genani
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/fixing-javascript-timezone-issues/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Fixing JavaScript Timezone Issues - Neon
  description: >-
    A blog post written by a Neon user as part of Neon's Community series,
    sharing how they fixed a timezone issue when building a paking app.
  keywords: []
  noindex: false
  ogTitle: Fixing JavaScript Timezone Issues - Neon
  ogDescription: >-
    A blog post written by a Neon user as part of Neon's Community series,
    sharing how they fixed a timezone issue when building a paking app.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/fixing-javascript-timezone-issues/cover.jpg
source:
  wpId: 8344
  wpSlug: fixing-javascript-timezone-issues
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/fixing-javascript-timezone-issues/neon-timezone-1-1024x576-626b99ad.jpg)

<Admonition type="note" title="share your tips">
This blog post is written by a Neon user as part of our Community series. Many thanks to [Deepesh Genari](https://deepeshgenani.vercel.app/) for sharing this writeup! If you use Neon and want to share your own tips with the community, [reach out to us on Discord.](https://discord.gg/92vNTzKDGp)
</Admonition>

Working with timezones in JavaScript often feels like navigating a minefield. Recently, I faced a timezone issue when building a parking booking app while handling date storage in our database, something you may also encounter if you’re working across timezones. Here’s what went wrong, how we fixed it, and how Neon simplified the process.

## The problem: Timezone conversions adding unwanted metadata

Our app allows users to book parking slots for a selected date and time. However, **users in Italy were booking slots for 12:00 AM, but our database (hosted on Neon in the US) stored it as 6:00 PM of the previous day.**

Here’s what caused the issue:

```javascript
const date = new Date(selectedDate);
```

When creating a `Date` object in JavaScript, it automatically includes the user’s local timezone. This value is then sent to the API and stored in the database, resulting in unwanted timezone conversions.

For example:

- User’s input (Italy): `2024-01-01 12:00 AM`
- Database storage (US): `2023-12-31 6:00 PM`

The root cause wasn’t just a timezone conversion problem; **this issue was caused by JavaScript automatically adding timezone metadata to the date.** This led to storing a different date and time in the database than what users selected.

To fix this, we needed to store the exact selected time without any timezone information.

## How we fixed it

To avoid automatic timezone handling and metadata issues, we created a plain date-time string that doesn’t include any timezone information. Here’s how:

```javascript
const dateTimeString = `${year}-${month}-${day} ${time}`;
// Example: "2024-01-01 00:00:00"
```

<br />By sending this plain string to the API and storing it directly in the database, we ensured the database received the exact date and time input by the user, without any unintended timezone conversions or metadata.

## Why we love using Neon

1. **Easy connectivity**: Neon integrates seamlessly with our applications. It’s simple to set up and connect to our projects.
2. **Free Plan for personal projects**: The [free plan](https://console.neon.tech/signup) is perfect for starting personal projects, like the parking booking app discussed in this post.
3. **Scalability and reliability**: Despite its ease of use and free plan, we know Neon is a robust Postgres database that will handle scaling and performance when we need it.

---

_You can reach out to the author via X [@deepesh_genani](https://x.com/deepesh_genani). His projects: [https://deepeshgenani.vercel.app/projects](https://deepeshgenani.vercel.app/projects)_
