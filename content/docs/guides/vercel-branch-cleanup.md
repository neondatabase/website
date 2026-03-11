---
title: Managing Vercel preview branch cleanup
subtitle: Understand cleanup timing and reduce branch accumulation for the Vercel-Managed integration
summary: >-
  Explains why Neon preview branches may not be deleted promptly when using the
  Vercel-Managed integration, how to reduce Vercel's deployment retention policy,
  and workarounds for immediate cleanup.
enableTableOfContents: true
updatedOn: '2026-03-10T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<a href="#how-cleanup-works">How branch cleanup differs between integration types</a>
<a href="#why-branches-arent-cleaned-up-immediately">Why Vercel's retention policy delays cleanup</a>
<a href="#reducing-vercels-retention-policy">How to reduce the retention period</a>
<a href="#workarounds-for-immediate-cleanup">How to set up immediate cleanup via GitHub Actions</a>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-managed-integration">Vercel-Managed Integration</a>
<a href="/docs/guides/neon-managed-vercel-integration">Neon-Managed Integration</a>
<a href="/docs/guides/branch-archiving">Branch archiving</a>
<a href="/docs/guides/branch-expiration">Branch expiration</a>
</DocsList>
</InfoBlock>

---

## How cleanup works

When you use Neon's Vercel integration, a Neon database branch is created for each Git branch that has a preview deployment. These are called preview branches. The two integration types handle cleanup of these branches differently:

