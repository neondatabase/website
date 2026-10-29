---
title: Build full-stack apps in minutes with Anything
subtitle: Go from a text prompt to a full-stack, database-backed app in minutes with Anything
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-03-12T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

AI-powered tools let even non-technical users describe an app in a conversation and get a working version, database included, in seconds. One of these tools is [Anything](https://www.createanything.com) (formerly [Create](https://create.xyz)), a text-to-app builder with built-in support for 50+ integrations such as Stripe, ElevenLabs, Google Maps, Stable Diffusion, OpenAI, and more.

This guide introduces Anything and shows how to use it to build database-backed apps. You'll build a simple AI image generator, going from a text prompt to a working full-stack app.

## Anything & Neon

Anything uses Neon as the database backend for its AI app builder. Each app gets a fully managed Postgres database, so Anything users can focus on their app's functionality and design instead of database setup.

You'll see this during app creation: Neon provisions the database instantly, and it runs in the background without any setup on your part. To learn more about how Anything uses Neon, see [From Idea to Full Stack App in One Conversation with Anything](/blog/from-idea-to-full-stack-app-in-one-conversation-with-create).

## Prerequisites

Before you start, ensure you have an **Anything Account**. You can sign up for a free account at [createanything.com](https://createanything.com/). The free plan is sufficient to follow this guide.

## Build an AI image generator app

This app will allow users to generate images using Stable Diffusion, view them in a gallery, and track download counts for each image. You'll build it in minutes without writing code.

### Start a new project

1. Navigate to the [Anything](https://createanything.com) website and log in to your account.
2. Click on "New Project" to begin. You'll be presented with the builder interface.

   ![Start a New Project](/docs/guides/create_xyz_new_project.png)

### Describe your app

In the chat window, describe your app idea. For example, you can say, "Create a Stable Diffusion powered image generator. Ensure that image generation history is saved in a database, allowing users to view their past generations."

![Describe Your App](/docs/guides/create_xyz_describe_app.png)

Anything starts building your app from your description. You'll see the AI agent working in real time in the chat window, assembling the components and code for your app.

![Creating Your App](/docs/guides/create_xyz_initial_app.png)

As requested, Anything created a database for image generation history.

You can verify the app's functionality by generating an image. Type an image description in the text field and click 'Generate.' The new image appears and is added to the gallery.

![Testing the App](/docs/guides/create_xyz_test_app_working.png)

<Admonition type="note">
If the app doesn't work as expected, provide specific details in the chat window to help Anything understand the issue. For example, you can say, "The image generation is working, but the gallery is not displaying the images."
</Admonition>

### Database schema

You can review your app's database schema from the Anything Dashboard at any point. Go to the **"Databases"** tab, then select your project's database to explore its schema, tables, columns, and relationships.

![Database Schema](/docs/guides/create_xyz_database_schema.png)

### Iterate on your app

To add new features or refine existing ones, describe the change in the chat. Let's add a download counter feature to track the number of downloads for each generated image.

In the chat window, you can say: "Allow users to download images and track the number of downloads for each image". Anything will start adding the necessary components to your app to support this feature.

![Adding a New Feature](/docs/guides/create_xyz_add_new_feature.png)

You can view the database schema to understand how the new download count feature is integrated. Anything might have added a new table or column to track downloads.

To test the new feature, download an image. Click the 'Download' button on any image in the gallery. You'll see the download count increase for that image.

![Final App with Download Feature](/docs/guides/create_xyz_final_app.png)

You've built an AI image generator with download tracking. You can customize it further by improving the UI, adding features like user authentication, or integrating services such as Stripe to charge $1 per generated image. To add user authentication, say something like: 'The app should allow users to sign in and sign up. Image generation should only be available to signed-in users.'

Anything will add the necessary components to your app to support user authentication.

![Adding User Authentication](/docs/guides/create_xyz_add_user_auth.png)

<Admonition type="note" title="Configure authentication providers for user accounts">
User accounts are built into Anything. To let users sign in with Google, Facebook, or other providers, go to the **Auth Providers** section in your project's Project Settings and enable additional sign-in options. Learn more in the [Anything Docs: User Accounts](https://www.createanything.com/docs/builder/user-accounts).

![User Accounts](/docs/guides/create_xyz_user_accounts.png)
</Admonition>

Your app should now require users to sign in before generating images. You can test this by trying to generate an image without being signed in.

![Testing User Authentication](/docs/guides/create_xyz_test_user_auth.png)

Finally, you can deploy the app by clicking on the "Publish" button. You can also publish your app to the Apple iOS Store (mobile app support is currently in beta.) For more details, see the [Anything Docs: Mobile Apps](https://www.createanything.com/docs/builder/mobile).

![Publishing the App](/docs/guides/create_xyz_publish_app.png)

<Admonition type="note" title="Version history for restoring a past version of your app">

Anything keeps a version history, so you can restore any past version of your app.

To restore a past version:

1. **Browse Version History:** Click on the down arrow next to the "Anything" logo in the top left corner.

   ![Restore Past Version](/docs/guides/create_xyz_restore_project.png)

2. **Restore:** Click on the desired version from the list to restore it.

Anything instantly switches your app back to that earlier state.
</Admonition>

## Tips for building apps with Anything

- **Prompting best practices**:
  - **Give context**: Start prompts with clear context, such as the app's purpose and main features. For example, "I want to add a new feature to allow users to download images."
  - **Iterate in small steps**: Break down complex changes. For a whole new page, start by describing the header, then the body, then the footer in separate prompts. This gives you more control.
  - **Show, don't just tell**: Use images. Paste screenshots or drag and drop images into the chat to show Anything exactly what you want the style or layout to be wherever possible.
  - **Pinpoint errors**: Be specific when things go wrong. Instead of saying "it's broken", paste error messages or describe exactly what you expected to happen vs. what did happen.

- **Use Anything's integrations**:
  - **Explore the integration library**: Anything has many integrations ready to use. Type `/` in the chat to see them. Integrations include AI models, UI libraries, and services like Stripe.
  - **Choose the right AI model**: Experiment with different AI models for different tasks. For example, use Stable Diffusion for image generation, OpenAI or Claude for text generation.

## Resources

- [Anything](https://createanything.com)
- [Anything docs](https://www.createanything.com/docs/welcome)
- [From Idea to Full Stack App in One Conversation with Anything](/blog/from-idea-to-full-stack-app-in-one-conversation-with-create)
- [Anything templates](https://www.createanything.com/templates)

<NeedHelp />
