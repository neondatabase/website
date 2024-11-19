---
title: TypeScript SDK for the Neon API
enableTableOfContents: true
updatedOn: '2024-10-26T08:44:49.116Z'
---

<InfoBlock>

<DocsList title="What you will learn:">
<p>What is the Neon TypeScript SDK</p>
<p>How to get started</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="https://neon.tech/docs/reference/api-reference">Neon API Reference</a>
</DocsList>

<DocsList title="Source code" theme="repo">
  <a href="https://www.npmjs.com/package/@neondatabase/api-client">@neondatabase/api-client</a>
</DocsList>

</InfoBlock>

## About the SDK

Neon supports the [@neondatabase/api-client](https://www.npmjs.com/package/@neondatabase/api-client) library, which is a wrapper for the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). This SDK simplifies integration of TypeScript applications with the Neon platform, providing methods to programmatically manage API keys, Neon projects, branches, databases, endpoints, roles, and operations.

## Installation

You can install the library using `npm` or `yarn`.

`npm`:

```bash
npm install @neondatabase/api-client
```

`yarn`:

```bash
yarn add @neondatabase/api-client
```

## Get Started

To get started with the `@neondatabase/api-client` library, follow these steps:

1. Obtain an API key from the [Account settings](https://console.neon.tech/app/settings/api-keys) page in the Neon Console.

2. Click **Generate new API key**.

3. Enter a name for your API key and click **Create**.

4. Save your API key to a secure location that enables you to pass it to your code.

5. Import the library:

   ```typescript
   import { createApiClient } from '@neondatabase/api-client';
   ```

6. Create an instance of the API client by calling the `createApiClient` function:

   ```typescript
   const apiClient = createApiClient({
     apiKey: 'your-api-key',
   });
   ```

7. Use the `apiClient` instance to make API calls. For example:

   ```typescript
   const response = await apiClient.listProjects({});
   console.log(response);
   ```
