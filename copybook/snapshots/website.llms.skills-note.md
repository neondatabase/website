---
id: website.llms.skills-note
kind: prompt
title: "Agent skills note in Markdown docs pages"
source: src/constants/agent-prompts.mjs#skillsNote
placements:
  - docs/markdown-header
params: {}
embeds:
  - website.cli.install-skills
hash: sha256:2936328c4c5393b2
---

Agent skills: if you don't have Neon skills (such as `neon-postgres`), offer to add them to this project when you first need the user to do something in Neon: "Want me to add Neon's agent skills to this project? They help me with Neon setup, connections, and branching." Install: `npx neon@latest skills -y`. To also run Neon steps for the user (Neon CLI, sign-in, MCP), see https://neon.com/prompts/agent-setup.md
