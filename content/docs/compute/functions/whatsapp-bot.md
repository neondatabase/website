---
title: How to host a WhatsApp bot on Neon Functions
tag: new
tagTheme: green
subtitle: Receive WhatsApp messages and reply through the Graph API
enableTableOfContents: true
isDraft: false
---

<FeatureBetaProps feature_name="Neon Functions" />

WhatsApp Cloud API sends incoming messages to HTTP webhooks. In this guide, you deploy a [Neon Function](/docs/compute/functions/overview) as the webhook endpoint. The function verifies Meta's requests, handles bot commands and sends replies through the Graph API.

The template uses Drizzle to store user names and command usage in Neon Postgres. See Meta's [WhatsApp Cloud API get started guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/) for details about setting up an account and phone number.

<Admonition type="note" title="WhatsApp Cloud API only">
This example uses Meta's hosted WhatsApp Cloud API. It doesn't automate a personal WhatsApp account or the WhatsApp Business mobile app.
</Admonition>

## Prerequisites

- A Neon project in AWS US East (Ohio) (`aws-us-east-2`) or AWS Europe (Frankfurt) (`aws-eu-central-1`). Support is expanding toward all regions. See [Get started with Neon Functions](/docs/compute/functions/get-started).
- The latest [Neon CLI](/docs/cli), installed and authenticated. Upgrade with `npm install -g neon@latest`, then follow [CLI authentication](/docs/cli/auth).
- Node.js 24 (`node -v`). Deployed functions run on `nodejs24`.
- A Meta developer account.
- A Meta app connected to a WhatsApp Business Account, with a Cloud API phone number and a test recipient. Meta's get started flow can create test resources for you.

The example's README and package scripts use npm. The commands in this guide do the same.

## Set up WhatsApp Cloud API

In the Meta App Dashboard, create an app. On **App details**, enter an app name such as `Neon Bot` and continue.

![App details with Neon Bot entered as the app name](/docs/compute/functions/whatsapp-create-app.png)

On **Use cases**, select **Connect with customers through WhatsApp**, then continue through the app creation flow.

![Connect with customers through WhatsApp selected as the app use case](/docs/compute/functions/whatsapp-use-case.png)

Follow Meta's [WhatsApp Cloud API get started guide](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/) to **WhatsApp** > **API Setup**. Generate an access token, select the phone numbers you'll use for testing and send the first test message.

![WhatsApp API Setup with access token and test phone number details](/docs/compute/functions/whatsapp-api-setup.png)

Keep these values:

- **Access token**: authorizes calls from the function to the Graph API.
- **Phone number ID**: identifies the Cloud API sender used by the function.
- **App secret**: lets the function verify the `X-Hub-Signature-256` header on incoming webhook POSTs.

The temporary access token from the API setup flow expires quickly. To keep developing the bot, follow Meta's instructions to create a system user and permanent access token.

Create a separate webhook verify token with any strong random value that only you and Meta know:

```bash
openssl rand -hex 32
```

Save the output locally. You'll use the same value for `WHATSAPP_VERIFY_TOKEN` and Meta's **Verify token** field.

<Admonition type="warning">
Treat the access token, app secret and webhook verify token like passwords. Never commit them or paste them into screenshots, tickets or chat.
</Admonition>

## Scaffold the project

`neon bootstrap` copies the WhatsApp HTTP example into a new directory, installs its dependencies and links a Neon project. The template ID is `whatsapp-bot-http`:

```bash
neon bootstrap my-whatsapp-bot --template whatsapp-bot-http
cd my-whatsapp-bot
```

See [`neon bootstrap`](/docs/cli/bootstrap) for flags. Run the remaining commands from that directory.

