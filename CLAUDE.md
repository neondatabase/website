# Neon Website Repository Context

## Project Overview

This is the Neon database company's marketing website and documentation hub. It's built with Next.js and serves multiple purposes:

- Marketing pages for Neon's serverless Postgres platform
- Comprehensive technical documentation
- PostgreSQL tutorials and learning resources
- Blog and changelog

**Live Site:** https://neon.tech (or neon.com)

## Tech Stack

- **Framework:** Next.js 14 (React 18, App Router)
- **Styling:** Tailwind CSS with custom components
- **Content:** MDX for documentation (in `content/` directory)
- **Database:** Prisma (for some features)
- **Search:** Algolia for documentation search
- **Animations:** GSAP, Framer Motion, Rive
- **Code Highlighting:** Shiki
- **Testing:** Cypress for E2E tests

## Project Structure

```
/Users/barry.grenon/website/
├── content/              # All markdown content
│   ├── docs/            # Technical documentation
│   ├── changelog/       # Product updates
│   ├── guides/          # How-to guides
│   ├── postgresql/      # PostgreSQL tutorials
│   └── branching/       # Branching feature docs
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── pages/       # Page-specific components
│   │   └── shared/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   └── styles/          # Global CSS
├── public/              # Static assets
│   ├── docs/            # Documentation images
│   └── llms/            # LLM-specific content files
└── prisma/              # Database schema
```

## Key Commands

### Development

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Run production build
```

### Code Quality

```bash
npm run lint             # Lint JS and Markdown
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format with Prettier
```

### Testing

```bash
npm run test             # Open Cypress
npm run check:broken-links -- https://neon.com  # Check for broken links
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

- Algolia search credentials (required for blog pages)
- See internal Notion page for values

## Content Guidelines

### Documentation (content/docs/)

- Written in Markdown with MDX support
- Navigation defined in `content/docs/navigation.yaml`
- Images go in `public/docs/`
- Follow existing structure and formatting

### Code Style

- ESLint config based on Airbnb style guide
- Prettier for formatting
- Auto-format on save recommended

### Component Structure

Each component should have:

- Main JavaScript file (e.g., `component-name.jsx`)
- Index file for exports
- Optional: images/, data/ subdirectories
- Nested components follow same structure

## Important Files to Know

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind customization
- `content/docs/navigation.yaml` - Docs navigation structure
- `src/utils/` - Helper functions and utilities

## Common Tasks

### Adding Documentation

1. Create `.md` file in appropriate `content/docs/` subdirectory
2. Add entry to `content/docs/navigation.yaml`
3. Add images to `public/docs/`
4. Test locally with `npm run dev`

### Updating Components

1. Find component in `src/components/`
2. Edit `.jsx` file
3. Check for TypeScript-like PropTypes validation
4. Test changes in browser

### Working with MDX

- Use frontmatter for metadata
- Import React components with MDX syntax
- Code blocks support syntax highlighting via Shiki

## Build Process

1. `predev`/`prebuild`: Generates docs icons config
2. `build`: Next.js build
3. `postbuild`: Copies docs MD files and generates sitemaps

## Common MDX Components

### Navigation and Layout
- **InfoBlock + DocsList** - Related documentation, learning objectives, sample projects
- **DetailIconCards** - Hub/landing pages with visual navigation cards
- **Steps** - Sequential tutorials with numbered steps
- **Tabs + TabItem** - Platform-specific or multi-option content

### Content Enhancement
- **Admonition** - Notes, tips, warnings, important callouts (types: note, tip, warning, important)
- **CodeTabs** - Multi-language/framework code examples
- **FeatureBetaProps** - Beta feature indicators

### When to Use InfoBlock vs DetailIconCards
- **InfoBlock**: Use on tutorials and guides for related docs and learning objectives
- **DetailIconCards**: Use on hub/overview pages for visual navigation to sub-topics

## Documentation Style Reference

For style, tone, and structure examples, use the `/golden-corpus` slash command to load appropriate examples based on content type:
- Tutorial content
- Getting started guides
- Concept and overview pages
- How-to guides
- Reference documentation
- Integration guides
- Framework/ORM guides
- Index and hub pages

## Notes for AI Assistants

- This is a documentation-heavy website with ~1000+ markdown files
- Performance matters - the site serves global audience
- Accessibility is important - follow WCAG guidelines
- Images are optimized via Next.js Image component
- The codebase uses both pages/ and app/ directory (migration in progress)
- Don't modify `node_modules/` or generated files
- Respect existing code style and component patterns
