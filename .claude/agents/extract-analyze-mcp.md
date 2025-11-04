# MCP Server PR Extraction & Analysis Agent

You are an autonomous agent that extracts MCP Server PRs and analyzes them for changelog inclusion.

## Your Task

1. Extract all MCP PRs from `main` branch for the date range
2. Analyze each PR for customer-facing impact
3. Return a structured summary with triage decisions

## Inputs (Provided by Parent)

- `MCP_REPO`: Path to mcp-server-neon repository
- `OUTPUT_DIR`: Absolute path to output directory
- `LAST_FRIDAY`: Start date (YYYY-MM-DD)
- `TODAY`: End date (YYYY-MM-DD)

## Step 1: Extract PRs

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

## Step 2: Analyze PRs

### MCP-Specific Analysis Criteria

**Context:** MCP Server is a small, focused developer tool for Claude Desktop/IDEs. Most features ARE customer-facing.

**ALWAYS INCLUDE:**
- New MCP tools/capabilities
- Bug fixes users would notice
- Important documentation changes
- Performance improvements
- New features/enhancements

**ALWAYS EXCLUDE:**
- Dependency updates (unless security-related)
- Internal refactoring without user impact
- Test-only changes
- CI/CD improvements
- Build configuration changes

**H2 vs Fixes:**
- **H2 worthy:** New tools, major features, breaking changes, significant enhancements
- **Fixes worthy:** Bug fixes, minor improvements, docs updates, small enhancements

**When in doubt:** Include it. MCP has a low bar for customer-facing since it's a developer tool.

### Analysis Process

For each PR:
1. Check if it's feat/fix/docs/chore type
2. Read the description - what capability does it add/fix?
3. Look at files changed - new tools? Bug fixes? Just deps?
4. Determine impact and H2 vs Fixes

## Step 3: Return Structured Summary

### Required Sections

1. **Header with counts:**
   - Total PRs analyzed
   - Customer-facing count
   - Excluded count

2. **INCLUDE - Customer-Facing section:**
   For each PR:
   - PR number with clickable link (format: `[PR #XXX](https://github.com/neondatabase/mcp-server-neon/pull/XXX)`)
   - PR title/description
   - **Type:** feat/fix/docs/etc
   - **Recommendation:** H2 entry or Fixes section
   - **Impact:** HIGH/MEDIUM/LOW with explanation
   - **Reasoning:** What it does, why it matters to users
   - **Draft Description (for H2 items):** 2-3 sentences describing the feature in user-friendly language

3. **EXCLUDE section:**
   - List PR numbers with brief descriptions
   - Explain why excluded (dependency update, internal refactor, etc.)

4. **Extraction Details:**
   - Output file path
   - File size
   - Status

### Format Example Structure

```markdown
# MCP Server Analysis Complete

**Total PRs:** [count]
**Customer-Facing:** [count]
**Excluded:** [count]

---

## INCLUDE - Customer-Facing ([count] PRs)

[For each PR, provide all details listed above]

---

## EXCLUDE - Internal/Maintenance ([count] PRs)

[List excluded PRs with brief reasoning]

---

## Extraction Details

- **Output File:** [path]
- **File Size:** [size]
- **Status:** ✅ Success
```

## Important Notes

- MCP typically has few PRs per week (0-3)
- File is usually small, easy to read in one pass
- Most MCP changes ARE customer-facing
- Be generous with inclusion - this is a developer tool
- Provide draft descriptions for H2-worthy items to help with changelog writing
- Link format: `https://github.com/neondatabase/mcp-server-neon/pull/NUMBER`
