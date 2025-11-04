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

# Calculate last Friday
if [ "$DOW" -eq 5 ]; then
  LAST_FRIDAY="$TODAY"
elif [ "$DOW" -gt 5 ]; then
  DAYS_BACK=$((DOW - 5))
  LAST_FRIDAY=$(date -v-"${DAYS_BACK}"d '+%Y-%m-%d')
else
  DAYS_BACK=$((DOW + 2))
  LAST_FRIDAY=$(date -v-"${DAYS_BACK}"d '+%Y-%m-%d')
fi

# Calculate next Friday (publication date)
DAYS_UNTIL_FRIDAY=$(( (5 - DOW + 7) % 7 ))
if [ "$DAYS_UNTIL_FRIDAY" -eq 0 ]; then
  NEXT_FRIDAY=$(date -v+7d '+%Y-%m-%d')
else
  NEXT_FRIDAY=$(date -v+"${DAYS_UNTIL_FRIDAY}"d '+%Y-%m-%d')
fi

echo "=== CHANGELOG GENERATION ==="
echo "PR Date Range: $LAST_FRIDAY to $TODAY"
echo "Publication Date: $NEXT_FRIDAY"
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
```

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

## Step 6: Generate Combined Triage Report

Compile all agent summaries into a single triage report file.

**File:** `$OUTPUT_DIR/triage_report_${NEXT_FRIDAY}.md`

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

## Step 7: Generate Changelog Draft

Read the golden examples file: `.claude/golden_changelog_examples.md`

Using the agent summaries and golden examples, draft the changelog.

**File:** `content/changelog/${NEXT_FRIDAY}.md`

### Drafting Guidelines

1. **Read golden examples** to understand:
   - Voice and tone
   - Structure patterns (what → how → why)
   - Length guidelines (2-3 sentences + benefit)
   - H2 vs Fixes decisions

2. **Process agent recommendations:**
   - Agents suggest H2 or Fixes for each item
   - Use your judgment + golden examples to refine
   - Group related items across repos when appropriate
   - Write in natural, conversational language

3. **Structure:**

```markdown
---
title: TBD
---

[H2 entries from all repos - order by impact/importance]

## [Feature title from Console/MCP/CLI/Storage/Compute]

[2-3 sentences explaining what changed and why it matters. Follow golden examples.]

[Optional: Screenshot reference]
[Optional: Code example]

For more information, see [relevant docs](/docs/path).

## [Another feature]

[Same pattern]

<details>
<summary>**Fixes & improvements**</summary>

[Bullets from all repos, grouped by area if it makes sense]
- **[Repo/Area]:** [Brief description of fix/improvement]
- [More items]

</details>
```

4. **Voice reminders:**
   - Start with "We've added..." or "You can now..."
   - Include specific examples (branch names, numbers, etc.)
   - Focus on user benefit, not implementation
   - Natural language, no marketing speak
   - 2-3 sentences for H2 descriptions

5. **Cross-repo grouping:**
   - If MCP and CLI both relate to same feature, mention both in one H2
   - Example: "MCP Server onboarding" can mention CLI's related change

## Step 8: Generate Summary

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
