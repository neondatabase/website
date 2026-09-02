I want to build durable background workflows with Inngest using Neon Functions.

Use this guide as a reference:
https://neon.com/guides/durable-workflow-on-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.

3. Ask me what I want the workflow to do, and whether I want to:
   - follow the lead-capture example in the guide closely,
   - modify the example for a different use case, or
   - build a different durable workflow that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - What events should trigger the workflow?
   - What steps, delays, or retries does it need?
   - Do I want AI steps through the Neon AI Gateway?
   - Do I want to use the same framework and project structure as the guide?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the workflow step by step following the guide's patterns. Use the Neon CLI (`neon init`, `neon link`) and select **Functions** and **AI Gateway** as the services `neon.ts` declares, with the `aws-us-east-2` region since Neon Functions are only available there during beta. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -s neon-ai-gateway -y`. Wrap every discrete task in `step.run` and use `step.sleep` for delays so Inngest can checkpoint and retry at the step level. Create tables as a separate migration or `neon psql` step; `neon deploy` provisions services, not schema.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Inngest settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
   - run the workflow locally with the Neon Functions dev server and the Inngest Dev Server,
   - send a test event and verify each step completes and the rows transition in Postgres with `neon psql`,
   - deploy with `neon deploy`,
   - and connect to Inngest Cloud.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

Never print connection strings or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
