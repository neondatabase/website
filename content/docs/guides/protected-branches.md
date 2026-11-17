---
title: Protected branches
subtitle: Learn how to use Neon's protected branches feature to secure your critical
  data
summary: >-
  Protected branches in Neon prevent deletion, reset, and archiving of critical
  branches such as production, and automatically generate new Postgres role
  passwords on child branches to block credential leakage. Use this feature when
  you need to lock down a branch against accidental or unauthorized changes. It
  can be combined with the IP Allow feature to restrict network access to
  protected branches only. Available on paid plans.
enableTableOfContents: true
redirectFrom:
  - /docs/introduction/branch-protection
  - /docs/manage/protected-branches
updatedOn: '2026-10-09T15:17:33.920Z'
---

Neon's protected branches feature implements a series of protections:

- Protected branches cannot be deleted.
- Protected branches cannot be [reset](/docs/manage/branches#reset-a-branch-from-parent).
- Protected branches can be [instantly restored](/docs/postgres/backup-restore/branch-restore) only if you keep a backup of the current state. [See below](#restore-a-protected-branch).
- Projects with protected branches cannot be deleted.
- Computes associated with a protected branch cannot be deleted.
- New passwords are automatically generated for Postgres roles on branches created from protected branches. [See below](#new-passwords-generated-for-postgres-roles-on-child-branches).
- With additional configuration steps, you can apply IP Allow restrictions to protected branches only. The [IP Allow](/docs/introduction/ip-allow) feature is available on the Neon [Scale](/docs/introduction/plans) plan. See [below](#how-to-apply-ip-restrictions-to-protected-branches).
- Protected branches are not [archived](/docs/guides/branch-archiving) due to inactivity.

The protected branches feature is available on Neon [paid plans](/docs/introduction/plans).

- The **Launch** plan supports up to 2 protected branches per project
- The **Scale** plan supports up to 5 protected branches per project

Every protected branch in a project counts toward this limit, including protected backup branches created when you restore a protected branch.

## Set a branch as protected

This example sets a branch as protected.

To set a branch as protected:

1. In the Neon Console, select a project.
2. Select **Branches** in the sidebar to view the branches for the project.

   ![Branch page](/docs/guides/ip_allow_branch_page.png)

3. Select a branch from the table. In this example, we'll configure our default branch (named `main` if the project was created with the CLI or API, or `production` if created in the Console) as a protected branch.
4. On the branch page, click **Protect**. The **Protect** button appears for branches created in the Console. For other branches, open the three-dot menu (⋮) on the branch page and select **Set as protected**.

   ![Set as protected](/docs/guides/ip_allow_set_as_protected.png)

5. In the **Set as protected** confirmation dialog, click **Set as protected** to confirm your selection.

   ![Set as protected confirmation](/docs/guides/ip_allow_set_as_protected_confirmation.png)

   Your branch is now designated as protected, as indicated by the protected branch shield icon, shown below.

   ![Branch page badge](/docs/guides/ip_allow_branch_badge.png)

   The protected branch designation also appears on your **Branches** page.

   ![Branches page badge](/docs/guides/ip_allow_branch_badge_2.png)

## New passwords generated for Postgres roles on child branches

When you create a branch in Neon, it includes all Postgres databases and roles from the parent branch. By default, Postgres roles on the child branch will have the same passwords as on the parent branch. However, this does not apply to protected branches. When you create a child branch from a protected branch, new passwords are generated for the matching Postgres roles on the child branch.

This behavior is designed to prevent the exposure of passwords that could be used to access your protected branch. For example, if you have designated a production branch as protected, the automatic password change for child branches ensures that you can create child branches for development or testing without risking access to data on your production branch.

Resetting or restoring a child branch from a protected parent branch preserves passwords for matching Postgres roles on the child branch. See the feature notes below for details.

<Admonition type="important" title="Feature notes">
- The "new password" feature for child branches was released on July 31, 2024. If you have existing CI scripts that create branches from protected branches, please be aware that passwords for matching Postgres roles on those newly created branches will now differ. If you depend on those passwords being the same, you'll need to make adjustments to get the correct connection details for those branches.
    - After a branch is created, the up-to-date connection string is returned in the output of the [Create Branch GitHub Action](/docs/guides/branching-github-actions#create-branch-action).
    - The [Reset Branch GitHub Action](/docs/guides/branching-github-actions#reset-from-parent-action) also outputs connection string values, in case you are using this action in your workflows.
    - The Neon CLI supports a [connection-string](/docs/cli/connection-string) command for retrieving a branch's connection string.
- Before September 6, 2024, resetting or restoring a child branch from a protected parent branch restored passwords for matching Postgres roles on the child branch to those used on the protected parent branch. As of September 6, 2024, passwords for matching Postgres roles on the child branch are preserved when resetting or restoring a child branch from a protected parent branch.
</Admonition>

## How to apply IP restrictions to protected branches

On plans that support it, you can use the protected branches feature in combination with Neon's [IP Allow](/docs/introduction/ip-allow) feature to apply IP access restrictions to protected branches only. The basic setup steps are:

1. [Define an IP allowlist for your project](#define-an-ip-allowlist-for-your-project)
2. [Restrict IP access to protected branches only](#restrict-ip-access-to-protected-branches-only)
3. [Set a branch as protected](#set-a-branch-as-protected) (if you have not done so already)

### Define an IP allowlist for your project

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To configure an allowlist:

1. Select a project in the Neon Console.
2. Select **Settings** in the sidebar.
3. Select **Networking**.
4. Under **Public internet access**, select **Only addresses on the allowlist**, then specify the IP addresses you want to permit. Separate multiple entries with commas.
5. Click **Save changes**.

</TabItem>

<TabItem>

The [Neon CLI ip-allow command](/docs/cli/ip-allow) supports IP Allow configuration. For example, the following `add` command adds IP addresses to the allowlist for an existing Neon project. Multiple entries are separated by a space. No delimiter is required.

```bash
neon ip-allow add 203.0.113.0 203.0.113.1
ID              wispy-haze-123456
Name            wispy-haze-123456
IP Addresses    203.0.113.0, 203.0.113.1
Protected Branches Only  false
```

To apply an IP allowlist to protected branches only, you can use the `--protected-only` option:

```bash
neon ip-allow add 203.0.113.1 --protected-only
```

To reverse that setting, use `--protected-only false`.

```bash
neon ip-allow add 203.0.113.1 --protected-only false
```

</TabItem>

<TabItem>

The [Create project](/docs/reference/api/projects/create-project) and [Update project](/docs/reference/api/projects/update-project) methods support **IP Allow** configuration. For example, the following API call configures **IP Allow** for an existing Neon project. Separate multiple entries with commas. Each entry must be quoted. You can set the `protected_branches_only` option to `true` to apply the allowlist to protected branches only, or `false` to apply it to all branches in your Neon project.

```bash
curl -X PATCH \
     https://console.neon.tech/api/v2/projects/falling-salad-31638542 \
     -H 'accept: application/json' \
     -H "authorization: Bearer $NEON_API_KEY" \
     -H 'content-type: application/json' \
     -d '
{
  "project": {
    "settings": {
      "allowed_ips": {
        "protected_branches_only": true,
        "ips": [
          "203.0.113.0", "203.0.113.1"
        ]
      }
    }
  }
}
' | jq
```

</TabItem>

</Tabs>

For details about specifying IP addresses, see [How to specify IP addresses](/docs/manage/projects#how-to-specify-ip-addresses).

### Restrict IP access to protected branches only

After defining an IP allowlist, go to **Restricted branches** and select **Protected branches only**.

This option removes IP restrictions from _all branches_ in your Neon project and applies them to protected branches only. Every other branch keeps accepting any address.

After you've selected the protected branches option, click **Save changes** to apply the new configuration.

## Restore a protected branch

You can't [reset a protected branch from its parent](/docs/manage/branches#reset-a-branch-from-parent), but you can [instantly restore](/docs/postgres/backup-restore/branch-restore) it to an earlier point in its own history or from another branch. The restore must keep a backup of the branch's current state. The Console always creates one. With the CLI or API, pass a backup name (`--preserve-under-name` or `preserve_under_name`), or the restore fails with `cannot restore protected branch without preserving under a new name`.

The backup branch is also protected. Keep in mind:

- It counts toward your plan's protected branch limit. Each restore adds another protected backup branch.
- You can't delete it until you remove its protection. See [Remove branch protection](#remove-branch-protection).

If you can't protect a branch because you've reached your limit, check the **Branches** page for protected backup branches (named `{branch_name}_old_{head_timestamp}`) that you no longer need.

## Remove branch protection

To remove protection, select **Set as unprotected** from the three-dot menu (⋮) on the branch page. For branches created in the Console, you can also click **Unprotect** on the branch page. With the API, update the branch with `"protected": false`.

<NeedHelp/>
