---
title: Protected branches
subtitle: Learn how to use Neon's protected branches feature to secure access to
  critical data
enableTableOfContents: true
updatedOn: '2024-07-12T11:14:29.365Z'
---

Neon's protected branches feature lets you apply IP restrictions to specific branches in your Neon project as an added layer of data protection. The following retsrictions also apply to protected branches:

- Protected branches cannot be deleted.
- Protected branches cannot be [reset](/docs/manage/branches#reset-a-branch-from-parent).
- Projects with protected branches cannot be deleted.
- Computes associated with a protected branch cannot be deleted.

You have to remove branch protection before you can perfom these actions. See [Remove branch protection](#remove-branch-protection).

The protected branches feature is available with the Neon [Scale](/docs/introduction/plans#scale) plan.

## How to set up protected branches

The protected branches feature works in combination with Neon's [IP Allow](/docs/introduction/ip-allow) feature. The basic setup steps are:

1. [Define an IP allowlist for your project](#define-an-ip-allowlist-for-your-project)
2. [Restrict IP access to protected branches only](#restrict-ip-access-to-protected-branches-only)
3. [Set a branch as protected](#set-a-branch-as-protected)

## Define an IP allowlist for your project

<Tabs labels={["Neon Console", "CLI", "API"]}>

<TabItem>

To configure an allowlist:

1. Select a project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **IP Allow**.
   ![IP Allow configuration](/docs/manage/ip_allow.png)
4. Specify the IP addresses you want to permit. Separate multiple entries with commas.
5. Optionally, select **Allow unrestricted access to non-default branches** to allow full access to your [non-default branches](/docs/manage/branches#non-default-branch).
6. Click **Save changes**.

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

## Set a branch as protected

The last step in the setup is to designate a branch as protected. We'll define a single branch as protected in this example, but you can have up to 5 protected branches.

To set a branch as protected:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.

   ![Branch page](/docs/guides/ip_allow_branch_page.png)

3. Select a branch from the table. In this example, we'll configure our default branch `main` as a protected branch.
4. On the branch page, click the **More** drop-down menu and select **Set as protected**.

   ![Set as protected](/docs/guides/ip_allow_set_as_protected.png)

5. In the **Set as protected** confirmation dialog, click **Set as protected** to confirm your selection.

   ![Set as protected confirmation](/docs/guides/ip_allow_set_as_protected_confirmation.png)

   Your branch is now designated as protected, as indicated by the protected branch shield icon, shown below. Only the trusted IP addresses on your IP allowlist will be able to connect to this branch.

   <Admonition type="important">
   With this configuration, there is no restriction on IP access to the other branches in your project.
   </Admonition>

   ![Branch page badge](/docs/guides/ip_allow_branch_badge.png)

   The protected branch designation also appears on your **Branches** page.

   ![Branches page badge](/docs/guides/ip_allow_branch_badge_2.png)

## Remove branch protection

Removing a protected branch designation can be performed by selecting **Set as unprotected** from the **More** drop-down menu on the branch page.

<NeedHelp/>
