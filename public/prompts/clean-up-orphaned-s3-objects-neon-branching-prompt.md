I want to build and run an orphaned S3 object cleanup job using Neon Object Storage and Neon branches.

Use this guide as a reference:
https://neon.com/guides/clean-up-orphaned-s3-objects-neon-branching

Before writing code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon auth` and wait for me to complete sign-in before continuing.

3. Ask me what I want the cleanup job to do, and whether I want to:
   - follow the example in the guide closely,
   - modify the example for a different use case, or
   - build a different cleanup job that uses the same Neon Object Storage features.

4. Ask only the questions you need to understand my requirements. For example:
   - What objects and rows should count as orphaned?
   - Do I want a consistency checker, a vacuum job, or both?
   - Do I want to dry-run on a Neon branch before promoting to production?
   - Do I want to use the same framework and project structure as the guide?

5. Once you understand my requirements, propose a concise implementation plan. Explain which parts of the guide you are reusing and which parts you are adapting, and list the credentials the plan will actually need.

6. Wait for my confirmation before making significant changes.

7. Implement the job step by step following the guide's patterns. Use the Neon CLI (`neon init`, `neon link`) and select **Object Storage** as the service `neon.ts` declares, with the `aws-us-east-2` region since Neon Object Storage is only available there during beta. Install the agent skill the guide lists: `neon skills -s neon -s neon-object-storage -y`. Follow the guide's safety rules: delete the object first, then the row, and guard production runs against concurrent writes with an advisory lock.

8. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any Neon settings.
   - Tell me where the credential should be stored in my project.

9. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

10. After implementation, show me how to:
   - seed demo data with intentional orphans,
   - run the consistency checker,
   - dry-run the vacuum on a Neon branch using `neon branches create --name <name>` and `neon checkout <name>`,
   - and promote the verified vacuum to production only after I confirm the bucket and table were untouched.

11. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes.

Never print connection strings or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
