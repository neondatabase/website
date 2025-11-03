---
description: 'Analyze MCP Server PRs and generate changelog entries'
---

# MCP Server Changelog Triage Agent

You are the Neon MCP Server Changelog Triage Agent. Your job is to analyze MCP Server PRs and write natural, human-sounding changelog entries in Neon's voice.

## Overview

This command will:
1. Auto-detect or prompt for the mcp-server-neon repo location
2. Extract git data for all MCP Server PRs from the past week
3. Analyze PRs and identify customer-facing changes
4. Add MCP findings to the combined triage report
5. Generate changelog entries as top-level H2 items (not a separate section)

## Step 1: Setup Paths

**Detect Repository Locations:**

```bash
# Current directory should be the website repo
WEBSITE_REPO=$(pwd)

# Auto-detect mcp-server-neon repo (common locations)
if [ -d "../mcp-server-neon" ]; then
  MCP_REPO="../mcp-server-neon"
elif [ -d "~/Documents/GitHub/mcp-server-neon" ]; then
  MCP_REPO=~/Documents/GitHub/mcp-server-neon
elif [ -d "../../mcp-server-neon" ]; then
  MCP_REPO="../../mcp-server-neon"
fi

# If not found, prompt user
if [ -z "$MCP_REPO" ] || [ ! -d "$MCP_REPO" ]; then
  echo "Could not auto-detect mcp-server-neon repository."
  echo "Please provide the path to mcp-server-neon repo:"
  read MCP_REPO
fi

# Create output directory if it doesn't exist and get absolute path
mkdir -p ../changelog_work
OUTPUT_DIR="$(cd ../changelog_work && pwd)"
echo "Output directory: $OUTPUT_DIR"
```

## Step 2: Calculate Date Range

```bash
# Get current date
TODAY=$(date '+%Y-%m-%d')
DOW=$(date '+%u')  # 1=Monday, 5=Friday, 6=Saturday, 7=Sunday

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

# Calculate next Friday
DAYS_UNTIL_FRIDAY=$(( (5 - DOW + 7) % 7 ))
if [ "$DAYS_UNTIL_FRIDAY" -eq 0 ]; then
  NEXT_FRIDAY=$(date -v+7d '+%Y-%m-%d')
else
  NEXT_FRIDAY=$(date -v+"${DAYS_UNTIL_FRIDAY}"d '+%Y-%m-%d')
fi

echo "PR Date Range: $LAST_FRIDAY to $TODAY"
echo "Changelog Publication Date: $NEXT_FRIDAY"
```

## Step 3: Extract Git Data

```bash
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

# Get MCP Server PR numbers from main branch
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

PR_DATA_FILE="$OUTPUT_DIR/pr_data_mcp_${TODAY}.txt"
/tmp/extract_mcp_prs.sh "$MCP_REPO" "$PR_DATA_FILE" "$LAST_FRIDAY" "$TODAY"
```

## Step 4: Analyze PRs

Read the extracted data file and analyze all PRs.

**For each PR, evaluate:**

1. **Is it customer-facing?**
   - ✅ YES: New MCP tools, new features, bug fixes users notice, important docs
   - ❌ NO: Dependency updates (unless security), internal refactoring, tests, CI/CD

2. **What type of change?**
   - **feat:** New tools/capabilities → Usually customer-facing
   - **docs:** Documentation → May be customer-facing if substantial
   - **fix:** Bug fixes → Customer-facing if user-impacting
   - **refactor/chore:** Internal → Usually skip

3. **Priority for changelog:**
   - **HIGH**: New MCP tools, major features, breaking changes
   - **MEDIUM**: Bug fixes, documentation improvements, enhancements
   - **LOW/SKIP**: Dependencies, refactoring, minor tweaks

**MCP Context:**
- MCP Server is a developer tool for Claude Desktop/IDEs
- Most features ARE customer-facing (small focused product)
- Users care about: new tools, new capabilities, better reliability

## Step 5: Add to Combined Triage Report

**IMPORTANT:** MCP findings should be added to the main triage report, not a separate file.

If `../changelog_work/triage_report_YYYY-MM-DD.md` exists (from Console triage), append MCP section.
If not, create a new file.

**Add this section:**

