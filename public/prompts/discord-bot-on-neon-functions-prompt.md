I want to build a Discord bot using Neon Functions and the Neon AI Gateway.

Use this guide as a reference:
https://neon.com/guides/discord-bot-on-neon-functions

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Ask me what I want the bot to do, and whether I want to:
   - follow the example in the guide closely,
   - modify the example for a different use case, or
   - build a different Discord bot that uses the same Neon features.

3. Ask only the questions you need to understand my requirements. For example:
   - What commands or interactions should the bot support?
   - Do I want AI chat, image generation, or both?
   - Do I need to store anything in Neon Postgres?
   - Do I want to use the same framework and project structure as the guide?

4. Identify any accounts, API keys, tokens, environment variables, or other credentials I need before implementation.

   Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required Discord settings, permissions, or configuration.
   - Tell me where the credential should be stored in my project.
   - Never ask me to commit secrets to source control.

   If a credential is required, stop and ask me to provide/configure it before continuing rather than guessing or using a placeholder without explaining what I need to do.

5. Once you understand my requirements and I have the required credentials configured, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting.

6. Wait for my confirmation before making significant changes.

7. Implement the bot step by step using Neon Functions and the Neon AI Gateway where appropriate. Follow the patterns from the guide, but adapt them to my requirements rather than copying the example blindly.

8. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

9. After implementation, show me how to:
   - run the bot locally,
   - deploy the Neon Function,
   - configure any required Discord settings,
   - and test the bot end to end.

10. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.