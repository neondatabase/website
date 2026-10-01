I want to build a Slack bot backed by a data-analysis agent with Mastra, an Upstash Box sandbox, and Neon branching.

Use this guide as a reference:
https://neon.com/guides/mastra-upstash-box-neon

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

3. Ask me what I want the agent to analyze, and whether I want to:
   - follow the Slack data-analyst example in the guide closely,
   - modify the example for a different use case, or
   - build a different agent that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - What questions should the agent answer, and which tables or schema should it see?
   - Does the agent need charts and written reports, or just a text answer?
   - Should the bot reply in Slack threads, expose an HTTP API, or both?
   - Do I want to use the same framework and project structure as the guide?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, list the credentials the plan will actually need, and name the Python packages the sandbox snapshot should install.

6. Wait for my confirmation before making significant changes.

7. Implement the agent step by step following the guide's patterns. Use `neon link` and select **Functions** and **AI Gateway** as the services `neon.ts` declares, with the `aws-us-east-2` or `aws-eu-central-1` region since Neon Functions are only available there during beta. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -s neon-ai-gateway -y`. Wrap Box operations in Mastra tools with `createTool`, put the box ID in the Mastra request context rather than the model prompt, create a Neon branch per session with `branches.createAndConnect` and an `expires_at` backstop, and delete both the box and the branch when the session ends. Read artifacts out of the box before deleting it.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Upstash, Slack, or Neon settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary. Mastra owns the agent and Box is only compute, so don't add an agent harness inside the box. For Slack, use the Chat SDK adapter as the guide does instead of a raw Slack SDK.

10. After implementation, show me how to:
    - prepare the box snapshot and deploy with `neon deploy --env .env.local`,
    - create the Slack app with the correct manifest scopes and event subscription URL,
    - and invite the bot to a channel and ask it a question.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.

Never print API keys, tokens, connection strings, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
