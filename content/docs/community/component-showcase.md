---
title: Neon Documentation MDX Components and Icons List
subtitle: Learn how the MDX components and icons are used and rendered
enableTableOfContents: true
isDraft: true
---

A comprehensive reference for all MDX components and icons used in Neon documentation. This guide shows both the MDX syntax and the actual rendered components.

For related information, see the [Neon community](/docs/community/contribution-intro) introduction.

## Quick Navigation

- [Essential Components](#essential-components) - Most commonly used
- [Tabbed Content](#tabbed-content) - CodeTabs and Tabs for organized content
- [Content Organization](#content-organization) - Structure and navigation components
- [Code Display](#code-display) - Code blocks and syntax highlighting
- [Interactive & Media Components](#interactive--media-components) - UI elements, forms, and media
- [Shared Content Components](#shared-content-components) - Reusable content and announcements
- [SDK Components](#sdk-components) - Auto-generated SDK docs
- [Icon Reference](#icon-reference) - All available icons by category
- [Finding Component Source Code](#finding-component-source-code) - How to explore the codebase
- [Best Practices](#best-practices) - Implementation guidelines
- [Component Summary](#component-summary) - Quick reference

---

## Essential Components

These are the most frequently used components in Neon docs.

### Admonition

Callouts for notes, warnings, and tips. 6 types available: `note` (default), `important`, `tip`, `info`, `warning`, `comingSoon`.

**MDX:**

```mdx
<Admonition type="warning" title="Important">
  Critical information requiring immediate attention.
</Admonition>
```

**Renders as:**

<Admonition type="warning" title="Important">
Critical information requiring immediate attention.
</Admonition>

**All types:**

<Admonition type="note" title="Note">
Highlights information that users should take into account.
</Admonition>

<Admonition type="important">
Crucial information necessary for users to succeed.
</Admonition>

<Admonition type="tip" title="Pro Tip">
Optional information to help a user be more successful.
</Admonition>

<Admonition type="info">
Information that helps users understand things better.
</Admonition>

<Admonition type="warning">
Critical content demanding immediate user attention due to potential risks.
</Admonition>

<Admonition type="comingSoon">
Information about features that are coming soon.
</Admonition>

### Steps

Numbered step-by-step instructions split by `h2` headings.

**MDX:**

```mdx
<Steps>

## Step 1: Install CLI

Install the Neon CLI tool for managing your database.

## Step 2: Create Project

Create a new project in the Neon console.

## Step 3: Connect Application

Connect your application to the Neon database.

</Steps>
```

**Renders as:**

<Steps>

## Step 1: Install CLI

Install the Neon CLI tool for managing your database.

## Step 2: Create Project

Create a new project in the Neon console.

## Step 3: Connect Application

Connect your application to the Neon database.

</Steps>

---

## Tabbed Content

Components for organizing content into tabs.

### CodeTabs

Multi-language code examples with tabs. For enhanced code block features, see [Code Display](#code-display).

**MDX:**

````mdx
<CodeTabs labels={["JavaScript", "Python", "Go"]}>

```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
await client.connect();
```

```python
import psycopg2
import os

conn = psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor()
```

```go
import (
    "database/sql"
    _ "github.com/lib/pq"
)

db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
```

</CodeTabs>
````

**Renders as:**

<CodeTabs labels={["JavaScript", "Python", "Go"]}>

```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
await client.connect();
```

```python
import psycopg2
import os

conn = psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor()
```

```go
import (
    "database/sql"
    _ "github.com/lib/pq"
)

db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
```

</CodeTabs>

### Tabs

General tabbed content (not just code). For code-specific tabs, use [CodeTabs](#codetabs) instead.

**MDX:**

````mdx
<Tabs labels={["Console", "CLI", "API"]}>
<TabItem>
Create a database using the Neon Console by navigating to your project dashboard and clicking "Create Database".
</TabItem>
<TabItem>
Use the Neon CLI to create a database:

```bash
neon databases create --name my-database
```

</TabItem>
<TabItem>
Use the API to create a database:

```bash
curl -X POST https://console.neon.tech/api/v2/projects/my-project/databases \
  -H "Authorization: Bearer $NEON_API_KEY"
```

</TabItem>
</Tabs>
````

**Renders as:**

<Tabs labels={["Console", "CLI", "API"]}>
<TabItem>
Create a database using the Neon Console by navigating to your project dashboard and clicking "Create Database".
</TabItem>
<TabItem>
Use the Neon CLI to create a database:

```bash
neon databases create --name my-database
```

</TabItem>
<TabItem>
Use the API to create a database:

```bash
curl -X POST https://console.neon.tech/api/v2/projects/my-project/databases \
  -H "Authorization: Bearer $NEON_API_KEY"
```

</TabItem>
</Tabs>

---

## Content Organization

Components for structuring and organizing page content.

### TechCards / DetailIconCards

Technology cards with icons, titles, and descriptions. These components use different [icon systems](#icon-reference) - see the [comparison table](#techcards-vs-detailiconcards-vs-docslist) below to choose the right one.

#### TechCards

Standard technology cards layout using [TechCards icons](#techcards-icons):

**MDX:**

```mdx
<TechCards>
  <a
    href="/docs/guides/node"
    title="Node.js"
    description="Connect Node.js applications to Neon"
    icon="node-js"
  >
    Node.js
  </a>
  <a
    href="/docs/guides/python"
    title="Python"
    description="Connect Python applications to Neon"
    icon="python"
  >
    Python
  </a>
  <a href="/docs/guides/prisma" title="Prisma" description="Use Prisma ORM with Neon" icon="prisma">
    Prisma
  </a>
  <a
    href="/docs/guides/nextjs"
    title="Next.js"
    description="Build Next.js apps with Neon"
    icon="next-js"
  >
    Next.js
  </a>
</TechCards>
```

**Renders as:**

<TechCards>
<a href="/docs/guides/node" title="Node.js" description="Connect Node.js applications to Neon" icon="node-js">Node.js</a>
<a href="/docs/guides/python" title="Python" description="Connect Python applications to Neon" icon="python">Python</a>
<a href="/docs/guides/prisma" title="Prisma" description="Use Prisma ORM with Neon" icon="prisma">Prisma</a>
<a href="/docs/guides/nextjs" title="Next.js" description="Build Next.js apps with Neon" icon="next-js">Next.js</a>
</TechCards>

#### DetailIconCards

Alternative layout using [DetailIconCards icons](#detailiconcards-icons):

**MDX:**

```mdx
<DetailIconCards>
  <a
    href="/docs/ai/openai"
    title="OpenAI Integration"
    description="Build AI features with OpenAI"
    icon="openai"
  >
    OpenAI Integration
  </a>
  <a
    href="/docs/ai/langchain"
    title="LangChain Integration"
    description="Create AI workflows with LangChain"
    icon="langchain"
  >
    LangChain Integration
  </a>
  <a
    href="/docs/development"
    title="Code Development"
    description="Development tools and practices"
    icon="code"
  >
    Code Development
  </a>
  <a
    href="/docs/cloud/aws"
    title="AWS Integration"
    description="Deploy and scale with AWS"
    icon="aws"
  >
    AWS Integration
  </a>
</DetailIconCards>
```

**Renders as:**

<DetailIconCards>
<a href="/docs/ai/openai" title="OpenAI Integration" description="Build AI features with OpenAI" icon="openai">OpenAI Integration</a>
<a href="/docs/ai/langchain" title="LangChain Integration" description="Create AI workflows with LangChain" icon="langchain">LangChain Integration</a>
<a href="/docs/development" title="Code Development" description="Development tools and practices" icon="code">Code Development</a>
<a href="/docs/cloud/aws" title="AWS Integration" description="Deploy and scale with AWS" icon="aws">AWS Integration</a>
</DetailIconCards>

_Note: DetailIconCards uses a different [icon system](#detailiconcards-icons) than [TechCards](#techcards-icons), which is why different icons are available._

#### TechCards vs DetailIconCards vs DocsList

Quick comparison to help you choose the right component:

| Component                               | Use For                        | Icon System                                         | Layout      |
| --------------------------------------- | ------------------------------ | --------------------------------------------------- | ----------- |
| **[TechCards](#techcards)**             | Technology/framework showcases | [Technology logos](#techcards-icons) (colorful)     | Card grid   |
| **[DetailIconCards](#detailiconcards)** | Feature/service showcases      | [Detail icons](#detailiconcards-icons) (monochrome) | Card grid   |
| **[DocsList](#docslist)**               | Documentation links            | Checkbox (default), docs, or repo icon              | Simple list |

### DefinitionList

Accessible term/definition lists for defining technical terms and concepts.

**MDX:**

```mdx
<DefinitionList>

Database URL
: Connection string for your Neon database
: Format: `postgresql://user:password@host:port/database`

Connection Pool
: A cache of database connections
: Improves performance by reusing connections

Branch
: An isolated copy of your database
: Used for development and testing

</DefinitionList>
```

**Renders as:**

<DefinitionList>

Database URL
: Connection string for your Neon database
: Format: `postgresql://user:password@host:port/database`

Connection Pool
: A cache of database connections
: Improves performance by reusing connections

Branch
: An isolated copy of your database
: Used for development and testing

</DefinitionList>

### DocsList

Simple, clean lists for documentation links with optional theming. DocsList provides a lightweight alternative to card-based components for presenting navigation links or content summaries.

**Props:**

- `title` (string) - Optional title for the list section
- `theme` (string) - Visual theme: `"docs"` (document icon), `"repo"` (repository icon), or default (checkbox icon)

**Default Theme (Checkbox Icon):**

```mdx
<DocsList title="Related Documentation">
  <a href="/docs/guides/node">Node.js Connection Guide</a>
  <a href="/docs/guides/python">Python Connection Guide</a>
  <a href="/docs/api-reference">API Reference</a>
  <a href="/docs/cli">CLI Documentation</a>
</DocsList>
```

**Renders as:**

<DocsList title="Related Documentation">
<a href="/docs/guides/node">Node.js Connection Guide</a>
<a href="/docs/guides/python">Python Connection Guide</a>
<a href="/docs/api-reference">API Reference</a>
<a href="/docs/cli">CLI Documentation</a>
</DocsList>

### InfoBlock

InfoBlock creates a multi-column layout for organizing related content sections. It's particularly useful for creating "at-a-glance" summaries at the top of documentation pages, combining learning objectives with related resources. Use two columns.

**Key Features:**

- Commonly paired with DocsList for structured content presentation
- Ideal for page introductions and overview sections

**Basic Two-Column Layout:**

```mdx
<InfoBlock>
<DocsList title="What you will learn:">
<p>How to view and modify data in the console</p>
<p>Create an isolated database copy per developer</p>
<p>Reset your branch to production when ready to start new work</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/branching">About branching</a>
<a href="/docs/get-started-with-neon/workflow-primer">Branching workflows</a>
<a href="/docs/get-started-with-neon/connect-neon">Connect Neon to your stack</a>
</DocsList>
</InfoBlock>
```

**Renders as:**

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to view and modify data in the console</p>
<p>Create an isolated database copy per developer</p>
<p>Reset your branch to production when ready to start new work</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/branching">About branching</a>
<a href="/docs/get-started-with-neon/workflow-primer">Branching workflows</a>
<a href="/docs/get-started-with-neon/connect-neon">Connect Neon to your stack</a>
</DocsList>
</InfoBlock>

---

## Code Display

Enhanced code blocks and external code embedding. For multi-language code examples, see [CodeTabs](#codetabs).

### Code Block Features

Enhanced code blocks with highlighting and options.

**Line highlighting:**

````mdx
```javascript {1,3-4}
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  port: 5432,
});
```
````

**Renders as:**

```javascript {1,3-4}
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  port: 5432,
});
```

**Line numbers and wrapping:**

````mdx
```bash shouldWrap
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-project"}}'
```
````

**Renders as:**

```bash shouldWrap
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-project"}}'
```

### ExternalCode

Embed code from external sources with syntax highlighting.

**MDX:**

```mdx
<ExternalCode
  url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md"
  language="markdown"
  shouldWrap
/>
```

**Renders as:**

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

**Props:**

- `url` (required) - URL to the raw file
- `language` (optional) - Language for syntax highlighting
- `shouldWrap` (boolean) - Enables code wrapping
- `className` (string) - Additional CSS classes

---

## Interactive & Media Components

### Interactive Elements

#### CheckList

Interactive checklists with local storage persistence. Great for setup guides and tutorials with [Steps](#steps).

**MDX:**

```mdx
<CheckList title="Neon Setup Guide">

<CheckItem title="Create Neon account" href="#signup">
  Sign up for a free Neon account at console.neon.tech
</CheckItem>

<CheckItem title="Install dependencies" href="#install">
  Run npm install to add the PostgreSQL client
</CheckItem>

<CheckItem title="Configure environment" href="#config">
  Set your DATABASE_URL environment variable
</CheckItem>

<CheckItem title="Test connection" href="#test">
  Verify your database connection works
</CheckItem>

</CheckList>
```

**Renders as:**

<CheckList title="Neon Setup Guide">

<CheckItem title="Create Neon account" href="#signup">
  Sign up for a free Neon account at console.neon.tech
</CheckItem>

<CheckItem title="Install dependencies" href="#install">
  Run npm install to add the PostgreSQL client
</CheckItem>

<CheckItem title="Configure environment" href="#config">
  Set your DATABASE_URL environment variable
</CheckItem>

<CheckItem title="Test connection" href="#test">
  Verify your database connection works
</CheckItem>

</CheckList>

#### CTA (Call to Action)

Action buttons and promotional sections.

**MDX:**

```mdx
<CTA
  title="Try Neon Free"
  description="Start building with serverless Postgres today. No credit card required."
  buttonText="Sign Up"
  buttonUrl="https://console.neon.tech/signup"
/>
```

**Renders as:**

<CTA 
  title="Try Neon Free" 
  description="Start building with serverless Postgres today. No credit card required." 
  buttonText="Sign Up" 
  buttonUrl="https://console.neon.tech/signup" 
/>

#### Details

Expandable content sections for optional or advanced information.

**MDX:**

````mdx
<details>
<summary>Advanced Configuration Options</summary>

Additional settings for power users:

- Connection pooling settings
- SSL configuration
- Read replica setup
- Custom connection parameters

```javascript
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // pool size
  idleTimeoutMillis: 30000,
};
```

</details>
````

**Renders as:**

<details>
<summary>Advanced Configuration Options</summary>

Additional settings for power users:

- Connection pooling settings
- SSL configuration
- Read replica setup
- Custom connection parameters

```javascript
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // pool size
  idleTimeoutMillis: 30000,
};
```

</details>

### Form & Support Components

#### NeedHelp

Support widget for getting assistance.

**MDX:**

```mdx
<NeedHelp />
```

**Renders as:**

<NeedHelp />

#### RequestForm

Contact or request submission form.

There are types (`extension` and `regions`) defined in `src/components/shared/request-form/data.js`. To define a new type, define a new config in `data.js` and register it in `DATA` there.

**MDX:**

```mdx
<RequestForm type="extension" />
```

**Renders as:**

<RequestForm type="extension" />

#### ChatOptions

Chat interface options component with a specific use case in the sidebar navigation.

**Important:** This component is designed for internal navigation use only and should not be used in regular documentation content.

### Media Components

#### YoutubeIframe

Embedded YouTube video player.

**MDX:**

```mdx
<YoutubeIframe embedId="IcoOpnAcO1Y" />
```

**Renders as:**

<YoutubeIframe embedId="IcoOpnAcO1Y" />

#### Video

Native video player component.

**MDX:**

```mdx
<Video
  sources={[{ src: '/videos/pages/doc/neon-mcp.mp4', type: 'video/mp4' }]}
  width={960}
  height={1080}
/>
```

**Renders as:**

<Video  
sources={[{src: "/videos/pages/doc/neon-mcp.mp4",type: "video/mp4",}]}
width={960}
height={1080}
/>

---

## Shared Content Components

Reusable content components that load from shared templates in `content/docs/shared-content/`. These components are defined as MDX files and registered in `shared-content/index.js`. For component-specific help, see [NeedHelp](#needhelp).

### Feature Announcements

Status indicators for features in different stages:

**MDX:**

```mdx
<FeatureBetaProps feature_name="" />
<FeatureBeta />
<PublicPreview />
<EarlyAccess />
<PrivatePreview />
<PrivatePreviewEnquire />
<LRBeta />
<NewPricing />
<LRNotice />
<ComingSoon />
<MigrationAssistant />
<EarlyAccessProps feature_name="My Feature" />
```

**Renders as:**

<FeatureBetaProps feature_name="OpenTelemetry integration" />

<FeatureBeta />

<PublicPreview />

<EarlyAccess />

<PrivatePreview />

<PrivatePreviewEnquire />

<LRBeta />

<NewPricing />

<LRNotice />

<ComingSoon />

<MigrationAssistant />

<EarlyAccessProps feature_name="Example Feature" />

### Miscellaneous Shared Components

These components do not fit neatly into the other categories but are available for use in MDX docs:

**MDX:**

```mdx
<LinkAPIKey />
<AIRule name="Example Tool" />
<NextSteps />
<MCPTools />
```

**Renders as:**

<LinkAPIKey />

<AIRule name="Example Tool" />

<NextSteps />

<MCPTools />

---

## SDK Components

Auto-generated components specifically for SDK documentation. These load content from [shared templates](#shared-content-components).

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

## Icon Reference

Neon documentation uses multiple icon systems for different components. Only [TechCards](#techcards-icons) and [DetailIconCards](#detailiconcards-icons) icons can be used in MDX content - understanding which system to use is crucial for [TechCards](#techcards) vs [DetailIconCards](#detailiconcards).

| System                                    | Icon source/mapping location                                        | How to use                             | Example usage            |
| ----------------------------------------- | ------------------------------------------------------------------- | -------------------------------------- | ------------------------ |
| [TechCards](#techcards-icons)             | `/public/images/technology-logos/{icon}.svg`                        | Any SVG in that folder by name         | `icon="prisma"`          |
| [DetailIconCards](#detailiconcards-icons) | `/src/components/pages/doc/detail-icon-cards/detail-icon-cards.jsx` | Only icons mapped in the code          | `icon="prisma"`          |
| [Sidebar/Menu](#sidebarmenu-icon-system)  | `/src/components/pages/doc/menu/icon/icon.jsx`                      | Internal navigation only (not for MDX) | N/A - not usable in docs |

### TechCards Icons

You can use any SVG file in `/public/images/technology-logos/` by specifying its name (e.g., `icon="prisma"`). These are typically color logos. If the file does not exist, the icon will not render, but the page will not crash. Used by [TechCards](#techcards).

**Available TechCards icons:**  
aws-s3-bucket, backblaze, bun, cloudinary, convex, entity, estuary, exograph, express, ferret, hasura, heroku, hono, imagekit, inngest, java, javascript, kafka, knex, koyeb, laravel, liquibase, materialize, micronaut, neo-tax, neon, neosync, nest-js, netlify, next-js, node-js, nuxt, oauth, okta, outerbase, phoenix, polyscale, postgresql, prisma, python, quarkus, rails, railway, react, redwoodsdk, reflex, remix, render, ruby, rust, sequelize, sequin, snowflake, solid, sqlalchemy, stepzen, supabase, svelte, symfony, typeorm, uploadcare, vercel, vue, wundergraph

### DetailIconCards Icons

Only a specific set of icons is available, as listed in the component's code. These are typically monochrome and must be mapped in the code. If you use an icon name not in the mapping, nothing will render. Used by [DetailIconCards](#detailiconcards).

**Available DetailIconCards icons:**  
a-chart, app-store, atom, audio-jack, autoscaling, aws, binary-code, branching, bug, calendar-day, cards, check, cheque, chart-bar, cli, cli-cursor, code, csv, data, database, discord, download, drizzle, enable, filter, find-replace, gamepad, gear, github, globe, gui, handshake, heroku, hook, hourglass, import, invert, ladder, laptop, langchain, llamaindex, lock-landscape, metrics, neon, network, ollama, openai, perfomance, postgres, prisma, privacy, puzzle, queries, refresh, research, respond-arrow, scale-up, screen, search, setup, split-branch, sparkle, sql, stopwatch, table, todo, transactions, trend-up, unlock, user, vercel, wallet, warning, wrench, x

### Sidebar/Menu Icon System

Sidebar and menu icons are implemented in `src/components/pages/doc/menu/icon/icon.jsx` for the website's navigation system. Icons are imported from `icons/docs/sidebar/` and mapped in the `icons` object.

**Important**: These icons are NOT available for use in MDX content - they're only for the website's internal navigation menu. For icons in your documentation, use [TechCards icons](#techcards-icons) or [DetailIconCards icons](#detailiconcards-icons) instead.

### Code References

**DetailIconCards mapping:**

```js
import Prisma from './images/prisma.inline.svg';
// ... other imports ...
const icons = { prisma: Prisma /* ... */ };
const Icon = icons[icon];
```

**TechCards icon loading:**

```js
const ICONS_PATH = '/images/technology-logos';
const iconPath = `${ICONS_PATH}/${icon}.svg`;
const iconPathDark = `${ICONS_PATH}/${icon}-dark.svg`;
// If the file exists, it will render. If not, the image will be broken/missing.
```

---

## Finding Component Source Code

Understanding where components are defined in the codebase helps when you need to modify behavior, add features, or debug issues. Here's how to locate and explore component implementations.

### Component File Structure

Most MDX components follow a consistent pattern in the Neon website repository. Components are typically located in: `src/components/pages/doc/{component-name}/`

### Example: DocsList Component

Let's explore the DocsList component as an example, which contains `images/`, `index.js`, and `docs-list.jsx` in `src/components/pages/doc/docs-list/`.

#### File Structure Breakdown:

- `docs-list.jsx` - The main component implementation
- `index.js` - Export file that exposes the component
- `images/` - Directory containing any component-specific images or icons

#### Key Files to Check

When exploring a component, look for these files:

- Component Definition (`{component-name}.jsx`)
  - Contains the React component code
  - Defines props and their types
  - Implements the rendering logic
  - May include styled components or CSS modules
- Index File (`index.js`)
  - Usually a simple export: `export { default } from './component-name';`
  - Makes the component importable from the directory
- Images Directory (`images/`)
  - Contains SVGs, icons, or other assets used by the component
  - For icon-based components, this is where you'll find available icons

---

## Best Practices

### Code Blocks

- Use `{1,3-5}` for line highlighting (see [Code Block Features](#code-block-features))
- Add `shouldWrap` for long commands
- Specify language for proper syntax highlighting
- Use four backticks (````) when showing examples with triple backticks inside
- For multi-language examples, use [CodeTabs](#codetabs) instead of multiple code blocks

### Component Selection

- **[Admonition](#admonition)** for important callouts
- **[Steps](#steps)** for sequential instructions
- **[CodeTabs](#codetabs)** for multi-language examples
- **[TechCards](#techcards)** for technology showcases
- **[CheckList](#checklist)** for setup guides
- **[Details](#details)** for optional or advanced information
- **[InfoBlock](#infoblock)** for page introductions with multiple content sections
- **[DocsList](#docslist)** for simple navigation lists with theming options

### Icon Guidelines

- **Understand the system**: [TechCards](#techcards-icons) and [DetailIconCards](#detailiconcards-icons) use different icon sets
- **TechCards**: Use [Technology Logos](#techcards-icons) (`node-js`, `react`, `python`, `prisma`, etc.)
- **DetailIconCards**: Use [Detail Icons](#detailiconcards-icons) (`openai`, `langchain`, `code`, `aws`, etc.)
- **Test component-specific**: Same icon name might work in one component but not another
- **Check both systems**: If an icon doesn't work, try the other component type
- **Document your findings**: Keep track of which icons work in which components

### Content Organization Tips

- Use [InfoBlock](#infoblock) at the top of pages to provide quick orientation
- For [TechCards](#techcards), always check that the SVG file exists in `/public/images/technology-logos/`
- For [DetailIconCards](#detailiconcards), use only icon names that are mapped in the component code
- Choose [DocsList](#docslist) themes based on content type: default for tasks, `docs` for documentation, `repo` for code
- If you add a new icon, document it for your team
- Use the [comparison table](#techcards-vs-detailiconcards-vs-docslist) to choose between [TechCards](#techcards), [DetailIconCards](#detailiconcards), and [DocsList](#docslist)

---

## Component Summary

This showcase demonstrates all major MDX components available in Neon documentation. Each component includes:

- **MDX syntax**: Copy-paste ready code examples
- **Live rendering**: See exactly how components appear
- **Props documentation**: Available parameters and options
- **Best practices**: When and how to use each component

### Component Categories

| **Category**                                              | **Components**                                                                                                                                  | **Use Case**                           |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **[Essential](#essential-components)**                    | [Admonition](#admonition), [Steps](#steps)                                                                                                      | Most commonly used components          |
| **[Tabbed Content](#tabbed-content)**                     | [CodeTabs](#codetabs), [Tabs](#tabs)                                                                                                            | Organizing content into tabs           |
| **[Content Organization](#content-organization)**         | [TechCards](#techcards), [DetailIconCards](#detailiconcards), [DefinitionList](#definitionlist), [DocsList](#docslist), [InfoBlock](#infoblock) | Structure and navigation               |
| **[Code Display](#code-display)**                         | Enhanced code blocks, [ExternalCode](#externalcode)                                                                                             | Code examples and syntax               |
| **[Interactive & Media](#interactive--media-components)** | [CheckList](#checklist), [CTA](#cta-call-to-action), [Details](#details), Forms, Video, YouTube                                                 | User engagement and multimedia         |
| **[Shared Content](#shared-content-components)**          | FeatureBeta, ComingSoon, PublicPreview                                                                                                          | Reusable content and status indicators |
| **[SDK](#sdk-components)**                                | GetStarted, SdkUser, SdkProject                                                                                                                 | Auto-generated SDK documentation       |
