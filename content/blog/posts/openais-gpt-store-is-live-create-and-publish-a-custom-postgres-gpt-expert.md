---
title: 'OpenAI’s GPT Store is live: Create and Publish a custom Postgres GPT Expert'
description: A guide to create and publish a custom ChatGPT
excerpt: >-
  Do you have questions about PostgreSQL or Neon? We built a custom Neon and
  PostgreSQL OpenAI GPT expert to help you with your queries and projects.
  OpenAI’s GPT allows developers to create custom ChatGPT experiences to perform
  specific tasks or answer questions about a given topi...
date: '2024-01-11T15:56:35'
updatedOn: '2024-03-01T14:00:10'
category: product
categories:
  - product
authors:
  - peter-bendel
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert/cover.png
  alt: null
isFeatured: false
seo:
  title: >-
    OpenAI’s GPT Store is live: Create and Publish a custom Postgres GPT Expert
    - Neon
  description: A guide to create and publish a custom ChatGPT
  keywords: []
  noindex: false
  ogTitle: >-
    OpenAI’s GPT Store is live: Create and Publish a custom Postgres GPT Expert
    - Neon
  ogDescription: >-
    Do you have questions about PostgreSQL or Neon? We built a custom Neon and
    PostgreSQL OpenAI GPT expert to help you with your queries and projects.
    OpenAI’s GPT allows developers to create custom ChatGPT experiences to
    perform specific tasks or answer questions about a given topic. This article
    walks you through the steps to create […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert/social.jpg
---

<img src="https://cdn.neonapi.io/public/images/pages/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert/image-8-1024x576-bd4771d8.png" alt="Post image" width="1024" height="576" />

Do you have questions about PostgreSQL or Neon? We built a custom [Neon and PostgreSQL OpenAI GPT expert](https://chat.openai.com/g/g-Zb5CCMkXZ-neon-postgresql-expert) to help you with your queries and projects.

[OpenAI’s GPT](https://help.openai.com/en/articles/8554397-creating-a-gpt%20or%20https://help.openai.com/en/articles/8554407-gpts-faq) allows developers to create custom ChatGPT experiences to perform specific tasks or answer questions about a given topic.

This article walks you through the steps to create your own custom GPT using Python and Postgres.

<img src="https://lh7-us.googleusercontent.com/uHow3piGmKgfzRcYv3cVQVLCPve30iqOe_a05orYfKN3Qc9Szec5B3DTTZzXrZ6iTj8mM5YKLnOITrlYKuvHuNKaRGwjnh-8SsvJt_M9vmtmI8MB85A0kSJUNafifqWHgeZ5u3yKTA-XFwUpUo8y0ME" alt="Post image" width="975" height="512" />

## What are GPTs?

Generative Pre-trained Transformers, commonly referred to as GPTs, are a group of machine learning models that provide human-like text interfaces that can answer questions in a conversational manner. OpenAI’s GPT allows developers to create custom ChatGPTs that are experts in specific domains and enable additional capabilities like web browsing and DALL·E image generation.

OpenAI has also introduced the [GPT Store](https://openai.com/blog/introducing-the-gpt-store), a marketplace where users can explore and access various GPTs. Creators can feature their GPTs in this store and potentially earn money based on their usage by the community.

## How to create a GPT

Developers with a Plus or Enterprise subscription can create GPTs by interacting with the GPT Builder in ChatGPT, where they can add instructions, upload files for the knowledge base, and select capabilities such as web searching, image creation, or data analysis.

Here’s how to create a GPT:

<p>Head to <a href="https://chat.openai.com/gpts/editor"><span>https://</span><span>chat.openai.com/gpts/editor</span></a> (or select your name and then “My GPTs”)<img src="https://lh7-us.googleusercontent.com/h617F7tKjQV8PagxFKasifao0K1TopWKGrUTEFbRF0qelha5_jjPHJSuK6_R_11Zx6bYRhcXqgy-jI9fe5zpnNCRVG5g1ja9j4KOmesXBR9XYfiqYMZCkXoN8n7lbMFhXMWb5jhMoAeDp497_xZzfok" alt="Post image" width="624" height="435" />In the “Configure” tab, enter the name, description and instructions.<br /><img src="https://lh7-us.googleusercontent.com/mPawlaCgix2-QGV6v7-ebIuFaZgVtx4pCxKaFdQDPggOIVsMvs8U2raSRexcKm1OyXxjQ7MjoG_VnqkMJUKSyrnYPNEDmAkI6BdvYjyta0zdO_z5v5nWLFkAKAT6dusC9aElKcUV458tMXsgcRNIsr4" alt="Post image" width="406" height="606" /><br /></p>

Example of instructions we used for the Neon PostgreSQL Expert GPT: “Your role is to act as a PostgreSQL expert, specifically tailored for Neon’s database as a service. You will provide detailed, accurate information and guidance on PostgreSQL, focusing on its use within the Neon platform. This includes offering advice on best practices, troubleshooting, performance optimization, and the nuances of working with Neon’s database service. You should be thorough in your explanations, ensuring clarity and precision in your responses. In cases where exact details are required and not provided, you should ask for clarification to provide the most accurate and helpful advice possible. Your responses should reflect a deep understanding of PostgreSQL and its application in a cloud-based environment like Neon.”

When you’re ready to publish your GPT, select “Publish” and share it with others if you’d like.

You can find the instructions in the [OpenAI Chatgpt Neon PostgreSQL Expert](https://github.com/neondatabase/neon-postgresql-expert) repo on GitHub.

## Enhance your GPT with Retrieval Augmented Generation

You can provide additional knowledge to your GPT by uploading text documents and a process named [Retrieval-Augmented Generation](https://python.langchain.com/docs/use_cases/question_answering/) (RAG).

<img src="https://cdn.neonapi.io/public/images/pages/blog/openais-gpt-store-is-live-create-and-publish-a-custom-postgres-gpt-expert/image-9-a65dcc08.png" alt="Post image" width="479" height="208" />

RAG is a framework that enhances the capabilities of large language models (LLMs) like GPT by allowing them to access facts from an external knowledge base. This helps overcome some of the limitations with LLMs, like accessing up-to-date and private information, or reducing hallucinations.

The advantage of GPTs is that you don’t need to fully understand RAG to expand your chatbot with additional knowledge. But if you’re interested in understanding what happens under the hood, typically, documents are uploaded, then the text is split into pieces and chunks, added to a vector database, and used for RAG. Each user’s request will trigger a semantic search in the database to find the knowledge related to the user’s question. To understand more about how semantic search works, check out the [YC Matcher code on GitHub](https://github.com/neondatabase/yc-idea-matcher).

## RAG limitations with GPTs

Custom knowledge in GPTs is limited to 20 documents. Additionally, The text document formats that are currently supported to create GPTs are limited. For our example, we executed a script to crawl Neon’s documentation and generate markdown files.

```python
import yaml

def read_markdown_file(filepath):
    with open(filepath, 'r') as file:
        return file.read()

def process_items(items):
    combined_markdown = ''
    for item in items:
        title = item['title']
        slug = item.get('slug', '')
        full_path = f"../website/content/docs/{slug}.md" if slug else ''

        # Add the title as an H1 heading
        combined_markdown += f"# {title}\n\n"

        # Add content from the corresponding Markdown file, if a slug is provided
        if slug:
            markdown_content = read_markdown_file(full_path)
            combined_markdown += f"{markdown_content}\n\n"

        # Process any nested items recursively
        if 'items' in item:
            nested_content = process_items(item['items'])
            combined_markdown += nested_content

    return combined_markdown

def main():
    with open('../website/content/docs/sidebar.yaml', 'r') as file:
        sidebar = yaml.safe_load(file)

    combined_markdown = process_items(sidebar)

    with open('markdown/neon_documentation.md', 'w') as file:
        file.write(combined_markdown)

if __name__ == "__main__":
    main()
```

The above limitations make it difficult for applications with extensive knowledge bases and gigabytes of private data to be converted to GPTs. Another concern is related to data security. OpenAI operates as a black box, which makes it challenging to know what’s going on internally and how your data is accessed. This can be a blocker for users with sensitive data.

An alternative would be to create your own RAG app that uses open-source tools and models such as [Mixtral 8x7B](https://neon.tech/blog/mixtral-8x7b-what-you-need-to-know-about-mistral-ais-latest-model) and [pgvector](https://neon.tech/docs/extensions/pgvector). Learn more about [AI concepts](https://neon.tech/docs/ai/ai-concepts) and [how to use create a chatbot using pgvector and Next.js](https://neon.tech/blog/building-an-ai-powered-chatbot-using-vercel-openai-and-postgres).

## Publishing to the GPT Store

One exciting aspect of building a GPT is that users can be paid based on engagement. To monetize your GPT, make sure to save it for Everyone and that you have a verified Builder Profile.

That’s it!

## Conclusion

GPTs and the GPT Store are a great way to create, monetize, and share your own custom ChatGPTs with the world. GPTs such as the [Neon PostgreSQL Expert](https://chat.openai.com/g/g-Zb5CCMkXZ-neon-postgresql-expert) do not require developer knowledge and are designed to be easy to publish and enhance with a few clicks.

However, GPTs come with limitations and do not replace RAG apps for apps that require extensive private and custom datasets or a further customized experience at the moment.

What about you? Are you thinking of a GPT? Let us know your thoughts and if you built a GPT or a RAG app. Join us and share your projects with us on our [Discord server](https://discord.gg/Uus74e8Y).

## References

[Creating a GPT | OpenAI Help Center](https://help.openai.com/en/articles/8554397-creating-a-gpt)

[GPTs FAQ | OpenAI Help Center](https://help.openai.com/en/articles/8554407-gpts-faq)
