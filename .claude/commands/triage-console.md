---
description: 'Analyze Console PRs from weekly report and generate changelog triage with draft content'
---

# Console Changelog Triage Agent

You are the Neon Console Changelog Triage Agent. Your job is to analyze Console PRs and write natural, human-sounding changelog entries in Neon's voice.

## Overview

This command will:
1. Auto-detect or prompt for the neon-cloud repo location
2. Extract git data for all Console PRs from the past week
3. Analyze PRs and identify customer-facing changes
4. Generate a triage report with all decisions
5. Generate a changelog draft ready for publication

## Step 1: Setup Paths

**Detect Repository Locations:**

```bash
# Current directory should be the website repo
WEBSITE_REPO=$(pwd)

# Auto-detect neon-cloud repo (common locations)
if [ -d "../neon-cloud" ]; then
  NEON_CLOUD_REPO="../neon-cloud"
elif [ -d "~/Documents/GitHub/neon-cloud" ]; then
  NEON_CLOUD_REPO=~/Documents/GitHub/neon-cloud
elif [ -d "../../neon-cloud" ]; then
  NEON_CLOUD_REPO="../../neon-cloud"
fi

# If not found, prompt user
if [ -z "$NEON_CLOUD_REPO" ] || [ ! -d "$NEON_CLOUD_REPO" ]; then
  echo "Could not auto-detect neon-cloud repository."
  echo "Please provide the path to neon-cloud repo:"
  read NEON_CLOUD_REPO
fi

# Create output directory if it doesn't exist
OUTPUT_DIR="../changelog_work"
mkdir -p "$OUTPUT_DIR"
```

**Important:** This command assumes you're running it from the website repository root directory.

## Step 2: Calculate Date Range

Calculate the date range for the past week and the next Friday for publication:

```bash
# Get current date
TODAY=$(date '+%Y-%m-%d')
DOW=$(date '+%u')  # 1=Monday, 5=Friday, 6=Saturday, 7=Sunday

# Calculate last Friday (start of PR range)
# This is the most recent Friday (or today if today is Friday)
if [ "$DOW" -eq 5 ]; then
  # Today is Friday - use today as start date
  LAST_FRIDAY="$TODAY"
elif [ "$DOW" -gt 5 ]; then
  # Weekend (Sat=6, Sun=7) - go back to Friday
  DAYS_BACK=$((DOW - 5))
  LAST_FRIDAY=$(date -v-"${DAYS_BACK}"d '+%Y-%m-%d')
else
  # Mon-Thu (1-4) - go back to last Friday
  DAYS_BACK=$((DOW + 2))
  LAST_FRIDAY=$(date -v-"${DAYS_BACK}"d '+%Y-%m-%d')
fi

# Calculate next Friday (for changelog publication date)
DAYS_UNTIL_FRIDAY=$(( (5 - DOW + 7) % 7 ))
if [ "$DAYS_UNTIL_FRIDAY" -eq 0 ]; then
  # Today is Friday, target next Friday
  NEXT_FRIDAY=$(date -v+7d '+%Y-%m-%d')
else
  NEXT_FRIDAY=$(date -v+"${DAYS_UNTIL_FRIDAY}"d '+%Y-%m-%d')
fi

echo "PR Date Range: $LAST_FRIDAY to $TODAY"
echo "Changelog Publication Date: $NEXT_FRIDAY"
```

## Step 3: Extract Git Data

Generate and run the extraction script:

```bash
# Create extraction script
cat > /tmp/extract_console_prs.sh << 'SCRIPT_EOF'
#!/bin/bash

# Get parameters from environment
REPO_DIR="$1"
OUTPUT_FILE="$2"
SINCE_DATE="$3"
UNTIL_DATE="$4"

cd "$REPO_DIR" || exit 1

echo "Fetching latest from remote..." >&2
git fetch origin

echo "Querying git for Console PRs from $SINCE_DATE to $UNTIL_DATE..." >&2

# Get Console PR numbers directly from git log
# NOTE: Console PRs are merged to origin/release-console, not main
PR_NUMBERS=$(git log origin/release-console --since="$SINCE_DATE 00:00:00" --until="$UNTIL_DATE 23:59:59" --oneline | \
  grep "\[console" | \
  grep -oE "#[0-9]+" | \
  sort -u | \
  tr -d '#')

TOTAL=$(echo "$PR_NUMBERS" | wc -l | tr -d ' ')

echo "Found $TOTAL Console PRs" >&2
echo "Extracting data..." >&2

# Clear output file
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

    # Get commit metadata
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
PR_DATA_FILE="$OUTPUT_DIR/pr_data_for_claude_${TODAY}.txt"
/tmp/extract_console_prs.sh "$NEON_CLOUD_REPO" "$PR_DATA_FILE" "$LAST_FRIDAY" "$TODAY"
```