`neon.ts` declares one function named `whatsapp` and passes the four WhatsApp variables into its environment:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    functions: {
      whatsapp: {
        name: "WhatsApp webhook",
        source: "./functions/whatsapp.ts",
        env: {
          WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN!,
          WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID!,
          WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN!,
          WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET!,
        },
        dev: {
          port: 8787,
        },
      },
    },
  },
});
```

The `whatsapp` key is the function slug. It appears in CLI commands and the invocation URL. See the [`neon.ts` reference](/docs/reference/neon-ts).

Deploy the function before connecting Meta. Meta needs a public HTTPS callback URL, so you don't need `npm run dev`.

## Add WhatsApp secrets

The deploy script runs `neon deploy --env .env` to read `.env`. Don't replace a `.env` created by `neon bootstrap` because it can contain database variables for the linked project. Add the WhatsApp keys to the existing file. If the file doesn't exist, copy `.env.example` to `.env`.

```env filename=".env"
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=

# Set automatically by Neon when running `neon deploy`.
NEON_BRANCH=
DATABASE_URL=
DATABASE_URL_UNPOOLED=
```

Set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_APP_SECRET` to the values from Meta. Set `WHATSAPP_VERIFY_TOKEN` to the random value you generated.

Leave the Neon variables as written by `neon bootstrap`. Neon also injects them into the deployed function. See [Environment variables](/docs/compute/functions/environment-variables).

## Apply the database schema

The `/name` and `/profile` commands use the `profiles` and `command_usage` tables. Apply the included Drizzle schema to the linked Neon database:

```bash
npm run db:push
```

You can deploy and test `/ping` without these tables, but the database-backed commands will return an error until you apply the schema.

## Deploy the function

Deploy the function with the WhatsApp secrets from `.env`:

```bash
npm run deploy
```

The script runs `neon deploy --env .env`. The CLI evaluates `neon.ts`, bundles the handler and waits for the deployment to finish. If the deployment fails, check [function logs](/docs/compute/functions/logs) and [Deploy and manage functions](/docs/compute/functions/deploy).

Copy the `whatsapp` invocation URL from the deployment output. Remove its trailing slash, then append `/api/webhook`. The complete callback URL looks like:

```text shouldWrap
https://br-cool-darkness-123456-whatsapp.compute.c-1.us-east-2.aws.neon.tech/api/webhook
```

Your branch name, endpoint ID and cell will differ.

To get the invocation URL again, run:

```bash
npm run endpoint
```

This script runs `neon functions get whatsapp`. Append `/api/webhook` to the returned invocation URL.

Deployed environment variables are a snapshot of `.env` at deployment time. Run `npm run deploy` again after changing any WhatsApp value.

## Configure the webhook

In the Meta App Dashboard, open **WhatsApp** > **Configuration**. Enter:

- **Callback URL**: the full Neon URL ending in `/api/webhook`
- **Verify token**: the exact value of `WHATSAPP_VERIFY_TOKEN`

Select **Verify and save**. Meta sends a GET request with `hub.mode`, `hub.verify_token` and `hub.challenge`. The function checks that the mode is `subscribe` and the token matches, then returns the challenge as plain text.

![WhatsApp webhook configuration with callback URL, verify token and Verify and save highlighted](/docs/compute/functions/whatsapp-configuration.png)

Once Meta verifies the webhook, subscribe to the **messages** field. Meta uses this field for incoming messages and outgoing message status updates. See Meta's [webhook setup guide](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks/) and [messages webhook reference](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components/).

If verification fails:

- Confirm that the callback URL ends in `/api/webhook`.
- Confirm that Meta's verify token exactly matches `WHATSAPP_VERIFY_TOKEN`.
- Redeploy after editing `.env`.
- Check [function logs](/docs/compute/functions/logs).

Opening the callback URL directly in a browser returns `403 invalid verify token`. That's expected because a normal browser request doesn't contain Meta's verification query parameters.

## Try /ping

Use a WhatsApp account registered as a test recipient to send `/ping` to the Cloud API phone number. The bot should reply with `Pong` and an estimated webhook latency.

WhatsApp doesn't need a separate command registration step. The function parses incoming text messages directly.

If the bot doesn't reply:

- Confirm that webhook verification succeeded and the **messages** field is subscribed.
- Confirm that you sent the message to the phone number associated with `WHATSAPP_PHONE_NUMBER_ID`.
- Check whether a temporary `WHATSAPP_ACCESS_TOKEN` expired.
- Confirm that `WHATSAPP_APP_SECRET` matches the Meta app. A mismatch causes POST signature verification to return `401`.
- Redeploy after changing `.env`, then check [function logs](/docs/compute/functions/logs).

