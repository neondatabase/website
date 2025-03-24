---
title: 'AI Rules: Neon Auth'
subtitle: 'Context rules for AI tools to help implement authentication with Stack Auth and Neon databases'
enableTableOfContents: true
---

## How to use

If you use Cursor or any AI-based code assistant that supports custom rules:

1. Create a `.cursor/rules` directory in your project
2. Copy the rules below into `.cursor/rules/neon-auth.mdc`
3. (Optional) Re-index your project in Cursor to pick up the new rules

For other AI tools, use their respective "include file" features:
- GitHub Copilot: Add `#<filename>` in your comments
- Zed: Use the `/file` command

## Rules

<ExternalCodeSnippet
  url="https://raw.githubusercontent.com/neondatabase-labs/ai-rules/main/neon-auth.mdc"
/>
