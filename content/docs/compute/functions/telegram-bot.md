---
title: How to host a Telegram bot on Neon Functions
tag: new
tagTheme: green
subtitle: Receive Telegram messages, run bot commands and store data in Postgres
enableTableOfContents: true
isDraft: false
---

<FeatureBetaProps feature_name="Neon Functions" />

Telegram can send bot updates to an HTTPS webhook. A [Neon Function](/docs/compute/functions/overview) can receive those updates, run bot commands and query Postgres from the same branch.

The template verifies the secret token on each incoming update, handles messages and processes inline keyboard callbacks. See Telegram's [Bot API](https://core.telegram.org/bots/api) when you add other update types.

<Admonition type="note" title="Webhook delivery only">
This guide uses Telegram webhooks. It doesn't run a polling process with `getUpdates`. Telegram disables `getUpdates` while a webhook is active.
</Admonition>

## Prerequisites

- A Neon project in AWS US East (Ohio) (`aws-us-east-2`). Functions are available only in this region during beta. See [Get started with Neon Functions](/docs/compute/functions/get-started).
- The latest [Neon CLI](/docs/cli), installed and authenticated. Upgrade with `npm install -g neon@latest` if needed, then see [CLI auth](/docs/cli/auth).
- Node.js 24 (`node -v`). Deployed functions run on `nodejs24`.
- A Telegram account.

The template uses npm. Its scripts load Telegram values from `.env`.

## Create a Telegram bot

Open [BotFather](https://t.me/BotFather) in Telegram and send `/newbot`. BotFather asks for a display name and username. Usernames must be 5 to 32 characters and end in `bot`. They can contain Latin letters, numbers and underscores. For example, use `example_neon_bot`. You can't change the username later.

After you choose a username, BotFather sends you an authentication token and a link to the bot. Save both for later.

<Admonition type="warning">
Treat the bot token like a password. Anyone who has it can control your bot. Never commit it or paste it into screenshots, tickets or chat. If it leaks, use `/token` in BotFather to replace it.
</Admonition>

For more BotFather options, see [Creating a new bot](https://core.telegram.org/bots/features#creating-a-new-bot).

## Scaffold the project

In an interactive terminal, `neon bootstrap` copies the Telegram example into a new directory, then prompts you to install dependencies and [link](/docs/cli/link) a Neon project. The template ID is `telegram-bot-http`:

```bash
neon bootstrap my-telegram-bot --template telegram-bot-http
cd my-telegram-bot
```

Accept both prompts. If you skip either, run `npm install` and `neon link` before continuing.

See [`neon bootstrap`](/docs/cli/bootstrap) for flags. Later commands in this guide assume you're in that directory.

To start from the source instead, copy [bots/telegram-bot-http](https://github.com/neondatabase/examples/tree/main/bots/telegram-bot-http) from the [examples](https://github.com/neondatabase/examples) repo, `cd` into it, then install dependencies and run `neon link`.

`neon.ts` declares the `telegram` function and passes the bot token and webhook secret to it:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    functions: {
      telegram: {
        name: "Telegram webhook",
        source: "./functions/telegram.ts",
        env: {
          TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN!,
          TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET!,
        },
        dev: {
          port: 8787,
        },
      },
    },
  },
});
```

The key `telegram` is the function slug. It's permanent after the first deploy and appears in CLI commands and the invocation URL. See the [neon.ts reference](/docs/reference/neon-ts).

This walkthrough deploys the function before connecting Telegram. Telegram requires a public HTTPS webhook, so it can't reach `localhost` unless you use a tunnel.

## Add Telegram secrets

Don't overwrite an existing `.env`; doing so can remove `DATABASE_URL`. If `.env` doesn't exist, copy the template. Then pull the linked branch's Neon variables into the same file:

```bash
cp .env.example .env
neon env pull --file .env
```

Generate a webhook secret:

```bash
openssl rand -hex 32
```

Add the BotFather token and generated secret to `.env`. Leave `TELEGRAM_WEBHOOK_URL` empty until you deploy:

```env filename=".env"
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
TELEGRAM_WEBHOOK_URL=

