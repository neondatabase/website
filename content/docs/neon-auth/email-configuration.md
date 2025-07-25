---
title: Email configuration
subtitle: Configure email server settings for Neon Auth
enableTableOfContents: true
tag: beta
---

<FeatureBetaProps feature_name="Neon Auth" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/neon-auth/best-practices">Best practices</a>
    <a href="/docs/neon-auth/api"> Admin API</a>
  </DocsList>
</InfoBlock>

## Overview

Neon Auth sends emails for user invites, password resets, and notifications. By default, these come from `noreply@stackframe.co` using our shared email server. For production applications, you'll want to configure your own email server to improve deliverability and branding.

## Email setup

1. Go to your project's **Auth** page → **Configuration** tab
2. Find the **Email server** section
3. Choose "Custom SMTP server" and enter your credentials
4. Test your configuration with the built-in test feature

Your app will now send emails from your own domain.

## SMTP configuration

When switching to your own email server, you'll need these details from your email provider:

| Field            | What you need                                                          | Example                   |
| ---------------- | ---------------------------------------------------------------------- | ------------------------- |
| **Host**         | Your email server address                                              | `smtp.gmail.com`          |
| **Port**         | SMTP port (587 is default, 25 is Standard, 2525 often used in testing) | `587`                     |
| **Username**     | Your email address                                                     | `your-email@gmail.com`    |
| **Password**     | Your email password or app password                                    | `your-password`           |
| **Sender Email** | The "from" address users will see                                      | `noreply@yourcompany.com` |
| **Sender Name**  | The "from" name users will see                                         | `Your Company`            |

Most email providers (Gmail, SendGrid, Mailgun, etc.) will give you these details in their SMTP setup documentation.

## API configuration

You can also configure email settings programmatically:

```bash shouldWrap
curl --request PATCH \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/email_server' \
     --header 'authorization: Bearer YOUR_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "type": "standard",
       "host": "smtp.gmail.com",
       "port": 587,
       "username": "your-email@gmail.com",
       "password": "your-app-password",
       "sender_email": "noreply@yourcompany.com",
       "sender_name": "Your Company"
     }'
```

<NeedHelp />
