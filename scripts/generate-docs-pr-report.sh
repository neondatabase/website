#!/bin/bash

# Docs PR Report Generator
#
# This script generates reports of merged PRs from monitored repositories.
#
# Release Types:
#   - "branch": Repos with release branches (e.g., rc/release-control-plane/*)
#   - "tag": Repos with release tags (e.g., v1.2.3, release-compute-11092)
#   - "direct": Repos without formal releases (PRs merge directly to main)
#
# All types show merged PRs that are part of releases or merged to main.
#
# Optional env: DOCS_REPORT_CONFIG = path to monitored-repos.json (default: repo config/)
# Optional env: DOCS_REPORT_REPOS_BASE = base path for ~ in repo paths (default: $HOME)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="${DOCS_REPORT_CONFIG:-$WEBSITE_DIR/config/monitored-repos.json}"
REPOS_BASE="${DOCS_REPORT_REPOS_BASE:-$HOME}"
REPORT_DIR="$HOME/docs-reviews"
TIMESTAMP=$(date +"%Y-%m-%d-%H%M%S")
REPORT="$REPORT_DIR/docs-pr-report-$TIMESTAMP.md"

# Calculate default: last Friday 00:00 UTC
if [ -z "$1" ]; then
    # Get current day of week (0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday)
    DAY_OF_WEEK=$(date -u +%w)

    # Calculate days back to last Friday
    case $DAY_OF_WEEK in
        0) DAYS_BACK=2 ;;  # Sunday -> 2 days back (Friday)
        1) DAYS_BACK=3 ;;  # Monday -> 3 days back
        2) DAYS_BACK=4 ;;  # Tuesday -> 4 days back
        3) DAYS_BACK=5 ;;  # Wednesday -> 5 days back
        4) DAYS_BACK=6 ;;  # Thursday -> 6 days back
        5) DAYS_BACK=7 ;;  # Friday -> 7 days back (last Friday, not today)
        6) DAYS_BACK=1 ;;  # Saturday -> 1 day back
    esac

    SINCE_DATE="${DAYS_BACK} days ago"
else
    SINCE_DATE="$1"
fi

[[ "$SINCE_DATE" =~ ^--since= ]] && SINCE_DATE="${SINCE_DATE#--since=}"

# Calculate the since date in YYYY-MM-DD format for comparisons
# This handles "N days ago" format and converts to a date
# Default is calculated as "last Friday 00:00 UTC"
if [[ "$SINCE_DATE" =~ ([0-9]+)\ days?\ ago ]]; then
    DAYS_AGO="${BASH_REMATCH[1]}"
    SINCE_DATE_COMPARE=$(date -u -v-${DAYS_AGO}d "+%Y-%m-%d" 2>/dev/null || date -u -d "$SINCE_DATE" "+%Y-%m-%d")
else
    # For absolute dates like "2026-01-20", use as-is or parse
    SINCE_DATE_COMPARE=$(date -u -j -f "%Y-%m-%d" "$SINCE_DATE" "+%Y-%m-%d" 2>/dev/null || date -u -d "$SINCE_DATE" "+%Y-%m-%d" 2>/dev/null || echo "$SINCE_DATE")
fi

mkdir -p "$REPORT_DIR"

echo "======================================"
echo "Docs PR Report Generator"
echo "======================================"
echo "Period: $SINCE_DATE → Now"
echo "Output: $REPORT"
echo ""

# Header
cat > "$REPORT" << EOF
# Documentation PR Report
**Generated:** $(date -u "+%A, %B %d, %Y %H:%M UTC")
**Period:** $SINCE_DATE → Now

**Documentation Impact Legend:**
✅ Likely needs documentation
❓ May need documentation (review recommended)
❌ Unlikely to need documentation

---

EOF

# Update all repos
echo "Updating repositories..."
jq -r '.repos[] | "\(.path)"' "$CONFIG_FILE" | while read -r path; do
    path=$(echo "$path" | sed "s|^~|$REPOS_BASE|")
    [ -d "$path/.git" ] && (cd "$path" && git pull --quiet 2>/dev/null) || true
done
echo ""

REPO_COUNT=$(jq '.repos | length' "$CONFIG_FILE")
FOUND_RELEASES=0
REPOS_WITH_RELEASES=()
REPOS_WITHOUT_RELEASES=()

