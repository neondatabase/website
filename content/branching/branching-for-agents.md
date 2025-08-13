---
title: 'Branching for agents'
subtitle: 'Enable safe AI agent workflows with database checkpoints, rollbacks, and time travel capabilities'
updatedOn: '2025-07-08T12:47:21.296Z'
---

As agents become more capable (generating code, running migrations, modifying data) the risk of unintended changes grows. For users, this creates friction and fear: _What if the agent breaks something? How do I undo it?_

Neon makes checkpointing and time travel possible in [agentic platforms](/blog/replit-app-history-powered-by-neon-branches). This architecture already powers real-world products - using branching, you can build these features behind the scenes:

- **Checkpoints with full rollback**. Agents can snapshot both code and data at each decision point. If something goes wrong - a bad migration, broken logic, or dropped table, users can rewind with one click.
- **Live previews of past states**. If a user wants to revisit a version from three days ago, they can branch the database at that timestamp, load the matching code, and preview the app exactly as it was.
- **Low-friction restores**. If an agent deploys a bad version, simply promote a previous branch to restore a known-good state, without any ad hoc scripting or manual recovery needed.
