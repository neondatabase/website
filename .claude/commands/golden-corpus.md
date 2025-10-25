---
description: 'Golden corpus of exemplary Neon documentation for style, tone, and writing convention reference'
---

# Golden Corpus: Neon Documentation Examples

This curated list contains exemplary documentation files that demonstrate Neon's preferred style, tone, and writing conventions. Use these as reference examples for few-shot prompting when generating content of similar types.

## Purpose

Agents should identify the content type of their task and reference the corresponding golden corpus examples to:

- Match Neon's writing style and tone (clear, concise, developer-friendly)
- Follow established structural patterns
- Use consistent terminology and voice
- Apply appropriate formatting and MDX components
- Ensure technical accuracy and completeness
- Create scannable, human-friendly documentation

## Content Type Examples

**Note**: All file paths below are relative to `/Users/barry.grenon/website/`. For example, to read the Data API demo, use: `Read("content/docs/data-api/demo.md")`

### Tutorial Content

**Use these for**: Hands-on learning, progressive tutorials, step-by-step guides with exercises

- `content/docs/data-api/demo.md` - Progressive hands-on tutorial with real working app, screenshots, and user exercises
  - **Exemplary features**: Schema explanation, CRUD walkthrough, hands-on "Build Delete Functionality" exercise, code highlighting with markers, live demo, security-first approach
- `content/docs/guides/rls-tutorial.md` - Security tutorial through experimentation and demonstration
  - **Exemplary features**: Learning through breaking things, visual proof of data leaks, before/after security narratives, hands-on code modifications

### Getting Started Guides

**Use these for**: Onboarding, framework-specific setup, initial configuration

- `content/docs/guides/nextjs.md` - Comprehensive framework integration guide
  - **Exemplary features**: Multiple framework patterns (App Router, Pages Router, Edge), CodeTabs for driver options, clear prerequisites, progressive steps, 6+ example repositories
- `content/docs/data-api/get-started.md` - Security fundamentals and initial setup
  - **Exemplary features**: Clear separation of Database Permissions vs RLS, multiple code options (SQL, Drizzle), step-by-step UI instructions with screenshots, complete working example, three-language client examples

### Concept and Overview Pages

**Use these for**: Feature explanations, conceptual understanding, architectural overviews

- `content/docs/introduction/branching.md` - Core feature explanation with visuals
  - **Exemplary features**: Clear definition, visual diagrams, embedded video, multiple use case workflows, restore window trade-offs, plan tier comparison
- `content/docs/guides/neon-rls.md` - Technical security concept with architecture
  - **Exemplary features**: Architecture diagram showing JWT flow, before/after code comparison, concrete use cases, comprehensive provider table (15+ auth providers), limitations transparency, 8+ sample applications

### How-To Guides

**Use these for**: Task-oriented instructions, specific operations, configuration steps

- `content/docs/guides/branching-test-queries.md` - Simple, focused step-by-step guide
  - **Exemplary features**: Clear problem statement, example dataset, screenshot-guided UI steps, CLI and API alternatives (curl examples), concrete test scenario, results verification
- `content/docs/guides/autoscaling-guide.md` - Configuration guide with practical tips
  - **Exemplary features**: Multiple configuration levels, default values table, monitoring section, practical decision guidance ("Start with a good minimum"), tip admonition boxes

### Reference Documentation

**Use these for**: Technical specifications, API reference, comprehensive configuration details

- `content/docs/connect/connection-pooling.md` - Technical reference with comprehensive tables
  - **Exemplary features**: Problem-solution structure, comprehensive max_connections table (56 rows), PgBouncer configuration transparency, limitations section, prepared statements examples (SQL + protocol-level), troubleshooting guidance
- `content/docs/guides/prisma.md` - ORM reference with troubleshooting
  - **Exemplary features**: Comprehensive troubleshooting section, exact error messages users encounter, connection pool formula explanations, configuration examples showing both good and bad patterns, cross-references to external docs

### Integration Guides

**Use these for**: Third-party integrations, platform connections, end-to-end workflows

- `content/docs/guides/vercel-overview.md` - Integration decision framework
  - **Exemplary features**: Decision tree structure, comparison table for 3 integration options, quick decision guide, color-coded DetailIconCards, checklist for getting started
- `content/docs/guides/vercel-managed-integration.md` - Complete integration workflow
  - **Exemplary features**: Steps component for 7 numbered steps, preview branching webhook diagram, environment variables table, FAQ-style operations, limitation transparency, schema migration integration
