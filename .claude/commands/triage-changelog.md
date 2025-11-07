---
description: 'Generate changelog from all repos using parallel extraction agents'
---

# Changelog Triage Command (Agent-Based)

You are the Neon Changelog Orchestrator. Your job is to coordinate extraction agents, compile their analysis, and generate a publication-ready changelog.

## Architecture

**Phase 1: Extraction & Analysis (Parallel Agents)**
- Launch repo-specific agents in parallel
- Each agent extracts PRs and analyzes them autonomously
- Agents return structured summaries with triage decisions

**Phase 2: Compilation & Drafting (Main Claude)**
- Compile agent summaries into triage report
- Generate changelog draft using golden examples
- Present to user for review

## Usage

```
/triage-changelog              # All repos (default)
/triage-changelog console      # Console only
/triage-changelog mcp          # MCP Server only
/triage-changelog console,mcp  # Multiple repos
```

## Step 1: Determine Repositories to Process

Check if user provided repo selection, otherwise default to all.

**Available repositories:**
- `console` - Neon Console (neon-cloud repo)
- `mcp` - MCP Server (mcp-server-neon repo)
- `cli` - Neon CLI (neonctl repo)
- `storage` - Storage (hadron repo, release-storage branch)
- `compute` - Compute (hadron repo, release-compute branch)

**Default:** Process all repositories

If no parameter provided, ask user: "Which repositories would you like to process? (console, mcp, cli, storage, compute, or all - default: all)"

Parse user response and set flags:
- `PROCESS_CONSOLE=true/false`
- `PROCESS_MCP=true/false`
- `PROCESS_CLI=true/false`
- `PROCESS_STORAGE=true/false`
- `PROCESS_COMPUTE=true/false`

## Step 2: Calculate Date Range

Calculate once for all repositories:

```bash
TODAY=$(date '+%Y-%m-%d')
DOW=$(date '+%u')

# Calculate last Friday (7 days ago if today is Friday, otherwise previous Friday)
if [ "$DOW" -eq 5 ]; then
  LAST_FRIDAY=$(date -v-7d '+%Y-%m-%d')
elif [ "$DOW" -gt 5 ]; then
  DAYS_BACK=$((DOW - 5))
  LAST_FRIDAY=$(date -v-"${DAYS_BACK}"d '+%Y-%m-%d')
else
  DAYS_BACK=$((DOW + 2))
  LAST_FRIDAY=$(date -v-"${DAYS_BACK}"d '+%Y-%m-%d')
fi

# Calculate publication date (today if Friday, otherwise next Friday)
if [ "$DOW" -eq 5 ]; then
  PUBLICATION_DATE="$TODAY"
else
  DAYS_UNTIL_FRIDAY=$(( (5 - DOW + 7) % 7 ))
  PUBLICATION_DATE=$(date -v+"${DAYS_UNTIL_FRIDAY}"d '+%Y-%m-%d')
fi

echo "=== CHANGELOG GENERATION ==="
echo "PR Date Range: $LAST_FRIDAY to $TODAY"
echo "Publication Date: $PUBLICATION_DATE"
echo "============================"
```

## Step 3: Setup Repository Paths

Detect repository locations (these will be passed to agents):

```bash
WEBSITE_REPO=$(pwd)
OUTPUT_DIR="/Users/$(whoami)/changelog_work"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Auto-detect repositories
NEON_CLOUD_REPO="$HOME/Documents/GitHub/neon-cloud"
MCP_REPO="$HOME/Documents/GitHub/mcp-server-neon"
CLI_REPO="$HOME/Documents/GitHub/neonctl"
HADRON_REPO="$HOME/Documents/GitHub/hadron"

# Check if repos exist and warn if not
if [ "$PROCESS_CONSOLE" = "true" ] && [ ! -d "$NEON_CLOUD_REPO" ]; then
  echo "⚠️  Console repo not found at $NEON_CLOUD_REPO"
fi
if [ "$PROCESS_MCP" = "true" ] && [ ! -d "$MCP_REPO" ]; then
  echo "⚠️  MCP repo not found at $MCP_REPO"
fi
if [ "$PROCESS_CLI" = "true" ] && [ ! -d "$CLI_REPO" ]; then
  echo "⚠️  CLI repo not found at $CLI_REPO"
fi
if [ "$PROCESS_STORAGE" = "true" ] || [ "$PROCESS_COMPUTE" = "true" ]; then
  if [ ! -d "$HADRON_REPO" ]; then
    echo "⚠️  Hadron repo not found at $HADRON_REPO"
  fi
fi
```

