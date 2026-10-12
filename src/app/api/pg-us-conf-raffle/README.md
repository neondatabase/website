# PGConf US raffle submissions

The form on `/pg-us-conf-raffle` posts to this server route. The route validates the fields, signs the payload with HMAC-SHA256, and calls the Apps Script Web app. Apps Script saves the entry in the existing Databricks Raffle Google Form responses.

## Environment variables

Set these on the server in Vercel and locally in `.env.local`:

- `RAFFLE_APPS_SCRIPT_URL`: the deployed Apps Script `/exec` URL.
- `RAFFLE_SIGNING_SECRET`: the same secret stored in the script's `RAFFLE_SIGNING_SECRET` property. Use the existing protected copy; never commit it or give it a `NEXT_PUBLIC_` prefix.

Add variables to each intended deployment environment and create a new deployment for them to take effect. Preview deployments with these variables write to the same live raffle form, so use mocked responses for automated tests. Check a successful Google submission on a separate test form or with a real entry from the user.

[Apps Script project](https://script.google.com/home/projects/1FS6x45C-ATduLGy489jnSSnf3VmGyxaMm3rhlFUOuJ8xO7Xg1sbqthyB/edit)

## Submission behavior

- Required website fields: first name, last name, email. The existing optional Google Form phone question is left blank.
- Google Form must accept responses, have its one-response limit disabled, and use the ordinary Email question with built-in email collection disabled.
- The browser keeps one UUID for retries of unchanged fields while the page is open. Apps Script confirms an already recorded request instead of creating a second response. Changing fields or reloading the page creates a new ID; this does not enforce one entry per email.
- Only an HTTP success response containing `ok: true` from Apps Script becomes `success: true` for the browser. Google errors, invalid configuration, invalid JSON and timeouts show the existing retry/Google Forms fallback UI.
- Requests to Google time out after 25 seconds. A timeout can happen after Google saved the response, so retries must reuse the request ID.
- Apps Script response storage and retry receipt storage are separate writes. A receipt-storage failure after submission can still cause a duplicate on retry.
- This route validates input and checks browser origin. Bot protection and durable rate limits should be configured at the hosting layer before public traffic is enabled.

## Tests

```bash
npm run test:unit:run -- src/app/api/pg-us-conf-raffle/route.test.js src/components/pages/pg-us-conf-raffle/raffle-form.test.jsx
```

These tests mock Google requests and do not create raffle entries.
