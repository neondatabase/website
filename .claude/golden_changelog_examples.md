# Golden Changelog Writing Guide

This document contains writing rules and exemplary changelog entries that demonstrate Neon's voice and structure.

---

## Part 1: Writing Rules (Prescriptive)

### Voice & Tone

**Core principles:**
1. **Human-to-human** - Write like a person explaining to another person
2. **Developer-to-developer** - Assume technical competence, be specific
3. **Straightforward** - No marketing fluff, no trendy jargon
4. **Benefit-focused** - Lead with what users can now do

**Common sentence patterns:**
- `We've [verb]...` (60% of openings)
- `You can now...` (20% of openings)
- `[Feature] is now available...` (10% of openings)
- `[Feature] now [capability]...` (10% of openings)

**Forbidden patterns:**
- ❌ Passive voice: "Has been added", "Was updated"
- ❌ Marketing speak: "exciting", "amazing", "game-changing"
- ❌ Vague claims: "improved performance" without specifics
- ❌ Overly technical: Implementation details instead of user impact

### Structure Patterns

#### H2 Entries (Main Features)

**Formula:**
```
## [Benefit-focused title]

[Opening sentence: What changed]
[2-3 sentences with specifics: How it works, examples]
[Optional: Benefit statement if not obvious]

[Optional: Screenshot]
[Optional: Code block]

For more information, see [relevant docs](/docs/path).
```

**Title patterns:**
- New capability: "Configure X in the console", "Monitor Y with Z"
- Version/limit: "Postgres 18 support", "Storage quota doubled to 16TB"
- Feature area: "Data API updates", "MCP Server enhancements"
- Product integration: "ChatGPT + Neon MCP Server"

**Length targets:**
- Opening: 15-25 words
- Body: 40-80 words (2-3 sentences)
- Total: 60-120 words typical
- Exception: Complex multi-part features can be longer

**When to use H2:**
- New features users can directly access
- Major version updates (Postgres X support)
- Significant quota/limit increases
- Multiple related PRs that tell one story
- Breaking changes or important announcements

#### Fixes & Improvements Section

**Formula:**
```markdown
<details>
<summary>**Fixes & improvements**</summary>

- **[Area/Product]:** [Brief description]. [Optional benefit].
- **[Area/Product]:**
  - [Item 1]
  - [Item 2]

</details>
```

**Grouping logic:**
- Group by product area (Console, MCP Server, CLI, etc.)
- Group by feature (Backup & restore, OAuth, Billing)
- Use nested bullets for multiple related items
- Single bullets for standalone fixes

**Length targets:**
- Single item: 10-30 words
- Grouped items: 5-15 words each

**When to use Fixes:**
- Single bug fixes
- Small UI improvements
- Minor enhancements
- Extension version updates
- Performance tweaks

### Details & Specifics

**Always include when possible:**
- Numbers: "8TB → 16TB", "10 → 20 projects", "1 hour expiration"
- Examples: Branch names, field names, feature names
- Locations: Which page, which tab, which menu
- Versions: Extension versions, Postgres versions

**Example specificity levels:**

❌ **Too vague:**
"Branch restrictions are now enforced in the Console."

✅ **Good specificity:**
"Branch restrictions are now visible and enforced across the Neon Console. When restrictions are set on a branch (like `connect-to-endpoints`), the Console automatically disables restricted actions across all relevant pages—Query Editor, Drizzle Studio, SQL Editor, and endpoint management."

### Common Scenarios

#### Postgres Version Updates
```markdown
## Postgres [X] support [(preview)]

Neon now supports **Postgres [X]** [in preview]. To try it out, [instructions].

[Screenshot]

[Optional: Preview limitations link]

To learn more about the new features:
- [Blog post link]
- [Official Postgres release notes]
```

#### Extension Updates
```markdown
- **Postgres extensions**
  - The [extension name] extension has been updated to version [X.X]. [Brief description of what it does]. [Link to docs]
```

#### Quota/Limit Changes
```markdown
## [What] [direction] to [new value]

We've [doubled/increased] [what] from [old value] to [new value]. [Benefit statement]. [Edge case handling if needed].
```

#### Integration Announcements
```markdown
## [Partner] + [Neon feature]

[Partner description] can now [capability].

[Screenshot]

[Benefit explanation - how it helps users]

👉 [Call to action with link]
```

### Cross-References

**When to mention related repos:**
- MCP + CLI: If both relate to same feature (e.g., onboarding)
- Console + API: If UI exposes API capability
- Extension updates: Storage work that surfaces in Console

**Pattern:**
"The `neon init` CLI command now uses this same MCP resource approach for a more consistent setup experience."

---

## Part 2: Golden Examples (Annotated)

### Example 1: Simple Quota Increase

