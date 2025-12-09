---
title: Use Neon Auth with Next.js (API-only)
subtitle: Headless authentication without UI components
enableTableOfContents: true
updatedOn: '2025-12-09T00:00:00.000Z'
layout: wide
---

<Admonition type="note">
This guide is under development. Check back soon for a walkthrough of using Neon Auth with Next.js using direct API calls instead of pre-built UI components.
</Admonition>

## What you'll build

This guide will show you how to integrate Neon Auth into a Next.js application using API methods directly, allowing you to build your own custom authentication UI without importing the Better Auth UI component library.

You'll learn how to:

- Initialize the Neon Auth client
- Implement social sign-in with `authClient.social.signIn()`
- Manage sessions programmatically
- Protect routes with middleware
- Build custom sign-in/sign-up forms

<NeedHelp/>