## Step 4: Launch Extraction & Analysis Agents

**IMPORTANT:** Launch ALL enabled agents in parallel using a single message with multiple Task tool calls.

For each enabled repository, prepare the agent prompt with environment variables:

### Agent Launch Template

For each agent, create a prompt like this:

```
You are running the [REPO] extraction and analysis agent.

Environment variables:
- REPO_PATH: [path to repo]
- OUTPUT_DIR: [/Users/user/changelog_work]
- LAST_FRIDAY: [YYYY-MM-DD]
- TODAY: [YYYY-MM-DD]

Follow the instructions in your agent file to:
1. Extract PRs
2. Analyze them
3. Return a structured summary

Your agent file is: .claude/agents/extract-analyze-[repo].md
Read that file and execute its instructions.
```

### Launch Agents in Parallel

Use a single message with multiple Task tool calls:

**If PROCESS_CONSOLE:**
```
Task: extract-analyze-console
Description: Extract and analyze Console PRs
Prompt: [formatted prompt with env vars as above]
Subagent: general-purpose
```

**If PROCESS_MCP:**
```
Task: extract-analyze-mcp
Description: Extract and analyze MCP PRs
Prompt: [formatted prompt with env vars]
Subagent: general-purpose
```

**If PROCESS_CLI:**
```
Task: extract-analyze-cli
Description: Extract and analyze CLI commits
Prompt: [formatted prompt with env vars]
Subagent: general-purpose
```

**If PROCESS_STORAGE:**
```
Task: extract-analyze-storage
Description: Extract and analyze Storage PRs
Prompt: [formatted prompt with env vars]
Subagent: general-purpose
```

**If PROCESS_COMPUTE:**
```
Task: extract-analyze-compute
Description: Extract and analyze Compute PRs (exploratory)
Prompt: [formatted prompt with env vars]
Subagent: general-purpose
Model: haiku
```

**Note:** Compute uses Haiku model for faster, more efficient analysis with lower token usage.

**Example of launching 3 agents in parallel:**
```
I'm launching 3 extraction agents in parallel: Console, MCP, and CLI.

[Three Task tool calls in a single message]
```

## Step 5: Collect Agent Results

Each agent will return a structured summary. Save their outputs:

- Console: `CONSOLE_SUMMARY`
- MCP: `MCP_SUMMARY`
- CLI: `CLI_SUMMARY`
- Storage: `STORAGE_SUMMARY`
- Compute: `COMPUTE_SUMMARY`

Check for failures. If any agent failed, note it and continue with successful agents.

## Step 6: Check for Non-PR Announcements

Before compiling the triage report, check for major announcements that might not appear in PRs:

```bash
# Check recent blog posts (if available)
echo "Checking for recent blog posts or announcements..."

# Look for pricing/quota config changes in website repo
echo "Checking for pricing or quota changes in docs..."
git log --since="$LAST_FRIDAY" --until="$TODAY" --oneline -- content/docs | head -20 || true

# Check changelog drafts that might exist
ls -la content/changelog/*.md 2>/dev/null | tail -5 || true
```

**Look for evidence of:**
- Pricing changes (compute rates, storage rates)
- Quota/limit increases (projects, storage, branches)
- Plan changes (new tiers, feature availability)
- Compliance announcements (HIPAA, SOC 2, etc.)
- Partnership announcements (integrations, marketplace)

**If you find any of these**, add a note to the triage report under "NON-PR ANNOUNCEMENTS" section for human review.

## Step 7: Generate Combined Triage Report

Compile all agent summaries into a single triage report file.

**File:** `$OUTPUT_DIR/triage_report_${PUBLICATION_DATE}.md`

**Structure:**

```markdown
# Changelog Triage Report
## [Date Range]

**Date Range:** YYYY-MM-DD to YYYY-MM-DD
**Publication Date:** YYYY-MM-DD (next Friday)
**Repositories Processed:** [list]

---

[Insert CONSOLE_SUMMARY if processed]

---

[Insert MCP_SUMMARY if processed]

---

[Insert CLI_SUMMARY if processed]

---

[Insert STORAGE_SUMMARY if processed]

---

[Insert COMPUTE_SUMMARY if processed]

---

## COMBINED SUMMARY

**Total PRs Analyzed:** [sum across all repos]
**Customer-Facing:** [sum]
**Excluded:** [sum]
**Lakebase-Specific:** [from Console only]

**Breakdown by Repository:**
- Console: [X] PRs ([Y] customer-facing)
- MCP Server: [X] PRs ([Y] customer-facing)
- CLI: [X] PRs ([Y] customer-facing)
- Storage: [X] PRs ([Y] customer-facing)
- Compute: [X] PRs ([Y] customer-facing)

**Key Themes This Week:**
[Identify 3-5 major themes across all repos]
```

