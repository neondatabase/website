---
title: LlamaIndex
subtitle: Build AI applications faster with LlamaIndex and Postgres
enableTableOfContents: true
updatedOn: '2024-07-15T14:10:09.616Z'
---

LlamaIndex is a popular framework for working with AI, Vectors, and embeddings. LlamaIndex supports using Neon as a vector store, using the `pgvector` extension.

## Initialize Postgres Vector Store

LlamaIndex simplifies the complexity of managing document insertion and embeddings generation using vector stores by providing streamlined methods for these tasks.

Here's how you can initialize Postgres Vector with LlamaIndex:

```tsx
// File: vectorStore.ts

import { OpenAIEmbedding, Settings } from 'llamaindex';
import { PGVectorStore } from 'llamaindex/storage/vectorStore/PGVectorStore';

Settings.embedModel = new OpenAIEmbedding({
  dimensions: 512,
  model: 'text-embedding-3-small',
});

const vectorStore = new PGVectorStore({
  dimensions: 512,
  connectionString: process.env.POSTGRES_URL,
});

export default vectorStore;

// Use in your code (say, in API routes)
const index = await VectorStoreIndex.fromVectorStore(vectorStore);
```

## Generate Embeddings with OpenAI

LlamaIndex handles embedding generation internally while adding vectors to the Postgres database, simplifying the process for users. For more detailed control over embeddings, refer to the respective [JavaScript](https://ts.llamaindex.ai/modules/embeddings/available_embeddings/openai) and [Python](https://docs.llamaindex.ai/en/stable/examples/embeddings/OpenAI) documentation.

## Stream Chat Completions with OpenAI

LlamaIndex can find similar documents to the user's latest query and invoke the OpenAI API to power [chat completion](https://platform.openai.com/docs/guides/text-generation/chat-completions-api) responses, providing a seamless integration for creating dynamic interactions.

Here's how you can power chat completions in an API route:

```tsx
import vectorStore from './vectorStore';

import { ContextChatEngine, VectorStoreIndex } from 'llamaindex';

interface Message {
  role: 'user' | 'assistant' | 'system' | 'memory';
  content: string;
}

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { messages = [] } = (await request.json()) as { messages: Message[] };
  const userMessages = messages.filter((i) => i.role === 'user');
  const query = userMessages[userMessages.length - 1].content;
  const index = await VectorStoreIndex.fromVectorStore(vectorStore);
  const retriever = index.asRetriever();
  const chatEngine = new ContextChatEngine({ retriever });
  const customReadable = new ReadableStream({
    async start(controller) {
      const stream = await chatEngine.chat({ message: query, chatHistory: messages, stream: true });
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.response));
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

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/chatbot-nextjs" description="A Next.js AI chatbot starter app built with OpenAI and LlamaIndex" icon="github">AI chatbot (OpenAI + LllamIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/rag-nextjs" description="A Next.js RAG chatbot starter app built with OpenAI and LlamaIndex" icon="github">RAG chatbot (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/semantic-search-nextjs" description="A Next.js Semantic Search chatbot starter app built with OpenAI and LlamaIndex" icon="github">Semantic search chatbot (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/reverse-image-search-nextjs" description="A Next.js Reverse Image Search Engine starter app built with OpenAI and LlamaIndex" icon="github">Reverse image search (OpenAI + LlamaIndex)</a>

<a href="https://github.com/neondatabase/examples/tree/main/ai/llamaindex/chat-with-pdf-nextjs" description="A Next.js Chat with PDF chatbot starter app built with OpenAI and LlamaIndex" icon="github">Chat with PDF (OpenAI + LlamaIndex)</a>

</DetailIconCards>
