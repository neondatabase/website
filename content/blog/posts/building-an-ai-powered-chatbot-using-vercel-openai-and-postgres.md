---
title: 'Building an AI-powered ChatBot using Vercel, OpenAI, and Postgres'
description: A step-by-step guide with optimization techniques.
excerpt: >-
  ChatGPT has demonstrated how powerful and attractive large language models
  are. OpenAI API allows you to use word embeddings to tailor a ChatGPT-like app
  for your business. This article covers the following: To illustrate how to
  build an app that uses pgvector and the OpenAI API,...
date: '2023-03-09T18:18:37'
updatedOn: '2025-10-14T06:23:03'
category: product
categories:
  - product
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Building an AI-powered ChatBot using Vercel, OpenAI, and Postgres - Neon'
  description: A step-by-step guide with optimization techniques.
  keywords: []
  noindex: false
  ogTitle: 'Building an AI-powered ChatBot using Vercel, OpenAI, and Postgres - Neon'
  ogDescription: >-
    ChatGPT has demonstrated how powerful and attractive large language models
    are. OpenAI API allows you to use word embeddings to tailor a ChatGPT-like
    app for your business. This article covers the following: To illustrate how
    to build an app that uses pgvector and the OpenAI API, we created Ask Neon,
    a ChatGPT-like app that answers […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres/social.png
---

ChatGPT has demonstrated how powerful and attractive large language models are. OpenAI API allows you to use word embeddings to tailor a ChatGPT-like app for your business. This article covers the following:

1. What word embeddings are
2. Why embeddings are useful
3. How the `pgvector` Postgres extension is used to store word embeddings and perform similarity analysis
4. How to create an API for a chatbot app using Neon, OpenAI, and Vercel Edge Functions
5. How to perfect the model by fine-tuning

To illustrate how to build an app that uses `pgvector` and the OpenAI API, we created _Ask Neon_, a ChatGPT-like app that answers Postgres and Neon questions.

<video autoPlay loop width="2564" height="1470">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres/screen-recording-2023-03-01-at-175811-1ba2a1a3.mov" />
</video>

You can ask the app questions such as “How to create a branch with the API” and it returns the following:

_“You can create a branch with the Neon API by using the POST /projects/\{project_id\}/branches method. You must specify the project_id for the Neon project, and you can specify the parent_id of the branch you are branching from. You can also include an endpoints attribute to create a compute endpoint, which is required to connect to the branch.”_

Using a prompt can save time researching the answer in the documentation. However, although impressive, the model could be better. That’s why, in some cases, the models require fine-tuning to answer the questions more accurately (which we will cover at the end of the article).

You can test the [app](https://ask-neon.vercel.app/) and follow the instructions on the [GitHub repository](https://github.com/neondatabase/postgres-qa) to deploy your own.

We built the app using Neon, NextJS, Vercel Edge Functions, and OpenAI API. Below is the overall architecture:

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres/architecture-11093b1b.png)

The app does the following:

1. **Sends a POST request with the `question`** (step 1)
2. **Creates the question embedding** using OpenAI API create embeddings method (steps 2 and 3)
3. **Gets context** by calculating the cosine distances between the question embedding and the embeddings stored in Neon (steps 4 and 5)
4. **Creates text completion** and answers the `question` using the `context` with the OpenAI completion method (steps 6, 7, and 8.)

This article describes the above steps and fundamentals of word embeddings using the OpenAI API.

## 1. What are embeddings?

At a high level, word embedding is a way to represent words as vectors (arrays of numbers). Each word is assigned a vector of floating-point numbers representing its meaning in some abstract sense. The idea behind word embeddings is that words with similar meanings will have smaller distance between corresponding vectors. For example, “dog” and “cat” are both animals; thus, their word embeddings should be closer to one-another in the vector space than to the word “apple”.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres/what-are-embeddings-d8a53634.png)

### Why is this useful?

One advantage of word embeddings is that they can make our models more efficient and easier to train by using relatively low-dimensional feature vectors to represent words. Instead of one-hot vector that is the same length as the number of words in our vocabulary (171,146 words in the English language, for example), you can use a dense vector of a fixed size (usually a few hundred dimensions).

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres/why-is-this-useful-60272c3e.png)

