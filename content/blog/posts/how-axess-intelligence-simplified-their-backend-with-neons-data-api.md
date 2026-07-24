---
title: How Axess Intelligence Simplified Their Backend With Neon’s Data API
description: 'Building a fast, branch-based backend without writing CRUD endpoints'
excerpt: >-
  “We didn’t want to spend unnecessary time writing CRUD logic or maintaining a
  backend. We just connected Better Auth and the Data API and started building.
  The best part: every Neon branch gets its own Data API URL” Mouaz Anan,
  Engineer at Axess Intelligence Axess Intelligence is...
date: '2025-11-20T17:49:48'
updatedOn: '2026-01-02T17:39:18'
category: product
categories:
  - product
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-axess-intelligence-simplified-their-backend-with-neons-data-api/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Axess Intelligence Simplified Their Backend With Neon’s Data API - Neon
  description: >-
    How a data-driven rewards app built a fast, low-maintenance backend using
    Neon’s Data API and branching, no CRUD endpoints required.
  keywords: []
  noindex: false
  ogTitle: How Axess Intelligence Simplified Their Backend With Neon’s Data API - Neon
  ogDescription: >-
    How a data-driven rewards app built a fast, low-maintenance backend using
    Neon’s Data API and branching, no CRUD endpoints required.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-axess-intelligence-simplified-their-backend-with-neons-data-api/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-axess-intelligence-simplified-their-backend-with-neons-data-api/neon-axess-intelligence-1-1024x576-d1eed9f9.jpg)

<blockquote>
<p><strong>“We didn’t want to spend unnecessary time writing CRUD logic or maintaining a backend. We just connected Better Auth and the Data API and started building. The best part: every Neon branch gets its own Data API URL” </strong><br></br><br></br><em>Mouaz Anan, Engineer at <a href="https://axessintelligence.com">Axess Intelligence</a></em></p>
</blockquote>

[Axess Intelligence](https://www.axessintelligence.com/) is a platform that gives GTM teams real-time visibility into their competitors’ CRM strategies. By capturing panel data across markets, channels and customer segments, it provides a clearer view of the competitive landscape, helping companies to spot trends, identify opportunities and stay ahead.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-axess-intelligence-simplified-their-backend-with-neons-data-api/screenshot-2025-11-20-at-94122-am-1024x524-509e1fbb.png)

## Building an Efficient, Low-Maintenance Full-Stack App

The team uses [Neon](https://neon.com/) as the database for multiple parts of their platform. One of these is a mobile rewards app that needs a secure, reliable data layer without the overhead of building and maintaining a traditional backend full of CRUD endpoints.

To build this fast with minimal engineering resources and maintenance, the team implemented this setup:

- **API-first data access via** [Neon’s Data API.](https://neon.com/docs/data-api/get-started) Neon’s PostgREST-compatible Data API handles the bulk of database operations (create, read, update, delete), returning structured JSON to the client.
- **Authentication handled by** [Better Auth](https://www.better-auth.com/), which issues the JWTs used to call the Data API.
- **Branch-based environments using Neon** [branching](https://neon.com/docs/introduction/branching).Branches are used to create development and feature environments, each with its own unique Data API URL. This makes it easy to automate environment setup and ensures every build targets the right database state safely.

## Benefits of the Neon + Better Auth + Data API Stack

By combining Neon’s Data API, Better Auth, and branching, Axess Intelligence built a fast, low-maintenance backend that fits their mobile-first workflow. Why this setup works well for them:

- **No backend boilerplate.** The Data API replaces hundreds of lines of repetitive CRUD logic. Standard HTTP requests map directly to SQL operations and return JSON results instantly.
- **Postgres power, API simplicity.** The team interacts with a real Postgres database, not an abstraction. They get full SQL performance and reliability with the convenience of an API-first interface.
- **Seamless authentication flow.** Better Auth handles identity and token issuance, while Neon validates each request using signed JWTs. The separation keeps authentication independent from data logic and easy to maintain.
- **Branch-aware environments.** Each Neon branch automatically gets its own Data API URL. The team maintains a production branch, a development branch, and feature-specific branches for testing new ideas. This makes it easy to experiment safely without touching production data, while keeping every environment consistent and ready to merge when changes are validated.
- **Ready for automation.** Because branches and API endpoints are created programmatically, the entire setup can be integrated into CI/CD pipelines or app builds, letting new environments spin up and down automatically.

## Wrap Up

Axess Intelligence’s experience shows how a lean, focused team can ship complex data-driven features without a traditional backend. Try a similar setup for your own app using the [Neon Free Plan](https://console.neon.tech/signup): create a database, connect the Data API, and start building without writing a single endpoint.

**A big thank-you to the team at Axess Intelligence for sharing their stack and insights. Explore their [features](https://www.axessintelligence.com/features) and request a demo** [here](https://www.axessintelligence.com/demo).
