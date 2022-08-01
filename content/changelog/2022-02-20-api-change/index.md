---
title: 'API change: Improved upload asset security'
version: '2.1.17'
---

Not related to hackweek, we're making a change to how uploaded images are accessed to improve Linear's security. So far we relied on obfuscated high-entropy URLs to secure uploaded assets. On April 20th we'll start requiring authentication for opening any Linear hosted assets for API users on uploads.linear.app. If you display comment or issue images in your system, you'll need to pass the same API authentication headers to access the images as you would when making a GraphQL API call. We expect this to have a minimal impact for the majority of Linear's API users.

We improved the iconography for cycles. They now better represent their cyclical nature and progress can be more easily tracked with the new icons. We added these progress icons to titles and cycle pages, so you can see how your cycle is going with a quick glance.