Another advantage of word embeddings is that we can improve the performance of our models on smaller data sets by transferring the knowledge from Large Language Models such as OpenAI’s GPT-3.

OpenAI offers a powerful API for natural language processing, which you can use to create word embeddings. Word embeddings have applications in a variety of natural language processing tasks, such as named entity recognition, sentiment analysis, and text classification. For example, you can use word embeddings to compare different pieces of text to determine similarity. And that’s what we will cover in this article.

## 2. How to use embeddings in Postgres

We use the Postgres `pgvector` extension to store embeddings to calculate distances. The pgvector extension uses the nearest neighbor algorithm to speed up search on multi-dimentional vectors.

You can install pgvector using the following command:

```
CREATE EXTENSION IF NOT EXISTS vector;
```

The app uses a table called `documents` that contains the embeddings.

```
CREATE TABLE documents (text text, n_tokens integer, embeddings vector(1536));
```

OpenAI uses 1536 tokens in their new `text-embedding-ada-002` model to represent each piece of text. This helps to create more accurate embeddings for natural language processing tasks.

### About OpenAI tokens

Language models process text in chunks referred to as tokens. In English, a token can range from a single character to a complete word such as “a” or “apple.” In certain languages, tokens can even be shorter than one character or longer than one word.

For instance, the sentence “Neon is Serverless Postgres” is divided into seven tokens: [“Ne”, “on”, ” is”, ” Server”, “less”, ” Post”, “gres”].

The number of tokens included in an API call has several implications. First, it affects the cost of the API call as you are charged per token. Second, it affects the duration of the API call, as processing time increases with more tokens. Lastly, the total number of tokens must be within the model’s maximum limit for the API call to function properly.

### Similarity analysis with pgvector

We use the following query to perform a similarity analysis, which calculates the distances between embeddings for an input vector embedding equal to `'[0.006762247998267412, …, -0.028751766309142113]’`:

```sql
SELECT text, n_tokens, embeddings,

           (embeddings <=> ' [0.006762247998267412, ..., -0.028751766309142113]') AS distances
```

The embedding ‘[0.006762247998267412, …, -0.028751766309142113]’ was generated by creating an embedding using the OpenAI API for the following question “What is Neon?”.

Here are the two first rows of the result set for the query shown above:

```bash
text | n_tokens | embeddings | distances

'obs. Careers — | |[0.010606693,… |
Neon …o recent | 200 |-0.007342569] | 0.32074564
searches' | | |

---

'bout us. … | |[0.022020863, …, |
service for every | 75 |-0.0066274726] | 0.30041761
developer.' | | |
---------------------------------------------------------------------------------------
```

