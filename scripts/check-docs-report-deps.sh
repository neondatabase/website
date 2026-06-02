#!/bin/bash

# Docs PR Report – dependency checker
# Run from website repo root. Exit 0 if all required deps are present; non-zero otherwise.
# Prints what's OK, what's missing, and what to do. Agent should ask user if they want to proceed with setup.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="${DOCS_REPORT_CONFIG:-$WEBSITE_DIR/config/monitored-repos.json}"
REPOS_BASE="${DOCS_REPORT_REPOS_BASE:-$HOME}"

MISSING=()
OK=()

# --- jq
if command -v jq &>/dev/null; then
    OK+=("jq (installed)")
else
    MISSING+=("jq – required to parse config and run the report. Install: brew install jq (macOS) or equivalent.")
fi

# --- git
if command -v git &>/dev/null; then
    OK+=("git (installed)")
else
    MISSING+=("git – required to read repo history. Install git for your OS.")
fi

# --- config file
if [ -f "$CONFIG_FILE" ]; then
    OK+=("config (found at $CONFIG_FILE)")
else
    MISSING+=("config file – not found at $CONFIG_FILE. Ensure you're in the website repo root. If using a custom config, set DOCS_REPORT_CONFIG to its path.")
fi

# --- repos (only if config exists)
REPOS_PRESENT=0
REPOS_MISSING_NAMES=()
if [ -f "$CONFIG_FILE" ]; then
    REPO_COUNT=$(jq '.repos | length' "$CONFIG_FILE")
    for i in $(seq 0 $((REPO_COUNT - 1))); do
        REPO_PATH=$(jq -r ".repos[$i].path" "$CONFIG_FILE" | sed "s|^~|$REPOS_BASE|")
        if [ -d "$REPO_PATH/.git" ]; then
            REPOS_PRESENT=$((REPOS_PRESENT + 1))
        else
            REPO_NAME=$(jq -r ".repos[$i].name" "$CONFIG_FILE")
            REPOS_MISSING_NAMES+=("$REPO_NAME")
        fi
    done
    if [ "$REPOS_PRESENT" -eq "$REPO_COUNT" ]; then
        OK+=("repos ($REPOS_PRESENT/$REPO_COUNT cloned)")
    elif [ "$REPOS_PRESENT" -gt 0 ]; then
        OK+=("repos ($REPOS_PRESENT/$REPO_COUNT cloned – report will include only these; missing: ${REPOS_MISSING_NAMES[*]}.)")
    else
        MISSING+=("repos – none of the $REPO_COUNT monitored repos are cloned. Run ./scripts/setup-repos.sh to clone them (or say yes when the agent offers to run it).")
    fi
fi

# --- output
echo "======================================"
echo "Docs PR Report – dependency check"
echo "======================================"
echo ""

for item in "${OK[@]}"; do
    echo "✅ $item"
done
if [ ${#MISSING[@]} -gt 0 ]; then
    for item in "${MISSING[@]}"; do
        echo "❌ $item"
    done
fi

echo ""

if [ ${#MISSING[@]} -eq 0 ]; then
    echo "All requirements are satisfied. You can run the report."
    exit 0
fi

echo "--------------------------------------"
echo "What to do next:"
echo "  1. For missing jq or git: install them (e.g. brew install jq), then run this check again or ask to create a docs PR report again."
echo "  2. For missing repos: you can run ./scripts/setup-repos.sh to clone them. The agent can run it for you with: ./scripts/setup-repos.sh --yes"
echo ""
echo "If you want the agent to run the setup script to clone missing repos now, say 'yes' or 'proceed'. Then run 'create a docs PR report' again after setup finishes."
echo "======================================"
exit 1
