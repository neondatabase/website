---
title: 'Mixtral 8x7B: What you need to know about Mistral AI’s latest model'
description: 'Text generation, embedding models and more'
excerpt: >-
  We’re Neon, and we’re redefining the database experience with our cloud-native
  serverless Postgres solution. If you’ve been looking for a database for your
  RAG apps that adapts to your application loads, you’re in the right place.
  Give Neon a try, and let us know what you think....
date: '2023-12-11T17:15:23'
updatedOn: '2024-04-19T17:42:25'
category: community
categories:
  - community
  - product
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/mixtral-8x7b-what-you-need-to-know-about-mistral-ais-latest-model/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Mixtral 8x7B: What you need to know about Mistral AI’s latest model - Neon'
  description: 'Text generation, embedding models and more'
  keywords: []
  noindex: false
  ogTitle: 'Mixtral 8x7B: What you need to know about Mistral AI’s latest model - Neon'
  ogDescription: >-
    We’re Neon, and we’re redefining the database experience with our
    cloud-native serverless Postgres solution. If you’ve been looking for a
    database for your RAG apps that adapts to your application loads, you’re in
    the right place. Give Neon a try, and let us know what you think. Neon is
    cloud-native Postgres and scales your AI […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/mixtral-8x7b-what-you-need-to-know-about-mistral-ais-latest-model/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/mixtral-8x7b-what-you-need-to-know-about-mistral-ais-latest-model/neon-mixtral8x7b-1-1024x576-b71e00cc.jpg)

