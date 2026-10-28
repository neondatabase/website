I want to build a content moderation pipeline with Jev, using the TypeSafe SDK through the Neon AI Gateway.

Use this guide as a reference:
https://neon.com/guides/jev-content-moderation

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

3. Install the agent skills required by the guide: `neon skills -s neon -s neon-ai-gateway -y`. If I want help writing the Jev questions and thresholds, also install the TypeSafe skill: `npx skills add typesafe-ai/skills --skill typesafe-ai`.

4. Ask me what I want to moderate, and whether I want to:
   - follow the example in the guide closely,
   - adapt the same questions and thresholds to my content, or
   - build a different pipeline that uses Jev through the AI Gateway.

5. Ask only the questions you need to understand my requirements. For example:
   - What content am I moderating (comments, chat messages, reviews, form submissions)?
   - Which categories and hazards matter for my product, and what are the thresholds for allow, review, and block?
   - Do I want a severity score, or only label and probability checks?
   - Do I want to store the decisions for an audit trail, and in what database?

6. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

7. Wait for my confirmation before making significant changes.

8. Implement the pipeline step by step following the guide's patterns. Note that the guide's project and credential steps describe doing this in the Neon Console; use the equivalent Neon CLI path instead, without its interactive pickers. To create and link a new project with the AI Gateway enabled, run `neon init -y --no-agent-setup --services ai-gateway --org-id <org-id> --project-name <name> --region-id aws-us-east-2`. It also writes a `neon.ts` that declares the services. To reuse an existing project in a supported region, pass `--project-id <id>` instead of the org, name, and region flags. `aws-us-east-2` is one of the regions where the AI Gateway is available. For the credential, run `neon credentials create --scope ai_gateway:invoke` and pull the env vars with `neon env pull --service ai-gateway`.  Point the TypeSafe SDK at the branch's gateway with your Neon credential, and always set `defaultModel` to the gateway's Jev model ID. Keep the questions and the thresholds as named constants in one place so they are easy to review and change.

9. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it.
   - Tell me where the credential should be stored in my project.

10. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

11. After implementation, show me how to run the pipeline against a sample batch and how to read the decisions it prints.

12. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

The questions and the threshold constants are the parts that need the most human review. Agents are not good at writing Jev questions, so propose them, explain your reasoning, and expect to edit them collaboratively with me rather than treating them as final.

Never print connection strings, tokens, API keys, or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
