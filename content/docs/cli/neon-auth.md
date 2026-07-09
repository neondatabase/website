---
title: 'Neon CLI command: neon-auth'
subtitle: Manage Neon Auth from the CLI
summary: >-
  The Neon CLI `neon neon-auth` command manages Neon Auth on a database
  branch from the terminal. Use `enable`, `status`, and `disable` to provision,
  inspect, or remove Neon Auth, and the `oauth-provider` subcommands to add,
  update, or delete Google, GitHub, and Vercel OAuth providers. The `domain`
  subcommands manage trusted redirect domains, including `allow-localhost`
  settings for local development. The `config` subcommands cover email and
  password authentication, the email provider, the organization plugin, and
  webhooks, while `plugins` and `user` let you inspect plugin configurations
  and manage auth users.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/cli-neon-auth
---

The `neon-auth` command manages [Neon Auth](/docs/auth/overview) on a database branch from the terminal. You can enable or disable Neon Auth, configure OAuth providers, trusted domains, email settings, and webhooks, and manage auth users.

Requires neon 2.23.0 or later. Check your version with `neon --version`.

<CliSubcommands command="neon-auth" />

If `--project-id` or `--branch` are omitted, the CLI resolves them from your [context file](/docs/cli/set-context), auto-selects when there is only one option, and prompts otherwise.

## Enable and status (#enable-and-status)

### neon neon-auth enable (#enable)

Provisions Neon Auth on the current branch.

<CliUsage command="neon-auth enable" />

<CliOptions command="neon-auth enable" />

```bash
neon neon-auth enable
```

### neon neon-auth status (#status)

Shows whether Neon Auth is configured on the branch and displays the current connection details.

<CliUsage command="neon-auth status" />

<CliOptions command="neon-auth status" />

```bash
neon neon-auth status
```

### neon neon-auth disable (#disable)

Removes Neon Auth from the branch.

<CliUsage command="neon-auth disable" />

<CliOptions command="neon-auth disable" />

<Admonition type="important">
The `--delete-data` option permanently deletes all Neon Auth data and schema from the database. This can't be undone.
</Admonition>

Remove Neon Auth from the branch and delete its data:

```bash
neon neon-auth disable --delete-data
```

## OAuth providers (#oauth-provider)

The `oauth-provider` subcommands manage the OAuth providers (`google`, `github`, and `vercel`) for the branch.

<CliSubcommands command="neon-auth oauth-provider" anchorParts="oauth-provider" />

### neon neon-auth oauth-provider list (#oauth-provider-list)

Lists the OAuth providers configured for the branch.

<CliUsage command="neon-auth oauth-provider list" />

<CliOptions command="neon-auth oauth-provider list" />

```bash
neon neon-auth oauth-provider list
```

### neon neon-auth oauth-provider add (#oauth-provider-add)

Adds an OAuth provider.

<CliUsage command="neon-auth oauth-provider add" />

<CliOptions command="neon-auth oauth-provider add" />

Add the Google OAuth provider with your own credentials:

```bash shouldWrap
neon neon-auth oauth-provider add --provider-id google --oauth-client-id <client-id> --oauth-client-secret <client-secret>
```

### neon neon-auth oauth-provider update (#oauth-provider-update)

Updates the credentials for an existing OAuth provider.

<CliUsage command="neon-auth oauth-provider update" />

<CliOptions command="neon-auth oauth-provider update" />

```bash shouldWrap
neon neon-auth oauth-provider update --provider-id github --oauth-client-id <client-id> --oauth-client-secret <client-secret>
```

### neon neon-auth oauth-provider delete (#oauth-provider-delete)

Deletes an OAuth provider from the branch.

<CliUsage command="neon-auth oauth-provider delete" />

<CliOptions command="neon-auth oauth-provider delete" />

```bash
neon neon-auth oauth-provider delete --provider-id vercel
```

## Domains (#domain)

The `domain` subcommands manage the trusted domains that Neon Auth accepts as redirect URIs for the branch.

<CliSubcommands command="neon-auth domain" anchorParts="domain" />

### neon neon-auth domain list (#domain-list)

Lists the trusted domains configured for the branch.

<CliUsage command="neon-auth domain list" />

<CliOptions command="neon-auth domain list" />

```bash
neon neon-auth domain list
```

### neon neon-auth domain add (#domain-add)

Adds a trusted domain.

<CliUsage command="neon-auth domain add" />

<CliOptions command="neon-auth domain add" />

```bash
neon neon-auth domain add example.com
```

### neon neon-auth domain delete (#domain-delete)

Deletes a trusted domain.

<CliUsage command="neon-auth domain delete" />

<CliOptions command="neon-auth domain delete" />

```bash
neon neon-auth domain delete example.com
```

### neon neon-auth domain allow-localhost (#domain-allow-localhost)

Manages localhost connection settings for the branch.

<CliSubcommands command="neon-auth domain allow-localhost" anchorParts="domain-allow-localhost" />

### neon neon-auth domain allow-localhost get (#domain-allow-localhost-get)

Gets the current localhost connection setting.

<CliUsage command="neon-auth domain allow-localhost get" />

<CliOptions command="neon-auth domain allow-localhost get" />

```bash
neon neon-auth domain allow-localhost get
```

### neon neon-auth domain allow-localhost enable (#domain-allow-localhost-enable)

Allows localhost connections for local development.

<CliUsage command="neon-auth domain allow-localhost enable" />

<CliOptions command="neon-auth domain allow-localhost enable" />

```bash
neon neon-auth domain allow-localhost enable
```