# Function to determine doc impact indicator
# Returns: ❌ (unlikely), ✅ (likely), or ❓ (uncertain)
get_doc_indicator() {
    local category="$1"
    local title="$2"
    local repo="$3"  # Add repo parameter

    # Categories unlikely to need docs (internal/infrastructure)
    # Including: control plane scripts, workers, infra previews, local dev docker
    # billing-manager/enrichment, billing/chore, console/admin, cplane/billing
    if [[ "$category" =~ ^(billing-manager/configs|billing-manager/general|billing-manager/enrichment|billing/chore|console/admin|console/admin UI|console/docker|console/e2e|cplane/internal|cplane/script|cplane/worker|cplane/billing|infra/ci|infra/deploy|infra/dev|infra/preview|lbm/ci|lbm/config|.*docker.*|.*e2e.*|.*test.*|.*ci.*|.*deploy.*|.*build.*|.*internal.*|.*local.*dev.*) ]]; then
        echo "❌"
        return
    fi

    # Title patterns that are unlikely to need docs (strip category prefix first)
    local title_no_cat=$(echo "$title" | sed 's/^\[[^]]*\] //')

    # CONSOLE/UI PRs - Always ✅ or ❓, NEVER ❌
    # Must check BEFORE generic chore/test patterns
    if [[ "$category" =~ console/ui ]]; then
        # Mentions specific pages (monitoring, metering, provisioned instances, etc.)
        if [[ "$title_no_cat" =~ (page|Page|monitoring|Monitoring|metering|Metering|provisioned|Provisioned|chart|Chart|dashboard|Dashboard) ]]; then
            echo "✅"
            return
        fi
        # UI element changes (buttons, forms, controls)
        if [[ "$title_no_cat" =~ (button|Button|disable|Disable|enable|Enable|form|Form|input|Input|modal|Modal) ]]; then
            echo "✅"
            return
        fi
        # Chart or overflow issues (likely changelog items)
        if [[ "$title_no_cat" =~ (overflow|Overflow|chart|Chart) ]]; then
            echo "✅"
            return
        fi
        # Features always get ✅
        if [[ "$title_no_cat" =~ ^(feat|feature|add|new|implement|Feat|Add|New) ]]; then
            echo "✅"
            return
        fi
        # Everything else in console/ui gets ❓ (including chores, fixes, improvements)
        echo "❓"
        return
    fi

    # CONSOLE/BE (backend) PRs - Always ❓ unless it's a clear feature
    if [[ "$category" =~ console/be ]]; then
        # Clear features get ✅
        if [[ "$title_no_cat" =~ ^(feat|feature|add|new|implement|Feat|Add|New) ]]; then
            echo "✅"
            return
        fi
        # Everything else gets ❓
        echo "❓"
        return
    fi

    # Generic title patterns unlikely to need docs (for non-console/ui categories)
    if [[ "$title_no_cat" =~ ^(chore|test|ci|build|refactor|style|perf|deps|Bump|Update.*dependencies|fix.*test|test.*fix)[\(:]  ]]; then
        echo "❌"
        return
    fi

    # NEON LOCAL VS CODE EXTENSION - High likelihood unless clearly internal
    if [[ "$repo" == "neon_local_vs_code_extension" ]]; then
        # Internal updates unlikely to need docs
        if [[ "$title_no_cat" =~ (refactor|internal|test|ci|build|deps) ]]; then
            echo "❌"
            return
        fi
        # Otherwise, extension changes likely need docs
        echo "✅"
        return
    fi

    # EXTENSION UPGRADES in hadron (compute/storage) - Always need docs
    if [[ "$repo" == "hadron" ]] && [[ "$title_no_cat" =~ (extension|Extension|upgrade|Upgrade|update.*extension|Update.*extension) ]]; then
        echo "✅"
        return
    fi

    # MCP server tools always need docs (adding, modifying, or fixing tools)
    if [[ "$title_no_cat" =~ (tool|Tool) ]]; then
        if [[ "$title_no_cat" =~ (add|new|feat|feature|fix|modify|update|change|make|Add|New|Feat|Feature|Fix|Modify|Update|Change|Make) ]]; then
            echo "✅"
            return
        fi
    fi

    # mcp-server-neon repo: most changes affect user-facing MCP tools
    if [[ "$repo" == "mcp-server-neon" ]]; then
        if [[ "$title_no_cat" =~ ^(feat|feature|add|new|implement|Feat|Add|New) ]]; then
            echo "✅"
            return
        elif [[ "$title_no_cat" =~ ^(fix|Fix) ]] && [[ ! "$title_no_cat" =~ (link|typo|formatting) ]]; then
            echo "✅"  # Fixes likely change tool behavior
            return
        fi
    fi

    # User-facing categories with features or fixes
    # (console/ui and console/be are handled earlier with specific rules)
    if [[ "$category" =~ (console/fe|api/all|public_api|lbm/public_api|billing/ui|billing/api) ]]; then
        if [[ "$title_no_cat" =~ ^(feat|feature|add|new|implement|Feat|Add|New)  ]]; then
            echo "✅"
            return
        elif [[ "$title_no_cat" =~ ^(fix|bug|Fix|Bug)  ]]; then
            echo "❓"
            return
        elif [[ "$title_no_cat" =~ ^(impr|improve|Impr|Improve)  ]]; then
            echo "❓"
            return
        fi
    fi

    # Limit changes - May need docs (e.g., "remove hardcoded limits")
    if [[ "$title_no_cat" =~ (limit|Limit|limits|Limits|hardcoded|Hardcoded) ]]; then
        echo "❓"
        return
    fi

    # Breaking changes always need docs
    if [[ "$title_no_cat" =~ (breaking|BREAKING|deprecated|deprecate) ]]; then
        echo "✅"
        return
    fi

    # Documentation changes
    if [[ "$title_no_cat" =~ ^(docs|doc|Docs|Doc)[\(:]  ]]; then
        echo "❌"  # Already documented
        return
    fi

    # Default: uncertain for everything else
    echo "❓"
}

export -f get_doc_indicator

# Process each repo
for i in $(seq 0 $((REPO_COUNT - 1))); do
    name=$(jq -r ".repos[$i].name" "$CONFIG_FILE")
    path=$(jq -r ".repos[$i].path" "$CONFIG_FILE" | sed "s|^~|$REPOS_BASE|")
    rel_type=$(jq -r ".repos[$i].release_type" "$CONFIG_FILE")
    org=$(jq -r ".repos[$i].github_org" "$CONFIG_FILE")
    repo=$(jq -r ".repos[$i].github_repo" "$CONFIG_FILE")
    organize=$(jq -r ".repos[$i].organize_by_category" "$CONFIG_FILE")
    group_by_component=$(jq -r ".repos[$i].group_by_release_component // \"false\"" "$CONFIG_FILE")

    [ ! -d "$path/.git" ] && continue

    cd "$path"
    echo "Processing $name ($rel_type)..."

    TEMP_OUT="/tmp/repo_${name}_$$.txt"
    rm -f "$TEMP_OUT"
    REPO_HAD_RELEASES=false

    if [ "$rel_type" == "branch" ]; then
        # Find recent release branches (control-plane and console)
        for branch in $(git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/remotes/origin | grep "rc/release-" | head -5); do
            # Check if branch HEAD is recent (using UTC dates)
            branch_date=$(git log -1 --format=%aI "$branch" 2>/dev/null | cut -d'T' -f1)

            if [[ "$branch_date" > "$SINCE_DATE_COMPARE" ]] || [[ "$branch_date" == "$SINCE_DATE_COMPARE" ]]; then
                # Get commits
                git log --oneline --no-merges "$branch" --format="%s" | head -30 | \
                while read -r line; do
                    echo "$line" | grep -qE "^(Release|Hotfix|Control-plane release)" && continue
                    pr=$(echo "$line" | grep -oE '#[0-9]+' | head -1 | tr -d '#' || echo "")
                    [ -n "$pr" ] && line=$(echo "$line" | sed "s|(#${pr})|([#${pr}](https://github.com/${org}/${repo}/pull/${pr}))|")
                    cat=$(echo "$line" | grep -oE '^\[[^]]+\]' | tr -d '[]' || echo "")
                    echo "${cat:-Other}|$line"
                done
                FOUND_RELEASES=$((FOUND_RELEASES + 1))
            fi
        done | sort -u | sort -t'|' -k1 > "$TEMP_OUT"

    elif [ "$rel_type" == "direct" ]; then
        # Direct merges to main (no releases)
        # Get merged PRs since the time window
        git log --since="$SINCE_DATE" --first-parent main --format="%s" | \
        while read -r line; do
            # Skip release markers and plain branch merges (without PR numbers)
            echo "$line" | grep -qE "^(chore\(release\)|Release)" && continue
            echo "$line" | grep -qE "^Merge branch" && continue

            # Extract PR number from either "Merge pull request #XX" or "commit message (#XX)"
            if [[ "$line" =~ Merge\ pull\ request\ \#([0-9]+) ]]; then
                # GitHub style: "Merge pull request #33 from org/branch"
                pr="${BASH_REMATCH[1]}"
                # Extract branch name as a hint for the change
                branch=$(echo "$line" | sed -n 's/.*from [^/]*\/\([^ ]*\).*/\1/p')
                if [ -n "$branch" ]; then
                    # Clean up branch name (remove dashes, make it more readable)
                    title=$(echo "$branch" | sed 's/-/ /g' | sed 's/^/PR: /')
                else
                    title="Pull Request"
                fi
                line="$title ([#${pr}](https://github.com/${org}/${repo}/pull/${pr}))"
            elif [[ "$line" =~ \(#[0-9]+\) ]]; then
                # Commit message style: "fix: something (#123)"
                pr=$(echo "$line" | grep -oE '#[0-9]+' | head -1 | tr -d '#' || echo "")
                [ -n "$pr" ] && line=$(echo "$line" | sed "s|(#${pr})|([#${pr}](https://github.com/${org}/${repo}/pull/${pr}))|")
            else
                # No PR number found, skip
                continue
            fi

            echo "Uncategorized|$line"
        done | sort -u > "$TEMP_OUT"

        [ -s "$TEMP_OUT" ] && FOUND_RELEASES=$((FOUND_RELEASES + 1))

    elif [ "$rel_type" == "tag" ]; then
        if [ "$group_by_component" == "true" ]; then
            # Hadron-style: Group by release component (compute, storage, proxy, hcm)
            TEMP_BY_COMPONENT="/tmp/by_component_${name}_$$.txt"
            rm -f "$TEMP_BY_COMPONENT"

            for tag in $(git tag --sort=-creatordate | grep -E "release-(compute|storage|proxy|hcm)" | head -10); do
                # Check if tag itself was created recently (using UTC dates)
                tag_date=$(git log -1 --format=%aI "$tag" 2>/dev/null | cut -d'T' -f1)

                if [[ "$tag_date" > "$SINCE_DATE_COMPARE" ]] || [[ "$tag_date" == "$SINCE_DATE_COMPARE" ]]; then
                    # Extract component from tag name (e.g., "release-compute-11092" -> "compute")
                    component=$(echo "$tag" | sed -n 's/release-\([^-]*\)-.*/\1/p')

                    # Get component display name
                    component_display=$(jq -r ".repos[$i].release_components.\"$component\" // \"$component\"" "$CONFIG_FILE")

                    # Find previous tag of same component
                    prev=$(git tag --sort=-creatordate | grep "release-$component-" | grep -A1 "$tag" | tail -1)
                    [ "$prev" == "$tag" ] && prev=""

                    range="${prev:+$prev..}$tag"
                    git log --oneline --no-merges "$range" --format="%s" | head -20 | \
                    while read -r line; do
                        echo "$line" | grep -qE "^(chore\(release\)|Release)" && continue
                        pr=$(echo "$line" | grep -oE '#[0-9]+' | head -1 | tr -d '#' || echo "")
                        [ -n "$pr" ] && line=$(echo "$line" | sed "s|(#${pr})|([#${pr}](https://github.com/${org}/${repo}/pull/${pr}))|")
                        echo "$component_display|$line"
                    done >> "$TEMP_BY_COMPONENT"
                    FOUND_RELEASES=$((FOUND_RELEASES + 1))
                fi
            done

            # Sort and deduplicate
            [ -f "$TEMP_BY_COMPONENT" ] && sort -u "$TEMP_BY_COMPONENT" | sort -t'|' -k1 > "$TEMP_OUT"
            rm -f "$TEMP_BY_COMPONENT"

        else
            # Standard tag-based releases (neonctl, neon-js, neon-api-python, serverless, etc.)
            # No release PRs: only show merged PRs in the time window. Use tag creatordate (when the
            # release was cut) and only the single most recent tag in the window so we don't aggregate
            # multiple releases.
            {
                while read -r tag_date tag_name; do
                    [[ -z "$tag_date" || -z "$tag_name" ]] && continue
                    # Tag creatordate must be on or after the since date (YYYY-MM-DD comparison)
                    [[ "$tag_date" < "$SINCE_DATE_COMPARE" ]] && continue
                    prev=$(git describe --abbrev=0 "$tag_name^" 2>/dev/null || echo "")
                    range="${prev:+$prev..}$tag_name"
                    git log --since="$SINCE_DATE" --oneline --no-merges "$range" --format="%s" 2>/dev/null | head -30 | \
                    while read -r line; do
                        echo "$line" | grep -qE "^(chore\(release\)|Release)" && continue
                        pr=$(echo "$line" | grep -oE '#[0-9]+' | head -1 | tr -d '#' || echo "")
                        [ -n "$pr" ] && line=$(echo "$line" | sed "s|(#${pr})|([#${pr}](https://github.com/${org}/${repo}/pull/${pr}))|")
                        echo "Uncategorized|$line"
                    done
                    FOUND_RELEASES=$((FOUND_RELEASES + 1))
                    break
                done < <(git for-each-ref refs/tags --sort=-creatordate --format='%(creatordate:short) %(refname:short)' 2>/dev/null | head -20)
            } | sort -u > "$TEMP_OUT"
        fi
    fi

    # Write to report if we have commits
    if [ -f "$TEMP_OUT" ] && [ -s "$TEMP_OUT" ]; then
        REPO_HAD_RELEASES=true
        REPOS_WITH_RELEASES+=("$name")

        echo "## $name" >> "$REPORT"
        echo "" >> "$REPORT"

        if [ "$organize" == "true" ] || [ "$group_by_component" == "true" ]; then
            # Organized by category or component
            LAST_CAT=""
            while IFS='|' read -r category commit; do
                if [ "$category" != "$LAST_CAT" ]; then
                    [ -n "$LAST_CAT" ] && echo "" >> "$REPORT"
                    echo "### $category" >> "$REPORT"
                    echo "" >> "$REPORT"
                    LAST_CAT="$category"
                fi
                # Add doc impact indicator
                indicator=$(get_doc_indicator "$category" "$commit" "$name")
                echo "- $indicator $commit" >> "$REPORT"
            done < "$TEMP_OUT"
        else
            # Simple list
            while IFS='|' read -r category commit; do
                indicator=$(get_doc_indicator "$category" "$commit" "$name")
                echo "- $indicator $commit" >> "$REPORT"
            done < "$TEMP_OUT"
        fi

        echo "" >> "$REPORT"
        echo "---" >> "$REPORT"
        echo "" >> "$REPORT"
    else
        REPOS_WITHOUT_RELEASES+=("$name")
    fi

    rm -f "$TEMP_OUT"
done

# Add summary section at the end
cat >> "$REPORT" << EOF
---

## Summary

**Repositories Checked:** $REPO_COUNT
**Repositories with merged PRs:** ${#REPOS_WITH_RELEASES[@]}
**Repositories without merged PRs:** ${#REPOS_WITHOUT_RELEASES[@]}

EOF

if [ ${#REPOS_WITH_RELEASES[@]} -gt 0 ]; then
    echo "### Repositories with merged PRs" >> "$REPORT"
    echo "" >> "$REPORT"
    for repo in "${REPOS_WITH_RELEASES[@]}"; do
        echo "- ✅ **$repo**" >> "$REPORT"
    done
    echo "" >> "$REPORT"
fi

if [ ${#REPOS_WITHOUT_RELEASES[@]} -gt 0 ]; then
    echo "### Repositories without merged PRs in this period" >> "$REPORT"
    echo "" >> "$REPORT"
    for repo in "${REPOS_WITHOUT_RELEASES[@]}"; do
        echo "- ⚪ $repo" >> "$REPORT"
    done
    echo "" >> "$REPORT"
fi

echo ""
echo "======================================"
echo "✅ Report Generated"
echo "======================================"
echo "Location: $REPORT"
echo "Releases: $FOUND_RELEASES"
echo "Repos with releases: ${#REPOS_WITH_RELEASES[@]}/$REPO_COUNT"
