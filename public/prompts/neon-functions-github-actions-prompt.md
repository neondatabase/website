I want to set up CI/CD for Neon Functions using GitHub Actions.

Use this guide as a reference:
https://neon.com/guides/neon-functions-github-actions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Ask me what I want the pipeline to do, and whether I want to:
   - follow the example in the guide closely,
   - modify the example for a different use case, or
   - build a different CI/CD setup that uses the same Neon features.

3. Ask only the questions you need to understand my requirements. For example:
   - Should deployments run on merge to `main`, on pull requests, or both?
   - Do I want isolated preview functions on every pull request?
   - Which branch or branches should trigger production deploys?
   - Do I want to use the same framework and project structure as the guide?

4. Identify any accounts, API keys, tokens, environment variables, or other credentials I need before implementation.

   Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required GitHub or Neon settings, such as the Neon GitHub Integration.
   - Tell me where the credential should be stored in my project.
   - Never ask me to commit secrets to source control.

   If a credential is required, stop and ask me to provide/configure it before continuing rather than guessing or using a placeholder without explaining what I need to do.

5. Once you understand my requirements and I have the required credentials configured, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting.

6. Wait for my confirmation before making significant changes.

7. Implement the pipeline step by step following the guide's patterns. Use the Neon CLI (`neon link`) and select **Functions** as the service `neon.ts` declares, with the `aws-us-east-2` region since Neon Functions are only available there during beta. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -y`. Verify a manual `neon deploy` works with a `curl` against the returned function URL before writing the workflow. Ask me before pushing anything or creating pull requests so I can review the workflow file first.

8. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

9. After implementation, show me how to:
   - open a test pull request and confirm the preview function URL comment appears,
   - verify the preview endpoint responds,
   - and merge and confirm the production deployment runs.

10. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

Never print tokens, connection strings, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
