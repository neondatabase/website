# Golden Changelog Examples

This document contains exemplary changelog entries that demonstrate Neon's voice, structure, and style. Reference these when drafting new changelog entries.

---

## Voice & Tone Guidelines

**Core principle:** Humans writing for other humans.

- **Natural, conversational** - "We've doubled our default storage quota" not "Storage quota has been increased"
- **Benefit-focused** - Lead with what users can now do, not technical implementation
- **Straightforward and clear** - No marketing fluff, no trendy dev lingo
- **Factual and practical** - Give specifics: numbers, examples, concrete details
- **Active voice** - "We've added" not "Has been added"

**Common opening phrases:**
- "We've added..."
- "We've doubled..."
- "You can now..."
- "[Feature] is now available..."
- "We've introduced..."
- "We've made several improvements to..."

---

## H2 Entry Structures

### Pattern 1: New Feature with Detail + Benefit

**Example: Storage quota increase**

```markdown
## Storage quota doubled to 16TB

We've doubled our default storage quota from 8TB to 16TB. This means you can now run databases up to 16TB without contacting us to increase your limit. If you need to run larger databases, please [reach out to our team](https://neon.tech/contact-sales).
```

**What makes this good:**
- ✅ Specific numbers (8TB → 16TB)
- ✅ Clear benefit ("you can now run databases up to 16TB")
- ✅ Practical next step (contact for larger)
- ✅ One focused paragraph

---

**Example: Branch navigation**

```markdown
## Branch navigation improvements

We've added breadcrumb navigation to branch pages, making it easier to understand and navigate your branch hierarchy. When viewing a child branch, you'll now see the full lineage path (e.g., `production / development / feature-branch`) with visual branch indicators. The page heading has also been updated to "Child branch overview" for better clarity when working with nested branches.

![Branch breadcrumb navigation](/docs/changelog/branch-breadcrumbs-oct-2025.png)
```

**What makes this good:**
- ✅ What changed: "breadcrumb navigation"
- ✅ Why it matters: "easier to understand and navigate"
- ✅ Specific example: `production / development / feature-branch`
- ✅ Additional details grouped naturally
- ✅ Screenshot for visual feature
- ✅ 2-3 sentences with concrete details

---

### Pattern 2: Feature with Setup/Usage Example

**Example: MCP Server**

```markdown
## MCP server: Schema diff and migration generation

Our MCP server now supports schema diff generation and zero-downtime migration creation. Ask your AI assistant:

\`\`\`
Can you generate a schema diff for branch br-feature-auth in project my-app?
\`\`\`

The assistant will compare the branch schema with its parent, show what changed, and offer to generate a zero-downtime migration to apply those changes to the parent branch.

This makes it easier to develop schema changes on feature branches and promote them when ready. For more information, see [Neon MCP Server](/docs/ai/neon-mcp-server).
```

**What makes this good:**
- ✅ What's new in first sentence
- ✅ Concrete usage example (code block)
- ✅ Explanation of workflow
- ✅ Benefit statement ("This makes it easier to...")
- ✅ Link to docs
- ✅ Structure: what → how → why → learn more

---

### Pattern 3: Multiple Related Improvements

**Example: Data API updates**

```markdown
## Data API updates

We've made several major improvements to the Data API (Beta):

### _Build your first app_ quick start

The Data API page now includes a new **Build your first app** tab with a streamlined setup flow. This new tab lets you clone our note-taking demo app directly from the UI using your project's credentials, making it easy to get started with the Data API.

![data api configuration page](/docs/changelog/data_api_config_page.png)

Once set up, you can follow our tutorials to learn [Data API queries](/docs/data-api/demo) and [Row-Level Security](/docs/guides/rls-tutorial) using the same [demo app](https://github.com/neondatabase-labs/neon-data-api-neon-auth).

### SQL-to-PostgREST converter tool

We've added a new converter tool to help you translate existing SQL queries into PostgREST syntax. Useful for developers migrating from direct SQL queries or learning PostgREST patterns.

![sql to postgrest converter](/docs/changelog/sql_postgrest_converter.png)

Try the converter [here](/docs/data-api/sql-to-rest).

### Rust-based architecture for better performance

We've rebuilt the Data API from the ground up in Rust while maintaining 100% PostgREST compatibility. This new architecture delivers better performance, multi-tenancy support, and improved resource efficiency, while maintaining the same PostgREST API.

Learn more in our [Data API docs](/docs/data-api/get-started) or read about the architectural improvements in our [blog post](https://neon.com/blog/a-postgrest-compatible-data-api-now-on-neon).
```

