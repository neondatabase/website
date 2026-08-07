---
title: 'Neon CLI command: profiles'
subtitle: Manage named sets of Neon credentials
summary: >-
  The `neon profiles` CLI command creates, lists, rotates, and removes named
  credential sets, so one machine can hold logins for several Neon accounts. A
  profile holds either a browser sign-in or an API key, which makes it useful
  for agents and CI as well as for switching between your own accounts.
enableTableOfContents: true
updatedOn: '2026-08-07T12:33:22.575Z'
---

A profile is a pointer to a credentials file, so one machine can hold logins for several Neon accounts and pick between them per command.

Create one by authenticating with a name, or with [`profiles create`](#create) when you want the profile to hold an API key instead of a browser session:

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

<CliSubcommands command="profile" />

## neon profiles create (#create)

Creates a profile. A profile holds either a browser sign-in or an API key, never both.

<CliUsage command="profile create" />

<CliOptions command="profile create" />

With no credential flags, this signs you in through the browser, the same as `neon auth --profile`. Pass `--api-key` to store a key you already have, reading it from stdin with `-` to keep it out of your shell history:

```bash
neon profiles create work --api-key "$KEY"
echo "$KEY" | neon profiles create work --api-key -
```

Pass `--mint` to sign in once and keep only a freshly minted key. The browser session is signed back out afterwards, so nothing about the profile can open a browser again. Narrow the key with `--org-id` or `--project-id`, the same way you would on [`api-keys create`](/docs/cli/api-keys):

```bash
neon profiles create ci --mint --project-id green-breeze-12345678
```

The scope is recorded on the profile, so [`rotate-key`](#rotate-key) can mint a replacement at the same scope rather than widening it.

Replacing an existing profile requires `--force`, which retires the credential the profile currently holds. A minted key stops working everywhere it was used.

## neon profiles rotate-key (#rotate-key)

Mints a fresh API key for a profile, at the same scope, and revokes the one it replaces.

<CliUsage command="profile rotate-key" />

<CliOptions command="profile rotate-key" />

```bash
neon profiles rotate-key ci
```

Only profiles that hold an API key can be rotated. The old key stops working as soon as the new one is stored, so update anything using it.

## neon profiles list (#list)

Lists each profile, the account it holds, and where its credentials live. `Active` marks the profile this invocation would use.

<CliUsage command="profile list" />

<CliOptions command="profile list" />

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

<CliUsage command="profile remove" />

<CliOptions command="profile remove" />

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
