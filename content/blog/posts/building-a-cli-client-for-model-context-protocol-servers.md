---
title: Building a CLI Client For Model Context Protocol Servers
description: Going beyond Claude Desktop
excerpt: >-
  The Model Context Protocol (MCP) keeps gaining traction in the AI space, and
  since the launch of the Neon MCP Server (~2 weeks ago), the community has
  built dozens of these servers across a wide spectrum of domains. However, the
  Claude Desktop app has established itself as the de...
date: '2024-12-20T17:21:38'
updatedOn: '2025-03-06T15:13:40'
category: engineering
categories:
  - engineering
  - product
authors:
  - pedro-figueiredo
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-a-cli-client-for-model-context-protocol-servers/cover.jpg
  alt: Building a CLI Client For Model Context Protocol Servers
isFeatured: true
seo:
  title: Building a CLI Client For Model Context Protocol Servers - Neon
  description: >-
    Learn how to build an MCP CLI client to leverage the versatility of
    Anthropic's protocol without the limitations of a desktop client.
  keywords: []
  noindex: false
  ogTitle: Building a CLI Client For Model Context Protocol Servers - Neon
  ogDescription: >-
    Learn how to build an MCP CLI client to leverage the versatility of
    Anthropic's protocol without the limitations of a desktop client.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-a-cli-client-for-model-context-protocol-servers/social.jpg
---

