---
description: 'Generate changelog from all repos or selected repos'
---

# Changelog Triage Command

You are the Neon Changelog Triage Agent. Your job is to analyze PRs from Neon repositories and generate a publication-ready changelog in Neon's voice.

## Usage

```
/triage-changelog              # All repos (default)
/triage-changelog console      # Console only
/triage-changelog mcp          # MCP Server only
/triage-changelog console,mcp  # Multiple repos
```

**Note:** The command prompt may not support parameters yet. If parameters don't work, ask the user which repos to process, or default to all.

## Overview

This command will:
1. Determine which repositories to process
2. Calculate the date range (last Friday to today, publish next Friday)
3. Extract and analyze PRs from each enabled repository
4. Generate a combined triage report with all decisions
5. Generate a publication-ready changelog file

## Step 1: Determine Repositories to Process

Check if user provided repo selection, otherwise default to all.

**Available repositories:**
- `console` - Neon Console (neon-cloud repo)
- `mcp` - MCP Server (mcp-server-neon repo)
- `cli` - Neon CLI (neonctl repo)

**Future repositories:**
- `serverless` - Serverless Driver
- `storage` - Storage (hadron repo)
- `control-plane` - Control Plane (neon-cloud repo, different branch)
- `compute` - Compute (hadron repo)
- `proxy` - Proxy (hadron repo)
- `drizzle` - Drizzle Studio

**Default:** Process Console + MCP + CLI

Ask user: "Which repositories would you like to process? (console, mcp, cli, or all - default: all)"

## Step 2: Setup Paths

Detect or prompt for repository locations:

```bash
# Current directory should be the website repo
WEBSITE_REPO=$(pwd)

# Get absolute path to output directory (should already exist)
OUTPUT_DIR="$(cd ../changelog_work && pwd 2>/dev/null || (mkdir -p ../changelog_work && cd ../changelog_work && pwd))"

# Auto-detect neon-cloud repo (Console)
if [ -d "../neon-cloud" ]; then
  NEON_CLOUD_REPO="../neon-cloud"
elif [ -d "~/Documents/GitHub/neon-cloud" ]; then
  NEON_CLOUD_REPO=~/Documents/GitHub/neon-cloud
elif [ -d "../../neon-cloud" ]; then
  NEON_CLOUD_REPO="../../neon-cloud"
fi

if [ -z "$NEON_CLOUD_REPO" ] || [ ! -d "$NEON_CLOUD_REPO" ]; then
  echo "Could not auto-detect neon-cloud repository."
  echo "Please provide the path to neon-cloud repo:"
  read NEON_CLOUD_REPO
fi

# Auto-detect mcp-server-neon repo (MCP)
if [ -d "../mcp-server-neon" ]; then
  MCP_REPO="../mcp-server-neon"
elif [ -d "~/Documents/GitHub/mcp-server-neon" ]; then
  MCP_REPO=~/Documents/GitHub/mcp-server-neon
elif [ -d "../../mcp-server-neon" ]; then
  MCP_REPO="../../mcp-server-neon"
fi

if [ -z "$MCP_REPO" ] || [ ! -d "$MCP_REPO" ]; then
  echo "Could not auto-detect mcp-server-neon repository."
  echo "Please provide the path to mcp-server-neon repo:"
  read MCP_REPO
fi

# Auto-detect neonctl repo (CLI)
if [ -d "../neonctl" ]; then
  CLI_REPO="../neonctl"
elif [ -d "~/Documents/GitHub/neonctl" ]; then
  CLI_REPO=~/Documents/GitHub/neonctl
elif [ -d "../../neonctl" ]; then
  CLI_REPO="../../neonctl"
fi

if [ -z "$CLI_REPO" ] || [ ! -d "$CLI_REPO" ]; then
  echo "Could not auto-detect neonctl repository."
  echo "Please provide the path to neonctl repo:"
  read CLI_REPO
fi
```

## Step 3: Calculate Date Range

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
echo "Repositories: [list enabled repos]"
echo "============================"
```

## Step 4: Process Console (if enabled)

Extract and analyze Console PRs:

```bash
# Create extraction script
cat > /tmp/extract_console_prs.sh << 'SCRIPT_EOF'
#!/bin/bash

