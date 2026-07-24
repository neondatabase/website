---
title: How We’re Using Cursor at Neon
description: The wins so far and what would make it even better
excerpt: >-
  Our engineering team at Neon works across a large codebase written in
  TypeScript, Go, Rust, and Python. We’ve been experimenting with Cursor as a
  tool to help us move faster – here’s our favorite workflows, and where we
  still find a few things missing. Our favorite Cursor workflo...
date: '2025-06-02T16:36:34'
updatedOn: '2025-07-09T17:49:51'
category: product
categories:
  - product
authors:
  - david-gomes
  - john-spray
  - atila
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-were-using-cursor-at-neon/cover.jpg
  alt: null
isFeatured: true
seo:
  title: How We're Using Cursor at Neon - Neon
  description: >-
    The Neon engineering team has been experimenting with Cursor as a tool to
    help us move faster. Here's our favorite workflows.
  keywords: []
  noindex: false
  ogTitle: How We're Using Cursor at Neon - Neon
  ogDescription: >-
    The Neon engineering team has been experimenting with Cursor as a tool to
    help us move faster. Here's our favorite workflows.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-were-using-cursor-at-neon/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-were-using-cursor-at-neon/neon-cursor2-notxt-1024x576-354d4aed.jpg)

Our engineering team at [Neon](https://neon.com) works across a large codebase written in TypeScript, Go, Rust, and Python. We’ve been experimenting with Cursor as a tool to help us move faster – here’s our favorite workflows, and where we still find a few things missing.

## Our favorite Cursor workflows

### Cursor Tab improves coding speed

Cursor Tab is a favorite for our team. It’s not just faster to type, it’s context-aware enough to reduce friction across languages. Practical example: when defining a variable like `fooVar` and referencing it later, Cursor Tab often suggests the correct identifier before typing anything. We’ve found this works especially well in Rust, where the strong type system gives Cursor more context to work with.

### Agent Mode helps scaffold, refactor, and debug

We also often use Cursor’s Agent for things like refactoring, debugging, and spinning up new modules. We like how easy it is to include the right context, whether by using the `@` key to add files or selecting text and hitting `Cmd+L` to bring it into scope. This makes it simpler to generate scaffolds or test out ideas before refining them by hand.

### Understanding unfamiliar code faster

For those of us working across multiple services and languages, Cursor has been a useful assistant for quickly understanding unfamiliar parts of the codebase. Practical example: team members less familiar with Go backends used it to gather information on how CORS headers were implemented. Cursor surfaced different implementations and pointed to the shared component being used, which helped them understand the customization pattern without having to rely on teammates for guidance.

### Modernizing legacy code

Others have used it to explore usage patterns in the frontend, like spotting deprecated query styles or components we want to phase out. This helps avoid replicating outdated code and reveals low-effort opportunities to modernize parts of the app. Cursor is great at understanding the direction the codebase is moving in, not just how it was written in the past.

### Keeping up with new models

Cursor’s rapid adoption of new models was also mentioned as a strong point. When Claude 4 was released, it became available in Cursor immediately. For developers who want to try the latest tools, this responsiveness matters.

## Where Cursor still falls short

### Context gaps lead to incorrect suggestions

Despite the upsides, there’s still limitations, especially around context and reliability. When asked to refactor code or identify problems, Cursor sometimes makes incorrect assumptions or chooses shortcuts. Rather than resolving a linting issue, it might suggest commenting out the rule entirely. There have also been cases where Cursor generated incorrect syntax for components in our design system, such as using `size="s"` instead of the correct `appearance="small"`. This is often due to missing context, even when the component lives in the same monorepo.

### Reliability drops in large files

We’ve also found Cursor weaker in certain environments, for example, Python. Practical example: when we asked Cursor to `do something` in a large Python test module, Cursor simply hallucinated a `do_something()` method rather than generating valid code. It also sometimes suggests changes that fail lint checks, even when those checks could reasonably be anticipated and avoided. In large changes, it can repeat the same faulty edit until it eventually gives up and admits it can’t complete the task.

### Model choice adds unnecessary friction

And while it’s great that Cursor supports multiple models and adopts new ones quickly, it puts a heavy cognitive load on the user to have to choose one. We know this isn’t unique to Cursor (most AI tools seem to leave model selection up to the user) but as more models are shipped, it’s hard not to wonder, shouldn’t _they have better data than us_? 🙂 Even just a suggestion on which model to use would be helpful.

## Our wishlist: What could make Cursor indispensable

- Across our team, there’s a clear desire for **better context awareness**, especially when working with less common tools or newer versions of widely used libraries. Cursor tends to perform well with frameworks like TailwindCSS or Radix, but becomes less reliable with vanilla CSS or smaller UI kits.
- Cursor also sometimes **suggests outdated syntax** when the project is using newer versions of libraries like React Query or XState. If it could reference `package.json` to understand the actual version in use, it could adjust its suggestions accordingly and avoid these mismatches.
- There’s also interest in seeing Cursor **evolve from a suggestion tool into a more complete feedback loop**. A workflow that includes suggesting a change, then linting, building, and testing it automatically would reduce so much friction and make it easier to validate edits end to end.
- We have to mention it: we don’t love using **a closed-source editor**. We’re happy to pay for a tool that adds value, but open-sourcing Cursor would build more confidence in its sustainability and increase our willingness to adopt it more fully.

## Still early, but already useful

Cursor is already delivering value to our team. It helps surface patterns, reduce ramp-up time, and accelerate repetitive coding tasks. We’re not using it to write production-ready code end-to-end, but it’s making certain parts of the job faster and more approachable.

We’ll keep exploring how it fits into our workflows and continue sharing what we learn along the way!

---

_[Neon](https://neon.com) is the serverless Postgres database supporting platforms like [Replit Agent](https://neon.tech/blog/replit-app-history-powered-by-neon-branches). It works like a charm with AI IDEs like Cursor. [Sign up for our Free Plan](https://console.neon.tech/signup) and start building._