## Step 8: Generate Changelog Draft

**File:** `content/changelog/${PUBLICATION_DATE}.md`

### Check for Existing Changelog

First, check if the changelog file already exists:

```bash
if [ -f "content/changelog/${PUBLICATION_DATE}.md" ]; then
  echo "📝 Existing changelog found: content/changelog/${PUBLICATION_DATE}.md"
  echo "This file will be updated with new agent findings."
else
  echo "📝 Creating new changelog: content/changelog/${PUBLICATION_DATE}.md"
fi
```

**If changelog exists:**
- Read the existing content first
- Identify what's already documented
- Add new items from agent analysis that aren't already covered
- Preserve existing content that agents didn't find (pricing changes, quota updates, etc.)
- Improve/polish existing descriptions using agent drafts where applicable

**If creating new:**
- Generate fresh changelog from agent recommendations

### Drafting Process

Read the golden examples file: `.claude/golden_changelog_examples.md`

1. **Read golden examples** to understand voice and structure patterns

2. **Trust agent recommendations:**
   - If an agent recommends H2, include it as H2 (do not demote to Fixes)
   - If an agent recommends Fixes, include it in Fixes
   - Agents analyzed full PR context you don't have - respect their judgment

3. **Use agent drafts directly:**
   - For H2-worthy items, agents provide "Draft H2 Description" and "Suggested Title"
   - Use the agent's suggested title (edit only for minor wording, not content changes)
   - Use the agent's draft description (edit only for polish and consistency, not restructuring)
   - Do not rewrite agent drafts from scratch - they contain specific details from PRs

4. **Cross-repo coordination:**
   - If multiple agents have related H2 items (e.g., MCP + CLI), combine into one H2
   - Merge the agent drafts together, preserving details from both
   - Example: MCP onboarding + CLI init command = one "Get started" H2

5. **For Fixes items:**
   - Write concise bullets (10-30 words each)
   - Group by repo or feature area
   - Use agent reasoning as the base for your bullet text

6. **Quality check before writing:**
   - Count how many H2-worthy items agents recommended
   - Verify your changelog includes all of them (unless combining related items)
   - Do not skip H2 items without explicit reason
   - Extension updates and capacity changes are always H2-worthy

7. **Changelog structure:**

```markdown
---
title: TBD
---

[Include ALL H2-worthy items from agents - order by impact]

## [Agent's suggested title - use verbatim or minor edits only]

[Agent's draft description - copy directly, edit only for polish]

[Optional: Screenshot reference if mentioned in triage report]
[Optional: Code example if in agent draft]

For more information, see [link from agent draft or relevant docs].

## [Next H2 from agents]

[Agent's draft - preserve specifics and examples from PRs]

<details>
<summary>**Fixes & improvements**</summary>

[Group fixes from all repos by area]
- **[Repo/Area]:** [Use agent's reasoning as base for bullet]
- [Include all Fixes-recommended items]

</details>
```

**Example of using agent drafts correctly:**
- Agent says: "Suggested Title: Data masking improvements" → Use that title
- Agent provides draft with specific UI pages → Keep those specifics
- Agent recommends H2 → Include as H2, don't demote to Fixes

## Step 9: Generate Summary

Output a final summary for the user:

```
=== CHANGELOG GENERATION COMPLETE ===

📊 Repositories Processed:
[List with PR counts and customer-facing counts]

📁 Files Generated:
- Triage report: [path]
- Changelog: [path]
- PR data files: [list paths]

📝 Changelog Summary:
- Main features (H2): [count]
- Fixes & improvements: [count]

📋 Next Steps:
1. Review triage report for accuracy
2. Review and edit changelog draft
3. Update title after reviewing content
4. Add screenshots to /public/docs/changelog/
5. Run through Grammarly
6. Check links
7. Create PR and request reviews
8. Merge and publish on Friday
```

## Error Handling

If any agent fails:
- Note the failure in summary
- Continue with successful agents
- Generate triage report and changelog with available data
- Warn user about missing repo data

## Notes

- Agents run autonomously - you won't see their intermediate steps
- Each agent returns a final summary with all its decisions
- Your job is to compile summaries and draft the changelog
- Use golden examples extensively when drafting
- Be concise in narration - let the agents do the work
- The triage report shows all agent reasoning for transparency