### neon neon-auth domain allow-localhost disable (#domain-allow-localhost-disable)

Restricts localhost connections.

<CliUsage command="neon-auth domain allow-localhost disable" />

<CliOptions command="neon-auth domain allow-localhost disable" />

```bash
neon neon-auth domain allow-localhost disable
```

## Configuration (#config)

The `config` subcommands configure auth features for the branch: email and password authentication, the email provider, the organization plugin, and webhooks.

<CliSubcommands command="neon-auth config" anchorParts="config" />

### neon neon-auth config email-password (#config-email-password)

Manages email and password authentication settings.

<CliSubcommands command="neon-auth config email-password" anchorParts="config-email-password" />

### neon neon-auth config email-password get (#config-email-password-get)

Gets the current email and password configuration.

<CliUsage command="neon-auth config email-password get" />

<CliOptions command="neon-auth config email-password get" />

```bash
neon neon-auth config email-password get
```

### neon neon-auth config email-password update (#config-email-password-update)

Updates the email and password configuration.

<CliUsage command="neon-auth config email-password update" />

<CliOptions command="neon-auth config email-password update" />

```bash shouldWrap
neon neon-auth config email-password update --enabled --require-email-verification
```

### neon neon-auth config email-provider (#config-email-provider)

Manages the email provider configuration.

<CliSubcommands command="neon-auth config email-provider" anchorParts="config-email-provider" />

### neon neon-auth config email-provider get (#config-email-provider-get)

Gets the current email provider configuration.

<CliUsage command="neon-auth config email-provider get" />

<CliOptions command="neon-auth config email-provider get" />

```bash
neon neon-auth config email-provider get
```

### neon neon-auth config email-provider update (#config-email-provider-update)

Updates the email provider configuration.

<CliUsage command="neon-auth config email-provider update" />

<CliOptions command="neon-auth config email-provider update" />

Configure the `standard` email provider type with your own SMTP server:

```bash shouldWrap
neon neon-auth config email-provider update --type standard --host smtp.example.com --port 587 --username example_username --password AbC123dEf --sender-email noreply@example.com --sender-name "Example App"
```

### neon neon-auth config email-provider test (#config-email-provider-test)

Sends a test email so you can verify your SMTP configuration.

<CliUsage command="neon-auth config email-provider test" />

<CliOptions command="neon-auth config email-provider test" />

```bash shouldWrap
neon neon-auth config email-provider test --recipient-email user@example.com --host smtp.example.com --port 587 --username example_username --password AbC123dEf --sender-email noreply@example.com --sender-name "Example App"
```

### neon neon-auth config organization (#config-organization)

Manages organization plugin settings.

<CliSubcommands command="neon-auth config organization" anchorParts="config-organization" />

### neon neon-auth config organization get (#config-organization-get)

Gets the current organization plugin configuration.

<CliUsage command="neon-auth config organization get" />

<CliOptions command="neon-auth config organization get" />

```bash
neon neon-auth config organization get
```

### neon neon-auth config organization update (#config-organization-update)

Updates the organization plugin configuration.

<CliUsage command="neon-auth config organization update" />

<CliOptions command="neon-auth config organization update" />

```bash shouldWrap
neon neon-auth config organization update --enabled --limit 5 --creator-role owner
```

### neon neon-auth config webhook (#config-webhook)

Manages webhook configuration.

<CliSubcommands command="neon-auth config webhook" anchorParts="config-webhook" />

### neon neon-auth config webhook get (#config-webhook-get)

Gets the current webhook configuration.

<CliUsage command="neon-auth config webhook get" />

<CliOptions command="neon-auth config webhook get" />

```bash
neon neon-auth config webhook get
```

### neon neon-auth config webhook update (#config-webhook-update)

Updates the webhook configuration.

<CliUsage command="neon-auth config webhook update" />

<CliOptions command="neon-auth config webhook update" />

```bash shouldWrap
neon neon-auth config webhook update --enabled --url https://example.com/webhooks/neon-auth --enabled-events user.created --timeout 5
```

## Plugins (#plugins)

The `plugins` subcommands show the Neon Auth plugin configurations for the branch.

<CliSubcommands command="neon-auth plugins" anchorParts="plugins" />

### neon neon-auth plugins list (#plugins-list)

Lists all plugin configurations.

<CliUsage command="neon-auth plugins list" />

<CliOptions command="neon-auth plugins list" />

```bash
neon neon-auth plugins list
```

### neon neon-auth plugins get (#plugins-get)

Gets a specific plugin configuration.

<CliUsage command="neon-auth plugins get" />

<CliOptions command="neon-auth plugins get" />

```bash
neon neon-auth plugins get organization
```

## Users (#user)

The `user` subcommands manage Neon Auth users on the branch.

<CliSubcommands command="neon-auth user" anchorParts="user" />

### neon neon-auth user create (#user-create)

Creates an auth user.

<CliUsage command="neon-auth user create" />

<CliOptions command="neon-auth user create" />

```bash
neon neon-auth user create --email alex@example.com --name "Alex Lopez"
```

### neon neon-auth user delete (#user-delete)

Deletes an auth user.

<CliUsage command="neon-auth user delete" />

<CliOptions command="neon-auth user delete" />

```bash
neon neon-auth user delete <user-id>
```

### neon neon-auth user set-role (#user-set-role)

Sets roles for an auth user.

<CliUsage command="neon-auth user set-role" />

<CliOptions command="neon-auth user set-role" />

```bash
neon neon-auth user set-role <user-id> --roles admin
```
