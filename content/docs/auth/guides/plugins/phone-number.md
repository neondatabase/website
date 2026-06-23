---
title: Phone Number
subtitle: Sign in existing users with phone OTP codes delivered via your SMS provider
summary: >-
  The Phone Number plugin for Neon Auth adds SMS OTP sign-in for existing
  users: when a user submits their E.164 phone number, Neon Auth fires a
  `send.otp` webhook carrying a numeric code that your handler forwards to your
  SMS provider (Twilio, Vonage, MessageBird, etc.). Use this page when you need
  phone OTP sign-in for users who already have a verified phone number linked to
  their account; phone-first sign-up is not supported. OTP expiry is
  configurable, requests are rate-limited per IP, and an OTP is invalidated
  after too many incorrect attempts.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/) and supports the [Phone Number](https://www.better-auth.com/docs/plugins/phone-number) plugin through the Neon SDK.

Phone Number lets an existing user sign in with a one-time password (OTP) delivered to their phone. The flow works like this:

1. The user enters their phone number in E.164 format (for example, `+15551234567`).
2. Neon Auth generates a 6-digit OTP and fires the `send.otp` webhook with `delivery_preference: "sms"`. Your webhook handler delivers the code via your SMS provider.
3. The user enters the code. Neon Auth verifies it, creates a session, and signs them in.

<Admonition type="important">
The Phone Number plugin is **sign-in only**. Users must already exist in your project with a phone number linked to their account. There is no phone-first sign-up path.

Neon Auth does **not** deliver SMS for you. The plugin requires a `send.otp` webhook that forwards codes to your SMS provider (Twilio, MessageBird, Vonage, etc.).
</Admonition>

## Prerequisites

- A Neon project with **Auth enabled**
- An existing user with a phone number linked to their account
- A webhook subscribed to the `send.otp` event that forwards the code to your SMS provider (see the [Webhooks guide](/docs/auth/guides/webhooks))

## Enable Phone Number

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Select your project and go to **Auth** > **Plugins**.
3. Toggle **Phone Authentication** on.
4. Configure the options:
   - **OTP Expiry** (60-600 seconds, default: 300) controls how long a generated OTP stays valid.

![Neon Console Auth Plugins tab with Phone Number settings](/docs/auth/neon_auth_plugins_phone_number.png)

</TabItem>

<TabItem>

Configure the Phone Number plugin with a `PATCH` request. All request body fields are optional; send only the fields you want to change. A `GET` on the same endpoint returns the current configuration.

```bash shouldWrap
curl -X PATCH \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/plugins/phone-number" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "otp_expires_in": 300
  }'
```

Both `PATCH` and `GET` return the configuration:

```json
{
  "enabled": true,
  "otp_expires_in": 300
}
```

| Field            | Type    | Default | Description                               |
| ---------------- | ------- | ------- | ----------------------------------------- |
| `enabled`        | boolean | `false` | Whether the Phone Number plugin is active |
| `otp_expires_in` | integer | `300`   | Seconds before the OTP expires (60-600)   |

</TabItem>

</Tabs>

## Deliver OTPs via your SMS provider

Neon Auth fires the `send.otp` webhook with `delivery_preference: "sms"` when an OTP needs delivery. Your handler must deliver the code through your SMS provider (Twilio, MessageBird, Vonage, etc.). Without a `send.otp` webhook, `authClient.phoneNumber.sendOtp()` fails.

Configure a webhook subscribed to `send.otp` (see the [Webhooks guide](/docs/auth/guides/webhooks) for full setup and signature verification), then branch on `delivery_preference` in your handler:

```ts shouldWrap filename="app/api/webhooks/neon-auth/route.ts"
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: Request) {
  const payload = await request.json(); // verify the signature first in production

  if (payload.event_type === 'send.otp' && payload.event_data.delivery_preference === 'sms') {
    const toNumber = payload.user?.phone_number;
    if (!toNumber) {
      return NextResponse.json({ error: 'missing phone number' }, { status: 400 });
    }

    await twilioClient.messages.create({
      from: process.env.TWILIO_FROM_NUMBER!,
      to: toNumber,
      body: `Your code is ${payload.event_data.otp_code}.`,
    });
  }

  return NextResponse.json({ ok: true });
}
```

<Admonition type="note" title="User context for first OTPs">
When an unauthenticated user requests their first phone OTP (no prior account linked to that phone number), the webhook `user` object contains the `phone_number` only. Do not rely on `user.name`, `user.email`, or other profile fields when templating the SMS for first-time sends.
</Admonition>

For a runnable Next.js handler, signature verification, and a local tunneling setup, see the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login).

