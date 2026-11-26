---
title: Send email with Loops
subtitle: Send Managed Better Auth emails, sync users, and start Loops workflows from Lakebase Postgres on Neon
summary: >-
  How to use Loops with Neon: send Managed Better Auth sign-in codes, magic
  links, and password reset emails as Loops transactional emails from a Neon
  Function, create Loops contacts when users sign up, start Loops workflows
  from data in Lakebase Postgres on Neon with a scheduled Function Trigger,
  and store Loops delivery, bounce, and unsubscribe events in Postgres.
  Includes a quick start with the loops-email Function template and explains
  why Managed Better Auth custom SMTP doesn't work with Loops.
enableTableOfContents: true
updatedOn: '2026-11-26T20:10:30.152Z'
---

[Loops](https://loops.so) is an email platform for SaaS products. It sends transactional emails, marketing campaigns, and [workflows](https://loops.so/docs/workflows): email sequences that start when a contact is added or an event arrives. You design emails in the Loops editor and send them through the Loops API.

You can use Loops with Neon in four ways:

| What you want                                                                  | How it works                                                                                 | Where to start                                                                 |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Send Managed Better Auth sign-in codes, magic links, and password reset emails | A Managed Better Auth webhook calls a Neon Function, which sends a Loops transactional email | [Send Managed Better Auth emails](#send-managed-better-auth-emails-with-loops) |
| Add each new user to your Loops audience                                       | The same function creates a Loops contact on `user.created`                                  | [Sync users to Loops](#sync-users-to-loops)                                    |
| Email users based on what's in your database                                   | A scheduled Function Trigger queries Postgres and sends Loops events that start workflows    | [Send lifecycle emails](#send-lifecycle-emails-from-postgres)                  |
| Keep a record of deliveries, bounces, and unsubscribes                         | Loops webhooks call a Neon Function that writes each event to Postgres                       | [Store Loops email events](#store-loops-email-events-in-postgres)              |

## Send Managed Better Auth emails with Loops

By default, [Managed Better Auth](/docs/auth/overview) sends sign-in codes, magic links, and password reset emails with shared Neon branding. When you subscribe a [webhook](/docs/auth/guides/webhooks) to the `send.otp` and `send.magic_link` events, Managed Better Auth skips its own email and sends the code or link to your endpoint instead. The `loops-email` [Function template](/functions/templates/loops-email) is that endpoint: it verifies the webhook signature and sends the matching Loops transactional email.

<Steps>

## Create transactional emails in Loops

In Loops, [verify a sending domain](https://loops.so/docs/sending-domain). Then [create a transactional email](https://loops.so/docs/transactional) for each email your app sends, add the data variable from this table, and publish it:

| Managed Better Auth email | Event             | Email type           | Loops data variable |
| ------------------------- | ----------------- | -------------------- | ------------------- |
| Sign-in code              | `send.otp`        | `sign-in`            | `otpCode`           |
| Email verification code   | `send.otp`        | `email-verification` | `otpCode`           |
| Password reset code       | `send.otp`        | `forget-password`    | `otpCode`           |
| Magic link                | `send.magic_link` | `sign-in`            | `magicLinkUrl`      |
| Email verification link   | `send.magic_link` | `email-verification` | `verificationUrl`   |
| Password reset link       | `send.magic_link` | `forget-password`    | `resetPasswordUrl`  |

You only need emails for the sign-in methods you turned on. Copy each email's **Transactional ID**, and create an API key in [Loops API settings](https://app.loops.so/settings?page=api).

## Add the function to your project

From a directory [linked](/docs/cli/link) to your Neon project, add the template and declare Managed Better Auth in `neon.ts`:

```bash
neon functions new loops-email
neon config add auth
```

The CLI writes the function to `functions/loopsemail/`, declares it in [`neon.ts`](/docs/reference/neon-ts), and lists its environment variables in `.env.example`. Install the dependencies from the `Next:` list it prints.

## Set your Loops keys

Add your API key and transactional IDs to `.env.local`. Set only the IDs for the emails you created:

```bash filename=".env.local"
LOOPS_API_KEY=your-loops-api-key
LOOPS_OTP_SIGNIN_TRANSACTIONAL_ID=your-transactional-id
LOOPS_OTP_VERIFICATION_TRANSACTIONAL_ID=your-transactional-id
LOOPS_OTP_PASSWORD_RESET_TRANSACTIONAL_ID=your-transactional-id
LOOPS_MAGIC_LINK_TRANSACTIONAL_ID=your-transactional-id
LOOPS_VERIFY_EMAIL_TRANSACTIONAL_ID=your-transactional-id
LOOPS_RESET_PASSWORD_TRANSACTIONAL_ID=your-transactional-id
```

`neon functions new` declares each variable in `neon.ts` as `process.env.<NAME>!`, and `neon deploy` fails while any of them is unset. For each ID you leave out, change its declaration in `neon.ts` to an optional one:

```ts filename="neon.ts"
LOOPS_VERIFY_EMAIL_TRANSACTIONAL_ID: { value: process.env.LOOPS_VERIFY_EMAIL_TRANSACTIONAL_ID, required: false },
```

Do the same for `LOOPS_FUNCTION_TOKEN`, which only the template's optional `/send-event` route uses. The [template README](https://github.com/neondatabase/examples/tree/main/registry/loops-email) describes each variable.

## Deploy the function

```bash
neon deploy --env .env.local
neon functions get loopsemail
```

`neon functions get` prints the function URL.

## Turn on the webhook

In the [Neon Console](https://console.neon.tech), open your project and go to **Settings** > **Better Auth** > **Webhooks**. Turn on **Enable Webhooks**, set **Webhook URL** to the function URL followed by `/auth-webhook`, and select **Send OTP** and **Send Magic Link** under **Enabled Events**.

<Admonition type="warning">
Once you subscribe to `send.otp` or `send.magic_link`, Neon stops sending those emails itself. If an email type has no transactional ID set, the function returns `422` and the user doesn't get that email. A magic sign-in link then fails the request with `WEBHOOK_DELIVERY_FAILED`. Email codes and password reset links still report success to your app, so the function logs are the only place a missing email shows up. Set a transactional ID for every email type your app sends.
</Admonition>

## Test it

Sign in to your app with an email code or magic link. Managed Better Auth doesn't send test events, so test it with an actual sign-in. The send appears on the Loops [Transactional](https://app.loops.so/transactional) page. If nothing arrives, check the function logs in the Neon Console under **Monitoring** > **Functions**. Each failure is logged as `[loops-email] <status>: <reason>`.

</Steps>

If Loops returns an error, the function returns `502`, and Neon retries the delivery up to two more times. The function skips an event it already handled, but a retry that reaches another instance can occasionally send the same code twice.

To write the handler yourself instead, for example as a route in your Next.js app, refer to the Loops tabs in [Customizing Managed Better Auth with webhooks](/guides/neon-auth-webhooks-nextjs).

### Custom SMTP doesn't work with Loops

Managed Better Auth can also send its emails through a [custom SMTP provider](/docs/auth/production-checklist#email-provider). That option doesn't work with Loops. [Loops SMTP](https://loops.so/docs/smtp) expects a JSON payload with a `transactionalId` in the email body, and Managed Better Auth sends its own email body over SMTP. Use the webhook instead.

### SMS codes aren't sent through Loops

Loops doesn't send SMS. For a `send.otp` event from the [Phone Number plugin](/docs/auth/guides/plugins/phone-number), with `delivery_preference` set to `sms`, the function returns `422` instead of emailing the code. The Phone Number plugin needs a `send.otp` webhook that sends SMS, and each branch has one webhook URL, so the plugin can't share it with this function.

## Sync users to Loops

The same function creates a Loops contact for each new user. In the webhook settings, also select `user.created`. The function [creates or updates the contact](https://loops.so/docs/api-reference/update-contact) with the Managed Better Auth user ID as its `userId`, and with the first and last name split from the user's `name` when the user has one. Other fields on an existing contact stay as they are. To send a welcome sequence, create a Loops workflow with the **Contact added** trigger.

If you use the [Organization plugin](/docs/auth/guides/plugins/organization), also select `organization.invitation.accepted`. The function sends a `joinedOrganization` [event](https://loops.so/docs/events) with `organizationName` and `role` as event properties, which a workflow with the **Event received** trigger can start from.

`user.created` fires only when the user is created. Managed Better Auth has no update or delete events, so later changes to a user don't reach Loops. See [Sync users to your own tables](/docs/auth/guides/webhooks#sync-users-to-your-own-tables) for the other events you can handle.

## Send lifecycle emails from Postgres

Some emails depend on your data rather than on an auth event: a user who hasn't been active for a week, or an account close to its plan limit. A [scheduled Function Trigger](/docs/compute/functions/triggers/schedule) can query Postgres for those users and send Loops events that start workflows. The guide records each send in Postgres, so a user gets each email once even across trigger retries.

<DetailIconCards>
<a href="/guides/loops-lifecycle-emails" description="Query Postgres on a schedule and send Loops events that start workflows, with duplicate protection in Postgres" icon="code">Send lifecycle emails from Postgres with Neon Function Triggers and Loops</a>
</DetailIconCards>

## Store Loops email events in Postgres

Loops [webhooks](https://loops.so/docs/webhooks) report what happened to each email: delivered, bounced, reported as spam, or unsubscribed. A Neon Function can verify each webhook and write it to Postgres, so you can join email outcomes with your users and stop emailing addresses that bounce.

<DetailIconCards>
<a href="/docs/guides/loops-webhooks" description="Receive Loops webhooks in a Neon Function, store them in Postgres, and test on a branch" icon="code">Store Loops webhook events in Postgres</a>
</DetailIconCards>

<NeedHelp/>