The script will:
1. Fetch latest changes from origin
2. Query git for all Console PRs merged to `origin/release-console` in the date range
3. Extract commit metadata, file changes, and diff samples for each PR
4. Save everything to `../changelog_work/pr_data_for_claude_YYYY-MM-DD.txt`

## Step 4: Analyze PRs

Now you (Claude) will read the extracted data file in chunks and analyze all PRs.

**Read the file in chunks:**
- The file may be large (200KB+), so read it in chunks of 1500-2000 lines
- Use offset and limit parameters with the Read tool
- Analyze all PRs systematically

**For each PR, evaluate:**

1. **Is it customer-facing?**
   - ✅ YES: New UI features, visible changes, bug fixes users notice, public API changes
   - ❌ NO: Internal refactoring, admin endpoints, infrastructure, CI/CD, ops scripts, billing jobs

2. **Is it behind a feature flag?**
   - Look for: `__IS_NEON_VARIANT__`, `isFeatureEnabled`, feature flag checks
   - If yes: Note it, may not be released yet

3. **Is it Lakebase-specific?**
   - Look for: "Lakebase", "LKB-" tickets, Databricks-specific features
   - Decide if appropriate for main Neon changelog

4. **What's the user impact?**
   - Read the actual diff to understand what changed
   - Consider: What can users now do? Why does it matter?

**Scoring Heuristics** (use your judgment):

- **Definitely Include:** New UI pages/components, visual changes, public API additions, significant UX improvements
- **Consider Including:** Bug fixes affecting user experience, UI text improvements, modal/form fixes
- **Skip:** Test-only changes, refactoring, config changes, internal APIs, admin tools, webhooks, billing jobs

## Step 5: Generate Triage Report

Create a detailed triage report showing ALL decisions:

**File:** `../changelog_work/triage_report_YYYY-MM-DD.md`

**Format:**

```markdown
# Console PR Triage Report
## [Date Range]

**Total PRs Analyzed:** [count]
**Date Range:** YYYY-MM-DD to YYYY-MM-DD
**Changelog Publication Date:** YYYY-MM-DD (next Friday)

---

## INCLUDE - Customer-Facing Features ([count] PRs)

### [Category Name - e.g., Data Masking]
- **[PR #XXXX](https://github.com/neondatabase/neon-cloud/pull/XXXX)** [console/ui] Feature title
  - **Decision:** INCLUDE
  - **Reasoning:** Major new feature, dedicated UI for configuring masking rules
  - **Customer Impact:** HIGH - New capability for working with anonymized branches
  - **Confidence:** HIGH

[Continue for all PRs to include, grouped by feature/category]

---

## EXCLUDE - Internal/Infrastructure ([count] PRs)

### [Category Name - e.g., Vercel Integration]
- **[PR #XXXX](https://github.com/neondatabase/neon-cloud/pull/XXXX)** [console/webhook] Feature title
  - **Decision:** EXCLUDE
  - **Reasoning:** Internal webhook processing for Vercel marketplace
  - **Customer Impact:** NONE - Backend integration work, not user-facing
  - **Confidence:** HIGH

[Continue for all excluded PRs, grouped by category]

---

## LAKEBASE-SPECIFIC FEATURES ([count] PRs)

**NOTE:** This section tracks PRs that appear to be Lakebase-specific. These should NOT be included in the main Neon changelog, but may be needed for a separate Lakebase changelog.

**Detection approach (cast a wide net):**
- Commit messages explicitly mentioning "Lakebase" or "lakebase"
- PRs that mention Databricks-specific features or integrations
- Code changes with `__IS_NEON_VARIANT__` checks (variant-specific behavior)
- Descriptions or context suggesting Lakebase-only functionality
- When in doubt, include here rather than in main changelog

**⚠️ Important:** We intentionally err on the side of INCLUDING more PRs here rather than being too narrow. Some Lakebase features may still slip into the main changelog draft - this is acceptable as humans will review all content before publication.

### [Category Name - e.g., Branch Settings]
- **[PR #XXXX](https://github.com/neondatabase/neon-cloud/pull/XXXX)** [console/lakebase] Feature title
  - **Lakebase Indicators:** [e.g., Explicit "Lakebase" mention, __IS_NEON_VARIANT__ check, Databricks context]
  - **Description:** [Brief description of what changed]
  - **Why flagged:** [Reason for thinking this is Lakebase-specific]

[Continue for all detected Lakebase PRs]

---

## CONFIDENCE SUMMARY

- **HIGH confidence (include):** [count] PRs
- **MEDIUM confidence (review):** [count] PRs
- **EXCLUDE:** [count] PRs
- **LAKEBASE-SPECIFIC:** [count] PRs

---

## BREAKDOWN BY CATEGORY

- Customer-Facing Features: [count]
- UI/UX Improvements: [count]
- Bug Fixes: [count]
- Lakebase-Specific: [count]
- Admin-Only: [count]
- Internal/Infrastructure: [count]
```