**What makes this good:**
- ✅ Groups related improvements under one H2
- ✅ Uses H3s to break down sub-features
- ✅ Each subsection has: what + benefit + visual/link
- ✅ Maintains consistent voice throughout
- ✅ Clear hierarchy: big picture → details

---

### Pattern 4: Extension Updates

**Example: Postgres extensions**

```markdown
## Postgres extension updates

We've expanded extension support for Postgres 18 and updated several extension versions.

**Now available on Postgres 18:**

| Extension                    | Version |
| :--------------------------- | :------ |
| anon                         | 2.4.1   |
| address_standardizer         | 3.6.0   |
| h3                           | 4.2.3   |
| pg_cron                      | 1.6     |
| pgrag                        | 0.0.0   |

**Version updates across all supported Postgres versions:**

| Extension | Old Version | New Version |
| :-------- | :---------- | :---------- |
| anon      | 2.1.0       | 2.4.1       |

To upgrade from a previous version of an extension, follow the instructions in [Update an extension version](/docs/extensions/pg-extensions#update-an-extension-version).

For a complete list of Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).
```

**What makes this good:**
- ✅ Summary up front
- ✅ Tables for clarity (not paragraphs)
- ✅ Two categories: new support + updates
- ✅ Upgrade instructions linked
- ✅ Full list linked for reference
- ✅ Scannable structure

---

### Pattern 5: Console Feature with Visual

**Example: Scale to zero**

```markdown
## Configure scale to zero in the console

Scale plan users can now adjust their scale to zero timeout directly in the Neon Console. Simply select **Edit compute** from the menu on the **Compute** tab to set a custom timeout. The Scale plan allows you to set this as low as 1 minute, a setting that was previously only available via the Neon API.

Scale to zero helps minimize costs by automatically placing inactive databases in an idle state. The timeout setting controls how fast that happens. To learn more, refer to our [Scale to zero](/docs/introduction/scale-to-zero) guide.

![Configure scale to zero time in the Console](/docs/changelog/scale_to_zero_console.png)
```

**What makes this good:**
- ✅ Audience specified ("Scale plan users")
- ✅ How to access ("Edit compute" → "Compute" tab)
- ✅ Key detail (1 minute minimum)
- ✅ Context (previously API-only)
- ✅ Why it matters paragraph (cost optimization)
- ✅ Screenshot shows the feature
- ✅ Structure: what/who → how → why → visual

---

## Fixes & Improvements Section

### Guidelines for `<details>` Items

- **Group by feature area** when you have multiple related fixes
- **Keep entries concise** - 1-2 sentences max
- **Lead with the feature/area** when grouping
- **Be specific** about what was fixed/improved
- **Include benefit** when it's not obvious

### Pattern 1: Single Improvements

```markdown
<details>
<summary>**Fixes & improvements**</summary>

- **Neon CLI**
  - We updated the Neon CLI to version 2.15.1, which adds support for numeric characters in parent branch names and fixes CSRF authentication errors experienced by some users. To upgrade your Neon CLI version, please refer to our [upgrade instructions](https://neon.com/docs/reference/cli-install#upgrade).

- **Neon API**
  - Fixed an issue where database rename requests through the [Update branch](https://api-docs.neon.tech/reference/updateprojectbranchdatabase) endpoint could fail with a `could not configure compute node` error when the target database had active connections. The database rename operation now drops existing connections to the database before renaming, which allows rename requests to complete successfully.

</details>
```

