---
title: Neon Documentation MDX Components - Specialized Guide
subtitle: Specialized and less common components for specific use cases
enableTableOfContents: true
isDraft: true
---

A comprehensive reference for specialized and less commonly used MDX components in Neon documentation. This guide covers components used in specific scenarios, specialized workflows, and edge cases.

<Admonition type="note" title="Component Status">
Some components in this guide are currently unused or may be deprecated in future updates. These are included for reference but may be removed from the codebase.
</Admonition>

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to use specialized MDX components for specific use cases</p>
<p>When to choose specialized components over common ones</p>
<p>Technical requirements and dependencies for specialized components</p>
<p>Best practices for complex component implementations</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/community/component-guide">Component Guide</a>
<a href="/docs/community/component-icon-guide">Component Icon Guide</a>
<a href="/docs/community/component-architecture">Component Architecture</a>
<a href="/docs/community/contribution-guide">Documentation Contribution Guide</a>
</DocsList>
</InfoBlock>

## Quick Navigation

- [Code Display](#code-display) - Enhanced code blocks and external code
- [Media Components](#media-components) - Video and multimedia content
- [Specialized Shared Components](#specialized-shared-components) - Feature status indicators
- [SDK Components](#sdk-components) - Auto-generated SDK documentation
- [Utility Components](#utility-components) - Forms and specialized UI elements
- [Specialized Components](#specialized-components) - Complex and specialized functionality
- [Community Components](#community-components) - Community engagement features

---

## Code Display

Enhanced code blocks and external code embedding.

### ExternalCode

Embed code from external sources or files.

```mdx
<ExternalCode 
  src="https://raw.githubusercontent.com/neondatabase/neon/master/README.md" 
/>
```

**Live Preview:**

*[External code loaded from GitHub README.md with syntax highlighting]*

Example of external code loading (mocked for showcase):

```markdown
# Neon Database

Serverless Postgres built for the cloud.

## Key Features

- **Instant provisioning**: Create databases in seconds
- **Autoscaling**: Scale compute up and down automatically
- **Branching**: Create database branches like Git
- **Scale to zero**: Save costs when inactive

## Quick Start

1. Sign up at console.neon.tech
2. Create your first project
3. Connect using your preferred client
```
---

## Media Components

Components for embedding and displaying multimedia content.

### YoutubeIframe

Embedded YouTube video player.

```mdx
<YoutubeIframe embedId="IcoOpnAcO1Y" />
```

**Live Preview:**

<YoutubeIframe embedId="IcoOpnAcO1Y" />

---

### Video

Native video player component.

```mdx
<Video 
  sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]} 
  width={960} height={1080} 
/>
```

**Live Preview:**

<Video 
  sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]} 
  width={960} height={1080} 
/>

---

## Specialized Shared Components

Status indicators for features in different stages of development and release.

### Feature Announcements

Status indicators for features in different stages:

```mdx
<ComingSoon />
<PrivatePreview />
<PrivatePreviewEnquire />
<EarlyAccess />
<PublicPreview />
<FeatureBeta />
<LRBeta />
<NewPricing />
<LRNotice />
<MigrationAssistant />
```

**Live Preview:**

<ComingSoon />
<PrivatePreview />
<PrivatePreviewEnquire />
<EarlyAccess />
<PublicPreview />
<FeatureBeta />
<LRBeta />
<NewPricing />
<LRNotice />
<MigrationAssistant />

---

### EarlyAccessProps

Status indicator for early access features with custom feature name.

```mdx
<EarlyAccessProps feature_name="My Feature" />
```

**Live Preview:**

<EarlyAccessProps feature_name="My Feature" />

---

## SDK Components

Auto-generated components specifically for SDK documentation. These load content from [shared templates](/docs/community/component-guide#common-shared-components).

### Getting Started

```mdx
<GetStarted sdkName="Next.js" />
```

### SDK Type Components

```mdx
<SdkUser sdkName="React" />
<SdkProject sdkName="Node.js" />
<SdkUseUser sdkName="Vue" />
```

**Note**: These SDK components require corresponding files in the `content/docs/shared-content/` directory and proper configuration in `sharedMdxComponents`.

---

## Utility Components

Specialized UI components for specific use cases.

### RequestForm

Contact or request submission form.

There are types (`extension` and `regions`) defined in `src/components/shared/request-form/data.js`. To define a new type, define a new config in `data.js` and register it in `DATA` there.

```mdx
<RequestForm type="extension" />
```

**Live Preview:**

<RequestForm type="extension" />

---

### ChatOptions

Chat interface options component with a specific use case in the sidebar navigation.

**Important:** This component is designed for internal navigation use only and should not be used in regular documentation content.

---

## Specialized Components

Complex components for specialized functionality and workflows.

### AIRule

AI-powered rule component for automated documentation features.

```mdx
<AIRule name="Example Tool" />
```

**Live Preview:**

<AIRule name="Example Tool" />

---

### MCPTools

Model Context Protocol tools integration component.

```mdx
<MCPTools />
```

**Live Preview:**

<MCPTools />

---

### NextSteps

Component for suggesting next steps in documentation workflows.

```mdx
<NextSteps />
```

**Live Preview:**

<NextSteps />

---

## Community Components

Components for community engagement and interaction.

### CommunityBanner

Community engagement banner for promoting community participation.

```mdx
<CommunityBanner buttonText="Join Discord" buttonUrl="https://discord.gg/92vNTzKDGp" logo="discord">
  Connect with the Neon community!
</CommunityBanner>
```

**Live Preview:**

<CommunityBanner buttonText="Join Discord" buttonUrl="https://discord.gg/92vNTzKDGp" logo="discord">
  Connect with the Neon community!
</CommunityBanner>

---

## Usage Guidelines

### When to Use Specialized Components

- **ExternalCode**: When you need to embed code from external repositories or sources
- **Media Components**: For video tutorials, demos, or multimedia content
- **Specialized Shared Components**: For feature announcements and status updates
- **SDK Components**: For auto-generated SDK documentation
- **Utility Components**: For specialized forms and navigation elements
- **Specialized Components**: For AI-powered features and complex workflows
- **Community Components**: For community engagement and participation

### Best Practices

- **Use sparingly**: These components are specialized and should be used only when appropriate
- **Test thoroughly**: Specialized components may have specific requirements or dependencies
- **Document usage**: When using specialized components, document the specific use case
- **Consider alternatives**: Always consider if a simpler component would work better
- **Follow patterns**: Use established patterns for similar functionality

### Component Dependencies

Some specialized components have specific dependencies:

- **SDK Components**: Require shared content files and proper configuration
- **RequestForm**: Requires specific type configurations in the data files
- **Media Components**: May require specific video formats or hosting
- **Specialized Components**: May have AI or external service dependencies

---

## Component Summary

This guide covers specialized MDX components used in specific scenarios. Each component includes:

- **MDX syntax**: Copy-paste ready code examples
- **Live rendering**: See exactly how components appear
- **Usage guidelines**: When and how to use each component
- **Dependencies**: Requirements and configurations needed

### Component Categories

| **Category**                                              | **Components**                                                                                                                                  | **Use Case**                           |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **[Code Display](#code-display)**                         | [ExternalCode](#externalcode)                                                                                                                   | External code embedding                |
| **[Media Components](#media-components)**                 | [YoutubeIframe](#youtubeiframe), [Video](#video)                                                                                               | Multimedia content                     |
| **[Specialized Shared Components](#specialized-shared-components)** | [Feature Announcements](#feature-announcements), [EarlyAccessProps](#earlyaccessprops)                                               | Feature status indicators              |
| **[SDK Components](#sdk-components)**                     | [Getting Started](#getting-started), [SDK Type Components](#sdk-type-components)       | Auto-generated SDK documentation       |
| **[Utility Components](#utility-components)**              | [RequestForm](#requestform), [ChatOptions](#chatoptions)                                                                                       | Specialized UI elements                |
| **[Specialized Components](#specialized-components)**            | [AIRule](#airule), [MCPTools](#mcptools), [NextSteps](#nextsteps)                                                                              | Complex and specialized functionality   |
| **[Community Components](#community-components)**          | [CommunityBanner](#communitybanner)                                                                                                            | Community engagement                   |

For commonly used components, see the [Component Guide](/docs/community/component-guide). 