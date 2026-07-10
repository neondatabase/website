---
title: Customize emails
subtitle: Custom branding, content, and delivery for Neon Auth emails
summary: >-
  Neon Auth email customization lets you intercept OTP code and magic link
  delivery events via webhooks and send fully branded emails through your own
  provider (Resend, SendGrid, Postmark, or any SMTP service) instead of Neon's
  default shared-branded emails. Use this page when you need custom sender
  addresses, HTML templates, multi-language support, or your own branding for
  sign-in, email-verification, and password-reset emails. Dashboard-based email
  templates are not yet available; webhook-based delivery is the current
  customization path.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
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
  "event_id": "xxx-yyy-zzz",
  "event_type": "send.otp",
  "timestamp": "20xx-xx-xxTxx:xx:xx.xxxZ",
  "context": {
    "endpoint_id": "ep-xxx",
    "project_name": "Your App Name"
  },
  "user": {
    "name": "User Name",
    "email": "user@email.com",
    "image": null,
    "role": "user",
    "banned": false,
    "id": "user-id",
    "email_verified": true,
    "created_at": "20xx-xx-xxTxx:xx:xx.xxxZ",
    "updated_at": "20xx-xx-xxTxx:xx:xx.xxxZ",
    "ban_reason": null,
    "ban_expires": null
  },
  "event_data": {
    "otp_code": "123456",
    "otp_type": "sign-in",
    "expires_at": "20xx-xx-xxTxx:xx:xx.xxxZ",
    "ip_address": "IP_ADDRESS_OF_USER",
    "user_agent": "USER_AGENT_OF_USER"
  }
}
```

### `send.magic_link`

Your handler receives a full verification URL and a raw token. The `link_type` is `sign-in`, `email-verification`, or `forget-password`. Wrap the link in your branded email template.

```json
{
  "event_id": "xxx-yyy-zzz",
  "event_type": "send.magic_link",
  "timestamp": "20xx-xx-xxTxx:xx:xx.xxxZ",
  "context": {
    "endpoint_id": "ep-xxx",
    "project_name": "Your App Name"
  },
  "user": {
    "email": "user@email.com"
  },
  "event_data": {
    "link_type": "sign-in",
    "link_url": "https://magic-link-url",
    "token": "raw-token-value",
    "expires_at": "20xx-xx-xxTxx:xx:xx.xxxZ",
    "ip_address": "IP_ADDRESS_OF_USER",
    "user_agent": "USER_AGENT_OF_USER"
  }
}
```

## Example handler

Before your handler can receive events, you must register its endpoint. Follow the [Webhooks guide](/docs/auth/guides/webhooks) to configure your webhook URL and subscribe to the `send.otp` and `send.magic_link` events.

Here’s an example Next.js API route that verifies the webhook signature, handles the `send.otp` and `send.magic_link` events, and sends emails through Resend.

```ts shouldWrap
import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyWebhook(rawBody: string, headers: Headers) {
  const signature = headers.get('x-neon-signature');
  const kid = headers.get('x-neon-signature-kid');
  const timestamp = headers.get('x-neon-timestamp');

  if (!signature || !kid || !timestamp) {
    throw new Error('Missing required Neon webhook headers');
  }

  // 1. Fetch JWKS and find the matching key
  const res = await fetch(`${process.env.NEON_AUTH_BASE_URL}/.well-known/jks.json`);
  const jwks = await res.json();
  const jwk = jwks.keys.find((k: { kid: string }) => k.kid === kid);
  if (!jwk) throw new Error(`Key ${kid} not found in JWKS`);

  // 2. Import the Ed25519 public key
  const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });

  // 3. Parse detached JWS (header..signature)
  const [headerB64, emptyPayload, signatureB64] = signature.split('.');
  if (emptyPayload !== '') throw new Error('Expected detached JWS format');

  // 4. Reconstruct signing input (standard JWS, double base64url encoding)
  const payloadB64 = Buffer.from(rawBody, 'utf8').toString('base64url');
  const signaturePayload = `${timestamp}.${payloadB64}`;
  const signaturePayloadB64 = Buffer.from(signaturePayload, 'utf8').toString('base64url');
  const signingInput = `${headerB64}.${signaturePayloadB64}`;

  // 5. Verify Ed25519 signature
  const isValid = crypto.verify(
    null,
    Buffer.from(signingInput),
    publicKey,
    Buffer.from(signatureB64, 'base64url')
  );

  if (!isValid) throw new Error('Invalid webhook signature');

  // 6. Check timestamp freshness (recommended)
  const ageMs = Date.now() - parseInt(timestamp, 10);
  if (ageMs > 5 * 60 * 1000) throw new Error('Webhook timestamp too old');

  return JSON.parse(rawBody);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const payload = await verifyWebhook(rawBody, request.headers);
  const { event_type, event_data, user, context } = payload;

  const appName = context.project_name || 'My App';

  if (event_type === 'send.otp') {
    await resend.emails.send({
      from: 'My App <auth@myapp.com>',
      to: user.email,
      subject: 'Your verification code',
      html: `<h1>Welcome to ${appName}</h1><p>Your code: <strong>${event_data.otp_code}</strong></p>`,
    });
  }

  if (event_type === 'send.magic_link') {
    await resend.emails.send({
      from: 'My App <auth@myapp.com>',
      to: user.email,
      subject: 'Your sign-in link',
      html: `<h1>Welcome to ${appName}</h1><p><a href="${event_data.link_url}">Sign in</a></p>`,
    });
  }

  return NextResponse.json({ success: true });
}
```

You can customize your emails to reflect your brand by adding your logo and using your brand colors in the HTML templates.

<NeedHelp/>