![Building a CLI Client For Model Context Protocol Servers](https://cdn.neonapi.io/public/images/pages/blog/building-a-cli-client-for-model-context-protocol-servers/building-a-cli-client-for-model-context-protocol-servers-1024x576-1e7b300c.jpg)

The Model Context Protocol (MCP) keeps gaining traction in the AI space, and since the launch of the [Neon MCP Server](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here) (~2 weeks ago), the community has built dozens of these servers across a [wide spectrum of domains](https://github.com/modelcontextprotocol/servers/#-third-party-servers). However, the Claude Desktop app has established itself as the default MCP Client, with most servers having exclusive instructions on how to integrate it with this client.

But MCP is not coupled to Claude Desktop and it can be used with any other LLM client that supports it. With that in mind, we’ve decided to build an MCP CLI client that demonstrates this. This MCP client can be used to test MCP servers much more quickly as well.

## How to build an MCP client

All MCP Clients are built with the same core principles and follow the same protocol. For tool usage (our use case), these are the main concepts that need to be implemented:

- **MCP Server Connection**: The first step is to connect to the MCP Server, so that it can discover and use the tools available on the server.

```typescript
const mcpClient = new Client(
  { name: 'cli-client', version: '1.0.0' },
  { capabilities: {} },
);

// This function will connect the MCP Client to the MCP Server
await mcpClient.connect(new StdioClientTransport(serverConfig));
```

- **Tool Listing**: We need to fetch the available tools from the MCP Server. This allows the LLM to know which tools it can use during our interaction

```typescript
// This function will return a list of tools available on the MCP Server
const toolsAvailable = await this.mcpClient.request(
  { method: 'tools/list' },
  ListToolsResultSchema,
);
```

- **Tool Usage**: Once the LLM has decided which tool to use, we need to call its handler on the MCP Server.

```typescript
// This function will call the tool handler on the MCP Server
const toolResult = await this.mcpClient.request(
  {
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: toolArgs,
    },
  },
  CallToolResultSchema,
);
```

- **LLM Integration**: this is a multi-step process that connects the LLM to the available tools:

1. Send the initial prompt to the LLM
2. Wait for the LLM to respond with a tool use
3. Call the tool handler on the MCP Server
4. Inject the tool result into the LLM’s context
5. Send the next prompt to the LLM

And since we are using the [Tools API](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) from the Anthropic API, it’s way simpler if we just rely on their [official SDK](https://github.com/anthropics/anthropic-sdk-typescript).

```typescript
// 1- send the initial prompt
const response = await this.anthropicClient.messages.create({
  messages: [
    {
      role: 'user',
      content: 'Can you list my Neon projects?',
    },
  ],
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 8192,
  tools: this.tools,
});

for (const content of response.content) {
	// 2- Wait for the LLM to respond with a tool use
  if (content.type === 'tool_use') {
    const toolName = content.name;
    const toolArgs = content.input;
    // 3- Call the tool handler on the MCP Server
    const toolResult = await this.mcpClient.request(
      {
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: toolArgs,
        },
      },
      CallToolResultSchema,
    );
    
    // 4- inject the tool result into the LLM's context
    const contextWithToolResult = [
        ...previousMessages,
        { role: 'user', content: toolResult.content },
     ];

		// 5- Send the next prompt to the LLM
    const nextResponse = await this.anthropicClient.messages.create({
      messages: contextWithToolResult,
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
    });
  }
}
```

## Building the CLI Client

Once we have all the core pieces in place, all we need to do is to build a cool CLI client that can be used to interact with the MCP Server.

1. **LLM handling** – Handle the LLM messages and tools usage

It’s important that we persist the messages between each interaction, so that we can inject the tool result into the LLM’s context.

```typescript
private async processQuery(query: string) {
  try {
    // 1 - Send the user's query to the LLM
    this.messages.push({ role: 'user', content: query });
    const response = await this.anthropicClient.messages.create({
      messages: this.messages,
      model: 'claude-3-5-sonnet-20241022',
      tools: this.tools,
    });

    // 2 - Handle the LLM response
    for (const content of response.content) {
      if (content.type === 'text') {
        process.stdout.write(content.text);
      }

      // 3 - Handle the tool use
      if (content.type === 'tool_use') {
        const toolResult = await this.mcpClient.request({
          method: 'tools/call',
          params: {
            name: content.name,
            arguments: content.input,
          }
        });

        // 4 - Add the tool result to the conversation
        this.messages.push({
          role: 'user',
          content: JSON.stringify(toolResult)
        });

        // 5 - Get Claude's response to the tool result
        const nextResponse = await this.anthropicClient.messages.create({
          messages: this.messages,
          model: 'claude-3-5-sonnet-20241022'
        });

        // 6 - Display Claude's response
        if (nextResponse.content [0].type === 'text') {
          process.stdout.write(nextResponse.content [0].text);
        }
      }
    }
  } catch (error) {
    console.error('Error during query processing:', error);
  }
}
```

2\. **Chat Loop** – Create a chat loop that will be used to send messages to the LLM and handle the response.

```typescript
private async chat_loop() {
    while (true) {
      try {
        const query = (await this.rl.question(styles.prompt)).trim();
        // process the query
        await this.processQuery(query);
      } catch (error) {
        console.error(styles.error('\\\\nError:'), error);
      }
    }
}
```

3\. **Entry Point –** Setup a main entry point for the client that will initialize the MCP Client, fetch the tools and start the chat loop

```typescript
  // This is the main entry point for the client
  async start() {
    try {
      console.log(styles.info('🤖 Interactive Claude CLI'));
      console.log(
        styles.info(`Type your queries or "${EXIT_COMMAND}" to exit`),
      );

      // 1 - Connect the MCP Client to the MCP Server
      await this.mcpClient.connect(this.transport);

      // 2 - Fetch the tools available on the MCP Server
      await this.initMCPTools();

      // 3 - Start the chat loop
      await this.chat_loop();
    } catch (error) {
      console.error(styles.error('Failed to initialize tools:'), error);
      process.exit(1);
    } finally {
      this.rl.close();
      process.exit(0);
    }
  }
```

4\. **Run –** Start the client

Now that we have built an all-purpose MCP Client, we can run it by passing the MCP Server URL and whatever other arguments it needs.

```typescript
const cli = new InteractiveCLI({
  command: '../dist/index.js',
  args: ['start', process.env.NEON_API_KEY!],
});
cli.start();
```

### Improvements

There are 2 main caveats with this simple implementation:

- **Streaming**: This client doesn’t support streaming, so the responses may seem a bit slower from a user perspective.
- **Multiple Tool Calls**: This client doesn’t follow up on multiple tool calls, it will always stop after the first tool call.

Luckily, both of these issues have been solved in the [MCP Client CLI](https://github.com/neondatabase/mcp-server-neon/tree/main/mcp-client) that we built at Neon.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-cli-client-for-model-context-protocol-servers/ad4nxcswahsks5tljrl3rrv42qdku20znqw9wnoorsrpp1axeojfwziqafnnk2ui3iyubnbpqalpcjlauh80z9i6u0iirhutjeaeibvcjlwtoeqsabovz3ajo7cu6vdvmon60adrashg-e8c09142.gif)

## Try it

Use this tool with any MCP Server to see how it works or use it as a base to build your own MCP Client. You can check out our GitHub [repository](https://github.com/neondatabase/mcp-server-neon/tree/main/mcp-client), and give us any feedback on [our Discord server](https://neon.tech/discord)!

---

_Neon is a serverless Postgres platform that helps teams ships faster via instant provisioning, autoscaling, and database branching. We have a Free Plan – you can [get started](https://console.neon.tech/signup) without a credit card._