## How it works

`functions/whatsapp.ts` handles GET verification requests and POST webhook deliveries at `/api/webhook`. The GET path compares Meta's verify token with your configured token:

```ts filename="functions/whatsapp.ts"
export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET") {
    const isVerified = verifyWhatsAppWebhookChallenge({
      mode: url.searchParams.get("hub.mode"),
      token: url.searchParams.get("hub.verify_token"),
      verifyToken: getWhatsAppVerifyToken(),
    });

    if (!isVerified) {
      return new Response("invalid verify token", { status: 403 });
    }

    return new Response(url.searchParams.get("hub.challenge") ?? "", {
      headers: { "content-type": "text/plain" },
    });
  }

  // POST signature verification and message dispatch follow.
}
```

For a POST, the handler reads the raw body, verifies its HMAC signature with the app secret and only then parses the JSON:

```ts filename="functions/whatsapp.ts"
const body = await request.text();
const isVerified = verifyWhatsAppRequest({
  appSecret: getWhatsAppAppSecret(),
  body,
  signature: request.headers.get("x-hub-signature-256"),
});

if (!isVerified) {
  return jsonResponse({ error: "invalid request signature" }, { status: 401 });
}

let payloadBody: unknown;

try {
  payloadBody = JSON.parse(body);
} catch {
  return jsonResponse({ error: "invalid json" }, { status: 400 });
}

const parsedPayload = whatsAppWebhookPayloadSchema.safeParse(payloadBody);

if (!parsedPayload.success) {
  return jsonResponse({ error: "invalid whatsapp webhook payload" }, { status: 400 });
}
```

<Admonition type="important" title="Verify the raw body">
Call `request.text()` and verify the signature before `JSON.parse`. Meta computes `X-Hub-Signature-256` from the exact request body with your app secret. Parsing and serializing the payload first can change its bytes and invalidate the signature.
</Admonition>

The handler extracts entries that contain a `messages` array. For each incoming message, it:

1. Tries to mark the message as read.
2. Handles an interactive button reply if one is present.
3. Parses a text command.
4. Runs the matching command handler.
5. Sends the result through the Graph API as a reply to the triggering message.

Read status updates and command usage tracking are best effort. A failure in either task doesn't block the command reply. Valid status webhooks don't contain an incoming `messages` array, so the handler acknowledges them without running a command.

## Commands and callbacks

The template supports:

- `/ping`: returns `Pong` with latency estimated from the incoming message timestamp.
- `/info`: shows the Node.js version, platform, request method, Neon branch and function URL.
- `/help`: builds a command list from the template's command definitions.
- `/buttons`: sends **Refresh**, **Echo** and **Time** interactive reply buttons.
- `/name Dana Smith`: stores a name for the sender's WhatsApp user ID. `/name` without an argument returns the stored value.
- `/profile`: shows the stored name, total commands run and per-command usage.

The parser also accepts command names without the leading slash. An unrecognized command returns `Unknown command. Try /help.` The function ignores messages that don't match the command syntax.

The `/buttons` callbacks use the IDs `button-test:refresh`, `button-test:echo` and `button-test:time`. The handler processes `interactive.button_reply` events before text commands:

- **Refresh** sends the button panel again with a UTC timestamp.
- **Echo** confirms that interactive replies work.
- **Time** returns the current server time in UTC.

Text responses and button panels are sent through the same Graph API `messages` endpoint. When Meta includes an incoming message ID, the bot adds it as reply context.

The `/name` and `/profile` handlers use a 2.5-second database deadline. If a scaled-to-zero branch is still waking up, the bot returns a warming-up message. Run the command again after the branch is warm.

## Example

Create a copy of the example with the Neon CLI:

```bash
neon bootstrap my-whatsapp-bot --template whatsapp-bot-http
cd my-whatsapp-bot
```

You can find the example in [`bots/whatsapp-bot-http`](https://github.com/neondatabase/examples/tree/main/bots/whatsapp-bot-http).
<NeedHelp/>
