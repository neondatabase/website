---
title: Managing Vercel preview branch cleanup
subtitle: Understand cleanup timing and reduce branch accumulation for the
  Vercel-Managed integration
summary: >-
  Explains why Neon preview branches may not be deleted promptly when using the
  Vercel-Managed integration, how to reduce Vercel's deployment retention
  policy, and workarounds for immediate cleanup.
enableTableOfContents: true
updatedOn: '2026-03-20T16:01:10.989Z'
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

- **Vercel-Managed Integration**: Neon deletes a preview branch when its last associated Vercel deployment is deleted. This can happen in two ways:
  - Vercel **automatically** removes it through its [deployment retention policy](https://vercel.com/docs/deployment-retention) (which can take months).
  - You **manually** delete the Vercel deployment (which triggers immediate Neon cleanup)
- **Neon-Managed Integration**: Neon deletes a preview branch when the corresponding Git branch no longer exists in your repository. This is triggered the next time a preview deployment is created.

<Admonition type="tip" title="Using the Neon-Managed integration?">
If you're using the **Neon-Managed integration**, your branch cleanup is based on Git branch deletion and is not affected by Vercel's deployment retention policies. The rest of this page applies to the **Vercel-Managed integration** only. For Neon-Managed cleanup details, see [Branch cleanup](/docs/guides/neon-managed-vercel-integration#branch-cleanup).
</Admonition>

---

## Why branches aren't cleaned up immediately

If you're using the **Vercel-Managed integration**, you might expect preview branches to be deleted when you close a PR or delete a Git branch. That doesn't happen because cleanup is tied to **deployment deletion**, not Git branch deletion. Manually deleting a Vercel deployment triggers immediate Neon branch cleanup, but most teams rely on Vercel's automatic retention, which follows this timeline:

1. **Vercel retains preview deployments for 6 months by default.** As of [October 2025](https://vercel.com/changelog/updated-defaults-for-deployment-retention), Vercel's default retention for pre-production deployments is 180 days. The clock starts when the deployment is created, not when the PR is closed.
2. **Vercel's cleanup job runs asynchronously.** After the retention period expires, Vercel deletes the deployment in a batch process. This typically happens within hours to days of the expiration date, not instantly. Vercel offers a [30-day recovery window](https://vercel.com/docs/deployment-retention#restoring-a-deleted-deployment) to restore deleted deployments, but this does not delay cleanup for connected integrations.
3. **Neon deletes the branch when Vercel deletes the deployment.** Neon receives a cleanup webhook and removes the corresponding preview branch immediately.

In the worst case (a deployment created moments before the PR is closed), this means up to **~6 months** before the Neon branch is automatically deleted.

<Admonition type="warning" title="Restoring deleted deployments">
Vercel lets you [restore deleted deployments](https://vercel.com/docs/deployment-retention#restoring-a-deleted-deployment) within a 30-day recovery window. However, restoring a Vercel deployment does **not** restore the associated Neon branch. The restored deployment will have no database behind it. To recover, you would need to recreate the Neon branch manually or push a new commit to trigger the integration.
</Admonition>

### Retention exceptions

Vercel keeps a minimum number of recent deployments regardless of your retention settings. See [Vercel's retention exceptions](https://vercel.com/docs/deployment-retention#exceptions-to-the-retention-policy) for details. Neon branches associated with these retained deployments won't be automatically cleaned up. Use the [GitHub Action approach](#github-action-on-pr-close-recommended) for those.

These exceptions protect _deployments_, not branches. A single branch can have multiple deployments, so the number of protected branches depends on how deployments are distributed across them.

The following screenshot shows Vercel's default retention policy settings, where pre-production deployments are set to 180 days:

![Vercel retention policy defaults](/docs/guides/vercel_retention_policy_defaults.png)

---

## Reducing Vercel's retention policy

Lowering the retention period reduces how long Vercel keeps deployments before deleting them. This is most effective for projects with many preview deployments. For projects with low deployment activity, [retention exceptions](#retention-exceptions) may prevent automatic cleanup entirely, and the [GitHub Action approach](#github-action-on-pr-close-recommended) is a better option.

To adjust your retention settings:

1. Open your Vercel project dashboard
2. Go to **Settings → Security**
3. Scroll to **Deployment Retention Policy**
4. Set **Pre-Production Deployments** to the shortest available duration
5. Save

After the retention period expires, Vercel's cleanup job processes deletions asynchronously, typically within hours to days. To avoid waiting for retention entirely, you can [delete deployments manually](#delete-vercel-deployments) or use a [GitHub Action](#github-action-on-pr-close-recommended).

For more details, see [Vercel's deployment retention documentation](https://vercel.com/docs/deployment-retention#setting-a-deployment-retention-policy).

<Admonition type="note">
You can also set a default retention policy for all new projects in your Vercel team under **Team Settings → Security & Privacy → Deployment Retention Policy**.
</Admonition>

---

## Workarounds for immediate cleanup

If reducing retention isn't fast enough, you can trigger immediate cleanup by deleting deployments or branches directly.

### Delete Vercel deployments

You can delete Vercel preview deployments from the Vercel dashboard, or programmatically using the [Vercel CLI](https://vercel.com/docs/cli/remove) (`vercel remove`) or the [Vercel API](https://vercel.com/docs/rest-api/endpoints/deployments#delete-a-deployment) (`DELETE /v13/deployments/{id}`). When you delete the last deployment associated with a Git branch, Neon receives a webhook and deletes the corresponding preview branch immediately. This avoids leaving behind a broken preview deployment, since both the deployment and the database branch are removed together.

This approach is practical for cleaning up a small number of branches manually. You can also automate Vercel deployment deletion in CI by calling the Vercel API on PR close. See Vercel's [Managing Deployments](https://vercel.com/docs/deployments/managing-deployments) documentation for details on deleting deployments programmatically.

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

<Admonition type="note">
Deleting a Neon branch invalidates any Vercel preview deployments that depend on it. Those deployments will fail on database connections. This is usually acceptable since the PR is already closed, but be aware if your team revisits preview URLs after merging.
</Admonition>

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

The most common cause is Vercel's deployment retention policy. With the default 6-month retention, preview branches can persist for months after a PR is closed. To fix this:

1. [Reduce your Vercel retention policy](#reducing-vercels-retention-policy) for pre-production deployments
2. [Set up a GitHub Action](#github-action-on-pr-close-recommended) to delete branches immediately on PR close

### I reduced retention but branches are still not being deleted

Vercel keeps a minimum number of recent deployments regardless of your retention settings. The project's `deploymentsToKeep` value (typically 10, visible via the [Vercel project API](https://vercel.com/docs/rest-api/projects/retrieve-a-list-of-projects)) controls how many are protected. Neon branches tied to these deployments won't be auto-deleted. Use the [GitHub Action workaround](#github-action-on-pr-close-recommended) or [manual cleanup](#cleaning-up-existing-stale-branches) for these branches.

### Which integration type gives faster cleanup?

It depends on your deployment cadence.

The [Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration) deletes branches based on Git branch deletion rather than Vercel's deployment retention policy, so it avoids the months-long delays described on this page. But cleanup only runs when the next preview deployment is created. At that point, Neon checks for deleted Git branches and removes the corresponding Neon branches. If no new preview deployments happen, stale branches accumulate until activity resumes.

The **Vercel-Managed Integration** has predictable but slow cleanup tied to deployment retention. The **Neon-Managed Integration** has fast cleanup during active development but no cleanup during idle periods. Both benefit from the [GitHub Action approach](#github-action-on-pr-close-recommended), which works regardless of integration type and removes branches immediately on PR close.

### How do I clean up branches that already accumulated?

See [Cleaning up existing stale branches](#cleaning-up-existing-stale-branches) above for options including the Neon Console, CLI, and API.

<NeedHelp/>
