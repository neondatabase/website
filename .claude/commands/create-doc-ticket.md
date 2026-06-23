---
description: 'Create a JIRA documentation task in the Databricks LKB project and assign it to yourself. Accepts a Slack thread URL, a PR reference, or a manual description as input. Databricks employees only — requires the JIRA MCP.'
---

# Create Doc Ticket

Creates a task in the internal Databricks JIRA instance (LKB project), assigned to the person running the command.

Accepts three input types — use whichever fits:

- **Slack thread URL** — fetches the thread and synthesizes a title and description from it
- **PR reference** — a GitHub PR URL or `#number` (repo inferred from context or asked); fetches PR details and synthesizes a title and description
- **Manual description** — you provide the title and description directly

## Step 1: Identify the input type

Look at what the user provided:

- **Slack URL** (contains `slack.com`): go to [Slack input](#slack-input)
- **PR URL or `#number`**: go to [PR input](#pr-input)
- **Nothing, or plain text**: go to [Manual input](#manual-input)

---

### Slack input

Fetch the thread using `mcp__slack__slack_read_api_call`. Extract the channel ID and thread timestamp from the URL (format: `slack.com/archives/CXXXXXXXX/pYYYYYYYYYYYYYY`).

Call `conversations.replies` with `channel` and `ts`. Read the messages to understand the doc request or issue being raised.

From the thread content, synthesize:

- A concise ticket **title** (one sentence, action-oriented)
- A **description** that summarizes the request, the context, and any relevant detail from the thread

Append to the description:

```
Slack thread: <original URL>
```

Then show the user the proposed title and description and ask: "Does this look right, or would you like to adjust anything before I create the ticket?"

---

### PR input

If the user gave a full PR URL, extract the org, repo, and PR number. If they gave only `#number`, ask which repo (or infer from context — default to `neondatabase/website`).

Run:

```bash
gh pr view <number> --repo <org>/<repo> --json title,body,author,files
```

From the PR content, synthesize:

- A ticket **title** describing the documentation work needed
- A **description** summarizing what changed in the PR and what docs work it requires

Append to the description:

```
PR: <URL>
```

Then show the user the proposed title and description and ask: "Does this look right, or would you like to adjust anything before I create the ticket?"

---

### Manual input

If the user hasn't provided a title and description, ask:

> "What's the title of the ticket? And a brief description of the work needed?"

Optionally also ask:

- A PR link (if this relates to a specific PR)
- A Slack thread link (if there's relevant context in Slack)

Build the description from what's provided, appending any links at the end:

```
<description>

PR: <url>
Slack thread: <url>
```

---

## Step 2: Get the current user's JIRA accountId

Call `mcp__jira__jira_read_api_call` with endpoint `myself`. Extract the `accountId` field.

If this call fails, report:

> "Could not reach the Databricks JIRA instance. This is an internal tool for Databricks employees — it requires the JIRA MCP configured in your Claude setup and an active Databricks JIRA session.
>
> If you're not a Databricks employee and want to report a docs issue or request a change, please open a GitHub issue instead: https://github.com/neondatabase/website/issues/new"

Then stop.

## Step 3: Create the issue

Call `mcp__jira__jira_write_api_call` with endpoint `issues.create`:

```json
{
  "project": "LKB",
  "issuetype": "Task",
  "summary": "<title>",
  "description": "<description>",
  "additional_fields": {
    "customfield_24178": [{ "id": "32637" }]
  }
}
```

**Fixed values — do not prompt the user for these:**

- Project: `LKB`
- Issue type: `Task`
- Team (`customfield_24178`): `[{"id": "32637"}]` (Docs: LKB PLG)
- Component: none

**Note:** Do not include `assignee` in the create call — the project default overrides it. Set it in step 4.

## Step 4: Assign to the current user

Call `mcp__jira__jira_write_api_call` with endpoint `issues.update`:

```json
{
  "issue_id": "<KEY from step 3>",
  "updates": {
    "assignee": { "accountId": "<accountId from step 2>" }
  }
}
```

## Step 5: Return the result

> "Created **LKB-XXXXX**: [title]
> https://databricks.atlassian.net/browse/LKB-XXXXX"