- `content/docs/guides/logical-replication-guide.md` - Hub-and-spoke integration index
  - **Exemplary features**: Serves as index to 20+ specialized guides, publisher-subscriber explanation, categorized destination/source links, tech cards layout for scanning
- `content/docs/guides/neon-github-integration.md` - CI/CD integration with workflow examples
  - **Exemplary features**: "How it works" section before setup, installation walkthrough, complete GitHub Actions YAML workflow, commented options users can enable, security warnings

### Framework and ORM Guides

**Use these for**: Language/framework-specific integrations, driver usage, ORM setup

- `content/docs/guides/drizzle.md` - Type-safe ORM integration
  - **Exemplary features**: Related resources InfoBlock upfront, two connection approaches (basic + Neon serverless adapter), copy-paste ready code, prerequisite clarity, AI rules link
- `content/docs/guides/aws-lambda.md` - Serverless platform integration
  - **Exemplary features**: Prerequisites upfront, CLI interaction transcript, table creation in SQL Editor, connection persistence pattern (client initialization outside handler), error handling, environment variable setup

### Index and Hub Pages

**Use these for**: Topic organization, navigation pages, content collections

- `content/docs/guides/branching-intro.md` - Topic hub with organized navigation
  - **Exemplary features**: Hub-and-spoke layout to branching docs, 6 sections with DetailIconCards, organized progression from concepts → automation → examples, links to 3 working demo repositories

## Usage Guidelines

1. **Identify content type** first based on your task requirements
2. **Select corresponding examples** from the appropriate category above
3. **Load and analyze** the example content for style patterns using the Read tool
4. **Apply similar structure** and tone to your generated content
5. **Maintain consistency** with Neon terminology and voice
6. **Use MDX components** appropriately (CodeTabs, Steps, Admonition, DetailIconCards, InfoBlock)

## Neon Documentation Best Practices

When referencing these examples, pay attention to:

### Structure and Scannability
- **Heading hierarchy** (H1 for page title, H2 for major sections, H3 for subsections, avoid H4+)
- **Scannable headings** that allow users to find information without excessive scrolling
- **Progressive disclosure** - start simple, introduce complexity gradually
- **Hub-and-spoke patterns** for organizing many related guides

### Visual Elements
- **Screenshots** for UI-based steps (numbered steps with arrows/highlights)
- **Architecture diagrams** for explaining system flows (JWT flow, webhook flow, etc.)
- **Code syntax highlighting** with `[!code highlight]` markers for emphasis
- **Embedded videos** for processes that benefit from motion
- **Before/after comparisons** for security or best practice teaching

### Code Examples
- **Complete, working examples** that can be copy-pasted (not just snippets)
- **CodeTabs component** for presenting alternatives (languages, drivers, approaches)
- **Multi-language examples** when relevant (JavaScript, Python, Go, etc.)
- **Environment configuration** clearly shown (`.env` files, connection strings)
- **Error handling** included in code samples

### Interactive Elements
- **Hands-on exercises** where readers implement something themselves
- **Test scenarios** with verification steps (SELECT COUNT queries, etc.)
- **Live demos** and working example repositories linked
- **CLI/API alternatives** in CodeTabs when UI instructions exist

### User Guidance
- **Prerequisites upfront** - exact requirements before starting
- **Related resources blocks** - InfoBlock at top with links to docs, external resources, sample repos
- **Tip/warning admonitions** for important notes and gotchas
- **Limitations sections** - transparently document what's not supported
- **Troubleshooting sections** - common error messages and solutions

### Security and Best Practices
- **Security-first approach** - teach RLS before CRUD operations
- **Real error messages** - show actual errors users will encounter
- **Common pitfalls** - warn about issues like search path with connection pooling
- **Connection patterns** - show proper resource management (pooling, persistence)

### Voice and Tone
- **Developer-friendly** - practical, concise, no marketing fluff
- **Clear and direct** - get to the point quickly
- **Present tense, active voice** - "You create a branch" not "A branch is created"
- **Authoritative but accessible** - technical depth appropriate for developers
- **Practical examples** - real-world use cases over abstract concepts

### Navigation and Linking
- **Cross-references** to related documentation
- **External documentation links** (to Prisma, Drizzle, framework docs, etc.)
- **Example repositories** on GitHub with working code
- **Decision frameworks** (flow charts, comparison tables) for complex choices

---

**Note**: Always load the actual content of relevant examples before generating new content to ensure accurate style matching and consistency with current Neon documentation standards. The examples above represent the highest-quality documentation in the Neon library and should serve as templates for creating new pages.
