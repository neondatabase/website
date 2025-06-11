---
title: Security best practices for cloud-native development
subtitle: Explore how adopting microfrontends enables teams to break down monolithic applications, accelerate development workflows, and enhance user experience by optimizing build times and modularizing code.
updatedOn: '2025-06-11T09:00:00.000Z'
---

## Overview

In the world of modern web development, scaling applications can introduce significant complexities. As applications grow in size and functionality, traditional monolithic architectures often struggle to keep up, leading to longer build times, increased maintenance burdens, and slower iteration cycles.

To overcome these challenges, many development teams are turning to microfrontends, which break down large frontend applications into smaller, independently deployable units. This shift not only accelerates development workflows but also enhances the end-user experience by optimizing performance.

This article explores the benefits of adopting microfrontends, outlines the differences between vertical and horizontal approaches, and provides a migration guide.

<CTA title="Start building" description="Sign up today and claim $100 in credits when you upgrade." buttonText="Claim offer" buttonUrl="https://fyi.neon.tech/credits" />

## The challenge

For many growing applications, the initial architecture becomes a limiting factor over time. What starts as a single, unified app can lead to long build times, complex dependency management, and cumbersome development workflows. Even small changes may trigger full rebuilds, slowing down iteration.

## Enter microfrontends

Microfrontends break down monolithic frontend applications into smaller, independently manageable units. This shift in architecture allows teams to work in parallel, reduces build times, and can streamline the overall development process. Key benefits include:

- Faster build and deploy cycles.
- Modular codebases for easier maintenance.
- Independent team ownership of different application sections.
- Enhanced user performance by limiting bundle sizes.

### Weighing vertical vs. horizontal splits

Microfrontends can be organized in two main ways, allowing teams to choose the approach that best fits their scaling needs and workflow requirements.

#### 1. Vertical splits

Each microfrontend is responsible for a distinct application section. This reduces cross-section dependencies and results in quicker builds for isolated changes.

#### 2. Horizontal splits

Microfrontends share a page, each managing a feature within it. While this allows for more granular control over the UI, it can also complicate deployment and testing.

### Choosing the right approach

A vertical split offers cohesive ownership of individual sections, allowing teams to manage specific areas independently, though it may result in hard navigations between different sections.

In contrast, a horizontal split provides flexibility by enabling component sharing across various pages, making it easier to maintain consistency throughout the application.

## Migration path

Transitioning from a monolithic to a microfrontend architecture is not without challenges. Here's a step-by-step guide to navigate the process:

- Identify logical boundaries: Start by breaking the application into distinct areas that are rarely accessed together.
- Choose an incremental approach: Opt for a gradual migration, keeping the original monolith live while developing new microfrontends.

To use a local image, `src` your `.jpg`, `.png`, or `.webp` image files.

<Tabs labels={['Environment variables', 'Properties', 'Values']}>

<TabItem>

To create a schema, specify the required properties for the data structure, along with their data types.

Fastify’s routing capabilities allow you to manage both public and protected routes easily, giving you control over how each endpoint is accessed and secured.

</TabItem>

<TabItem>

Properties

</TabItem>

<TabItem>

Values

</TabItem>

</Tabs>

<CodeTabs labels={['TypeScript', 'Python', 'PHP', 'Node.js', 'Go', 'Ruby']}>

```typescript
async function VideoComponent({ fileName }) {
  const {blobs} = await list({
    prefix: fileName, // [!code highlight]
    limit: 2 // [!code highlight]
  });
  const { url } = blobs[0]; // [!code --]
  const { url: captionsUrl } = blobs[1]; // [!code ++]

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  return (
    <video controls preload="none" aria-label="Video player">

      <source src={url} type="video/mp4" />
      <track
        src={captionsUrl}
        kind="subtitles"
        srcLang="en"
        label="English">
        Your browser does not support the video tag.
    </video>
  );
};
```

```python
# python code
```

```php
# php code
```

```nodejs
# nodejs code
```

```go
# go code
```

```ruby
# ruby code
```

</CodeTabs>

As the platform evolves, further optimizations to the development and deployment process are planned, including:

1. Enhancing routing mechanisms for even smoother navigation.
2. Streamlining CI/CD workflows to support independent deployment.

Avoid code duplication by centralizing shared components like headers, footers, and design systems within a monorepo structure.

## Best practices

Each branch is a fully-isolated copy of its parent. We suggest creating a long-term branch for each developer on your team to maintain consistent connection strings.

### Maintaining shared components

Avoid code duplication by centralizing shared components like headers, footers, and design systems within a monorepo structure. This ensures consistency across microfrontends while enabling independent deployment.

Before splitting a monolithic application, identify the logical boundaries within the application where microfrontends can be separated cleanly.

The move to microfrontends has been a game-changer for many organizations, offering a path to scalability without compromising on developer productivity.

## Conclusion

This approach to architectural evolution enables teams to stay agile and address scaling challenges head-on. Whether you choose to go with vertical or horizontal splits — or a combination of both — the right strategy can significantly improve your development lifecycle.

## Read more
