---
title: Using V0 for UI Design Exploration
description: >-
  How our design team uses AI codegen to prototype real interactions, validate
  faster, and stay close to the final product
excerpt: >-
  Design teams are constantly battling the clock: great ideas lose momentum when
  they get stuck waiting on engineering resources. Too often, static prototypes
  aren’t enough to validate real concepts, and the backlog just keeps growing.
  That’s why we’re taking a new approach: levera...
date: '2025-05-13T02:11:17'
updatedOn: '2025-06-02T17:42:59'
category: ai
categories:
  - ai
  - company
authors:
  - lachezar-petkov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Using V0 for UI Design Exploration - Neon
  description: >-
    How the Neon design team is using AI codegen to prototype real interactions,
    validate faster, and stay close to the final product.
  keywords: []
  noindex: false
  ogTitle: Using V0 for UI Design Exploration - Neon
  ogDescription: >-
    How the Neon design team is using AI codegen to prototype real interactions,
    validate faster, and stay close to the final product.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/untitled-fe3915e5.gif)

Design teams are constantly battling the clock: great ideas lose momentum when they get stuck waiting on engineering resources. Too often, static prototypes aren’t enough to validate real concepts, and the backlog just keeps growing.

That’s why we’re taking a new approach: leveraging AI-powered codegen tools like V0 to move beyond static mockups and start building interactive, production-quality prototypes ourselves. With V0, designers can instantly generate React components and UI flows from a simple text prompt, seamlessly bridging the gap between concept and code.

This shift means designers at Neon can:

- Build interactive, code-backed prototypes that behave like the real product
- Test nuanced flows and micro-interactions directly with users
- Iterate faster and keep design intent intact from concept to implementation

We’re not just sketching ideas anymore, we’re shipping them. Whether it’s refining onboarding, smoothing out micro-interactions, or testing bold new concepts, AI codegen tools like V0 give us the speed, flexibility, and autonomy to deliver real impact, fast.

## Prototyping with Real Code: Raising the Bar for Design Quality

Figma is excellent for visual exploration, but they can’t capture the complexity of real product interactions or system logic. With AI codegen tools, we can now build interactive, production-like prototypes in a fraction of the time, putting real, working experiences in front of users much earlier in the process.

That’s the power of tools like [V0](https://v0.dev/). By prototyping with real code, we move beyond “Does this look good?” to “Does this actually work for our users?”

Here’s a few examples of recent work for which we used v0 in our explorations.

### Exploration 1: Simplifying our database connection modal

Our connection modal was feeling cluttered, packed with dropdowns and an intuitive flow. It was a perfect candidate for a redesign, and a great opportunity to use vibe coding to quickly explore more streamlined alternatives.

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/ad4nxftmxavsgwivpnu8ulfm5d24bouq0nvtcraz9gqjsrm8rlzqkiaofy2ngmpklznsoe1rht1c-ljggo16utwgwbidegcsei3qrqkjj0ke1ohhptiwt4yj1wnr9zkvimtap5ghtw-5d09a3cb.png)

The concept was to embed the selects directly within the connection string itself, creating a more interactive, inline experience. It looked promising in Figma, but we needed to feel it in a real, working environment to know if it would hold up.

After a few rounds of prompting and iteration, we had a functional prototype, real enough to share with teammates and test with users. It wasn’t pixel-perfect, but it delivered valuable feedback and guided our next steps. See our [demo](https://v0-recreate-figma-ui-xi-kohl.vercel.app/)!

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/ad4nxcauik9ukbh5kul4gpvoo2pdznfcz67sgs1q0i0ycipggtsv2e0cfn5uzmm8pnucej5ebaph9mt4papayhyow3tqi8nwsowvylpvy69yojkqbukrxe1tr-5yjxbnnnd1nnhfl8a-9fd6e0ed.png)

#### Testing the real thing, not just the look

The V0 prototype was fully responsive, with each select dynamically adjusting its width. That let me experience true interaction (text selection, double-clicking, usability quirks) far beyond what static mockups can show.

Having a live, working prototype made collaboration with engineers way more productive. We could quickly assess feasibility, discuss edge cases, and refine technical details in real time. For example, it became clear that layering interactive elements (like click-to-copy over the entire code snippet) wasn’t going to work as smoothly as we’d hoped.

This level of realism helped us validate the design faster, and made our engineering conversations sharper and more informed.

### Exploration 2: Building autoscaling sliders

Autoscaling is a favorite feature for Neon users, but it can be tricky for new users to fully grasp. You have to understand concepts like min/max values, the relationship between vCPUs and memory, and what “min” means when scale-to-zero is enabled.

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/screenshot-2025-05-12-at-70854percente2percent80percentafpm-1024x731-8073f8e7.png)

To make these mechanics clearer, we explored the idea of dual vertical sliders, one for RAM, one for CPU, that visually mirror each other. The concept felt elegant on paper, but I needed to test how it _actually_ felt in use, so we turned to v0.

After about a hundred iterations (mostly fine-tuning alignment and layout), we landed on three working versions that looked and behaved exactly as I’d imagined. Instead of asking teammates to _picture_ how it might work, I could now demo fully interactive prototypes.

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-v0-for-ui-design-exploration/untitled-fe3915e5.gif)

Try the [demo](https://v0-custom-range-sliders-6dhlnm.vercel.app/) yourself!

## Lessons Learned

Working with AI codegen isn’t just about writing prompts, it’s about shaping the output. Here are a few things I’ve learned along the way:

- **Skip the Figma import gimmicks**. Use Dev Mode to copy real style values—it gives you far more control.
- **Be specific in your prompts**, The more detail you give (layout, behavior, interactions), the better the results.
- **Treat the AI like a dev**. Coach it, give feedback, and don’t hesitate to ask for a fresh take when needed.
- **Always sanity-check the output**. These tools are powerful, but not perfect. A trick we picked up from Apple engineers: [always validate, always test.](https://arstechnica.com/gadgets/2024/08/do-not-hallucinate-testers-find-prompts-meant-to-keep-apple-intelligence-on-the-rails)

## What’s Next: Giving Designers More Power to Build

We’re especially excited about how V0 is helping us evolve our design system. Its component-based, AI-driven approach lets us generate, test, and refine new components faster than ever. That speed means better consistency, higher quality, and more time to focus on real product challenges vs pixel tweaks.

We’re also rethinking how we run research. Instead of relying on static Figma files or waiting on engineering for working builds, we can now spin up interactive prototypes ourselves. By unlocking these kinds of workflows, we’re building a culture where designers are hands-on builders, collaborators, and real drivers of product quality.
