---
title: 'AI Workflows for Docs: Putting Devin to Work'
description: >-
  How we’re using Devin to help with changelogs, PR reviews, and large-scale
  edits across our documentation
excerpt: >-
  At Neon, our docs team does a little bit of everything. We work on technical
  documentation, sometimes UI copy, changelogs, reviews, and the occasional
  regex-heavy cleanup across hundreds of pages. It’s a lot of small, steady work
  – often, exactly the kind of work you wish an AI a...
date: '2025-06-23T17:10:34'
updatedOn: '2025-08-19T18:14:55'
category: ai
categories:
  - ai
authors:
  - daniel-price
  - barry-grenon
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ai-workflows-for-docs-devin/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'AI Workflows for Docs: Putting Devin to Work - Neon'
  description: >-
    We’ve been experimenting with Devin to lighten the load on our docs team,
    automating some of the more repetitive tasks.
  keywords: []
  noindex: false
  ogTitle: 'AI Workflows for Docs: Putting Devin to Work - Neon'
  ogDescription: >-
    We’ve been experimenting with Devin to lighten the load on our docs team,
    automating some of the more repetitive tasks.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ai-workflows-for-docs-devin/social.jpg
source:
  wpId: 10109
  wpSlug: ai-workflows-for-docs-devin
  exportedAt: '2026-03-20T13:31:00.745Z'
---

