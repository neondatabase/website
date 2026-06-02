---
title: MDX Conversion Test Page
subtitle: Exercises every component the processor handles
enableTableOfContents: true
---

## Admonition variants

<Admonition type="note">
This is a simple note with inline content.
</Admonition>

<Admonition type="warning" title="Breaking change">
The API endpoint has been deprecated.
</Admonition>

<Admonition type="tip">

- Step one
- Step two
- Step three

</Admonition>

<Admonition type="comingSoon">
This feature is coming soon.
</Admonition>

## CodeTabs

<CodeTabs labels={["Node.js", "Python"]}>

```javascript
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
await client.connect();
```

```python
import psycopg2
conn = psycopg2.connect(os.environ["DATABASE_URL"])
```

</CodeTabs>

## Tabs and TabItem

<Tabs labels={["SQL", "CLI"]}>
<TabItem>

```sql
CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);
```

</TabItem>
<TabItem>

```bash
neon databases create --name mydb
```

</TabItem>
</Tabs>

## Steps

<Steps>

### Create a project

Go to the Neon Console and create a new project.

### Connect your app

Use the connection string from your project dashboard.

### Run migrations

Apply your schema migrations to the database.

</Steps>

## DetailIconCards

<DetailIconCards>
<a href="/docs/guides/prisma" description="Connect Prisma ORM to Neon">Prisma</a>
<a href="/docs/guides/nextjs" description="Build Next.js apps with Neon">Next.js</a>
</DetailIconCards>

## TechCards

<TechCards>
<a href="/docs/guides/node" title="Node.js" description="Connect a Node.js app to Neon" icon="node-js"></a>
<a href="/docs/guides/python" title="Python" description="Connect a Python app to Neon" icon="python"></a>
</TechCards>

## DocsList

<DocsList title="Related guides:">
<a href="/docs/guides/prisma">Prisma integration</a>
<a href="/docs/guides/drizzle">Drizzle ORM guide</a>
</DocsList>

## InfoBlock

<InfoBlock>

This is important information inside an InfoBlock. It can contain **bold text** and [links](/docs/introduction).

</InfoBlock>

## DefinitionList

<DefinitionList>

Compute Unit (CU)
: A measure of computing resources (CPU and RAM) allocated to a Neon compute.

Endpoint
: The connection point for your database, providing the hostname and port for client connections.

</DefinitionList>

## CheckList and CheckItem

<CheckList title="Production checklist">

<CheckItem title="Enable connection pooling" href="#pooling">
Connection pooling reduces latency and improves throughput.
</CheckItem>

<CheckItem title="Set up monitoring" href="#monitoring">
Configure alerts for storage and compute usage.
</CheckItem>

</CheckList>

## CTA

<CTA title="Get started with Neon" description="Create a free account and start building." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />

## TwoColumnLayout

<TwoColumnLayout>

<TwoColumnLayout.Item title="Installation" method="npm install @neondatabase/serverless">

Install the Neon serverless driver from npm.

</TwoColumnLayout.Item>

<TwoColumnLayout.Block label="Example">

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const result = await sql`SELECT * FROM users`;
```

</TwoColumnLayout.Block>

<TwoColumnLayout.Step title="Configure environment">

Set the `DATABASE_URL` environment variable.

</TwoColumnLayout.Step>

<TwoColumnLayout.Footer>

For more details, see the [driver documentation](/docs/serverless/serverless-driver).

</TwoColumnLayout.Footer>

</TwoColumnLayout>

## LinkPreview

Values must be provided in <LinkPreview href="https://tools.ietf.org/html/rfc3339" title="RFC 3339" preview="Date and Time on the Internet: Timestamps">RFC 3339 format</LinkPreview>.

## YoutubeIframe

<YoutubeIframe embedId="dQw4w9WgXcQ" />

## CommunityBanner

<CommunityBanner buttonText="Join Discord" buttonUrl="https://discord.gg/neon">Share your feedback</CommunityBanner>

## PromptCards

<PromptCards>
<a title="Next.js" promptSrc="/prompts/nextjs-prompt.md"></a>
<a title="Django" promptSrc="/prompts/django-prompt.md"></a>
</PromptCards>

## MegaLink

<MegaLink tag="Case Study" title="Retool uses the Neon API to manage over 300,000 databases." url="https://neon.com/blog/retool-case-study" />

## QuoteBlock

<QuoteBlock
quote="Neon's branching feature transformed our development workflow."
author={{
    name: 'Jane Smith',
    company: 'Acme Corp',
  }}
link="/blog/acme-case-study"
/>

## Testimonial

<Testimonial
text="The serverless scaling is exactly what we needed."
author={{
    name: 'John Doe',
    company: 'StartupCo',
  }}
/>

## FeatureList

<FeatureList icons={['database', 'scale']}>

### Instant provisioning

Create a database in milliseconds via API.

### Autoscaling

Scale compute up and down based on demand.

</FeatureList>

## ProgramForm

<ProgramForm type="agent" />

## Shared content components

### FeatureBeta (parameterless)

<FeatureBeta />

### EarlyAccess (parameterless)

<EarlyAccess />

### FeatureBetaProps (with prop)

<FeatureBetaProps feature_name="Autoscaling" />

### EarlyAccessProps (with prop)

<EarlyAccessProps feature_name="Schema Diff" />

### AgentSkillsTip (with prop)

<AgentSkillsTip skill_topic="branching" />

### MCPTools

<MCPTools />

### LinkAPIKey

<LinkAPIKey />

### LRNotice

<LRNotice />

### ComingSoon

<ComingSoon />

### PrivatePreview

<PrivatePreview />

### PrivatePreviewEnquire

<PrivatePreviewEnquire />

### PublicPreview

<PublicPreview />

### LRBeta

<LRBeta />

### MigrationAssistant

<MigrationAssistant />

### NextSteps

<NextSteps />

### NewPricing

<NewPricing />

### AzureRegionsDeprecation

<AzureRegionsDeprecation />

### ConsumptionAccountApiDeprecation

<ConsumptionAccountApiDeprecation />

## Ignored components

<CopyPrompt src="/prompts/test.md" />

<NeedHelp />

<Comment>This is an MDX comment that should be stripped.</Comment>

<Video />

<UserButton />

<RequestForm />

<Suspense>Loading fallback...</Suspense>

<SqlToRestConverter />

<LogosSection logos={['vercel', 'cloudflare']} />

<ComputeCalculator />

<UseCaseContext />

## HTML passthrough

<details>
<summary>**Expandable section**</summary>

Content inside a details/summary block that should pass through as HTML.

- Nested list item one
- Nested list item two

</details>

Inline link with description: <a href="https://example.com" description="An example site">Example</a>

Line break in a table:

| Feature   | Status               |
| --------- | -------------------- |
| Branching | GA<br/>Available now |

## Nested components (known edge case)

<Admonition type="note" title="Code example">

<CodeTabs labels={["JavaScript", "Python"]}>

```javascript
const sql = neon(process.env.DATABASE_URL);
```

```python
conn = psycopg2.connect(os.environ["DATABASE_URL"])
```

</CodeTabs>

</Admonition>

## Markdown fundamentals

Regular paragraph with **bold**, _italic_, `inline code`, and a [link](/docs/introduction).

> A standard blockquote.

1. Ordered item one
2. Ordered item two

- Unordered item one
- Unordered item two

```sql
SELECT * FROM users WHERE active = true;
```

| Column | Type   | Description |
| ------ | ------ | ----------- |
| id     | serial | Primary key |
| name   | text   | User's name |
