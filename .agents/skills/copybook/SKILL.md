---
name: copybook
description: Maintains the code snippets, shell commands, and coding-agent prompts that this product shows to users, which Copybook keeps as typed definitions with committed snapshots. Use when adding, editing, or reviewing a snippet, command, or agent prompt in the UI, when copybook check or a snapshot fails, or when asked where a piece of copy-paste text is defined.
---

# Copybook

This project keeps the copy-paste content in its UI as Copybook definitions: code snippets, shell commands, and prompts for coding agents. Each one has a stable id, typed params with example values, the placements where it's shown, and a committed snapshot of its rendered output.

## Start here

Run `npx copybook status --json`, or call the `status` tool of the `copybook` MCP server. Its `next` field lists what to do, in order, with the command and MCP tool for each step.

## Workflow

1. Find the definition behind text in the UI: `npx copybook list --grep "<text>"`, or the `find_definitions` tool.
2. Read it: `npx copybook show <id>`, or `get_definition`. It shows the source file, params, every variant's output, tests, and history.
3. Edit the definition in its source file. Keep ids stable. When you rename one, keep the old id in `aliases`.
4. Write the snapshots: `npx copybook snapshot`, or `write_snapshots`. Review the diff under `copybook/snapshots/` and commit it with the code. A Markdown prompt from the config's `markdown` sources is its own snapshot, so after editing one there's nothing to write.
5. Verify: `npx copybook check` and `npx copybook test`, or the `check` and `run_tests` tools. Both must pass.

## Rules

- Templates must render the same output every time: no dates, random values, or I/O.
- Every required param needs an `.example()` or a `.default()`.
- Embed commands in prompts with `t.cmd(...)` instead of retyping them.
- Never edit snapshot files by hand. `snapshot` writes them.
- Ask before `snapshot --prune`, which deletes files, and `test --tier run`, which runs commands for real. `eval` runs only in CI.

## Reference

- Every command and flag: `npx copybook commands --json`.
- Every command takes `--json` except `report`. Exit codes: 0 when everything is fine, 1 when a command found problems, 2 when it couldn't run.
- Docs: https://copybook.dev/docs. For agents: https://copybook.dev/llms.txt.
