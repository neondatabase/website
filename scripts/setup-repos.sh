#!/bin/bash

# Repository Setup Script
# Helps team members clone all required repositories.
#
# Optional env: DOCS_REPORT_CONFIG = path to monitored-repos.json
# Optional env: DOCS_REPORT_REPOS_BASE = base path for ~ in repo paths (default: $HOME)
# Optional: pass --yes to clone missing repos without prompting (e.g. when run by the agent)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="${DOCS_REPORT_CONFIG:-$WEBSITE_DIR/config/monitored-repos.json}"
REPOS_BASE="${DOCS_REPORT_REPOS_BASE:-$HOME}"
AUTO_YES=false
[[ "${1:-}" == "--yes" ]] && AUTO_YES=true

echo "======================================"
echo "Documentation Repos Setup"
echo "======================================"
echo ""

# Read config
REPO_COUNT=$(jq '.repos | length' "$CONFIG_FILE")
echo "Checking $REPO_COUNT repositories..."
echo ""

MISSING_REPOS=()
EXISTING_REPOS=()

for i in $(seq 0 $((REPO_COUNT - 1))); do
    REPO_NAME=$(jq -r ".repos[$i].name" "$CONFIG_FILE")
    REPO_PATH=$(jq -r ".repos[$i].path" "$CONFIG_FILE" | sed "s|^~|$REPOS_BASE|")
    REPO_URL=$(jq -r ".repos[$i].github_url" "$CONFIG_FILE")

    if [ -d "$REPO_PATH/.git" ]; then
        echo "✅ $REPO_NAME (exists at $REPO_PATH)"
        EXISTING_REPOS+=("$REPO_NAME")
    else
        echo "❌ $REPO_NAME (missing, should be at $REPO_PATH)"
        MISSING_REPOS+=("$REPO_NAME|$REPO_PATH|$REPO_URL")
    fi
done

echo ""
echo "Summary:"
echo "  Existing: ${#EXISTING_REPOS[@]}"
echo "  Missing: ${#MISSING_REPOS[@]}"
echo ""

if [ ${#MISSING_REPOS[@]} -eq 0 ]; then
    echo "🎉 All repositories are set up!"
    exit 0
fi

echo "Missing repositories need to be cloned."
echo ""

if [ "$AUTO_YES" = true ]; then
    REPLY=y
else
    read -p "Would you like to clone them now? (y/n) " -n 1 -r
    echo ""
fi

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipped. You can clone them manually later."
    echo ""
    echo "To clone manually, run:"
    for entry in "${MISSING_REPOS[@]}"; do
        IFS='|' read -r NAME PATH URL <<< "$entry"
        PARENT_DIR=$(dirname "$PATH")
        echo "  mkdir -p \"$PARENT_DIR\" && cd \"$PARENT_DIR\" && git clone $URL"
    done
    exit 0
fi

echo ""
echo "Cloning missing repositories..."
echo ""

for entry in "${MISSING_REPOS[@]}"; do
    IFS='|' read -r NAME PATH URL <<< "$entry"
    PARENT_DIR=$(dirname "$PATH")

    echo "Cloning $NAME..."
    mkdir -p "$PARENT_DIR"

    if git clone "$URL" "$PATH"; then
        echo "  ✅ Successfully cloned $NAME"
    else
        echo "  ❌ Failed to clone $NAME"
        echo "     You may need to set up SSH keys or check permissions"
    fi
    echo ""
done

echo "======================================"
echo "Setup complete!"
echo "======================================"
