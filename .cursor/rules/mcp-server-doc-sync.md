# Neon MCP Server Documentation Sync

## Purpose
This rule guides the process of reviewing merged PRs from the mcp-server-neon repository and updating the user-facing MCP server documentation in the website repository to reflect new features, tools, and setup changes.

## When to Apply
Apply this rule when asked to:
- "Review the latest mcp-server-neon PRs"
- "Update MCP server docs from recent changes"
- "Sync MCP server documentation"
- "Check for MCP server updates"

## Repositories

### Source Repository (MCP Server Code)
- **Repo:** `neondatabase-labs/mcp-server-neon`
- **URL:** https://github.com/neondatabase-labs/mcp-server-neon
- **Access:** Use WebFetch to retrieve PRs page (GitHub MCP tools may have auth issues)

### Documentation Repository (This Repo)
- **Files to Update:**
  - **Reference Documentation:**
    - `content/docs/ai/neon-mcp-server.md` - Main MCP server overview and setup
    - `content/docs/ai/connect-mcp-clients-to-neon.md` - Client connection guide
    - `content/docs/shared-content/mcp-tools.md` - Complete tools list
  - **Client-Specific Guides:**
    - `content/guides/neon-mcp-server.md` - Claude Desktop guide
    - `content/guides/cursor-mcp-neon.md` - Cursor setup
    - `content/guides/claude-code-mcp-neon.md` - Claude Code setup
    - `content/guides/zed-mcp-neon.md` - Zed setup
    - `content/guides/windsurf-mcp-neon.md` - Windsurf setup
    - `content/guides/cline-mcp-neon.md` - Cline setup
    - `content/guides/neon-mcp-server-github-copilot-vs-code.md` - VS Code/Copilot setup

## Documentation Scope Decision Tree

Before updating documentation, determine WHERE to document the change:

### New MCP Tools
**Target:** `content/docs/shared-content/mcp-tools.md`
- New tools added to the server
- Changed tool parameters or behavior
- Deprecated tools (mark with note)
- Tool categorization changes

### Server Setup & Configuration
**Target:** Reference docs AND affected client guides
- OAuth improvements → Update `neon-mcp-server.md` + all client guides
- Remote server URL changes → Update all client guides
- Authentication changes → Update setup sections in reference + guides
- New supported clients → Create new guide + update reference docs

### Client-Specific Features
**Target:** Specific client guide only
- Cursor-specific configuration → `cursor-mcp-neon.md`
- Claude Desktop connectors → `neon-mcp-server.md` (Claude Desktop section)
- VS Code settings → `neon-mcp-server-github-copilot-vs-code.md`

### Security & Best Practices
**Target:** Reference docs
- New security considerations → Update admonitions in `neon-mcp-server.md`
- OAuth scope changes → Update authentication sections
- API key handling changes → Update setup instructions

### Example Mapping:
- ✅ New `provision_neon_auth` tool → `mcp-tools.md`
- ✅ OAuth improvements → `neon-mcp-server.md` + all client guides
- ✅ New traceId for logging → Reference docs (if user-facing) or skip (if internal)
- ✅ Cursor one-click install → `cursor-mcp-neon.md` + `neon-mcp-server.md`

## Workflow

### Step 1: Fetch Recent Merged PRs
Use WebFetch to fetch merged PRs from the last 7 days:
```
URL: https://github.com/neondatabase-labs/mcp-server-neon/pulls?q=is:pr+is:merged+merged:>YYYY-MM-DD
```

Calculate the date 7 days ago from today (or ask user for time period).

### Step 2: Review Each PR for User-Facing Changes

For each PR, determine if it contains **user-facing changes**:

#### ✅ User-Facing Changes (DOCUMENT THESE)
- New MCP tools (e.g., `provision_neon_auth`, `search`, `fetch`)
- Changed tool parameters or behavior
- New setup methods or clients supported
- OAuth authentication improvements
- Remote server URL changes
- Security guidance updates
- Breaking changes to tool APIs
- Setup workflow improvements (e.g., one-click install buttons)
- New configuration options
- Documentation resource updates (load_resource content)

#### ❌ Internal Changes (DO NOT DOCUMENT)
- Refactoring internal code structure
- Performance optimizations that don't change behavior
- CI/CD pipeline updates
- Testing improvements
- Build system changes
- Internal logging improvements (unless user-visible)
- Vercel deployment infrastructure
- Internal error handling (unless changes user experience)

### Step 3: Analyze PR Changes

For PRs with user-facing changes:

1. **Read the PR description** - Understanding the feature and its purpose
2. **Review changed files** - Focus on:
   - `src/tools/**/*.ts` - New or modified tools
   - `src/server.ts` - Server configuration changes
   - `README.md` - Setup instruction changes
   - `docs/**` - Documentation updates
