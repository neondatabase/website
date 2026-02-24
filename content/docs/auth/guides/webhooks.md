---
title: Webhooks
subtitle: Handle authentication events with custom server logic
summary: >-
  Configure webhooks to receive notifications for authentication events like OTP
  delivery, magic link delivery, and user creation in Neon Auth.
enableTableOfContents: true
updatedOn: '2026-02-23T00:00:00.000Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Neon Auth webhooks send HTTP POST requests to your server when authentication events occur.

By default, Neon Auth handles OTP and magic link delivery through its built-in email provider. Webhooks let you replace this with your own delivery channels (SMS, custom email templates, WhatsApp) so you control how verification messages reach your users. Webhooks also let you hook into the user creation lifecycle to validate signups before they happen or sync new user data to external systems like CRMs and analytics platforms.

## Supported events

| Event | Type | Trigger | Use case |
| --- | --- | --- | --- |
| `send.otp` | Blocking | OTP code needs delivery | Custom OTP delivery via SMS or email service |
| `send.magic_link` | Blocking | Magic link needs delivery | Custom link delivery via any channel |
| `user.before_create` | Blocking | User attempts to sign up (before database write) | Signup validation, allowlists, user data enrichment |
| `user.created` | Non-blocking | User created in the database | Sync to CRM, analytics, post-signup workflows |

**Blocking** events pause the auth flow until your server responds (or the timeout expires). **Non-blocking** events are fire-and-forget; failures do not affect the user.

When you subscribe to `send.otp` or `send.magic_link`, Neon Auth skips its built-in email delivery for that event. Your webhook handler is responsible for delivering the code or link.

## Configure webhooks

