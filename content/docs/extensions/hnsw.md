---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension enables the use of [Hierarchical Navigable Small World (HNSW) proximity graphs](https://arxiv.org/abs/1603.09320) for vector similarity search in PostgreSQL. HNSW is a graph-based approach to indexing high-dimensional data. It constructs a hierarchy of graphs, where each layer is a subset of the previous one. During a search, it navigates through the graphs to quickly find the nearest neighbors. HNSW graphs are known for their superior performance in terms of speed and recall.

```text
Hierarchical Navigable Small World (HNSW) is a method used for similarity search in multi-dimensional data. It's a type of algorithm that helps computers find similar items in a dataset, which is a common task in many applications, such as recommendation systems, image recognition, and natural language processing.

The HNSW algorithm is based on the small-world network concept, which is a type of graph where most nodes can be reached from every other node by a small number of steps. The "hierarchical" part of HNSW comes from the fact that it builds multiple layers of these small-world networks, each one a subset of the one below it. This hierarchical structure allows the algorithm to navigate quickly from one item to another in a large dataset, making it efficient for similarity search tasks.

The HNSW algorithm is particularly notable for its ability to handle large-scale datasets. It's designed to be memory-efficient and fast, even when dealing with billions of data points. This makes it a powerful tool for many modern applications that need to process large amounts of data in real time.
```

## HNSW construction

The construction of an HNSW graph involves adding elements (or data points) one by one and creating connections between them based on their similarity. Here's a simplified overview of the process:

Initialize the graph: The graph is initialized with a single element at the highest layer.

Add elements: Each new element is added to the graph one at a time. The layer at which the new element is added is determined randomly based on an exponentially distributed probability.

Find the "entry point": For each new element, an "entry point" in the graph is found. This is a node from which the algorithm will start the process of creating connections for the new element. The entry point is found by traversing the graph from a node at the highest layer down to the layer at which the new element is being added, always moving to the node that is closest to the new element.

Create connections: Starting from the entry point, the algorithm navigates the graph to find the m closest elements to the new element, where m is a parameter that determines the maximum number of connections for each node. These elements are then connected to the new element.

Update the graph: If adding the new element and its connections results in any existing nodes having more than m connections, the extra connections are removed to keep the maximum degree of the graph equal to m.

Repeat: Steps 2-5 are repeated for each new element until all elements have been added to the graph.

The parameters m and efConstruction play crucial roles in this process:

m is the maximum number of bi-directional links created for each new element during the construction of the graph. A larger m creates a denser graph, which can increase the recall (the fraction of total relevant elements that are successfully retrieved), but at the cost of increased memory usage and construction time.

efConstruction is the size of the dynamic list used during the construction phase. It influences the trade-off between the index quality and the construction speed. A larger efConstruction improves the quality of the index but also increases the construction time.

In summary, the construction of an HNSW graph is a delicate balance between speed, accuracy, and resource usage, and the parameters m and efConstruction allow you to tune the algorithm according to your specific needs.


## How HNSW Search works

Start at the top layer: The search process begins at the topmost layer of the HNSW graph. The starting point is usually a node that has been pre-selected as a good general starting point for searches.

Navigate to the nearest neighbor: From the starting node, the algorithm navigates to the nearest neighbor in the same layer that is closer to the query point. This step is repeated until there are no more neighbors that are closer to the query point.

Move down a layer: Once the algorithm can't find any closer nodes in the current layer, it moves down to the next layer and repeats the process of navigating to the nearest neighbor.

Repeat until the bottom layer: The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer of the graph.

Finalize the search: In the bottom layer, the algorithm continues navigating to the nearest neighbor until it can't find any nodes that are closer to the query point. The current node is then returned as the most similar node to the query point.

The key idea behind HNSW is that by starting the search at the top layer and moving down, the algorithm can quickly navigate to the area of the graph that contains the query point. This makes the search process much faster than if it had to search through every node in the graph.

Remember that the "distance" between nodes in this context is determined by some measure of similarity, which depends on the specific application. For example, in a recommendation system, the distance might be based on how similar two users' preferences are.

Neon's `hnsw` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of HSNW, the code for the current state-of-the-art billion-scale nearest neighbor search system presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

## Enable the hnsw extension

You can enable the `hnsw` extension in Neon by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION hnsw;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Create a table for vector data

To create a table for storing vectors, issue a create table statement similar to the following:

```sql
CREATE TABLE vectors(id INTEGER, vec REAL[]);
```

This statement generates a table named `vectors` with an `vec` column for storing vector data. Your table and vector column names may differ.

## Insert data

Execute an `INSERT` statement similar to the following to store your vector data. For demonstration purposes, the statement shown below stores vectors with 3 dimensions. By comparison, OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text. For more information, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the OpenAI documentation.

```sql
INSERT INTO vectors(id, vec) 
VALUES 
(1, '{1.1, 2.2, 3.3}'),
(2, '{4.4, 5.5, 6.6}'),
(3, '{7.7, 8.8, 9.9}');
```

## Indexing vectors using hnsw

Use a `CREATE INDEX` statement similar to the following to add the index on your vector colum.

```sql
CREATE INDEX ON vectors USING hnsw(vec) WITH (maxelements=10, dims=3, m=3);
```

An `hsnw` index supports the following parameters:

- `maxelements`: Sets the maximum size of the index by defining the maximum number of indexed elements. This is a required parameter. The example above has a value f `10`. A real-world example might have a value of `1000000`.
  In the context of Hierarchical Navigable Small World (HNSW), an "element" refers to a data point or a vector in the dataset. Each element is represented as a node in the graph constructed by the HNSW algorithm.

  When we talk about adding an element to the HNSW graph, we mean that we're adding a new data point to the dataset, and this data point is being integrated into the graph structure that HNSW uses to perform efficient similarity searches.

  The connections between elements (or nodes) in the graph represent the relationships between data points in terms of their similarity. The HNSW algorithm navigates this graph structure to find the most similar elements to a given query element.
- `dims`: Defines the number of dimensions in your vector data (if not defined in the column type definition). This is a required parameter. If you were storing data generated using OpenAI's `text-embedding-ada-002` model, which supports 1536 dimensions, you would define a value of 1536, for example.
- `m`: Defines the maximum number of bidirectional links (also referred to as edges) created for every new element during the construction of the graph.
- `efConstruction`: Defines the number of neighbors considered during index construction. A high `efConstruction` value creates a higher quality graph and offers more accurate search results, but it also means the index building process takes longer. (e.g., `efsearch=16`)
- `efsearch`: Defines the number of neighbors that are considered during index search. A high value produces more accurate search results but at the cost of increased search time. This value should be equal or larger than k (the number of nearest neighbors you want your search to return). (e.g., `efsearch=64`)

## Tuning the HNSW algorithm

In the context of Hierarchical Navigable Small World (HNSW) algorithm, m, efSearch, and efConstruction are parameters that control the behavior of the algorithm.

m: This is the branching factor or the maximum number of connections for each node in the graph. It determines the number of bi-directional links created for each new element during the construction of the graph. A higher value of m will increase the recall but also the memory consumption and the construction time.

efSearch: This is the size of the dynamic list used during the search phase. It influences the trade-off between the recall and speed of the query. A higher value of efSearch will increase the recall but also the query time.

efConstruction: This is the size of the dynamic list used during the construction phase. It influences the trade-off between the index quality and the construction speed. A higher value of efConstruction will improve the quality of the index but also increase the construction time.

These parameters allow you to tune the HNSW algorithm according to your specific needs. For example, if you need to prioritize speed over accuracy, you might choose lower values for m and efSearch. On the other hand, if you need to prioritize accuracy over speed, you might choose higher values.

## Querying

To query the `vectors` table for nearest neighbors, you can use a query similar to this example:

```sql
SELECT id FROM vectors ORDER BY vec <-> array[1.1, 2.2, 3.3] LIMIT 2;
```

where:

- `SELECT id FROM vectors` selects the id field from all records in the `vectors` table.
- `<->`: This is the PostgreSQL "distance between" operator. It calculates the Euclidean distance between the vector `vec` in each row and the input array `[1.1, 2.2, 3.3]`.
- `ORDER BY ...` sorts the selected records in ascending order based on the calculated distances. In other words, records with vec values that are closer to `[1.1, 2.2, 3.3]` will be returned first.
- `LIMIT 2` limits the result set to the first two records after sorting.

In summary, the query retrieves the IDs of the two records in the vectors table whose value is closest to `[1.1, 2.2, 3.3]` according to Euclidean distance."

## hnsw Extension GitHub repository

The GitHub repository for the `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).