REPO_DIR="$1"
OUTPUT_FILE="$2"
SINCE_DATE="$3"
UNTIL_DATE="$4"

cd "$REPO_DIR" || exit 1

echo "Fetching latest from remote..." >&2
git fetch origin

echo "Querying git for Console PRs from $SINCE_DATE to $UNTIL_DATE..." >&2

# Console PRs are merged to origin/release-console
PR_NUMBERS=$(git log origin/release-console --since="$SINCE_DATE 00:00:00" --until="$UNTIL_DATE 23:59:59" --oneline | \
  grep "\[console" | \
  grep -oE "#[0-9]+" | \
  sort -u | \
  tr -d '#')

TOTAL=$(echo "$PR_NUMBERS" | wc -l | tr -d ' ')

echo "Found $TOTAL Console PRs" >&2
echo "Extracting data..." >&2

> "$OUTPUT_FILE"

echo "===========================================" >> "$OUTPUT_FILE"
echo "CONSOLE PRs FOR CHANGELOG TRIAGE" >> "$OUTPUT_FILE"
echo "Date Range: $SINCE_DATE to $UNTIL_DATE" >> "$OUTPUT_FILE"
echo "Total PRs: $TOTAL" >> "$OUTPUT_FILE"
echo "===========================================" >> "$OUTPUT_FILE"