3. **Identify specific changes**:
   - New tool names and descriptions
   - Changed tool parameters
   - New OAuth scopes or authentication methods
   - Setup process modifications
   - New client support

### Step 4: Update Documentation

#### A. Tools List (`content/docs/shared-content/mcp-tools.md`)

<Admonition type="important" title="Single Source of Truth for Tools">
`mcp-tools.md` is a **shared component** used across multiple guides via the `<MCPTools />` component. 

**NEVER duplicate the tools list in individual guides.** Update only this one file, and it automatically propagates to all guides that include `<MCPTools />`.

Guides using this component:
- `content/guides/neon-mcp-server.md`
- Other guides as needed
</Admonition>

**When to update:**
- New tools added
- Tool parameters changed
- Tool descriptions improved
- Tools deprecated or removed

**Update pattern:**

```markdown
**Category name:**

- `tool_name`: Description of what the tool does. Important details about parameters or behavior.
```

**Categories:**
- Project management
- Branch management
- SQL query execution
- Database migrations (schema changes)
- Query performance optimization
- Neon Auth
- Neon Data API
- Search and discovery
- Documentation and resources

**Update frontmatter date:**
```yaml
updatedOn: 'YYYY-MM-DDTHH:MM:SS.000Z'
```

#### B. Reference Documentation

##### Main Overview (`content/docs/ai/neon-mcp-server.md`)

**When to update:**
- OAuth authentication changes
- Security considerations updates
- New setup options
- Remote server URL changes
- New client support announcements

**Key sections to maintain:**
- Get started (quick command)
- Understanding MCP and Neon MCP Server
- Setup options (remote vs local)
- Security considerations (Admonition blocks)
- Prerequisites

**Update pattern for security:**
```markdown
<Admonition type="important" title="Security Considerations">
[Update security guidance based on new features or concerns]
</Admonition>
```

##### Client Connection Guide (`content/docs/ai/connect-mcp-clients-to-neon.md`)

**When to update:**
- New client supported
- Setup process changes
- Configuration format changes

**Structure:**
- Prerequisites section
- Setup steps per client
- Troubleshooting guidance

#### C. Client-Specific Guides

**When to update:**
- Client-specific setup improvements
- New features for specific clients
- Configuration changes for that client

**Standard structure for guides:**
1. Introduction with use case
2. Prerequisites
3. Setup steps (numbered)
4. Configuration examples
5. Verification steps
6. Next steps / related guides

**Update pattern:**
```markdown
---
title: 'Client Name and Neon MCP Server'
subtitle: 'Brief description'
author: author-name
enableTableOfContents: true
createdAt: 'YYYY-MM-DD'
updatedOn: 'YYYY-MM-DD'
---

[Introduction paragraph]

<Admonition type="important" title="Security Considerations">
[Security note with link to main docs]
</Admonition>

## Prerequisites
- List prerequisites

## Setting up [Client Name]
[Numbered steps]

## Verification
[How to verify setup works]
```

### Step 5: Documentation Quality Standards

Ensure all updates follow these standards:

1. **Clarity** - Use clear, simple language
2. **Completeness** - Include all setup steps and prerequisites
3. **Consistency** - Match existing documentation style and voice
4. **Security-First** - Always include security considerations
5. **Verification** - Provide ways to verify setup works
6. **Examples** - Include configuration examples
7. **Cross-linking** - Link to related guides and reference docs

### Step 6: Update Source Repository README (if needed)

**Check if the source repo README needs updates:**

After reviewing PRs and updating website documentation, check if the README in the source repository also needs updates.

**Repository:** https://github.com/neondatabase-labs/mcp-server-neon

**When to update the source README:**
- New tools were added but README wasn't updated in the PR
- Tool descriptions in README are outdated or incomplete
- Setup instructions changed but README wasn't updated
- New features documented on website but missing from README

