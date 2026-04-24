# Neon Website Repository Context

## Project Overview

This is the Neon database company's marketing website and documentation hub. It's built with Next.js and serves multiple purposes:

- Marketing pages for Neon's serverless Postgres platform
- Comprehensive technical documentation
- PostgreSQL tutorials and learning resources
- Blog and changelog

**Live site:** <https://neon.tech> (also neon.com)

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

```text
website/
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

Multiple team members clone this repo to different local paths. Never hardcode a local path in documentation or scripts.

## Key Commands

### Development

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Run production build
```

### Code Quality

```bash
npm run fix              # Fix JS, markdown, and formatting (run before committing)
npm run lint             # Check JS and Markdown without modifying files
npm run format           # Run Prettier only (subset of fix)
```

### Testing

```bash
npm run test             # Open Cypress
npm run check:broken-links -- https://neon.com  # Check for broken links
```

## Git Workflow

Standard GitHub flow. Before every commit, run:

```bash
npm run fix
```

This lints JS and markdown and formats all files in one pass. To check without modifying files, use `npm run lint`.

Then commit and open a PR targeting `main`. No special push commands needed (`git push` is fine).

## Environment Setup

Copy `.env.example` to `.env` and configure. See internal Notion page for values.

## Content Guidelines

### Authoritative MDX reference

`content/docs/README.md` is the canonical reference for all MDX components, code block syntax, and navigation structure. Check it first when in doubt.

### content/docs/ — Neon technical documentation

Official Neon documentation written and maintained by the Neon docs team. All pages go through a full review process. New pages require an entry in `content/docs/navigation.yaml`.

1. Create `.md` file in the appropriate `content/docs/` subdirectory
2. Add an entry to `content/docs/navigation.yaml`
3. Add images to `public/docs/` (mirroring the doc path)
4. Test locally with `npm run dev`

### content/guides/ — Third-party integration guides

Community and third-party contributed guides showing how to use Neon with other technologies, frameworks, and services. These go through a lighter review process than core docs. Guides do **not** require a `navigation.yaml` entry — they are surfaced through their own index. Follow the same frontmatter and style conventions as `content/docs/` unless a guide contributor has a specific format.

### Updating components

1. Find the component in `src/components/`
2. Edit the `.jsx` file
3. Check PropTypes validation
4. Test in the browser

## Frontmatter Fields

Every docs page requires `title`. All other fields are optional.

| Field                   | Description                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `title`                 | Page title. The `h1` is auto-generated from this. Do not add an `h1` in the file. **Required.**                                    |
| `subtitle`              | Subtitle shown below the title.                                                                                                    |
| `summary`               | SEO description / meta summary.                                                                                                    |
| `tag`                   | Badge shown in the nav. Values: `new`, `beta`, `coming soon`, `deprecated`, or custom text. Also add the tag to `navigation.yaml`. |
| `redirectFrom`          | Array of old paths to redirect from. Each path must start and end with `/`.                                                        |
| `isDraft`               | `true` hides the page from production but keeps it visible in dev.                                                                 |
| `enableTableOfContents` | `true` shows the h2/h3 outline panel on the right.                                                                                 |
| `ogImage`               | Social preview image path.                                                                                                         |
| `updatedOn`             | ISO 8601 timestamp, auto-managed. Don't set manually.                                                                              |
| `layout`                | Set to `wide` to hide the right sidebar (use with `TwoColumnLayout` pages).                                                        |

The build will fail if any `.md` file in `content/docs/` is missing `title`.

## Changelog Format

Files live in `content/changelog/` with the filename `YYYY-MM-DD.md`.

**Frontmatter:** Only `title` — a short plain-text summary of the main items in the entry.

**Structure:**

- Major features and changes: `##` (h2) heading, full prose description
- Sub-topics within a major item: `###` (h3) heading
- Minor items (bug fixes, small updates): wrap in `<details>` with a `<summary>` — no h2 heading

**Example structure:**

```md
---
title: Feature X, improvement Y, and more
---

## Feature X

Description of the major feature...

## Improvement Y

Description of the improvement...

<details>
<summary>**Bug fixes**</summary>

Fixed an issue where...

</details>
```

## Navigation (content/docs/navigation.yaml)