COUNT=0
for PR_NUM in $PR_NUMBERS; do
    COUNT=$((COUNT + 1))
    echo -ne "\rProcessing $COUNT/$TOTAL..." >&2

    COMMIT_HASH=$(git log --all --oneline --grep="#$PR_NUM" | head -1 | awk '{print $1}')

    if [ -z "$COMMIT_HASH" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "========== PR #$PR_NUM ==========" >> "$OUTPUT_FILE"
        echo "Status: COMMIT NOT FOUND" >> "$OUTPUT_FILE"
        echo "=====================================" >> "$OUTPUT_FILE"
        continue
    fi

    echo "" >> "$OUTPUT_FILE"
    echo "========== PR #$PR_NUM ==========" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    git show "$COMMIT_HASH" --no-patch --format="Commit: %H%nAuthor: %an%nDate: %ad%nSubject: %s%n%nBody:%b" >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "--- Files Changed ---" >> "$OUTPUT_FILE"
    git show "$COMMIT_HASH" --stat --format="" | head -15 >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "--- Diff Sample (first 80 lines) ---" >> "$OUTPUT_FILE"
    git show "$COMMIT_HASH" --format="" | head -80 >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "=====================================" >> "$OUTPUT_FILE"
done

echo -e "\n\nDone! Extracted data for $COUNT PRs" >&2
echo "File: $OUTPUT_FILE" >&2
ls -lh "$OUTPUT_FILE" >&2
SCRIPT_EOF

chmod +x /tmp/extract_console_prs.sh

# Run extraction
PR_DATA_FILE="$OUTPUT_DIR/pr_data_console_${TODAY}.txt"
/tmp/extract_console_prs.sh "$NEON_CLOUD_REPO" "$PR_DATA_FILE" "$LAST_FRIDAY" "$TODAY"
```

**Analyze Console PRs:**

Read the PR data file in chunks and analyze directly. Do NOT create Python scripts or permanent analysis files.

Read the file systematically:

**For each PR, evaluate:**
1. **Is it customer-facing?**
   - YES: New UI features, visible changes, bug fixes users notice, public API changes
   - NO: Internal refactoring, admin endpoints, infrastructure, CI/CD, ops scripts, billing jobs

2. **Is it behind a feature flag?**
   - Look for: `__IS_NEON_VARIANT__`, `isFeatureEnabled`, feature flag checks
   - **TODO:** Future enhancement - query PostHog API to check feature flag status
   - For now: Note in triage report if behind flag, may not be fully released

3. **Is it Lakebase-specific?**
   - Look for: "Lakebase", "lakebase", Databricks-specific features, `__IS_NEON_VARIANT__`
   - Track separately for Lakebase changelog

4. **What's the user impact and scope?**
   - Read the diff to understand what changed
   - Consider: What can users now do? Why does it matter?

5. **Is it H2-worthy or Fixes-worthy?**
   - **H2 (Main feature):**
     - Substantial new capability or major enhancement
     - Multiple related PRs working together on same feature area
     - Significant UX improvements (e.g., 3-5 data masking PRs = feature enhancement)
     - New pages, major workflows, important integrations
   - **Fixes & improvements:**
     - Single bug fixes
     - Small UI tweaks
     - Minor improvements
     - Papercuts and polish
   - **When in doubt:** If you can write a compelling 2-3 sentence narrative about "what users can now do", it's probably H2-worthy

**Store Console findings** for triage report and changelog generation.

## Step 5: Process MCP Server (if enabled)

Extract and analyze MCP Server PRs:

```bash
# Create MCP extraction script
cat > /tmp/extract_mcp_prs.sh << 'SCRIPT_EOF'
#!/bin/bash

REPO_DIR="$1"
OUTPUT_FILE="$2"
SINCE_DATE="$3"
UNTIL_DATE="$4"

cd "$REPO_DIR" || exit 1

echo "Fetching latest from remote..." >&2
git fetch origin

echo "Querying git for MCP Server PRs from $SINCE_DATE to $UNTIL_DATE..." >&2

# MCP PRs are merged to origin/main
PR_NUMBERS=$(git log origin/main --since="$SINCE_DATE 00:00:00" --until="$UNTIL_DATE 23:59:59" --oneline | \
  grep -oE "#[0-9]+" | \
  sort -u | \
  tr -d '#')

TOTAL=$(echo "$PR_NUMBERS" | wc -l | tr -d ' ')

echo "Found $TOTAL MCP Server PRs" >&2
echo "Extracting data..." >&2

> "$OUTPUT_FILE"

echo "===========================================" >> "$OUTPUT_FILE"
echo "MCP SERVER PRs FOR CHANGELOG TRIAGE" >> "$OUTPUT_FILE"
echo "Date Range: $SINCE_DATE to $UNTIL_DATE" >> "$OUTPUT_FILE"
echo "Total PRs: $TOTAL" >> "$OUTPUT_FILE"
echo "===========================================" >> "$OUTPUT_FILE"

COUNT=0
for PR_NUM in $PR_NUMBERS; do
    COUNT=$((COUNT + 1))
    echo -ne "\rProcessing $COUNT/$TOTAL..." >&2

    COMMIT_HASH=$(git log --all --oneline --grep="#$PR_NUM" | head -1 | awk '{print $1}')

    if [ -z "$COMMIT_HASH" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "========== PR #$PR_NUM ==========" >> "$OUTPUT_FILE"
        echo "Status: COMMIT NOT FOUND" >> "$OUTPUT_FILE"
        echo "=====================================" >> "$OUTPUT_FILE"
        continue
    fi

    echo "" >> "$OUTPUT_FILE"
    echo "========== PR #$PR_NUM ==========" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    git show "$COMMIT_HASH" --no-patch --format="Commit: %H%nAuthor: %an%nDate: %ad%nSubject: %s%n%nBody:%b" >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "--- Files Changed ---" >> "$OUTPUT_FILE"
    git show "$COMMIT_HASH" --stat --format="" | head -15 >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "--- Diff Sample (first 80 lines) ---" >> "$OUTPUT_FILE"
    git show "$COMMIT_HASH" --format="" | head -80 >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "=====================================" >> "$OUTPUT_FILE"
done

echo -e "\n\nDone! Extracted data for $COUNT PRs" >&2
echo "File: $OUTPUT_FILE" >&2
ls -lh "$OUTPUT_FILE" >&2
SCRIPT_EOF

chmod +x /tmp/extract_mcp_prs.sh

# Run extraction
PR_DATA_FILE="$OUTPUT_DIR/pr_data_mcp_${TODAY}.txt"
/tmp/extract_mcp_prs.sh "$MCP_REPO" "$PR_DATA_FILE" "$LAST_FRIDAY" "$TODAY"
```

**Analyze MCP PRs:**

Read the PR data file in chunks and analyze directly. Do NOT create Python scripts or permanent analysis files.

**For each PR, evaluate:**
1. **Is it customer-facing?**
   - YES: New MCP tools, new features, bug fixes users notice, important docs
   - NO: Dependency updates (unless security), internal refactoring, tests, CI/CD

2. **What type of change?**
   - **feat:** New tools/capabilities → Usually customer-facing
   - **docs:** Documentation → May be customer-facing if substantial
   - **fix:** Bug fixes → Customer-facing if user-impacting
   - **refactor/chore:** Internal → Usually skip

**Store MCP findings** for triage report and changelog generation.

## Step 6: Process CLI (if enabled)

Extract and analyze CLI PRs:

```bash
# Create CLI extraction script
cat > /tmp/extract_cli_prs.sh << 'SCRIPT_EOF'
#!/bin/bash

REPO_DIR="$1"
OUTPUT_FILE="$2"
SINCE_DATE="$3"
UNTIL_DATE="$4"

cd "$REPO_DIR" || exit 1

echo "Fetching latest from remote..." >&2
git fetch origin

echo "Querying git for CLI PRs from $SINCE_DATE to $UNTIL_DATE..." >&2

# CLI uses conventional commits, not PR numbers
# Exclude release commits (chore(release))
COMMITS=$(git log origin/main --since="$SINCE_DATE 00:00:00" --until="$UNTIL_DATE 23:59:59" --oneline | \
  grep -v "chore(release)" | \
  awk '{print $1}')

TOTAL=$(echo "$COMMITS" | wc -l | tr -d ' ')

echo "Found $TOTAL CLI commits (excluding releases)" >&2
echo "Extracting data..." >&2

> "$OUTPUT_FILE"

echo "===========================================" >> "$OUTPUT_FILE"
echo "CLI COMMITS FOR CHANGELOG TRIAGE" >> "$OUTPUT_FILE"
echo "Date Range: $SINCE_DATE to $UNTIL_DATE" >> "$OUTPUT_FILE"
echo "Total Commits: $TOTAL" >> "$OUTPUT_FILE"
echo "===========================================" >> "$OUTPUT_FILE"

COUNT=0
for COMMIT_HASH in $COMMITS; do
    COUNT=$((COUNT + 1))
    echo -ne "\rProcessing $COUNT/$TOTAL..." >&2

    echo "" >> "$OUTPUT_FILE"
    echo "========== COMMIT $COMMIT_HASH ==========" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    git show "$COMMIT_HASH" --no-patch --format="Commit: %H%nAuthor: %an%nDate: %ad%nSubject: %s%n%nBody:%b" >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "--- Files Changed ---" >> "$OUTPUT_FILE"
    git show "$COMMIT_HASH" --stat --format="" | head -15 >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "--- Diff Sample (first 80 lines) ---" >> "$OUTPUT_FILE"
    git show "$COMMIT_HASH" --format="" | head -80 >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "=====================================" >> "$OUTPUT_FILE"
done

echo -e "\n\nDone! Extracted data for $COUNT PRs" >&2
echo "File: $OUTPUT_FILE" >&2
ls -lh "$OUTPUT_FILE" >&2
SCRIPT_EOF

chmod +x /tmp/extract_cli_prs.sh

# Run extraction
PR_DATA_FILE="$OUTPUT_DIR/pr_data_cli_${TODAY}.txt"
/tmp/extract_cli_prs.sh "$CLI_REPO" "$PR_DATA_FILE" "$LAST_FRIDAY" "$TODAY"
```

**Analyze CLI PRs:**

Read the PR data file in chunks and analyze directly. Do NOT create Python scripts or permanent analysis files.

**For each PR, evaluate:**
1. **Is it customer-facing?**
   - YES: New commands, command enhancements, bug fixes users notice, output improvements
   - NO: Internal refactoring, dependency updates (unless security), tests, CI/CD, build config

2. **What type of change?**
   - **feat:** New commands or command features → Usually customer-facing
   - **fix:** Bug fixes → Customer-facing if user-impacting
   - **docs:** Documentation → May be customer-facing
   - **refactor/chore:** Internal → Usually skip

3. **Is it H2-worthy or Fixes-worthy?**
   - **H2:** New commands, major command enhancements, breaking changes
   - **Fixes:** Bug fixes, minor improvements, flag additions, output tweaks

**Store CLI findings** for triage report and changelog generation.

## Step 7: Generate Combined Triage Report

Create a single triage report with sections for each processed repo:

**File:** `$OUTPUT_DIR/triage_report_${NEXT_FRIDAY}.md`

**Format:**

```markdown
# Changelog Triage Report
## [Date Range]

**Date Range:** YYYY-MM-DD to YYYY-MM-DD
**Publication Date:** YYYY-MM-DD (next Friday)
**Repositories Processed:** [list]

---

## CONSOLE ([X] PRs)

### INCLUDE - Customer-Facing Features ([count] PRs)

[Console items with clickable GitHub links]

### EXCLUDE - Internal/Infrastructure ([count] PRs)

[Console excluded items]

### LAKEBASE-SPECIFIC FEATURES ([count] PRs)

[Lakebase items]

---

## MCP SERVER ([X] PRs)

### INCLUDE - Customer-Facing ([count] PRs)

[MCP items with clickable GitHub links]

### EXCLUDE - Internal/Maintenance ([count] PRs)

[MCP excluded items]

---

## CLI ([X] PRs)

### INCLUDE - Customer-Facing ([count] PRs)

[CLI items with clickable GitHub links]

### EXCLUDE - Internal/Maintenance ([count] PRs)

[CLI excluded items]

---

## COMBINED SUMMARY

**Total PRs Analyzed:** [count across all repos]
**Customer-Facing:** [count]
**Excluded:** [count]
**Lakebase-Specific:** [count]

**Breakdown by Repository:**
- Console: [X] PRs ([Y] customer-facing)
- MCP Server: [X] PRs ([Y] customer-facing)
- CLI: [X] PRs ([Y] customer-facing)
```

## Step 7: Generate Changelog File

Create the publication-ready changelog:

**File:** `content/changelog/${NEXT_FRIDAY}.md`

**Structure:**

```markdown
---
title: [Leave as TBD - writer will update]
---

[Console H2 features if any]

[MCP H2 features if any]

[Other repo H2 features]

<details>
<summary>**Fixes & improvements**</summary>

[Console fixes]
[MCP fixes]
[Other repo fixes]

</details>
```

**Voice Guidelines:**
- Humans writing for other humans
- Straightforward, clear, natural language
- NO marketing speak, NO trendy dev lingo
- Be factual and practical

**Ordering:**
- H2 sections: Major features first, ordered by impact/size
- Console feature enhancements (multiple related PRs) should be H2, not buried in Fixes
- Fixes: Ordered by impact/importance, not by repo
- Natural grouping in Fixes (e.g., "## Neon Console", "## Postgres extensions") is good for organizing related small items

**Examples from real changelogs:**
- "We've doubled our default storage quota from 8TB to 16TB"
- "## MCP Server: Schema diff and migration generation"
- "Fixed VPC endpoints to properly show 'new' state endpoints"

## Step 8: Generate Summary

```
=== CHANGELOG GENERATION COMPLETE ===

📊 Repositories Processed:
- Console: X PRs ([Y] customer-facing)
- MCP Server: X PRs ([Y] customer-facing)
- CLI: X PRs ([Y] customer-facing)

📁 Files Generated:
- Triage report: ../changelog_work/triage_report_YYYY-MM-DD.md
- Changelog: content/changelog/YYYY-MM-DD.md
- PR data files:
  - ../changelog_work/pr_data_console_YYYY-MM-DD.txt
  - ../changelog_work/pr_data_mcp_YYYY-MM-DD.txt
  - ../changelog_work/pr_data_cli_YYYY-MM-DD.txt

📝 Changelog Summary:
- Main features (H2): X
- Fixes & improvements: Y

📋 Next Steps:
1. Review triage report for accuracy
2. Review and edit changelog
3. Update title after reviewing content
4. Add screenshots to /public/docs/changelog/
5. Run through Grammarly
6. Check links
7. Create PR and request reviews
8. Merge and publish on Friday
```

## Tips for Analysis

**Console:**
- Skip: Admin tools, Vercel integration, billing internals, CI/CD
- Include: UI changes, bug fixes users notice, new features
- Watch for: Lakebase-specific PRs (`__IS_NEON_VARIANT__`)

**MCP:**
- Skip: Dependency updates, refactoring, tests
- Include: New tools, bug fixes, important docs
- Most features are customer-facing (small focused product)

**CLI:**
- Skip: Dependency updates, refactoring, tests, build config
- Include: New commands, command enhancements, bug fixes, output improvements
- Most features are customer-facing (developer tool)

**General:**
- Read actual diffs, don't just rely on PR titles
- Consider user impact: What can they now do?
- When in doubt, include (writers review anyway)
