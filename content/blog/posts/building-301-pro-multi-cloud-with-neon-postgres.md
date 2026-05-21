---
title: Building 301.Pro Multi-Cloud With Neon Postgres
description: Why I chose to move away from AWS RDS Postgres
excerpt: >-
  “AWS RDS is overly complex to set up, especially when using fine-grained user
  permissions. I tried Neon after talking to a few friends who had recommended
  it and I was able to transition our entire analytics operation from AWS RDS to
  Neon in about two hours. That tells you how di...
date: '2024-10-31T16:10:03'
updatedOn: '2024-11-14T07:28:19'
category: community
categories:
  - community
authors:
  - scott-cate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-301-pro-multi-cloud-with-neon-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Building 301.Pro Multi-Cloud With Neon Postgres - Neon
  description: >-
    We take you through the journey of building the backend analytics for
    301.Pro, a new link shortener, sharing all discoveries along the way.
  keywords: []
  noindex: false
  ogTitle: Building 301.Pro Multi-Cloud With Neon Postgres - Neon
  ogDescription: >-
    We take you through the journey of building the backend analytics for
    301.Pro, a new link shortener, sharing all discoveries along the way.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-301-pro-multi-cloud-with-neon-postgres/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-301-pro-multi-cloud-with-neon-postgres/neon-multi-cloud-1-c99354f2.jpg)

<blockquote>
<p><strong> “AWS RDS is overly complex to set up, especially when using fine-grained user permissions. I tried Neon after talking to a few friends who had recommended it and I was able to transition our entire analytics operation from AWS RDS to Neon in about two hours. That tells you how different the UX was and the simplicity of Neon” </strong></p>
</blockquote>

