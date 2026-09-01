I want to build a secure LLM proxy using Neon Functions and the Neon AI Gateway.

Use this guide as a reference:
https://neon.com/guides/llm-proxy-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.

3. Ask me what I want to build, and whether I want to:
   - follow the example in the guide closely,
   - modify the example for a different use case, or
   - build a different proxy that uses the same Neon features.

4. Ask only the questions you need to understand my requirements. For example:
   - Which models or providers should the proxy route to?
   - Do I want per-user rate limiting backed by Postgres?
   - Do I want authentication with Managed Better Auth, and a React frontend?
   - Do I want to use the same framework and project structure as the guide?

5. Identify any accounts, API keys, tokens, environment variables, or other credentials I need before implementation.

   Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required provider or Better Auth settings.
   - Tell me where the credential should be stored in my project.
   - Never ask me to commit secrets to source control.

   If a credential is required, stop and ask me to provide/configure it before continuing rather than guessing or using a placeholder without explaining what I need to do.

6. Once you understand my requirements and I have the required credentials configured, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting.

7. Wait for my confirmation before making significant changes.

8. Implement the proxy step by step following the guide's patterns. Use the Neon CLI (`neon link`) and select **Functions** and **AI Gateway** as the services `neon.ts` declares, with the `aws-us-east-2` region since Neon Functions are only available there during beta. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -s neon-ai-gateway`. Build the backend first and verify it with `neon dev` and `curl` before starting the frontend. Route model calls through the Neon AI Gateway with `@neon/ai-sdk-provider`; never put provider API keys in the frontend.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
   - run the app locally,
   - deploy the function with `neon deploy`,
   - sign in and send a chat message,
   - and exceed the rate limit on purpose to see the `429`.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

Never print connection strings, JWTs, tokens, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
