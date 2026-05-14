---
title: Rubric Labs can make your AI dreams come true 
description: >-
  Rubric Labs helps you build your AI apps, from PoC to full stack—right down to
  the database layer with Neon
excerpt: >-
  “We absolutely love Postgres, but we prefer not using AWS or GCP because they
  are not developer-first. We use PlanetScale for MySQL projects, but for
  Postgres, we didn’t have an equivalent where we could get the same level of
  developer experience… Until we found Neon” Sarim Malik...
date: '2024-08-23T15:49:08'
updatedOn: '2024-08-26T18:16:30'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Rubric Labs can make your AI dreams come true  - Neon
  description: >-
    Rubric Labs is an applied AI lab that uses Neon for their internal and
    client projects. They love Neon due to its premium developer experience.
  keywords: []
  noindex: false
  ogTitle: Rubric Labs can make your AI dreams come true  - Neon
  ogDescription: >-
    Rubric Labs is an applied AI lab that uses Neon for their internal and
    client projects. They love Neon due to its premium developer experience.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/neon-rubric-1024x576-f8bec070.jpg)

<blockquote>
<p>“We absolutely love Postgres, but we prefer not using AWS or GCP because they are not developer-first. We use PlanetScale for MySQL projects, but for Postgres, we didn’t have an equivalent where we could get the same level of developer experience… Until we found Neon”</p>
<cite>Sarim Malik, CEO at Rubric Labs</cite>
</blockquote>

[Rubric Labs](https://rubriclabs.com/) is an applied AI lab that focuses on building AI-augmented solutions for companies. They excel in quickly developing experimental AI proof-of-concept software, working closely with teams to bring innovative ideas from concept to reality. With a team of self-taught developers from diverse backgrounds, they like to use modern devtools that help them build faster—especially if they’re open-source.

<figure>
<a href="https://rubriclabs.com/projects">
<img src="https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/rubric-hero-7c74d550.gif" alt="Image" />
</a>
<figcaption><a href="https://rubriclabs.com/projects">Check out their portfolio</a></figcaption>
</figure>

## How Rubric Labs uses Neon internally

<blockquote>
<p>“We love the fact that Neon has branching. We work with a workflow where each developer has a branch with their name, and then we also have a Neon branch associated with a GitHub branch. We love doing that”</p>
<cite>Sarim Malik, CEO at Rubric Labs</cite>
</blockquote>

Rubric Labs uses [Neon](https://neon.tech/) for both internal and client projects. Neon is a serverless Postgres database that prioritizes the development experience—it is Postgres built for developers, not DBAs. Thanks to features like [scale to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero) and [autoscaling](https://v/), it eliminates the need to size servers or pay for unused capacity, while speeding up development workflows via [database branching](https://neon.tech/docs/introduction/branching).

Speaking of branching: Rubric Labs uses a [development workflow](https://neon.tech/flow) that relies on database branches. Instead of the traditional setup with separate development, staging, and production environments, each developer at Rubric works in their own isolated environment. This includes GitHub branches for every developer, unique database branches for local and staging, plus their own auth tokens and URLs.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/screenshot-2024-08-21-at-64610percente2percent80percentafpm-1024x349-f094d1a3.png" alt="Image" />
<figcaption><em>Rubric Labs implements a workflow in which every developer has their own isolated environment</em><br></br></figcaption>
</figure>

This approach allows Rubric Labs to test multiple full-stack features in parallel, avoiding the typical bottlenecks of shared staging environments. The ability to quickly roll back changes and manage database updates really aligns with their hands-on, fast-paced development style.

The Rubric team has also built internal tools with Neon, like what they call the `Rubric Operating System (ROS)`—a tool that manages internal operations such as lead management, client relationships, and task assignments for Rubric.

## Using Neon in client projects

Rubric Labs also started using Neon for client projects by building [SyncLinear](https://synclinear.com/), an open-source project built in collaboration with [Cal.com](https://cal.com/). SyncLinear syncs tickets between Linear and GitHub, reducing the discrepancies that sometimes arise between both tools—something very handy for teams managing large open-source communities, for example.

<figure>
<a href="https://synclinear.com/">
<img src="https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/screenshot-2024-08-21-at-65138percente2percent80percentafpm-1024x321-66200341.png" alt="Image" />
</a>
<figcaption><a href="https://synclinear.com/">Check it out</a><br></br></figcaption>
</figure>

Rubric also uses other databases when building for their clients, like Supabase and PlanetScale, but Neon is a fave. While PlanetScale’s developer experience is outstanding, it is quite expensive—and of course, it’s not Postgres. In the Postgres world, Rubric also uses Supabase, in scenarios when they want a more all-in-one, out-of-the-box solution to move quickly.

## Their stack of choice

Rubric Labs likes to use tools that put the developer first and allow them to build efficiently:

**Web framework**

- Next.js is Rubric Labs’ go-to for full-stack development, chosen for its modern features and app router, which streamline their workflow.

**Language**

- TypeScript is used exclusively across all Rubric projects.

**Hosting**

- Vercel handles hosting for Rubric Labs, providing seamless integration with Next.js and automating deployments, keeping their CI/CD pipeline efficient.

**Styling**

- Tailwind CSS is used to build responsive, consistent UIs quickly.

**AI tools**

- AI SDK by Vercel is integrated to simplify AI application development and deployment.
- LangChain enhances their AI capabilities, particularly in managing LLM workflows.
- Anthropic’s Claude model is their favorite for handling large language model tasks
- OpenAI’s GPT-4 is also used for embedding tasks and other AI functionalities
- They’ve also used pgvector for vector database capabilities within Postgres

**Database**:

- Postgres hosted on Neon
- Planetscale for MySQL projects
- Supabase for rapid iterations

**Bundling**:

- Bun is their favorite tool

## A repo to get started: create-rubric-app

As we said, Rubric Labs likes building in public, so they’ve put together the [create-rubric-app](https://github.com/RubricLab/create-rubric-app) repository (modeled after [Create React App](https://github.com/facebook/create-react-app)) to help you bootstrap full-stack AI apps:

[https://github.com/RubricLab/create-rubric-app](https://github.com/RubricLab/create-rubric-app)

<figure>
<a href="https://todo.rubriclabs.com/">
<img src="https://cdn.neonapi.io/public/images/pages/blog/rubric-labs-can-make-your-ai-dreams-come-true/screenshot-2024-08-21-at-65413percente2percent80percentafpm-1024x628-20da6fb0.png" alt="Image" />
</a>
<figcaption><a href="https://todo.rubriclabs.com/">Check out the demo </a></figcaption>
</figure>

`Create Rubric App` is open-source, and contributions are much welcome. To get started, run:

```bash
npx create-rubric-app@latest
```

This command sets up a Next.js project and generates an OpenAI API key. You can then launch the app locally with:

```bash
bun dev
```

or

```bash
npm run dev
```

## Try out Neon (it’s free)

If you haven’t used Neon yet, give it a go for your Postgres projects. You can [create an account](https://console.neon.tech/signup) (no credit card required) and start building with our [free tier](https://neon.tech/pricing). And if you’d like to get in touch with the team at Rubric Labs, shoot them a message [here](https://rubriclabs.com/contact).