**File:** [2025-10-24.md](../content/changelog/2025-10-24.md#storage-quota-doubled-to-16tb)

```markdown
## Storage quota doubled to 16TB

We've doubled our default storage quota from 8TB to 16TB. This means you can now
run databases up to 16TB without contacting us to increase your limit. If you need
to run larger databases, please [reach out to our team](https://neon.tech/contact-sales).
```

**What makes this exemplary:**
- ✅ Specific numbers (8TB → 16TB)
- ✅ Clear benefit ("run databases up to 16TB")
- ✅ One focused paragraph
- ✅ Practical next step (contact for larger)
- ✅ 40 words - concise

### Example 2: Console Feature with Detail

**File:** [2025-10-24.md](../content/changelog/2025-10-24.md#branch-navigation-improvements)

```markdown
## Branch navigation improvements

We've added breadcrumb navigation to branch pages, making it easier to understand
and navigate your branch hierarchy. When viewing a child branch, you'll now see the
full lineage path (e.g., `production / development / feature-branch`) with visual
branch indicators. The page heading has also been updated to "Child branch overview"
for better clarity when working with nested branches.

![Branch breadcrumb navigation](/docs/changelog/branch-breadcrumbs-oct-2025.png)
```

**What makes this exemplary:**
- ✅ What changed: "breadcrumb navigation"
- ✅ Why it matters: "easier to understand and navigate"
- ✅ Concrete example: `production / development / feature-branch`
- ✅ Additional context naturally included
- ✅ Screenshot for visual feature
- ✅ 75 words - good length

### Example 3: Major Feature with Setup Flow

**File:** [2025-10-24.md](../content/changelog/2025-10-24.md#mcp-server-schema-diff-and-migration-generation)

```markdown
## MCP server: Schema diff and migration generation

Our MCP server now supports schema diff generation and zero-downtime migration
creation. Ask your AI assistant:

\`\`\`
Can you generate a schema diff for branch br-feature-auth in project my-app?
\`\`\`

The assistant will compare the branch schema with its parent, show what changed,
and offer to generate a zero-downtime migration to apply those changes to the
parent branch.

This makes it easier to develop schema changes on feature branches and promote them
when ready. For more information, see [Neon MCP Server](/docs/ai/neon-mcp-server).
```

**What makes this exemplary:**
- ✅ Clear capability in opening
- ✅ Usage example (code block)
- ✅ Workflow explanation
- ✅ Benefit statement ("makes it easier")
- ✅ Link to docs
- ✅ Structure: what → how → why → learn more

### Example 4: Multiple Related Improvements

**File:** [2025-08-29.md](../content/changelog/2025-08-29.md#neon-mcp-server-enhancements)

```markdown
## Neon MCP Server enhancements

- We introduced a new **list_shared_projects** tool that lets users see projects
  shared with them. This addresses a gap where [project collaborators] couldn't
  list Neon projects they were part of.
- We improved error handling and refined the logic used for Neon org selection.
- You can now manage your Neon database directly from **Claude Code** using the
  [Neon MCP Server]. Check out our new guide...
```

**What makes this exemplary:**
- ✅ Groups related improvements under one H2
- ✅ Each bullet is self-contained
- ✅ Mix of new features and improvements
- ✅ Links inline to relevant docs
- ✅ Natural grouping, not forced

### Example 5: Postgres Version Announcement

**File:** [2025-09-26.md](../content/changelog/2025-09-26.md#postgres-18-support-preview)

```markdown
## Postgres 18 support (preview)

Neon now supports **Postgres 18** in preview. To try it out, [create a new project]
and select **18** as the **Postgres version**.

![Postgres 18 Create project](/docs/changelog/postgres_18.png)

While in preview, there are a few [limitations to keep in mind].

To learn more about the new features and improvements in Postgres 18:
- Read our blog post: [Postgres 18 Is Out: Try it on Neon]
- Review the official [Postgres 18 release notes]
```

**What makes this exemplary:**
- ✅ Clear status: "(preview)"
- ✅ Immediate action: "To try it out..."
- ✅ Visual guide (screenshot)
- ✅ Important caveat (limitations)
- ✅ Multiple learning resources

### Example 6: Integration Announcement

**File:** [2025-09-12.md](../content/changelog/2025-09-12.md#chatgpt--neon-mcp-server)

```markdown
## ChatGPT + Neon MCP Server

You can now connect ChatGPT to the **Neon MCP Server** using custom Model Context
Protocol (MCP) connectors.

![ChatGPT with Neon MCP Server](/docs/changelog/chatgpt_mcp.png)

This integration makes it easy to extend ChatGPT with Neon's database
capabilities—so you can query, manage, and interact with your Neon projects
directly within ChatGPT.

👉 [Read the blog](/blog/manage-neon-databases-from-chatgpt) to get started.
```

**What makes this exemplary:**
- ✅ Partner + Neon in title
- ✅ Clear capability statement
- ✅ Screenshot showing integration
- ✅ Benefit explanation
- ✅ Strong call-to-action with emoji

### Example 7: Grouped Fixes

**File:** [2025-09-12.md](../content/changelog/2025-09-12.md)

```markdown
<details>
<summary>**Fixes & improvements**</summary>

- **Neon Console**
  - We adjusted the warning message on the **Edit compute** modal about connection
    disruptions when changing the compute size. The warning message now only appears
    when compute size values are modified.
  - Fixed an issue where the **Branch expiration** modal would close without notice
    if an error occurred. The modal now remains open and displays the error message.

- **Backup & restore**
  - On the **Backup & restore** page in the Neon Console, snapshots are now listed
    with a more user-friendly branch name instead of the branch ID value.
  - The **Restore branch modal** now shows the new branch expiration time that will
    be set when restoring a branch configured to expire.
</details>
```

**What makes this exemplary:**
- ✅ Grouped by feature area
- ✅ Each item is complete thought
- ✅ Specific UI locations mentioned
- ✅ Before → after clarity
- ✅ Benefit included when not obvious

---

## Part 3: Quick Reference

### Title Formula Matrix

| Type | Pattern | Example |
|------|---------|---------|
| New capability | `[Action] [object] in [location]` | "Configure scale to zero in the console" |
| Version/number | `[Thing] [change] to [value]` | "Storage quota doubled to 16TB" |
| Product support | `[Product] [version] support` | "Postgres 18 support (preview)" |
| Integration | `[Partner] + [Neon feature]` | "ChatGPT + Neon MCP Server" |
| Feature group | `[Feature area] [enhancements/updates]` | "MCP Server enhancements" |

### Length Guidelines

| Section | Words | Sentences | Notes |
|---------|-------|-----------|-------|
| H2 Opening | 15-25 | 1 | Clear, direct statement |
| H2 Body | 40-80 | 2-3 | Details, examples, workflow |
| H2 Total | 60-120 | 3-4 | Can be longer for complex features |
| Fix item | 10-30 | 1-2 | Concise, clear |

### Checklist for H2 Entries

Before finalizing an H2 entry, verify:

- [ ] Title is benefit-focused or action-oriented
- [ ] Opening sentence states what changed
- [ ] 2-3 sentences with specific details
- [ ] Includes concrete examples (numbers, names, paths)
- [ ] Has "why it matters" statement (unless obvious)
- [ ] Uses active voice throughout
- [ ] Links to relevant docs at end
- [ ] Screenshot for visual features
- [ ] Code block for usage/setup if applicable
- [ ] 60-120 words (flexible for complex features)
- [ ] Proofread for clarity

### Common Phrases Library

**Openings:**
- "We've added..."
- "We've doubled/increased..."
- "You can now..."
- "[Feature] is now available..."
- "[Feature] now supports..."
- "We've introduced..."

**Benefits:**
- "This makes it easier to..."
- "This gives you..."
- "Ensuring you..."
- "Allowing you to..."
- "Making it simpler to..."
- "Helping you..."

**Transitions:**
- "When you [action], you'll now see..."
- "To try it out, [instructions]..."
- "Simply select [path] to..."
- "This addresses [problem]..."

**Closings:**
- "For more information, see [link]"
- "To learn more, refer to [link]"
- "Learn more in [link]"
- "Check out [link]"
- "Read the blog: [link]"

---

## Part 4: Anti-Patterns (What to Avoid)

### ❌ Too Generic

**Bad:**
```markdown
## Branch restrictions

You can now manage branch restrictions. Branch restrictions help control branches.
```

**Why it's bad:** No specifics, no examples, repeats "branch restrictions" without adding information

**Fixed:**
```markdown
## Branch restrictions now enforced in Console

Branch restrictions are now visible and enforced across the Neon Console. When
restrictions are set on a branch (like `connect-to-endpoints`), the Console
automatically disables restricted actions across all relevant pages—Query Editor,
Drizzle Studio, SQL Editor, and endpoint management.
```

### ❌ Too Technical/Implementation-Focused

**Bad:**
```markdown
## Updated middleware for admin RW checking

We've implemented a new middleware layer that validates read-write permissions
for admin endpoints using role-based access control patterns.
```

**Why it's bad:** Focuses on implementation, not user value. This is likely not customer-facing at all.

**Fixed:** Exclude this from changelog (internal infrastructure)

### ❌ Missing Benefit/Context

**Bad:**
```markdown
## Data masking enhancements

We've made several improvements to the data masking feature.
```

**Why it's bad:** Says "improvements" but doesn't specify what or why it matters

**Fixed:**
```markdown
## Data masking enhancements

We've made several improvements to the data masking feature to make it easier to
work with anonymized data. The data masking page now preselects the anonymized
branch option when configuring rules, the masking rules table has better alignment,
and we've hidden internal schemas that shouldn't be modified.
```

### ❌ Wrong Section Placement

**Bad:** Putting 5 related data masking PRs as separate items in Fixes section

**Why it's bad:** Multiple related changes tell a bigger story and deserve H2 visibility

**Fixed:** Group as "Data masking enhancements" H2 with bullet points or narrative

---

## Usage for Agents

When analyzing PRs and drafting changelog entries:

1. **Read these rules first** - Understand voice, structure, length
2. **Reference examples** - Match the pattern that fits your content
3. **Use the checklist** - Verify your draft meets all criteria
4. **Apply the formula** - Follow structure patterns for consistency
5. **Borrow phrases** - Use the phrase library for natural language
6. **Avoid anti-patterns** - Check your draft doesn't match bad examples

The goal is **consistency with Neon's established voice** while being specific and user-focused.