**What to update in README:**
- Tools list (keep in sync with website's `mcp-tools.md`)
- Setup instructions (OAuth, configuration)
- Prerequisites
- Usage examples
- Security considerations

**Process:**
1. Review the source repo's README.md
2. Identify gaps between README and website docs
3. If updates needed:
   - Fork the repo (if not already)
   - Create a new branch (e.g., `docs/update-readme-tools`)
   - Update README.md
   - Open a PR to `neondatabase-labs/mcp-server-neon`
   - Title: "docs: update README with [new tools/features/setup]"
   - Link to the website PR in the description
   - Mention which website docs were updated for context

**Example PR description:**
```markdown
## Summary
Updates README to document [feature/tools] that were added in PR #X but not reflected in the README.

## Changes
- Added tool descriptions for `tool_name_1`, `tool_name_2`
- Updated setup instructions for [feature]

## Related
- Website documentation updated in neondatabase/website#[PR number]
- Implements documentation for PR #X
```

### Step 7: Create Summary

After completing updates, provide a summary:

```markdown
## MCP Server Documentation Updates

### PRs Reviewed: [count]
- PR #X: [title] - User-facing: Yes/No - Scope: Tools / Setup / Client / Security

### Documentation Changes Made:

#### Tools Reference (Shared Component)
1. **Added tool**: `tool_name`
   - File: content/docs/shared-content/mcp-tools.md (shared component)
   - Category: [category]
   - Note: Automatically propagates to all guides using `<MCPTools />`

#### Reference Documentation
1. **Updated setup instructions**: OAuth improvements
   - Files:
     - content/docs/ai/neon-mcp-server.md
   - Section: Setup options

#### Client Guides
1. **Updated guide**: Cursor setup
   - File: content/guides/cursor-mcp-neon.md
   - Change: Added one-click install button

#### Source Repository README
1. **Status**: README needs update / README already up to date
   - Repo: neondatabase-labs/mcp-server-neon
   - Action: [Opened PR #X / No action needed]

### No Documentation Changes Needed:
- PR #Z: Internal refactoring only
```

## Important Notes

### What NOT to Update
- Internal implementation details
- Vercel deployment specifics
- CI/CD workflows
- Testing infrastructure

### Shared Component Pattern (CRITICAL)
**The tools list is a shared component:**
- `content/docs/shared-content/mcp-tools.md` is the **single source of truth**
- Guides include this via `<MCPTools />` component
- **NEVER duplicate tool lists in individual guides**
- Update only `mcp-tools.md` and it propagates automatically to all guides

### Source Repository README Sync
**Keep the source repo README in sync:**
- The README in `neondatabase-labs/mcp-server-neon` also documents MCP tools and setup
- After updating website docs, **always check** if README needs updates
- If PRs didn't update README but added features/tools, open a PR to update it
- README serves developers who go directly to the GitHub repo
- Link between website PR and source repo PR for traceability

### Multiple Guides Often Need Updates
Some changes affect multiple files:
- New OAuth feature → Reference docs + all client guides
- New tool → **Tools list ONLY** (via shared component)
- Security change → Reference docs + potentially all guides
- New client → New guide + reference docs

### Tool List Organization
Tools are organized by functional category:
- Keep categories consistent
- Tools should be in logical order within category
- Include clear descriptions that explain user value
- Mention important parameters or behaviors

### Security Considerations
Always review security implications:
- OAuth scope changes
- API key exposure risks
- Action authorization requirements
- Production use warnings

### Client-Specific Variations
Different clients have different setup patterns:
- Claude Desktop: Connectors vs config file
- Cursor: One-click install vs manual config
- VS Code: Extension-specific settings
- Others: Standard MCP client config

## Execution Checklist

When syncing documentation:
- [ ] Fetch merged PRs from mcp-server-neon repo (last 7 days)
- [ ] Review each PR description and changes
- [ ] Identify user-facing changes only
- [ ] Determine documentation scope (Tools / Setup / Client / Security)
- [ ] Update `mcp-tools.md` if new or changed tools (ONLY update this file - it's a shared component)
- [ ] DO NOT duplicate tools list in guides - they use `<MCPTools />` component
- [ ] Update reference docs if setup or server changes
- [ ] Update client guides if client-specific changes
- [ ] Update security admonitions if security implications
- [ ] Update frontmatter dates on all modified files
- [ ] Check for cross-guide consistency
- [ ] Verify all links work
- [ ] **Check source repo README** for gaps vs website docs
- [ ] **Open PR to source repo** if README needs updates
- [ ] Create summary of changes made (including source repo README status)

## Example Usage

**User request:**
> "Review the latest PRs from mcp-server-neon and update the MCP docs"

**Your response:**
1. Fetch last 7 days of merged PRs from neondatabase-labs/mcp-server-neon
2. List PRs found with brief descriptions
3. Analyze each for user-facing changes
4. Update tools list, reference docs, and client guides as needed
5. Provide summary of changes made

**Typical workflow:**
1. PR adds `provision_neon_data_api` tool
   - Update `mcp-tools.md` ONLY (shared component - don't touch guides)
   - Add tool description in "Neon Data API" section
   - Update frontmatter date
   - Tool automatically appears in all guides using `<MCPTools />`
   - **Check source README**: If tool not documented there, open PR to add it

2. PR improves OAuth flow
   - Update `neon-mcp-server.md` OAuth setup section
   - Update all client guides that mention OAuth
   - Update frontmatter dates
   - **Check source README**: Verify OAuth setup instructions are current

3. PR adds Cursor one-click install
   - Add install button to `cursor-mcp-neon.md`
   - Mention in `neon-mcp-server.md` if relevant
   - Update frontmatter dates
   - **Check source README**: May not need update (client-specific feature)
