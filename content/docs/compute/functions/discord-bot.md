---
title: How to host a Discord bot on Neon Functions
subtitle: Receive slash commands at a public function URL with no Gateway connection
enableTableOfContents: true
isDraft: false
---

<FeatureBetaProps feature_name="Neon Functions" />

Discord can deliver slash commands over HTTP. There's no Gateway connection and no discord.js client. Discord POSTs each interaction to the Interactions Endpoint URL on your app. This guide uses a [Neon Function](/docs/compute/functions/overview) as that URL.

The template verifies Discord's request signatures and answers the `PING`/`PONG` handshake. Discord's [Interactions Overview](https://discord.com/developers/docs/interactions/overview) is optional background if you want the crypto details.

<Admonition type="note" title="Not for Gateway bots">
Neon Functions are not the right primitive for a Discord Gateway bot yet. Gateway bots need a long-lived, stateful process with session resume, presence and sharding. This guide is HTTP only: Discord POSTs slash commands to your function URL.
</Admonition>

## Prerequisites

- A Neon project in AWS US East (Ohio) (`aws-us-east-2`). Functions are available only in this region during beta. See [Get started with Neon Functions](/docs/compute/functions/get-started).
- The [Neon CLI](/docs/cli), version 2.25.0 or later (`neon --version`). `neon bootstrap` needs that floor. Upgrade with `npm install -g neon@latest` if you're behind, then authenticate ([CLI auth](/docs/cli/auth)).
- Node.js 24 (`node -v`). Deployed functions run on `nodejs24`. Get Started's Node.js 20+ is the platform floor; this template needs 24.
- A Discord account.
- A Discord server you own. Create one if you need to. You often can't add a bot to someone else's server.

This guide's commands are the `pnpm` forms from the template README. The template ships `package-lock.json` and no `pnpm-lock.yaml`, so `neon bootstrap` may use npm. `npm run <script>` runs the same script names.

## Create a Discord application

Open the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**. Give it a name (for example `Neon HTTP bot`), accept the Developer Terms, then click **Create**.

![Discord Developer Portal New Application modal](/docs/compute/functions/discord-new-application.png)

On **General Information**, copy the **Application ID** and **Public Key**. Stash them somewhere local. They go into `.env` after you scaffold the project.

![Discord General Information showing Application ID and Public Key](/docs/compute/functions/discord-general-information.png)

Open the **Bot** tab and click **Reset Token**. Copy the token. Discord shows it once. Resetting invalidates any previous token, so if this app already had one, update `.env` after you create it.

![Discord Bot tab showing the Reset Token button](/docs/compute/functions/discord-bot-token.png)

<Admonition type="warning">
Treat the bot token like a password. Anyone who has it can act as your bot. Never commit it or paste it into screenshots, tickets or chat.
</Admonition>

The public key is what the function uses to verify that a POST really came from Discord. The application ID and bot token are what `pnpm register:commands` uses to declare slash commands. `/help` uses the token at request time for command mentions.

### Invite the bot to a test server

Create a Discord server you own if you don't already have one.

This walkthrough uses **OAuth2** → **URL Generator**, not the **Installation** tab.

Under **Scopes**, check `bot` and `applications.commands`.

![Discord OAuth2 URL Generator with bot and applications.commands scopes](/docs/compute/functions/discord-oauth-scopes.png)

Under **Bot Permissions**, check **Send Messages** and **Use Slash Commands**.

![Discord OAuth2 URL Generator with Send Messages and Use Slash Commands](/docs/compute/functions/discord-oauth-url-generator.png)

The screenshots are cropped to the checkboxes. Copy the generated URL at the bottom of **URL Generator**, below **Bot Permissions**. Open it, pick your test server, click **Continue**, then **Authorize**.

Slash commands show up after you [register them](#register-slash-commands).

## Scaffold the project

`neon bootstrap` copies the HTTP example into an empty directory, can install dependencies and can [link](/docs/cli/link) a Neon project. The template id is `discord-bot-http`:

```bash
neon bootstrap my-discord-bot --template discord-bot-http
cd my-discord-bot
```

See [`neon bootstrap`](/docs/cli/bootstrap) for flags. Later commands in this guide assume you're in that directory.

To start from the source instead, copy [bots/discord-bot-http](https://github.com/neondatabase/examples/tree/main/bots/discord-bot-http) from the [examples](https://github.com/neondatabase/examples) repo, `cd` into it, then install dependencies and `neon link`.

`neon.ts` declares the `discord` function, the Discord env vars and a local `dev` port:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    functions: {
      discord: {
        name: "Discord interactions",
        source: "./functions/discord.ts",
        env: {
          DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
          DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
          DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
          ...(process.env.DISCORD_GUILD_ID ? { DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID } : {}),
        },
        dev: {
          port: 8787,
        },
      },
    },
  },
});
```

The key `discord` is the function slug. It's permanent after the first deploy and appears in CLI commands and the invocation URL. See the [neon.ts reference](/docs/reference/neon-ts).

This walkthrough is deploy-only. Discord needs a public HTTPS URL, so we don't use `pnpm dev` here. The scaffold still sets `dev.port` to `8787` to match the template.

## Add Discord secrets

Template scripts read `.env` (`neon deploy --env .env` and `node --env-file=.env`). Don't copy `.env.example` over a `.env` that `neon bootstrap` or `neon link` already wrote. That can wipe `DATABASE_URL`. If `.env` exists, add the Discord keys to it. If it doesn't, copy `.env.example` to `.env`.

```env filename=".env"
DISCORD_PUBLIC_KEY=
DISCORD_APPLICATION_ID=
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=