**We’re Neon, and we’re redefining the database experience with our cloud-native serverless Postgres solution. If you’ve been looking for a database for your RAG apps that adapts to your application loads, you’re in the right place. [Give Neon a try](https://console.neon.tech/signup), and let us know what you think. Neon is cloud-native Postgres and scales your AI apps to millions of users with pgvector. In this post, Raouf is going to tell you what you need to know about Mixtral 8x7B, the new LLM by MistralAI**.

---

Mistral AI, the company behind the [Mistral 7B](https://arxiv.org/pdf/2310.06825.pdf) model, has released its latest model: [Mixtral 8x7B](https://mistral.ai/news/mixtral-of-experts/) (Mixtral). The model includes support for 32k tokens and better code generation, and it matches or outperforms GPT3.5 on most standard benchmarks.

In this article, we’ll review the new text-generation and embedding models by Mistral AI.

## Background

Mistral AI has emerged as a strong contender in the open-source large language model sphere with their [Mistral 7B](https://arxiv.org/pdf/2310.06825.pdf) model, which outperforms existing models like Llama 2 (13B parameters) across multiple benchmarks.

In a previous comparative analysis, we concluded that, although impressive, the Mistral 7B instruct model optimized for chat needed some improvements before being seen as an alternative to the `gpt-*` models.

Mixtral might change all of that as it’s pushing the frontier of open models. According to a recent benchmark, Mixtral matches or outperforms Llama 2 70B and GPT3.5.

|                                         | LLaMA 2 70B | GPT – 3.5 | Mixtral 8x7B |
| --------------------------------------- | ----------- | --------- | ------------ |
| **MMLU**<br />(MCQ in 57 subjects)      | 69.9%       | 70.0%     | **70.6%**    |
| **HellaSwag**<br />(10-shot)            | 87.1%       | 85.5%     | 86.7%        |
| **ARC Challenge**<br />(25-shot)        | 85.1%       | 85.2%     | **85.8%**    |
| **WinoGrande**<br />(5-shot)            | **83.2%**   | 81.6%     | 81.2%        |
| **MBPP**<br />(pass@1)                  | 49.8%       | 52.2%     | **60.7%**    |
| **GSM-8K**<br />(5-shot)                | 53.6%       | 57.1%     | **58.4%**    |
| **MT Bench**<br />(for Instruct Models) | 6.86        | **8.32**  | 8.30         |

## Developing with Mixtral 8x7B Instruct

If you plan to fine-tune Mixtral and your own inference, it’s important to note that Mixtral requires _much_ more RAM and GPUs than Mistral 7B. While Mistral 7B works well on a 24GB RAM 1 GPU instance, Mixtral requires 64GB of RAM and 2 GPUs, which increases the cost by a factor of 3 (1.3$/h vs. 4.5$/h).

Luckily for developers, [Mistral AI has an API](https://console.mistral.ai/) in beta and under an invite gate. They also have client libraries for [Python](https://pypi.org/project/mistralai/) and [JavaScript](https://www.npmjs.com/package/@mistralai/mistralai) developers.

Below is an example of code using the Python library.

Prerequisite: install the `mistraiai` client library using `pip`:

```bash
pip install mistralai
```

Here is a code example:

```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-tiny"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the elephant database?")
]

chat_response = client.chat(
    model=model,
    messages=messages
)
```

If you’re familiar with the OpenAI client library, you will notice the similarity between the two SDKs. The Mistral AI library can be used as a drop-in replacement, which makes migrations seamless.

Mistral AI API provides three models:

- `mistral-tiny` based on Mistral-7B-v0.2
- `mistral-small` based on Mixtral-7Bx8-v0.1
- `mistral-medium` based on an internal prototype model

## Mistral-embed: The new embedding model

In addition to the text generation models, Mistral AI’s API gives you access to [BGE-large-like](https://huggingface.co/BAAI/bge-large-en) 1024-dimension embedding model `mistral-embed`, also accessible via the client library with the below code:

```python
from mistralai.client import MistralClient

api_key = os.environ["MISTRAL_API_KEY"]

client = MistralClient(api_key=api_key)
embeddings_batch_response = client.embeddings(
      model="mistral-embed",
      input=["I love Postgres!"],
  )
```

## What does it mean for your AI apps?

Mixtral provides developers with a `gpt-3.5-turbo` API compatible alternative and, in the case of `mistral-tiny` and `mistral-small` models, at a lower price.

Below is the price comparison per one million tokens.

|        | mistral-tiny | mistral-small | mistral-medium | gpt-3.5-turbo-1106 | gpt-3.5-turbo-instruct |
| ------ | ------------ | ------------- | -------------- | ------------------ | ---------------------- |
| Input  | $0.15        | $0.64         | $2.68          | $1.0               | $1.5                   |
| Output | $0.45        | $1.93         | $8.06          | $2.0               | $2.0                   |

However, if you previously stored ada v2 1536 dimension vector embeddings with `pgvector`, you will need to re-create the embeddings to add support for `mistral-embed`.

```python
embeddings_batch_response = client.embeddings(
      model="mistral-embed",
      input=["text 1", "text 2", "text 3"],
  )
```

The `mistral-embed` model for text embedding is slightly more expensive than the `text-embedding-ada-002` model.

|       | mistral-embed | ada v2 |
| ----- | ------------- | ------ |
| Input | $0.107        | $0.1   |

Note that [Mistral AI’s pricing](https://docs.mistral.ai/platform/pricing) is in euros and the tables above reflect adjusted rates to USD.

## Conclusion

The release of Mixtral 8x7B by Mistral AI represents a significant leap forward for open-source LLMs. With its enhanced capabilities like 32k token support, improved code generation, and competitive performance against `gpt-3.5-turbo`, Mixtral is poised to be a game-changer for developers and AI enthusiasts alike.

While the model’s resource requirements can be a potential barrier for some, those limitations are offset by the Mistral AI API, and the drop-in replacement client libraries in Python and JavaScript.

The pricing structure of Mixtral, particularly for the mistral-tiny and mistral-small models, presents a more cost-effective alternative to `gpt-3.5-*` models. This, along with the advanced capabilities of the mistral-embed model for text embedding, makes Mixtral an attractive option for a wide range of AI apps and Retrieval Augmented Generation pipelines.

However, it’s worth noting that transitioning to Mixtral, especially for those who previously used models like ada v2 for embedding, may require some adjustments in terms of re-creating embeddings and accommodating the slightly higher cost of mistral-embed.

Overall, Mixtral 8x7B marks an exciting development in the AI field, offering powerful and efficient tools for a variety of applications. As Mistral AI continues to innovate and expand its offerings, it will undoubtedly play a crucial role in shaping the future of AI technology.

## 📚 Continue reading

- **[Deploy Mistral Large to Azure and create a conversation with Python and LangChain:](https://neon.tech/blog/deploy-mistral-large-to-azure-and-chat-with-langchain)** check out our step-by-step guide to deploying Mistral Large to Azure.
- **[30x faster index build for your vector embeddings with pgvector:](https://neon.tech/blog/pgvector-30x-faster-index-build-for-your-vector-embeddings)** learn how the new pgvector speeds up the index building process for vector embeddings by 30 times, optimizing performance for your AI apps.
- **[How to create and publish a custom ChatGPT:](https://neon.tech/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert)** a guide walking you through how to create, publish, and potentially monetize custom ChatGPT models.
