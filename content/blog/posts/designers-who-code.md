---
title: 'Designers Who Code: Can AI End Your Papercut Backlog?'
description: >-
  We’ve implemented Devin and other AI tools in the Neon Design team—and it
  worked.
excerpt: >-
  Designers often spot a long list of UX papercuts—those small, frustrating
  issues that quietly erode a products quality—but development teams are often
  focused on bigger priorities and buried under long backlogs. This is where
  vibe coding can empower designers to break this cycle....
date: '2025-04-28T22:56:13'
updatedOn: '2025-06-25T01:55:09'
category: product
categories:
  - product
authors:
  - carl-thomas
  - lachezar-petkov
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/designers-who-code/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: 'Designers Who Code: Can AI End Your Papercut Backlog? - Neon'
  description: >-
    Designers often spot a long list of small, frustrating issues that quietly
    erode a products quality. This is where AI coding can help.
  keywords: []
  noindex: false
  ogTitle: 'Designers Who Code: Can AI End Your Papercut Backlog? - Neon'
  ogDescription: >-
    Designers often spot a long list of small, frustrating issues that quietly
    erode a products quality. This is where AI coding can help.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/designers-who-code/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/designers-who-code/neon-designers-who-code-1-1024x576-6d1fc31b.jpg)

Designers often spot a long list of UX papercuts—those small, frustrating issues that quietly erode a products quality—but development teams are often focused on bigger priorities and buried under long backlogs. This is where vibe coding can empower designers to break this cycle.

Now, with tools like [Devin](https://devin.ai/), we’re changing that story. By leveraging AI codegen, designers at Neon can “vibe code” away the papercut backlog—shipping real, production-ready improvements without waiting in the queue. This shift empowers us to raise the quality bar, act on what we see, and deliver a smoother and more polished experience for our users experience.

## Shipping improvements with Devin

Devin is an AI-powered code generation tool designed for software development. It understands our system architecture and repo structure, so designers can prompt it with scoped changes and get back a ready-to-review pull request—turning design intent into real product improvements, fast

Lets take a look at Devin in action by one of my Product Designers, Lacho.

**A recent example of using Devin:**

The front-end engineer I was partnered with was pulled into another project, leaving a minor item unresolved—a simple confirmation modal tied to an action. With access to Devin, I wrote a clear, detailed prompt outlining the requirements, asked it to sanity-check its understanding, and let it take a first pass. The ideal outcome was Devin providing the code needed to implement the modal with an action and prep the PR for review.

<blockquote>
<p><em>On the Backup & Restore page there are snapshot cards. Each snapshot card has an ellipsis/’more’ icon button. Each of these buttons opens a menu with a single ‘Delete’ action item. If the user selects Delete, their snapshot will be deleted forever.</em></p><p><em><br></br>Add a modal dialog after the user clicks delete with a confirmation message and two buttons: ‘Cancel’ and ‘Delete’</em>. <em>The copy in the modal must be ‘This is a permanent operation. Deleted snapshots cannot be recovered.’ and must be styled as standard body text. Use other modals for reference.</em></p>
</blockquote>

Devin submitted the PR, and I looped in the original engineer for a quick review. He flagged a minor adjustment, which Devin handled in a follow-up commit. A few hours later, the change was merged, unblocking the flow–only needing an Engineer to approve the PR. This enabled design to unblock engineering and ensure we hit our release deadlines.

**What Devin helped launch:**

![Image](https://cdn.neonapi.io/public/images/pages/blog/designers-who-code/ad4nxfgbv1yuntivp0xcannnhgs7jukmwytgrdchya6wpd9cjwmompddgm4dhsbxrw2tgbpt33-dnbn7khrvb-o0eniq8umrbb3ng1go7thmnd2cc2-1whddsdnxingkvasnjeoq-ea963484.png)

Imagine if you did this the old way you. You submit a task with a figma screen, it goes into a backlog and you could be waiting weeks for this to be prioritized then shipped. This is why tools like Devin can really aid in unlocking the best capabilities of your design team.

### Limitations

Devin is a powerful tool, but it’s not a silver bullet. On larger tasks—like rewriting an entire page layout—it still behaves like a junior developer: it needs a lot of context, guidance, and review. These bigger changes often require hands-on intervention from designers or engineers to get across the finish line.

But when it comes to smaller, well-scoped improvements, Devin shines. It can quickly scaffold solutions and handle foundational work, giving us a head start and freeing up engineering bandwidth. It’s not magic, but it’s a meaningful shift—putting more capability in designers’ hands and helping us deliver a better experience for our customers, faster.

## What’s Next: Empowering Designers, Elevating Product

### Designers Who Ship

Giving designers the ability to submit code is a game-changer. It empowers us to raise the bar on quality, ship improvements faster, and take pressure off our engineering partners. That’s why my team is doubling down on code-based submissions—working side by side with engineers to ensure Neon delivers the best Postgres experience possible.

### Supercharging Our Design System

We’re especially excited about how tools like Devin and V0 can help us evolve our design system. Imagine being able to update components, roll out accessibility improvements, and launch new capabilities—quickly and at scale. This kind of agility keeps our product polished and consistent, while letting us respond to user needs in real time.

### Bridging Design and Research with Codegen

We’re also exploring how codegen tools like V0 and Lovable can transform our research process. Instead of relying on static Figma prototypes or waiting on live builds from engineering, we can now spin up interactive, production-like prototypes in record time. This means we can test real experiences with users earlier, learn faster, and make smarter decisions about what to build next. It’s a shift that turns research from a bottleneck into a superpower.

By unlocking these new capabilities, we’re not just designing better products—we’re building a culture where designers are hands-on makers, collaborators, and drivers of real change.

---

_Neon is a serverless Postgres database used by v0 and Replit Agent. It also works like a charm with AI IDEs like Cursor [via its MCP Server](https://neon.tech/guides/cursor-mcp-neon). [Sign up for Neon](https://console.neon.tech/signup) (we have a Free Plan) and start building._
