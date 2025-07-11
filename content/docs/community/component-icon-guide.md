---
title: Neon Documentation MDX Components - Icon Guide
subtitle: Complete reference for all icon systems and usage
enableTableOfContents: true
updatedOn: '2025-07-11T19:24:20.300Z'
---

A comprehensive guide to all icon systems used in Neon documentation. This guide helps you understand which icon system to use and how to implement them correctly.

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to choose the right icon system for your use case</p>
<p>Which icons are available in each system</p>
<p>How to implement icons correctly in components</p>
<p>Best practices for icon usage and troubleshooting</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/community/component-guide">Component Guide</a>
<a href="/docs/community/component-specialized">Component Specialized Guide</a>
<a href="/docs/community/component-architecture">Component Architecture</a>
<a href="/docs/community/contribution-guide">Documentation Contribution Guide</a>
</DocsList>
</InfoBlock>

## Quick navigation

- [Icon system overview](#icon-system-overview) - Understanding the different icon systems
- [TechCards Icons](#techcards-icons) - Technology logos and frameworks
- [DetailIconCards Icons](#detailiconcards-icons) - Feature and service icons
- [Icon usage guidelines](#icon-usage-guidelines) - Best practices and conventions
- [Icon Decision Tree](#icon-decision-tree) - Which icon system to use when

---

## Icon system overview

Neon documentation uses multiple icon systems for different components. Understanding which system to use is crucial for proper implementation.

### Available icon systems

1. **TechCards Icons** - Colorful technology logos and framework icons
2. **DetailIconCards Icons** - Monochrome feature and service icons
3. **DocsList Icons** - Simple navigation and action icons

### Component compatibility

| Component           | Icon System           | Use Case                       |
| ------------------- | --------------------- | ------------------------------ |
| **TechCards**       | TechCards Icons       | Technology/framework showcases |
| **DetailIconCards** | DetailIconCards Icons | Feature/service showcases      |
| **DocsList**        | Built-in themes       | Documentation links            |

### Usage example

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
</DetailIconCards>
```

_For technical implementation details, see the [Icon Systems section](/docs/community/component-architecture#icon-systems) in the Component Architecture guide._

---

## Icon usage guidelines

### Choosing the right icon system

- **TechCards**: Use for technology and framework showcases
- **DetailIconCards**: Use for feature and service showcases
- **DocsList**: Use built-in themes for documentation links

### Icon naming conventions

- **TechCards**: Use kebab-case (e.g., `node-js`, `next-js`)
- **DetailIconCards**: Use camelCase or kebab-case as defined in the mapping
- **File Requirements**: Ensure SVG files exist in the correct directories

### Best practices

1. **Test your icons**: Always verify that your chosen icon works in the target component
2. **Check both systems**: If an icon doesn't work in one system, try the other
3. **Use descriptive names**: Choose icon names that clearly represent the technology or feature
4. **Document your choices**: Keep track of which icons work in which components
5. **Fallback gracefully**: Provide alternative text or descriptions when icons aren't available

---

### Component selection guide

| Use Case            | Component       | Icon System           | Example                |
| ------------------- | --------------- | --------------------- | ---------------------- |
| Technology showcase | TechCards       | TechCards Icons       | Node.js, React, Python |
| Feature showcase    | DetailIconCards | DetailIconCards Icons | OpenAI, AWS, Database  |
| Documentation links | DocsList        | Built-in themes       | Guides, API docs       |
| Simple navigation   | DocsList        | Built-in themes       | Related topics         |

---

## Troubleshooting

### Common issues

1. **Icon not displaying**: Check that the icon name exists in the correct system
2. **Wrong icon system**: Verify you're using the right component for your icon
3. **Missing files**: Ensure SVG files exist in the correct directories
4. **Case sensitivity**: Icon names are case-sensitive

### Testing icons

To test if an icon works:

1. **TechCards**: Check if `{icon}.svg` exists in `/public/images/technology-logos/`
2. **DetailIconCards**: Check if the icon is mapped in the component code
3. **DocsList**: Use the built-in themes (default, docs, repo)

### Getting help

- Review the [Component Architecture](/docs/community/component-architecture) for technical details
- Test icons in a development environment before using in production

---

## Complete icon showcase

### TechCards Icons (Technology Logos)

#### Programming Languages & Frameworks

<TechCards>
<a href="#" title="Bun" description="JavaScript runtime (icon: bun)" icon="bun">Bun</a>
<a href="#" title="Express" description="Node.js web framework (icon: express)" icon="express">Express</a>
<a href="#" title="Hasura" description="GraphQL API engine (icon: hasura)" icon="hasura">Hasura</a>
<a href="#" title="Hono" description="Web framework (icon: hono)" icon="hono">Hono</a>
<a href="#" title="Java" description="Programming language (icon: java)" icon="java">Java</a>
<a href="#" title="JavaScript" description="Programming language (icon: javascript)" icon="javascript">JavaScript</a>
<a href="#" title="Laravel" description="PHP framework (icon: laravel)" icon="laravel">Laravel</a>
<a href="#" title="Nest.js" description="Node.js framework (icon: nest-js)" icon="nest-js">Nest.js</a>
<a href="#" title="Next.js" description="React framework (icon: next-js)" icon="next-js">Next.js</a>
<a href="#" title="Node.js" description="JavaScript runtime (icon: node-js)" icon="node-js">Node.js</a>
<a href="#" title="Nuxt" description="Vue framework (icon: nuxt)" icon="nuxt">Nuxt</a>
<a href="#" title="Phoenix" description="Elixir framework (icon: phoenix)" icon="phoenix">Phoenix</a>
<a href="#" title="Python" description="Programming language (icon: python)" icon="python">Python</a>
<a href="#" title="Quarkus" description="Java framework (icon: quarkus)" icon="quarkus">Quarkus</a>
<a href="#" title="Rails" description="Ruby framework (icon: rails)" icon="rails">Rails</a>
<a href="#" title="React" description="JavaScript library (icon: react)" icon="react">React</a>
<a href="#" title="Redwood SDK" description="Full-stack framework (icon: redwoodsdk)" icon="redwoodsdk">Redwood SDK</a>
<a href="#" title="Reflex" description="Python framework (icon: reflex)" icon="reflex">Reflex</a>
<a href="#" title="Remix" description="React framework (icon: remix)" icon="remix">Remix</a>
<a href="#" title="Ruby" description="Programming language (icon: ruby)" icon="ruby">Ruby</a>
<a href="#" title="Rust" description="Programming language (icon: rust)" icon="rust">Rust</a>
<a href="#" title="Solid" description="JavaScript library (icon: solid)" icon="solid">Solid</a>
<a href="#" title="Svelte" description="JavaScript framework (icon: svelte)" icon="svelte">Svelte</a>
<a href="#" title="Symfony" description="PHP framework (icon: symfony)" icon="symfony">Symfony</a>
<a href="#" title="Vue" description="JavaScript framework (icon: vue)" icon="vue">Vue</a>
</TechCards>

#### Cloud & Infrastructure

<TechCards>
<a href="#" title="AWS S3 Bucket" description="Cloud storage service (icon: aws-s3-bucket)" icon="aws-s3-bucket">AWS S3 Bucket</a>
<a href="#" title="Backblaze" description="Cloud storage and backup (icon: backblaze)" icon="backblaze">Backblaze</a>
<a href="#" title="Heroku" description="Cloud platform (icon: heroku)" icon="heroku">Heroku</a>
<a href="#" title="Koyeb" description="Cloud platform (icon: koyeb)" icon="koyeb">Koyeb</a>
<a href="#" title="Netlify" description="Web hosting platform (icon: netlify)" icon="netlify">Netlify</a>
<a href="#" title="Railway" description="Deployment platform (icon: railway)" icon="railway">Railway</a>
<a href="#" title="Render" description="Cloud platform (icon: render)" icon="render">Render</a>
<a href="#" title="Vercel" description="Deployment platform (icon: vercel)" icon="vercel">Vercel</a>
</TechCards>

#### Databases & Data

<TechCards>
<a href="#" title="Convex" description="Backend platform (icon: convex)" icon="convex">Convex</a>
<a href="#" title="Entity" description="Data modeling tool (icon: entity)" icon="entity">Entity</a>
<a href="#" title="Estuary" description="Data streaming platform (icon: estuary)" icon="estuary">Estuary</a>
<a href="#" title="Exograph" description="GraphQL framework (icon: exograph)" icon="exograph">Exograph</a>
<a href="#" title="Ferret" description="Data processing tool (icon: ferret)" icon="ferret">Ferret</a>
<a href="#" title="Kafka" description="Stream processing platform (icon: kafka)" icon="kafka">Kafka</a>
<a href="#" title="Knex" description="SQL query builder (icon: knex)" icon="knex">Knex</a>
<a href="#" title="Liquibase" description="Database migration tool (icon: liquibase)" icon="liquibase">Liquibase</a>
<a href="#" title="Materialize" description="Streaming database (icon: materialize)" icon="materialize">Materialize</a>
<a href="#" title="Neon" description="Serverless Postgres (icon: neon)" icon="neon">Neon</a>
<a href="#" title="Neosync" description="Data synchronization (icon: neosync)" icon="neosync">Neosync</a>
<a href="#" title="Outerbase" description="Database interface (icon: outerbase)" icon="outerbase">Outerbase</a>
<a href="#" title="Polyscale" description="Database proxy (icon: polyscale)" icon="polyscale">Polyscale</a>
<a href="#" title="PostgreSQL" description="Database system (icon: postgresql)" icon="postgresql">PostgreSQL</a>
<a href="#" title="Prisma" description="ORM for Node.js (icon: prisma)" icon="prisma">Prisma</a>
<a href="#" title="Sequelize" description="ORM for Node.js (icon: sequelize)" icon="sequelize">Sequelize</a>
<a href="#" title="Sequin" description="Data synchronization (icon: sequin)" icon="sequin">Sequin</a>
<a href="#" title="Snowflake" description="Data warehouse (icon: snowflake)" icon="snowflake">Snowflake</a>
<a href="#" title="SQLAlchemy" description="Python ORM (icon: sqlalchemy)" icon="sqlalchemy">SQLAlchemy</a>
<a href="#" title="StepZen" description="GraphQL platform (icon: stepzen)" icon="stepzen">StepZen</a>
<a href="#" title="Supabase" description="Backend platform (icon: supabase)" icon="supabase">Supabase</a>
<a href="#" title="TypeORM" description="TypeScript ORM (icon: typeorm)" icon="typeorm">TypeORM</a>
<a href="#" title="Drizzle" description="TypeScript ORM (icon: drizzle)" icon="drizzle">Drizzle</a>
</TechCards>

#### Services & APIs

<TechCards>
<a href="#" title="Cloudinary" description="Cloud media management (icon: cloudinary)" icon="cloudinary">Cloudinary</a>
<a href="#" title="ImageKit" description="Image optimization (icon: imagekit)" icon="imagekit">ImageKit</a>
<a href="#" title="Inngest" description="Background job platform (icon: inngest)" icon="inngest">Inngest</a>
<a href="#" title="Micronaut" description="Java framework (icon: micronaut)" icon="micronaut">Micronaut</a>
<a href="#" title="Neo Tax" description="Tax calculation service (icon: neo-tax)" icon="neo-tax">Neo Tax</a>
<a href="#" title="OAuth" description="Authentication protocol (icon: oauth)" icon="oauth">OAuth</a>
<a href="#" title="Okta" description="Identity platform (icon: okta)" icon="okta">Okta</a>
<a href="#" title="Uploadcare" description="File handling service (icon: uploadcare)" icon="uploadcare">Uploadcare</a>
<a href="#" title="WunderGraph" description="API development platform (icon: wundergraph)" icon="wundergraph">WunderGraph</a>
</TechCards>

### DetailIconCards Icons (Feature Icons)

#### AI & Machine Learning

<DetailIconCards>
<a href="#" title="LangChain" description="AI framework (icon: langchain)" icon="langchain">LangChain</a>
<a href="#" title="LlamaIndex" description="Data framework for LLMs (icon: llamaindex)" icon="llamaindex">LlamaIndex</a>
<a href="#" title="Ollama" description="Local LLM framework (icon: ollama)" icon="ollama">Ollama</a>
<a href="#" title="OpenAI" description="AI platform (icon: openai)" icon="openai">OpenAI</a>
</DetailIconCards>

#### Development Tools

<DetailIconCards>
<a href="#" title="Atom" description="Code editor (icon: atom)" icon="atom">Atom</a>
<a href="#" title="Binary Code" description="Programming and code (icon: binary-code)" icon="binary-code">Binary Code</a>
<a href="#" title="Bug" description="Debugging and testing (icon: bug)" icon="bug">Bug</a>
<a href="#" title="CLI" description="Command line interface (icon: cli)" icon="cli">CLI</a>
<a href="#" title="CLI Cursor" description="Terminal cursor (icon: cli-cursor)" icon="cli-cursor">CLI Cursor</a>
<a href="#" title="Code" description="Programming and development (icon: code)" icon="code">Code</a>
<a href="#" title="GitHub" description="Code repository (icon: github)" icon="github">GitHub</a>
<a href="#" title="Hook" description="Development hooks (icon: hook)" icon="hook">Hook</a>
<a href="#" title="Ladder" description="Development progression (icon: ladder)" icon="ladder">Ladder</a>
<a href="#" title="Laptop" description="Development machine (icon: laptop)" icon="laptop">Laptop</a>
<a href="#" title="Setup" description="Configuration and setup (icon: setup)" icon="setup">Setup</a>
<a href="#" title="Wrench" description="Tools and utilities (icon: wrench)" icon="wrench">Wrench</a>
</DetailIconCards>

#### Business & Analytics

<DetailIconCards>
<a href="#" title="A Chart" description="Analytics and charts (icon: a-chart)" icon="a-chart">A Chart</a>
<a href="#" title="App Store" description="Application marketplace (icon: app-store)" icon="app-store">App Store</a>
<a href="#" title="Calendar Day" description="Scheduling and time (icon: calendar-day)" icon="calendar-day">Calendar Day</a>
<a href="#" title="Cards" description="Card-based interface (icon: cards)" icon="cards">Cards</a>
<a href="#" title="Check" description="Verification and approval (icon: check)" icon="check">Check</a>
<a href="#" title="Cheque" description="Payment processing (icon: cheque)" icon="cheque">Cheque</a>
<a href="#" title="Chart Bar" description="Data visualization (icon: chart-bar)" icon="chart-bar">Chart Bar</a>
<a href="#" title="CSV" description="Data format (icon: csv)" icon="csv">CSV</a>
<a href="#" title="Data" description="Data and information (icon: data)" icon="data">Data</a>
<a href="#" title="Metrics" description="Performance metrics (icon: metrics)" icon="metrics">Metrics</a>
<a href="#" title="Performance" description="System performance (icon: performance)" icon="performance">Performance</a>
<a href="#" title="Queries" description="Database queries (icon: queries)" icon="queries">Queries</a>
<a href="#" title="Research" description="Development research (icon: research)" icon="research">Research</a>
<a href="#" title="Stopwatch" description="Timing and performance (icon: stopwatch)" icon="stopwatch">Stopwatch</a>
<a href="#" title="Table" description="Data tables (icon: table)" icon="table">Table</a>
<a href="#" title="Todo" description="Task management (icon: todo)" icon="todo">Todo</a>
<a href="#" title="Transactions" description="Database transactions (icon: transactions)" icon="transactions">Transactions</a>
<a href="#" title="Trend Up" description="Growth and trends (icon: trend-up)" icon="trend-up">Trend Up</a>
</DetailIconCards>

#### UI & Design

<DetailIconCards>
<a href="#" title="Audio Jack" description="Audio connectivity (icon: audio-jack)" icon="audio-jack">Audio Jack</a>
<a href="#" title="Cards" description="Card-based interface (icon: cards)" icon="cards">Cards</a>
<a href="#" title="Gamepad" description="Gaming and interaction (icon: gamepad)" icon="gamepad">Gamepad</a>
<a href="#" title="GUI" description="Graphical user interface (icon: gui)" icon="gui">GUI</a>
<a href="#" title="Screen" description="Display and interface (icon: screen)" icon="screen">Screen</a>
<a href="#" title="Sparkle" description="Visual effects (icon: sparkle)" icon="sparkle">Sparkle</a>
<a href="#" title="User" description="User interface (icon: user)" icon="user">User</a>
</DetailIconCards>

#### Infrastructure & Services

<DetailIconCards>
<a href="#" title="Autoscaling" description="Automatic scaling (icon: autoscaling)" icon="autoscaling">Autoscaling</a>
<a href="#" title="AWS" description="Cloud computing platform (icon: aws)" icon="aws">AWS</a>
<a href="#" title="Branching" description="Database branching (icon: branching)" icon="branching">Branching</a>
<a href="#" title="Database" description="Database systems (icon: database)" icon="database">Database</a>
<a href="#" title="Discord" description="Communication platform (icon: discord)" icon="discord">Discord</a>
<a href="#" title="Download" description="File download (icon: download)" icon="download">Download</a>
<a href="#" title="Enable" description="Feature enablement (icon: enable)" icon="enable">Enable</a>
<a href="#" title="Filter" description="Data filtering (icon: filter)" icon="filter">Filter</a>
<a href="#" title="Find Replace" description="Search and replace (icon: find-replace)" icon="find-replace">Find Replace</a>
<a href="#" title="Gear" description="Settings and configuration (icon: gear)" icon="gear">Gear</a>
<a href="#" title="Globe" description="Global connectivity (icon: globe)" icon="globe">Globe</a>
<a href="#" title="Handshake" description="Partnerships and agreements (icon: handshake)" icon="handshake">Handshake</a>
<a href="#" title="Heroku" description="Cloud platform (icon: heroku)" icon="heroku">Heroku</a>
<a href="#" title="Hourglass" description="Time and waiting (icon: hourglass)" icon="hourglass">Hourglass</a>
<a href="#" title="Import" description="Data import (icon: import)" icon="import">Import</a>
<a href="#" title="Invert" description="Data transformation (icon: invert)" icon="invert">Invert</a>
<a href="#" title="Lock Landscape" description="Security and access control (icon: lock-landscape)" icon="lock-landscape">Lock Landscape</a>
<a href="#" title="Neon" description="Serverless Postgres (icon: neon)" icon="neon">Neon</a>
<a href="#" title="Network" description="Network connectivity (icon: network)" icon="network">Network</a>
<a href="#" title="Postgres" description="Database system (icon: postgres)" icon="postgres">Postgres</a>
<a href="#" title="Prisma" description="ORM for Node.js (icon: prisma)" icon="prisma">Prisma</a>
<a href="#" title="Privacy" description="Data privacy (icon: privacy)" icon="privacy">Privacy</a>
<a href="#" title="Puzzle" description="Problem solving (icon: puzzle)" icon="puzzle">Puzzle</a>
<a href="#" title="Refresh" description="Data refresh (icon: refresh)" icon="refresh">Refresh</a>
<a href="#" title="Respond Arrow" description="Response and feedback (icon: respond-arrow)" icon="respond-arrow">Respond Arrow</a>
<a href="#" title="Scale Up" description="Scaling and growth (icon: scale-up)" icon="scale-up">Scale Up</a>
<a href="#" title="Search" description="Search functionality (icon: search)" icon="search">Search</a>
<a href="#" title="Split Branch" description="Code branching (icon: split-branch)" icon="split-branch">Split Branch</a>
<a href="#" title="SQL" description="Database queries (icon: sql)" icon="sql">SQL</a>
<a href="#" title="Unlock" description="Access control (icon: unlock)" icon="unlock">Unlock</a>
<a href="#" title="Vercel" description="Deployment platform (icon: vercel)" icon="vercel">Vercel</a>
<a href="#" title="Wallet" description="Payment and billing (icon: wallet)" icon="wallet">Wallet</a>
<a href="#" title="Warning" description="Alerts and warnings (icon: warning)" icon="warning">Warning</a>
<a href="#" title="X" description="Close or cancel (icon: x)" icon="x">X</a>
</DetailIconCards>

---

## Summary

This guide provides an overview of Neon's icon systems and usage guidelines. For complete icon listings and detailed examples, refer to the [Component Showcase](/docs/community/component-showcase).

### Key takeaways

- **TechCards** uses colorful technology logos from `/public/images/technology-logos/`
- **DetailIconCards** uses monochrome feature icons mapped in component code
- **DocsList** uses built-in themes for simple navigation
- Always test icons in the target component before using
- Choose the right component based on your use case, not just the icon availability
