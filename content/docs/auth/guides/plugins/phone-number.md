---
title: Phone Number
subtitle: Sign in existing users with phone OTP codes delivered via your SMS provider
summary: >-
  Covers the setup of the Phone Number plugin in Neon Auth, enabling existing
  users to sign in with a one-time password delivered over SMS through a
  webhook-connected SMS provider that you control.
enableTableOfContents: true
updatedOn: '2026-04-20T00:00:00.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth is built on [Better Auth](https://www.better-auth.com/) and supports the [Phone Number](https://www.better-auth.com/docs/plugins/phone-number) plugin through the Neon SDK. You don't need to install or configure the Better Auth Phone Number plugin directly.

Phone Number lets an existing user sign in with a one-time password (OTP) delivered to their phone. The flow works like this:

1. The user enters their phone number in E.164 format (for example, `+15551234567`).
2. Neon Auth generates a 6-digit OTP and fires the `send.otp` webhook with `delivery_preference: "sms"`. Your webhook handler delivers the code via your SMS provider.
3. The user enters the code. Neon Auth verifies it, creates a session, and signs them in.

<Admonition type="important">
The Phone Number plugin is **sign-in only**. A user must already exist in your project, with a phone number linked to their account, before they can sign in by phone. There is no phone-first sign-up path. See [How users get a phone number on their account](#how-users-get-a-phone-number-on-their-account) below.

Neon Auth does **not** deliver SMS for you. Enabling the plugin also requires a `send.otp` webhook that forwards the code to your SMS provider (Twilio, MessageBird, Vonage, etc.). See [Deliver OTPs via your SMS provider (required)](#deliver-otps-via-your-sms-provider-required).
</Admonition>

## Prerequisites

- A Neon project with **Auth enabled**
- An existing user who has a phone number linked to their account (see [How users get a phone number on their account](#how-users-get-a-phone-number-on-their-account))
- The **Phone Number plugin enabled** (see [Enable Phone Number](#enable-phone-number) below)
- A configured webhook subscribed to the `send.otp` event that forwards the code to your SMS provider (see [Deliver OTPs via your SMS provider (required)](#deliver-otps-via-your-sms-provider-required) and the [Webhooks guide](/docs/auth/guides/webhooks))

## How users get a phone number on their account

Because the plugin is sign-in only, users need to first sign up and sign in through another method (email and password, a social provider, and so on). Once they have an authenticated session, your app can link a phone number to their account by calling `authClient.phoneNumber.verify()` with `updatePhoneNumber: true`.

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

## Enable Phone Number

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Open the [Neon Console](https://console.neon.tech).
2. Select your project and go to **Auth** > **Plugins**.
3. Toggle **Phone Number** on.
4. Configure the options:
   - **OTP Expiration** (60-600 seconds, default: 300) controls how long a generated OTP stays valid.
   - **Allowed Attempts** (1-10, default: 3) is the maximum number of verification attempts against a single OTP before it is invalidated.

![Neon Console Auth Plugins tab with Phone Number settings](/docs/auth/neon_auth_plugins_phone_number.png)

</TabItem>

<TabItem>

Send a `PATCH` request to configure the Phone Number plugin. All request body fields are optional; send only the fields you want to change.

```bash shouldWrap
curl -X PATCH \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/plugins/phone_number" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "otp_expires_in": 300,
    "allowed_attempts": 3
  }'
```

A `GET` request returns the current configuration:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/plugins/phone_number" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

```json
{
  "enabled": true,
  "otp_expires_in": 300,
  "allowed_attempts": 3
}
```

| Field              | Type    | Default | Description                                                      |
| ------------------ | ------- | ------- | ---------------------------------------------------------------- |
| `enabled`          | boolean | `false` | Whether the Phone Number plugin is active                        |
| `otp_expires_in`   | integer | `300`   | Seconds before the OTP expires (60-600)                          |
| `allowed_attempts` | integer | `3`     | Verification attempts against a single OTP before lockout (1-10) |

</TabItem>

</Tabs>

## Deliver OTPs via your SMS provider (required)

Neon Auth does not send SMS messages itself. When an OTP needs to be delivered, Neon Auth fires the `send.otp` webhook with `delivery_preference: "sms"`. You must subscribe to this event and deliver the code through your own SMS provider (for example, Twilio, MessageBird, or Vonage). If no webhook is configured, calls to `authClient.phoneNumber.sendOtp()` fail.

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
      body: `Your code is ${payload.event_data.otp_code}. It expires in ${Math.round(
        (new Date(payload.event_data.expires_at).getTime() - Date.now()) / 1000
      )} seconds.`,
    });
  }

  return NextResponse.json({ ok: true });
}
```

<Admonition type="note" title="User context for first OTPs">
When an unauthenticated user requests their first phone OTP (no prior account linked to that phone number), the webhook `user` object contains the `phone_number` only. Do not rely on `user.name`, `user.email`, or other profile fields when templating the SMS for first-time sends.
</Admonition>

For a runnable Next.js handler, signature verification, and a local tunneling setup, see the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login).

## Sign in an existing user with phone OTP

Build a two-step phone sign-in form using the [Neon SDK](/docs/reference/javascript-sdk). First, send an OTP:

```ts shouldWrap filename="src/send-phone-otp.ts"
import { authClient } from '@/lib/auth/client';

export async function sendPhoneOtp(phoneNumber: string) {
  const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber });
  if (error) throw error;
}
```

Then, after the user enters the code they received over SMS, verify it. Do **not** pass `updatePhoneNumber` here — omitting it tells Better Auth to treat the verification as a sign-in, look up the existing user by phone number, and create a session:

```ts shouldWrap filename="src/verify-phone-otp.ts"
import { authClient } from '@/lib/auth/client';

export async function signInWithPhoneOtp(phoneNumber: string, code: string) {
  const { data, error } = await authClient.phoneNumber.verify({
    phoneNumber,
    code,
  });

  if (error) throw error;
  return data;
}
```

Phone numbers must be in E.164 format (for example, `+15551234567`). Numbers in other formats are rejected.

For a complete working form with resend, error handling, and attempt-budget awareness, see the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login).

## Use Phone Number alongside UI components

Unlike Email OTP, `NeonAuthUIProvider` does not expose a `phoneNumber` prop, and the pre-built `AuthView` does not render a phone sign-in UI. If you're using Neon Auth UI components, render your own phone sign-in form next to `AuthView` on the sign-in route:

```tsx shouldWrap filename="app/auth/[path]/page.tsx"
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { authViewPaths } from '@neondatabase/neon-js/auth/react/ui/server';
import { PhoneSignInSection } from './phone-sign-in-section';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  const isSignIn = path === authViewPaths.SIGN_IN;

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-sm space-y-6">
        <AuthView path={path} />
        {isSignIn && <PhoneSignInSection />}
      </div>
    </div>
  );
}
```

The `PhoneSignInSection` is a small custom component that wraps your phone OTP form and renders only on the sign-in path. See the [nextjs-phone-login example](https://github.com/neondatabase/neon-js/tree/main/examples/nextjs-phone-login) for a complete implementation.

> If you haven't set up Neon Auth UI components yet, see the [UI components reference](/docs/auth/reference/ui-components) for setup, or the [Next.js](/docs/auth/quick-start/nextjs-api-only) or [React](/docs/auth/quick-start/react) quick start for building custom forms instead.

## Webhook events

The Phone Number plugin uses two webhook events:

- `send.otp` with `delivery_preference: "sms"` — blocking. Your handler must deliver the code over SMS. See [Deliver OTPs via your SMS provider (required)](#deliver-otps-via-your-sms-provider-required).
- `phone_number.verified` — non-blocking. Fires after a user successfully verifies a phone number.

See the [Webhooks guide](/docs/auth/guides/webhooks) for payload structure, signature verification, and retry behavior.

## Limitations

- **Sign-in only.** Users must already exist in the project with a verified phone number linked to their account. The plugin does not currently create new users from a phone OTP flow.
- **Bring your own SMS provider.** Neon Auth does not include SMS delivery. A `send.otp` webhook that forwards the code to an SMS provider is required for the plugin to function.
- **E.164 format required.** Phone numbers must match `^\+[1-9]\d{1,14}$` (for example, `+15551234567`). Numbers with spaces, dashes, or parentheses are rejected.
- **OTP length is fixed at 6 digits.** This is not configurable.
- **Rate limit.** Calls to `/phone-number/*` endpoints are limited to 10 requests per 60 seconds per IP, in addition to Neon Auth's global rate limits.
- **Attempt lockout.** `allowed_attempts` controls how many times a user can guess a single OTP before it is invalidated. After lockout, the user must request a new OTP.

<NeedHelp/>