# Set automatically by Neon when running `pnpm deploy`.
NEON_BRANCH=
DATABASE_URL=
DATABASE_URL_UNPOOLED=
```

Fill in the four `DISCORD_*` values you stashed. For this guide, set `DISCORD_GUILD_ID` to your test server. In Discord, turn on Developer Mode (User Settings → App Settings → Advanced), right-click the server name in the sidebar and click **Copy Server ID**. A guild is a Discord server.

Don't set `NEON_BRANCH`, `DATABASE_URL` or `DATABASE_URL_UNPOOLED`. Neon writes them on deploy. See [Environment variables](/docs/compute/functions/environment-variables).

If you omit `DISCORD_GUILD_ID`, the register script creates global commands, which can take up to an hour to show up. Skip that until you want a production-wide install.

## Deploy the function

If you used `neon bootstrap` and let it install dependencies, skip that step. If you cloned by hand, install first (`pnpm install` as in the README, or `npm install` from the lockfile).

`pnpm deploy` (or `npm run deploy`) runs `neon deploy --env .env`, which evaluates `neon.ts` with your Discord secrets in `process.env`:

```bash
pnpm deploy
```

or `npm run deploy`.

The CLI applies the `neon.ts` policy, bundles the function and waits until that apply finishes. You'll see `Applied changes` and a **Function URLs** list. That list prints the `discord` origin: a URL with a trailing slash and no path. Pasting that origin into Discord fails the handshake. Copy the `discord` URL, strip the trailing slash and append `/api/interactions`. That's the value you paste into the Developer Portal. If the command fails, check [function logs](/docs/compute/functions/logs). Flags are in [Deploy and manage functions](/docs/compute/functions/deploy).

Deployed env is a snapshot of `.env` at apply time. After you fix Discord keys (or if you deployed before filling them in), run `pnpm deploy` again.

The URL looks like:

```text shouldWrap
https://br-cool-darkness-123456-discord.compute.c-1.us-east-2.aws.neon.tech/api/interactions
```

Your cell (`c-1`, `c-3`, …) will differ.

If you need the origin again later, `pnpm endpoint` (or `npm run endpoint`) runs `neon functions get discord`. The default table columns are **Slug**, **Name**, **Invocation Url** and **Created At**. Copy **Invocation Url**, strip a trailing slash if there is one, then append `/api/interactions`. Pass `-o yaml` or `-o json` if you want the `invocation_url` key instead of the table.

## Set the Interactions Endpoint URL

In the Developer Portal, open **General Information**. Paste the Neon URL (including `/api/interactions`) into **Interactions Endpoint URL** and save.

Discord immediately POSTs a `PING` (`type: 1`). The handler verifies the signature and returns a `PONG`. If that handshake succeeds, Discord saves the URL (the Developer Portal shows a green success message).

If save fails, retry once. Confirm the public key in `.env` matches General Information, you redeployed after editing `.env` and the path ends with `/api/interactions`. Then open or curl the function URL (the origin from Function URLs, or that URL plus `/api/interactions`). GET returns JSON with these keys:

```json
{
  "ok": true,
  "service": "discord-interactions",
  "interactionsPath": "/api/interactions",
  "interactionsUrl": "https://br-cool-darkness-123456-discord.compute.c-1.us-east-2.aws.neon.tech/api/interactions"
}
```

`ok: true` only proves the isolate is up and `interactionsUrl` is the value you paste. GET does not use the public key. A wrong key or a stale deploy still fails Discord's `PING`. Confirm `interactionsUrl` matches what you paste, then check [function logs](/docs/compute/functions/logs). Signature failures show up there. Fix `.env` and redeploy. The first PING can miss a cold start.

## Register slash commands

Discord doesn't read commands from your handler. Register them once with the Discord API:

```bash
pnpm register:commands
```

or `npm run register:commands`.

That compiles `scripts/registerCommands.ts` and calls Discord's HTTP API with your bot token. It runs locally. It isn't part of the Neon Function. On success it prints the registered command list as JSON.

The hosted function still needs `DISCORD_BOT_TOKEN`, `DISCORD_APPLICATION_ID` and `DISCORD_PUBLIC_KEY` in the deployed env. `/help` uses the token at request time for command mentions. The public key is for request verification.

If it throws, check that `.env` exists and the token is set (Discord returns 401 for a bad token). A wrong `DISCORD_GUILD_ID`, or a bot that isn't in that server, fails with an unknown guild error.

With `DISCORD_GUILD_ID` set, the script registers guild commands on that server.

The template registers `/ping`, `/info`, `/help`, `/buttons`, `/name` and `/profile`. Each command has an optional `ephemeral` boolean in Discord's `/` picker when you invoke it. Set it so only you see the reply. It isn't an env var or a code edit.

Restart the Discord client after registering so the `/` picker picks up the new commands.

## Try /ping

In your test server, type `/` and pick **ping** from Discord's command picker, then send it. The bot should reply with a Pong embed and an estimated interaction latency.

HTTP-only bots stay **offline** in the member list. That's expected. They still handle slash commands.

You must send Discord an initial response within about 3 seconds, or Discord invalidates the interaction token. This template answers in the request.

If nothing appears, or Discord says "The application did not respond":

- The bot is in the server with the `applications.commands` scope.
- Discord saved the Interactions Endpoint URL after a successful PING/PONG.
- `pnpm deploy` finished (redeploy after any `.env` change).
- `pnpm register:commands` printed JSON (then you restarted Discord).
- `DISCORD_GUILD_ID` is this server.
- Check [function logs](/docs/compute/functions/logs) for a failed PING or a slow cold start. Try `/ping` again once the branch is warm.

## How it works

`functions/discord.ts` default-exports `async function handler(request: Request)` and returns a `Response`. GET returns `{ ok, service, interactionsPath, interactionsUrl }`. POST reads the raw body, verifies the Discord signature, then dispatches on interaction type.

<Admonition type="important" title="Verify the raw body">
Call `request.text()` and verify **before** `JSON.parse`. Discord signs `timestamp + body` as the exact bytes it sent. Parsing JSON first can change whitespace and fail verification. See [Interactions Overview](https://discord.com/developers/docs/interactions/overview).
</Admonition>

The GET and POST `PING` path looks like this. ApplicationCommand and MessageComponent dispatch is in the source.

```ts filename="functions/discord.ts"
import { InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { DISCORD_INTERACTIONS_PATH } from "../src/constants/discord.js";
import { getDiscordEnv } from "../src/env.js";
import { discordInteractionSchema } from "../src/schemas/discord.js";
import { jsonResponse } from "../src/utils/jsonResponse.js";
import { verifyDiscordRequest } from "../src/utils/verifyDiscordRequest.js";

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  switch (request.method) {
    case "GET":
      return jsonResponse({
        ok: true,
        service: "discord-interactions",
        interactionsPath: DISCORD_INTERACTIONS_PATH,
        interactionsUrl: `${url.origin}${DISCORD_INTERACTIONS_PATH}`,
      });
    case "POST":
      break;
    default:
      return jsonResponse({ error: "method not allowed" }, { status: 405 });
  }

  const body = await request.text();
  const env = getDiscordEnv();
  const isVerified = verifyDiscordRequest({
    body,
    publicKey: env.DISCORD_PUBLIC_KEY,
    signature: request.headers.get("x-signature-ed25519"),
    timestamp: request.headers.get("x-signature-timestamp"),
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

  const parsedPayload = discordInteractionSchema.safeParse(payloadBody);

  if (!parsedPayload.success) {
    return jsonResponse({ error: "invalid interaction payload" }, { status: 400 });
  }

  const payload = parsedPayload.data;

  if (payload.type === InteractionType.Ping) {
    return jsonResponse({ type: InteractionResponseType.Pong });
  }

  // ApplicationCommand and MessageComponent dispatch is in the source.
}
```

## Next steps

The template already implements more than `/ping`:

- `/info` and `/help`: [Components v2](https://discord.com/developers/docs/components/overview) panels (Discord's newer message layout) with runtime details and slash-command mentions.
- `/buttons`: Components v2 buttons (primary, secondary, success and danger).
- `/name` and `/profile`: Postgres via Drizzle (`profiles` and `command_usage` tables). After the project is linked and deployed so `DATABASE_URL` exists, run `pnpm db:push` once. If you skip that, those commands reply that they could not reach the Neon database. On a cold branch they can also fall back to a warming-up reply; run the command again once the branch is warm.

To add LLM chat and image generation, see the [Community Guide](/guides/discord-bot-on-neon-functions). That's a separate from-scratch walkthrough.

Sibling HTTP bot templates: [Telegram](https://github.com/neondatabase/examples/tree/main/bots/telegram-bot-http) and [WhatsApp](https://github.com/neondatabase/examples/tree/main/bots/whatsapp-bot-http).

## Example

Create a copy of the example with the Neon CLI:

```bash
neon bootstrap my-discord-bot --template discord-bot-http
cd my-discord-bot
```

You can find the example in [`bots/discord-bot-http`](https://github.com/neondatabase/examples/tree/main/bots/discord-bot-http).
<NeedHelp/>
