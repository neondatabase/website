---
title: How to be AI-fancy
description: Improving our SQL editor with (you guessed it) AI features
excerpt: "Despite the fact that Postgres has been around for almost 30 years, Neon has always been an innovative company supporting experimental ideas. So, obviously, we couldn’t miss the AI fever. \U0001F642 We started our first experiments with AI a little more than a year ago, but only recently..."
date: '2024-11-04T16:48:02'
updatedOn: '2024-11-04T16:48:05'
category: product
categories:
  - product
authors:
  - eduard-dyckman
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/how-to-be-ai-fancy/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: How to be AI-fancy - Neon
  description: >-
    We've shipped some AI features that improve our SQL Editor, like SQL text
    generation, query name generation, and error fixing.
  keywords: []
  noindex: false
  ogTitle: How to be AI-fancy - Neon
  ogDescription: >-
    We've shipped some AI features that improve our SQL Editor, like SQL text
    generation, query name generation, and error fixing.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-be-ai-fancy/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/how-to-be-ai-fancy/how-to-be-ai-fancy-1-1024x576-6fffd498.jpg)

Despite the fact that Postgres has been around for almost 30 years, Neon has always been an innovative company supporting experimental ideas. So, obviously, we couldn’t miss the AI fever. 🙂

We started our first experiments with AI a little more than a year ago, but only recently have we focused on bringing AI-driven features into our product. Let’s take a look at them, and later discuss how we implemented them.

## AI features in our SQL editor

We are happy to bring you our first AI features that will empower the SQL playground experience. They work in tandem to assist with SQL writing.

### SQL generation

This has got to be the most exciting and complex feature. By pressing the ✨ button or using Cmd/Ctrl+Shift+M, can enter a natural language prompt describing the SQL you want to execute, and Neon will generate the query text for you. After that, you can change the generated query as you like or just execute it as is.

<video autoPlay loop controls width="1728" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/how-to-be-ai-fancy/ai-features-demo-48027ed6.mp4" />
</video>

