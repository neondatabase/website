---
title: LangChain
subtitle: Build AI applications faster with LangChain and Neon serverless Postgres
enableTableOfContents: true
updatedOn: '2024-07-04T10:43:33.361Z'
---

LangChain is a popular framework for working with AI, Vectors, and embeddings. LangChain supports using Supabase as a vector store, using the pgvector extension.

## Initialize Postgres Vector Store

TODO - talk about how LangChain takes out the complexity of managing documents insertion and embeddings generation using vector stores

<CodeTabs labels={['JavaScript', 'Python']}>

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
```

```python
# TODO
```

</CodeTabs>

## Generate Embeddings with OpenAI

TODO - talk about how langchain takes care of embedding generation internally while adding the vectors to Postgres database, else the user can refer to https://js.langchain.com/v0.2/docs/integrations/text_embedding/openai#specifying-dimensions (in JS) and https://python.langchain.com/v0.2/docs/how_to/embed_text/#embed_query (in Python) for handling the embeddings on their own.

## Stream Chat Completions with OpenAI

TODO - talk about how LangChain can be used to find similar documents to the user latest query and then invoke the OpenAI API internally to power chat completion responses

<CodeTabs labels={['JavaScript', 'Python']}>

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

```python
# TODO
```

</CodeTabs>
