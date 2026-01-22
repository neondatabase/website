---
title: 'Branching workflows for recovery'
subtitle: 'Learn how to use branching for recovery: use database branches to go back in time, recover lost data, debug migrations, and audit historical states safely'
updatedOn: '2026-01-22T00:00:00.000Z'
---

Because Neon preserves database history, branches can also be used as a practical tool for recovery, investigation, and inspection.

## Using branches to go back in time

Neon continuously retains history for each branch within a defined [restore window](https://neon.com/docs/introduction/restore-window). At any point, you can create a new branch from a previous moment in time. This branch is fully independent:

- It has the exact schema and data from that point  
- It doesn’t affect the current production state  
- You can query it, inspect it, or export data from it

## Recover dropped tables or deleted data

![Diagram showing how to recover dropped tables or deleted data using branches](/images/pages/branching/production-restore-diagram.png)

If a table was dropped or data was accidentally removed, you can create a branch from just before the incident. From there, you can:

- Inspect the table or rows that were lost  
- Export only the data you need  
- Restore it into production manually, without rolling production back

## Debugging bad migrations

When a migration behaves unexpectedly, branches make it easy to investigate. Instead of guessing or reproducing issues manually, you can:

- Create a branch from before the migration  
- Compare schema and data before and after  
- Re-run the migration in isolation to understand what went wrong

## Auditing and compliance checks

For auditing or compliance purposes, teams often need to inspect historical database states using [branches created from past points](https://neon.com/docs/guides/backup-restore). This is useful for internal audits, incident reviews, or regulatory checks without disrupting live systems.

## Restore-window and cost considerations

Time travel in Neon relies on retained history. By default, Neon retains history for a limited window ([shorter windows on Free plans, longer windows on paid plans](https://neon.com/docs/introduction/restore-window#defaults-and-plan-limits)). This retained history contributes to overall storage usage: teams can tune the restore window to [balance recovery capability and cos](https://neon.com/docs/introduction/restore-window#storage-and-billing)t, depending on how frequently they need to look back in time.

Also, once you’re done investigating or recovering data, it’s best to delete restored branches to avoid clutter and unnecessary storage usage.
