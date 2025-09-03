---
title: Email configuration
subtitle: Configure email server settings for Neon Auth
enableTableOfContents: true
tag: beta
updatedOn: '2025-08-23T08:58:44.827Z'
---

<FeatureBetaProps feature_name="Neon Auth" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/neon-auth/best-practices">Best practices</a>
    <a href="/docs/neon-auth/api"> Admin API</a>
  </DocsList>
</InfoBlock>

## Overview

Neon Auth sends transactional emails for features like user invites, password resets, email verification, and security notifications.

To get you started quickly, every Neon project comes with a **Shared Email Server**, which sends emails from `noreply@stackframe.co`. However, for any production application, you must configure a **Custom SMTP Server** to ensure emails are sent reliably from your own domain. This guide explains how to set up your custom SMTP server and why it's essential for production use.

## Shared vs. Custom SMTP

Understanding the difference between the shared and custom email servers is crucial for moving from development to production.

### Shared email server (for development)

The shared server is enabled by default and is intended for development and testing only. Emails are sent from `noreply@stackframe.co`, which is not ideal for production since users may not trust emails from an unfamiliar domain and it offers no branding for your application.

Connecting your own SMTP provider is the recommended approach for all production applications.

- **Professional branding:** Emails are sent from your own domain (e.g., `noreply@yourcompany.com`), building user trust and reinforcing your brand identity.
- **Improved deliverability:** By controlling your own sender reputation with properly configured domains (SPF, DKIM, DMARC), your emails are far more likely to land in the user's inbox.

## How to set up a custom SMTP server

Connecting your own SMTP server is a straightforward process.

### Choose an SMTP provider

First, you need an account with an email service that provides SMTP credentials. If you don't already have one, here are a few popular providers:

- [Amazon SES](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)
- [Resend](https://resend.com/docs/send-with-smtp)
- [Postmark](https://postmarkapp.com/smtp-service)
- [Twilio SendGrid](https://sendgrid.com/en-us/solutions/email-api/smtp-service)
- [Mailgun](https://www.mailgun.com/features/smtp-server/)
- [Brevo](https://www.brevo.com/free-smtp-server/)

## SMTP configuration details

Once you have an account, find the SMTP credentials in your provider's dashboard you will need these details to complete the setup.

| Field            | Description                                                 | Example                    |
| ---------------- | ----------------------------------------------------------- | -------------------------- |
| **Host**         | Your email server address.                                  | `smtp-relay.brevo.com`     |
| **Port**         | The SMTP port. `587` is the standard for secure submission. | `587`                      |
| **Username**     | The username for authenticating with your SMTP server.      | `your-smtp-username`       |
| **Password**     | The password or API key provided by your email service.     | `your-api-key-or-password` |
| **Sender Email** | The "from" address users will see                           | `noreply@yourcompany.com`  |
| **Sender Name**  | The display name that appears alongside the sender email.   | `Your Company`             |

### Configure Neon Auth

Navigate to your Neon project and enter your SMTP credentials:

1.  Go to your project's **Auth** page and select the **Configuration** tab.
2.  Find the **Email server** section.
3.  Switch the option from "Shared" to **Custom SMTP server**.
4.  Enter the SMTP credentials you obtained from your email provider.
5.  Click **Save** to apply the changes.
    ![Neon Auth Custom SMTP Configuration UI](/docs/neon-auth/custom-smtp-configuration.png)
6.  Use the **Send test email** feature to verify that your configuration is correct.
    ![Send Test Email](/docs/neon-auth/send-test-email.png)

## API configuration

You can also configure your email server settings programmatically using the Neon API. This is useful for automated setups or managing multiple projects.

```bash shouldWrap
curl --request PATCH \
     --url 'https://console.neon.tech/api/v2/projects/{project_id}/auth/email_server' \
     --header 'authorization: Bearer YOUR_NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "type": "standard",
       "host": "smtp-relay.brevo.com",
       "port": 587,
       "username": "your-smtp-username",
       "password": "your-app-password",
       "sender_email": "noreply@yourcompany.com",
       "sender_name": "Your Company"
     }'
```

## Production best practices

To ensure your transactional emails are reliable, secure, and professional, follow these best practices when configuring your production environment.

- **Configure DKIM, SPF, and DMARC**

  These email authentication standards are essential for proving to inbox providers that your emails are legitimate. Properly configuring them is the most important step you can take to prevent your emails from being marked as spam. Your email provider will have guides on how to set these up for your domain.

- **Implement CAPTCHA on Authentication forms**

  Protect your sign-up and password reset forms with a CAPTCHA service (e.g., hCaptcha, Cloudflare Turnstile, Vercel BotID). This is the most effective way to prevent bots from creating fake accounts or spamming your account verification and password reset flows, which can harm your sender reputation and lead to your domain being blocklisted.

  Whenever possible, use Neon Auth components such as `<SignIn />` and `<SignUp />` within your authentication pages, rather than relying on automatically generated pages. These components allow you to add custom logic, including CAPTCHA integration, for enhanced security and flexibility. See [Neon Auth Components](/docs/neon-auth/components/components) for all available options.

- **Encourage social logins (OAuth)**

  Whenever possible, prioritize social sign-ins (e.g., Google, GitHub). This reduces your application's reliance on email-based flows (like verification and password resets).

- **Separate transactional and marketing emails**

  Never use the same domain or IP address for both transactional emails (password resets, invites) and marketing emails (newsletters, promotions). The high volume and potential spam complaints associated with marketing can damage your sender reputation, preventing transactional emails from being delivered.

- **Keep email templates clean and focused**

  If you are customizing the default Neon Auth template in the Stack Auth dashboard, ensure your changes maintain a clear, transactional focus.
  - **Avoid promotional content:** Do not include marketing calls-to-action, sales language, or unnecessary links.
  - **Be direct:** Get straight to the point (e.g., "Please click on the following button to verify your email: [verification button]").
  - **Minimize images and complex styling:** Heavy HTML and multiple images can increase your spam score.
  - **Sanitize user data:** If you include user-provided data (like a name) in an email, ensure it is properly sanitized to prevent security vulnerabilities.

- **Plan for high volume events**

  If you anticipate a large number of sign-ups at once (e.g., from a product launch or marketing campaign), contact your SMTP provider beforehand. Many providers have systems that automatically flag and penalize sudden, unexpected spikes in email volume. Working with them can ensure your sending limits are temporarily raised and your account remains in good standing.

<NeedHelp />
