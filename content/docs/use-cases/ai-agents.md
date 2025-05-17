---
title: Neon for AI Agents
subtitle: Use Neon as the Postgres backend for your agents
enableTableOfContents: true
updatedOn: '2025-03-07T21:44:32.257Z'
---
### 🧩 **Visão Geral da Afiliabet**

A **Afiliabet** nasce como a primeira plataforma brasileira de educação especializada no setor de iGaming, com foco em dois grandes públicos:

1. **Apostadores/Traders Esportivos Estratégicos**
    
2. **Afiliados Profissionais para Casas de Apostas**
    

A proposta central é educar, capacitar e conectar esses públicos à prática real de mercado, através de:

- **Conteúdo prático** de alta qualidade (vídeo-aulas, planilhas, quizzes).
    
- **Mentorias especializadas** com profissionais experientes.
    
- **Comunidade ativa e engajada**, modelo VIP.
    
- **Parceria com uma casa de apostas própria**, servindo como “laboratório”.
    
- **Expansão B2B** com fornecimento de leads qualificados para operadores de apostas.
    

---
```text shouldWrap
### 🧱 **Diferenciais Estratégicos**
```
|Diferencial|Descrição|
|---|---|
|🎯 Foco em Prática|Ensino voltado para aplicação imediata, com simulações e estudos de caso.|
|🧠 Especialistas do Setor|Instrutores e mentores atuantes no mercado de iGaming.|
|🔁 Ecossistema Integrado|Plataforma + mentoria + serviços + operadora + certificação.|
|🧾 Conformidade Legal|Formação 100% alinhada com a Lei 14.790/2023 e boas práticas de publicidade e jogo responsável.|
|🤝 Conexão com o Mercado|Parcerias com operadores, eventos e empresas de tecnologia do setor.|

---

### 🗺️ **Estrutura Faseada do Lançamento**

A estratégia será dividida em **3 fases principais**:
<Admonition type="info">
1. **Fase 1 – MVP Educacional**  
    Criação da base da plataforma (conteúdo, LMS, comunidade).
    
2. **Fase 2 – Serviços de Valor Agregado**  
    Introdução de mentorias, eventos e consultorias para afiliados.
    
3. **Fase 3 – B2B e Casa de Apostas Parceira**  
    Lançamento da casa própria, geração de leads, estruturação de agência.

</Admonition>

AI agents can now provision infrastructure, including databases. With AI agents already creating databases every few seconds, they are poised to manage a significant portion of the web's infrastructure in the future — and, like developers, AI agents love working with Neon: **Replit partnered with Neon to back Replit Agents, which are already creating thousands of Postgres databases per day**. [Learn more](https://neon.tech/blog/looking-at-how-replit-agent-handles-databases).

## What makes Neon a good database for AI Agents

- **One-second provision times**. AI Agents generate code in seconds, so it's a bad user experience to wait minutes for a new Postgres instance to be deployed. Neon provisions databases nearly instantaneously, eliminating this friction.

- **Scale to zero makes empty databases economically feasible**. Some databases created by agents might only be used for a few minutes; if you’re the company behind the agent, you’ll quickly have a large database fleet full of inactive databases. With Neon, that’s not a problem—you can still maintain this fleet within a reasonable budget.

- **Straightforward API that even an AI Agent can use**. The same API endpoints that are useful for [developers managing large database fleets on Neon](/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) are also perfect for AI Agents. With the Neon API, you can not only create and delete databases but also track usage, limit resources, and handle configuration.

- **Neon is 100% Postgres**. The most-loved database by developers worldwide is also the best choice for AI agents, thanks to its versatility (it works for almost any app) and the vast amount of resources, examples, and training datasets available.

## Tools for AI Agents

We recently published a package on NPM called <a href="https://github.com/crialabs/toolkit" target="_blank" rel="noopener noreferrer">@neondatabase/toolkit</a>, merging the already existing packages into a single SDK that is easier for AI agents to consume. <a href="/blog/why-neondatabase-toolkit">Read more</a>.

