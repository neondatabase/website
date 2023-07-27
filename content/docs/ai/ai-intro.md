---
title: AI integration
subtitle: Build AI applications with Neon serverless Postgres as your vector database
enableTableOfContents: true
isDraft: true
---

Vector databases enable efficient storage and retrieval of vector data, which is an essential component in building AI applications that leverage Large Language Models (LLMs) such as OpenAI.

Neon supports both the `pgvector` and `pg_embedding` extensions, which allow you to leverage Postgres as a vector database for storing and querying vector embeddings.

The foundation of AI and Machine Learning rests upon a few fundamental concepts, two of which are vectors and embeddings. Understanding these will not only illuminate the function of our pgvector and pg_embedding extensions but will also give you a clearer picture of the mechanics of AI models.

## What are vectors?

In the realm of AI, vectors represent a mathematical construct used to encode the features of an object in a space, often multidimensional. If you think about a coordinate system, a vector is essentially a point in that space. Each dimension in this vector corresponds to a particular feature of the data object. For instance, if we're talking about a dataset of cars, the dimensions might correspond to various features such as horsepower, weight, or age. Each car can be represented as a point (or vector) in this multidimensional space.

A vector can also be thought of as an array of numbers, where each number represents a specific feature value. This makes vectors particularly suitable for computational processes, as mathematical operations such as addition, subtraction, and multiplication can be easily performed on them. These operations are fundamental in Machine Learning algorithms and are used to measure distances or similarities between vectors (or objects), making them key for AI systems.

## What are embeddings?

Embeddings are a type of vector, but they carry a slightly more nuanced meaning in Machine Learning. An embedding is a low-dimensional, learned representation of high-dimensional data. The purpose of an embedding is to capture some form of the underlying structure of the data in a lower-dimensional space.

Let's consider text data as an example. Each word in a language could be considered a unique, high-dimensional entity. However, representing words this way can quickly become inefficient, especially for large datasets or languages. Instead, words can be embedded into a lower-dimensional space where similar words are placed near each other. For instance, 'king' and 'queen' would be close to each other in this space, representing their semantic similarity.

By using embeddings, complex data structures are simplified, and Machine Learning models can handle them more efficiently. When applied in databases like Neon, these concepts allow us to store and query data in an optimised and effective manner, supporting high-quality, real-time AI applications.

## Vector Search

Vector search, also known as similarity search or nearest neighbor search, is a critical operation that facilitates the finding of the most similar items to a given one in a vector space. The objective of vector search is not to find an exact match, as traditional databases do, but to find the closest match based on the criteria set by the vector representation.

In the context of AI and machine learning, "closeness" or "similarity" is usually determined by calculating the distance between vectors in the vector space. There are several distance measures used for this purpose, but some of the most common ones include Euclidean distance (think of it as straight-line distance between two points) and cosine similarity (which measures the angle between two vectors).

Here's how vector search typically works: Suppose you have an item represented by a vector, for instance, a word represented as an embedding as we mentioned earlier, like 'king'. You want to find similar words in your database, such as 'queen', 'prince', 'monarch', and so on. You'd perform a vector search by calculating the distance between your 'king' vector and every other vector in your database. The items represented by the vectors closest to your 'king' vector are considered the most similar items.

In practical applications, vector search can be computationally intensive, especially when dealing with large datasets. Thankfully, there are efficient algorithms and data structures designed to speed up this process.

The integration of vector search in Neon, facilitated by the pgvector and pg_embedding extensions, means that you can efficiently store and query vector embeddings. This opens up powerful possibilities for AI and Machine Learning applications built on top of your data, enhancing capabilities like recommendation systems, semantic search, and much more.
