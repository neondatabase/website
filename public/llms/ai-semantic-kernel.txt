# Semantic Kernel

> The Semantic Kernel documentation for Neon outlines the integration of AI capabilities into applications, enabling users to build and deploy AI models efficiently within the Neon platform.

## Source

- [Semantic Kernel HTML](https://neon.com/docs/ai/semantic-kernel): The original HTML version of this documentation

[Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/) is an open-source SDK developed by Microsoft that enables the integration of large language models (LLMs) with traditional programming constructs. It allows developers to build AI-powered applications by combining natural language processing, planning, and memory capabilities. Semantic Kernel supports orchestration of AI workflows, plugin-based extensibility, and vector-based memory storage for retrieval-augmented generation (RAG) use cases. It is commonly used to create intelligent agents, chatbots, and automation tools that leverage LLMs like OpenAI's GPT models.

## Initialize Postgres Vector Store

Semantic Kernel supports using Neon as a vector store, using its the `pgvector` extension and existing [Postgres Vector Store connector](https://learn.microsoft.com/en-us/semantic-kernel/concepts/vector-store-connectors/out-of-the-box-connectors/postgres-connector?pivots=programming-language-csharp) to access and manage data in Neon. It establishes a Neon connection, enables vector support, and initializes a vector store for AI-driven search and retrieval tasks

Here's how you can initialize Postgres Vector Store with Semantic Kernel in .NET using `Microsoft.SemanticKernel.Connectors.Postgres` NuGet package:

```csharp
// File: Program.cs

using Microsoft.SemanticKernel.Connectors.Postgres;
using Npgsql;

class Program
{
    static void Main()
    {
        var connectionString = "Host=myhost;Username=myuser;Password=mypass;Database=mydb";
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.UseVector();
        using var dataSource = dataSourceBuilder.Build();

        var vectorStore = new PostgresVectorStore(dataSource);
        Console.WriteLine("Vector store created successfully.");
    }
}

```

## Generate Embeddings with Azure OpenAI

You can generate text embeddings using Azure OpenAI in the same .NET application.

```csharp
// File: Program.cs

using Microsoft.SemanticKernel.Connectors.Postgres;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using Npgsql;
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        string connectionString = "Host=myhost;Username=myuser;Password=mypass;Database=mydb";

        // Create and configure the vector store
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.UseVector();
        using var dataSource = dataSourceBuilder.Build();
        var vectorStore = new PostgresVectorStore(dataSource);
        Console.WriteLine("Vector store created successfully.");

        // Generate embeddings using Azure OpenAI
        var embeddingService = new AzureOpenAITextEmbeddingGenerationService(
            deploymentName: "your-deployment-name",
            endpoint: "https://api.openai.com",
            apiKey: "your-api-key"
        );

        string text = "This is an example sentence for embedding.";
        var embedding = await embeddingService.GenerateEmbeddingsAsync(new[] { text });

        Console.WriteLine($"Generated Embedding: [{string.Join(", ", embedding[0].AsReadOnlySpan().Slice(0, 5))}...]");
    }
}
```

## Chat Completions with Azure OpenAI

Here is how you can run a chat completion query with Azure OpenAI and Semantic Kernel

```csharp
// File: Program.cs

using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Postgres;
using Microsoft.SemanticKernel.Connectors.AzureOpenAI;
using Npgsql;
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        string connectionString = "Host=myhost;Username=myuser;Password=mypass;Database=mydb";

        // Step 1: Create and configure the vector store
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.UseVector();
        using var dataSource = dataSourceBuilder.Build();
        var vectorStore = new PostgresVectorStore(dataSource);
        Console.WriteLine("✅ Vector store created successfully.");

        // Step 2: Generate embeddings using Azure OpenAI
        var embeddingService = new AzureOpenAITextEmbeddingGenerationService(
            deploymentName: "your-deployment-name",
            endpoint: "https://api.openai.com",
            apiKey: "your-api-key"
        );

        string text = "This is an example sentence for embedding.";
        var embedding = await embeddingService.GenerateEmbeddingsAsync(new[] { text });

        Console.WriteLine($"✅ Generated Embedding: [{string.Join(", ", embedding[0].AsReadOnlySpan().Slice(0, 5))}...]");

        // Step 3: Perform chat completion using Azure OpenAI
        var kernel = Kernel.CreateBuilder()
            .AddAzureOpenAIChatCompletion(
                deploymentName: "your-chat-deployment-name",
                endpoint: "https://api.openai.com",
                apiKey: "your-api-key"
            ).Build();

        string userPrompt = "Explain Retrieval-Augmented Generation (RAG) in simple terms.";
        var response = await kernel.InvokePromptAsync(userPrompt);

        Console.WriteLine("✅ Chat Completion Response:");
        Console.WriteLine(response);
    }
}
```

## Examples

Explore examples and sample code for using SemanticKernel with Neon Serverless Postgres.

- [RAG .NET console app (Azure OpenAI + Semantic Kernel)](https://github.com/neondatabase-labs/neon-semantic-kernel-examples): A .NET RAG example app built with Azure OpenAI and Semantic Kernel
