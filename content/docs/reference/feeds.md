---
title: Neon RSS feeds
subtitle: Stay updated with the latest news from Neon
summary: >-
  Covers the setup of RSS feeds for tracking Neon updates, including the
  Changelog, blog posts, community guides, and operational status, with
  instructions for subscribing via RSS readers or Slack.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.143Z'
---

Stay updated with the latest information and announcements from Neon by subscribing to our RSS feeds. You can monitor the Neon Changelog, and blog posts, and Neon status updates through your preferred RSS reader or [Slack channel](#subscribe-to-feeds-in-slack).

## Changelog

Keep track of new features, improvements, and fixes by subscribing to the [Neon Changelog](/docs/changelog) RSS feed.

```bash
https://neon.com/docs/changelog/rss.xml
```

## Blog

Stay informed on the latest articles and news by following the [Neon Blog](/blog) RSS feed.

```bash
https://neon.com/blog/rss.xml
```

## Community Guides

Get the latest tips, tutorials, and best practices by subscribing to the [Neon Community Guides](/guides) RSS feed.

```bash
https://neon.com/guides/rss.xml
```

## Status

Monitor the operational status of Neon across different regions by subscribing to the [Neon Status](https://neonstatus.com/) RSS feed.

You can find the Neon Status RSS URL by navigating to the [Neon Status](https://neonstatus.com/) page, clicking subscribe, and choosing the RSS option.

![Neon Status RSS Subscribe button](/docs/introduction/status_subscribe.png)

## Subscribe to feeds in Slack

To receive updates in Slack, enter the `/feed subscribe` command with the desired RSS feed into your Slack channel:

```bash
/feed subscribe https://neon.com/docs/changelog/rss.xml
```

## Remove feeds from Slack

To remove feeds from Slack, enter the `/feed list` command and note the feed ID number.

Enter `/feed remove [ID number]` to remove the feed.
