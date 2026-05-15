---
title: Customize emails
subtitle: Custom branding, content, and delivery for Neon Auth emails
summary: >-
  Customize the emails Neon Auth sends to your users — including OTP codes,
  magic links, and verification emails — by intercepting delivery events with
  webhooks and sending them through your own email provider.
enableTableOfContents: true
updatedOn: '2026-05-15T10:42:42.837Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth sends verification codes, magic links, and password reset emails using its built-in email provider. By default, emails use shared Neon branding and your Neon project name as the main header. To make emails recognizable to users, update the Application Name in your [Auth settings](/docs/auth/production-checklist#application-name) to match your app’s public-facing name.

For deeper customization, use webhooks to intercept email events and send fully branded emails through your preferred provider. Dashboard-based email templates aren’t available yet, but they’re planned for a future release. If you only need a custom sender address without changing the email content, you can configure a custom SMTP provider instead (see the [Auth production checklist](/docs/auth/production-checklist#email-provider)).

## How it works

Neon Auth fires two events when it needs to send an email to a user:

| Event             | Triggers when                                      | Without webhook                           |
| ----------------- | -------------------------------------------------- | ----------------------------------------- |
| `send.otp`        | A verification code needs delivery                 | Neon sends the code via its default email |
| `send.magic_link` | A magic link or password reset link needs delivery | Neon sends the link via its default email |

When you subscribe to either event, Neon Auth **skips its default email** and calls your webhook handler instead. Your handler receives the code or link in the payload and is responsible for sending it through Resend, SendGrid, Postmark, or any email provider you choose.

See the [Webhooks reference](/docs/auth/guides/webhooks) for configuration, payload structure, signature verification, and retry behavior.

## What you can customize

Using webhooks, you can customize every aspect of the email experience:

- **Sender identity:** Use your own domain and sender name instead of `auth@mail.myneon.app`
- **App name and branding:** Replace Neon's default branding with your app's logo, colors, and name
- **Subject line and body:** Write custom HTML templates with your own copy
- **Verification links:** Wrap the link from the `send.magic_link` payload in your branded email template, or build a custom redirect URL using the raw `token`
- **Multi-language support:** Detect the user's locale and deliver emails in their language
- **Delivery channel:** Send codes via email, SMS (with the [Phone Number plugin](/docs/auth/guides/plugins/phone-number)), or both

## Event payloads

When your webhook receives a `send.otp` or `send.magic_link` event, the payload includes the user's email and name, the OTP code or magic link URL, the type of email being sent, and the expiration time.

### `send.otp`

Your handler receives a 6-digit OTP code, the OTP type (`sign-in`, `email-verification`, or `forget-password`), and the user's email. Send it through your email provider.

```json
{
  "event_type": "send.otp",
  "user": { "email": "user@example.com", "name": "Jane Smith" },
  "event_data": {
    "otp_code": "123456",
    "otp_type": "email-verification",
    "expires_at": "2026-02-23T12:10:00.000Z"
  }
}
```

### `send.magic_link`

Your handler receives a full verification URL and a raw token. The `link_type` is `sign-in`, `email-verification`, or `forget-password`. Wrap the link in your branded email template.

```json
{
  "event_type": "send.magic_link",
  "user": { "email": "user@example.com", "name": "Jane Smith" },
  "event_data": {
    "link_type": "email-verification",
    "link_url": "https://ep-xxx.neon.tech/neondb/auth/...",
    "token": "eyJhbGciOi...",
    "expires_at": "2026-02-23T12:10:00.000Z"
  }
}
```

## Example handler

Before your handler can receive events, you must register its endpoint. Follow the [Webhooks guide](/docs/auth/guides/webhooks) to configure your webhook URL and subscribe to the `send.otp` and `send.magic_link` events.

Here’s a simple example of a Next.js API route that handles the `send.otp` and `send.magic_link` events and sends emails through Resend. For production, make sure to verify the webhook signature before sending emails.

For a complete walkthrough with signature verification, ngrok testing, and domain blocking, see the [full guide](/guides/neon-auth-webhooks-nextjs).

```ts shouldWrap
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Verify the webhook signature first in production — see the Webhooks reference
  const payload = await request.json();
  const { event_type, event_data, user } = payload;

  if (event_type === 'send.otp') {
    await resend.emails.send({
      from: 'My App <auth@myapp.com>',
      to: user.email,
      subject: 'Your verification code',
      html: `<h1>Welcome to My App</h1><p>Your code: <strong>${event_data.otp_code}</strong></p>`,
    });
  }

  if (event_type === 'send.magic_link') {
    await resend.emails.send({
      from: 'My App <auth@myapp.com>',
      to: user.email,
      subject: 'Your sign-in link',
      html: `<h1>Welcome to My App</h1><p><a href="${event_data.link_url}">Sign in</a></p>`,
    });
  }

  return NextResponse.json({ success: true });
}
```

You can customize your emails to reflect your brand by adding your logo and using your brand colors in the HTML templates.

<NeedHelp/>