The distance calculation is done using the “&lt;=&gt;” operator, which is a cosine distance. The extension also supports inner product (&lt;#&gt;) and euclidian distance (&lt;-&gt;).

But before that, we need some data in our database. You can learn more about how to prepare the data in the [ask-neon project repository Readme](https://github.com/neondatabase/ask-postgres#prepare-the-data).

### Use indexing for performance

Indexing speeds up queries with an approximate index. We’ll add an index for the cosine distance function. We can specify the number of inverted lists. A good place to start is `4 &#42; sqrt(rows)`, with rows = 4400.

```
CREATE INDEX ON items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 265);
```

Now that we know more about embeddings and `pgvector`, let’s apply this to our API.

## 3. Building the application’s backend

The backend uses Neon’s serverless driver, Vercel Edge Functions, and OpenAI to do the following:

1. Accept the question as an input
2. Generate embeddings for the question using OpenAI API
3. Calculate the distances between embeddings and return the context
4. Generate an answer using OpenAI’s completion method

We are using Edge Functions over regular Serverless Functions to speed up output streaming. This [video](https://youtu.be/9Q9_CQxFUKY?t=191) from Vercel explains why we chose Edge over Serverless.

Neon’s serverles driver is based on the node-postgres `pg` package with the difference that it opens WebSocket connections instead of TCP. And this is important since Edge Functions do not support TCP.

The first step of the app is to do a similarity analysis between the question embedding and all the embeddings stored in the database. We keep the rows for which embeddings are the most similar to the question. The concatenation of row text is called context.

The context for the example in the previous section is:

```bash
// context
'obs. Careers — Neon … 'bout us. About Us  … service for every developer.'
```

Which is the concatenation of the text column of the most similar embeddings:

```bash
text | n_tokens | embeddings

'obs. Careers — | | [0.010606693,…,-0.007342569]
searches' | |
'bout us. … service | |
for every | 75 |
developer.' | |

---

Neon …o recent | 200 | [0.022020863, …, -0.0066274726]
```

Then, we use the `question` and the `context` in the prompt to generate the `answer` with the OpenAI API.

Let’s look at how to do that in code, starting with creating the question embedding.

### Create the question embedding

Creating the question embedding aims to compare apples-to-apples with the embeddings stored in our database. We need to vectorize the question into an embedding using the OpenAI API to do so.

```javascript
const response = await fetch('https://api.openai.com/v1/embeddings', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input,
    }),
  });

const responseJson = await response.json();
const q_embeddings = responseJson ['data'] [0] ['embedding'];
const q_embeddings_str = q_embeddings.toString().replace(/\.\.\./g, '');

return q_embeddings;
```

### Get the question’s context

The goal of this step is to search the Postgres documentation text in our database the embedding that is the most similar to the question embedding. We calculate the distance between two vectors: the smaller distance, the more similarities.

The context is the body of text containing the question’s answer. We get the context by calculating the cosine distances between the stored embeddings and question embedding and ordering in ascending order.

We want to use the same query as before, but there is a limited amount of OpenAI tokens available to us.

```bash
-- Returns all rows
SELECT text, n_tokens, embeddings,
           (embeddings <=> ' [0.006762247998267412, ..., -0.028751766309142113]') AS distances
```

Let’s modify the query to include the max token constraint and only return entries with a cumulative token count of less than or equal to 1500.

```sql
SELECT text
FROM (
    SELECT text, n_tokens, embeddings,
           (embeddings <=> ' [0.006762247998267412, ..., -0.028751766309142113]') AS distances,
           SUM(n_tokens) OVER (ORDER BY (embeddings <=> ' [0.006762247998267412, ..., -0.028751766309142113]')) AS cum_n_tokens     FROM documents
) subquery
WHERE cum_n_tokens <= 1500
ORDER BY distances ASC;
```

The cumulative number of tokens is, in this case, arbitrary and depends on your prompt (input). OpenAI’s `text-davinci-003` model accepts 4096 tokens that can be split between the prompt and the answer. The prompt we use in the app uses ~1500 tokens for the context and ~400 tokens for the input and question. This way, we know there is a maximum of approximately 2000 tokens for the answer.

```javascript
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
const query = `
  SELECT text
  FROM (
    SELECT text, n_tokens, embeddings,
    (embeddings <=> ' [${q_embeddings_str}]') AS distances,
    SUM(n_tokens) OVER (ORDER BY (embeddings <=> ' [${q_embeddings_str}]')) AS cum_n_tokens
    FROM documents
    ) subquery
  WHERE cum_n_tokens <= $1
  ORDER BY distances ASC;
`;

const max_tokens = 1500;
const queryParams = [max_tokens];

console.log('Querying database...');
const { rows } = await client.query(query, queryParams);

await client.end();

const context = rows.reduce((acc, cur) => {
    return acc + cur.text;
  }, '');

return context
```

### Create text completion

Now we need OpenAI to interpret the prompt (composed of the question and context) to answer the question. For that, we use the [OpenAI Completion](https://platform.openai.com/docs/api-reference/completions) method.

```javascript
const questionPrompt = `You are an enthusiastic Postgres developer who loves Neon database and has a passion for helping answering developers might have. Answer the question asked by developers based on the context below. If the question can't be answered based on the context, say "Sorry :( I don't know."\n\nContext: ${context}\n\n---\n\nQuestion: ${input}\nAnswer:`;

const res = await fetch('https://api.openai.com/v1/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1700,
    stream: false,
    n: 1,
  }),
});

return await res.json();
```

You may have noticed in the `createCompletion` paramaters, we set `stream` to `false`, which means that we expect the result to be returned all at once. However, OpenAI allows you to return a _read_ of words, similar to how ChatGPT shows results. This part was inspired by the [Twitter Bio](https://github.com/Nutlope/twitterbio) app.

```javascript
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

And replace the previous code with the following function.

const createCompletion = async (prompt: string) {
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let counter = 0;
const res = await fetch('https://api.openai.com/v1/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: JSON.stringify({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1700,
    stream: true,
    n: 1,
  }),
});