## Link a phone number to a user

Link a phone to an existing user from an authenticated session by calling `authClient.phoneNumber.verify()` with `updatePhoneNumber: true`:

```ts shouldWrap filename="src/link-phone-number.ts"
import { authClient } from '@/lib/auth/client';

export async function sendLinkingOtp(phoneNumber: string) {
  const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber });
  if (error) throw error;
}

export async function linkPhoneNumber(phoneNumber: string, code: string) {
  const { data, error } = await authClient.phoneNumber.verify({
    phoneNumber,
    code,
    updatePhoneNumber: true,
  });

  if (error) throw error;
  return data;
}
```

For a complete "Add phone number" form with session-aware state (no number, unverified, verified), see the `AddPhoneForm` component in the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login).

## Sign in an existing user with phone OTP

Build a two-step phone sign-in form: send the OTP, then verify it. Do **not** pass `updatePhoneNumber`. Omitting it tells Better Auth to sign in the existing user rather than link a phone number:

```ts shouldWrap filename="src/phone-otp.ts"
import { authClient } from '@/lib/auth/client';

export async function sendPhoneOtp(phoneNumber: string) {
  const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber });
  if (error) throw error;
}

export async function signInWithPhoneOtp(phoneNumber: string, code: string) {
  const { data, error } = await authClient.phoneNumber.verify({
    phoneNumber,
    code,
  });

  if (error) throw error;
  return data;
}
```

For a complete working form with resend, error handling, and attempt-budget awareness, see the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login).

## Use Phone Number alongside UI components

Unlike Email OTP, `NeonAuthUIProvider` does not expose a `phoneNumber` prop, and the pre-built `AuthView` does not render a phone sign-in UI. If you're using Neon Auth UI components, render your own phone sign-in form next to `AuthView` on the sign-in route:

```tsx shouldWrap filename="app/auth/[path]/page.tsx"
import { AuthView } from '@neondatabase/auth-ui';
import { authViewPaths } from '@neondatabase/auth-ui/server';
import { PhoneSignInSection } from './phone-sign-in-section'; // your own component

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  const isSignIn = path === authViewPaths.SIGN_IN;

  return (
    <>
      <AuthView path={path} />
      {isSignIn && <PhoneSignInSection />}
    </>
  );
}
```

`PhoneSignInSection` is a component you write that wraps your phone sign-in form. See the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login) for a complete implementation.

<Admonition type="info">
If you haven't set up Neon Auth UI components yet, see the [UI components reference](/docs/auth/reference/ui-components) for setup, or the [Next.js](/docs/auth/quick-start/nextjs-api-only) or [React](/docs/auth/quick-start/react) quick start for building custom forms instead.
</Admonition>

## Webhook events

The Phone Number plugin uses two webhook events:

- `send.otp` (blocking). See [Deliver OTPs via your SMS provider](#deliver-otps-via-your-sms-provider).
- `phone_number.verified` (non-blocking). Fires after a user successfully verifies a phone number.

See the [Webhooks guide](/docs/auth/guides/webhooks) for payload structure, signature verification, and retry behavior.

## Limitations

- **Sign-in only.** Users must already exist with a linked, verified phone number. No phone-first sign-up.
- **Bring your own SMS provider.** No built-in SMS delivery. Requires a `send.otp` webhook forwarding to your SMS provider.
- **E.164 format required.** Phone numbers must match `^\+[1-9]\d{1,14}$` (for example, `+15551234567`). Numbers with spaces, dashes, or parentheses are rejected.
- **OTP length is fixed at 6 digits.** Not configurable.
- **Rate limit.** Calls to `/phone-number/*` endpoints are limited to 10 requests per 60 seconds per IP, in addition to Neon Auth's global rate limits.
- **Attempt lockout.** After 3 incorrect codes, the OTP is invalidated. Request a new one to try again.

<NeedHelp/>
