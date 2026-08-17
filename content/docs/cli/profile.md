---
title: 'Neon CLI command: profile'
subtitle: Manage named sets of Neon credentials
summary: >-
  The `neon profile` CLI command creates, lists, rotates, and removes named
  credential sets, so one machine can hold logins for several Neon accounts. Use
  it to see which profile is active, which account each one holds, rotate a
  profile's key, and revoke a profile's token when you no longer need it.
redirectFrom:
  - /docs/cli/profiles
enableTableOfContents: true
---

A profile is a pointer to a credentials file, so one machine can hold logins for several Neon accounts and pick between them per command.

Create one with `neon profile create`, or by authenticating with a name:

```bash
neon profile create work
```

`--profile` is a [global option](/docs/cli#global-options), so you can pass it to any command to act as that profile's account. `neon me` confirms which account a profile holds:

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

Profiles live in `profiles.json` in the config directory, which is `~/.config/neon` by default (`XDG_CONFIG_HOME` moves it) and `--config-dir` overrides per command. That file maps each profile name to the credentials file that holds its token. The CLI manages it for you, so create and remove profiles with the commands below rather than editing it by hand.

<Admonition type="note" title="Profiles carry credentials, not context">
A profile sets which account you act as, not which organization or project. Commands that need one still resolve it from `--org-id`, the `.neon` context file, or a prompt:

```bash
neon projects list --profile work --org-id org-example-12345678
```

See [set-context](/docs/cli/set-context) and [checkout](/docs/cli/checkout) for pinning an org or branch.
</Admonition>

<CliSubcommands command="profile" />

## neon profile create (#create)

Creates a profile. It holds either a browser sign-in or an API key, never both.

<CliUsage command="profile create" />

<CliOptions command="profile create" />

Most of the time you create a profile one of two ways: a browser sign-in, or a freshly minted key.

Sign in with the browser, the same as `neon auth --profile work`:

```bash
neon profile create work
```

With `--mint`, sign in once in the browser, then store a freshly minted API key and nothing else. This leaves no browser session behind, which suits CI:

```bash
neon profile create ci --mint --org-id org-abc-123
```

Pass `--project-id` with `--mint` to mint a key that can access only one project, or `--org-id` to mint it for an organization instead of your account.

If you already have a key minted elsewhere, store it with `--api-key`. Pipe it to `--api-key -`, where `-` tells the CLI to read the key from stdin, so it stays out of the process arguments where `ps` would otherwise expose it. Here `$KEY` is a shell variable holding the key:

```bash
echo "$KEY" | neon profile create work --api-key -
```

Passing the key as the argument value works too, but avoid it outside a throwaway shell, since the key is then visible to other processes:

```bash
neon profile create work --api-key "$KEY"
```

`create` ignores `NEON_API_KEY`, so exporting that variable doesn't supply the key here. Pass it explicitly with `--api-key`.

## neon profile list (#list)

Lists each profile, the account it holds, and where its credentials live. `Active` marks the profile this invocation would use.

<CliUsage command="profile list" />

<CliOptions command="profile list" />

```bash
neon profile list
```

```text filename="Output"
Profiles
┌────────┬─────────┬──────────────────────────────────────┬─────────┬─────────┬──────┬─────────┬──────────────────────────────────────┐
│ Active │ Name    │ Account                              │ Auth    │ Scope   │ File │ Storage │ Credentials                          │
├────────┼─────────┼──────────────────────────────────────┼─────────┼─────────┼──────┼─────────┼──────────────────────────────────────┤
│ *      │ DEFAULT │ 3f8a1c2e-5b7d-4e9a-8c1f-2d6b9e0a4c53 │ oauth   │ -       │ ok   │ file    │ ~/.config/neon/credentials.json      │
├────────┼─────────┼──────────────────────────────────────┼─────────┼─────────┼──────┼─────────┼──────────────────────────────────────┤
│        │ work    │ alex@domain.com                      │ oauth   │ -       │ ok   │ file    │ ~/.config/neon/credentials.work.json │
├────────┼─────────┼──────────────────────────────────────┼─────────┼─────────┼──────┼─────────┼──────────────────────────────────────┤
│        │ ci      │ alex@domain.com                      │ api key │ account │ ok   │ keyring │ OS keyring                           │
└────────┴─────────┴──────────────────────────────────────┴─────────┴─────────┴──────┴─────────┴──────────────────────────────────────┘
```

`Account` is the recorded email label, or the user ID when there's no label, as with a `DEFAULT` profile from a plain `neon auth`. `Auth` shows how the profile authenticates (`oauth` for a browser sign-in, `api key` for a stored key), and `Scope` shows what a minted key is limited to: `account`, `org <org-id>`, or `project <project-id>`. `File` is `ok` when the credentials file is present and readable, and `missing` when it isn't. `Storage` is `file` for a plaintext credentials file and `keyring` for the OS keyring.

## neon profile rotate-key (#rotate-key)

Mints a fresh API key for a profile, at the same scope, and revokes the one it replaces. Anything using the old key stops working immediately.

<CliUsage command="profile rotate-key" />

<CliOptions command="profile rotate-key" />

```bash
neon profile rotate-key ci
```

This works for account-scoped keys, where the profile's own credential can mint the replacement. An organization- or project-scoped key can't rotate itself, since only a personal credential can mint those keys. Re-mint it with a browser sign-in instead, matching the original scope:

```bash
neon profile create ci --mint --org-id org-example-12345678
```

The `rotate-key` error names the exact command to run for the profile's scope.

## neon profile remove (#remove)

Revokes the profile's token, then removes the profile. Anything using that token stops working immediately.

Pass `--yes` to skip the confirmation prompt. In CI, a removal without `--yes` is refused rather than assumed.

The credentials file is deleted only if the CLI created it. A profile pointing outside the config directory is left on disk, and the command says so, so the secret is still there.

If the token can't be revoked, the profile is still removed locally, and the command tells you the token may remain valid. Revoke it yourself from the [Neon Console](https://console.neon.tech) if it was an API key.

Removing the last profile deletes `profiles.json` too, leaving the config directory as it was before you created any profiles.

<CliUsage command="profile remove" />

<CliOptions command="profile remove" />

Remove a profile:

```bash
neon profile remove work
```

```text filename="Output"
? Remove profile "work" (alex@domain.com)? › (y/N)
```

The prompt defaults to no, so pressing Enter leaves the profile in place.

To switch accounts rather than discard one, authenticate again under the same name:

```bash
neon auth --profile work
```