const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data;
          if (data === ' [DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices [0].text;

            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }

            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);

      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}
```

With streaming, users do not have to wait for the entire answer to generate before seeing results. This method also executes a few seconds faster than the full completion approach.

## 4. Fine-tuning

There is no perfect model when it comes to natural language programs. As impressive as ChatGPT is, there are still some improvements in the quality of answers the AI generates. Fortunately, there is a way to improve your model with fine-tuning. Visit the [OpenAI documentation](https://platform.openai.com/docs/guides/fine-tuning) to learn more about fine-tuning.

Fine-tuning starts with gathering the ideal generated text for each prompt.

```json
[object Object]
```

You can create a table openai_ft_data to save user feedback.

```sql
CREATE TABLE openai_ft_data (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  answer TEXT NOT NULL,
  suggested_answer TEXT,
  user_feedback BOOLEAN
);
```

You can imagine scenarios where users are asked to provide feedback on whether they liked the generated response. If no, users can share their expected answer, which would help improve your model.

Here is what the function that collects user feedback looks like as a Vercel Serverless Function:

```javascript
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query, answer, suggestedAnswer, feedback } = req.body;

    if (!query ||!answer) {
      return res
        .status(400)
        .json({ message: 'Question and answer are required' });
    }

    const client = await pool.connect();
    const pgQuery =
      'INSERT INTO openai_ft_data (query, answer, suggested_answer, user_feedback) VALUES ($1, $2, $3, $4)';
    const values = [query, answer, suggestedAnswer, feedback];

    await client.query(pgQuery, values);
    
    client.release();

    return res.status(200).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding data' });
  }
};
```

OpenAI recommends collecting at least 500 feedback examples. Results get better every time the number of examples doubles. Once you have collected enough data, here are the steps to create a fine-tuned model:

1. Install the OpenAI CLI:

```
pip install --upgrade openai
```

2. Set your OPENAI_API_KEY:

```
export OPENAI_API_KEY="<OPENAI_API_KEY>"
```

3. Export your data:

You can use the following query to display the data in the `openai_ft_data` table in JSON format:

```sql
SELECT json_build_object('prompt', query, 'completion', answer) FROM openai_ft_data;
```

Let’s use the above query to export data to JSONL format:

```bash
psql <your-connection-string>?sslmode=require -c "SELECT json_build_object('prompt', query, 'completion', answer) FROM openai_ft_data;" -t -A | sed 's/}$/},/' | sed '$ s/,$//' > output.jsonl
```

Expected output:

```json
// output.jsonl

{
  "prompt": "what's neon",
  "completion": " Neon is a fully managed serverless PostgreSQL with a generous free tier. Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and more. Neon is open source and written in Rust."
}
```

4. Prepare your data using the OpenAI CLI:

```
openai tools fine_tunes.prepare_data -f output.jsonl
```

5. Create your fine-tuned model:

```
openai api fine_tunes.create -t <TRAIN_FILE_ID_OR_PATH> -m <BASE_MODEL>
```

## Conclusion

In this article, we covered the fundamentals of word embeddings and their importance in natural language processing. We have explored how to use OpenAI to create embeddings, store them in Postgres using the pgvector extension, and how to use Vercel Edge Functions along with the @neondatabase/serverless driver to get the context to generate an OpenAI completion.

We also discussed ways to improve performance and user experience, and to reduce cost by returning a stream and using PolyScale to reduce latency.

Finally, we discussed fine-tuning the model using user feedback and gathering data using the OpenAI CLI.

I hope you found this post helpful and informative, and we encourage you to share ideas, feedback, and any questions you have about building end-to-end chatbots with word embeddings and Neon. We look forward to hearing from you!

I hope you found this post helpful and informative, and we encourage you to share ideas, feedback, and any questions you have about building end-to-end chatbots with word embeddings, and Neon. Your input will help us create better content and improve the experience for all readers. So don’t hesitate to share your thoughts in the comments section or contact us directly. We look forward to hearing from you!
