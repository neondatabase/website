---
description: 'Prime documentation agents with essential project structure, key references, and major content categories for Neon documentation'
---

# docs-prime: Neon Documentation Project Primer

This command provides agents comprehensive knowledge of the Neon documentation project structure, key reference files, and major content categories. Use this to understand the documentation ecosystem before working on content tasks.

## Project Architecture Overview

### Directory Structure

```
/Users/barry.grenon/website/
├── content/                # All markdown/MDX content
│   ├── docs/              # Technical documentation (~600+ files)
│   │   ├── introduction/  # Core concepts and architecture
│   │   ├── get-started-with-neon/  # Onboarding content
│   │   ├── guides/        # How-to guides and integrations
│   │   ├── manage/        # Administrative tasks
│   │   ├── connect/       # Connection guides
│   │   ├── data-api/      # Data API documentation
│   │   └── reference/     # API, CLI, technical reference
│   ├── changelog/         # Product updates and release notes
│   ├── guides/            # Additional guides
│   ├── postgresql/        # PostgreSQL tutorials (~150+ files)
│   └── branching/         # Branching feature documentation
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── pages/        # Page-specific components
│   │   └── shared/       # Reusable components
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
├── public/
│   ├── docs/             # Documentation images
│   └── llms/             # LLM-specific content files
├── .claude/
│   ├── agents/           # Specialized documentation agents
│   └── commands/         # Custom slash commands
└── CLAUDE.md             # Project-specific development guidelines
```

### Build System

**IMPORTANT**: Never start a build to validate outputs unless explicitly requested by the user.