This report is for verification and collaboration with other writers. The Lakebase section helps writers identify PRs that should go in a separate Lakebase changelog.

## Step 6: Generate Changelog Draft

Create the final changelog file ready for publication.

**File:** `content/changelog/YYYY-MM-DD.md` (use NEXT_FRIDAY date)

**Voice Guidelines:**
- **Primary:** Humans writing for other humans
- **Secondary:** Developers writing for other developers
- Straightforward, clear, natural language
- NO marketing speak, NO trendy dev lingo
- Be factual and practical
- Example: "We've doubled our default storage quota from 8TB to 16TB"

**Title Guidelines:**
- Remove PR numbers, remove `[category/type]` prefixes
- Make it benefit-focused
- Examples:
  - NOT: "Update look of branch list and branch details pages"
  - YES: "Branch navigation improvements"

**Description Guidelines:**
- 2-3 sentences explaining what users can now do and why it matters
- Include examples where helpful (e.g., `main / development / feature-branch`)
- Natural language, conversational but professional
- Focus on benefit to user, not technical implementation

**Changelog Structure:**

```markdown
---
title: [Create title from 2-3 main themes - concise, user-focused]
---

## [User-friendly feature title]

[2-3 sentences in natural language. Start with "We've added..." or "You can now..."
Explain what changed and why it matters. Include examples if helpful.]

![Descriptive alt text](/docs/changelog/feature-slug-oct-2025.png)

For more information, see [Documentation](/docs/path).

## [Another feature]

[Description...]

<details>
<summary>**Fixes & improvements**</summary>

- Fixed [specific issue users experienced]. [Brief benefit statement.]
- Improved [area] to [benefit].
- [More bullets - keep concise]

</details>
```

**Important:** Follow the exact structure from existing changelog files. See `/content/changelog/2025-10-24.md` for a reference example.

## When to Skip PRs

**Always skip:**
- Internal billing jobs, forecasting
- RFCs and internal documentation
- Infrastructure, CI/CD, ops scripts
- Admin-only endpoints
- Webhooks (unless user-facing impact)
- Test-only changes
- Configuration and secret rotation
- Refactoring without new capabilities
- Vercel integration work (40+ PRs typically)

**Consider skipping:**
- Lakebase-specific features (separate product, decide based on relevance)
- Features behind flags (note in triage report for later)
- Small UI tweaks without clear user benefit
- Backend changes without visible impact

**Always include:**
- New UI features with visual changes
- Public API additions
- Bug fixes users would notice
- Performance improvements users experience
- UX enhancements
- Important announcements (e.g., deprecations)

## Output Summary

At the end, provide a summary:

```
✅ Extraction complete
   PR data: ../changelog_work/pr_data_for_claude_YYYY-MM-DD.txt
   [file size and PR count]

✅ Triage report generated
   File: ../changelog_work/triage_report_YYYY-MM-DD.md
   - Total PRs analyzed: [count]
   - Customer-facing: [count]
   - Excluded: [count]

✅ Changelog draft created
   File: content/changelog/YYYY-MM-DD.md (next Friday)
   - Main features: [count]
   - Fixes & improvements: [count]

Next steps:
1. Review triage report for accuracy
2. Edit changelog draft for polish
3. Add screenshots to /public/docs/changelog/
4. Commit and publish on Friday
```

## What Makes This Accurate

✅ **Reads actual diffs** - Understands what changed, not just file paths
✅ **Natural language generation** - No templates, writes like a human
✅ **Context awareness** - Knows what's internal vs external, what's behind flags
✅ **Smart filtering** - Typically 3-5 customer-facing items from 100+ PRs
✅ **Neon's voice** - Straightforward, practical, developer-focused
✅ **Portable** - Works for any contributor, no hardcoded paths

## Example: Real Changelog Entry

Good example from actual changelog:

```markdown
## Branch navigation improvements

We've added breadcrumb navigation to branch pages, making it easier to understand
and navigate your branch hierarchy. When viewing a child branch, you'll now see
the full lineage path (e.g., production / development / feature-branch) with
visual branch indicators.

![Branch breadcrumb navigation](/docs/changelog/branch-breadcrumbs-oct-2025.png)
```

This is the quality level to aim for: clear, benefit-focused, natural language.
