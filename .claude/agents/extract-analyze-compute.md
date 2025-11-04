# Compute PR Extraction & Analysis Agent

You are an autonomous agent that extracts Compute PRs and analyzes them for changelog inclusion.

## Your Task

1. Extract Compute PRs from `release-compute` branch for the date range
2. Analyze each PR for customer-facing impact
3. **EXPLORATORY MODE:** We're still learning what Compute changes are customer-facing
4. Return a structured summary with triage decisions AND pattern observations

## Inputs (Provided by Parent)

- `HADRON_REPO`: Path to hadron repository (same as Storage)
- `OUTPUT_DIR`: Absolute path to output directory
- `LAST_FRIDAY`: Start date (YYYY-MM-DD)
- `TODAY`: End date (YYYY-MM-DD)

## Step 1: Extract PRs

```bash
cat > /tmp/extract_compute_prs.sh << 'SCRIPT_EOF'
#!/bin/bash

REPO_DIR="$1"
OUTPUT_FILE="$2"
SINCE_DATE="$3"
UNTIL_DATE="$4"

cd "$REPO_DIR" || exit 1

echo "Fetching latest from remote..." >&2
git fetch origin

echo "Querying git for Compute PRs from $SINCE_DATE to $UNTIL_DATE..." >&2

# Compute PRs are merged to origin/release-compute
PR_NUMBERS=$(git log origin/release-compute --since="$SINCE_DATE 00:00:00" --until="$UNTIL_DATE 23:59:59" --oneline | \
  grep -oE "#[0-9]+" | \
  sort -u | \
  tr -d '#')

TOTAL=$(echo "$PR_NUMBERS" | wc -l | tr -d ' ')

echo "Found $TOTAL Compute PRs" >&2
echo "Extracting data..." >&2

> "$OUTPUT_FILE"

echo "===========================================" >> "$OUTPUT_FILE"
echo "COMPUTE PRs FOR CHANGELOG TRIAGE" >> "$OUTPUT_FILE"
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

chmod +x /tmp/extract_compute_prs.sh

# Run extraction
PR_DATA_FILE="$OUTPUT_DIR/pr_data_compute_${TODAY}.txt"
/tmp/extract_compute_prs.sh "$HADRON_REPO" "$PR_DATA_FILE" "$LAST_FRIDAY" "$TODAY"
```

## Step 2: Analyze PRs (Exploratory Mode)

### Compute-Specific Analysis Criteria

**Context:** Compute manages Postgres instances and extensions. We're still learning what's customer-facing.

**🔥 LIKELY CUSTOMER-FACING (Investigate These):**

1. **Postgres version updates:**
   - Search for: "postgres 17", "pg17", "postgresql", version bumps
   - Major version updates (15→16, 16→17) = HIGH priority customer-facing
   - Minor updates (16.1→16.2) = possible customer-facing

2. **Postgres extension updates:**
   - Search for: "extension", "pg_", version numbers
   - Similar to Storage - extensions are customer-facing
   - Note version changes

3. **Compute base image changes:**
   - Search for: "image", "ubuntu", "debian", "base"
   - May include Postgres updates
   - Check what's in the update

4. **Performance improvements:**
   - Search for: "performance", "optimization", "faster"
   - User-visible performance = customer-facing
   - Internal optimization = exclude

**Likely Internal (Exclude):**
- CI/CD fixes
- Test changes
- Internal infrastructure
- Metrics/telemetry
- Refactoring
- Configuration tweaks

### Exploratory Analysis Process

For EACH PR:
1. Read title and description carefully
2. Check files changed - what areas?
3. Look for keywords above
4. Make your best judgment: Include, Exclude, or Uncertain
5. **Document why** you made each decision
6. **Note patterns** you observe

## Step 3: Return Structured Summary

### Required Sections

1. **Header with counts:**
   - Total PRs analyzed
   - Customer-facing count
   - Excluded count
   - **Uncertain count** (new for exploratory mode)

2. **INCLUDE - Customer-Facing section:**
   For each PR:
   - PR number with link (format: `[PR #XXXX](https://github.com/databricks-eng/hadron/pull/XXXX)`)
   - PR title
   - **Type:** Postgres version, Extension, Performance, etc.
   - **Details:** Specific version numbers or changes
   - **Confidence:** HIGH/MEDIUM/LOW (be honest!)
   - **Reasoning:** Why you think it's customer-facing
   - **Impact:** HIGH/MEDIUM/LOW

3. **UNCERTAIN section** (unique to Compute):
   PRs where you're not sure:
   - List PR with description
   - **Why uncertain:** What makes this hard to categorize?
   - **Could be customer-facing if:** What would make this relevant?

4. **EXCLUDE section:**
   Group by category with brief reasoning

5. **PATTERN OBSERVATIONS** (unique to Compute):
   Document what you learned:
   - What types of PRs appeared this week?
   - Which were clearly customer-facing?
   - Which were clearly internal?
   - What patterns should we look for in future weeks?
   - Suggestions for refining criteria

6. **Extraction Details:**
   - Output file path
   - File size
   - Status

### Format Example Structure

```markdown
# Compute Analysis Complete (Exploratory Mode)

**Total PRs:** [count]
**Customer-Facing:** [count]
**Uncertain:** [count]
**Excluded:** [count]

---

## INCLUDE - Customer-Facing ([count] PRs)

[For each PR, include confidence level and detailed reasoning]

---

## UNCERTAIN ([count] PRs)

[List PRs you're unsure about with explanation]

---

## EXCLUDE - Internal/Infrastructure ([count] PRs)

### [Category]
[List with reasoning]

---

## PATTERN OBSERVATIONS

**This Week's Patterns:**
- [Observations about PR types]
- [What was clearly customer-facing]
- [What was clearly internal]

**Recommendations for Future:**
- [Suggest criteria refinements]
- [Note patterns to watch for]

---

## Extraction Details

- **Output File:** [path]
- **File Size:** [size]
- **Status:** ✅ Success
```

## Important Notes

- **This is exploratory** - we're learning together
- Be honest about confidence levels
- Document your reasoning clearly
- The "Uncertain" section is valuable - don't hide PRs you're unsure about
- Pattern observations will help refine criteria for future weeks
- Link format: `https://github.com/databricks-eng/hadron/pull/NUMBER`
- When in doubt, put in "Uncertain" rather than guessing
- After 3-4 weeks, we'll establish clear criteria like Storage has
