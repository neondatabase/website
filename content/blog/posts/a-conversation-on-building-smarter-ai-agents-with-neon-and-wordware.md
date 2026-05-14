---
title: A Conversation on Building Smarter AI Agents with Neon and Wordware
description: 'Fast iteration is key, from the IDE all the way down to the infra'
excerpt: >-
  A few weeks ago, we participated in a panel talking about AI Agents with
  Wordware. For those of you who prefer to scroll through it, here’s a summary
  of our conversation—plus a Wordware demo. The interlocutors in this
  conversation were Raouf Chebri, Sr Developer Advocate at Neon...
date: '2024-11-14T18:32:14'
updatedOn: '2024-11-14T18:32:17'
category: community
categories:
  - community
  - ai
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/a-conversation-on-building-smarter-ai-agents-with-neon-and-wordware/cover.jpg
  alt: null
isFeatured: false
seo:
  title: A Conversation on Building Smarter AI Agents with Neon and Wordware - Neon
  description: >-
    A few weeks ago, we participated in a panel talking about AI Agents with
    Wordware. Here's a TL;DR of our conversation.
  keywords: []
  noindex: false
  ogTitle: A Conversation on Building Smarter AI Agents with Neon and Wordware - Neon
  ogDescription: >-
    A few weeks ago, we participated in a panel talking about AI Agents with
    Wordware. Here's a TL;DR of our conversation.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/a-conversation-on-building-smarter-ai-agents-with-neon-and-wordware/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/a-conversation-on-building-smarter-ai-agents-with-neon-and-wordware/neon-ai-agent-2-1-1024x576-ad362636.jpg)

A few weeks ago, we participated in a [panel](https://www.youtube.com/watch?v=DSbf_t_VOuM) talking about [AI Agents](https://neon.tech/use-cases/ai-agents) with [Wordware](https://www.wordware.ai/). For those of you who prefer to scroll through it, here’s a summary of our conversation—plus a Wordware demo.

<Admonition type="info">
The team at Wordware (YC S24) is building their platform on Neon. You can read more about why they picked Neon and how they’re using it [here](https://neon.tech/blog/building-ai-agents-just-got-faster-with-wordware-and-neon). If you're also YC, ask us about our [deals](https://neon.tech/yc-startups).
</Admonition>

---

_The interlocutors in this conversation were [Raouf Chebri](https://www.linkedin.com/in/raoufchebri/), Sr Developer Advocate at Neon (asking the questions), and [Robert Chandler](https://www.linkedin.com/in/robertjhchandler/), Co-founder and CTO of Wordware._

<YoutubeIframe embedId="DSbf_t_VOuM" start={1641} isDocPost={false} />

### What are the challenges teams are facing when building AI agents?

A huge challenge we see often among teams building [AI agents](https://www.wordware.ai/blog/best-ai-agent-frameworks-for-developing-autonomous-systems) is managing the slow feedback loop. This is especially common when engineers aren’t domain experts. Without a clear understanding of what “good” output looks like in your agent, engineers have to rely on someone else for feedback which slows down development significantly. Constant iteration is key for AI agents. It’s essential to put the person who knows what “good” means—the domain expert—more in the driver’s seat so teams can achieve a much faster iteration cycle.

This challenge is what inspired us to build Wordware. Wordware allows engineers and product teams to collaborate seamlessly within a prompt-first environment that’s both intuitive and powerful. This way, teams can experiment, adapt, and refine agents in real time, drastically improving development efficiency and agent quality.

My co-founder and I met over 10 years ago while studying machine learning at Cambridge, so we’ve been around AI for a while. Before Wordware, we each went on different paths within industry—he developed early memory-augmenting tech using GPT-2, I worked on self-driving cars—but in both experiences, we saw how crucial it was to tighten feedback loops to succeed.

### What sets Wordware apart from other agent frameworks out there?

Something different about Wordware is that it’s designed from first principles for prompt engineering, blending the flexibility of natural language with the structure of programming. Wordware has a prompt-first experience that allows both engineers and non-technical team members (e.g. the domain experts) to collaborate via an intuitive, web-based IDE. This allows the team to iterate on prompts directly, move much faster, and build more effective agents as a result.

Another key differentiator of Wordware is its modularity. Users can create specialized, reusable components that make up narrow agents, each designed for specific tasks, and then connect these components to build more comprehensive solutions. Wordware also supports multiple LLM—teams can optimize their agents based on the strengths of each model without reworking their entire system.

### This adaptability with different LLMs is interesting.

Yeah, we built Wordware to be completely model-agnostic so users can leverage [the best LLMs](https://www.wordware.ai/blog/which-llm-is-the-best-a-guide-to-the-top-large-language-models) for their specific needs without any fuss. Sometimes, you want a model that’s fast and cost-effective—something like Llama or Mistral is perfect for that. Other times, you need deeper reasoning or creativity, and that’s where GPT-4 or Claude shine.

What’s cool about this approach is that it’s as easy as switching tabs. You’re not rewriting code or changing SDKs; you’re just picking the model that best fits your task. For example, GPT models are sharp for logic and precision, but Claude has this subtle, more tasteful style for writing or summarizing content. So if you’re crafting a blog post you might go with Claude, and for intense reasoning or math-heavy tasks, you’d choose GPT.

<video autoPlay loop controls width="2532" height="1590">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/a-conversation-on-building-smarter-ai-agents-with-neon-and-wordware/wordware-clip-a436f1b3.mov" />
</video>

You can even combine these models within a single workflow. Need GPT to handle some reasoning and then Claude to polish the language? No problem, Wordware lets you chain these capabilities together seamlessly, so you get the best of all worlds in one place. It’s all about letting the models play to their strengths and building the most effective AI workflows without being locked into a single option.

### I heard that Wordware had a viral moment recently…

We launched [an agent that analyzed Twitter feeds and offered personality insights](https://twitter.wordware.ai/), including a roast feature that people absolutely loved.

<EmbedTweet url="https://twitter.com/yoheinakajima/status/1817989020984791374?ref_src=twsrc%5Etfw" />

Overnight it became a hit, and we were not expecting it. We saw a big traffic spike that turned out to be a real stress test for our infrastructure. That’s when [Neon](https://neon.tech/home)’s serverless architecture and [autoscaling](https://neon.tech/docs/introduction/autoscaling) truly proved useful.

### Tell us more about how Neon supported you!

Because we’re using Neon, we didn’t have to scramble to manually scale up or worry about provisioning additional resources—it all happened automatically. Neon provisions new databases really fast, and these databases autoscale up very quickly also, which was critical given how much our load was increasing.

This whole experience made clear the importance of having dynamic autoscaling in your database, especially for applications where traffic can fluctuate wildly. We also love Neon’s [branching](https://neon.tech/docs/introduction/branching), which lets us create isolated, on-demand environments that mirror production data without the overhead of duplicating it. This makes it easy for us to quickly test and iterate new features and schema changes, shipping faster and with fewer mistakes.

---

_To learn more about Neon and how it powers startups like Wordware, explore our_ [case studies](https://neon.tech/case-studies)_. Neon has a_ [Free Plan](https://console.neon.tech/signup) _ – you can get started right away, no credit card required and no questions asked._
