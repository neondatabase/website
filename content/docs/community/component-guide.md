---
title: Neon Documentation MDX Components Guide
subtitle: Most commonly used components for documentation writers
enableTableOfContents: true
updatedOn: '2025-08-02T10:33:29.223Z'
---

A practical guide for the most commonly used MDX components in Neon documentation. This guide focuses on components you'll use most frequently when writing documentation.

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to use common MDX components in Neon docs</p>
<p>How to choose between different components</p>
<p>Best practices</p>
<p>Proper syntax and prop usage</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/community/component-specialized">Component Specialized Guide</a>
<a href="/docs/community/component-icon-guide">Component Icon Guide</a>
<a href="/docs/community/component-architecture">Component Architecture</a>
<a href="/docs/community/contribution-guide">Documentation Contribution Guide</a>
</DocsList>
</InfoBlock>

## Quick navigation

- [Essential components](#essential-components) - Most commonly used
- [Tabbed content](#tabbed-content) - CodeTabs and Tabs for organized content
- [Content organization](#content-organization) - Structure and navigation components
- [Interactive elements](#interactive-elements) - UI elements and forms
- [Common shared components](#common-shared-components) - Reusable content

---

## Essential components

These are the most frequently used components in Neon docs.

### Admonition

Callouts for notes, warnings, and tips. There are six types available: `note` (default), `important`, `tip`, `info`, `warning`, `comingSoon`.

    ```mdx

<Admonition type="warning" title="Important">
  Critical information requiring immediate attention.
</Admonition>
```

**Live preview:**

<Admonition type="warning" title="Important">
Critical information requiring immediate attention.
</Admonition>

**All Admonition types:**

<Admonition type="note" title="Note">
Highlights information that users should take into account.
</Admonition>

<Admonition type="important">
Crucial information necessary for users to succeed.
</Admonition>

<Admonition type="tip" title="Pro tip">
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

---

### Steps

Numbered step-by-step instructions split by `h2` headings.

```mdx
<Steps>

## Get a Glass

Take a clean glass from the cabinet or dish rack.

## Turn on Tap

Adjust the faucet to your preferred temperature and flow rate.

## Fill and Drink

Fill the glass to desired level and enjoy your water.

</Steps>
```

**Live preview:**

<Steps>

## Get a Glass

Take a clean glass from the cabinet or dish rack.

## Turn on Tap

Adjust the faucet to your preferred temperature and flow rate.

## Fill and Drink

Fill the glass to desired level and enjoy your water.

</Steps>

---

## Tabbed content

Components for organizing content into tabs.

### CodeTabs

Multi-language code examples with tabs.

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

**Live preview:**

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

---

### Tabs

General tabbed content (not just code). For code-specific tabs, use [CodeTabs](#codetabs) instead.

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

**Live preview:**

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

## Content organization

Components for structuring and organizing page content.

### TechCards / DetailIconCards

Technology cards with icons, titles, and descriptions. These components use different [icon systems](/docs/community/component-icon-guide) - see the [comparison table](#techcards-vs-detailiconcards-vs-docslist) below to choose the right one.

#### TechCards

Standard technology cards layout using [TechCards icons](/docs/community/component-icon-guide#techcards-icons):

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

**Live preview:**

<TechCards>
<a href="/docs/guides/node" title="Node.js" description="Connect Node.js applications to Neon" icon="node-js">Node.js</a>
<a href="/docs/guides/python" title="Python" description="Connect Python applications to Neon" icon="python">Python</a>
<a href="/docs/guides/nextjs" title="Next.js" description="Build Next.js apps with Neon" icon="next-js">Next.js</a>
</TechCards>

---

#### DetailIconCards

Alternative layout using [DetailIconCards icons](/docs/community/component-icon-guide#detailiconcards-icons):

```mdx
<DetailIconCards>
  <a
    href="/docs/ai/openai"
    title="OpenAI integration"
    description="Build AI features with OpenAI"
    icon="openai"
  >
    OpenAI Integration
  </a>
  <a
    href="/docs/ai/langchain"
    title="LangChain integration"
    description="Create AI workflows with LangChain"
    icon="langchain"
  >
    LangChain Integration
  </a>
  <a
    href="/docs/development"
    title="Code development"
    description="Development tools and practices"
    icon="code"
  >
    Code Development
  </a>
  <a
    href="/docs/cloud/aws"
    title="AWS integration"
    description="Deploy and scale with AWS"
    icon="aws"
  >
    AWS Integration
  </a>
</DetailIconCards>
```

**Live preview:**

<DetailIconCards>
<a href="/docs/ai/openai" title="OpenAI integration" description="Build AI features with OpenAI" icon="openai">OpenAI Integration</a>
<a href="/docs/ai/langchain" title="LangChain integration" description="Create AI workflows with LangChain" icon="langchain">LangChain Integration</a>
<a href="/docs/development" title="Code development" description="Development tools and practices" icon="code">Code Development</a>
<a href="/docs/cloud/aws" title="AWS integration" description="Deploy and scale with AWS" icon="aws">AWS Integration</a>
</DetailIconCards>

---

> DetailIconCards uses a different [icon system](/docs/community/component-icon-guide#detailiconcards-icons) than [TechCards](/docs/community/component-icon-guide#techcards-icons), which is why different icons are available.\_

#### TechCards vs DetailIconCards vs DocsList

Quick comparison to help you choose the right component:

| Component                               | Use For                        | Icon System                                                                             | Layout      |
| --------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------- | ----------- |
| **[TechCards](#techcards)**             | Technology/framework showcases | [Technology logos](/docs/community/component-icon-guide#techcards-icons) (colorful)     | Card grid   |
| **[DetailIconCards](#detailiconcards)** | Feature/service showcases      | [Detail icons](/docs/community/component-icon-guide#detailiconcards-icons) (monochrome) | Card grid   |
| **[DocsList](#docslist)**               | Documentation links            | Checkbox (default), docs, or repo icon                                                  | Simple list |

### DefinitionList

Accessible term/definition lists for defining technical terms and concepts.

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

**Live preview:**

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

---

### DocsList

Simple, clean lists for documentation links with optional theming. DocsList provides a lightweight alternative to card-based components for presenting navigation links or content summaries.

**Props:**

- `title` (string) - Optional title for the list section
- `theme` (string) - Visual theme: `"docs"` (document icon), `"repo"` (repository icon), or default (checkbox icon)

**Default Theme (Checkbox Icon):**

**MDX Code:**

```mdx
<DocsList title="Related documentation">
  <a href="/docs/guides/node">Node.js Connection Guide</a>
  <a href="/docs/guides/python">Python Connection Guide</a>
  <a href="/docs/api-reference">API Reference</a>
  <a href="/docs/cli">CLI Documentation</a>
</DocsList>
```

**Live preview:**

<DocsList title="Related documentation">
<a href="/docs/guides/node">Node.js Connection Guide</a>
<a href="/docs/guides/python">Python Connection Guide</a>
<a href="/docs/api-reference">API Reference</a>
<a href="/docs/cli">CLI Documentation</a>
</DocsList>

---

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
<a href="/docs/get-started/workflow-primer">Branching workflows</a>
<a href="/docs/get-started/connect-neon">Connect Neon to your stack</a>
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
<a href="/docs/get-started/workflow-primer">Branching workflows</a>
<a href="/docs/get-started/connect-neon">Connect Neon to your stack</a>
</DocsList>
</InfoBlock>

---

## Interactive elements

Components for user engagement and interaction.

### CheckList

Interactive checklists for setup guides and tutorials. CheckList uses CheckItem components internally.

```mdx
<CheckList title="Setup checklist">
  <CheckItem title="Create Neon account" href="#signup">
    Sign up for a free Neon account at console.neon.tech
  </CheckItem>
  <CheckItem title="Install dependencies" href="#install">
    Install the required packages for your project
  </CheckItem>
  <CheckItem title="Configure environment" href="#config">
    Set up your database connection string
  </CheckItem>
  <CheckItem title="Test connection" href="#test">
    Verify your application can connect to Neon
  </CheckItem>
</CheckList>
```

**Live preview:**

<CheckList title="Setup checklist">
<CheckItem title="Create Neon account" href="#signup">
  Sign up for a free Neon account at console.neon.tech
</CheckItem>
<CheckItem title="Install dependencies" href="#install">
  Install the required packages for your project
</CheckItem>
<CheckItem title="Configure environment" href="#config">
  Set up your database connection string
</CheckItem>
<CheckItem title="Test connection" href="#test">
  Verify your application can connect to Neon
</CheckItem>
</CheckList>

---

### CheckItem

Individual checklist items used within CheckList components.

```mdx
<CheckItem title="Task name" href="#anchor">
  Description of the task or requirement
</CheckItem>
```

---

**Usage Notes:**

- Always used within a `<CheckList>` component
- `title` prop is required
- `href` prop is optional for anchor linking
- Content is the description text

### CTA (Call to Action)

Prominent call-to-action buttons for important actions.

```mdx
<CTA
  title="Try Neon free"
  description="Start building with serverless Postgres today. No credit card required."
  buttonText="Sign Up"
  buttonUrl="https://console.neon.tech/signup"
/>
```

**Live preview:**

<CTA title="Try Neon free" description="Start building with serverless Postgres today. No credit card required." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />

---

### NeedHelp

Support widget for getting assistance.

```mdx
<NeedHelp />
```

**Live preview:**

<NeedHelp />

---

---

## Common shared components

Reusable content components that load from shared templates.

### LinkAPIKey

Link to API key management in the console.

```mdx
<LinkAPIKey />
```

**Live preview:**

<LinkAPIKey />

---

### FeatureBetaProps

Status indicator for beta features with custom feature name.

```mdx
<FeatureBetaProps feature_name="OpenTelemetry integration" />
```

**Live preview:**

<FeatureBetaProps feature_name="OpenTelemetry integration" />

---

---

## Best practices

### Component selection

- **[Admonition](#admonition)** for important callouts
- **[Steps](#steps)** for sequential instructions
- **[CodeTabs](#codetabs)** for multi-language examples
- **[TechCards](#techcards)** for technology showcases
- **[CheckList](#checklist)** for setup guides
- **[InfoBlock](#infoblock)** for page introductions with multiple content sections
- **[DocsList](#docslist)** for simple navigation lists with theming options

### Content organization tips

- Use [InfoBlock](#infoblock) at the top of pages to provide quick orientation
- For [TechCards](#techcards), always check that the SVG file exists in `/public/images/technology-logos/`
- For [DetailIconCards](#detailiconcards), use only icon names that are mapped in the component code
- Choose [DocsList](#docslist) themes based on content type: default for tasks, `docs` for documentation, `repo` for code
- Use the [comparison table](#techcards-vs-detailiconcards-vs-docslist) to choose between [TechCards](#techcards), [DetailIconCards](#detailiconcards), and [DocsList](#docslist)

---

## Component summary

This guide covers the most commonly used MDX components in Neon documentation. Each component includes:

- **MDX syntax**: Copy-paste ready code examples
- **Live rendering**: See exactly how components appear
- **Props documentation**: Available parameters and options
- **Best practices**: When and how to use each component

### Component categories

| **Category**                                              | **Components**                                                                                                                                                              | **Use Case**                           |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **[Essential](#essential-components)**                    | [Admonition](#admonition), [Steps](#steps)                                                                                                                                  | Most commonly used components          |
| **[Tabbed Content](#tabbed-content)**                     | [CodeTabs](#codetabs), [Tabs](#tabs)                                                                                                                                        | Organizing content into tabs           |
| **[Content organization](#content-organization)**         | [TechCards](#techcards--detailiconcards), [DetailIconCards](#techcards--detailiconcards), [DefinitionList](#definitionlist), [DocsList](#docslist), [InfoBlock](#infoblock) | Structure and navigation               |
| **[Interactive elements](#interactive-elements)**         | [CheckList](#checklist), [CheckItem](#checkitem), [CTA](#cta-call-to-action), [NeedHelp](#needhelp)                                                                         | User engagement and interaction        |
| **[Common shared components](#common-shared-components)** | [LinkAPIKey](#linkapikey), [FeatureBetaProps](#featurebetaprops)                                                                                                            | Reusable content and status indicators |

For specialized components and specific use cases, see the [Component Specialized Guide](/docs/community/component-specialized).