If you are not sure whether the generated query is safe to run towards your actual database, you can simply [create a branch](https://neon.tech/docs/manage/branches#create-a-branch) and run it there. To make the generation sensible, we extract your database schema and pass it to the LLM along with the prompt. So, if you ask to find data that is not present in the database, you are expected to get a descriptive error response.

This feature heavily relies on LLM capabilities, so we tried multiple models (more about that in the next section), and none of them were perfect. So it’s possible that a generated query will not work exactly as you expect, that’s why, for now, we’ve stopped at the generation, and we leave the execution to users.

### Query name generation

A second feature: Now, the query history block will contain meaningful names for your queries. We take the executed query and generate a name for it by asking the LLM model to predict the best-fitting name.

![](https://cdn.neonapi.io/public/images/pages/blog/how-to-be-ai-fancy/ad4nxcqpcljbjch5g4zzvgex0uibllajxe25ytnlbyvljtc6j5wdjiaxvjmefwuzu6t01g4yez9z39nvy6rzasiueh-7zkc4xubd27s6gjlgl7rylakohk60-ubxgekuepnklofla0o2gem0pzno0eyqady-fcd1cb12.png)

### Error fixing

It’s common to make a typo or confuse some parts of your database when you write a complex query. Or maybe you have a wider park of different databases and don’t exactly remember all Postgres operators and functions. So, in some cases, the execution may result in an error.

![](https://cdn.neonapi.io/public/images/pages/blog/how-to-be-ai-fancy/ad4nxd-sqqbkbffnkrxpenyv-fym6ebwh2kwyqprdzwphplimxrabwbpgb6qywyyodki4s9sd2hdm9efm4kh8quakmams2jlrcbovctdztmgtx0un4015v7g-4q5myxjhqtjeoqczcoow0saz0nqbre4cnbw-e2952013.png)

Now, we provide a single button that will take your query and Postgres errors, pass it to the LLM and ask it to fix the query. After that, we will stream the fixed query into the editor box. This can work nicely along the SQL generation: if the generated SQL contains some errors, this step can potentially fix them. This feature also adds the database schema to the request context.

<video autoPlay loop controls width="1728" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/how-to-be-ai-fancy/irrelevant-query-d3e51824.mp4" />
</video>

## Why not an AI assistant?

For users that are already familiar with AI-driven features in similar products, it may seem unnatural that we didn’t choose the “AI assistant” path – this is, a sidebar with a chat where you can ask questions and get answers.

There are two main reasons for this decision:

1. **It’s complex to make it useful.** If you are chatting with an assistant bot, you expect it to understand your questions and the current context well. So, if you are asking about the current query, it should understand that and take it into consideration. If you are referencing some table, it should query the database scheme and use that information. To achieve this, the process ideally should be multi-stage: the first steps should help figure out the context, and the last steps would prompt actual results, with an optional follow-up to refine the answer. This is a lot of engineering effort.
2. **Tailored experience.** If we choose the path of an AI assistant we would have much less control over the user experience, basically it narrows down to a simple dialog and set of predefined actions. With our current solution, we provide actionable elements next to their respective contexts, which improves user comfort and boosts discoverability. Also, it’s much easier to do experiments or debugging this way.

## TIL building AI features – or what did I carry as a valuable experience

### Don’t make a guessing choice

If you’ve listened to some of [Uncle Bob’s rants](https://www.youtube.com/watch?v=O4iEr7bElUA), you may favor this idea: if you don’t know what to choose – don’t, until you do know. So, I didn’t know which model would perform best, so I chose a good old [strategy](https://refactoring.guru/design-patterns/strategy) pattern. It’s actually very simple and comfortable to implement in any language with interfaces, like typescript, go, java, etc. Here is how it looks in our typescript code:

```typescript
export interface AIPrompter {
  prompt(
    /*user prompt*/
    message: string,
    /*system prompt*/
    system: string,
  ): Promise<() => AsyncGenerator<string>>;
}
```

So, currently, our strategy code should implement a single prompt method, which can be provided by almost any model and provider. Based on certain conditions we could pick a concrete implementation of this interface like OpenAIGpt4o or AWSBedrockClaude3_5. After getting some working code to our production under a feature flag we would conduct several experiments with different providers.

For now, we’ve stopped on [Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet) by Anthropic. But we can easily swap it for some other AWS Bedrock or OpenAI-provided model.

### Infra for AI

There are several types of AI providers and options out there. The first two categories I want to touch are self-hosted and API providers.

It is no secret that hosting a decently performing model costs a lot. So, unless you expect a pretty significant traffic, it’s better to avoid this route. In my opinion, it starts to pay off on a pretty large scale.

Out of **API providers**, I highlight two groups:

- Cloud infrastructure integrated providers like AWS Bedrock, Azure AI Services, GCP AI and ML services.
- AI-specializing companies providers like OpenAI, Anthropic, Groq, Meta AI, etc.

If you are doing a smaller project or experiment, then going to direct AI providers would probably be the best option. Most of them are easy to set up, they have simple, convenient APIs, usage tracking and budget limiting.

If you are a bigger company or a cloud company and most parts of your system are already hosted in some cloud provider like AWS, Azure, GCP, etc., then consider using their solutions since they are better tied to your existing infrastructure and you can extend your existing infra to provide role access, budgeting, logging, usage tracking.

The biggest downside is that you are limited by whatever your cloud provider gives you. For example, you won’t be able to use GPT models in AWS Bedrock. Also, in our case, we need to share the user’s database schema with an AI provider, so we would need a separate user’s consent to do that unless we are using Bedrock, which resides in AWS, the same place we store the user data in.

### HTTP can stream

Most of the AI providers support streaming response. So, a question arises: how do you stream that response to a browser? With the arrival of WebSockets, it’s easy to forget, but the HTTP response can be streamed! So you don’t really need anything special to return a streaming response from your API.

Example in node js:

```typescript
async function performResponse(response: http.ServerResponse, aiStream: Stream) {
    response.writeHead(200);
    for await (const message of aiStream) {
        const { usage, choices } = message;
        const [choice] = choices;
        if (choice?.delta?.content) {
          response.write(choice.delta.content);
        }
    }
    response.end();
}
```

Now in the frontend code we can use Fetch API to receive the stream:

```typescript
const { body } = await fetch('/api/ai');
const reader = body.getReader();
while (true) {
    const chunk = await reader.read();
    if (chunk.value) {
        // ... do something with the streamed response
    }
    if (chunk.done) {
        break;
    }
}
```

## Wrap up

If you are a [Neon user](https://console.neon.tech/signup), I encourage you to try out these new features and [tell us](https://discord.com/channels/1176467419317940276/1176788564890112042) how they work for you!

If you are a developer, I hope these ideas can be useful for your own projects. You should definitely be enthusiastic about trying out LLMs to boost your product: it’s simple and cheap enough to experiment with.
