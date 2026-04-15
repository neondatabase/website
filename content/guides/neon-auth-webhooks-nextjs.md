---
title: Customizing Neon Auth with Webhooks
subtitle: Learn how to use Neon Auth Webhooks to build custom authentication flows
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-03-24T00:00:00.000Z'
updatedOn: '2026-03-24T00:00:00.000Z'
---

Neon Auth offers a fully integrated authentication and user management system designed to work seamlessly with your Neon database. By default, Neon Auth handles common authentication flows and delivers OTPs for email verification and passwordless login. This allows you to get up and running quickly with secure authentication.

But every application is different, and you may need to customize how these messages are delivered or add extra logic to your authentication flow. Some common scenarios that go beyond the default Neon Auth features include:

- **Multi-channel delivery:** Sending OTPs via SMS (e.g., with Twilio) or delivering notifications through WhatsApp or Slack instead of email.
- **Custom branding:** Using dedicated providers like Resend, SendGrid, or Postmark to design branded HTML email templates.
- **Localization:** Translating OTP or Magic Link messages dynamically based on the user’s language or region.
- **Analytics & integrations:** Logging user creation events to a CRM, triggering marketing automations, or syncing with third-party identity providers.
- **Enhanced validation:** Blocking disposable email domains, IP addresses, or implementing custom fraud detection logic before allowing user sign-ups.

To support these advanced use cases, Neon Auth provides [**Webhooks**](/docs/auth/guides/webhooks). Webhooks let you securely intercept authentication events (such as `send.otp`, `send.magic_link`, and `user.before_create`) and handle them with your own backend logic. For example, when you subscribe to `send.otp`, Neon Auth skips its default delivery, leaving your webhook handler in charge of sending the OTP. This gives you full control over the content, delivery method, and any additional side effects you want to implement.