**What makes this good:**
- ✅ Bold headings group by area
- ✅ Specific version numbers and error messages
- ✅ Links to relevant docs/endpoints
- ✅ Explains the fix AND the impact

---

### Pattern 2: Grouped Improvements

```markdown
<details>
<summary>**Fixes & improvements**</summary>

- **Instant restore and snapshots**
  - Updated default instant restore settings for new projects. Instant restore lets you recover your database to any point in time within your configured window. Previously, new projects were set to the maximum restore window for their plan; now they default to 6 hours for Free plan projects and 1 day for paid plans. You can adjust your restore window anytime in your project settings.
  - Fixed an issue where selecting a restore time using the datepicker would unexpectedly include the current time's seconds and milliseconds. Restore times now set seconds and milliseconds to zero when specified to the minute.
  - Fixed an issue where the **Create snapshot** button incorrectly appeared on the Backup & Restore page when a non-root branch was selected. Snapshots can only be created from root branches (branches without a parent).

- **Neon Launchpad**
  - Fixed an issue where usage limits for Neon projects created using Neon Launchpad ([neon.new](https://neon.new/)) were not reset after being claimed to a Neon account.

</details>
```

**What makes this good:**
- ✅ Multiple related items under one heading
- ✅ Mix of new behavior and fixes
- ✅ Each bullet is self-contained
- ✅ Provides context where needed

---

### Pattern 3: Important Fix with Context

```markdown
- **Child branch storage now capped at logical data size**

  We've introduced a storage billing cap for child branches. Previously, child branch storage cost was based on all data changes over time. Now, you're billed for the minimum of accumulated changes or your actual data size, ensuring you never pay more than the logical size of your data on a child branch. This change makes child branch storage costs more predictable and helps avoid charges from long-lived branches.
```

**What makes this good:**
- ✅ Bold title describes the change
- ✅ Explains old behavior → new behavior
- ✅ Clear benefit statement
- ✅ Worthy of being in Fixes (could be H2 if bigger)
- ✅ Uses paragraph format for complex change

---

## Title Patterns

**Good titles are:**
- Benefit-focused when possible
- Specific without being too technical
- Action-oriented or outcome-oriented

**Examples:**

✅ "Branch navigation improvements" (outcome)
✅ "Storage quota doubled to 16TB" (specific benefit)
✅ "Configure scale to zero in the console" (new capability)
✅ "Postgres extension updates" (category + action)
✅ "Weekly Neon usage reports" (new feature)

❌ "Update look of branch list" (too implementation-focused)
❌ "Console improvements" (too vague)
❌ "New UI for thing" (not benefit-focused)

---

## Length Guidelines

**H2 entries:**
- First paragraph: 2-3 sentences with specific details
- Optional second paragraph: Why it matters / benefit statement
- Code examples: When showing usage/setup
- Screenshots: For visual UI changes
- Total: ~100-150 words typical

**Fixes entries:**
- 1-2 sentences per item
- Exception: Complex changes can be paragraph format
- Group related items under feature headings

---

## Common Phrases

**Opening:**
- "We've added..."
- "We've doubled..."
- "You can now..."
- "We've made several improvements to..."
- "We've introduced..."
- "[Feature] is now available..."

**Benefit/Impact:**
- "This makes it easier to..."
- "This helps..."
- "Ensuring you..."
- "Allowing you to..."
- "Making it simpler to..."

**Context/Setup:**
- "Previously, [old behavior]..."
- "When you [action], you'll now see..."
- "Simply select [path] to..."

**Links:**
- "For more information, see [link]"
- "To learn more, refer to [link]"
- "Learn more in [link]"
- "See [link] for details"

---

## Anti-Patterns to Avoid

❌ **Too short/generic:**
```markdown
## Branch restrictions

You can now manage branch restrictions in the Console. Branch restrictions help control branches.
```

