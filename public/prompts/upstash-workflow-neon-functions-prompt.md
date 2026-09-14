I want to build durable multi-step workflows with Upstash Workflow on Neon Functions.

Use this guide as a reference:
https://neon.com/guides/upstash-workflow-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

3. Ask me what I want the workflow to do, and whether I want to:
   - follow the subscriber onboarding example in the guide closely,
   - modify the example for a different use case, or
   - build a different multi-step workflow that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - What should trigger the workflow, and what steps does it run?
   - Does it need a durable wait, timers, or retries between steps?
   - Do I want AI steps through the Neon AI Gateway?
   - Do I want to use the same framework and project structure as the guide?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the workflow step by step following the guide's patterns. Use the Neon CLI (`neon init`, `neon link`) and select **Functions** and **AI Gateway** as the services `neon.ts` declares, with the `aws-us-east-2` or `aws-eu-central-1` region since Neon Functions are only available in these regions during beta. Wrap every discrete task in `context.run` and use `context.sleep` for delays so QStash can checkpoint and retry at the step level. Return each step's result so later steps can reuse it; never rely on variables assigned inside a step, and don't call `Date.now()` or `Math.random()` outside steps. Create tables as a separate migration or `neon psql` step; `neon deploy` provisions services, not schema. Remember the double deploy: after the first `neon deploy`, `NEON_FUNCTION_WORKFLOW_BASE_URL` lands in `.env.local`, and you must deploy a second time so the running function receives it.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Upstash settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
    - run the workflow locally with the QStash dev server (`npx @upstash/qstash-cli dev`) and the Neon Functions dev server (`neon dev`),
    - trigger a run against the trigger route
    - verify the rows transition in Postgres with `neon psql`,
    - deploy with `neon deploy` (twice, so the function receives `NEON_FUNCTION_WORKFLOW_BASE_URL`),
    - and make a step fail on purpose to watch the retry and the run land in the Dead Letter Queue.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.

Never print connection strings, QStash tokens, signing keys, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