This guide walks you through building a custom webhook handler in a Next.js application. You’ll learn how to send OTPs via email using Resend, implement a blocking handler to prevent sign-ups from disposable email providers, and optionally modify the handler to send SMS or WhatsApp messages using Twilio.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js:** Version `18` or later installed on your machine.
- **Neon account:** A free Neon project. If you don't have one, sign up at [Neon](https://console.neon.tech/signup).
- **Resend account:** To send custom emails. You'll need an [API key](https://resend.com/docs/dashboard/api-keys/introduction). You can use the default `resend.dev` testing domain, or [verify a custom domain](https://resend.com/docs/dashboard/domains/introduction).
- **ngrok** (or a similar tunneling tool): To test webhooks locally, you will need `ngrok` installed and configured on your machine. See the [ngrok Quickstart](https://ngrok.com/docs/getting-started/) to sign up, install the CLI, and authenticate with your auth token.

Review the [Neon Auth Webhooks Reference](/docs/auth/guides/webhooks) for complete event payload fields, required response formats, retry behavior, and signature verification details.

<Steps>

## Create a Neon project with Auth

You'll need a Neon project with Auth enabled to generate webhook events.

1. **Create a Neon project:** Navigate to the [Neon Console](https://console.neon.tech) to create a new Neon project. Give your project a name, such as `neon-webhooks-demo`.
2. **Enable Neon Auth:**
   - In your project's dashboard, go to the **Auth** tab.
   - Click on the **Enable Neon Auth** button to set up authentication for your project.
3. **Copy your credentials:**
   - **Neon Auth URL:** Found on the **Auth** page under Configuration.
     ![Neon Auth URL](/docs/auth/neon-auth-base-url.png)
   - **Neon API Key:** Generate an API key from your Settings in the Neon Console. You will need this to register your webhook.
     ![Neon API Key](/docs/manage/org_api_keys.png)
   - **Neon Project ID**: Found in your project settings.
   - **Neon Branch ID**: Found in the Branches section of your project. Click on the branch you are using (e.g., `production`) to find the Branch ID.

## Set up the Next.js application

Create a new Next.js project and install the dependencies for Neon Auth and Resend.

```bash
npx create-next-app@latest neon-webhooks-demo --yes
cd neon-webhooks-demo
```

Install the required packages:

```bash
npm install @neondatabase/auth@latest @neondatabase/neon-js@latest resend
```

## Configure environment variables

Create a `.env.local` file in the root of your project. Add your API keys and Neon Auth details.
Generate a secure random string for `NEON_AUTH_COOKIE_SECRET` (at least 32 characters). For example, you can use `openssl rand -base64 32` to generate a secure secret.

```bash
# Neon configuration
NEON_AUTH_BASE_URL="https://ep-xxx.neon.tech/neondb/auth"
NEON_AUTH_COOKIE_SECRET="your-random-string" # openssl rand -base64 32
NEON_API_KEY="your-neon-api-key"
NEON_PROJECT_ID="your-project-id"
NEON_BRANCH_ID="your-branch-id"

# Resend configuration
RESEND_API_KEY="re_123456789"
# Use the default resend.dev domain for testing, or verify your own domain
EMAIL_FROM="onboarding@yourdomain.com"
```

## Configure Neon Auth in Next.js

Set up the Neon Auth SDK to handle user sessions, API routing, and the frontend UI.

1.  **Create the server client:** Create `lib/auth/server.ts`:

    ```typescript shouldWrap
    import { createNeonAuth } from '@neondatabase/auth/next/server';

    export const auth = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    });
    ```

2.  **Create the browser client:** Create `lib/auth/client.ts`:

    ```typescript shouldWrap
    'use client';
    import { createAuthClient } from '@neondatabase/auth/next';

    export const authClient = createAuthClient();
    ```

3.  **Set up the Auth API route:** Create `app/api/auth/[...path]/route.ts`. This proxies Next.js auth requests to your Neon database:

    ```typescript shouldWrap
    import { auth } from '@/lib/auth/server';
    export const { GET, POST } = auth.handler();
    ```

4.  **Add Neon Auth styles:** Update `app/globals.css` to include the Neon Auth UI styles:

    ```css
    @import 'tailwindcss';
    @import '@neondatabase/neon-js/ui/tailwind'; /* [!code ++]

    /* other styles.. */
    ```

5.  **Add Neon Auth UI provider:** Update `app/layout.tsx` to wrap your application with the `NeonAuthUIProvider`, which supplies authentication context and UI components.

    ```tsx shouldWrap
    import { authClient } from '@/lib/auth/client';
    import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth/react';
    import './globals.css';

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en" suppressHydrationWarning>
          <body>
            <NeonAuthUIProvider authClient={authClient as any} emailOTP social={{ providers: ['google'] }}>
              <header className="flex h-16 items-center justify-between border-b p-4">
                <h1 className="text-xl font-bold">Neon Auth Webhooks Demo</h1>
                <UserButton size={'icon'} />
              </header>
              {children}
            </NeonAuthUIProvider>
          </body>
        </html>
      );
    }
    ```

6.  **Create Auth page:** Create `app/auth/[path]/page.tsx` for the authentication UI using Neon's pre-built components.

    ```tsx shouldWrap
    import { AuthView } from '@neondatabase/auth/react';

    export const dynamicParams = false;

    export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
      const { path } = await params;

      return (
        <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
          <AuthView path={path} />
        </main>
      );
    }
    ```

7.  **Create the Main page:** Overwrite `app/page.tsx` with a simple app that shows a "Logged In" state or a link to sign up.

    ```tsx shouldWrap
    'use client';

    import { UserButton } from '@neondatabase/neon-js/auth/react/ui';
    import { authClient } from '@/lib/auth/client';
    import Link from 'next/link';

    export default function Home() {
      const { data: session, isPending } = authClient.useSession();

      if (isPending) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8">
          {session?.user ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center space-y-4 dark:bg-gray-800">
              <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
              <p className="text-gray-500 dark:text-gray-400">You successfully bypassed the default email provider!</p>
              <div className="flex justify-center mt-4">
                <UserButton size={"sm"} />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md text-center">
              <h1 className="text-3xl font-bold mb-8">Neon Auth Webhooks Demo</h1>
              <Link href="/auth/sign-up" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sign In / Sign Up
              </Link>
            </div>
          )}
        </main>
      );
    }
    ```

## Create the webhook

### Implement webhook signature verification

Now, build the webhook functionality. Neon Auth uses EdDSA (Ed25519) signatures with detached JWS to secure webhook payloads. You must verify these signatures so bad actors cannot fake authentication events.

Create `lib/neon-webhook.ts`:

```typescript shouldWrap
import crypto from 'node:crypto';

export async function verifyNeonWebhook(rawBody: string, headers: Headers) {
  const signature = headers.get('x-neon-signature');
  const kid = headers.get('x-neon-signature-kid');
  const timestamp = headers.get('x-neon-timestamp');

  if (!signature || !kid || !timestamp) {
    throw new Error('Missing required Neon webhook headers');
  }

  // 1. Fetch JWKS and find the matching key
  const res = await fetch(`${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`);
  const jwks = await res.json();
  const jwk = jwks.keys.find((k: any) => k.kid === kid);
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

  // 6. Check timestamp freshness (prevent replay attacks - 5 min window)
  const ageMs = Date.now() - parseInt(timestamp, 10);
  if (ageMs > 5 * 60 * 1000) throw new Error('Webhook timestamp too old');

  return JSON.parse(rawBody);
}
```

### Create the webhook route

Create the endpoint that receives the events from Neon Auth. This route reads the raw text, verifies the signature using your helper, and routes the payload to the appropriate handler (Resend or the blocking logic).

Create `app/api/webhooks/neon/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyNeonWebhook } from '@/lib/neon-webhook';
import { Resend } from 'resend';
import { User } from '@neondatabase/auth/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const payload = await verifyNeonWebhook(rawBody, request.headers);
        const { event_type, event_data, user } = payload;

        // Route the event
        switch (event_type) {
            case 'send.otp':
                await handleSendOtp(event_data, user);
                return NextResponse.json({ success: true });

            case 'send.magic_link':
                await handleSendMagicLink(event_data, user);
                return NextResponse.json({ success: true });

            case 'user.before_create':
                const validationResult = await handleUserBeforeCreate(user);
                // Blocking events must return specific JSON to allow/deny the action
                return NextResponse.json(validationResult);

            case 'user.created':
                console.log(`New user completely registered: ${user.email}`);
                return NextResponse.json({ success: true });

            default:
                console.log(`Unhandled event type: ${event_type}`);
                return NextResponse.json({ success: true });
        }
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes('signature') ? 400 : 500 }
        );
    }
}

async function handleSendOtp(eventData: any, user: User) {
    const { otp_code } = eventData;

    console.log(`Sending custom Resend OTP to ${user.email}`);
    await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: 'Your Verification Code',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome to Our App!</h2>
        <p>Your secure verification code is:</p>
        <h1 style="background: #f4f4f5; padding: 16px; letter-spacing: 6px; text-align: center; border-radius: 8px;">
          ${otp_code}
        </h1>
        <p>This code will expire in 15 minutes.</p>
      </div>
    `,
    });
}