At [Neon](https://neon.com/), our docs team does a little bit of everything. We work on technical documentation, sometimes UI copy, changelogs, reviews, and the occasional regex-heavy cleanup across hundreds of pages. It’s a lot of small, steady work – often, exactly the kind of work you wish an AI agent could just take off your plate.

That’s what got us curious about [Devin](https://devin.ai/). Unlike other tools we tried, Devin doesn’t just suggest code or text inline; you give it instructions, and it opens a full pull request on your behalf. It’s designed to work across large codebases, operate autonomously, and take care of actual workflows.

That sounded promising for documentation work, which often involves well-defined, repetitive changes or coordination across multiple files. We didn’t expect Devin to write our docs for us, but we wondered if it could become a kind of assistant. We’ve been trying it out: here’s what’s working so far.

## Docs Automation with Devin: What’s Working So Far

### Simple tasks, automated fast

Some of Devin’s biggest wins in our experience come from saving us time on small, repetitive work. For example: we use a Devin Playbook every week to set up our [changelog file.](https://neon.com/docs/changelog) It’s not a complicated task, but it used to be a manual one; now we just say, “Set up a changelog for this Friday,” and Devin gets it started. We’ve standardized the process using a [playbook](https://docs.devin.ai/product-guides/creating-playbooks).

We also use Devin often for addressing GitHub Issues and PRs. We can point Devin to an issue, tell it to review the code and find the relevant parts of the docs to update, and it’ll create or revise a PR with the changes. That’s helped us work through a backlog of older docs issues without needing to manually audit every one.

### Writing docs with context awareness

One of our favorite moments with Devin was when we asked it to document a small new feature. We expected a basic write-up, but when we opened the PR, it included a screenshot (!)

At first, we thought it was a placeholder. But Devin had actually found a relevant image elsewhere in the repo (a .png that matched the UI being described) and inserted it appropriately. There was nothing in our prompt that mentioned the image, and nothing in the surrounding text that made it an obvious fit.

Our guess is that Devin used OCR or some kind of visual recognition to infer the match. Either way, it was a genuinely helpful addition, and a great little glimpse of how powerful context-aware agents will become.

### Multi-file edits without the regex headache

One of the most annoying aspects of documentation work is when a feature name or term changes. You then need to find and update dozens of references across the docs, without accidentally breaking context or formatting. Traditionally, this meant writing cautious regex passes and still doing lots of cleanup.

Naturally, we tried Devin to see how it did here. When we renamed a feature from “history retention” and “point-in-time recovery” to the simpler term [Instant Restore](https://neon.com/docs/introduction/branch-restore), we asked Devin to help. The results were mixed. Devin _did_ find nearly every place in the docset where the old terms were used, something that would have taken a lot of manual effort – that was a win. But its edits leaned heavily on direct find/replace, which led to some awkward constructions like “instant instant restore.” It took another 20+ manual commits to polish the changes.

Even if not perfect, having Devin surface all the right places to edit was a huge time-saver. This is exactly the kind of clerical work we’d love to hand off to an AI agent, and Devin’s close.

### Explaining code when we need it

As a docs team, we often have to understand implementation details in the codebase. Devin has been genuinely helpful here.

Practical example: recently, our Support team asked for details on the usage alerts customers see when approaching plan limits. After some recent changes, we weren’t sure how those alerts were triggered behind the scenes – and instead of digging through the code ourselves or asking an engineer, we asked Devin. It traced the logic and explained how the alerts worked, saving us a chunk of time and Slack messages.

When we don’t have full context (or just need a second brain to walk us through something) we’ve found that Devin is a great tool for quick explanations. [Cursor](https://neon.com/blog/how-were-using-cursor-at-neon) still tends to be our go-to when we want to work through something interactively, but Devin is very useful when the ask is simple and well-scoped.

### UI copy

The Docs team also contributes to the Neon Console. especially small things like copy tweaks, tooltip fixes, and style updates. But rather than spin up the full dev environment to make tiny UI changes, we’ve started asking Devin to do them for us.

In one case, [we spotted a tooltip style issue and sent Devin to fix it.](https://github.com/neondatabase/cloud/pull/29396) In another, we needed to revise a problematic UI component and didn’t want to wait for engineering to prioritize it – [Devin handled the change.](https://github.com/neondatabase/cloud/issues/27073) This kind of UI work is great for Devin, where the scope is small but the implementation is still real.

## What We’re Still Missing

After experimenting so much with Devin, it’s also worth sharing our perspective on those areas where it still falls short.

### Black-box behavior

One of the trickiest things about working with Devin is that it often feels like a black box. You give it a goal, walk away, and later a pull request appears – sometimes with good results, sometimes not.

In one case, we asked Devin to help us ingest an external Markdown file into our docs site at runtime. The idea was to avoid having to copy-paste content from another repo and instead have a single source of truth that remained discoverable within the docs. We used ChatGPT to help plan out the feature and fed that plan into Devin, but Devin just couldn’t figure it out. The frustrating part wasn’t just that it failed, it was that it failed silently. We didn’t get real-time feedback or error signals, and it didn’t ask for clarification. It just kept going until we happened to check in.

That kind of thing happens often, and it makes working with Devin feel a bit like a gamble. You’re either pleasantly surprised or confused by something Devin misunderstood hours ago.

### Complex, fuzzy tasks are still too much for Devin

Devin does well when the problem is clearly scoped, but once things get open-ended, it still struggles.

We ran into this while trying to build a DNS resolution checker for the docs, something users could use to troubleshoot regional database connectivity issues. The request was a bit under-defined, and there was some real complexity involved. This is an example of something that Devin couldn’t handle.

To be fair, the task was probably a stretch for any AI assistant, but it reinforced something we’ve seen a few times: Devin is best when it’s executing a clean, defined task. Once there’s ambiguity or edge cases, it’s much harder to trust the outcome.

### Lack of interactivity

Lastly, compared to tools like Cursor, Devin feels a little _lonely_. With Cursor, we can work alongside the LLM, see what it’s doing, and steer it in real time. That fits how a lot of us prefer to work – jumping in, exploring, refining on the fly.

Devin’s model, by contrast, is more like giving an assistant a task and hoping for the best. We’d love to see Devin adopt a more interactive mode, where it pauses to ask for help when stuck or lets us check in mid-task before pushing a PR. Just an idea!

## Our Conclusion

Devin isn’t a replacement for writing or judgment, and it’s not always predictable – but it’s already helping us move faster on the kinds of tasks that slow our team down. We’re still figuring out where it fits best in our workflow, and where it needs more guardrails or guidance. But when the task is clear and the scope is right, it’s a genuinely helpful assistant.

We’ll keep sending Devin on errands, and we’ll keep sharing what we learn 🙂
