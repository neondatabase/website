---
title: Protected branches
subtitle: Learn how to use Neon's protected branches feature to secure your critical
  data
enableTableOfContents: true
updatedOn: '2024-08-30T16:58:37.260Z'
---

Neon's protected branches feature implements a series of protections:

- Protected branches cannot be deleted.
- Protected branches cannot be [reset](/docs/manage/branches#reset-a-branch-from-parent).
- Projects with protected branches cannot be deleted.
- Computes associated with a protected branch cannot be deleted.
- New passwords are automatically generated for Postgres roles on branches created from protected branches. [See below](#new-passwords-generated-for-postgres-roles-on-child-branches).
- With additional configuration steps, you can apply IP restrictions to protected branches only. See [below](#how-to-apply-ip-restrictions-to-protected-branches).

The protected branches feature is available with the Neon [Business](/docs/introduction/plans#business) plan.

## Set a branch as protected

This example sets a single branch as protected, but you can have up to 5 protected branches.

To set a branch as protected:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.

   ![Branch page](/docs/guides/ip_allow_branch_page.png)

3. Select a branch from the table. In this example, we'll configure our default branch `main` as a protected branch.
4. On the branch page, click the **Actions** drop-down menu and select **Set as protected**.

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

<Admonition type="important" title="Feature notes">
- This feature was released on July, 31, 2024. If you have existing CI scripts that create branches from protected branches, please be aware that passwords for matching Postgres roles on those newly created branches will now differ. If you depend on those passwords being the same, you'll need to make adjustments to get the correct connection details for those branches.
    - After a branch is created, the up-to-date connection string is returned in the output of the [Create Branch GitHub Action](/docs/guides/branching-github-actions#create-branch-action).
    - The [Reset Branch GitHub Action](/docs/guides/branching-github-actions#reset-from-parent-action) also outputs connection string values, in case you are using this action in your workflows.
    - The Neon CLI supports a [connection-string](/docs/reference/cli-connection-string) command for retrieving a branch's connection string.
- Resetting or restoring a child branch from a protected parent branch currently restores passwords for matching Postgres roles on the child branch to those used on the protected parent branch. This issue will be addressed in an upcoming release. See [reset from parent](/docs/introduction/point-in-time-restore) to understand how Neon's branch reset and restore features work.
</Admonition>

## How to apply IP restrictions to protected branches

The protected branches feature works in combination with Neon's [IP Allow](/docs/introduction/ip-allow) feature to allow you to apply IP access restrictions to protected branches only. The basic setup steps are:

1. [Define an IP allowlist for your project](#define-an-ip-allowlist-for-your-project)
2. [Restrict IP access to protected branches only](#restrict-ip-access-to-protected-branches-only)
3. [Set a branch as protected](#set-a-branch-as-protected) (if you have not done so already)

### Define an IP allowlist for your project

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To configure an allowlist:

1. Select a project in the Neon Console.
2. On the Project Dashboard, select **Settings**.
3. Select **IP Allow**.
   ![IP Allow configuration](/docs/manage/ip_allow.png)
4. Specify the IP addresses you want to permit. Separate multiple entries with commas.
5. Click **Save changes**.

</TabItem>

<TabItem>

The [Neon CLI ip-allow command](/docs/reference/cli-ip-allow) supports IP Allow configuration. For example, the following `add` command adds IP addresses to the allowlist for an existing Neon project. Multiple entries are separated by a space. No delimiter is required.

```bash
neon ip-allow add 203.0.113.0 203.0.113.1
┌─────────────────────┬─────────────────────┬──────────────┬─────────────────────┐
│ Id                  │ Name                │ IP Addresses │ Default Branch Only │
├─────────────────────┼─────────────────────┼──────────────┼─────────────────────┤
│ wispy-haze-26469780 │ wispy-haze-26469780 │ 203.0.113.0  │ false               │
│                     │                     │ 203.0.113.1  │                     │
└─────────────────────┴─────────────────────┴──────────────┴─────────────────────┘
```

To apply an IP allowlist to the default branch only, use the you can `--protected-only` option:

```bash
neon ip-allow add 203.0.113.1 --protected-only
```

To reverse that setting, use `--protected-only false`.

```bash
neon ip-allow add 203.0.113.1 --protected-only false
```

</TabItem>

<TabItem>

The [Create project](https://api-docs.neon.tech/reference/createproject) and [Update project](https://api-docs.neon.tech/reference/updateproject) methods support **IP Allow** configuration. For example, the following API call configures **IP Allow** for an existing Neon project. Separate multiple entries with commas. Each entry must be quoted. You can set the `"protected_branches_only` option to `true` to apply the allowlist to your default branch only, or `false` to apply it to all branches in your Neon project.

```bash
curl -X PATCH \
     https://console.neon.tech/api/v2/projects/falling-salad-31638542 \
     -H 'accept: application/json' \
     -H 'authorization: Bearer $NEON_API_KEY' \
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

## Restrict IP access to protected branches only

After defining an IP allowlist, the next step is to select the **Restrict access to protected branches only** option.

![IP Allow configuration](/docs/guides/ip_allow_protected_branches.png)

This option removes IP restrictions from _all branches_ in your Neon project and applies them to protected branches only.

After you've selected the protected branches option, click **Save changes** to apply the new configuration.

## Remove branch protection

Removing a protected branch designation can be performed by selecting **Set as unprotected** from the **More** drop-down menu on the branch page.

<NeedHelp/>
