I want to monitor Neon Functions with Sentry and the Neon AI Gateway.

Use this guide as a reference:
https://neon.com/guides/sentry-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.

3. Ask me what I want to monitor, and whether I want to:
   - follow the example in the guide closely,
   - modify the example for a different use case, or
   - build a different monitoring setup that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - Which Sentry signals do I want to capture: errors, structured logs, traces, or all three?
   - Do I want the streaming tool-calling AI agent from the guide?
   - Do I have an existing Sentry organization or project?
   - Do I want to use the same framework and project structure as the guide?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the setup step by step following the guide's patterns. Create the Sentry project first (Node.js platform). Use the Neon CLI (`neon init`, `neon link`) and select **Functions** as the service `neon.ts` declares, with the `aws-us-east-2` region since Neon Functions are only available there during beta. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -s neon-ai-gateway -y`. Initialize Sentry once at module load before the handler serves requests, and flush buffered telemetry before each request ends, since Neon Functions can suspend an idle process at any moment.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Sentry settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
   - trigger the throwing route to confirm the error lands in Sentry,
   - trigger a recoverable failure to confirm structured logs,
   - run a normal request to confirm the trace,
   - and exercise the AI agent route to see tool spans and token usage.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.

Show me where to find each signal in the Sentry UI. Never print DSNs, tokens, connection strings, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