The navigation file drives both the header nav and the left sidebar. Top-level items appear in the header; their `items` populate the sidebar.

**Add a page:**

```yaml
- title: My New Page
  slug: guides/my-new-page
```

**Add a section:**

```yaml
- section: My Section
  icon: settings
  items:
    - title: Page One
      slug: guides/page-one
```

`title` in `navigation.yaml` may differ from `title` in the page frontmatter — the nav title can be shorter. `slug` must always match the file path relative to `content/docs/`, without the `.md` extension.

Tags (`new`, `beta`, etc.) set in frontmatter must also be added to the corresponding nav entry for the badge to appear.

## Writing Style

The voice should sound like one human being explaining something to another — approachable and professional, not stiff or overly formal.

### Voice and language

- **Contractions:** Use them (it's, don't, you're). They make the tone more conversational. Don't overuse to the point of sacrificing clarity.
- **Active voice:** Prefer it. "The software converts the file" not "The file is converted by the software."
- **Simple language:** Choose simpler words. "Use the tool" not "Utilize the instrument."
- **Concise sentences:** Keep them short. Don't pad.
- **Address the reader:** Use "you" but don't start every sentence with it.
- **Consistent terminology:** Pick one term per concept and stick to it. Don't mix "dashboard" and "control panel."
- **US English:** Use US spelling and grammar throughout.
- **No emojis or exclamation marks** in documentation.
- **No em dashes (—):** Restructure the sentence instead.

### Capitalization

- Use lowercase wherever possible.
- Page titles: sentence case ("Create your first project", not "Create Your First Project").
- Product names: follow official capitalization (PostgreSQL, GitHub, npm, Vercel).
- UI text: match the interface exactly.
- Feature names: lowercase by default.
- Methods/methodologies: capitalize (Continuous Integration, Continuous Deployment).

### Links

Link to the source instead of repeating information. Explain why the linked content matters in context.

### Fake user information

Never use real user data in examples.

- Emails: use `@example.com` or `@domain.com`
- Usernames: `example_username`, Zhang Kai, Alex Lopez, or Dana Smith
- Passwords: `AbC123dEf`
- Database names: `dbname`

### Connection strings

Standard format:

```text
postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

Example with realistic values:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

### Commands, parameters, filenames

Enclose in backticks: `neon projects list`, `git clone`, `postgresql://...`

## Code Blocks

See `content/docs/README.md` for full syntax. Key features:

### Line highlighting

````text
```sql {1,3-5}
````

### Filename label

````text
```bash filename="Terminal"
````

### Flags

- `showLineNumbers` — shows line numbers
- `shouldWrap` — enables line wrapping (use for long commands)

### Diff notation

```ts
const x = 'old'; // [!code --]
const x = 'new'; // [!code ++]
```

### Word/line highlight

```ts
const msg = 'Hello World'; // [!code highlight]
// [!code word:Hello]
```

## MDX Components

See `content/docs/README.md` for full syntax and `content/docs/community/component-guide.md` for usage guidance with live previews.

### Essential components

**Admonition** — Callouts for notes, warnings, and tips.

Types: `note` (default), `important`, `tip`, `info`, `warning`, `comingSoon`

```mdx
<Admonition type="tip" title="Pro tip">
Optional information to help a user be more successful.
</Admonition>
```

**Callout** — Supplementary context or best practices. Less urgent than Admonition. Default label is "Good to know".

```mdx
<Callout title="Before you start">
Make sure you have Node.js 18+ installed.
</Callout>
```

Use Callout for neutral "good to know" info. Use Admonition when missing the information could cause user error.

**Steps** — Numbered sequential steps, split by `##` headings.

```mdx
<Steps>

## Step one

Do this first.

## Step two

Then do this.

</Steps>
```

### Tabbed content

**CodeTabs** — Multi-language code examples with tabs.

````mdx
<CodeTabs labels={["JavaScript", "Python"]}>

```javascript
const client = new Client({ connectionString: process.env.DATABASE_URL });
````

```python
conn = psycopg2.connect(os.environ["DATABASE_URL"])
```

</CodeTabs>
```

**Tabs + TabItem** — General tabbed content (non-code). For code tabs, use CodeTabs instead.

```mdx
<Tabs labels={["Console", "CLI", "API"]}>
<TabItem>
Console instructions here.
</TabItem>
<TabItem>
CLI instructions here.
</TabItem>
</Tabs>
```

### Navigation and hub pages

**DetailIconCards** — Card grid for feature or service showcases. Uses monochrome icons. Best for hub/overview pages.

```mdx
<DetailIconCards>
<a href="/docs/ai/langchain" description="Create AI workflows with LangChain" icon="langchain">LangChain</a>
</DetailIconCards>
```

**TechCards** — Card grid for technology/framework showcases. Uses colorful technology logos. Different icon system from DetailIconCards.

```mdx
<TechCards>
<a href="/docs/guides/node" title="Node.js" description="Connect Node.js apps to Neon" icon="node-js">Node.js</a>
</TechCards>
```

See `content/docs/community/component-icon-guide.md` for available icons for both components.

**InfoBlock + DocsList** — Multi-column layout for page introductions. Combine learning objectives with related links.

```mdx
<InfoBlock>
<DocsList title="What you will learn:">
<p>How to create a project</p>
<p>How to connect</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/branching">About branching</a>
</DocsList>
</InfoBlock>
```

DocsList `theme` values: default (checkbox icon), `docs` (document icon), `repo` (repository icon).

Use InfoBlock on tutorials and guides. Use DetailIconCards on hub/overview pages.

### Structured layouts

**TwoColumnLayout** — Two-column layout for tutorials and reference docs. Add `layout: wide` to frontmatter to hide the right sidebar.

Subcomponents:

- `TwoColumnLayout.Step` — Numbered step with `title` prop (for tutorials)
- `TwoColumnLayout.Item` — Default item with `title`, `method`, and `id` props
- `TwoColumnLayout.Block` — Content block with optional `label` prop
- `TwoColumnLayout.Footer` — Full-width content at the bottom of a step

**FeatureList** — Visual feature list, split by `##` and `###` headings. Supports an `icons` prop.

```mdx
<FeatureList>

### Instant provisioning

Create databases in seconds.

### Autoscaling

Scale compute up and down automatically.

</FeatureList>
```

**DefinitionList** — Accessible term/definition lists for technical terms.

```mdx
<DefinitionList>

Connection pool
: A cache of database connections
: Improves performance by reusing connections

</DefinitionList>
```

### Interactive elements

**CheckList + CheckItem** — Interactive checklist saved in browser local storage. Best used alongside Steps.

```mdx
<CheckList title="Setup checklist">
<CheckItem title="Install dependencies" href="#install">Install Node.js and npm.</CheckItem>
<CheckItem title="Configure env" href="#env">Set DATABASE_URL.</CheckItem>
</CheckList>
```

**CTA** — Call-to-action block with title, description, and button.

```mdx
<CTA title="Try it on Neon" description="Sign up for a free account." buttonText="Sign Up" buttonUrl="https://console.neon.tech/signup" />
```

**CopyPrompt** — Displays a copyable LLM prompt from a file. Prompt files go in `public/prompts/`.

```mdx
<CopyPrompt src="/prompts/my-prompt.md" displayText="Use this prompt to get started." buttonText="Copy prompt" />
```

### External content

**ExternalCode** — Embeds code from an external URL with syntax highlighting. Always use raw GitHub URLs.

```mdx
<ExternalCode url="https://raw.githubusercontent.com/neondatabase/neon/main/README.md" />
```

**YoutubeIframe** — Embeds a YouTube video.

```mdx
<YoutubeIframe embedId="IcoOpnAcO1Y" />
```

### Shared components

**NeedHelp** — Standard "need help?" footer block. Insert as `<NeedHelp/>`.

## Images

Images for docs pages go in `public/docs/`, mirroring the content path.

```text
public/docs/guides/my-feature.png   ← image
content/docs/guides/my-feature.md  ← doc
```

Reference in markdown:

```md
![Alt text](/docs/guides/my-feature.png)
```

To show an image without a border (for annotated UI screenshots):

```md
![Alt text](/docs/guides/my-feature.png 'no-border')
```

## Important Files

| File                                              | Purpose                                   |
| ------------------------------------------------- | ----------------------------------------- |
| `next.config.js`                                  | Next.js configuration                     |
| `tailwind.config.js`                              | Tailwind customization                    |
| `content/docs/navigation.yaml`                    | Docs navigation structure                 |
| `content/docs/README.md`                          | Authoritative MDX and component reference |
| `content/docs/community/component-guide.md`       | Component usage guide with live previews  |
| `content/docs/community/component-specialized.md` | Specialized and less common components    |
| `content/docs/community/contribution-guide.md`    | Style guide and contribution guidelines   |

## Claude Commands

All commands live in `.claude/commands/`. Run with `/command-name`. Run `/list-doc-tools` to see the full list with descriptions.

### Writing content

Use `/write-content` for new pages or substantial rewrites. It runs a full multi-agent pipeline: IA specialist determines structure and placement, a drafter writes the content, a refiner reviews it, and a syntax validator checks MDX compliance. It is thorough but heavyweight.

Use `/simple-content` for edits to existing pages, shorter additions, or when you want to stay in control at each step. Claude handles everything in a single thread with a confirmation prompt after each stage (plan, draft, review). No separate agents.

| Command           | When to use                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| `/write-content`  | New pages or substantial rewrites — full IA → draft → review → validate pipeline       |
| `/simple-content` | Edits to existing pages, smaller additions, or when you want step-by-step confirmation |
| `/review-content` | Review an existing page for style, standards, and accuracy without rewriting it        |
| `/improve-intro`  | Rewrite just the first paragraph of a page to match Neon style                         |
| `/humanize`       | Remove AI writing patterns and apply Neon voice: contractions, active voice, "you"     |
| `/golden-corpus`  | Load exemplary doc files by type for style and structure reference before writing      |

### Maintaining docs quality

| Command              | When to use                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `/validate`          | Pre-commit check: frontmatter, h1 headings, navigation entry, image paths, em dashes, lint |
| `/review-content`    | Deeper style and accuracy review of a finished page                                        |
| `/check-consistency` | Find other pages that say the same thing; surface duplication and drift                    |
| `/update-glossary`   | Find glossary gaps in a doc file (Mode A), or audit the glossary itself (Mode B)           |
| `/redirect-update`   | After moving or renaming a file: add `redirectFrom`, update links and navigation           |

### Pull requests

| Command              | When to use                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `/update-pr`         | Draft or update a PR title and description from changed files and commits   |
| `/add-preview-links` | Add Vercel preview links to a PR description for every changed content file |

### Changelog and roadmap

| Command             | When to use                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `/create-pr-report` | Weekly report of merged PRs across monitored repos; supports PR deep dives and follow-on workflows |
| `/create-changelog` | Generate next Friday's changelog draft (or a specific date) with placeholder content               |
| `/post-changelog`   | Post the changelog preview to Lakebase Slack channels for review. Databricks employees only.       |
| `/update-roadmap`   | Sync the introduction roadmap with recent changelog entries                                        |

### Issue tracking

| Command              | When to use                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/create-doc-ticket` | Create a JIRA task in the Databricks LKB project, assigned to yourself. Databricks employees only — requires the JIRA MCP. Non-employees should open a GitHub issue at github.com/neondatabase/website instead. |

### Reference and navigation

| Command                  | When to use                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `/navigation-principles` | Reference for `navigation.yaml` structure and how to add pages and sections |
| `/docs-prime`            | Load project structure and key paths into context                           |
| `/list-doc-tools`        | Print the full list of available commands with descriptions                 |

## Build Process

1. `predev`/`prebuild`: Generates docs icons config
2. `build`: Next.js build
3. `postbuild`: Copies docs MD files and generates sitemaps

## Notes for AI Assistants

- Documentation-heavy site with 1000+ markdown files — search before creating
- Do not modify `src/` components, CSS, or site structure without explicit instruction; a web team actively maintains the frontend
- Do not modify `node_modules/` or generated files
- Run `npm run fix` before every commit
- The codebase uses both `pages/` and `app/` directory (migration in progress)
- Images are optimized via Next.js Image component
- Accessibility matters — follow WCAG guidelines
- For writing style and component details, `content/docs/README.md` and `content/docs/community/` are the authoritative sources