✅ **Better:**
```markdown
## Branch restrictions now enforced in Console

You can now see and manage branch restrictions directly in the Neon Console. When restrictions are set on a branch, the Console will disable restricted actions like creating child branches, deleting the branch, or modifying compute settings. This helps protect important branches from accidental changes while giving you clear visibility into what actions are allowed.
```

---

❌ **Too technical/implementation-focused:**
```markdown
## Updated middleware for admin RW checking

We've implemented a new middleware layer that validates read-write permissions for admin endpoints.
```

✅ **Better (or skip entirely if not customer-facing):**
```markdown
[This would likely be excluded from changelog as internal infrastructure]
```

---

❌ **Missing benefit/context:**
```markdown
## Data masking enhancements

We've made several improvements to the data masking feature.
```

✅ **Better:**
```markdown
## Data masking enhancements

We've made several improvements to the data masking feature to make it easier to work with anonymized data. The data masking page now preselects the anonymized branch option when you're configuring rules, the masking rules table has better alignment and readability, and we've hidden internal schemas that shouldn't be modified. You'll also see an improved icon in the sidenav and better disabled states during anonymization to prevent conflicts.
```

---

## When to Group vs. Separate

**Group together (as one H2 with subsections):**
- Multiple features in same product area (e.g., "Data API updates")
- Related extension updates (e.g., "Postgres extension updates")
- Multi-part feature launch (e.g., "Neon Launchpad updates")

**Keep separate (individual H2s):**
- Distinct features serving different use cases
- Major standalone announcements
- Features from different repos/areas

**Move to Fixes:**
- Single bug fixes (unless high-impact)
- Minor UX improvements
- Small enhancements without broad impact
- Version updates (extensions, CLI, etc.) unless major

---

## Special Cases

### Infrastructure/Capacity Announcements

```markdown
## New NAT gateway IP addresses

We've added new NAT gateway IP addresses in the AWS US East (N. Virginia) region to expand infrastructure capacity. If you have external IP allow lists that enable connections from external services into Neon, **update those allow lists soon to include the new addresses** to avoid connectivity issues.

See our [Regions documentation](/docs/introduction/regions#aws-nat-gateway-ip-addresses) for the complete list of NAT gateway IPs for all regions.
```

**Pattern:**
- What changed (new IPs)
- Why (capacity expansion)
- **Action required in bold** if applicable
- Link to full list

---

### Beta Features

**Mark clearly:**
- Add "(Beta)" to title or first mention
- Can note limitations/feedback requests
- Explain what beta means if relevant

```markdown
## Data API updates

We've made several major improvements to the Data API (Beta):
```

---

### Integration Announcements

```markdown
## Manage Neon with Pulumi

[Pulumi](https://www.pulumi.com), an open-source infrastructure-as-code (IaC) tool, can now be used to provision and manage your Neon projects as code. Using familiar programming languages or formats such as TypeScript, Python, Go, C#, Java, or YAML, you can define your Neon projects, branches, databases, compute endpoints, and roles alongside your other cloud resources. This integration uses a community-developed provider bridged from the Terraform provider for Neon.

\`\`\`javascript
import * as neon from '@pulumi/neon';
\`\`\`

To get started, see [Manage Neon with Pulumi](/guides/neon-pulumi).
```

**Pattern:**
- Introduce the partner tool with link
- Explain what users can now do
- Code snippet if relevant
- Link to guide

---

## Checklist for New Entries

Before finalizing a changelog entry, verify:

- [ ] Title is benefit-focused or action-oriented
- [ ] First paragraph has 2-3 sentences with specifics
- [ ] Includes concrete examples or numbers where possible
- [ ] Has a "why it matters" statement (unless obvious)
- [ ] Uses active voice ("We've added" not "Has been added")
- [ ] Links to relevant docs/guides
- [ ] Screenshot included for visual UI changes
- [ ] Grouped appropriately (H2 vs Fixes)
- [ ] Natural, conversational tone
- [ ] No marketing fluff or trendy lingo
- [ ] Proofread for clarity and accuracy
