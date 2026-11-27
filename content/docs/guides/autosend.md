---
title: Send email with AutoSend
subtitle: Send Managed Better Auth emails through AutoSend SMTP, send emails and AutoSend events from Neon Functions, and store email events in Lakebase Postgres on Neon
summary: >-
  How to use AutoSend with Neon: send Managed Better Auth verification and
  password reset emails through AutoSend SMTP, send emails from AutoSend
  templates and record AutoSend events that start automations with the
  autosend-email Function template, and store AutoSend delivery, bounce, spam,
  and unsubscribe webhooks in Lakebase Postgres on Neon.
enableTableOfContents: true
updatedOn: '2026-11-27T08:01:51.788Z'
---

[AutoSend](https://autosend.com) is an email platform for transactional and marketing email. You design emails as [templates](https://docs.autosend.com/transactional-emails/email-templates), send them through the AutoSend API or SMTP, and start [automations](https://docs.autosend.com/automations): email sequences that run when a contact is added or an event arrives.

You can use AutoSend with Neon in four ways:

| What you want                                                        | How it works                                                                        | Where to start                                                                            |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Send Managed Better Auth emails from your own domain                 | Managed Better Auth sends its emails through AutoSend SMTP                          | [Send Managed Better Auth emails](#send-managed-better-auth-emails-through-autosend-smtp) |
| Send transactional emails from your backend                          | A Neon Function calls the AutoSend Send Email API with a template and `dynamicData` | [Send emails from Neon Functions](#send-emails-from-neon-functions)                       |
| Start an AutoSend automation when something happens in your app      | The same function records an AutoSend event for a contact                           | [Start automations with events](#start-automations-with-events)                           |
| Keep a record of deliveries, bounces, spam reports, and unsubscribes | AutoSend webhooks call a Neon Function that writes each event to Postgres           | [Store email events](#store-autosend-email-events-in-postgres)                            |

Each way needs a [verified sending domain](https://docs.autosend.com/domain) in AutoSend.

## Send Managed Better Auth emails through AutoSend SMTP

By default, [Managed Better Auth](/docs/auth/overview) sends its emails, such as verification codes and password reset codes, from a shared Neon address. With a [custom SMTP provider](/docs/auth/production-checklist#email-provider), it sends the same emails from your own address through AutoSend. Neon's default email templates stay the same.

<Steps>

## Create an SMTP key

In AutoSend, open **Project Settings** > [**SMTP**](https://autosend.com/settings/smtp) and click **Create new SMTP key**. An API key doesn't work as the SMTP password.

![The SMTP Credentials panel in AutoSend, with the Password value and the Create new SMTP key link highlighted](/docs/guides/autosend/autosend-smtp-credentials.png)

## Configure the SMTP provider

Enter the AutoSend SMTP values for the branch your app uses:

| Field        | Value                                                               |
| ------------ | ------------------------------------------------------------------- |
| Host         | `smtp.autosend.com`                                                 |
| Port         | `587` (STARTTLS) or `465` (TLS)                                     |
| Username     | `autosend`                                                          |
| Password     | Your AutoSend SMTP key                                              |
| Sender email | An address on your verified domain, such as `auth@mail.example.com` |
| Sender name  | Your app's name                                                     |

<Tabs labels={["Console", "CLI"]}>

<TabItem>

In the [Neon Console](https://console.neon.tech), open your project, and go to **Settings** > **Better Auth**. Under **Email provider**, click **Configure email provider**. Select **Custom SMTP provider**, enter the values from the table, and click **Save**.

</TabItem>

<TabItem>

From a directory [linked](/docs/cli/link) to your Neon project, run [`neon neon-auth config email-provider update`](/docs/cli/neon-auth#config-email-provider-update):

```bash shouldWrap
neon neon-auth config email-provider update --type standard --host smtp.autosend.com --port 587 --username autosend --password "$AUTOSEND_SMTP_KEY" --sender-email auth@mail.example.com --sender-name "Acme"
```

</TabItem>

</Tabs>

## Send a test email

In the Console, click **Send test email** under **Email provider**. With the CLI, run:

```bash
neon neon-auth config email-provider test --recipient-email you@example.com
```

The email arrives from your sender address and appears on the AutoSend **Email Activity** page. Emails your app triggers, such as a verification code or a password reset code, now arrive from the same address.

</Steps>

Each branch has its own email provider settings, and a new branch copies the settings of its parent. Set the provider on your production branch, and branches you create from it send through AutoSend too.

To use your own email templates instead of Neon's, handle the `send.otp` and `send.magic_link` [webhook](/docs/auth/guides/webhooks) events and send each email through the AutoSend API. While a webhook subscribes to those events, Managed Better Auth sends those emails to the webhook instead of through SMTP. See [Customizing Managed Better Auth with webhooks](/guides/neon-auth-webhooks-nextjs).

## Send emails from Neon Functions

The `autosend-email` [Function template](/functions/templates/autosend-email) is a [Neon Function](/docs/compute/functions/overview) with two routes. `/send-email` sends an email from an AutoSend template or from HTML and text, and `/send-event` records an AutoSend event. Both routes require a bearer token, because Neon Function URLs are public.

<Steps>

## Add the function to your project

From a directory [linked](/docs/cli/link) to your Neon project, add the template:

```bash
neon functions new autosend-email
```

The CLI writes the function to `functions/autosendemail/`, declares it in [`neon.ts`](/docs/reference/neon-ts), and lists its environment variables in `.env.example`.

## Set your AutoSend keys

In AutoSend, create a project API key, which starts with `AS_`. Add it to `.env.local` with a default sender on your verified domain and a random token for callers:

```bash
cat >> .env.local <<'EOF'
AUTOSEND_API_KEY=AS_your-api-key
AUTOSEND_FROM="Acme <hello@mail.example.com>"
EOF
export AUTOSEND_FUNCTION_TOKEN=$(openssl rand -hex 32)
echo "AUTOSEND_FUNCTION_TOKEN=$AUTOSEND_FUNCTION_TOKEN" >> .env.local
```

## Deploy the function

```bash
neon deploy --env .env.local
neon functions get autosendemail
```

`neon functions get` prints the function URL.

## Send an email

Create a template in AutoSend. On the [**Email Templates**](https://autosend.com/dynamic-templates) page, open the template's menu and select **Template ID** to copy its ID, which starts with `A-`.

![The Email Templates list in AutoSend, with a template's menu open and the Template ID option highlighted](/docs/guides/autosend/autosend-template-id.png)

The keys in `dynamicData` fill the template's `{{variables}}`:

```bash shouldWrap
curl -s https://<function-url>/send-email \
  -H "Authorization: Bearer $AUTOSEND_FUNCTION_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "to": { "email": "grace@example.com", "name": "Grace" },
    "templateId": "A-your-template-id",
    "dynamicData": { "firstName": "Grace" }
  }'
```

The function returns the AutoSend `emailId`, and the send appears on the AutoSend **Email Activity** page.

</Steps>

To send your own content, pass `subject` with `html`, `text`, or both instead of `templateId`. When you send with a template, AutoSend uses the template's subject. If `dynamicData` leaves out a variable, AutoSend still sends the email, with that variable empty. The [template README](https://github.com/neondatabase/examples/tree/main/registry/autosend-email) lists every field and error.

The function doesn't retry, and the AutoSend Send Email API doesn't detect repeated requests. If you retry a failed call, the recipient can get the email twice.

## Start automations with events

An AutoSend [event](https://docs.autosend.com/automations/events) records something a contact did, such as completing sign-up or upgrading a plan. An automation with the **Event received** trigger starts when the event arrives.

Create the event in AutoSend first. On the [**Events**](https://autosend.com/events) page, click **New Event**, enter the event name, and add each property with its type, such as `plan` as a string. AutoSend rejects events and properties it doesn't know.

![The event dialog in AutoSend, with the signup_completed event name and the plan property of type String highlighted](/docs/guides/autosend/autosend-event-properties.png)

Then call `/send-event` from your backend:

```bash shouldWrap
curl -s https://<function-url>/send-event \
  -H "Authorization: Bearer $AUTOSEND_FUNCTION_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "grace@example.com",
    "eventName": "signup_completed",
    "eventProperties": { "plan": "pro" }
  }'
```

If no contact has that email yet, AutoSend creates one.

To send an email when the event arrives, open the [**Automations**](https://autosend.com/automations) page and click **New Automation**. Select the **Event received** trigger, choose your event, and add the email to send. AutoSend requires an unsubscribe group before it activates an automation, which you select in the automation's settings. Only events that arrive after you activate the automation start it.

![The Select Trigger panel of an AutoSend automation, with the Event received trigger and the signup_completed event highlighted](/docs/guides/autosend/autosend-automation-trigger.png)

## Store AutoSend email events in Postgres

AutoSend [webhooks](https://docs.autosend.com/others/webhooks/introduction) report what happened to each email: delivered, bounced, reported as spam, or unsubscribed. A Neon Function can verify each webhook and write it to Postgres, so you can join email outcomes with your users and stop emailing addresses that bounce.

<DetailIconCards>
<a href="/guides/autosend-webhooks" description="Receive AutoSend webhooks in a Neon Function, store them in Postgres without duplicates, and test on a branch" icon="code">Store AutoSend webhook events in Neon</a>
</DetailIconCards>

<NeedHelp/>