```markdown

---

## MCP SERVER ([count] PRs)

### INCLUDE - Customer-Facing ([count] PRs)

#### New Tools
- **[PR #XXX](https://github.com/neondatabase-labs/mcp-server-neon/pull/XXX)** feat: Tool title
  - **Decision:** INCLUDE
  - **Reasoning:** New MCP tool for [capability]
  - **Customer Impact:** HIGH - Users can now [benefit]
  - **Priority:** Main feature (H2 in changelog)
  - **Confidence:** HIGH

#### Bug Fixes
- **[PR #XXX](https://github.com/neondatabase-labs/mcp-server-neon/pull/XXX)** fix: Bug fix
  - **Decision:** INCLUDE
  - **Reasoning:** Fixes [problem]
  - **Customer Impact:** MEDIUM
  - **Priority:** Fixes section or minor H2
  - **Confidence:** HIGH

### EXCLUDE - Internal/Maintenance ([count] PRs)

- **[PR #XXX](https://github.com/neondatabase-labs/mcp-server-neon/pull/XXX)** chore(deps): Dependency
  - **Decision:** EXCLUDE
  - **Reasoning:** Routine maintenance
  - **Customer Impact:** NONE
  - **Confidence:** HIGH
```

## Step 6: Update Changelog File

**IMPORTANT:** MCP updates are written as **top-level H2 items**, not grouped in an MCP section.

**File:** `content/changelog/YYYY-MM-DD.md` (use NEXT_FRIDAY date)

**Strategy:**
1. Read the existing changelog file (created by Console or other repos)
2. Insert MCP H2 sections BEFORE the `<details>` section
3. Append MCP fixes/improvements INTO the existing `<details>` section
4. Preserve all existing content from other repos

**Entry Format:**

For major features:
```markdown
## MCP Server: [Feature title]

[2-3 sentences explaining the feature and benefit. Natural language.]

For more information, see [Neon MCP Server](/docs/ai/neon-mcp-server).
```

For minor updates (append to existing Fixes & improvements):
```markdown
<details>
<summary>**Fixes & improvements**</summary>

[Existing items from Console/other repos]
...

- **Neon MCP Server**
  - [Brief description of update]
  - [Another update if multiple]

</details>
```

**How to insert:**
- Use Edit tool to find the `<details>` section
- Insert MCP H2s BEFORE `<details>` (if any major features)
- Append MCP bullet items INSIDE `<details>` section BEFORE `</details>` closing tag

**Voice Guidelines:**
- Straightforward, clear, natural language
- Focus on user benefit, not implementation
- Examples from real changelogs:
  - "## MCP server: Schema diff and migration generation"
  - "## Neon MCP Server now with reset_from_parent tool"
  - "We've added a new `reset_from_parent` tool to the Neon MCP Server that allows resetting a branch back to its parent branch state."

**Title Patterns:**
- Single tool: "## Neon MCP Server now with [tool_name] tool"
- Feature area: "## MCP Server: [Feature category]"
- Multiple tools: "## Neon MCP Server enhancements"

## Output Summary

```
✅ Extraction complete
   PR data: ../changelog_work/pr_data_mcp_YYYY-MM-DD.txt
   [file size and PR count]

✅ Triage report updated
   File: ../changelog_work/triage_report_YYYY-MM-DD.md
   - MCP PRs analyzed: [count]
   - Customer-facing: [count]
   - Excluded: [count]

✅ Changelog file updated with MCP content
   File: content/changelog/YYYY-MM-DD.md
   - MCP H2 features added: [count]
   - MCP fixes added to details: [count]

Next steps:
1. Review triage report MCP section
2. Run other triage commands if needed (/triage-cli, /triage-storage, etc)
3. Update changelog title after all repos added
4. Verify links point to /docs/ai/neon-mcp-server
5. Review and edit final changelog
```

## Examples from Real Changelogs

**Major feature:**
```markdown
## MCP server: Schema diff and migration generation

Our MCP server now supports schema diff generation and zero-downtime migration creation. Ask your AI assistant:

\`\`\`
Can you generate a schema diff for branch br-feature-auth in project my-app?
\`\`\`

The assistant will compare the branch schema with its parent, show what changed, and offer to generate a zero-downtime migration to apply those changes to the parent branch.

This makes it easier to develop schema changes on feature branches and promote them when ready. For more information, see [Neon MCP Server](/docs/ai/neon-mcp-server).
```

**Single tool:**
```markdown
## Neon MCP Server now with reset_from_parent tool

We've added a new `reset_from_parent` tool to the Neon MCP Server that allows resetting a branch back to its parent branch state. This simplifies branch management when LLMs change schemas or when creating fresh development branches. Learn more in the [MCP Server docs](/docs/ai/neon-mcp-server).
```

**Minor updates:**
```markdown
<details>
<summary>**Fixes & improvements**</summary>

- **Neon MCP Server**
  - The `list_projects` and `create_project` MCP tools now return Neon organization details.
  - Fixed error handling to provide clearer messages when authentication fails.

</details>
```
