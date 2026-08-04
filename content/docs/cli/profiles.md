---
title: 'Neon CLI command: profiles'
subtitle: Manage named sets of Neon credentials
summary: >-
  The `neon profiles` CLI command lists and removes named credential sets, so
  one machine can hold logins for several Neon accounts. Use it to see which
  profile is active, which account each one holds, and to revoke a profile's
  token when you no longer need it.
enableTableOfContents: true
updatedOn: '2026-08-04T19:37:07.626Z'
---

A profile is a pointer to a credentials file, so one machine can hold logins for several Neon accounts and pick between them per command.

Create one by authenticating with a name. There is no `profiles create` command:

```bash
neon auth --profile work
```

Then pass it to any command. `neon me` confirms which account a profile holds:

```bash
neon me --profile work
```

```text filename="Output"
┌────────┬──────────────────┬────────────┬────────────────┐
│ Login  │ Email            │ Name       │ Projects Limit │
├────────┼──────────────────┼────────────┼────────────────┤
│ alex   │ alex@domain.com  │ Alex Lopez │ 0              │
└────────┴──────────────────┴────────────┴────────────────┘
```

Naming a profile that doesn't exist is an error, not a silent fall back to `DEFAULT`.

Credentials resolve from `--profile`, then `NEON_PROFILE`, then a profile named `DEFAULT`. Nothing persists between commands, so set `NEON_PROFILE` to avoid repeating the flag. `DEFAULT` is what a plain `neon auth` gives you, with or without profiles.

<Admonition type="note" title="Profiles carry credentials, not context">
A profile sets which account you act as, not which organization or project. Commands that need one still resolve it from `--org-id`, the `.neon` context file, or a prompt:

```bash
neon projects list --profile work --org-id org-example-12345678
```

See [set-context](/docs/cli/set-context) and [checkout](/docs/cli/checkout) for pinning an org or branch.
</Admonition>

<CliSubcommands command="profiles" />

## neon profiles list (#list)

Lists each profile, the account it holds, and where its credentials live. `Active` marks the profile this invocation would use.

<CliUsage command="profiles list" />

<CliOptions command="profiles list" />

```bash
neon profiles list
```

```text filename="Output"
Profiles
┌────────┬─────────┬──────────────────┬──────────┬──────────────────────────────────────┐
│ Active │ Name    │ Account          │ SignedIn │ Credentials                          │
├────────┼─────────┼──────────────────┼──────────┼──────────────────────────────────────┤
│ *      │ DEFAULT │ -                │ yes      │ ~/.config/neon/credentials.json      │
├────────┼─────────┼──────────────────┼──────────┼──────────────────────────────────────┤
│        │ work    │ alex@domain.com  │ yes      │ ~/.config/neon/credentials.work.json │
└────────┴─────────┴──────────────────┴──────────┴──────────────────────────────────────┘
```

`Account` shows `-` when the profile has no recorded label, as with a `DEFAULT` profile from a plain `neon auth`.

## neon profiles remove (#remove)

Revokes the profile's token, then removes the profile. Anything using that token stops working immediately.

Pass `--yes` to skip the confirmation prompt. In CI, a removal without `--yes` is refused rather than assumed.

The credentials file is deleted only if the CLI created it. A profile pointing outside the config directory is left on disk, and the command says so, so the secret is still there.

<CliUsage command="profiles remove" />

<CliOptions command="profiles remove" />

Remove a profile:

```bash
neon profiles remove work
```

```text filename="Output"
? Remove profile "work" (alex@domain.com)? › (y/N)
```

The prompt defaults to no, so pressing Enter leaves the profile in place.

To switch accounts rather than discard one, authenticate again under the same name:

```bash
neon auth --profile work
```