# Written locally by `neon env pull`; injected into deployed functions by Neon.
NEON_BRANCH=
DATABASE_URL=
DATABASE_URL_UNPOOLED=
```

The webhook secret can contain 1 to 256 characters from `A-Z`, `a-z`, `0-9`, `_` and `-`. The `openssl` command above produces a valid value.

Don't edit `NEON_BRANCH`, `DATABASE_URL` or `DATABASE_URL_UNPOOLED`. Refresh them with `neon env pull --file .env`. See [Environment variables](/docs/compute/functions/environment-variables).

Only the local webhook setup script reads `TELEGRAM_WEBHOOK_URL`. Neon doesn't pass it to the function.

## Deploy the function

If `neon bootstrap` installed dependencies, you can deploy now. If you copied the source by hand, run `npm install` first.

The `deploy` script runs `neon deploy --env .env`, which evaluates `neon.ts` with your Telegram secrets in `process.env`:

```bash
npm run deploy
```

The CLI applies the `neon.ts` policy, bundles the function and waits for the deployment to finish. You'll see `Applied changes` and a **Function URLs** list. Copy the `telegram` URL.

The URL looks like:

```text shouldWrap
https://br-cool-darkness-123456-telegram.compute.c-1.us-east-2.aws.neon.tech/
```

Your cell (`c-1`, `c-3`, …) will differ.

If you need the URL later, run:

```bash
npm run endpoint
```

This runs `neon functions get telegram`. Copy **Invocation Url** from the output.

## Set the webhook

Telegram sends updates to `/api/webhook`. Remove the trailing slash from the function URL, append `/api/webhook` and add the full URL to `.env`:

```env filename=".env"
TELEGRAM_WEBHOOK_URL=https://br-cool-darkness-123456-telegram.compute.c-1.us-east-2.aws.neon.tech/api/webhook
```

Register that URL and your webhook secret with Telegram:

```bash
npm run set:webhook
```

The script calls Telegram's [`setWebhook`](https://core.telegram.org/bots/api#setwebhook) method with the URL, webhook secret and the `message` and `callback_query` update types. Telegram returns `true` when it accepts the webhook.

The function URL must use HTTPS. Telegram includes your secret in the `X-Telegram-Bot-Api-Secret-Token` header on every update.

If you change the webhook secret, run `npm run deploy` first so the function has the new value. Then run `npm run set:webhook` again so Telegram sends the same value.

Open the webhook URL in a browser to check that the function is available. A GET request returns:

```json
{
  "ok": true,
  "service": "telegram-webhook",
  "webhookPath": "/api/webhook",
  "webhookUrl": "https://br-cool-darkness-123456-telegram.compute.c-1.us-east-2.aws.neon.tech/api/webhook"
}
```

`ok: true` confirms only that the function is reachable at that URL. It doesn't verify the webhook secret or confirm webhook registration. A `true` result from `npm run set:webhook` confirms registration. Sending `/ping` verifies end-to-end delivery.

## Register bot commands

Register the command menu with Telegram:

```bash
npm run register:commands
```

The script calls Telegram's `setMyCommands` method with `/ping`, `/info`, `/help`, `/buttons`, `/name` and `/profile`. On success it prints `true`.

Run this command again after you change the command list.

## Try `/ping`

Open the bot link that BotFather gave you. If Telegram shows a **Start** button, click it. Then send `/ping`. The bot replies with `Pong` and an estimated webhook latency.

If Telegram replies with `Unknown command` after you click **Start**, send `/ping`. The template doesn't register a `/start` command.

If the bot doesn't reply:

- Confirm that `npm run set:webhook` returned `true`.
- Check that `TELEGRAM_WEBHOOK_URL` ends with `/api/webhook`.
- Check that `TELEGRAM_WEBHOOK_SECRET` matches the value used in the latest deployment.
- Redeploy after changing `TELEGRAM_BOT_TOKEN` or `TELEGRAM_WEBHOOK_SECRET`.
- Check [function logs](/docs/compute/functions/logs) for an invalid webhook secret, invalid update payload or Telegram API error.

Telegram retries webhook updates when your endpoint doesn't return a `2xx` response.

The template doesn't deduplicate Telegram `update_id` values. If you add a command with side effects, make it safe to run more than once.

## How it works

`functions/telegram.ts` handles GET and POST requests. GET returns the webhook URL. POST checks the secret header, validates the Telegram update and dispatches messages or button callbacks.

<Admonition type="important" title="Verify the webhook secret">
Check `X-Telegram-Bot-Api-Secret-Token` before processing an update. The template compares it with `TELEGRAM_WEBHOOK_SECRET` using Node.js `timingSafeEqual`.
</Admonition>

The handler verifies the secret before parsing an update. It handles callback queries, tracks recognized commands without delaying replies and sends `Unknown command. Try /help.` for unsupported commands. See the complete handler:

<ExternalCode url="https://raw.githubusercontent.com/neondatabase/examples/main/bots/telegram-bot-http/functions/telegram.ts" />

## Next steps

The template includes more than `/ping`:

- `/info`: shows the Node.js version, platform, request method, function URL and Neon branch.
- `/help`: lists the commands defined by the template's shared command list.
- `/buttons`: shows an inline keyboard with refresh, echo, time and confirm callbacks.
- `/name <your name>`: stores a display name. `/name` without an argument shows the stored name.
- `/profile`: shows the stored name, total command count and per-command usage.

The template stores Telegram user IDs, display names and usage counts in the `profiles` and `command_usage` tables. Usage tracking is best-effort and doesn't block replies.

After `neon env pull --file .env` writes `DATABASE_URL`, create the tables:

```bash
npm run db:push
```

The template gives `/name` and `/profile` 2.5 seconds for a database response. If a cold Postgres compute misses that deadline, the bot returns **Warming up**. Wait a moment, then run the command again.

Sibling bot templates: [Discord](https://github.com/neondatabase/examples/tree/main/bots/discord-bot-http) and [WhatsApp](https://github.com/neondatabase/examples/tree/main/bots/whatsapp-bot-http).

## Example

Create a copy of the example with the Neon CLI:

```bash
neon bootstrap my-telegram-bot --template telegram-bot-http
cd my-telegram-bot
```

You can find the example in [`bots/telegram-bot-http`](https://github.com/neondatabase/examples/tree/main/bots/telegram-bot-http).

<NeedHelp/>