Hi 👋 I’m Scott Cate and I’m the founder of [**301**](https://301.pro/).Pro, a new link shortener platform that brings advanced features like geolocation-based redirects and time-sensitive rules to the classic URL shortener.

In this blog post series, I’ll take you through my journey of building the backend analytics for 301.Pro using Neon, sharing all the nerdy details and real-time discoveries along the way so we can learn together if you’re also a developer tackling your backend.

This first post will cover the first steps right after moving from RDS to Neon. In the next one, we’ll dive into Neon’s fancier features—like [branching](https://neon.tech/flow)—and explore how I end up configuring my Neon setup of projects, branches, etc.

## The App: 301.Pro – Adding a rules engine to Pro Links

<video autoPlay loop controls width="1612" height="1018">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/building-301-pro-multi-cloud-with-neon-postgres/301-pro-8fc28655.mov" />
</video>

301.Pro is not your grandparents link shortener. At first glance, we have all the same-old-features other’s have—but then Pro Links take things up a notch with unique features that have never been seen before in a link routing rules engine.

The lie of utm_source. If you have every setup utm_source in your expanded url, you knew it felt dirty because it’s never accurate. Example: Say you setup [301.pro/announcement](https://301.pro/announcement) as a Pro Link, and your expanded destination was [yourdomain.com/blog/announcement?utm_source=social](https://yourdomain.com/blog/announcement?utm_source=social). What is that hardcoded social? What about Which Social? What about Who on your team shared the link? The 301.Pro rules engine is full of helpful variables, that you set up ONE TIME and the rule works for every link.

Imagine using this goodness!

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-301-pro-multi-cloud-with-neon-postgres/212-ec6aa5c1.jpg)

This rule as a team or campaign rule will work for every link associated and automatically change the utm_source based on the referral if there is one. When there is no Referrer – the default of social kicks in to fill in the blank! How awesome is that? By the way – we know referer is spelled wrong, but we can’t change [internet legend](https://en.wikipedia.org/wiki/HTTP_referer)!

Another example is geolocation-based redirects, which are one of the standout features of a Pro Link. Imagine you’re a company running a national ad promotion with one branded Pro Link or the same QR-Code (Every 301.Pro Link has it’s own customizable QRCode) you have printed on billboards and magazines. Instead of sending everyone to the same generic landing page, 301 Pro allows you to redirect users to the location nearest to them automatically.

Another nice feature is time-sensitive rules. Think of setting up a Pro-Link to promote a webinar or online event. Before the event starts, the Pro Link directs users to a registration page, and after, it takes them straight to the recording. All while only setting up the Pro Link once, so the Pro LInk continues to be valuable after the webinar has completed.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-301-pro-multi-cloud-with-neon-postgres/36-f229ac2f.jpg)

Thanks to these dynamic rules, 301.Pro isn’t just shortening links: it’s making them smarter and more efficient for your campaigns. A big piece of this is to also give you control and insights. For example, you can see detailed analytics for each click right from the 301 platform, not just a basic number. It’s what we call **Click Truth Analytics<sup>TM</sup>**.

## The Backend: Multi-Cloud And Serverless

When it came to building the backend for 301.Pro, I knew I wanted something fast, serverless, and scalable across multiple platforms. The whole app is built on a multi-cloud architecture, with half of the operations running in **AWS Lambda** and the other half deployed as **Edge Cloudflare Workers**.

This setup lets us deliver lightning-fast results (under 100ms in most cases) no matter where the user is when they click your Pro LInk. Cloudflare’s CDN allows us to handle geolocation-based redirects at the edge to give users a more personalized experience, e.g., sending them to the nearest store location or tailoring content based on their time zone.

## Setting up Neon For Analytics Collection

Now, let’s talk about [Neon](https://neon.tech/), which handles the analytics for 301.Pro. I tried AWS RDS first, but AWS RDS is too expensive for the volume of Analytics and overly complex to set up, especially when using fine-grained user permissions.

So, I tried Neon after talking to a few friends who had recommended it. **I was able to transition our entire analytics operation from AWS RDS to Neon in about two hours. That tells you how different the UX was and the simplicity of Neon.** The dashboard is amazingly simple to use. A detail I loved right away was the [browser based table viewer / editor.](https://neon.tech/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page)

Neon also fits really well into this multi-cloud, serverless setup. Both AWS Lambda and Cloudflare can direct connect to the Neon, each with their appropriate credentials. You could accomplish this 100 different ways, but Neon was super simple and easy to understand. For 301.Pro, Neon sits perfectly in the middle of our Multi Cloud setup, acting as the centralized data hub for analytics collection and reporting.

Neon also comes with connection pooling, which is essential for this setup.

However, **there’s a tip I’d like to share regarding connection pooling**:

When handling SET OPERATIONS (think database set, create tables, or application schema migrations), it’s better to not use connection pooling… Pooling is optimized for managing high volumes of short-lived, concurrent connections, not for long-running operations required for database setup. I found much better results in switching direct connections for the migrations and reserved pooled connections for handling analytics high-speed writes. This is a good little forcing function as for DBO connection permissions.

In my opinion, applications should not be running with DBOwner permissions. I want to run with teh least permissions as possible, so designating a user with SET permissions that runs on the NON-POOLED connection string was awesome. That’s where my app migrations run, not my end user code execution.

## The Next Steps: Branching Workflows And Branch vs Project Design

Now that we have the basics covered, my next big focus is exploring some of the more advanced features Neon has to offer. First up, I’m looking into Neon’s [branching](https://neon.tech/docs/introduction/branching). The idea of being able to create [ephemeral environments for testing without duplicating entire datasets](https://neon.tech/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora) sounds really cool, where I can branch off a main branch that I keep in sync with a testing dataset, run tests or experiments, and then delete those branches automatically.

Also, I’m still figuring out whether I should create a separate Neon project per customer or manage them within branches. The key here is making sure each customer’s data is isolated for faster queries and better performance, especially as 301 Pro grows. We’ll share where I end up in a future blog post!

---

_If you are new to Neon Postgres, we have a Free Plan – you can get started [here](https://console.neon.tech/signup). Don’t forget to check out [https://301.Pro](https://301.Pro) and to [follow Scott on X](https://x.com/scottcate) to see more of what he’s building._