Configure webhooks per project and branch using the Neon API. Your webhook URL must use HTTPS. See the API reference for [Get webhook configuration](https://api-docs.neon.tech/reference/getneonauthwebhookconfig) and [Update webhook configuration](https://api-docs.neon.tech/reference/updateneonauthwebhookconfig).

```bash
PUT /projects/{project_id}/branches/{branch_id}/auth/webhooks
GET /projects/{project_id}/branches/{branch_id}/auth/webhooks
```

Both endpoints use the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | boolean (required) | Enable or disable webhook delivery |
| `webhook_url` | string | HTTPS endpoint to receive webhook POST requests |
| `enabled_events` | string[] | Event types to subscribe to: `send.otp`, `send.magic_link`, `user.before_create`, `user.created` |
| `timeout_seconds` | integer (1-10) | Per-attempt timeout in seconds. Default: 5. Total delivery time across all attempts is capped at 15 seconds. See [Retry behavior](#retry-behavior). |

### Set or update configuration

```bash
curl -X PUT "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/webhooks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "enabled": true,
    "webhook_url": "https://your-app.com/webhooks/neon-auth",
    "enabled_events": ["send.otp", "send.magic_link", "user.before_create", "user.created"],
    "timeout_seconds": 5
  }'
```

### Get current configuration

```bash
curl "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth/webhooks" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

Both endpoints return the configuration in the same format:

```json
{
  "enabled": true,
  "webhook_url": "https://your-app.com/webhooks/neon-auth",
  "enabled_events": [
    "send.otp",
    "send.magic_link",
    "user.before_create",
    "user.created"
  ],
  "timeout_seconds": 5
}
```

## Payload structure

All events share a common JSON envelope:

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "send.otp",
  "timestamp": "2026-02-23T12:00:00.000Z",
  "context": {
    "endpoint_id": "ep-cool-sound-12345678",
    "project_name": "My SaaS App"
  },
  "user": {
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "name": "Jane Smith",
    "email_verified": false,
    "created_at": "2026-02-23T12:00:00.000Z"
  },
  "event_data": {
    "otp_code": "123456",
    "otp_type": "sign-in",
    "expires_at": "2026-02-23T12:10:00.000Z",
    "ip_address": "192.0.2.1",
    "user_agent": "Mozilla/5.0"
  }
}
```

The `user` object fields are all optional and vary by event. Available fields: `user_id`, `email`, `name`, `phone_number`, `image`, `email_verified`, `phone_verified`, `created_at`, `metadata`.

### `send.otp` event data

| Field | Type | Description |
| --- | --- | --- |
| `otp_code` | string | 6-digit OTP code |
| `otp_type` | string | `"sign-in"`, `"email-verification"`, or `"reset-password"` |
| `delivery_preference` | string (optional) | `"email"` or `"sms"` |
| `expires_at` | ISO datetime | Expiry time |
| `ip_address` | string | Requester's IP address |
| `user_agent` | string | Requester's user agent |

### `send.magic_link` event data

| Field | Type | Description |
| --- | --- | --- |
| `link_type` | string | `"sign-in"`, `"email-verification"`, or `"reset-password"` |
| `link_url` | string | Full verification URL with embedded token |
| `token` | string | Raw token for building custom redirect URLs |
| `expires_at` | ISO datetime | Expiry time |
| `ip_address` | string | Requester's IP address |
| `user_agent` | string | Requester's user agent |

Magic links do not include a `delivery_preference` field. Your webhook handler determines the delivery channel.

### `user.before_create` and `user.created` event data

These events fire only when a new user record is created in the database. They do not fire on subsequent sign-ins, including returning OAuth users.

| Field | Type | Description |
| --- | --- | --- |
| `auth_provider` | string | `"credential"`, `"google"`, `"github"`, or `"vercel"` |
| `referral_code` | string (optional) | Referral code from the signup URL |
| `signup_metadata` | object (optional) | Custom metadata passed during signup |
| `ip_address` | string | Requester's IP address |
| `user_agent` | string | Requester's user agent |

## Signature verification

Neon Auth uses asymmetric EdDSA (Ed25519) signatures with detached JWS, so key rotation does not require reconfiguring your endpoint. Verify signatures before processing webhooks.

### Request headers

Each webhook request includes the following headers:

| Header | Description |
| --- | --- |
| `X-Neon-Signature` | Detached JWS signature (`header..signature`) |
| `X-Neon-Signature-Kid` | Key ID for looking up the public key from JWKS |
| `X-Neon-Timestamp` | Unix timestamp in milliseconds |
| `X-Neon-Event-Type` | Event type (for example, `user.created`) |
| `X-Neon-Event-Id` | Unique event UUID |
| `X-Neon-Delivery-Attempt` | Attempt number: 1, 2, or 3 |

Example incoming webhook request:

```http
POST /webhooks/neon-auth HTTP/1.1
Content-Type: application/json
X-Neon-Signature: eyJhbGciOiJFZERTQSIsInR5cCI6IkpXUyIsImtpZCI6IjAxZGVjNTJiIn0..MEUCIQDZ8Qs
X-Neon-Signature-Kid: 01dec52b-4666-40f7-87ed-6423552eecaf
X-Neon-Timestamp: 1740312000000
X-Neon-Event-Type: send.otp
X-Neon-Event-Id: 550e8400-e29b-41d4-a716-446655440000
X-Neon-Delivery-Attempt: 1

{"event_id":"550e8400-e29b-41d4-a716-446655440000","event_type":"send.otp",...}
```

### Verification steps

1. Fetch your JWKS from `<NEON_AUTH_URL>/.well-known/jwks.json`. Find the key where `kid` matches the `X-Neon-Signature-Kid` header.
2. Parse the detached JWS from `X-Neon-Signature`. The format is `header..signature` (empty middle section).
3. Reconstruct the signing input using standard JWS with double base64url encoding:
   - `payloadB64 = base64url(rawRequestBody)`
   - `signaturePayload = timestamp + "." + payloadB64`
   - `signaturePayloadB64 = base64url(signaturePayload)`
   - `signingInput = header + "." + signaturePayloadB64`
4. Verify the Ed25519 signature against the signing input using the public key.

The double base64url encoding occurs because the timestamp is bound into the JWS payload per RFC 7515 Compact Serialization.

### Idempotency and additional checks

Retries send the same `X-Neon-Event-Id`. Your endpoint should track this value and return the same response for duplicate deliveries. This is especially important for `user.before_create`, where a lost response triggers a retry with the same event.

Consider rejecting requests where `X-Neon-Timestamp` is more than 5 minutes old to prevent replay attacks.

### Node.js example

```javascript
import crypto from 'node:crypto';

async function verifyWebhook(rawBody, headers) {
  const signature = headers['x-neon-signature'];
  const kid = headers['x-neon-signature-kid'];
  const timestamp = headers['x-neon-timestamp'];

  // 1. Fetch JWKS and find the matching key
  const res = await fetch(`${process.env.NEON_AUTH_URL}/.well-known/jwks.json`);
  const jwks = await res.json();
  const jwk = jwks.keys.find((k) => k.kid === kid);
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
```

<Admonition type="important">
Preserve the raw request body before JSON parsing. If your framework parses the body automatically, save the raw bytes first. Re-serialized JSON may differ from the original bytes and cause signature verification to fail.
</Admonition>

**Next.js App Router example:**

```javascript
// app/webhooks/neon-auth/route.js
export async function POST(request) {
  const rawBody = await request.text();
  const payload = await verifyWebhook(
    rawBody,
    Object.fromEntries(request.headers)
  );
  // process payload
  return Response.json({ allowed: true });
}
```

<Admonition type="tip">
In production, cache the JWKS response and refresh it when you encounter an unknown key ID. Rate-limit refresh attempts to avoid excessive requests to the JWKS endpoint.
</Admonition>

## Expected responses

Webhook responses must not exceed 10KB.

### `send.otp` and `send.magic_link`

Return any 2xx status code. The response body is ignored.

If all 3 delivery attempts fail or the 15-second global timeout expires, the auth flow fails and the user sees an error.

### `user.before_create`

Return a 2xx status code with a JSON body.

**Allow signup** (optionally attach metadata to the user record):

```json
{
  "allowed": true,
  "user_metadata": { "plan": "free" }
}
```

**Reject signup:**

```json
{
  "allowed": false,
  "error_message": "Signups from this domain are not allowed.",
  "error_code": "DOMAIN_BLOCKED",
  "reason": "Internal: blocked domain acme.com"
}
```

| Field | Type | Description |
| --- | --- | --- |
| `allowed` | boolean (required) | Whether to permit user creation |
| `user_metadata` | object (optional) | Merged into the user record if allowed |
| `error_message` | string (optional) | User-facing rejection message (max 500 characters) |
| `error_code` | string (optional) | Machine-readable code for client-side handling |
| `reason` | string (optional) | Internal reason for logging only, not shown to users (max 500 characters) |

If the webhook fails or returns an invalid response, signup is rejected. This fail-closed behavior prevents bypassing your validation logic.

<Admonition type="important">
If your webhook endpoint is unreachable, all signups fail. Monitor your endpoint availability and keep response times well under the configured timeout to leave room for network latency and retries.
</Admonition>

### `user.created`

Return any 2xx status code. The response body is ignored.

This event is non-blocking. Failures are logged but do not affect the user. Return 200 immediately and process the event asynchronously (for example, via a job queue). This prevents timeouts under load.

## Retry behavior

Because blocking events pause the user's auth flow, retries happen immediately rather than using exponential backoff. The user cannot wait minutes for a retry.

The 15-second global timeout runs from the start of the first attempt. Each attempt uses the lesser of `timeout_seconds` or the remaining global time. If earlier attempts consume the budget, later attempts get reduced timeouts or are skipped.

| Property | Value |
| --- | --- |
| Max attempts | 3 (1 initial + 2 retries, no backoff) |
| Global timeout | 15 seconds across all attempts |
| Retryable | 5xx, 429, 408, network errors (ECONNREFUSED, ETIMEDOUT, ECONNRESET, ENOTFOUND, ECONNABORTED) |
| Non-retryable | 4xx (except 408 and 429) |

## Testing and debugging

Neon Auth does not currently support test events, event logs, or redelivery. To test webhooks during development, expose a local server using a tunneling tool (for example, ngrok) and configure it as your webhook URL. Neon Auth rejects webhook URLs that point to localhost or private IP addresses.

<NeedHelp/>
