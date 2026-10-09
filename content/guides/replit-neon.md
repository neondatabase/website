---
title: Building AI-powered applications with Replit Agent
subtitle: A guide to building AI applications with Replit Agent
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-03-15T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

[Replit Agent](https://docs.replit.com/replitai/agent) is an AI tool in [Replit](https://replit.com) that builds applications from a natural-language description. It's useful for people new to coding and for quickly testing app ideas.

Replit Agent works with Replit's online IDE, hosting, and package management. It handles database setup, code generation, and deployment, so you can focus on describing your app's features. This guide covers the basics of Replit Agent by building an AI-powered multiple-choice question (MCQ) quiz generator from PDF documents.

## Prerequisites

Before you start, make sure you have the following:

- **Replit Core or Teams subscription:** Access to Replit Agent requires a paid subscription to either Replit Core or Replit Teams for full access including deployments. Sign up at [replit.com/pricing](https://replit.com/pricing).
- **OpenAI API key:** This guide uses OpenAI's `gpt-4o-mini` model for MCQ generation. Sign up for an OpenAI API key at [platform.openai.com](https://platform.openai.com/account/api-keys).

## Building an AI MCQ quiz generator app from PDF documents

This app allows users to create MCQ quizzes from uploaded PDF documents. Users can upload PDFs, and the app will generate the questions based on the content using OpenAI's `gpt-4o-mini` model. The generated MCQs will be stored in a database, and users can share a unique link to access the quiz. You'll use Replit Agent to build this app without writing code yourself.

You can also follow along with the video below to see the step-by-step process:

<video autoPlay playsInline muted loop width="800" height="600" controls>
  <source type="video/mp4" src="/videos/pages/doc/replit-agent.mp4"/>
</video>

### Create an app with Replit Agent

1.  Navigate to [replit.com](https://replit.com) and log into your Replit account, ensuring you are under a Core or Teams subscription.
2.  Click on [Create App](https://replit.com/new) to begin. You'll be presented with the chat interface for Replit Agent.

    ![Replit Agent Create App](/docs/guides/replit-agent-create-new-app.png)

### Describe your app

In the chat interface, describe your app idea to Replit Agent in as much detail as possible. For example, you can say:

```text shouldWrap
Create an AI application that generates multiple-choice questions (MCQs) from uploaded PDFs for students to prepare for exams, using OpenAI's `gpt-4o-mini` model. It should have the following features:

- Ability to upload PDF documents.
- Generation of multiple-choice questions (MCQs) using OpenAI's `gpt-4o-mini` model.
- MCQs directly based on the content of the uploaded PDF.
- Functionality to create and share a link to the generated MCQs
```

Click "Start Building" to initiate the app creation process.

### Review and approve the agent generated plan

Replit Agent will present a development plan, outlining the proposed architecture and features for your application. Review the plan, which lists the technologies, features, and implementation steps.

Click "Approve Plan & Start" to authorize Replit Agent to proceed with the application build process based on the outlined plan.

### Watch Replit Agent in action

Replit Agent now generates the application code, creating files in the project explorer and writing code in the editor in real time. It handles both frontend and backend code.

<Admonition type="note" title="Iterating with Replit Agent">
Developing applications with AI agents is iterative, and you should expect some unexpected behavior along the way. When issues occur, **refer to the video above for an example of iterative debugging.** Describe the specific problem to Replit Agent: what you observed, what you intended, and any error messages. Replit Agent then suggests code changes to fix it.
</Admonition>

### Run the generated application

When the initial code generation finishes, Replit Agent launches your application in the Replit webview so you can try the MCQ generator.

### Debugging and iterative refinement with Replit Agent

Replit Agent can also help you debug. As the video shows, errors are a normal part of development, and Agent can help diagnose and fix them.

Should you encounter an error, **carefully examine the error message** displayed in the Replit webview or the console. **Copy the full error message and paste it directly into the Replit Agent chat window.**

Replit Agent reads the error, looks for the root cause, and proposes code changes. In this example, Agent identified and fixed a `pdf.js` library error.

![Replit Agent PDF.js error](/docs/guides/replit-agent-pdfjs-error.png)

Review the Agent's proposed solution and watch as it implements the necessary code modifications. Expect to repeat this debug-and-refine loop a few times as you build.

### Add OpenAI API key

To enable the AI-powered MCQ generation, you must integrate your OpenAI API key into the generated application. Replit Agent will prompt you to add this key to integrate with OpenAI's `gpt-4o-mini` model.

![Replit Agent OpenAI API key prompt](/docs/guides/replit-agent-openai-key.png)

### Validate MCQ generation functionality

With the OpenAI API key integrated, test the core application feature: generating MCQs from uploaded PDF documents. Upload a sample PDF file to the application and observe the MCQ generation process.

![Replit Agent Test app](/docs/guides/replit-agent-test-app.png)

### Review, verify, and share generated MCQs

Check the generated MCQs for relevance and accuracy against the source PDF. Test the generated shareable link by opening it in a new browser session. This link should direct users to the generated MCQs, enabling them to review and attempt the quiz.

![Replit Agent Share Quiz](/docs/guides/replit-agent-share-quiz.png)

### Database integration

If you review the generated code, you'll see that Replit Agent defaulted to an in-memory database. You can confirm this by asking the Agent about data storage. In-memory storage is fine for initial development, but production applications need persistent data. Ask Replit Agent to switch your application's data layer to Replit's managed Postgres database, which runs on Neon. Replit Agent updates the application code to use it.

![Replit Agent Database Integration](/docs/guides/replit-agent-create-database.png)

### Deploying your application to production

After iteratively refining and testing your AI MCQ Generator application, you're ready to deploy it to a production environment. Replit hosts your application online in a few clicks.

1.  Click the "Deploy" button situated in the top-right corner of the Replit IDE.
2.  Review and adjust [deployment settings](https://youtu.be/sXP5d0k1atk) as needed. For simple applications, default settings are typically sufficient.
3.  Confirm deployment initiation by clicking "Deploy" again.

    ![Replit Agent Deploy App](/docs/guides/replit-agent-deploy-app.png)

Replit manages the deployment process, making your application publicly accessible via a unique `.replit.app` URL. This URL can be found in the "Deployments" tab within your Replit project. You can also add a [custom domain](https://docs.replit.com/cloud-services/deployments/custom-domains) to your application.

![Replit Agent Final App](/docs/guides/replit-agent-final-app.png)

Your AI MCQ Generator application should now be live and accessible to users. Share the deployment link with others to show what you built with Replit Agent.

## Best practices for building applications with Replit Agent

A few practices help when building with Replit Agent:

- **Prompt engineering:**
  - **Improve Prompt**: Use the "Improve Prompt" feature in Replit Agent to refine the prompt and add context, so Replit Agent generates code closer to your requirements.
    ![Replit Agent Improve Prompt](/docs/guides/replit-agent-improve-prompt.png)
  - **Contextual prompts:** Start prompts with clear, complete context. For example, "Modify the MCQ display to show one question at a time."
  - **Incremental iteration:** Break complex features into smaller, incremental prompts. For instance, when developing a multi-step form, address each form section sequentially.
  - **Specific feedback:** When encountering issues, provide precise and detailed feedback to Replit Agent. Include error messages, expected vs. actual behavior, and relevant context.

- **Using Replit platform features:**
  - **Secrets management:** Use Replit Secrets for storing API keys, database credentials, and other sensitive information.
  - **Deployment**: Use Replit's built-in deployment features to host your applications online without managing servers yourself.

## Resources

- [Replit](https://replit.com)
- [Replit Agent docs](https://docs.replit.com/replitai/agent)
- [Introducing Replit Assistant](https://youtu.be/fxiVDlylORQ)
- [Replit Deployments: Choosing the Right Deployment Type](https://youtu.be/sXP5d0k1atk)
- [Bringing Postgres to Replit with Neon](/blog/neon-replit-integration)

<NeedHelp />
