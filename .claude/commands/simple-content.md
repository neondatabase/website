---
description: 'Simple interactive documentation content workflow with user confirmation steps'
allowed_tools:
  [
    'Task',
    'Bash',
    'Read',
    'Edit',
    'MultiEdit',
    'Write',
    'Glob',
    'Grep',
    'TodoWrite',
    'mcp__proxy__jira__jira_get_issue',
    'mcp__proxy__github__create_pull_request',
  ]
---

# Simple Content Workflow

I'll create documentation content using an interactive workflow with user confirmation at key steps.

## Step 1: Analyze Requirements

**Parse user input for:**

- GitHub issue patterns (#\d+, issue numbers)
- File paths (.md or .mdx files)
- Content description
- Operation type (create, update, modify)

**If GitHub issue found:** Fetch details if GitHub integration available
**If description only:** Work with provided description

## Step 2: Confirm Content Plan

**Present to user:**

- Content scope and objectives
- Target files identified or recommendations
- Content type classification
- Proposed approach
- Git branch strategy

**Ask for confirmation:** "Does this plan look correct? Any changes needed?"

## Step 3: Gather Missing Information

**If target files unclear:**

- Ask user which documentation to update
- If they don't know, search using: `rg "relevant terms" docs/ --type md`
- Present search results and ask for selection

**Clarifying questions:**

- Which frameworks or platforms to cover? (Next.js, Laravel, etc.)
- Related pages that need cross-references?
- New page placement in navigation (content/docs/navigation.yaml)?

## Step 4: Checkout a new feature branch

- Use the current branch as a base (likely `main`)
- Checkout a new feature branch with descriptive name, for example: `add-authentication-guide` or `update-rls-docs`
- If GitHub issue number provided, you can prefix: `issue-123-description`

## Step 5: Identify Content Type and Examples

**Classify content type:**

- Overview/landing page
- Tutorial/quickstart
- Concept explanation
- How-to guide
- Reference documentation

**Load golden corpus examples:**

- Use `/golden-corpus` slash command to load the appropriate examples for a given content type.
- Ask the user if there are any sample pages they want to also load as a golden example.

**Present examples:** "I'll use [content type] style based on [example file]. Are there any other pages you'd like to include as an example?"

## Step 6: Write Content

**Content creation process:**

- Use identified examples for style reference
- Follow Neon tone and terminology (developer-friendly, clear, concise)
- Apply proper MDX syntax with React components
- Include required frontmatter (title, subtitle, enableTableOfContents)
- Structure with clear headings (max H3, avoid H4+)
- Add framework-specific sections if needed (CodeTabs for multi-language)
- Update frontmatter date (`updatedOn`) if the change is substantial

**Create/update target files** using Write or Edit tools

## Step 7: Style Guide Validation

**Load and apply:** Neon documentation standards from CLAUDE.md and `/golden-corpus`

**Check for:**

- Active voice and present tense
- Developer-friendly, clear, concise writing
- Proper Neon terminology (Neon, Serverless Postgres, compute, branch, project)
- MDX component usage (Admonition, CodeTabs, InfoBlock, DetailIconCards, Steps)
- Technical accuracy
- SEO-friendly subtitle/description
- Code examples with proper language tags
- Internal links using relative paths

**Apply corrections** using Edit tool for fixes

## Step 8: Finalization Options

**Present completion summary:**

- Files created/modified
- Key changes made
- Build validation status

**Ask user:** "Content is complete. Would you like me to:"

- Commit changes and create a PR?
- Just commit changes?
- Leave uncommitted for your review?

**If PR requested:**

- Stage and commit changes
- Use `mcp__proxy__github__create_pull_request`
- Follow Databricks PR template structure

## Error Handling

- **Missing JIRA ticket:** Proceed with description-based approach
- **File conflicts:** Confirm with user before overwriting
- **Unclear requirements:** Ask specific clarifying questions
- **Build issues:** Report and suggest fixes

## Usage Examples

**GitHub issue-based:**
`/simple-content #123`

**Description-based:**
`/simple-content document new autoscaling feature`

**Specific target:**
`/simple-content update connection pooling documentation in content/docs/connect/connection-pooling.md`

**New page request:**
`/simple-content create tutorial for setting up Neon with Next.js`

---

**Interactive workflow ensures user approval at each major step before proceeding.**