async function handleSendMagicLink(eventData: any, user: User) {
    const { link_url, link_type } = eventData;

    console.log(`Sending custom ${link_type} magic link to ${user.email}`);
    await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: user.email,
        subject: 'Your Secure Sign-in Link',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Sign in to your account</h2>
        <p>Use the button below to continue:</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${link_url}" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px;">Open secure link</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    });
}

// Example: Block signups from disposable domains
async function handleUserBeforeCreate(user: User) {
    const blockedDomains = ['spam.com', 'tempmail.org'];
    const userDomain = user.email.split('@')[1];

    if (blockedDomains.includes(userDomain)) {
        console.log(`Blocked signup for domain: ${userDomain}`);
        return {
            allowed: false,
            error_message: "Signups from this domain are not allowed. Please use a work email.",
            error_code: "DOMAIN_BLOCKED"
        };
    }

    return { allowed: true };
}
```

The above code does the following:

- Verifies the webhook signature and parses the payload.
- For `send.otp` events, it sends a custom OTP email using Resend.
- For `send.magic_link` events, it sends a custom sign-in or password reset link email using Resend.
- For `user.before_create` events, it checks if the email domain is in a blocked list and returns a response to allow or deny the signup accordingly.
- Logs when a user is fully created (which can be useful for analytics or triggering other side effects).

## Expose and register the webhook

Neon Auth requires a public HTTPS URL to deliver webhooks. Use **ngrok** to expose your local Next.js server.

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```
2. In a new terminal, start ngrok on port 3000:
   ```bash
   ngrok http 3000
   ```
   _Note the forwarding URL provided by ngrok (e.g., `https://a1b2c3d4.ngrok.app`)._

