---
title: LangChain
subtitle: Build AI applications faster with LangChain and Postgres
enableTableOfContents: true
updatedOn: '2024-12-11T08:48:36.316Z'
---

LangChain is a popular framework for working with AI, Vectors, and embeddings. LangChain supports using Neon as a vector store, using the `pgvector` extension.

## Initialize Postgres Vector Store

LangChain simplifies the complexity of managing document insertion and embeddings generation using vector stores by providing streamlined methods for these tasks.

Here's how you can initialize Postgres Vector with LangChain:

```tsx
// File: vectorStore.ts

import { NeonPostgres } from '@langchain/community/vectorstores/neon';
import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  dimensions: 512,
  model: 'text-embedding-3-small',
});

export async function loadVectorStore() {
  return await NeonPostgres.initialize(embeddings, {
    connectionString: process.env.POSTGRES_URL as string,
  });
}

// Use in your code (say, in API routes)
const vectorStore = await loadVectorStore();
```

## Generate Embeddings with OpenAI

LangChain handles embedding generation internally while adding vectors to the Postgres database, simplifying the process for users. For more detailed control over embeddings, refer to the respective [JavaScript](https://js.langchain.com/v0.2/docs/integrations/text_embedding/openai#specifying-dimensions) and [Python](https://python.langchain.com/v0.2/docs/how_to/embed_text/#embed_query) documentation.

## Stream Chat Completions with OpenAI

LangChain can find similar documents to the user's latest query and invoke the OpenAI API to power [chat completion](https://platform.openai.com/docs/guides/text-generation/chat-completions-api) responses, providing a seamless integration for creating dynamic interactions.

Here's how you can power chat completions in an API route:

```tsx
import { loadVectorStore } from './vectorStore';

import { pull } from 'langchain/hub';
import { ChatOpenAI } from '@langchain/openai';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import type { ChatPromptTemplate } from '@langchain/core/prompts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

const topK = 3;

export async function POST(request: Request) {
  const llm = new ChatOpenAI();
  const encoder = new TextEncoder();
  const vectorStore = await loadVectorStore();
  const { messages = [] } = await request.json();
  const userMessages = messages.filter((i) => i.role === 'user');
  const input = userMessages[userMessages.length - 1].content;
  const retrievalQAChatPrompt = await pull<ChatPromptTemplate>('langchain-ai/retrieval-qa-chat');
  const retriever = vectorStore.asRetriever({ k: topK, searchType: 'similarity' });
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt: retrievalQAChatPrompt,
  });
  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });
  const customReadable = new ReadableStream({
    async start(controller) {
      const stream = await retrievalChain.stream({
        input,
        chat_history: messages.map((i) =>
          i.role === 'user' ? new HumanMessage(i.content) : new AIMessage(i.content)
        ),
      });
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.answer));
      }
      controller.close();
    },
  });
  return new Response(customReadable, {
    headers: {
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
```

## Starter apps

Hackable, fully-featured, pre-built [starter apps](https://github.com/neondatabase/examples/tree/main/ai/llamaindex) to get you up and running with LlamaIndex and Postgres.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/chatbot-nextjs" description="A Next.js AI chatbot starter app built with OpenAI and LangChain" icon="github">AI chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/rag-nextjs" description="A Next.js RAG chatbot starter app built with OpenAI and LangChain" icon="github">RAG chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/semantic-search-nextjs" description="A Next.js Semantic Search chatbot starter app built with OpenAI and LangChain" icon="github">Semantic search chatbot (OpenAI + LangChain)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/langchain/chat-with-pdf-nextjs" description="A Next.js Chat with PDF chatbot starter app built with OpenAI and LangChain" icon="github">Chat with PDF (OpenAI + LangChain)</a>

</DetailIconCards>
