I want to build a Slack bot backed by a data-analysis agent with Mastra tools, an Upstash Box sandbox, and Neon branching.

Use this guide as a reference:
https://neon.com/guides/mastra-tools-upstash-box-neon

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

3. Ask me what the agent should analyze and what data it should use. For example:
   - What question should the agent answer?
   - Which tables or schema should it see?
   - Does the agent need charts and written reports, or just a text answer?
   - Should the bot reply in Slack threads, expose an HTTP API, or both?

4. Ask only the questions you need to understand my requirements. Confirm which parts to reuse from the guide and which to adapt.

5. Once you understand my requirements, propose a concise implementation plan. List the credentials the plan actually needs, and explain which Python packages the sandbox should install.

6. Wait for my confirmation before making significant changes.

7. Implement it step by step following the guide's patterns:
   - Deploy as a Neon Function. Use `neon link` and select **Functions** as the service `neon.ts` declares.
   - Create the project in **AWS US East (Ohio)** (`aws-us-east-2`) or **AWS Europe (Frankfurt)** (`aws-eu-central-1`); Neon Functions are only available in these regions during beta.
   - Install the agent skills the guide lists: `neon skills -s neon -s neon-functions`.
   - Define the agent and its tools in Mastra. Put the box ID in the Mastra request context so each tool resolves the right box, and do not put the connection string or box ID in the model prompt.
   - Wrap Box operations in Mastra tools (`createTool`): run code with `box.exec.command`, and use `box.files.write`, `box.files.read`, and `box.files.list` for files. Keep tool output truncated before it reaches the model.
   - Create a Neon branch per session with `branches.createAndConnect`, set an `expires_at` backstop, inject the branch connection string into the box as `DATABASE_URL`, and delete both the box and the branch when the session ends.
   - Read artifacts (charts, reports) out of the box before deleting it; the box is gone after cleanup.
   - For the Slack bot: verify Slack signatures with the signing secret (`v0:timestamp:body`, HMAC-SHA256), answer `url_verification` challenges, acknowledge events within 3 seconds, and run the session with `waitUntil` from `@neon/functions`. Post the reply and upload the chart into the thread with `chat.postMessage` and the two-step file upload API.
   - Bound the agent run with `maxSteps`, and add a `beforeToolCall` policy if a shell tool is included.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Upstash, Anthropic, Slack, or Neon settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary. If the data agent does not need an agent harness inside the box, do not add one: Mastra owns the agent and Box is only compute. For Slack, use plain `fetch` calls to the Slack Web API instead of adding a Slack SDK.

10. After implementation, show me how to:
    - deploy with `neon deploy --env .env.local`,
    - create the Slack app with the correct manifest scopes and event subscription URL,
    - invite the bot to a channel and ask it a question,
    - and send a question with `POST /analyze` and read back the answer, report, and chart.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.

Never print API keys, tokens, connection strings, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