With a few lines of code, AI agents can use the **Neon toolkit** to create a Postgres database on Neon, run SQL queries, and tear down the database. Here's a quick look:

```javascript
import { NeonToolkit } from "@neondatabase/toolkit";

const toolkit = new NeonToolkit(process.env.NEON_API_KEY!);
const project = await toolkit.createProject();

await toolkit.sql(
  project,
  `
    CREATE TABLE IF NOT EXISTS
      users (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );
  `,
);
await toolkit.sql(
  project,
  `INSERT INTO users (id, name) VALUES (gen_random_uuid(), 'Sam Smith')`,
);

console.log(await toolkit.sql(project, `SELECT name FROM users`));

await toolkit.deleteProject(project);
```

Neon also supports a [Model Context Protocol (MCP) server](https://github.com/crialabs/mcp-server-neon) that lets you use any MCP Client, such as Cursor or Claude Desktop, to manage Postgres databases with Neon using natural language; for example:

- `Create a new Postgres database, and call it "my-database". Let's then create a table called users with the following columns: id, name, email, and password.`
- `I want to run a migration on my project called "my-project" that alters the users table to add a new column called "created_at".`
- `Can you give me a summary of all of my Neon projects and what data is in each one?`

Both tools are open source. You can find them on GitHub.
### 🧩 **Visão Geral da Afiliabet**

A **Afiliabet** nasce como a primeira plataforma brasileira de educação especializada no setor de iGaming, com foco em dois grandes públicos:

1. **Apostadores/Traders Esportivos Estratégicos**
    
2. **Afiliados Profissionais para Casas de Apostas**
    

A proposta central é educar, capacitar e conectar esses públicos à prática real de mercado, através de:

- **Conteúdo prático** de alta qualidade (vídeo-aulas, planilhas, quizzes).
    
- **Mentorias especializadas** com profissionais experientes.
    
- **Comunidade ativa e engajada**, modelo VIP.
    
- **Parceria com uma casa de apostas própria**, servindo como “laboratório”.
    
- **Expansão B2B** com fornecimento de leads qualificados para operadores de apostas.
    

---
```text shouldWrap
### 🧱 **Diferenciais Estratégicos**
```
|Diferencial|Descrição|
|---|---|
|🎯 Foco em Prática|Ensino voltado para aplicação imediata, com simulações e estudos de caso.|
|🧠 Especialistas do Setor|Instrutores e mentores atuantes no mercado de iGaming.|
|🔁 Ecossistema Integrado|Plataforma + mentoria + serviços + operadora + certificação.|
|🧾 Conformidade Legal|Formação 100% alinhada com a Lei 14.790/2023 e boas práticas de publicidade e jogo responsável.|
|🤝 Conexão com o Mercado|Parcerias com operadores, eventos e empresas de tecnologia do setor.|

---

### 🗺️ **Estrutura Faseada do Lançamento**

A estratégia será dividida em **3 fases principais**:
<Admonition type="info">
1. **Fase 1 – MVP Educacional**  
    Criação da base da plataforma (conteúdo, LMS, comunidade).
    
2. **Fase 2 – Serviços de Valor Agregado**  
    Introdução de mentorias, eventos e consultorias para afiliados.
    
3. **Fase 3 – B2B e Casa de Apostas Parceira**  
    Lançamento da casa própria, geração de leads, estruturação de agência.

</Admonition>
<DetailIconCards>

<a href="https://github.com/crialabs/toolkit" description="A terse client that lets you spin up a Postgres database in seconds and run SQL queries" icon="github">@neondatabase/toolkit</a>

<a href="/docs/ai/neon-mcp-server" description="A Model Context Protocol (MCP) server for Neon that lets MCP Clients interact with Neon’s API using natural language" icon="openai">Neon MCP Server</a>

</DetailIconCards>