- **Framework**: Next.js 14 with App Router
- **Content**: MDX for documentation (in `content/` directory)
- **Styling**: Tailwind CSS
- **Dev server**: `npm run dev` (http://localhost:3000)
- **Production build**: `npm run build`
- **Testing**: `npm run test` (Cypress for E2E)

### Navigation Hierarchy

- **Primary navigation**: `content/docs/navigation.yaml`
- **Structure**: Hierarchical YAML defining sidebar organization
- **Cross-references**: Use `rg "page-name" content/` to find placement

### File Naming and Placement Conventions

**File naming patterns:**

- **Markdown files**: Use hyphens, not underscores: `connection-pooling.md` (not `connection_pooling.md`)
- **Images**: Use underscores instead of dashes: `my_image.png` (not `my-image.png`)
- Descriptive names: `autoscaling-guide.md` (not `scaling.md` or `auto.md`)
- Match URL structure: `/content/docs/guides/nextjs.md` → neon.tech/docs/guides/nextjs

**File placement rules:**

- **Concepts/overviews** → `/content/docs/introduction/`
- **Getting started** → `/content/docs/get-started-with-neon/`
- **How-to guides** → `/content/docs/guides/`
- **Integration guides** → `/content/docs/guides/` (framework/platform-specific)
- **API/Reference** → `/content/docs/reference/`
- **PostgreSQL tutorials** → `/content/postgresql/`
- **Feature docs** → Appropriate subdirectory based on feature category

### Content Hierarchy Patterns

**Typical documentation flow:**

```
Introduction/Overview (concept)
  ├─ Getting Started Guide (tutorial)
  ├─ How-to Guides (tasks)
  ├─ Integration Guides (framework-specific)
  └─ Reference (API/CLI/technical specs)
```

**Navigation relationships:**

- **Parent pages** contain high-level overviews and navigation
- **Child pages** provide specific implementations and details
- **Sibling pages** share the same level of specificity

## Major Documentation Categories

The Neon documentation is organized into clear categories:

**Core Product Documentation** (`content/docs/`):
- **Introduction**: Concepts, architecture, features (branching, autoscaling, etc.)
- **Get Started**: Onboarding, signing up, connecting to Neon
- **Guides**: How-to guides, framework integrations, feature guides
- **Manage**: Administrative tasks (projects, databases, users, API keys)
- **Connect**: Connection guides (connection pooling, serverless drivers)
- **Data API**: Data API documentation and tutorials
- **Reference**: CLI reference, API reference, compatibility, SQL reference

**PostgreSQL Learning** (`content/postgresql/`):
- PostgreSQL tutorials and educational content
- Database concepts and best practices
- SQL tutorials

**Product Updates** (`content/changelog/`):
- Release notes and product changes
- New feature announcements

## Gold-Standard Mini Corpus (Stylistic Examples)

Your primary source for style, tone, and structure is the predefined list of "gold-standard" documents in the `/golden-corpus` slash command. Use these as in-context examples for any content generation or review.

To load the golden corpus, use the `/golden-corpus` slash command.

## Critical Reference Files

### Content Structure and Navigation

- **`content/docs/navigation.yaml`**: Primary documentation navigation hierarchy
- **`CLAUDE.md`**: Project-specific development guidelines and Neon context

### Technical Configuration

- **`next.config.js`**: Next.js configuration
- **`tailwind.config.js`**: Tailwind CSS customization
- **`tsconfig.json`**: TypeScript configuration

### Development Guidelines

- **`.claude/agents/`**: Specialized agents for documentation tasks
- **`.claude/commands/`**: Custom slash commands for workflows

## MDX and Components

Neon docs use MDX (Markdown + JSX) with custom components.

**IMPORTANT**: For comprehensive component documentation, refer to the community guides:
- **`content/docs/community/component-guide.md`** - Most commonly used components with examples
- **`content/docs/community/component-specialized.md`** - Advanced/specialized components
- **`content/docs/community/component-icon-guide.md`** - Icon usage and available icons
- **`content/docs/community/component-architecture.md`** - Component architecture and technical details
- **`content/docs/community/contribution-guide.md`** - Style guidelines and markdown syntax

**Common Components** (see component-guide.md for full details):
- `<Admonition>` - Notes, tips, warnings, important callouts (6 types)
- `<Steps>` - Numbered step-by-step instructions (use H2 headings)
- `<CodeTabs>` - Multi-language/framework code examples
- `<CodeBlock>` - Syntax-highlighted code with copy button
- `<DetailIconCards>` - Visual navigation cards for hub pages
- `<InfoBlock>` - Related resources and navigation
- `<DocsList>` - Lists of related documentation
- `<Tabs>` and `<TabItem>` - Tabbed content sections
- `<FeatureBetaProps>` - Beta feature indicators
- `<NeedHelp/>` - Support callout (typically at end of guides)

**MDX Syntax:**
- Import components: `import { Component } from '@/components'`
- Use JSX syntax for components
- Markdown for content
- Frontmatter for metadata (title, subtitle, enableTableOfContents, etc.)

**When working with components**, always consult the community guides for:
- Proper syntax and prop usage
- Live examples and previews
- Best practices and when to use each component
- Icon names and usage patterns

## Content Style and Tone

**Neon Voice Characteristics:**
- **Developer-first**: Practical, actionable, no marketing fluff
- **Clear & Concise**: Short sentences, active voice
- **Approachable**: Use contractions, conversational tone
- **Precise**: Technically accurate without being academic

**Key Terminology:**
- **Neon** (not "the Neon platform" or "Neon database")
- **Serverless Postgres** (capitalize both words)
- **compute** (lowercase, Neon-specific term)
- **branch** (database branch, not git branch - context matters)
- **project** (top-level Neon organization unit)

## Navigation and Cross-References

**Internal linking:**
- Use relative paths: `/docs/guides/nextjs`
- Include descriptive link text
- Link to related concepts and guides
- Add "Prerequisites" sections when needed

**Cross-reference patterns:**
- "See [Page Title](/docs/path/to/page) for more information."
- "For details, refer to [Concept Name](/docs/introduction/concept)."
- Link to related framework guides, integration docs, API references

## Common Documentation Patterns

### Tutorial Pages
- Clear prerequisites upfront
- Step-by-step instructions with `<Steps>` component
- Code examples with `<CodeTabs>` for multiple languages/frameworks
- Screenshots for UI-based steps
- "What's next" or related links at the end

### Integration Guides
- Framework/platform-specific setup
- Multiple driver options with `<CodeTabs>`
- Environment configuration (`.env` files)
- Working example repositories on GitHub
- Troubleshooting section

### Reference Pages
- Comprehensive tables for options/parameters
- Command syntax with examples
- API endpoint specifications
- Clear organization by topic

### Concept Pages
- Clear definition of the concept
- Why it matters / use cases
- Visual diagrams when helpful
- Links to implementation guides
- Related concepts

---

**Usage**: This primer provides foundational knowledge for working effectively within the Neon documentation ecosystem. Reference specific sections as needed when working on documentation tasks.