- **Vercel-Managed Integration**: Neon deletes a preview branch when its last associated Vercel deployment is permanently removed. This is tied to [Vercel's deployment retention policy](https://vercel.com/docs/deployment-retention).
- **Neon-Managed Integration**: Neon deletes a preview branch when the corresponding Git branch no longer exists in your repository. This is triggered the next time a preview deployment is created.

<Admonition type="tip" title="Using the Neon-Managed integration?">
If you're using the **Neon-Managed integration**, your branch cleanup is based on Git branch deletion and is not affected by Vercel's deployment retention policies. The rest of this page applies to the **Vercel-Managed integration** only. For Neon-Managed cleanup details, see [Branch cleanup](/docs/guides/neon-managed-vercel-integration#branch-cleanup).
</Admonition>

---

## Why branches aren't cleaned up immediately

If you're using the **Vercel-Managed integration**, you might expect preview branches to be deleted when you close a PR or delete a Git branch. That doesn't happen because cleanup is tied to **deployment deletion**, not Git branch deletion.

Here's the timeline:

1. **Vercel retains preview deployments for 6 months by default.** As of [October 2025](https://vercel.com/changelog/updated-defaults-for-deployment-retention), Vercel's default retention for pre-production deployments is 180 days. The clock starts when the deployment is created, not when the PR is closed.
2. **After retention expires, there's a 30-day recovery period.** During this window, Vercel holds the deployment in a recoverable state. Only after this period ends is the deployment permanently deleted. See [Restoring a deleted deployment](https://vercel.com/docs/deployment-retention#restoring-a-deleted-deployment).
3. **Neon deletes the branch after permanent deletion.** Neon receives a cleanup webhook from Vercel only after the deployment is permanently removed.

In the worst case (a deployment created moments before the PR is closed), this means up to **~7 months** before the Neon branch is automatically deleted. In practice, the delay is often shorter for long-running PRs.

### Retention exceptions

Even with a reduced retention policy, Vercel always keeps certain deployments. Per [Vercel's documentation](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy), these deployments are never deleted:

- The last 20 non-production deployments in Ready state
- The last 10 deployments created in the project
- Deployments with custom aliases or branch aliases

Neon branches associated with these retained deployments won't be automatically deleted regardless of your Vercel retention settings. In practice, this means that if your project has 20 or fewer preview deployments, **none of them will be auto-deleted by Vercel's retention policy** since they all fall within the "last 20" exception.

The following screenshot shows Vercel's default retention policy settings, where pre-production deployments are set to 180 days:

![Vercel retention policy defaults](/docs/guides/vercel_retention_policy_defaults.png)

---

## Reducing Vercel's retention policy

Lowering the retention period reduces how long Vercel keeps deployments before marking them for deletion. This is most effective for projects with many preview deployments. If your project has 20 or fewer, the [retention exceptions](#retention-exceptions) may prevent automatic cleanup entirely, and the [GitHub Action approach](#github-action-on-pr-close-recommended) is a better option.

To adjust your retention settings:

1. Open your Vercel project dashboard
2. Go to **Settings → Security**
3. Scroll to **Deployment Retention Policy**
4. Set **Pre-Production Deployments** to the shortest available duration
5. Save

Keep in mind that the [30-day recovery period](https://vercel.com/docs/deployment-retention#restoring-a-deleted-deployment) still applies after retention expires. Your total minimum delay before a branch is cleaned up is the retention duration plus 30 days.

For more details, see [Vercel's deployment retention documentation](https://vercel.com/docs/deployment-retention#setting-a-deployment-retention-policy).

<Admonition type="note">
You can also set a default retention policy for all new projects in your Vercel team under **Team Settings → Security & Privacy → Deployment Retention Policy**.
</Admonition>

---

## Workarounds for immediate cleanup

If reducing retention isn't fast enough, you can delete Neon branches directly using existing Neon tools. The GitHub Action approach is the most practical for teams that want cleanup the moment a PR closes.

### GitHub Action on PR close (recommended)

Neon's [`delete-branch-action`](https://github.com/neondatabase/delete-branch-action) deletes a Neon branch by name. Add this workflow to your repository to clean up the preview branch as soon as a PR is closed or merged:

```yaml
name: Cleanup Neon preview branch
on:
  pull_request:
    types: [closed]
jobs:
  delete-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/${{ github.head_ref }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

The Vercel integration creates Neon branches using the naming pattern `preview/<git-branch>`, so this action targets the same branches the integration creates. This works for both integration types.

This workflow requires a `NEON_PROJECT_ID` [repository variable](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables) and a `NEON_API_KEY` [repository secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions). Find your project ID on the **Project Settings** page in the Neon Console, and create an API key under **Account Settings > API Keys**.

This action is safe to use alongside automatic cleanup. If the action deletes the branch first, the cleanup webhook that eventually fires from Vercel will find the branch already gone and handle it gracefully.

For more GitHub Actions branching workflows, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

### Neon CLI or API

You can also delete branches programmatically using the [Neon CLI](/docs/reference/cli-branches#delete) or the [Neon API](/docs/manage/branches#delete-a-branch-with-the-api). This is useful for building custom automation or scheduled cleanup scripts.

### Branch expiration

[Branch expiration](/docs/guides/branch-expiration) lets you set a time-to-live on branches so they're automatically deleted after a fixed duration. The Vercel-Managed integration doesn't set expiration on preview branches automatically. To use this approach, you'd need a separate automation step (for example, a GitHub Action triggered on push) that sets `expires_at` on newly created preview branches via the [Neon API](/docs/manage/branches#branching-with-the-neon-api). See [Branch expiration](/docs/guides/branch-expiration) for details and setup instructions.

---

## Cleaning up existing stale branches

If you already have accumulated preview branches, start by listing what you have:

```bash
neon branches list --project-id <project-id>
```

This shows all branches with their names, states, and creation dates. Look for branches with the `preview/` prefix that correspond to merged or deleted Git branches.

To remove stale branches:

- **Neon Console**: Go to the **Branches** page and delete branches individually
- **Neon CLI**: Use `neon branches delete <branch-id-or-name>` to remove specific branches. See [CLI branches reference](/docs/reference/cli-branches#delete).
- **Neon API**: Use `DELETE /projects/{project_id}/branches/{branch_id}`. See [Delete a branch with the API](/docs/manage/branches#delete-a-branch-with-the-api).

---

## Cost impact of stale branches

Preview branches that aren't cleaned up still consume resources and count toward your plan limits. Branches inactive for 24 hours and older than 14 days are automatically [archived](/docs/guides/branch-archiving) to lower-cost storage, which reduces storage costs but doesn't eliminate them. Archived branches still count toward your plan's [branch limits](/docs/introduction/plans#extra-branches). If you exceed the branch limit included in your plan, the extra branches are billed at the rate shown on the [Extra usage](/docs/introduction/extra-usage) page.

---

## FAQ

### Why aren't my preview branches being deleted?

The most common cause is Vercel's deployment retention policy. With the default 6-month retention plus a 30-day recovery period, preview branches can persist for months after a PR is closed. To fix this:

1. [Reduce your Vercel retention policy](#reducing-vercels-retention-policy) for pre-production deployments
2. [Set up a GitHub Action](#github-action-on-pr-close-recommended) to delete branches immediately on PR close

### I reduced retention but branches are still not being deleted

Vercel has [exceptions to the retention policy](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy) that keep certain deployments regardless of your settings. The last 20 non-production deployments in Ready state and the last 10 deployments in the project are always retained. Neon branches associated with these deployments won't be auto-deleted. Use the [GitHub Action workaround](#github-action-on-pr-close-recommended) or [manual cleanup](#cleaning-up-existing-stale-branches) for these branches.

### Which integration type gives faster cleanup?

It depends on your deployment cadence.

The [Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration) deletes branches based on Git branch deletion rather than Vercel's deployment retention policy, so it avoids the months-long delays described on this page. But cleanup only runs when the next preview deployment is created. At that point, Neon checks for deleted Git branches and removes the corresponding Neon branches. If no new preview deployments happen, stale branches accumulate until activity resumes.

The **Vercel-Managed Integration** has predictable but slow cleanup tied to deployment retention. The **Neon-Managed Integration** has fast cleanup during active development but no cleanup during idle periods. Both benefit from the [GitHub Action approach](#github-action-on-pr-close-recommended), which works regardless of integration type and removes branches immediately on PR close.

### How do I clean up branches that already accumulated?

See [Cleaning up existing stale branches](#cleaning-up-existing-stale-branches) above for options including the Neon Console, CLI, and API.

<NeedHelp/>