Now, register this webhook URL with Neon Auth using the Neon API. Run the following `curl` command, replacing the placeholders with your API Key, Project ID, Branch ID, and your ngrok URL:

```bash shouldWrap
curl -X PUT "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches/$NEON_BRANCH_ID/auth/webhooks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "enabled": true,
    "webhook_url": "https://a1b2c3d4.ngrok.app/api/webhooks/neon",
    "enabled_events": ["send.otp", "send.magic_link", "user.before_create", "user.created"]
  }'
```

If successful, Neon Auth will return your updated configuration in a JSON response.

```json
{
    "enabled":true,
    "webhook_url":"https://a1b2c3d4.ngrok.app/api/webhooks/neon",
    "enabled_events":["send.otp","send.magic_link","user.before_create","user.created"],
    "timeout_seconds":5
}
```

## Test the complete flow

With the webhook active and your Next.js app running, you can now test the entire authentication flow, including the blocking logic and custom OTP/magic link delivery.

1. **Test the Blocking Logic:**
   - Open your browser to `http://localhost:3000`.
   - In the Sign Up form, try to register with `testuser@spam.com` and a random password.
   - **Result:** Neon Auth halts the signup. The UI immediately displays the error you defined in your webhook: _"Signups from this domain are not allowed. Please use a work email."_
     ![Blocked Signup](/docs/guides/neon-auth-webhooks-nextjs-blocked-signup.png)

2. **Test the Custom OTP and Magic Link Delivery:**
   - Signup using a valid email.
   - Signout and either click on "Sign In with Email Code" or click "Forgot your password?".
   - **Result:** Instead of receiving a default email from Neon, you receive your custom Resend email. OTP flows trigger `send.otp`, and if you choose "Send reset link" in password reset, Neon triggers `send.magic_link` and your webhook delivers the custom link email.

</Steps>

## Optional: Sending OTPs via SMS

While the example above handles email deliveries, you might want to send your OTPs via SMS or WhatsApp. The logic is simple to modify.

First, install the Twilio SDK in your project:

```bash
npm install twilio
```

Then, you can adjust your `handleSendOtp` function to send an SMS instead of an email. Here's an example of how to do this with Twilio:

```typescript shouldWrap
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function handleSendOtp(eventData: any, user: any) {
    const { otp_code } = eventData;
    await twilioClient.messages.create({
        body: `Your App verification code is: ${otp_code}. Do not share this with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: USER_PHONE_NUMBER
    });
}
```

In a similar way, you could integrate WhatsApp messaging or other channels supported by Twilio or your chosen provider. You can also log these events to a CRM or analytics platform to track user engagement with your authentication flows.

## Deploying to production

When you are ready to take your application live:

1. Deploy your app to a hosting platform like Vercel, Netlify, or AWS.
2. Ensure you configure your environment variables (`RESEND_API_KEY`, `NEON_AUTH_COOKIE_SECRET`, etc.) in your hosting provider's dashboard.
3. Update your webhook URL in Neon Auth. Run the `curl` command from [Step 8](#expose-and-register-the-webhook) again, replacing the ngrok URL with your new production URL (e.g., `https://yourdomain.com/api/webhooks/neon`).

<Admonition type="important">
**Fail-Closed Behavior:** The `user.before_create` event is a blocking event. If your webhook endpoint goes down or returns a 500 error in production, **all new sign-ups will fail**. Consider returning `200 OK` as quickly as possible to prevent timeouts under heavy load.
</Admonition>

## Source code

The complete source code for a Next.js application implementing these webhooks is available on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/neon-webhooks-demo" description="Complete source code for handling Neon Auth Webhooks using Next.js and Resend." icon="github">Neon Auth Webhooks Next.js Demo</a>
</DetailIconCards>

## Resources

- [Neon Auth Webhooks Reference](/docs/auth/guides/webhooks)
- [Neon Auth UI components](/docs/auth/reference/ui-components)
- [Resend Documentation](https://resend.com/docs)
