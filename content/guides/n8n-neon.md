---
title: Build an AI-powered knowledge base chatbot using n8n and Neon Postgres
subtitle: A step-by-step guide to creating an AI-powered knowledge base chatbot using n8n, Google Drive, and Neon Postgres
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-05-27T00:00:00.000Z'
updatedOn: '2025-05-27T00:00:00.000Z'
---

This guide demonstrates how to build a powerful **AI-powered internal knowledge base chatbot** using **n8n** and **Neon**. n8n is a low-code platform that allows you to connect various applications and services, enabling you to automate complex processes through a visual workflow editor. In this guide, we'll use n8n to orchestrate the integration between **Google Drive**, **Neon Postgres**, and **Google Gemini** to create a chatbot that can answer questions based on your documents stored in Google Drive. Neon will be used as a vector store to index and retrieve document chunks, while Google Drive will serve as the source of your documents.

It will be built using a **Retrieval-Augmented Generation (RAG)** approach, which combines the power of large language models (LLMs) with your own documents. This allows the chatbot to access and utilize your documents as a knowledge base, enabling it to answer questions accurately and contextually.

## Prerequisites

Before you begin, ensure you have the following:

- **n8n Instance:** A running n8n instance. This can be a [self-hosted](https://docs.n8n.io/hosting/) version or an [n8n cloud account](https://app.n8n.cloud).
- **Google Account:** A Google account with access to Google Drive.
- **Neon Account and Project:** A Neon account and a project are needed to create a Postgres database. You can sign up for a free account at [pg.new](https://pg.new).
- **Google Cloud Platform (GCP) Account:** A [GCP account](https://cloud.google.com/free) is needed to enable the Google Drive API and to manage OAuth credentials. Free tier accounts are sufficient for this guide.
- **Google Gemini API key:** You'll need an API key for Google Gemini to generate embeddings and power the chat model. You can obtain this from [Google AI Studio](https://aistudio.google.com/apikey).
  ![Google Gemini API Key](/docs/guides/gemini-api-key.png)

## Architecture overview

The solution consists of two main n8n workflows:

1.  **Indexing workflow:** This workflow is triggered when a new file is added to a specified Google Drive folder. It downloads the file, splits it into manageable chunks, generates vector embeddings for each chunk using Google Gemini, and then stores these chunks and their embeddings in a Neon Postgres database (acting as a PGVector store).
2.  **Chat workflow:** This workflow provides a chat interface. When a user sends a message (a question), the AI Agent retrieves relevant document chunks from the Neon Postgres vector store based on the query's semantic similarity. These retrieved chunks are then passed as context to a Google Gemini chat model, which generates a response.

## Workflow 1: Indexing Google Drive documents into Neon Postgres

This workflow automates the process of ingesting and preparing your Google Drive documents for the chatbot.

![Workflow 1 Overview](/docs/guides/n8n/n8n-workflow-1-overview.png)

### Step 1: Setting up the Google Drive trigger

1.  **Create a new workflow:** In your n8n dashboard, create a new workflow.
2.  **Add Google Drive trigger:** Click the `+` button to add the first step. Search for and select "Google Drive".
3.  **Configure trigger:** In the Google Drive node parameters, select "On changes involving a specific folder" under "Triggers".
4.  **Connect Google Drive account (OAuth2):**
    - Under "Credential to connect with", click "Select Credential" and then "Create new credential".
    - This will open a dialog for "Google Drive account (Google Drive OAuth2 API)". Note the "OAuth Redirect URL" provided by n8n (you will need this in the next steps).

    ![Configuring Google Drive Trigger node](/docs/guides/n8n/n8n-add-google-drive-folder-node.gif)

5.  **Create Google Drive OAuth credentials:**
    - Open the [Google Cloud console](https://console.cloud.google.com/) and navigate to "APIs & Services" -> "OAuth consent screen".
    - If not configured, click "Get started".
    - **App Information:** Provide an "App name" (e.g., `personal-n8n`), select "User support email", and enter your email address.
    - **Audience:** Select "External". Click "Next".
    - **Contact Information:** Confirm your email. Click "Next".
    - **Finish:** Review and click "Create".
    - Now, navigate to "APIs & Services" -> "Clients". Click "Create OAuth client" and select "OAuth client ID".
    - Select "Web application" as the "Application type".
    - Under "Authorized redirect URIs", paste the "OAuth Redirect URL" which you copied from n8n (e.g., `https://your-n8n-instance.com/rest/oauth2-credential/callback`). Click "Create".
    - You will be redirected to a page showing your OAuth 2.0 Client IDs. Select the one you just created. Copy the "Client ID" and "Client secret" values from this page, you will need them in n8n.
    - Navigate to "Audience" Page. Click "+ Add users" and add the Google account email you intend to use for authorizing n8n.

    ![Configuring Google Drive OAuth credentials in GCP](/docs/guides/n8n/n8n-configure-gdrive-oauth.gif)

6.  **Enable Google Drive API in GCP:**
    - In the GCP console, search for "Google Drive API".
    - Select "Google Drive API" and click "Enable" if it's not already enabled.

    ![Enabling Google Drive API in GCP](/docs/guides/n8n/n8n-enable-gdrive-api.gif)

7.  **Finalize n8n Credential:**
    - Back in n8n, paste the "Client ID" and "Client secret" you copied from GCP into the respective fields in the "Google Drive account (OAuth2)" credential dialog.
    - After entering the Client ID and Secret, click "Sign in with Google".
    - Authenticate with the Google account you added as a test user. Grant the necessary permissions.
    - You should see "Account connected". Click "Save" and close the dialog.

    ![Finalizing Google Drive OAuth credential in n8n](/docs/guides/n8n/n8n-finalize-gdrive-oauth.gif)

8.  **Configure folder and watch settings:**
    - Back in the Google Drive Trigger node, set the "Folder" to the specific folder you want to monitor for new files. You can enter the folder name or select from the list.
    - Select "File Created" under "Watch For". This will trigger the workflow when a new file is added to the specified folder.
9.  **Test the Trigger:**
    - Upload a sample PDF document to your specified Google Drive folder.
    - In n8n, click "Fetch Test Event" on the Google Drive Trigger node. It should detect the new file and show its details in the output on the right side of the editor. This confirms that the trigger is working correctly.

    ![Testing the Google Drive Trigger in n8n](/docs/guides/n8n/n8n-test-gdrive-trigger.gif)

### Step 2: Downloading the File content

1.  **Add Google Drive Node (Action):** Click the `+` after the trigger node. Search for and select "Google Drive".
2.  Select "Download File" as the operation.
3.  Under **Credential to connect with** select your previously created Google Drive account.
4.  Under **Resource:** select "File".
5.  Under **Operation:** select "Download".
6.  Select **File > By ID**. Drag the "File ID" from the Google Drive Trigger node to this field. This ensures the node downloads the file that triggered the workflow. Check the image below for reference.
7.  Select **Options > Add option > File Name.** Similarly, drag the "File Name" from the Google Drive Trigger node to this field. This will help in identifying the file later.
    ![Configuring Google Drive Download node](/docs/guides/n8n/n8n-google-drive-download-node.gif)

### Step 3: Setting up the Neon Postgres PGVector store Node

This node will store the document chunks and their embeddings in Neon Postgres using the [`pgvector` extension](/docs/extensions/pgvector).

1.  **Add Postgres PGVector Store Node:** Click the `+` after the Google Drive download node. Search for "Postgres PGVector Store" and add it.
2.  Under **Actions** select "Add documents to vector store".
3.  A dialog will appear prompting you to either select an existing credential or create a new one. Click "Create new credential".

    <Admonition type="tip">
    You can get your Neon database connection details from the Neon console. Learn more: [Connect from any application](/docs/connect/connect-from-any-app)
    </Admonition>

4.  Fill in your Neon database details:
    - **Host:** Your Neon host
    - **Database:** Your Neon database name
    - **User:** Your Neon database user
    - **Password:** Your Neon database password
    - **SSL:** Set to "Require".
5.  Click "Save".
6.  Configure the Postgres PGVector Store node parameters:
    - **Operation Mode:** Select "Insert Documents".
    - **Table Name:** Enter a name for your table (e.g., `n8n_vectors`). The table will be created automatically by n8n.
    - **Embedding Batch Size:** (e.g., 200, default)

![Configuring Postgres PGVector Store node](/docs/guides/n8n/n8n-pgvector-store-node.gif)

### Step 4: Chunking and processing the documents

The PGVector Store node has inputs for "Document" and "Embeddings". We will add nodes to handle the document loading and text splitting before generating embeddings.

1. Click on the "Document" input anchor of the Postgres PGVector Store node.
2. Search for and select "Default Data Loader" with the following parameters:
   - **Type of Data:** Select "Binary".
   - **Mode:** Select "Load All Input Data".
   - **Data Format:** Select "Automatically Detect by Mime Type".
   - **Options > Metadata > Add property:**
     - **Name:** `file_name`
     - **Value (Expression):** Drag the "File Name" from the Google Drive Download node to this field. This will help in identifying the file later.
3. **Add Recursive character text splitter Node:**
   - Click on the "Text Splitter" input anchor of the Default Data Loader node.
   - Search for and select "Recursive Character Text Splitter".
   - Set the **Chunk Size** to `1000` (default, or adjust as needed).
   - Set the **Chunk Overlap** to `100` (or adjust as needed, depending on how much context you want to retain between chunks).

![Configuring Data Loader and Text Splitter nodes](/docs/guides/n8n/n8n-data-loader-text-splitter-nodes.gif)

### Step 5: Generating Embeddings

1. Click on the "Embeddings" input anchor of the Postgres PGVector Store node.
2. Search for and select "Embeddings Google Gemini".
3. **Configure Gemini credentials:**
   - **Credential to connect with:** Click "Create new credential". A dialog will open prompting you to enter your Google Gemini API key.
   - Paste your Google Gemini API Key obtained from Google AI Studio in the [Prerequisites](#prerequisites) section.
   - Click "Save". It should show "Connection tested successfully".
4. Choose an embedding model. In this guide, `models/text-embedding-004` is used. You can select a different embedding model based on your requirements.

<Admonition type="important" title="Model Dimensionality">
Each embedding model produces vectors of a specific dimensionality. Ensure the model selected here is consistent with the model you'll use for retrieval in the chat workflow in the next section. For example, if you use `models/text-embedding-004` here, you should also use the same model in the chat workflow for retrieval.
</Admonition>

![Configuring Embeddings Google Gemini node](/docs/guides/n8n/n8n-embeddings-gemini-node.gif)

### Step 6: Testing the Indexing workflow

Click on the play icon (▶️) on the "Postgres PGVector Store" node to execute the workflow. This assumes you have already ran the Google Drive trigger and download file nodes successfully. You can also click the "Test workflow" button at the bottom of the n8n editor to run the entire workflow.

![Testing the indexing workflow in n8n](/docs/guides/n8n/n8n-test-indexing-workflow.gif)

The workflow should execute successfully, which will split the document into chunks, generate embeddings for each chunk, and store them in Neon Postgres database.

### Step 7: Verifying the embeddings in Neon (optional)

1. Log in to your Neon console.
2. Navigate to your database and then to the "Tables" section.
3. You should see the `n8n_vectors` (or your chosen name) table created, populated with document chunks and their embedding vectors.

![Verifying data in Neon Console](/docs/guides/n8n/n8n-verify-data-in-neon-console.png)

<Admonition type="important" title="Save your workflow">
Make sure to save your workflow by clicking the "Save" button in the top right corner of the n8n editor. This ensures that all your configurations are stored and can be reused later.
</Admonition>

## Workflow 2: Chat Trigger with AI Agent and Retrieval

This workflow will provide the user interface to interact with your AI knowledge base.

![Workflow 2 Overview](/docs/guides/n8n/n8n-workflow-2-overview.png)

### Step 1: Setting up the Chat Trigger and AI Agent

1. You can create a new n8n workflow or continue in the same Workflow 1. In this guide, we use the same workflow.
2. **Add Chat Trigger:** Click the `+` button. Search for "Chat Trigger" and add it.
3. **Add AI Agent Node:** Click the `+` after the Chat Trigger. Search for "AI Agent" and add it.

![Configuring Chat Trigger and AI Agent nodes](/docs/guides/n8n/n8n-chat-trigger-ai-agent-nodes.gif)

### Step 2: Configuring the Chat model

1. Click on the "Chat Model" input anchor of the AI Agent node.
2. Search for and select "Google Gemini Chat Model".
3. Select your existing "Gemini" API account for the credential.
4. Choose a chat model that suits your needs. In this guide, we use `models/gemini-2.5-flash-preview-05-20`, which is a good balance of performance and cost for most use cases.

![Configuring Google Gemini Chat Model node](/docs/guides/n8n/n8n-gemini-chat-model-node.gif)

### Step 3: Configuring the Tool (Vector Store Retriever)

The AI Agent will use this tool to retrieve information from your Neon vector store.

1. Click on the "Tool" input anchor of the AI Agent node.
2. Search for and select "Postgres PGVector Store".
3. Select your previously created "Neon" credential for the Postgres PGVector Store.
4. Select "Retrieve Documents (As Tool for AI Agent)" as the operation mode.
5. **Name the Tool:** Give it a descriptive name, e.g., `internal_knowledge_base`.
6. **Description:** Provide a description for the AI Agent, e.g., `Docs for Internal Knowledge Base`.
7. **Table Name:** Enter the same table name used in Workflow 1 (e.g., `n8n_vectors` or whatever you named it).
8. **Limit:** Set the maximum number of document chunks to retrieve (e.g., `4`) for the AI Agent to use as context.
9. **Include Metadata:** Toggle this ON to include metadata in the retrieved documents. This can be useful for providing filename or other context in the chat responses.

![Configuring Postgres PGVector Store as Tool for Retrieval](/docs/guides/n8n/n8n-pgvector-store-tool-node-for-retrieval.gif)

### Step 4: Connecting Embeddings for Retrieval

The retrieval process also needs to generate embeddings for the user's query to find similar document chunks from the vector store. This is done using the same embedding model used during indexing.

1. Click on the "Embedding" input anchor of the "Postgres PGVector Store" (Tool) node.
2. Search for and select "Embeddings Google Gemini".
3. Select your "Gemini" API account for the credential which you created in Workflow 1.
4. Select the same embedding model used in Workflow 1 (e.g., `models/text-embedding-004`).

After all these configurations, your Workflow should look like this:

![Workflow 2 after configuration of all nodes](/docs/guides/n8n/n8n-workflow-2-after-configuration.png)

### Step 5: Testing the Chatbot

1.  You can click "Open chat" next to the "Test workflow" button at the bottom of the n8n editor. This will open a chat interface where you can interact with your AI knowledge base chatbot.
2.  **Ask a Question:** Type a question related to the content of the documents you indexed into Google Drive. For example, here we indexed a PDF document about "Neon RLS" and we ask it "What is Neon RLS, explain to me as if I am a 5".

    ![Asking a question in the chat interface](/docs/guides/n8n/n8n-ask-chatbot-question.png)

3.  **Verify Response and Logs:**
    - The chatbot should provide an answer based on the retrieved documents. The answer will be generated by the Google Gemini chat model, using the context provided by the retrieved document chunks.
    - You can inspect the "Latest Logs from AI Agent node" in n8n to see the input, the tool being called (Postgres PGVector Store), and the output from the Gemini Chat Model for debugging or verification purposes.

![Testing the chat workflow in n8n](/docs/guides/n8n/n8n-test-chat-workflow.gif)

### Step 6: Activating the Chat workflow

1. Once you are satisfied with the testing, save your workflow and then toggle the "Active" switch in the n8n navbar to activate the workflow. This will allow it to run automatically when triggered by the Chat Trigger node or Google Drive Trigger node.

   ![Saving and activating the chat workflow in n8n](/docs/guides/n8n/n8n-activate-chat-workflow.png)

2. To get the "Chat URL", click on the "Chat Trigger" node and copy the URL provided in the "Chat URL" field. This URL can be shared with users to access the chatbot interface without needing to log in to n8n.

   ![Getting the Chat URL in n8n](/docs/guides/n8n/n8n-get-chat-url.png)

3. This will allow users to ask questions and receive answers based on the indexed documents in your Google Drive. At any point you can add more documents to the Google Drive folder you specified in the Google Drive Trigger node, and the indexing workflow will automatically process them, updating the knowledge base (vector store on Neon) and making them available for the retrieval in the chat workflow.

4. For example here we add a new PDF document about "Neon Auth" to the Google Drive folder. The indexing workflow will automatically pick it up, process it, and update the knowledge base.

   ![Adding a new document to Google Drive](/docs/guides/n8n/n8n-add-new-document-to-gdrive.png)

   We then ask the chatbot about "Neon Auth" and it provides an answer based on the newly indexed document.

   ![Asking the chatbot about the newly indexed document](/docs/guides/n8n/n8n-ask-chatbot-about-new-document.png)

5. You can also embed the chatbot on a webpage using the "Embedded Chat" option in the Chat Trigger node if desired.

## How it works: A Brief recap

1.  **Indexing:** New files in a designated Google Drive folder trigger an n8n workflow. The files are downloaded, broken into smaller text chunks, and each chunk is converted into a numerical representation (embedding) by Google Gemini. These embeddings, along with the text chunks and metadata (like the filename), are stored in your Neon Postgres database, which uses the pgvector extension to handle these vector embeddings.
2.  **Retrieval & Generation (RAG):** When you ask a question in the chat interface, your query is also converted into an embedding. The n8n AI Agent uses this query embedding to search the Neon Postgres vector store for the text chunks whose embeddings are most similar to your query's embedding. These relevant chunks are retrieved and provided as context to the Google Gemini chat model. The chat model then generates a human-like answer based on your question and the provided context from your documents.

This entire process ensures that the chatbot's answers are grounded in the information contained within your Google Drive documents.

## Debugging tips

You can debug individual n8n nodes by clicking on the node and checking the **Output** tab on the right side of the editor. This displays the data flowing through each node, helping you pinpoint workflow issues.

For instance, the image below shows the output of a **AI Agent** node after a question is asked:

    ![Debugging Chat Trigger Node Output](/docs/guides/n8n/n8n-chat-trigger-node-output.png)

Here, you can see the input message, the AI Agent's response, and the tool (**Postgres PGVector Store**) used to retrieve relevant document chunks. The document chunks retrieved from the Neon Postgres vector store are also visible. This insight helps you understand how the chatbot generates its responses based on the indexed documents.

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Neon Documentation](/docs)
- [`pgvector` extension documentation](/docs/extensions/pgvector)
- [Build a RAG chatbot with Astro, Postgres, and LlamaIndex](/guides/chatbot-astro-postgres-llamaindex)
- [RAG Chatbot (OpenAI + LangChain)](/templates/rag-chatbot-langchain)

<NeedHelp/>
